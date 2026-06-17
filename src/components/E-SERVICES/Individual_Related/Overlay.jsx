//=====================================
// Updated Overlay.jsx (Component 14)
import React from 'react';

const Overlay = ({ isVisible, onClose }) => (
  <div className={`overlay ${isVisible ? 'show' : ''}`} onClick={onClose}></div>
);

export default Overlay;