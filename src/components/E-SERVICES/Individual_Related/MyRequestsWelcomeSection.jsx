//=====================================
// Updated MyRequestsWelcomeSection.jsx (Component 13)
import React from 'react';
import { useTranslation } from './TranslationContext';

const MyRequestsWelcomeSection = () => {
  const { t } = useTranslation();
  
  return (
    <div className="welcome-section">
      <h2 className="welcome-title">{t('requestsOverview')}</h2>
    </div>
  );
};

export default MyRequestsWelcomeSection;