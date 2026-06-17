//=====================================
// Updated ServicesContent.jsx (Component 22)
import React from 'react';
import ServicesSearchHeader from './ServicesSearchHeader';
import ServicesNavTabs from './ServicesNavTabs';
import ServicesGrid from './ServicesGrid';
import { SearchProvider } from './SearchContext';

const ServicesContent = ({ isActive }) => (
  <div id="services-content" className={`dashboard-content ${isActive ? 'active' : ''}`}>
    <div className="main-content">
      <div className="services-container">
        <SearchProvider>
          <ServicesSearchHeader />
          <ServicesNavTabs />
          <ServicesGrid />
        </SearchProvider>
      </div>
    </div>
  </div>
);

export default ServicesContent;
