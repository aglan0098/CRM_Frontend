import React, { useState, useEffect } from 'react';
import config from "@/utils/config";
const API_BASE_URL = `${config.API_BASE_URL}`;
// Import the centralized language utils
import { 
  getStoredLanguage, 
  storeLanguage, 
  setupLanguageListener, 
  applyLanguageSettings,
  isRTL 
} from '../../utils/LanguageUtils';

// Import both field inspection components
import HeaderEnglish from './header/HeaderEnglish';
import HeaderArabic from './header/HeaderArabic';
import FormSectionEnglish from './Form/FormSectionEnglish';
import FormSectionArabic from './Form/FormSectionArabic';
import SuccessModalEnglish from './SuccessModal/SuccessModalEnglish';
import SuccessModalArabic from './SuccessModal/SuccessModalArabic';
import Footer from './Footer/Footer';
import FooterArabic from './Footer/FooterArabic';
import SurveyCompleted from './Responded/Response';
import SurveyCompletedArabic from './Responded/ResponseArabic';
const FieldInspectionWrapper = () => {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [communicationData, setCommunicationData] = useState(null);
  // Add these new state variables
  const [externalCommunicationId, setExternalCommunicationId] = useState(null);
  const [error, setError] = useState(null);
  const [isSurveyCompleted, setIsSurveyCompleted] = useState(false);
  
  // Use centralized language system
  const [language, setLanguage] = useState(() => getStoredLanguage());

  // Use ref to prevent double API calls
  const hasFetched = React.useRef(false);
  const [fetchedCommunicationId, setFetchedCommunicationId] = React.useState(null);

  // ✅ SECURITY ENHANCED: Send OTP email using new endpoint (gets OTP from Firestore)
  const sendOTPEmail = React.useCallback(async (externalCommunicationId) => {
    try {
      console.log('Sending OTP email for external communication ID:', externalCommunicationId);
      
      const emailResponse = await fetch(`${API_BASE_URL}/field-inspection/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          externalCommunicationId: externalCommunicationId
        })
      });

      if (!emailResponse.ok) {
        const errorData = await emailResponse.json().catch(() => ({}));
        throw new Error(errorData.error || `Email API error! status: ${emailResponse.status}`);
      }

      const emailResult = await emailResponse.json();
      
      if (emailResult.success) {
        console.log('OTP email sent successfully');
      } else {
        throw new Error(emailResult.error || 'Failed to send OTP email');
      }
    } catch (err) {
      console.error('Error sending OTP email:', err);
      // Don't fail the entire flow if email sending fails
      // Just log the error and continue
    }
  }, []);

  // Extract externalCommunicationId from URL parameters and fetch data
  useEffect(() => {
    // CRITICAL: Check ref BEFORE creating async function
    if (hasFetched.current) {
      console.log('Already fetched, skipping duplicate call...');
      return;
    }
    
    // Mark as fetched BEFORE any async operation
    hasFetched.current = true;
    
    const fetchCommunicationData = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const communicationId = urlParams.get('externalCommunicationId');
        
        setExternalCommunicationId(communicationId);
        
        if (communicationId) {
          console.log('External Communication ID found:', communicationId);
          console.log('Full URL:', window.location.href);
          
          setFetchedCommunicationId(communicationId);
          
          // Make API call to fetch communication data
          const response = await fetch(`${API_BASE_URL}/FIGET`, {
          //const response = await fetch('http://localhost:8080/FIGET', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              externalCommunicationId: communicationId
            })
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          
          if (result.success) {
            console.log('FIGET request successful');
            
            // ✅ SECURITY ENHANCED: Check if survey is already completed (from result.data if present)
            if (result.data && result.data.response === 'Submitted') {
              console.log('Survey already completed, showing completion page');
              setIsSurveyCompleted(true);
            } else {
              // ✅ SECURITY ENHANCED: Send OTP email using new endpoint (OTP stored in Firestore)
              await sendOTPEmail(communicationId);
            }
          } else {
            throw new Error(result.message || 'Failed to retrieve communication data');
          }
        } else {
          console.log('No externalCommunicationId found in URL parameters');
          setError('No external communication ID provided');
        }
      } catch (err) {
        console.error('Error fetching communication data:', err);
        setError(err.message || 'Failed to load communication data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommunicationData();
  }, []); // Remove sendOTPEmail from dependencies

  // Set up language change listener
  useEffect(() => {
    const cleanup = setupLanguageListener((newLanguage) => {
      setLanguage(newLanguage);
      applyLanguageSettings(newLanguage);
      console.log(`FieldInspectionWrapper: Language changed to ${newLanguage}`);
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

    // Force a small delay then reload to ensure all components get the new language
    

    console.log(`Language changed to: ${newLanguage} (using centralized system)`);
  };

  const handleFormSubmit = () => {
    console.log('Form submitted, setting modal to true');
    setShowModal(true);
  };

  const closeModal = () => {
    console.log('Closing modal');
    setShowModal(false);
  };

  // Function to render the appropriate components based on language
  const renderComponents = () => {
    // If survey is completed, show completion page
    if (isSurveyCompleted) {
      if (language === 'ar') {
        return (
          <>
            <HeaderArabic language={language} onLanguageChange={handleLanguageChange} />
            <SurveyCompletedArabic/>
          </>
        );
      } else {
        return (
          <>
            <HeaderEnglish language={language} onLanguageChange={handleLanguageChange} />
            <SurveyCompleted/>
          </>
        );
      }
    }

    // Otherwise, show the form
    if (language === 'ar') {
      return (
        <>
          <HeaderArabic language={language} onLanguageChange={handleLanguageChange} />
          <FormSectionArabic 
          language={language} 
          onLanguageChange={handleLanguageChange} 
          onSubmit={handleFormSubmit}
          externalCommunicationId={externalCommunicationId}
        />
        </>
      );
    } else {
      return (
        <>
          <HeaderEnglish language={language} onLanguageChange={handleLanguageChange} />
          <FormSectionEnglish 
          language={language} 
          onLanguageChange={handleLanguageChange} 
          onSubmit={handleFormSubmit}
          externalCommunicationId={externalCommunicationId}
        />
        </>
      );
    }
  };

  // Function to render the modal separately
  const renderModal = () => {
    // Don't show modal if survey is already completed
    if (isSurveyCompleted) {
      return null;
    }
    
    if (language === 'ar') {
      return <SuccessModalArabic language={language} onLanguageChange={handleLanguageChange} isOpen={showModal} onClose={closeModal} />;
    } else {
      return <SuccessModalEnglish language={language} onLanguageChange={handleLanguageChange} isOpen={showModal} onClose={closeModal} />;
    }
  };
  const renderFooter = () => {
    if (language === 'ar') {
      return <FooterArabic />;
    } else {
      return <Footer/>;
    }
  };

  // Check if current language is RTL
  const isRTLLanguage = isRTL(language);

  // Show loading state
  if (isLoading) {
    return (
      <div 
        className={`field-inspection-wrapper lang-${language} ${isRTLLanguage ? 'rtl' : 'ltr'}`}
        style={{
          fontFamily: language === 'ar' 
            ? '"IBM Plex Sans Arabic", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            : '"IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          direction: isRTLLanguage ? 'rtl' : 'ltr',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '16px' }}>
            {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>
            {language === 'ar' ? 'جاري جلب بيانات التواصل...' : 'Fetching communication data...'}
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div 
        className={`field-inspection-wrapper lang-${language} ${isRTLLanguage ? 'rtl' : 'ltr'}`}
        style={{
          fontFamily: language === 'ar' 
            ? '"IBM Plex Sans Arabic", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            : '"IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          direction: isRTLLanguage ? 'rtl' : 'ltr',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh'
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '400px', padding: '20px' }}>
          <div style={{ fontSize: '20px', marginBottom: '16px', color: '#e53e3e' }}>
            {language === 'ar' ? 'خطأ في التحميل' : 'Loading Error'}
          </div>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
            {error}
          </div>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#3182ce',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {language === 'ar' ? 'إعادة المحاولة' : 'Retry'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`field-inspection-wrapper lang-${language} ${isRTLLanguage ? 'rtl' : 'ltr'}`}
      style={{
        fontFamily: language === 'ar' 
          ? '"IBM Plex Sans Arabic", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          : '"IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        direction: isRTLLanguage ? 'rtl' : 'ltr',
      }}
    >
      <div>
        {renderComponents()}
      </div>
      {renderModal()}
      {renderFooter()}
    </div>
  );
};

export default FieldInspectionWrapper;
