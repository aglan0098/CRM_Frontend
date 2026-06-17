import React from 'react';
import './Header.css';
import SWA from './SWA.png'
import translate from './trsnlate.png'
const HeaderArabic = ({ language = 'ar', onLanguageChange }) => {
  const handleLanguageToggle = () => {
    if (onLanguageChange) {
      onLanguageChange('en');
    }
  };

  return (
    <header className="fIH">
      <div className="fIH-logo">
        <img src={SWA} alt="Logo" />
      </div>
      <div className="fIH-language" onClick={handleLanguageToggle}>
        <div className="fIH-language-icon">
          <img src={translate} alt="Language Icon" />
        </div>
        <div className="fIH-language-text">English</div>
      </div>
    </header>
  );
};

export default HeaderArabic;
