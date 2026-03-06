import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createReservationSchema } from '@/lib/validations/reservations'

function generateConfirmationCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = 'RES-'
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validation = createReservationSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validation.error.flatten() },
        { status: 400 }
      )
    }

    const { guestName, guestEmail, guestPhone, partySize, reservationDate, timeSlot, specialRequests } = validation.data

    // Check availability
    const date = new Date(reservationDate)
    const existing = await prisma.reservation.count({
      where: {
        reservationDate: date,
        timeSlot,
        status: { not: 'CANCELLED' },
      },
    })

    const settings = await prisma.restaurantSettings.findFirst()
    const maxPerSlot = settings?.maxReservationsPerSlot ?? 8

    if (existing >= maxPerSlot) {
      return NextResponse.json(
        { error: 'This time slot is fully booked. Please choose another time.' },
        { status: 409 }
      )
    }

    // Generate unique confirmation code
    let confirmationCode = generateConfirmationCode()
    let attempts = 0
    while (attempts < 5) {
      const exists = await prisma.reservation.findUnique({ where: { confirmationCode } })
      if (!exists) break
      confirmationCode = generateConfirmationCode()
      attempts++
    }

    const reservation = await prisma.reservation.create({
      data: {
        confirmationCode,
        status: 'CONFIRMED',
        guestName,
        guestEmail,
        guestPhone,
        partySize,
        reservationDate: date,
        timeSlot,
        specialRequests,
      },
    })

    return NextResponse.json({ reservationId: reservation.id, confirmationCode }, { status: 201 })
  } catch (error) {
    console.error('Reservation error:', error)
    return NextResponse.json({ error: 'Failed to create reservation' }, { status: 500 })
  }
}
