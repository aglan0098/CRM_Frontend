import React, { useState } from 'react';
import './PhoneArabic.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { 
  authenticateUser, 
  validatePhoneNumber, 
  formatPhoneNumber,
  sendSMS
} from '../Firestore_SMS_CRMAuth/APIs';

const PhoneLoginPageArabic = ({ language = 'ar', onLanguageChange }) => {
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
      setError('يرجى إدخال رقم هاتف صحيح يبدأ بـ 05 ويحتوي على 10 أرقام بالضبط');
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
        setError('الحساب غير موجود! يرجى إنشاء حساب أولاً');
        return;
      }

      // ✅ SECURITY: Only use sessionId if success is explicitly true
      if (!authData.sessionId) {
        setError('معرف الجلسة غير موجود في الاستجابة. يرجى المحاولة مرة أخرى.');
        return;
      }

      // ✅ Backend now returns only sessionId (userId hidden)
      const sessionId = authData.sessionId;
      console.log('✅ Authentication successful, sessionId received:', sessionId);

      // ✅ SECURITY ENHANCED: Step 2 - Send SMS (backend looks up userId from session)
      const smsResult = await sendSMS(sessionId);

      if (!smsResult.success) {
        setError('فشل في إرسال رمز التحقق. يرجى المحاولة مرة أخرى.');
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
      setError(error.message || 'خطأ في الشبكة. يرجى التحقق من اتصالك والمحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const handleNafathClick = () => {
    navigate('/login-nafath');
  };

  return (
    <div className="Phone-containerAr Phone-container-rtlAr">
      <h1 className="Phone-titleAr">تسجيل الدخول</h1>
      <p className="Phone-subtitleAr">مرحباً بعودتك! يرجى إدخال رقم هاتفك لتسجيل الدخول.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="Phoneform-groupAr">
          <label className="Phoneform-labelAr">
            رقم الهاتف <span className="PhonerequiredAr">*</span>
          </label>
          <input 
            type="tel" 
            className="Phoneform-inputAr" 
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
              marginTop: '5px',
              textAlign: 'right',
              direction: 'rtl'
            }}>
              {error}
            </div>
          )}
        </div>

        <button 
          type="submit" 
          className="Phonelogin-buttonAr"
          disabled={loading || !phoneNumber.trim()}
        >
          {loading ? 'جاري إرسال رمز التحقق...' : 'تسجيل الدخول'}
        </button>

        <button 
          type="button" 
          className="Phonenafath-buttonAr" 
          onClick={handleNafathClick}
          disabled={loading}
        >
          تسجيل الدخول عبر نفاذ
        </button>

        <div className="Phonesignup-linkAr">
          ليس لديك حساب؟ <Link to="/CreateAccount">إنشاء حساب جديد</Link>
        </div>
      </form>

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
        اللغة الحالية: {language}
      </div> */}
    </div>
  );
};

export default PhoneLoginPageArabic;