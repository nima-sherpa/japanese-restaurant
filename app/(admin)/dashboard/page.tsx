import { prisma } from '@/lib/prisma'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function DashboardPage() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [todayOrders, pendingOrders, todayReservations, totalRevenue] = await Promise.all([
    prisma.order.count({ where: { createdAt: { gte: today } } }),
    prisma.order.count({ where: { status: { in: ['PENDING', 'CONFIRMED', 'PREPARING'] } } }),
    prisma.reservation.count({ where: { reservationDate: { gte: today }, status: 'CONFIRMED' } }),
    prisma.order.aggregate({ _sum: { totalCents: true }, where: { createdAt: { gte: today } } }),
  ])

  const recentOrders = await prisma.order.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: { orderItems: { include: { menuItem: true } } },
  })

  const upcomingReservations = await prisma.reservation.findMany({
    where: { reservationDate: { gte: today }, status: 'CONFIRMED' },
    orderBy: [{ reservationDate: 'asc' }, { timeSlot: 'asc' }],
    take: 10,
  })

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    PREPARING: 'bg-orange-100 text-orange-800',
    READY: 'bg-green-100 text-green-800',
    DELIVERED: 'bg-gray-100 text-gray-800',
    CANCELLED: 'bg-red-100 text-red-800',
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-jp-black">Dashboard</h1>
        <p className="text-gray-500 text-sm">{new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Today's Orders", value: todayOrders, color: 'border-blue-400', icon: '📦' },
          { label: 'Pending / Active', value: pendingOrders, color: 'border-yellow-400', icon: '⏳' },
          { label: "Today's Reservations", value: todayReservations, color: 'border-green-400', icon: '📅' },
          { label: "Today's Revenue", value: formatCurrency(totalRevenue._sum.totalCents || 0), color: 'border-jp-red', icon: '💷' },
        ].map(({ label, value, color, icon }) => (
          <div key={label} className={`bg-white rounded-xl shadow p-5 border-l-4 ${color}`}>
            <p className="text-gray-500 text-sm mb-1">{icon} {label}</p>
            <p className="text-3xl font-bold text-jp-black">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-lg font-bold text-jp-black">Recent Orders</h2>
            <Link href="/dashboard/orders" className="text-jp-red text-sm hover:underline">View all →</Link>
          </div>
          <div className="divide-y">
            {recentOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No orders yet today</p>
            ) : (
              recentOrders.map((order: any) => (
                <Link key={order.id} href={`/dashboard/orders/${order.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
                  <div>
                    <p className="font-semibold text-sm">{order.orderNumber}</p>
                    <p className="text-xs text-gray-500">{order.customerName} · {order.type}</p>
                    <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                    <p className="text-sm font-bold text-jp-red mt-1">{formatCurrency(order.totalCents)}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Reservations */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-lg font-bold text-jp-black">Upcoming Reservations</h2>
            <Link href="/dashboard/reservations" className="text-jp-red text-sm hover:underline">View all →</Link>
          </div>
          <div className="divide-y">
            {upcomingReservations.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No reservations today</p>
            ) : (
              upcomingReservations.map((res: any) => (
                <div key={res.id} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <p className="font-semibold text-sm">{res.guestName}</p>
                    <p className="text-xs text-gray-500">{res.partySize} guests · {res.timeSlot}</p>
                    <p className="text-xs text-gray-400">{new Date(res.reservationDate).toLocaleDateString('en-GB')}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full font-semibold bg-green-100 text-green-800">
                    {res.confirmationCode}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
