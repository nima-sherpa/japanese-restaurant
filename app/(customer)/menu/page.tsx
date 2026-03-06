import { Metadata } from 'next'
import { Suspense } from 'react'
import MenuCategoryTabs from '@/components/menu/MenuCategoryTabs'
import MenuItemGrid from '@/components/menu/MenuItemGrid'

export const metadata: Metadata = {
  title: 'Menu | Japanese Restaurant',
  description: 'Browse our full menu of authentic Japanese dishes',
}

interface MenuPageProps {
  searchParams: {
    category?: string
  }
}

export default function MenuPage({ searchParams }: MenuPageProps) {
  const categoryId = searchParams.category
    ? parseInt(searchParams.category)
    : undefined

  return (
    <div className="bg-jp-cream">
      {/* Header */}
      <div className="bg-jp-black text-jp-cream py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-serif font-bold mb-2">Our Menu</h1>
          <p className="text-lg opacity-90">
            Discover our authentic Japanese cuisine
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <MenuCategoryTabs />

      {/* Menu Items Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg h-80 animate-pulse"
                />
              ))}
            </div>
          }
        >
          <MenuItemGrid categoryId={categoryId} />
        </Suspense>
      </div>
    </div>
  )
}
