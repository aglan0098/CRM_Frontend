// SWAWaterPortal_Fixed.jsx - Main component with origin tracking
import React, { useState, useEffect, useRef } from 'react';
import { TranslationProvider } from './TranslationContext';
import GlobalStyles from './GlobalStyles';
import Header from './Header';
import HamburgerMenu from './HamburgerMenu';
import Overlay from './Overlay';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import DebugInfo from './DebugInfo';
import CasesComponent from '../Individual/API/API';
import TermsModal from '@/components/Login/CreateAccount/TermsModal';

const SWAWaterPortal = () => {
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [complaintData, setComplaintData] = useState(null);
  // NEW: Track where the user came from before viewing details
  const [originSection, setOriginSection] = useState('dashboard');
  // Terms Modal state
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loadingTerms, setLoadingTerms] = useState(false);
  // Ref to track if terms have been checked to prevent multiple API calls
  const hasCheckedTerms = useRef(false);
  
  // Get API data for deep linking
  const { apiResponse, loading, userInfo, checkTermsStatus, updateTermsStatus } = CasesComponent({ language: 'en' });

  const setActive = (menuType) => {
    console.log('Setting active menu to:', menuType);
    setActiveMenuItem(menuType);
    if (window.innerWidth <= 1024) {
      setSidebarVisible(false);
    }
  };

  // UPDATED: Now tracks which section the user came from
  const handleViewDetails = (complaint, fromSection = activeMenuItem) => {
    console.log('handleViewDetails called with:', complaint, 'from section:', fromSection);
    setComplaintData(complaint);
    setOriginSection(fromSection); // Remember where we came from
    setActiveMenuItem('complaint-escalation');
  };

  // UPDATED: Now returns to the original section instead of hardcoded 'requests'
  const handleBackFromComplaint = (returnToSection = null) => {
    console.log('handleBackFromComplaint called, returning to:', returnToSection || originSection);
    setComplaintData(null);
    // Return to the section they came from, or use the stored origin
    setActiveMenuItem(returnToSection || originSection);
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const closeSidebar = () => {
    setSidebarVisible(false);
  };

  // Handle terms acceptance
  const handleAcceptTerms = async (accepted) => {
    setTermsAccepted(accepted);
    if (accepted && userInfo?.userId) {
      try {
        await updateTermsStatus(userInfo.userId, true);
        setShowTermsModal(false);
      } catch (error) {
        console.error('❌ Error updating terms status:', error);
      }
    } else {
      setShowTermsModal(false);
    }
  };

  // Check terms status when user logs in - only once
  useEffect(() => {
    const checkUserTermsStatus = async () => {
      if (userInfo?.userId && !loadingTerms && !hasCheckedTerms.current) {
        hasCheckedTerms.current = true;
        setLoadingTerms(true);
        try {
          const termsResponse = await checkTermsStatus(userInfo.userId);
          if (termsResponse?.success && termsResponse?.data) {
            const hasAgreed = termsResponse.data.agreedTermsAndConditions;
            console.log('📋 User terms status:', hasAgreed);
            setTermsAccepted(hasAgreed);
            // Show modal if value is anything other than true
            setShowTermsModal(hasAgreed !== true);
          } else {
            // If API doesn't return success, show modal to be safe
            console.log('⚠️ Terms status check failed, showing modal');
            setShowTermsModal(true);
          }
        } catch (error) {
          console.error('❌ Error checking terms status:', error);
          // On error, show modal to ensure consent
          setShowTermsModal(true);
        } finally {
          setLoadingTerms(false);
        }
      }
    };

    checkUserTermsStatus();
  }, [userInfo?.userId, checkTermsStatus]);

  // Deep linking functionality - check for case ID in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const caseId = urlParams.get('id');
    
    if (caseId && apiResponse?.data && !loading) {
      // Find the case by ID
      const foundCase = apiResponse.data.find(caseItem => caseItem.caseId === caseId);
      
      if (foundCase) {
        console.log('Deep linking: Found case with ID:', caseId);
        
        // Transform case data to complaint format (same as MyRequestsTable)
        const complaintData = {
          complaintNumber: foundCase.complaintNumber,
          referenceId: foundCase.caseNumber,
          subject: foundCase.subject,
          subjectDescription: foundCase.subjectDescription,
          region: foundCase.regionName,
          relatedEntity: foundCase.relatedAuthorityName,
          status: foundCase.status.toLowerCase().replace(/\s+/g, '-'),
          statusCode: foundCase.statusCode,
          requestType: foundCase.requestType,
          activityType: foundCase.activityType,
          creationDate: foundCase.creationDate,
          caseId: foundCase.caseId,
          documents: foundCase.documents || [],
          externalCommunications: foundCase.externalCommunications || [],
          // Create responses from external communications
          responses: foundCase.externalCommunications?.map((comm, index) => ({
            id: comm.externalCommunicationId,
            title: comm.requestedInformation,
            date: foundCase.creationDate,
            content: comm.response || 'No response yet',
            statusCode: comm.comstatusCode,
            status: comm.comstatusName,
            active: comm.active,
            files: comm.documents || []
          })) || [],
          requiredInfo: foundCase.externalCommunications?.map(comm => comm.requestedInformation) || [],
          resolution: 'Default resolution text'
        };
        
        // Set the complaint data and navigate to complaint-escalation
        setComplaintData(complaintData);
        setOriginSection('requests'); // Set origin as requests since we're coming from URL
        setActiveMenuItem('complaint-escalation');
        
        // Clean up URL by removing the ID parameter
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      } else {
        console.log('Deep linking: Case not found with ID:', caseId);
        // If case not found, navigate to requests section
        setActiveMenuItem('requests');
      }
    }
  }, [apiResponse, loading]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setSidebarVisible(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <TranslationProvider>
      <div>
        <GlobalStyles />
        <Header />
        
        {/* Debug info - remove this in production */}
        {/*<DebugInfo activeMenuItem={activeMenuItem} complaintData={complaintData} originSection={originSection} />*/}
        
        <HamburgerMenu onToggle={toggleSidebar} />
        <Overlay isVisible={sidebarVisible} onClose={closeSidebar} />

        <div className="main-container">
          <Sidebar 
            isVisible={sidebarVisible} 
            activeMenuItem={activeMenuItem} 
            onMenuClick={setActive} 
          />
          <MainContent 
            activeMenuItem={activeMenuItem}
            complaintData={complaintData}
            onBackFromComplaint={handleBackFromComplaint}
            onViewDetails={handleViewDetails}
            originSection={originSection} // Pass the origin section down
            onMenuClick={setActive} // Pass the navigation function
          />
        </div>

        {/* Terms Modal - Show only if user hasn't agreed */}
        {showTermsModal && (
          <TermsModal
            isOpen={showTermsModal}
            onClose={() => {}} // Prevent closing without accepting
            onAccept={handleAcceptTerms}
            language="en"
            isChecked={termsAccepted}
          />
        )}
      </div>
    </TranslationProvider>
  );
};

export default SWAWaterPortal;