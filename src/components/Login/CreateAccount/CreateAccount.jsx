import React, { useState, useEffect } from 'react';
import './CreateAccount.css';
import { Link, useNavigate } from "react-router-dom";
import config from '@/utils/config';
import TermsModal from './TermsModal';
import DatePicker from './DatePicker';
import sessionManager from '@/utils/sessionManager';
import Recaptcha from '@/components/Captacha/Recaptcha';

const CreateAccountEnglish = ({ language = 'en', onLanguageChange }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstNameEnglish: '',
    lastNameEnglish: '',
    firstNameArabic: '',
    lastNameArabic: '',
    phoneNumber: '',
    nationalId: '',
    dateOfBirth: '',
    email: ''
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [error, setError] = useState('');
  
  // Captcha state
  const [showCaptchaModal, setShowCaptchaModal] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  // Auto-populate National ID from localStorage on component mount
  useEffect(() => {
    const storedOtp = localStorage.getItem('nafathOtpData');
    if (storedOtp) {
      try {
        const otpData = JSON.parse(storedOtp);
        if (otpData.nationalId) {
          setFormData(prev => ({
            ...prev,
            nationalId: otpData.nationalId
          }));
          console.log("National ID exists:", otpData.nationalId);
        }
      } catch (error) {
        console.error("Error parsing stored OTP data:", error);
      }
    }
  }, []);

  /**
   * Get JWT headers for API calls
   * Logic:
   * 1. If userId exists (logged in) → use sessionManager.getJWTHeaders()
   * 2. If no userId but JWT exists (captcha) → use sessionManager.getJWTHeaders()
   * 3. If no JWT → return null (need captcha)
   * @returns {object|null} Headers object or null if JWT needed
   */
  const getAPIHeaders = () => {
    // Check if user is logged in (has userId)
    const storedUserData = localStorage.getItem('swa_user');
    const hasUserId = storedUserData && JSON.parse(storedUserData)?.userId;
    
    // Get JWT headers from sessionManager (works for both logged-in and captcha users)
    const jwtHeaders = sessionManager.getJWTHeaders();
    
    // Check if headers object has any keys (not empty object)
    if (jwtHeaders && typeof jwtHeaders === 'object' && Object.keys(jwtHeaders).length > 0) {
      // JWT exists (either from login or captcha)
      console.log('[CreateAccount] Using JWT headers', hasUserId ? '(logged in)' : '(captcha verified)');
      return jwtHeaders;
    }
    
    // No JWT found - need captcha
    console.log('[CreateAccount] No JWT found - captcha required');
    return null;
  };

  /**
   * Handle captcha verification success
   */
  const handleCaptchaSuccess = () => {
    console.log('[CreateAccount] Captcha verified, JWT now available');
    setCaptchaVerified(true);
    setShowCaptchaModal(false);
    // Retry form submission if form was already filled
    if (formData.firstNameEnglish && formData.lastNameEnglish && formData.nationalId) {
      const performSubmit = async () => {
        const headers = getAPIHeaders();
        if (headers) {
          setIsLoading(true);
          setError('');
          try {
            const requestBody = {
              firstNameEnglish: formData.firstNameEnglish.trim(),
              lastNameEnglish: formData.lastNameEnglish.trim(),
              firstNameArabic: formData.firstNameArabic.trim(),
              lastNameArabic: formData.lastNameArabic.trim(),
              phoneNumber: formData.phoneNumber.trim(),
              email: formData.email.trim(),
              nationalId: formData.nationalId.trim(),
              consent: true
            };

            const response = await fetch(`${config.API_BASE_URL}/api/contact-creation`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...headers
              },
              body: JSON.stringify(requestBody)
            });

            const data = await response.json();

            if (response.ok && data.success) {
              console.log('Contact created successfully:', data);
              localStorage.removeItem('nafathOtpData');
              setShowModal(true);
            } else {
              setError(data.message || 'Failed to create account');
              setShowErrorModal(true);
              setIsLoading(false);
            }
          } catch (error) {
            console.error('Error creating account:', error);
            setError(error.message || 'Failed to create account. Please try again.');
            setShowErrorModal(true);
            setIsLoading(false);
          }
        }
      };
      performSubmit();
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    // Clear error when user starts typing
    if (error) {
      setError('');
      setShowErrorModal(false);
    }
  };

  const formatPhoneNumber = (phone) => {
    // Clean the phone number
    let cleanPhone = phone.replace(/\s+/g, '').replace(/^\+?966/, '');

    // If it starts with 05, format it correctly
    if (cleanPhone.startsWith('05')) {
      return `+966${cleanPhone}`;
    }

    // If it doesn't start with 05, add 05 prefix
    if (!cleanPhone.startsWith('5')) {
      cleanPhone = '05' + cleanPhone.replace(/^0?/, '');
    } else {
      cleanPhone = '0' + cleanPhone;
    }

    return phone;
  };

  const validateArabicText = (text) => {
    // Arabic Unicode range: \u0600-\u06FF
    const arabicRegex = /^[\u0600-\u06FF\s]+$/;
    return arabicRegex.test(text);
  };

  const validateEnglishText = (text) => {
    // English letters, spaces, hyphens, and apostrophes
    const englishRegex = /^[a-zA-Z\s\-']+$/;
    return englishRegex.test(text);
  };

  const validateForm = () => {
    const { firstNameEnglish, lastNameEnglish, firstNameArabic, lastNameArabic, phoneNumber, nationalId, dateOfBirth, email } = formData;

    if (!firstNameEnglish.trim() || !lastNameEnglish.trim() || !firstNameArabic.trim() || !lastNameArabic.trim() ||
      !phoneNumber.trim() || !nationalId.trim() || !dateOfBirth.trim() || !email.trim()) {
      setError('Please fill in all required fields');
      setShowErrorModal(true);
      return false;
    }

    if (!termsAccepted) {
      setError('Please accept the Terms and Conditions to continue');
      setShowErrorModal(true);
      return false;
    }

    // Validate English names
    if (!validateEnglishText(firstNameEnglish)) {
      setError('First Name in English should only contain English letters');
      setShowErrorModal(true);
      return false;
    }
    if (!validateEnglishText(lastNameEnglish)) {
      setError('Last Name in English should only contain English letters');
      setShowErrorModal(true);
      return false;
    }

    // Validate Arabic names
    if (!validateArabicText(firstNameArabic)) {
      setError('First Name in Arabic should only contain Arabic letters');
      setShowErrorModal(true);
      return false;
    }
    if (!validateArabicText(lastNameArabic)) {
      setError('Last Name in Arabic should only contain Arabic letters');
      setShowErrorModal(true);
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setShowErrorModal(true);
      return false;
    }

    // Basic phone number validation (Saudi format - must start with 05)
    const phoneRegex = /^05[0-9]{8}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError('Phone number must start with 05 and be 10 digits (05XXXXXXXX)');
      setShowErrorModal(true);
      return false;
    }

    // Date format validation (YYYY-MM-DD from date input)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateOfBirth)) {
      setError('Please select a valid date of birth');
      setShowErrorModal(true);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Check if JWT is available before submitting
    const headers = getAPIHeaders();
    if (!headers) {
      console.log('[CreateAccount] No JWT - showing captcha modal before submit');
      setShowCaptchaModal(true);
      return;
    }

    setIsLoading(true);
    setError('');

    console.log('Form submitted with language:', language);

    try {
      const requestBody = {
        firstNameEnglish: formData.firstNameEnglish.trim(),
        lastNameEnglish: formData.lastNameEnglish.trim(),
        firstNameArabic: formData.firstNameArabic.trim(),
        lastNameArabic: formData.lastNameArabic.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        email: formData.email.trim(),
        nationalId: formData.nationalId.trim(),
        consent: true
      };

      const response = await fetch(`${config.API_BASE_URL}/api/contact-creation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log('Contact created successfully:', data);
        localStorage.removeItem('nafathOtpData');
        setShowModal(true);
        // Success: Modal will handle navigation to login
      } else {
        // Error: Stay on current page and show error
        setError(data.message || 'Failed to create account');
        setShowErrorModal(true);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error creating account:', error);
      // Network or other errors: Stay on current page and show error
      setError(error.message || 'Failed to create account. Please try again.');
      setShowErrorModal(true);
      setIsLoading(false);
    }
    // Note: setIsLoading(false) is only called for error cases
    // For success, the modal handles the flow and loading state remains until navigation
  };

  const handleCancel = () => {
    navigate('/login');
    setFormData({
      firstNameEnglish: '',
      lastNameEnglish: '',
      firstNameArabic: '',
      lastNameArabic: '',
      phoneNumber: '',
      nationalId: '',
      dateOfBirth: '',
      email: ''
    });
    setError('');
    setShowErrorModal(false);

    // Re-populate National ID if it exists in localStorage
    const storedOtp = localStorage.getItem('nafathOtpData');
    if (storedOtp) {
      try {
        const otpData = JSON.parse(storedOtp);
        if (otpData.nationalId) {
          setFormData(prev => ({
            ...prev,
            nationalId: otpData.nationalId
          }));
        }
      } catch (error) {
        console.error("Error parsing stored OTP data:", error);
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    navigate('/login');
  };

  const handleErrorModalClose = () => {
    setShowErrorModal(false);
    setError('');
  };

  return (
    <div className="CA-container">
      <h1 className="CA-title">Create an Account</h1>

      <form onSubmit={handleSubmit}>
        <div className="CAform-row">
          <div className="CAform-group">
            <label className="CAform-label">
              <span className="CArequired">*</span> First Name in Arabic
            </label>
            <input
              type="text"
              className="CAform-input"
              placeholder="Enter First Name in Arabic"
              id="firstNameArabic"
              value={formData.firstNameArabic}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="CAform-group">
            <label className="CAform-label">
              <span className="CArequired">*</span> Last Name in Arabic
            </label>
            <input
              type="text"
              className="CAform-input"
              placeholder="Enter Last Name in Arabic"
              id="lastNameArabic"
              value={formData.lastNameArabic}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="CAform-row">
          <div className="CAform-group">
            <label className="CAform-label">
              <span className="CArequired">*</span> First Name in English
            </label>
            <input
              type="text"
              className="CAform-input"
              placeholder="Enter First Name in English"
              id="firstNameEnglish"
              value={formData.firstNameEnglish}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="CAform-group">
            <label className="CAform-label">
              <span className="CArequired">*</span> Last Name in English
            </label>
            <input
              type="text"
              className="CAform-input"
              placeholder="Enter Last Name in English"
              id="lastNameEnglish"
              value={formData.lastNameEnglish}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="CAform-row">
          <div className="CAform-group">
            <label className="CAform-label">
              <span className="CArequired">*</span> Phone Number
            </label>
            <input
              type="tel"
              className="CAform-input"
              placeholder="05XXXXXXXX"
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              maxLength="10"
              required
            />
          </div>
          <div className="CAform-group">
            <label className="CAform-label">
              <span className="CArequired">*</span> National ID/ Iqama
            </label>
            <input
              type="text"
              className="CAform-input"
              placeholder="National ID/ Iqama"
              id="nationalId"
              value={formData.nationalId}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="CAform-row">
          <div className="CAform-group">
            <label className="CAform-label">
              <span className="CArequired">*</span> Date of Birth
            </label>
            <DatePicker
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              placeholder="MM/DD/YYYY"
              required
              id="dateOfBirth"
            />
          </div>
          <div className="CAform-group">
            <label className="CAform-label">
              <span className="CArequired">*</span> Email
            </label>
            <input
              type="email"
              className="CAform-input"
              placeholder="Example@Domain.com"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="CAterms-checkbox">
          <input
            type="checkbox"
            id="termsCheckbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="CAcheckbox-input"
          />
          <label htmlFor="termsCheckbox" className="CAcheckbox-label">
            I have read and accept the <span className="CAterms-link" onClick={() => setShowTermsModal(true)}>Terms and Conditions</span>
          </label>
        </div>

        <div className="CAbutton-row">
          <div className="CAbutton-wrapper">
            <button type="button" className="CAcancel-button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
          <div className="CAbutton-wrapper">
            <button type="submit" className="CAsignup-button" id="signupBtn" disabled={isLoading || !termsAccepted}>
              {isLoading && <span className="CAloading"></span>}
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </div>
        </div>

        <div className="CAlogin-link">
          Have an account? <Link to="/login">Login</Link>
        </div>
      </form>

      {/* Success Modal */}
      {showModal && (
        <div className="CAmodal-overlay">
          <div className="CAmodal-content">
            <div className="CAmodal-icon CAmodal-icon-success"></div>
            <h2 className="CAmodal-title">Account Created Successfully!</h2>
            <p className="CAmodal-message">
              Your account has been created successfully. You can now login with your credentials.
            </p>
            <button className="CAmodal-button" onClick={handleModalClose}>
              Go to Login
            </button>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="CAmodal-overlay">
          <div className="CAmodal-content">
            <div className="CAmodal-icon CAmodal-icon-error"></div>
            <h2 className="CAmodal-title CAmodal-title-error">Error</h2>
            <p className="CAmodal-message">
              {error}
            </p>
            <button className="CAmodal-button CAmodal-button-error" onClick={handleErrorModalClose}>
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Terms Modal */}
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={(accepted) => setTermsAccepted(accepted)}
        language={language}
        isChecked={termsAccepted}
      />

      {/* Captcha Modal - Recaptcha component has its own modal */}
      <Recaptcha
        key={`recaptcha-${showCaptchaModal}`}
        isOpen={showCaptchaModal}
        onClose={() => setShowCaptchaModal(false)}
        onSuccess={handleCaptchaSuccess}
        onError={(error) => {
          console.error('[CreateAccount] Captcha error:', error);
        }}
        title="Security Verification Required"
      />
    </div>
  );
};

export default CreateAccountEnglish;