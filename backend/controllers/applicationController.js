const Application = require('../models/Application');
const QRCode = require('../models/QRCode');
const Tenant = require('../models/Tenant');

// @desc    Submit application via QR code
// @route   POST /api/applications/submit/:qrCode
// @access  Public
const submitApplication = async (req, res) => {
  try {
    const { qrCode } = req.params;
    const applicationData = req.body;
    
    // Verify QR code exists and is active
    const qrRecord = await QRCode.findOne({ 
      code: qrCode,
      isActive: true 
    });
    
    if (!qrRecord) {
      return res.status(404).json({
        success: false,
        message: 'Invalid or inactive QR code'
      });
    }
    
    // Create application
    const application = await Application.create({
      qrCodeId: qrRecord._id,
      ...applicationData,
    });
    
    // TODO: Send notification to admin (can be implemented with email/SMS)
    
    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      applicationId: application._id,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// @desc    Get all applications for user
// @route   GET /api/applications
// @access  Private
const getApplications = async (req, res) => {
  try {
    // Get user's QR codes first
    const userQRCodes = await QRCode.find({ createdBy: req.user._id });
    const qrCodeIds = userQRCodes.map(qr => qr._id);
    
    const applications = await Application.find({ 
      qrCodeId: { $in: qrCodeIds } 
    })
    .populate('qrCodeId', 'roomNumber roomType monthlyRent securityDeposit')
    .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      applications,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// @desc    Get application by ID
// @route   GET /api/applications/:id
// @access  Private
const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const application = await Application.findById(id)
      .populate('qrCodeId', 'roomNumber roomType monthlyRent securityDeposit');
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    // Verify user owns the QR code
    const qrCode = await QRCode.findById(application.qrCodeId);
    if (qrCode.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }
    
    res.json({
      success: true,
      application,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// @desc    Review application (Approve/Reject)
// @route   PUT /api/applications/:id/review
// @access  Private
const reviewApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;
    
    const application = await Application.findById(id)
      .populate('qrCodeId');
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    // Verify user owns the QR code
    if (application.qrCodeId.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }
    
    // Update application status
    application.status = status;
    application.adminNotes = adminNotes || '';
    application.reviewedBy = req.user._id;
    application.reviewedAt = new Date();
    
    await application.save();
    
    // If approved, create tenant record
    if (status === 'Approved') {
      // In reviewApplication function, when creating tenant:
const tenantData = {
  name: application.applicantName,
  email: application.applicantEmail,
  phone: application.applicantPhone,
  emergencyContact: application.emergencyContact,
  roomNumber: application.qrCodeId.roomNumber,
  roomType: application.qrCodeId.roomType,
  monthlyRent: application.qrCodeId.monthlyRent,
  securityDeposit: application.qrCodeId.securityDeposit,
  address: application.permanentAddress,
  idProof: application.idProofNumber,
  status: 'Active',
  createdBy: req.user._id,
  admissionDate: new Date(),
  source: 'qr',
  applicationId: application._id,
};

await Tenant.create(tenantData);
    }
    
    // TODO: Send notification to applicant (approved/rejected)
    
    res.json({
      success: true,
      message: `Application ${status.toLowerCase()} successfully`,
      application,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// @desc    Get application statistics
// @route   GET /api/applications/stats
// @access  Private
const getApplicationStats = async (req, res) => {
  try {
    // Get user's QR codes
    const userQRCodes = await QRCode.find({ createdBy: req.user._id });
    const qrCodeIds = userQRCodes.map(qr => qr._id);
    
    const applications = await Application.find({ 
      qrCodeId: { $in: qrCodeIds } 
    });
    
    const stats = {
      total: applications.length,
      pending: applications.filter(app => app.status === 'Pending').length,
      approved: applications.filter(app => app.status === 'Approved').length,
      rejected: applications.filter(app => app.status === 'Rejected').length,
    };
    
    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};
// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private
const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    
    const application = await Application.findById(id)
      .populate('qrCodeId');
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    // Verify user owns the QR code
    if (!application.qrCodeId || application.qrCodeId.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this application'
      });
    }
    
    // Cannot delete approved applications (they become tenants)
    if (application.status === 'Approved') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete approved applications'
      });
    }
    
    await application.deleteOne();
    
    res.json({
      success: true,
      message: 'Application deleted successfully'
    });
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

module.exports = {
  submitApplication,
  getApplications,
  getApplicationById,
  reviewApplication,
  getApplicationStats,
  deleteApplication, 
};