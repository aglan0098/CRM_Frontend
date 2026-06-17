import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Navbar from '@/components/NavBar/Navbar';
import Footer from '@/components/common/Footer';
import Breadcrumbs from './ui/Breadcrumbs';
import Tabs from './ui/Tabs';
import Button from '../../ComplaintEscalation/ui/Button';
import Login from '@/components/Login/Login';
import ServiceInfo from './ServiceInfo';
import StepsSection from './StepsSection';
import RelatedServices from './RelatedServices';
import FeedbackSection from './FeedbackSection';
import bg from './public/images/img_vector.png';
import ldic from './public/images/img_leading_icon_35x35.svg';
import ldic2 from './public/images/img_leading_icon_2.svg';
import Conditions from './Conditions';
import ReqDocs from './RequiredDocs';

// Import session manager to check authentication
import sessionManager from '@/utils/sessionManager';

const StrategicWater = () => {
  const [showAccessibilityTools, setShowAccessibilityTools] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const breadcrumbItems = [
    { label: 'Main Page', path: 'https://www.swa.gov.sa/services' },
    { label: 'Services', path: 'https://www.swa.gov.sa/services' },
    { label: 'Request for Strategic Water Storage', path: '/StrategicWater', active: true },
  ];

  const handleRequestService = () => {
    console.log('Request Service clicked');
    console.log('User logged in?', sessionManager.isUserLoggedIn());
    
    // Check if user is logged in
    if (sessionManager.isUserLoggedIn()) {
      // User is logged in - go directly to dashboard with E-Services tab active
      console.log('User is logged in, navigating to dashboard');
      localStorage.setItem('target_service', 'E-Services');
      localStorage.setItem('target_service_type', 'regulatory-support');
      navigate('/DashBoard'); // Use capital B to match your route
    } else {
      // User is not logged in - store intended destination and go to login
      console.log('User not logged in, storing redirect info and going to login');
      localStorage.setItem('login_redirect_target', 'dashboard_eservices');
      localStorage.setItem('login_redirect_service', 'regulatory-support');
      
      // Add a flag to indicate this is a service request login
      localStorage.setItem('service_request_login', 'true');
      
      navigate('/login'); // Use lowercase to match your route
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
      label: 'Steps',
      content: <StepsSection />
    },
    {
      label: 'Required Documents',
      content: <ReqDocs />
    }
  ];

  const toggleAccessibilityTools = () => {
    setShowAccessibilityTools(!showAccessibilityTools);
  };

  return (
    <div className="min-h-screen flex flex-col">
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
              {/* Left Column - Main Content */}
              <div className="flex-1">
                {/* Title and Button */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
                    Request for Strategic Water Storage
                  </h1>
                  <Button
                    variant="primary"
                    onClick={handleRequestService}
                    className="h-10"
                  >
                    Request Service
                  </Button>
                </div>

                {/* User Type Tags with spacing - Now clickable */}
                <div className="flex items-center gap-2 mb-4">
                  {/* <button
                    onClick={() => handleUserTypeClick('Business')}
                    className={`inline-flex items-center px-2 py-1 border rounded text-[12px] font-medium transition-colors duration-200 hover:bg-[#d1fae5] focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:ring-opacity-50 ${
                      selectedUserType === 'Business' 
                        ? 'bg-[#d1fae5] border-[#10b981] text-[#065f46]' 
                        : 'bg-[#ecfdf3] border-[#abefc6] text-[#085d3a]'
                    }`}
                  >
                    Business
                  </button> */}
                  
                  <button
                    onClick={() => handleUserTypeClick('Service Providers')}
                    className={`inline-flex items-center px-2 py-1 border rounded text-[12px] font-medium transition-colors duration-200 hover:bg-[#d1fae5] focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:ring-opacity-50 ${
                      selectedUserType === 'Service Providers' 
                        ? 'bg-[#d1fae5] border-[#10b981] text-[#065f46]' 
                        : 'bg-[#ecfdf3] border-[#abefc6] text-[#085d3a]'
                    }`}
                  >
                    Service Providers
                  </button>
                </div>

                {/* Description */}
                <p className="text-base text-text-primary mb-10">
                  Establishment and operation of facilities and tanks—within a defined geographical scope—for storing water to be used in emergency supply situations. This does not include storing water in underground layers, dams, or for purposes other than ensuring supply stability.
                </p>

                {/* Tabs */}
                <Tabs tabs={tabsContent} />
              </div>

              {/* Right Column - ServiceInfo Card */}
              <div className="w-full lg:w-80 flex-shrink-0">
                <ServiceInfo />
              </div>
            </div>
          </div>

          {/* Related Services - Pass the click handler */}
          <RelatedServices onServiceClick={handleRelatedServiceClick} />

          {/* Feedback Section */}
          <FeedbackSection />

          {/* Accessibility Buttons */}
          <div className="fixed right-4 sm:right-8 top-1/2 transform -translate-y-1/2 z-20 space-y-4">
            <button
              onClick={toggleAccessibilityTools}
              className="w-[50px] h-[50px] sm:w-[59px] sm:h-[59px] bg-white rounded-full border border-border-secondary shadow-lg flex items-center justify-center"
            >
              <img src={ldic} alt="Accessibility" className="w-[30px] h-[30px] sm:w-[35px] sm:h-[35px]" />
            </button>
            <button
              className="w-[50px] h-[50px] sm:w-[59px] sm:h-[59px] bg-white rounded-full border border-border-secondary shadow-lg flex items-center justify-center"
            >
              <img src={ldic2} alt="Help" className="w-[30px] h-[30px] sm:w-[35px] sm:h-[35px]" />
            </button>
          </div>

          {/* Under Development Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
              <div className="bg-[#006C45] text-white rounded-xl p-8 max-w-sm w-full relative shadow-lg">
                <button
                  className="absolute top-3 right-3 text-white text-xl font-bold hover:text-gray-300 focus:outline-none focus:border-black"
                  onClick={() => setShowModal(false)}
                >
                  &times;
                </button>
                <h2 className="text-2xl font-semibold mb-2">Under Development</h2>
                <p className="text-base">
                  This service is currently under development. Please check back later.
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

export default StrategicWater;