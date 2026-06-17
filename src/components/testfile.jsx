import { useState, useEffect, useRef } from 'react';

export default function RecaptchaModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  onError,
  siteKey = '6Ldyjw8sAAAAABdYrlNfFBnp_zE_5nzO1qnB1-xh',
  apiUrl = 'https://swacrmportal-sit-be.swa.gov.sa/verify-captcha',
  title = 'reCAPTCHA Verification'
}) {
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const recaptchaRef = useRef(null);
  const scriptLoadedRef = useRef(false);

  // Load reCAPTCHA script only once
  useEffect(() => {
    if (scriptLoadedRef.current) return;
    
    console.log('📦 Loading reCAPTCHA script...');
    
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/enterprise.js';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      console.log('✅ reCAPTCHA script loaded successfully');
      scriptLoadedRef.current = true;
    };
    
    script.onerror = () => {
      console.error('❌ Failed to load reCAPTCHA script');
    };
    
    document.body.appendChild(script);

    return () => {
      // Don't remove script on unmount, keep it for reuse
    };
  }, []);

  // Setup callback when modal opens
  useEffect(() => {
    if (isOpen) {
      window.onRecaptchaSuccess = (captchaToken) => {
        console.log('✅ reCAPTCHA completed by user');
        console.log('🔑 Token received:', captchaToken.substring(0, 20) + '...');
        setToken(captchaToken);
        setMessage('');
      };
    }

    return () => {
      if (!isOpen) {
        delete window.onRecaptchaSuccess;
      }
    };
  }, [isOpen]);

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      setToken('');
      setMessage('');
      setLoading(false);
      if (window.grecaptcha && recaptchaRef.current) {
        try {
          window.grecaptcha.reset();
        } catch (e) {
          console.log('reCAPTCHA reset:', e);
        }
      }
    } else {
      // Render reCAPTCHA when modal opens
      setTimeout(() => {
        if (window.grecaptcha && recaptchaRef.current && !recaptchaRef.current.hasChildNodes()) {
          window.grecaptcha.render(recaptchaRef.current, {
            sitekey: siteKey,
            callback: 'onRecaptchaSuccess',
          });
        }
      }, 100);
    }
  }, [isOpen, siteKey]);

  const handleSubmit = async () => {
    console.log('\n🔘 Submit button clicked');
    
    if (!token) {
      console.log('⚠️ No token available - user needs to complete reCAPTCHA');
      setMessage('Please complete the reCAPTCHA');
      return;
    }

    console.log('✅ Token available, proceeding with verification');
    
    setLoading(true);
    setMessage('');

    try {
      console.log('📤 Sending POST request to backend...');
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      console.log('📥 Response received from backend');
      console.log('📊 Status:', response.status);

      const data = await response.json();
      console.log('📋 Response data:', data);

      if (data.success) {
        console.log('🎉 Verification successful!');
        setMessage('✅ reCAPTCHA verified successfully!');
        
        // Call success callback
        if (onSuccess) {
          onSuccess(data);
        }
        
        // Close modal after short delay
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        console.log('❌ Verification failed');
        setMessage('❌ reCAPTCHA verification failed');
        
        // Call error callback
        if (onError) {
          onError(data);
        }
      }
    } catch (error) {
      console.error('💥 Error connecting to server:', error);
      setMessage('❌ Error connecting to server');
      
      // Call error callback
      if (onError) {
        onError({ error: error.message });
      }
    } finally {
      console.log('🔄 Resetting reCAPTCHA...');
      setLoading(false);
      if (window.grecaptcha && recaptchaRef.current) {
        try {
          window.grecaptcha.reset();
        } catch (e) {
          console.log('Reset error:', e);
        }
      }
      setToken('');
      console.log('🏁 Process complete\n');
    }
  };

  const handleClose = () => {
    setToken('');
    setMessage('');
    if (window.grecaptcha && recaptchaRef.current) {
      try {
        window.grecaptcha.reset();
      } catch (e) {
        // Ignore reset errors
      }
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
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {title}
        </h1>
        
        <div className="space-y-6">
          <div className="flex justify-center">
            <div ref={recaptchaRef} id="recaptcha-container"></div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !token}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>

          {message && (
            <div className={`p-4 rounded-lg text-center font-medium ${
              message.includes('✅') 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {message}
            </div>
          )}
        </div>

        {/* Optional: Debug info (remove in production) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-semibold text-gray-700 mb-2">📊 Debug Info:</p>
            <div className="text-xs text-gray-600 space-y-1">
              <p><strong>Token Status:</strong> {token ? '✅ Ready' : '⏳ Waiting'}</p>
              <p><strong>Loading:</strong> {loading ? '⌛ Yes' : '✅ No'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}