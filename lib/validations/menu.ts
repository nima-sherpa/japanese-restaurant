import { z } from 'zod'

export const createMenuItemSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  priceCents: z.number().int().positive(),
  categoryId: z.number().int().positive(),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isSpicy: z.boolean().default(false),
  isVegetarian: z.boolean().default(false),
  displayOrder: z.number().int().default(0),
})

export type CreateMenuItemInput = z.infer<typeof createMenuItemSchema>

export const updateMenuItemSchema = createMenuItemSchema.partial()

export type UpdateMenuItemInput = z.infer<typeof updateMenuItemSchema>

export const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  displayOrder: z.number().int().default(0),
})

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
