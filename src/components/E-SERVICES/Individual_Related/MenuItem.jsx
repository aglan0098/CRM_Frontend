//=====================================
// Updated MenuItem.jsx (Component 8)
import React from 'react';

const MenuItem = ({ src, alt, text, isActive, onClick, isBottom = false }) => (
  <div
    className={`menuitem1 ${isActive ? 'active' : ''}`}
    onClick={onClick}
  >
    <img src={src} alt={alt} className="menu1img" />
    <p className="menuheader" style={{ color: isActive ? '#1B8354' : '#161616' }}>
      {text}
    </p>
  </div>
);

export default MenuItem;