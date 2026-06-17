import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa';
import SWALOGO from './SWALOGO.png';
import Home from './Home.png';
import Globe from './Globe.png';
import BI1 from './loginBackground.jpg';

// Import the centralized language utils
import { 
  getStoredLanguage, 
  storeLanguage, 
  setupLanguageListener, 
  applyLanguageSettings,
  isRTL 
} from '../../../utils/LanguageUtils'; // Adjust path as needed

// Import both phone components
import PhoneLoginPageEnglish from '../PhoneNumber/Phone'; // Adjust path as needed
import PhoneLoginPageArabic from '../PhoneNumber/PhoneArabic'; // Adjust path as needed

// Import both Nafath components
import NafathEnglish from '../Nafath/Nafath'; // Adjust path as needed
import NafathArabic from '../Nafath/NafathArabic'; // Adjust path as needed

// Import both CreateAccount components
import CreateAccountEnglish from '../CreateAccount/CreateAccount'; // Adjust path as needed
import CreateAccountArabic from '../CreateAccount/CreateAccountAr'; // Adjust path as needed

// Import both AccountSelection components
import AccountSelectionEnglish from '../AccountSelection/Accsel'; // Adjust path as needed
import AccountSelectionArabic from '../AccountSelection/AccselArabic'; // Adjust path as needed

// Import both PhoneOTP components
import PhoneOTPEnglish from '../PhoneNumOTP/PhoneOTP'; // Adjust path as needed
import PhoneOTPArabic from '../PhoneNumOTP/PhoneOTPAr'; // Adjust path as needed

// Import both NafathOTP components
import NafathOTPEnglish from '../NafathOTP/NafathOTP'; // Adjust path as needed
import NafathOTPArabic from '../NafathOTP/NafathOTPArabic'; // Adjust path as needed

// Translation dictionaries
const translations = {
  en: {
    home: 'Home',
    languageCode: 'EN',
    english: 'English',
    arabic: 'العربية',
  },
  ar: {
    home: 'الرئيسية',
    languageCode: 'AR',
    english: 'English',
    arabic: 'العربية',
  },
};

const AuthWrapper = ({ children, componentType = 'phone' }) => {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  // Use centralized language system
  const [language, setLanguage] = useState(() => getStoredLanguage());

  // Get current translations
  const t = translations[language];

  // Set up language change listener
  useEffect(() => {
    const cleanup = setupLanguageListener((newLanguage) => {
      setLanguage(newLanguage);
      applyLanguageSettings(newLanguage);
      console.log(`DesignWrapper: Language changed to ${newLanguage}`);
    });

    // Apply language settings on mount
    applyLanguageSettings(language);

    return cleanup;
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.lang-dropdown')) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Language change handler using centralized system
  const handleLanguageChange = (newLanguage) => {
    // Validate language
    if (!['en', 'ar'].includes(newLanguage)) {
      console.warn('Invalid language selected:', newLanguage);
      return;
    }

    // Use centralized language storage
    storeLanguage(newLanguage);
    setLanguage(newLanguage);
    setLangDropdownOpen(false);

    // Apply language settings immediately
    applyLanguageSettings(newLanguage);

    // Force a small delay then reload to ensure all components get the new language
    setTimeout(() => {
      window.location.reload();
    }, 100);

    console.log(`Language changed to: ${newLanguage} (using centralized system)`);
  };

  // Function to render the appropriate component based on language and type
  const renderComponent = () => {
    switch (componentType) {
      case 'phone':
        if (language === 'ar') {
          return (
            <PhoneLoginPageArabic language={language} onLanguageChange={handleLanguageChange} />
          );
        } else {
          return (
            <PhoneLoginPageEnglish language={language} onLanguageChange={handleLanguageChange} />
          );
        }

      case 'nafath':
        if (language === 'ar') {
          return <NafathArabic language={language} onLanguageChange={handleLanguageChange} />;
        } else {
          return <NafathEnglish language={language} onLanguageChange={handleLanguageChange} />;
        }

      case 'nafathOTP':
        if (language === 'ar') {
          return <NafathOTPArabic language={language} onLanguageChange={handleLanguageChange} />;
        } else {
          return <NafathOTPEnglish language={language} onLanguageChange={handleLanguageChange} />;
        }

      case 'createAccount':
        if (language === 'ar') {
          return (
            <CreateAccountArabic language={language} onLanguageChange={handleLanguageChange} />
          );
        } else {
          return (
            <CreateAccountEnglish language={language} onLanguageChange={handleLanguageChange} />
          );
        }

      case 'accountSelection':
        if (language === 'ar') {
          return (
            <AccountSelectionArabic language={language} onLanguageChange={handleLanguageChange} />
          );
        } else {
          return (
            <AccountSelectionEnglish language={language} onLanguageChange={handleLanguageChange} />
          );
        }

      case 'phoneOTP':
        if (language === 'ar') {
          return <PhoneOTPArabic language={language} onLanguageChange={handleLanguageChange} />;
        } else {
          return <PhoneOTPEnglish language={language} onLanguageChange={handleLanguageChange} />;
        }

      default:
        // If children are provided (for other components), clone them with language props
        if (children) {
          return React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, {
                language,
                onLanguageChange: handleLanguageChange,
              });
            }
            return child;
          });
        }
        return null;
    }
  };

  // Check if current language is RTL
  const isRTLLanguage = isRTL(language);

  // Detect mobile screen
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const styles = {
    mainDev: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      flexShrink: 0,
      backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.32), rgba(0, 0, 0, 0.32)), url(${BI1})`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily:
        language === 'ar' 
          ? '"IBM Plex Sans Arabic", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          : '"IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      direction: isRTLLanguage ? 'rtl' : 'ltr',
    },
    swaLogo: {
      width: isMobile ? '70px' : '100px',
      height: isMobile ? '55px' : '79px',
      position: 'fixed',
      top: isMobile ? '15px' : '20px',
      [isRTLLanguage ? 'right' : 'left']: isMobile ? '15px' : '30px',
      zIndex: 10,
    },
    logoImg: {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
    },
    headBut: {
      position: 'fixed',
      top: isMobile ? '15px' : '20px',
      [isRTLLanguage ? 'left' : 'right']: isMobile ? '15px' : '60px',
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? '4px' : '-10px',
      zIndex: 10,
      direction: isRTLLanguage ? 'rtl' : 'ltr',
    },
    home: {
      display: isMobile ? 'none' : 'flex',
      height: '40px',
      padding: '0 16px',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '8px',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      direction: isRTLLanguage ? 'rtl' : 'ltr',
    },
    homeIcon: {
      width: '24px',
      height: '24px',
    },
    homeText: {
      color: '#FFF',
      fontSize: isMobile ? '14px' : '16px',
      fontWeight: 500,
      lineHeight: '24px',
      fontFamily: language === 'ar' ? '"IBM Plex Sans Arabic"' : '"IBM Plex Sans"',
      fontStyle: 'normal',
      direction: isRTLLanguage ? 'rtl' : 'ltr',
    },
    translate: {
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? '4px' : '8px',
      padding: isMobile ? '6px 10px' : '8px 12px',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      position: 'relative',
      direction: isRTLLanguage ? 'rtl' : 'ltr',
    },
    translateIcon: {
      width: isMobile ? '18px' : '21px',
      height: isMobile ? '18px' : '21px',
    },
    translateText: {
      color: '#FFF',
      fontSize: isMobile ? '12px' : '13.565px',
      fontWeight: 400,
      lineHeight: 'normal',
      fontStyle: 'normal',
      fontFamily: language === 'ar' ? '"IBM Plex Sans Arabic"' : '"IBM Plex Sans"',
      direction: isRTLLanguage ? 'rtl' : 'ltr',
    },
    chevronIcon: {
      color: '#FFF',
      fontSize: isMobile ? '10px' : '12px',
      transition: 'transform 0.3s ease',
      transform: langDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    },
    dropdownContent: {
      position: 'absolute',
      top: '100%',
      [isRTLLanguage ? 'left' : 'right']: '0',
      backgroundColor: '#fff',
      minWidth: isMobile ? '100px' : '120px',
      boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
      borderRadius: '8px',
      zIndex: 1000,
      opacity: langDropdownOpen ? 1 : 0,
      visibility: langDropdownOpen ? 'visible' : 'hidden',
      transform: langDropdownOpen ? 'translateY(0)' : 'translateY(-10px)',
      transition: 'all 0.3s ease',
      marginTop: '4px',
      direction: isRTLLanguage ? 'rtl' : 'ltr',
    },
    dropdownItem: {
      color: '#333',
      padding: isMobile ? '10px 12px' : '12px 16px',
      textDecoration: 'none',
      display: 'block',
      fontSize: isMobile ? '13px' : '14px',
      fontFamily: language === 'ar' ? '"IBM Plex Sans Arabic"' : '"IBM Plex Sans"',
      transition: 'background-color 0.3s ease',
      cursor: 'pointer',
      textAlign: isRTLLanguage ? 'right' : 'left',
      direction: isRTLLanguage ? 'rtl' : 'ltr',
    },
  };

  const handleHomeHover = (e) => {
    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
  };

  const handleHomeLeave = (e) => {
    e.currentTarget.style.backgroundColor = 'transparent';
  };

  const handleTranslateHover = (e) => {
    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
  };

  const handleTranslateLeave = (e) => {
    e.currentTarget.style.backgroundColor = 'transparent';
  };

  const handleDropdownItemHover = (e) => {
    e.currentTarget.style.backgroundColor = '#f5f5f5';
  };

  const handleDropdownItemLeave = (e) => {
    e.currentTarget.style.backgroundColor = 'transparent';
  };

  const toggleLanguageDropdown = (e) => {
    e.stopPropagation();
    setLangDropdownOpen(!langDropdownOpen);
  };

  return (
    <div 
      style={styles.mainDev} 
      className={`lang-${language} ${isRTLLanguage ? 'rtl' : 'ltr'}`}
    >
      {/* Logo */}
      <Link to="/">
        <div style={styles.swaLogo}>
          <img src={SWALOGO} alt="SWALOGO" style={styles.logoImg} />
        </div>
      </Link>

      {/* Navigation */}
      <div style={styles.headBut}>
        <Link to="/">
          <div style={styles.home} onMouseEnter={handleHomeHover} onMouseLeave={handleHomeLeave}>
            <img style={styles.homeIcon} src={Home} alt="Home" />
            <p style={styles.homeText}>{t.home}</p>
          </div>
        </Link>

        <div
          className="lang-dropdown"
          style={styles.translate}
          onMouseEnter={handleTranslateHover}
          onMouseLeave={handleTranslateLeave}
          onClick={toggleLanguageDropdown}
        >
          <img style={styles.translateIcon} src={Globe} alt="Globe" />
          <p style={styles.translateText}>{t.languageCode}</p>
          <FaChevronDown style={styles.chevronIcon} />

          <div style={styles.dropdownContent}>
            <a
              href="#"
              style={styles.dropdownItem}
              onMouseEnter={handleDropdownItemHover}
              onMouseLeave={handleDropdownItemLeave}
              onClick={(e) => {
                e.preventDefault();
                handleLanguageChange('en');
              }}
            >
              {t.english}
            </a>
            <a
              href="#"
              style={{
                ...styles.dropdownItem,
                borderRadius: '0 0 8px 8px',
              }}
              onMouseEnter={handleDropdownItemHover}
              onMouseLeave={handleDropdownItemLeave}
              onClick={(e) => {
                e.preventDefault();
                handleLanguageChange('ar');
              }}
            >
              {t.arabic}
            </a>
          </div>
        </div>
      </div>

      {/* Render the appropriate component based on language and type */}
      {renderComponent()}
    </div>
  );
};

export default AuthWrapper;