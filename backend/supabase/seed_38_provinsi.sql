-- ============================================================
-- SIMBA Nusantara — Seed Data 38 Unit Bank Sampah Percontohan
-- Mencakup Seluruh 38 Provinsi di Indonesia (Termasuk 4 DOB Papua)
-- ============================================================

INSERT INTO public.unit_bank_sampah (nama, kode, alamat, koordinator, nomor_hp, is_active) VALUES
-- SUMATERA (10)
('Bank Sampah Unit Meuraxa Berseri', 'BSU-11-001', 'Kec. Meuraxa, Kota Banda Aceh, Aceh', 'Teuku Iskandar, S.T.', '0812-6543-1101', true),
('Bank Sampah Unit Deli Hijau Bersih', 'BSU-12-001', 'Kec. Medan Kota, Kota Medan, Sumatera Utara', 'Bambang Sitorus, S.Sos.', '0812-7890-1201', true),
('Bank Sampah Unit Ranah Minang Resik', 'BSU-13-001', 'Kec. Padang Barat, Kota Padang, Sumatera Barat', 'Nurhayati Chaniago', '0813-4567-1301', true),
('Bank Sampah Unit Lancang Kuning', 'BSU-14-001', 'Kec. Tampan, Kota Pekanbaru, Riau', 'M. Faisal Azmi', '0812-9901-1401', true),
('Bank Sampah Unit Batanghari Mandiri', 'BSU-15-001', 'Kec. Telanaipura, Kota Jambi, Jambi', 'Hendra Gunawan', '0852-6789-1501', true),
('Bank Sampah Unit Sriwijaya Berdaya', 'BSU-16-001', 'Kec. Ilir Barat I, Kota Palembang, Sumatera Selatan', 'Dra. Rosmala Dewi', '0813-6712-1601', true),
('Bank Sampah Unit Rafflesia Lestari', 'BSU-17-001', 'Kec. Ratu Agung, Kota Bengkulu, Bengkulu', 'Agus Salim, S.E.', '0821-8899-1701', true),
('Bank Sampah Unit Radin Inten Mandiri', 'BSU-18-001', 'Kec. Tanjung Karang Pusat, Kota Bandar Lampung, Lampung', 'Farhan Kurniawan', '0853-7890-1801', true),
('Bank Sampah Unit Serumpun Sebalai', 'BSU-19-001', 'Kec. Gerunggang, Kota Pangkalpinang, Kep. Bangka Belitung', 'Budi Darmawan', '0812-7123-1901', true),
('Bank Sampah Unit Gurindam Sejahtera', 'BSU-21-001', 'Kec. Bukit Bestari, Kota Tanjungpinang, Kepulauan Riau', 'Ahmad Zulkarnain', '0813-8812-2101', true),

-- JAWA (6)
('Bank Sampah Induk Cempaka Bestari', 'BSU-31-001', 'Kec. Cempaka Putih, Jakarta Pusat, DKI Jakarta', 'Hj. Siti Aminah, M.Pd.', '0812-8182-3101', true),
('Bank Sampah Unit Bersinar Pasteur', 'BSU-32-001', 'Kec. Sukajadi, Kota Bandung, Jawa Barat', 'Asep Ridwan, S.T.', '0813-2211-3201', true),
('Bank Sampah Unit Pandanaran Asri', 'BSU-33-001', 'Kec. Semarang Tengah, Kota Semarang, Jawa Tengah', 'Tri Wibowo, S.H.', '0815-6677-3301', true),
('Bank Sampah Unit Malioboro Resik', 'BSU-34-001', 'Kec. Danurejan, Kota Yogyakarta, DI Yogyakarta', 'Sri Handayani', '0817-4455-3401', true),
('Bank Sampah Unit Suroboyo Hijau', 'BSU-35-001', 'Kec. Wonokromo, Kota Surabaya, Jawa Timur', 'Joko Prasetyo, M.M.', '0812-3344-3501', true),
('Bank Sampah Unit Jawara Resik', 'BSU-36-001', 'Kec. Cipocok Jaya, Kota Serang, Banten', 'Tb. Maulana Yusuf', '0878-1122-3601', true),

-- BALI & NUSA TENGGARA (3)
('Bank Sampah Unit Bali Bersih Shanti', 'BSU-51-001', 'Kec. Denpasar Selatan, Kota Denpasar, Bali', 'I Wayan Suardana', '0812-3890-5101', true),
('Bank Sampah Unit Sasak Hijau Lestari', 'BSU-52-001', 'Kec. Selaparang, Kota Mataram, Nusa Tenggara Barat', 'Lalu Muhamad Saleh', '0819-0789-5201', true),
('Bank Sampah Unit Flobamora Bersemi', 'BSU-53-001', 'Kec. Oebobo, Kota Kupang, Nusa Tenggara Timur', 'Maria Yohanis, S.Pd.', '0852-3901-5301', true),

-- KALIMANTAN (5)
('Bank Sampah Unit Khatulistiwa Mandiri', 'BSU-61-001', 'Kec. Pontianak Kota, Kota Pontianak, Kalimantan Barat', 'Fransiskus Aseng', '0813-4512-6101', true),
('Bank Sampah Unit Isen Mulang Hijau', 'BSU-62-001', 'Kec. Jekan Raya, Kota Palangka Raya, Kalimantan Tengah', 'Kristina Natalia, S.Si.', '0852-4911-6201', true),
('Bank Sampah Unit Lambung Mangkurat', 'BSU-63-001', 'Kec. Banjarmasin Tengah, Kota Banjarmasin, Kalimantan Selatan', 'Gusti Muhammad Noor', '0812-5123-6301', true),
('Bank Sampah Unit Etam Nusantara (IKN)', 'BSU-64-001', 'Kec. Samarinda Ulu, Kota Samarinda, Kalimantan Timur', 'Drs. Hendro Waskito', '0813-5001-6401', true),
('Bank Sampah Unit Benuanta Berseri', 'BSU-65-001', 'Kec. Tanjung Selor, Kab. Bulungan, Kalimantan Utara', 'Abdul Rahim, S.Pd.', '0853-4812-6501', true),

-- SULAWESI (6)
('Bank Sampah Unit Bunaken Lestari', 'BSU-71-001', 'Kec. Malalayang, Kota Manado, Sulawesi Utara', 'Mieke Tumewu, S.E.', '0811-4301-7101', true),
('Bank Sampah Unit Tadulako Bangkit', 'BSU-72-001', 'Kec. Palu Timur, Kota Palu, Sulawesi Tengah', 'Rusdi Mansyur, S.Kom.', '0852-4112-7201', true),
('Bank Sampah Unit Anging Mammiri', 'BSU-73-001', 'Kec. Panakkukang, Kota Makassar, Sulawesi Selatan', 'H. Syamsuddin Dg. Lau', '0812-4211-7301', true),
('Bank Sampah Unit Anoa Sejahtera', 'BSU-74-001', 'Kec. Mandonga, Kota Kendari, Sulawesi Tenggara', 'La Ode Armin, S.H.', '0853-9901-7401', true),
('Bank Sampah Unit Hulonthalo Resik', 'BSU-75-001', 'Kec. Kota Barat, Kota Gorontalo, Gorontalo', 'Yusuf Katili', '0821-9012-7501', true),
('Bank Sampah Unit Manakarra Mandiri', 'BSU-76-001', 'Kec. Simboro, Kab. Mamuju, Sulawesi Barat', 'Nurhidayah Basri', '0852-5501-7601', true),

-- MALUKU & PAPUA (8)
('Bank Sampah Unit Siwalima Manise', 'BSU-81-001', 'Kec. Sirimau, Kota Ambon, Maluku', 'Piet Pattiasina', '0812-4701-8101', true),
('Bank Sampah Unit Moloku Kie Raha', 'BSU-82-001', 'Kec. Oba Utara, Kota Tidore Kepulauan (Sofifi), Maluku Utara', 'Iskandar Malik', '0813-5612-8201', true),
('Bank Sampah Unit Port Numbay Hijau', 'BSU-91-001', 'Kec. Jayapura Selatan, Kota Jayapura, Papua', 'Yohanes Kogoya, S.Sos.', '0812-4801-9101', true),
('Bank Sampah Unit Kasuari Mandiri', 'BSU-92-001', 'Kec. Manokwari Barat, Kab. Manokwari, Papua Barat', 'Markus Mandacan', '0813-4401-9201', true),
('Bank Sampah Unit Anim Ha Lestari', 'BSU-93-001', 'Kec. Merauke, Kab. Merauke, Papua Selatan', 'Petrus Mahuze, S.T.', '0852-5401-9301', true),
('Bank Sampah Unit Cenderawasih Nabire', 'BSU-94-001', 'Kec. Nabire, Kab. Nabire, Papua Tengah', 'Mikael Degei', '0821-9801-9401', true),
('Bank Sampah Unit Lembah Baliem Bersih', 'BSU-95-001', 'Kec. Wamena, Kab. Jayawijaya, Papua Pegunungan', 'Keliopas Matuan, S.Pd.', '0812-4011-9501', true),
('Bank Sampah Unit Raja Ampat Bahari Resik', 'BSU-96-001', 'Kec. Sorong Barat, Kota Sorong, Papua Barat Daya', 'Agustinus Osok', '0813-4311-9601', true)
ON CONFLICT (kode) DO UPDATE SET
  nama = EXCLUDED.nama,
  alamat = EXCLUDED.alamat,
  koordinator = EXCLUDED.koordinator,
  nomor_hp = EXCLUDED.nomor_hp,
  is_active = true;
