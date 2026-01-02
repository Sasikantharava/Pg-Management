const express = require('express');
const router = express.Router();
const {
  submitApplication,
  getApplications,
  getApplicationById,
  reviewApplication,
  getApplicationStats,
  deleteApplication, // Add this import
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');

// Public route
router.post('/submit/:qrCode', submitApplication);

// Protected routes
router.use(protect);
router.get('/', getApplications);
router.get('/stats', getApplicationStats);
router.get('/:id', getApplicationById);
router.put('/:id/review', reviewApplication);
router.delete('/:id', deleteApplication); // Add this line

module.exports = router;