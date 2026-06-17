import Routes from './Routes';
import React, { useEffect } from 'react';
import { initializeLanguage } from './utils/LanguageUtils';
import useUserway from './utils/userway';
import useHamsChatbot from './utils/hams_ai';
import { usePageTracking, setUserProperties } from './utils/analytics';

function App() {
  useUserway();
  useHamsChatbot();
  useEffect(() => {
    // Initialize the language system when the app starts
    initializeLanguage();

    // Set user language property for analytics
    const language = localStorage.getItem('swa_user_language') || 'ar';
    setUserProperties({ language });
  }, []);

  // Track page views on route changes
  usePageTracking();

  return (
        <Routes />
  );
}

export default App;