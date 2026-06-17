import React, { useState, forwardRef, useImperativeHandle } from 'react';
import RemoveAssetModal from './RemoveAssetModal';
import SaveAsDraftModal from './SaveAsDraftModal';
import CancelModal from './CancelModal';
import MapPicker from './MapPicker';
import Upload from '../Asset Form/Upload.png';
import BlackQuestion from '../Asset Form/BlackQuestion.png';
import WhiteQuestion from '../Asset Form/WhiteQuestion.png';
import Arrow from '../Asset Form/Arrow.png';
import Calendar from '../Asset Form/Calendar.png';
import Pin from '../Asset Form/Pin.png';
import DeleteAsset from '../Asset Form/DeleteAsset.png';
import config from '@/utils/config';

// Placeholder for Google Maps API key (store in environment variable in production)
const Maps_API_KEY = 'AIzaSyASVOsCsoSdfGGCqauMP1KOSde9k-9Bx7E'; // <-- IMPORTANT: Replace with your actual API key
const Geocoding_API_KEY = 'AIzaSyD8RTCRn5yUQy-GGHBoole1mRmvm-0fOMU'; // <-- IMPORTANT: Replace with your actual API key

const AssetForm = forwardRef(({ language = 'en' }, ref) => {
  const [assets, setAssets] = useState({
    1: {
      plantName: '',
      sector: '',
      city: '',
      designCapacity: '',
      typeOfTreatment: '',
      commercialOperationDate: '',
      expectedOperationalLifespan: '',
      region: '',
      cityLocation: '',
      nationalAddress: '',
      locationDescription: '',
      gpsLongitude: '',
      gpsLatitude: ''
    }
  });

  const [expandedAssets, setExpandedAssets] = useState({ 1: true });
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [assetToRemove, setAssetToRemove] = useState(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [activeAssetForMap, setActiveAssetForMap] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  const translations = {
    en: {
      title: 'Asset Form',
      addAsset: 'Add Asset',
      assetsNumber: 'Assets Number',
      plantName: 'Plant Name',
      sector: 'Sector',
      city: 'City',
      designCapacity: 'Design Capacity',
      typeOfTreatment: 'Type of Treatment',
      commercialOperationDate: 'Commercial Operation Date',
      expectedOperationalLifespan: 'Expected Operational Lifespan (Years)',
      region: 'Region',
      cityLocation: 'City',
      nationalAddress: 'National Address',
      locationDescription: 'Location Description',
      gpsLongitude: 'GPS Longitude',
      gpsLatitude: 'GPS Latitude',
      longitudeNote: 'Longitude must be between -180 and 180 degrees. Example: 46.6753',
      latitudeNote: 'Latitude must be between -90 and 90 degrees. Example: 24.7136',
      landLayoutPlan: 'Land Layout Plan',
      operationalPermit: 'Operational Permit from the National Center for Environmental Compliance',
      dragDropText: 'Drag and drop files here to upload',
      maxFileSize: 'Maximum file size allowed is 2MB, supported file formats include .pdf, .png and .jpg',
      browseFiles: 'Browse Files',
      combineFiles: 'Combine all your files in 1 PDF document.',
      removeAsset: 'Remove Asset',
      selectCity: 'Select City',
      selectOption: 'Option',
      chooseDesignCapacity: 'Design Capacity',
      chooseTechnology: 'Choose Technology',
      riyadhRegion: 'Riyadh Region',
      riyadh: 'Riyadh',
      sampleAddress: 'RGNXXXXX',
      sampleLongitude: '46.6753',
      sampleLatitude: '24.7136',
      plantNamePlaceholder: 'Plant Name',
      central: 'Central',
      northern: 'Northern',
      southern: 'Southern',
      northwestern: 'Northwestern',
      western: 'Western',
      eastern: 'Eastern',
      binary: 'Binary',
      tertiary: 'Tertiary',
      other: 'Other',
      // Validation error messages
      plantNameRequired: 'Plant Name is required',
      sectorRequired: 'Sector is required',
      expectedOperationalLifespanRequired: 'Expected Operational Lifespan is required',
      designCapacityRequired: 'Design Capacity is required',
      typeOfTreatmentRequired: 'Type of Treatment is required',
      commercialOperationDateRequired: 'Commercial Operation Date is required',
      landLayoutPlanRequired: 'Land Layout Plan is required',
      operationalPermitRequired: 'Operational Permit is required',
      fileTypeNotAllowed: 'Unsupported file format. Allowed formats: .pdf, .png, .jpg', // <-- FIX ADDED HERE

    },
    ar: {
      title: 'نموذج الأصول',
      addAsset: 'إضافة أصل',
      assetsNumber: 'رقم الأصول',
      plantName: 'اسم المحطة',
      sector: 'القطاع',
      city: 'المدينة',
      designCapacity: 'السعة التصميمية',
      typeOfTreatment: 'نوع المعالجة',
      commercialOperationDate: 'تاريخ التشغيل التجاري',
      expectedOperationalLifespan: 'العمر التشغيلي المتوقع (سنوات)',
      region: 'المنطقة',
      cityLocation: 'المدينة',
      nationalAddress: 'العنوان الوطني',
      locationDescription: 'وصف الموقع',
      gpsLongitude: 'خط الطول GPS',
      gpsLatitude: 'خط العرض GPS',
      longitudeNote: 'يجب أن يكون خط الطول بين -180 و 180 درجة. مثال: 46.6753',
      latitudeNote: 'يجب أن يكون خط العرض بين -90 و 90 درجة. مثال: 24.7136',
      landLayoutPlan: 'مخطط تخطيط الأرض',
      operationalPermit: 'تصريح التشغيل من المركز الوطني للامتثال البيئي',
      dragDropText: 'اسحب وأفلت الملفات هنا للرفع',
      maxFileSize: 'الحد الأقصى لحجم الملف المسموح به هو 2 ميجابايت، تتضمن تنسيقات الملفات المدعومة .pdf و .png و .jpg',
      browseFiles: 'تصفح الملفات',
      combineFiles: 'ادمج جميع ملفاتك في مستند PDF واحد.',
      removeAsset: 'إزالة الأصل',
      selectCity: 'اختر المدينة',
      selectOption: 'خيار',
      chooseDesignCapacity: 'السعة التصميمية',
      chooseTechnology: 'اختر التقنية',
      riyadhRegion: 'منطقة الرياض',
      riyadh: 'الرياض',
      sampleAddress: 'RGNXXXXX',
      sampleLongitude: '46.6753',
      sampleLatitude: '24.7136',
      plantNamePlaceholder: 'اسم المحطة',
      designCapacityPlaceholder: 'السعة التصميمية',
      pinLocationOnMap: 'تحديد الموقع على الخريطة',
      central: 'وسط',
      northern: 'شمال',
      southern: 'جنوب',
      northwestern: 'شمال غرب',
      western: 'غرب',
      eastern: 'شرق',
      binary: 'ثنائي',
      tertiary: 'ثلاثي',
      other: 'آخر',
      // Validation error messages
      plantNameRequired: 'اسم المحطة مطلوب',
      sectorRequired: 'القطاع مطلوب',
      expectedOperationalLifespanRequired: 'العمر التشغيلي المتوقع مطلوب',
      designCapacityRequired: 'السعة التصميمية مطلوبة',
      typeOfTreatmentRequired: 'نوع المعالجة مطلوب',
      commercialOperationDateRequired: 'تاريخ التشغيل التجاري مطلوب',
      landLayoutPlanRequired: 'مخطط تخطيط الأرض مطلوب',
      operationalPermitRequired: 'تصريح التشغيل مطلوب',
      fileTypeNotAllowed: 'تنسيق الملف غير مدعوم. التنسيقات المسموح بها: .pdf و .png و .jpg'
    },
  };

  const t = translations[language] || translations.en;
  const fontClass = "font-['IBM_Plex_Sans_Arabic']";

  const handleInputChange = (assetNumber, field, value) => {
    setAssets(prev => ({
      ...prev,
      [assetNumber]: {
        ...prev[assetNumber],
        [field]: value
      }
    }));

    // Clear validation error when user starts typing
    if (validationErrors[`${assetNumber}-${field}`]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`${assetNumber}-${field}`];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const currentTranslations = translations[language] || translations.en;
    const errors = {};
    const requiredFields = [
      'plantName',
      'sector',
      'expectedOperationalLifespan',
      'designCapacity',
      'typeOfTreatment',
      'commercialOperationDate'
    ];

    const requiredFiles = [
      'landLayout',
      'operationalPermit'
    ];

    Object.keys(assets).forEach(assetNumber => {
      const asset = assets[assetNumber];

      // Validate form fields
      requiredFields.forEach(field => {
        if (!asset[field] || asset[field].toString().trim() === '') {
          if (field === 'plantName') {
            errors[`${assetNumber}-${field}`] = currentTranslations.plantNameRequired;
          } else if (field === 'sector') {
            errors[`${assetNumber}-${field}`] = currentTranslations.sectorRequired;
          } else if (field === 'expectedOperationalLifespan') {
            errors[`${assetNumber}-${field}`] = currentTranslations.expectedOperationalLifespanRequired;
          } else if (field === 'designCapacity') {
            errors[`${assetNumber}-${field}`] = currentTranslations.designCapacityRequired;
          } else if (field === 'typeOfTreatment') {
            errors[`${assetNumber}-${field}`] = currentTranslations.typeOfTreatmentRequired;
          } else if (field === 'commercialOperationDate') {
            errors[`${assetNumber}-${field}`] = currentTranslations.commercialOperationDateRequired;
          }
        }
      });

      // Validate file uploads
      requiredFiles.forEach(fileType => {
        const fileKey = `${assetNumber}-${fileType}`;
        const files = uploadedFiles[fileKey];
        if (!files || files.length === 0) {
          if (fileType === 'landLayout') {
            errors[`${assetNumber}-${fileType}`] = currentTranslations.landLayoutPlanRequired;
          } else if (fileType === 'operationalPermit') {
            errors[`${assetNumber}-${fileType}`] = currentTranslations.operationalPermitRequired;
          }
        }
      });
    });

    return errors;
  };

  const handleValidation = () => {
    const errors = validateForm();
    setValidationErrors(errors);
    setShowValidationErrors(true);
    return Object.keys(errors).length === 0;
  };

  // const getData = () => {
  //   return Object.keys(assets).map(assetNumber => {
  //     const assetData = assets[assetNumber];
  //     const landLayoutFiles = uploadedFiles[`${assetNumber}-landLayout`] || [];
  //     const operationalPermitFiles = uploadedFiles[`${assetNumber}-operationalPermit`] || [];

  //     return {
  //       ...assetData,
  //       documents: {
  //         landLayoutPlan: landLayoutFiles.map(file => ({ name: file.name, size: file.size, type: file.type })),
  //         operationalPermit: operationalPermitFiles.map(file => ({ name: file.name, size: file.size, type: file.type })),
  //       }
  //     };
  //   });
  // };

  const getData = () => {
    return Object.keys(assets).map(assetNumber => {
      const assetData = assets[assetNumber];
      const landLayoutFiles = uploadedFiles[`${assetNumber}-landLayout`] || [];
      const operationalPermitFiles = uploadedFiles[`${assetNumber}-operationalPermit`] || [];

      // Map over the uploaded files, but only for those that were successful
      const landLayoutData = landLayoutFiles
        .filter(file => file.status === 'success')
        .map(file => ({
          name: file.originalName,
          url: file.url, // The URL from the cloud
          size: file.size,
          type: file.type
        }));

      const operationalPermitData = operationalPermitFiles
        .filter(file => file.status === 'success')
        .map(file => ({
          name: file.originalName,
          url: file.url, // The URL from the cloud
          size: file.size,
          type: file.type
        }));

      console.log({
        ...assetData,
        documents: {
          landLayoutPlan: landLayoutData,
          operationalPermit: operationalPermitData,
        }
      })
      return {
        ...assetData,
        documents: {
          landLayoutPlan: landLayoutData,
          operationalPermit: operationalPermitData,
        }
      };
    });
  };








  useImperativeHandle(ref, () => ({
    validate: handleValidation,
    getData: getData
  }));

  const retranslateValidationErrors = (errors) => {
    const currentTranslations = translations[language] || translations.en;
    const retranslatedErrors = {};

    Object.keys(errors).forEach(key => {
      const [assetNumber, field] = key.split('-');

      if (field === 'plantName') {
        retranslatedErrors[key] = currentTranslations.plantNameRequired;
      } else if (field === 'sector') {
        retranslatedErrors[key] = currentTranslations.sectorRequired;
      } else if (field === 'expectedOperationalLifespan') {
        retranslatedErrors[key] = currentTranslations.expectedOperationalLifespanRequired;
      } else if (field === 'designCapacity') {
        retranslatedErrors[key] = currentTranslations.designCapacityRequired;
      } else if (field === 'typeOfTreatment') {
        retranslatedErrors[key] = currentTranslations.typeOfTreatmentRequired;
      } else if (field === 'commercialOperationDate') {
        retranslatedErrors[key] = currentTranslations.commercialOperationDateRequired;
      } else if (field === 'landLayout') {
        retranslatedErrors[key] = currentTranslations.landLayoutPlanRequired;
      } else if (field === 'operationalPermit') {
        retranslatedErrors[key] = currentTranslations.operationalPermitRequired;
      }
    });

    return retranslatedErrors;
  };

  React.useEffect(() => {
    if (showValidationErrors && Object.keys(validationErrors).length > 0) {
      const retranslatedErrors = retranslateValidationErrors(validationErrors);
      setValidationErrors(retranslatedErrors);
    }
  }, [language]);

  const handlePinLocationClick = (assetNumber) => {
    setActiveAssetForMap(assetNumber);
    setIsMapOpen(true);
  };

  const handleLocationSelect = (locationData) => {
    if (activeAssetForMap) {
      handleInputChange(activeAssetForMap, 'region', locationData.region);
      handleInputChange(activeAssetForMap, 'cityLocation', locationData.city);
      handleInputChange(activeAssetForMap, 'nationalAddress', locationData.nationalAddress);
      handleInputChange(activeAssetForMap, 'locationDescription', locationData.locationDescription);
      handleInputChange(activeAssetForMap, 'gpsLatitude', locationData.lat.toFixed(6));
      handleInputChange(activeAssetForMap, 'gpsLongitude', locationData.lng.toFixed(6));
    }
    setIsMapOpen(false);
    setActiveAssetForMap(null);
  };

  const toggleAssetExpansion = (assetNumber) => {
    setExpandedAssets(prev => ({
      ...prev,
      [assetNumber]: !prev[assetNumber]
    }));
  };

  const addAsset = () => {
    const existingNumbers = Object.keys(expandedAssets).map(num => parseInt(num));
    const nextAssetNumber = existingNumbers.length === 0 ? 1 : Math.max(...existingNumbers) + 1;
    setExpandedAssets(prev => ({
      ...prev,
      [nextAssetNumber]: true
    }));
    setAssets(prev => ({
      ...prev,
      [nextAssetNumber]: {
        plantName: '',
        sector: '',
        city: '',
        designCapacity: '',
        typeOfTreatment: '',
        commercialOperationDate: '',
        expectedOperationalLifespan: '',
        region: '',
        cityLocation: '',
        nationalAddress: '',
        locationDescription: '',
        gpsLongitude: '',
        gpsLatitude: ''
      }
    }));
  };

  const removeAsset = (assetNumber) => {
    setExpandedAssets(prev => {
      const newExpanded = { ...prev };
      delete newExpanded[assetNumber];

      const remainingAssets = Object.keys(newExpanded)
        .map(num => parseInt(num))
        .sort((a, b) => a - b);

      const resequencedAssets = {};
      remainingAssets.forEach((originalNumber, index) => {
        const newNumber = index + 1;
        resequencedAssets[newNumber] = newExpanded[originalNumber];
      });

      return resequencedAssets;
    });

    setAssets(prev => {
      const newAssets = { ...prev };
      delete newAssets[assetNumber];

      const remainingAssets = Object.keys(newAssets)
        .map(num => parseInt(num))
        .sort((a, b) => a - b);

      const resequencedAssets = {};
      remainingAssets.forEach((originalNumber, index) => {
        const newNumber = index + 1;
        resequencedAssets[newNumber] = newAssets[originalNumber];
      });

      return resequencedAssets;
    });

    setUploadedFiles(prev => {
      const newUploadedFiles = { ...prev };
      const assetNumbers = Object.keys(expandedAssets)
        .map(num => parseInt(num))
        .filter(num => num !== assetNumber)
        .sort((a, b) => a - b);

      Object.keys(newUploadedFiles).forEach(key => {
        delete newUploadedFiles[key];
      });

      assetNumbers.forEach((originalNumber, index) => {
        const newNumber = index + 1;
        Object.keys(prev).forEach(key => {
          if (key.startsWith(`${originalNumber}-`)) {
            const fileType = key.split('-')[1];
            const newKey = `${newNumber}-${fileType}`;
            newUploadedFiles[newKey] = prev[key];
          }
        });
      });

      return newUploadedFiles;
    });

    setShowRemoveModal(false);
    setAssetToRemove(null);
  };

  const handleRemoveAssetClick = (assetNumber) => {
    setAssetToRemove(assetNumber);
    setShowRemoveModal(true);
  };

  // const handleFileChange = (event, fileType, assetNumber) => {
  //   const files = Array.from(event.target.files);
  //   const key = `${assetNumber}-${fileType}`;
  //   setUploadedFiles(prev => ({
  //     ...prev,
  //     [key]: files
  //   }));

  //   if (validationErrors[`${assetNumber}-${fileType}`]) {
  //     setValidationErrors(prev => {
  //       const newErrors = { ...prev };
  //       delete newErrors[`${assetNumber}-${fileType}`];
  //       return newErrors;
  //     });
  //   }
  // };

  const handleFileChange = async (event, fileType, assetNumber) => {
    const key = `${assetNumber}-${fileType}`;
    const selectedFiles = Array.from(event.target.files);
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    const maxFileSize = 2 * 1024 * 1024; // 2MB in bytes

    // Reset validation errors for this input
    if (validationErrors[key]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }

    // Check for invalid files
    const invalidFiles = selectedFiles.filter(file => {
      const isInvalidType = !allowedTypes.includes(file.type);
      const isInvalidSize = file.size > maxFileSize;
      return isInvalidType || isInvalidSize;
    });

    if (invalidFiles.length > 0) {
      // Set a validation error and return if there are invalid files
      setValidationErrors(prev => ({
        ...prev,
        [key]: t.fileTypeNotAllowed, // Using the same key for size and type for simplicity
      }));
      setShowValidationErrors(true);
      return; // Exit the function to prevent uploading invalid files
    }

    // Filter for only the valid files to upload
    const validFiles = selectedFiles.filter(file => !invalidFiles.includes(file));

    // If no valid files, also exit
    if (validFiles.length === 0) {
      return;
    }

    // Create temporary file objects for valid files
    const tempFiles = validFiles.map(file => ({
      id: crypto.randomUUID(),
      originalName: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading',
      url: null,
      fileName: null,
    }));

    // Update state with the valid files
    setUploadedFiles(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), ...tempFiles]
    }));

    // Loop through each valid file and upload it
    for (const file of validFiles) {
      const tempFile = tempFiles.find(tf => tf.originalName === file.name);

      try {
        console.log(`🌐 [API CALL] Starting upload for ${file.name} (${tempFile.id})`);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('bucketType', 'cust');

        const response = await fetch(`${config.API_BASE_URL}/upload`, {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();
        console.log(`📡 [API RESPONSE] Status: ${response.status} for ${file.name}`);

        if (!response.ok) {
          throw new Error(result.message || 'Upload failed');
        }

        setUploadedFiles(prev => {
          const newFilesForKey = (prev[key] || []).map(f => {
            if (f.id === tempFile.id) {
              return { ...f, status: 'success', url: result.url, fileName: result.fileName };
            }
            return f;
          });
          return { ...prev, [key]: newFilesForKey };
        });

      } catch (error) {
        console.error(`❌ [UPLOAD FAILED] for ${file.name}:`, error);

        setUploadedFiles(prev => {
          const newFilesForKey = (prev[key] || []).map(f => {
            if (f.id === tempFile.id) {
              return { ...f, status: 'failed', error: error.message };
            }
            return f;
          });
          return { ...prev, [key]: newFilesForKey };
        });
      }
    }
  };
  const FileUploadSection = ({ title, id, assetNumber }) => {
    const fileInputRef = React.useRef(null);
    const key = `${assetNumber}-${id}`;
    const files = uploadedFiles[key] || [];
    const hasValidationError = validationErrors[key] && showValidationErrors;

    return (
      <div className="space-y-2">
        <label className="text-[14px] font-bold text-[#161616]">
          <span className="text-red-500">*</span> {title.replace('* ', '')}
        </label>
        <div className={`border-2 border-dashed rounded-lg p-6 text-center bg-[#F8F9FA] ${hasValidationError ? 'border-red-500' : 'border-gray-300'
          }`}>
          <div className="mb-3">
            <img src={Upload} alt="Upload" className="w-8 h-8 mx-auto" />
          </div>
          <p className="text-[12px] text-[#6C737F] mb-3">{t.dragDropText}</p>
          <p className="text-[10px] text-[#6C737F] mb-4">{t.maxFileSize}</p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={(e) => handleFileChange(e, id, assetNumber)}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-[#161616] text-white px-4 py-2 rounded-md text-[12px] font-medium hover:bg-[#2a2a2a] transition-colors"
          >
            {t.browseFiles}
          </button>
          {files.length > 0 && (
            <div className="mt-3 text-left">
              <p className="text-[12px] font-medium text-[#161616] mb-2">
                {t.browseFiles}:
              </p>
              <ul className="space-y-1">
                {files.map(file => (
                  <li key={file.id} className="text-[10px] text-[#6C737F] flex items-center gap-2">
                    {file.originalName} ({file.status.toUpperCase()})
                    {file.status === 'success' && (
                      <span className="text-green-500">✓</span>
                    )}
                    {file.status === 'failed' && (
                      <span className="text-red-500">✗</span>
                    )}
                    {file.status === 'uploading' && (
                      // A simple spinner
                      <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-teal-500"></div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {hasValidationError && (
          <p className="text-red-500 text-[12px] mt-1">{validationErrors[key]}</p>
        )}
        <div className="flex items-start gap-2 mt-2">
          <div className="w-3 h-3 rounded-full bg-[#6C737F] flex items-center justify-center mt-0.5">
            <img src={BlackQuestion} alt="Info" className="w-4 h-4" />
          </div>
          <p className="text-[10px] text-[#6C737F]">{t.combineFiles}</p>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={`bg-white rounded-[6px] shadow-[0px_3px_12px_0px_rgba(47,43,61,0.14)] ${fontClass} ${isMapOpen ? 'filter blur-sm' : ''}`}>
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[20px] font-bold text-[#161616]">{t.title}</h2>
            <button
              onClick={addAsset}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-[14px] font-medium text-[#161616] hover:bg-gray-50 transition-colors"
            >
              {t.addAsset}
              <span className="text-lg">+</span>
            </button>
          </div>

          {Object.keys(expandedAssets).map(assetNumber => (
            <div key={assetNumber} className="bg-white border border-gray-200 rounded-[6px] shadow-sm mb-6">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[16px] font-bold text-[#161616]">
                    {t.assetsNumber} {assetNumber.padStart(2, '0')}
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleAssetExpansion(parseInt(assetNumber))}
                      className={`transform transition-transform ${expandedAssets[assetNumber] ? 'rotate-180' : ''}`}
                    >
                      <img src={Arrow} alt="Arrow" className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {expandedAssets[assetNumber] && (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <div>
                          <label className="text-[14px] font-bold text-[#161616] mb-2 block">
                            <span className="text-red-500">*</span> {t.plantName}
                          </label>
                          <input
                            type="text"
                            value={assets[assetNumber]?.plantName || ''}
                            onChange={(e) => handleInputChange(assetNumber, 'plantName', e.target.value)}
                            placeholder={t.plantNamePlaceholder}
                            className={`w-full p-3 border rounded-md text-[14px] focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${validationErrors[`${assetNumber}-plantName`] && showValidationErrors
                              ? 'border-red-500'
                              : 'border-gray-300'
                              }`}
                          />
                          {validationErrors[`${assetNumber}-plantName`] && showValidationErrors && (
                            <p className="text-red-500 text-[12px] mt-1">{validationErrors[`${assetNumber}-plantName`]}</p>
                          )}
                        </div>

                        <div>
                          <label className="text-[14px] font-bold text-[#161616] mb-2 block">
                            <span className="text-red-500">*</span> {t.expectedOperationalLifespan}
                          </label>
                          <input
                            type="number"
                            value={assets[assetNumber]?.expectedOperationalLifespan || ''}
                            onChange={(e) => handleInputChange(assetNumber, 'expectedOperationalLifespan', e.target.value)}
                            placeholder="5"
                            className={`w-full p-3 border rounded-md text-[14px] focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${validationErrors[`${assetNumber}-expectedOperationalLifespan`] && showValidationErrors
                              ? 'border-red-500'
                              : 'border-gray-300'
                              }`}
                          />
                          {validationErrors[`${assetNumber}-expectedOperationalLifespan`] && showValidationErrors && (
                            <p className="text-red-500 text-[12px] mt-1">{validationErrors[`${assetNumber}-expectedOperationalLifespan`]}</p>
                          )}
                        </div>

                        <div>
                          <label className="text-[14px] font-bold text-[#161616] mb-2 block">
                            <span className="text-red-500">*</span> {t.typeOfTreatment}
                          </label>
                          <select
                            value={assets[assetNumber]?.typeOfTreatment || ''}
                            onChange={(e) => handleInputChange(assetNumber, 'typeOfTreatment', e.target.value)}
                            className={`w-full p-3 border rounded-md text-[14px] focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-500 ${validationErrors[`${assetNumber}-typeOfTreatment`] && showValidationErrors
                              ? 'border-red-500'
                              : 'border-gray-300'
                              }`}
                          >
                            <option value="">{t.chooseTechnology}</option>
                            <option value="116950000">{language === 'ar' ? t.binary : 'Binary'}</option>
                            <option value="116950001">{language === 'ar' ? t.tertiary : 'Tertiary'}</option>
                            <option value="116950002">{language === 'ar' ? t.other : 'Other'}</option>
                          </select>
                          {validationErrors[`${assetNumber}-typeOfTreatment`] && showValidationErrors && (
                            <p className="text-red-500 text-[12px] mt-1">{validationErrors[`${assetNumber}-typeOfTreatment`]}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <label className="text-[14px] font-bold text-[#161616] mb-2 block">
                            <span className="text-red-500">*</span> {t.sector}
                          </label>
                          <select
                            value={assets[assetNumber]?.sector || ''}
                            onChange={(e) => handleInputChange(assetNumber, 'sector', e.target.value)}
                            className={`w-full p-3 border rounded-md text-[14px] focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-500 ${validationErrors[`${assetNumber}-sector`] && showValidationErrors
                              ? 'border-red-500'
                              : 'border-gray-300'
                              }`}
                          >

                            <option value="">{t.selectOption}</option>
                            <option value="116950000">{language === 'ar' ? t.central : 'Central'}</option>
                            <option value="116950001">{language === 'ar' ? t.northern : 'Northern'}</option>
                            <option value="116950002">{language === 'ar' ? t.southern : 'Southern'}</option>
                            <option value="116950003">{language === 'ar' ? t.northwestern : 'Northwestern'}</option>
                            <option value="116950004">{language === 'ar' ? t.western : 'Western'}</option>
                            <option value="116950005">{language === 'ar' ? t.eastern : 'Eastern'}</option>
                          </select>
                          {validationErrors[`${assetNumber}-sector`] && showValidationErrors && (
                            <p className="text-red-500 text-[12px] mt-1">{validationErrors[`${assetNumber}-sector`]}</p>
                          )}
                        </div>

                        <div>
                          <label className="text-[14px] font-bold text-[#161616] mb-2 block">
                            <span className="text-red-500">*</span> {t.designCapacity}
                          </label>
                          <input
                            type="number"
                            value={assets[assetNumber]?.designCapacity || ''}
                            onChange={(e) => handleInputChange(assetNumber, 'designCapacity', e.target.value)}
                            placeholder={language === 'ar' ? t.designCapacityPlaceholder : 'Design Capacity'}
                            className={`w-full p-3 border rounded-md text-[14px] focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${validationErrors[`${assetNumber}-designCapacity`] && showValidationErrors
                              ? 'border-red-500'
                              : 'border-gray-300'
                              }`}
                          />
                          {validationErrors[`${assetNumber}-designCapacity`] && showValidationErrors && (
                            <p className="text-red-500 text-[12px] mt-1">{validationErrors[`${assetNumber}-designCapacity`]}</p>
                          )}
                        </div>

                        <div>
                          <label className="text-[14px] font-bold text-[#161616] mb-2 block">
                            <span className="text-red-500">*</span> {t.commercialOperationDate}
                          </label>
                          <div className="relative">
                            <input
                              ref={(el) => {
                                if (el) {
                                  el.dateInputRef = el;
                                }
                              }}
                              type="date"
                              value={assets[assetNumber]?.commercialOperationDate || ''}
                              onChange={(e) => handleInputChange(assetNumber, 'commercialOperationDate', e.target.value)}
                              className={`w-full p-3 border rounded-md text-[14px] focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${validationErrors[`${assetNumber}-commercialOperationDate`] && showValidationErrors
                                ? 'border-red-500'
                                : 'border-gray-300'
                                }`}
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-0.5">
                              <button
                                type="button"
                                onClick={(e) => {
                                  const input = e.target.closest('.relative').querySelector('input[type="date"]');
                                  if (input) {
                                    input.focus();
                                    input.showPicker && input.showPicker();
                                  }
                                }}
                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                              >
                                <svg 
                                  className="w-4 h-4 text-gray-400" 
                                  fill="none" 
                                  stroke="currentColor" 
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          {validationErrors[`${assetNumber}-commercialOperationDate`] && showValidationErrors && (
                            <p className="text-red-500 text-[12px] mt-1">{validationErrors[`${assetNumber}-commercialOperationDate`]}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div></div>
                        <div></div>
                      </div>
                    </div>

                    <hr className="border-gray-200 my-6" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <div>
                          <label className="text-[14px] font-bold text-[#161616] mb-2 block">
                            <span className="text-red-500">*</span> {t.region}
                          </label>
                          <input
                            type="text"
                            value={assets[assetNumber]?.region || ''}
                            onChange={(e) => handleInputChange(assetNumber, 'region', e.target.value)}
                            placeholder={t.riyadhRegion}
                            className="w-full p-3 border border-gray-300 rounded-md text-[14px] focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                          />
                        </div>

                        <div>
                          <label className="text-[14px] font-bold text-[#161616] mb-2 block">
                            <span className="text-red-500">*</span> {t.nationalAddress}
                          </label>
                          <input
                            type="text"
                            value={assets[assetNumber]?.nationalAddress || ''}
                            onChange={(e) => handleInputChange(assetNumber, 'nationalAddress', e.target.value)}
                            placeholder={t.sampleAddress}
                            className="w-full p-3 border border-gray-300 rounded-md text-[14px] focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                          />
                        </div>

                        <div>
                          <label className="text-[14px] font-bold text-[#161616] mb-2 block">
                            <span className="text-red-500">*</span> {t.gpsLongitude}
                          </label>
                          <input
                            type="number"
                            step="any"
                            value={assets[assetNumber]?.gpsLongitude || ''}
                            onChange={(e) => handleInputChange(assetNumber, 'gpsLongitude', e.target.value)}
                            placeholder={t.sampleLongitude}
                            className="w-full p-3 border border-gray-300 rounded-md text-[14px] focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                          />
                          <p className="text-[10px] text-[#6C737F] mt-1 flex items-center gap-1">
                            <img src={WhiteQuestion} alt="Info" className="w-3 h-3" />
                            {t.longitudeNote}
                          </p>
                          <button
                            onClick={() => handlePinLocationClick(assetNumber)}
                            className={`mt-3 bg-[#1B8354] text-white px-4 py-2 rounded-md text-[12px] font-medium hover:bg-[#146B43] transition-colors flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'
                              }`}
                          >
                            <img src={Pin} alt="Pin" className="w-4 h-4" />
                            {language === 'ar' ? 'تحديد الموقع على الخريطة' : 'Pin Location on Map'}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <label className="text-[14px] font-bold text-[#161616] mb-2 block">
                            <span className="text-red-500">*</span> {t.cityLocation}
                          </label>
                          <input
                            type="text"
                            value={assets[assetNumber]?.cityLocation || ''}
                            onChange={(e) => handleInputChange(assetNumber, 'cityLocation', e.target.value)}
                            placeholder={t.riyadh}
                            className="w-full p-3 border border-gray-300 rounded-md text-[14px] focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                          />
                        </div>

                        <div>
                          <label className="text-[14px] font-bold text-[#161616] mb-2 block">
                            {t.locationDescription}
                          </label>
                          <input
                            type="text"
                            value={assets[assetNumber]?.locationDescription || ''}
                            onChange={(e) => handleInputChange(assetNumber, 'locationDescription', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md text-[14px] focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                          />
                        </div>

                        <div>
                          <label className="text-[14px] font-bold text-[#161616] mb-2 block">
                            <span className="text-red-500">*</span> {t.gpsLatitude}
                          </label>
                          <input
                            type="number"
                            step="any"
                            value={assets[assetNumber]?.gpsLatitude || ''}
                            onChange={(e) => handleInputChange(assetNumber, 'gpsLatitude', e.target.value)}
                            placeholder={t.sampleLatitude}
                            className="w-full p-3 border border-gray-300 rounded-md text-[14px] focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                          />
                          <p className="text-[10px] text-[#6C737F] mt-1 flex items-center gap-1">
                            <img src={WhiteQuestion} alt="Info" className="w-3 h-3" />
                            {t.latitudeNote}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <FileUploadSection title={`* ${t.landLayoutPlan}`} id="landLayout" assetNumber={assetNumber} />
                        <button
                          onClick={() => handleRemoveAssetClick(parseInt(assetNumber))}
                          className="mt-4 text-red-500 text-[12px] hover:text-red-700 flex items-center gap-1 border border-red-300 px-3 py-2 rounded-md hover:bg-red-50 transition-colors"
                        >
                          {t.removeAsset}
                          <img src={DeleteAsset} alt="Delete" className="w-4 h-4" />
                        </button>
                      </div>
                      <FileUploadSection title={`* ${t.operationalPermit}`} id="operationalPermit" assetNumber={assetNumber} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {isMapOpen && (
        <MapPicker
          apiKey={Maps_API_KEY}
          geocodingApiKey={Geocoding_API_KEY}
          onLocationSelect={handleLocationSelect}
          onClose={() => setIsMapOpen(false)}
          language={language}
        />
      )}

      <RemoveAssetModal
        isOpen={showRemoveModal}
        onClose={() => {
          setShowRemoveModal(false);
          setAssetToRemove(null);
        }}
        onConfirm={() => removeAsset(assetToRemove)}
        assetNumber={assetToRemove}
        language={language}
      />
    </>
  );
});

export default AssetForm;