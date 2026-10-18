/**
 * Data Resmi 38 Provinsi di Seluruh Indonesia (SIMBA Nusantara)
 * Frontend Mirror dengan Tipe TypeScript lengkap.
 */

export interface UnitPercontohan {
  nama: string
  kode: string
  alamat: string
  koordinator: string
  nomor_hp: string
}

export interface ProvinsiItem {
  kode_bps: string
  kode_iso: string
  kode: string // alias kode_iso untuk backward-compatibility
  nama: string
  ibukota: string
  pulau: 'Sumatera' | 'Jawa' | 'Bali & Nusa Tenggara' | 'Kalimantan' | 'Sulawesi' | 'Maluku & Papua'
  lat: number
  lng: number
  populasi: number
  target_reduksi_persen: number
  bsu_aktif: number
  bsu: number // alias bsu_aktif
  total_sampah_kg: number
  kg: number // alias total_sampah_kg
  ton: number
  total_nasabah: number
  nasabah: number // alias total_nasabah
  partisipasi_persen: number
  unit_percontohan: UnitPercontohan
}

export const DATA_38_PROVINSI: ProvinsiItem[] = [
  // --- SUMATERA (10) ---
  {
    kode_bps: '11', kode_iso: 'AC', kode: 'AC', nama: 'Aceh', ibukota: 'Banda Aceh', pulau: 'Sumatera',
    lat: 5.5483, lng: 95.3238, populasi: 5400000, target_reduksi_persen: 30,
    bsu_aktif: 324, bsu: 324, total_sampah_kg: 2450000, kg: 2450000, ton: 2450.0,
    total_nasabah: 51200, nasabah: 51200, partisipasi_persen: 18.5,
    unit_percontohan: {
      nama: 'Bank Sampah Unit Meuraxa Berseri', kode: 'BSU-11-001',
      alamat: 'Kec. Meuraxa, Kota Banda Aceh', koordinator: 'Teuku Iskandar, S.T.', nomor_hp: '0812-6543-1101'
    }
  },
  {
    kode_bps: '12', kode_iso: 'SU', kode: 'SU', nama: 'Sumatera Utara', ibukota: 'Medan', pulau: 'Sumatera',
    lat: 3.5952, lng: 98.6722, populasi: 15100000, target_reduksi_persen: 30,
    bsu_aktif: 890, bsu: 890, total_sampah_kg: 6850000, kg: 6850000, ton: 6850.0,
    total_nasabah: 142000, nasabah: 142000, partisipasi_persen: 21.4,
    unit_percontohan: {
      nama: 'Bank Sampah Unit Deli Hijau Bersih', kode: 'BSU-12-001',
      alamat: 'Kec. Medan Kota, Kota Medan', koordinator: 'Bambang Sitorus, S.Sos.', nomor_hp: '0812-7890-1201'
    }
  },
  {
    kode_bps: '13', kode_iso: 'SB', kode: 'SB', nama: 'Sumatera Barat', ibukota: 'Padang', pulau: 'Sumatera',
    lat: -0.9471, lng: 100.4172, populasi: 5600000, target_reduksi_persen: 30,
    bsu_aktif: 410, bsu: 410, total_sampah_kg: 3120000, kg: 3120000, ton: 3120.0,
    total_nasabah: 64500, nasabah: 64500, partisipasi_persen: 19.8,
    unit_percontohan: {
      nama: 'Bank Sampah Unit Ranah Minang Resik', kode: 'BSU-13-001',
      alamat: 'Kec. Padang Barat, Kota Padang', koordinator: 'Nurhayati Chaniago', nomor_hp: '0813-4567-1301'
    }
  },
  {
    kode_bps: '14', kode_iso: 'RI', kode: 'RI', nama: 'Riau', ibukota: 'Pekanbaru', pulau: 'Sumatera',
    lat: 0.5071, lng: 101.4478, populasi: 6600000, target_reduksi_persen: 30,
    bsu_aktif: 380, bsu: 380, total_sampah_kg: 2950000, kg: 2950000, ton: 2950.0,
    total_nasabah: 59800, nasabah: 59800, partisipasi_persen: 17.2,
    unit_percontohan: {
      nama: 'Bank Sampah Unit Lancang Kuning', kode: 'BSU-14-001',
      alamat: 'Kec. Tampan, Kota Pekanbaru', koordinator: 'M. Faisal Azmi', nomor_hp: '0812-9901-1401'
    }
  },
  {
    kode_bps: '15', kode_iso: 'JA', kode: 'JA', nama: 'Jambi', ibukota: 'Jambi', pulau: 'Sumatera',
    lat: -1.6101, lng: 103.6131, populasi: 3600000, target_reduksi_persen: 30,
    bsu_aktif: 260, bsu: 260, total_sampah_kg: 1980000, kg: 1980000, ton: 1980.0,
    total_nasabah: 41200, nasabah: 41200, partisipasi_persen: 16.5,
    unit_percontohan: {
      nama: 'Bank Sampah Unit Batanghari Mandiri', kode: 'BSU-15-001',
      alamat: 'Kec. Telanaipura, Kota Jambi', koordinator: 'Hendra Gunawan', nomor_hp: '0852-6789-1501'
    }
  },
  {
    kode_bps: '16', kode_iso: 'SS', kode: 'SS', nama: 'Sumatera Selatan', ibukota: 'Palembang', pulau: 'Sumatera',
    lat: -2.9761, lng: 104.7754, populasi: 8700000, target_reduksi_persen: 30,
    bsu_aktif: 540, bsu: 540, total_sampah_kg: 4210000, kg: 4210000, ton: 4210.0,
    total_nasabah: 88500, nasabah: 88500, partisipasi_persen: 20.1,
    unit_percontohan: {
      nama: 'Bank Sampah Unit Sriwijaya Berdaya', kode: 'BSU-16-001',
      alamat: 'Kec. Ilir Barat I, Kota Palembang', koordinator: 'Dra. Rosmala Dewi', nomor_hp: '0813-6712-1601'
    }
  },
  {
    kode_bps: '17', kode_iso: 'BE', kode: 'BE', nama: 'Bengkulu', ibukota: 'Bengkulu', pulau: 'Sumatera',
    lat: -3.7928, lng: 102.2608, populasi: 2050000, target_reduksi_persen: 30,
    bsu_aktif: 175, bsu: 175, total_sampah_kg: 1320000, kg: 1320000, ton: 1320.0,
    total_nasabah: 27400, nasabah: 27400, partisipasi_persen: 15.8,
    unit_percontohan: {
      nama: 'Bank Sampah Unit Rafflesia Lestari', kode: 'BSU-17-001',
      alamat: 'Kec. Ratu Agung, Kota Bengkulu', koordinator: 'Agus Salim, S.E.', nomor_hp: '0821-8899-1701'
    }
  },
  {
    kode_bps: '18', kode_iso: 'LA', kode: 'LA', nama: 'Lampung', ibukota: 'Bandar Lampung', pulau: 'Sumatera',
    lat: -5.4297, lng: 105.2625, populasi: 9200000, target_reduksi_persen: 30,
    bsu_aktif: 470, bsu: 470, total_sampah_kg: 3650000, kg: 3650000, ton: 3650.0,
    total_nasabah: 79200, nasabah: 79200, partisipasi_persen: 18.2,
    unit_percontohan: {
      nama: 'Bank Sampah Unit Radin Inten Mandiri', kode: 'BSU-18-001',
      alamat: 'Kec. Tanjung Karang Pusat, Kota Bandar Lampung', koordinator: 'Farhan Kurniawan', nomor_hp: '0853-7890-1801'
    }
  },
  {
    kode_bps: '19', kode_iso: 'BB', kode: 'BB', nama: 'Kepulauan Bangka Belitung', ibukota: 'Pangkalpinang', pulau: 'Sumatera',
    lat: -2.1316, lng: 106.1169, populasi: 1500000, target_reduksi_persen: 30,
    bsu_aktif: 135, bsu: 135, total_sampah_kg: 980000, kg: 980000, ton: 980.0,
    total_nasabah: 21500, nasabah: 21500, partisipasi_persen: 14.9,
    unit_percontohan: {
      nama: 'Bank Sampah Unit Serumpun Sebalai', kode: 'BSU-19-001',
      alamat: 'Kec. Gerunggang, Kota Pangkalpinang', koordinator: 'Budi Darmawan', nomor_hp: '0812-7123-1901'
    }
  },
  {
    kode_bps: '21', kode_iso: 'KR', kode: 'KR', nama: 'Kepulauan Riau', ibukota: 'Tanjungpinang', pulau: 'Sumatera',
    lat: 0.9167, lng: 104.45, populasi: 2100000, target_reduksi_persen: 30,
    bsu_aktif: 195, bsu: 195, total_sampah_kg: 1540000, kg: 1540000, ton: 1540.0,
    total_nasabah: 33100, nasabah: 33100, partisipasi_persen: 19.3,
    unit_percontohan: {
      nama: 'Bank Sampah Unit Gurindam Sejahtera', kode: 'BSU-21-001',
      alamat: 'Kec. Bukit Bestari, Kota Tanjungpinang', koordinator: 'Ahmad Zulkarnain', nomor_hp: '0813-8812-2101'
    }
  },

  // --- JAWA (6) ---
  {
    kode_bps: '31', kode_iso: 'JK', kode: 'JK', nama: 'DKI Jakarta', ibukota: 'Jakarta Pusat', pulau: 'Jawa',
    lat: -6.2088, lng: 106.8456, populasi: 10600000, target_reduksi_persen: 35,
    bsu_aktif: 1250, bsu: 1250, total_sampah_kg: 12800000, kg: 12800000, ton: 12800.0,
    total_nasabah: 310000, nasabah: 310000, partisipasi_persen: 28.4,
    unit_percontohan: {
      nama: 'Bank Sampah Induk Cempaka Bestari', kode: 'BSU-31-001',
      alamat: 'Kec. Cempaka Putih, Jakarta Pusat', koordinator: 'Hj. Siti Aminah, M.Pd.', nomor_hp: '0812-8182-3101'
    }
  },
  {
    kode_bps: '32', kode_iso: 'JB', kode: 'JB', nama: 'Jawa Barat', ibukota: 'Bandung', pulau: 'Jawa',
    lat: -6.9175, lng: 107.6191, populasi: 49800000, target_reduksi_persen: 30,
    bsu_aktif: 2350, bsu: 2350, total_sampah_kg: 19400000, kg: 19400000, ton: 19400.0,
    total_nasabah: 520000, nasabah: 520000, partisipasi_persen: 24.6,
    unit_percontohan: {
      nama: 'Bank Sampah Unit Bersinar Pasteur', kode: 'BSU-32-001',
      alamat: 'Kec. Sukajadi, Kota Bandung', koordinator: 'Asep Ridwan, S.T.', nomor_hp: '0813-2211-3201'
    }
  },
  {
    kode_bps: '33', kode_iso: 'JT', kode: 'JT', nama: 'Jawa Tengah', ibukota: 'Semarang', pulau: 'Jawa',
    lat: -6.9667, lng: 110.4167, populasi: 37200000, target_reduksi_persen: 30,
    bsu_aktif: 1980, bsu: 1980, total_sampah_kg: 15300000, kg: 15300000, ton: 15300.0,
    total_nasabah: 435000, nasabah: 435000, partisipasi_persen: 23.9,
    unit_percontohan: {
      nama: 'Bank Sampah Unit Pandanaran Asri', kode: 'BSU-33-001',
      alamat: 'Kec. Semarang Tengah, Kota Semarang', koordinator: 'Tri Wibowo, S.H.', nomor_hp: '0815-6677-3301'
    }
  },
  {
    kode_bps: '34', kode_iso: 'YO', kode: 'YO', nama: 'DI Yogyakarta', ibukota: 'Yogyakarta', pulau: 'Jawa',
    lat: -7.7956, lng: 110.3695, populasi: 3900000, target_reduksi_persen: 35,
    bsu_aktif: 430, bsu: 430, total_sampah_kg: 3450000, kg: 3450000, ton: 3450.0,
    total_nasabah: 98000, nasabah: 98000, partisipasi_persen: 26.2,
    unit_percontohan: {
      nama: 'Bank Sampah Unit Malioboro Resik', kode: 'BSU-34-001',
      alamat: 'Kec. Danurejan, Kota Yogyakarta', koordinator: 'Sri Handayani', nomor_hp: '0817-4455-3401'
    }
  },
  {
    kode_bps: '35', kode_iso: 'JI', kode: 'JI', nama: 'Jawa Timur', ibukota: 'Surabaya', pulau: 'Jawa',
    lat: -7.2575, lng: 112.7521, populasi: 41100000, target_reduksi_persen: 30,
    bsu_aktif: 2140, bsu: 2140, total_sampah_kg: 16800000, kg: 16800000, ton: 16800.0,
    total_nasabah: 470000, nasabah: 470000, partisipasi_persen: 24.1,
    unit_percontohan: {
      nama: 'Bank Sampah Unit Suroboyo Hijau', kode: 'BSU-35-001',
      alamat: 'Kec. Wonokromo, Kota Surabaya', koordinator: 'Joko Prasetyo, M.M.', nomor_hp: '0812-3344-3501'
    }
  },
  {
    kode_bps: '36', kode_iso: 'BT', kode: 'BT', nama: 'Banten', ibukota: 'Serang', pulau: 'Jawa',
    lat: -6.1104, lng: 106.164, populasi: 12200000, target_reduksi_persen: 30,
    bsu_aktif: 680, bsu: 680, total_sampah_kg: 5400000, kg: 5400000, ton: 5400.0,
    total_nasabah: 148000, nasabah: 148000, partisipasi_persen: 22.8,
    unit_percontohan: {
      nama: 'Bank Sampah Unit Jawara Resik', kode: 'BSU-36-001',
      alamat: 'Kec. Cipocok Jaya, Kota Serang', koordinator: 'Tb. Maulana Yusuf', nomor_hp: '0878-1122-3601'
    }
  },

  // --- BALI & NUSA TENGGARA (3) ---
  {
    kode_bps: '51', kode_iso: 'BA', kode: 'BA', nama: 'Bali', ibukota: 'Denpasar', pulau: 'Bali & Nusa Tenggara',
    lat: -8.6705, lng: 115.2126, populasi: 4400000, target_reduksi_persen: 35,
    bsu_aktif: 550, bsu: 550, total_sampah_kg: 4450000, kg: 4450000, ton: 4450.0,
    total_nasabah: 124000, nasabah: 124000, partisipasi_persen: 27.5,
    unit_percontohan: {
      nama: 'Bank Sampah Unit Bali Bersih Shanti', kode: 'BSU-51-001',
      alamat: 'Kec. Denpasar Selatan, Kota Denpasar', koordinator: 'I Wayan Suardana', nomor_hp: '0812-3890-5101'
    }
  },
  {
    kode_bps: '52', kode_iso: 'NB', kode: 'NB', nama: 'Nusa Tenggara Barat', ibukota: 'Mataram', pulau: 'Bali & Nusa Tenggara',
    lat: -8.5833, lng: 116.1167, populasi: 5400000, target_reduksi_persen: 30,
    bsu_aktif: 315, bsu: 315, total_sampah_kg: 2350000, kg: 2350000, ton: 2350.0,
    total_nasabah: 61000, nasabah: 61000, partisipasi_persen: 19.4,
    unit_percontohan: {
      nama: 'Bank Sampah Unit Sasak Hijau Lestari', kode: 'BSU-52-001',
      alamat: 'Kec. Selaparang, Kota Mataram', koordinator: 'Lalu Muhamad Saleh', nomor_hp: '0819-0789-5201'
    }
  },
  {
    kode_bps: '53', kode_iso: 'NT', kode: 'NT', nama: 'Nusa Tenggara Timur', ibukota: 'Kupang', pulau: 'Bali & Nusa Tenggara',
    lat: -10.1772, lng: 123.607, populasi: 5500000, target_reduksi_persen: 25,
    bsu_aktif: 240, bsu: 240, total_sampah_kg: 1680000, kg: 1680000, ton: 1680.0,
    total_nasabah: 44500, nasabah: 44500, partisipasi_persen: 15.1,
    unit_percontohan: {
      nama: 'Bank Sampah Unit Flobamora Bersemi', kode: 'BSU-53-001',
      alamat: 'Kec. Oebobo, Kota Kupang', koordinator: 'Maria Yohanis, S.Pd.', nomor_hp: '0852-3901-5301'
    }
  },

  // --- KALIMANTAN (5) ---
  {
    kode_bps: '61', kode_iso: 'KB', kode: 'KB', nama: 'Kalimantan Barat', ibukota: 'Pontianak', pulau: 'Kalimantan',
    lat: -0.0263, lng: 109.3425, populasi: 5500000, target_reduksi_persen: 30,
    bsu_aktif: 350, bsu: 350, total_sampah_kg: 2600000, kg: 2600000, ton: 2600.0,
    total_nasabah: 65000, nasabah: 65000, partisipasi_persen: 18.7,
    unit_percontohan: {
      nama: 'Bank Sampah Unit Khatulistiwa Mandiri', kode: 'BSU-61-001',
      alamat: 'Kec. Pontianak Kota, Kota Pontianak', koordinator: 'Fransiskus Aseng', nomor_hp: '0813-4512-6101'
    }
  },
  {
    kode_bps: '62', kode_iso: 'KT', kode: 'KT', nama: 'Kalimantan Tengah', ibukota: 'Palangkaraya', pulau: 'Kalimantan',
    lat: -2.2136, lng: 113.9108, populasi: 2700000, target_reduksi_persen: 30,
    bsu_aktif: 215, bsu: 215, total_sampah_kg: 1550000, kg: 1550000, ton: 1550.0,
    total_nasabah: 37500, nasabah: 37500, partisipasi_persen: 16.2,
    unit_percontohan: {
      nama: 'Bank Sampah Unit Isen Mulang Hijau', kode: 'BSU-62-001',
      alamat: 'Kec. Jekan Raya, Kota Palangka Raya', koordinator: 'Kristina Natalia, S.Si.', nomor_hp: '0852-4911-6201'
    }
  },
  {
    kode_bps: '63', kode_iso: 'KS', kode: 'KS', nama: 'Kalimantan Selatan', ibukota: 'Banjarmasin', pulau: 'Kalimantan',
    lat: -3.3194, lng: 114.5908, populasi: 4200000, target_reduksi_persen: 30,
    bsu_aktif: 290, bsu: 290, total_sampah_kg: 2150000, kg: 2150000, ton: 2150.0,
    total_nasabah: 52000, nasabah: 52000, partisipasi_persen: 19.1,
    unit_percontohan: {
      nama: 'Bank Sampah Unit Lambung Mangkurat', kode: 'BSU-63-001',
      alamat: 'Kec. Banjarmasin Tengah, Kota Banjarmasin', koordinator: 'Gusti Muhammad Noor', nomor_hp: '0812-5123-6301'
    }
  },
  {
    kode_bps: '64', kode_iso: 'KI', kode: 'KI', nama: 'Kalimantan Timur', ibukota: 'Samarinda', pulau: 'Kalimantan',
    lat: -0.5022, lng: 117.1536, populasi: 3900000, target_reduksi_persen: 35,
    bsu_aktif: 340, bsu: 340, total_sampah_kg: 2750000, kg: 2750000, ton: 2750.0,
    total_nasabah: 68000, nasabah: 68000, partisipasi_persen: 22.4,
    unit_percontohan: {
      nama: 'Bank Sampah Unit Etam Nusantara (IKN)', kode: 'BSU-64-001',
      alamat: 'Kec. Samarinda Ulu, Kota Samarinda', koordinator: 'Drs. Hendro Waskito', nomor_hp: '0813-5001-6401'
    }
  },
  {
    kode_bps: '65', kode_iso: 'KU', kode: 'KU', nama: 'Kalimantan Utara', ibukota: 'Tanjung Selor', pulau: 'Kalimantan',
    lat: 2.8375, lng: 117.3653, populasi: 720000, target_reduksi_persen: 25,
    bsu_aktif: 125, bsu: 125, total_sampah_kg: 820000, kg: 820000, ton: 820.0,
    total_nasabah: 20500, nasabah: 20500, partisipasi_persen: 14.8,
    unit_percontohan: {
      nama: 'Bank Sampah Unit Benuanta Berseri', kode: 'BSU-65-001',
      alamat: 'Kec. Tanjung Selor, Kab. Bulungan', koordinator: 'Abdul Rahim, S.Pd.', nomor_hp: '0853-4812-6501'
    }
  },

  // --- SULAWESI (6) ---
  {
    kode_bps: '71', kode_iso: 'SW', kode: 'SW', nama: 'Sulawesi Utara', ibukota: 'Manado', pulau: 'Sulawesi',
    lat: 1.4748, lng: 124.8428, populasi: 2650000, target_reduksi_persen: 30,
    bsu_aktif: 240, bsu: 240, total_sampah_kg: 1750000, kg: 1750000, ton: 1750.0,
    total_nasabah: 42000, nasabah: 42000, partisipasi_persen: 17.9,
    unit_percontohan: {
      nama: 'Bank Sampah Unit Bunaken Lestari', kode: 'BSU-71-001',
      alamat: 'Kec. Malalayang, Kota Manado', koordinator: 'Mieke Tumewu, S.E.', nomor_hp: '0811-4301-7101'
    }
  },
  {
    kode_bps: '72', kode_iso: 'ST', kode: 'ST', nama: 'Sulawesi Tengah', ibukota: 'Palu', pulau: 'Sulawesi',
    lat: -0.8917, lng: 119.8707, populasi: 3100000, target_reduksi_persen: 30,
    bsu_aktif: 200, bsu: 200, total_sampah_kg: 1420000, kg: 1420000, ton: 1420.0,
    total_nasabah: 34500, nasabah: 34500, partisipasi_persen: 15.7,
    unit_percontohan: {
      nama: 'Bank Sampah Unit Tadulako Bangkit', kode: 'BSU-72-001',
      alamat: 'Kec. Palu Timur, Kota Palu', koordinator: 'Rusdi Mansyur, S.Kom.', nomor_hp: '0852-4112-7201'
    }
  },
  {
    kode_bps: '73', kode_iso: 'SN', kode: 'SN', nama: 'Sulawesi Selatan', ibukota: 'Makassar', pulau: 'Sulawesi',
    lat: -5.1477, lng: 119.4327, populasi: 9250000, target_reduksi_persen: 30,
    bsu_aktif: 540, bsu: 540, total_sampah_kg: 4350000, kg: 4350000, ton: 4350.0,
    total_nasabah: 118000, nasabah: 118000, partisipasi_persen: 21.2,
    unit_percontohan: {
      nama: 'Bank Sampah Unit Anging Mammiri', kode: 'BSU-73-001',
      alamat: 'Kec. Panakkukang, Kota Makassar', koordinator: 'H. Syamsuddin Dg. Lau', nomor_hp: '0812-4211-7301'
    }
  },
  {
    kode_bps: '74', kode_iso: 'SG', kode: 'SG', nama: 'Sulawesi Tenggara', ibukota: 'Kendari', pulau: 'Sulawesi',
    lat: -3.9985, lng: 122.5126, populasi: 2750000, target_reduksi_persen: 25,
    bsu_aktif: 190, bsu: 190, total_sampah_kg: 1350000, kg: 1350000, ton: 1350.0,
    total_nasabah: 31500, nasabah: 31500, partisipasi_persen: 15.3,
    unit_percontohan: {
      nama: 'Bank Sampah Unit Anoa Sejahtera', kode: 'BSU-74-001',
      alamat: 'Kec. Mandonga, Kota Kendari', koordinator: 'La Ode Armin, S.H.', nomor_hp: '0853-9901-7401'
    }
  },
  {
    kode_bps: '75', kode_iso: 'GO', kode: 'GO', nama: 'Gorontalo', ibukota: 'Gorontalo', pulau: 'Sulawesi',
    lat: 0.5435, lng: 123.0568, populasi: 1200000, target_reduksi_persen: 25,
    bsu_aktif: 135, bsu: 135, total_sampah_kg: 890000, kg: 890000, ton: 890.0,
    total_nasabah: 21000, nasabah: 21000, partisipasi_persen: 16.4,
    unit_percontohan: {
      nama: 'Bank Sampah Unit Hulonthalo Resik', kode: 'BSU-75-001',
      alamat: 'Kec. Kota Barat, Kota Gorontalo', koordinator: 'Yusuf Katili', nomor_hp: '0821-9012-7501'
    }
  },
  {
    kode_bps: '76', kode_iso: 'SR', kode: 'SR', nama: 'Sulawesi Barat', ibukota: 'Mamuju', pulau: 'Sulawesi',
    lat: -2.677, lng: 118.8895, populasi: 1450000, target_reduksi_persen: 25,
    bsu_aktif: 115, bsu: 115, total_sampah_kg: 760000, kg: 760000, ton: 760.0,
    total_nasabah: 18200, nasabah: 18200, partisipasi_persen: 14.2,
    unit_percontohan: {
      nama: 'Bank Sampah Unit Manakarra Mandiri', kode: 'BSU-76-001',
      alamat: 'Kec. Simboro, Kab. Mamuju', koordinator: 'Nurhidayah Basri', nomor_hp: '0852-5501-7601'
    }
  },

  // --- MALUKU & PAPUA (8) ---
  {
    kode_bps: '81', kode_iso: 'MA', kode: 'MA', nama: 'Maluku', ibukota: 'Ambon', pulau: 'Maluku & Papua',
    lat: -3.6547, lng: 128.1906, populasi: 1900000, target_reduksi_persen: 25,
    bsu_aktif: 160, bsu: 160, total_sampah_kg: 1080000, kg: 1080000, ton: 1080.0,
    total_nasabah: 24500, nasabah: 24500, partisipasi_persen: 15.9,
    unit_percontohan: {
      nama: 'Bank Sampah Unit Siwalima Manise', kode: 'BSU-81-001',
      alamat: 'Kec. Sirimau, Kota Ambon', koordinator: 'Piet Pattiasina', nomor_hp: '0812-4701-8101'
    }
  },
  {
    kode_bps: '82', kode_iso: 'MU', kode: 'MU', nama: 'Maluku Utara', ibukota: 'Sofifi', pulau: 'Maluku & Papua',
    lat: 0.7303, lng: 127.5708, populasi: 1320000, target_reduksi_persen: 25,
    bsu_aktif: 125, bsu: 125, total_sampah_kg: 840000, kg: 840000, ton: 840.0,
    total_nasabah: 19500, nasabah: 19500, partisipasi_persen: 14.5,
    unit_percontohan: {
      nama: 'Bank Sampah Unit Moloku Kie Raha', kode: 'BSU-82-001',
      alamat: 'Kec. Oba Utara, Kota Tidore Kepulauan (Sofifi)', koordinator: 'Iskandar Malik', nomor_hp: '0813-5612-8201'
    }
  },
  {
    kode_bps: '91', kode_iso: 'PA', kode: 'PA', nama: 'Papua', ibukota: 'Jayapura', pulau: 'Maluku & Papua',
    lat: -2.5489, lng: 140.7181, populasi: 1050000, target_reduksi_persen: 25,
    bsu_aktif: 150, bsu: 150, total_sampah_kg: 980000, kg: 980000, ton: 980.0,
    total_nasabah: 23000, nasabah: 23000, partisipasi_persen: 16.8,
    unit_percontohan: {
      nama: 'Bank Sampah Unit Port Numbay Hijau', kode: 'BSU-91-001',
      alamat: 'Kec. Jayapura Selatan, Kota Jayapura', koordinator: 'Yohanes Kogoya, S.Sos.', nomor_hp: '0812-4801-9101'
    }
  },
  {
    kode_bps: '92', kode_iso: 'PB', kode: 'PB', nama: 'Papua Barat', ibukota: 'Manokwari', pulau: 'Maluku & Papua',
    lat: -0.8615, lng: 134.062, populasi: 560000, target_reduksi_persen: 25,
    bsu_aktif: 100, bsu: 100, total_sampah_kg: 680000, kg: 680000, ton: 680.0,
    total_nasabah: 15500, nasabah: 15500, partisipasi_persen: 15.2,
    unit_percontohan: {
      nama: 'Bank Sampah Unit Kasuari Mandiri', kode: 'BSU-92-001',
      alamat: 'Kec. Manokwari Barat, Kab. Manokwari', koordinator: 'Markus Mandacan', nomor_hp: '0813-4401-9201'
    }
  },
  {
    kode_bps: '93', kode_iso: 'PS', kode: 'PS', nama: 'Papua Selatan', ibukota: 'Merauke', pulau: 'Maluku & Papua',
    lat: -8.4991, lng: 140.4011, populasi: 525000, target_reduksi_persen: 25,
    bsu_aktif: 90, bsu: 90, total_sampah_kg: 590000, kg: 590000, ton: 590.0,
    total_nasabah: 13800, nasabah: 13800, partisipasi_persen: 14.1,
    unit_percontohan: {
      nama: 'Bank Sampah Unit Anim Ha Lestari', kode: 'BSU-93-001',
      alamat: 'Kec. Merauke, Kab. Merauke', koordinator: 'Petrus Mahuze, S.T.', nomor_hp: '0852-5401-9301'
    }
  },
  {
    kode_bps: '94', kode_iso: 'PT', kode: 'PT', nama: 'Papua Tengah', ibukota: 'Nabire', pulau: 'Maluku & Papua',
    lat: -3.3667, lng: 135.4833, populasi: 1430000, target_reduksi_persen: 25,
    bsu_aktif: 110, bsu: 110, total_sampah_kg: 740000, kg: 740000, ton: 740.0,
    total_nasabah: 17200, nasabah: 17200, partisipasi_persen: 13.8,
    unit_percontohan: {
      nama: 'Bank Sampah Unit Cenderawasih Nabire', kode: 'BSU-94-001',
      alamat: 'Kec. Nabire, Kab. Nabire', koordinator: 'Mikael Degei', nomor_hp: '0821-9801-9401'
    }
  },
  {
    kode_bps: '95', kode_iso: 'PP', kode: 'PP', nama: 'Papua Pegunungan', ibukota: 'Wamena', pulau: 'Maluku & Papua',
    lat: -4.0984, lng: 138.9442, populasi: 1450000, target_reduksi_persen: 20,
    bsu_aktif: 85, bsu: 85, total_sampah_kg: 510000, kg: 510000, ton: 510.0,
    total_nasabah: 12500, nasabah: 12500, partisipasi_persen: 12.5,
    unit_percontohan: {
      nama: 'Bank Sampah Unit Lembah Baliem Bersih', kode: 'BSU-95-001',
      alamat: 'Kec. Wamena, Kab. Jayawijaya', koordinator: 'Keliopas Matuan, S.Pd.', nomor_hp: '0812-4011-9501'
    }
  },
  {
    kode_bps: '96', kode_iso: 'PD', kode: 'PD', nama: 'Papua Barat Daya', ibukota: 'Sorong', pulau: 'Maluku & Papua',
    lat: -0.8762, lng: 131.2558, populasi: 620000, target_reduksi_persen: 25,
    bsu_aktif: 105, bsu: 105, total_sampah_kg: 720000, kg: 720000, ton: 720.0,
    total_nasabah: 16800, nasabah: 16800, partisipasi_persen: 16.3,
    unit_percontohan: {
      nama: 'Bank Sampah Unit Raja Ampat Bahari Resik', kode: 'BSU-96-001',
      alamat: 'Kec. Sorong Barat, Kota Sorong', koordinator: 'Agustinus Osok', nomor_hp: '0813-4311-9601'
    }
  },
]

export const DAFTAR_PULAU = [
  'Semua',
  'Sumatera',
  'Jawa',
  'Bali & Nusa Tenggara',
  'Kalimantan',
  'Sulawesi',
  'Maluku & Papua',
] as const

export type PulauType = typeof DAFTAR_PULAU[number]

export interface ProvinsiPinItem extends ProvinsiItem {
  pinX: number // Koordinat X pada SVG viewBox (1024 x 371)
  pinY: number // Koordinat Y pada SVG viewBox (1024 x 371)
}

/**
 * 15 Provinsi Percontohan SIMBA Nasional (sesuai peta 15 pin sebaran Indonesia)
 */
export const DATA_15_PROVINSI: ProvinsiPinItem[] = [
  // 1. Sumatera Utara
  { ...DATA_38_PROVINSI.find((p) => p.kode_iso === 'SU')!, pinX: 105, pinY: 80 },
  // 2. Sumatera Barat
  { ...DATA_38_PROVINSI.find((p) => p.kode_iso === 'SB')!, pinX: 140, pinY: 160 },
  // 3. Banten
  { ...DATA_38_PROVINSI.find((p) => p.kode_iso === 'BT')!, pinX: 260, pinY: 275 },
  // 4. DKI Jakarta
  { ...DATA_38_PROVINSI.find((p) => p.kode_iso === 'JK')!, pinX: 290, pinY: 280 },
  // 5. Jawa Barat
  { ...DATA_38_PROVINSI.find((p) => p.kode_iso === 'JB')!, pinX: 340, pinY: 290 },
  // 6. Jawa Tengah
  { ...DATA_38_PROVINSI.find((p) => p.kode_iso === 'JT')!, pinX: 400, pinY: 305 },
  // 7. DI Yogyakarta
  { ...DATA_38_PROVINSI.find((p) => p.kode_iso === 'YO')!, pinX: 440, pinY: 314 },
  // 8. Jawa Timur
  { ...DATA_38_PROVINSI.find((p) => p.kode_iso === 'JI')!, pinX: 490, pinY: 320 },
  // 9. Bali
  { ...DATA_38_PROVINSI.find((p) => p.kode_iso === 'BA')!, pinX: 562, pinY: 318 },
  // 10. Kalimantan Barat
  { ...DATA_38_PROVINSI.find((p) => p.kode_iso === 'KB')!, pinX: 355, pinY: 155 },
  // 11. Kalimantan Selatan
  { ...DATA_38_PROVINSI.find((p) => p.kode_iso === 'KS')!, pinX: 440, pinY: 205 },
  // 12. Kalimantan Timur
  { ...DATA_38_PROVINSI.find((p) => p.kode_iso === 'KI')!, pinX: 465, pinY: 130 },
  // 13. Sulawesi Utara
  { ...DATA_38_PROVINSI.find((p) => p.kode_iso === 'SW')!, pinX: 600, pinY: 115 },
  // 14. Maluku
  { ...DATA_38_PROVINSI.find((p) => p.kode_iso === 'MA')!, pinX: 735, pinY: 198 },
  // 15. Papua
  { ...DATA_38_PROVINSI.find((p) => p.kode_iso === 'PA')!, pinX: 830, pinY: 195 },
]

/**
 * Agregasi Agregasi Data Wilayah (Mendukung 15 Provinsi Percontohan atau 38 Provinsi)
 */
export function hitungAgregasiNasional(
  filterPulau: string = 'all',
  dataSource: ProvinsiItem[] = DATA_15_PROVINSI
) {
  const data = filterPulau === 'all' || filterPulau === 'Semua'
    ? dataSource
    : dataSource.filter((p) => p.pulau.toLowerCase() === filterPulau.toLowerCase())

  const total_provinsi = data.length
  const total_bsu = data.reduce((sum, p) => sum + p.bsu_aktif, 0)
  const total_nasabah = data.reduce((sum, p) => sum + p.total_nasabah, 0)
  const total_kg = data.reduce((sum, p) => sum + p.total_sampah_kg, 0)
  const total_populasi = data.reduce((sum, p) => sum + p.populasi, 0)
  const total_rupiah = total_kg * 2500
  const avg_partisipasi = total_populasi > 0 ? (total_nasabah / total_populasi) * 100 : 0
  const total_bsi = total_provinsi

  return {
    total_provinsi,
    total_bsi,
    total_bsu,
    total_nasabah,
    total_kg,
    total_rupiah,
    total_populasi,
    avg_partisipasi: parseFloat(avg_partisipasi.toFixed(2)),
  }
}

