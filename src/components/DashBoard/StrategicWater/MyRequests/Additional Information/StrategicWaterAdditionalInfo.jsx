import React, { useState, useEffect, useRef } from 'react';

// Child Component Imports
import AI_ApplicationDetails from './AI_ApplicationDetails';
import AI_AdditionalInformationTab from './AI_AdditionalInformationTab';
import AI_AssetsTab from './AI_AssetsTab';
import AI_ProjectInformationTab from './AI_ProjectInformationTab';
import AI_AR_AdditionalInformationTab from './AI_AR_AddtionalInformationTab';
import AI_ContractsTab from './AI_ContractsTab';

// Correct asset paths as requested
import vector from '@/assets/images/Vector.png';
import Moon from '@/assets/images/Moon.png';
import translate from '@/assets/images/Translate.png';
import Bell from '@/assets/images/Bell.png';
import { FaChevronDown, FaChevronLeft } from 'react-icons/fa';

const translations = {
  en: {
    eServices: 'E-Services',
    licensesPermits: 'Licenses & Permits',
    requestForSWS: 'Request for Strategic Water Storage',
    mainTitle: 'Strategic Water Storage',
    formSubmitted: 'Form Submitted',
    additionalInfo: 'Additional Information',
    assets: 'Assets',
    projectInfo: 'Project Information',
    contracts: 'Contracts',
    back: 'Back',
    next: 'Next',
    submit: 'Submit',
    saveAsDraft: 'Save as Draft',
    cancel: 'Cancel',
  },
  ar: {
    eServices: 'الخدمات الإلكترونية',
    licensesPermits: 'التراخيص والتصاريح',
    requestForSWS: 'طلب تخزين المياه الاستراتيجي',
    mainTitle: 'تخزين المياه الاستراتيجي',
    formSubmitted: 'تم تقديم النموذج',
    additionalInfo: 'معلومات إضافية',
    assets: 'الأصول',
    projectInfo: 'معلومات المشروع',
    contracts: 'العقود',
    back: 'رجوع',
    next: 'التالي',
    submit: 'إرسال',
    saveAsDraft: 'حفظ كمسودة',
    cancel: 'إلغاء',
  },
};

let num = 1; // Change this value to 0 or 1 to test different behaviors
const StrategicWaterAdditionalInfo = () => {
  const [language, setLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState(translations.en.additionalInfo);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDeclarationChecked, setIsDeclarationChecked] = useState(false);
  const [hasUploadError, setHasUploadError] = useState(false);
  const [hasSuccessfulUpload, setHasSuccessfulUpload] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const dropdownRef = useRef(null);
  const t = translations[language];

  const handleLanguageChange = () => setLanguage(language === 'en' ? 'ar' : 'en');
  const tabs = [t.additionalInfo, t.assets, t.projectInfo, t.contracts];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const handleNext = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) setActiveTab(tabs[currentIndex + 1]);
  };

  const handleBack = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) setActiveTab(tabs[currentIndex - 1]);
  };

  const handleSubmit = () => {
    if (isDeclarationChecked) {
      console.log('Form submitted successfully!');
      setIsFormSubmitted(true);
      // Add your submit logic here
    }
  };

  const handleSaveAsDraft = () => {
    console.log('Save as Draft clicked (currently not clickable)');
    // Add your save as draft logic here when needed
  };

  const handleCancel = () => {
    console.log('Cancel clicked (currently not clickable)');
    // Add your cancel logic here when needed
  };

  // Function to handle declaration checkbox change (for num = 1 case)
  const handleDeclarationChange = (checked) => {
    setIsDeclarationChecked(checked);
  };

  // Function to handle upload error state change
  const handleUploadErrorChange = (hasError) => {
    setHasUploadError(hasError);
  };

  // Function to handle upload success state change
  const handleUploadSuccessChange = (isSuccess) => {
    setHasSuccessfulUpload(isSuccess);
  };

  // Function to handle when a new file is uploaded (regardless of success/failure)
  const handleFileUploadAttempt = () => {
    setIsFormSubmitted(false);
  };

  return (
    <div className={`w-full bg-gray-50 font-sans ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <div 
        className="w-full h-[244px] bg-[#F7FDF9] pt-6 sm:pt-[41px] px-4 sm:px-[41px] relative" 
        style={{ backgroundImage: `url(${vector})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'right top' }}
      >
        <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="w-full md:w-auto overflow-hidden">
            <ol className="inline-flex items-center p-0 whitespace-nowrap">
              <li className="flex items-center">
                <a href="#" className="text-[#14573A] font-['IBM_Plex_Sans_Arabic'] text-sm no-underline truncate">{t.licensesPermits}</a>
                <span className="mx-2 text-black">›</span>
              </li>
              <li className="flex items-center max-w-[200px] sm:max-w-full">
                <span className="text-gray-500 font-['IBM_Plex_Sans_Arabic'] text-sm truncate">{t.requestForSWS}</span>
              </li>
            </ol>
          </div>
          <div className="inline-flex items-center gap-4 mt-4 md:mt-0">
            <img src={Moon} alt="Theme" className="w-5 h-5 cursor-pointer" />
            <img src={translate} alt="Translate" className="w-5 h-5 cursor-pointer" onClick={handleLanguageChange} />
            <div className="relative"><img src={Bell} alt="Notifications" className="w-5 h-5 cursor-pointer" /></div>
          </div>
        </div>
        <h1 className="text-[#161616] font-['IBM_Plex_Sans_Arabic'] text-3xl font-bold mt-6 md:mt-8">{t.mainTitle}</h1>
      </div>

      <div className="flex flex-col w-[95%] mx-auto rounded-lg bg-white shadow-lg -mt-12 md:-mt-10 relative z-10 mb-10 p-4 md:p-8">
        <div className="flex-grow">
          {/* Success Message - Show when form is submitted and no warnings are shown */}
          {isFormSubmitted && !(num === 1 && !hasSuccessfulUpload) && (
            <div className="mb-6">
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-green-800">Your Response Submitted Successfully:</span>
                    <span className="text-sm text-green-700 ml-1">We will review your request and get back to you shortly.</span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsFormSubmitted(false)}
                  className="text-green-400 hover:text-green-600"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              {/* Horizontal green line */}
              <div className="h-1 bg-green-400 rounded-b-md"></div>
            </div>
          )}

          {/* Warning Message - Only show when num = 1 and no successful upload */}
          {num === 1 && !hasSuccessfulUpload && (
            <div className="mb-6">
              {hasUploadError ? (
                // Red Upload Failed Message
                <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-red-800">Upload Failed</span>
                      <span className="text-sm text-red-700 ml-1">Something went wrong while uploading your files. Please try again.</span>
                    </div>
                  </div>
                  <button className="text-red-400 hover:text-red-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ) : (
                // Orange More Info Needed Message
                <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-md">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-orange-800">More info needed:</span>
                      <span className="text-sm text-orange-700 ml-1">Please provide the requested information as outlined in the Additional Information tab below.</span>
                    </div>
                  </div>
                  <button className="text-orange-400 hover:text-orange-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
              {/* Horizontal line - color changes based on message type */}
              <div className={`h-1 rounded-b-md ${hasUploadError ? 'bg-red-400' : 'bg-orange-400'}`}></div>
            </div>
          )}

          <AI_ApplicationDetails language={language} />
          <hr className="my-8 border-gray-200" />
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">{t.formSubmitted}</h2>

            <div className="hidden md:block border-b border-gray-200">
              <nav className="-mb-px flex" aria-label="Tabs">
                {tabs.map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`flex-1 whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-sm transition-colors ${activeTab === tab ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500 hover:border-gray-300'}`}>
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            <div className="md:hidden relative" ref={dropdownRef}>
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-full flex justify-between items-center p-3 border border-gray-300 rounded-md bg-white text-left">
                <span className="font-semibold text-gray-700">{activeTab}</span>
                <FaChevronDown className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                  {tabs.map(tab => (
                    <button key={tab} onClick={() => { setActiveTab(tab); setIsDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm ${activeTab === tab ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}`}>
                      {tab}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Tab Content Section */}
            <div className="mt-6">
              {activeTab === t.additionalInfo ? (
                num === 0 ? (
                  <AI_AdditionalInformationTab language={language} hasRequests={true} />
                ) : (
                  <AI_AR_AdditionalInformationTab 
                    language={language} 
                    hasRequests={true} 
                    onDeclarationChange={handleDeclarationChange}
                    onUploadErrorChange={handleUploadErrorChange}
                    onUploadSuccessChange={handleUploadSuccessChange}
                    onFileUploadAttempt={handleFileUploadAttempt}
                  />
                )
              ) : null}

              {activeTab === t.assets && <AI_AssetsTab language={language} />}
              {activeTab === t.projectInfo && <AI_ProjectInformationTab language={language} />}
              {activeTab === t.contracts && <AI_ContractsTab language={language} />}
            </div>
          </div>
        </div>

        {/* Conditional Button Section */}
        <div className="flex justify-start items-center gap-4 pt-8 mt-auto border-t border-gray-200">
          {/* Back Button - Always present */}
          <button 
            onClick={handleBack} 
            className="flex items-center gap-2 px-8 py-2 rounded-md font-semibold transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50" 
            disabled={tabs.indexOf(activeTab) === 0}
          >
            <FaChevronLeft />
            {t.back}
          </button>
          
          {/* Next/Submit Button - Conditional based on num value */}
          {num === 0 ? (
            <button 
              onClick={handleNext} 
              className="px-8 py-2 rounded-md font-semibold transition-colors bg-green-600 text-white hover:bg-green-700 disabled:opacity-50" 
              disabled={tabs.indexOf(activeTab) === tabs.length - 1}
            >
              {t.next}
            </button>
          ) : (
            <button 
              onClick={handleSubmit} 
              className={`px-8 py-2 rounded-md font-semibold transition-colors bg-green-600 text-white hover:bg-green-700 ${
                !isDeclarationChecked ? 'cursor-not-allowed' : ''
              }`}
              disabled={!isDeclarationChecked}
            >
              {t.submit}
            </button>
          )}
          
          {/* Save as Draft Button - Shows when num = 0 or num = 1, but not clickable */}
          {(num === 0 || num === 1) && (
            <button 
              onClick={handleSaveAsDraft}
              className="px-4 py-2 text-sm font-semibold text-gray-400 cursor-not-allowed"
              disabled
            >
              {t.saveAsDraft}
            </button>
          )}
          
          {/* Cancel Button - Shows when num = 0 or num = 1, but not clickable */}
          {(num === 0 || num === 1) && (
            <button 
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-semibold text-gray-400 cursor-not-allowed"
              disabled
            >
              {t.cancel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StrategicWaterAdditionalInfo;