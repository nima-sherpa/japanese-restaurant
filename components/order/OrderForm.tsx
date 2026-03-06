'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { CartItem } from '@/lib/validations/cart'
import { formatCurrency } from '@/lib/utils'

export function OrderForm() {
  const router = useRouter()
  const { cart, setOrderType, getTotalCents, clearCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Pickup only
  const orderType = 'PICKUP'
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [specialInstructions, setSpecialInstructions] = useState('')

  const subtotalCents = getTotalCents()
  const taxCents = Math.round(subtotalCents * 0.20) // 20% VAT
  const totalCents = subtotalCents + taxCents

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Validate cart is not empty
      if (cart.items.length === 0) {
        throw new Error('Your cart is empty')
      }

      // Validate required fields
      if (!customerName || !customerEmail || !customerPhone) {
        throw new Error('Please fill in all customer information')
      }

      // Update cart context
      setOrderType(orderType)

      // Create order
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: orderType,
          customerName,
          customerEmail,
          customerPhone,
          items: cart.items.map((item: CartItem) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
          })),
          specialInstructions,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create order')
      }

      const { orderId } = await response.json()

      // Clear cart and redirect
      clearCart()
      router.push(`/order/confirmation/${orderId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setIsLoading(false)
    }
  }

  if (cart.items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-600 mb-4">Your cart is empty</p>
        <a href="/menu" className="text-jp-red font-semibold hover:underline">
          Continue shopping →
        </a>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {/* Form */}
      <form onSubmit={handleSubmit} className="md:col-span-2 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Pickup notice */}
        <div className="flex items-center gap-3 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
          <span className="text-2xl">🏃</span>
          <div>
            <p className="font-semibold text-green-800">Collection Only</p>
            <p className="text-sm text-green-700">📍 6 Trinity St, London, SE1 1DB — We'll email you when your order is ready!</p>
          </div>
        </div>

        {/* Customer Info */}
        <div>
          <h3 className="text-lg font-semibold text-jp-black mb-4">Your Information</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              value={customerEmail}
              onChange={e => setCustomerEmail(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
              required
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={customerPhone}
              onChange={e => setCustomerPhone(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
              required
            />
          </div>
        </div>

        {/* Special Instructions */}
        <div>
          <label className="block text-sm font-semibold text-jp-black mb-2">
            Special Instructions (Optional)
          </label>
          <textarea
            value={specialInstructions}
            onChange={e => setSpecialInstructions(e.target.value)}
            placeholder="Any allergies, preferences, or special requests?"
            className="w-full border rounded-lg px-4 py-2 h-24 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-jp-red text-jp-cream py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : 'Continue to Payment'}
        </button>
      </form>

      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-4">
        <h3 className="text-lg font-semibold text-jp-black mb-4">Order Summary</h3>

        <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
          {cart.items.map((item: CartItem) => (
            <div key={item.menuItemId} className="flex justify-between text-sm">
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>{formatCurrency(item.priceCents * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span>{formatCurrency(subtotalCents)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">VAT (20%)</span>
            <span>{formatCurrency(taxCents)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-jp-red pt-2 border-t">
            <span>Total</span>
            <span>{formatCurrency(totalCents)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
