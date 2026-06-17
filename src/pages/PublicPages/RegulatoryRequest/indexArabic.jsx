import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Navbar from '@/components/NavBar/NavbarArabic';
import Footer from '@/components/common/FooterArabic';
import Breadcrumbs from './ui/Breadcrumbs';
import Tabs from './ui/Tabs';
import Button from '../ComplaintEscalation/ui/Button';
import ServiceInfo from './ServiceInfoArabic';
import StepsSection from './StepsSectionArabic';
import RelatedServices from './RelatedServicesArabic';
import FeedbackSection from './FeedbackSectionArabic';
import bg from './public/images/img_vector.png';
import ldic from './public/images/img_leading_icon_35x35.svg';
import ldic2 from './public/images/img_leading_icon_2.svg';
import Conditions from './ConditionsArabic';
import ReqDocs from './RequiredDocsArabic';

const RegulatoryRequestArabic = () => {
  const [showAccessibilityTools, setShowAccessibilityTools] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState('');
  const navigate = useNavigate();

  const breadcrumbItems = [
    { label: 'الصفحة الرئيسية', path: 'https://www.swa.gov.sa/services' },
    { label: 'الخدمات', path: 'https://www.swa.gov.sa/services' },
    // { label: 'خدمة تصعيد الشكاوى', path: '/ComplaintEscalationRequest', active: true },
        { label: 'طلب الدعم التنظيمي', path: '/RegulatoryRequest', active: true },
  ];

  const handleRequestService = () => {
    navigate('/ComplaintEscalation');
  };

  const handleUserTypeClick = (userType) => {
    setSelectedUserType(userType);
    // Add any additional logic here for when a user type is selected
    console.log('Selected user type:', userType);
  };

  const tabsContent = [
    {
      label: 'الخطوات',
      content: <StepsSection />
    },
    // {
    //   label: 'الشروط',
    //   content: <Conditions />
    // },
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
          <div className="absolute right-0 top-[72px] h-[510px] w-[298px] z-0">
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
                    طلب الدعم التنظيمي
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
                    onClick={() => handleUserTypeClick('الأعمال')}
                    className={`inline-flex items-center px-2 py-1 border rounded text-[12px] font-medium transition-colors duration-200 hover:bg-[#d1fae5] focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:ring-opacity-50 ${
                      selectedUserType === 'الأعمال' 
                        ? 'bg-[#d1fae5] border-[#10b981] text-[#065f46]' 
                        : 'bg-[#ecfdf3] border-[#abefc6] text-[#085d3a]'
                    }`}
                  >
                    الأعمال
                  </button>
                  
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
                  تتيح هذه الخدمة للجهات الحكومية والخاصة تقديم طلبات أو استفسارات للحصول على خدمات الدعم التنظيمي، وهي خدمات محكومة بمعايير قانونية تهدف إلى معالجة القضايا المتعلقة ببنية قطاع المياه التحتية
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
          <RelatedServices />

          {/* Feedback Section */}
          <FeedbackSection />

          {/* Accessibility Buttons */}
          <div className="fixed left-4 sm:left-8 top-1/2 transform -translate-y-1/2 z-20 space-y-4">
            <button
              onClick={toggleAccessibilityTools}
              className="w-[50px] h-[50px] sm:w-[59px] sm:h-[59px] bg-white rounded-full border border-border-secondary shadow-lg flex items-center justify-center"
            >
              <img src={ldic} alt="إمكانية الوصول" className="w-[30px] h-[30px] sm:w-[35px] sm:h-[35px]" />
            </button>
            <button
              className="w-[50px] h-[50px] sm:w-[59px] sm:h-[59px] bg-white rounded-full border border-border-secondary shadow-lg flex items-center justify-center"
            >
              <img src={ldic2} alt="مساعدة" className="w-[30px] h-[30px] sm:w-[35px] sm:h-[35px]" />
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RegulatoryRequestArabic;