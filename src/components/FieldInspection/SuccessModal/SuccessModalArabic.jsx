import React from 'react';
import './SuccessModal.css';

const SuccessModalArabic = ({ language = 'ar', onLanguageChange, isOpen, onClose }) => {
  const handleClose = () => {
    onClose();
    // Refresh the browser after closing the modal
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };
  if (!isOpen) return null;
  
  return (
    <div 
      className={`fi-modal-overlay ${isOpen ? 'show' : ''}`} 
      id="successModal" 
      onClick={onClose}
      style={{ display: isOpen ? 'flex' : 'none' }}
    >
      <div className="fi-modal fi-rtl" onClick={(e) => e.stopPropagation()}>
        <div className="fi-modal-header">
          <div className="fi-success-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" fill="none">
              <path d="M21.8411 0.5C24.0856 0.500017 26.2525 0.844359 28.2903 1.48438C29.0806 1.73261 29.52 2.57487 29.2717 3.36523C29.0234 4.15529 28.182 4.59461 27.3918 4.34668C25.6416 3.79696 23.7772 3.50002 21.8411 3.5C11.6238 3.5 3.34106 11.7827 3.34106 22C3.3411 32.2172 11.6238 40.5 21.8411 40.5C32.0582 40.4999 40.341 32.2172 40.3411 22C40.3411 20.0638 40.0441 18.1995 39.4944 16.4492C39.2462 15.6589 39.6856 14.8176 40.4758 14.5693C41.2662 14.3211 42.1085 14.7604 42.3567 15.5508C42.9967 17.5885 43.3411 19.7555 43.3411 22C43.341 33.874 33.7151 43.4999 21.8411 43.5C9.96696 43.5 0.341102 33.8741 0.341064 22C0.341064 10.1259 9.96694 0.5 21.8411 0.5ZM38.7268 2.99609C39.281 2.3806 40.2293 2.33065 40.845 2.88477C41.4606 3.43892 41.5103 4.38719 40.9563 5.00293L22.9553 25.0029C22.68 25.3087 22.2915 25.4882 21.8801 25.499C21.4689 25.5098 21.0714 25.3513 20.7805 25.0605L13.7805 18.0605C13.1947 17.4748 13.1948 16.5252 13.7805 15.9395C14.3663 15.3537 15.3158 15.3537 15.9016 15.9395L21.7834 21.8213L38.7268 2.99609Z" fill="#067647"/>
            </svg>
          </div>
          <button className="fi-modal-close" onClick={handleClose} aria-label="Close">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M6 6L18 18M6 18L18 6" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
    </svg>
  </button>
        </div>
        
        <div className="fi-modal-content">
          <h2>تم إرسال الفحص الميداني بنجاح!</h2>
          <p>شكرًا لك! تم تسجيل ردك على الفحص، وتم تحديث حالة المهمة في النظام.</p>
        </div>
        
        <div className="fi-modal-footer">
          <button className="fi-btn" onClick={handleClose}>إغلاق</button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModalArabic;