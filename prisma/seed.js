const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Curated Unsplash images per food type
const IMG = {
  edamame:      'https://images.unsplash.com/photo-1562802378-063ec186a863?w=600&q=80',
  misosoup:     'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80',
  karaage:      'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&q=80',
  springroll:   'https://images.unsplash.com/photo-1548940740-204726a19be3?w=600&q=80',
  prawnkatsu:   'https://images.unsplash.com/photo-1617196034096-2186592926b4?w=600&q=80',
  korokke:      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80',
  sashimi:      'https://images.unsplash.com/photo-1617196034096-2186592926b4?w=600&q=80',
  salmonSashi:  'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=600&q=80',
  tataki:       'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=600&q=80',
  gyoza:        'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80',
  poke:         'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',
  salad:        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',
  maki:         'https://images.unsplash.com/photo-1562802378-063ec186a863?w=600&q=80',
  salmonMaki:   'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=600&q=80',
  tunaMaki:     'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80',
  uramaki:      'https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?w=600&q=80',
  californiaRoll:'https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&q=80',
  futomaki:     'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=600&q=80',
  sigRoll:      'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=600&q=80',
  dragonRoll:   'https://images.unsplash.com/photo-1617196035154-1e7e6e28b0db?w=600&q=80',
  spicyRoll:    'https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&q=80',
  temaki:       'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=600&q=80',
  crunchy:      'https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?w=600&q=80',
  nigiri:       'https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&q=80',
  salmonNigiri: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=600&q=80',
  sushiBox:     'https://images.unsplash.com/photo-1617196034096-2186592926b4?w=600&q=80',
  platter:      'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=600&q=80',
  bigPlatter:   'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=600&q=80',
  katsuCurry:   'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&q=80',
  teriyaki:     'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=600&q=80',
  vegCurry:     'https://images.unsplash.com/photo-1548940740-204726a19be3?w=600&q=80',
  ramen:        'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80',
  noodles:      'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&q=80',
  mochi:        'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&q=80',
  dorayaki:     'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&q=80',
  rice:         'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=600&q=80',
  sauce:        'https://images.unsplash.com/photo-1562802378-063ec186a863?w=600&q=80',
};

async function main() {
  console.log('Seeding database...');

  const adminPassword = await bcrypt.hash('Admin@123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@restaurant.local' },
    update: {},
    create: { email: 'admin@restaurant.local', passwordHash: adminPassword, role: 'admin' },
  });
  console.log('✓ Admin user created');

  // Clear in dependency order
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();
  console.log('✓ Cleared existing data');

  const appetisers     = await prisma.category.create({ data: { name: 'Appetisers',           description: 'Starters and snacks',             displayOrder: 1  } });
  const sashimi        = await prisma.category.create({ data: { name: 'Sashimi',              description: '5 pieces of fresh sliced fish',   displayOrder: 2  } });
  const gyoza          = await prisma.category.create({ data: { name: 'Gyoza',                description: 'Pan-fried dumplings',             displayOrder: 3  } });
  const saladPoke      = await prisma.category.create({ data: { name: 'Salad & Poke',         description: 'Fresh salads and poke bowls',     displayOrder: 4  } });
  const maki           = await prisma.category.create({ data: { name: 'Maki',                 description: '6 pieces',                        displayOrder: 5  } });
  const uriMaki        = await prisma.category.create({ data: { name: 'Uri Maki',             description: '8 pieces',                        displayOrder: 6  } });
  const futomaki       = await prisma.category.create({ data: { name: 'Futomaki',             description: '6 pieces',                        displayOrder: 7  } });
  const signatureRolls = await prisma.category.create({ data: { name: 'Signature Rolls',      description: 'Our special signature rolls',     displayOrder: 8  } });
  const temaki         = await prisma.category.create({ data: { name: 'Temaki / Hand Roll',   description: '2 pieces',                        displayOrder: 9  } });
  const crunchyRolls   = await prisma.category.create({ data: { name: 'Super Crunchy Rolls',  description: '6 pieces',                        displayOrder: 10 } });
  const nigiri         = await prisma.category.create({ data: { name: 'Nigiri',               description: '2 pieces',                        displayOrder: 11 } });
  const sushiBoxes     = await prisma.category.create({ data: { name: 'Sushi Boxes',          description: 'Sushi boxes and platters',        displayOrder: 12 } });
  const hotDishes      = await prisma.category.create({ data: { name: 'Hot Dishes',           description: 'Hot mains',                       displayOrder: 13 } });
  const noodlesSoup    = await prisma.category.create({ data: { name: 'Noodles & Soup',       description: 'Noodles, ramen and soups',        displayOrder: 14 } });
  const desserts       = await prisma.category.create({ data: { name: 'Desserts',             description: 'Sweet treats',                    displayOrder: 15 } });
  const extra          = await prisma.category.create({ data: { name: 'Extra',                description: 'Sauces and sides',                displayOrder: 16 } });
  console.log('✓ Categories created');

  const items = [
    // ── APPETISERS ──────────────────────────────────────────────────────────
    { name: 'Edamame',           description: 'Steamed soybeans with sea salt',             priceCents: 299,  categoryId: appetisers.id, isVegetarian: true,  imageUrl: IMG.edamame },
    { name: 'Spicy Edamame',     description: 'Steamed soybeans with spicy seasoning',      priceCents: 350,  categoryId: appetisers.id, isVegetarian: true,  isSpicy: true, imageUrl: IMG.edamame },
    { name: 'Prawn Katsu',       description: 'Crispy battered king prawns',                priceCents: 999,  categoryId: appetisers.id, imageUrl: IMG.prawnkatsu },
    { name: 'Spring Roll',       description: 'Crispy vegetable spring rolls',              priceCents: 550,  categoryId: appetisers.id, isVegetarian: true,  imageUrl: IMG.springroll },
    { name: 'Pumpkin Korokke',   description: 'Japanese-style pumpkin croquettes',          priceCents: 650,  categoryId: appetisers.id, isVegetarian: true,  imageUrl: IMG.korokke },
    { name: 'Miso Soup',         description: 'Traditional Japanese soup with miso paste',  priceCents: 250,  categoryId: appetisers.id, isVegetarian: true,  imageUrl: IMG.misosoup },
    { name: 'Chicken Karaage',   description: 'Japanese fried chicken, crispy and juicy',   priceCents: 750,  categoryId: appetisers.id, isFeatured: true,    imageUrl: IMG.karaage },

    // ── SASHIMI (5 pcs) ─────────────────────────────────────────────────────
    { name: 'Salmon Sashimi',    description: '5 pieces of fresh Atlantic salmon',          priceCents: 650,  categoryId: sashimi.id, isFeatured: true, imageUrl: IMG.salmonSashi },
    { name: 'Tuna Sashimi',      description: '5 pieces of fresh tuna',                     priceCents: 690,  categoryId: sashimi.id, imageUrl: IMG.sashimi },
    { name: 'Sashimi Hamachi',   description: '5 pieces of fresh yellowtail',               priceCents: 750,  categoryId: sashimi.id, imageUrl: IMG.sashimi },
    { name: 'Tataki Mix',        description: 'Seared mixed fish tataki',                   priceCents: 1300, categoryId: sashimi.id, imageUrl: IMG.tataki },
    { name: 'Tataki Salmon',     description: 'Lightly seared salmon with ponzu',           priceCents: 875,  categoryId: sashimi.id, imageUrl: IMG.tataki },
    { name: 'Tataki Tuna',       description: 'Lightly seared tuna with ponzu',             priceCents: 955,  categoryId: sashimi.id, imageUrl: IMG.tataki },
    { name: 'Sashimi Mix',       description: 'Mixed selection of fresh sashimi',           priceCents: 1550, categoryId: sashimi.id, isFeatured: true, imageUrl: IMG.salmonSashi },

    // ── GYOZA ───────────────────────────────────────────────────────────────
    { name: 'Vegetable Gyoza',   description: 'Pan-fried vegetable dumplings',              priceCents: 550,  categoryId: gyoza.id, isVegetarian: true, imageUrl: IMG.gyoza },
    { name: 'Chicken Gyoza',     description: 'Pan-fried chicken dumplings',                priceCents: 650,  categoryId: gyoza.id, imageUrl: IMG.gyoza },
    { name: 'Prawn Gyoza',       description: 'Pan-fried prawn dumplings',                  priceCents: 750,  categoryId: gyoza.id, imageUrl: IMG.gyoza },
    { name: 'Duck Gyoza',        description: 'Pan-fried duck dumplings',                   priceCents: 750,  categoryId: gyoza.id, imageUrl: IMG.gyoza },

    // ── SALAD & POKE ────────────────────────────────────────────────────────
    { name: 'Kaiso Salad',           description: 'Japanese seaweed salad',                        priceCents: 650,  categoryId: saladPoke.id, isVegetarian: true, imageUrl: IMG.salad },
    { name: 'Salmon Poke',           description: 'Fresh salmon poke bowl with rice and toppings', priceCents: 999,  categoryId: saladPoke.id, isFeatured: true,   imageUrl: IMG.poke },
    { name: 'Tuna Poke',             description: 'Fresh tuna poke bowl with rice and toppings',   priceCents: 1150, categoryId: saladPoke.id, imageUrl: IMG.poke },
    { name: 'Chicken Katsu Salad',   description: 'Crispy chicken katsu on a fresh salad',         priceCents: 950,  categoryId: saladPoke.id, imageUrl: IMG.salad },

    // ── MAKI (6 pcs) ────────────────────────────────────────────────────────
    { name: 'Cucumber Maki',     description: 'Classic cucumber roll (6 pcs)',              priceCents: 350,  categoryId: maki.id, isVegetarian: true, imageUrl: IMG.maki },
    { name: 'Avocado Maki',      description: 'Fresh avocado roll (6 pcs)',                 priceCents: 450,  categoryId: maki.id, isVegetarian: true, imageUrl: IMG.maki },
    { name: 'Salmon Maki',       description: 'Fresh salmon roll (6 pcs)',                  priceCents: 550,  categoryId: maki.id, imageUrl: IMG.salmonMaki },
    { name: 'Tuna Maki',         description: 'Fresh tuna roll (6 pcs)',                    priceCents: 575,  categoryId: maki.id, imageUrl: IMG.tunaMaki },
    { name: 'Spicy Tuna Maki',   description: 'Tuna with spicy sauce (6 pcs)',              priceCents: 599,  categoryId: maki.id, isSpicy: true, imageUrl: IMG.tunaMaki },

    // ── URI MAKI (8 pcs) ────────────────────────────────────────────────────
    { name: 'Salmon Avocado Roll',        description: 'Salmon and avocado inside-out roll (8 pcs)',    priceCents: 680,  categoryId: uriMaki.id, imageUrl: IMG.salmonMaki },
    { name: 'California Roll',            description: 'Crab, avocado and cucumber (8 pcs)',            priceCents: 680,  categoryId: uriMaki.id, imageUrl: IMG.californiaRoll },
    { name: 'Spicy Tuna Cucumber Roll',   description: 'Spicy tuna and cucumber (8 pcs)',               priceCents: 750,  categoryId: uriMaki.id, isSpicy: true, imageUrl: IMG.spicyRoll },
    { name: 'Salmon Skin Cucumber Roll',  description: 'Crispy salmon skin and cucumber (8 pcs)',       priceCents: 680,  categoryId: uriMaki.id, imageUrl: IMG.uramaki },
    { name: 'Prawn Katsu Avocado Roll',   description: 'Crispy prawn katsu with avocado (8 pcs)',       priceCents: 800,  categoryId: uriMaki.id, imageUrl: IMG.uramaki },
    { name: 'Spicy Salmon Roll',          description: 'Spicy salmon inside-out roll (8 pcs)',          priceCents: 750,  categoryId: uriMaki.id, isSpicy: true, imageUrl: IMG.spicyRoll },
    { name: 'Duck Cucumber Roll',         description: 'Duck and cucumber inside-out roll (8 pcs)',     priceCents: 750,  categoryId: uriMaki.id, imageUrl: IMG.uramaki },
    { name: 'Grill Salmon Roll',          description: 'Grilled salmon roll (8 pcs)',                   priceCents: 680,  categoryId: uriMaki.id, imageUrl: IMG.salmonMaki },
    { name: 'Chicken Katsu Avocado Roll', description: 'Crispy chicken katsu with avocado (8 pcs)',     priceCents: 650,  categoryId: uriMaki.id, imageUrl: IMG.uramaki },

    // ── FUTOMAKI (6 pcs) ────────────────────────────────────────────────────
    { name: 'Chicken Katsu Futomaki',   description: 'Chicken katsu thick roll (6 pcs)',       priceCents: 850,  categoryId: futomaki.id, imageUrl: IMG.futomaki },
    { name: 'Softshell Crab Futomaki',  description: 'Softshell crab thick roll (6 pcs)',      priceCents: 950,  categoryId: futomaki.id, imageUrl: IMG.futomaki },
    { name: 'Eel Futomaki',             description: 'Eel thick roll (6 pcs)',                  priceCents: 950,  categoryId: futomaki.id, imageUrl: IMG.futomaki },
    { name: 'Salmon Avocado Futomaki',  description: 'Salmon and avocado thick roll (6 pcs)',   priceCents: 850,  categoryId: futomaki.id, imageUrl: IMG.futomaki },
    { name: 'Prawn Katsu Futomaki',     description: 'Crispy prawn katsu thick roll (6 pcs)',   priceCents: 899,  categoryId: futomaki.id, imageUrl: IMG.futomaki },

    // ── SIGNATURE ROLLS ─────────────────────────────────────────────────────
    { name: 'Spider Roll',                      description: 'Softshell crab with avocado and spicy mayo',        priceCents: 1250, categoryId: signatureRolls.id, isFeatured: true, imageUrl: IMG.dragonRoll },
    { name: 'Special Salmon Roll',              description: 'Signature salmon roll with special sauce',          priceCents: 1299, categoryId: signatureRolls.id, isFeatured: true, imageUrl: IMG.sigRoll },
    { name: 'Special Red Dragon',               description: 'Spicy signature roll with red dragon sauce',        priceCents: 1250, categoryId: signatureRolls.id, isSpicy: true,    imageUrl: IMG.dragonRoll },
    { name: 'Spicy Rainbow Roll',               description: 'Colourful roll with spicy mixed fish',              priceCents: 1199, categoryId: signatureRolls.id, isSpicy: true,    imageUrl: IMG.spicyRoll },
    { name: 'Special Yama',                     description: 'Our signature Yama roll (8 pcs)',                   priceCents: 1199, categoryId: signatureRolls.id, isFeatured: true, imageUrl: IMG.sigRoll },
    { name: 'El Dragon',                        description: 'Special dragon roll with avocado and eel (8 pcs)',  priceCents: 1250, categoryId: signatureRolls.id, isFeatured: true, imageUrl: IMG.dragonRoll },
    { name: 'California Dream',                 description: 'Premium California-style signature roll (8 pcs)',   priceCents: 1199, categoryId: signatureRolls.id,                   imageUrl: IMG.californiaRoll },
    { name: 'Ceviche Mix',                      description: 'Fresh ceviche-style mixed roll',                    priceCents: 1950, categoryId: signatureRolls.id,                   imageUrl: IMG.sigRoll },
    { name: 'Kapachi Salmon Special Sushi Set',  description: 'Special Kapachi salmon sushi set',                 priceCents: 1399, categoryId: signatureRolls.id, isFeatured: true, imageUrl: IMG.salmonSashi },
    { name: 'Special Everest',                  description: 'Signature Everest roll',                            priceCents: 1250, categoryId: signatureRolls.id,                   imageUrl: IMG.sigRoll },
    { name: 'Special Green Dragon',             description: 'Green dragon signature roll',                       priceCents: 1250, categoryId: signatureRolls.id,                   imageUrl: IMG.dragonRoll },

    // ── TEMAKI / HAND ROLL (2 pcs) ──────────────────────────────────────────
    { name: 'Salmon Avocado Temaki',   description: 'Salmon and avocado hand roll (2 pcs)',      priceCents: 550,  categoryId: temaki.id, imageUrl: IMG.temaki },
    { name: 'Spicy Tuna Temaki',       description: 'Spicy tuna hand roll (2 pcs)',               priceCents: 590,  categoryId: temaki.id, isSpicy: true, imageUrl: IMG.temaki },
    { name: 'Prawn Katsu Temaki',      description: 'Crispy prawn katsu hand roll (2 pcs)',       priceCents: 575,  categoryId: temaki.id, imageUrl: IMG.temaki },
    { name: 'California Temaki',       description: 'California-style hand roll (2 pcs)',         priceCents: 575,  categoryId: temaki.id, imageUrl: IMG.temaki },
    { name: 'Soft Shell Crab Temaki',  description: 'Softshell crab hand roll (2 pcs)',           priceCents: 575,  categoryId: temaki.id, imageUrl: IMG.temaki },
    { name: 'Spicy Salmon Temaki',     description: 'Spicy salmon hand roll (2 pcs)',             priceCents: 675,  categoryId: temaki.id, isSpicy: true, imageUrl: IMG.temaki },
    { name: 'Salmon Cheese Temaki',    description: 'Salmon and cream cheese hand roll (2 pcs)',  priceCents: 675,  categoryId: temaki.id, imageUrl: IMG.temaki },

    // ── SUPER CRUNCHY ROLLS (6 pcs) ─────────────────────────────────────────
    { name: 'Veg Crunchy Roll',  description: 'Crispy vegetable crunchy roll (6 pcs)',     priceCents: 850,  categoryId: crunchyRolls.id, isVegetarian: true, imageUrl: IMG.crunchy },
    { name: 'Crunchy Salmon',    description: 'Crispy salmon crunchy roll (6 pcs)',        priceCents: 850,  categoryId: crunchyRolls.id, imageUrl: IMG.crunchy },
    { name: 'Crunchy Tuna',      description: 'Crispy tuna crunchy roll (6 pcs)',          priceCents: 1050, categoryId: crunchyRolls.id, imageUrl: IMG.crunchy },
    { name: 'Crunchy Duck',      description: 'Crispy duck crunchy roll (6 pcs)',          priceCents: 875,  categoryId: crunchyRolls.id, imageUrl: IMG.crunchy },
    { name: 'Crunchy Chicken',   description: 'Crispy chicken crunchy roll (6 pcs)',       priceCents: 850,  categoryId: crunchyRolls.id, imageUrl: IMG.crunchy },
    { name: 'Dragon Eye',        description: 'Signature dragon eye crunchy roll (6 pcs)', priceCents: 950,  categoryId: crunchyRolls.id, isFeatured: true, imageUrl: IMG.dragonRoll },

    // ── NIGIRI (2 pcs) ──────────────────────────────────────────────────────
    { name: 'Nigiri Eel',      description: 'Eel nigiri (2 pcs)',               priceCents: 500,  categoryId: nigiri.id, imageUrl: IMG.nigiri },
    { name: 'Tuna Nigiri',     description: 'Tuna nigiri (2 pcs)',              priceCents: 450,  categoryId: nigiri.id, imageUrl: IMG.nigiri },
    { name: 'Nigiri Prawn',    description: 'Prawn nigiri (2 pcs)',             priceCents: 450,  categoryId: nigiri.id, imageUrl: IMG.nigiri },
    { name: 'Nigiri Salmon',   description: 'Salmon nigiri (2 pcs)',            priceCents: 424,  categoryId: nigiri.id, imageUrl: IMG.salmonNigiri },
    { name: 'Nigiri Hamachi',  description: 'Yellowtail nigiri (2 pcs)',        priceCents: 450,  categoryId: nigiri.id, imageUrl: IMG.nigiri },
    { name: 'Nigiri Mix',      description: 'Mixed nigiri selection (10 pcs)',  priceCents: 1450, categoryId: nigiri.id, isFeatured: true, imageUrl: IMG.nigiri },

    // ── SUSHI BOXES ─────────────────────────────────────────────────────────
    { name: 'Scot Salmon Box',             description: 'Scottish salmon sushi box',                                                                                                        priceCents: 1299, categoryId: sushiBoxes.id, isFeatured: true, imageUrl: IMG.sushiBox },
    { name: 'Sushi Selection',             description: 'Mixed sushi selection box',                                                                                                        priceCents: 1299, categoryId: sushiBoxes.id,                   imageUrl: IMG.sushiBox },
    { name: 'Salmon Box 18pcs',            description: '18 pieces of salmon sushi',                                                                                                        priceCents: 1599, categoryId: sushiBoxes.id, isFeatured: true, imageUrl: IMG.sushiBox },
    { name: 'Selection Box 14pcs',         description: '14 pieces mixed sushi selection',                                                                                                  priceCents: 1599, categoryId: sushiBoxes.id,                   imageUrl: IMG.sushiBox },
    { name: 'Maki Mix',                    description: 'Mixed maki box',                                                                                                                   priceCents: 1299, categoryId: sushiBoxes.id,                   imageUrl: IMG.sushiBox },
    { name: 'Maxsi Maki 20pcs',            description: '20 pieces of mixed maki',                                                                                                          priceCents: 1650, categoryId: sushiBoxes.id,                   imageUrl: IMG.sushiBox },
    { name: 'Omega Box 20pcs',             description: '20 pieces omega sushi box',                                                                                                        priceCents: 1299, categoryId: sushiBoxes.id,                   imageUrl: IMG.sushiBox },
    { name: 'Vegan Box 14pcs',             description: '14 pieces vegan sushi box',                                                                                                        priceCents: 1199, categoryId: sushiBoxes.id, isVegetarian: true, imageUrl: IMG.sushiBox },
    { name: 'Hot Box 10pcs',               description: '10 pieces hot sushi box',                                                                                                          priceCents: 1299, categoryId: sushiBoxes.id,                   imageUrl: IMG.sushiBox },
    { name: 'Everest Box 32pcs',           description: '32 pieces Everest sushi box',                                                                                                      priceCents: 3199, categoryId: sushiBoxes.id,                   imageUrl: IMG.platter },
    { name: 'Deluxe Platter 33pcs',        description: '33 pieces deluxe sushi platter',                                                                                                   priceCents: 2999, categoryId: sushiBoxes.id, isFeatured: true, imageUrl: IMG.bigPlatter },
    { name: 'Rembo Platter 36pcs',         description: '36 pieces Rembo sushi platter',                                                                                                    priceCents: 3750, categoryId: sushiBoxes.id,                   imageUrl: IMG.bigPlatter },
    { name: 'Special Yama Deluxe 53pcs',   description: '53 pcs: 8 Special Yama, 8 California Dream, 8 Kapachi Salmon, 8 Rembo Special, 4 Salmon Avocado Hot, 5 Prawn Tempura Avocado, 4 Sashimi Tuna, 4 Sashimi Salmon, 3 Hamachi', priceCents: 4950, categoryId: sushiBoxes.id, isFeatured: true, imageUrl: IMG.bigPlatter },
    { name: 'Special Platter',             description: 'Our ultimate special sushi platter — feeds 4 comfortably',                                                                         priceCents: 5499, categoryId: sushiBoxes.id, isFeatured: true, imageUrl: IMG.bigPlatter },
    { name: 'Tuna Box 18pcs',              description: '18 pieces of fresh tuna sushi',                                                                                                    priceCents: 1850, categoryId: sushiBoxes.id,                   imageUrl: IMG.sushiBox },

    // ── HOT DISHES ──────────────────────────────────────────────────────────
    { name: 'Chicken Katsu Curry',  description: 'Crispy chicken katsu with Japanese curry sauce and rice',  priceCents: 999,  categoryId: hotDishes.id, isFeatured: true, imageUrl: IMG.katsuCurry },
    { name: 'Prawn Katsu Curry',    description: 'Crispy prawn katsu with Japanese curry sauce and rice',    priceCents: 1099, categoryId: hotDishes.id,                   imageUrl: IMG.katsuCurry },
    { name: 'Vegetable Curry',      description: 'Japanese vegetable curry with rice',                       priceCents: 899,  categoryId: hotDishes.id, isVegetarian: true, imageUrl: IMG.vegCurry },
    { name: 'Salmon Teriyaki',      description: 'Glazed salmon fillet with teriyaki sauce and rice',        priceCents: 1199, categoryId: hotDishes.id, isFeatured: true, imageUrl: IMG.teriyaki },

    // ── NOODLES & SOUP ──────────────────────────────────────────────────────
    { name: 'Vegan Stir Fried Noodles',    description: 'Stir fried noodles with fresh vegetables',  priceCents: 850,  categoryId: noodlesSoup.id, isVegetarian: true, imageUrl: IMG.noodles },
    { name: 'Chicken Stir Fried Noodles',  description: 'Stir fried noodles with chicken',           priceCents: 950,  categoryId: noodlesSoup.id,                     imageUrl: IMG.noodles },
    { name: 'Salmon Stir Fried Noodles',   description: 'Stir fried noodles with salmon',            priceCents: 1050, categoryId: noodlesSoup.id,                     imageUrl: IMG.noodles },
    { name: 'Prawn Noodles',               description: 'Stir fried noodles with king prawns',       priceCents: 1050, categoryId: noodlesSoup.id,                     imageUrl: IMG.noodles },
    { name: 'Chicken Ramen',               description: 'Rich ramen broth with chicken and noodles', priceCents: 999,  categoryId: noodlesSoup.id, isFeatured: true,   imageUrl: IMG.ramen },
    { name: 'Salmon Ramen',                description: 'Rich ramen broth with salmon and noodles',  priceCents: 1050, categoryId: noodlesSoup.id,                     imageUrl: IMG.ramen },
    { name: 'Duck Ramen',                  description: 'Rich ramen broth with duck and noodles',    priceCents: 1050, categoryId: noodlesSoup.id,                     imageUrl: IMG.ramen },
    { name: 'Vegetable Ramen',             description: 'Rich vegetable ramen broth with noodles',   priceCents: 899,  categoryId: noodlesSoup.id, isVegetarian: true, imageUrl: IMG.ramen },

    // ── DESSERTS ────────────────────────────────────────────────────────────
    { name: 'Dorayaki',  description: 'Japanese pancake sandwich with sweet red bean paste', priceCents: 450, categoryId: desserts.id, isVegetarian: true,                   imageUrl: IMG.dorayaki },
    { name: 'Mochi',     description: 'Traditional Japanese rice cake with sweet filling',   priceCents: 550, categoryId: desserts.id, isVegetarian: true, isFeatured: true, imageUrl: IMG.mochi },

    // ── EXTRA ────────────────────────────────────────────────────────────────
    { name: 'Plain Rice',      description: 'Steamed Japanese rice',   priceCents: 250, categoryId: extra.id, isVegetarian: true,               imageUrl: IMG.rice },
    { name: 'Curry Sauce',     description: 'Japanese curry sauce',    priceCents: 250, categoryId: extra.id, isVegetarian: true,               imageUrl: IMG.sauce },
    { name: 'Ginger',          description: 'Pickled ginger',          priceCents: 150, categoryId: extra.id, isVegetarian: true,               imageUrl: IMG.sauce },
    { name: 'Wasabi',          description: 'Fresh wasabi',            priceCents: 150, categoryId: extra.id, isVegetarian: true,               imageUrl: IMG.sauce },
    { name: 'Spicy Mayo',      description: 'Spicy mayonnaise sauce',  priceCents: 150, categoryId: extra.id, isVegetarian: true, isSpicy: true, imageUrl: IMG.sauce },
    { name: 'Soya Sauce',      description: 'Japanese soy sauce',      priceCents: 150, categoryId: extra.id, isVegetarian: true,               imageUrl: IMG.sauce },
    { name: 'Teriyaki Sauce',  description: 'Sweet teriyaki sauce',    priceCents: 150, categoryId: extra.id, isVegetarian: true,               imageUrl: IMG.sauce },
    { name: 'Unagi Sauce',     description: 'Sweet eel sauce',         priceCents: 150, categoryId: extra.id,                                   imageUrl: IMG.sauce },
    { name: 'Chilli Sauce',    description: 'Hot chilli sauce',        priceCents: 150, categoryId: extra.id, isVegetarian: true, isSpicy: true, imageUrl: IMG.sauce },
  ];

  for (const item of items) {
    await prisma.menuItem.create({ data: item });
  }
  console.log(`✓ Created ${items.length} menu items with images`);

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
      restaurantPhone: '+44 20 0000 0000',
      restaurantEmail: 'japaneseyamasushi21@gmail.com',
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
  });
  console.log('✓ Restaurant settings updated');
  console.log('✅ Seeding complete!');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
