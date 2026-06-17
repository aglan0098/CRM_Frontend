// components/SurveyModal/SurveyModalArabic.js
import React from 'react';
import SurveyExpiredArabic from '../Expiry/ExpiryArabic';// Your Arabic expired component
import SurveyCompletedArabic from '../Responded/ResponseArabic'; // Your Arabic responded component
import './SurveyModalArabic'; // Import the CSS file with RTL styles

const SurveyModalArabic = ({ isOpen, status, message, onClose }) => {
  if (!isOpen) return null;

  // Use your custom Arabic components based on status
  if (status === 'expired') {
    return <SurveyExpiredArabic/>;
  }
  
  if (status === 'already_responded') {
    return <SurveyCompletedArabic />;
  }

  // For other error statuses, display Arabic error messages
  if (status === 'not_found' || status === 'error') {
    return (
      <div className="modal-overlay">
        <div className="modal-content modal-content-rtl">
          <div className="modal-header modal-header-rtl">
            <div className="modal-icon">⚠️</div>
            <h2 className="modal-title modal-title-rtl">خطأ</h2>
          </div>
          <div className="modal-body modal-body-rtl">
            <p className="modal-message modal-message-rtl">
              {getArabicErrorMessage(status, message)}
            </p>
          </div>
          <div className="modal-footer modal-footer-rtl">
            <button className="modal-button modal-button-rtl" onClick={onClose}>
              إغلاق
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

// Helper function to get Arabic error messages
const getArabicErrorMessage = (status, originalMessage) => {
  switch (status) {
    case 'not_found':
      return 'الاستطلاع غير موجود أو غير متاح.';
    case 'error':
      return 'حدث خطأ أثناء تحميل الاستطلاع. يرجى المحاولة مرة أخرى.';
    default:
      return originalMessage || 'حدث خطأ غير متوقع.';
  }
};

export default SurveyModalArabic;