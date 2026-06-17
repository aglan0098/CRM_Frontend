import React, { useState } from 'react';
import { User, Clock, Monitor, ExternalLink, Phone, ArrowLeft, ArrowRight } from 'lucide-react';

const IncidentInquiryDetails = ({ language = 'ar', onStartService }) => {
  const isRtl = language === 'ar';
  const [activeTab, setActiveTab] = useState('steps');

  const t = {
    ar: {
      breadcrumb: 'الرئيسية > الخدمات الإلكترونية > خدمة الاستعلام عن بلاغ',
      title: 'خدمة الاستعلام عن بلاغ',
      description: 'تتيح هذه الخدمة للمستفيد الاستعلام إلكترونيا عن حالة البلاغ المقدم إلى الهيئة السعودية للمياه، والاطلاع على الإجراءات الرقابية المتخذة بشأنه، وذلك وفق الأنظمة واللوائح المعتمدة في قطاع المياه.',
      startService: 'بدء الخدمة',
      tabs: {
        goals: 'أهداف الخدمة',
        conditions: 'شروط الاستخدام',
        requirements: 'متطلبات الخدمة',
        steps: 'خطوات استخدام الخدمة',
      },
      tabContent: {
       goals: [
          'تمكين مقدم البلاغ من متابعة حالته والإجراءات الرقابية المرتبطة به بشكل إلكتروني.',
          'تعزيز الشفافية في معالجة البلاغات وإتاحة معلومات محدثة عنها.',
          'تسهيل وصول المستفيد إلى بيانات البلاغ دون الحاجة إلى مراجعة مقر الهيئة.',
          'دعم فاعلية الرقابة من خلال تمكين المتابعة المنظمة للبلاغات المقدمة.'
        ],
        conditions: [
          'وجود بلاغ مسجل مسبقاً لدى الهيئة.',
          'توفر بيانات الاستعلام الصحيحة المرتبطة بالبلاغ.'
        ],
        requirements: [
          'إدخال رقم البلاغ في الحقل المخصص.',
          'إدخال البيانات التعريفية المطلوبة للتحقق حسب نموذج الخدمة.'
        ],
        steps: [
          'الدخول إلى الموقع الإلكتروني للهيئة السعودية للمياه.',
          'الانتقال إلى قائمة الخدمات الإلكترونية.',
          'اختيار خدمة الاستعلام عن بلاغ.',
          'إدخال رقم البلاغ في الحقل المخصص.',
          'إدخال البيانات المطلوبة للتحقق.',
          'الضغط على زر استعلام لعرض حالة البلاغ.'
        ],
      },
      sidebar: {
        targetCategory: 'الفئة المستهدفة',
        targetCategoryValue: 'الأفراد',
        duration: 'مدة الخدمة',
        durationValue: 'استعلام فوري',
        channels: 'قنوات الخدمة',
        channelsValue: 'بوابة الخدمات',
        cost: 'تكلفة الخدمة',
        costValue: 'مجانًا',
        faq: 'الأسئلة الشائعة',
        faqLink: 'صفحة الأسئلة الشائعة - SWA',
        phone: 'الهاتف',
        phoneValue: '19913'
      }
    },
    en: {
      breadcrumb: 'Home > E-Services > Incident Inquiry Service',
      title: 'Incident Inquiry Service',
      description: 'This service enables beneficiaries to electronically inquire about the status of reports submitted to the Saudi Water Authority and to view the supervisory actions taken, in accordance with the laws and regulations governing the water sector.',
      startService: 'Start Service',
      tabs: {
        goals: 'Service Objectives',
        conditions: 'Terms of Use',
        requirements: 'Service Requirements',
        steps: 'Incident Inquiry Steps',
      },
      tabContent: {
        goals: [
          'Enable the complainant to electronically track the status of their incident and the associated regulatory actions.',
          'Enhance transparency in handling incidents and provide up-to-date information.',
          'Facilitate beneficiaries’ access to incident data without the need to visit the Authority’s headquarters.',
          'Support effective oversight through organized monitoring of submitted incidents.'
        ],
        conditions: [
          'An incident must have been previously registered with the Authority.',
          'Accurate inquiry information related to the incident must be available.'
        ],
        requirements: [
         'Enter the incident number in the designated field.',
         'Enter the required identification details for verification according to the service form'
        ],
        steps: [
          'Access the Saudi Water Authority’s website.',
          'Navigate to the E-Services menu.',
          'Select the “incident Inquiry” service.',
          'Enter the incident number in the designated field.',
          'Enter the required verification details.',
          'Click the “Inquire” button to view the status of the incident.'
        ]
      },
      sidebar: {
        targetCategory: 'Target Category',
        targetCategoryValue: 'Individuals',
        duration: 'Service Duration',
        durationValue: 'Instant Inquiry',
        channels: 'Service Channels',
        channelsValue: 'Services Portal',
        cost: 'Service Cost',
        costValue: 'Free',
        faq: 'FAQ',
        faqLink: "SWA-FAQ's-page",
        phone: 'Phone',
        phoneValue: '19913'
      }
    }
  };

  const texts = t[language];

  return (
    <div className="flex-grow flex flex-col bg-white" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 md:px-20 py-12 flex-grow">


        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

          {/* Details */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
              <div className="max-w-3xl">
                <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
                  {texts.breadcrumb.split(' > ').map((crumb, idx, arr) => (
                    <React.Fragment key={idx}>
                      <span className={idx === arr.length - 1 ? 'text-gray-900 font-medium' : ''}>{crumb}</span>
                      {idx < arr.length - 1 && (
                        <span className="mx-1">{isRtl ? '<' : '>'}</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {texts.title}
                </h1>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {texts.description}
                </p>
              </div>
              <div className="shrink-0">
                <button
                  onClick={onStartService}
                  className="px-8 py-3 bg-[#1e7b51] text-white font-bold rounded hover:bg-[#165a3b] transition-colors"
                >
                  {texts.startService}
                </button>
              </div>
            </div>

            <div>
              <div className="border-b border-gray-200 mb-8">
                <div className="flex gap-8">
                  {['goals', 'steps', 'conditions', 'documents'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`focus:outline-none pb-4 text-lg font-medium transition-colors relative ${activeTab === tab
                        ? 'text-gray-900'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      {texts.tabs[tab]}
                      {activeTab === tab && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1e7b51]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="animate-fadeIn">
                <ul className="space-y-4">
                  {texts.tabContent[activeTab].map((item, idx) => (
                    <li key={idx} className="flex gap-3 text-gray-800 text-lg">
                      <span className="font-medium">{idx + 1}-</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="space-y-6">

                <div className="flex items-center gap-4">
                  <div className="text-[#1e7b51] shrink-0">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 mb-1">{texts.sidebar.targetCategory}</p>
                    <p className="text-gray-600">{texts.sidebar.targetCategoryValue}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-[#1e7b51] shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 mb-1">{texts.sidebar.duration}</p>
                    <p className="text-gray-600">{texts.sidebar.durationValue}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-[#1e7b51] shrink-0">
                    <Monitor className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 mb-1">{texts.sidebar.channels}</p>
                    <p className="text-gray-600">{texts.sidebar.channelsValue}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-[#1e7b51] shrink-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22.75C17.9371 22.75 22.75 17.9369 22.75 12C22.75 6.06292 17.9371 1.25 12 1.25C6.06292 1.25 1.25 6.06292 1.25 12C1.25 17.9369 6.06291 22.75 12 22.75ZM12 21.25C6.89136 21.25 2.75 17.1085 2.75 12C2.75 6.89135 6.89135 2.75 12 2.75C17.1087 2.75 21.25 6.89135 21.25 12C21.25 17.1085 17.1086 21.25 12 21.25ZM10.3359 15.3135C10.6075 15.2588 10.8414 15.1035 10.9932 14.8896L11.6045 14.0117C11.668 13.9209 11.7051 13.8113 11.7051 13.6934V12.4023L12.8818 12.1611V14.4883L16.6582 13.7109C16.8365 13.3283 16.9548 12.9131 17 12.4775L14.0586 13.083V11.9189L16.6582 11.3838C16.8365 11.0012 16.9548 10.5859 17 10.1504L14.0586 10.7549L14.0586 6.56934C13.6079 6.81421 13.2072 7.13996 12.8818 7.52441L12.8818 10.9971L11.7051 11.2393L11.7051 6C11.2546 6.24472 10.8546 6.57078 10.5293 6.95508L10.5293 11.4805L7.89648 12.0225C7.71818 12.4051 7.59999 12.8204 7.55469 13.2559L10.5293 12.6445V14.1104L7.3418 14.7656C7.16335 15.1484 7.04519 15.5642 7 16L10.3359 15.3135ZM16.668 16.2275C16.8413 15.8468 16.956 15.4334 17 15L13.332 15.7725C13.1587 16.1533 13.0439 16.5666 13 17L16.668 16.2275Z" fill="#1B8354" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 mb-1">{texts.sidebar.cost}</p>
                    <p className="text-gray-600">{texts.sidebar.costValue}</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 my-4"></div>

                <div>
                  <p className="text-sm font-bold text-gray-900 mb-2">{texts.sidebar.faq}</p>
                  <a href="https://www.swa.gov.sa/faq" className="underline flex items-center gap-2 text-[#1e7b51] hover:underline text-sm focus:outline-none" target="_blank">
                    {texts.sidebar.faqLink}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-5 h-5 text-[#1e7b51]" />
                    <p className="text-sm font-bold text-gray-900">{texts.sidebar.phone}</p>
                  </div>
                  <a href={`tel:${texts.sidebar.phoneValue}`} className="flex items-center gap-2 text-[#1e7b51] hover:underline">
                    <ExternalLink className="w-4 h-4" />
                    <span dir="ltr">{texts.sidebar.phoneValue}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentInquiryDetails;
