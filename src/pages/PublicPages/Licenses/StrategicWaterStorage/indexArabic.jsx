import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Navbar from '@/components/NavBar/NavbarArabic';
import Footer from '@/components/common/FooterArabic';
import Breadcrumbs from './ui/Breadcrumbs';
import Tabs from './ui/Tabs';
import Button from '../../ComplaintEscalation/ui/Button';
import ServiceInfo from './ServiceInfoArabic';
import StepsSection from './StepsSectionArabic';
import RelatedServices from './RelatedServicesArabic';
import FeedbackSection from './FeedbackSectionArabic';
import bg from './public/images/img_vector.png';
import ldic from './public/images/img_leading_icon_35x35.svg';
import ldic2 from './public/images/img_leading_icon_2.svg';
import Conditions from './ConditionsArabic';
import ReqDocs from './RequiredDocsArabic';

// Import session manager to check authentication
import sessionManager from '@/utils/sessionManager';

const StrategicWaterArabic = () => {
  const [showAccessibilityTools, setShowAccessibilityTools] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const breadcrumbItems = [
    { label: 'الصفحة الرئيسية', path: 'https://www.swa.gov.sa/services' },
    { label: 'الخدمات', path: 'https://www.swa.gov.sa/services' },
    { label: 'طلب التخزين الاستراتيجي للمياه', path: '/StrategicWater', active: true },
  ];

  const handleRequestService = () => {
    console.log('Request Service clicked');
    console.log('User logged in?', sessionManager.isUserLoggedIn());
    
    if (sessionManager.isUserLoggedIn()) {
      console.log('User is logged in, navigating to dashboard');
      localStorage.setItem('target_service', 'E-Services');
      localStorage.setItem('target_service_type', 'strategic-water');
      navigate('/DashBoard');
    } else {
      console.log('User not logged in, storing redirect info and going to login');
      localStorage.setItem('login_redirect_target', 'dashboard_eservices');
      localStorage.setItem('login_redirect_service', 'strategic-water');
      localStorage.setItem('service_request_login', 'true');
      navigate('/login');
    }
  };

  const handleUserTypeClick = (userType) => {
    setSelectedUserType(userType);
    console.log('Selected user type:', userType);
  };

  const handleRelatedServiceClick = () => {
    setShowModal(true);
  };

  const tabsContent = [
    {
      label: 'الخطوات',
      content: <StepsSection />
    },
    {
      label: 'الوثائق المطلوبة',
      content: <ReqDocs />
    }
  ];

  const toggleAccessibilityTools = () => {
    setShowAccessibilityTools(!showAccessibilityTools);
  };

  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <Navbar />

      <main className="flex-grow">
        <div className="bg-[#f7fdf9] min-h-screen relative">
          {/* Background vector */}
          <div className="absolute left-0 top-[72px] h-[510px] w-[298px] z-0">
            <img src={bg} alt="" className="h-full w-full object-cover" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-20 py-10 relative z-10">
            {/* Breadcrumbs */}
            <div className="mb-4">
              <Breadcrumbs items={breadcrumbItems} />
            </div>

            {/* Main Layout - Two Columns */}
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Right Column - Main Content */}
              <div className="flex-1">
                {/* Title and Button */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
                    طلب التخزين الاستراتيجي للمياه
                  </h1>
                  <Button
                    variant="primary"
                    onClick={handleRequestService}
                    className="h-10"
                  >
                    طلب الخدمة
                  </Button>
                </div>

                {/* User Type Tags with spacing - Now clickable */}
                <div className="flex items-center gap-2 mb-4">
                  <button
                    onClick={() => handleUserTypeClick('مقدمو الخدمات')}
                    className={`inline-flex items-center px-2 py-1 border rounded text-[12px] font-medium transition-colors duration-200 hover:bg-[#d1fae5] focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:ring-opacity-50 ${
                      selectedUserType === 'مقدمو الخدمات' 
                        ? 'bg-[#d1fae5] border-[#10b981] text-[#065f46]' 
                        : 'bg-[#ecfdf3] border-[#abefc6] text-[#085d3a]'
                    }`}
                  >
                    مقدمو الخدمات
                  </button>
                </div>

                {/* Description */}
                <p className="text-base text-text-primary mb-10">
                  إنشاء وتشغيل المرافق والخزانات - ضمن نطاق جغرافي محدد - لتخزين المياه لاستخدامها في حالات الإمداد الطارئة. هذا لا يشمل تخزين المياه في الطبقات الجوفية أو السدود أو لأغراض أخرى غير ضمان استقرار الإمداد.
                </p>

                {/* Tabs */}
                <Tabs tabs={tabsContent} />
              </div>

              {/* Left Column - ServiceInfo Card */}
              <div className="w-full lg:w-80 flex-shrink-0">
                <ServiceInfo />
              </div>
            </div>
          </div>

          {/* Related Services */}
          <RelatedServices onServiceClick={handleRelatedServiceClick} />

          {/* Feedback Section */}
          <FeedbackSection />

          {/* Accessibility Buttons */}
          <div className="fixed right-4 sm:right-8 top-1/2 transform -translate-y-1/2 z-20 space-y-4">
            <button
              onClick={toggleAccessibilityTools}
              className="w-[50px] h-[50px] sm:w-[59px] sm:h-[59px] bg-white rounded-full border border-border-secondary shadow-lg flex items-center justify-center"
            >
              <img src={ldic} alt="إمكانية الوصول" className="w-[30px] h-[30px] sm:w-[35px] sm:h-[35px]" />
            </button>
            <button
              className="w50px] h-[50px] sm:w-[59px] sm:h-[59px] bg-white rounded-full border border-border-secondary shadow-lg flex items-center justify-center"
            >
              <img src={ldic2} alt="المساعدة" className="w-[30px] h-[30px] sm:w-[35px] sm:h-[35px]" />
            </button>
          </div>

          {/* Under Development Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
              <div className="bg-[#006C45] text-white rounded-xl p-8 max-w-sm w-full relative shadow-lg" NavBar dir="rtl">
                <button
                  className="absolute top-3 right-3 text-white text-xl font-bold hover:text-gray-300 focus:outline-none focus:border-black"
                  onClick={() => setShowModal(false)}
                >
                  &times;
                </button>
                <h2 className="text-2xl font-semibold mb-2 text-right">قيد التطوير</h2>
                <p className="text-base text-right">
                  هذه الخدمة قيد التطوير حاليًا. يرجى المراجعة لاحقًا.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StrategicWaterArabic;