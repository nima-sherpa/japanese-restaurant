import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sendOrderReadyNotification } from '@/lib/email'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { status } = await request.json()
  const validStatuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COLLECTED', 'CANCELLED']

  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const order = await prisma.order.update({
    where: { id: parseInt(params.id) },
    data: { status },
  })

  // Notify customer when order is ready for pickup
  if (status === 'READY') {
    sendOrderReadyNotification({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
    }).catch(console.error)
  }

  return NextResponse.json(order)
}
