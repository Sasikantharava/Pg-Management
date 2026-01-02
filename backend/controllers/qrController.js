const QRCode = require('../models/QRCode');
const { v4: uuidv4 } = require('uuid');
const QRCodeLib = require('qrcode');

// @desc    Generate new QR code
// @route   POST /api/qr/generate
// @access  Private
const generateQRCode = async (req, res) => {
  try {
    const { name, roomNumber, roomType, monthlyRent, securityDeposit } = req.body;
    
    // Generate unique QR code
    const qrCode = uuidv4();
    const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/qr-form/${qrCode}`;
    
    // Create QR code record
    const qrRecord = await QRCode.create({
      code: qrCode,
      name: name || `Room ${roomNumber}`,
      roomNumber,
      roomType: roomType || 'Single',
      monthlyRent: monthlyRent || 0,
      securityDeposit: securityDeposit || 0,
      createdBy: req.user._id,
      redirectUrl,
    });
    
    // Generate QR code image
    const qrImage = await QRCodeLib.toDataURL(redirectUrl, {
      errorCorrectionLevel: 'H',
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    res.status(201).json({
      success: true,
      qrCode: qrRecord,
      qrImage,
      downloadUrl: redirectUrl,
    });
  } catch (error) {
    console.error('QR generation error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// @desc    Get all QR codes for user
// @route   GET /api/qr
// @access  Private
const getUserQRCodes = async (req, res) => {
  try {
    const qrCodes = await QRCode.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      qrCodes,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// @desc    Get QR code details by code (Public)
// @route   GET /api/qr/:code
// @access  Public
const getQRCodeDetails = async (req, res) => {
  try {
    const { code } = req.params;
    
    const qrCode = await QRCode.findOne({ 
      code,
      isActive: true 
    });
    
    if (!qrCode) {
      return res.status(404).json({
        success: false,
        message: 'QR code not found or inactive'
      });
    }
    
    res.json({
      success: true,
      qrCode,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// @desc    Update QR code status
// @route   PUT /api/qr/:id
// @access  Private
const updateQRCode = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive, name } = req.body;
    
    const qrCode = await QRCode.findOne({
      _id: id,
      createdBy: req.user._id,
    });
    
    if (!qrCode) {
      return res.status(404).json({
        success: false,
        message: 'QR code not found'
      });
    }
    
    if (isActive !== undefined) qrCode.isActive = isActive;
    if (name) qrCode.name = name;
    
    await qrCode.save();
    
    res.json({
      success: true,
      qrCode,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// @desc    Delete QR code
// @route   DELETE /api/qr/:id
// @access  Private
const deleteQRCode = async (req, res) => {
  try {
    const { id } = req.params;
    
    const qrCode = await QRCode.findOneAndDelete({
      _id: id,
      createdBy: req.user._id,
    });
    
    if (!qrCode) {
      return res.status(404).json({
        success: false,
        message: 'QR code not found'
      });
    }
    
    res.json({
      success: true,
      message: 'QR code deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

module.exports = {
  generateQRCode,
  getUserQRCodes,
  getQRCodeDetails,
  updateQRCode,
  deleteQRCode,
};