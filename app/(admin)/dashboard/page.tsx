import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard | Admin',
}

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* KPI Cards will be added here */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-semibold">Today's Orders</h3>
          <p className="text-4xl font-bold mt-2">0</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-semibold">Revenue</h3>
          <p className="text-4xl font-bold mt-2">$0</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-semibold">Pending Orders</h3>
          <p className="text-4xl font-bold mt-2">0</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-semibold">Reservations</h3>
          <p className="text-4xl font-bold mt-2">0</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders Table will be added here */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
          <p className="text-gray-500">No orders yet</p>
        </div>

        {/* Reservations will be added here */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Upcoming Reservations</h2>
          <p className="text-gray-500">No reservations yet</p>
        </div>
      </div>
    </div>
  )
}
