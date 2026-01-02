const User = require('../models/User');
const bcrypt = require('bcryptjs');
const Tenant = require('../models/Tenant');

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const { name, email, phone } = req.body;
    
    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }
    
    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    
    const updatedUser = await user.save();
    
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Change password
// @route   PUT /api/users/password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user._id);
    
    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user stats
// @route   GET /api/users/stats
// @access  Private
const getUserStats = async (req, res) => {
  try {
    const totalTenants = await Tenant.countDocuments({ createdBy: req.user._id });
    const activeTenants = await Tenant.countDocuments({ 
      createdBy: req.user._id, 
      status: 'Active' 
    });
    
    const monthlyData = await Tenant.aggregate([
      { $match: { createdBy: req.user._id } },
      {
        $group: {
          _id: {
            year: { $year: '$admissionDate' },
            month: { $month: '$admissionDate' },
          },
          count: { $sum: 1 },
          totalRent: { $sum: '$monthlyRent' },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 },
    ]);
    
    res.json({
      totalTenants,
      activeTenants,
      monthlyData: monthlyData.map(item => ({
        year: item._id.year,
        month: item._id.month,
        label: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
        count: item.count,
        totalRent: item.totalRent,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  updateProfile,
  changePassword,
  getUserStats,
};