'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-jp-black bg-opacity-95 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.webp" alt="Japanese Yama Sushi" width={44} height={44} className="object-contain" />
          <span className="text-jp-cream font-serif font-bold text-lg leading-tight hidden sm:block">
            Japanese Yama Sushi
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { href: '/menu', label: 'Menu' },
            { href: '/order', label: 'Order' },
            { href: '/reservations', label: 'Reservations' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-gray-300 hover:text-jp-cream text-sm tracking-widest uppercase transition-colors"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/order"
            className="bg-jp-red text-white px-6 py-2 text-sm tracking-widest uppercase hover:opacity-90 transition-opacity"
          >
            Order Now
          </Link>
        </div>

        {/* Mobile */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-jp-cream">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-jp-black border-t border-gray-800 px-4 py-4 space-y-4">
          {[
            { href: '/menu', label: 'Menu' },
            { href: '/order', label: 'Order Online' },
            { href: '/reservations', label: 'Reservations' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block text-gray-300 hover:text-white py-2 text-sm tracking-widest uppercase"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
