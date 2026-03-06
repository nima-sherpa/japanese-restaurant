import { prisma } from '@/lib/prisma'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PREPARING: 'bg-orange-100 text-orange-800',
  READY: 'bg-green-100 text-green-800',
  COLLECTED: 'bg-gray-100 text-gray-800',
  CANCELLED: 'bg-red-100 text-red-800',
}

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: { orderItems: { include: { menuItem: true } } },
  })

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-serif font-bold text-jp-black mb-6">Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500 text-center py-16">No orders yet</p>
      ) : (
        <>
          {/* Mobile: card layout */}
          <div className="space-y-3 lg:hidden">
            {orders.map((order: any) => (
              <div key={order.id} className="bg-white rounded-xl shadow p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-bold text-sm">{order.orderNumber}</p>
                    <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} · {new Date(order.createdAt).toLocaleDateString('en-GB')}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-sm font-semibold">{order.customerName}</p>
                <p className="text-xs text-gray-500 mb-2">{order.customerPhone}</p>
                <div className="text-xs text-gray-600 mb-3">
                  {order.orderItems.slice(0, 2).map((oi: any) => (
                    <span key={oi.id} className="inline-block bg-gray-100 rounded px-2 py-0.5 mr-1 mb-1">
                      {oi.menuItem.name} ×{oi.quantity}
                    </span>
                  ))}
                  {order.orderItems.length > 2 && <span className="text-gray-400">+{order.orderItems.length - 2} more</span>}
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-jp-red">{formatCurrency(order.totalCents)}</span>
                  <Link href={`/dashboard/orders/${order.id}`}
                    className="text-xs bg-jp-black text-white px-3 py-1.5 rounded hover:bg-jp-red transition-colors">
                    Manage →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: table */}
          <div className="hidden lg:block bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left">Order</th>
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Items</th>
                  <th className="px-4 py-3 text-left">Total</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Time</th>
                  <th className="px-4 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-sm">{order.orderNumber}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-semibold">{order.customerName}</p>
                      <p className="text-xs text-gray-500">{order.customerPhone}</p>
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
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
