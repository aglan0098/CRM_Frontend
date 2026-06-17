import React, { useState } from 'react';
import SaveAsDraftModal from '../RR Asset/RR Asset Form/RR_SaveAsDraftModal';

const RR_Declaration = ({ language, currentStep, setCurrentStep, onDeclareSubmit }) => {
  // State to manage the checkbox checked status
  const [isDeclared, setIsDeclared] = useState(false);
  // State for the "Save as Draft" modal
  const [showSaveAsDraftModal, setShowSaveAsDraftModal] = useState(false);

  const translations = {
    en: {
      title: 'Declaration',
      commitmentText: 'I declare that all information provided is true and accurate, and I bear full responsibility for the accuracy of this data.',
      back: 'Back',
      submit: 'Submit',
      saveAsDraft: 'Save as Draft',
      cancel: 'Cancel',
    },
    ar: {
      title: 'الإقرار',
      commitmentText: 'أقر بأن جميع المعلومات المقدمة صحيحة ودقيقة، وأتحمل المسؤولية الكاملة عن دقة هذه البيانات.',
      back: 'رجوع',
      submit: 'إرسال',
      saveAsDraft: 'حفظ كمسودة',
      cancel: 'إلغاء',
    },
  };
  
  const t = translations[language] || translations.en;
  const isRTL = language === 'ar';

  const handleCheckboxChange = (e) => {
    setIsDeclared(e.target.checked);
  };

  const handleBack = () => setCurrentStep(currentStep - 1);

  const handleSubmit = () => {
    if (isDeclared) {
      // Calls the function from the parent (TopDesign.jsx) to show the Commitment screen
      onDeclareSubmit();
    }
  };
  
  const handleSaveAsDraft = () => setShowSaveAsDraftModal(true);
  
  const handleSaveConfirm = () => {
    console.log("Draft saved!");
    setShowSaveAsDraftModal(false);
  };
  
  const handleCancel = () => {
    console.log('Cancel clicked');
  };

  return (
    <>
      <div className={`bg-white rounded-[6px] shadow-[0px_3px_12px_0px_rgba(47,43,61,0.14)] p-8`}>
        <h2 className="text-[20px] font-bold text-[#161616] mb-8" dir={isRTL ? 'rtl' : 'ltr'}>{t.title}</h2>
        
        {/* Declaration Checkbox Section */}
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

        {/* Navigation Buttons */}
        <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-200">
            <button onClick={handleBack} className="px-6 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50">
                {t.back}
            </button>
            {/* Submit button is conditionally styled and disabled */}
            <button 
              onClick={handleSubmit} 
              disabled={!isDeclared}
              className={`px-6 py-2 text-white text-sm font-medium rounded-md transition-colors duration-200 ${
                isDeclared 
                ? 'bg-[#1B8354] hover:bg-[#146B43]' 
                : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
                {t.submit}
            </button>
            <button onClick={handleSaveAsDraft} className="px-4 py-2 text-sm text-gray-600 hover:text-black hover:bg-gray-100 rounded-md">
                {t.saveAsDraft}
            </button>
            <button onClick={handleCancel} className="px-4 py-2 text-sm text-gray-600 hover:text-black hover:bg-gray-100 rounded-md">
                {t.cancel}
            </button>
        </div>
      </div>
      
      <SaveAsDraftModal
        isOpen={showSaveAsDraftModal}
        onClose={() => setShowSaveAsDraftModal(false)}
        onSave={handleSaveConfirm}
        language={language}
      />
    </>
  );
};

export default RR_Declaration;