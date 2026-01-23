const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getAllTenantsWithFilters } = require('../controllers/tenantController');

// GET /api/tenants/history
router.get('/history', protect, getAllTenantsWithFilters);

module.exports = router;
