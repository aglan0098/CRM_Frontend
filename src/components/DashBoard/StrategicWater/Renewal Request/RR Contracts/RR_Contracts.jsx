import React, { useState, forwardRef, useImperativeHandle } from 'react';
import FileUpload from '../RR ProjectInfo/RR_FileUpload';
import SaveAsDraftModal from '../RR Asset/RR Asset Form/RR_SaveAsDraftModal';

const RR_Contracts = forwardRef(({ language = 'en', currentStep, setCurrentStep }, ref) => {
  // --- STATE MANAGEMENT ---
  const [formData, setFormData] = useState({
    otherParty: '',
    currentContractStatus: '',
    contractType: '',
    contractDuration: '',
    annualPricingRate: '',
    contractedQuantity: '',
    notes: '',
  });
  const [showSaveAsDraftModal, setShowSaveAsDraftModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({});

  // --- TRANSLATIONS ---
  const translations = {
    en: {
      title: 'Contracts',
      otherParty: 'Other Party',
      currentContractStatus: 'Current Contract Status',
      contractType: 'Contract Type',
      selectType: 'Select Type',
      negotiation: 'Negotiation',
      other: 'Other',
      underExecution: 'Under Execution',
      contractDuration: 'Contract Duration (in months)',
      annualPricingRate: 'Annual Pricing Rate',
      contractedQuantity: 'Contracted Quantity',
      notes: 'Notes',
      enteredText: 'Entered text',
      contractFile: 'Contract File',
      ex12: 'Ex: 12',
      back: 'Back',
      next: 'Next',
      saveAsDraft: 'Save as Draft',
      cancel: 'Cancel',
      // Validation error messages
      otherPartyRequired: 'Other Party is required',
      contractTypeRequired: 'Contract Type is required',
      contractDurationRequired: 'Contract Duration is required',
      contractDurationInvalid: 'Contract Duration must be a valid number',
      annualPricingRateRequired: 'Annual Pricing Rate is required',
      annualPricingRateInvalid: 'Annual Pricing Rate must be a valid number',
      contractedQuantityRequired: 'Contracted Quantity is required',
      contractedQuantityInvalid: 'Contracted Quantity must be a valid number',
      contractFileRequired: 'Contract File is required',
    },
    ar: {
      title: 'العقود',
      otherParty: 'الطرف الآخر',
      currentContractStatus: 'حالة العقد الحالية',
      contractType: 'نوع العقد',
      selectType: 'اختر النوع',
      negotiation: 'نشط',
      other: 'منتهي الصلاحية',
      underExecution: 'قيد التفاوض',
      contractDuration: 'مدة العقد (بالأشهر)',
      annualPricingRate: 'سعر التسعير السنوي',
      contractedQuantity: 'الكمية المتعاقد عليها',
      notes: 'ملاحظات',
      enteredText: 'النص المدخل',
      contractFile: 'ملف العقد',
      ex12: 'مثال: 12',
      back: 'رجوع',
      next: 'التالي',
      saveAsDraft: 'حفظ كمسودة',
      cancel: 'إلغاء',
      // Validation error messages
      otherPartyRequired: 'الطرف الآخر مطلوب',
      contractTypeRequired: 'نوع العقد مطلوب',
      contractDurationRequired: 'مدة العقد مطلوبة',
      contractDurationInvalid: 'مدة العقد يجب أن تكون رقمًا صالحًا',
      annualPricingRateRequired: 'سعر التسعير السنوي مطلوب',
      annualPricingRateInvalid: 'سعر التسعير السنوي يجب أن يكون رقمًا صالحًا',
      contractedQuantityRequired: 'الكمية المتعاقد عليها مطلوبة',
      contractedQuantityInvalid: 'الكمية المتعاقد عليها يجب أن تكون رقمًا صالحًا',
      contractFileRequired: 'ملف العقد مطلوب',
    },
  };

  const t = translations[language] || translations.en;
  const isRTL = language === 'ar';
  const fontClass = "font-['IBM_Plex_Sans_Arabic']";

  // --- VALIDATION LOGIC ---
  const validateForm = () => {
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

    // Validate text and dropdown fields
    requiredFields.forEach(({ key, errorMessage }) => {
      if (!formData[key] || formData[key].toString().trim() === '') {
        errors[key] = errorMessage;
      }
    });

    // Validate numeric fields
    if (formData.contractDuration && !/^\d+$/.test(formData.contractDuration)) {
      errors.contractDuration = t.contractDurationInvalid;
    }
    if (formData.annualPricingRate && !/^\d+(\.\d+)?$/.test(formData.annualPricingRate)) {
      errors.annualPricingRate = t.annualPricingRateInvalid;
    }
    if (formData.contractedQuantity && !/^\d+(\.\d+)?$/.test(formData.contractedQuantity)) {
      errors.contractedQuantity = t.contractedQuantityInvalid;
    }

    // Validate required file uploads
    requiredFiles.forEach(({ key, errorMessage }) => {
      if (!uploadedFiles[key] || uploadedFiles[key].length === 0) {
        errors[key] = errorMessage;
      }
    });

    return errors;
  };

  const handleValidation = () => {
    const errors = validateForm();
    setValidationErrors(errors);
    setShowValidationErrors(true);
    return Object.keys(errors).length === 0;
  };

  // Expose validation function to parent
  useImperativeHandle(ref, () => ({
    handleValidation,
  }));

  // Re-translate validation errors when language changes
  React.useEffect(() => {
    if (showValidationErrors && Object.keys(validationErrors).length > 0) {
      const retranslatedErrors = {};
      Object.keys(validationErrors).forEach((key) => {
        if (key === 'otherParty') {
          retranslatedErrors[key] = t.otherPartyRequired;
        } else if (key === 'contractType') {
          retranslatedErrors[key] = t.contractTypeRequired;
        } else if (key === 'contractDuration') {
          retranslatedErrors[key] = formData.contractDuration.toString().trim() === ''
            ? t.contractDurationRequired
            : t.contractDurationInvalid;
        } else if (key === 'annualPricingRate') {
          retranslatedErrors[key] = formData.annualPricingRate.toString().trim() === ''
            ? t.annualPricingRateRequired
            : t.annualPricingRateInvalid;
        } else if (key === 'contractedQuantity') {
          retranslatedErrors[key] = formData.contractedQuantity.toString().trim() === ''
            ? t.contractedQuantityRequired
            : t.contractedQuantityInvalid;
        } else if (key === 'contractFile') {
          retranslatedErrors[key] = t.contractFileRequired;
        }
      });
      setValidationErrors(retranslatedErrors);
    }
  }, [language]);

  // --- HANDLER FUNCTIONS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (fileType, files) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [fileType]: files,
    }));

    // Clear validation error when files are uploaded
    if (validationErrors[fileType]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fileType];
        return newErrors;
      });
    }
  };

  const handleNext = () => {
    if (handleValidation()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => setCurrentStep(currentStep - 1);

  const handleSaveAsDraft = () => setShowSaveAsDraftModal(true);

  const handleSaveConfirm = () => {
    console.log('Draft saved!');
    setShowSaveAsDraftModal(false);
  };

  const handleCancel = () => {
    // Reset form data
    setFormData({
      otherParty: '',
      currentContractStatus: '',
      contractType: '',
      contractDuration: '',
      annualPricingRate: '',
      contractedQuantity: '',
      notes: '',
    });
    setUploadedFiles({});
    setValidationErrors({});
    setShowValidationErrors(false);
    console.log('Form cancelled and cleared...');
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
                className={`w-full p-3 border rounded-md bg-gray-50 focus:bg-white focus:ring-2 focus:ring-teal-500 ${
                  validationErrors.otherParty && showValidationErrors ? 'border-red-500' : 'border-gray-300'
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
                className={`w-full p-3 border rounded-md bg-gray-50 focus:bg-white focus:ring-2 focus:ring-teal-500 ${
                  validationErrors.contractType && showValidationErrors ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="" disabled>{t.selectType}</option>
                <option value="Wholesale">{t.Wholesale || 'Wholesale'}</option>
                <option value="Retail">{t.Retail || 'Retail'}</option>
                <option value="Other">{t.other}</option>
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
                className={`w-full p-3 border rounded-md bg-gray-50 focus:bg-white focus:ring-2 focus:ring-teal-500 ${
                  validationErrors.annualPricingRate && showValidationErrors ? 'border-red-500' : 'border-gray-300'
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
                <option value="Under Execution">{t.underExecution}</option>
                <option value="Negotiation">{t.negotiation}</option>
                <option value="Other">{t.other}</option>
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
                className={`w-full p-3 border rounded-md bg-gray-50 focus:bg-white focus:ring-2 focus:ring-teal-500 ${
                  validationErrors.contractDuration && showValidationErrors ? 'border-red-500' : 'border-gray-300'
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
                className={`w-full p-3 border rounded-md bg-gray-50 focus:bg-white focus:ring-2 focus:ring-teal-500 ${
                  validationErrors.contractedQuantity && showValidationErrors ? 'border-red-500' : 'border-gray-300'
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

        {/* Navigation Buttons */}
        <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handleBack}
            className="px-6 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50"
          >
            {t.back}
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-[#1B8354] text-white text-sm font-medium rounded-md hover:bg-[#146B43]"
          >
            {t.next}
          </button>
          <button
            onClick={handleSaveAsDraft}
            className="px-4 py-2 text-sm text-gray-600 hover:text-black hover:bg-gray-100 rounded-md"
          >
            {t.saveAsDraft}
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm text-gray-600 hover:text-black hover:bg-gray-100 rounded-md"
          >
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
});

export default RR_Contracts;