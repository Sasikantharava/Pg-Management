import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';
import '../../styles/QRSystem.css';

const QRGenerator = ({ onQRGenerated }) => {
  const [loading, setLoading] = useState(false);
  const [generatedQR, setGeneratedQR] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    roomNumber: '',
    roomType: 'Single',
    monthlyRent: '',
    securityDeposit: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
    
    if (!formData.name || !formData.roomNumber || !formData.monthlyRent) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/qr/generate', formData);
      
      setGeneratedQR(response.data);
      toast.success('QR code generated successfully!');
      
      if (onQRGenerated) {
        onQRGenerated();
      }
      
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to generate QR code';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = () => {
    if (!generatedQR?.qrImage) return;
    
    const link = document.createElement('a');
    link.href = generatedQR.qrImage;
    link.download = `qr-${generatedQR.qrCode.roomNumber}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('QR code downloaded!');
  };

  const copyLink = () => {
    if (!generatedQR?.downloadUrl) return;
    
    navigator.clipboard.writeText(generatedQR.downloadUrl);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className="qr-generator-container">
      <h3 className="section-title">Generate New QR Code</h3>
      
      {!generatedQR ? (
        <form onSubmit={handleSubmit} className="qr-generator-form">
          <div className="form-grid">
            <div className="form-group">
              <label>QR Name/Title *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Room 101 Admission"
                required
              />
            </div>

            <div className="form-group">
              <label>Room Number *</label>
              <input
                type="text"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleChange}
                placeholder="e.g., 101"
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
                <option value="Single">Single Room</option>
                <option value="Double">Double Room</option>
                <option value="Shared">Shared Room</option>
              </select>
            </div>

            <div className="form-group">
              <label>Monthly Rent (₹) *</label>
              <input
                type="text"
                name="monthlyRent"
                value={formData.monthlyRent}
                onChange={handleNumberChange}
                placeholder="e.g., 8000"
                required
              />
            </div>

            <div className="form-group">
              <label>Security Deposit (₹) *</label>
              <input
                type="text"
                name="securityDeposit"
                value={formData.securityDeposit}
                onChange={handleNumberChange}
                placeholder="e.g., 10000"
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="generate-button" disabled={loading}>
              {loading ? 'Generating...' : 'Generate QR Code'}
            </button>
          </div>
        </form>
      ) : (
        <div className="qr-preview-container">
          <div className="qr-preview-header">
            <h4>QR Code Generated Successfully!</h4>
            <button 
              className="close-preview"
              onClick={() => setGeneratedQR(null)}
            >
              ×
            </button>
          </div>
          
          <div className="qr-preview-content">
            <div className="qr-image-container">
              <img 
                src={generatedQR.qrImage} 
                alt="QR Code" 
                className="qr-image"
              />
              <p className="qr-room">Room: {generatedQR.qrCode.roomNumber}</p>
            </div>
            
            <div className="qr-details">
              <h5>QR Code Details</h5>
              <div className="detail-item">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{generatedQR.qrCode.name}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Room Type:</span>
                <span className="detail-value">{generatedQR.qrCode.roomType}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Monthly Rent:</span>
                <span className="detail-value">₹{generatedQR.qrCode.monthlyRent}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Security Deposit:</span>
                <span className="detail-value">₹{generatedQR.qrCode.securityDeposit}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">QR Code:</span>
                <span className="detail-value code">{generatedQR.qrCode.code}</span>
              </div>
            </div>
          </div>
          
          <div className="qr-actions">
            <button className="action-button download" onClick={downloadQR}>
              📥 Download QR
            </button>
            <button className="action-button copy" onClick={copyLink}>
              📋 Copy Link
            </button>
            <button 
              className="action-button generate-new"
              onClick={() => setGeneratedQR(null)}
            >
              🔄 Generate New
            </button>
          </div>
          
          <div className="qr-instructions">
            <h6>Instructions:</h6>
            <ol>
              <li>Download the QR code and print it</li>
              <li>Paste it near the room entrance</li>
              <li>Prospective tenants can scan it to apply</li>
              <li>You'll receive applications in the Applications section</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRGenerator;