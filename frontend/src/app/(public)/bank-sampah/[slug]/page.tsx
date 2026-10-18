import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import {
  MapPin,
  Clock,
  CheckCircle2,
  Phone,
  MessageCircle,
  Navigation,
  ArrowLeft,
  AlertTriangle,
  UserPlus,
  Coins,
  ShieldCheck,
  Calendar,
  FileCheck,
} from 'lucide-react'
import { FALLBACK_VERIFIED_UNITS, UnitBankSampah } from '@/lib/sumut-constants'
import UnitDetailClientView from './UnitDetailClientView'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getUnitBySlug(slug: string): Promise<UnitBankSampah | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
  try {
    const res = await fetch(`${apiUrl}/unit/${slug}`, {
      next: { revalidate: 60 },
    })
    if (res.ok) {
      const json = await res.json()
      if (json.success && json.data) {
        return json.data
      }
    }
  } catch {}

  // Fallback ke dataset Sumut terverifikasi jika backend offline saat SSG / build
  const fallback = FALLBACK_VERIFIED_UNITS.find(
    (u) => u.slug === slug && u.is_demo === false && u.status_verifikasi === 'terverifikasi'
  )
  return fallback || null
}

export async function generateStaticParams() {
  return FALLBACK_VERIFIED_UNITS.map((u) => ({
    slug: u.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const unit = await getUnitBySlug(slug)

  if (!unit) {
    return {
      title: 'Bank Sampah Tidak Ditemukan | SIMBA',
      description: 'Halaman bank sampah yang Anda cari tidak ditemukan atau belum terverifikasi.',
    }
  }

  const title = `${unit.nama} - Bank Sampah Sumut | SIMBA`
  const description = `Daftar jam operasional, harga beli sampah daur ulang, petunjuk arah, dan pendaftaran nasabah di ${unit.nama}, ${unit.kabupaten_kota_nama}.`
  const canonicalUrl = `https://simba.id/bank-sampah/${unit.slug}`

  return {
    title,
    description: description.slice(0, 155),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description: description.slice(0, 155),
      url: canonicalUrl,
      type: 'article',
      locale: 'id_ID',
      siteName: 'SIMBA Nusantara',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: description.slice(0, 155),
    },
  }
}

export default async function BankSampahDetailPage({ params }: PageProps) {
  const { slug } = await params
  const unit = await getUnitBySlug(slug)

  if (!unit) {
    notFound()
  }

  // Schema.org LocalBusiness JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RecyclingCenter',
    name: unit.nama,
    address: {
      '@type': 'PostalAddress',
      streetAddress: unit.alamat_lengkap,
      addressRegion: unit.kabupaten_kota_nama,
      addressCountry: 'ID',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: unit.lat,
      longitude: unit.lng,
    },
    telephone: unit.telepon_publik,
    url: `https://simba.id/bank-sampah/${unit.slug}`,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '16:00',
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <UnitDetailClientView unit={unit} />
    </>
  )
}
