import React from 'react';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import AddTenantForm from '../components/Tenants/AddTenantForm';
import '../styles/Dashboard.css';

const AddTenantPage = () => {
  return (
    <div className="dashboard-container">
      <Header />
      <div className="dashboard-content">
        <Sidebar />
        
        <main className="main-content">
          <div className="page-header">
            <div>
              <h2>Add New Tenant</h2>
              <p>Fill in the tenant details below</p>
            </div>
          </div>
          <AddTenantForm />
        </main>
      </div>
    </div>
  );
};

export default AddTenantPage;