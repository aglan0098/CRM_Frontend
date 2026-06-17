import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import page components
import LandingPage from './pages/PublicPages/LandingPage/index';
import LandingPageArabic from './pages/PublicPages/LandingPage/indexArabic'; // Add this import
import Complaintescalationrequest from './pages/PublicPages/ComplaintEscalationRequest/index';
import ComplaintescalationrequestArabic from './pages/PublicPages/ComplaintEscalationRequest/indexArabic'; // Add this import
import ComplaintEscalationPage from './pages//PublicPages/ComplaintEscalation/index';
import ComplaintEscalationPageArabic from './pages//PublicPages/ComplaintEscalation/IndexArabic'; // Add this import
import DashBoard from './components/DashBoard/DashBoard';
import Complaintinquiryrequest from './pages/PublicPages/ComplaintInquiryRequest/index';
import ComplaintinquiryrequestArabic from './pages/PublicPages/ComplaintInquiryRequest/indexArabic'; // Add this import
import ComplaintInquiry from './pages/PublicPages/ComplaintInquiry/index';
import ComplaintInquiryArabic from './pages/PublicPages/ComplaintInquiry/indexArabic'; // Add this import
import PresidentContactRequest from './pages/PublicPages/PresidentStaffRequest';
import PresidentContactRequesArabic from './pages/PublicPages/PresidentStaffRequest/indexArabic';
import PresidentStaffPage from './pages/PublicPages/PresidentStaff';
import PresidentStaffPageArabic from './pages/PublicPages/PresidentStaff/IndexArabic';
import ScrollToTop from './components/common/Scroll';
// import Sidebar_Ind from './components/E-SERVICES/Individual/Individual Sidebar/Siderbar_Ind';
// import Individual_Wrapper from './components/E-SERVICES/Individual/Individual_Wrapper';
import SWAWaterPortal from './components/E-SERVICES/Individual_Related/SWAWaterPortal';
import FileUploader from './components/testfile';
// Import AuthWrapper and Login Components
import AuthWrapper from './components/Login/DesignWrapper/DesignWrapper';
import Login from './components/Login/Login';
import Nafath from './components/Login/Nafath/Nafath';
import NafathOTPVerification from './components/Login/NafathOTP/NafathOTP';
import CreateAccount from './components/Login/CreateAccount/CreateAccount';
import AccountSelection from './components/Login/AccountSelection/Accsel';
import RequireAuth from './components/RequiredAUTh/RequireAuth';
import SurveyContainer from './components/Survey/SurveyContainer/SurveyContainer';
import SurveyContainerArabic from './components/Survey/SurveyContainer/SurveyContainerArabic'; // Add this import
import RegulatoryRequest from './pages/PublicPages/RegulatoryRequest/index';
import RegulatoryRequestArabic from './pages/PublicPages/RegulatoryRequest/indexArabic'; // Add this import
import StrategicWater from './pages/PublicPages/Licenses/StrategicWaterStorage/index';
import StrategicWaterArabic from './pages/PublicPages/Licenses/StrategicWaterStorage/indexArabic';
import SessionGuard from './components/SessionGuard/SessionGuard';
import ComplaintEscalationRequestArabic from './pages/PublicPages/ComplaintEscalationRequest/indexArabic';
import FieldInspectionWrapper from './components/FieldInspection/FieldInspectionWrapper';
import WrapService from './components/ServicesPage/Wrapper/Wrap';
import RecaptchaView from './components/Captacha/Wrap';
// Helper function to get stored language with fallback
// incident service
import IncidentReportsRequest from './pages/PublicPages/IncidentReportsRequest/Index';
import IncidentReportsRequestArabic from './pages/PublicPages/IncidentReportsRequest/IndexArabic';
import IncidentInquiry from './pages/PublicPages/IncidentInquiry/Index';
import IncidentInquiryArabic from './pages/PublicPages/IncidentInquiry/IndexArabic';

const getStoredLanguage = () => {
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

// Helper function to store language safely
const storeLanguage = (language) => {
  try {
    localStorage.setItem('swa_user_language', language);
  } catch (error) {
    console.warn('Error storing language in localStorage:', error);
  }
};

// Language-aware component wrapper
const LanguageRoute = ({ englishComponent, arabicComponent }) => {
  const [currentLanguage, setCurrentLanguage] = useState(getStoredLanguage());

  useEffect(() => {
    const handleStorageChange = () => {
      setCurrentLanguage(getStoredLanguage());
    };

    // Listen for storage changes
    window.addEventListener('storage', handleStorageChange);

    // Listen for custom language change events
    window.addEventListener('languageChanged', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('languageChanged', handleStorageChange);
    };
  }, []);

  return currentLanguage === 'ar' ? arabicComponent : englishComponent;
};

const AppRoutes = () => {
  return (
    <Router>
      <SessionGuard>
        <ScrollToTop />
        <Routes>
          {/* Main Landing Page Route */}
          {/* <Route 
            path="/LandingPage" 
            element={
              <LanguageRoute 
                englishComponent={<LandingPage />} 
                arabicComponent={<LandingPageArabic />} 
              />
            } 
          /> */}

          {/* Default route */}
          {/* <Route 
            path="/" 
            element={
              <LanguageRoute 
                englishComponent={<LandingPage />} 
                arabicComponent={<LandingPageArabic />} 
              />
            } 
          /> */}

          {/* Complaint Inquiry Request */}
          <Route
            path="/ComplaintInquiryRequest"
            element={
              <LanguageRoute
                englishComponent={<Complaintinquiryrequest />}
                arabicComponent={<ComplaintinquiryrequestArabic />}
              />
            }
          />

          <Route
            path="/PresidentServiceRequest"
            element={
              <LanguageRoute
                englishComponent={<PresidentContactRequest />}
                arabicComponent={<PresidentContactRequesArabic />}
              />
            }
          />

          <Route 
            path="/PresidentStaff" 
            element={
              <LanguageRoute 
                englishComponent={<PresidentStaffPage />} 
                arabicComponent={<PresidentStaffPageArabic />} 
              />
            } 
          />

          {/* Regulatory Request */}
          <Route
            path="/RegulatoryRequest"
            element={
              <LanguageRoute
                englishComponent={<RegulatoryRequest />}
                arabicComponent={<RegulatoryRequestArabic />}
              />
            }
          />

          {/* Strategic Water */}
          <Route
            path="/StrategicWater"
            element={
              <LanguageRoute
                englishComponent={<StrategicWater />}
                arabicComponent={<StrategicWaterArabic />}
              />
            }
          />

          {/* Complaint Escalation */}
          <Route
            path="/ComplaintEscalation"
            element={
              <LanguageRoute
                englishComponent={<ComplaintEscalationPage />}
                arabicComponent={<ComplaintEscalationPageArabic />}
              />
            }
          />

          {/* Complaint Escalation Request */}
          <Route
            path="/ComplaintEscalationRequest"
            element={
              <LanguageRoute
                englishComponent={<Complaintescalationrequest />}
                arabicComponent={<ComplaintEscalationRequestArabic />}
              />
            }
          />

          {/* Complaint Inquiry */}
          <Route
            path="/ComplaintInquiry"
            element={
              <LanguageRoute
                englishComponent={<ComplaintInquiry />}
                arabicComponent={<ComplaintInquiryArabic />}
              />
            }
          />

          {/* Incident Reports Service */}
          <Route
            path="/IncidentReportsRequest"
            element={
              <LanguageRoute
                englishComponent={<IncidentReportsRequest />}
                arabicComponent={<IncidentReportsRequestArabic />}
              />
            }
          />
          {/* Incident Inquiry Service */}
          <Route
            path="/IncidentInquiry"
            element={
              <LanguageRoute
                englishComponent={<IncidentInquiry />}
                arabicComponent={<IncidentInquiryArabic />}
              />
            }
          />

          {/* Survey */}
          <Route
            path="/Survey"
            element={
              <LanguageRoute
                englishComponent={<SurveyContainer />}
                arabicComponent={<SurveyContainerArabic />}
              />
            }
          />
          <Route
            path="/fieldInspection"
            element={<FieldInspectionWrapper />}
          />
          {/* Authentication Routes - Language agnostic */}
          <Route path="/login" element={<AuthWrapper componentType="phone" />} />
          <Route path="/login-nafath" element={<AuthWrapper componentType="nafath" />} />
          <Route path="/nafath-otp" element={<AuthWrapper componentType="nafathOTP" />} />
          <Route path="/phone-otp" element={<AuthWrapper componentType="phoneOTP" />} />
          <Route path="/CreateAccount" element={<AuthWrapper componentType="createAccount" />} />
          <Route path="/AccountSel" element={<AuthWrapper componentType="accountSelection" />} />
          {/* <Route path="/Survey" element={<SurveyContainer/>} /> */}
          {/*<Route path="/DashBoard" element={
            <RequireAuth>
              <DashBoard/>
            </RequireAuth>
            } />*/}

          {/* Fallback routes without AuthWrapper */}
          <Route path="/login-old" element={<Login />} />
          <Route path="/" element={<WrapService />} />
          <Route path="/login-nafath-old" element={<Nafath />} />
          <Route path="/nafath-otp-old" element={<NafathOTPVerification />} />
          <Route path="/CreateAccount-old" element={<CreateAccount />} />
          <Route path="/AccountSel-old" element={<AccountSelection />} />
          <Route path="/DashBoard" element={<SWAWaterPortal />} />
          <Route path="/VirusScan" element={<FileUploader />} />
           <Route path="/captacha" element={<RecaptchaView />} />
        </Routes>
      </SessionGuard>
    </Router>
  );
};

// Export the helper functions for use in other components
export { getStoredLanguage, storeLanguage };
export default AppRoutes;