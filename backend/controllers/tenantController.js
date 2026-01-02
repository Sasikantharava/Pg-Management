const Tenant = require('../models/Tenant');

// @desc    Create new tenant
// @route   POST /api/tenants
// @access  Private
const createTenant = async (req, res) => {
  try {
    const tenantData = {
      ...req.body,
      createdBy: req.user._id,
    };

    const tenant = await Tenant.create(tenantData);
    res.status(201).json(tenant);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all tenants
// @route   GET /api/tenants
// @access  Private
const getTenants = async (req, res) => {
  try {
    const tenants = await Tenant.find({ createdBy: req.user._id })
      .sort({ admissionDate: -1 });
    res.json(tenants);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get current month tenants
// @route   GET /api/tenants/current-month
// @access  Private
const getCurrentMonthTenants = async (req, res) => {
  try {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const startDate = new Date(currentYear, currentMonth, 1);
    const endDate = new Date(currentYear, currentMonth + 1, 0);

    const tenants = await Tenant.find({
      createdBy: req.user._id,
      admissionDate: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({ admissionDate: -1 });

    res.json(tenants);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/tenants/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const startDate = new Date(currentYear, currentMonth, 1);
    const endDate = new Date(currentYear, currentMonth + 1, 0);

    // Current month tenants
    const currentMonthTenants = await Tenant.find({
      createdBy: req.user._id,
      admissionDate: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    // All tenants
    const allTenants = await Tenant.find({ createdBy: req.user._id });

    // Get applications count
    const Application = require('../models/Application');
    const QRCode = require('../models/QRCode');
    
    const userQRCodes = await QRCode.find({ createdBy: req.user._id });
    const qrCodeIds = userQRCodes.map(qr => qr._id);
    
    const pendingApplications = await Application.countDocuments({
      qrCodeId: { $in: qrCodeIds },
      status: 'Pending'
    });

    // Calculate stats
    const totalTenants = currentMonthTenants.length;
    const totalRevenue = currentMonthTenants.reduce(
      (sum, tenant) => sum + (tenant.monthlyRent || 0),
      0
    );
    const activeTenants = allTenants.filter(t => t.status === 'Active').length;
    const qrTenants = allTenants.filter(t => t.source === 'qr').length;

    // Monthly data for chart
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const month = new Date(currentYear, currentMonth - i, 1);
      const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
      const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
      
      const monthTenants = await Tenant.find({
        createdBy: req.user._id,
        admissionDate: {
          $gte: monthStart,
          $lte: monthEnd,
        },
      });

      const monthRevenue = monthTenants.reduce(
        (sum, tenant) => sum + (tenant.monthlyRent || 0),
        0
      );

      monthlyData.push({
        month: month.toLocaleString('default', { month: 'short' }),
        tenants: monthTenants.length,
        revenue: monthRevenue,
      });
    }

    res.json({
      totalTenants,
      totalRevenue,
      activeTenants,
      pendingApplications,
      qrTenants,
      monthlyData,
      recentTenants: currentMonthTenants.slice(0, 5),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update tenant
// @route   PUT /api/tenants/:id
// @access  Private
const updateTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    Object.assign(tenant, req.body);
    await tenant.save();
    res.json(tenant);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete tenant
// @route   DELETE /api/tenants/:id
// @access  Private
const deleteTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    await tenant.deleteOne();
    res.json({ message: 'Tenant removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single tenant
// @route   GET /api/tenants/:id
// @access  Private
const getTenantById = async (req, res) => {
  try {
    const tenant = await Tenant.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    res.json(tenant);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all tenants with filters
// @route   GET /api/tenants/history
// @access  Private
const getAllTenantsWithFilters = async (req, res) => {
  try {
    const { month, year, roomType, status, search, source } = req.query;
    
    let query = { createdBy: req.user._id };
    
    // Date filter
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      query.admissionDate = { $gte: startDate, $lte: endDate };
    } else if (year) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);
      query.admissionDate = { $gte: startDate, $lte: endDate };
    }
    
    // Room type filter
    if (roomType && roomType !== 'all') {
      query.roomType = roomType;
    }
    
    // Status filter
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Source filter (manual/qr)
    if (source && source !== 'all') {
      query.source = source;
    }
    
    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { roomNumber: { $regex: search, $options: 'i' } },
      ];
    }
    
    const tenants = await Tenant.find(query)
      .sort({ admissionDate: -1 })
      .populate('applicationId', 'createdAt');
    
    // Get unique months for filter dropdown
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
    
    // Get statistics
    const totalTenants = await Tenant.countDocuments({ createdBy: req.user._id });
    const qrTenants = await Tenant.countDocuments({ 
      createdBy: req.user._id,
      source: 'qr' 
    });
    const manualTenants = totalTenants - qrTenants;
    
    res.json({
      tenants,
      stats: {
        total: totalTenants,
        qr: qrTenants,
        manual: manualTenants,
      },
      filters: {
        months: uniqueMonths.map(m => ({
          year: m._id.year,
          month: m._id.month,
          label: `${m._id.year}-${String(m._id.month).padStart(2, '0')}`,
        })),
        roomTypes: ['Single', 'Double', 'Shared'],
        sources: ['manual', 'qr'],
      },
    });
  } catch (error) {
    console.error('History API error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// Export all functions
module.exports = {
  createTenant,
  getTenants,
  getCurrentMonthTenants,
  getDashboardStats,
  updateTenant,
  deleteTenant,
  getTenantById,
  getAllTenantsWithFilters,
};