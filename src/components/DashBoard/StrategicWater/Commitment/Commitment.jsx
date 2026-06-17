import React, { useState } from 'react';
// Import all necessary modal components
import SaveAsDraftModal from '../Asset/Asset Form/SaveAsDraftModal';
import ComplaintFeedbackForm from '@/pages/PublicPages/ComplaintEscalation/ReponseModal';
import ComplaintFeedbackFormArabic from '@/pages/PublicPages/ComplaintEscalation/ReponseModalArabic';

const Commitment = ({ language, onBack }) => {
  // State for the commitment checkbox
  const [isCommitted, setIsCommitted] = useState(false);
  // State to control the Save as Draft modal visibility
  const [showSaveAsDraftModal, setShowSaveAsDraftModal] = useState(false);
  // State to control the final Feedback modal visibility
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const translations = {
    en: {
      successMessage: 'Your Request Submitted Successfully: We will review your request and get back to you shortly.',
      title: 'Commitment',
      commitmentText: 'I declare that all information provided is true and accurate, and I bear full responsibility for the accuracy of this data.',
      back: 'Back',
      submit: 'Submit',
      saveAsDraft: 'Save as Draft',
      cancel: 'Cancel',
    },
    ar: {
      successMessage: 'تم إرسال طلبك بنجاح:',
      title: 'التزام',
      commitmentText: 'أقر بأن جميع المعلومات المقدمة صحيحة ودقيقة، وأتحمل المسؤولية الكاملة عن دقة هذه البيانات.',
      back: 'رجوع',
      submit: 'إرسال',
      saveAsDraft: 'حفظ كمسودة',
      cancel: 'إلغاء',
    },
  };

  const t = translations[language] || translations.en;

  const handleCheckboxChange = (e) => {
    setIsCommitted(e.target.checked);
  };

  const handleSubmit = () => {
    if (isCommitted) {
      // Final action: show the feedback modal
      setShowFeedbackModal(true);
      console.log('Final commitment submitted. Showing feedback form.');
    }
  };

  // --- Handlers for the Save as Draft functionality ---
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
      <div className="bg-white rounded-[6px] shadow-[0px_3px_12px_0px_rgba(47,43,61,0.14)] p-8">
        {/* Success Message */}
        <div className="p-4 mb-6 bg-green-50 border border-green-200 text-green-800 rounded-md font-medium">
          {t.successMessage}
        </div>

        <h2 className="text-[20px] font-bold text-[#161616] mb-8">{t.title}</h2>
        
        {/* Commitment Checkbox Section */}
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <label className="flex items-start cursor-pointer">
            <input 
              type="checkbox" 
              checked={isCommitted}
              onChange={handleCheckboxChange}
              className="h-5 w-5 mt-0.5 rounded border-gray-300 text-teal-600 focus:ring-teal-500 flex-shrink-0"
            />
            <span className={`mx-3 text-sm font-medium ${isCommitted ? 'text-gray-800' : 'text-gray-600'}`}>
              {t.commitmentText}
            </span>
          </label>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-200">
          <button 
            onClick={onBack} 
            disabled={showFeedbackModal} // Disable when feedback modal is open
            className="px-6 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              {t.back}
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={!isCommitted || showFeedbackModal} // Disable if not committed OR if feedback modal is open
            className={`px-6 py-2 text-white text-sm font-medium rounded-md transition-colors duration-200 ${
              isCommitted 
              ? 'bg-[#1B8354] hover:bg-[#146B43]' 
              : 'bg-gray-300 cursor-not-allowed'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
              {t.submit}
          </button>
          <button 
            onClick={handleSaveAsDraft} 
            disabled={showFeedbackModal} // Disable when feedback modal is open
            className="px-4 py-2 text-sm text-gray-600 hover:text-black hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
              {t.saveAsDraft}
          </button>
          <button 
            onClick={handleCancel}
            disabled={showFeedbackModal} // Disable when feedback modal is open
            className="px-4 py-2 text-sm text-gray-600 hover:text-black hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
              {t.cancel}
          </button>
        </div>
      </div>
      
      {/* Save as Draft Modal */}
      <SaveAsDraftModal
        isOpen={showSaveAsDraftModal}
        onClose={() => setShowSaveAsDraftModal(false)}
        onSave={handleSaveConfirm}
        language={language}
      />
      
      {/* Conditionally render the correct final feedback modal */}
      {showFeedbackModal && (
        language === 'ar' 
          ? <ComplaintFeedbackFormArabic isOpen={showFeedbackModal} onClose={() => setShowFeedbackModal(false)} />
          : <ComplaintFeedbackForm isOpen={showFeedbackModal} onClose={() => setShowFeedbackModal(false)} />
      )}
    </>
  );
};

export default Commitment;