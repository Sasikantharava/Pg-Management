import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import '../styles/TenantDetails.css';

const TenantDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTenantDetails();
  }, [id]);

  const fetchTenantDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/tenants/${id}`);
      setTenant(response.data);
    } catch (error) {
      console.error('Error fetching tenant details:', error);
      toast.error('Failed to load tenant details');
      navigate('/tenants');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this tenant?')) {
      try {
        await api.delete(`/tenants/${id}`);
        toast.success('Tenant deleted successfully');
        navigate('/tenants');
      } catch (error) {
        toast.error('Error deleting tenant');
      }
    }
  };

  const handleEdit = () => {
    navigate(`/add-tenant?edit=${id}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="dashboard-container">
        <Header />
        <div className="dashboard-content">
          <Sidebar />
          <main className="main-content">
            <div className="empty-state">
              <div className="empty-icon">❌</div>
              <h3>Tenant Not Found</h3>
              <p>The tenant you're looking for doesn't exist.</p>
              <button 
                className="primary-button"
                onClick={() => navigate('/tenants')}
              >
                ← Back to Tenants
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="dashboard-container">
      <Header />
      <div className="dashboard-content">
        <Sidebar />
        
        <main className="main-content">
          <div className="page-header">
            <div>
              <button 
                className="back-button"
                onClick={() => navigate(-1)}
              >
                ← Back
              </button>
              <h2>Tenant Details</h2>
              <p>Complete information about {tenant.name}</p>
            </div>
            <div className="header-actions">
              <button className="edit-button" onClick={handleEdit}>
                ✏️ Edit
              </button>
              <button className="delete-button" onClick={handleDelete}>
                🗑️ Delete
              </button>
            </div>
          </div>

          <div className="tenant-details-container">
            {/* Profile Header */}
            <div className="tenant-profile-header">
              <div className="tenant-avatar-xl">
                {tenant.name.charAt(0).toUpperCase()}
              </div>
              <div className="tenant-profile-info">
                <h1>{tenant.name}</h1>
                <div className="tenant-meta">
                  <span className={`status-badge ${tenant.status?.toLowerCase() || 'active'}`}>
                    {tenant.status || 'Active'}
                  </span>
                  <span className="tenant-email">{tenant.email}</span>
                  <span className="tenant-phone">{tenant.phone}</span>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="details-grid">
              {/* Personal Information */}
              <div className="detail-card">
                <h3 className="card-title">
                  <span className="card-icon">👤</span> Personal Information
                </h3>
                <div className="detail-list">
                  <div className="detail-item">
                    <span className="detail-label">Full Name</span>
                    <span className="detail-value">{tenant.name}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email Address</span>
                    <span className="detail-value">{tenant.email}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Phone Number</span>
                    <span className="detail-value">{tenant.phone}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Emergency Contact</span>
                    <span className="detail-value">{tenant.emergencyContact}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">ID Proof</span>
                    <span className="detail-value">{tenant.idProof}</span>
                  </div>
                </div>
              </div>

              {/* Room Information */}
              <div className="detail-card">
                <h3 className="card-title">
                  <span className="card-icon">🏠</span> Room Information
                </h3>
                <div className="detail-list">
                  <div className="detail-item">
                    <span className="detail-label">Room Number</span>
                    <span className="detail-value room-highlight">{tenant.roomNumber}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Room Type</span>
                    <span className="detail-value">{tenant.roomType}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Admission Date</span>
                    <span className="detail-value">{formatDate(tenant.admissionDate)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Duration</span>
                    <span className="detail-value">
                      {Math.floor((new Date() - new Date(tenant.admissionDate)) / (1000 * 60 * 60 * 24))} days
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="detail-card">
                <h3 className="card-title">
                  <span className="card-icon">💰</span> Payment Details
                </h3>
                <div className="detail-list">
                  <div className="detail-item">
                    <span className="detail-label">Monthly Rent</span>
                    <span className="detail-value rent-highlight">₹{tenant.monthlyRent}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Security Deposit</span>
                    <span className="detail-value">₹{tenant.securityDeposit}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Total Paid</span>
                    <span className="detail-value">₹{tenant.totalPaid || 0}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Balance</span>
                    <span className="detail-value balance">
                      ₹{(tenant.securityDeposit || 0) - (tenant.totalPaid || 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="detail-card full-width">
                <h3 className="card-title">
                  <span className="card-icon">📍</span> Address
                </h3>
                <div className="address-content">
                  <p className="address-text">{tenant.address}</p>
                </div>
              </div>

              {/* Additional Information */}
              <div className="detail-card full-width">
                <h3 className="card-title">
                  <span className="card-icon">📝</span> Additional Information
                </h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Created On</span>
                    <span className="detail-value">{formatDate(tenant.createdAt)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Last Updated</span>
                    <span className="detail-value">{formatDate(tenant.updatedAt)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Status</span>
                    <span className={`status-badge ${tenant.status?.toLowerCase() || 'active'}`}>
                      {tenant.status || 'Active'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="tenant-actions">
              <button className="action-button primary" onClick={handleEdit}>
                ✏️ Edit Tenant
              </button>
              <button className="action-button secondary" onClick={() => navigate('/tenants')}>
                ← Back to Tenants
              </button>
              <button className="action-button danger" onClick={handleDelete}>
                🗑️ Delete Tenant
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TenantDetailsPage;