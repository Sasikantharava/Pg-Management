const mongoose = require('mongoose');

const tenantSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add tenant name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add email'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Please add phone number'],
    },
    emergencyContact: {
      type: String,
      required: true,
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
    admissionDate: {
      type: Date,
      default: Date.now,
    },
    monthlyRent: {
      type: Number,
      required: true,
    },
    securityDeposit: {
      type: Number,
      required: true,
    },
    totalPaid: {
      type: Number,
      default: 0,
    },
    address: {
      type: String,
      required: true,
    },
    idProof: {
      type: String,
      required: true,
    },

    // ------------------------------
    // 📌 NEW FIELDS FOR QR APPLICATION
    // ------------------------------
    source: {
      type: String,
      enum: ['manual', 'qr'],
      default: 'manual',
    },
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
    },
    // ------------------------------

    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual: Month-Year from admission date
tenantSchema.virtual('monthYear').get(function() {
  const date = this.admissionDate;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
});

const Tenant = mongoose.model('Tenant', tenantSchema);
module.exports = Tenant;
