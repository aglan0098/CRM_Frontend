import React from 'react';
import Warning from '../RR Asset Form/Warning.png';

const RR_RemoveAssetModal = ({ isOpen, onClose, onConfirm, assetNumber, language = 'en' }) => {
  const translations = {
    en: {
      title: 'Remove Asset?',
      message: 'Are you sure you want to remove Asset Number {number}? This action cannot be undone.',
      cancel: 'Cancel',
      removeAsset: 'Remove Asset',
    },
    ar: {
      title: 'إزالة الأصل؟',
      message: 'هل أنت متأكد من أنك تريد إزالة رقم الأصل {number}؟ لا يمكن التراجع عن هذا الإجراء.',
      cancel: 'إلغاء',
      removeAsset: 'إزالة الأصل',
    },
  };

  const t = translations[language] || translations.en;
  const fontClass = "font-['IBM_Plex_Sans_Arabic']";
  const isRTL = language === 'ar';

  if (!isOpen) return null;

  const getMessage = () => {
    const formattedNumber = String(assetNumber || '02').padStart(2, '0');
    return t.message.replace('{number}', formattedNumber);
  };

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
              <img src={Warning} alt="Warning" className="w-6 h-6" />
            </div>
            <h3 className="text-[18px] font-medium text-[#161616] leading-tight">
              {t.title}
            </h3>
          </div>

          {/* Message */}
          <p className="text-[14px] text-[#6C737F] leading-relaxed mb-6">
            {getMessage()}
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
              onClick={onConfirm}
              className="px-4 py-2 bg-[#DC2626] text-white text-[14px] font-medium rounded-md hover:bg-[#B91C1C] transition-colors"
            >
              {t.removeAsset}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RR_RemoveAssetModal;