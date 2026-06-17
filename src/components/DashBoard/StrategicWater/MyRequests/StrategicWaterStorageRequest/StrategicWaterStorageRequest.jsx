import React, { useState, useEffect } from 'react';
import vector from '@/assets/images/Vector.png';
import Moon from '@/assets/images/Moon.png';
import translate from '@/assets/images/Translate.png';
import Bell from '@/assets/images/Bell.png';
import Search from '@/assets/images/searchicon.png';
import NotificationSystem from '@/components/DashBoard/NotificationSystem/NotificationSystem';
import SWSDetails from '@/components/DashBoard/StrategicWater/MyRequests/StrategicWaterStorageRequest/SWSDetails';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '@/utils/config';

//const API_BASE_URL = `http://localhost:5000/api/stratergic-water-support`;

const translations = {
    en: {
        eService: 'Licenses & Permits',
        regulatorySupport: 'Request for Strategic Water Storage',
        regulatorySupportService: 'Strategic Water Storage',
        regulatorySupportRequests: 'All Requests',
        newButton: 'New Request',
        searchPlaceholder: 'Search',
        statusFilter: 'Status',
        requestNumber: 'Request Number',
        requestType: 'Request Type',
        activityType: 'Activity Type',
        status: 'Status',
        submissionDate: 'Submission Date',
        actions: 'Actions',
        noRequestsFound: 'No requests found',
        loadingRequests: 'Loading requests...',
        actionRequired: 'Action Required',
        issued: 'Issued',
        draft: 'Draft',
        inProgress: 'In Progress',
        of: 'of',
    },
    ar: {
        eService: 'الخدمة الإلكترونية',
        regulatorySupport: 'تخزين المياه الاستراتيجي',
        regulatorySupportService: 'تخزين المياه الاستراتيجي',
        regulatorySupportRequests: 'جميع الطلبات',
        newButton: 'طلب جديد',
        searchPlaceholder: 'بحث',
        statusFilter: 'الحالة',
        requestNumber: 'رقم الطلب',
        requestType: 'نوع الطلب',
        activityType: 'نوع النشاط',
        status: 'الحالة',
        submissionDate: 'تاريخ التقديم',
        actions: 'الإجراءات',
        noRequestsFound: 'لم يتم العثور على طلبات',
        loadingRequests: 'جاري تحميل الطلبات...',
        actionRequired: 'يتطلب إجراء',
        issued: 'صدر',
        draft: 'مسودة',
        inProgress: 'قيد المعالجة',
        of: 'من',
    },
};

const ITEMS_PER_PAGE = 10;

const StrategicWaterStorage = ({ language = 'en', onLanguageChange }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [requestTypeFilter, setRequestTypeFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRequestId, setSelectedRequestId] = useState(null);
    const [notificationCount, setNotificationCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);

    const navigate = useNavigate();
    const t = translations[language];

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const userData = JSON.parse(localStorage.getItem('swa_user'));
            if (!userData?.userId) {
                throw new Error('User data not found');
            }
            //const response = await axios.get(`${API_BASE_URL}?customerid=${userData.userId}`);
            const API_ENDPOINT = `${config.API_BASE_URL}/api/stratergic-water-support`;

            const response = await axios.get(`${API_ENDPOINT}?customerid=${userData.userId}`);
            if (response.data.success) {
                const tableData = response.data.data.map(record => {
            return {
                id: record.incidentid,
                requestNumber: record.ticketnumber,
                requestType: record["_swa_casecategoryid_value@OData.Community.Display.V1.FormattedValue"],
                activityType: record["_swa_casesubcategoryid_value@OData.Community.Display.V1.FormattedValue"],
                status: record["statuscode@OData.Community.Display.V1.FormattedValue"],
                submissionDate: record.createdon.substring(0, 10),
                actions: 'View Details',
            }
        })
        setLoading(true);
        setError(null);
                setData(tableData);
            } else {
                throw new Error(response.data.error || 'Failed to fetch data');
            }
        } catch (err) {
            setError('An error occurred while fetching data. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleTranslate = () => onLanguageChange(language === 'en' ? 'ar' : 'en');
    
    const handleRequestClick = (request) => {
        setSelectedRequestId(request.id);
    };

    const handleBack = () => {
        setSelectedRequestId(null);
        fetchData();
    };

    const filtered = data.filter((item) => {
        const search = searchTerm.toLowerCase();
        // Added optional chaining (?.) to prevent crashes if a field is null or undefined
        const matchesSearch =
            item?.requestNumber?.toLowerCase().includes(search) ||
            item?.requestType?.toLowerCase().includes(search) ||
            item?.activityType?.toLowerCase().includes(search);
        const matchesStatus = !statusFilter || item?.status === statusFilter;
        const matchesRequestType = !requestTypeFilter || item?.requestType === requestTypeFilter;
        return matchesSearch && matchesStatus && matchesRequestType;
    });

    const uniqueStatuses = [...new Set(data.map((item) => item.status))].sort();
    const uniqueRequestTypes = [...new Set(data.map((item) => item.requestType))].sort();

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

    const getStatusColor = (status) => {
        switch (status) {
            case 'Action Required':
                return 'bg-[#FFF7E8] text-[#F39C12]';
            case 'Issued':
                return 'bg-[#EAFBF2] text-[#1B8354]';
            case 'Draft':
                return 'bg-[#F2F4F7] text-[#6C737F]';
            case 'In Progress':
                return 'bg-[#EBF1F7] text-[#4169E1]';
            default:
                return 'bg-gray-200 text-gray-700';
        }
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
                            <ol className="w-[650px] inline-flex p-0 items-start gap-0">
                                <li className="flex pr-[4px] items-center gap-[4px]">
                                    <a href="#" className="text-[#14573A] font-['IBM Plex Sans Arabic'] text-[14px] font-normal leading-[20px] no-underline">
                                        {t.eService}
                                    </a>
                                </li>
                                <span className="flex w-[16px] h-[16px] py-[2.222px] px-[4.827px] justify-center items-center text-black">›</span>
                                <li className="flex pr-[4px] items-center gap-[4px]">
                                    <a href="#" className="text-[#14573A] font-['IBM Plex Sans Arabic'] text-[14px] font-normal leading-[20px] no-underline">
                                        {t.regulatorySupport}
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
                        {t.regulatorySupportService}
                    </h1>
                </div>

                <NotificationSystem
                    isVisible={showNotifications}
                    onClose={() => setShowNotifications(false)}
                    onNotificationCountChange={setNotificationCount}
                    currentItems={data.flatMap(item => item.externalCommunications || [])}
                    itemType="request"
                    displayMode="panel"
                />
                <NotificationSystem
                    displayMode="inline"
                    currentItems={data.flatMap(item => item.externalCommunications || [])}
                    itemType="request"
                    onNotificationCountChange={() => { }}
                />

                <div className="flex flex-col items-center flex-shrink-0 w-[95%] mx-auto min-h-[740px] rounded-[6px] bg-white shadow-[0px_3px_12px_0px_rgba(47,43,61,0.14)] mt-[-50px] relative z-[1] mb-[40px]">
                    {selectedRequestId ? (
                        <SWSDetails
                            requestId={selectedRequestId}
                            onBackToList={handleBack}
                            language={language}
                        />
                    ) : (
                        <>
                            <div className="flex flex-col justify-center items-end self-stretch p-[41px] gap-[12px] border-b border-[#e0e0e0] w-full">
                                <div className="w-full flex items-center justify-between flex-row">
                                    <div className="flex items-center gap-[8px]">
                                        <span className="text-[#384250] font-['IBM Plex Sans Arabic'] text-[18px] font-medium leading-[28px]">
                                            {t.regulatorySupportRequests}
                                        </span>
                                    </div>
                                    <div>
                                        <button className="bg-[#1B8354] border-none text-white font-['IBM Plex Sans Arabic'] text-[16px] font-medium leading-[24px] h-[40px] px-[16px] rounded-[4px]" onClick={() => navigate('/NewRequest')}>
                                            {t.newButton}
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row items-center justify-between w-full gap-[15px] mt-[10px]">
                                    <div className="relative w-full md:w-1/3 h-[40px] border border-[#9DA4AE] rounded-[6px] bg-white">
                                        <img src={Search} alt="Search Icon" className="absolute w-[18px] h-[18px] left-[10px] top-1/2 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            placeholder={t.searchPlaceholder}
                                            className="w-full h-full pl-[35px] pr-[12px] border-none outline-none font-['IBM Plex Sans Arabic'] text-[16px] font-normal text-[#6C737F] bg-transparent leading-[24px] placeholder-[#6C737F]"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <div className="w-full md:w-1/3">
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            className="relative w-full h-[40px] border border-[#9DA4AE] rounded-[6px] bg-white font-['IBM Plex Sans Arabic'] text-[16px] text-[#6C737F] pl-[12px] pr-[40px] outline-none appearance-none bg-no-repeat bg-[position:calc(100%-16px)] bg-[length:1.5em] bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20fill%3D%27none%27%20viewBox%3D%270%200%2024%2024%27%20stroke-width%3D%271.5%27%20stroke%3D%27currentColor%27%20class%3D%27w-6%20h-6%27%3E%3Cpath%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%20d%3D%27M19.5%208.25l-7.5%207.5-7.5-7.5%27%20%2F%3E%3C%2Fsvg%3E')]"
                                        >
                                            <option value="">{t.statusFilter}</option>
                                            {uniqueStatuses.map((status, index) => (
                                                <option key={index} value={status}>{status}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-full md:w-1/3">
                                        <select
                                            value={requestTypeFilter}
                                            onChange={(e) => setRequestTypeFilter(e.target.value)}
                                            className="relative w-full h-[40px] border border-[#9DA4AE] rounded-[6px] bg-white font-['IBM Plex Sans Arabic'] text-[16px] text-[#6C737F] pl-[12px] pr-[40px] outline-none appearance-none bg-no-repeat bg-[position:calc(100%-16px)] bg-[length:1.5em] bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20fill%3D%27none%27%20viewBox%3D%270%200%2024%2024%27%20stroke-width%3D%271.5%27%20stroke%3D%27currentColor%27%20class%3D%27w-6%20h-6%27%3E%3Cpath%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%20d%3D%27M19.5%208.25l-7.5%207.5-7.5-7.5%27%20%2F%3E%3C%2Fsvg%3E')]"
                                        >
                                            <option value="">{t.requestType}</option>
                                            {uniqueRequestTypes.map((type, index) => (
                                                <option key={index} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            {loading ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-[#1B8354] rounded-full animate-spin"></div>
                                    <span className="ml-4 text-gray-700">{t.loadingRequests}</span>
                                </div>
                            ) : error ? (
                                <div className="flex items-center justify-center h-full text-center p-8 text-red-500 bg-red-50 border border-red-200 rounded-lg shadow-sm">
                                    <p className="font-bold">Error:</p>
                                    <p className="ml-2">{error}</p>
                                </div>
                            ) : (
                                <div className="w-full overflow-x-auto mt-[20px] px-[30px]">
                                    <table className="w-full border-collapse font-['IBM Plex Sans Arabic']">
                                        <thead>
                                            <tr>
                                                <th className="bg-[#F9FAFB] border-t border-b border-r border-[#D2D6DB] px-[16px] py-[12px] text-left text-[14px] font-medium text-[#384250]">
                                                    {t.requestNumber}
                                                </th>
                                                <th className="bg-[#F9FAFB] border-t border-b border-r border-[#D2D6DB] px-[16px] py-[12px] text-left text-[14px] font-medium text-[#384250]">
                                                    {t.requestType}
                                                </th>
                                                <th className="bg-[#F9FAFB] border-t border-b border-r border-[#D2D6DB] px-[16px] py-[12px] text-left text-[14px] font-medium text-[#384250]">
                                                    {t.activityType}
                                                </th>
                                                <th className="bg-[#F9FAFB] border-t border-b border-r border-[#D2D6DB] px-[16px] py-[12px] text-left text-[14px] font-medium text-[#384250]">
                                                    {t.status}
                                                </th>
                                                <th className="bg-[#F9FAFB] border-t border-b border-r border-[#D2D6DB] px-[16px] py-[12px] text-left text-[14px] font-medium text-[#384250]">
                                                    {t.submissionDate}
                                                </th>
                                                <th className="bg-[#F9FAFB] border-t border-b border-[#D2D6DB] px-[16px] py-[12px] text-left text-[14px] font-medium text-[#384250]">
                                                    {t.actions}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentItems.length ? (
                                                currentItems.map((row) => (
                                                    <tr key={row.id}>
                                                        <td className="p-[16px] border-b border-[#E5E5E5] border-r border-[#D2D6DB] text-[14px] text-[#161616] first:border-l">
                                                            <button
                                                                onClick={() => handleRequestClick(row)}
                                                                className="text-[#1B8354] no-underline font-medium bg-transparent border-none cursor-pointer"
                                                            >
                                                                {row.requestNumber}
                                                            </button>
                                                        </td>
                                                        <td className="p-[16px] border-b border-[#E5E5E5] border-r border-[#D2D6DB] text-[14px] text-[#161616]">{row.requestType}</td>
                                                        <td className="p-[16px] border-b border-[#E5E5E5] border-r border-[#D2D6DB] text-[14px] text-[#161616]">{row.activityType}</td>
                                                        <td className="p-[16px] border-b border-[#E5E5E5] border-r border-[#D2D6DB] text-[14px] text-[#161616]">
                                                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(row.status)}`}>
                                                                {t[row.status?.toLowerCase().replace(/\s/g, '')] || row.status}
                                                            </span>
                                                        </td>
                                                        <td className="p-[16px] border-b border-[#E5E5E5] border-r border-[#D2D6DB] text-[14px] text-[#161616]">{row.submissionDate}</td>
                                                        <td className="p-[16px] border-b border-[#E5E5E5] border-r border-[#D2D6DB] text-[14px] text-[#161616]">
                                                            <button onClick={() => handleRequestClick(row)} className="text-[#1B8354] flex items-center gap-1 bg-transparent border-none cursor-pointer">
                                                                <span>{row.actions}</span>
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                                                </svg>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" className="text-center p-[2rem] text-gray-500">
                                                        {t.noRequestsFound}
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}

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
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StrategicWaterStorage;