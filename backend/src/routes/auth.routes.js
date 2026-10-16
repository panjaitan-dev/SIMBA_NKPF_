const router = require('express').Router();
const {
  login,
  register,
  refreshToken,
  logout,
  getMe,
  updateProfile,
} = require('../controllers/auth.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const {
  validate,
  registerSchema,
  loginSchema,
  updateProfileSchema,
} = require('../middleware/validate.middleware');

// POST /api/auth/login (Proksi login dengan validasi input)
router.post('/login', validate(loginSchema), login);

// POST /api/auth/register (Validasi Zod ketat)
router.post('/register', validate(registerSchema), register);

// POST /api/auth/refresh
router.post('/refresh', refreshToken);

// POST /api/auth/logout
router.post('/logout', logout);

// GET /api/auth/me (butuh login)
router.get('/me', authMiddleware, getMe);

// PUT /api/auth/profile (butuh login)
router.put(
  '/profile',
  authMiddleware,
  upload.single('avatar'),
  validate(updateProfileSchema),
  updateProfile
);

module.exports = router;
