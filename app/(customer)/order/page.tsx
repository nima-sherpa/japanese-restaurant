import { Metadata } from 'next'
import { OrderForm } from '@/components/order/OrderForm'

export const metadata: Metadata = {
  title: 'Checkout | Japanese Restaurant',
  description: 'Complete your order',
}

export default function OrderPage() {
  return (
    <div className="bg-jp-cream min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-serif font-bold text-jp-black mb-8 text-center">
          Checkout
        </h1>
        <OrderForm />
      </div>
    </div>
  )
}
