'use client'

import { redirect, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getSession } from 'next-auth/react'

const navItems = [
  { href: '/dashboard', label: '📊 Dashboard' },
  { href: '/dashboard/orders', label: '📦 Orders' },
  { href: '/dashboard/reservations', label: '📅 Reservations' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top bar (mobile) / Sidebar toggle */}
      <div className="lg:hidden bg-jp-black text-white flex items-center justify-between px-4 py-3 sticky top-0 z-30">
        <p className="font-serif font-bold text-lg">🍣 Yama Sushi</p>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded hover:bg-gray-800">
          {mobileOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-jp-black text-gray-300 px-4 py-3 space-y-1 sticky top-14 z-20">
          {navItems.map(({ href, label }) => (
            <Link key={href} href={href}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-sm transition-colors ${pathname === href ? 'bg-jp-red text-white' : 'hover:bg-gray-800 hover:text-white'}`}>
              {label}
            </Link>
          ))}
          <div className="border-t border-gray-800 pt-2 mt-2 flex gap-4">
            <Link href="/" className="text-xs text-gray-500 hover:text-white">← View Site</Link>
            <Link href="/api/auth/signout" className="text-xs text-red-400 hover:text-red-300">Sign Out</Link>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Sidebar (desktop) */}
        <aside className="hidden lg:flex w-56 bg-jp-black text-gray-300 flex-col min-h-screen sticky top-0">
          <div className="p-5 border-b border-gray-800">
            <p className="text-white font-serif font-bold text-lg">🍣 Yama Sushi</p>
            <p className="text-xs text-gray-500 mt-1">Admin Dashboard</p>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map(({ href, label }) => (
              <Link key={href} href={href}
                className={`block px-4 py-2.5 rounded-lg text-sm transition-colors ${pathname === href ? 'bg-jp-red text-white' : 'hover:bg-gray-800 hover:text-white'}`}>
                {label}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-800">
            <Link href="/" className="block text-xs text-gray-500 hover:text-white mb-2">← View Site</Link>
            <Link href="/api/auth/signout" className="block text-xs text-red-400 hover:text-red-300">Sign Out</Link>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
}
