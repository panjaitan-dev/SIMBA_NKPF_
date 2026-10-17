const multer = require('multer');
const crypto = require('crypto');
const limits = require('../config/limits');

// Simpan di memori (lalu upload ke Supabase Storage)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimes = limits.FOTO_ALLOWED_TYPES || ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedMimes.includes(file.mimetype) || file.mimetype === 'image/jpg') {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar (jpg, png, webp) yang diizinkan'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: limits.FOTO_MAX_SIZE_BYTES || 2 * 1024 * 1024, // 2 MB per file
    files: limits.FOTO_MAX_COUNT || 5, // maks 5 file sekaligus
    fields: 20,
    fieldSize: 10 * 1024 * 1024,
  },
});

/**
 * Hapus EXIF metadata (APP1 marker) dari JPEG buffer untuk menjaga privasi
 */
function stripExif(buffer) {
  if (!buffer || buffer.length < 4) return buffer;
  // Cek SOI JPEG: FF D8
  if (buffer[0] !== 0xff || buffer[1] !== 0xd8) return buffer;

  const chunks = [buffer.slice(0, 2)];
  let offset = 2;

  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) break;
    const marker = buffer[offset + 1];

    if (marker === 0xd8 || marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7)) {
      chunks.push(buffer.slice(offset, offset + 2));
      offset += 2;
      continue;
    }

    if (marker === 0xda) {
      chunks.push(buffer.slice(offset));
      break;
    }

    if (offset + 4 > buffer.length) break;
    const length = buffer.readUInt16BE(offset + 2);

    // Marker 0xE1 adalah APP1 (Exif). Hapus dari chunks.
    if (marker === 0xe1) {
      offset += 2 + length;
      continue;
    }

    chunks.push(buffer.slice(offset, offset + 2 + length));
    offset += 2 + length;
  }

  return Buffer.concat(chunks);
}

/**
 * Buat nama file acak kriptografis (tidak mudah ditebak)
 */
function generateRandomFilename(originalName, folder = '') {
  const ext = (originalName || 'file.jpg').split('.').pop().toLowerCase();
  const randomHex = crypto.randomBytes(16).toString('hex');
  return `${folder ? folder + '/' : ''}${Date.now()}-${randomHex}.${ext}`;
}

/**
 * Middleware untuk verifikasi magic bytes gambar, batas total ukuran file, dan hapus EXIF
 */
const verifyMagicBytesAndLimits = (req, res, next) => {
  const files = req.files || (req.file ? [req.file] : []);
  if (!files || files.length === 0) return next();

  let totalSize = 0;

  for (const file of files) {
    totalSize += file.size || file.buffer?.length || 0;

    if (!file.buffer || file.buffer.length < 4) {
      return res.status(400).json({
        success: false,
        message: 'Format file tidak valid atau rusak',
      });
    }

    const buf = file.buffer;
    // JPEG magic bytes: FF D8 FF
    const isJpeg = buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
    // PNG magic bytes: 89 50 4E 47
    const isPng = buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
    // WebP magic bytes: RIFF....WEBP (0-3: 52 49 46 46, 8-11: 57 45 42 50)
    const isWebp =
      buf.length >= 12 &&
      buf[0] === 0x52 &&
      buf[1] === 0x49 &&
      buf[2] === 0x46 &&
      buf[3] === 0x46 &&
      buf[8] === 0x57 &&
      buf[9] === 0x45 &&
      buf[10] === 0x42 &&
      buf[11] === 0x50;

    if (!isJpeg && !isPng && !isWebp) {
      return res.status(400).json({
        success: false,
        message: `File "${file.originalname}" bukan gambar valid. Hanya file JPG, PNG, dan WebP yang diizinkan.`,
      });
    }

    // Hapus EXIF jika JPEG
    if (isJpeg) {
      file.buffer = stripExif(file.buffer);
      file.size = file.buffer.length;
    }
  }

  // Cek total batas ukuran (maks 8 MB)
  const maxTotalBytes = limits.FOTO_MAX_TOTAL_BYTES || 8 * 1024 * 1024;
  if (totalSize > maxTotalBytes) {
    return res.status(400).json({
      success: false,
      message: `Total ukuran foto melebihi batas maksimal ${(maxTotalBytes / (1024 * 1024)).toFixed(0)} MB`,
    });
  }

  next();
};

upload.verifyMagicBytesAndLimits = verifyMagicBytesAndLimits;
upload.stripExif = stripExif;
upload.generateRandomFilename = generateRandomFilename;
upload.upload = upload;

module.exports = upload;
