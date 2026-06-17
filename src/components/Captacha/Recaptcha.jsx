import { useState, useEffect, useRef } from 'react';
import sessionManager from '@/utils/sessionManager';

export default function Recaptcha({ 
  isOpen, 
  onClose, 
  onSuccess, 
  onError,
  siteKey = '6Ldyjw8sAAAAABdYrlNfFBnp_zE_5nzO1qnB1-xh',
  apiUrl = 'https://swacrmportal-sit-be.swa.gov.sa/verify-captcha',
  title = 'reCAPTCHA Verification',
  action = 'submit' // ✅ Action parameter for Enterprise scoring
}) {
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const recaptchaRef = useRef(null);
  const scriptLoadedRef = useRef(false);
  const widgetIdRef = useRef(null);
  const tokenTimestampRef = useRef(null);

  useEffect(() => {
    if (scriptLoadedRef.current) return;
    
    console.log('Loading reCAPTCHA script...');
    
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/enterprise.js';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      console.log('reCAPTCHA script loaded successfully');
      scriptLoadedRef.current = true;
    };
    
    script.onerror = () => {
      console.error('Failed to load reCAPTCHA script');
      setMessage('Failed to load reCAPTCHA. Please refresh the page.');
    };
    
    document.body.appendChild(script);

    return () => {
      // Script stays loaded for reuse
    };
  }, []);

  // ✅ Handle success, error, and expired callbacks
  useEffect(() => {
    if (isOpen) {
      // Success callback
      window.onRecaptchaSuccess = (captchaToken) => {
        console.log('✅ reCAPTCHA completed by user');
        console.log('Token received:', captchaToken.substring(0, 20) + '...');
        setToken(captchaToken);
        setMessage('');
        tokenTimestampRef.current = Date.now();
        setRetryCount(0); // Reset retry count on success
      };

      // ✅ Error callback - handles reCAPTCHA errors
      window.onRecaptchaError = (error) => {
        console.error('❌ reCAPTCHA error:', error);
        setToken('');
        setMessage('reCAPTCHA error occurred. Please try again.');
        setRetryCount(prev => prev + 1);
        
        // Reset widget on error
        if (widgetIdRef.current !== null && window.grecaptcha) {
          try {
            if (window.grecaptcha.enterprise && window.grecaptcha.enterprise.reset) {
              window.grecaptcha.enterprise.reset(widgetIdRef.current);
            } else if (window.grecaptcha.reset) {
              window.grecaptcha.reset(widgetIdRef.current);
            }
          } catch (e) {
            console.log('Reset error on reCAPTCHA error:', e);
          }
        }
      };

      // ✅ Expired callback - handles token expiration
      window.onRecaptchaExpired = () => {
        console.warn('⏰ reCAPTCHA token expired');
        setToken('');
        setMessage('reCAPTCHA expired. Please complete it again.');
        tokenTimestampRef.current = null;
        
        // Reset widget on expiration
        if (widgetIdRef.current !== null && window.grecaptcha) {
          try {
            if (window.grecaptcha.enterprise && window.grecaptcha.enterprise.reset) {
              window.grecaptcha.enterprise.reset(widgetIdRef.current);
            } else if (window.grecaptcha.reset) {
              window.grecaptcha.reset(widgetIdRef.current);
            }
          } catch (e) {
            console.log('Reset error on expiration:', e);
          }
        }
      };
    }

    return () => {
      if (!isOpen) {
        delete window.onRecaptchaSuccess;
        delete window.onRecaptchaError;
        delete window.onRecaptchaExpired;
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setToken('');
      setMessage('');
      setLoading(false);
      setScore(null);
      setRetryCount(0);
      tokenTimestampRef.current = null;
      
      // Reset and remove widget when modal closes
      if (widgetIdRef.current !== null && window.grecaptcha) {
        try {
          if (window.grecaptcha.enterprise && window.grecaptcha.enterprise.reset) {
            window.grecaptcha.enterprise.reset(widgetIdRef.current);
          } else if (window.grecaptcha.reset) {
            window.grecaptcha.reset(widgetIdRef.current);
          }
        } catch (e) {
          console.log('reCAPTCHA reset error:', e);
        }
        
        // Remove the widget
        if (recaptchaRef.current) {
          recaptchaRef.current.innerHTML = '';
        }
        widgetIdRef.current = null;
      }
    } else {
      // Render reCAPTCHA when modal opens
      const renderRecaptcha = () => {
        if (!recaptchaRef.current) return;
        
        // Check if grecaptcha is available
        if (window.grecaptcha && window.grecaptcha.enterprise) {
          try {
            // ✅ Use Enterprise API with action parameter and all callbacks
            if (recaptchaRef.current && !recaptchaRef.current.hasChildNodes()) {
              widgetIdRef.current = window.grecaptcha.enterprise.render(recaptchaRef.current, {
                sitekey: siteKey,
                callback: 'onRecaptchaSuccess',
                'error-callback': 'onRecaptchaError', // ✅ Error callback
                'expired-callback': 'onRecaptchaExpired', // ✅ Expired callback
                action: action, // ✅ Action for better scoring
                size: 'normal', // Normal size checkbox
                theme: 'light' // Light theme
              });
              console.log('✅ reCAPTCHA Enterprise widget rendered with error/expired callbacks');
            }
          } catch (e) {
            console.error('Error rendering Enterprise reCAPTCHA:', e);
            // Fallback to regular API
            try {
              if (recaptchaRef.current && !recaptchaRef.current.hasChildNodes()) {
                widgetIdRef.current = window.grecaptcha.render(recaptchaRef.current, {
                  sitekey: siteKey,
                  callback: 'onRecaptchaSuccess',
                  'error-callback': 'onRecaptchaError',
                  'expired-callback': 'onRecaptchaExpired',
                  size: 'normal',
                  theme: 'light'
                });
                console.log('reCAPTCHA widget rendered (fallback)');
              }
            } catch (e2) {
              console.error('Error rendering reCAPTCHA:', e2);
              setMessage('Failed to load reCAPTCHA. Please refresh the page.');
            }
          }
        } else if (window.grecaptcha && window.grecaptcha.render) {
          // Regular reCAPTCHA API
          try {
            if (recaptchaRef.current && !recaptchaRef.current.hasChildNodes()) {
              widgetIdRef.current = window.grecaptcha.render(recaptchaRef.current, {
                sitekey: siteKey,
                callback: 'onRecaptchaSuccess',
                'error-callback': 'onRecaptchaError',
                'expired-callback': 'onRecaptchaExpired',
                size: 'normal',
                theme: 'light'
              });
              console.log('reCAPTCHA widget rendered');
            }
          } catch (e) {
            console.error('Error rendering reCAPTCHA:', e);
            setMessage('Failed to load reCAPTCHA. Please refresh the page.');
          }
        } else {
          // Script not ready yet, retry
          console.log('reCAPTCHA not ready, retrying...');
          setTimeout(renderRecaptcha, 200);
        }
      };

      // Wait a bit for the DOM and script to be ready
      setTimeout(renderRecaptcha, 100);
    }
  }, [isOpen, siteKey, action]);

  // ✅ Check token expiration before submitting
  const checkTokenExpiration = () => {
    if (!tokenTimestampRef.current) return false;
    
    // Tokens expire after ~2 minutes (120 seconds)
    const TOKEN_LIFETIME = 120 * 1000;
    const elapsed = Date.now() - tokenTimestampRef.current;
    
    if (elapsed > TOKEN_LIFETIME) {
      console.warn('Token expired (client-side check)');
      setToken('');
      setMessage('reCAPTCHA expired. Please complete it again.');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    console.log('Submit button clicked');
    
    if (!token) {
      console.log('No token available - user needs to complete reCAPTCHA');
      setMessage('Please complete the reCAPTCHA challenge first');
      return;
    }

    // ✅ Check if token is expired
    if (!checkTokenExpiration()) {
      // Reset widget
      if (widgetIdRef.current !== null && window.grecaptcha) {
        try {
          if (window.grecaptcha.enterprise && window.grecaptcha.enterprise.reset) {
            window.grecaptcha.enterprise.reset(widgetIdRef.current);
          } else if (window.grecaptcha.reset) {
            window.grecaptcha.reset(widgetIdRef.current);
          }
        } catch (e) {
          console.log('Reset error:', e);
        }
      }
      return;
    }

    console.log('Token available, proceeding with verification');
    
    setLoading(true);
    setMessage('');

    try {
      console.log('Sending POST request to backend...');
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      console.log('Response received from backend');
      console.log('Status:', response.status);

      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        console.log('✅ Verification successful!');
        console.log('Score:', data.score);
        setScore(data.score);
        setMessage(`reCAPTCHA verified successfully! ${data.score ? `(Score: ${(data.score * 100).toFixed(1)}%)` : ''}`);
        
        // ✅ Store session and JWT in localStorage
        if (data.sessionId && data.jwtSignature && data.expiresAt) {
          sessionManager.storeSessionWithJWT(
            data.sessionId,
            data.jwtSignature,
            data.expiresAt,
            null // No userId for captcha
          );
          // ✅ Store captcha sessionId separately for cleanup on login
          localStorage.setItem('captchaSessionId', data.sessionId);
          console.log('[Recaptcha] Session and JWT stored successfully, captchaSessionId saved');
        }
        
        if (onSuccess) {
          onSuccess(data);
        }
        
        setTimeout(() => {
          onClose();
        }, 2000); // Increased delay to show success message
      } else {
        console.log('❌ Verification failed');
        const errorMsg = data.errors?.[0] || data.error || 'reCAPTCHA verification failed';
        
        // ✅ Better error messages
        let userMessage = 'reCAPTCHA verification failed';
        if (errorMsg.includes('LOW_SCORE') || errorMsg.includes('low score')) {
          userMessage = 'Low security score. Please try again or complete the challenge.';
        } else if (errorMsg.includes('EXPIRED')) {
          userMessage = 'reCAPTCHA expired. Please complete it again.';
        } else if (errorMsg.includes('INVALID')) {
          userMessage = 'Invalid reCAPTCHA. Please try again.';
        } else {
          userMessage = errorMsg;
        }
        
        setMessage(userMessage);
        
        // ✅ Reset widget on failure for retry
        if (widgetIdRef.current !== null && window.grecaptcha) {
          try {
            if (window.grecaptcha.enterprise && window.grecaptcha.enterprise.reset) {
              window.grecaptcha.enterprise.reset(widgetIdRef.current);
            } else if (window.grecaptcha.reset) {
              window.grecaptcha.reset(widgetIdRef.current);
            }
          } catch (e) {
            console.log('Reset error:', e);
          }
        }
        
        setToken('');
        tokenTimestampRef.current = null;
        setRetryCount(prev => prev + 1);
        
        if (onError) {
          onError(data);
        }
      }
    } catch (error) {
      console.error('❌ Error connecting to server:', error);
      setMessage('Error connecting to server. Please check your connection and try again.');
      
      // Reset widget on network error
      if (widgetIdRef.current !== null && window.grecaptcha) {
        try {
          if (window.grecaptcha.enterprise && window.grecaptcha.enterprise.reset) {
            window.grecaptcha.enterprise.reset(widgetIdRef.current);
          } else if (window.grecaptcha.reset) {
            window.grecaptcha.reset(widgetIdRef.current);
          }
        } catch (e) {
          console.log('Reset error:', e);
        }
      }
      
      setToken('');
      tokenTimestampRef.current = null;
      
      if (onError) {
        onError({ error: error.message });
      }
    } finally {
      console.log('Resetting reCAPTCHA...');
      setLoading(false);
    }
  };

  const handleClose = () => {
    setToken('');
    setMessage('');
    setScore(null);
    setRetryCount(0);
    tokenTimestampRef.current = null;
    
    // Reset and clear widget
    if (widgetIdRef.current !== null && window.grecaptcha) {
      try {
        if (window.grecaptcha.enterprise && window.grecaptcha.enterprise.reset) {
          window.grecaptcha.enterprise.reset(widgetIdRef.current);
        } else if (window.grecaptcha.reset) {
          window.grecaptcha.reset(widgetIdRef.current);
        }
      } catch (e) {
        // Ignore reset errors
      }
      
      if (recaptchaRef.current) {
        recaptchaRef.current.innerHTML = '';
      }
      widgetIdRef.current = null;
    }
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)'
      }}
      // Removed onClick={handleClose} to prevent closing by clicking outside
    >
      <div 
        className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button removed - user must complete captcha */}

        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {title}
        </h1>
        
        <div className="space-y-6">
          <div className="flex justify-center">
            <div ref={recaptchaRef} id="recaptcha-container"></div>
          </div>

          {/* ✅ Show helpful message if retry */}
          {retryCount > 0 && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 text-center">
                Attempt {retryCount + 1}. If you see image challenges, please complete them carefully.
              </p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || !token}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>

          {message && (
            <div className={`p-4 rounded-lg text-center font-medium ${
              message.includes('successfully') 
                ? 'bg-green-100 text-green-800' 
                : message.includes('expired') || message.includes('try again')
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {message}
            </div>
          )}
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-semibold text-gray-700 mb-2">Debug Info:</p>
            <div className="text-xs text-gray-600 space-y-1">
              <p><strong>Token Status:</strong> {token ? 'Ready' : 'Waiting'}</p>
              <p><strong>Token Age:</strong> {tokenTimestampRef.current ? `${Math.floor((Date.now() - tokenTimestampRef.current) / 1000)}s` : 'N/A'}</p>
              <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
              <p><strong>Score:</strong> {score !== null ? `${(score * 100).toFixed(1)}%` : 'N/A'}</p>
              <p><strong>Retry Count:</strong> {retryCount}</p>
              <p><strong>Widget ID:</strong> {widgetIdRef.current !== null ? widgetIdRef.current : 'Not rendered'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
