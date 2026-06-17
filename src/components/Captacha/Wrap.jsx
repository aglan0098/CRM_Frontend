import { useState } from 'react';
import Recaptcha from './Recaptcha';

export default function RecaptchaView() {
  const [showRecaptcha, setShowRecaptcha] = useState(true); // Changed from false to true

  // ✅ Handle success with proper error handling
  const handleSuccess = (data) => {
    try {
      console.log('✅ reCAPTCHA Success!', data);
      // Add any success logic here (e.g., proceed with form submission)
    } catch (error) {
      console.error('Error in success handler:', error);
    }
  };

  // ✅ Handle error with proper error handling to prevent unhandled promise rejections
  const handleError = (error) => {
    try {
      console.error('❌ reCAPTCHA Error!', error);
      // Add any error handling logic here (e.g., show user-friendly message)
    } catch (err) {
      console.error('Error in error handler:', err);
    }
  };

  return (
    <>
      <Recaptcha
        isOpen={showRecaptcha}
        onClose={() => setShowRecaptcha(false)}
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </>
  );
}