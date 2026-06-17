import React, { useState } from 'react';
import './Phone.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { 
  authenticateUser, 
  validatePhoneNumber, 
  formatPhoneNumber,
  sendSMS
} from '../Firestore_SMS_CRMAuth/APIs';

const PhoneLoginPageEnglish = ({ language = 'en', onLanguageChange }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handlePhoneChange = (e) => {
    const formattedPhone = formatPhoneNumber(e.target.value, phoneNumber);
    setPhoneNumber(formattedPhone);
    setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clean phone number for validation
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    if (!validatePhoneNumber(cleanPhone)) {
      setError('Please enter a valid phone number starting with 05 and containing exactly 10 digits');
      return;
    }

    setLoading(true);
    setError('');
    
    console.log('Phone number submitted:', cleanPhone);
    console.log('Current language from props:', language);

    try {
      // ✅ SECURITY ENHANCED: Step 1 - Authenticate user (backend stores data and generates OTP)
      const authData = await authenticateUser(cleanPhone);

      // ✅ SECURITY: Only proceed if success is explicitly true
      if (authData.success !== true) {
        // ✅ SECURITY: If success is false, ignore ALL data including sessionId
        if (authData.sessionId) {
          console.warn('⚠️ SECURITY WARNING: Response has sessionId but success is false. Ignoring sessionId.');
        }
        setError('Account not found! Create Account first');
        return;
      }

      // ✅ SECURITY: Only use sessionId if success is explicitly true
      if (!authData.sessionId) {
        setError('Session ID not found in response. Please try again.');
        return;
      }

      // ✅ Backend now returns only sessionId (userId hidden)
      const sessionId = authData.sessionId;
      console.log('✅ Authentication successful, sessionId received:', sessionId);

      // ✅ SECURITY ENHANCED: Step 2 - Send SMS (backend looks up userId from session)
      const smsResult = await sendSMS(sessionId);

      if (!smsResult.success) {
        setError('Failed to send OTP. Please try again.');
        return;
      }

      // ✅ Step 3: Success - navigate to OTP page with sessionId
      console.log('✅ SMS sent successfully');
      navigate('/phone-otp', { 
        state: { 
          sessionId: sessionId,
          phoneNumber: cleanPhone 
        } 
      });

    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNafathClick = () => {
    navigate('/login-nafath');
  };

  return (
    <div className="Phone-container">
      <h1 className="Phone-title">Login</h1>
      <p className="Phone-subtitle">Welcome back! Please enter your phone number to log in.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="Phoneform-group">
          <label className="Phoneform-label">
            <span className="Phonerequired">*</span> Phone Number
          </label>
          <input 
            type="tel" 
            className="Phoneform-input" 
            placeholder="05X XXX XXXX"
            value={phoneNumber}
            onChange={handlePhoneChange}
            maxLength="12"
            disabled={loading}
            required
          />
          {error && (
            <div style={{ 
              color: 'red', 
              fontSize: '14px', 
              marginTop: '5px' 
            }}>
              {error}
            </div>
          )}
        </div>

        <button 
          type="submit" 
          className="Phonelogin-button"
          disabled={loading || !phoneNumber.trim()}
        >
          {loading ? 'Sending OTP...' : 'Log in'}
        </button>

        <button 
          type="button" 
          className="Phonenafath-button" 
          onClick={handleNafathClick}
          disabled={loading}
        >
          Login via Nafath
        </button>

        <div className="Phonesignup-link">
          Don't have an account? <Link to="/CreateAccount">Create new account</Link>
        </div>
      </form>

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
    </div>
  );
};

export default PhoneLoginPageEnglish;