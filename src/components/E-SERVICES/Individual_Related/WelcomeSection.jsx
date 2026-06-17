//=====================================
// Updated WelcomeSection.jsx (Component 33)
import React from 'react';
import { useTranslation } from './TranslationContext';
import CasesComponent from '../Individual/API/API';

const WelcomeSection = () => {
  const { t, isRTL, language } = useTranslation(); // Get language from translation context
  const { userInfo, loading, error } = CasesComponent({ language });
  
  return (
    <div className="welcome-section">
      <h2 className="welcome-title">{t('hi')} {loading ? t('loading') || 'Loading...' : (userInfo.firstName || t('user') || 'User')}!</h2>
      <p className="welcome-text">
        {t('welcomeMessage')}
      </p>
    </div>
  );
};

export default WelcomeSection;