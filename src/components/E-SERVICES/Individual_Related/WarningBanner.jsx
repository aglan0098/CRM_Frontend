// WarningBanner.jsx - Warning banner component (Component 38)
import React from 'react';
import { useTranslation } from './TranslationContext';

const WarningBanner = ({ onClose }) => {
  const { t } = useTranslation();

  return (
    <div className="complaint-warning-banner">
      <div className="complaint-warning-content">
        <svg className="complaint-warning-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
        </svg>
        <span className="complaint-warning-text">
          <strong>{t('moreInfoNeeded')}</strong> {t('completeRequiredDetails')}
        </span>
      </div>
      <button className="complaint-close-button" onClick={onClose}>×</button>
    </div>
  );
};

export default WarningBanner;