import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: '*.supabase.in' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'www.chubb.com' },
    ],
  },
  async rewrites() {
    const apiUrl = process.env.ENABLE_EXTERNAL_BACKEND_REWRITE === 'true' ? process.env.NEXT_PUBLIC_API_URL : null
    // By default, Next.js handles /api routes via high-performance internal Serverless endpoints
    if (apiUrl && !apiUrl.includes('localhost')) {
      return [
        {
          source: '/api/:path((?!wastebank).*)*',
          destination: `${apiUrl}/:path*`,
        },
      ]
    }
    return []
  },
  devIndicators: false,
}

export default nextConfig
