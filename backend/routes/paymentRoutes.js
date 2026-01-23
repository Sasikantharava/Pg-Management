const express = require('express');
const router = express.Router();
const { addPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, addPayment);

module.exports = router;
