import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { CheckCircle, Calendar, Clock, Users } from 'lucide-react'

export default async function ReservationConfirmationPage({ params }: { params: { id: string } }) {
  const reservation = await prisma.reservation.findUnique({
    where: { id: parseInt(params.id) },
  }).catch(() => null)

  if (!reservation) {
    return (
      <div className="min-h-screen bg-jp-cream flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Reservation not found</p>
          <Link href="/reservations" className="text-jp-red font-semibold hover:underline">Book again →</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-jp-cream py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-jp-black py-10 px-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h1 className="text-3xl font-serif font-bold text-jp-cream mb-2">Reservation Confirmed!</h1>
            <p className="text-gray-400">We look forward to seeing you</p>
          </div>

          {/* Confirmation Code */}
          <div className="px-8 py-6 bg-jp-cream text-center border-b">
            <p className="text-sm text-gray-600 mb-1">Confirmation Code</p>
            <p className="text-4xl font-bold text-jp-red tracking-widest">{reservation.confirmationCode}</p>
            <p className="text-sm text-gray-500 mt-2">Save this code for your records</p>
          </div>

          {/* Details */}
          <div className="px-8 py-6 space-y-4">
            <div className="flex items-center gap-4">
              <Calendar className="w-5 h-5 text-jp-red flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-semibold">
                  {new Date(reservation.reservationDate).toLocaleDateString('en-US', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Clock className="w-5 h-5 text-jp-red flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="font-semibold">{reservation.timeSlot}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Users className="w-5 h-5 text-jp-red flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Party Size</p>
                <p className="font-semibold">{reservation.partySize} {reservation.partySize === 1 ? 'guest' : 'guests'}</p>
              </div>
            </div>

            {reservation.specialRequests && (
              <div className="bg-gray-50 rounded-lg p-4 mt-4">
                <p className="text-sm text-gray-500 mb-1">Special Requests</p>
                <p className="text-sm">{reservation.specialRequests}</p>
              </div>
            )}
          </div>

          <div className="px-8 pb-8">
            <p className="text-sm text-gray-500 text-center mb-6">
              A confirmation email has been sent to <strong>{reservation.guestEmail}</strong>
            </p>
            <div className="flex gap-3">
              <Link href="/" className="flex-1 border-2 border-jp-black text-jp-black py-3 rounded-lg font-semibold text-center hover:bg-gray-50">
                Back to Home
              </Link>
              <Link href="/menu" className="flex-1 bg-jp-red text-white py-3 rounded-lg font-semibold text-center hover:opacity-90">
                View Menu
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
