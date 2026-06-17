import React from 'react';
import TemporaryDataStorage from '../Asset Form/TemporaryDataStorage.png';

const SaveAsDraftModal = ({ isOpen, onClose, onSave, language = 'en' }) => {
  const translations = {
    en: {
      title: 'Temporary Data Storage',
      message: 'Your information will be stored in the system for a maximum of 5 days. After this period, it will be automatically deleted.',
      cancel: 'Cancel',
      saveAsDraft: 'Save as Draft',
    },
    ar: {
      title: 'تخزين البيانات المؤقت',
      message: 'سيتم تخزين معلوماتك في النظام لمدة أقصاها 5 أيام. بعد هذه الفترة، سيتم حذفها تلقائياً.',
      cancel: 'إلغاء',
      saveAsDraft: 'حفظ كمسودة',
    },
  };

  const t = translations[language] || translations.en;
  const fontClass = "font-['IBM_Plex_Sans_Arabic']";
  const isRTL = language === 'ar';

  if (!isOpen) return null;

 
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4 ${fontClass}`}>
        <div className="p-6">
          {/* Close Button */}
          <button
            onClick={onClose}
            className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} text-gray-400 hover:text-gray-600 transition-colors`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Warning Icon and Title */}
          <div className="mb-4">
            <div className="flex items-center justify-start mb-3">
              <img src={TemporaryDataStorage} alt="TemporaryDataStorage" className="w-6 h-6" />
            </div>
            <h3 className="text-[18px] font-medium text-[#161616] leading-tight">
              {t.title}
            </h3>
          </div>

          {/* Message */}
          <p className="text-[14px] text-[#6C737F] leading-relaxed mb-6">
            {t.message}
          </p>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-[14px] font-medium text-[#6C737F] hover:text-[#161616] transition-colors"
            >
              {t.cancel}
            </button>
            <button
              onClick={onSave}
              className="px-4 py-2 bg-[#1B8354] text-white text-[14px] font-medium rounded-md hover:bg-[#146B43] transition-colors"
            >
              {t.saveAsDraft}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveAsDraftModal;