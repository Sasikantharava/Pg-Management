import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';
import '../../styles/QRSystem.css';

const ApplicationCard = ({ application, onStatusUpdate, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewData, setReviewData] = useState({
    status: '',
    adminNotes: '',
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleReview = async () => {
    if (!reviewData.status) {
      toast.error('Please select a status');
      return;
    }

    try {
      setLoading(true);
      await api.put(`/applications/${application._id}/review`, reviewData);
      
      toast.success(`Application ${reviewData.status.toLowerCase()} successfully`);
      setShowReviewModal(false);
      setReviewData({ status: '', adminNotes: '' });
      
      if (onStatusUpdate) {
        onStatusUpdate();
      }
    } catch (error) {
      toast.error('Failed to update application status');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`/applications/${application._id}`);
      
      toast.success('Application deleted successfully');
      setShowDeleteModal(false);
      
      if (onDelete) {
        onDelete(application._id);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete application';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'Approved': return 'success';
      case 'Rejected': return 'danger';
      default: return 'default';
    }
  };

  const getRoomDetails = () => {
    if (application.qrCodeId) {
      return `Room ${application.qrCodeId.roomNumber} (${application.qrCodeId.roomType})`;
    }
    return 'Room details not available';
  };

  const canDelete = () => {
    // Only allow deletion of pending or rejected applications
    return application.status !== 'Approved';
  };

  return (
    <>
      <div className="application-card">
        <div className="application-header">
          <div className="applicant-info">
            <div className="applicant-avatar">
              {application.applicantName.charAt(0).toUpperCase()}
            </div>
            <div className="applicant-details">
              <h4 className="applicant-name">{application.applicantName}</h4>
              <p className="applicant-email">{application.applicantEmail}</p>
              <p className="applicant-phone">{application.applicantPhone}</p>
            </div>
          </div>
          
          <div className="application-meta">
            <span className={`status-badge ${getStatusColor(application.status)}`}>
              {application.status}
            </span>
            <span className="application-date">
              {formatDate(application.createdAt)}
            </span>
          </div>
        </div>

        <div className="application-body">
          <div className="application-details">
            <div className="detail-row">
              <span className="detail-label">Room:</span>
              <span className="detail-value">{getRoomDetails()}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">ID Proof:</span>
              <span className="detail-value">
                {application.idProofType}: {application.idProofNumber}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Emergency Contact:</span>
              <span className="detail-value">{application.emergencyContact}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Occupation:</span>
              <span className="detail-value">{application.applicantOccupation || 'Not specified'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Expected Stay:</span>
              <span className="detail-value">{application.expectedStayDuration}</span>
            </div>
          </div>

          {application.specialRequirements && (
            <div className="special-requirements">
              <strong>Special Requirements:</strong>
              <p>{application.specialRequirements}</p>
            </div>
          )}

          {application.adminNotes && (
            <div className="admin-notes">
              <strong>Admin Notes:</strong>
              <p>{application.adminNotes}</p>
            </div>
          )}

          {application.reviewedAt && (
            <div className="review-info">
              <small>
                Reviewed on {formatDate(application.reviewedAt)}
              </small>
            </div>
          )}
        </div>

        <div className="application-footer">
          {application.status === 'Pending' ? (
            <div className="action-buttons">
              <button
                className="action-button approve"
                onClick={() => {
                  setReviewData({ status: 'Approved', adminNotes: '' });
                  setShowReviewModal(true);
                }}
              >
                ✅ Approve
              </button>
              <button
                className="action-button reject"
                onClick={() => {
                  setReviewData({ status: 'Rejected', adminNotes: '' });
                  setShowReviewModal(true);
                }}
              >
                ❌ Reject
              </button>
              <button
                className="action-button view"
                onClick={() => setShowReviewModal(true)}
              >
                👁️ View Details
              </button>
              {canDelete() && (
                <button
                  className="action-button delete"
                  onClick={() => setShowDeleteModal(true)}
                >
                  🗑️ Delete
                </button>
              )}
            </div>
          ) : (
            <div className="action-buttons">
              <button
                className="action-button view"
                onClick={() => setShowReviewModal(true)}
              >
                👁️ View Details
              </button>
              {canDelete() && (
                <button
                  className="action-button delete"
                  onClick={() => setShowDeleteModal(true)}
                >
                  🗑️ Delete
                </button>
              )}
              {application.status === 'Approved' && (
                <span className="tenant-created">✅ Tenant created</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Review Application</h3>
              <button className="close-modal" onClick={() => setShowReviewModal(false)}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="applicant-summary">
                <h4>{application.applicantName}</h4>
                <p>Email: {application.applicantEmail}</p>
                <p>Phone: {application.applicantPhone}</p>
                <p>Applied for: {getRoomDetails()}</p>
              </div>

              <div className="form-group">
                <label>Application Status *</label>
                <select
                  value={reviewData.status}
                  onChange={(e) => setReviewData({...reviewData, status: e.target.value})}
                >
                  <option value="">Select status</option>
                  <option value="Approved">Approve</option>
                  <option value="Rejected">Reject</option>
                </select>
              </div>

              <div className="form-group">
                <label>Notes (Optional)</label>
                <textarea
                  value={reviewData.adminNotes}
                  onChange={(e) => setReviewData({...reviewData, adminNotes: e.target.value})}
                  placeholder="Add any notes or reasons for your decision"
                  rows="3"
                />
                <small>This will be visible to the applicant if you reject.</small>
              </div>

              {application.permanentAddress && (
                <div className="additional-info">
                  <h5>Address:</h5>
                  <p>{application.permanentAddress}</p>
                </div>
              )}

              {application.previousPGHistory && (
                <div className="additional-info">
                  <h5>Previous PG History:</h5>
                  <p>{application.previousPGHistory}</p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                className="cancel-button"
                onClick={() => setShowReviewModal(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="submit-button"
                onClick={handleReview}
                disabled={loading || !reviewData.status}
              >
                {loading ? 'Processing...' : 'Submit Review'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content delete-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Delete Application</h3>
              <button className="close-modal" onClick={() => setShowDeleteModal(false)}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="delete-warning">
                <div className="warning-icon">⚠️</div>
                <h4>Are you sure you want to delete this application?</h4>
                <p>This action cannot be undone. The application will be permanently removed.</p>
                
                <div className="application-preview">
                  <p><strong>Applicant:</strong> {application.applicantName}</p>
                  <p><strong>Email:</strong> {application.applicantEmail}</p>
                  <p><strong>Room:</strong> {getRoomDetails()}</p>
                  <p><strong>Status:</strong> {application.status}</p>
                </div>
                
                <div className="delete-note">
                  <small>
                    Note: Approved applications cannot be deleted as they have created tenant records.
                    Only pending or rejected applications can be deleted.
                  </small>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="cancel-button"
                onClick={() => setShowDeleteModal(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="delete-confirm-button"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ApplicationCard;