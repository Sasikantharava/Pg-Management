import React, { useState, useEffect } from 'react';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import QRGenerator from '../components/QRSystem/QRGenerator';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import '../styles/QRSystem.css';

const QRManagementPage = () => {
  const [qrCodes, setQRCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('generate');

  useEffect(() => {
    fetchQRCodes();
  }, []);

  const fetchQRCodes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/qr');
      setQRCodes(response.data.qrCodes || []);
    } catch (error) {
      console.error('Error fetching QR codes:', error);
      toast.error('Failed to load QR codes');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleQR = async (id, isActive) => {
    try {
      await api.put(`/qr/${id}`, { isActive: !isActive });
      toast.success(`QR code ${!isActive ? 'activated' : 'deactivated'}`);
      fetchQRCodes();
    } catch (error) {
      toast.error('Failed to update QR code');
    }
  };

  const handleDeleteQR = async (id) => {
    if (window.confirm('Are you sure you want to delete this QR code?')) {
      try {
        await api.delete(`/qr/${id}`);
        toast.success('QR code deleted successfully');
        fetchQRCodes();
      } catch (error) {
        toast.error('Failed to delete QR code');
      }
    }
  };

  const handleQRGenerated = () => {
    fetchQRCodes();
    setActiveTab('manage');
  };

  const copyQRUrl = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('QR URL copied to clipboard!');
  };

  return (
    <div className="dashboard-container">
      <Header />
      <div className="dashboard-content">
        <Sidebar />
        
        <main className="main-content">
          <div className="page-header">
            <div>
              <h2>QR Code Management</h2>
              <p>Generate and manage QR codes for room admissions</p>
            </div>
          </div>

          <div className="qr-tabs">
            <button
              className={`tab-button ${activeTab === 'generate' ? 'active' : ''}`}
              onClick={() => setActiveTab('generate')}
            >
              🔲 Generate QR
            </button>
            <button
              className={`tab-button ${activeTab === 'manage' ? 'active' : ''}`}
              onClick={() => setActiveTab('manage')}
            >
              📋 Manage QR Codes ({qrCodes.length})
            </button>
          </div>

          <div className="qr-content">
            {activeTab === 'generate' ? (
              <QRGenerator onQRGenerated={handleQRGenerated} />
            ) : (
              <div className="qr-codes-container">
                {loading ? (
                  <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading QR codes...</p>
                  </div>
                ) : qrCodes.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">🔲</div>
                    <h3>No QR Codes Generated</h3>
                    <p>Generate your first QR code to start accepting applications.</p>
                    <button 
                      className="primary-button"
                      onClick={() => setActiveTab('generate')}
                    >
                      Generate QR Code
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="qr-codes-grid">
                      {qrCodes.map((qr) => (
                        <div key={qr._id} className="qr-code-card">
                          <div className="qr-card-header">
                            <div className="qr-status">
                              <span className={`status-dot ${qr.isActive ? 'active' : 'inactive'}`} />
                              <span>{qr.isActive ? 'Active' : 'Inactive'}</span>
                            </div>
                            <div className="qr-actions">
                              <button 
                                className="icon-button copy"
                                onClick={() => copyQRUrl(qr.redirectUrl)}
                                title="Copy URL"
                              >
                                📋
                              </button>
                              <button 
                                className="icon-button toggle"
                                onClick={() => handleToggleQR(qr._id, qr.isActive)}
                                title={qr.isActive ? 'Deactivate' : 'Activate'}
                              >
                                {qr.isActive ? '⏸️' : '▶️'}
                              </button>
                              <button 
                                className="icon-button delete"
                                onClick={() => handleDeleteQR(qr._id)}
                                title="Delete"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                          
                          <div className="qr-card-body">
                            <h4 className="qr-name">{qr.name}</h4>
                            <div className="qr-details">
                              <div className="detail">
                                <span className="label">Room:</span>
                                <span className="value">{qr.roomNumber}</span>
                              </div>
                              <div className="detail">
                                <span className="label">Type:</span>
                                <span className="value">{qr.roomType}</span>
                              </div>
                              <div className="detail">
                                <span className="label">Rent:</span>
                                <span className="value">₹{qr.monthlyRent}</span>
                              </div>
                              <div className="detail">
                                <span className="label">Deposit:</span>
                                <span className="value">₹{qr.securityDeposit}</span>
                              </div>
                            </div>
                            
                            <div className="qr-url">
                              <small>URL: </small>
                              <code>{qr.redirectUrl}</code>
                            </div>
                          </div>
                          
                          <div className="qr-card-footer">
                            <div className="qr-date">
                              Created: {new Date(qr.createdAt).toLocaleDateString()}
                            </div>
                            <a 
                              href={qr.redirectUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="preview-link"
                            >
                              🔗 Preview Form
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="qr-instructions-card">
                      <h4>💡 How to Use QR Codes:</h4>
                      <ol>
                        <li>Generate a QR code for each room</li>
                        <li>Print and paste the QR code near the room entrance</li>
                        <li>Prospective tenants scan the QR code with their phone camera</li>
                        <li>They fill out the application form online</li>
                        <li>You receive applications in the Applications section</li>
                        <li>Review and approve/reject applications</li>
                        <li>Approved applications automatically create tenant records</li>
                      </ol>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default QRManagementPage;