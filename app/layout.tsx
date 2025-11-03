import type { Metadata } from 'next'
import AuthCapsule from '@/components/AuthCapsule'
import './globals.css'

export const metadata: Metadata = {
  title: 'App',
  description: 'App with Auth Capsule',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthCapsule />
        {children}
      </body>
    </html>
  )
}
