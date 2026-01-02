const express = require('express');
const router = express.Router();
const {
  updateProfile,
  changePassword,
  getUserStats,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.put('/profile', updateProfile);
router.put('/password', changePassword);
router.get('/stats', getUserStats);

module.exports = router;