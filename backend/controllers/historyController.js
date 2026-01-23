const Tenant = require('../models/Tenant');
const Payment = require('../models/Payment');

// @desc    Get all tenants with filters (history)
// @route   GET /api/tenants/history
// @access  Private
const getAllTenantsWithFilters = async (req, res) => {
  try {
    const { month, year, roomType, status, search, source } = req.query;

    let query = { createdBy: req.user._id };

    // Date filter
    if (month && year && month !== 'all' && year !== 'all') {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      query.admissionDate = { $gte: startDate, $lte: endDate };
    } else if (year && year !== 'all') {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31, 23, 59, 59);
      query.admissionDate = { $gte: startDate, $lte: endDate };
    }

    // Room type filter
    if (roomType && roomType !== 'all') query.roomType = roomType;

    // Status filter
    if (status && status !== 'all') query.status = status;

    // Source filter
    if (source && source !== 'all') query.source = source;

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { roomNumber: { $regex: search, $options: 'i' } },
      ];
    }

    // Fetch tenants
    const tenantsRaw = await Tenant.find(query).sort({ admissionDate: -1 });

    // Calculate totalPaid and balance for each tenant
    const tenants = await Promise.all(
      tenantsRaw.map(async (tenant) => {
        const payments = await Payment.find({
          tenantId: tenant._id,
          createdBy: req.user._id,
        });

        const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
        const balance = (tenant.monthlyRent + tenant.securityDeposit) - totalPaid;

        return {
          ...tenant.toObject(),
          totalPaid,
          balance: balance < 0 ? 0 : balance,
        };
      })
    );

    // Stats
    const totalTenants = await Tenant.countDocuments({ createdBy: req.user._id });
    const qrTenants = await Tenant.countDocuments({
      createdBy: req.user._id,
      source: 'qr',
    });
    const manualTenants = totalTenants - qrTenants;

    // Unique months for filter dropdown
    const uniqueMonths = await Tenant.aggregate([
      { $match: { createdBy: req.user._id } },
      {
        $group: {
          _id: {
            year: { $year: '$admissionDate' },
            month: { $month: '$admissionDate' },
          },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
    ]);

    res.json({
      tenants,
      stats: {
        total: totalTenants,
        qr: qrTenants,
        manual: manualTenants,
      },
      filters: {
        months: uniqueMonths.map((m) => ({
          year: m._id.year,
          month: m._id.month,
          label: `${m._id.year}-${String(m._id.month).padStart(2, '0')}`,
        })),
        roomTypes: ['Single', 'Double', 'triple', 'quad'],
        sources: ['manual', 'qr'],
      },
    });
  } catch (error) {
    console.error('History API error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = {
  getAllTenantsWithFilters,
};
