import React, { useState } from 'react';
import TenantModal from './TenantModal';
import '../../styles/Dashboard.css';

const TenantCard = ({ tenant, onDelete, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);

  const handleViewClick = () => {
    setShowModal(true);
  };

  const handleEditClick = () => {
    setShowModal(true);
  };

  return (
    <>
      <div className="tenant-card">
        <div className="tenant-card-header">
          <div className="tenant-avatar-large">
            {tenant.name.charAt(0).toUpperCase()}
          </div>
          <div className="tenant-status">
            <span className={`status-badge ${tenant.status?.toLowerCase() || 'active'}`}>
              {tenant.status || 'Active'}
            </span>
          </div>
        </div>

        <div className="tenant-card-body">
          <h3 className="tenant-name">{tenant.name}</h3>
          <p className="tenant-email">{tenant.email}</p>
          
          <div className="tenant-details">
            <div className="detail-item">
              <span className="detail-label">Room</span>
              <span className="detail-value">
                {tenant.roomNumber} ({tenant.roomType})
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Phone</span>
              <span className="detail-value">{tenant.phone}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Admission Date</span>
              <span className="detail-value">
                {new Date(tenant.admissionDate).toLocaleDateString()}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Monthly Rent</span>
              <span className="detail-value rent">₹{tenant.monthlyRent}</span>
            </div>
          </div>
        </div>

        <div className="tenant-card-footer">
          <button className="action-button view" onClick={handleViewClick}>
            View
          </button>
          <button className="action-button edit" onClick={handleEditClick}>
            Edit
          </button>
          <button 
            className="action-button delete"
            onClick={() => onDelete(tenant._id)}
          >
            Delete
          </button>
        </div>
      </div>

      {showModal && (
        <TenantModal
          tenant={tenant}
          onClose={() => setShowModal(false)}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
};

export default TenantCard;