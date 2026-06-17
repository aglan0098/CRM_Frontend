import React, { useState } from 'react';

// --- Import Assets ---
// Make sure the paths to your assets are correct
import translateIcon from './Translate.png';
import vectorBG from './Vector.png';
import moonIcon from './Moon.png';
import bellIcon from './Bell.png';
import RegulatorySupport from '../Organization Support/RegulatorySupport';
import StrategicWaterDB from '../StrategicWater/StrategicWaterDB';
import Dropplet from './Dropplet.png'
import Building from './Building.png'
import searchicon from './searchicon.png'

// --- Data & Translations ---
const translations = {
  en: {
    dashboard: 'Dashboard',
    eService: 'E-Services',
    licensePermits: 'License & Permits',
    RegulatorySupport: 'E-Services',
    searchPlaceholder: 'Search',
    regularitySupportRequest: 'Regularity Support Request',
    regularitySupportDesc: 'This service allows government and private entities to submit requests or inquiries to obtain organizational support services, which...',
    goToService: 'Go To Service',
    largeWaterConnections: 'Large Water Connections',
    largeWaterDesc: 'Establishment and operation of facilities and tanks—within a defined geographical scope—for storing water to be used in emergency su...',
  },
  ar: {
    dashboard: 'لوحة القيادة',
    eService: 'الخدمات الإلكترونية',
    licensePermits: 'التراخيص والتصاريح',
    RegulatorySupport: 'الخدمات الإلكترونية',
    searchPlaceholder: 'بحث',
    regularitySupportRequest: 'طلب الدعم التنظيمي',
    regularitySupportDesc: 'تتيح هذه الخدمة للجهات الحكومية والخاصة تقديم طلبات أو استفسارات للحصول على خدمات الدعم التنظيمي، والتي...',
    goToService: 'الذهاب للخدمة',
    largeWaterConnections: 'التوصيلات المائية الكبيرة',
    largeWaterDesc: 'إنشاء وتشغيل المرافق والخزانات - ضمن نطاق جغرافي محدد - لتخزين المياه لاستخدامها في حالات الطوارئ...',
  },
};

// --- Main Parent Component ---
const Eservicepage = ({ language = 'en', onLanguageChange }) => {
  const [currentPage, setCurrentPage] = useState('eservices'); // Track which page to show
  const [searchTerm, setSearchTerm] = useState('');
  
  const t = translations[language] || translations.en;
  const fontClass = "font-['IBM_Plex_Sans_Arabic']";

  const handleTranslate = () => onLanguageChange(language === 'en' ? 'ar' : 'en');
  
  // Navigate to different pages
  const handleNavigateToRegulatorySupport = () => setCurrentPage('regulatory-support');
  const handleNavigateToStrategicWater = () => setCurrentPage('strategic-water');
  const handleBackToEServices = () => setCurrentPage('eservices');
  
  // If we're on the regulatory support page, render the full RegulatorySupport component
  if (currentPage === 'regulatory-support') {
    return <RegulatorySupport language={language} onLanguageChange={onLanguageChange} />;
  }
  
  // If we're on the strategic water page, render the full StrategicWaterDB component
  if (currentPage === 'strategic-water') {
    return <StrategicWaterDB language={language} onLanguageChange={onLanguageChange} />;
  }
  
  return (
    <div className={`min-h-screen bg-[#F8F8F8] ${fontClass} ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="flex-1">

        {/* Header Section */}
        <div
          className="w-full h-[244px] bg-[#F7FDF9] pt-[41px] px-4 lg:px-10"
          style={{ backgroundImage: `url(${vectorBG})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'right top' }}
        >
          <div className="flex items-center justify-between">
            <nav aria-label="Breadcrumb">
              <ol className="inline-flex items-center">
                <li className="flex items-center text-[14px] font-normal text-gray-500 hover:text-gray-700">
                  <a href="#">{t.dashboard}</a>
                  <span className="mx-2 text-gray-400" aria-hidden="true">{language === 'ar' ? '‹' : '›'}</span>
                </li>
                <li className="flex items-center text-[14px] font-normal text-gray-500 hover:text-gray-700">
                  <a href="#">{t.eService}</a>
                  <span className="mx-2 text-gray-400" aria-hidden="true">{language === 'ar' ? '‹' : '›'}</span>
                </li>
                <li className="flex items-center text-[14px] font-normal text-gray-700">
                  <a href="#" aria-current="page">{t.licensePermits}</a>
                </li>
              </ol>
            </nav>
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-full hover:bg-black/5"><img src={moonIcon} alt="Theme" className="w-5 h-5" /></button>
              <button onClick={handleTranslate} className="p-2 rounded-full hover:bg-black/5"><img src={translateIcon} alt="Translate" className="w-5 h-5" /></button>
              <button className="relative p-2 rounded-full hover:bg-black/5"><img src={bellIcon} alt="Notifications" className="w-5 h-5" /></button>
            </div>
          </div>
          <h1 className="text-[#161616] text-[30px] font-bold mt-[39px]">{t.RegulatorySupport}</h1>
        </div>

        {/* Main Content Area */}
        <main className="w-full px-4 lg:px-10 -mt-[50px] relative z-10">
          <div className="flex flex-col w-full items-stretch">
            {/* Main Content Card */}
            <div className="flex-1 bg-white rounded-[6px] shadow-[0px_3px_12px_0px_rgba(47,43,61,0.14)] mb-10">
              <div className="p-8">
                {/* Search Box */}
                <div className="relative mb-6 max-w-xs">
                  <div className={`absolute inset-y-0 flex items-center pointer-events-none ${language === 'ar' ? 'right-3' : 'left-3'}`}>
                    <img src={searchicon} alt="searchicon" className="h-6 w-auto object-contain" />
                  </div>
                  <input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1B8354] focus:border-transparent outline-none text-sm ${language === 'ar' ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'}`}
                  />
                </div>
                
                {/* Horizontal Line */}
                <hr className="border-gray-200 mb-8" />
                
                {/* Service Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
                  {/* Regularity Support Request Card */}
                  <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="mb-4">
                      <div className="w-12 h-12 bg-[#E8F5E8]/50 rounded-full flex items-center justify-center mb-3">
                        <img src={Building} alt="Building" className="h-6 w-auto object-contain" />
                      </div>
                      <h3 className="text-lg font-semibold text-[#161616] mb-2">{t.regularitySupportRequest}</h3>
                      <p className="text-sm text-[#6C737F] mb-4">{t.regularitySupportDesc}</p>
                      <button 
                        onClick={handleNavigateToRegulatorySupport}
                        className="inline-flex items-center px-4 py-2 bg-[#1B8354] text-white text-sm font-medium rounded-md hover:bg-[#146B43] transition-colors"
                      >
                        {t.goToService}
                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {/* Large Water Connections Card */}
                  <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="mb-4">
                      <div className="w-12 h-12 bg-[#E8F5E8]/50 rounded-full flex items-center justify-center mb-3">
                        <img src={Dropplet} alt="Dropplet" className="h-6 w-auto object-contain" />
                      </div>
                      <h3 className="text-lg font-semibold text-[#161616] mb-2">{t.largeWaterConnections}</h3>
                      <p className="text-sm text-[#6C737F] mb-4">{t.largeWaterDesc}</p>
                      <button 
                        onClick={handleNavigateToStrategicWater}
                        className="inline-flex items-center px-4 py-2 bg-[#1B8354] text-white text-sm font-medium rounded-md hover:bg-[#146B43] transition-colors"
                      >
                        {t.goToService}
                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Eservicepage;