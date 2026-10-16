const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'simba_secret_key_dlh_toba_2026';

// 4 Akun Resmi Demo Pengujian (README.md)
const DEMO_ACCOUNTS = [
  {
    id: 'd3b07384-d113-4001-9001-000000000001',
    email: 'admin@simba.id',
    password: 'Password123!',
    role: 'admin',
    nama_lengkap: 'Administrator BSI',
    nomor_hp: '0812-9900-1122',
    alamat: 'Gedung Manggala Wanabakti, Jakarta Pusat',
    profile: {
      id: 'd3b07384-d113-4001-9001-000000000001',
      role: 'admin',
      nama_lengkap: 'Administrator BSI',
      nomor_hp: '0812-9900-1122',
      alamat: 'Gedung Manggala Wanabakti, Jakarta Pusat',
    },
  },
  {
    id: 'd3b07384-d113-4001-9001-000000000002',
    email: 'petugas.melati@simba.id',
    password: 'Password123!',
    role: 'petugas',
    nama_lengkap: 'Melati Puspasari',
    nomor_hp: '0813-2233-4455',
    alamat: 'Kec. Cempaka Putih, Jakarta Pusat',
    profile: {
      id: 'd3b07384-d113-4001-9001-000000000002',
      role: 'petugas',
      nama_lengkap: 'Melati Puspasari',
      nomor_hp: '0813-2233-4455',
      alamat: 'Kec. Cempaka Putih, Jakarta Pusat',
      unit_id: '22222222-2222-2222-2222-222222222222',
    },
  },
  {
    id: 'd3b07384-d113-4001-9001-000000000003',
    email: 'nasabah.dewi@simba.id',
    password: 'Password123!',
    role: 'nasabah',
    nama_lengkap: 'Dewi Lestari',
    nomor_hp: '0821-6543-2109',
    alamat: 'Perum Harapan Indah No. 12, Bekasi',
    profile: {
      id: 'd3b07384-d113-4001-9001-000000000003',
      role: 'nasabah',
      nama_lengkap: 'Dewi Lestari',
      nomor_hp: '0821-6543-2109',
      alamat: 'Perum Harapan Indah No. 12, Bekasi',
      nik: '3275015504950002',
      nomor_nasabah: 'NSB-004',
      saldo: 150000,
    },
  },
  {
    id: 'd3b07384-d113-4001-9001-000000000004',
    email: 'klh.nasional@menlhk.go.id',
    password: 'Password123!',
    role: 'admin_klh',
    nama_lengkap: 'Admin Nasional KLH',
    nomor_hp: '0811-7788-9900',
    alamat: 'Kementerian Lingkungan Hidup dan Kehutanan RI, Jakarta',
    profile: {
      id: 'd3b07384-d113-4001-9001-000000000004',
      role: 'admin_klh',
      nama_lengkap: 'Admin Nasional KLH',
      nomor_hp: '0811-7788-9900',
      alamat: 'Kementerian Lingkungan Hidup dan Kehutanan RI, Jakarta',
    },
  },
];

function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str) {
  let s = str.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  return Buffer.from(s, 'base64').toString('utf8');
}

function signLocalToken(payload, expiresInSeconds = 7 * 24 * 3600) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
  };

  const headerB64 = base64UrlEncode(JSON.stringify(header));
  const payloadB64 = base64UrlEncode(JSON.stringify(fullPayload));
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${headerB64}.${payloadB64}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${headerB64}.${payloadB64}.${signature}`;
}

function verifyLocalToken(token) {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [headerB64, payloadB64, signature] = parts;

    const expectedSig = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${headerB64}.${payloadB64}`)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    if (signature !== expectedSig) return null;

    const payload = JSON.parse(base64UrlDecode(payloadB64));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload;
  } catch {
    return null;
  }
}

function getDemoAccountByEmail(email) {
  if (!email) return null;
  const normalized = email.trim().toLowerCase();
  return DEMO_ACCOUNTS.find((acc) => acc.email.toLowerCase() === normalized) || null;
}

module.exports = {
  DEMO_ACCOUNTS,
  signLocalToken,
  verifyLocalToken,
  getDemoAccountByEmail,
};
