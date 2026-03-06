import { Metadata } from 'next'
import ReservationWizard from '@/components/reservation/ReservationWizard'

export const metadata: Metadata = {
  title: 'Reservations | Japanese Restaurant',
  description: 'Book a table at our authentic Japanese restaurant',
}

export default function ReservationsPage() {
  return (
    <div className="min-h-screen bg-jp-cream">
      <div className="bg-jp-black py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-serif font-bold text-jp-cream mb-4">Reserve a Table</h1>
          <p className="text-lg text-gray-300">Join us for an authentic Japanese dining experience</p>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <ReservationWizard />
      </div>
    </div>
  )
}
