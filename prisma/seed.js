const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  try {
    // Create default admin user
    const adminPassword = await bcrypt.hash('Admin@123', 10);
    await prisma.user.upsert({
      where: { email: 'admin@restaurant.local' },
      update: {},
      create: {
        email: 'admin@restaurant.local',
        passwordHash: adminPassword,
        role: 'admin',
      },
    });
    console.log('✓ Created admin user');

    // Create categories one by one
    await prisma.category.upsert({
      where: { name: 'Sushi' },
      update: {},
      create: { name: 'Sushi', description: 'Fresh rolls and nigiri', displayOrder: 1 },
    });
    await prisma.category.upsert({
      where: { name: 'Ramen' },
      update: {},
      create: { name: 'Ramen', description: 'Hot noodle soups', displayOrder: 2 },
    });
    await prisma.category.upsert({
      where: { name: 'Appetizers' },
      update: {},
      create: { name: 'Appetizers', description: 'Starters', displayOrder: 3 },
    });
    await prisma.category.upsert({
      where: { name: 'Mains' },
      update: {},
      create: { name: 'Mains', description: 'Main courses', displayOrder: 4 },
    });
    await prisma.category.upsert({
      where: { name: 'Desserts' },
      update: {},
      create: { name: 'Desserts', description: 'Sweet treats', displayOrder: 5 },
    });
    await prisma.category.upsert({
      where: { name: 'Beverages' },
      update: {},
      create: { name: 'Beverages', description: 'Drinks', displayOrder: 6 },
    });
    console.log('✓ Created categories');

    // Get categories
    const sushi = await prisma.category.findUnique({ where: { name: 'Sushi' } });
    const ramen = await prisma.category.findUnique({ where: { name: 'Ramen' } });
    const appetizers = await prisma.category.findUnique({ where: { name: 'Appetizers' } });
    const mains = await prisma.category.findUnique({ where: { name: 'Mains' } });
    const beverages = await prisma.category.findUnique({ where: { name: 'Beverages' } });

    // Create menu items
    await prisma.menuItem.deleteMany(); // Clear existing items first

    await prisma.menuItem.create({
      data: {
        name: 'California Roll',
        description: 'Crab, avocado, and cucumber',
        priceCents: 1299,
        categoryId: sushi.id,
        isFeatured: true,
      },
    });
    await prisma.menuItem.create({
      data: {
        name: 'Spicy Tuna Roll',
        description: 'Tuna with mayo and spicy sauce',
        priceCents: 1499,
        categoryId: sushi.id,
        isFeatured: true,
        isSpicy: true,
      },
    });
    await prisma.menuItem.create({
      data: {
        name: 'Vegetable Roll',
        description: 'Cucumber, avocado, and carrot',
        priceCents: 799,
        categoryId: sushi.id,
        isVegetarian: true,
      },
    });
    await prisma.menuItem.create({
      data: {
        name: 'Tonkotsu Ramen',
        description: 'Pork bone broth with pork belly',
        priceCents: 1599,
        categoryId: ramen.id,
        isFeatured: true,
      },
    });
    await prisma.menuItem.create({
      data: {
        name: 'Spicy Miso Ramen',
        description: 'Miso-based broth with vegetables',
        priceCents: 1499,
        categoryId: ramen.id,
        isSpicy: true,
      },
    });
    await prisma.menuItem.create({
      data: {
        name: 'Edamame',
        description: 'Steamed soybeans with sea salt',
        priceCents: 599,
        categoryId: appetizers.id,
        isVegetarian: true,
      },
    });
    await prisma.menuItem.create({
      data: {
        name: 'Gyoza',
        description: 'Pan-fried pork dumplings (6 pieces)',
        priceCents: 799,
        categoryId: appetizers.id,
      },
    });
    await prisma.menuItem.create({
      data: {
        name: 'Teriyaki Chicken',
        description: 'Glazed chicken with rice and vegetables',
        priceCents: 1299,
        categoryId: mains.id,
      },
    });
    await prisma.menuItem.create({
      data: {
        name: 'Green Tea',
        description: 'Fresh brewed green tea',
        priceCents: 299,
        categoryId: beverages.id,
        isVegetarian: true,
      },
    });
    console.log('✓ Created 9 menu items');

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
    });
    console.log('✓ Created restaurant settings');

    console.log('✅ Seeding complete!');
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    throw error;
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
