import { z } from 'zod'

export const cartItemSchema = z.object({
  menuItemId: z.number().int().positive(),
  quantity: z.number().int().positive(),
  name: z.string(),
  priceCents: z.number().int().positive(),
})

export type CartItem = z.infer<typeof cartItemSchema>

export const cartSchema = z.object({
  items: z.array(cartItemSchema),
  type: z.enum(['PICKUP', 'DELIVERY']).default('PICKUP'),
  deliveryAddress: z.string().optional(),
  deliveryCity: z.string().optional(),
  deliveryZip: z.string().optional(),
})

export type Cart = z.infer<typeof cartSchema>
