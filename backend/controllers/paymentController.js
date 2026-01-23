const Payment = require('../models/Payment');

// @desc    Add payment for tenant
// @route   POST /api/payments
// @access  Private
const addPayment = async (req, res) => {
  try {
    const { tenantId, month, amount, paymentMethod, notes } = req.body;

    if (!tenantId || !month || !amount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const payment = await Payment.create({
      tenantId,
      month,
      amount,
      paymentMethod,
      notes,
      createdBy: req.user._id,
    });

    res.status(201).json(payment);
  } catch (error) {
    console.error('Add payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { addPayment };
