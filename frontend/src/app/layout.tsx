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
    default: 'SIMBA — Sistem Informasi Bank Sampah Indonesia',
    template: '%s | SIMBA Indonesia',
  },
  description: 'Sistem Informasi Bank Sampah Indonesia — Platform Pengelolaan Bank Sampah dan Ekonomi Sirkular Berkelanjutan (Pilot Sumatera Utara)',
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
    siteName: 'SIMBA — Sistem Informasi Bank Sampah Indonesia',
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
