const express = require('express');
const router = express.Router();
const {
  generateQRCode,
  getUserQRCodes,
  getQRCodeDetails,
  updateQRCode,
  deleteQRCode,
} = require('../controllers/qrController');
const { protect } = require('../middleware/authMiddleware');

// Public route
router.get('/:code', getQRCodeDetails);

// Protected routes
router.use(protect);
router.post('/generate', generateQRCode);
router.get('/', getUserQRCodes);
router.put('/:id', updateQRCode);
router.delete('/:id', deleteQRCode);

module.exports = router;