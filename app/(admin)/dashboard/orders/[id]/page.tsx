import { prisma } from '@/lib/prisma'
import { formatCurrency } from '@/lib/utils'
import { notFound } from 'next/navigation'
import OrderStatusUpdater from '@/components/admin/OrderStatusUpdater'

export const dynamic = 'force-dynamic'

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: parseInt(params.id) },
    include: { orderItems: { include: { menuItem: true } } },
  })

  if (!order) notFound()

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <a href="/dashboard/orders" className="text-gray-500 hover:text-jp-black">← Orders</a>
        <h1 className="text-3xl font-serif font-bold text-jp-black">{order.orderNumber}</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Customer Info */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-bold text-jp-black mb-4">Customer</h2>
          <p className="text-sm mb-1"><strong>{order.customerName}</strong></p>
          <p className="text-sm text-gray-600">{order.customerEmail}</p>
          <p className="text-sm text-gray-600">{order.customerPhone}</p>
          {order.type === 'DELIVERY' && (
            <div className="mt-3 p-3 bg-blue-50 rounded text-sm">
              <p className="font-semibold text-blue-800">🚗 Delivery Address</p>
              <p>{order.deliveryAddress}</p>
              <p>{order.deliveryCity} {order.deliveryZip}</p>
            </div>
          )}
          {order.specialInstructions && (
            <div className="mt-3 p-3 bg-yellow-50 rounded text-sm">
              <p className="font-semibold">Notes:</p>
              <p>{order.specialInstructions}</p>
            </div>
          )}
        </div>

        {/* Status Update */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-bold text-jp-black mb-4">Order Status</h2>
          <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="font-bold text-jp-black">Items</h2>
        </div>
        <div className="divide-y">
          {order.orderItems.map((oi: any) => (
            <div key={oi.id} className="flex justify-between items-center px-6 py-4">
              <div>
                <p className="font-semibold">{oi.menuItem.name}</p>
                <p className="text-sm text-gray-500">x{oi.quantity} @ {formatCurrency(oi.unitPriceCents)}</p>
              </div>
              <p className="font-bold">{formatCurrency(oi.unitPriceCents * oi.quantity)}</p>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 bg-gray-50 space-y-1">
          <div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatCurrency(order.subtotalCents)}</span></div>
          {order.deliveryFeeCents > 0 && <div className="flex justify-between text-sm"><span>Delivery</span><span>{formatCurrency(order.deliveryFeeCents)}</span></div>}
          <div className="flex justify-between text-sm"><span>Tax</span><span>{formatCurrency(order.taxCents)}</span></div>
          <div className="flex justify-between font-bold text-lg text-jp-red pt-2 border-t"><span>Total</span><span>{formatCurrency(order.totalCents)}</span></div>
        </div>
      </div>
    </div>
  )
}
