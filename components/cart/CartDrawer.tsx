'use client'

import { useState } from 'react'
import Link from 'next/link'
import { X, Minus, Plus, Trash2, ShoppingCart } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { CartItem } from '@/lib/validations/cart'
import { formatCurrency } from '@/lib/utils'

export default function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  const { cart, updateQuantity, removeItem, getTotalCents, getItemCount } = useCart()

  const totalCents = getTotalCents()
  const itemCount = getItemCount()

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-jp-red text-jp-cream px-6 py-3 rounded-full font-semibold shadow-lg hover:opacity-90 flex items-center gap-2 z-40"
      >
        <ShoppingCart className="w-5 h-5" />
        <span>{itemCount > 0 ? itemCount : 'Cart'}</span>
      </button>
    )
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-lg z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-serif font-bold text-jp-black">Cart</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <button
                onClick={() => setIsOpen(false)}
                className="text-jp-red font-semibold hover:underline"
              >
                Continue shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.items.map((item: CartItem) => (
                <div key={item.menuItemId} className="border-b pb-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-jp-black">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        {formatCurrency(item.priceCents)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.menuItemId)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        updateQuantity(item.menuItemId, item.quantity - 1)
                      }
                      className="p-1 border rounded hover:bg-gray-100"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.menuItemId, item.quantity + 1)
                      }
                      className="p-1 border rounded hover:bg-gray-100"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <span className="ml-auto font-semibold text-jp-red">
                      {formatCurrency(item.priceCents * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.items.length > 0 && (
          <div className="border-t p-6 space-y-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span className="text-jp-red">{formatCurrency(totalCents)}</span>
            </div>

            <Link
              href="/order"
              className="block w-full bg-jp-red text-jp-cream py-3 rounded-lg font-semibold text-center hover:opacity-90"
              onClick={() => setIsOpen(false)}
            >
              Proceed to Checkout
            </Link>

            <button
              onClick={() => setIsOpen(false)}
              className="w-full border-2 border-jp-black text-jp-black py-3 rounded-lg font-semibold hover:bg-gray-50"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}
