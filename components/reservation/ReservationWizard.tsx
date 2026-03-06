'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Clock, Users, CheckCircle } from 'lucide-react'

const TIME_SLOTS = [
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00',
]

type Step = 1 | 2 | 3

export default function ReservationWizard() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Step 1: Date + Party size
  const [date, setDate] = useState('')
  const [partySize, setPartySize] = useState(2)

  // Step 2: Time slot
  const [timeSlot, setTimeSlot] = useState('')

  // Step 3: Guest info
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [specialRequests, setSpecialRequests] = useState('')

  // Min date = today, max = 60 days
  const today = new Date().toISOString().split('T')[0]
  const maxDate = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const handleSubmit = async () => {
    setError('')
    setIsLoading(true)
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName, guestEmail, guestPhone, partySize,
          reservationDate: new Date(date).toISOString(),
          timeSlot, specialRequests,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create reservation')
      router.push(`/reservations/confirmation/${data.reservationId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Step Indicator */}
      <div className="bg-jp-black px-8 py-6">
        <div className="flex items-center justify-between max-w-sm mx-auto">
          {[
            { num: 1, icon: Calendar, label: 'Date' },
            { num: 2, icon: Clock, label: 'Time' },
            { num: 3, icon: Users, label: 'Details' },
          ].map(({ num, icon: Icon, label }, i) => (
            <div key={num} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                  step >= num ? 'bg-jp-red text-white' : 'bg-gray-700 text-gray-400'
                }`}>
                  {step > num ? <CheckCircle className="w-5 h-5" /> : num}
                </div>
                <span className={`text-xs mt-1 ${step >= num ? 'text-jp-cream' : 'text-gray-500'}`}>{label}</span>
              </div>
              {i < 2 && (
                <div className={`h-px w-12 mx-2 mb-4 ${step > num ? 'bg-jp-red' : 'bg-gray-700'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Step 1: Date + Party Size */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-jp-black">Choose a Date</h2>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={date}
                min={today}
                max={maxDate}
                onChange={e => setDate(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-jp-red focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Party Size</label>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                  <button
                    key={n}
                    onClick={() => setPartySize(n)}
                    className={`py-3 rounded-lg font-semibold transition-colors ${
                      partySize === n
                        ? 'bg-jp-red text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => { if (date) setStep(2) }}
              disabled={!date}
              className="w-full bg-jp-red text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next: Choose Time →
            </button>
          </div>
        )}

        {/* Step 2: Time Slot */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-jp-black">Choose a Time</h2>
            <p className="text-gray-600">
              {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              {' · '}{partySize} {partySize === 1 ? 'guest' : 'guests'}
            </p>

            <div>
              <p className="text-sm font-semibold text-gray-500 mb-3">LUNCH</p>
              <div className="grid grid-cols-3 gap-2 mb-6">
                {TIME_SLOTS.filter(s => parseInt(s) < 15).map(slot => (
                  <button
                    key={slot}
                    onClick={() => setTimeSlot(slot)}
                    className={`py-3 rounded-lg font-semibold transition-colors ${
                      timeSlot === slot
                        ? 'bg-jp-red text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
              <p className="text-sm font-semibold text-gray-500 mb-3">DINNER</p>
              <div className="grid grid-cols-3 gap-2">
                {TIME_SLOTS.filter(s => parseInt(s) >= 17).map(slot => (
                  <button
                    key={slot}
                    onClick={() => setTimeSlot(slot)}
                    className={`py-3 rounded-lg font-semibold transition-colors ${
                      timeSlot === slot
                        ? 'bg-jp-red text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50">
                ← Back
              </button>
              <button
                onClick={() => { if (timeSlot) setStep(3) }}
                disabled={!timeSlot}
                className="flex-1 bg-jp-red text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next: Your Details →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Guest Info */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-jp-black">Your Details</h2>
            <p className="text-gray-600">
              {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              {' · '}{timeSlot} · {partySize} {partySize === 1 ? 'guest' : 'guests'}
            </p>

            <div className="space-y-4">
              <input
                type="text" placeholder="Full Name" value={guestName}
                onChange={e => setGuestName(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-jp-red focus:outline-none"
                required
              />
              <input
                type="email" placeholder="Email Address" value={guestEmail}
                onChange={e => setGuestEmail(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-jp-red focus:outline-none"
                required
              />
              <input
                type="tel" placeholder="Phone Number" value={guestPhone}
                onChange={e => setGuestPhone(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-jp-red focus:outline-none"
                required
              />
              <textarea
                placeholder="Special requests (allergies, occasions, seating preferences...)"
                value={specialRequests}
                onChange={e => setSpecialRequests(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-jp-red focus:outline-none h-24 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50">
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading || !guestName || !guestEmail || !guestPhone}
                className="flex-1 bg-jp-red text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-40"
              >
                {isLoading ? 'Confirming...' : 'Confirm Reservation'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
