import React, { useState, useEffect } from 'react';

// Import the centralized language utils
import { 
  getStoredLanguage, 
  storeLanguage, 
  setupLanguageListener, 
  applyLanguageSettings,
  isRTL 
} from '../../../utils/LanguageUtils';

import Nv from "../NAVbAR/Navbar";
import NvArabic from "../NAVbAR/NvArabic";
import Hero from "../HeroService/HeroService";
import HeroArabic from "../HeroService/HeroArabic";
import Servicedetails from "../ServiceDetails/ServiceDetails";
import ServicedetailsArabic from "../ServiceDetails/ServicedetailsArabic";
import Footer from '@/components/common/Footer';
import FooterArabic from '@/components/common/FooterArabic';

const WrapService = () => {
  // Use centralized language system
  const [language, setLanguage] = useState(() => getStoredLanguage());

  // Set up language change listener
  useEffect(() => {
    const cleanup = setupLanguageListener((newLanguage) => {
      setLanguage(newLanguage);
      applyLanguageSettings(newLanguage);
      console.log(`WrapService: Language changed to ${newLanguage}`);
    });

    // Apply language settings on mount
    applyLanguageSettings(language);

    return cleanup;
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

    // Apply language settings immediately
    applyLanguageSettings(newLanguage);

    console.log(`Language changed to: ${newLanguage} (using centralized system)`);
  };

  // Check if current language is RTL
  const isRTLLanguage = isRTL(language);

  return (
    <div 
      className={`wrap-service lang-${language} ${isRTLLanguage ? 'rtl' : 'ltr'}`}
      style={{
        fontFamily: language === 'ar' 
          ? '"IBM Plex Sans Arabic", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          : '"IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        direction: isRTLLanguage ? 'rtl' : 'ltr',
      }}
    >
      {language === 'ar' ? (
        <NvArabic language={language} onLanguageChange={handleLanguageChange} />
      ) : (
        <Nv language={language} onLanguageChange={handleLanguageChange} />
      )}
      {language === 'ar' ? (
        <HeroArabic language={language} onLanguageChange={handleLanguageChange} />
      ) : (
        <Hero language={language} onLanguageChange={handleLanguageChange} />
      )}
      {language === 'ar' ? (
        <ServicedetailsArabic language={language} onLanguageChange={handleLanguageChange} />
      ) : (
        <Servicedetails language={language} onLanguageChange={handleLanguageChange} />
      )}
      {language === 'ar' ? (
        <FooterArabic />
      ) : (
        <Footer />
      )}
    </div>
  );
};

export default WrapService;