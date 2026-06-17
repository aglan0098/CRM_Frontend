// src/MyRequests/StrategicWaterStorageRequest/ApplicationDetails.jsx

import React from 'react';
import { FaEye, FaDownload, FaRegFilePdf } from 'react-icons/fa';

const translations = {
  en: {
    appDetails: 'Application Details',
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

const ApplicationDetails = ({ language }) => {
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

        <h2 className="text-xl font-bold text-gray-800 mb-4 mt-8">{t.license}</h2>
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white">
            <div className="flex items-center gap-4">
                <FaRegFilePdf className="w-6 h-6 text-red-500" />
                <div className="flex flex-col">
                    <span className="font-semibold text-gray-800">{t.permit}</span>
                    <span className="text-sm text-gray-500">27-05-2025</span>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-green-600 font-semibold text-sm px-3 py-1 bg-green-50 rounded-full">{t.issued}</span>
                <button className="text-gray-500 hover:text-blue-600 transition-colors text-lg"><FaEye /></button>
                <button className="w-8 h-8 flex items-center justify-center bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                    <FaDownload />
                </button>
            </div>
        </div>
    </div>
  );
};

export default ApplicationDetails;