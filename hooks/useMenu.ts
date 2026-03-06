import useSWR from 'swr'

// Throw on non-200 so SWR sets error state instead of data
const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch')
  const data = await res.json()
  // Ensure we always return an array
  return Array.isArray(data) ? data : []
}

export function useMenuItems(categoryId?: number) {
  const url = categoryId
    ? `/api/menu?categoryId=${categoryId}`
    : '/api/menu'

  const { data, error, isLoading } = useSWR(url, fetcher)

  return {
    items: data || [],
    isLoading,
    error,
  }
}

export function useFeaturedItems() {
  const { data, error, isLoading } = useSWR('/api/menu?featured=true', fetcher)

  return {
    items: data || [],
    isLoading,
    error,
  }
}

export function useCategories() {
  const { data, error, isLoading } = useSWR('/api/menu/categories', fetcher)

  return {
    categories: data || [],
    isLoading,
    error,
  }
}
