import React, { useState, useRef } from 'react';
import FileUploadImage from '@/assets/images/file-upload.png';

const FileUpload = ({
  title,
  id,
  required = false,
  language = 'en',
  onFileChange,
  files = [],
  validationError,
  showValidationErrors,
}) => {
  const fileInputRef = useRef(null);

  const translations = {
    en: {
      dragDrop: 'Drag and drop files here to upload',
      fileInfo: 'Maximum file size allowed is 2MB, supported file formats include .jpg, .png, and .pdf.',
      browse: 'Browse Files',
      combine: 'Combine all your files in 1 PDF document.',
    },
    ar: {
      dragDrop: 'اسحب وأفلت الملفات هنا للرفع',
      fileInfo: 'الحد الأقصى لحجم الملف المسموح به هو 2 ميجابايت، التنسيقات المدعومة هي .jpg و .png و .pdf.',
      browse: 'تصفح الملفات',
      combine: 'ادمج جميع ملفاتك في مستند PDF واحد.',
    },
  };

  const t = translations[language] || translations.en;

  const handleFileChange = (e) => {
    if (e.target.files) {
      const allSelectedFiles = Array.from(e.target.files);
      onFileChange(id, allSelectedFiles);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const allSelectedFiles = Array.from(e.dataTransfer.files);
      onFileChange(id, allSelectedFiles);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {required && <span className="text-red-500 mr-1">*</span>}
        {title}
      </label>
      <div
        className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg bg-gray-50 h-[210px] ${validationError && showValidationErrors ? 'border-red-500' : 'border-gray-300'
          }`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <img src={FileUploadImage} alt="Upload file icon" className="w-10 h-10 mb-3" />
        <p className="text-sm text-gray-600 mb-2">{t.dragDrop}</p>
        <p className="text-xs text-gray-500 mb-4">{t.fileInfo}</p>
        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-5 py-2 bg-[#161616] text-white text-sm font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
        >
          {t.browse}
        </button>
      </div>
      {validationError && showValidationErrors && (
        <p className="text-red-500 text-[12px] mt-1">{validationError}</p>
      )}
      <div className="flex items-start gap-2 mt-2">
        <span className="flex-shrink-0 flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-gray-400 rounded-full mt-0.5">
          i
        </span>
        <p className="text-xs text-gray-500">{t.combine}</p>
      </div>
      {files.length > 0 && (
        <div className="mt-3 text-left">
          <p className="text-sm font-medium text-gray-800 mb-2">Selected files:</p>
          <ul className="space-y-1">
            {files.map(file => (
              <li key={file.id} className="text-xs text-gray-600 flex items-center gap-2">
                <span>{file.originalName}</span>

                {/* Show different indicators based on status */}
                {file.status === 'uploading' && (
                  <span className="text-blue-500"> (Uploading...)</span>
                )}
                {file.status === 'success' && (
                  <span className="text-green-500 font-bold">✓</span>
                )}
                {file.status === 'failed' && (
                  <span className="text-red-500"> (Failed: {file.error})</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;