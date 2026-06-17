import React from 'react';

const RR_SaveAsDraftModal = ({ isOpen, onClose, onSave, language }) => {
  if (!isOpen) return null;

  const t = language === 'ar' ? 
    { title: 'حفظ كمسودة', message: 'هل أنت متأكد أنك تريد حفظ طلبك كمسودة؟', cancel: 'إلغاء', confirm: 'تأكيد الحفظ' } : 
    { title: 'Save as Draft', message: 'Are you sure you want to save your application as a draft?', cancel: 'Cancel', confirm: 'Confirm Save' };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">{t.title}</h2>
        <p className="mb-6">{t.message}</p>
        <div className="flex justify-end gap-4">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md">{t.cancel}</button>
          <button onClick={onSave} className="px-4 py-2 bg-[#1B8354] text-white rounded-md">{t.confirm}</button>
        </div>
      </div>
    </div>
  );
};

export default RR_SaveAsDraftModal;