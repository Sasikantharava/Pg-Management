import React, { useState, useEffect } from 'react';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import ProfileForm from '../components/Profile/ProfileForm';
import ChangePassword from '../components/Profile/ChangePassword';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import '../styles/Profile.css';

const ProfilePage = () => {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserStats();
    }, []);

    const fetchUserStats = async () => {
        try {
            setLoading(true);
            const response = await api.get('/users/stats');
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching user stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = (updatedUser) => {
        // This would typically update the context
        window.location.reload(); // Simple refresh for now
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
                    <div className="page-header">
                        <div>
                            <h2>My Profile</h2>
                            <p>Manage your account settings</p>
                        </div>
                    </div>

                    <div className="profile-container">
                        {/* User Info Card */}
                        <div className="profile-header-card">
                            <div className="profile-avatar-large">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="profile-header-info">
                                <h1 className="profile-name">{user?.name}</h1>
                                <div className="profile-meta">
                                    <span className="profile-email">{user?.email}</span>
                                    <span className="profile-role">{user?.role}</span>
                                    <span className="profile-member">
                                        Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        {stats && (
                            <div className="profile-stats-grid">
                                <div className="profile-stat-card">
                                    <div className="stat-icon">👥</div>
                                    <div className="stat-content">
                                        <h3>{stats.totalTenants}</h3>
                                        <p>Total Tenants</p>
                                    </div>
                                </div>

                                <div className="profile-stat-card">
                                    <div className="stat-icon">✅</div>
                                    <div className="stat-content">
                                        <h3>{stats.activeTenants}</h3>
                                        <p>Active Tenants</p>
                                    </div>
                                </div>

                                <div className="profile-stat-card">
                                    <div className="stat-icon">📊</div>
                                    <div className="stat-content">
                                        <h3>{stats.monthlyData?.length || 0}</h3>
                                        <p>Months of Data</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Forms Grid */}
                        <div className="profile-forms-grid">
                            <ProfileForm user={user} onUpdate={handleProfileUpdate} />
                            <ChangePassword />
                        </div>

                        {/* Account Actions */}
                        <div className="account-actions-card">
                            <h3 className="card-title">Account Actions</h3>
                            <div className="actions-grid">
                                <button className="action-button danger" onClick={logout}>
                                    Logout from all devices
                                </button>
                                <button className="action-button danger" onClick={() => {
                                    if (window.confirm('Are you sure? This will delete all your data.')) {
                                        toast.error('Account deletion not implemented yet');
                                    }
                                }}>
                                    Delete Account
                                </button>
                            </div>
                            <p className="action-warning">
                                ⚠️ Account deletion is permanent and cannot be undone.
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ProfilePage;