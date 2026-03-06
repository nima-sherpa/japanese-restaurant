'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Flame, Leaf } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import MenuItemModal from './MenuItemModal'

interface MenuItemCardProps {
  id: number
  name: string
  description?: string
  priceCents: number
  imageUrl?: string
  isSpicy: boolean
  isVegetarian: boolean
}

export default function MenuItemCard({
  id,
  name,
  description,
  priceCents,
  imageUrl,
  isSpicy,
  isVegetarian,
}: MenuItemCardProps) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <div
        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        {imageUrl && (
          <div className="relative h-48 w-full bg-gray-200">
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
        )}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-serif text-lg font-semibold text-jp-black">
              {name}
            </h3>
            <div className="flex gap-1 flex-shrink-0">
              {isSpicy && (
                <Flame className="w-4 h-4 text-jp-red" title="Spicy" />
              )}
              {isVegetarian && (
                <Leaf className="w-4 h-4 text-green-600" title="Vegetarian" />
              )}
            </div>
          </div>

          {description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-jp-red">
              {formatCurrency(priceCents)}
            </span>
            <button className="bg-jp-black text-jp-cream px-4 py-2 rounded text-sm font-medium hover:bg-jp-red transition-colors">
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <MenuItemModal
          id={id}
          name={name}
          description={description}
          priceCents={priceCents}
          imageUrl={imageUrl}
          isSpicy={isSpicy}
          isVegetarian={isVegetarian}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}
