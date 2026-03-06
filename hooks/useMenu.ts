import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(r => r.json())

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
