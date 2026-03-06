import { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatCurrency } from '@/lib/utils'
import { CheckCircle, Clock } from 'lucide-react'

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  return {
    title: 'Order Confirmation | Japanese Restaurant',
  }
}

export default async function ConfirmationPage({
  params,
}: {
  params: { id: string }
}) {
  const orderId = parseInt(params.id)

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      orderItems: {
        include: {
          menuItem: true,
        },
      },
    },
  })

  if (!order) {
    return (
      <div className="bg-jp-cream min-h-screen py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-gray-600 mb-4">Order not found</p>
          <Link href="/menu" className="text-jp-red font-semibold hover:underline">
            Return to menu →
          </Link>
        </div>
      </div>
    )
  }

  const estimatedTime = new Date(order.createdAt)
  estimatedTime.setMinutes(estimatedTime.getMinutes() + 30) // 30 min estimate

  return (
    <div className="bg-jp-cream min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Banner */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-4xl font-serif font-bold text-jp-black mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for your order. We're preparing it now.
          </p>

          {/* Order Number */}
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <p className="text-sm text-gray-600 mb-1">Order Number</p>
            <p className="text-3xl font-bold text-jp-red">{order.orderNumber}</p>
            <p className="text-sm text-gray-600 mt-4">
              Confirmation has been sent to <strong>{order.customerEmail}</strong>
            </p>
          </div>

          {/* Estimated Time */}
          <div className="flex items-center justify-center gap-2 text-lg mb-6">
            <Clock className="w-5 h-5 text-jp-red" />
            <span>
              Estimated{' '}
              {order.type === 'PICKUP' ? 'Pickup' : 'Delivery'}
              :
            </span>
            <span className="font-semibold">
              {estimatedTime.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-serif font-bold text-jp-black mb-6">
            Order Details
          </h2>

          {/* Items */}
          <div className="space-y-4 mb-6 border-b pb-6">
            {order.orderItems.map(item => (
              <div key={item.id} className="flex justify-between">
                <div>
                  <p className="font-semibold text-jp-black">{item.menuItem.name}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold">
                  {formatCurrency(item.unitPriceCents * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatCurrency(order.subtotalCents)}</span>
            </div>
            {order.type === 'DELIVERY' && (
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span>{formatCurrency(order.deliveryFeeCents)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span>{formatCurrency(order.taxCents)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-jp-red pt-2 border-t">
              <span>Total</span>
              <span>{formatCurrency(order.totalCents)}</span>
            </div>
          </div>

          {/* Delivery/Pickup Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-jp-black mb-2">
              {order.type === 'PICKUP' ? 'Pickup Information' : 'Delivery Address'}
            </h3>
            {order.type === 'PICKUP' ? (
              <p className="text-gray-600">
                Pick up your order at our restaurant. Call{' '}
                <span className="font-semibold">{order.customerPhone}</span> when
                you arrive.
              </p>
            ) : (
              <p className="text-gray-600">
                {order.deliveryAddress}
                <br />
                {order.deliveryCity}, {order.deliveryZip}
              </p>
            )}
          </div>

          {/* Special Instructions */}
          {/* Will be added in next phase */}
        </div>

        {/* Actions */}
        <div className="text-center">
          <Link
            href="/menu"
            className="inline-block bg-jp-red text-jp-cream px-8 py-3 rounded-lg font-semibold hover:opacity-90"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
