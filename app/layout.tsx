import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers/session-provider'
import { Navbar } from '@/components/navbar'  // ✅ Import Navbar

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FoodOrder - Student Food Ordering System',
  description: 'Simple and beautiful food ordering system for students',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* ✅ Navbar always visible */}
            {/* <Navbar /> */}

            {/* ✅ Page Content */}
            <main className="flex-grow">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
