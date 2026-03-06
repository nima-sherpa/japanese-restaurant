import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Japanese Restaurant',
}

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation will be added here */}
      <main className="flex-1">
        {children}
      </main>
      {/* Footer will be added here */}
    </div>
  )
}
