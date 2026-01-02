import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';
import '../../styles/QRSystem.css';

const QRForm = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [qrDetails, setQRDetails] = useState(null);
  const [formData, setFormData] = useState({
    applicantName: '',
    applicantEmail: '',
    applicantPhone: '',
    applicantAge: '',
    applicantOccupation: '',
    emergencyContact: '',
    permanentAddress: '',
    idProofType: 'Aadhaar',
    idProofNumber: '',
    previousPGHistory: '',
    specialRequirements: '',
    roomPreference: '',
    expectedStayDuration: '6 months',
  });

  useEffect(() => {
    fetchQRDetails();
  }, [code]);

  const fetchQRDetails = async () => {
    try {
      const response = await api.get(`/qr/${code}`);
      setQRDetails(response.data.qrCode);
    } catch (error) {
      toast.error('Invalid or expired QR code');
      navigate('/');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.applicantName || !formData.applicantEmail || !formData.applicantPhone) {
      toast.error('Please fill required fields');
      return;
    }

    if (!formData.applicantEmail.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }

    if (formData.applicantPhone.length < 10) {
      toast.error('Phone number must be at least 10 digits');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post(`/applications/submit/${code}`, formData);
      
      toast.success('Application submitted successfully!');
      toast.success('The PG owner will review your application shortly.');
      
      // Reset form
      setFormData({
        applicantName: '',
        applicantEmail: '',
        applicantPhone: '',
        applicantAge: '',
        applicantOccupation: '',
        emergencyContact: '',
        permanentAddress: '',
        idProofType: 'Aadhaar',
        idProofNumber: '',
        previousPGHistory: '',
        specialRequirements: '',
        roomPreference: '',
        expectedStayDuration: '6 months',
      });
      
      // Show success message
      setTimeout(() => {
        navigate('/application-success');
      }, 2000);
      
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to submit application';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!qrDetails) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading QR details...</p>
      </div>
    );
  }

  return (
    <div className="qr-form-public-container">
      <div className="qr-form-header">
        <h1>PG Admission Application</h1>
        <p>Fill out the form to apply for admission</p>
      </div>
      
      <div className="qr-room-details">
        <h2>Room Information</h2>
        <div className="room-details-grid">
          <div className="room-detail">
            <span className="label">Room Number:</span>
            <span className="value">{qrDetails.roomNumber}</span>
          </div>
          <div className="room-detail">
            <span className="label">Room Type:</span>
            <span className="value">{qrDetails.roomType}</span>
          </div>
          <div className="room-detail">
            <span className="label">Monthly Rent:</span>
            <span className="value rent">₹{qrDetails.monthlyRent}</span>
          </div>
          <div className="room-detail">
            <span className="label">Security Deposit:</span>
            <span className="value">₹{qrDetails.securityDeposit}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="qr-public-form">
        <div className="form-section">
          <h3>Personal Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="applicantName"
                value={formData.applicantName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="applicantEmail"
                value={formData.applicantEmail}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="applicantPhone"
                value={formData.applicantPhone}
                onChange={handleChange}
                placeholder="Enter 10-digit phone number"
                maxLength="10"
                required
              />
            </div>

            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                name="applicantAge"
                value={formData.applicantAge}
                onChange={handleChange}
                placeholder="Enter your age"
                min="18"
                max="60"
              />
            </div>

            <div className="form-group">
              <label>Occupation</label>
              <input
                type="text"
                name="applicantOccupation"
                value={formData.applicantOccupation}
                onChange={handleChange}
                placeholder="e.g., Student, Employee, Business"
              />
            </div>

            <div className="form-group">
              <label>Emergency Contact *</label>
              <input
                type="tel"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                placeholder="Emergency contact number"
                maxLength="10"
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Address & Identification</h3>
          <div className="form-group">
            <label>Permanent Address *</label>
            <textarea
              name="permanentAddress"
              value={formData.permanentAddress}
              onChange={handleChange}
              placeholder="Enter your complete permanent address"
              rows="3"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>ID Proof Type</label>
              <select
                name="idProofType"
                value={formData.idProofType}
                onChange={handleChange}
              >
                <option value="Aadhaar">Aadhaar Card</option>
                <option value="PAN">PAN Card</option>
                <option value="Passport">Passport</option>
                <option value="Driving License">Driving License</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>ID Proof Number *</label>
              <input
                type="text"
                name="idProofNumber"
                value={formData.idProofNumber}
                onChange={handleChange}
                placeholder="Enter ID proof number"
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Additional Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Previous PG/Stay History</label>
              <textarea
                name="previousPGHistory"
                value={formData.previousPGHistory}
                onChange={handleChange}
                placeholder="Mention any previous PG/hostel experience"
                rows="2"
              />
            </div>

            <div className="form-group">
              <label>Special Requirements</label>
              <textarea
                name="specialRequirements"
                value={formData.specialRequirements}
                onChange={handleChange}
                placeholder="Any special requirements or preferences"
                rows="2"
              />
            </div>

            <div className="form-group">
              <label>Room Preference</label>
              <input
                type="text"
                name="roomPreference"
                value={formData.roomPreference}
                onChange={handleChange}
                placeholder="e.g., Ground floor, corner room, etc."
              />
            </div>

            <div className="form-group">
              <label>Expected Stay Duration</label>
              <select
                name="expectedStayDuration"
                value={formData.expectedStayDuration}
                onChange={handleChange}
              >
                <option value="1 month">1 Month</option>
                <option value="3 months">3 Months</option>
                <option value="6 months">6 Months</option>
                <option value="1 year">1 Year</option>
                <option value="More than 1 year">More than 1 Year</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-notice">
          <p>📋 <strong>Note:</strong> Your application will be reviewed by the PG owner. 
          You will be notified via email about the status of your application.</p>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-application-button" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QRForm;