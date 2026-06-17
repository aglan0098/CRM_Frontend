import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Nafath.css';
import useNafathAPI from './Nafathapicall';
import { Link } from 'react-router-dom';

const NafathEnglish = ({ language = 'en', onLanguageChange }) => {
  const [nationalId, setNationalId] = useState('');
  const [validationError, setValidationError] = useState('');
  const navigate = useNavigate();

  // Use the API hook
  const { loading, error, data, verifyNationalId, resetState } = useNafathAPI();

  const validateNationalId = (value) => {
    // Remove any non-digit characters
    const cleanValue = value.replace(/\D/g, '');

    if (cleanValue.length === 0) {
      setValidationError('');
      return true;
    }

    if (cleanValue.length !== 10) {
      setValidationError('National ID must be exactly 10 digits');
      return false;
    }

    if (!cleanValue.startsWith('1') && !cleanValue.startsWith('2')) {
      setValidationError('National ID must start with 1 or 2');
      return false;
    }

    setValidationError('');
    return true;
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    // Only allow digits and limit to 10 characters
    const cleanValue = value.replace(/\D/g, '').slice(0, 10);
    setNationalId(cleanValue);
    validateNationalId(cleanValue);

    // Reset API state when input changes
    if (error || data) {
      resetState();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      nationalId.trim().length === 10 &&
      (nationalId.startsWith('1') || nationalId.startsWith('2'))
    ) {
      try {
        // Call the API
        const result = await verifyNationalId(nationalId);

        // Handle successful response
        console.log('API Response:', result);
        console.log('Current language from props:', language);

        // Handle response based on your API structure
        if (result.success && result.isSuccess !== false) {
          // Store only sessionToken and OTP for OTP verification (secure)
          const otpData = {
            sessionToken: result.sessionToken,  // ✅ Secure token
            randomNumber: result.random,        // ✅ OTP for display
            timestamp: Date.now(),
          };

          // Store nationalId separately for resend functionality
          localStorage.setItem('nafathNationalId', nationalId);

          // Store in localStorage for OTP component to access
          localStorage.setItem('nafathOtpData', JSON.stringify(otpData));

          // Console log for debugging
          console.log('OTP Data stored (secure):', { sessionToken: result.sessionToken, random: result.random });

          // Navigate to OTP verification page
          navigate('/nafath-otp');
        }
      } catch (err) {
        console.error('Authentication error:', err);
        // Error is already handled and displayed by the hook
      }
    }
  };

  const isButtonEnabled =
    nationalId.trim().length === 10 &&
    (nationalId.startsWith('1') || nationalId.startsWith('2')) &&
    !validationError &&
    !loading; // Disable button during loading

  return (
    <div className="Nafath-container">
      <h1 className="Nafath-title">Identity Verification</h1>
      <p className="Nafath-subtitle">For Saudi citizens or residents with Saudi residency</p>

      {/* FIXED: Changed div to form and added proper onSubmit */}
      <form onSubmit={handleSubmit}>
        <div className="Nafathform-group">
          <label className="Nafathform-label">
            <span className="Nafathrequired">*</span> National ID / Iqama
          </label>
          <input
            type="tel"
            className={`Nafathform-input ${validationError || error ? 'error' : ''}`}
            placeholder="National ID / Iqama"
            value={nationalId}
            onChange={handleInputChange}
            maxLength="10"
            required
            disabled={loading}
          />
          {validationError && <div className="Nafathvalidation-error">{validationError}</div>}
          {error && <div className="Nafathvalidation-error">{error}</div>}
        </div>

        {/* FIXED: Changed type to "submit" for proper form submission */}
        <button
          type="submit"
          className={`Nafathlogin-button ${isButtonEnabled ? 'enabled' : 'disabled'}`}
          disabled={!isButtonEnabled}
        >
          {loading ? 'Authenticating...' : 'Authenticate'}
        </button>

        <div className="Nafathsignup-link">
          Have an account?{' '}
          <Link to="/login" className="Nafathsignup-link-a">
            Login
          </Link>
        </div>
      </form>

      {/* Debug info - remove in production */}
      {/* <div
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          color: 'white',
          fontSize: '12px',
          background: 'rgba(0,0,0,0.5)',
          padding: '5px',
          borderRadius: '3px',
        }}
      >
        Current Language: {language}
      </div> */}
    </div>
  );
};

export default NafathEnglish;
