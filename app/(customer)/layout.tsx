import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { CartProvider } from '@/contexts/CartContext'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const CartDrawer = dynamic(() => import('@/components/cart/CartDrawer'), { ssr: false })

export const metadata: Metadata = {
  title: 'Japanese Yama Sushi | London',
}

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <CartProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1 pt-16">
            {children}
          </main>
          <Footer />
          <CartDrawer />
        </div>
      </CartProvider>
    </ErrorBoundary>
  )
}
