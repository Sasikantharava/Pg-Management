import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';
import '../../styles/Forms.css';

const TenantModal = ({ tenant, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
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
    status: 'Active',
  });

  useEffect(() => {
    if (tenant) {
      setFormData({
        name: tenant.name || '',
        email: tenant.email || '',
        phone: tenant.phone || '',
        emergencyContact: tenant.emergencyContact || '',
        roomNumber: tenant.roomNumber || '',
        roomType: tenant.roomType || 'Single',
        monthlyRent: tenant.monthlyRent || '',
        securityDeposit: tenant.securityDeposit || '',
        address: tenant.address || '',
        idProof: tenant.idProof || '',
        status: tenant.status || 'Active',
      });
    }
  }, [tenant]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    if (value === '' || /^\d+$/.test(value)) {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const updatedData = {
        ...formData,
        monthlyRent: parseInt(formData.monthlyRent) || 0,
        securityDeposit: parseInt(formData.securityDeposit) || 0,
      };

      // Mock update
      console.log('Updating tenant:', updatedData);
      
      // Actual API call
      // await api.put(`/tenants/${tenant._id}`, updatedData);
      
      toast.success('Tenant updated successfully!');
      setIsEditing(false);
      if (onUpdate) onUpdate();
      
    } catch (error) {
      toast.error('Failed to update tenant');
    } finally {
      setLoading(false);
    }
  };

  if (!tenant) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            {isEditing ? 'Edit Tenant' : 'Tenant Details'}
            <span className={`status-badge ${formData.status.toLowerCase()}`}>
              {formData.status}
            </span>
          </h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-grid modal-grid">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleNumberChange}
                  maxLength="10"
                  required
                />
              </div>

              <div className="form-group">
                <label>Emergency Contact</label>
                <input
                  type="tel"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleNumberChange}
                  maxLength="10"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Room Number</label>
                  <input
                    type="text"
                    name="roomNumber"
                    value={formData.roomNumber}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Room Type</label>
                  <select
                    name="roomType"
                    value={formData.roomType}
                    onChange={handleChange}
                  >
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                    <option value="Shared">Shared</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Monthly Rent (₹)</label>
                  <input
                    type="text"
                    name="monthlyRent"
                    value={formData.monthlyRent}
                    onChange={handleNumberChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Security Deposit (₹)</label>
                  <input
                    type="text"
                    name="securityDeposit"
                    value={formData.securityDeposit}
                    onChange={handleNumberChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label>Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="2"
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>ID Proof</label>
                <input
                  type="text"
                  name="idProof"
                  value={formData.idProof}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={() => setIsEditing(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="submit-button"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div className="modal-body">
            <div className="tenant-details-grid">
              <div className="detail-row">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{tenant.name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{tenant.email}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Phone:</span>
                <span className="detail-value">{tenant.phone}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Emergency Contact:</span>
                <span className="detail-value">{tenant.emergencyContact}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Room Details:</span>
                <span className="detail-value">
                  {tenant.roomNumber} ({tenant.roomType})
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Monthly Rent:</span>
                <span className="detail-value rent">₹{tenant.monthlyRent}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Security Deposit:</span>
                <span className="detail-value">₹{tenant.securityDeposit}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Admission Date:</span>
                <span className="detail-value">
                  {new Date(tenant.admissionDate).toLocaleDateString()}
                </span>
              </div>
              <div className="detail-row full-width">
                <span className="detail-label">Address:</span>
                <span className="detail-value">{tenant.address}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">ID Proof:</span>
                <span className="detail-value">{tenant.idProof}</span>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="edit-button"
                onClick={() => setIsEditing(true)}
              >
                Edit Details
              </button>
              <button
                className="close-modal-button"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantModal;