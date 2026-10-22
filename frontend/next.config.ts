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
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    // Forward all API calls to external backend except our internal wastebank routes
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
