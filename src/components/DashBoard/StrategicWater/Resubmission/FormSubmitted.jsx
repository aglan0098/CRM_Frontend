import React, { useState, useRef } from 'react';
import AssetForm from '../Asset/Asset Form/AssetForm';
import ProjectInformation from '../ProjectInfo/ProjectInformation';
import Contracts from '../Contracts/Contracts';
import Declaration from '../Declaration/Declaration';
import SwitchToManual from '../Asset/Asset Form/SwitchToManual';
import SwitchToExcel from '../Asset/Asset Form/SwitchToExcel';
import DeleteFile from '../Asset/Asset Form/DeleteFile';
import AdditionalInformationTab from '../MyRequests/StrategicWaterStorageRequest/AdditionalInformationTab';
import Download from '../Asset/Asset Form/Download.png';
import Upload from '../Asset/Asset Form/Upload.png';
import BlackQuestion from '../Asset/Asset Form/BlackQuestion.png';

const FormSubmitted = ({ language = 'en', currentStep, setCurrentStep }) => {
  const [selectedMethod, setSelectedMethod] = useState('');
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
  const [activeTab, setActiveTab] = useState('Additional Information');
  
  // State to store data from each tab
  const [tabData, setTabData] = useState({
    'Additional Information': {},
    'Assets': {},
    'Project Information': {},
    'Contracts': {},
    'Declaration': {}
  });
  
  const assetFormRef = useRef(null);
  const projectInfoRef = useRef(null);
  const contractsRef = useRef(null);
  const declarationRef = useRef(null);

  const translations = {
    en: {
      title: 'Form Submitted',
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
      // Tabs
      additionalInformation: 'Additional Information',
      assets: 'Assets',
      projectInformation: 'Project Information',
      contracts: 'Contracts',
      declaration: 'Declaration',
    },
    ar: {
      title: 'تم إرسال النموذج',
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
      // Tabs
      additionalInformation: 'معلومات إضافية',
      assets: 'الأصول',
      projectInformation: 'معلومات المشروع',
      contracts: 'العقود',
      declaration: 'الإقرار',
    },
  };

  const t = translations[language] || translations.en;
  const fontClass = "font-['IBM_Plex_Sans_Arabic']";
  const [dragActive, setDragActive] = useState(false);

  const tabs = [
    { id: 'Additional Information', label: t.additionalInformation },
    { id: 'Assets', label: t.assets },
    { id: 'Project Information', label: t.projectInformation },
    { id: 'Contracts', label: t.contracts },
    { id: 'Declaration', label: t.declaration },
  ];

  // Function to capture data from current tab before switching
  const captureCurrentTabData = (currentTab) => {
    let data = {};
    
    switch (currentTab) {
      case 'Additional Information':
        // For Additional Information tab, we don't have form fields yet
        data = { tabName: 'Additional Information', timestamp: new Date().toISOString() };
        break;
      case 'Assets':
        // Get data from AssetForm if available
        if (assetFormRef.current && typeof assetFormRef.current.getFormData === 'function') {
          data = assetFormRef.current.getFormData();
        } else {
          data = { tabName: 'Assets', timestamp: new Date().toISOString() };
        }
        break;
      case 'Project Information':
        // Get data from ProjectInformation if available
        if (projectInfoRef.current && typeof projectInfoRef.current.getFormData === 'function') {
          data = projectInfoRef.current.getFormData();
        } else {
          data = { tabName: 'Project Information', timestamp: new Date().toISOString() };
        }
        break;
      case 'Contracts':
        // Get data from Contracts if available
        if (contractsRef.current && typeof contractsRef.current.getFormData === 'function') {
          data = contractsRef.current.getFormData();
        } else {
          data = { tabName: 'Contracts', timestamp: new Date().toISOString() };
        }
        break;
      case 'Declaration':
        // Get data from Declaration if available
        if (declarationRef.current && typeof declarationRef.current.getFormData === 'function') {
          data = declarationRef.current.getFormData();
        } else {
          data = { tabName: 'Declaration', timestamp: new Date().toISOString() };
        }
        break;
      default:
        data = { tabName: currentTab, timestamp: new Date().toISOString() };
    }
    
    return data;
  };

  const handleTabClick = (tabId) => {
    // Capture current tab data before switching
    const currentTabData = captureCurrentTabData(activeTab);
    
    // Update tab data state
    setTabData(prev => ({
      ...prev,
      [activeTab]: currentTabData
    }));
    
    // Log the previous tab data to console
    console.log(`${activeTab} Tab Data:`, currentTabData);
    
    // Switch to new tab
    setActiveTab(tabId);
    console.log('Tab clicked:', tabId);
  };

  const handleTabNavigation = (direction) => {
    const tabOrder = ['Additional Information', 'Assets', 'Project Information', 'Contracts', 'Declaration'];
    const currentIndex = tabOrder.indexOf(activeTab);
    
    // Capture current tab data before navigating
    const currentTabData = captureCurrentTabData(activeTab);
    
    // Update tab data state
    setTabData(prev => ({
      ...prev,
      [activeTab]: currentTabData
    }));
    
    // Log the current tab data to console
    console.log(`${activeTab} Tab Data:`, currentTabData);
    
    if (direction === 'next' && currentIndex < tabOrder.length - 1) {
      setActiveTab(tabOrder[currentIndex + 1]);
    } else if (direction === 'back' && currentIndex > 0) {
      setActiveTab(tabOrder[currentIndex - 1]);
    }
  };

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
    
    // Reset selected method to empty (this will hide the asset form)
    setSelectedMethod('');
    
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

  // Check if AssetForm should be rendered
  const shouldShowAssetForm = uploadedFile || selectedMethod === 'manual';

  return (
    <>
      <div className={`bg-white rounded-[6px] shadow-[0px_3px_12px_0px_rgba(47,43,61,0.14)] ${fontClass}`}>
        <div className="p-8">
          <h2 className="text-[20px] font-medium text-[#161616] mb-8">{t.title}</h2>
          
          {/* Tabs Section */}
          <div className="mb-8">
            <div className="flex border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex-1 px-4 py-2 text-[14px] font-medium transition-colors relative ${
                    activeTab === tab.id
                      ? 'text-[#1B8354] border-b-2 border-[#1B8354]'
                      : 'text-[#6C737F] hover:text-[#161616]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content - Show different components based on active tab */}
          {activeTab === 'Additional Information' && (
            <div className="mt-6">
              <AdditionalInformationTab 
                language={language}
                currentStep={1}
                setCurrentStep={(step) => {
                  if (step > 1) handleTabNavigation('next');
                  else handleTabNavigation('back');
                }}
              />
              
              {/* Navigation Buttons for Additional Information Tab */}
              <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-200">
                <button 
                  onClick={() => handleTabNavigation('back')}
                  className="px-6 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50"
                >
                  {t.back}
                </button>
                <button 
                  onClick={() => handleTabNavigation('next')}
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
          )}

          {activeTab === 'Assets' && (
            <div className="mt-6">
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
                currentStep={1}
                setCurrentStep={(step) => {
                  if (step > 1) handleTabNavigation('next');
                  else handleTabNavigation('back');
                }}
              />
              
              {/* Navigation Buttons for Assets Tab */}
              <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-200">
                <button 
                  onClick={() => handleTabNavigation('back')}
                  className="px-6 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50"
                >
                  {t.back}
                </button>
                <button 
                  onClick={() => handleTabNavigation('next')}
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
          )}

          {activeTab === 'Project Information' && (
            <div className="mt-6">
              <ProjectInformation 
                ref={projectInfoRef}
                language={language}
                currentStep={1}
                setCurrentStep={(step) => {
                  if (step > 1) handleTabNavigation('next');
                  else handleTabNavigation('back');
                }}
              />
            </div>
          )}

          {activeTab === 'Contracts' && (
            <div className="mt-6">
              <Contracts 
                ref={contractsRef}
                language={language}
                currentStep={1}
                setCurrentStep={(step) => {
                  if (step > 1) handleTabNavigation('next');
                  else handleTabNavigation('back');
                }}
              />
            </div>
          )}

          {activeTab === 'Declaration' && (
            <div className="mt-6">
              <Declaration 
                ref={declarationRef}
                language={language}
                currentStep={1}
                setCurrentStep={(step) => {
                  if (step > 1) handleTabNavigation('next');
                  else handleTabNavigation('back');
                }}
                onDeclareSubmit={() => console.log('Declaration submitted')}
              />
            </div>
          )}
        </div>
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

export default FormSubmitted;