'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCategories } from '@/hooks/useMenu'

interface MenuCategoryTabsProps {
  onCategoryChange?: (categoryId: number | null) => void
}

export default function MenuCategoryTabs({
  onCategoryChange,
}: MenuCategoryTabsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedCategoryId = searchParams.get('category')
  const { categories, isLoading } = useCategories()

  const handleCategoryChange = (categoryId: number | null) => {
    if (categoryId) {
      router.push(`/menu?category=${categoryId}`)
      onCategoryChange?.(categoryId)
    } else {
      router.push('/menu')
      onCategoryChange?.(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-10 w-24 bg-gray-200 rounded animate-pulse flex-shrink-0"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="sticky top-0 z-10 bg-white border-b">
      <div className="max-w-6xl mx-auto">
        <div className="flex gap-2 overflow-x-auto pb-2 px-4 pt-4">
          <button
            onClick={() => handleCategoryChange(null)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
              !selectedCategoryId
                ? 'bg-jp-red text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {categories.map((category: any) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                selectedCategoryId === category.id.toString()
                  ? 'bg-jp-red text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
              {category._count?.menuItems && (
                <span className="ml-2 text-xs">({category._count.menuItems})</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
