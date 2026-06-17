//=====================================
// Updated HamburgerMenu.jsx (Component 5)
import React from 'react';

const HamburgerMenu = ({ onToggle }) => (
  <button className="hamburger" onClick={onToggle}>
    <i className="fas fa-bars"></i>
  </button>
);

export default HamburgerMenu;