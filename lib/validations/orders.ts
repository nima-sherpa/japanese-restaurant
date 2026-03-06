import { z } from 'zod'

export const createOrderSchema = z.object({
  type: z.enum(['PICKUP', 'DELIVERY']),
  customerName: z.string().min(2).max(100),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(10).max(20),
  deliveryAddress: z.string().optional(),
  deliveryCity: z.string().optional(),
  deliveryZip: z.string().optional(),
  items: z.array(
    z.object({
      menuItemId: z.number().int().positive(),
      quantity: z.number().int().positive(),
    })
  ).min(1),
  specialInstructions: z.string().optional(),
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>

export const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED']),
})

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>
