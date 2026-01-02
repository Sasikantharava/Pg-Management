import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Dashboard.css';

const RecentTenants = ({ tenants }) => {
  if (!tenants || tenants.length === 0) {
    return (
      <div className="recent-tenants empty">
        <p>No tenants added yet</p>
        <Link to="/add-tenant" className="add-button">
          Add First Tenant
        </Link>
      </div>
    );
  }

  return (
    <div className="recent-tenants">
      <div className="section-header">
        <h3>Recent Admissions</h3>
        <Link to="/tenants" className="view-all">
          View All →
        </Link>
      </div>
      
      <div className="tenants-list">
        {tenants.map((tenant) => (
          <div key={tenant._id} className="tenant-item">
            <div className="tenant-avatar">
              {tenant.name.charAt(0).toUpperCase()}
            </div>
            <div className="tenant-info">
              <h4>{tenant.name}</h4>
              <p>Room: {tenant.roomNumber} • {tenant.roomType}</p>
              <p className="tenant-date">
                Joined: {new Date(tenant.admissionDate).toLocaleDateString()}
              </p>
            </div>
            <div className="tenant-rent">
              <span className="rent-amount">₹{tenant.monthlyRent}</span>
              <span className="rent-label">/month</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTenants;