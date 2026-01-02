import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../styles/Dashboard.css';

const Sidebar = () => {
const menuItems = [
  { path: '/dashboard', icon: '📊', label: 'Dashboard' },
  { path: '/tenants', icon: '👥', label: 'Current Tenants' },
  { path: '/add-tenant', icon: '➕', label: 'Add Tenant' },
  { path: '/applications', icon: '📋', label: 'Applications' },
  { path: '/qr-management', icon: '🔲', label: 'QR System' },
  { path: '/history', icon: '📜', label: 'History' },
  { path: '/profile', icon: '👤', label: 'Profile' },
];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;