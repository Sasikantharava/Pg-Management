import React from 'react';
import '../../styles/Dashboard.css';

const StatsCard = ({ title, value, icon, color, subtitle }) => {
  return (
    <div className="stats-card">
      <div className="stats-icon" style={{ backgroundColor: color }}>
        {icon}
      </div>
      <div className="stats-content">
        <h3 className="stats-value">{value}</h3>
        <p className="stats-title">{title}</p>
        {subtitle && <p className="stats-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
};

export default StatsCard;