import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

// Centralized utilities
import sessionManager from '@/utils/sessionManager';
import { getStoredLanguage, storeLanguage, applyLanguageSettings, isRTL } from '@/utils/LanguageUtils';

// Image & Icon Assets
import SWA from './SWA.png';
import searchIcon from './searchicon.png';
import menu1 from './menu1.png'; // Dashboard
import menu2 from './menu2.png'; // E-Services
import menu4 from './menu4.png'; // My Requests
import menu6 from './menu6.png'; // Account
import menu7 from './menu7.png'; // Logout
import menu8 from './menu8.png'; // Customer Support

// Page/Content Components
import EsclationContent from '../ComplaintEscalationData/EsclationData';
import InquiryContent from '../InquiryData/InquiryData';
import InternalComplaintContent from '../InternalComplaintData/InternalData';
import RegSupportRequest from '../Organization Support/RegulatorySupportData/RegSupportRequest';
import StrategicWaterStorageRequest from '../StrategicWater/MyRequests/StrategicWaterStorageRequest/StrategicWaterStorageRequest';
import StrategicWaterAdditionalInfo from '../StrategicWater/MyRequests/Additional Information/StrategicWaterAdditionalInfo';
import Eservicepage from '../E Services/Eservicepage';
import Graph from '../GraphicalView/Graph';
import UnderDevelopmentBox from '../Underdev';
import RenewalRequest from '../StrategicWater/Renewal Request/RenewalRequest';
import config from '@/utils/config';
// API Functions
import { checkUserExists, deleteUser } from '@/components/Login/Firestore_SMS_CRMAuth/APIs';

// --- Inline SVG Icons ---
const FaBars = () => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"></path>
    </svg>
);

const FaChevronDown = ({ className }) => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" className={className} height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
        <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path>
    </svg>
);

const sidebarTranslations = {
  en: {
    searchPlaceholder: 'Search',
    hello: 'Hello',
    dashboard: 'Dashboard',
    eServices: 'E-Services',
    myRequests: 'My Requests',
    complaintEscalation: 'Complaint Escalation',
    complaintInquiry: 'Complaint Inquiry',
    generalComplaint: 'General Complaint',
    incidentReporting: 'Incident Reporting',
    regulatorySupport: 'Regulatory Support',
    strategicWaterStorage: 'Strategic Water Storage',
    myDocuments: 'My Documents',
    myLicenses: 'My Licenses',
    customerSupport: 'Customer Support',
    account: 'Account',
    logout: 'Logout',
  },
  ar: {
    searchPlaceholder: 'بحث',
    hello: 'مرحبا',
    dashboard: 'لوحة التحكم',
    eServices: 'الخدمات الإلكترونية',
    myRequests: 'طلباتي',
    complaintEscalation: 'تصعيد الشكوى',
    complaintInquiry: 'استعلام عن الشكوى',
    generalComplaint: 'شكوى عامة',
    incidentReporting: 'الإبلاغ عن الحوادث',
    regulatorySupport: 'الدعم التنظيمي',
    strategicWaterStorage: 'تخزين المياه الاستراتيجي',
    myDocuments: 'وثائقي',
    myLicenses: 'تراخيصي',
    customerSupport: 'دعم العملاء',
    account: 'الحساب',
    logout: 'تسجيل الخروج',
  },
};

const SWASidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [activeSubmenu, setActiveSubmenu] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [documentsDropdownOpen, setDocumentsDropdownOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [userInfo, setUserInfo] = useState({ firstName: '', initials: 'SK' });
  const [language, setLanguage] = useState(getStoredLanguage);
  const [componentResetKey, setComponentResetKey] = useState(0);

  const t = sidebarTranslations[language];
  const isRTLLanguage = isRTL(language);

  // Apply language settings on initial load and on language change
  useEffect(() => {
  const loadUser = async () => {
    const userData = JSON.parse(localStorage.getItem('swa_user'));
    if (userData?.userId) {
      try {
        const result = await checkUserExists(userData.userId);
        const user = result?.user;
        if (user) {
          // Initials always use English names
          const initials = (user.firstName?.[0] || '') + (user.lastName?.[0] || '');
          
          // Display name depends on current language
          const displayFirstName = language === 'ar' 
            ? (user.firstNameara|| user.firstName || '') 
            : (user.firstName || '');
            
          setUserInfo({ 
            firstName: displayFirstName, 
            initials: initials || 'SK' 
          });
        }
      } catch (error) {
        console.error("Failed to load user info:", error);
        setUserInfo({ firstName: '', initials: 'SK' });
      }
    }
  };
  loadUser();
}, [language]);

  // Handle deep linking from URL parameters and login redirects
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const caseType = params.get('caseName') || params.get('casename');
    const caseId = params.get('caseId') || params.get('guid');

    // Check for login redirect targets
    const redirectTarget = localStorage.getItem('login_redirect_target');
    const redirectService = localStorage.getItem('login_redirect_service');
    const targetService = localStorage.getItem('target_service');

    // Handle redirect after login
    if (redirectTarget === 'dashboard_eservices' && sessionManager.isUserLoggedIn()) {
      setActiveMenu('E-Services');
      setDropdownOpen(false);
      setDocumentsDropdownOpen(false);
      setActiveSubmenu('');
      // Clean up redirect flags
      localStorage.removeItem('login_redirect_target');
      localStorage.removeItem('login_redirect_service');
      localStorage.removeItem('target_service');
      localStorage.removeItem('target_service_type');
      if (location.search) navigate('/DashBoard', { replace: true });
      return;
    }

    // Handle direct target service
    if (targetService === 'E-Services' && sessionManager.isUserLoggedIn()) {
      setActiveMenu('E-Services');
      setDropdownOpen(false);
      setDocumentsDropdownOpen(false);
      setActiveSubmenu('');
      localStorage.removeItem('target_service');
      localStorage.removeItem('target_service_type');
      return;
    }

    if (!caseType || !caseId) return;

    const submenuMapping = {
      'escalation': 'Complaint Escalation',
      'complaintescalation': 'Complaint Escalation',
      'inquiry': 'Complaint Inquiry',
      'complaintinquiry': 'Complaint Inquiry',
      'general': 'General Complaint',
      'generalcomplaint': 'General Complaint',
      'regulatory': 'Regulatory Support',
      'strategicwaterstorage': 'Strategic Water Storage',
    };

    const submenuName = submenuMapping[caseType.toLowerCase()];

    if (submenuName) {
        if (!sessionManager.isUserLoggedIn()) {
            localStorage.setItem('deep_link_case_id', caseId);
            localStorage.setItem('deep_link_case_type', caseType);
            navigate('/login');
            return;
        }
        setDropdownOpen(true);
        setDocumentsDropdownOpen(false);
        setActiveMenu('My Requests');
        setActiveSubmenu(submenuName);
        localStorage.setItem('deep_link_case_id', caseId);
        if (location.search) navigate('/DashBoard', { replace: true });
    }
  }, [location, navigate]);
  
  const handleLanguageChange = (newLanguage) => {
    storeLanguage(newLanguage);
    setLanguage(newLanguage);
  };

  const handleLogout = async () => {
    try {
      const storedUser = localStorage.getItem('swa_user');
      if (storedUser) {
        const parsedData = JSON.parse(storedUser);
        if (parsedData.userId) {
          await deleteUser(parsedData.userId);
          console.log("User deleted from Firestore successfully");
        }
      }
      await sessionManager.logout();
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
        navigate('/');
    }
  };

  const closeMobileSidebar = () => {
    if (window.innerWidth <= 1024) {
      setSidebarVisible(false);
    }
  };

  const handleMenuClick = (menuName) => {
    if (menuName === 'My Requests') {
      setDropdownOpen(prev => !prev);
      setDocumentsDropdownOpen(false);
    } else if (menuName === 'My Documents') {
      setDocumentsDropdownOpen(prev => !prev);
      setDropdownOpen(false);
    } else {
      setDropdownOpen(false);
      setDocumentsDropdownOpen(false);
      setActiveSubmenu('');
    }
    if (menuName === 'Logout') {
      handleLogout();
      return;
    }
    setActiveMenu(menuName);
    closeMobileSidebar();
  };

  const handleSubmenuClick = (submenuName, e) => {
    e.stopPropagation();
    if (activeSubmenu === submenuName) {
      setComponentResetKey(prev => prev + 1);
    }
    setActiveSubmenu(submenuName);
    setActiveMenu('My Requests');
    closeMobileSidebar();
    localStorage.removeItem('deep_link_case_id');
    localStorage.removeItem('deep_link_case_type');
  };

  const handleDocumentSubmenuClick = (submenuName, e) => {
    e.stopPropagation();
    if (activeSubmenu === submenuName) {
      setComponentResetKey(prev => prev + 1);
    }
    setActiveSubmenu(submenuName);
    setActiveMenu('My Documents');
    closeMobileSidebar();
  };

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);

  const renderContent = () => {
    const commonProps = { 
      language: language, 
      onLanguageChange: handleLanguageChange, 
      key: componentResetKey 
    };
    
    if (activeSubmenu) {
      switch (activeSubmenu) {
        case 'Complaint Escalation': return <EsclationContent {...commonProps} />;
        case 'Complaint Inquiry': return <InquiryContent {...commonProps} />;
        case 'General Complaint': return <InternalComplaintContent {...commonProps} />;
        case 'Incident Reporting': return <UnderDevelopmentBox {...commonProps} />;
        case 'Regulatory Support': return <RegSupportRequest {...commonProps} />;
        case 'Strategic Water Storage': return <StrategicWaterStorageRequest {...commonProps} />;
        case 'My Licenses': return <RenewalRequest {...commonProps} />;
        default: return null;
      }
    }
    switch (activeMenu) {
      case 'Dashboard': return <Graph {...commonProps} />;
      case 'E-Services': return <Eservicepage {...commonProps} />;
      case 'My Requests': return <EsclationContent {...commonProps} />; // Default view for 'My Requests'
      case 'My Documents': return <UnderDevelopmentBox {...commonProps} />; // Default view for 'My Documents'
      case 'Customer Support': return <UnderDevelopmentBox {...commonProps} />;
      case 'Account': return <UnderDevelopmentBox {...commonProps} />;
      default: return null;
    }
  };

  const MenuItem = ({ name, icon, onClick, activeCondition, isDropdownParent = false, children }) => (
    <div className={`flex flex-col rounded-md ${activeCondition ? 'bg-gray-100' : 'hover:bg-gray-50'}`}>
      <div className="relative flex items-center justify-between py-4 px-4 cursor-pointer" onClick={onClick}>
        <div className={`absolute top-0 h-full w-1 bg-[#085D3A] transition-opacity ${activeCondition ? 'opacity-100' : 'opacity-0'} ${isRTLLanguage ? 'right-0 rounded-l-md' : 'left-0 rounded-r-md'}`}></div>
        <div className="flex items-center gap-2">
          <img src={icon} alt={name} className={`w-5 h-5 object-contain flex-shrink-0 ${activeCondition ? 'filter invert-[27%] sepia-[51%] saturate-[2878%] hue-rotate-[146deg] brightness-104 contrast-97' : ''}`} />
          <p className="text-gray-800 text-[15px] font-semibold">{name}</p>
        </div>
        {isDropdownParent && <FaChevronDown className={`text-xs text-gray-600 transition-transform duration-300 ${(name === t.myRequests && dropdownOpen) || (name === t.myDocuments && documentsDropdownOpen) ? 'rotate-180 text-[#085D3A]' : ''}`} />}
      </div>
      {children}
    </div>
  );

  const SubMenuItem = ({ name, onClick, activeCondition }) => (
    <div className={`relative flex items-center w-full gap-2 py-3 cursor-pointer rounded-md ${isRTLLanguage ? 'pr-12 justify-end' : 'pl-12 justify-start'} ${activeCondition ? 'bg-gray-100' : 'hover:bg-gray-50'}`} onClick={onClick}>
      <div className={`absolute top-0 h-full w-1 bg-[#085D3A] transition-opacity ${activeCondition ? 'opacity-100' : 'opacity-0'} ${isRTLLanguage ? 'right-[2px] rounded-l-md' : 'left-[2px] rounded-r-md'}`}></div>
      <p className="text-gray-800 text-sm font-medium">{name}</p>
    </div>
  );

  const Separator = () => <div className="py-2"><hr className="border-t border-gray-200" /></div>;

  return (
    <div className={`flex flex-col lg:flex-row w-full min-h-screen bg-gray-50 overflow-x-hidden ${isRTLLanguage ? 'rtl' : 'ltr'}`}>
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white shadow-md flex items-center justify-between px-4 z-50">
        <button className="bg-transparent text-[#085D3A] p-2 rounded-md cursor-pointer text-xl" onClick={toggleSidebar}><FaBars /></button>
        <Link to="/"><img src={SWA} alt="SWA Logo" className="h-9 w-auto object-contain" /></Link>
      </header>

      <div className={`fixed inset-0 bg-black/50 z-[999] lg:hidden transition-opacity ${sidebarVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setSidebarVisible(false)}></div>

      <aside className={`flex flex-col bg-white z-[1000] fixed top-0 h-screen shadow-lg transition-transform duration-300 w-[280px] lg:static lg:h-auto lg:translate-x-0 lg:flex-shrink-0 ${isRTLLanguage ? 'right-0' : 'left-0'} ${sidebarVisible ? 'translate-x-0' : (isRTLLanguage ? 'translate-x-full' : '-translate-x-full')}`}>
        <div className="px-8 pt-5 pb-2.5 flex items-center justify-between">
          <Link to="/"><img src={SWA} alt="SWA Logo" className="w-[70px] h-[82px] object-contain" /></Link>
          <button className="lg:hidden text-gray-500 hover:text-gray-800 text-2xl -mr-4" onClick={toggleSidebar}>&times;</button>
        </div>

        <section className="flex-1 flex flex-col self-stretch py-3 px-5 gap-4 overflow-y-auto scrollbar-hide">
          <div className="flex flex-col flex-grow w-full">
            <div className="relative w-full h-10">
              <img src={searchIcon} alt="Search" className={`absolute w-4 h-4 top-1/2 -translate-y-1/2 text-gray-400 ${isRTLLanguage ? 'right-3' : 'left-3'}`} />
              <input type="text" placeholder={t.searchPlaceholder} className={`w-full h-full border border-gray-300 rounded-md bg-transparent outline-none ring-offset-2 focus:ring-2 focus:ring-[#085D3A] text-sm text-gray-500 placeholder-gray-500 ${isRTLLanguage ? 'pr-9 text-right' : 'pl-9 text-left'}`} />
            </div>
            <div className="flex flex-col items-center justify-center my-4 w-full">
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-xl font-semibold text-gray-700 mb-4">{userInfo.initials}</div>
              <p className="text-gray-900 text-center text-sm font-medium">{t.hello} {userInfo.firstName}!</p>
            </div>
            <div className="flex flex-col w-full">
              <MenuItem name={t.dashboard} icon={menu1} onClick={() => handleMenuClick('Dashboard')} activeCondition={activeMenu === 'Dashboard'} />
              <Separator />
              <MenuItem name={t.eServices} icon={menu2} onClick={() => handleMenuClick('E-Services')} activeCondition={activeMenu === 'E-Services'} />
              <Separator />
              <MenuItem name={t.myRequests} icon={menu4} onClick={() => handleMenuClick('My Requests')} activeCondition={activeMenu === 'My Requests'} isDropdownParent={true}>
                {dropdownOpen && (
                  <div className="w-full flex flex-col mt-1">
                    <SubMenuItem name={t.complaintEscalation} onClick={(e) => handleSubmenuClick('Complaint Escalation', e)} activeCondition={activeSubmenu === 'Complaint Escalation'} />
                    <SubMenuItem name={t.complaintInquiry} onClick={(e) => handleSubmenuClick('Complaint Inquiry', e)} activeCondition={activeSubmenu === 'Complaint Inquiry'} />
                    <SubMenuItem name={t.generalComplaint} onClick={(e) => handleSubmenuClick('General Complaint', e)} activeCondition={activeSubmenu === 'General Complaint'} />
                    <SubMenuItem name={t.incidentReporting} onClick={(e) => handleSubmenuClick('Incident Reporting', e)} activeCondition={activeSubmenu === 'Incident Reporting'} />
                    <SubMenuItem name={t.regulatorySupport} onClick={(e) => handleSubmenuClick('Regulatory Support', e)} activeCondition={activeSubmenu === 'Regulatory Support'} />
                    <SubMenuItem name={t.strategicWaterStorage} onClick={(e) => handleSubmenuClick('Strategic Water Storage', e)} activeCondition={activeSubmenu === 'Strategic Water Storage'} />
                  </div>
                )}
              </MenuItem>
              <Separator />
              <MenuItem name={t.myDocuments} icon={menu4} onClick={() => handleMenuClick('My Documents')} activeCondition={activeMenu === 'My Documents'} isDropdownParent={true}>
                {documentsDropdownOpen && (
                  <div className="w-full flex flex-col mt-1">
                    <SubMenuItem name={t.myLicenses} onClick={(e) => handleDocumentSubmenuClick('My Licenses', e)} activeCondition={activeSubmenu === 'My Licenses'} />
                  </div>
                )}
              </MenuItem>
            </div>
          </div>
          <div className="w-full py-4 px-3 border-t border-gray-200 mt-auto">
            <div className="flex flex-col gap-y-2">
              <MenuItem name={t.customerSupport} icon={menu8} onClick={() => handleMenuClick('Customer Support')} activeCondition={activeMenu === 'Customer Support'} />
              <MenuItem name={t.account} icon={menu6} onClick={() => handleMenuClick('Account')} activeCondition={activeMenu === 'Account'} />
              <MenuItem name={t.logout} icon={menu7} onClick={() => handleMenuClick('Logout')} activeCondition={activeMenu === 'Logout'} />
            </div>
          </div>
        </section>
      </aside>

      <main className="flex-1 w-full min-h-screen bg-white">
        <div className="pt-16 lg:pt-0 h-full">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default SWASidebar;