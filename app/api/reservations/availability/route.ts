import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const ALL_SLOTS = [
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00',
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const dateStr = searchParams.get('date')

    if (!dateStr) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 })
    }

    const date = new Date(dateStr)

    const reservations = await prisma.reservation.findMany({
      where: {
        reservationDate: date,
        status: { not: 'CANCELLED' },
      },
      select: { timeSlot: true },
    })

    const settings = await prisma.restaurantSettings.findFirst()
    const maxPerSlot = settings?.maxReservationsPerSlot ?? 8

    const slotCounts: Record<string, number> = {}
    reservations.forEach(r => {
      slotCounts[r.timeSlot] = (slotCounts[r.timeSlot] || 0) + 1
    })

    const availableSlots = ALL_SLOTS.filter(slot => (slotCounts[slot] || 0) < maxPerSlot)

    return NextResponse.json({ availableSlots })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 })
  }
}
