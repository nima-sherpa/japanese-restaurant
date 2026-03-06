import type { Metadata } from 'next'
import { Noto_Serif_JP, Inter } from 'next/font/google'
import './globals.css'

const notoSerifJp = Noto_Serif_JP({
  subsets: ['latin', 'japanese'],
  variable: '--font-noto-serif-jp',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Japanese Restaurant',
  description: 'Experience authentic Japanese cuisine',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${notoSerifJp.variable} ${inter.variable}`}>
        {children}
      </body>
    </html>
  )
}
