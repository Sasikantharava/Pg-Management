import React from 'react';
import ApplicationCard from './ApplicationCard';
import '../../styles/QRSystem.css';

const ApplicationsList = ({ applications, loading, onStatusUpdate, onDelete }) => {
  if (loading) {
    return (
      <div className="applications-loading">
        <div className="spinner"></div>
        <p>Loading applications...</p>
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="applications-empty">
        <div className="empty-icon">📋</div>
        <h3>No Applications Yet</h3>
        <p>No one has submitted applications via your QR codes yet.</p>
      </div>
    );
  }

  // Sort applications: Pending first, then by date
  const sortedApplications = [...applications].sort((a, b) => {
    if (a.status === 'Pending' && b.status !== 'Pending') return -1;
    if (a.status !== 'Pending' && b.status === 'Pending') return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const pendingCount = applications.filter(app => app.status === 'Pending').length;

  return (
    <div className="applications-container">
      <div className="applications-header">
        <h3>Applications ({applications.length})</h3>
        {pendingCount > 0 && (
          <span className="pending-badge">
            {pendingCount} pending review
          </span>
        )}
      </div>
      
      <div className="applications-filters">
        <div className="stats-bar">
          <div className="stat">
            <span className="stat-label">Pending:</span>
            <span className="stat-value pending">
              {applications.filter(app => app.status === 'Pending').length}
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Approved:</span>
            <span className="stat-value approved">
              {applications.filter(app => app.status === 'Approved').length}
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Rejected:</span>
            <span className="stat-value rejected">
              {applications.filter(app => app.status === 'Rejected').length}
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Deleted:</span>
            <button 
              className="clear-deleted-btn"
              onClick={() => {
                // Optional: Add bulk delete for rejected apps
                if (window.confirm('Delete all rejected applications?')) {
                  // Implement bulk delete if needed
                }
              }}
            >
              Clear Rejected
            </button>
          </div>
        </div>
      </div>
      
      <div className="applications-grid">
        {sortedApplications.map((application) => (
          <ApplicationCard
            key={application._id}
            application={application}
            onStatusUpdate={onStatusUpdate}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default ApplicationsList;