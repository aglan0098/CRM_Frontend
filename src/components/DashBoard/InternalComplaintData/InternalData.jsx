import React, { useState, useEffect } from 'react';
// IMPORTANT: No CSS file is needed. The component is now fully compatible with Tailwind CSS.
import translate from './Translate.png';
import vector from './Vector.png';
import Moon from './Moon.png';
import Bell from './Bell.png';
import Search from './searchicon.png';
import StatusBadge from './StatusBadge/StatusBadge';
import NotificationSystem from '../NotificationSystem/NotificationSystem';
import GeneralComplaint from "./InternalComplaint/GeneralComplaint";
import config from '@/utils/config';
// Translations for localization
const translations = {
  en: {
    eService: 'E-Service',
    complaint: 'Complaint',
    internalComplaints: 'General Complaints',
    internalComplaintsService: 'General Complaints Service',
    internalComplaintsList: 'General Complaints',
    searchPlaceholder: 'Search',
    statusFilter: 'Status',
    complaintNumber: 'Complaint Number',
    complaintSubject: 'Complaint Subject',
    status: 'Status',
    date: 'Date',
    noComplaintsFound: 'No complaints found',
    noInternalComplaintsFoundContact: 'No internal complaints found against this contact',
    loadingComplaints: 'Loading complaints...',
    submitted: 'Submitted',
    actionRequired: 'Action Required',
    inProgress: 'In Progress',
    caseResolved: 'Case Resolved',
    of: 'of',
  },
  ar: {
    eService: 'الخدمة الإلكترونية',
    complaint: 'شكوى',
    internalComplaints: 'الشكاوى الداخلية',
    internalComplaintsService: 'خدمة الشكاوى الداخلية',
    internalComplaintsList: 'الشكاوى الداخلية',
    searchPlaceholder: 'بحث',
    statusFilter: 'الحالة',
    complaintNumber: 'رقم الشكوى',
    complaintSubject: 'موضوع الشكوى',
    status: 'الحالة',
    date: 'التاريخ',
    noComplaintsFound: 'لم يتم العثور على شكاوى',
    noInternalComplaintsFoundContact: 'لم يتم العثور على شكاوى داخلية لهذا الاتصال',
    loadingComplaints: 'جاري تحميل الشكاوى...',
    submitted: 'مُقدم',
    actionRequired: 'يتطلب إجراء',
    inProgress: 'قيد المعالجة',
    caseResolved: 'تم معالجة الطلب',
    of: 'من',
  },
};
const ITEMS_PER_PAGE = 5;
const InternalComplaintContent = ({ language = 'en', onLanguageChange }) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [uniqueStatuses, setUniqueStatuses] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const t = translations[language];
  // --- UPDATED STATUS LOGIC ---
  const getStatus = (stageName, status, externalCommunications, stateCode) => {
    if (stateCode === 1) {
      return t.caseResolved;
    }
    const hasActiveResponse = externalCommunications?.some(comm =>
      (comm.comstatusCode === 116950000) &&
      comm.response === null &&
      (comm.comstatusName === 'Request Sent')
    );
    if (hasActiveResponse) {
      return t.actionRequired;
    }
    if (stageName === "Request Submission") return t.submitted;
    if (stageName === "Evaluation") {
      if (status === "Awaiting Beneficiary Response") return t.actionRequired;
      return t.inProgress;
    }
    if (stageName === "Resolution") return t.caseResolved;
    return status;
  };
  // Fetch complaints from API
  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const storedUser = localStorage.getItem('swa_user');
      const userData = JSON.parse(storedUser);
      const id = userData.userId || '';
      if (!id) {
        throw new Error('Contact ID not found in localStorage');
      }
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
      if (result.success && result.data) {
        setComplaints(result.data);
        // --- UPDATED to use new getStatus function ---
        const statuses = result.data.map(c =>
          getStatus(c.stagename, c.status, c.externalCommunications, c.statecode)
        ).filter(Boolean);
        setUniqueStatuses([...new Set(statuses)].sort());
      } else {
        setComplaints([]);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching complaints:', err);
    } finally {
      setLoading(false);
    }
  };
  // Initial load
  useEffect(() => {
    fetchComplaints();
  }, []);
  // Update unique statuses when language or complaints data changes
  useEffect(() => {
    if (complaints.length) {
      // --- UPDATED to use new getStatus function ---
      const statuses = complaints.map(c =>
        getStatus(c.stagename, c.status, c.externalCommunications, c.statecode)
      ).filter(Boolean);
      setUniqueStatuses([...new Set(statuses)].sort());
    }
  }, [language, complaints]);
  // Deep link effect: auto-open general complaint when deep_link_case_id exists
  useEffect(() => {
    const deepId = localStorage.getItem('deep_link_case_id');
    if (deepId && complaints.length) {
      const found = complaints.find(c => c.complaintId === deepId || c.complaintNumber === deepId);
      if (found) {
        setSelectedComplaint(found);
        localStorage.removeItem('deep_link_case_id');
      }
    }
  }, [complaints]);
  // Manual refresh function
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchComplaints();
    setRefreshing(false);
  };
  // Filter complaints based on search and filters
  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = searchTerm === '' ||
      (complaint.complaintTicket || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (complaint.complaintNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (complaint.subject || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    // --- UPDATED to use new getStatus function ---
    const complaintStatus = getStatus(complaint.stagename, complaint.status, complaint.externalCommunications, complaint.statecode);
    const matchesStatus = statusFilter === '' || complaintStatus === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    // Sort by date descending (newest first)
    const dateA = new Date(a.creationDate || 0);
    const dateB = new Date(b.creationDate || 0);
    return dateB - dateA;
  });
  // Pagination logic
  const totalPages = Math.ceil(filteredComplaints.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentComplaints = filteredComplaints.slice(startIndex, endIndex);
  // This function is called when a complaint number is clicked
  const handleComplaintClick = (complaint) => {
    setSelectedComplaint(complaint);
  };
  // This function is passed to the details component to return to the list view
  const handleBackToList = () => {
    setSelectedComplaint(null);
  };
  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      let startMiddle = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2) + 1);
      let endMiddle = Math.min(totalPages - 1, currentPage + Math.floor(maxVisiblePages / 2) - 1);
      if (currentPage <= Math.floor(maxVisiblePages / 2)) {
        endMiddle = Math.min(totalPages - 1, maxVisiblePages - 2);
      } else if (currentPage >= totalPages - Math.floor(maxVisiblePages / 2) + 1) {
        startMiddle = Math.max(2, totalPages - (maxVisiblePages - 2));
      }
      if (startMiddle > 2) pages.push('...');
      for (let i = startMiddle; i <= endMiddle; i++) {
        pages.push(i);
      }
      if (endMiddle < totalPages - 1) pages.push('...');
      if (totalPages > 1 && !pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }
    return pages.map((p, i) => {
      if (p === '...')
        return (
          <span key={`ellipsis-${i}`} className="px-[8px] py-[5px] text-gray-500 flex items-center justify-center">...</span>
        );
      return (
        <a
          key={p}
          href="#"
          className={`
            text-[#161616] no-underline px-[10px] py-[5px] rounded-[3px] transition-all duration-300 ease-in-out
            ${currentPage === p
              ? 'relative font-bold after:content-[""] after:absolute after:bottom-[-5px] after:left-[5px] after:right-[5px] after:h-[4px] after:bg-[#1B8354] after:rounded-[2px]'
              : 'hover:bg-[#f0f0f0]'
            }
          `}
          onClick={(e) => {
            e.preventDefault();
            setCurrentPage(p);
          }}
        >
          {p}
        </a>
      );
    });
  };
  return (
    <div className={`w-full overflow-x-hidden ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="max-w-[1500px] mx-auto min-w-[1000px] overflow-visible">
        <div
            className="w-full h-[244px] bg-[#F7FDF9] pt-[41px] px-[41px] relative overflow-hidden"
            style={{
              backgroundImage: `url(${vector})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPosition: 'right top',
            }}
          >
          <div className="w-full flex items-center flex-row justify-between">
            <div>
              <ol className="w-[317px] inline-flex p-0 items-start gap-0">
                <li className="flex pr-[4px] items-center gap-[4px]">
                  <a href="#" className="text-[#14573A] font-['IBM Plex Sans Arabic'] text-[14px] font-normal leading-[20px] no-underline">
                    {t.eService}
                  </a>
                </li>
                <span className="flex w-[16px] h-[16px] py-[2.222px] px-[4.827px] justify-center items-center text-black">›</span>
                <li className="flex pr-[4px] items-center gap-[4px]">
                  <a href="#" className="text-[#14573A] font-['IBM Plex Sans Arabic'] text-[14px] font-normal leading-[20px] no-underline">
                    {t.complaint}
                  </a>
                </li>
                <span className="flex w-[16px] h-[16px] py-[2.222px] px-[4.827px] justify-center items-center text-black">›</span>
                <li className="flex pr-[4px] items-center gap-[4px]">
                  <a href="#" className="text-[#14573A] font-['IBM Plex Sans Arabic'] text-[14px] font-normal leading-[20px] no-underline">
                    {t.internalComplaints}
                  </a>
                </li>
              </ol>
            </div>
            <div className="inline-flex p-[16px] px-[24px] items-start gap-[16px]">
              <img src={Moon} alt="Moon" className="flex w-[20px] h-[20px] p-[1.042px_1.457px_1.041px_1.458px] justify-center items-center aspect-square" />
              <img
                src={translate}
                alt="Translate"
                className="flex w-[20px] h-[20px] p-[1.042px_1.457px_1.041px_1.458px] justify-center items-center aspect-square cursor-pointer"
                onClick={() => onLanguageChange(language === 'en' ? 'ar' : 'en')}
              />
              <div
                className="relative inline-block cursor-pointer"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <img
                  src={Bell}
                  alt="Bell"
                  className="flex w-[20px] h-[20px] p-[1.042px_1.457px_1.041px_1.458px] justify-center items-center aspect-square"
                />
                {notificationCount > 0 && (
                  <span
                    className={`absolute top-[-8px] right-[-8px] bg-[#dc3545] text-white rounded-full w-[18px] h-[18px] text-[11px] font-bold flex items-center justify-center z-10 
                    ${notificationCount > 9 ? 'w-[22px] h-[18px] rounded-[9px] text-[10px]' : ''}`}
                  >
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </span>
                )}
              </div>
            </div>
          </div>
          <h1 className="text-[#161616] font-['IBM Plex Sans Arabic'] text-[30px] font-bold leading-[38px] mt-[39px]">
            {t.internalComplaintsService}
          </h1>
        </div>
        <NotificationSystem
          isVisible={showNotifications}
          onClose={() => setShowNotifications(false)}
          onNotificationCountChange={setNotificationCount}
          currentItems={complaints}
          itemType="internal"
        />
        <NotificationSystem
          displayMode="inline"
          currentItems={complaints}
          itemType="internal"
          onNotificationCountChange={() => {}}
        />
        <div className="flex flex-col items-center flex-shrink-0 w-[95%] mx-auto h-[740px] rounded-[6px] bg-white shadow-[0px_3px_12px_0px_rgba(47,43,61,0.14)] mt-[-50px] relative z-[1] mb-[40px]">
          {selectedComplaint ? (
            <GeneralComplaint
              complaint={selectedComplaint}
              onBack={handleBackToList}
              language={language}
            />
          ) : (
            <>
              <div className="flex flex-col justify-center items-end self-stretch p-[41px] gap-[12px] border-b border-[#e0e0e0] w-full">
                <div className="w-full flex items-center justify-between flex-row">
                  <div className="flex items-center gap-[8px]">
                    <span className="text-[#384250] font-['IBM Plex Sans Arabic'] text-[18px] font-medium leading-[28px]">
                      {t.internalComplaintsList}
                    </span>
                    <button
                      className="flex items-center justify-center w-[36px] h-[36px] bg-transparent border-none cursor-pointer rounded-[8px] transition-all duration-300 ease-in-out enabled:hover:bg-[rgba(27,131,84,0.1)] enabled:hover:scale-[1.05] disabled:cursor-not-allowed disabled:opacity-50"
                      onClick={handleRefresh}
                      disabled={refreshing || loading}
                      title="Refresh complaints"
                    >
                      <svg
                        className={`w-[20px] h-[20px] text-[#1B8354] transition-transform duration-600 ease-in-out stroke-2
                        ${refreshing ? 'animate-spin' : ''}`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                        <path d="M21 3v5h-5" />
                        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                        <path d="M3 21v-5h5" />
                      </svg>
                    </button>
                  </div>
                  <div></div>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between w-full gap-[15px] mt-[10px]">
                  <div className="relative w-full md:w-1/2 h-[40px] border border-[#9DA4AE] rounded-[6px] bg-white">
                    <img src={Search} alt="Search Icon" className="absolute w-[18px] h-[18px] left-[10px] top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder={t.searchPlaceholder}
                      className="w-full h-full pl-[35px] pr-[12px] border-none outline-none font-['IBM Plex Sans Arabic'] text-[16px] font-normal text-[#6C737F] bg-transparent leading-[24px] placeholder-[#6C737F]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="w-full md:w-1/2">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="relative w-full h-[40px] border border-[#9DA4AE] rounded-[6px] bg-white font-['IBM Plex Sans Arabic'] text-[16px] text-[#6C737F] pl-[12px] pr-[40px] outline-none appearance-none bg-no-repeat bg-[position:calc(100%-16px)] bg-[length:1.5em] bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20fill%3D%27none%27%20viewBox%3D%270%200%2024%2024%27%20stroke-width%3D%271.5%27%20stroke%3D%27currentColor%27%20class%3D%27w-6%20h-6%27%3E%3Cpath%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%20d%3D%27M19.5%208.25l-7.5%207.5-7.5-7.5%27%20%2F%3E%3C%2Fsvg%3E')]"
                    >
                      <option value="">{t.statusFilter}</option>
                      {uniqueStatuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="w-full overflow-x-auto mt-[20px] px-[30px]">
                {loading ? (
                  <div className="text-center p-[2rem] text-gray-700">{t.loadingComplaints}</div>
                ) : error ? (
                  <div className="text-center p-[2rem] text-black">
                    {t.noInternalComplaintsFoundContact}
                  </div>
                ) : (
                  <table className="w-full border-collapse font-['IBM Plex Sans Arabic']">
                    <thead>
                      <tr>
                        <th className="bg-[#F9FAFB] border-t border-b border-r border-[#D2D6DB] px-[16px] py-[12px] text-left text-[14px] font-medium text-[#384250] first:border-l">
                          {t.complaintNumber}
                        </th>
                        <th className="bg-[#F9FAFB] border-t border-b border-r border-[#D2D6DB] px-[16px] py-[12px] text-left text-[14px] font-medium text-[#384250]">
                          {t.complaintSubject}
                        </th>
                        <th className="bg-[#F9FAFB] border-t border-b border-r border-[#D2D6DB] px-[16px] py-[12px] text-left text-[14px] font-medium text-[#384250]">
                          {t.status}
                        </th>
                        <th className="bg-[#F9FAFB] border-t border-b border-r border-[#D2D6DB] px-[16px] py-[12px] text-left text-[14px] font-medium text-[#384250] last:border-r">
                          {t.date}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentComplaints.length > 0 ? (
                        currentComplaints.map((complaint) => (
                          <tr key={complaint.complaintId}>
                            <td className="p-[16px] border-b border-[#E5E5E5] border-r border-[#D2D6DB] text-[14px] text-[#161616] first:border-l">
                              <a
                                href="#"
                                className="text-[#1B8354] no-underline font-medium"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleComplaintClick(complaint);
                                }}
                              >
                                {complaint.complaintNumber || 'N/A'}
                              </a>
                            </td>
                            <td className="p-[16px] border-b border-[#E5E5E5] border-r border-[#D2D6DB] text-[14px] text-[#161616]">{complaint.subject}</td>
                            <td className="p-[16px] border-b border-[#E5E5E5] border-r border-[#D2D6DB] text-[14px] text-[#161616]">
                              <StatusBadge
                                status={complaint.status}
                                statusCode={complaint.statusCode}
                                stageName={complaint.stagename}
                                stateCode={complaint.statecode}
                                size="default"
                                language={language}
                                externalCommunications={complaint.externalCommunications}
                              />
                            </td>
                            <td className="p-[16px] border-b border-[#E5E5E5] border-r border-[#D2D6DB] text-[14px] text-[#161616] last:border-r">
                              {complaint.creationDate ? new Date(complaint.creationDate).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-GB') : 'N/A'}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center p-[2rem]">
                            {t.noComplaintsFound}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
              <div className="relative flex justify-between items-center w-full px-[30px] py-[20px] mt-auto">
                <p className="text-[#B2B2B2] font-['IBM Plex Sans Arabic'] text-[16px] font-medium leading-[24px] m-0 p-0">
                  {currentComplaints.length > 0
                    ? `${startIndex + 1}–${Math.min(endIndex, filteredComplaints.length)} ${t.of} ${filteredComplaints.length}`
                    : `0–0 ${t.of} 0`
                  }
                </p>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-[10px]">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={`text-[#161616] no-underline px-[10px] py-[5px] rounded-[3px] transition-all duration-300 ease-in-out ${currentPage === 1 ? 'opacity-50 pointer-events-none' : 'hover:bg-[#f0f0f0]'}`}
                  >
                    {language === 'ar' ? '>' : '<'}
                  </a>
                  {renderPagination()}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                    }}
                    className={`text-[#161616] no-underline px-[10px] py-[5px] rounded-[3px] transition-all duration-300 ease-in-out ${currentPage === totalPages ? 'opacity-50 pointer-events-none' : 'hover:bg-[#f0f0f0]'}`}
                  >
                    {language === 'ar' ? '<' : '>'}
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
        <div className='fixed bottom-[20px] right-[20px] z-[9999]'>
          <button className="w-[48px] h-[48px] rounded-full bg-[#1B8354] text-white border-none text-[20px] flex items-center justify-center cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.2)]">?</button>
        </div>
      </div>
    </div>
  );
};
export default InternalComplaintContent;