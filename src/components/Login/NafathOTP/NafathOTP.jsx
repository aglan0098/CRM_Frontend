import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import useNafathAPI from '../Nafath/Nafathapicall';
import l1 from './logo1.png';
import l2 from './logo2.png';
import l3 from './logo3.png';
import sessionManager from '@/utils/sessionManager';
import config from '@/utils/config';
const NafathOTPVerificationEnglish = ({ language = 'en', onLanguageChange }) => {
  // State management
  const [error, setError] = useState('');
  const [nafathData, setNafathData] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [nafathStatus, setNafathStatus] = useState('WAITING');
  const [displayOTP, setDisplayOTP] = useState('');
  const [statusMessage, setStatusMessage] = useState('Waiting for approval...');
  const [verificationAttempts, setVerificationAttempts] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [isTimerActive, setIsTimerActive] = useState(true);
  
  const navigate = useNavigate();
  const verificationRef = useRef(null);
  const timerRef = useRef(null);
  
  // Use the API hook for resend functionality
  const { loading: resendLoading, error: resendError, verifyNationalId, resetState } = useNafathAPI();

  // Load OTP data on component mount
  useEffect(() => {
    const storedOtpData = localStorage.getItem('nafathOtpData');
    
    if (!storedOtpData) {
      alert('No verification data found. Please start authentication again.');
      navigate('/login-nafath');
      return;
    }
    
    try {
      const otpData = JSON.parse(storedOtpData);
      setNafathData(otpData);
      setDisplayOTP(otpData.randomNumber.toString());
      
      console.log('OTP Data loaded:', otpData);
      
      // Check if data is not too old (10 minutes expiry)
      const dataAge = Date.now() - otpData.timestamp;
      if (dataAge > 10 * 60 * 1000) {
        localStorage.removeItem('nafathOtpData');
        alert('Verification session expired. Please start again.');
        navigate('/login-nafath');
        return;
      }
      
      // Start verification process
      startNafathVerification(otpData);
      
    } catch (error) {
      console.error('Error parsing OTP data:', error);
      localStorage.removeItem('nafathOtpData');
      navigate('/login-nafath');
      return;
    }
    
    // Start timer
    startTimer();
    
    // Cleanup on unmount
    return () => {
      if (verificationRef.current) {
        // If there's an ongoing fetch, we can't really cancel it, but we can ignore the result
        verificationRef.current = null;
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [navigate]);

  // Timer function
  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setTimeLeft(120);
    setIsTimerActive(true);
    
    let currentTime = 120;
    
    timerRef.current = setInterval(() => {
      currentTime--;
      setTimeLeft(currentTime);
      
      if (currentTime <= 0) {
        clearInterval(timerRef.current);
        setIsTimerActive(false);
      }
    }, 1000);
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Start Nafath verification using backend polling
  const startNafathVerification = async (otpData) => {
    if (isVerifying) return; // Prevent multiple simultaneous verifications
    
    console.log('🚀 Starting Nafath verification...');
    setIsVerifying(true);
    setNafathStatus('WAITING');
    setStatusMessage('Waiting for approval...');
    setError('');
    
    try {
      // Create a reference to track this verification
      const currentVerification = {};
      verificationRef.current = currentVerification;
      
      // Call the backend polling endpoint with sessionToken (secure)
      // Get browser info for session conversion (use sessionManager's browserInfo)
      const browserInfo = sessionManager.browserInfo;
      const browserInfoParam = encodeURIComponent(JSON.stringify(browserInfo));
      
      // ✅ Get captcha sessionId from localStorage (if exists)
      const captchaSessionId = localStorage.getItem('captchaSessionId');
      const captchaParam = captchaSessionId ? `&captchaSessionId=${encodeURIComponent(captchaSessionId)}` : '';
      
      const response = await fetch(
        `${config.API_BASE_URL}/nafath/verify-otp?sessionToken=${otpData.sessionToken}&maxWaitTime=300&browserInfo=${browserInfoParam}${captchaParam}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      // Check if this verification is still current
      if (verificationRef.current !== currentVerification) {
        console.log('Verification cancelled or superseded');
        return;
      }
      
      const result = await response.json();
      console.log('📱 Nafath verification result:', result);
      
      setVerificationAttempts(result.attempts || 0);
      
      // ✅ SECURITY: Only proceed if BOTH success AND verified are true
      if (result.success === true && result.verified === true) {
        // Success case
        console.log('✅ Nafath OTP Verified Successfully!');
        setNafathStatus('COMPLETED');
        setStatusMessage('Approved! Authenticating...');
        
        // ✅ SECURITY: Only use userId and sessionToken if success is explicitly true
        if (!result.userId) {
          // User verified but not found in system - navigate to CreateAccount
          console.log('⚠️ User verified but userId not found. Navigating to CreateAccount.');
          setIsVerifying(false);
          navigate('/CreateAccount');
          return;
        }
        
        // ✅ Get sessionToken from response (backend converted session)
        const returnedSessionToken = result.sessionToken || otpData.sessionToken;
        
        // Store userId and sessionToken from verification response
        setNafathData(prev => ({ ...prev, userId: result.userId, sessionToken: returnedSessionToken }));
        
        // Stop the timer since verification is complete
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        setIsTimerActive(false);
        
        // Pass userId, sessionToken, JWT signature, and expiration directly to avoid React state timing issue
        handleSuccessfulVerification(
          result.userId, 
          returnedSessionToken,
          result.jwtSignature,
          result.expiresAt || result.sessionId ? result.expiresAt : null
        );
      } else {
        // ✅ SECURITY: If success is false, ignore ALL data including userId
        // Never use userId if success is not explicitly true
        if (result.userId) {
          console.warn('⚠️ SECURITY WARNING: Response has userId but success is false. Ignoring userId.');
        }
        
        // Check if user was verified but not found in system (verified: true, success: false)
        if (result.verified === true && result.success === false) {
          // User verified via Nafath but not found in system - navigate to CreateAccount
          console.log('⚠️ User verified via Nafath but not found in system. Navigating to CreateAccount.');
          setIsVerifying(false);
          navigate('/CreateAccount');
          return;
        }
        
        // Handle different failure scenarios
        setNafathStatus(result.status || 'EXPIRED');
        
        // Stop timer for failed/expired statuses
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        setIsTimerActive(false);
        
        switch (result.status) {
          case 'EXPIRED':
            setStatusMessage('Verification expired');
            break;
          case 'NOTFOUND':
          case 'NOT_FOUND':
            setStatusMessage('Transaction not found');
            break;
          case 'WAITING':
            setStatusMessage(result.reason === 'timeout' ? 'Verification timeout' : 'User did not respond');
            break;
          default:
            setStatusMessage(result.message || 'Verification failed');
        }
      }
      
    } catch (error) {
      console.error('❌ Nafath verification error:', error);
      
      // Check if this verification is still current
      if (verificationRef.current !== currentVerification) {
        return;
      }
      
      setNafathStatus('EXPIRED');
      setStatusMessage('Connection error');
      setError('Verification failed. Please try again.');
      
      // Stop timer on error
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setIsTimerActive(false);
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle successful verification
  const handleSuccessfulVerification = async (userIdFromResponse, sessionTokenFromResponse, jwtSignatureFromResponse = null, expiresAtFromResponse = null) => {
    setIsAuthenticating(true);
    setError('');
    
    try {
      // Use userId and sessionToken from response parameters (avoids React state timing issue)
      const userId = userIdFromResponse || nafathData?.userId;
      const sessionToken = sessionTokenFromResponse || nafathData?.sessionToken;
      const jwtSignature = jwtSignatureFromResponse;
      const expiresAt = expiresAtFromResponse;
      
      if (!userId || !sessionToken) {
        // User ID or sessionToken not found - navigate to CreateAccount
        console.log('⚠️ User ID or sessionToken not found. Navigating to CreateAccount.');
        setIsAuthenticating(false);
        navigate('/CreateAccount');
        return;
      }
      
      // ✅ Clear captcha sessionId from localStorage (cleanup after successful login)
      const captchaSessionId = localStorage.getItem('captchaSessionId');
      if (captchaSessionId) {
        localStorage.removeItem('captchaSessionId');
        console.log('[NafathOTP] Captcha sessionId cleared from localStorage');
      }
      
      // ✅ Store session with JWT in localStorage (replaces existing if any)
      if (jwtSignature && expiresAt) {
        sessionManager.storeSessionWithJWT(
          sessionToken,  // sessionToken is used as sessionId
          jwtSignature,
          expiresAt,
          userId
        );
        console.log('[NafathOTP] Session and JWT stored successfully (replaced existing if any)');
      } else {
        // Fallback to old method if JWT not available (backward compatibility)
        const browserInfo = sessionManager.browserInfo;
        const sessionObj = {
          sessionId: sessionToken,  // sessionToken is used as sessionId
          userId: userId,
          browserInfo: browserInfo,
          createdAt: Date.now()
        };
        localStorage.setItem('swa_session', JSON.stringify(sessionObj));
        console.log('Session stored in localStorage (without JWT):', sessionObj);
      }

      localStorage.setItem('swa_user', JSON.stringify({
        userId: userId,
        timestamp: new Date().toISOString()
      }));
      console.log('localStorage updated with userId:', userId);
      localStorage.removeItem('nafathOtpData');
      localStorage.removeItem('nafathNationalId');
      localStorage.removeItem('nafathTimer');
      
      // ✅ CRITICAL: Initialize sessionManager and start tracking BEFORE navigation
      // This ensures session is ready when destination page loads
      if (sessionManager && typeof sessionManager.startActivityTracking === 'function') {
        sessionManager.startActivityTracking();
        sessionManager.startSessionValidation();
        console.log('SessionManager initialized and tracking started');
      }
      
      // ✅ Use setTimeout to ensure localStorage write is complete and sessionManager is ready
      // This prevents race condition where destination page calls API before session is ready
      setTimeout(() => {
        const caseId  = localStorage.getItem('deep_link_case_id');
        const caseType = localStorage.getItem('deep_link_case_type'); 
        const redirectUrl = localStorage.getItem('postLoginRedirect');  // we stored this earlier
        const redirectTarget = localStorage.getItem('login_redirect_target');
        const redirectService = localStorage.getItem('login_redirect_service');
        if (caseId && caseType) {
          navigate(`/dashboard?caseName=${caseType}&guid=${caseId}`);
        } else if(redirectTarget === 'dashboard_eservices'){
          localStorage.setItem('target_service', 'E-Services');
          localStorage.setItem('target_service_type', redirectService || 'regulatory-support');
          localStorage.removeItem('login_redirect_target');
          localStorage.removeItem('login_redirect_service');
          navigate('/DashBoard');
        } else if(redirectUrl){
          localStorage.removeItem('postLoginRedirect');
          navigate(redirectUrl);
        }else {
          navigate('/AccountSel');   // your usual page
        }
        }, 200); // Delay to ensure localStorage write is complete and session is ready
    } catch (error) {
      console.error('Authentication error:', error);
      setError('Authentication failed. Please try again.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleResendClick = async (e) => {
    e.preventDefault();
    
    if (resendLoading || isVerifying) return;
    
    // Get nationalId from localStorage (stored separately for resend)
    const nationalId = localStorage.getItem('nafathNationalId');
    
    if (!nationalId) {
      alert('No verification data found. Please start authentication again.');
      navigate('/login-nafath');
      return;
    }
    
    try {
      console.log('Calling resend API for National ID:', nationalId);
      const result = await verifyNationalId(nationalId);
      
      if (result.success && result.isSuccess !== false) {
        // Update the stored data with new sessionToken and OTP
        const newOtpData = {
          sessionToken: result.sessionToken,  // ✅ New secure token
          randomNumber: result.random,        // ✅ New OTP
          timestamp: Date.now()
        };
        
        localStorage.setItem('nafathOtpData', JSON.stringify(newOtpData));
        setNafathData(newOtpData);
        setDisplayOTP(result.random.toString());
        
        console.log('New OTP Data after resend:', newOtpData);
        
        // Reset state
        setError('');
        setVerificationAttempts(0);
        setNafathStatus('WAITING');
        setStatusMessage('Waiting for approval...');
        
        // Restart timer
        startTimer();
        
        // Start verification again with new data
        startNafathVerification(newOtpData);
      }
      
    } catch (err) {
      console.error('Resend error:', err);
      setError('Failed to resend verification code. Please try again.');
    }
  };

  // Get status display info
  const getStatusInfo = () => {
    switch (nafathStatus) {
      case 'WAITING':
        return {
          color: '#1B8354',
          icon: isVerifying ? '⏳' : '⏸️',
          canResend: !isVerifying
        };
      case 'COMPLETED':
        return {
          color: '#10B981',
          icon: '✅',
          canResend: false
        };
      case 'EXPIRED':
        return {
          color: '#EF4444',
          icon: '⏰',
          canResend: true
        };
      case 'NOTFOUND':
      case 'NOT_FOUND':
        return {
          color: '#EF4444',
          icon: '❌',
          canResend: true
        };
      default:
        return {
          color: '#6B7280',
          icon: '⚠️',
          canResend: true
        };
    }
  };

  const statusInfo = getStatusInfo();

  // Show loading if data is not loaded yet
  if (!nafathData) {
    return (
      <LoginContainer>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Loading verification data...
        </div>
      </LoginContainer>
    );
  }

  return (
    <LoginContainer>
      <LoginTitle>Identity Verification</LoginTitle>
      <LoginSubtitle>For Saudi citizens or residents with Saudi residency</LoginSubtitle>
      
      <Logos>
        <LogosTop>
          <Logo1 src={l1} alt="Logo 1" />
          <Logo2 src={l2} alt="Logo 2" />
          <Logo3 src={l3} alt="Logo 3" />
        </LogosTop>
      </Logos>

      <OtpContainer>
        <OtpDisplay
          value={displayOTP}
          readOnly
          status={nafathStatus}
        />
      </OtpContainer>

      <VerificationInstruction>
        Verify via Nafath: Log in and select the code above
        <br />
        {/* {statusInfo.icon}  */}
        {statusMessage}
        {isVerifying && <span> (Verifying...)</span>}
      </VerificationInstruction>
      
      {nafathStatus === 'COMPLETED' && (
        <LoginButton 
          active={true}
          disabled={isAuthenticating}
        >
          {isAuthenticating ? 'Authenticating...' : 'Verified'}
        </LoginButton>
      )}

      <ErrorMessage>
        {error || (resendError && 'Failed to resend verification code')}
      </ErrorMessage>
      
      {nafathStatus !== 'COMPLETED' && (
        <ResendSection>
          <span>Not receiving notification? </span>
          <ResendLink 
            href="#" 
            onClick={handleResendClick}
            disabled={resendLoading || isAuthenticating || isVerifying || isTimerActive}
            className={isTimerActive || resendLoading || isAuthenticating || isVerifying ? 'disabled' : ''}
          >
            {resendLoading ? 'Sending...' : 'Resend'}
          </ResendLink>
          {isTimerActive && (
            <TimerText>{formatTime(timeLeft)}</TimerText>
          )}
        </ResendSection>
      )}

      {/* Debug info - remove in production */}
      {/* <div style={{ 
        position: 'absolute', 
        bottom: '10px', 
        left: '10px', 
        color: 'white', 
        fontSize: '12px',
        background: 'rgba(0,0,0,0.5)',
        padding: '5px',
        borderRadius: '3px'
      }}>
        Current Language: {language}
      </div> */}
    </LoginContainer>
  );
};

// Styled components
const LoginContainer = styled.div`
  background: #FFF;
  border-radius: 16px;
  padding: 48px 72px 40px 72px;
  width: 540px;
  max-width: 620px;
  justify-content: center;
  align-items: center;
  gap: 32px;
  box-shadow: 40px 40px 60px 0px rgba(0, 0, 0, 0.15);
  margin: 0 auto;

  @media (max-width: 768px) {
    width: 90%;
    max-width: 90%;
    padding: 36px 32px 32px 32px;
  }

  @media (max-width: 480px) {
    width: 95%;
    max-width: 95%;
    padding: 24px 20px;
    box-shadow: 20px 20px 40px 0px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 360px) {
    padding: 20px 16px;
  }
`;

const LoginTitle = styled.h1`
  margin-bottom: 10px;
  color: var(--foreground-high, #101828);
  font-family: "IBM Plex Sans Arabic";
  font-size: 28px;
  font-style: normal;
  font-weight: 600;
  line-height: 100%;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 24px;
  }

  @media (max-width: 480px) {
    font-size: 22px;
    margin-bottom: 8px;
  }

  @media (max-width: 360px) {
    font-size: 20px;
  }
`;

const LoginSubtitle = styled.p`
  margin-bottom: 32px;
  color: var(--Text-text-secondary-paragraph, #6C737F);
  font-family: "IBM Plex Sans Arabic";
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 118%;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 15px;
    margin-bottom: 28px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
    margin-bottom: 24px;
  }
`;

const Logos = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 78px;
  align-self: stretch;
  margin-bottom: 32px;
  position: relative;

  @media (max-width: 768px) {
    gap: 60px;
    margin-bottom: 28px;
  }

  @media (max-width: 480px) {
    gap: 40px;
    margin-bottom: 24px;
  }
`;

const LogosTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 270px;

  @media (max-width: 768px) {
    max-width: 240px;
  }

  @media (max-width: 480px) {
    max-width: 200px;
  }

  @media (max-width: 360px) {
    max-width: 180px;
  }
`;

const Logo1 = styled.img`
  width: 46.12px;
  height: 48.375px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 40px;
    height: 42px;
  }

  @media (max-width: 480px) {
    width: 35px;
    height: 37px;
  }

  @media (max-width: 360px) {
    width: 30px;
    height: 32px;
  }
`;

const Logo2 = styled.img`
  width: 84px;
  height: 5px;

  @media (max-width: 768px) {
    width: 70px;
  }

  @media (max-width: 480px) {
    width: 60px;
    height: 4px;
  }

  @media (max-width: 360px) {
    width: 50px;
  }
`;

const Logo3 = styled.img`
  width: 103px;
  height: 44px;
  aspect-ratio: 103/44;

  @media (max-width: 768px) {
    width: 90px;
    height: 38px;
  }

  @media (max-width: 480px) {
    width: 75px;
    height: 32px;
  }

  @media (max-width: 360px) {
    width: 65px;
    height: 28px;
  }
`;

const OtpContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
`;

const OtpDisplay = styled.input`
  width: 120px;
  height: 80px;
  border: 2px solid ${props => {
    switch(props.status) {
      case 'COMPLETED': return '#10B981';
      case 'EXPIRED': return '#EF4444';
      case 'NOTFOUND': return '#EF4444';
      default: return '#104631';
    }
  }};
  border-radius: 8px;
  text-align: center;
  font-family: "IBM Plex Sans Arabic";
  font-size: 24px;
  font-weight: 600;
  color: #101828;
  background: ${props => {
    switch(props.status) {
      case 'COMPLETED': return '#ECFDF5';
      case 'EXPIRED': return '#FEF2F2';
      case 'NOTFOUND': return '#FEF2F2';
      default: return '#F0FDF4';
    }
  }};
  outline: none;
  margin-bottom: 16px;
  cursor: default;
  user-select: all;

  @media (max-width: 768px) {
    width: 100px;
    height: 70px;
    font-size: 22px;
  }

  @media (max-width: 480px) {
    width: 90px;
    height: 60px;
    font-size: 20px;
    margin-bottom: 12px;
  }

  @media (max-width: 360px) {
    width: 80px;
    height: 55px;
    font-size: 18px;
  }
`;

const VerificationInstruction = styled.p`
  color: #6C737F;
  font-family: "IBM Plex Sans Arabic";
  font-size: 16px;
  font-weight: 400;
  line-height: 118%;
  text-align: center;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    font-size: 15px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
    margin-bottom: 20px;
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 4px;
  font-family: "IBM Plex Sans Arabic";
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  cursor: ${props => props.active ? 'pointer' : 'not-allowed'};
  transition: all 0.3s ease;
  margin-bottom: 16px;
  color: #FFF;
  background: ${props => props.active ? '#10B981' : '#E5E7EB'};

  &:hover {
    background: ${props => props.active ? '#059669' : '#E5E7EB'};
  }

  @media (max-width: 480px) {
    padding: 14px;
    min-height: 48px;
  }
`;

const ErrorMessage = styled.div`
  color: #EF4444;
  font-family: "IBM Plex Sans Arabic";
  font-size: 14px;
  font-weight: 400;
  text-align: center;
  margin-bottom: 16px;
  min-height: 20px;

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

const ResendSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  text-align: center;
  font-size: 14px;
  color: #6C737F;
  font-family: "IBM Plex Sans Arabic";

  @media (max-width: 480px) {
    font-size: 13px;
    flex-wrap: wrap;
  }
`;

const ResendLink = styled.a`
  color: ${props => props.disabled ? '#9CA3AF' : '#1B8354'};
  text-decoration: none;
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};

  &:hover {
    text-decoration: ${props => props.disabled ? 'none' : 'underline'};
  }

  &.disabled {
    color: #9CA3AF;
    cursor: not-allowed;
    text-decoration: none;
  }

  &.disabled:hover {
    text-decoration: none;
  }
`;

const TimerText = styled.span`
  color: #1B8354;
  font-weight: 500;
`;

export default NafathOTPVerificationEnglish;