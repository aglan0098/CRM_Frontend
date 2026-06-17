// src/MyRequests/StrategicWaterStorageRequest/ApplicationDetails.jsx

import React from 'react';
import { FaEye, FaDownload, FaRegFilePdf } from 'react-icons/fa';

const translations = {
  en: {
    appDetails: 'Application Details Testing',
    appNumber: 'Application Number',
    requestType: 'Request Type',
    activityType: 'Activity Type',
    submissionDate: 'Submission Date',
    license: 'License',
    permit: 'Permit for Production of Purified Water',
    issued: 'Issued',
  },
  ar: {
    appDetails: 'تفاصيل الطلب',
    appNumber: 'رقم الطلب',
    requestType: 'نوع الطلب',
    activityType: 'نوع النشاط',
    submissionDate: 'تاريخ التقديم',
    license: 'الرخصة',
    permit: 'تصريح إنتاج مياه نقية',
    issued: 'صدر',
  },
};

const AI_ApplicationDetails = ({ language }) => {
  const t = translations[language];

  return (
    <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">{t.appDetails}</h2>
        {/* --- THIS IS THE CORRECTED PART --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">{t.appNumber}</label>
                <p className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md w-full">3432435</p>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">{t.requestType}</label>
                <p className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md w-full">Licensing Renewal</p>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">{t.activityType}</label>
                <p className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md w-full">Strategic Water Storage</p>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">{t.submissionDate}</label>
                <p className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md w-full">27-05-2025</p>
            </div>
        </div>
        {/* ---------------------------------- */}

        
    </div>
  );
};

export default AI_ApplicationDetails;