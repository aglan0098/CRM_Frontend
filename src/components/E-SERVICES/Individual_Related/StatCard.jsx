//=====================================
// Updated StatCard.jsx (Component 28)
import React from 'react';

const StatCard = ({ icon, label, number, filter }) => (
  <div className={`stat-card ${filter === 'pending' ? 'pending' : ''}`} data-filter={filter}>
    <div className="stat-label">
      <img src={icon} alt={label} className="stat-icon" />
      <span className="stat-label-text">{label}</span>
    </div>
    <div className="stat-number stat-number-text">{number}</div>
  </div>
);

export default StatCard;