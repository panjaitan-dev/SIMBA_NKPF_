import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'SIMBA — Sistem Informasi Bank Sampah',
    template: '%s | SIMBA',
  },
  description: 'Portal resmi Sistem Informasi Bank Sampah Dinas Lingkungan Hidup Kabupaten Toba',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SIMBA',
  },
  formatDetection: { telephone: false },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: 'SIMBA - Bank Sampah Toba',
  },
}

export const viewport: Viewport = {
  themeColor: '#10b981',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${plusJakarta.variable} font-sans antialiased bg-slate-50 text-slate-900 overflow-x-hidden`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { fontFamily: 'var(--font-plus-jakarta)', fontSize: '14px' },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  )
}
