import React, { useState, forwardRef, useImperativeHandle } from 'react';
import FileUpload from './FileUpload';
import config from '@/utils/config';
const ProjectInformation = forwardRef(({ language = 'en' }, ref) => {
  const [formData, setFormData] = useState({
    nationalAddress: '',
    investmentAmount: '',
    projectUsagePurpose: 'Commercial',
    projectUsageType: 'Industrial',
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({});

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

  const validate = () => {
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

    requiredFields.forEach(({ key, errorMessage }) => {
      if (!formData[key] || formData[key].trim() === '') {
        errors[key] = errorMessage;
      }
    });

    if (formData.investmentAmount && !/^\d+(\.\d+)?$/.test(formData.investmentAmount)) {
      errors.investmentAmount = t.investmentAmountInvalid;
    }

    requiredFiles.forEach(({ key, errorMessage }) => {
      if (!uploadedFiles[key] || uploadedFiles[key].length === 0) {
        errors[key] = errorMessage;
      }
    });
    setValidationErrors(errors);
    setShowValidationErrors(true);
    return Object.keys(errors).length === 0;
  };

  const getData = () => {
    const documents = {};
    for (const [key, files] of Object.entries(uploadedFiles)) {
      if (files && files.length > 0) {
        // Filter for successfully uploaded files and map to the required format
        const successfulFiles = files
          .filter(file => file.status === 'success')
          .map(file => ({
            name: file.originalName,
            size: file.size,
            type: file.type,
            url: file.url // Include the URL from the server response
          }));

        if (successfulFiles.length > 0) {
          documents[key] = successfulFiles;
        }
      }
    }
    console.log({
        nationalAddress: formData.nationalAddress,
        investmentAmount: parseFloat(formData.investmentAmount) || 0,
        projectUsagePurpose: formData.projectUsagePurpose,
        projectUsageType: formData.projectUsageType,
        documents: documents,
      })
    return {
      projectInfo: {
        nationalAddress: formData.nationalAddress,
        investmentAmount: parseFloat(formData.investmentAmount) || 0,
        projectUsagePurpose: formData.projectUsagePurpose,
        projectUsageType: formData.projectUsageType,
        documents: documents,
      },
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

  // Important Note: Make sure you have a config object with your API URL
  // For example: const config = { API_BASE_URL: 'http://your-api-url.com' };

  const handleFileChange = async (fileType, files) => {
    // Create temporary file objects to show "uploading" status immediately in the UI
    const tempFiles = files.map(file => ({
      id: crypto.randomUUID(), // A unique ID for this specific upload instance
      originalName: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading', // Initial status
      url: null,
    }));

    // Immediately update state to show the uploading indicators
    setUploadedFiles(prev => ({
      ...prev,
      [fileType]: [...(prev[fileType] || []), ...tempFiles]
    }));

    // Clear any existing validation errors for this field
    if (validationErrors[fileType]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fileType];
        return newErrors;
      });
    }

    // Loop through each selected file and upload it
    for (const file of files) {
      const tempFile = tempFiles.find(tf => tf.originalName === file.name);

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('bucketType', 'cust'); // Or any other data your API needs

        const response = await fetch(`${config.API_BASE_URL}/upload`, {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Upload failed');
        }

        // On SUCCESS, update the specific file's state from 'uploading' to 'success'
        setUploadedFiles(prev => ({
          ...prev,
          [fileType]: (prev[fileType] || []).map(f =>
            f.id === tempFile.id
              ? { ...f, status: 'success', url: result.url, fileName: result.fileName }
              : f
          ),
        }));

      } catch (error) {
        console.error(`Upload failed for ${file.name}:`, error);

        // On FAILURE, update the specific file's state from 'uploading' to 'failed'
        setUploadedFiles(prev => ({
          ...prev,
          [fileType]: (prev[fileType] || []).map(f =>
            f.id === tempFile.id
              ? { ...f, status: 'failed', error: error.message }
              : f
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
              className={`w-full p-3 border rounded-md bg-gray-50 focus:bg-white focus:ring-2 focus:ring-teal-500 ${validationErrors.nationalAddress && showValidationErrors ? 'border-red-500' : 'border-gray-300'
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
              className={`w-full p-3 border rounded-md bg-gray-50 focus:bg-white focus:ring-2 focus:ring-teal-500 ${validationErrors.investmentAmount && showValidationErrors ? 'border-red-500' : 'border-gray-300'
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
      </div>
    </>
  );
});

export default ProjectInformation;