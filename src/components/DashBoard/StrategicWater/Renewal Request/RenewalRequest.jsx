import React, { useState, useEffect } from 'react';
// IMPORTANT: No CSS file is needed. The component is now fully compatible with Tailwind CSS.

import translate from './Translate.png';
import vector from './Vector.png';
import Moon from './Moon.png';
import Bell from './Bell.png';
import Search from './searchicon.png';
import RenewalStatusBadge from './Renewal Status Badge/RenewalStatusBadge';
import NotificationSystem from '../../NotificationSystem/NotificationSystem';
import RR_TopDesign from './RR WorkFlow/RR_TopDesign';
import config from '@/utils/config';

// Translation dictionaries
const translations = {
  en: {
    dashboard: 'Dashboard',
    myRequests: 'My Requests',
    myDocuments: 'My Documents',
    allLicense: 'All License',
    searchPlaceholder: 'Search',
    statusFilter: 'Status',
    licenseId: 'License ID',
    activityName: 'Activity Name',
    issueDate: 'Issue Date',
    expirationDate: 'Expiration Date',
    status: 'Status',
    actions: 'Actions',
    viewDetails: 'View Details',
    renew: 'Renew',
    notAssigned: 'Not assigned',
    noLicensesFound: 'No licenses found',
    noLicensesFoundContact: 'No licenses Found against this contact',
    loadingLicenses: 'Loading licenses...',
    active: 'Active',
    expiring: 'Expiring',
    expired: 'Expired',
    of: 'of',
  },
  ar: {
    dashboard: 'لوحة التحكم',
    myRequests: 'طلباتي',
    myDocuments: 'وثائقي',
    allLicense: 'جميع التراخيص',
    searchPlaceholder: 'بحث',
    statusFilter: 'الحالة',
    licenseId: 'رقم الترخيص',
    activityName: 'اسم النشاط',
    issueDate: 'تاريخ الإصدار',
    expirationDate: 'تاريخ الانتهاء',
    status: 'الحالة',
    actions: 'الإجراءات',
    viewDetails: 'عرض التفاصيل',
    renew: 'تجديد',
    notAssigned: 'غير مخصص',
    noLicensesFound: 'لم يتم العثور على تراخيص',
    noLicensesFoundContact: 'لم يتم العثور على تراخيص لهذا الاتصال',
    loadingLicenses: 'جاري تحميل التراخيص...',
    active: 'نشط',
    expiring: 'ينتهي قريباً',
    expired: 'منتهي الصلاحية',
    of: 'من',
  },
};

const ITEMS_PER_PAGE = 10;

const RenewalRequest = ({ language = 'en', onLanguageChange }) => {
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [uniqueStatuses, setUniqueStatuses] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRenewal, setShowRenewal] = useState(false);
  const [selectedLicenseForRenewal, setSelectedLicenseForRenewal] = useState(null);

  const t = translations[language];

  // Mock data for licenses (replace with actual API call)
  const mockLicenses = [
    {
      licenseId: '43218765',
      activityName: 'Production of Purified Water',
      issueDate: '2025-05-27',
      expirationDate: '2025-05-27',
      status: 'Active',
      statusCode: 1
    },
    {
      licenseId: '43218765',
      activityName: 'Production of Purified Water',
      issueDate: '2025-05-27',
      expirationDate: '2025-05-27',
      status: 'Expiring',
      statusCode: 2
    },
    {
      licenseId: '43218765',
      activityName: 'Production of Purified Water',
      issueDate: '2025-05-27',
      expirationDate: '2025-05-27',
      status: 'Expired',
      statusCode: 3
    }
  ];

  const getStatus = (expirationDate) => {
    const today = new Date();
    const expDate = new Date(expirationDate);
    const timeDiff = expDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff < 0) return t.expired;
    if (daysDiff <= 30) return t.expiring;
    return t.active;
  };

  const fetchLicenses = async () => {
    try {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const licensesWithStatus = mockLicenses.map(license => ({
          ...license,
          calculatedStatus: getStatus(license.expirationDate)
        }));
        setLicenses(licensesWithStatus);
        setUniqueStatuses([...new Set(licensesWithStatus.map(l => l.calculatedStatus))].sort());
        setLoading(false);
      }, 1000);
      
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching licenses:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLicenses();
  }, []);

  useEffect(() => {
    if (licenses.length) {
      setUniqueStatuses([...new Set(licenses.map(l => l.calculatedStatus))].sort());
    }
  }, [language, licenses]);

  const handleTranslate = () => onLanguageChange(language === 'en' ? 'ar' : 'en');
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchLicenses();
    setRefreshing(false);
  };
  
  const handleRenewClick = (license) => {
    setSelectedLicenseForRenewal(license);
    setShowRenewal(true);
  };
  
  const handleBackToLicenses = () => {
    setShowRenewal(false);
    setSelectedLicenseForRenewal(null);
  };

  const filtered = licenses.filter((l) => {
    const search = searchTerm.toLowerCase();
    return (
      (!search ||
        (l.licenseId || '').toLowerCase().includes(search) ||
        (l.activityName || '').toLowerCase().includes(search)) &&
      (!statusFilter || l.calculatedStatus === statusFilter)
    );
  }).sort((a, b) => {
    const dateA = new Date(a.issueDate || 0);
    const dateB = new Date(b.issueDate || 0);
    return dateB - dateA;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const currentItems = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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

      if (startMiddle > 2) {
        pages.push('...');
      }
      for (let i = startMiddle; i <= endMiddle; i++) {
        pages.push(i);
      }
      if (endMiddle < totalPages - 1) {
        pages.push('...');
      }
      if (totalPages > 1 && !pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages.map((p, i) => {
      if (p === '...')
        return (
          <span key={`ellipsis-${i}`} className="px-[8px] py-[5px] text-gray-500 flex items-center justify-center">
            ...
          </span>
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

  // If showRenewal is true, render RR_TopDesign as full page
  if (showRenewal) {
    return (
      <RR_TopDesign 
        language={language} 
        onLanguageChange={onLanguageChange}
        onBack={handleBackToLicenses}
      />
    );
  }

  // Otherwise render the license table
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
                    {t.dashboard}
                  </a>
                </li>
                <span className="flex w-[16px] h-[16px] py-[2.222px] px-[4.827px] justify-center items-center text-black">›</span>
                <li className="flex pr-[4px] items-center gap-[4px]">
                  <a href="#" className="text-[#14573A] font-['IBM Plex Sans Arabic'] text-[14px] font-normal leading-[20px] no-underline">
                    {t.myRequests}
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
                onClick={handleTranslate}
              />
              <div
                className="relative inline-block cursor-pointer"
                onClick={() => setShowNotifications((s) => !s)}
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
            {t.myDocuments}
          </h1>
        </div>

        <NotificationSystem
          isVisible={showNotifications}
          onClose={() => setShowNotifications(false)}
          onNotificationCountChange={setNotificationCount}
          currentItems={licenses}
          itemType="license"
          displayMode="panel"
        />
        <NotificationSystem
          displayMode="inline"
          currentItems={licenses}
          itemType="license"
          onNotificationCountChange={() => {}}
        />

        <div className="flex flex-col items-center flex-shrink-0 w-[95%] mx-auto h-[740px] rounded-[6px] bg-white shadow-[0px_3px_12px_0px_rgba(47,43,61,0.14)] mt-[-50px] relative z-[1] mb-[40px]">
          <div className="flex flex-col justify-center items-end self-stretch p-[41px] gap-[12px] border-b border-[#e0e0e0] w-full">
            <div className="w-full flex items-center justify-between flex-row">
              <div className="flex items-center gap-[8px]">
                <span className="text-[#384250] font-['IBM Plex Sans Arabic'] text-[18px] font-medium leading-[28px]">
                  {t.allLicense}
                </span>
                <button
                  className="flex items-center justify-center w-[36px] h-[36px] bg-transparent border-none cursor-pointer rounded-[8px] transition-all duration-300 ease-in-out enabled:hover:bg-[rgba(27,131,84,0.1)] enabled:hover:scale-[1.05] disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={handleRefresh}
                  disabled={refreshing || loading}
                  title="Refresh licenses"
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
                  {uniqueStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="w-full overflow-x-auto mt-[20px] px-[30px]">
            {loading ? (
              <div className="text-center p-[2rem] text-gray-700">{t.loadingLicenses}</div>
            ) : error ? (
              <div className="text-center p-[2rem] text-black">
                {t.noLicensesFoundContact}
              </div>
            ) : (
              <table className="w-full border-collapse font-['IBM Plex Sans Arabic']">
                <thead>
                  <tr>
                    <th className="bg-[#F9FAFB] border-t border-b border-r border-[#D2D6DB] px-[16px] py-[12px] text-left text-[14px] font-medium text-[#384250] first:border-l">
                      {t.licenseId}
                    </th>
                    <th className="bg-[#F9FAFB] border-t border-b border-r border-[#D2D6DB] px-[16px] py-[12px] text-left text-[14px] font-medium text-[#384250]">
                      {t.activityName}
                    </th>
                    <th className="bg-[#F9FAFB] border-t border-b border-r border-[#D2D6DB] px-[16px] py-[12px] text-left text-[14px] font-medium text-[#384250]">
                      {t.issueDate}
                    </th>
                    <th className="bg-[#F9FAFB] border-t border-b border-r border-[#D2D6DB] px-[16px] py-[12px] text-left text-[14px] font-medium text-[#384250]">
                      {t.expirationDate}
                    </th>
                    <th className="bg-[#F9FAFB] border-t border-b border-r border-[#D2D6DB] px-[16px] py-[12px] text-left text-[14px] font-medium text-[#384250]">
                      {t.status}
                    </th>
                    <th className="bg-[#F9FAFB] border-t border-b border-r border-[#D2D6DB] px-[16px] py-[12px] text-left text-[14px] font-medium text-[#384250] last:border-r">
                      {t.actions}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length ? (
                    currentItems.map((license, index) => (
                      <tr key={`${license.licenseId}-${index}`}>
                        <td className="p-[16px] border-b border-[#E5E5E5] border-r border-[#D2D6DB] text-[14px] text-[#161616] first:border-l">
                          {license.licenseId || t.notAssigned}
                        </td>
                        <td className="p-[16px] border-b border-[#E5E5E5] border-r border-[#D2D6DB] text-[14px] text-[#161616]">
                          {license.activityName}
                        </td>
                        <td className="p-[16px] border-b border-[#E5E5E5] border-r border-[#D2D6DB] text-[14px] text-[#161616]">
                          {license.issueDate ? new Date(license.issueDate).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-GB') : 'N/A'}
                        </td>
                        <td className="p-[16px] border-b border-[#E5E5E5] border-r border-[#D2D6DB] text-[14px] text-[#161616]">
                          {license.expirationDate ? new Date(license.expirationDate).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-GB') : 'N/A'}
                        </td>
                        <td className="p-[16px] border-b border-[#E5E5E5] border-r border-[#D2D6DB] text-[14px] text-[#161616]">
                          <RenewalStatusBadge
                            status={license.calculatedStatus}
                            language={language}
                          />
                        </td>
                        <td className="p-[16px] border-b border-[#E5E5E5] border-r border-[#D2D6DB] text-[14px] text-[#161616] last:border-r">
                          <div className="flex items-center gap-2">
                            <button className="flex items-center gap-1 px-3 py-1 text-sm text-[#1B8354] hover:bg-gray-50 rounded transition-colors">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button className="flex items-center gap-1 px-3 py-1 text-sm text-[#1B8354] hover:bg-gray-50 rounded transition-colors">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </button>
                            {license.calculatedStatus === t.expired ? (
                              <button 
                                onClick={() => handleRenewClick(license)}
                                className="text-sm text-[#1B8354] hover:underline"
                              >
                                {t.renew}
                              </button>
                            ) : (
                              <span className="text-sm text-[#1B8354]">{t.viewDetails}</span>
                            )}
                            <svg className="w-4 h-4 text-[#1B8354]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center p-[2rem]">
                        {t.noLicensesFound}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          <div className="relative flex justify-between items-center w-full px-[30px] py-[20px] mt-auto">
            <p className="text-[#B2B2B2] font-['IBM Plex Sans Arabic'] text-[16px] font-medium leading-[24px] m-0 p-0">
              {currentItems.length
                ? `${(currentPage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} ${t.of} ${filtered.length}`
                : `0–0 ${t.of} 0`}
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
        </div>

        <div className='fixed bottom-[20px] right-[20px] z-[9999]'>
          <button className="w-[48px] h-[48px] rounded-full bg-[#1B8354] text-white border-none text-[20px] flex items-center justify-center cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.2)]">?</button>
        </div>
      </div>
    </div>
  );
};

export default RenewalRequest;