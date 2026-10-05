const router = require('express').Router();
const { register, getMe, updateProfile } = require('../controllers/auth.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// POST /api/auth/register
router.post('/register', register);

// GET /api/auth/me (butuh login)
router.get('/me', authMiddleware, getMe);

// PUT /api/auth/profile (butuh login)
router.put('/profile', authMiddleware, upload.single('avatar'), updateProfile);

module.exports = router;
