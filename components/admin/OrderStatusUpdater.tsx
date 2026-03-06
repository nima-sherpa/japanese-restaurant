'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const STATUS_FLOW = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED']

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  CONFIRMED: 'bg-blue-100 text-blue-800 border-blue-300',
  PREPARING: 'bg-orange-100 text-orange-800 border-orange-300',
  READY: 'bg-green-100 text-green-800 border-green-300',
  DELIVERED: 'bg-gray-100 text-gray-800 border-gray-300',
  CANCELLED: 'bg-red-100 text-red-800 border-red-300',
}

const nextStatus: Record<string, string> = {
  PENDING: 'CONFIRMED',
  CONFIRMED: 'PREPARING',
  PREPARING: 'READY',
  READY: 'DELIVERED',
}

export default function OrderStatusUpdater({
  orderId,
  currentStatus,
}: {
  orderId: number
  currentStatus: string
}) {
  const [status, setStatus] = useState(currentStatus)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const updateStatus = async (newStatus: string) => {
    setIsLoading(true)
    const res = await fetch(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    if (res.ok) {
      setStatus(newStatus)
      router.refresh()
    }
    setIsLoading(false)
  }

  return (
    <div className="space-y-4">
      <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold border ${statusColors[status]}`}>
        {status}
      </div>

      {/* Progress bar */}
      <div className="flex gap-1">
        {['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED'].map((s, i) => (
          <div
            key={s}
            className={`flex-1 h-2 rounded ${
              STATUS_FLOW.indexOf(status) >= i ? 'bg-jp-red' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {nextStatus[status] && (
        <button
          onClick={() => updateStatus(nextStatus[status])}
          disabled={isLoading}
          className="w-full bg-jp-red text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {isLoading ? 'Updating...' : `Mark as ${nextStatus[status]} →`}
        </button>
      )}

      {status !== 'CANCELLED' && status !== 'DELIVERED' && (
        <button
          onClick={() => updateStatus('CANCELLED')}
          disabled={isLoading}
          className="w-full border-2 border-red-300 text-red-600 py-2 rounded-lg text-sm hover:bg-red-50"
        >
          Cancel Order
        </button>
      )}
    </div>
  )
}
