import React, { useState } from 'react';

// --- Import Assets ---
// Make sure the paths to your assets are correct
import translateIcon from './Translate.png';
import vectorBG from './Vector.png';
import moonIcon from './Moon.png';
import bellIcon from './Bell.png';
import audienceIcon from './Audience.png';
import channelIcon from './Channel.png';
import contactIcon from './Contact.png';
import costIcon from './Cost.png';
import emailIcon from './Email.png';
import linkIcon from './Link.png';
import timeIcon from './Time.png';

// --- Import TopDesign Component ---
import TopDesign from './Work Flow/TopDesign;';
import ResubmissionPage from '../StrategicWater/Resubmission/ResubmissionPage';

// --- Data & Translations ---
const translations = {
  en: {
    eService: 'E-Services',
    licensePermits: 'License & Permits', // Added missing key
    StrategicWaterStorage: 'Strategic Water Storage',
    RequestStrategicWaterStorage: 'Request for Strategic Water Storage',
    requestServiceButton: 'Request Service',
    serviceProviders: 'Strategic Water Storage',
    description: 'Establishment and operation of facilities and tanks—within a defined geographical scope—for storing water to be used in emergency supply situations. This does not include storing water in underground layers, dams, or for purposes other than ensuring supply stability.',
    steps: 'Steps',
    documents: 'Required Documents',
    faq: 'Frequently Asked Questions',
    faqLink: "SWA-FAQ's-page",
    phone: 'Phone',
    email: 'Email',
    targetAudience: 'Target audience',
    targetAudienceValue: 'Business',
    serviceDuration: 'Service duration',
    serviceDurationValue: '15 Day(s)',
    serviceChannels: 'Service channels',
    serviceChannelsValue: 'Services portal',
    serviceCost: 'Service cost',
    serviceCostValue: 'Based on the size of the activity',
    back: 'Back', // Added missing key
    // Notification modal translations
    applicationReturned: 'Application Returned',
    actionRequired: 'Action Required',
    notificationMessage: 'Your application has been returned for updates. Please review the requested changes and resubmit the form. The required modifications ar...',
    notificationDate: 'Jan 8, 1:15 PM',
  },
  ar: {
    eService: 'الخدمات الإلكترونية',
    licensePermits: 'التراخيص والتصاريح', // Added missing key
    StrategicWaterStorage: 'التخزين الاستراتيجي للمياه',
    RequestStrategicWaterStorage: 'طلب التخزين الاستراتيجي للمياه',
    requestServiceButton: 'طلب الخدمة', // Improved translation
    serviceProviders: 'التخزين الاستراتيجي للمياه', // Improved translation
    description: 'إنشاء وتشغيل المرافق والخزانات - ضمن نطاق جغرافي محدد - لتخزين المياه لاستخدامها في حالات الإمداد الطارئة. هذا لا يشمل تخزين المياه في الطبقات الجوفية أو السدود أو لأغراض أخرى غير ضمان استقرار الإمداد.', // Improved and complete translation
    steps: 'الخطوات',
    documents: 'المستندات المطلوبة',
    faq: 'الأسئلة الشائعة',
    faqLink: 'صفحة الأسئلة الشائعة - هيئة المياه السعودية',
    phone: 'الهاتف',
    email: 'البريد الإلكتروني',
    targetAudience: 'الجمهور المستهدف',
    targetAudienceValue: 'أعمال',
    serviceDuration: 'مدة الخدمة',
    serviceDurationValue: '15 يوماً', // Improved grammar
    serviceChannels: 'قنوات الخدمة',
    serviceChannelsValue: 'بوابة الخدمات',
    serviceCost: 'تكلفة الخدمة',
    serviceCostValue: 'بناءً على حجم النشاط',
    back: 'رجوع', // Added missing key
    // Notification modal translations
    applicationReturned: 'تم إرجاع الطلب',
    actionRequired: 'إجراء مطلوب',
    notificationMessage: 'تم إرجاع طلبك للتحديث. يرجى مراجعة التغييرات المطلوبة وإعادة تقديم النموذج. التعديلات المطلوبة...',
    notificationDate: '8 يناير، 1:15 م',
  },
};

const getStepsContent = (lang) => ({
  steps: [
    lang === 'ar' ? 'انقر على "بدء الخدمة".' : 'Click on "Start Service."',
    lang === 'ar' ? 'تسجيل الدخول عبر الهوية الرقمية الموحدة (نفاذ).' : 'Log in through the National Single Sign-On (Nafath).',
    lang === 'ar' ? 'ملء بيانات الأصول المتعلقة بالنشاط (إن وجدت).' : 'Fill in the asset data related to the activity (if any).',
    lang === 'ar' ? 'التأكد من استيفاء جميع الشروط والمتطلبات.' : 'Ensure that all conditions and requirements are met.',
    lang === 'ar' ? 'تقديم الطلب وإرفاق الملفات المطلوبة.' : 'Submit the application and attach the required files.',
    lang === 'ar' ? 'دفع الرسوم (إن وجدت).' : 'Pay the fees (if any).',
    lang === 'ar' ? 'مشاركة رأيك حول الخدمة (اختياري).' : 'Share your feedback about the service (optional).',
  ],
  documents: [lang === 'ar' ? 'سيتم تقديم المستندات المطلوبة من قبل العميل' : 'Required documents will be provided by client'],
});

// --- Main Parent Component ---
const StrategicWaterDB = ({ language = 'en', onLanguageChange }) => {
  const [activeTab, setActiveTab] = useState('steps');
  const [showTopDesign, setShowTopDesign] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [fromNotification, setFromNotification] = useState(false);
  
  // Global num variable - Change this value to 0 or 1 to test different behaviors
  let num = 1;
  
  const t = translations[language] || translations.en;
  const content = getStepsContent(language);
  const fontClass = "font-['IBM_Plex_Sans_Arabic']";

  const handleTranslate = () => onLanguageChange(language === 'en' ? 'ar' : 'en');
  const handleRequestService = () => setShowTopDesign(true);
  const handleNotificationClick = () => {
    if (num === 1) {
      setShowNotificationModal(true);
    }
  };
  const handleNotificationClose = () => setShowNotificationModal(false);

  const handleNotificationItemClick = () => {
    setShowNotificationModal(false);
    setFromNotification(true);
    setShowTopDesign(true);
  };

  // If showTopDesign is true, render TopDesign component
  if (showTopDesign) {
    if(fromNotification){
      // When coming from notification, always show ResubmissionPage
      return <ResubmissionPage language={language} onLanguageChange={onLanguageChange} />;
    } else if(num == 0){
      return <TopDesign language={language} onLanguageChange={onLanguageChange} />;
    }else {
      return <ResubmissionPage language={language} onLanguageChange={onLanguageChange} />;
    }
  }

  const tabs = [
    { id: 'steps', label: t.steps },
    { id: 'documents', label: t.documents },
  ];

  const serviceInfoItems = [
    { icon: audienceIcon, title: t.targetAudience, value: t.targetAudienceValue },
    { icon: timeIcon, title: t.serviceDuration, value: t.serviceDurationValue },
    { icon: channelIcon, title: t.serviceChannels, value: t.serviceChannelsValue },
    { icon: costIcon, title: t.serviceCost, value: t.serviceCostValue },
  ];
  
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
            <div className="flex items-center space-x-2 relative">
              <button className="p-2 rounded-full hover:bg-black/5"><img src={moonIcon} alt="Theme" className="w-5 h-5" /></button>
              <button onClick={handleTranslate} className="p-2 rounded-full hover:bg-black/5"><img src={translateIcon} alt="Translate" className="w-5 h-5" /></button>
              <button onClick={handleNotificationClick} className="relative p-2 rounded-full hover:bg-black/5">
                <img src={bellIcon} alt="Notifications" className="w-5 h-5" />
                {/* Red dot only shows when num = 1 */}
                {num === 1 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}
              </button>
              
              {/* ONLY notification modal positioned below bell icon - shows only when num = 1 */}
              {showNotificationModal && num === 1 && (
                <div className="absolute top-full right-0 mt-2 z-50">
                  <div className="bg-white rounded-lg shadow-xl w-80 border border-gray-200">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{t.applicationReturned}</h3>
                        <button 
                          onClick={handleNotificationClose}
                          className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                        >
                          ×
                        </button>
                      </div>
                      
                      <div 
                        onClick={handleNotificationItemClick}
                        className="cursor-pointer hover:bg-gray-50 p-3 rounded-lg border border-gray-200 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                ⚠ {t.actionRequired}
                              </span>
                            </div>
                            <p className="text-gray-700 text-sm mb-2 leading-relaxed">
                              {t.notificationMessage}
                            </p>
                            <div className="flex items-center text-xs text-gray-500">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
                              </svg>
                              {t.notificationDate}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <h1 className="text-[#161616] text-[30px] font-bold mt-[39px]">{t.StrategicWaterStorage}</h1>
        </div>

        {/* Main Content Area */}
        <main className="w-full px-4 lg:px-10 -mt-[50px] relative z-10">
          {/* LIST VIEW */}
          <div className="flex flex-col lg:flex-row gap-6 w-full items-stretch">
            {/* Main Content Card (Left) */}
            <div className="flex-1 bg-white rounded-[6px] shadow-[0px_3px_12px_0px_rgba(47,43,61,0.14)] mb-10">
              <div className="p-8 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <h2 className="text-[28px] font-bold text-[#161616]">{t.RequestStrategicWaterStorage}</h2>
                  <button 
                    onClick={handleRequestService}
                    className="h-[40px] px-[16px] bg-[#1B8354] text-white text-base font-medium rounded-md hover:bg-[#146B43] transition-colors whitespace-nowrap"
                  >
                    {t.requestServiceButton}
                  </button>
                </div>
                <div className="mt-6">
                  <button className="px-3 py-2 bg-white border border-[#E0E0E0] text-[14px] font-medium text-[#161616] rounded-md hover:bg-gray-50">
                    {t.serviceProviders}
                  </button>
                </div>
              </div>
                <div className="p-8">
                  <p className="text-base text-[#161616] mb-6">{t.description}</p>
                  <div className="border-b border-gray-200">
                    <nav className="-mb-px flex gap-x-8" aria-label="Tabs">
                      {tabs.map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-[16px] transition-colors duration-200 ${activeTab === tab.id ? 'border-[#1B8354] text-[#1B8354]' : 'border-transparent text-[#6C737F] hover:text-black'}`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </nav>
                  </div>
                  <div className="pt-6 space-y-4 text-[16px] text-[#161616]">
                    {content[activeTab]?.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <span className="font-bold">{index + 1}-</span>
                        <p className="m-0 leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Service Information Card (Right) */}
              <div className="w-full lg:w-[352px] bg-white rounded-[6px] shadow-[0px_3px_12px_0px_rgba(47,43,61,0.14)] mb-10 flex flex-col">
                <div className="p-8">
                  <div className="space-y-6">
                    {serviceInfoItems.map((item, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <img src={item.icon} alt="" className="w-6 h-6 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <h3 className="text-[14px] font-bold text-[#161616]">{item.title}</h3>
                          <p className="text-[14px] text-[#6C737F] mt-1">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <hr className="my-6 border-gray-200" />
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-base font-bold text-[#161616] mb-2">{t.faq}</h3>
                      <a href="#" className="text-[14px] text-[#1B8354] hover:underline flex items-center gap-2">
                        <span>{t.faqLink}</span>
                        <img src={linkIcon} alt="External link" className="w-3.5 h-3.5"/>
                      </a>
                    </div>
                    <div className="flex items-start gap-4">
                      <img src={contactIcon} alt="" className="w-6 h-6 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="text-[14px] font-bold text-[#161616]">{t.phone}</h3>
                        <a href="tel:0181188111" className="text-[14px] text-[#1B8354] hover:underline flex items-center gap-2 mt-1">
                          <span>0181188111</span>
                          <img src={linkIcon} alt="External link" className="w-3.5 h-3.5"/>
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <img src={emailIcon} alt="" className="w-6 h-6 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="text-[14px] font-bold text-[#161616]">{t.email}</h3>
                        <a href="mailto:GDL@SWA.GOV.SA" className="text-[14px] text-[#1B8354] hover:underline flex items-center gap-2 mt-1 break-all">
                          <span>GDL@SWA.GOV.SA</span>
                          <img src={linkIcon} alt="External link" className="w-3.5 h-3.5"/>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          {/* Back Button */}
          <div className="mb-10">
            <button className="px-6 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors">
              {t.back}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StrategicWaterDB;