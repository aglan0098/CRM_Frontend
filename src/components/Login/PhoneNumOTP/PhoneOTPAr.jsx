import React, { useState, useEffect, useRef } from 'react';
import './PhoneOTPAr.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyOTP, sendSMS } from '../Firestore_SMS_CRMAuth/APIs';
import sessionManager from '@/utils/sessionManager';

const PhoneOTPArabic = ({ language = 'ar', onLanguageChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get session data from navigation state
  const { sessionId, phoneNumber } = location.state || {};
  
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [isExpired, setIsExpired] = useState(false);
  const [timerStartTime, setTimerStartTime] = useState(null);
  
  const inputRefs = useRef([]);
  const timerRef = useRef(null);

  // Check if session data exists, redirect if not
  useEffect(() => {
    if (!sessionId || !phoneNumber) {
      console.error('No session data found, redirecting to login');
      navigate('/phone-login');
      return;
    }
    
    initializeTimer();
    
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [sessionId, phoneNumber, navigate]);

  const initializeTimer = () => {
  const timerKey = `otpTimer_${sessionId}`;
  const storedStartTime = sessionStorage.getItem(timerKey);
  
  if (!storedStartTime) {
    // Fresh OTP page - start new 120-second timer
    const newStartTime = Date.now();
    setTimerStartTime(newStartTime);
    setTimeLeft(120);
    setIsTimerActive(true);
    setIsExpired(false);
    
    // FIX: Store the timer start time IMMEDIATELY
    sessionStorage.setItem(timerKey, newStartTime.toString());
    
    // Start the countdown
    startTimer(false, 120);
  } else {
    // Resume existing timer
    const currentTime = Date.now();
    const elapsedSeconds = Math.floor((currentTime - parseInt(storedStartTime)) / 1000);
    const remainingTime = Math.max(0, 120 - elapsedSeconds);
    
    setTimerStartTime(parseInt(storedStartTime));
    setTimeLeft(remainingTime);
    
    if (remainingTime <= 0) {
      setIsTimerActive(false);
      setIsExpired(true);
      sessionStorage.removeItem(timerKey);
    } else {
      setIsTimerActive(true);
      setIsExpired(false);
      startTimer(false, remainingTime);
    }
  }
};

  const startTimer = (isResend = false, initialTime = 120) => {
    const timerKey = `otpTimer_${sessionId}`;
    
    if (isResend) {
      const newStartTime = Date.now();
      setTimerStartTime(newStartTime);
      setTimeLeft(120);
      setIsTimerActive(true);
      setIsExpired(false);
      sessionStorage.setItem(timerKey, newStartTime.toString());
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    const startTime = isResend ? 120 : initialTime;
    let currentTime = startTime;
    
    timerRef.current = setInterval(() => {
      currentTime--;
      setTimeLeft(currentTime);
      
      if (currentTime <= 0) {
        clearInterval(timerRef.current);
        setIsTimerActive(false);
        setIsExpired(true);
        sessionStorage.removeItem(timerKey);
      }
    }, 1000);
  };

  const handleInputChange = (index, value) => {
    // Don't allow input if timer is expired
    if (isExpired) {
      return;
    }

    // Only allow numbers
    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    // Clear error message when user starts typing
    if (errorMessage && value) {
      setErrorMessage('');
    }

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Don't allow input if timer is expired
    if (isExpired) {
      e.preventDefault();
      return;
    }

    // Handle backspace
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (index, e) => {
    // Don't allow paste if timer is expired
    if (isExpired) {
      e.preventDefault();
      return;
    }

    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
    
    const newOtpValues = [...otpValues];
    for (let i = 0; i < Math.min(pastedData.length, 6 - index); i++) {
      newOtpValues[index + i] = pastedData[i];
    }
    setOtpValues(newOtpValues);
  };

  const isButtonActive = otpValues.some(value => value !== '') && !isExpired && !loading;

  const handleVerify = async () => {
    if (!isButtonActive || isExpired) return;
    
    const otp = otpValues.join('');
    
    console.log('OTP verification attempted with language:', language);
    
    // Check if OTP is complete (6 digits)
    if (otp.length !== 6) {
      setErrorMessage('يرجى إدخال رمز التحقق المكون من 6 أرقام بالكامل.');
      return;
    }
    
    setLoading(true);
    setErrorMessage('');
    
    try {
      // Get browser info for session conversion (use sessionManager's browserInfo)
      const browserInfo = sessionManager.browserInfo;
      
      // ✅ Get captcha sessionId from localStorage (if exists)
      const captchaSessionId = localStorage.getItem('captchaSessionId');
      
      // ✅ SECURITY ENHANCED: Call verify API with sessionId, browserInfo, and captchaSessionId
      const verifyResult = await verifyOTP(sessionId, otp, browserInfo, captchaSessionId);
      
      if (verifyResult.success && verifyResult.data?.success === true) {
        console.log('OTP Verified Successfully with language:', language);
        
        // ✅ Get sessionId, userId, JWT signature, and expiration from verification response
        const returnedSessionId = verifyResult.data?.sessionId || sessionId;
        const userId = verifyResult.data?.userId;
        const jwtSignature = verifyResult.data?.jwtSignature;
        const expiresAt = verifyResult.data?.expiresAt;
        
        if (!userId || !returnedSessionId) {
          setErrorMessage('لم يتم العثور على الجلسة أو معرف المستخدم في الاستجابة. يرجى المحاولة مرة أخرى.');
          setLoading(false);
          return;
        }
        
        // ✅ Clear captcha sessionId from localStorage (cleanup after successful login)
        if (captchaSessionId) {
          localStorage.removeItem('captchaSessionId');
          console.log('[PhoneOTP] Captcha sessionId cleared from localStorage');
        }
        
        // ✅ Store session with JWT in localStorage (replaces existing if any)
        if (jwtSignature && expiresAt) {
          sessionManager.storeSessionWithJWT(
            returnedSessionId,
            jwtSignature,
            expiresAt,
            userId
          );
          console.log('[PhoneOTP] Session and JWT stored successfully (replaced existing if any)');
        } else {
          // Fallback to old method if JWT not available (backward compatibility)
          const sessionObj = {
            sessionId: returnedSessionId,
            userId: userId,
            browserInfo: browserInfo,
            createdAt: Date.now()
          };
          localStorage.setItem('swa_session', JSON.stringify(sessionObj));
          console.log('Session stored in localStorage (without JWT):', sessionObj);
        }
        
        // Store user data in localStorage (keeping for backward compatibility)
        localStorage.setItem('swa_user', JSON.stringify({
          userId: userId,
          timestamp: new Date().toISOString()
        }));
        
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
          // Check for deep link case data
          const caseId = localStorage.getItem('deep_link_case_id');
          const caseType = localStorage.getItem('deep_link_case_type');
          const redirectUrl = localStorage.getItem('postLoginRedirect');
          const redirectTarget = localStorage.getItem('login_redirect_target');
          const redirectService = localStorage.getItem('login_redirect_service');
          if (caseId && caseType) {
            // Navigate to dashboard with case parameters
            navigate(`/dashboard?caseName=${caseType}&guid=${caseId}`);
          } else if(redirectTarget === 'dashboard_eservices'){
            localStorage.setItem('target_service', 'E-Services');
            localStorage.setItem('target_service_type', redirectService || 'regulatory-support');
            localStorage.removeItem('login_redirect_target');
            localStorage.removeItem('login_redirect_service');
            navigate('/DashBoard');
          } else if (redirectUrl) {
            localStorage.removeItem('postLoginRedirect');
            navigate(redirectUrl);
          } else {
            // Navigate to usual AccountSel page
            navigate('/AccountSel');
          }
        }, 200); // Delay to ensure localStorage write is complete and session is ready
      } else {
        // Show error
        setErrorMessage('رمز التحقق غير صحيح. يرجى المحاولة مرة أخرى.');
        
        // Clear inputs and focus first
        setOtpValues(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setErrorMessage(error.message || 'خطأ في الشبكة. يرجى المحاولة مرة أخرى.');
      
      // Clear inputs and focus first
      setOtpValues(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async (e) => {
    e.preventDefault();
    
    if (isTimerActive || loading) return;
    
    console.log('OTP resend requested with language:', language);
    
    setLoading(true);
    setErrorMessage('');
    
    try {
      // ✅ SECURITY ENHANCED: Resend OTP using sessionId (backend generates new OTP and sends SMS)
      const smsResult = await sendSMS(sessionId);
      
      if (!smsResult.success) {
        setErrorMessage('فشل في إرسال رمز التحقق. يرجى المحاولة مرة أخرى.');
        return;
      }
      
      // Step 3: Reset state and restart timer
      setOtpValues(['', '', '', '', '', '']);
      setIsExpired(false);
      
      // Clear existing timer interval
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Restart timer with resend flag
      startTimer(true);
      
      // Focus first input
      inputRefs.current[0]?.focus();
      
      console.log('New verification code sent successfully');
      
    } catch (error) {
      console.error('Resend OTP error:', error);
      setErrorMessage(error.message || 'فشل في إعادة إرسال رمز التحقق. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Format phone number for display (hide middle digits)
  const formatPhoneForDisplay = (phone) => {
    if (!phone || phone.length < 8) return '****4321';
    return `****${phone.slice(-4)}`;
  };

  return (
    <div className="otp-page-containerAr" dir="rtl">
      <div className="login-containerAr">
        <h1 className="login-titleAr">تسجيل الدخول</h1>
        
        <p className="verification-textAr">
          تم إرسال رمز التحقق إلى {formatPhoneForDisplay(phoneNumber)}
        </p>
        
        <div className="otp-labelAr">
          أدخل رمز التحقق المكون من 6 أرقام
        </div>
        
        <div className="otp-containerAr">
          {otpValues.map((value, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              maxLength="1"
              value={value}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={(e) => handlePaste(index, e)}
              className={`otp-inputAr ${value ? 'filledAr' : ''} ${isExpired ? 'expiredAr' : ''}`}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              inputMode="numeric"
              pattern="[0-9]*"
              disabled={loading}
            />
          ))}
        </div>

        {(isExpired || errorMessage) && (
          <div className="error-messageAr">
            {isExpired ? 'انتهت صلاحية رمز التحقق. يرجى النقر على إعادة إرسال الرمز.' : errorMessage}
          </div>
        )}

        <button
          type="button"
          onClick={handleVerify}
          disabled={!isButtonActive || isExpired}
          className={`verify-buttonAr ${isButtonActive && !isExpired ? 'activeAr' : ''}`}
        >
          {loading ? 'جاري التحقق...' : 'تحقق'}
        </button>

        <div className="resend-sectionAr">
          <span>لم تستلم الرسالة النصية؟ </span>
          <a
            href="#"
            onClick={handleResend}
            className={`resend-linkAr ${isTimerActive || loading ? 'disabledAr' : ''}`}
          >
            {loading ? 'جاري الإرسال...' : 'إعادة إرسال الرمز'}
          </a>
          {isTimerActive && (
            <span className="timerAr">
              {' '}{formatTime(timeLeft)}
            </span>
          )}
        </div>

        {/* Debug info - remove in production */}
        {/* <div style={{ 
          position: 'absolute', 
          bottom: '10px', 
          right: '10px', 
          color: 'white', 
          fontSize: '12px',
          background: 'rgba(0,0,0,0.5)',
          padding: '5px',
          borderRadius: '3px'
        }}>
          اللغة الحالية: {language} | معرف الجلسة: {sessionId?.substring(0, 8)}...
        </div> */}
      </div>
    </div>
  );
};

export default PhoneOTPArabic;