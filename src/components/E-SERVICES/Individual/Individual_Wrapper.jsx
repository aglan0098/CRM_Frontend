import React, { useState } from 'react';
import Sidebar_Ind from './Individual Sidebar/Siderbar_Ind';
import Dash_Graph from './Graph_Dash/Dash_Graph';
import MR_Graph from './Graph_MR/MR_Graph';
import UpperCard from './Vector/UpperCard';

const Individual_Wrapper = () => {
  const [activeComponent, setActiveComponent] = useState('dashboard');

  const handleMenuClick = (menuType) => {
    setActiveComponent(menuType);
  };

  const renderMainContent = () => {
    switch(activeComponent) {
      case 'dashboard':
        return <Dash_Graph />;
      case 'requests':
        return <UpperCard />;
      default:
        return <Dash_Graph />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar_Ind onMenuClick={handleMenuClick} />
      <div style={{ flex: 1, marginLeft: '271px' }}>
        {renderMainContent()}
      </div>
    </div>
  );
};

export default Individual_Wrapper;