import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CompInq from "./assest/Inquiry.png";
import CompEsc from "./assest/Esclations.png";
import InciRep from "./assest/Incidents.png";
import WatBill from "./assest/Calculators.png";
import LicPer from "./assest/License.png";
import OrgSp from "./assest/Organization.png";
import CostRp from "./assest/Cost.png";
import Wtrcnn from "./assest/LargeWater.png";
import wstwtr from "./assest/WasteWater.png";
import { Tabs } from './ui/Tabs';

const PortalServicesArabic = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const tabs = [
    { id: 'all', label: 'الكل' },
    { id: 'individuals', label: 'خدمات الأفراد' },
    { id: 'providers', label: 'مقدمي الخدمة' },
    { id: 'business', label: 'الأعمال / الجهات الحكومية' },
  ];

  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const services = [
    {
      id: '1',
      title: 'تصعيد الشكاوى',
      description: 'تتيح هذه المنصة لجميع المستفيدين تصعيد شكاوى المياه والصرف الصحي إلى مقدمي الخدمات في حالة عدم الرضا عن الخدمة.',
      icon: CompEsc,
      category: 'individuals',
    },
    {
      id: '2',
      title: 'الاستعلام عن الشكاوى',
      description: 'تتيح هذه المنصة للمستفيدين الاستعلام عن حالة وتفاصيل شكاوى خدمات المياه والصرف الصحي الخاصة بهم.',
      icon: CompInq,
      category: 'individuals',
    },
    {
      id: '3',
      title: 'تقارير الحوادث',
      description: 'تتيح هذه المنصة للمستخدمين تقديم وتتبع وإدارة تقارير انتهاكات المواطنين بكفاءة، مما يوفر نظاماً مركزياً لتوثيق ومعالجة القضايا المختلفة.',
      icon: InciRep,
      category: 'individuals',
    },
    {
      id: '4',
      title: 'حاسبة فاتورة المياه',
      description: 'نص وصفي مع معلومات أكثر تفصيلاً حول محتويات البطاقة...',
      icon: WatBill,
      category: 'individuals',
    },
    {
      id: '5',
      title: 'التراخيص والتصاريح',
      description: 'نص وصفي مع معلومات أكثر تفصيلاً حول محتويات البطاقة...',
      icon: LicPer,
      category: 'providers',
    },
    {
      id: '6',
      title: 'الدعم التنظيمي',
      description: 'نص وصفي مع معلومات أكثر تفصيلاً حول محتويات البطاقة...',
      icon: OrgSp,
      category: 'providers',
    },
    {
      id: '7',
      title: 'إصلاح التكلفة',
      description: 'نص وصفي مع معلومات أكثر تفصيلاً حول محتويات البطاقة...',
      icon: CostRp,
      category: 'providers',
    },
    {
      id: '8',
      title: 'توصيلات المياه الكبيرة',
      description: 'نص وصفي مع معلومات أكثر تفصيلاً حول محتويات البطاقة...',
      icon: Wtrcnn,
      category: 'business',
    },
    {
      id: '9',
      title: 'إدارة مياه الصرف الصحي',
      description: 'نص وصفي مع معلومات أكثر تفصيلاً حول محتويات البطاقة...',
      icon: wstwtr,
      category: 'business',
    }
  ];

  const filteredServices = activeTab === 'all'
    ? services
    : services.filter(service => service.category === activeTab);

  const handleServiceClick = (service) => {
    if (service.title === 'تصعيد الشكاوى') {
      navigate('/ComplaintEscalationRequest');
    } else if (service.title === 'الاستعلام عن الشكاوى') {
      navigate('/ComplaintInquiryRequest');
    } else if (service.title === 'تقارير الحوادث') {
      navigate('/CitVioSerReq');
    }else if (service.title === 'الدعم التنظيمي') {
      navigate('/RegulatoryRequest');
    } else {
      setShowModal(true);
    }
  };

  return (
    <section className="pt-[36px] px-6 md:px-12 lg:px-24 mb-[80px]" dir="rtl">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-ibm-plex font-medium text-text-primary mb-8 text-right">
        خدمات البوابة
      </h2>

      <p className="text-base sm:text-lg font-ibm-plex font-normal text-text-primary mb-10 max-w-3xl text-justify line-clamp-2 text-right">
        يأتي وصف القسم هنا ويمكن أن يمتد عبر عدة أسطر. <br />حافظ على الإيجاز للحفاظ على الاهتمام.
      </p>

      {isMobile ? (
        <div className="mb-10">
          <select
            className="w-full p-3 border rounded-md text-base font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-700 text-right"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            dir="rtl"
          >
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.label}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          className="mb-10 text-lg font-medium main-tabs-sec"
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map(service => (
          <div
            key={service.id}
            onClick={() => handleServiceClick(service)}
            className="cursor-pointer bg-white text-black border border-gray-200 rounded-xl px-4 pt-4 pb-1 transition-all duration-300 flex flex-col h-full min-h-[200px] 
            hover:bg-[#006C45] hover:text-white hover:shadow-xl hover:scale-[1.02] focus:outline-none"
          >
            <div className="mb-3 flex justify-end">
              <img
                src={service.icon}
                alt={service.title}
                className="h-10 w-10 object-contain"
              />
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-1 text-right">{service.title}</h3>
            <p className="text-sm leading-relaxed text-right">{service.description}</p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-[#006C45] text-white rounded-xl p-8 max-w-sm w-full relative shadow-lg" dir="rtl">
            <button
              className="absolute top-3 left-3 text-white text-xl font-bold hover:text-gray-300 focus:outline-none focus:border-black"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold mb-2 text-right">قيد التطوير</h2>
            <p className="text-base text-right">
              هذه الخدمة قيد التطوير حالياً. يرجى المراجعة لاحقاً.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default PortalServicesArabic;