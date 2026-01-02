import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/History.css';

const HistoryTable = ({ tenants, loading }) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getSourceBadge = (source) => {
    if (source === 'qr') {
      return <span className="source-badge qr">QR Application</span>;
    }
    return <span className="source-badge manual">Manual</span>;
  };

  if (loading) {
    return (
      <div className="table-loading">
        <div className="spinner"></div>
        <p>Loading history...</p>
      </div>
    );
  }

  if (!tenants || tenants.length === 0) {
    return (
      <div className="table-empty">
        <div className="empty-icon">📜</div>
        <h3>No History Found</h3>
        <p>No tenant records found with the selected filters.</p>
      </div>
    );
  }

  return (
    <div className="history-table-container">
      <table className="history-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Contact</th>
            <th>Room Details</th>
            <th>Admission Date</th>
            <th>Source</th>
            <th>Monthly Rent</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tenants.map((tenant) => (
            <tr key={tenant._id}>
              <td>
                <div className="tenant-info-cell">
                  <div className="tenant-avatar-small">
                    {tenant.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="tenant-name">{tenant.name}</div>
                    <div className="tenant-email">{tenant.email}</div>
                  </div>
                </div>
              </td>
              <td>
                <div className="contact-cell">
                  <div>{tenant.phone}</div>
                  <div className="emergency-contact">
                    Emergency: {tenant.emergencyContact}
                  </div>
                </div>
              </td>
              <td>
                <div className="room-cell">
                  <div className="room-number">Room {tenant.roomNumber}</div>
                  <div className="room-type">{tenant.roomType}</div>
                </div>
              </td>
              <td>{formatDate(tenant.admissionDate)}</td>
              <td>
                {getSourceBadge(tenant.source || 'manual')}
              </td>
              <td>
                <div className="rent-cell">
                  <span className="rent-amount">₹{tenant.monthlyRent}</span>
                  <div className="deposit-amount">
                    Deposit: ₹{tenant.securityDeposit}
                  </div>
                </div>
              </td>
              <td>
                <span className={`status-badge ${tenant.status.toLowerCase()}`}>
                  {tenant.status}
                </span>
              </td>
              <td>
                <div className="action-buttons">
                  <button
                    className="action-btn view-btn"
                    onClick={() => navigate(`/tenant/${tenant._id}`)}
                  >
                    View
                  </button>
                  <button
                    className="action-btn edit-btn"
                    onClick={() => navigate(`/tenant/${tenant._id}/edit`)}
                  >
                    Edit
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="table-footer">
        <div className="table-stats">
          Showing {tenants.length} records
        </div>
        <div className="table-summary">
          Total Rent: ₹{tenants.reduce((sum, t) => sum + (t.monthlyRent || 0), 0).toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default HistoryTable;