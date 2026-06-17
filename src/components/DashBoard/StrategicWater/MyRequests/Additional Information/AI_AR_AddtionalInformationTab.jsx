// src/MyRequests/StrategicWaterStorageRequest/AdditionalInformationTab.jsx

import React, { useState, useEffect } from 'react';
import { FaChevronUp, FaChevronDown, FaEye } from 'react-icons/fa';
import { VscPassFilled } from "react-icons/vsc";

const translations = {
  en: {
    noInfoNeeded: 'No additional information is needed',
    appreciateTime: 'We appreciate your time!',
    previousResponses: 'Previous Responses',
    requestLabel: 'Additional Information Request: Water Bill and National ID',
    responsePlaceholder: '"The accordion component delivers large amounts of content in a small space through progressive disclosure. The user gets key details about the underlying content and can choose to expand that content within the constraints of the accordion."\n\n"The accordion component delivers large amounts of content in a small space through progressive disclosure. The user gets key details about the underlying content and can choose to expand that content within the constraints of the accordion."',
    inProgress: 'In Progress',
    additionalInfoRequest: 'Additional Information Request: Water Bill and National ID',
    moreInfoNeeded: 'More info needed:',
    nationalID: 'National ID',
    waterBill: 'Water Bill',
    response: 'Response',
    uploadFile: 'Upload file',
    dragDrop: 'Drag and drop files here to upload',
    fileInfo: 'Maximum file size allowed is 2MB, supported file formats include .pdf, .png and .jpg',
    browseFiles: 'Browse Files',
    nationalAddressRequest: 'Additional Information Request: National Address',
    declaration: 'I declare that all information provided is true and accurate, and I bear full responsibility for the accuracy of this data',
    actionRequired: 'Action Required',
  },
  ar: {
    noInfoNeeded: 'لا توجد معلومات إضافية مطلوبة',
    appreciateTime: 'نقدر وقتكم!',
    previousResponses: 'الردود السابقة',
    requestLabel: 'طلب معلومات إضافية: فاتورة المياه والهوية الوطنية',
    responsePlaceholder: '"يقدم مكون الأكورديون كميات كبيرة من المحتوى في مساحة صغيرة من خلال الإفصاح التدريجي. يحصل المستخدم على التفاصيل الرئيسية حول المحتوى الأساسي ويمكنه اختيار توسيع هذا المحتوى ضمن قيود الأكورديون."\n\n"يقدم مكون الأكورديون كميات كبيرة من المحتوى في مساحة صغيرة من خلال الإفصاح التدريجي. يحصل المستخدم على التفاصيل الرئيسية حول المحتوى الأساسي ويمكنه اختيار توسيع هذا المحتوى ضمن قيود الأكورديون."',
    inProgress: 'قيد التنفيذ',
    additionalInfoRequest: 'طلب معلومات إضافية: فاتورة المياه والهوية الوطنية',
    moreInfoNeeded: 'مطلوب مزيد من المعلومات:',
    nationalID: 'الهوية الوطنية',
    waterBill: 'فاتورة المياه',
    response: 'الرد',
    uploadFile: 'رفع ملف',
    dragDrop: 'اسحب وأفلت الملفات هنا للرفع',
    fileInfo: 'الحد الأقصى لحجم الملف المسموح به هو 2 ميجابايت، تتضمن تنسيقات الملفات المدعومة .pdf و .png و .jpg',
    browseFiles: 'تصفح الملفات',
    nationalAddressRequest: 'طلب معلومات إضافية: العنوان الوطني',
    declaration: 'أقر بأن جميع المعلومات المقدمة صحيحة ودقيقة، وأتحمل المسؤولية الكاملة عن دقة هذه البيانات',
    actionRequired: 'إجراء مطلوب',
  },
};

const AI_AR_AdditionalInformationTab = ({ language, hasRequests, onDeclarationChange, onUploadErrorChange, onUploadSuccessChange, onFileUploadAttempt }) => {
  const t = translations[language];
  const [isExpanded, setIsExpanded] = useState(true);
  const [isSecondExpanded, setIsSecondExpanded] = useState(true);
  const [isThirdExpanded, setIsThirdExpanded] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileError, setFileError] = useState('');

  // Notify parent component about checkbox state changes
  useEffect(() => {
    if (onDeclarationChange) {
      onDeclarationChange(isChecked);
    }
  }, [isChecked, onDeclarationChange]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Notify parent that a file upload attempt is happening
      if (onFileUploadAttempt) {
        onFileUploadAttempt();
      }
      
      // Check file size (2MB = 2 * 1024 * 1024 bytes)
      if (file.size > 2 * 1024 * 1024) {
        setFileError(`Please upload a file smaller than 2MB. Supported formats: PDF, JPG, PNG`);
        setUploadedFile(file); // Still show the file name but with error
        // Notify parent about upload error
        if (onUploadErrorChange) {
          onUploadErrorChange(true);
        }
        if (onUploadSuccessChange) {
          onUploadSuccessChange(false);
        }
      } else {
        // Check file type
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        if (allowedTypes.includes(file.type)) {
          setUploadedFile(file);
          setFileError('');
          // Notify parent about successful upload
          if (onUploadErrorChange) {
            onUploadErrorChange(false);
          }
          if (onUploadSuccessChange) {
            onUploadSuccessChange(true);
          }
        } else {
          setFileError(`Please upload a file smaller than 2MB. Supported formats: PDF, JPG, PNG`);
          setUploadedFile(file); // Still show the file name but with error
          // Notify parent about upload error
          if (onUploadErrorChange) {
            onUploadErrorChange(true);
          }
          if (onUploadSuccessChange) {
            onUploadSuccessChange(false);
          }
        }
      }
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setFileError('');
    // Reset states in parent when file is removed
    if (onUploadErrorChange) {
      onUploadErrorChange(false);
    }
    if (onUploadSuccessChange) {
      onUploadSuccessChange(false);
    }
  };

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
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">{t.previousResponses}</h3>
            <span className="text-sm font-medium bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">{t.actionRequired}</span>
        </div>
        
        {/* First Accordion */}
        <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
            <div 
                className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer hover:bg-gray-100" 
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3 font-semibold text-gray-700">
                    {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                    <span>{t.requestLabel}</span>
                </div>
                <span className="text-sm text-gray-500">29-04-2025</span>
            </div>
            {isExpanded && (
            <div className="p-4 border-t border-gray-200">
                <textarea
                    className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-600 focus:outline-none resize-none overflow-y-auto"
                    rows="3.3"
                    style={{ height: '5.28rem' }}
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

        {/* Second Accordion */}
        <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
            <div 
                className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer hover:bg-gray-100" 
                onClick={() => setIsSecondExpanded(!isSecondExpanded)}
            >
                <span className="font-semibold text-gray-700">{t.additionalInfoRequest}</span>
                {isSecondExpanded ? <FaChevronUp className="text-gray-600" /> : <FaChevronDown className="text-gray-600" />}
            </div>
            {isSecondExpanded && (
            <div className="p-4 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">{t.moreInfoNeeded}</h4>
                <ul className="list-disc list-inside mb-4 text-sm text-gray-700">
                    <li>{t.nationalID}</li>
                    <li>{t.waterBill}</li>
                </ul>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Response Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">* {t.response}</label>
                        <textarea
                            className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-600 focus:outline-none resize-none"
                            rows="4"
                            placeholder="The accordion component delivers large amounts of content in a small space through progressive disclosure. The user gets key details about the underlying content"
                        />
                    </div>
                    
                    {/* Upload File Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t.uploadFile}</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
                            <div className="mb-3">
                                <svg className="w-8 h-8 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{t.dragDrop}</p>
                            <p className="text-xs text-gray-500 mb-4">{t.fileInfo}</p>
                            <input
                                type="file"
                                id="fileUpload"
                                accept=".pdf,.png,.jpg,.jpeg"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                            <button 
                                onClick={() => document.getElementById('fileUpload').click()}
                                className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
                            >
                                {t.browseFiles}
                            </button>
                        </div>
                        
                        {/* Display uploaded file */}
                        {uploadedFile && (
                            <div className={`mt-3 border rounded-md ${
                                fileError 
                                    ? 'border-red-300 bg-red-50' 
                                    : 'border-green-300 bg-green-50'
                            }`}>
                                <div className="flex items-center justify-between p-3">
                                    <div className="flex items-center gap-2">
                                        {fileError ? (
                                            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                        <span className={`text-sm font-medium ${
                                            fileError ? 'text-red-800' : 'text-green-800'
                                        }`}>
                                            {uploadedFile.name}
                                        </span>
                                    </div>
                                    <button 
                                        onClick={removeFile} 
                                        className={`hover:opacity-70 text-lg font-bold ${
                                            fileError ? 'text-red-500' : 'text-green-500'
                                        }`}
                                    >
                                        ×
                                    </button>
                                </div>
                                
                                {/* Error message with horizontal line separator */}
                                {fileError && (
                                    <>
                                        <hr className="border-red-300" />
                                        <div className="p-3">
                                            <p className="text-sm text-red-700">{fileError}</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            )}
        </div>

        {/* Third Accordion */}
        <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
            <div 
                className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer hover:bg-gray-100" 
                onClick={() => setIsThirdExpanded(!isThirdExpanded)}
            >
                <span className="font-semibold text-gray-700">{t.nationalAddressRequest}</span>
                {isThirdExpanded ? <FaChevronUp className="text-gray-600" /> : <FaChevronDown className="text-gray-600" />}
            </div>
        </div>

        {/* Declaration Checkbox */}
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <input
                type="checkbox"
                id="declaration"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="mt-1 h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <label htmlFor="declaration" className="text-sm text-gray-700 cursor-pointer">
                {t.declaration}
            </label>
        </div>
    </div>
  );
};

export default AI_AR_AdditionalInformationTab;