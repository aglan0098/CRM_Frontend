import React from 'react';
import './Header.css';
import SWA from './SWA.png'
import translate from './trsnlate.png'
const HeaderEnglish = ({ language = 'en', onLanguageChange }) => {
  const handleLanguageToggle = () => {
    if (onLanguageChange) {
      onLanguageChange('ar');
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
        <div className="fIH-language-text">العربية</div>
      </div>
    </header>
  );
};

export default HeaderEnglish;
