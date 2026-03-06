import { z } from 'zod'

export const createReservationSchema = z.object({
  guestName: z.string().min(2).max(100),
  guestEmail: z.string().email(),
  guestPhone: z.string().min(10).max(20),
  partySize: z.number().int().min(1).max(20),
  reservationDate: z.string().datetime(),
  timeSlot: z.string().regex(/^\d{2}:\d{2}$/),
  specialRequests: z.string().optional(),
})

export type CreateReservationInput = z.infer<typeof createReservationSchema>

export const updateReservationSchema = z.object({
  status: z.enum(['CONFIRMED', 'COMPLETED', 'CANCELLED']),
  tableNumber: z.number().int().positive().optional(),
})

export type UpdateReservationInput = z.infer<typeof updateReservationSchema>
