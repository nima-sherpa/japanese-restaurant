import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { CartProvider } from '@/contexts/CartContext'
import { ErrorBoundary } from '@/components/ErrorBoundary'

const CartDrawer = dynamic(() => import('@/components/cart/CartDrawer'), {
  ssr: false,
})

export const metadata: Metadata = {
  title: 'Japanese Restaurant',
}

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ErrorBoundary>
      <CartProvider>
        <div className="flex flex-col min-h-screen">
          <main className="flex-1">
            {children}
          </main>
          <CartDrawer />
        </div>
      </CartProvider>
    </ErrorBoundary>
  )
}
