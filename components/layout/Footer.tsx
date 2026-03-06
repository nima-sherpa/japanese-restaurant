import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-jp-black text-gray-400 py-12 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <h3 className="text-jp-cream font-serif text-xl mb-4">🍣 Japanese Yama Sushi</h3>
          <p className="text-sm leading-relaxed">
            Freshly made authentic Japanese cuisine.
            Dine-in available for 20+ guests.
          </p>
          <p className="text-sm mt-3">
            📍 6 Trinity St, London, SE1 1DB
          </p>
        </div>

        <div>
          <h4 className="text-jp-cream font-semibold mb-4 tracking-widest text-sm uppercase">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {[
              { href: '/menu', label: 'Our Menu' },
              { href: '/order', label: 'Order Online' },
              { href: '/reservations', label: 'Reserve a Table' },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="hover:text-jp-cream transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-jp-cream font-semibold mb-4 tracking-widest text-sm uppercase">Opening Hours</h4>
          <ul className="space-y-1 text-sm">
            <li className="flex justify-between"><span>Mon–Thu</span><span className="text-jp-cream">11:00 – 22:00</span></li>
            <li className="flex justify-between"><span>Fri–Sat</span><span className="text-jp-cream">11:00 – 23:00</span></li>
            <li className="flex justify-between"><span>Sunday</span><span className="text-jp-cream">11:00 – 22:00</span></li>
          </ul>
          <p className="text-sm mt-4">
            📧 japaneseyamasushi21@gmail.com
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto border-t border-gray-800 mt-10 pt-6 text-center text-xs text-gray-600">
        © {new Date().getFullYear()} Japanese Yama Sushi. All rights reserved.
      </div>
    </footer>
  )
}
