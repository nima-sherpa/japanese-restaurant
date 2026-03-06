import { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import MenuItemGrid from '@/components/menu/MenuItemGrid'

export const metadata: Metadata = {
  title: 'Home | Japanese Restaurant',
  description: 'Experience authentic Japanese cuisine',
}

// Featured items component (will be hydrated client-side)
import dynamic from 'next/dynamic'

const FeaturedItemsGrid = dynamic(
  () => import('@/components/menu/FeaturedItemsGrid'),
  { loading: () => <div className="text-center py-12 text-gray-500">Loading featured dishes...</div> }
)

export default function HomePage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="hero-section py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-serif font-bold mb-4">Authentic Japanese Cuisine</h1>
          <p className="text-xl mb-8 opacity-90">
            Experience the finest flavors of Japan
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/menu"
              className="bg-jp-red text-jp-cream px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity inline-block"
            >
              Order Now
            </Link>
            <Link
              href="/reservations"
              className="border-2 border-jp-cream text-jp-cream px-8 py-3 rounded-lg font-semibold hover:bg-jp-cream hover:text-jp-black transition-colors inline-block"
            >
              Reserve Table
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="featured-section py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-serif font-bold mb-12 text-center">Featured Dishes</h2>
          <Suspense fallback={<div className="text-center py-12 text-gray-500">Loading featured dishes...</div>}>
            <FeaturedItemsGrid />
          </Suspense>
          <div className="text-center mt-8">
            <Link
              href="/menu"
              className="text-jp-red font-semibold hover:underline"
            >
              View Full Menu →
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 bg-jp-cream">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-serif font-bold mb-8 text-jp-black">About Us</h2>
          <p className="text-lg text-gray-700 mb-6">
            Welcome to our restaurant. We bring authentic Japanese culinary traditions to your table with the freshest ingredients and traditional cooking methods.
          </p>
          <p className="text-lg text-gray-700">
            From sushi to ramen, each dish is crafted with care and passion for perfection.
          </p>
        </div>
      </section>
    </div>
  )
}
