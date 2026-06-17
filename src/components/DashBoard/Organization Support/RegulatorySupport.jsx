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

// --- Import Child Component ---
// This assumes RegSupportDetails.jsx is in the same directory
import RegSupportDetails from './RegulatorySupportData/RegSupportDetails'; 

// --- Data & Translations ---
const translations = {
  en: {
    eService: 'E-Services',
    RegulatorySupport: 'Regulatory Support',
    RequestRegulatorySupport: 'Request Regulatory Support',
    requestServiceButton: 'Request Service',
    serviceProviders: 'Service Providers',
    description: 'Descriptive body copy with more detailed information about the contents...',
    steps: 'Steps',
    conditions: 'Conditions',
    documents: 'Required Documents',
    faq: 'Frequently Asked Questions',
    faqLink: "SWA-FAQ's-page",
    phone: 'Phone',
    email: 'Email',
    targetAudience: 'Target audience',
    targetAudienceValue: 'Individual',
    serviceDuration: 'Service duration',
    serviceDurationValue: '15 Day(s)',
    serviceChannels: 'Service channels',
    serviceChannelsValue: 'Services portal',
    serviceCost: 'Service cost',
    serviceCostValue: 'Based on the size of the activity',
  },
  ar: {
    eService: 'الخدمات الإلكترونية',
    RegulatorySupport: 'الدعم التنظيمي',
    RequestRegulatorySupport: 'طلب الدعم التنظيمي',
    requestServiceButton: 'طلب خدمة',
    serviceProviders: 'مقدمو الخدمة',
    description: 'نص وصفي مع معلومات أكثر تفصيلاً حول المحتويات...',
    steps: 'الخطوات',
    conditions: 'الشروط',
    documents: 'المستندات المطلوبة',
    faq: 'الأسئلة الشائعة',
    faqLink: 'صفحة الأسئلة الشائعة - هيئة المياه السعودية',
    phone: 'الهاتف',
    email: 'البريد الإلكتروني',
    targetAudience: 'الجمهور المستهدف',
    targetAudienceValue: 'فرد',
    serviceDuration: 'مدة الخدمة',
    serviceDurationValue: '15 يوم',
    serviceChannels: 'قنوات الخدمة',
    serviceChannelsValue: 'بوابة الخدمات',
    serviceCost: 'تكلفة الخدمة',
    serviceCostValue: 'بناءً على حجم النشاط',
  },
};

const getStepsContent = (lang) => ({
  steps: [
    lang === 'ar' ? 'تحديد نوع خدمة الدعم التنظيمي المطلوبة بناءً على النشاط (على سبيل المثال، استخراج المياه الجوفية).' : 'Determine the type of Organization Support Service required based on the activity (e.g., groundwater extraction).',
    lang === 'ar' ? 'التحقق من المتطلبات من خلال مراجعة شروط السلطة المسؤولة.' : "Verify the requirements by reviewing the responsible authority's conditions.",
    lang === 'ar' ? 'إعداد الوثائق، مثل بيانات المتقدم وتفاصيل المشروع والدراسات البيئية (إن أمكن).' : 'Prepare the documents, such as applicant data, project details, and environmental studies (if applicable).',
    lang === 'ar' ? 'تقديم الطلب من خلال الموقع الرسمي أو المكاتب المخصصة.' : 'Submit the application through the official website or designated offices.',
    lang === 'ar' ? 'دفع الرسوم، إن أمكن.' : 'Pay the fees, if applicable.',
    lang === 'ar' ? 'متابعة الطلب مع السلطة المختصة للتأكد من استيفاء جميع المتطلبات.' : 'Follow up on the application with the relevant authority to ensure all requirements are met.',
    lang === 'ar' ? 'الحصول على الترخيص والامتثال للشروط المحددة.' : 'Receive the license and comply with the specified conditions.',
  ],
  conditions: [lang === 'ar' ? 'سيتم تقديم الشروط من قبل العملاء' : 'Conditions will be provided by clients'],
  documents: [lang === 'ar' ? 'سيتم تقديم المستندات المطلوبة من قبل العميل' : 'Required documents will be provided by client'],
});

// --- Main Parent Component ---
const RegulatorySupport = ({ language = 'en', onLanguageChange }) => {
  const [view, setView] = useState('list'); // Manages which view to show: 'list' or 'details'
  const [activeTab, setActiveTab] = useState('steps');
  
  const t = translations[language] || translations.en;
  const content = getStepsContent(language);
  const fontClass = "font-['IBM_Plex_Sans_Arabic']";

  const handleTranslate = () => onLanguageChange(language === 'en' ? 'ar' : 'en');
  
  // These functions now control the view state
  const handleRequestService = () => setView('details');
  const handleBackToList = () => setView('list');

  const tabs = [
    { id: 'steps', label: t.steps },
    { id: 'conditions', label: t.conditions },
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
                  <span className="mx-2 text-gray-400" aria-hidden="true">›</span>
                </li>
                <li className="flex items-center text-[14px] font-normal text-gray-700">
                  <a href="#" aria-current="page">{t.RegulatorySupport}</a>
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

        {/* Main Content Area - Renders views conditionally */}
        <main className="w-full px-4 lg:px-10 -mt-[50px] relative z-10">
          
          {view === 'list' ? (
            // --- LIST VIEW ---
            <div className="flex flex-col lg:flex-row gap-6 w-full items-stretch">
              {/* Main Content Card (Left) */}
              <div className="flex-1 bg-white rounded-[6px] shadow-[0px_3px_12px_0px_rgba(47,43,61,0.14)] mb-10">
                <div className="p-8 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <h2 className="text-[28px] font-bold text-[#161616]">{t.RequestRegulatorySupport}</h2>
                    <button onClick={handleRequestService} className="h-[40px] px-[16px] bg-[#1B8354] text-white text-base font-medium rounded-md hover:bg-[#146B43] transition-colors whitespace-nowrap">
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
                  <p className="text-base text-[#6C737F] mb-6">{t.description}</p>
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
          ) : (
            // --- DETAILS VIEW ---
            <RegSupportDetails onBack={handleBackToList} language={language} />
          )}

        </main>
      </div>
    </div>
  );
};

export default RegulatorySupport;