import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Admin user
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

  // Clear existing data in dependency order to avoid FK constraint errors
  await prisma.orderItem.deleteMany({})
  await prisma.order.deleteMany({})
  await prisma.menuItem.deleteMany({})
  await prisma.category.deleteMany({})

  // Create categories
  const [
    appetisers, sashimi, gyoza, saladPoke, maki, uriMaki,
    futomaki, signatureRolls, temaki, crunchyRolls, nigiri,
    sushiBoxes, hotDishes, noodlesSoup, desserts, extra
  ] = await Promise.all([
    prisma.category.create({ data: { name: 'Appetisers', description: 'Starters and snacks', displayOrder: 1 } }),
    prisma.category.create({ data: { name: 'Sashimi', description: '5 pieces of fresh sliced fish', displayOrder: 2 } }),
    prisma.category.create({ data: { name: 'Gyoza', description: 'Pan-fried dumplings', displayOrder: 3 } }),
    prisma.category.create({ data: { name: 'Salad & Poke', description: 'Fresh salads and poke bowls', displayOrder: 4 } }),
    prisma.category.create({ data: { name: 'Maki', description: '6 pieces', displayOrder: 5 } }),
    prisma.category.create({ data: { name: 'Uri Maki', description: '8 pieces', displayOrder: 6 } }),
    prisma.category.create({ data: { name: 'Futomaki', description: '6 pieces', displayOrder: 7 } }),
    prisma.category.create({ data: { name: 'Signature Rolls', description: 'Our special signature rolls', displayOrder: 8 } }),
    prisma.category.create({ data: { name: 'Temaki / Hand Roll', description: '2 pieces', displayOrder: 9 } }),
    prisma.category.create({ data: { name: 'Super Crunchy Rolls', description: '6 pieces', displayOrder: 10 } }),
    prisma.category.create({ data: { name: 'Nigiri', description: '2 pieces', displayOrder: 11 } }),
    prisma.category.create({ data: { name: 'Sushi Boxes', description: 'Sushi boxes and platters', displayOrder: 12 } }),
    prisma.category.create({ data: { name: 'Hot Dishes', description: 'Hot mains', displayOrder: 13 } }),
    prisma.category.create({ data: { name: 'Noodles & Soup', description: 'Noodles, ramen and soups', displayOrder: 14 } }),
    prisma.category.create({ data: { name: 'Desserts', description: 'Sweet treats', displayOrder: 15 } }),
    prisma.category.create({ data: { name: 'Extra', description: 'Sauces and sides', displayOrder: 16 } }),
  ])

  console.log('Created categories')

  const menuItems = [
    // Appetisers
    { name: 'Edamame', description: 'Steamed soybeans with sea salt', priceCents: 299, categoryId: appetisers.id, isVegetarian: true },
    { name: 'Spicy Edamame', description: 'Steamed soybeans with spicy seasoning', priceCents: 350, categoryId: appetisers.id, isSpicy: true, isVegetarian: true },
    { name: 'Prawn Katsu', description: 'Crispy battered king prawns', priceCents: 999, categoryId: appetisers.id },
    { name: 'Spring Roll', description: 'Crispy vegetable spring rolls', priceCents: 550, categoryId: appetisers.id, isVegetarian: true },
    { name: 'Pumpkin Korokke', description: 'Japanese-style pumpkin croquettes', priceCents: 650, categoryId: appetisers.id, isVegetarian: true },
    { name: 'Miso Soup', description: 'Traditional Japanese soup made with miso paste', priceCents: 250, categoryId: appetisers.id, isVegetarian: true },
    { name: 'Chicken Karaage', description: 'Japanese fried chicken, crispy and juicy', priceCents: 750, categoryId: appetisers.id, isFeatured: true },

    // Sashimi (5 pcs)
    { name: 'Salmon Sashimi', description: '5 pieces of fresh Atlantic salmon', priceCents: 650, categoryId: sashimi.id, isFeatured: true },
    { name: 'Tuna Sashimi', description: '5 pieces of fresh bluefin tuna', priceCents: 690, categoryId: sashimi.id },
    { name: 'Sashimi Hamachi', description: '5 pieces of fresh yellowtail', priceCents: 750, categoryId: sashimi.id },
    { name: 'Tataki Mix', description: 'Seared mixed fish tataki', priceCents: 1300, categoryId: sashimi.id },
    { name: 'Tataki Salmon', description: 'Lightly seared salmon with ponzu', priceCents: 875, categoryId: sashimi.id },
    { name: 'Tataki Tuna', description: 'Lightly seared tuna with ponzu', priceCents: 955, categoryId: sashimi.id },
    { name: 'Sashimi Mix', description: 'Mixed selection of fresh sashimi', priceCents: 1550, categoryId: sashimi.id, isFeatured: true },

    // Gyoza
    { name: 'Vegetable Gyoza', description: 'Pan-fried vegetable dumplings', priceCents: 550, categoryId: gyoza.id, isVegetarian: true },
    { name: 'Chicken Gyoza', description: 'Pan-fried chicken dumplings', priceCents: 650, categoryId: gyoza.id },
    { name: 'Prawn Gyoza', description: 'Pan-fried prawn dumplings', priceCents: 750, categoryId: gyoza.id },
    { name: 'Duck Gyoza', description: 'Pan-fried duck dumplings', priceCents: 750, categoryId: gyoza.id },

    // Salad & Poke
    { name: 'Kaiso Salad', description: 'Japanese seaweed salad', priceCents: 650, categoryId: saladPoke.id, isVegetarian: true },
    { name: 'Salmon Poke', description: 'Fresh salmon poke bowl with rice and toppings', priceCents: 999, categoryId: saladPoke.id, isFeatured: true },
    { name: 'Tuna Poke', description: 'Fresh tuna poke bowl with rice and toppings', priceCents: 1150, categoryId: saladPoke.id },
    { name: 'Chicken Katsu Salad', description: 'Crispy chicken katsu on a fresh salad', priceCents: 950, categoryId: saladPoke.id },

    // Maki (6 pcs)
    { name: 'Cucumber Maki', description: 'Classic cucumber roll (6 pcs)', priceCents: 350, categoryId: maki.id, isVegetarian: true },
    { name: 'Avocado Maki', description: 'Fresh avocado roll (6 pcs)', priceCents: 450, categoryId: maki.id, isVegetarian: true },
    { name: 'Salmon Maki', description: 'Fresh salmon roll (6 pcs)', priceCents: 550, categoryId: maki.id },
    { name: 'Tuna Maki', description: 'Fresh tuna roll (6 pcs)', priceCents: 575, categoryId: maki.id },
    { name: 'Spicy Tuna Maki', description: 'Tuna with spicy sauce (6 pcs)', priceCents: 599, categoryId: maki.id, isSpicy: true },

    // Uri Maki (8 pcs)
    { name: 'Salmon Avocado Roll', description: 'Salmon and avocado inside-out roll (8 pcs)', priceCents: 680, categoryId: uriMaki.id },
    { name: 'California Roll', description: 'Crab, avocado and cucumber (8 pcs)', priceCents: 680, categoryId: uriMaki.id },
    { name: 'Spicy Tuna Cucumber Roll', description: 'Spicy tuna and cucumber (8 pcs)', priceCents: 750, categoryId: uriMaki.id, isSpicy: true },
    { name: 'Salmon Skin Cucumber Roll', description: 'Crispy salmon skin and cucumber (8 pcs)', priceCents: 680, categoryId: uriMaki.id },
    { name: 'Prawn Katsu Avocado Roll', description: 'Crispy prawn katsu with avocado (8 pcs)', priceCents: 800, categoryId: uriMaki.id },
    { name: 'Spicy Salmon Roll', description: 'Spicy salmon inside-out roll (8 pcs)', priceCents: 750, categoryId: uriMaki.id, isSpicy: true },
    { name: 'Duck Cucumber Roll', description: 'Duck and cucumber inside-out roll (8 pcs)', priceCents: 750, categoryId: uriMaki.id },
    { name: 'Grill Salmon Roll', description: 'Grilled salmon roll (8 pcs)', priceCents: 680, categoryId: uriMaki.id },
    { name: 'Chicken Katsu Avocado Roll', description: 'Crispy chicken katsu with avocado (8 pcs)', priceCents: 650, categoryId: uriMaki.id },

    // Futomaki (6 pcs)
    { name: 'Chicken Katsu Futomaki', description: 'Chicken katsu thick roll (6 pcs)', priceCents: 850, categoryId: futomaki.id },
    { name: 'Softshell Crab Futomaki', description: 'Softshell crab thick roll (6 pcs)', priceCents: 950, categoryId: futomaki.id },
    { name: 'Eel Futomaki', description: 'Eel thick roll (6 pcs)', priceCents: 950, categoryId: futomaki.id },
    { name: 'Salmon Avocado Futomaki', description: 'Salmon and avocado thick roll (6 pcs)', priceCents: 850, categoryId: futomaki.id },
    { name: 'Prawn Katsu Futomaki', description: 'Crispy prawn katsu thick roll (6 pcs)', priceCents: 899, categoryId: futomaki.id },

    // Signature Rolls
    { name: 'Spider Roll', description: 'Softshell crab with avocado and spicy mayo', priceCents: 1250, categoryId: signatureRolls.id, isFeatured: true },
    { name: 'Special Salmon Roll', description: 'Signature salmon roll with special sauce', priceCents: 1299, categoryId: signatureRolls.id, isFeatured: true },
    { name: 'Special Red Dragon', description: 'Spicy signature roll with red dragon sauce', priceCents: 1250, categoryId: signatureRolls.id, isSpicy: true },
    { name: 'Spicy Rainbow Roll', description: 'Colourful roll with spicy mixed fish', priceCents: 1199, categoryId: signatureRolls.id, isSpicy: true },
    { name: 'Special Yama', description: 'Our signature Yama roll (8 pcs)', priceCents: 1199, categoryId: signatureRolls.id, isFeatured: true },
    { name: 'El Dragon', description: 'Special dragon roll with avocado and eel (8 pcs)', priceCents: 1250, categoryId: signatureRolls.id, isFeatured: true },
    { name: 'California Dream', description: 'Premium California-style signature roll (8 pcs)', priceCents: 1199, categoryId: signatureRolls.id },
    { name: 'Ceviche Mix', description: 'Fresh ceviche-style mixed roll', priceCents: 1950, categoryId: signatureRolls.id },
    { name: 'Kapachi Salmon Special Sushi Set', description: 'Special Kapachi salmon sushi set', priceCents: 1399, categoryId: signatureRolls.id, isFeatured: true },
    { name: 'Special Everest', description: 'Signature Everest roll', priceCents: 1250, categoryId: signatureRolls.id },
    { name: 'Special Green Dragon', description: 'Green dragon signature roll', priceCents: 1250, categoryId: signatureRolls.id },

    // Temaki / Hand Roll (2 pcs)
    { name: 'Salmon Avocado Temaki', description: 'Salmon and avocado hand roll (2 pcs)', priceCents: 550, categoryId: temaki.id },
    { name: 'Spicy Tuna Temaki', description: 'Spicy tuna hand roll (2 pcs)', priceCents: 590, categoryId: temaki.id, isSpicy: true },
    { name: 'Prawn Katsu Temaki', description: 'Crispy prawn katsu hand roll (2 pcs)', priceCents: 575, categoryId: temaki.id },
    { name: 'California Temaki', description: 'California-style hand roll (2 pcs)', priceCents: 575, categoryId: temaki.id },
    { name: 'Soft Shell Crab Temaki', description: 'Softshell crab hand roll (2 pcs)', priceCents: 575, categoryId: temaki.id },
    { name: 'Spicy Salmon Temaki', description: 'Spicy salmon hand roll (2 pcs)', priceCents: 675, categoryId: temaki.id, isSpicy: true },
    { name: 'Salmon Cheese Temaki', description: 'Salmon and cream cheese hand roll (2 pcs)', priceCents: 675, categoryId: temaki.id },

    // Super Crunchy Rolls (6 pcs)
    { name: 'Veg Crunchy Roll', description: 'Crispy vegetable crunchy roll (6 pcs)', priceCents: 850, categoryId: crunchyRolls.id, isVegetarian: true },
    { name: 'Crunchy Salmon', description: 'Crispy salmon crunchy roll (6 pcs)', priceCents: 850, categoryId: crunchyRolls.id },
    { name: 'Crunchy Tuna', description: 'Crispy tuna crunchy roll (6 pcs)', priceCents: 1050, categoryId: crunchyRolls.id },
    { name: 'Crunchy Duck', description: 'Crispy duck crunchy roll (6 pcs)', priceCents: 875, categoryId: crunchyRolls.id },
    { name: 'Crunchy Chicken', description: 'Crispy chicken crunchy roll (6 pcs)', priceCents: 850, categoryId: crunchyRolls.id },
    { name: 'Dragon Eye', description: 'Signature dragon eye crunchy roll (6 pcs)', priceCents: 950, categoryId: crunchyRolls.id, isFeatured: true },

    // Nigiri (2 pcs)
    { name: 'Nigiri Eel', description: 'Eel nigiri (2 pcs)', priceCents: 500, categoryId: nigiri.id },
    { name: 'Tuna Nigiri', description: 'Tuna nigiri (2 pcs)', priceCents: 450, categoryId: nigiri.id },
    { name: 'Nigiri Prawn', description: 'Prawn nigiri (2 pcs)', priceCents: 450, categoryId: nigiri.id },
    { name: 'Nigiri Salmon', description: 'Salmon nigiri (2 pcs)', priceCents: 424, categoryId: nigiri.id },
    { name: 'Nigiri Hamachi', description: 'Yellowtail nigiri (2 pcs)', priceCents: 450, categoryId: nigiri.id },
    { name: 'Nigiri Mix', description: 'Mixed nigiri selection (10 pcs)', priceCents: 1450, categoryId: nigiri.id, isFeatured: true },

    // Sushi Boxes
    { name: 'Scot Salmon Box', description: 'Scottish salmon sushi box', priceCents: 1299, categoryId: sushiBoxes.id, isFeatured: true },
    { name: 'Sushi Selection', description: 'Mixed sushi selection box', priceCents: 1299, categoryId: sushiBoxes.id },
    { name: 'Salmon Box 18pcs', description: '18 pieces of salmon sushi', priceCents: 1599, categoryId: sushiBoxes.id, isFeatured: true },
    { name: 'Selection Box 14pcs', description: '14 pieces mixed sushi selection', priceCents: 1599, categoryId: sushiBoxes.id },
    { name: 'Maki Mix', description: 'Mixed maki box', priceCents: 1299, categoryId: sushiBoxes.id },
    { name: 'Maxsi Maki 20pcs', description: '20 pieces of mixed maki', priceCents: 1650, categoryId: sushiBoxes.id },
    { name: 'Omega Box 20pcs', description: '20 pieces omega sushi box', priceCents: 1299, categoryId: sushiBoxes.id },
    { name: 'Vegan Box 14pcs', description: '14 pieces vegan sushi box', priceCents: 1199, categoryId: sushiBoxes.id, isVegetarian: true },
    { name: 'Hot Box 10pcs', description: '10 pieces hot sushi box', priceCents: 1299, categoryId: sushiBoxes.id },
    { name: 'Everest Box 32pcs', description: '32 pieces Everest sushi box', priceCents: 3199, categoryId: sushiBoxes.id },
    { name: 'Deluxe Platter 33pcs', description: '33 pieces deluxe sushi platter', priceCents: 2999, categoryId: sushiBoxes.id, isFeatured: true },
    { name: 'Rembo Platter 36pcs', description: '36 pieces Rembo sushi platter', priceCents: 3750, categoryId: sushiBoxes.id },
    { name: 'Special Yama Deluxe 53pcs', description: '53 pieces: 8 Special Yama, 8 California Dream, 8 Kapachi Salmon, 8 Rembo Special, 4 Salmon Avocado Hot, 5 Prawn Tempura Avocado, 4 Sashimi Tuna, 4 Sashimi Salmon, 3 Hamachi', priceCents: 4950, categoryId: sushiBoxes.id, isFeatured: true },
    { name: 'Special Platter', description: 'Our ultimate special sushi platter — feeds 4 comfortably', priceCents: 5499, categoryId: sushiBoxes.id, isFeatured: true },
    { name: 'Tuna Box 18pcs', description: '18 pieces of fresh tuna sushi', priceCents: 1850, categoryId: sushiBoxes.id },

    // Hot Dishes
    { name: 'Chicken Katsu Curry', description: 'Crispy chicken katsu with Japanese curry sauce and rice', priceCents: 999, categoryId: hotDishes.id, isFeatured: true },
    { name: 'Prawn Katsu Curry', description: 'Crispy prawn katsu with Japanese curry sauce and rice', priceCents: 1099, categoryId: hotDishes.id },
    { name: 'Vegetable Curry', description: 'Japanese vegetable curry with rice', priceCents: 899, categoryId: hotDishes.id, isVegetarian: true },
    { name: 'Salmon Teriyaki', description: 'Glazed salmon fillet with teriyaki sauce and rice', priceCents: 1199, categoryId: hotDishes.id, isFeatured: true },

    // Noodles & Soup
    { name: 'Vegan Stir Fried Noodles', description: 'Stir fried noodles with fresh vegetables', priceCents: 850, categoryId: noodlesSoup.id, isVegetarian: true },
    { name: 'Chicken Stir Fried Noodles', description: 'Stir fried noodles with chicken', priceCents: 950, categoryId: noodlesSoup.id },
    { name: 'Salmon Stir Fried Noodles', description: 'Stir fried noodles with salmon', priceCents: 1050, categoryId: noodlesSoup.id },
    { name: 'Prawn Noodles', description: 'Stir fried noodles with king prawns', priceCents: 1050, categoryId: noodlesSoup.id },
    { name: 'Chicken Ramen', description: 'Rich ramen broth with chicken and noodles', priceCents: 999, categoryId: noodlesSoup.id, isFeatured: true },
    { name: 'Salmon Ramen', description: 'Rich ramen broth with salmon and noodles', priceCents: 1050, categoryId: noodlesSoup.id },
    { name: 'Duck Ramen', description: 'Rich ramen broth with duck and noodles', priceCents: 1050, categoryId: noodlesSoup.id },
    { name: 'Vegetable Ramen', description: 'Rich vegetable ramen broth with noodles', priceCents: 899, categoryId: noodlesSoup.id, isVegetarian: true },

    // Desserts
    { name: 'Dorayaki', description: 'Japanese pancake sandwich with sweet red bean paste', priceCents: 450, categoryId: desserts.id, isVegetarian: true },
    { name: 'Mochi', description: 'Traditional Japanese rice cake with sweet filling', priceCents: 550, categoryId: desserts.id, isVegetarian: true, isFeatured: true },

    // Extra
    { name: 'Plain Rice', description: 'Steamed Japanese rice', priceCents: 250, categoryId: extra.id, isVegetarian: true },
    { name: 'Curry Sauce', description: 'Japanese curry sauce', priceCents: 250, categoryId: extra.id, isVegetarian: true },
    { name: 'Ginger', description: 'Pickled ginger', priceCents: 150, categoryId: extra.id, isVegetarian: true },
    { name: 'Wasabi', description: 'Fresh wasabi', priceCents: 150, categoryId: extra.id, isVegetarian: true },
    { name: 'Spicy Mayo', description: 'Spicy mayonnaise sauce', priceCents: 150, categoryId: extra.id, isSpicy: true, isVegetarian: true },
    { name: 'Soya Sauce', description: 'Japanese soy sauce', priceCents: 150, categoryId: extra.id, isVegetarian: true },
    { name: 'Teriyaki Sauce', description: 'Sweet teriyaki sauce', priceCents: 150, categoryId: extra.id, isVegetarian: true },
    { name: 'Unagi Sauce', description: 'Sweet eel sauce', priceCents: 150, categoryId: extra.id },
    { name: 'Chilli Sauce', description: 'Hot chilli sauce', priceCents: 150, categoryId: extra.id, isSpicy: true, isVegetarian: true },
  ]

  for (const item of menuItems) {
    await prisma.menuItem.create({ data: item })
  }

  console.log(`Created ${menuItems.length} menu items`)

  // Restaurant settings
  await prisma.restaurantSettings.upsert({
    where: { id: 1 },
    update: {
      restaurantName: 'Japanese Yama Sushi',
      operatingHours: JSON.stringify({
        monday:    { open: '16:30', close: '20:30' },
        tuesday:   { open: '16:30', close: '20:30' },
        wednesday: { open: '16:30', close: '20:30' },
        thursday:  { open: '16:30', close: '20:30' },
        friday:    { open: '16:30', close: '20:30' },
        saturday:  { open: '16:30', close: '20:30' },
        sunday:    { open: '16:30', close: '20:30' },
      }),
    },
    create: {
      restaurantName: 'Japanese Yama Sushi',
      operatingHours: JSON.stringify({
        monday:    { open: '16:30', close: '20:30' },
        tuesday:   { open: '16:30', close: '20:30' },
        wednesday: { open: '16:30', close: '20:30' },
        thursday:  { open: '16:30', close: '20:30' },
        friday:    { open: '16:30', close: '20:30' },
        saturday:  { open: '16:30', close: '20:30' },
        sunday:    { open: '16:30', close: '20:30' },
      }),
      maxPartySize: 20,
      maxReservationsPerSlot: 8,
      deliveryFeeCents: 350,
      taxRate: 0.20,
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
