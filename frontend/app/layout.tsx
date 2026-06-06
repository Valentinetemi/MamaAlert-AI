import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MamaAlert AI - Maternal Health Emergency Detection',
  description: 'Advanced AI-powered maternal health monitoring and emergency detection system. Get real-time risk assessment and immediate access to healthcare services.',
 
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#FFF5F5',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-[#FFF5F5]">
      <body className="font-sans antialiased bg-[#FFF5F5]">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
