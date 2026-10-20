import { NextRequest, NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { DEFAULT_JENIS_SAMPAH } from '@/lib/constants'
import { SAMPLE_BERITA, SAMPLE_EDUKASI, SAMPLE_GALERI } from '@/lib/sampleData'

const JWT_SECRET = process.env.JWT_SECRET || 'simba_secret_key_dlh_toba_2026'

// 4 Akun Demo Resmi (README.md)
const DEMO_ACCOUNTS = [
  {
    id: 'd3b07384-d113-4001-9001-000000000001',
    email: 'admin@simba.id',
    password: 'Password123!',
    role: 'admin',
    nama_lengkap: 'Administrator BSI',
    nomor_hp: '0812-9900-1122',
    alamat: 'Jl. Balai Kota No. 1, Medan, Sumatera Utara',
  },
  {
    id: 'd3b07384-d113-4001-9001-000000000004',
    email: 'admin.nasional@simba.id',
    password: 'Password123!',
    role: 'admin_klh',
    nama_lengkap: 'Admin Nasional KLH',
    nomor_hp: '0811-7788-9900',
    alamat: 'Kementerian Lingkungan Hidup dan Kehutanan RI, Jakarta',
  },
  {
    id: 'd3b07384-d113-4001-9001-000000000002',
    email: 'petugas.melati@simba.id',
    password: 'Password123!',
    role: 'petugas',
    nama_lengkap: 'Melati Puspasari',
    nomor_hp: '0813-2233-4455',
    alamat: 'Kec. Cempaka Putih, Jakarta Pusat',
  },
  {
    id: 'd3b07384-d113-4001-9001-000000000003',
    email: 'nasabah.dewi@simba.id',
    password: 'Password123!',
    role: 'nasabah',
    nama_lengkap: 'Dewi Lestari',
    nomor_hp: '0821-6543-2109',
    alamat: 'Perum Harapan Indah No. 12, Bekasi',
  },
]

// In-Memory store untuk penambahan data saat offline/demo
let edukasiStore = [...SAMPLE_EDUKASI]
const beritaStore = [...SAMPLE_BERITA]
const jenisSampahStore = [...DEFAULT_JENIS_SAMPAH]
const registeredUsers: any[] = []

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

function signToken(payload: any): string {
  const header = { alg: 'HS256', typ: 'JWT' }
  const now = Math.floor(Date.now() / 1000)
  const fullPayload = { ...payload, iat: now, exp: now + 7 * 24 * 3600 }

  const headerB64 = base64UrlEncode(JSON.stringify(header))
  const payloadB64 = base64UrlEncode(JSON.stringify(fullPayload))
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${headerB64}.${payloadB64}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')

  return `${headerB64}.${payloadB64}.${signature}`
}

async function handleRequest(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  const pathStr = path.join('/')
  const method = request.method

  // 1. POST /api/auth/login
  if (pathStr === 'auth/login' && method === 'POST') {
    try {
      const body = await request.json()
      const email = (body.email || '').trim().toLowerCase()
      const password = body.password || ''

      const found = DEMO_ACCOUNTS.find((a) => a.email === email) || registeredUsers.find((a) => a.email === email)
      if (found) {
        if (found.password !== password) {
          return NextResponse.json({ success: false, message: 'Email atau password salah' }, { status: 401 })
        }
        const token = signToken({ id: found.id, email: found.email, role: found.role, nama_lengkap: found.nama_lengkap })
        return NextResponse.json({
          success: true,
          message: 'Login berhasil',
          token,
          role: found.role,
          user: { id: found.id, email: found.email, nama_lengkap: found.nama_lengkap, role: found.role },
          profile: found,
        })
      }

      return NextResponse.json({ success: false, message: 'Email atau password salah' }, { status: 401 })
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid request body' }, { status: 400 })
    }
  }

  // 2. POST /api/auth/register
  if (pathStr === 'auth/register' && method === 'POST') {
    try {
      const body = await request.json()
      const { email, password, nama_lengkap, nomor_hp, alamat, nik } = body

      if (!email || !password || !nama_lengkap) {
        return NextResponse.json({ success: false, message: 'Nama, email, dan password wajib diisi' }, { status: 400 })
      }

      const existing = registeredUsers.find((u) => u.email === email.trim().toLowerCase())
      if (existing) {
        return NextResponse.json({ success: false, message: 'Email sudah terdaftar. Silakan gunakan email lain.' }, { status: 400 })
      }

      const newUser = {
        id: `usr-${Date.now()}`,
        email: email.trim().toLowerCase(),
        password,
        role: 'nasabah',
        nama_lengkap,
        nomor_hp: nomor_hp || '',
        alamat: alamat || '',
        nik: nik || '',
      }
      registeredUsers.push(newUser)

      return NextResponse.json(
        {
          success: true,
          message: 'Pendaftaran berhasil! Akun Anda telah aktif, silakan masuk.',
          data: { id: newUser.id, email: newUser.email, role: newUser.role },
        },
        { status: 201 }
      )
    } catch (err: any) {
      console.error('REGISTER ERROR:', err)
      return NextResponse.json({ success: false, message: err?.message || 'Gagal memproses pendaftaran' }, { status: 400 })
    }
  }

  // 3. GET /api/edukasi or /api/edukasi/admin/all
  if (pathStr === 'edukasi' || pathStr === 'edukasi/admin/all') {
    if (method === 'GET') {
      return NextResponse.json({ success: true, data: edukasiStore })
    }
    if (method === 'POST') {
      try {
        let body: any = {}
        const contentType = request.headers.get('content-type') || ''
        if (contentType.includes('multipart/form-data')) {
          const fd = await request.formData()
          body = {
            judul: fd.get('judul'),
            konten: fd.get('konten'),
            ringkasan: fd.get('ringkasan') || '',
            kategori: fd.get('kategori') || '3r',
            urutan: Number(fd.get('urutan')) || edukasiStore.length + 1,
            is_published: fd.get('is_published') === 'true',
          }
        } else {
          body = await request.json()
        }

        const newItem = {
          id: `edu-${Date.now()}`,
          judul: body.judul || 'Materi Edukasi Baru',
          konten: body.konten || '',
          ringkasan: body.ringkasan || '',
          kategori: body.kategori || '3r',
          urutan: Number(body.urutan) || edukasiStore.length + 1,
          slug: (body.judul || 'materi').toLowerCase().replace(/[^a-z0-9]+/g, '-') + `-${Date.now().toString().slice(-4)}`,
          thumbnail_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
          is_published: body.is_published ?? true,
        }

        edukasiStore.unshift(newItem)
        return NextResponse.json({ success: true, message: 'Materi edukasi baru berhasil diterbitkan', data: newItem }, { status: 201 })
      } catch {
        return NextResponse.json({ success: false, message: 'Gagal menyimpan konten edukasi' }, { status: 400 })
      }
    }
  }

  // 4. PUT or DELETE /api/edukasi/:id
  if (pathStr.startsWith('edukasi/')) {
    const id = pathStr.split('/')[1]
    if (method === 'PUT') {
      try {
        let body: any = {}
        const contentType = request.headers.get('content-type') || ''
        if (contentType.includes('multipart/form-data')) {
          const fd = await request.formData()
          body = {
            judul: fd.get('judul'),
            konten: fd.get('konten'),
            ringkasan: fd.get('ringkasan'),
            kategori: fd.get('kategori'),
            urutan: Number(fd.get('urutan')),
            is_published: fd.get('is_published') === 'true',
          }
        } else {
          body = await request.json()
        }

        edukasiStore = edukasiStore.map((item) =>
          item.id === id ? { ...item, ...body, id } : item
        )
        return NextResponse.json({ success: true, message: 'Materi edukasi berhasil diperbarui' })
      } catch {
        return NextResponse.json({ success: false, message: 'Gagal memperbarui materi edukasi' }, { status: 400 })
      }
    }
    if (method === 'DELETE') {
      edukasiStore = edukasiStore.filter((item) => item.id !== id)
      return NextResponse.json({ success: true, message: 'Materi edukasi berhasil dihapus' })
    }
  }

  // 5. GET /api/berita or /api/berita/admin/all
  if (pathStr === 'berita' || pathStr === 'berita/admin/all') {
    if (method === 'GET') {
      return NextResponse.json({ success: true, data: beritaStore })
    }
    if (method === 'POST') {
      try {
        let body: any = {}
        const contentType = request.headers.get('content-type') || ''
        if (contentType.includes('multipart/form-data')) {
          const fd = await request.formData()
          body = {
            judul: fd.get('judul'),
            konten: fd.get('konten'),
            ringkasan: fd.get('ringkasan') || '',
            kategori: fd.get('kategori') || 'program',
          }
        } else {
          body = await request.json()
        }

        const newItem = {
          id: `news-${Date.now()}`,
          judul: body.judul || 'Berita Baru',
          konten: body.konten || '',
          ringkasan: body.ringkasan || '',
          kategori: body.kategori || 'program',
          slug: (body.judul || 'berita').toLowerCase().replace(/[^a-z0-9]+/g, '-') + `-${Date.now().toString().slice(-4)}`,
          thumbnail_url: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80',
          published_at: new Date().toISOString(),
          view_count: 1,
        }

        beritaStore.unshift(newItem)
        return NextResponse.json({ success: true, message: 'Berita baru berhasil diterbitkan', data: newItem }, { status: 201 })
      } catch {
        return NextResponse.json({ success: false, message: 'Gagal membuat berita' }, { status: 400 })
      }
    }
  }

  // 6. GET /api/jenis-sampah
  if (pathStr === 'jenis-sampah') {
    if (method === 'GET') {
      return NextResponse.json({ success: true, data: jenisSampahStore })
    }
    if (method === 'POST') {
      try {
        const body = await request.json()
        const newItem = {
          id: `js-${Date.now()}`,
          ...body,
        }
        jenisSampahStore.unshift(newItem)
        return NextResponse.json({ success: true, message: 'Data sampah berhasil disimpan', data: newItem }, { status: 201 })
      } catch {
        return NextResponse.json({ success: false, message: 'Gagal menambah jenis sampah' }, { status: 400 })
      }
    }
  }

  // 7. GET /api/stats/nasional
  if (pathStr === 'stats/nasional') {
    return NextResponse.json({
      success: true,
      data: {
        total_nasabah: 2603410,
        total_kg: 890000000,
        total_rupiah: 3800000000000,
        total_bsu: 14210,
      },
    })
  }

  // 8. GET /api/galeri
  if (pathStr === 'galeri') {
    return NextResponse.json({ success: true, data: SAMPLE_GALERI })
  }

  // Default fallback for any other route
  return NextResponse.json({ success: true, data: [] })
}

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleRequest(request, context)
}

export async function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleRequest(request, context)
}

export async function PUT(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleRequest(request, context)
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleRequest(request, context)
}
