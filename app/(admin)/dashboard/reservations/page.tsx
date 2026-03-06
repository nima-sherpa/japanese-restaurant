import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ReservationsAdminPage() {
  const reservations = await prisma.reservation.findMany({
    orderBy: [{ reservationDate: 'asc' }, { timeSlot: 'asc' }],
    take: 50,
  })

  const statusColors: Record<string, string> = {
    CONFIRMED: 'bg-green-100 text-green-800',
    COMPLETED: 'bg-gray-100 text-gray-800',
    CANCELLED: 'bg-red-100 text-red-800',
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-serif font-bold text-jp-black mb-8">Reservations</h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 text-left">Code</th>
              <th className="px-4 py-3 text-left">Guest</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Time</th>
              <th className="px-4 py-3 text-left">Guests</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {reservations.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-12 text-gray-500">No reservations yet</td></tr>
            ) : (
              reservations.map((res: any) => (
                <tr key={res.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-bold text-jp-red text-sm">{res.confirmationCode}</td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-sm">{res.guestName}</p>
                    <p className="text-xs text-gray-500">{res.guestEmail}</p>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(res.reservationDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3 font-semibold text-sm">{res.timeSlot}</td>
                  <td className="px-4 py-3 text-sm text-center">{res.partySize}</td>
                  <td className="px-4 py-3 text-sm">{res.guestPhone}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusColors[res.status]}`}>
                      {res.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 max-w-xs truncate">
                    {res.specialRequests || '—'}
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
