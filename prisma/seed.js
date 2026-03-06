const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Admin user
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@restaurant.local' },
    update: {},
    create: { email: 'admin@restaurant.local', passwordHash: adminPassword, role: 'admin' },
  });
  console.log('✓ Admin user created');

  // Clear existing data
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();

  // Categories
  const sushiBox = await prisma.category.create({ data: { name: 'Sushi Boxes', description: 'Fresh salmon & sushi boxes', displayOrder: 1 } });
  const platters = await prisma.category.create({ data: { name: 'Platters', description: 'Sharing platters for groups', displayOrder: 2 } });
  const hotDishes = await prisma.category.create({ data: { name: 'Hot Dishes', description: 'Katsu curry & teriyaki', displayOrder: 3 } });
  const ramen = await prisma.category.create({ data: { name: 'Ramen & Noodles', description: 'Ramen soups & stir-fried noodles', displayOrder: 4 } });
  const desserts = await prisma.category.create({ data: { name: 'Desserts', description: 'Sweet Japanese treats', displayOrder: 5 } });
  const extras = await prisma.category.create({ data: { name: 'Extras', description: 'Sides and add-ons', displayOrder: 6 } });
  console.log('✓ Categories created');

  // Menu items with Unsplash photos
  const items = [
    // === SUSHI BOXES ===
    {
      name: 'Sushi Selection Box',
      description: '4 pcs salmon avocado maki — a light and delicious starter',
      priceCents: 799,
      categoryId: sushiBox.id,
      isFeatured: false,
      imageUrl: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=600&q=80',
    },
    {
      name: '3-Set Salmon Box',
      description: '3 pcs prawn, 3 pcs sushi, 3 pcs sushi maki, tuna 16 maki — total 16 pieces',
      priceCents: 1299,
      categoryId: sushiBox.id,
      isFeatured: true,
      imageUrl: 'https://images.unsplash.com/photo-1562802378-063ec186a863?w=600&q=80',
    },
    {
      name: 'Salmon Box 18pcs',
      description: 'Salmon avocado maki, salmon sashimi, salmon uramaki — 18 pieces',
      priceCents: 1299,
      categoryId: sushiBox.id,
      isFeatured: true,
      imageUrl: 'https://images.unsplash.com/photo-1617196034096-2186592926b4?w=600&q=80',
    },
    {
      name: 'Selection Box 14pcs',
      description: 'California uramaki 4pcs, tuna sashimi 2pcs, salmon avocado uramaki 4pcs, salmon maki 4pcs',
      priceCents: 1599,
      categoryId: sushiBox.id,
      isFeatured: false,
      imageUrl: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=600&q=80',
    },
    {
      name: 'Maki Mix Box',
      description: 'Salmon maki 6pcs, California uramaki 4pcs, salmon avocado uramaki 4pcs, tuna maki 6pcs',
      priceCents: 1299,
      categoryId: sushiBox.id,
      isFeatured: false,
      imageUrl: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80',
    },
    {
      name: 'Maxxi Sushi Maki Mix 20pcs',
      description: 'Prawn maki 8pcs, uramaki 8pcs, salmon avocado maki 4pcs — 20 pieces',
      priceCents: 1299,
      categoryId: sushiBox.id,
      isFeatured: false,
      imageUrl: 'https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?w=600&q=80',
    },
    {
      name: 'Vegan Box 14pcs',
      description: 'Avocado maki 8pcs, vegetable uramaki 6pcs (avocado, cucumber, carrot, asparagus)',
      priceCents: 1199,
      categoryId: sushiBox.id,
      isFeatured: false,
      isVegetarian: true,
      imageUrl: 'https://images.unsplash.com/photo-1548940740-204726a19be3?w=600&q=80',
    },

    // === PLATTERS ===
    {
      name: 'Hot Box 14pcs',
      description: 'Chicken avocado uramaki, 8pcs special sushi, prawn tempura asparagus, hot roll 6pcs',
      priceCents: 1850,
      categoryId: platters.id,
      isFeatured: false,
      imageUrl: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=600&q=80',
    },
    {
      name: 'Everest Box 32pcs',
      description: 'Salmon sashimi 4pcs, tuna maki 6pcs, salmon avocado maki 6pcs, avocado uramaki 4pcs, salmon california 8pcs, night roll 4pcs',
      priceCents: 1299,
      categoryId: platters.id,
      isFeatured: false,
      imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&q=80',
    },
    {
      name: 'Deluxe Platter 33pcs',
      description: 'Salmon avocado dream 8pcs, night roll 6pcs, tuna maki 6pcs, hiramaki california 8pcs, sashimi salmon 5pcs',
      priceCents: 3699,
      categoryId: platters.id,
      isFeatured: true,
      imageUrl: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=600&q=80',
    },
    {
      name: 'Rombo Platter 8pcs',
      description: 'Special red dragon 8pcs, special yama dream 8pcs, california dream 4pcs, sashimi tuna 4pcs, california dream 4pcs',
      priceCents: 2999,
      categoryId: platters.id,
      isFeatured: false,
      imageUrl: 'https://images.unsplash.com/photo-1617196035154-1e7e6e28b0db?w=600&q=80',
    },
    {
      name: 'Special Yama Deluxe',
      description: 'Crunchy roll, california dream, special yama california roll, sashimi tuna 4pcs',
      priceCents: 3750,
      categoryId: platters.id,
      isFeatured: false,
      imageUrl: 'https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?w=600&q=80',
    },
    {
      name: 'Special Platter 51pcs',
      description: 'Tuna night maki 6pcs, salmon avocado dream, tuna night 6pcs, special green roll 8pcs, night red 4pcs, tuna night 6pcs prawn 6pcs',
      priceCents: 5100,
      categoryId: platters.id,
      isFeatured: false,
      imageUrl: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=600&q=80',
    },

    // === HOT DISHES ===
    {
      name: 'Chicken Katsu Curry',
      description: 'Crispy breaded chicken with Japanese curry sauce, steamed rice and salad',
      priceCents: 992,
      categoryId: hotDishes.id,
      isFeatured: true,
      imageUrl: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&q=80',
    },
    {
      name: 'Prawn Katsu Curry',
      description: 'Crispy breaded prawns with Japanese curry sauce, steamed rice and salad',
      priceCents: 1099,
      categoryId: hotDishes.id,
      isFeatured: false,
      imageUrl: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&q=80',
    },
    {
      name: 'Veg Curry',
      description: 'Japanese vegetable curry with steamed rice',
      priceCents: 899,
      categoryId: hotDishes.id,
      isVegetarian: true,
      imageUrl: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600&q=80',
    },
    {
      name: 'Salmon / Chicken Teriyaki',
      description: 'Grilled salmon or chicken glazed with house teriyaki sauce, served with rice and salad',
      priceCents: 1199,
      categoryId: hotDishes.id,
      isFeatured: false,
      imageUrl: 'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=600&q=80',
    },
    {
      name: 'Bento Box',
      description: 'Chef\'s selection bento box with salmon, chicken, rice and sides',
      priceCents: 1299,
      categoryId: hotDishes.id,
      isFeatured: false,
      imageUrl: 'https://images.unsplash.com/photo-1498654200943-1088dd4438ae?w=600&q=80',
    },

    // === RAMEN & NOODLES ===
    {
      name: 'Veg Stir Fried Noodles',
      description: 'Wok-fried egg noodles with fresh seasonal vegetables',
      priceCents: 850,
      categoryId: ramen.id,
      isVegetarian: true,
      imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80',
    },
    {
      name: 'Chicken Stir Fried Noodles',
      description: 'Wok-fried egg noodles with tender chicken and vegetables',
      priceCents: 1050,
      categoryId: ramen.id,
      imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80',
    },
    {
      name: 'Salmon Stir Fried Noodles',
      description: 'Wok-fried egg noodles with fresh salmon and vegetables',
      priceCents: 1050,
      categoryId: ramen.id,
      isFeatured: false,
      imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80',
    },
    {
      name: 'Prawn Noodles',
      description: 'Wok-fried egg noodles with juicy prawns',
      priceCents: 1050,
      categoryId: ramen.id,
      imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80',
    },
    {
      name: 'Chicken Ramen',
      description: 'Rich chicken broth ramen with noodles, soft-boiled egg, nori and spring onion',
      priceCents: 999,
      categoryId: ramen.id,
      isFeatured: true,
      imageUrl: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&q=80',
    },
    {
      name: 'Duck Ramen',
      description: 'Slow-cooked duck in rich ramen broth with noodles and toppings',
      priceCents: 1050,
      categoryId: ramen.id,
      imageUrl: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&q=80',
    },
    {
      name: 'Salmon Ramen',
      description: 'Miso-based ramen with fresh salmon, noodles and seasonal vegetables',
      priceCents: 1050,
      categoryId: ramen.id,
      imageUrl: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&q=80',
    },
    {
      name: 'Veg Ramen',
      description: 'Light vegetable broth ramen with tofu, mushrooms and seasonal greens',
      priceCents: 899,
      categoryId: ramen.id,
      isVegetarian: true,
      imageUrl: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&q=80',
    },

    // === DESSERTS ===
    {
      name: 'Mochi',
      description: 'Traditional Japanese rice cake dessert — choose from matcha, strawberry or vanilla',
      priceCents: 500,
      categoryId: desserts.id,
      isFeatured: false,
      isVegetarian: true,
      imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&q=80',
    },
    {
      name: 'Dorayaki',
      description: 'Japanese pancake sandwich filled with sweet red bean paste',
      priceCents: 450,
      categoryId: desserts.id,
      isVegetarian: true,
      imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&q=80',
    },

    // === EXTRAS ===
    {
      name: 'Plain Rice',
      description: 'Steamed Japanese short grain rice',
      priceCents: 250,
      categoryId: extras.id,
      isVegetarian: true,
      imageUrl: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=600&q=80',
    },
  ];

  for (const item of items) {
    await prisma.menuItem.create({ data: item });
  }
  console.log(`✓ Created ${items.length} menu items`);

  // Restaurant settings
  await prisma.restaurantSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      restaurantName: 'Japanese Yama Sushi',
      restaurantPhone: '+44 20 0000 0000',
      restaurantEmail: 'japaneseyamasushi21@gmail.com',
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
      taxRate: 0.20,
    },
  });
  console.log('✓ Restaurant settings created');
  console.log('✅ Seeding complete!');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
