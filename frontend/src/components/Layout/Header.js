import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import '../../styles/Dashboard.css';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('pg-theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('pg-theme', newTheme);
  };

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="logo">PG Management</h1>
      </div>
      
      <div className="header-right">
        <button className="theme-toggle" onClick={toggleTheme} title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        
        <div className="user-menu">
          <span className="user-name">{user?.name}</span>
          <div className="dropdown">
            <button className="dropdown-toggle">
              {user?.name?.charAt(0).toUpperCase()}
            </button>
            <div className="dropdown-menu">
              <Link to="/profile" className="dropdown-item">
                <span className="dropdown-icon">👤</span> Profile
              </Link>
              <button onClick={handleLogout} className="dropdown-item logout">
                <span className="dropdown-icon">🚪</span> Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;