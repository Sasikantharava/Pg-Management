import React from 'react';
import QRForm from '../components/QRSystem/QRForm';
import '../styles/QRSystem.css';

const QRFormPage = () => {
  return (
    <div className="qr-form-page">
      <div className="qr-form-page-header">
        <div className="container">
          <h1 className="logo">PG Admission System</h1>
          <p className="tagline">Easy Online Admission Process</p>
        </div>
      </div>
      
      <div className="container">
        <QRForm />
      </div>
      
      <footer className="qr-form-footer">
        <div className="container">
          <p>© {new Date().getFullYear()} PG Management System. All rights reserved.</p>
          <p className="disclaimer">
            Your information is secure and will only be used for admission purposes.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default QRFormPage;