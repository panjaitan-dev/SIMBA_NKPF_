const router = require('express').Router();
const { getAllAlbum, getAlbumById, createAlbum, uploadFoto, deleteAlbum, deleteFoto } = require('../controllers/galeri.controller');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const { validate, createGaleriSchema } = require('../middleware/validate.middleware');

router.get('/', getAllAlbum);
router.get('/:id', getAlbumById);

router.post('/', authMiddleware, requireRole('admin'), upload.single('cover'), validate(createGaleriSchema), createAlbum);
router.post('/:id/foto', authMiddleware, requireRole('admin'), upload.array('fotos', 10), uploadFoto);
router.delete('/foto/:id', authMiddleware, requireRole('admin'), deleteFoto);
router.delete('/:id', authMiddleware, requireRole('admin'), deleteAlbum);

module.exports = router;
