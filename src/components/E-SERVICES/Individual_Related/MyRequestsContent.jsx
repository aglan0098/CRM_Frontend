// Updated MyRequestsContent.jsx - Now passes onViewDetails prop  (Component 9)
import React from 'react';
import MyRequestsWelcomeSection from './MyRequestsWelcomeSection';
import StatsGrid from './StatsGrid';
import MyRequestsSection from './MyRequestsSection';

const MyRequestsContent = ({ isActive, onViewDetails }) => (
  <div id="my-requests-content" className={`dashboard-content ${isActive ? 'active' : ''}`}>
    <div className="main-content">
      <div className="mr-main-card">
        <MyRequestsWelcomeSection />
        <StatsGrid />
      </div>
      <MyRequestsSection onViewDetails={onViewDetails} />
    </div>
  </div>
);

export default MyRequestsContent;