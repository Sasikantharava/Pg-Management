import React, { useState, useEffect } from 'react';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import ApplicationsList from '../components/QRSystem/ApplicationsList';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import '../styles/QRSystem.css';

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected

  useEffect(() => {
    fetchApplications();
    fetchStats();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/applications');
      setApplications(response.data.applications || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/applications/stats');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleStatusUpdate = () => {
    fetchApplications();
    fetchStats();
  };

  const handleDelete = (deletedId) => {
    // Remove the deleted application from state
    setApplications(applications.filter(app => app._id !== deletedId));
    
    // Refresh stats
    fetchStats();
  };

  const handleBulkDeleteRejected = async () => {
    const rejectedApps = applications.filter(app => app.status === 'Rejected');
    if (rejectedApps.length === 0) {
      toast.error('No rejected applications to delete');
      return;
    }

    if (!window.confirm(`Delete all ${rejectedApps.length} rejected applications?`)) {
      return;
    }

    try {
      setLoading(true);
      // Delete each rejected application
      const deletePromises = rejectedApps.map(app => 
        api.delete(`/applications/${app._id}`)
      );
      
      await Promise.all(deletePromises);
      
      toast.success(`Deleted ${rejectedApps.length} rejected applications`);
      
      // Refresh the list
      fetchApplications();
      fetchStats();
    } catch (error) {
      toast.error('Failed to delete some applications');
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  return (
    <div className="dashboard-container">
      <Header />
      <div className="dashboard-content">
        <Sidebar />
        
        <main className="main-content">
          <div className="page-header">
            <div>
              <h2>Applications</h2>
              <p>Review admission applications from QR codes</p>
            </div>
            
            {stats && (
              <div className="applications-stats">
                <div className="stat-card">
                  <div className="stat-icon total">📋</div>
                  <div className="stat-content">
                    <h3>{stats.total}</h3>
                    <p>Total</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon pending">⏳</div>
                  <div className="stat-content">
                    <h3>{stats.pending}</h3>
                    <p>Pending</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon approved">✅</div>
                  <div className="stat-content">
                    <h3>{stats.approved}</h3>
                    <p>Approved</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon rejected">❌</div>
                  <div className="stat-content">
                    <h3>{stats.rejected}</h3>
                    <p>Rejected</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="applications-header-actions">
            <div className="applications-filter-tabs">
              <button
                className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All ({applications.length})
              </button>
              <button
                className={`filter-tab ${filter === 'Pending' ? 'active' : ''}`}
                onClick={() => setFilter('Pending')}
              >
                Pending ({stats?.pending || 0})
              </button>
              <button
                className={`filter-tab ${filter === 'Approved' ? 'active' : ''}`}
                onClick={() => setFilter('Approved')}
              >
                Approved ({stats?.approved || 0})
              </button>
              <button
                className={`filter-tab ${filter === 'Rejected' ? 'active' : ''}`}
                onClick={() => setFilter('Rejected')}
              >
                Rejected ({stats?.rejected || 0})
              </button>
            </div>
            
            <div className="bulk-actions">
              <button
                className="bulk-delete-button"
                onClick={handleBulkDeleteRejected}
                disabled={!applications.some(app => app.status === 'Rejected') || loading}
              >
                🗑️ Clear All Rejected
              </button>
            </div>
          </div>

          <ApplicationsList
            applications={filteredApplications}
            loading={loading}
            onStatusUpdate={handleStatusUpdate}
            onDelete={handleDelete}
          />
        </main>
      </div>
    </div>
  );
};

export default ApplicationsPage;