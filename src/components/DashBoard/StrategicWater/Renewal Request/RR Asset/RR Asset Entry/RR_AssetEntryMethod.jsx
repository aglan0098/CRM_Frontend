import React, { useState, useRef } from 'react';
import AssetForm from '../RR Asset Form/RR_AssetForm';
import SwitchToManual from '../RR Asset Form/RR_SwitchToManual';
import SwitchToExcel from '../RR Asset Form/RR_SwitchToExcel';
import DeleteFile from '../RR Asset Form/RR_DeleteFile';
import Download from '../RR Asset Form/Download.png';
import Upload from '../RR Asset Form/Upload.png';
import BlackQuestion from '../RR Asset Form/BlackQuestion.png';

const RR_AssetEntryMethod = ({ language = 'en', currentStep, setCurrentStep }) => {
  const [selectedMethod, setSelectedMethod] = useState('manual'); // Default to manual to show Asset Form
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showSaveAsDraftModal, setShowSaveAsDraftModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSwitchToManualModal, setShowSwitchToManualModal] = useState(false);
  const [showSwitchToExcelModal, setShowSwitchToExcelModal] = useState(false);
  const [showDeleteFileModal, setShowDeleteFileModal] = useState(false);
  const [hasDataFromExcel, setHasDataFromExcel] = useState(false);
  const [hasManualData, setHasManualData] = useState(false);
  const [clickedButton, setClickedButton] = useState('');
  const [hasValidationErrors, setHasValidationErrors] = useState(false);
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
      // Asset Registration section
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
      // Navigation buttons
      back: 'Back',
      next: 'Next',
      saveAsDraft: 'Save as Draft',
      cancel: 'Cancel',
    },
    ar: {
      title: 'طريقة إدخال الأصول',
      uploadAssets: 'رفع الأصول',
      question: 'كيف تريد إكمال نموذج الأصول الخاص بك؟',
      useExcelTemplate: 'استخدام قالب إكسل',
      excelDescription: 'ستحتاج إلى تنزيل قالب ورقة إكسل ثم رفع النموذج وسيقوم النظام باستخراج المعلومات',
      fillOutManually: 'املأ يدوياً',
      manualDescription: 'ستحتاج إلى ملء النموذج يدوياً',
      // Asset Registration section
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
      // Navigation buttons
      back: 'رجوع',
      next: 'التالي',
      saveAsDraft: 'حفظ كمسودة',
      cancel: 'إلغاء',
    },
  };

  const t = translations[language] || translations.en;
  const fontClass = "font-['IBM_Plex_Sans_Arabic']";
  const [dragActive, setDragActive] = useState(false);

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
      // Handle file upload logic here
      console.log('Files dropped:', e.dataTransfer.files);
      setUploadedFile(e.dataTransfer.files[0]);
      // Mark that we have data from Excel
      setHasDataFromExcel(true);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      // Handle file selection logic here
      console.log('Files selected:', e.target.files);
      setUploadedFile(e.target.files[0]);
      // Mark that we have data from Excel
      setHasDataFromExcel(true);
    }
  };

  const removeUploadedFile = () => {
    setShowDeleteFileModal(true);
  };

  const handleDeleteFileConfirm = () => {
    setUploadedFile(null);
    setHasDataFromExcel(false);
    setShowDeleteFileModal(false);
    // Clear the file input value to allow re-uploading the same file
    const fileInput = document.getElementById('file-upload');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const downloadExcelTemplate = () => {
    // Create a simple Excel template data
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

  const handleCancelConfirm = () => {
    console.log('Cancelling...');
    
    // Clear uploaded file and Excel data
    setUploadedFile(null);
    setHasDataFromExcel(false);
    
    // Clear manual data flag
    setHasManualData(false);
    
    // Clear the file input value to allow re-uploading the same file
    const fileInput = document.getElementById('file-upload');
    if (fileInput) {
      fileInput.value = '';
    }
    
    // Reset selected method to manual (this will keep the asset form visible)
    setSelectedMethod('manual');
    
    setShowCancelModal(false);
  };

  const handleSaveAsDraft = () => {
    setShowSaveAsDraftModal(true);
  };

  const handleCancel = () => {
    // Only show modal if there's data to potentially lose
    if (shouldShowAssetForm) {
      setShowCancelModal(true);
    }
  };

  const handleBack = () => {
    setClickedButton('back');
    // Handle back navigation logic here
    console.log('Back clicked');
    // Go back to previous step if we're not already at step 1
    if (setCurrentStep && currentStep && currentStep > 1) {
      setCurrentStep(currentStep - 1);
      console.log(`Step moved back to ${currentStep - 1}`);
    }
  };

  const handleNext = () => {
    setClickedButton('next');
    
    // If we have an asset form, validate it first
    if (shouldShowAssetForm && assetFormRef.current) {
      try {
        const isValid = assetFormRef.current.handleValidation();
        if (!isValid) {
          console.log('Validation failed, not proceeding to next step');
          return;
        }
      } catch (error) {
        console.error('Validation error:', error);
        return;
      }
    }
    
    // Progress to next step
    if (setCurrentStep) {
      setCurrentStep(2);
      console.log('Step progressed to 2');
    }
    console.log('Next clicked');
  };

  const handleValidationError = (errors) => {
    setHasValidationErrors(Object.keys(errors).length > 0);
    console.log('Validation errors:', errors);
  };

  const handleMethodChange = (newMethod) => {
    // If switching from Excel (with data) to Manual, show confirmation modal
    if (selectedMethod === 'excel' && newMethod === 'manual' && hasDataFromExcel) {
      setShowSwitchToManualModal(true);
      return;
    }
    
    // If switching from Manual (with data) to Excel, show confirmation modal
    if (selectedMethod === 'manual' && newMethod === 'excel' && hasManualData) {
      setShowSwitchToExcelModal(true);
      return;
    }
    
    // For other cases, just switch directly
    setSelectedMethod(newMethod);
    
    // If switching to Excel, clear any previous manual data flags
    if (newMethod === 'excel') {
      setHasDataFromExcel(false);
      setHasManualData(false);
    }
    
    // If switching to Manual, clear any previous Excel data flags
    if (newMethod === 'manual') {
      setHasDataFromExcel(false);
      setHasManualData(false);
    }
  };

  const handleSwitchToManualConfirm = () => {
    setSelectedMethod('manual');
    setUploadedFile(null);
    setHasDataFromExcel(false);
    setHasManualData(false);
    setShowSwitchToManualModal(false);
  };

  const handleSwitchToExcelConfirm = () => {
    setSelectedMethod('excel');
    setHasManualData(false);
    setHasDataFromExcel(false);
    setShowSwitchToExcelModal(false);
  };

  // Check if AssetForm should be rendered - Always show since we removed the method selection
  const shouldShowAssetForm = true; // Always show Asset Form

  return (
    <>
      {/* AssetForm Component - Always shown (previously conditional) */}
      <div className="mt-0">
        <AssetForm 
          ref={assetFormRef}
          language={language} 
          showSaveAsDraftModal={showSaveAsDraftModal}
          setShowSaveAsDraftModal={setShowSaveAsDraftModal}
          showCancelModal={showCancelModal}
          setShowCancelModal={setShowCancelModal}
          hasManualData={hasManualData}
          setHasManualData={setHasManualData}
          onCancelConfirm={handleCancelConfirm}
          onValidationError={handleValidationError}
        />
      </div>

      {/* Navigation Buttons - Keep exactly as they were */}
      <div className="flex items-center gap-3 mt-8 pt-6">
        <button 
          onClick={handleBack}
          className={`flex items-center gap-2 px-4 py-2 text-[14px] font-medium border rounded-md transition-colors ${
            clickedButton === 'back' 
              ? 'bg-[#1B8354] text-white border-[#1B8354]' 
              : 'text-[#6C737F] border-gray-300 hover:text-[#161616] hover:border-gray-400'
          }`}
        >
          <span>&#8249;</span>
          {t.back}
        </button>
        
        <button 
          onClick={handleNext}
          className={`px-4 py-2 text-[14px] font-medium border rounded-md transition-colors flex items-center gap-2 ${
            clickedButton === 'next' 
              ? 'bg-[#1B8354] text-white border-[#1B8354]' 
              : 'text-[#6C737F] border-gray-300 hover:text-[#161616] hover:border-gray-400'
          }`}
        >
          {t.next}
          <span>&#8250;</span>
        </button>
        
        <button 
          onClick={handleSaveAsDraft}
          disabled={!shouldShowAssetForm}
          className={`px-4 py-2 text-[14px] font-medium transition-colors ${
            shouldShowAssetForm 
              ? 'text-[#6C737F] hover:text-[#161616] cursor-pointer' 
              : 'text-gray-400 cursor-not-allowed'
          }`}
        >
          {t.saveAsDraft}
        </button>
        
        <button 
          onClick={handleCancel}
          disabled={!shouldShowAssetForm}
          className={`px-4 py-2 text-[14px] font-medium transition-colors ${
            shouldShowAssetForm 
              ? 'text-[#6C737F] hover:text-[#161616] cursor-pointer' 
              : 'text-gray-400 cursor-not-allowed'
          }`}
        >
          {t.cancel}
        </button>
      </div>

      {/* Switch To Manual Modal */}
      <SwitchToManual
        isOpen={showSwitchToManualModal}
        onClose={() => setShowSwitchToManualModal(false)}
        onConfirm={handleSwitchToManualConfirm}
        language={language}
      />

      {/* Switch To Excel Modal */}
      <SwitchToExcel
        isOpen={showSwitchToExcelModal}
        onClose={() => setShowSwitchToExcelModal(false)}
        onConfirm={handleSwitchToExcelConfirm}
        language={language}
      />

      {/* Delete File Modal */}
      <DeleteFile
        isOpen={showDeleteFileModal}
        onClose={() => setShowDeleteFileModal(false)}
        onConfirm={handleDeleteFileConfirm}
        language={language}
      />
    </>
  );
};

export default RR_AssetEntryMethod;