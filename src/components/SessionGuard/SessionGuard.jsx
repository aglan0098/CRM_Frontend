import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import sessionManager from '../../utils/sessionManager';
import './SessionGuard.css';

const SessionGuard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isValidating, setIsValidating] = useState(true);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [warningHandlers, setWarningHandlers] = useState({});

  useEffect(() => {
    //console.log('[SessionGuard] useEffect triggered, path:', location.pathname);
    // Initial session validation
    validateSessionOnLoad();

    // Listen for session events
    window.addEventListener('sessionExpired', handleSessionExpired);
    window.addEventListener('sessionInactivityWarning', handleInactivityWarning);
    window.addEventListener('sessionWarningDismissed', handleWarningDismissed);

    return () => {
      window.removeEventListener('sessionExpired', handleSessionExpired);
      window.removeEventListener('sessionInactivityWarning', handleInactivityWarning);
      window.removeEventListener('sessionWarningDismissed', handleWarningDismissed);
    };
  }, [location.pathname]);

  const validateSessionOnLoad = async () => {
    //console.log('[SessionGuard] validateSessionOnLoad called');
    const publicRoutes = [
      '/login', 
      '/phone-login', 
      '/login-nafath', 
      '/phone-otp', 
      '/nafath-otp', 
      '/CreateAccount', 
      '/LandingPage', 
      '/',
      '/ComplaintEscalationRequest',
      '/ComplaintEscalation',
      '/ComplaintInquiryRequest',
      '/ComplaintInquiry',
      '/RegulatoryRequest',
      '/fieldInspection',
      '/ServicePage',
      '/VirusScan',
      '/captacha',
      '/PresidentServiceRequest',
      '/PresidentStaff',
      '/IncidentReportsRequest',
      '/IncidentReportsRequestArabic',
      '/IncidentInquiry',
      '/IncidentInquiryArabic'
    ];
    if (publicRoutes.includes(location.pathname)) {
      setIsValidating(false);
      // If user is logged in, start session logic even on public route
      if (sessionManager.hasActiveSession()) {
        sessionManager.startActivityTracking();
        sessionManager.startSessionValidation();
      }
      return;
    }

    // Check if session exists
    if (!sessionManager.hasActiveSession()) {
      //console.log('[SessionGuard] No active session found');
      localStorage.setItem('postLoginRedirect', location.pathname + location.search);
      //console.log(location.pathname + location.search);
      navigate('/login', { 
        state: { 
          from: location.pathname,
          message: 'Please login to continue' 
        } 
      });
      return;
    }

    // ✅ SECURITY: Check if session is a captcha session (userId is null)
    // Captcha sessions should NOT have access to protected routes
    if (sessionManager.isCaptchaSession()) {
      //console.log('[SessionGuard] Captcha session detected - redirecting to login for protected route');
      // Clear captcha session
      localStorage.removeItem('captchaSessionId');
      localStorage.removeItem('swa_session');
      localStorage.removeItem('swa_jwt');
      localStorage.setItem('postLoginRedirect', location.pathname + location.search);
      navigate('/login', { 
        state: { 
          from: location.pathname,
          message: 'Please login to access this page' 
        } 
      });
      return;
    }

    // Validate session with backend
    const validationResult = await sessionManager.validateSession();
    //console.log('[SessionGuard] Session validated, isValid:', validationResult.valid);
    
    if (!validationResult.valid) {
      localStorage.setItem('postLoginRedirect', location.pathname + location.search);
      navigate('/login', { 
        state: { 
          from: location.pathname,
          message: validationResult.reason || 'Session expired. Please login again.' 
        } 
      });
      return;
    }

    setIsValidating(false);
    // Start activity tracking and session validation after refresh if session is valid
    sessionManager.startActivityTracking();
    sessionManager.startSessionValidation();
  };

  const handleSessionExpired = (event) => {
    const { reason } = event.detail;
    localStorage.setItem('postLoginRedirect', location.pathname + location.search);
    navigate('/login', { 
      state: { 
        from: location.pathname,
        message: reason || 'Your session has expired. Please login again.' 
      } 
    });
  };

  const handleInactivityWarning = (event) => {
    const { message, onStayActive, onLogout } = event.detail;
    //console.log('[SessionGuard] handleInactivityWarning called:', message);
    setWarningMessage(message);
    setWarningHandlers({ onStayActive, onLogout });
    setShowWarning(true);
  };

  const handleWarningDismissed = () => {
    setShowWarning(false);
    setWarningMessage('');
    setWarningHandlers({});
  };

  const handleStayActive = () => {
    if (warningHandlers.onStayActive) {
      warningHandlers.onStayActive();
    }
  };

  const handleLogout = () => {
    if (warningHandlers.onLogout) {
      warningHandlers.onLogout();
    }
    navigate('/login');
  };

  if (isValidating) {
    return (
      <div className="session-guard-loading">
        <div className="spinner"></div>
        <p>Validating session...</p>
      </div>
    );
  }

  return (
    <>
      {children}
      
      {/* Inactivity Warning Modal */}
      {showWarning && (
        <div className="inactivity-modal-overlay">
          <div className="inactivity-modal">
            <div className="modal-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                      stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            <h2 className="modal-title">Session Timeout Warning</h2>
            
            <p className="modal-message">{warningMessage}</p>
            
            <div className="modal-actions">
              <button 
                className="btn-stay-active"
                onClick={handleStayActive}
              >
                Stay Logged In
              </button>
              <button 
                className="btn-logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SessionGuard; 