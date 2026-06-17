import React, { useState, forwardRef, useImperativeHandle } from 'react';
import FileUpload from '../ProjectInfo/FileUpload';
import config from '@/utils/config';

const Contracts = forwardRef(({ language = 'en' }, ref) => {
  const [formData, setFormData] = useState({
    otherParty: '',
    currentContractStatus: '',
    contractType: '',
    contractDuration: '',
    annualPricingRate: '',
    contractedQuantity: '',
    notes: '',
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({});

  const translations = {
    en: {
      title: 'Contracts',
      otherParty: 'Other Party',
      currentContractStatus: 'Current Contract Status',
      contractType: 'Contract Type',
      selectType: 'Select Type',
      negotiation: 'Negotiation',
      underExecution: 'Under Execution',
      contractDuration: 'Contract Duration (in months)',
      annualPricingRate: 'Annual Pricing Rate',
      contractedQuantity: 'Contracted Quantity',
      notes: 'Notes',
      enteredText: 'Entered text',
      contractFile: 'Contract File',
      ex12: 'Ex: 12',
      Wholesale: 'Wholesale',
      Retail: 'Retail',
      other: 'Other',
      otherPartyRequired: 'Other Party is required',
      contractTypeRequired: 'Contract Type is required',
      contractDurationRequired: 'Contract Duration is required',
      contractDurationInvalid: 'Contract Duration must be a valid number',
      annualPricingRateRequired: 'Annual Pricing Rate is required',
      annualPricingRateInvalid: 'Annual Pricing Rate must be a valid number',
      contractedQuantityRequired: 'Contracted Quantity is required',
      contractedQuantityInvalid: 'Contracted Quantity must be a valid number',
      contractFileRequired: 'Contract File is required',
      fileTypeNotAllowed: 'Unsupported file format or size. Max size: 2MB. Allowed formats: .pdf, .png, .jpg',
    },
    ar: {
      title: 'العقود',
      otherParty: 'الطرف الآخر',
      currentContractStatus: 'حالة العقد الحالية',
      contractType: 'نوع العقد',
      selectType: 'اختر النوع',
      negotiation: 'نشط',
      underExecution: 'قيد التفاوض',
      contractDuration: 'مدة العقد (بالأشهر)',
      annualPricingRate: 'سعر التسعير السنوي',
      contractedQuantity: 'الكمية المتعاقد عليها',
      notes: 'ملاحظات',
      enteredText: 'النص المدخل',
      contractFile: 'ملف العقد',
      ex12: 'مثال: 12',
      Wholesale: 'بيع بالجملة',
      Retail: 'بيع بالتجزئة',
      other: 'آخر',
      otherPartyRequired: 'الطرف الآخر مطلوب',
      contractTypeRequired: 'نوع العقد مطلوب',
      contractDurationRequired: 'مدة العقد مطلوبة',
      contractDurationInvalid: 'مدة العقد يجب أن تكون رقمًا صالحًا',
      annualPricingRateRequired: 'سعر التسعير السنوي مطلوب',
      annualPricingRateInvalid: 'سعر التسعير السنوي يجب أن يكون رقمًا صالحًا',
      contractedQuantityRequired: 'الكمية المتعاقد عليها مطلوبة',
      contractedQuantityInvalid: 'الكمية المتعاقد عليها يجب أن تكون رقمًا صالحًا',
      contractFileRequired: 'ملف العقد مطلوب',
      fileTypeNotAllowed: 'تنسيق الملف أو حجمه غير مدعوم. الحجم الأقصى: 2 ميجابايت. التنسيقات المسموح بها: .pdf، .png، .jpg',
    },
  };

  const t = translations[language] || translations.en;
  const isRTL = language === 'ar';
  const fontClass = "font-['IBM_Plex_Sans_Arabic']";

  const validate = () => {
    const errors = {};
    const requiredFields = [
      { key: 'otherParty', errorMessage: t.otherPartyRequired },
      { key: 'contractType', errorMessage: t.contractTypeRequired },
      { key: 'contractDuration', errorMessage: t.contractDurationRequired },
      { key: 'annualPricingRate', errorMessage: t.annualPricingRateRequired },
      { key: 'contractedQuantity', errorMessage: t.contractedQuantityRequired },
    ];
    const requiredFiles = [
      { key: 'contractFile', errorMessage: t.contractFileRequired },
    ];

    requiredFields.forEach(({ key, errorMessage }) => {
      if (!formData[key] || formData[key].toString().trim() === '') {
        errors[key] = errorMessage;
      }
    });

    if (formData.contractDuration && !/^\d+$/.test(formData.contractDuration)) {
      errors.contractDuration = t.contractDurationInvalid;
    }
    if (formData.annualPricingRate && !/^\d+(\.\d+)?$/.test(formData.annualPricingRate)) {
      errors.annualPricingRate = t.annualPricingRateInvalid;
    }
    if (formData.contractedQuantity && !/^\d+(\.\d+)?$/.test(formData.contractedQuantity)) {
      errors.contractedQuantity = t.contractedQuantityInvalid;
    }

    requiredFiles.forEach(({ key, errorMessage }) => {
      const files = uploadedFiles[key] || [];
      const successfulUploads = files.filter(f => f.status === 'success').length;
      if (successfulUploads === 0) {
        errors[key] = errorMessage;
      }
    });

    setValidationErrors(errors);
    setShowValidationErrors(true);
    return Object.keys(errors).length === 0;
  };

  const getData = () => {
    const contractFiles = (uploadedFiles.contractFile || [])
      .filter(file => file.status === 'success')
      .map(file => ({
        name: file.originalName,
        size: file.size,
        type: file.type,
        url: file.url
      }));

    return {
      contracts: [{
        ...formData,
        contractFile: contractFiles,
      }],
    };
  };

  useImperativeHandle(ref, () => ({
    validate,
    getData,
  }));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = async (fileType, files) => {
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    const maxFileSize = 2 * 1024 * 1024; // 2MB

    if (validationErrors[fileType]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fileType];
        return newErrors;
      });
    }

    const validFiles = files.filter(file => allowedTypes.includes(file.type) && file.size <= maxFileSize);
    const invalidFiles = files.filter(file => !allowedTypes.includes(file.type) || file.size > maxFileSize);

    if (invalidFiles.length > 0) {
      setValidationErrors(prev => ({
        ...prev,
        [fileType]: t.fileTypeNotAllowed
      }));
      setShowValidationErrors(true);
    }

    if (validFiles.length === 0) {
      return;
    }

    const tempFiles = validFiles.map(file => ({
      id: crypto.randomUUID(),
      originalName: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading',
      url: null,
    }));

    setUploadedFiles(prev => ({
      ...prev,
      [fileType]: [...(prev[fileType] || []), ...tempFiles]
    }));

    for (const file of validFiles) {
      const tempFile = tempFiles.find(tf => tf.originalName === file.name);

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('bucketType', 'cust');

        const response = await fetch(`${config.API_BASE_URL}/upload`, {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Upload failed');
        }

        setUploadedFiles(prev => ({
          ...prev,
          [fileType]: (prev[fileType] || []).map(f =>
            f.id === tempFile.id ? { ...f, status: 'success', url: result.url, fileName: result.fileName } : f
          ),
        }));

      } catch (error) {
        console.error(`Upload failed for ${file.name}:`, error);
        setUploadedFiles(prev => ({
          ...prev,
          [fileType]: (prev[fileType] || []).map(f =>
            f.id === tempFile.id ? { ...f, status: 'failed', error: error.message } : f
          ),
        }));
      }
    }
  };

  return (
    <>
      <div className={`bg-white rounded-[6px] shadow-[0px_3px_12px_0px_rgba(47,43,61,0.14)] ${fontClass} p-8`}>
        <h2 className="text-[20px] font-bold text-[#161616] mb-8" dir={isRTL ? 'rtl' : 'ltr'}>
          {t.title}
        </h2>
        <hr className="border-gray-200 mb-8" />
        {/* Form Fields Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="text-red-500 mr-1">*</span>{t.otherParty}
              </label>
              <input
                type="text"
                name="otherParty"
                value={formData.otherParty}
                onChange={handleInputChange}
                placeholder={t.otherParty}
                className={`w-full p-3 border rounded-md bg-gray-50 focus:bg-white focus:ring-2 focus:ring-teal-500 ${validationErrors.otherParty && showValidationErrors ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              {validationErrors.otherParty && showValidationErrors && (
                <p className="text-red-500 text-[12px] mt-1">{validationErrors.otherParty}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="text-red-500 mr-1">*</span>{t.contractType}
              </label>
              <select
                name="contractType"
                value={formData.contractType}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-md bg-gray-50 focus:bg-white focus:ring-2 focus:ring-teal-500 ${validationErrors.contractType && showValidationErrors ? 'border-red-500' : 'border-gray-300'
                  }`}
              >
                <option value="" disabled>{t.selectType}</option>
                <option value="116950000">{t.Wholesale}</option>
                <option value="116950001">{t.Retail}</option>
                <option value="116950002">{t.other}</option>
              </select>
              {validationErrors.contractType && showValidationErrors && (
                <p className="text-red-500 text-[12px] mt-1">{validationErrors.contractType}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="text-red-500 mr-1">*</span>{t.annualPricingRate}
              </label>
              <input
                type="number"
                step="any"
                name="annualPricingRate"
                value={formData.annualPricingRate}
                onChange={handleInputChange}
                placeholder={t.ex12}
                className={`w-full p-3 border rounded-md bg-gray-50 focus:bg-white focus:ring-2 focus:ring-teal-500 ${validationErrors.annualPricingRate && showValidationErrors ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              {validationErrors.annualPricingRate && showValidationErrors && (
                <p className="text-red-500 text-[12px] mt-1">{validationErrors.annualPricingRate}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.notes}</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder={t.enteredText}
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 focus:bg-white focus:ring-2 focus:ring-teal-500"
              ></textarea>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.currentContractStatus}</label>
              <select
                name="currentContractStatus"
                value={formData.currentContractStatus}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 focus:bg-white focus:ring-2 focus:ring-teal-500"
              >
                <option value="" disabled>{t.selectType}</option>
                <option value="116950000">{t.underExecution}</option>
                <option value="116950001">{t.negotiation}</option>
                <option value="116950002">{t.other}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="text-red-500 mr-1">*</span>{t.contractDuration}
              </label>
              <input
                type="number"
                name="contractDuration"
                value={formData.contractDuration}
                onChange={handleInputChange}
                placeholder={t.ex12}
                className={`w-full p-3 border rounded-md bg-gray-50 focus:bg-white focus:ring-2 focus:ring-teal-500 ${validationErrors.contractDuration && showValidationErrors ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              {validationErrors.contractDuration && showValidationErrors && (
                <p className="text-red-500 text-[12px] mt-1">{validationErrors.contractDuration}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="text-red-500 mr-1">*</span>{t.contractedQuantity}
              </label>
              <input
                type="number"
                step="any"
                name="contractedQuantity"
                value={formData.contractedQuantity}
                onChange={handleInputChange}
                placeholder={t.ex12}
                className={`w-full p-3 border rounded-md bg-gray-50 focus:bg-white focus:ring-2 focus:ring-teal-500 ${validationErrors.contractedQuantity && showValidationErrors ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              {validationErrors.contractedQuantity && showValidationErrors && (
                <p className="text-red-500 text-[12px] mt-1">{validationErrors.contractedQuantity}</p>
              )}
            </div>
            <div>
              <FileUpload
                title={t.contractFile}
                id="contractFile"
                required
                language={language}
                onFileChange={handleFileChange}
                files={uploadedFiles.contractFile || []}
                validationError={validationErrors.contractFile}
                showValidationErrors={showValidationErrors}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export default Contracts;