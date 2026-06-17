// Updated DashboardContent.jsx - Now passes onViewDetails prop (Component 4)
import React from 'react';
import TipBanner from './TipBanner';
import WelcomeSection from './WelcomeSection';
import StatsGrid from './StatsGrid';
import ActionsSection from './ActionsSection';
import RequestsSection from './RequestsSection';
import CasesComponent from '../Individual/API/API';

const DashboardContent = ({ isActive, onViewDetails }) => {
  const { apiResponse } = CasesComponent({ language: 'en' });
  
  // Check if there's any "Action Required" case in the first 3 records
  const firstThreeCases = (apiResponse?.data || []).slice(0, 3);
  const actionRequiredCase = firstThreeCases.find(caseItem => caseItem.status === "Action Required");

  return (
    <div id="dashboard-content" className={`dashboard-content ${isActive ? 'active' : ''}`}>
      <div className="main-content">
        <div className="main-card">
          <WelcomeSection />
          <StatsGrid />
          {actionRequiredCase && (
            <ActionsSection 
              caseData={actionRequiredCase} 
              onViewDetails={onViewDetails} 
            />
          )}
          <RequestsSection onViewDetails={onViewDetails} />
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;