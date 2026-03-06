import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'

const FeaturedItemsGrid = dynamic(
  () => import('@/components/menu/FeaturedItemsGrid'),
  { loading: () => <div className="text-center py-12 text-gray-500">Loading featured dishes...</div> }
)

export const metadata: Metadata = {
  title: 'Japanese Yama Sushi | London',
  description: 'Authentic Japanese sushi, ramen and hot dishes in London',
}

export default function HomePage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/restaurant.webp"
            alt="Japanese Yama Sushi"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-60" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <p className="text-jp-gold text-lg tracking-[0.3em] mb-4 font-light">
            本格日本料理
          </p>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-4 leading-tight">
            Japanese Yama Sushi
          </h1>
          <p className="text-xl text-gray-300 mb-10 font-light tracking-wide">
            Freshly Made Every Day — 6 Trinity St, London
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/menu"
              className="bg-jp-red text-white px-10 py-4 rounded-none font-semibold tracking-widest text-sm hover:bg-red-700 transition-colors uppercase">
              Order Now
            </Link>
            <Link href="/reservations"
              className="border-2 border-white text-white px-10 py-4 rounded-none font-semibold tracking-widest text-sm hover:bg-white hover:text-black transition-colors uppercase">
              Reserve a Table
            </Link>
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white opacity-70 animate-bounce">
          <div className="w-px h-12 bg-white mx-auto mb-2" />
          <p className="text-xs tracking-widest">SCROLL</p>
        </div>
      </section>

      {/* 10% Off Promo Banner */}
      <div className="bg-jp-gold py-5 text-center">
        <p className="text-jp-black font-bold text-lg tracking-wide">
          🎉 ORDER FROM OUR WEBSITE & GET <span className="underline">10% OFF</span> YOUR ENTIRE ORDER!
        </p>
        <p className="text-jp-black text-sm mt-1 opacity-80">Use code <span className="font-bold">WEB10</span> at checkout — exclusive online discount</p>
      </div>

      {/* Banner Strip */}
      <div className="bg-jp-red py-4">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-center gap-8 text-white text-sm tracking-widest">
          <span>🍱 AUTHENTIC RECIPES</span>
          <span>🍣 FRESH DAILY</span>
          <span>🍜 TRADITIONAL METHODS</span>
          <span>🥢 PREMIUM INGREDIENTS</span>
        </div>
      </div>

      {/* Featured Dishes */}
      <section className="py-20 px-4 bg-jp-cream">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-jp-red text-sm tracking-[0.3em] uppercase mb-3">Our Specialties</p>
            <h2 className="text-5xl font-serif font-bold text-jp-black mb-4">Featured Dishes</h2>
            <div className="w-16 h-px bg-jp-red mx-auto" />
          </div>
          <FeaturedItemsGrid />
          <div className="text-center mt-12">
            <Link href="/menu"
              className="inline-block border-2 border-jp-black text-jp-black px-10 py-3 font-semibold tracking-widest text-sm hover:bg-jp-black hover:text-white transition-colors uppercase">
              View Full Menu →
            </Link>
          </div>
        </div>
      </section>

      {/* Split Section: About + Image */}
      <section className="grid md:grid-cols-2 min-h-[500px]">
        <div className="relative">
          <Image
            src="https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=800&q=80"
            alt="Sushi preparation"
            fill
            className="object-cover"
          />
        </div>
        <div className="bg-jp-black flex items-center px-12 py-16">
          <div>
            <p className="text-jp-gold text-sm tracking-[0.3em] uppercase mb-4">Our Story</p>
            <h2 className="text-4xl font-serif font-bold text-white mb-6">
              Freshly Made Every Day
            </h2>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Located at 6 Trinity Street, London, Japanese Yama Sushi brings you
              the finest authentic Japanese cuisine — from our signature salmon boxes
              to traditional ramen and hot dishes.
            </p>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Every dish is freshly prepared daily using premium ingredients,
              with dine-in available for 20+ guests and quick delivery options.
            </p>
            <Link href="/reservations"
              className="inline-block bg-jp-red text-white px-8 py-3 font-semibold tracking-widest text-sm hover:opacity-90 transition-opacity uppercase">
              Book a Table
            </Link>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-jp-red text-sm tracking-[0.3em] uppercase mb-3">The Experience</p>
            <h2 className="text-5xl font-serif font-bold text-jp-black mb-4">Why Sakura?</h2>
            <div className="w-16 h-px bg-jp-red mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: '🍣',
                title: 'Master Chefs',
                desc: 'Our chefs trained in Japan with decades of experience crafting authentic dishes.',
              },
              {
                icon: '🌿',
                title: 'Fresh Ingredients',
                desc: 'We source the freshest fish and vegetables daily from trusted local suppliers.',
              },
              {
                icon: '🏮',
                title: 'Serene Atmosphere',
                desc: 'Dine in our beautifully designed space inspired by traditional Japanese aesthetics.',
              },
            ].map(item => (
              <div key={item.title} className="text-center">
                <div className="text-5xl mb-5">{item.icon}</div>
                <h3 className="text-xl font-serif font-bold text-jp-black mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-jp-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-jp-gold text-sm tracking-[0.3em] uppercase mb-3">What Our Guests Say</p>
            <h2 className="text-5xl font-serif font-bold text-white mb-4">Reviews</h2>
            <div className="flex justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => <span key={i} className="text-jp-gold text-xl">★</span>)}
            </div>
            <p className="text-gray-400 text-sm">5.0 on Google</p>
            <div className="w-16 h-px bg-jp-gold mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah M.',
                stars: 5,
                text: 'Absolutely amazing food! The salmon sushi boxes are the best I\'ve had in London. Fresh, beautifully presented and great value. Will definitely be back!',
              },
              {
                name: 'James T.',
                stars: 5,
                text: 'The ramen here is outstanding — rich broth, perfectly cooked noodles. Staff are so friendly and the atmosphere is lovely. Highly recommend!',
              },
              {
                name: 'Priya K.',
                stars: 5,
                text: 'We came for a group dinner and everyone loved it. The hot dishes are incredible and the sushi is so fresh. Authentic Japanese experience in London.',
              },
            ].map(review => (
              <div key={review.name} className="bg-white/5 border border-white/10 p-8">
                <div className="flex gap-1 mb-4">
                  {[...Array(review.stars)].map((_, i) => <span key={i} className="text-jp-gold">★</span>)}
                </div>
                <p className="text-gray-300 leading-relaxed mb-6 italic">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-jp-gold/20 flex items-center justify-center text-jp-gold font-bold">
                    {review.name[0]}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{review.name}</p>
                    <p className="text-gray-500 text-xs">Google Review</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=1920&q=80"
            alt="Japanese restaurant interior"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-70" />
        </div>
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <p className="text-jp-gold text-sm tracking-[0.3em] uppercase mb-4">Join Us Tonight</p>
          <h2 className="text-5xl font-serif font-bold text-white mb-6">
            Reserve Your Table
          </h2>
          <p className="text-gray-300 mb-10 text-lg">
            Experience the art of Japanese cuisine. Reservations recommended.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/reservations"
              className="bg-jp-red text-white px-10 py-4 font-semibold tracking-widest text-sm hover:opacity-90 transition-opacity uppercase">
              Make a Reservation
            </Link>
            <Link href="/menu"
              className="border-2 border-white text-white px-10 py-4 font-semibold tracking-widest text-sm hover:bg-white hover:text-black transition-colors uppercase">
              Browse Menu
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
