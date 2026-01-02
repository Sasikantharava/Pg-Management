const express = require('express');
const router = express.Router();
const {
  createTenant,
  getTenants,
  getCurrentMonthTenants,
  getDashboardStats,
  updateTenant,
  deleteTenant,
  getTenantById, // MAKE SURE THIS IS IMPORTED
} = require('../controllers/tenantController');
const { protect } = require('../middleware/authMiddleware');
const { getAllTenantsWithFilters } = require('../controllers/tenantController');
router.use(protect);

router.route('/')
  .post(createTenant)
  .get(getTenants);

router.get('/current-month', getCurrentMonthTenants);
router.get('/dashboard/stats', getDashboardStats);
router.get('/history', getAllTenantsWithFilters);

router.route('/:id')
  .get(getTenantById) // This should work now
  .put(updateTenant)
  .delete(deleteTenant);

module.exports = router;