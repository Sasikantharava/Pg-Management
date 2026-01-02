const mongoose = require('mongoose');

const applicationSchema = mongoose.Schema(
  {
    qrCodeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'QRCode',
      required: true,
    },
    applicantName: {
      type: String,
      required: true,
    },
    applicantEmail: {
      type: String,
      required: true,
    },
    applicantPhone: {
      type: String,
      required: true,
    },
    applicantAge: {
      type: Number,
    },
    applicantOccupation: {
      type: String,
    },
    emergencyContact: {
      type: String,
      required: true,
    },
    permanentAddress: {
      type: String,
      required: true,
    },
    idProofType: {
      type: String,
      enum: ['Aadhaar', 'PAN', 'Passport', 'Driving License', 'Other'],
      default: 'Aadhaar',
    },
    idProofNumber: {
      type: String,
      required: true,
    },
    previousPGHistory: {
      type: String,
    },
    specialRequirements: {
      type: String,
    },
    roomPreference: {
      type: String,
    },
    expectedStayDuration: {
      type: String, // e.g., "6 months", "1 year"
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    adminNotes: {
      type: String,
      default: '',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;