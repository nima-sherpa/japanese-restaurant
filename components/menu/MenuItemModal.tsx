'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, Flame, Leaf, Minus, Plus } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { useCart } from '@/contexts/CartContext'

interface MenuItemModalProps {
  id: number
  name: string
  description?: string
  priceCents: number
  imageUrl?: string
  isSpicy: boolean
  isVegetarian: boolean
  onClose: () => void
}

export default function MenuItemModal({
  id,
  name,
  description,
  priceCents,
  imageUrl,
  isSpicy,
  isVegetarian,
  onClose,
}: MenuItemModalProps) {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem({
      menuItemId: id,
      quantity,
      name,
      priceCents,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="sticky top-0 flex items-center justify-between p-4 border-b bg-white">
          <h2 className="text-2xl font-serif font-bold text-jp-black">{name}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {imageUrl && (
            <div className="relative h-64 w-full bg-gray-200 rounded-lg mb-6 overflow-hidden">
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

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-gray-600">{description}</p>
              <div className="flex gap-2">
                {isSpicy && (
                  <Flame className="w-5 h-5 text-jp-red" aria-label="Spicy" />
                )}
                {isVegetarian && (
                  <Leaf className="w-5 h-5 text-green-600" aria-label="Vegetarian" />
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-b py-4 mb-6">
            <p className="text-3xl font-bold text-jp-red mb-4">
              {formatCurrency(priceCents * quantity)}
            </p>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-gray-600">Quantity:</span>
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-6 py-2 font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-gray-100"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-jp-red text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Add {quantity} to Cart
            </button>
            <button
              onClick={onClose}
              className="flex-1 border-2 border-jp-black text-jp-black py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
