'use client'

import { useMenuItems } from '@/hooks/useMenu'
import MenuItemCard from './MenuItemCard'

interface MenuItemGridProps {
  categoryId?: number
}

export default function MenuItemGrid({ categoryId }: MenuItemGridProps) {
  const { items, isLoading, error } = useMenuItems(categoryId)

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 font-semibold">Failed to load menu items</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-gray-200 rounded-lg h-80 animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No items available</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <MenuItemCard
          key={item.id}
          id={item.id}
          name={item.name}
          description={item.description}
          priceCents={item.priceCents}
          imageUrl={item.imageUrl}
          isSpicy={item.isSpicy}
          isVegetarian={item.isVegetarian}
        />
      ))}
    </div>
  )
}
