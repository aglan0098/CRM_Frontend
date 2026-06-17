import React, { useState } from 'react';

const ModificationReq = ({ language = 'en' }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const translations = {
    en: {
      title: 'Your application was returned for updates.',
      description: 'Please check the required changes and resubmit your application.',
      modificationRequired: 'Modification Required',
      accordionText: 'The accordion component delivers large amounts of content in a small space through progressive disclosure. The user gets key details about the underlying content and can choose to expand that content within the constraints of the accordion.',
      seeMore: 'See More',
      seeLess: 'See Less'
    },
    ar: {
      title: 'تم إرجاع طلبك للتحديث.',
      description: 'يرجى مراجعة التغييرات المطلوبة وإعادة تقديم طلبك.',
      modificationRequired: 'تعديل مطلوب',
      accordionText: 'يقدم مكون الأكورديون كميات كبيرة من المحتوى في مساحة صغيرة من خلال الكشف التدريجي. يحصل المستخدم على التفاصيل الرئيسية حول المحتوى الأساسي ويمكنه اختيار توسيع هذا المحتوى ضمن قيود الأكورديون.',
      seeMore: 'شاهد المزيد',
      seeLess: 'أظهر أقل'
    }
  };

  const t = translations[language] || translations.en;
  const fontClass = "font-['IBM_Plex_Sans_Arabic']";

  if (!isVisible) return null;

  return (
    <div className="border-l-4 border-[#FF8C00] bg-white">
      {/* Main notification bar */}
      <div className="bg-[#FFF4E6] p-4 flex items-start justify-between">
        <div className="flex items-start gap-3">
          {/* Warning icon */}
          <div className="w-5 h-5 mt-0.5">
            <svg viewBox="0 0 20 20" fill="currentColor" className="text-[#FF8C00]">
              <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-[14px] font-medium text-[#B45309]">
              <span className="font-semibold">{t.title}</span> {t.description}
            </p>
          </div>
        </div>
        {/* Close button */}
        <button 
          onClick={() => setIsVisible(false)}
          className="text-[#B45309] hover:text-[#92400E] text-lg font-bold leading-none"
        >
          ×
        </button>
      </div>

      {/* Orange horizontal line */}
      <div className="h-px bg-[#FF8C00]"></div>

      {/* Expandable section */}
      <div className="p-4 bg-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-[16px] font-semibold text-[#161616] mb-3">
              {t.modificationRequired}
            </h3>
            <p className="text-[14px] text-[#6C737F] leading-relaxed mb-4">
              {isExpanded ? t.accordionText : `${t.accordionText.substring(0, 120)}...`}
            </p>
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[14px] text-[#3B82F6] font-medium hover:text-[#2563EB] transition-colors"
            >
              {isExpanded ? t.seeLess : t.seeMore}
            </button>
          </div>
          {/* Close button - positioned at far right */}
          <button 
            onClick={() => setIsVisible(false)}
            className="text-[#6C737F] hover:text-[#374151] text-lg font-bold leading-none ml-4"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModificationReq;