import React, { useState, useEffect } from 'react';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import TenantCard from '../components/Tenants/TenantCard';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import '../styles/Dashboard.css';

const TenantsPage = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tenants/current-month');
      setTenants(response.data);
    } catch (error) {
      console.error('Error fetching tenants:', error);
      setTenants([]); // Empty array instead of mock data
      if (error.response?.status !== 401) {
        toast.error('Failed to load tenants');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this tenant?')) {
      try {
        await api.delete(`/tenants/${id}`);
        setTenants(tenants.filter(tenant => tenant._id !== id));
        toast.success('Tenant deleted successfully');
      } catch (error) {
        toast.error('Error deleting tenant');
      }
    }
  };

  const handleUpdate = () => {
    fetchTenants(); // Refresh the list
  };

  const filteredTenants = tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Header />
      <div className="dashboard-content">
        <Sidebar />
        
        <main className="main-content">
          <div className="page-header">
            <div>
              <h2>Current Month Tenants</h2>
              <p>Manage all tenants admitted this month</p>
            </div>
            <Link to="/add-tenant" className="primary-button">
              + Add New Tenant
            </Link>
          </div>

          {/* Search Bar */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by name, room number, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button
                className="clear-search"
                onClick={() => setSearchTerm('')}
              >
                Clear
              </button>
            )}
          </div>

          {/* Stats Bar */}
          <div className="stats-bar">
            <div className="stat-item">
              <span className="stat-label">Total Tenants:</span>
              <span className="stat-value">{filteredTenants.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Active:</span>
              <span className="stat-value active">
                {filteredTenants.filter(t => t.status === 'Active').length}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Monthly Revenue:</span>
              <span className="stat-value revenue">
                ₹{filteredTenants.reduce((sum, t) => sum + (t.monthlyRent || 0), 0).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Tenants Grid */}
          {filteredTenants.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <h3>No Tenants Found</h3>
              <p>
                {searchTerm 
                  ? 'No tenants match your search criteria.'
                  : 'No tenants have been added this month yet.'
                }
              </p>
              <Link to="/add-tenant" className="primary-button">
                Add First Tenant
              </Link>
            </div>
          ) : (
            <div className="tenants-grid">
              {filteredTenants.map((tenant) => (
                <TenantCard
                  key={tenant._id}
                  tenant={tenant}
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TenantsPage;