// languageUtils.js - Centralized language management utility

/**
 * Helper function to get stored language with fallback
 * @returns {string} - Returns 'en' or 'ar'
 */
export const getStoredLanguage = () => {
  try {
    const storedLanguage = localStorage.getItem('swa_user_language');
    // Validate that it's a supported language
    if (storedLanguage && ['en', 'ar'].includes(storedLanguage)) {
      return storedLanguage;
    }
  } catch (error) {
    console.warn('Error accessing localStorage for language:', error);
  }
  return 'ar'; // Default fallback
};

/**
 * Helper function to store language safely
 * @param {string} language - Language code ('en' or 'ar')
 */
export const storeLanguage = (language) => {
  try {
    if (!['en', 'ar'].includes(language)) {
      console.warn(`Invalid language code: ${language}. Must be 'en' or 'ar'.`);
      return;
    }
    
    localStorage.setItem('swa_user_language', language);
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language, timestamp: Date.now() } 
    }));
    
    console.log(`Language changed to: ${language}`);
  } catch (error) {
    console.warn('Error storing language in localStorage:', error);
  }
};

/**
 * Get the appropriate route based on language
 * @param {string} basePath - The base path without language suffix
 * @param {string} language - Optional language override
 * @returns {string} - The language-specific route
 */
export const getLanguageRoute = (basePath, language = null) => {
  const currentLanguage = language || getStoredLanguage();
  
  if (currentLanguage === 'ar') {
    return `${basePath}Arabic`;
  }
  
  return basePath;
};

/**
 * Get language-specific text/translations
 * @param {Object} translations - Object with 'en' and 'ar' properties
 * @param {string} language - Optional language override
 * @returns {string} - The translated text
 */
export const getLanguageText = (translations, language = null) => {
  const currentLanguage = language || getStoredLanguage();
  
  if (translations && typeof translations === 'object') {
    return translations[currentLanguage] || translations.en || '';
  }
  
  return translations || '';
};

/**
 * Check if current language is RTL (Right-to-Left)
 * @param {string} language - Optional language override
 * @returns {boolean} - True if RTL language
 */
export const isRTL = (language = null) => {
  const currentLanguage = language || getStoredLanguage();
  return currentLanguage === 'ar';
};

/**
 * Get language display name
 * @param {string} languageCode - Language code ('en' or 'ar')
 * @returns {string} - Display name of the language
 */
export const getLanguageDisplayName = (languageCode) => {
  const displayNames = {
    en: 'English',
    ar: 'العربية'
  };
  
  return displayNames[languageCode] || languageCode;
};

/**
 * Toggle between languages
 * @returns {string} - The new language after toggle
 */
export const toggleLanguage = () => {
  const currentLanguage = getStoredLanguage();
  const newLanguage = currentLanguage === 'en' ? 'ar' : 'en';
  storeLanguage(newLanguage);
  return newLanguage;
};

/**
 * Set up language change listener
 * @param {Function} callback - Function to call when language changes
 * @returns {Function} - Cleanup function to remove the listener
 */
export const setupLanguageListener = (callback) => {
  const handleLanguageChange = (event) => {
    if (typeof callback === 'function') {
      callback(event.detail?.language || getStoredLanguage());
    }
  };

  const handleStorageChange = (event) => {
    if (event.key === 'swa_user_language') {
      if (typeof callback === 'function') {
        callback(event.newValue || getStoredLanguage());
      }
    }
  };

  window.addEventListener('languageChanged', handleLanguageChange);
  window.addEventListener('storage', handleStorageChange);

  // Return cleanup function
  return () => {
    window.removeEventListener('languageChanged', handleLanguageChange);
    window.removeEventListener('storage', handleStorageChange);
  };
};

/**
 * Apply language-specific document settings
 * @param {string} language - Optional language override
 */
export const applyLanguageSettings = (language = null) => {
  const currentLanguage = language || getStoredLanguage();
  
  // Set document language and direction
  document.documentElement.lang = currentLanguage;
  document.documentElement.dir = isRTL(currentLanguage) ? 'rtl' : 'ltr';
  
  // Add language class to body for CSS styling
  document.body.classList.remove('lang-en', 'lang-ar', 'rtl', 'ltr');
  document.body.classList.add(`lang-${currentLanguage}`);
  document.body.classList.add(isRTL(currentLanguage) ? 'rtl' : 'ltr');
  
  // Force direction on body
  document.body.style.direction = isRTL(currentLanguage) ? 'rtl' : 'ltr';
  
  // Apply to root element as well
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.style.direction = isRTL(currentLanguage) ? 'rtl' : 'ltr';
    rootElement.classList.remove('lang-en', 'lang-ar', 'rtl', 'ltr');
    rootElement.classList.add(`lang-${currentLanguage}`);
    rootElement.classList.add(isRTL(currentLanguage) ? 'rtl' : 'ltr');
  }
};

// Sync language from "swa_user_language" cookie ONCE per tab session

export const syncLanguageFromCookie = () => {
  try {
    // Only run once per browser tab session
    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('swa_cookie_language_synced')) {
      return;
    }

    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('swa_cookie_language_synced', 'true');
    }

    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';');
      let cookieLang = null;

      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'swa_user_language') {
          cookieLang = decodeURIComponent(value || '');
          break;
        }
      }

      if (cookieLang && ['en', 'ar'].includes(cookieLang)) {
        const currentStoredLanguage = getStoredLanguage();
        if (cookieLang !== currentStoredLanguage) {
          console.log(`Syncing language from cookie: ${cookieLang}`);
          storeLanguage(cookieLang);
        }
      }
    }
  } catch (error) {
    console.warn('Error syncing language from cookie:', error);
  }
};


/**
 * Initialize language system
 * This should be called once when your app starts
 */
export const initializeLanguage = () => {
  // Sync language from cookie (happens only once per tab session)
  syncLanguageFromCookie();
    
  // Apply initial language settings
  applyLanguageSettings();
  
  // Set up listener for language changes to update document settings
  setupLanguageListener((newLanguage) => {
    applyLanguageSettings(newLanguage);
  });
  
  console.log(`Language system initialized. Current language: ${getStoredLanguage()}`);
};

// Default export object with all functions
const languageUtils = {
  getStoredLanguage,
  storeLanguage,
  getLanguageRoute,
  getLanguageText,
  isRTL,
  getLanguageDisplayName,
  toggleLanguage,
  setupLanguageListener,
  applyLanguageSettings,
  syncLanguageFromCookie,
  initializeLanguage
};

export default languageUtils;