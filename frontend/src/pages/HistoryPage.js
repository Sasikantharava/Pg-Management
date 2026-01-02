import React, { useState, useEffect } from 'react';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import HistoryFilters from '../components/History/HistoryFilters';
import HistoryTable from '../components/History/HistoryTable';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import '../styles/History.css';

const HistoryPage = () => {
  const [tenants, setTenants] = useState([]);
  const [stats, setStats] = useState({ total: 0, qr: 0, manual: 0 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    year: 'all',
    month: 'all',
    roomType: 'all',
    status: 'all',
    source: 'all',
    search: '',
  });

  useEffect(() => {
    fetchHistory();
  }, [filters]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      
      // Build query string from filters
      const queryParams = new URLSearchParams();
      if (filters.year !== 'all') queryParams.append('year', filters.year);
      if (filters.month !== 'all') queryParams.append('month', filters.month);
      if (filters.roomType !== 'all') queryParams.append('roomType', filters.roomType);
      if (filters.status !== 'all') queryParams.append('status', filters.status);
      if (filters.source !== 'all') queryParams.append('source', filters.source);
      if (filters.search) queryParams.append('search', filters.search);
      
      const response = await api.get(`/tenants/history?${queryParams}`);
      setTenants(response.data.tenants || []);
      setStats(response.data.stats || { total: 0, qr: 0, manual: 0 });
      
    } catch (error) {
      console.error('Error fetching history:', error);
      setTenants([]);
      setStats({ total: 0, qr: 0, manual: 0 });
      if (error.response?.status !== 401) {
        toast.error('Failed to load history');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    if (filterType === 'clear') {
      setFilters({
        year: 'all',
        month: 'all',
        roomType: 'all',
        status: 'all',
        source: 'all',
        search: '',
      });
    } else {
      setFilters(prev => ({
        ...prev,
        [filterType]: value,
      }));
    }
  };

  return (
    <div className="dashboard-container">
      <Header />
      <div className="dashboard-content">
        <Sidebar />
        
        <main className="main-content">
          <div className="page-header">
            <div>
              <h2>Tenants History</h2>
              <p>View and filter all tenant records</p>
            </div>
            
            <div className="history-stats">
              <div className="stat-card">
                <div className="stat-icon total">👥</div>
                <div className="stat-content">
                  <h3>{stats.total}</h3>
                  <p>Total Tenants</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon manual">➕</div>
                <div className="stat-content">
                  <h3>{stats.manual}</h3>
                  <p>Manual Added</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon qr">🔲</div>
                <div className="stat-content">
                  <h3>{stats.qr}</h3>
                  <p>QR Applications</p>
                </div>
              </div>
            </div>
          </div>

          <div className="history-container">
            <HistoryFilters
              filters={filters}
              onFilterChange={handleFilterChange}
            />
            
            <div className="history-content">
              <HistoryTable
                tenants={tenants}
                loading={loading}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HistoryPage;