import React, { useState } from 'react';

// --- Import Assets ---
import translateIcon from './Translate.png';
import vectorBG from './Vector.png';
import moonIcon from './Moon.png';
import bellIcon from './Bell.png';

// --- Import Components ---
import StepsFlow from './RR_StepsFlow';
import AssetEntryMethod from '../RR Asset/RR Asset Entry/RR_AssetEntryMethod';
import ProjectInformation from '../RR ProjectInfo/RR_ProjectInformation';
import Contracts from '../RR Contracts/RR_Contracts';
import Declaration from '../RR Declaration/RR_Declaration';
import Commitment from '../RR Commitment/RR_Commitment';

// --- Data & Translations ---
const translations = {
  en: {
    eService: 'E-Services',
    licensePermits: 'Licenses & Permits',
    LicenseRenewal: 'License Renewal for Strategic Water Storage',
    RequestStrategicWaterStorage: 'Request for Strategic Water Storage',

  },
  ar: {
    eService: 'الخدمات الإلكترونية',
    licensePermits: 'التراخيص والتصاريح',
    LicenseRenewal: 'تجديد ترخيص التخزين الاستراتيجي للمياه',
    RequestStrategicWaterStorage: 'طلب التخزين الاستراتيجي للمياه',

  },
};



const RR_TopDesign = ({ language = 'en', onLanguageChange }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const t = translations[language] || translations.en;
  const fontClass = "font-['IBM_Plex_Sans_Arabic']";

  const handleTranslate = () => onLanguageChange(language === 'en' ? 'ar' : 'en');

  // Add new state to control the visibility of the final Commitment screen
  const [showCommitment, setShowCommitment] = useState(false); 

  const renderStepComponent = () => {
    // If showCommitment is true, render it regardless of the current step
    if (showCommitment) {
      return <Commitment language={language} onBack={() => setShowCommitment(false)} />;
    }
    switch (currentStep) {
      case 1:
        return <AssetEntryMethod language={language} currentStep={currentStep} setCurrentStep={setCurrentStep} />;
      case 2:
        return <ProjectInformation language={language} currentStep={currentStep} setCurrentStep={setCurrentStep} />;
      case 3:
        return <Contracts language={language} currentStep={currentStep} setCurrentStep={setCurrentStep} />;
      case 4:
        // Pass the function to show the commitment screen down to the Declaration component
        return <Declaration language={language} currentStep={currentStep} setCurrentStep={setCurrentStep} onDeclareSubmit={() => setShowCommitment(true)} />;
      default:
        return <AssetEntryMethod language={language} currentStep={currentStep} setCurrentStep={setCurrentStep} />;
    }
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
          <h1 className="text-[#161616] text-[30px] font-bold mt-[39px]">{t.LicenseRenewal}</h1>
        </div>

        {/* StepsFlow Component - This remains unchanged and correctly placed */}
        <div className="mx-4 lg:mx-10 -mt-[50px] relative z-10">
          <div className="bg-white rounded-[6px] shadow-[0px_3px_12px_0px_rgba(47,43,61,0.14)] p-8">
            <StepsFlow currentStep={currentStep} language={language} />
          </div>
        </div>

        {/* Dynamic Step Component Section - This is the only part that changes */}
        <div className="mx-4 lg:mx-10 mt-6 mb-10">
            {renderStepComponent()}
        </div>
        
      </div>
    </div>
  );
};

export default RR_TopDesign;