import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/login')

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-56 bg-jp-black text-gray-300 flex flex-col">
        <div className="p-5 border-b border-gray-800">
          <p className="text-white font-serif font-bold text-lg">🍣 Yama Sushi</p>
          <p className="text-xs text-gray-500 mt-1">Admin Dashboard</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[
            { href: '/dashboard', label: '📊 Dashboard' },
            { href: '/dashboard/orders', label: '📦 Orders' },
            { href: '/dashboard/reservations', label: '📅 Reservations' },
            { href: '/dashboard/menu', label: '🍱 Menu' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="block px-4 py-2.5 rounded-lg text-sm hover:bg-gray-800 hover:text-white transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <Link href="/" className="block text-xs text-gray-500 hover:text-white mb-2">← View Site</Link>
          <Link href="/api/auth/signout" className="block text-xs text-red-400 hover:text-red-300">Sign Out</Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
