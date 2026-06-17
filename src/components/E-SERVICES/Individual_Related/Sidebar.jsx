//=====================================
// Updated Sidebar.jsx (Component 26)
import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import UserAvatar from './UserAvatar';
import SideMenu from './SideMenu';
import BottomMenu from './BottomMenu';
import SWA from './SWA.png';

const Sidebar = ({ isVisible, activeMenuItem, onMenuClick }) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <div className={`sidebar ${isVisible ? 'show' : ''}`} id="sidebar">
      <div className="image-container">
        <img
          className="logo-image"
          src={SWA}
          alt="Saudi Water Authority Logo"
          onClick={handleLogoClick}
          style={{ cursor: 'pointer' }}
        />

        <section className="section-container" style={{ marginTop: '20px' }}>
          {/* <SearchBar /> */}
          <UserAvatar />
          <SideMenu activeMenuItem={activeMenuItem} onMenuClick={onMenuClick} />
          <BottomMenu activeMenuItem={activeMenuItem} onMenuClick={onMenuClick} />
        </section>
      </div>
    </div>
  );
};

export default Sidebar;