import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const plusJakarta = localFont({
  src: './fonts/plus-jakarta-sans.woff2',
  variable: '--font-plus-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'SIMBA — Sistem Informasi Bank Sampah Indonesia (Prototipe)',
    template: '%s | SIMBA Indonesia',
  },
  description: 'SIMBA Nusantara — Prototipe Platform Digital Pelayanan Publik & Pengelolaan Bank Sampah (Karya Simulasi Lomba IT Fest 2026)',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SIMBA Indonesia',
  },
  formatDetection: { telephone: false },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: 'SIMBA Nusantara — Prototipe Simulasi IT Fest 2026',
  },
}

export const viewport: Viewport = {
  themeColor: '#10b981',
  width: 'device-width',
  initialScale: 1,
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
