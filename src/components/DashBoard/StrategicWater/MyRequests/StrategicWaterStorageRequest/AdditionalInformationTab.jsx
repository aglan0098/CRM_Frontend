// src/MyRequests/StrategicWaterStorageRequest/AdditionalInformationTab.jsx

import React, { useState } from 'react';
import { FaChevronUp, FaChevronDown, FaEye } from 'react-icons/fa';
import { VscPassFilled } from "react-icons/vsc";

const translations = {
  en: {
    noInfoNeeded: 'No additional information is needed',
    appreciateTime: 'We appreciate your time!',
    previousResponses: 'Previous Responses',
    requestLabel: 'Additional Information Request: Water Bill and National ID',
    responsePlaceholder: 'The accordion component delivers large amounts of content in a small space through progressive disclosure. The user gets key details about the underlying content and can choose to expand that content within the constraints of the accordion.',
    inProgress: 'In Progress',
  },
  ar: {
    noInfoNeeded: 'لا توجد معلومات إضافية مطلوبة',
    appreciateTime: 'نقدر وقتكم!',
    previousResponses: 'الردود السابقة',
    requestLabel: 'طلب معلومات إضافية: فاتورة المياه والهوية الوطنية',
    responsePlaceholder: 'يقدم مكون الأكورديون كميات كبيرة من المحتوى في مساحة صغيرة من خلال الإفصاح التدريجي. يحصل المستخدم على التفاصيل الرئيسية حول المحتوى الأساسي ويمكنه اختيار توسيع هذا المحتوى ضمن قيود الأكورديون.',
    inProgress: 'قيد التنفيذ',
  },
};

const AdditionalInformationTab = ({ language, hasRequests }) => {
  const t = translations[language];
  const [isExpanded, setIsExpanded] = useState(true);

  if (!hasRequests) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-16 min-h-[300px]">
        <div className="p-4 rounded-full bg-green-100 text-green-600 mb-4">
            <VscPassFilled size={48} />
        </div>
        <h3 className="text-xl font-semibold text-gray-800">{t.noInfoNeeded}</h3>
        <p className="text-gray-500">{t.appreciateTime}</p>
      </div>
    );
  }

  // This renders the view from Preview-SWS-Additionalinfo.png
  return (
    <div className="min-h-[300px]">
        <h3 className="text-lg font-bold text-gray-800 mb-4">{t.previousResponses}</h3>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div 
                className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer hover:bg-gray-100" 
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3 font-semibold text-gray-700">
                    {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                    <span>{t.requestLabel}</span>
                </div>
                <span className="text-sm font-medium bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">{t.inProgress}</span>
            </div>
            {isExpanded && (
            <div className="p-4 border-t border-gray-200">
                <div className="flex justify-end items-center mb-4">
                    <span className="text-sm text-gray-500">29-04-2025</span>
                </div>
                <textarea
                    className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-600 focus:outline-none"
                    rows="4"
                    value={t.responsePlaceholder}
                    readOnly
                />
                <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md bg-white">
                        <span className="text-sm font-medium text-gray-800">WaterBill.PDF</span>
                        <button className="text-gray-500 hover:text-blue-600 transition-colors"><FaEye /></button>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md bg-white">
                        <span className="text-sm font-medium text-gray-800">National ID.PDF</span>
                        <button className="text-gray-500 hover:text-blue-600 transition-colors"><FaEye /></button>
                    </div>
                </div>
            </div>
            )}
        </div>
    </div>
  );
};

export default AdditionalInformationTab;