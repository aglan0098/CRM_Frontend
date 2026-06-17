import React, { useState, forwardRef, useImperativeHandle } from 'react';

const Declaration = forwardRef(({ language, onDeclarationChange }, ref) => {
  const [isDeclared, setIsDeclared] = useState(false);

  const translations = {
    en: {
      title: 'Declaration',
      commitmentText: 'I declare that all information provided is true and accurate, and I bear full responsibility for the accuracy of this data.',
    },
    ar: {
      title: 'الإقرار',
      commitmentText: 'أقر بأن جميع المعلومات المقدمة صحيحة ودقيقة، وأتحمل المسؤولية الكاملة عن دقة هذه البيانات.',
    },
  };
  
  const t = translations[language] || translations.en;
  const isRTL = language === 'ar';

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setIsDeclared(isChecked);
    if (onDeclarationChange) {
      onDeclarationChange(isChecked);
    }
  };
  
  const validate = () => {
    return isDeclared;
  };
  
  const getData = () => {
    return {
      declaration: {
        isDeclared: isDeclared,
        timestamp: new Date().toISOString()
      }
    };
  };

  useImperativeHandle(ref, () => ({
    validate,
    getData
  }));

  return (
    <>
      <div className={`bg-white rounded-[6px] shadow-[0px_3px_12px_0px_rgba(47,43,61,0.14)] p-8`}>
        <h2 className="text-[20px] font-bold text-[#161616] mb-8" dir={isRTL ? 'rtl' : 'ltr'}>{t.title}</h2>
        
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
           <label className="flex items-start cursor-pointer">
             <input 
               type="checkbox" 
               checked={isDeclared}
               onChange={handleCheckboxChange}
               className="h-5 w-5 mt-0.5 rounded border-gray-300 text-teal-600 focus:ring-teal-500 flex-shrink-0"
             />
             <span className={`mx-3 text-sm font-medium ${isDeclared ? 'text-gray-800' : 'text-gray-600'}`}>
               {t.commitmentText}
             </span>
           </label>
        </div>
      </div>
    </>
  );
});

export default Declaration;