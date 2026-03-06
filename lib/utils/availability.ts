import { prisma } from '../prisma'

export const RESERVATION_TIME_SLOTS = [
  '11:00', '11:30', '12:00', '12:30', '13:00',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00',
]

export async function getAvailableSlots(
  date: Date,
  partySize: number
): Promise<string[]> {
  const settings = await prisma.restaurantSettings.findFirst()

  if (!settings) {
    return RESERVATION_TIME_SLOTS
  }

  const maxReservationsPerSlot = settings.maxReservationsPerSlot
  const maxPartySize = settings.maxPartySize

  if (partySize > maxPartySize) {
    return []
  }

  // Get all reservations for this date
  const reservations = await prisma.reservation.findMany({
    where: {
      reservationDate: {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lt: new Date(new Date(date).setHours(24, 0, 0, 0)),
      },
      status: { not: 'CANCELLED' },
    },
  })

  // Group reservations by time slot
  const slotCounts: Record<string, number> = {}
  reservations.forEach(res => {
    slotCounts[res.timeSlot] = (slotCounts[res.timeSlot] || 0) + 1
  })

  // Filter available slots
  return RESERVATION_TIME_SLOTS.filter(
    slot => (slotCounts[slot] || 0) < maxReservationsPerSlot
  )
}

export function isValidDate(date: Date): boolean {
  const now = new Date()
  const minAdvance = 30 // minutes
  const maxAdvanceDays = 60

  // Check minimum advance (30 minutes)
  if (date.getTime() - now.getTime() < minAdvance * 60 * 1000) {
    return false
  }

  // Check maximum advance (60 days)
  const maxDate = new Date(now.getTime() + maxAdvanceDays * 24 * 60 * 60 * 1000)
  if (date.getTime() > maxDate.getTime()) {
    return false
  }

  return true
}
