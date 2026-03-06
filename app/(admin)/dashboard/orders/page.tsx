import { prisma } from '@/lib/prisma'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const STATUS_FLOW = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED']

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PREPARING: 'bg-orange-100 text-orange-800',
  READY: 'bg-green-100 text-green-800',
  DELIVERED: 'bg-gray-100 text-gray-800',
  CANCELLED: 'bg-red-100 text-red-800',
}

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: { orderItems: { include: { menuItem: true } } },
  })

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-serif font-bold text-jp-black mb-8">Orders</h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 text-left">Order</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Items</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Time</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-12 text-gray-500">No orders yet</td></tr>
            ) : (
              orders.map((order: any) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-sm">{order.orderNumber}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold">{order.customerName}</p>
                    <p className="text-xs text-gray-500">{order.customerPhone}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded ${order.type === 'DELIVERY' ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-700'}`}>
                      {order.type === 'DELIVERY' ? '🚗 Delivery' : '🏃 Pickup'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    {order.orderItems.slice(0, 2).map((oi: any) => (
                      <div key={oi.id}>{oi.menuItem.name} x{oi.quantity}</div>
                    ))}
                    {order.orderItems.length > 2 && <div className="text-gray-400">+{order.orderItems.length - 2} more</div>}
                  </td>
                  <td className="px-4 py-3 font-bold text-jp-red text-sm">{formatCurrency(order.totalCents)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/dashboard/orders/${order.id}`}
                      className="text-xs bg-jp-black text-white px-3 py-1 rounded hover:bg-jp-red transition-colors">
                      Manage
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
