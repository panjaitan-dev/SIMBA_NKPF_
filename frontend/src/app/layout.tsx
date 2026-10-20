import type { Metadata, Viewport } from 'next'
import { Fraunces, JetBrains_Mono } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['opsz'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const plusJakarta = localFont({
  src: './fonts/plus-jakarta-sans.woff2',
  variable: '--font-sans',
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
  themeColor: '#1E4D3B',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${plusJakarta.variable} ${fraunces.variable} ${jetbrainsMono.variable} font-sans antialiased bg-[#F4EFE4] text-[#1B1B18] overflow-x-hidden selection:bg-[#D8572A] selection:text-white`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { fontFamily: 'var(--font-sans)', fontSize: '14px', background: '#FFFFFF', color: '#1B1B18', border: '1px solid #E2DACB' },
            success: { iconTheme: { primary: '#1E4D3B', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  )
}
