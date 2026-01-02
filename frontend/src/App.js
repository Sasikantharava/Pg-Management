import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TenantsPage from './pages/TenantsPage';
import AddTenantPage from './pages/AddTenantPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import TenantDetailsPage from './pages/TenantDetailsPage';
import QRManagementPage from './pages/QRManagementPage';
import QRFormPage from './pages/QRFormPage';
import ApplicationsPage from './pages/ApplicationsPage';
import './styles/Theme.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Toaster position="top-right" />
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/qr-form/:code" element={<QRFormPage />} />

                        {/* Protected Routes */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="/dashboard" element={<DashboardPage />} />
                            <Route path="/tenants" element={<TenantsPage />} />
                            <Route path="/add-tenant" element={<AddTenantPage />} />
                            <Route path="/tenant/:id" element={<TenantDetailsPage />} />
                            <Route path="/history" element={<HistoryPage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/qr-management" element={<QRManagementPage />} />
                            <Route path="/applications" element={<ApplicationsPage />} />
                        </Route>

                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;