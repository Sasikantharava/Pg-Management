const mongoose = require('mongoose');

const qrCodeSchema = mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      default: 'Room QR Code',
    },
    roomNumber: {
      type: String,
      required: true,
    },
    roomType: {
      type: String,
      enum: ['Single', 'Double', 'Shared'],
      default: 'Single',
    },
    monthlyRent: {
      type: Number,
      required: true,
    },
    securityDeposit: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    redirectUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const QRCode = mongoose.model('QRCode', qrCodeSchema);
module.exports = QRCode;