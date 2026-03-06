'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { formatCurrency } from '@/lib/utils'

export function OrderForm() {
  const router = useRouter()
  const { cart, setOrderType, setDeliveryAddress, getTotalCents, clearCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Form state
  const [orderType, setLocalOrderType] = useState<'PICKUP' | 'DELIVERY'>(cart.type)
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [deliveryAddress, setLocalDeliveryAddress] = useState(cart.deliveryAddress || '')
  const [deliveryCity, setDeliveryCity] = useState(cart.deliveryCity || '')
  const [deliveryZip, setDeliveryZip] = useState(cart.deliveryZip || '')
  const [specialInstructions, setSpecialInstructions] = useState('')

  const subtotalCents = getTotalCents()
  const deliveryFeeCents = orderType === 'DELIVERY' ? 350 : 0 // $3.50
  const taxCents = Math.round((subtotalCents + deliveryFeeCents) * 0.0875) // 8.75%
  const totalCents = subtotalCents + deliveryFeeCents + taxCents

  const handleOrderTypeChange = (type: 'PICKUP' | 'DELIVERY') => {
    setLocalOrderType(type)
  }

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

      // Validate delivery fields if delivery
      if (orderType === 'DELIVERY') {
        if (!deliveryAddress || !deliveryCity || !deliveryZip) {
          throw new Error('Please fill in all delivery information')
        }
      }

      // Update cart context
      setOrderType(orderType)
      if (orderType === 'DELIVERY') {
        setDeliveryAddress(deliveryAddress, deliveryCity, deliveryZip)
      }

      // Create order
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: orderType,
          customerName,
          customerEmail,
          customerPhone,
          deliveryAddress,
          deliveryCity,
          deliveryZip,
          items: cart.items.map(item => ({
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

        {/* Order Type */}
        <div>
          <h3 className="text-lg font-semibold text-jp-black mb-4">Delivery Type</h3>
          <div className="space-y-3">
            <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50" style={{borderColor: orderType === 'PICKUP' ? '#C62828' : '#ccc'}}>
              <input
                type="radio"
                name="orderType"
                value="PICKUP"
                checked={orderType === 'PICKUP'}
                onChange={() => handleOrderTypeChange('PICKUP')}
                className="w-4 h-4"
              />
              <span className="ml-3 font-semibold text-jp-black">Pickup</span>
              <span className="ml-auto text-sm text-gray-600">Ready for pickup</span>
            </label>

            <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50" style={{borderColor: orderType === 'DELIVERY' ? '#C62828' : '#ccc'}}>
              <input
                type="radio"
                name="orderType"
                value="DELIVERY"
                checked={orderType === 'DELIVERY'}
                onChange={() => handleOrderTypeChange('DELIVERY')}
                className="w-4 h-4"
              />
              <span className="ml-3 font-semibold text-jp-black">Delivery</span>
              <span className="ml-auto text-sm text-gray-600">{formatCurrency(deliveryFeeCents)}</span>
            </label>
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

        {/* Delivery Info */}
        {orderType === 'DELIVERY' && (
          <div>
            <h3 className="text-lg font-semibold text-jp-black mb-4">Delivery Address</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Street Address"
                value={deliveryAddress}
                onChange={e => setLocalDeliveryAddress(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="City"
                  value={deliveryCity}
                  onChange={e => setDeliveryCity(e.target.value)}
                  className="border rounded-lg px-4 py-2"
                  required
                />
                <input
                  type="text"
                  placeholder="ZIP Code"
                  value={deliveryZip}
                  onChange={e => setDeliveryZip(e.target.value)}
                  className="border rounded-lg px-4 py-2"
                  required
                />
              </div>
            </div>
          </div>
        )}

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
          {cart.items.map(item => (
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
          {orderType === 'DELIVERY' && (
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Fee</span>
              <span>{formatCurrency(deliveryFeeCents)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">Tax (8.75%)</span>
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
