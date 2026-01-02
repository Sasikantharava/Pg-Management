import React, { useState, useEffect } from 'react';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import StatsCard from '../components/Dashboard/StatsCard';
import RecentTenants from '../components/Dashboard/RecentTenants';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import '../styles/Dashboard.css';

const DashboardPage = () => {
    const [stats, setStats] = useState({
        totalTenants: 0,
        totalRevenue: 0,
        activeTenants: 0,
        monthlyData: [],
        recentTenants: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await api.get('/tenants/dashboard/stats');
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);

            // If API fails, show empty state instead of mock data
            setStats({
                totalTenants: 0,
                totalRevenue: 0,
                activeTenants: 0,
                monthlyData: [],
                recentTenants: [],
            });

            if (error.response?.status !== 401) {
                toast.error('Failed to load dashboard data');
            }
        } finally {
            setLoading(false);
        }
    };

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
                    <div className="dashboard-header">
                        <h2>Dashboard Overview</h2>
                        <p>Welcome back! Here's what's happening with your PG.</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="stats-grid">
                        <StatsCard
                            title="Current Month Tenants"
                            value={stats.totalTenants}
                            icon="👥"
                            color="#4f46e5"
                            subtitle={`${stats.activeTenants} active`}
                        />

                        <StatsCard
                            title="Monthly Revenue"
                            value={`₹${stats.totalRevenue.toLocaleString()}`}
                            icon="💰"
                            color="#10b981"
                            subtitle="Current month"
                        />

                        <StatsCard
                            title="Occupancy Rate"
                            value={stats.totalTenants > 0 ? `${Math.round((stats.totalTenants / 30) * 100)}%` : "0%"}
                            icon="🏠"
                            color="#f59e0b"
                            subtitle={`${stats.totalTenants}/30 rooms filled`}
                        />

                        <StatsCard
                            title="Avg. Rent"
                            value={stats.totalTenants > 0 ? `₹${Math.round(stats.totalRevenue / stats.totalTenants)}` : "₹0"}
                            icon="📊"
                            color="#8b5cf6"
                            subtitle="Per tenant/month"
                        />

                        <StatsCard
                            title="Pending Applications"
                            value={stats.pendingApplications || 0}
                            icon="📋"
                            color="#f59e0b"
                            subtitle="Need review"
                        />
                    </div>

                    {/* Recent Tenants */}
                    <div className="dashboard-section">
                        <RecentTenants tenants={stats.recentTenants} />
                    </div>

                    {/* Monthly Chart */}
                    <div className="dashboard-section">
                        <div className="chart-container">
                            <div className="section-header">
                                <h3>Monthly Admissions</h3>
                            </div>
                            {stats.monthlyData.length > 0 ? (
                                <div className="simple-chart">
                                    {stats.monthlyData.map((month, index) => (
                                        <div key={index} className="chart-bar-container">
                                            <div className="chart-bar-label">{month.month}</div>
                                            <div className="chart-bar-wrapper">
                                                <div
                                                    className="chart-bar"
                                                    style={{
                                                        height: `${Math.max(10, (month.tenants / Math.max(...stats.monthlyData.map(m => m.tenants))) * 100)}%`
                                                    }}
                                                >
                                                    <span className="bar-value">{month.tenants}</span>
                                                </div>
                                            </div>
                                            <div className="chart-bar-revenue">₹{month.revenue}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-chart">
                                    <p>No admission data available</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardPage;