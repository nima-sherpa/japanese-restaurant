import { Metadata } from 'next'
import { CartProvider } from '@/contexts/CartContext'
import CartDrawer from '@/components/cart/CartDrawer'

export const metadata: Metadata = {
  title: 'Japanese Restaurant',
}

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen">
        {/* Navigation will be added here */}
        <main className="flex-1">
          {children}
        </main>
        {/* Footer will be added here */}
        <CartDrawer />
      </div>
    </CartProvider>
  )
}
