// Fixed MainContent.jsx - Now properly passes onViewDetails prop to content components (Component 7)
import React from 'react';
import PageHeader from './PageHeader';
import DashboardContent from './DashboardContent';
import MyRequestsContent from './MyRequestsContent';
import ServicesContent from './ServicesContent';
import ComplaintEscalationContent from './ComplaintEscalationContent';
import CasesComponent from '../Individual/API/API';
import { useTranslation } from './TranslationContext';

const MainContent = ({ activeMenuItem, complaintData, onBackFromComplaint, onViewDetails, onMenuClick, originSection }) => {
  // Get current language from context to ensure it updates when language changes
  const { language } = useTranslation();
  
  // Use the CasesComponent hook to get notifications and user info
  const { notifications, notificationsLoading, notificationsError, userInfo } = CasesComponent({ language });

  const handleBackFromComplaint = () => {
    if (onBackFromComplaint) {
      onBackFromComplaint();
    }
  };

  return (
    <div className="content-area">
      <PageHeader 
        activeMenuItem={activeMenuItem} 
        onMenuClick={onMenuClick} 
        originSection={originSection}
        notifications={notifications}
        notificationsLoading={notificationsLoading}
        notificationsError={notificationsError}
        userFirstName={userInfo?.firstName || ''}
      />
      <div id="main-content-area">
        <DashboardContent 
          isActive={activeMenuItem === 'dashboard'} 
          onViewDetails={onViewDetails}
        />
        <MyRequestsContent 
          isActive={activeMenuItem === 'requests'} 
          onViewDetails={onViewDetails}
        />
        <ServicesContent isActive={activeMenuItem === 'services'} />
        <ComplaintEscalationContent 
          isActive={activeMenuItem === 'complaint-escalation'} 
          complaintData={complaintData}
          onBack={handleBackFromComplaint}
        />
      </div>
    </div>
  );
};

export default MainContent;
