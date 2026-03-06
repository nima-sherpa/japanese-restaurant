import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create default admin user (email: admin@restaurant.local, password: Admin@123)
  const adminPassword = await hash('Admin@123', 10)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@restaurant.local' },
    update: {},
    create: {
      email: 'admin@restaurant.local',
      passwordHash: adminPassword,
      role: 'admin',
    },
  })
  console.log('Created admin user:', adminUser.email)

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Sushi' },
      update: {},
      create: {
        name: 'Sushi',
        description: 'Fresh rolls and nigiri',
        displayOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { name: 'Ramen' },
      update: {},
      create: {
        name: 'Ramen',
        description: 'Hot noodle soups',
        displayOrder: 2,
      },
    }),
    prisma.category.upsert({
      where: { name: 'Appetizers' },
      update: {},
      create: {
        name: 'Appetizers',
        description: 'Starters',
        displayOrder: 3,
      },
    }),
    prisma.category.upsert({
      where: { name: 'Mains' },
      update: {},
      create: {
        name: 'Mains',
        description: 'Main courses',
        displayOrder: 4,
      },
    }),
    prisma.category.upsert({
      where: { name: 'Desserts' },
      update: {},
      create: {
        name: 'Desserts',
        description: 'Sweet treats',
        displayOrder: 5,
      },
    }),
    prisma.category.upsert({
      where: { name: 'Beverages' },
      update: {},
      create: {
        name: 'Beverages',
        description: 'Drinks',
        displayOrder: 6,
      },
    }),
  ])

  console.log('Created categories:', categories.map(c => c.name).join(', '))

  // Create sample menu items
  const sushiCategory = categories.find(c => c.name === 'Sushi')!
  const ramenCategory = categories.find(c => c.name === 'Ramen')!
  const appetizerCategory = categories.find(c => c.name === 'Appetizers')!
  const mainCategory = categories.find(c => c.name === 'Mains')!
  const beverageCategory = categories.find(c => c.name === 'Beverages')!

  const menuItems = [
    // Sushi
    {
      name: 'California Roll',
      description: 'Crab, avocado, and cucumber',
      priceCents: 1299,
      categoryId: sushiCategory.id,
      isAvailable: true,
      isFeatured: true,
      isSpicy: false,
      isVegetarian: false,
    },
    {
      name: 'Spicy Tuna Roll',
      description: 'Tuna with mayo and spicy sauce',
      priceCents: 1499,
      categoryId: sushiCategory.id,
      isAvailable: true,
      isFeatured: true,
      isSpicy: true,
      isVegetarian: false,
    },
    {
      name: 'Vegetable Roll',
      description: 'Cucumber, avocado, and carrot',
      priceCents: 799,
      categoryId: sushiCategory.id,
      isAvailable: true,
      isFeatured: false,
      isSpicy: false,
      isVegetarian: true,
    },
    // Ramen
    {
      name: 'Tonkotsu Ramen',
      description: 'Pork bone broth with pork belly',
      priceCents: 1599,
      categoryId: ramenCategory.id,
      isAvailable: true,
      isFeatured: true,
      isSpicy: false,
      isVegetarian: false,
    },
    {
      name: 'Spicy Miso Ramen',
      description: 'Miso-based broth with vegetables',
      priceCents: 1499,
      categoryId: ramenCategory.id,
      isAvailable: true,
      isFeatured: false,
      isSpicy: true,
      isVegetarian: false,
    },
    // Appetizers
    {
      name: 'Edamame',
      description: 'Steamed soybeans with sea salt',
      priceCents: 599,
      categoryId: appetizerCategory.id,
      isAvailable: true,
      isFeatured: false,
      isSpicy: false,
      isVegetarian: true,
    },
    {
      name: 'Gyoza',
      description: 'Pan-fried pork dumplings (6 pieces)',
      priceCents: 799,
      categoryId: appetizerCategory.id,
      isAvailable: true,
      isFeatured: false,
      isSpicy: false,
      isVegetarian: false,
    },
    // Main
    {
      name: 'Teriyaki Chicken',
      description: 'Glazed chicken with rice and vegetables',
      priceCents: 1299,
      categoryId: mainCategory.id,
      isAvailable: true,
      isFeatured: false,
      isSpicy: false,
      isVegetarian: false,
    },
    // Beverage
    {
      name: 'Green Tea',
      description: 'Fresh brewed green tea',
      priceCents: 299,
      categoryId: beverageCategory.id,
      isAvailable: true,
      isFeatured: false,
      isSpicy: false,
      isVegetarian: true,
    },
  ]

  for (const item of menuItems) {
    await prisma.menuItem.upsert({
      where: { id: -1 }, // Ensure unique creation
      update: {},
      create: item,
    })
  }

  console.log('Created menu items')

  // Create default restaurant settings
  await prisma.restaurantSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      restaurantName: 'Japanese Restaurant',
      operatingHours: JSON.stringify({
        monday: { open: '11:00', close: '22:00' },
        tuesday: { open: '11:00', close: '22:00' },
        wednesday: { open: '11:00', close: '22:00' },
        thursday: { open: '11:00', close: '22:00' },
        friday: { open: '11:00', close: '23:00' },
        saturday: { open: '11:00', close: '23:00' },
        sunday: { open: '11:00', close: '22:00' },
      }),
      maxPartySize: 10,
      maxReservationsPerSlot: 8,
      deliveryFeeCents: 350,
      taxRate: 0.0875,
    },
  })

  console.log('Seeding complete!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
