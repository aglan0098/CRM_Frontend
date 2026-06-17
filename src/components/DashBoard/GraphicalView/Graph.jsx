import React, { useState, useEffect } from 'react';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
// IMPORTANT: No CSS file needed! Delete Graphs.css from your project.
// import './Graphs.css'; // This line is REMOVED
import config from '@/utils/config';
import translate from './Translate.png';
import vector from './Vector.png';
import Moon from './Moon.png';
import Bell from './Bell.png';
import bannerback from './baner.png';
import drop from './svgviewer-png-output.png';

// Register ChartJS components
ChartJS.register(...registerables);

// Translations for localization
const translations = {
  en: {
    eService: 'E-Service',
    dashboard: 'Dashboard',
    reportLeakTip: 'Tip: Report leaks promptly—a dripping tap wastes 6,000+ liters/year',
    totalCases: 'Total Cases',
    complaints: 'Complaints',
    internalComplaints: 'Internal Complaints',
    inquiries: 'Inquiries',
    casesByStatus: 'Cases by Status',
    casesByRegion: 'Cases by Region',
    caseTypeDistribution: 'Case Type Distribution',
    loadingDashboard: 'Loading dashboard data...',
    errorLoadingData: 'Error: Failed to load dashboard data.',
    noDataAvailable: 'No data available',
    submitted: 'Submitted',
    inProgress: 'In Progress',
    actionRequired: 'Action Required',
    caseResolved: 'Case Resolved',
    unknown: 'Unknown',
    notSpecified: 'Not Specified',
    hiCompany: 'Hi NC Company!',
    gatewayText: 'Gateway to seamless water services management, offering secure and efficient e-solutions.',
    open: 'Open',
    closed: 'Closed',
    pendingActions: 'Pending Actions',
    actionsRequired: 'Actions Required',
    moreInfoNeeded: 'More info needed:',
    completeStepsText: 'Please complete the required steps in Complaint Escalation Case to process your request.',
    latestRequests: 'Latest Requests',
    search: 'Search',
    status: 'Status',
    requestType: 'Request Type',
    requestNumber: 'Request Number',
    activityType: 'Activity Type',
    submissionDate: 'Submission Date',
    actions: 'Actions',
    viewDetails: 'View Details',
  },
  ar: {
    eService: 'الخدمة الإلكترونية',
    dashboard: 'لوحة القيادة',
    reportLeakTip: 'تنويه: نرجو الإبلاغ فورًا عن أي تسرب مائي، حيث إن صنبورًا واحدًا قد يتسبب في هدر أكثر من 6,000 لتر من المياه سنويًا',
    totalCases: 'إجمالي الحالات',
    complaints: 'الشكاوى',
    internalComplaints: 'الشكاوى الداخلية',
    inquiries: 'الاستفسارات',
    casesByStatus: 'الحالات حسب الحالة',
    casesByRegion: 'الحالات حسب المنطقة',
    caseTypeDistribution: 'توزيع أنواع الحالات',
    loadingDashboard: 'جاري تحميل بيانات لوحة القيادة...',
    errorLoadingData: 'خطأ: فشل في تحميل بيانات لوحة القيادة.',
    noDataAvailable: 'لا توجد بيانات متاحة',
    submitted: 'مُقدم',
    inProgress: 'قيد المعالجة',
    actionRequired: 'يتطلب إجراء',
    caseResolved: 'تم حل القضية',
    unknown: 'غير معروف',
    notSpecified: 'غير محدد',
  },
};

const Graph = ({ language = 'en', onLanguageChange }) => {
  const [dashboardData, setDashboardData] = useState({
    complaints: [],
    internalComplaints: [],
    inquiries: [],
    complaintsCount: 0,
    internalComplaintsCount: 0,
    inquiriesCount: 0,
    loading: true,
    error: null
  });
  const [notificationCount, setNotificationCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const t = translations[language];

  // Color palette for charts
  const chartColors = {
    complaints: '#2E8B57',
    internal: '#4682B4',
    inquiries: '#CD853F',
    submitted: '#4BC0C0',
    inProgress: '#FFA500',
    actionRequired: '#FF6384',
    resolved: '#36A2EB',
    otherStatus: '#8A2BE2',
    notSpecified: '#A9A9A9',
    background: '#F7FDF9',
    cardBackground: '#FFFFFF',
    textPrimary: '#161616',
    textSecondary: '#666666'
  };

  // Helper function to map API stage/status to display status (translated)
  const getDisplayStatus = (stageName, status) => {
    if (stageName === "Request Submission") {
      return t.submitted;
    } else if (stageName === "Evaluation") {
      if (status === "Awaiting Beneficiary Response") {
        return t.actionRequired;
      } else {
        return t.inProgress;
      }
    } else if (stageName === "Resolution") {
      return t.caseResolved;
    } else {
      return status || t.unknown;
    }
  };

  // Fetch complaints from API
  const fetchComplaints = async () => {
    try {
      const storedUser = localStorage.getItem('swa_user');
      const userData = JSON.parse(storedUser);
      const id = userData.userId || '';

      if (!id) {
        throw new Error('Contact ID not found in localStorage');
      }

      const response = await fetch(`${config.API_BASE_URL}/api/complaints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contactId: id,
          caseTypeId: "bc2d08ed-4018-f011-953d-84156ab50ded"
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        data: result.success && result.data ? result.data : [],
        count: result.count || 0
      };
    } catch (err) {
      console.error('Error fetching complaints:', err);
      return { data: [], count: 0 };
    }
  };

  // Fetch internal complaints
  const fetchInternalComplaints = async () => {
    try {
      const storedUser = localStorage.getItem('swa_user');
      const userData = JSON.parse(storedUser);
      const id = userData.userId || '';

      const response = await fetch(`${config.API_BASE_URL}/api/internalComplaint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contactId: id,
          caseTypeId: "800a0fd9-b830-f011-9546-bb48bc78be1d"
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        data: result.success && result.data ? result.data : [],
        count: result.count || 0
      };
    } catch (err) {
      console.error('Error fetching internal complaints:', err);
      return { data: [], count: 0 };
    }
  };

  // Fetch inquiries
  const fetchInquiries = async () => {
    try {
      const storedUser = localStorage.getItem('swa_user');
      const userData = JSON.parse(storedUser);
      const id = userData.userId || '';

      const response = await fetch(`${config.API_BASE_URL}/api/inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contactId: id,
          caseTypeId: "02b555e4-4018-f011-953d-84156ab50ded"
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        data: result.success && result.data ? result.data : [],
        count: result.count || 0
      };
    } catch (err) {
      console.error('Error fetching inquiries:', err);
      return { data: [], count: 0 };
    }
  };

  // Load all data
  useEffect(() => {
    const loadAllData = async () => {
      setDashboardData(prev => ({ ...prev, loading: true, error: null }));

      try {
        const [complaintsResult, internalComplaintsResult, inquiriesResult] = await Promise.all([
          fetchComplaints(),
          fetchInternalComplaints(),
          fetchInquiries()
        ]);

        setDashboardData({
          complaints: complaintsResult.data,
          internalComplaints: internalComplaintsResult.data,
          inquiries: inquiriesResult.data,
          complaintsCount: complaintsResult.count,
          internalComplaintsCount: internalComplaintsResult.count,
          inquiriesCount: inquiriesResult.count,
          loading: false,
          error: null
        });
      } catch (error) {
        setDashboardData(prev => ({
          ...prev,
          loading: false,
          error: t.errorLoadingData
        }));
        console.error('Failed to load dashboard data:', error);
      }
    };

    loadAllData();
  }, [t.errorLoadingData]);

  // Calculate statistics
  const getStats = () => {
    const {
      complaints,
      internalComplaints,
      inquiries,
      complaintsCount,
      internalComplaintsCount,
      inquiriesCount
    } = dashboardData;

    const validComplaints = Array.isArray(complaints) ? complaints : [];
    const validInternalComplaints = Array.isArray(internalComplaints) ? internalComplaints : [];
    const validInquiries = Array.isArray(inquiries) ? inquiries : [];

    const totalComplaints = complaintsCount || 0;
    const totalInternal = internalComplaintsCount || 0;
    const totalInquiries = inquiriesCount || 0;
    const totalCases = totalComplaints + totalInternal + totalInquiries;

    return {
      totalCases,
      totalComplaints,
      totalInternal,
      totalInquiries,
    };
  };

  const stats = getStats();

  // Generate table data from actual API data
  const getTableData = () => {
    const {
      complaints,
      internalComplaints,
      inquiries,
    } = dashboardData;

    const validComplaints = Array.isArray(complaints) ? complaints : [];
    const validInternalComplaints = Array.isArray(internalComplaints) ? internalComplaints : [];
    const validInquiries = Array.isArray(inquiries) ? inquiries : [];

    const allData = [
      ...validComplaints.map(item => ({
        ...item,
        type: 'Complaint'
      })),
      ...validInternalComplaints.map(item => ({
        ...item,
        type: 'Internal Complaint'
      })),
      ...validInquiries.map(item => ({
        ...item,
        type: 'Inquiry'
      }))
    ];

    return allData.slice(0, 5); // Show only first 5 items like in screenshot
  };

  const tableData = getTableData();

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className={`w-full overflow-x-hidden ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="max-w-[1500px] mx-auto min-w-[1000px] overflow-visible">
        {/* Top Header Section */}
        <div
          className="w-full h-[244px] bg-[#F7FDF9] pt-[41px] px-[41px] relative overflow-hidden"
          style={{
            backgroundImage: `url(${vector})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'right top',
          }}
        >
          {/* Header row for breadcrumbs and navigation icons */}
          <div className="w-full flex items-center flex-row justify-between relative z-20">
            {/* Breadcrumbs Section */}
            <div>
              <ol className="inline-flex p-0 items-start gap-[4px] w-[317px]">
                <li className="flex pr-[4px] items-center gap-[4px]">
                  <a href="#" className="text-[#2E8B57] font-['IBM Plex Sans Arabic'] text-[14px] font-normal leading-[20px] no-underline transition-colors duration-200 ease-in-out hover:text-[#14573A]">
                    {t.eService}
                  </a>
                </li>
                <span className="flex w-[16px] h-[16px] py-[2.222px] px-[4.827px] justify-center items-center text-black">›</span>
                <li className="flex pr-[4px] items-center gap-[4px]">
                  <a href="#" className="text-[#2E8B57] font-['IBM Plex Sans Arabic'] text-[14px] font-normal leading-[20px] no-underline transition-colors duration-200 ease-in-out hover:text-[#14573A]">
                    {t.dashboard}
                  </a>
                </li>
              </ol>
            </div>
            {/* Vertical Navigation */}
            <div className="inline-flex p-[16px] px-[24px] items-start gap-[16px]">
              <img src={Moon} alt="Moon" className="flex w-[20px] h-[20px] p-[1.042px_1.457px_1.041px_1.458px] justify-center items-center aspect-square cursor-pointer transition-transform duration-200 ease-in-out hover:scale-110" />
              <img
                src={translate}
                alt="Translate"
                className="flex w-[20px] h-[20px] p-[1.042px_1.457px_1.041px_1.458px] justify-center items-center aspect-square cursor-pointer transition-transform duration-200 ease-in-out hover:scale-110"
                onClick={() => onLanguageChange(language === 'en' ? 'ar' : 'en')}
              />
              <div className="relative inline-block cursor-pointer">
                <img
                  src={Bell}
                  alt="Bell"
                  className="flex w-[20px] h-[20px] p-[1.042px_1.457px_1.041px_1.458px] justify-center items-center aspect-square cursor-pointer transition-transform duration-200 ease-in-out hover:scale-110"
                />
                {notificationCount > 0 && (
                  <span className={`absolute top-[-8px] right-[-8px] bg-[#dc3545] text-white rounded-full w-[18px] h-[18px] text-[11px] font-bold flex items-center justify-center z-10
                    ${notificationCount > 9 ? 'w-[22px] h-[18px] rounded-[9px] text-[10px]' : ''}`}>
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </span>
                )}
              </div>
            </div>
          </div>
          {/* Service Title */}
          <h1 className="text-[#161616] font-['IBM Plex Sans Arabic'] text-[30px] font-bold leading-[38px] mt-[39px] relative z-20">
            {t.dashboard}
          </h1>
        </div>

        {/* Main Dashboard Content */}
        <div className="w-[calc(100%-80px)] md:w-[calc(100%-40px)] mx-auto min-h-[500px] rounded-[12px] bg-white shadow-[0_4px_6px_rgba(47,43,61,0.14)] mt-[42px] relative z-[1] mb-[42px] p-[42px]">
          {dashboardData.loading ? (
            <div className="flex flex-col items-center justify-center h-[300px] w-full">
              <div className="animate-spin rounded-full w-[50px] h-[50px] border-[5px] border-[rgba(0,0,0,0.1)] border-t-[#2E8B57] mb-[16px]"></div>
              <p className="text-gray-700 font-['IBM Plex Sans Arabic']">{t.loadingDashboard}</p>
            </div>
          ) : dashboardData.error ? (
            <div className="flex items-center justify-center h-[300px] w-full">
              <div className="text-[#FF6384] font-medium p-[16px] rounded-[4px] bg-[rgba(255,99,132,0.1)] text-center font-['IBM Plex Sans Arabic']">
                {dashboardData.error}
              </div>
            </div>
          ) : (
            <>
              {/* Welcome Section */}
              <div className="mb-8">
                <h2 className="text-xl font-medium text-gray-900 mb-2 font-['IBM Plex Sans Arabic']">{t.hiCompany}</h2>
                <p className="text-gray-600 text-sm font-['IBM Plex Sans Arabic'] mb-6">{t.gatewayText}</p>
                <hr className="border-gray-200" />
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {/* Total Cases Card */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex flex-col">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                        📊
                      </div>
                      <div className="text-sm text-gray-600 font-['IBM Plex Sans Arabic']">{t.totalCases}</div>
                    </div>
                    <div className="text-4xl font-bold text-gray-900 font-['IBM Plex Sans Arabic']">{stats.totalCases}</div>
                  </div>
                </div>

                {/* Open Cases */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex flex-col">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        📂
                      </div>
                      <div className="text-sm text-gray-600 font-['IBM Plex Sans Arabic']">{t.open}</div>
                    </div>
                    <div className="text-4xl font-bold text-gray-900 font-['IBM Plex Sans Arabic']">5</div>
                  </div>
                </div>

                {/* Closed Cases */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex flex-col">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                        ✅
                      </div>
                      <div className="text-sm text-gray-600 font-['IBM Plex Sans Arabic']">{t.closed}</div>
                    </div>
                    <div className="text-4xl font-bold text-gray-900 font-['IBM Plex Sans Arabic']">5</div>
                  </div>
                </div>

                {/* Pending Actions */}
                <div className="bg-orange-50 rounded-lg border border-orange-200 p-6">
                  <div className="flex flex-col">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                        ⚠️
                      </div>
                      <div className="text-sm text-gray-600 font-['IBM Plex Sans Arabic']">{t.pendingActions}</div>
                    </div>
                    <div className="text-4xl font-bold text-gray-900 font-['IBM Plex Sans Arabic']">2</div>
                  </div>
                </div>
              </div>

              {/* Actions Required Section */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-md mb-8">
                <div className="p-6 pb-4">
                  <h3 className="text-lg font-bold text-gray-900 font-['IBM Plex Sans Arabic'] mb-4">{t.actionsRequired}</h3>
                  <hr className="border-gray-200" />
                </div>
                <div className="px-6 pb-6">
                  <div className="bg-white rounded-lg shadow-md border-l-4 border-orange-400 pl-4 py-3 pr-4 relative">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-3">
                        <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-gray-900 font-['IBM Plex Sans Arabic']">{t.moreInfoNeeded}</div>
                          <button className="text-gray-400 hover:text-gray-600 ml-4">×</button>
                        </div>
                        <div className="text-sm text-gray-600 mt-1 font-['IBM Plex Sans Arabic']">
                          Please complete the required steps in <span className="font-semibold text-gray-900">Complaint Escalation Case</span> to process your request.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Latest Requests Section */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 font-['IBM Plex Sans Arabic']">{t.latestRequests}</h3>
                </div>
                
                {/* Filters */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder={t.search}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-['IBM Plex Sans Arabic']"
                      />
                    </div>
                    <div className="flex-1">
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-['IBM Plex Sans Arabic']">
                        <option>{t.status}</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-['IBM Plex Sans Arabic']">
                        <option>{t.requestType}</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="px-6 pb-6 pt-6">
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="min-w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 pt-6 pb-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider font-['IBM Plex Sans Arabic'] border-r border-gray-200">
                            {t.requestNumber}
                          </th>
                          <th className="px-6 pt-6 pb-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider font-['IBM Plex Sans Arabic'] border-r border-gray-200">
                            {t.requestType}
                          </th>
                          <th className="px-6 pt-6 pb-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider font-['IBM Plex Sans Arabic'] border-r border-gray-200">
                            {t.activityType}
                          </th>
                          <th className="px-6 pt-6 pb-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider font-['IBM Plex Sans Arabic'] border-r border-gray-200">
                            {t.status}
                          </th>
                          <th className="px-6 pt-6 pb-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider font-['IBM Plex Sans Arabic'] border-r border-gray-200">
                            {t.submissionDate}
                          </th>
                          <th className="px-6 pt-6 pb-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider font-['IBM Plex Sans Arabic']">
                            {t.actions}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white border-t border-gray-200">
                        {tableData.map((row, index) => (
                          <tr key={index} className="hover:bg-gray-50 border-b border-gray-200 last:border-b-0">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-['IBM Plex Sans Arabic'] border-r border-gray-200">
                              {row.caseNumber || row.id || `43218765`}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-['IBM Plex Sans Arabic'] border-r border-gray-200">
                              {row.type || 'Permit Issuance'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-['IBM Plex Sans Arabic'] border-r border-gray-200">
                              {row.activityType || 'Water Production'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full font-['IBM Plex Sans Arabic'] ${
                                getDisplayStatus(row.stagename, row.status) === t.actionRequired
                                  ? 'bg-orange-100 text-orange-800'
                                  : getDisplayStatus(row.stagename, row.status) === t.caseResolved
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {getDisplayStatus(row.stagename, row.status)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-['IBM Plex Sans Arabic'] border-r border-gray-200">
                              {new Date(row.createdOn || Date.now()).toLocaleDateString('en-GB') || '27-05-2025'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-['IBM Plex Sans Arabic']">
                              <button className="hover:text-blue-800">{t.viewDetails} &gt;</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pagination - Back inside the Latest Requests card */}
                <div className="px-6 py-4 pl-12">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500 font-['IBM Plex Sans Arabic']">
                      1 - 10 of 14
                    </div>
                    <div className="flex items-center justify-center space-x-2 flex-1">
                      <button className="px-3 py-1 text-sm hover:bg-gray-100 transition-colors duration-200">‹</button>
                      <button 
                        onClick={() => handlePageClick(1)}
                        className={`px-3 py-1 text-sm transition-colors duration-200 ${
                          currentPage === 1 
                            ? 'bg-white text-blue-600 border border-blue-600 rounded' 
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        1
                      </button>
                      <button 
                        onClick={() => handlePageClick(2)}
                        className={`px-3 py-1 text-sm transition-colors duration-200 ${
                          currentPage === 2 
                            ? 'bg-white text-blue-600 border border-blue-600 rounded' 
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        2
                      </button>
                      <button 
                        onClick={() => handlePageClick(3)}
                        className={`px-3 py-1 text-sm transition-colors duration-200 ${
                          currentPage === 3 
                            ? 'bg-white text-blue-600 border border-blue-600 rounded' 
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        3
                      </button>
                      <span className="text-sm text-gray-500">...</span>
                      <button 
                        onClick={() => handlePageClick(999)}
                        className={`px-3 py-1 text-sm transition-colors duration-200 ${
                          currentPage === 999 
                            ? 'bg-white text-blue-600 border border-blue-600 rounded' 
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        999
                      </button>
                      <button className="px-3 py-1 text-sm hover:bg-gray-100 transition-colors duration-200">›</button>
                    </div>
                    <div className="w-20"></div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Graph;