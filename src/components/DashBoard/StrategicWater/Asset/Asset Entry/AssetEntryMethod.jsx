import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import AssetForm from '../Asset Form/AssetForm';
import SwitchToManual from '../Asset Form/SwitchToManual';
import SwitchToExcel from '../Asset Form/SwitchToExcel';
import DeleteFile from '../Asset Form/DeleteFile';
import Download from '../Asset Form/Download.png';
import Upload from '../Asset Form/Upload.png';
import BlackQuestion from '../Asset Form/BlackQuestion.png';

const AssetEntryMethod = forwardRef(({ language = 'en', onMethodChange }, ref) => {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showSwitchToManualModal, setShowSwitchToManualModal] = useState(false);
  const [showSwitchToExcelModal, setShowSwitchToExcelModal] = useState(false);
  const [showDeleteFileModal, setShowDeleteFileModal] = useState(false);
  const [hasDataFromExcel, setHasDataFromExcel] = useState(false);
  const assetFormRef = useRef(null);

  const translations = {
    en: {
      title: 'Asset Entry Method',
      uploadAssets: 'Upload Assets',
      question: 'How would you like to complete your asset form?',
      useExcelTemplate: 'Use Excel Template',
      excelDescription: 'You will need to download an Excel sheet template and then upload the form and the system will extract the information',
      fillOutManually: 'Fill Out Manually',
      manualDescription: 'You will need to fill in the form manually',
      assetRegistration: 'Asset Registration',
      steps: 'Steps:',
      step01Title: 'Step 01: Download Template',
      step01Description: 'Download the Template and fill it out and upload the Excel Sheet.',
      downloadButton: 'Download Excel Template',
      step02Title: 'Step 02: Upload Excel Template',
      dragDropText: 'Drag and drop files here to upload',
      fileInfo: 'Maximum file size allowed is 2MB, supported file formats include .xlsx and .xls.',
      browseFiles: 'Browse Files',
      combineInfo: 'Combine all your files in 1 PDF document.',
      fileUploadRequired: 'Please upload an Excel file or select a manual entry method.',
      methodRequired: 'Please select a method to proceed.',
    },
    ar: {
      title: 'طريقة إدخال الأصول',
      uploadAssets: 'رفع الأصول',
      question: 'كيف تريد إكمال نموذج الأصول الخاص بك؟',
      useExcelTemplate: 'استخدام قالب إكسل',
      excelDescription: 'ستحتاج إلى تنزيل قالب ورقة إكسل ثم رفع النموذج وسيقوم النظام باستخراج المعلومات',
      fillOutManually: 'املأ يدوياً',
      manualDescription: 'ستحتاج إلى ملء النموذج يدوياً',
      assetRegistration: 'تسجيل الأصول',
      steps: 'الخطوات:',
      step01Title: 'الخطوة 01: تحميل القالب',
      step01Description: 'قم بتنزيل القالب واملأه وارفع ملف إكسل.',
      downloadButton: 'تحميل قالب إكسل',
      step02Title: 'الخطوة 02: رفع قالب إكسل',
      dragDropText: 'اسحب وأفلت الملفات هنا للرفع',
      fileInfo: 'الحد الأقصى لحجم الملف المسموح به هو 2 ميجابايت، تتضمن تنسيقات الملفات المدعومة .xlsx و .xls.',
      browseFiles: 'تصفح الملفات',
      combineInfo: 'ادمج جميع ملفاتك في مستند PDF واحد.',
      fileUploadRequired: 'يرجى رفع ملف إكسل أو تحديد طريقة الإدخال اليدوي.',
      methodRequired: 'يرجى اختيار طريقة للمتابعة.',
    },
  };

  const t = translations[language] || translations.en;
  const fontClass = "font-['IBM_Plex_Sans_Arabic']";
  const [dragActive, setDragActive] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0]);
      setHasDataFromExcel(true);
      if (selectedMethod !== 'excel') {
        setSelectedMethod('excel');
      }
      setValidationError('');
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
      setHasDataFromExcel(true);
      if (selectedMethod !== 'excel') {
        setSelectedMethod('excel');
      }
      setValidationError('');
    }
  };

  const removeUploadedFile = () => {
    setShowDeleteFileModal(true);
  };

  const handleDeleteFileConfirm = () => {
    setUploadedFile(null);
    setHasDataFromExcel(false);
    setShowDeleteFileModal(false);
    const fileInput = document.getElementById('file-upload');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const downloadExcelTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Plant Name,Sector,City,Design Capacity,Type of Treatment,Commercial Operation Date,Expected Operational Lifespan,Region,City Location,National Address,Location Description,GPS Longitude,GPS Latitude\n"
      + "Sample Plant,Public,Riyadh,1000,Biological Treatment,01/01/2025,25,Riyadh Region,Riyadh,RGNXXXXX,Sample Location,24.7136,46.6753\n";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "asset_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleMethodChange = (newMethod) => {
    if (selectedMethod === 'excel' && newMethod === 'manual' && hasDataFromExcel) {
      setShowSwitchToManualModal(true);
      return;
    }
    
    if (selectedMethod === 'manual' && newMethod === 'excel' && assetFormRef.current) {
      // Assuming a simple check for data. The original code used a hasManualData flag.
      // We will now check if there is data in the form.
      const formData = assetFormRef.current.getData();
      if (Object.keys(formData).length > 0) {
        setShowSwitchToExcelModal(true);
        return;
      }
    }
    
    setSelectedMethod(newMethod);
    setValidationError('');
  };

  const handleSwitchToManualConfirm = () => {
    setSelectedMethod('manual');
    setUploadedFile(null);
    setHasDataFromExcel(false);
    setShowSwitchToManualModal(false);
  };

  const handleSwitchToExcelConfirm = () => {
    setSelectedMethod('excel');
    setUploadedFile(null);
    setHasDataFromExcel(false);
    setShowSwitchToExcelModal(false);
  };

  const shouldShowAssetForm = uploadedFile || selectedMethod === 'manual';

  // --- REFACTORED: Expose parent functions to TopDesign.jsx ---
  const validate = () => {
    if (!selectedMethod) {
      setValidationError(t.methodRequired);
      return false;
    }
    
    if (selectedMethod === 'excel' && !uploadedFile) {
      setValidationError(t.fileUploadRequired);
      return false;
    }
    
    setValidationError('');
    
    if (selectedMethod === 'manual' && assetFormRef.current) {
      return assetFormRef.current.validate();
    }
    
    return true;
  };

  const getData = () => {
    if (selectedMethod === 'manual' && assetFormRef.current) {
      return {
        assets: assetFormRef.current.getData()
      };
    }
    
    if (selectedMethod === 'excel' && uploadedFile) {
      // In a real application, we would parse the Excel file here.
      // For this example, we return an empty array with the file info.
      return {
        assets: [],
        excelFile: {
          name: uploadedFile.name,
          size: uploadedFile.size,
          type: uploadedFile.type,
        }
      };
    }
    
    return null;
  };

  useImperativeHandle(ref, () => ({
    validate,
    getData
  }));

  return (
    <>
      <div className={`bg-white rounded-[6px] shadow-[0px_3px_12px_0px_rgba(47,43,61,0.14)] ${fontClass}`}>
        <div className="p-8">
          <h2 className="text-[20px] font-medium text-[#161616] mb-8">{t.title}</h2>
          
          <hr className="border-gray-200 mb-8" />
          
          <div className="mb-6">
            <h3 className="text-[16px] font-medium text-[#161616] mb-4">{t.uploadAssets}</h3>
            <p className="text-[14px] text-[#6C737F] mb-6">{t.question}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <input
                type="radio"
                id="excel-template"
                name="asset-method"
                value="excel"
                checked={selectedMethod === 'excel'}
                onChange={(e) => handleMethodChange(e.target.value)}
                className="mt-1 w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
              />
              <div className="flex-1">
                <label htmlFor="excel-template" className="text-[14px] font-medium text-[#161616] cursor-pointer">
                  {t.useExcelTemplate}
                </label>
                <p className="text-[12px] text-[#6C737F] mt-2 leading-relaxed max-w-[280px]">
                  {t.excelDescription}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <input
                type="radio"
                id="fill-manually"
                name="asset-method"
                value="manual"
                checked={selectedMethod === 'manual'}
                onChange={(e) => handleMethodChange(e.target.value)}
                className="mt-1 w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
              />
              <div className="flex-1">
                <label htmlFor="fill-manually" className="text-[14px] font-medium text-[#161616] cursor-pointer">
                  {t.fillOutManually}
                </label>
                <p className="text-[12px] text-[#6C737F] mt-2 leading-relaxed">
                  {t.manualDescription}
                </p>
              </div>
            </div>
          </div>
          {validationError && (
            <p className="text-red-500 text-[12px] mt-2">{validationError}</p>
          )}
        </div>
      </div>

      {selectedMethod === 'excel' && (
        <div className={`bg-white rounded-[6px] shadow-[0px_3px_12px_0px_rgba(47,43,61,0.14)] ${fontClass} mt-6`}>
          <div className="p-8">
            <h2 className="text-[20px] font-semibold text-[#161616] mb-8">{t.assetRegistration}</h2>
            
            <hr className="border-gray-200 mb-8" />
            
            <div className="mb-4">
              <h3 className="text-[16px] font-semibold text-[#161616] mb-4">{t.steps}</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="text-[16px] font-semibold text-[#161616] mb-4">{t.step01Title}</h4>
                <p className="text-[14px] text-[#6C737F] mb-6 leading-relaxed">
                  {t.step01Description}
                </p>
                <button 
                  onClick={downloadExcelTemplate}
                  className="bg-[#1B8354] text-white px-6 py-3 rounded-md text-[14px] font-medium hover:bg-[#146B43] transition-colors flex items-center gap-2"
                >
                  {t.downloadButton}
                  <span className="text-lg"><img src={Download} alt="Download" className="w-5 h-5" /></span>
                </button>
              </div>

              <div>
                <h4 className="text-[16px] font-semibold text-[#161616] mb-4">{t.step02Title}</h4>
                
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center bg-[#F8F9FA] transition-colors ${
                    dragActive ? 'border-[#1B8354] bg-[#F7FDF9]' : 'border-gray-300'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="mb-4">
                    <img src={Upload} alt="Upload" className="w-12 h-12 mx-auto" />
                  </div>
                  
                  <p className="text-[14px] text-[#161616] font-medium mb-2">
                    {t.dragDropText}
                  </p>
                  
                  <p className="text-[12px] text-[#6C737F] mb-6 leading-relaxed max-w-[280px] mx-auto">
                    {t.fileInfo}
                  </p>
                  
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                    accept=".xlsx,.xls,.csv"
                  />
                  
                  <label
                    htmlFor="file-upload"
                    className="bg-[#161616] text-white px-6 py-2 rounded-md text-[14px] font-medium hover:bg-[#2a2a2a] transition-colors cursor-pointer inline-block"
                  >
                    {t.browseFiles}
                  </label>
                </div>
                
                {uploadedFile && (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-md p-3 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-[10px]">✓</span>
                      </div>
                      <span className="text-[12px] text-green-700 font-medium">
                        {uploadedFile.name}
                      </span>
                    </div>
                    <button
                      onClick={removeUploadedFile}
                      className="text-gray-400 hover:text-gray-600 text-[16px] font-bold"
                    >
                      ×
                    </button>
                  </div>
                )}
                
                <div className="flex items-start gap-2 mt-4">
                  <div className="w-4 h-4 rounded-full bg-[#6C737F] flex items-center justify-center mt-0.5">
                    <img src={BlackQuestion} alt="BlackQuestion" className="w-12 h-12 mx-auto" />
                  </div>
                  <p className="text-[12px] text-[#6C737F]">
                    {t.combineInfo}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {shouldShowAssetForm && (
        <div className="mt-6">
          <AssetForm 
            ref={assetFormRef}
            language={language}
          />
        </div>
      )}

      <SwitchToManual
        isOpen={showSwitchToManualModal}
        onClose={() => setShowSwitchToManualModal(false)}
        onConfirm={handleSwitchToManualConfirm}
        language={language}
      />

      <SwitchToExcel
        isOpen={showSwitchToExcelModal}
        onClose={() => setShowSwitchToExcelModal(false)}
        onConfirm={handleSwitchToExcelConfirm}
        language={language}
      />

      <DeleteFile
        isOpen={showDeleteFileModal}
        onClose={() => setShowDeleteFileModal(false)}
        onConfirm={handleDeleteFileConfirm}
        language={language}
      />
    </>
  );
});

export default AssetEntryMethod;