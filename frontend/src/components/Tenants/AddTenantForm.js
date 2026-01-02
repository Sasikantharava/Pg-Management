import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';
import '../../styles/Forms.css';

const AddTenantForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    emergencyContact: '',
    roomNumber: '',
    roomType: 'Single',
    monthlyRent: '',
    securityDeposit: '',
    address: '',
    idProof: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    // Allow only numbers
    if (value === '' || /^\d+$/.test(value)) {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const calculateTotal = () => {
    const rent = parseInt(formData.monthlyRent) || 0;
    const deposit = parseInt(formData.securityDeposit) || 0;
    return rent + deposit;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.roomNumber) {
      toast.error('Please fill all required fields');
      return;
    }

    if (!formData.email.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }

    if (formData.phone.length < 10) {
      toast.error('Phone number must be at least 10 digits');
      return;
    }

    try {
      setLoading(true);
      
      const tenantData = {
        ...formData,
        monthlyRent: parseInt(formData.monthlyRent) || 0,
        securityDeposit: parseInt(formData.securityDeposit) || 0,
      };

      // REAL API CALL
      await api.post('/tenants', tenantData);
      
      toast.success('Tenant added successfully!');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        emergencyContact: '',
        roomNumber: '',
        roomType: 'Single',
        monthlyRent: '',
        securityDeposit: '',
        address: '',
        idProof: '',
      });
      
      // Navigate back to tenants page after 1 second
      setTimeout(() => {
        navigate('/tenants');
      }, 1000);
      
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add tenant';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container mobile-form">
      <form onSubmit={handleSubmit} className="tenant-form">
        <div className="form-header">
          <h2>Add New Tenant</h2>
          <p>Fill in the tenant details below</p>
        </div>

        <div className="form-grid">
          {/* Personal Information */}
          <div className="form-section">
            <h3 className="section-title">Personal Information</h3>
            
            <div className="form-group">
              <label htmlFor="name">
                Full Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter tenant's full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                Email <span className="required">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">
                Phone Number <span className="required">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleNumberChange}
                placeholder="Enter 10-digit phone number"
                maxLength="10"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="emergencyContact">
                Emergency Contact <span className="required">*</span>
              </label>
              <input
                type="tel"
                id="emergencyContact"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleNumberChange}
                placeholder="Emergency contact number"
                maxLength="10"
                required
              />
            </div>
          </div>

          {/* Room & Payment Information */}
          <div className="form-section">
            <h3 className="section-title">Room & Payment Details</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="roomNumber">
                  Room Number <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="roomNumber"
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleChange}
                  placeholder="e.g., 101"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="roomType">Room Type</label>
                <select
                  id="roomType"
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleChange}
                >
                  <option value="Single">Single Room</option>
                  <option value="Double">Double Room</option>
                  <option value="Shared">Shared Room</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="monthlyRent">
                  Monthly Rent (₹) <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="monthlyRent"
                  name="monthlyRent"
                  value={formData.monthlyRent}
                  onChange={handleNumberChange}
                  placeholder="e.g., 8000"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="securityDeposit">
                  Security Deposit (₹) <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="securityDeposit"
                  name="securityDeposit"
                  value={formData.securityDeposit}
                  onChange={handleNumberChange}
                  placeholder="e.g., 10000"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Total Amount</label>
              <div className="total-amount">
                ₹{calculateTotal().toLocaleString()}
              </div>
              <small className="hint">
                (Monthly Rent + Security Deposit)
              </small>
            </div>
          </div>

          {/* Additional Information */}
          <div className="form-section full-width">
            <h3 className="section-title">Additional Information</h3>
            
            <div className="form-group">
              <label htmlFor="address">
                Address <span className="required">*</span>
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter complete address"
                rows="3"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="idProof">
                ID Proof Number <span className="required">*</span>
              </label>
              <input
                type="text"
                id="idProof"
                name="idProof"
                value={formData.idProof}
                onChange={handleChange}
                placeholder="Aadhaar, PAN, or Passport number"
                required
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate('/tenants')}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Tenant'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTenantForm;