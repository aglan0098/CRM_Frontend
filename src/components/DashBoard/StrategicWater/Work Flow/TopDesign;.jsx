import React, { useState, useRef, useEffect } from 'react';

// --- Import Assets ---
import translateIcon from './Translate.png';
import vectorBG from './Vector.png';
import moonIcon from './Moon.png';
import bellIcon from './Bell.png';

// --- Import Components ---
import StepsFlow from '../Work Flow/StepsFlow';
import AssetEntryMethod from '../Asset/Asset Entry/AssetEntryMethod';
import ProjectInformation from '../ProjectInfo/ProjectInformation';
import Contracts from '../Contracts/Contracts';
import Declaration from '../Declaration/Declaration';
import Commitment from '../Commitment/Commitment';
import SaveAsDraftModal from '../Asset/Asset Form/SaveAsDraftModal';
import CancelModal from '../Asset/Asset Form/CancelModal';

import axios from 'axios';
import config from '@/utils/config';
const API_BASE_URL = `http://localhost:5000/api/stratergic-water-support-support`;
// --- Data & Translations ---
const translations = {
  en: {
    eService: 'E-Services',
    licensePermits: 'Licenses & Permits',
    StrategicWaterStorage: 'Strategic Water Storage',
    RequestStrategicWaterStorage: 'Request for Strategic Water Storage',
    back: 'Back',
    next: 'Next',
    submit: 'Submit',
    saveAsDraft: 'Save as Draft',
    cancel: 'Cancel',
  },
  ar: {
    eService: 'الخدمات الإلكترونية',
    licensePermits: 'التراخيص والتصاريح',
    StrategicWaterStorage: 'التخزين الاستراتيجي للمياه',
    RequestStrategicWaterStorage: 'طلب التخزين الاستراتيجي للمياه',
    back: 'رجوع',
    next: 'التالي',
    submit: 'إرسال',
    saveAsDraft: 'حفظ كمسودة',
    cancel: 'إلغاء',
  },
};

const TopDesign = ({ language = 'en', onLanguageChange }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [masterFormData, setMasterFormData] = useState({});
  const [showCommitment, setShowCommitment] = useState(false);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [showSaveAsDraftModal, setShowSaveAsDraftModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const assetEntryRef = useRef(null);
  const projectInfoRef = useRef(null);
  const contractsRef = useRef(null);
  const declarationRef = useRef(null);
  const t = translations[language] || translations.en;
  const fontClass = "font-['IBM_Plex_Sans_Arabic']";

  const handleTranslate = () => onLanguageChange(language === 'en' ? 'ar' : 'en');

  const handleNext = async () => {
    const currentStepRefs = {
      1: assetEntryRef,
      2: projectInfoRef,
      3: contractsRef,
      4: declarationRef,
    };
    const currentRef = currentStepRefs[currentStep];

    if (currentRef.current) {
      const isValid = await currentRef.current.validate();
      if (isValid) {
        const stepData = currentRef.current.getData();
        setMasterFormData(prevData => ({ ...prevData, ...stepData }));
        if (currentStep < 4) {
          setCurrentStep(prev => prev + 1);
        } else {
          handleSubmit();
        }
      } else {
        console.log(`Validation failed for step ${currentStep}`);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSaveAsDraft = () => {
    setShowSaveAsDraftModal(true);
    console.log('Saving draft:', masterFormData);
  };

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const handleCancelConfirm = () => {
    setMasterFormData({});
    setCurrentStep(1);
    setShowCancelModal(false);
  };

  const handleDeclarationChange = (isChecked) => {
    setIsSubmitEnabled(isChecked);
  };

  const handleSubmit = async () => {
    function generateRandom8DigitNumber() {
      const min = 10000000; // Smallest 8-digit number
      const max = 99999999; // Largest 8-digit number
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem('swa_user'));
    if (!userData?.userId) {
      throw new Error('User data not found');
    }

    const finalData = declarationRef.current.getData();
    const finalMasterData = {
      title: `Strategic Water Storage CASE - ${generateRandom8DigitNumber()}`,
      description: "",
      customerid: userData.userId,
      ...masterFormData,
      ...finalData
    };

    // Final data contract check and log
    console.log('Final masterFormData for backend submission:', JSON.stringify(finalMasterData, null, 2));

    // api call
    const response = await axios.post(`${API_BASE_URL}`, finalMasterData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log("response : ", response);
    // Show the final commitment screen
    setShowCommitment(true);
  };

  const renderStepComponent = () => {
    if (showCommitment) {
      return <Commitment language={language} onBack={() => setShowCommitment(false)} />;
    }
    switch (currentStep) {
      case 1:
        return <AssetEntryMethod ref={assetEntryRef} language={language} />;
      case 2:
        return <ProjectInformation ref={projectInfoRef} language={language} />;
      case 3:
        return <Contracts ref={contractsRef} language={language} />;
      case 4:
        return <Declaration ref={declarationRef} language={language} onDeclarationChange={handleDeclarationChange} />;
      default:
        return <AssetEntryMethod ref={assetEntryRef} language={language} />;
    }
  };

  const renderButtons = () => {
    if (showCommitment) return null;

    const isFirstStep = currentStep === 1;
    const isLastStep = currentStep === 4;

    const nextButtonText = isLastStep ? t.submit : t.next;
    const isNextButtonDisabled = isLastStep ? !isSubmitEnabled : false;

    return (
      <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-200">
        {!isFirstStep && (
          <button
            onClick={handleBack}
            className="px-6 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50"
          >
            {t.back}
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={isNextButtonDisabled}
          className={`px-6 py-2 text-white text-sm font-medium rounded-md transition-colors duration-200 ${isNextButtonDisabled
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-[#1B8354] hover:bg-[#146B43]'
            }`}
        >
          {nextButtonText}
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
    );
  };

  return (
    <div className={`min-h-screen bg-[#F8F8F8] ${fontClass} ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="flex-1">

        {/* Header Section - Common to both views */}
        <div
          className="w-full h-[244px] bg-[#F7FDF9] pt-[41px] px-4 lg:px-10"
          style={{ backgroundImage: `url(${vectorBG})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'right top' }}
        >
          <div className="flex items-center justify-between">
            <nav aria-label="Breadcrumb">
              <ol className="inline-flex items-center">
                <li className="flex items-center text-[14px] font-normal text-gray-500 hover:text-gray-700">
                  <a href="#">{t.eService}</a>
                  <span className="mx-2 text-gray-400" aria-hidden="true">{language === 'ar' ? '‹' : '›'}</span>
                </li>
                <li className="flex items-center text-[14px] font-normal text-gray-500 hover:text-gray-700">
                  <a href="#">{t.licensePermits}</a>
                  <span className="mx-2 text-gray-400" aria-hidden="true">{language === 'ar' ? '‹' : '›'}</span>
                </li>
                <li className="flex items-center text-[14px] font-normal text-gray-700">
                  <a href="#" aria-current="page">{t.RequestStrategicWaterStorage}</a>
                </li>
              </ol>
            </nav>
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-full hover:bg-black/5"><img src={moonIcon} alt="Theme" className="w-5 h-5" /></button>
              <button onClick={handleTranslate} className="p-2 rounded-full hover:bg-black/5"><img src={translateIcon} alt="Translate" className="w-5 h-5" /></button>
              <button className="relative p-2 rounded-full hover:bg-black/5"><img src={bellIcon} alt="Notifications" className="w-5 h-5" /></button>
            </div>
          </div>
          <h1 className="text-[#161616] text-[30px] font-bold mt-[39px]">{t.StrategicWaterStorage}</h1>
        </div>

        {/* StepsFlow Component */}
        <div className="mx-4 lg:mx-10 -mt-[50px] relative z-10">
          <div className="bg-white rounded-[6px] shadow-[0px_3px_12px_0px_rgba(47,43,61,0.14)] p-8">
            <StepsFlow currentStep={currentStep} language={language} />
          </div>
        </div>

        {/* Dynamic Step Component Section */}
        <div className="mx-4 lg:mx-10 mt-6 mb-10">
          {renderStepComponent()}
          {renderButtons()}
        </div>

      </div>
      <SaveAsDraftModal
        isOpen={showSaveAsDraftModal}
        onClose={() => setShowSaveAsDraftModal(false)}
        onSave={() => setShowSaveAsDraftModal(false)} // Placeholder save handler
        language={language}
      />
      <CancelModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelConfirm}
        language={language}
      />
    </div>
  );
};

export default TopDesign;