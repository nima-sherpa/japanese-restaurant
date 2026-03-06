import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createOrderSchema } from '@/lib/validations/orders'
import { generateOrderNumber } from '@/lib/utils'
import { sendNewOrderNotification, sendOrderConfirmationToCustomer } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request
    const validation = createOrderSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }

    const {
      type,
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress,
      deliveryCity,
      deliveryZip,
      items,
      specialInstructions,
    } = validation.data

    // Validate delivery info
    if (type === 'DELIVERY') {
      if (!deliveryAddress || !deliveryCity || !deliveryZip) {
        return NextResponse.json(
          { error: 'Delivery address required for delivery orders' },
          { status: 400 }
        )
      }
    }

    // Fetch all menu items to verify prices server-side
    const menuItemIds = items.map((item: any) => item.menuItemId)
    const menuItems = await prisma.menuItem.findMany({
      where: { id: { in: menuItemIds } },
    })

    // Verify all items exist and create lookup map
    const menuItemMap = new Map(menuItems.map((item: any) => [item.id, item]))
    for (const item of items) {
      if (!menuItemMap.has(item.menuItemId)) {
        return NextResponse.json(
          { error: 'One or more items not found' },
          { status: 400 }
        )
      }
    }

    // Calculate totals server-side (CRITICAL: never trust client prices)
    let subtotalCents = 0
    for (const item of items) {
      const menuItem = menuItemMap.get(item.menuItemId)!
      subtotalCents += menuItem.priceCents * item.quantity
    }

    // Get settings for delivery fee and tax
    const settings = await prisma.restaurantSettings.findFirst()
    const deliveryFeeCents = type === 'DELIVERY' && settings
      ? settings.deliveryFeeCents
      : 0
    const taxRate = settings?.taxRate ? Number(settings.taxRate) : 0.0875
    const taxCents = Math.round((subtotalCents + deliveryFeeCents) * taxRate)
    const totalCents = subtotalCents + deliveryFeeCents + taxCents

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        status: 'PENDING',
        type,
        customerName,
        customerEmail,
        customerPhone,
        deliveryAddress,
        deliveryCity,
        deliveryZip,
        subtotalCents,
        deliveryFeeCents,
        taxCents,
        totalCents,
        specialInstructions,
        orderItems: {
          create: items.map((item: any) => {
            const menuItem = menuItemMap.get(item.menuItemId)!
            return {
              menuItemId: item.menuItemId,
              quantity: item.quantity,
              unitPriceCents: menuItem.priceCents,
            }
          }),
        },
      },
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
      },
    })

    // Send emails (non-blocking)
    const emailData = {
      orderNumber: order.orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      type,
      items: order.orderItems.map((oi: any) => ({
        name: oi.menuItem.name,
        quantity: oi.quantity,
        unitPriceCents: oi.unitPriceCents,
      })),
      totalCents,
      deliveryAddress,
      deliveryCity,
      specialInstructions,
    }
    Promise.all([
      sendNewOrderNotification(emailData),
      sendOrderConfirmationToCustomer(emailData),
    ]).catch(console.error)

    return NextResponse.json(
      { orderId: order.id, orderNumber: order.orderNumber, totalCents },
      { status: 201 }
    )
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
