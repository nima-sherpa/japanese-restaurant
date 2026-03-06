import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')
    const featured = searchParams.get('featured') === 'true'

    let query: any = {
      where: {
        isAvailable: true,
      },
      orderBy: [
        { displayOrder: 'asc' as const },
        { name: 'asc' as const },
      ],
      include: {
        category: true,
      },
    }

    if (categoryId) {
      query.where.categoryId = parseInt(categoryId)
    }

    if (featured) {
      query.where.isFeatured = true
    }

    const items = await prisma.menuItem.findMany(query)

    return NextResponse.json(items)
  } catch (error) {
    console.error('Menu API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch menu items' },
      { status: 500 }
    )
  }
}
