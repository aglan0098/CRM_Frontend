//=====================================
// Updated TipBanner.jsx (Component 31)
import React from 'react';
import { useTranslation } from './TranslationContext';

const TipBanner = () => {
  const { t } = useTranslation();
  
  return (
    <div className="tip-banner">
      <div className="tip-text">
        <strong>{t('tipPrefix')}</strong> {t('tipMessage')}
      </div>
      <button className="request-workshop-btn">
        <span className="request-workshop-text">{t('requestWorkshop')}</span>
      </button>
    </div>
  );
};

export default TipBanner;