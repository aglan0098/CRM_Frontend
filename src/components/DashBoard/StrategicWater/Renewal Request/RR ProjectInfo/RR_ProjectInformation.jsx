import React, { useState, forwardRef, useImperativeHandle } from 'react';
import FileUpload from './RR_FileUpload';
import SaveAsDraftModal from '../RR Asset/RR Asset Form/RR_SaveAsDraftModal';

const RR_ProjectInformation = forwardRef(({ language = 'en', currentStep, setCurrentStep }, ref) => {
  // --- STATE MANAGEMENT ---
  const [formData, setFormData] = useState({
    nationalAddress: '',
    investmentAmount: '',
    projectUsagePurpose: 'Commercial',
    projectUsageType: 'Industrial',
  });
  const [showSaveAsDraftModal, setShowSaveAsDraftModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({});

  // --- TRANSLATIONS ---
  const translations = {
    en: {
      title: 'Project Information',
      ownership: "Ownership Structure and Shareholders' Equity",
      accounting: 'Accounting System/Standard Followed',
      sitePlan: 'Site Plan of the Land and Buildings Where the Project Will Be Carried Out',
      ownershipDeed: 'Land and Building Ownership Deed or Proof of Right to Use for Benefit',
      financials: 'Financial Statements for the Last Three Years of the Project',
      contracts: 'Executed Contracts Information',
      surveillance: 'Certificate of Compliance for Installation of Security Surveillance Cameras',
      nationalAddress: 'National Address',
      investmentAmount: 'Investment Amount',
      projectDetails: 'Project Details',
      usagePurpose: 'Project Usage Purpose',
      usageType: 'Project Usage Type',
      self: 'Self',
      commercial: 'Commercial',
      urban: 'Urban',
      industrial: 'Industrial',
      agricultural: 'Agricultural',
      back: 'Back',
      next: 'Next',
      saveAsDraft: 'Save as Draft',
      cancel: 'Cancel',
      // Validation error messages
      nationalAddressRequired: 'National Address is required',
      investmentAmountRequired: 'Investment Amount is required',
      investmentAmountInvalid: 'Investment Amount must be a valid number',
      ownershipRequired: 'Ownership Structure is required',
      sitePlanRequired: 'Site Plan is required',
      contractsRequired: 'Executed Contracts Information is required',
      surveillanceRequired: 'Certificate of Compliance is required',
    },
    ar: {
      title: 'معلومات المشروع',
      ownership: 'هيكل الملكية وحقوق المساهمين',
      accounting: 'النظام/المعيار المحاسبي المتبع',
      sitePlan: 'مخطط الموقع للأرض والمباني التي سيتم تنفيذ المشروع عليها',
      ownershipDeed: 'صك ملكية الأرض والمباني أو إثبات حق الانتفاع',
      financials: 'القوائم المالية لآخر ثلاث سنوات للمشروع',
      contracts: 'معلومات العقود المنفذة',
      surveillance: 'شهادة امتثال لتركيب كاميرات المراقبة الأمنية',
      nationalAddress: 'العنوان الوطني',
      investmentAmount: 'قيمة الاستثمار',
      projectDetails: 'تفاصيل المشروع',
      usagePurpose: 'الغرض من استخدام المشروع',
      usageType: 'نوع استخدام المشروع',
      self: 'شخصي',
      commercial: 'تجاري',
      urban: 'حضري',
      industrial: 'صناعي',
      agricultural: 'زراعي',
      back: 'رجوع',
      next: 'التالي',
      saveAsDraft: 'حفظ كمسودة',
      cancel: 'إلغاء',
      // Validation error messages
      nationalAddressRequired: 'العنوان الوطني مطلوب',
      investmentAmountRequired: 'قيمة الاستثمار مطلوبة',
      investmentAmountInvalid: 'قيمة الاستثمار يجب أن تكون رقمًا صالحًا',
      ownershipRequired: 'هيكل الملكية مطلوب',
      sitePlanRequired: 'مخطط الموقع مطلوب',
      contractsRequired: 'معلومات العقود المنفذة مطلوبة',
      surveillanceRequired: 'شهادة الامتثال مطلوبة',
    },
  };

  const t = translations[language] || translations.en;
  const fontClass = "font-['IBM_Plex_Sans_Arabic']";
  const isRTL = language === 'ar';

  // --- VALIDATION LOGIC ---
  const validateForm = () => {
    const errors = {};
    const requiredFields = [
      { key: 'nationalAddress', errorMessage: t.nationalAddressRequired },
      { key: 'investmentAmount', errorMessage: t.investmentAmountRequired },
    ];
    const requiredFiles = [
      { key: 'ownership', errorMessage: t.ownershipRequired },
      { key: 'sitePlan', errorMessage: t.sitePlanRequired },
      { key: 'contracts', errorMessage: t.contractsRequired },
      { key: 'surveillance', errorMessage: t.surveillanceRequired },
    ];

    // Validate text fields
    requiredFields.forEach(({ key, errorMessage }) => {
      if (!formData[key] || formData[key].trim() === '') {
        errors[key] = errorMessage;
      }
    });

    // Validate investmentAmount is a valid number
    if (formData.investmentAmount && !/^\d+(\.\d+)?$/.test(formData.investmentAmount)) {
      errors.investmentAmount = t.investmentAmountInvalid;
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
        if (key === 'nationalAddress') {
          retranslatedErrors[key] = t.nationalAddressRequired;
        } else if (key === 'investmentAmount') {
          retranslatedErrors[key] = formData.investmentAmount.trim() === ''
            ? t.investmentAmountRequired
            : t.investmentAmountInvalid;
        } else if (key === 'ownership') {
          retranslatedErrors[key] = t.ownershipRequired;
        } else if (key === 'sitePlan') {
          retranslatedErrors[key] = t.sitePlanRequired;
        } else if (key === 'contracts') {
          retranslatedErrors[key] = t.contractsRequired;
        } else if (key === 'surveillance') {
          retranslatedErrors[key] = t.surveillanceRequired;
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
      nationalAddress: '',
      investmentAmount: '',
      projectUsagePurpose: 'Commercial',
      projectUsageType: 'Industrial',
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
        {/* Inputs Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="text-red-500 mr-1">*</span>{t.nationalAddress}
            </label>
            <input
              type="text"
              name="nationalAddress"
              value={formData.nationalAddress}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-md bg-gray-50 focus:bg-white focus:ring-2 focus:ring-teal-500 ${
                validationErrors.nationalAddress && showValidationErrors ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {validationErrors.nationalAddress && showValidationErrors && (
              <p className="text-red-500 text-[12px] mt-1">{validationErrors.nationalAddress}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="text-red-500 mr-1">*</span>{t.investmentAmount}
            </label>
            <input
              type="text"
              name="investmentAmount"
              value={formData.investmentAmount}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-md bg-gray-50 focus:bg-white focus:ring-2 focus:ring-teal-500 ${
                validationErrors.investmentAmount && showValidationErrors ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {validationErrors.investmentAmount && showValidationErrors && (
              <p className="text-red-500 text-[12px] mt-1">{validationErrors.investmentAmount}</p>
            )}
          </div>
        </div>
        {/* File Uploads Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
          <FileUpload
            title={t.ownership}
            id="ownership"
            required
            language={language}
            onFileChange={handleFileChange}
            files={uploadedFiles.ownership || []}
            validationError={validationErrors.ownership}
            showValidationErrors={showValidationErrors}
          />
          <FileUpload
            title={t.accounting}
            id="accounting"
            language={language}
            onFileChange={handleFileChange}
            files={uploadedFiles.accounting || []}
          />
          <FileUpload
            title={t.sitePlan}
            id="sitePlan"
            required
            language={language}
            onFileChange={handleFileChange}
            files={uploadedFiles.sitePlan || []}
            validationError={validationErrors.sitePlan}
            showValidationErrors={showValidationErrors}
          />
          <FileUpload
            title={t.ownershipDeed}
            id="ownershipDeed"
            language={language}
            onFileChange={handleFileChange}
            files={uploadedFiles.ownershipDeed || []}
          />
          <FileUpload
            title={t.financials}
            id="financials"
            language={language}
            onFileChange={handleFileChange}
            files={uploadedFiles.financials || []}
          />
          <FileUpload
            title={t.contracts}
            id="contracts"
            required
            language={language}
            onFileChange={handleFileChange}
            files={uploadedFiles.contracts || []}
            validationError={validationErrors.contracts}
            showValidationErrors={showValidationErrors}
          />
          <FileUpload
            title={t.surveillance}
            id="surveillance"
            required
            language={language}
            onFileChange={handleFileChange}
            files={uploadedFiles.surveillance || []}
            validationError={validationErrors.surveillance}
            showValidationErrors={showValidationErrors}
          />
        </div>
        {/* Navigation Buttons Section */}
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

export default RR_ProjectInformation;