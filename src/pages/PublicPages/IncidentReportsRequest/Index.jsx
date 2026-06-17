import React, { useState, useEffect } from 'react';
import IncidentReportsForm from './IncidentReportsForm';
import IncidentReportsDetails from './IncidentReportsDetails';
import NafathPopup from './NafathPopup';
import Nv from '@/components/ServicesPage/NAVbAR/Navbar';
import Footer from '@/components/common/Footer';
import {
  getStoredLanguage,
  storeLanguage,
  setupLanguageListener,
  applyLanguageSettings,
  isRTL
} from '../../../utils/LanguageUtils';

function IncidentReportsRequest() {
  // Language state and handlers - MOVED HERE FROM DocumentDropdown
  const [language, setLanguage] = useState(() => getStoredLanguage());
  const [view, setView] = useState('details'); // 'details' | 'form'
  const [isNafathOpen, setIsNafathOpen] = useState(false);
  const [nafathData, setNafathData] = useState(null);

  // Check for active Nafath session on mount
  useEffect(() => {
    const sessionStr = localStorage.getItem('nafath_session_incident');
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        if (session.expiresAt > Date.now()) {
          // Restore token to sessionStorage for the form to use
          if (session.token) {
            sessionStorage.setItem('nafath_jwt_token', session.token);
          }
          setNafathData(session.data);
          setView('form');
        } else {
          // Session expired, clean up
          localStorage.removeItem('nafath_session_incident');
          sessionStorage.removeItem('nafath_jwt_token');
        }
      } catch (err) {
        console.error('Error parsing nafath session:', err);
        localStorage.removeItem('nafath_session_incident');
      }
    }
  }, []);

  // Set up language change listener
  useEffect(() => {
    const cleanup = setupLanguageListener((newLanguage) => {
      setLanguage(newLanguage);
      applyLanguageSettings(newLanguage);
      console.log(`ComplaintInquiry: Language changed to ${newLanguage}`);
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

  const handleStartService = () => {
    setIsNafathOpen(true);
  };

  const handleNafathSuccess = (data) => {
    setNafathData(data);
    setIsNafathOpen(false);
    setView('form');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Nv language={language} onLanguageChange={handleLanguageChange} />

      {view === 'details' ? (
        <IncidentReportsDetails
          language={language}
          onStartService={handleStartService}
        />
      ) : (
        <IncidentReportsForm language={language} nafathData={nafathData} />
      )}

      <NafathPopup 
        isOpen={isNafathOpen}
        onClose={() => setIsNafathOpen(false)}
        onSuccess={handleNafathSuccess}
        language={language}
      />

      <Footer />
    </div>
  )
}

export default IncidentReportsRequest