import React, { useState } from 'react';
import axios from 'axios';
import config from '@/utils/config';

const CASE_TYPE_ID = "35560e9c-be3b-f111-957b-962697b5f82b";

const IncidentInquiryForm = ({ language = 'ar' }) => {
    const isRtl = language === 'ar';
    const [incidentNumber, setIncidentNumber] = useState('');
    const [nationalId, setNationalId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [inquiryResult, setInquiryResult] = useState(null);
    const [error, setError] = useState('');
    const [selectedResponse, setSelectedResponse] = useState(null);
    const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);

    const t = {
        ar: {
            breadcrumb: 'الرئيسية > الخدمات الإلكترونية > خدمة الاستعلام عن بلاغ',
            title: 'خدمة الاستعلام عن بلاغ',
            share: 'مشاركة الصفحة :',
            incidentNumber: 'رقم البلاغ',
            incidentNumberPlaceholder: 'رقم البلاغ',
            nationalId: 'رقم الهوية / الإقامة',
            nationalIdPlaceholder: 'ادخل رقم الهوية / الإقامة',
            inquire: 'الاستعلام',
            incidentDetails: 'تفاصيل البلاغ',
            status: 'حالة البلاغ',
            date: 'تاريخ البلاغ',
            noResults: 'لا توجد نتائج مطابقة',
            validationError: 'يرجى إدخال رقم البلاغ ورقم هوية صحيح (10 أرقام)',
            tableHeaders: {
                id: 'رقم البلاغ',
                type: 'نوع البلاغ',
                status: 'الحالة',
                date: 'تاريخ الإنشاء',
                desc: 'الوصف',
                response: 'الرد'
            },
            readMore: 'قراءة المزيد',
            close: 'إغلاق'
        },
        en: {
            breadcrumb: 'Home > E-Services > Incident Inquiry Service',
            title: 'Incident Inquiry Service',
            share: 'Share Page :',
            incidentNumber: 'Incident Number',
            incidentNumberPlaceholder: 'Incident Number',
            nationalId: 'ID / Iqama Number',
            nationalIdPlaceholder: 'Enter ID / Iqama Number',
            inquire: 'Inquire',
            incidentDetails: 'Incident Details',
            status: 'Status',
            date: 'Date',
            noResults: 'No matching results found',
            validationError: 'Please enter an incident number and a valid ID number (10 digits)',
            tableHeaders: {
                id: 'Incident Number',
                type: 'Type',
                status: 'Status',
                date: 'Creation Date',
                desc: 'Description',
                response: 'Response'
            },
            readMore: 'Read More',
            close: 'Close'
        }
    };

    const texts = t[language] || t.ar;

    const handleIncidentNumberChange = (e) => {
        // Allow English alphanumeric characters and hyphen only
        const val = e.target.value.replace(/[^a-zA-Z0-9-]/g, '');
        setIncidentNumber(val);
    };

    const handleNationalIdChange = (e) => {
        // Allow digits only, max 10
        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
        setNationalId(val);
    };

    const handleInquiry = async () => {
        setError('');
        setInquiryResult(null);

        if (!incidentNumber || nationalId.length !== 10) {
            setError(texts.validationError);
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(`${config.API_BASE_URL}/api/incidents/search`, {
                ticketNumber: incidentNumber.trim(),
                nationalId: nationalId.trim(),
                caseTypeId: CASE_TYPE_ID
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = response.data;
            if (data?.success && Array.isArray(data.data) && data.data.length > 0) {
                const mappedData = data.data.map(item => ({
                    id: item.ticketNumber || item.ticketnumber || item.id || item.incidentNumber || incidentNumber,
                    type: isRtl
                        ? item.caseSubCategory?.arabicName || 'بلاغ'
                        : item.caseSubCategory?.name || 'Incident',
                    status: item.status || item.statuscodename || item.statuscode || (isRtl ? 'نشط' : 'Active'),
                    date: item.createdon
                        ? new Date(item.createdon).toLocaleDateString(isRtl ? 'ar-SA' : 'en-US')
                        : (item.date || new Date().toLocaleDateString(isRtl ? 'ar-SA' : 'en-US')),
                    description: item.description || item.desc || (isRtl ? 'لا يوجد وصف' : 'No description'),
                    response: item.specialistRemarks
                }));
                setInquiryResult(mappedData);
            } else {
                setError(texts.noResults);
                setInquiryResult(null);
            }

        } catch (err) {
            console.error('Inquiry error:', err);
            const errMsg = err?.response?.data?.message || err?.response?.data?.error || (isRtl ? 'حدث خطأ أثناء الاستعلام. يرجى المحاولة لاحقاً.' : 'An error occurred during inquiry. Please try again later.');
            setError(errMsg);
            setInquiryResult(null);
        } finally {
            setIsLoading(false);
        }
    };
    const showResponseColumn = inquiryResult?.some(item => item.response !== null && item.response !== undefined);

    return (
        <div className="flex-grow bg-gray-50 min-h-screen font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
            {/* Hero section with green background */}
            <div className="bg-[#1e7b51] text-white pt-20 pb-32 relative overflow-hidden">
                <div className="container mx-auto px-4 md:px-20 relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                        <div className="text-sm mb-10 opacity-90 flex items-center gap-2">
                            {texts.breadcrumb.split(' > ').map((crumb, idx, arr) => (
                                <React.Fragment key={idx}>
                                    <span className={idx === arr.length - 1 ? 'font-bold' : ''}>{crumb}</span>
                                    {idx < arr.length - 1 && (
                                        <span className="mx-1">{isRtl ? '<' : '>'}</span>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                            {texts.title}
                        </h1>
                    </div>
                    {/* Share Page Icons */}
                    {/* <div className="mt-6 md:mt-0 flex items-center gap-3 text-sm opacity-90">
                        <span>{texts.share}</span>
                        <div className="flex gap-2">
                            <div className="w-8 h-8 rounded border border-white/40 flex items-center justify-center hover:bg-white/10 cursor-pointer transition-colors">
                                <span className="text-xs">X</span>
                            </div>
                            <div className="w-8 h-8 rounded border border-white/40 flex items-center justify-center hover:bg-white/10 cursor-pointer transition-colors">
                                <span className="text-xs">f</span>
                            </div>
                            <div className="w-8 h-8 rounded border border-white/40 flex items-center justify-center hover:bg-white/10 cursor-pointer transition-colors">
                                <span className="text-xs">in</span>
                            </div>
                            <div className="w-8 h-8 rounded border border-white/40 flex items-center justify-center hover:bg-white/10 cursor-pointer transition-colors">
                                <span className="text-xs">W</span>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>

            {/* Main content container */}
            <div className="container mx-auto px-4 md:px-20 relative -mt-16 mb-12">
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-6 items-end">
                        {/* Incident Number Field */}
                        <div className="w-full md:w-2/5 relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <span className="text-red-500 mx-1">*</span>{texts.incidentNumber}
                            </label>
                            <input
                                type="text"
                                value={incidentNumber}
                                onChange={handleIncidentNumberChange}
                                placeholder={texts.incidentNumberPlaceholder}
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded text-gray-700 focus:outline-none focus:border-gray-400 transition-colors"
                            />
                        </div>

                        {/* National ID Field */}
                        <div className="w-full md:w-2/5 relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <span className="text-red-500 mx-1">*</span>{texts.nationalId}
                            </label>
                            <input
                                type="text"
                                value={nationalId}
                                onChange={handleNationalIdChange}
                                placeholder={texts.nationalIdPlaceholder}
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded text-gray-700 focus:outline-none focus:border-gray-400 transition-colors"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="w-full md:w-1/5 flex justify-end md:justify-start">
                            <button
                                onClick={handleInquiry}
                                disabled={isLoading || !incidentNumber || nationalId.length !== 10}
                                className={`w-full md:w-auto px-8 py-2.5 rounded transition-colors font-medium ${isLoading || !incidentNumber || nationalId.length !== 10
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-[#1e7b51] text-white hover:bg-[#165a3b]'
                                    }`}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                                        ...
                                    </span>
                                ) : (
                                    texts.inquire
                                )}
                            </button>
                        </div>
                    </div>
                    {error && (
                        <div className="mt-4 text-red-500 text-sm">
                            {error}
                        </div>
                    )}
                </div>

                {/* Inquiry Results Table */}
                {inquiryResult && (
                    <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden animate-fadeIn">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="text-lg font-bold text-gray-800">{texts.incidentDetails}</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-right">
                                <thead className="text-xs text-gray-600 bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 font-medium">{texts.tableHeaders.id}</th>
                                        <th scope="col" className="px-6 py-4 font-medium">{texts.tableHeaders.type}</th>
                                        <th scope="col" className="px-6 py-4 font-medium">{texts.tableHeaders.desc}</th>
                                        <th scope="col" className="px-6 py-4 font-medium">{texts.tableHeaders.date}</th>
                                        <th scope="col" className="px-6 py-4 font-medium">{texts.tableHeaders.status}</th>
                                        {showResponseColumn && (
                                            <th scope="col" className="px-6 py-4 font-medium">{texts.tableHeaders.response}</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {inquiryResult.map((item, index) => (
                                        <tr key={index} className="bg-white border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900">{item.id}</td>
                                            <td className="px-6 py-4 text-gray-600">{item.type}</td>
                                            <td className="px-6 py-4 text-gray-600 max-w-xs truncate" title={item.description}>{item.description}</td>
                                            <td className="px-6 py-4 text-gray-600">{item.date}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                                    {isRtl ? item.status_ar : item.status_en}
                                                </span>
                                            </td>
                                            {showResponseColumn && (
                                                <td className="px-6 py-4 text-gray-600 max-w-xs" title={item.response}>
                                                    <div className="hidden md:block whitespace-pre-wrap">
                                                        {item.response}
                                                    </div>
                                                    <div className="block md:hidden">
                                                        <div className="truncate">{item.response}</div>
                                                        {item.response && (
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedResponse(item.response);
                                                                    setIsResponseModalOpen(true);
                                                                }}
                                                                className="text-[#1e7b51] text-xs mt-1 underline hover:text-[#165a3b]"
                                                            >
                                                                {texts.readMore}
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                    {inquiryResult.length === 0 && (
                                        <tr>
                                            <td colSpan={showResponseColumn ? "6" : "5"} className="px-6 py-8 text-center text-gray-500">
                                                {texts.noResults}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Empty space below */}
            <div className="flex-grow min-h-[100px]"></div>

            {/* Response Modal */}
            {isResponseModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 animate-fadeIn">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-bold text-gray-800">
                                {texts.tableHeaders.response}
                            </h3>
                            <button
                                onClick={() => setIsResponseModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="max-h-[60vh] overflow-y-auto mb-6">
                            <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                                {selectedResponse}
                            </p>
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setIsResponseModalOpen(false)}
                                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded transition-colors"
                            >
                                {texts.close}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IncidentInquiryForm;
