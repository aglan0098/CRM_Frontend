import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '@/utils/config';
import { 
    FaChevronDown, 
    FaChevronUp, 
    FaTimes, 
    FaDownload, 
    FaEye, 
    FaRegFilePdf, 
    FaCheckCircle, 
    FaChevronLeft, 
    FaChevronRight, 
    FaTrash 
} from 'react-icons/fa';
import { VscPassFilled } from "react-icons/vsc";

//const API_BASE_URL = `http://localhost:5000/api/stratergic-water-support`;

const translations = {
    en: {
        appDetails: 'Application Details',
        appNumber: 'Application Number',
        requestType: 'Request Type',
        activityType: 'Activity Type',
        submissionDate: 'Submission Date',
        license: 'License',
        licenseName: 'License Name',
        status: 'Status',
        actions: 'Actions',
        preview: 'Preview',
        download: 'Download',
        permit: 'Permit',
        permitName: 'Permit Name',
        issueDate: 'Issue Date',
        formSubmitted: 'Form Submitted',
        additionalInfo: 'Additional Information',
        assets: 'Assets',
        projectInfo: 'Project Information',
        contracts: 'Contracts',
        back: 'Back',
        backToList: 'Back to List',
        next: 'Next',
        noInfoNeeded: 'No additional information is needed',
        appreciateTime: 'We appreciate your time!',
        previousResponses: 'Previous Responses',
        moreInfoNeeded: 'More info needed',
        completeRequiredDetails: 'Please complete the required details below to process your request.',
        additionalInformationRequired: 'Additional Information Required',
        responseRequired: 'Response Required',
        response: 'Response',
        messagePlaceholder: 'Message...',
        uploadFile: 'Upload file',
        selectFiles: 'Select files to upload (Max 3)',
        maxFilesError: 'Maximum 3 files allowed',
        uploadingFile: 'Uploading file...',
        fileUploadError: 'Failed to upload file',
        removeFile: 'Remove file',
        declaration: 'I declare that all information provided is true and accurate, and I bear full responsibility for the accuracy of this data.',
        cancel: 'Cancel',
        submit: 'Submit',
        submitting: 'Submitting...',
        caseResolution: 'Case Resolution',
        loadingResolution: 'Loading case resolution...',
        resolutionLoadError: 'Failed to load case resolution data.',
        plantName: 'Plant Name',
        city: 'City',
        techType: 'Technology Type',
        designCap: 'Design Capacity',
        opDate: 'Commercial Operation Date',
        landPlan: 'Land Layout Plan',
        opPermit: 'Operational Permit from the National Center for Environmental',
        view: 'View',
        pagination: '1–10 of 16',
        nationalAddress: 'National Address',
        projectInvestmentAmount: 'Project Investment Amount',
        ownershipStructure: "Ownership Structure and Shareholders' Equity",
        accountingStandard: 'Accounting System/Standard Followed',
        sitePlan: 'Site Plan of the Land and Buildings Where the Project Will Be Carried Out',
        ownershipDeed: 'Land and Building Ownership Deed or Proof of Right to Use for Benefit',
        financialStatements: 'Financial Statements for the Last Three Years of the Project',
        executedContracts: 'Executed Contracts Information',
        securityCamerasCert: 'Certificate of Compliance for Installation of Security Surveillance Cameras',
        otherPartyName: 'Other Party Name',
        currentContractStatus: 'Current Contract Status',
        contractType: 'Contract Type',
        contractDuration: 'Contract Duration (in months)',
        annualPricingRate: 'Annual Pricing Rate',
        contractedQuantity: 'Contracted Quantity',
        notes: 'Notes',
        contractFile: 'Contract File'
    },
    ar: {
        appDetails: 'تفاصيل الطلب',
        appNumber: 'رقم الطلب',
        requestType: 'نوع الطلب',
        activityType: 'نوع النشاط',
        submissionDate: 'تاريخ التقديم',
        license: 'الرخصة',
        licenseName: 'اسم الرخصة',
        status: 'الحالة',
        actions: 'الإجراءات',
        preview: 'معاينة',
        download: 'تحميل',
        permit: 'التصريح',
        permitName: 'اسم التصريح',
        issueDate: 'تاريخ الإصدار',
        formSubmitted: 'تم تقديم النموذج',
        additionalInfo: 'معلومات إضافية',
        assets: 'الأصول',
        projectInfo: 'معلومات المشروع',
        contracts: 'العقود',
        back: 'عودة',
        backToList: 'عودة إلى القائمة',
        next: 'التالي',
        noInfoNeeded: 'لا توجد معلومات إضافية مطلوبة',
        appreciateTime: 'نقدر وقتكم!',
        previousResponses: 'الردود السابقة',
        moreInfoNeeded: 'مطلوب مزيد من المعلومات',
        completeRequiredDetails: 'يرجى استكمال التفاصيل المطلوبة أدناه لمعالجة طلبك.',
        additionalInformationRequired: 'معلومات إضافية مطلوبة',
        responseRequired: 'الرد مطلوب',
        response: 'الرد',
        messagePlaceholder: 'رسالة...',
        uploadFile: 'رفع ملف',
        selectFiles: 'اختر الملفات للرفع (الحد الأقصى 3)',
        maxFilesError: 'الحد الأقصى 3 ملفات مسموح',
        uploadingFile: 'جارٍ رفع الملف...',
        fileUploadError: 'فشل في رفع الملف',
        removeFile: 'إزالة الملف',
        declaration: 'أقر بأن جميع المعلومات المقدمة صحيحة ودقيقة، وأتحمل المسؤولية الكاملة عن دقة هذه البيانات.',
        cancel: 'إلغاء',
        submit: 'إرسال',
        submitting: 'جارٍ الإرسال...',
        caseResolution: 'حل القضية',
        loadingResolution: 'جارٍ تحميل حل القضية...',
        resolutionLoadError: 'فشل في تحميل بيانات حل القضية.',
        plantName: 'اسم المحطة',
        city: 'المدينة',
        techType: 'نوع التقنية',
        designCap: 'السعة التصميمية',
        opDate: 'تاريخ التشغيل التجاري',
        landPlan: 'مخطط الأرض',
        opPermit: 'تصريح التشغيل من المركز الوطني للبيئة',
        view: 'عرض',
        pagination: '١–١٠ من ١٦',
        nationalAddress: 'العنوان الوطني',
        projectInvestmentAmount: 'مبلغ استثمار المشروع',
        ownershipStructure: 'هيكل الملكية وحقوق المساهمين',
        accountingStandard: 'النظام/المعيار المحاسبي المتبع',
        sitePlan: 'مخطط الموقع للأرض والمباني التي سيتم تنفيذ المشروع فيها',
        ownershipDeed: 'صك ملكية الأرض والمبنى أو إثبات حق الانتفاع',
        financialStatements: 'البيانات المالية للسنوات الثلاث الأخيرة للمشروع',
        executedContracts: 'معلومات العقود المنفذة',
        securityCamerasCert: 'شهادة مطابقة لتركيب كاميرات المراقبة الأمنية',
        otherPartyName: 'اسم الطرف الآخر',
        currentContractStatus: 'حالة العقد الحالية',
        contractType: 'نوع العقد',
        contractDuration: 'مدة العقد (بالأشهر)',
        annualPricingRate: 'معدل التسعير السنوي',
        contractedQuantity: 'الكمية المتعاقد عليها',
        notes: 'ملاحظات',
        contractFile: 'ملف العقد'
    },
};

const TabButton = ({ title, activeTab, setActiveTab }) => (
    <button
        onClick={() => setActiveTab(title)}
        className={`flex-1 text-center whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
            activeTab === title
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-600 hover:border-gray-300'
        }`}
    >
        {title}
    </button>
);

const DocumentLink = ({ doc, t }) => (
    
    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md bg-white">
        <div className="flex items-center gap-2">
            <FaRegFilePdf className="text-red-500" />
            <span className="text-sm text-gray-800">{doc.swa_documentlink.split("/").pop()}</span>
        </div>
        <a href={doc["swa_documentlink"]} target="_blank" rel="noopener noreferrer" className="text-gray-500 flex items-center gap-1 hover:text-blue-600 transition-colors" aria-label={t.preview}>
            {t.preview} <FaEye />
        </a>
    </div>
);

const SWSDetails = ({ requestId, onBackToList, language = 'en' }) => {
    const [details, setDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('Additional Information');
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [responses, setResponses] = useState({});
    const [uploadedFiles, setUploadedFiles] = useState({});
    const [agreements, setAgreements] = useState({});
    const [isSubmitting, setIsSubmitting] = useState({});
    const [isUploading, setIsUploading] = useState({});
    const [resolutionData, setResolutionData] = useState(null);
    const [loadingResolution, setLoadingResolution] = useState(false);
    const [resolutionError, setResolutionError] = useState(null);

    const t = translations[language];
    const tabs = [t.additionalInfo, t.assets, t.projectInfo, t.contracts];
    const API_ENDPOINT = `${config.API_BASE_URL}/api/stratergic-water-support`;
    useEffect(() => {
        const fetchDetails = async () => {
            if (!requestId) {
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${API_ENDPOINT}/details/${requestId}`);
                //const response = await axios.get(`${API_BASE_URL}/details/${requestId}`);
                console.log(response.data.data.contracts)
                if (response.data.success) {
                    setDetails(response.data.data);
                    setActiveTab(t.additionalInfo);
                } else {
                    throw new Error(response.data.error || 'Failed to fetch details.');
                }
            } catch (err) {
                setError(err.message);
                console.error("Failed to fetch request details:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDetails();
    }, [requestId, t.additionalInfo, API_ENDPOINT]);

    useEffect(() => {
        const fetchResolutionData = async () => {
            if (details && details.statecode === 1) {
                setLoadingResolution(true);
                setResolutionError(null);
                try {
                    //const response = await axios.get(`${API_BASE_URL}/resolution/${details.id}`);
                    const response = await axios.get(`${API_ENDPOINT}/resolution/${details.id}`);
                    if (response.data.success) {
                        setResolutionData(response.data.data);
                    } else {
                        throw new Error(response.data.error || t.resolutionLoadError);
                    }
                } catch (error) {
                    setResolutionError(t.resolutionLoadError);
                } finally {
                    setLoadingResolution(false);
                }
            }
        };
        fetchResolutionData();
    }, [details, t.resolutionLoadError, API_ENDPOINT]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[500px]">
                <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-[#1B8354] rounded-full animate-spin"></div>
                <span className="ml-4 text-gray-700">Loading Details...</span>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="flex items-center justify-center h-full min-h-[500px] text-center p-8 text-red-500 bg-red-50 border border-red-200 rounded-lg">
                <p className="font-bold">Error:</p>
                <p className="ml-2">{error}</p>
            </div>
        );
    }
    
    if (!details) return null;

    const isResolutionState = details.statecode === 1;

    const handleNextTab = () => {
        const currentIndex = tabs.indexOf(activeTab);
        if (currentIndex < tabs.length - 1) setActiveTab(tabs[currentIndex + 1]);
    };
    const handleBackTab = () => {
        const currentIndex = tabs.indexOf(activeTab);
        if (currentIndex > 0) setActiveTab(tabs[currentIndex - 1]);
    };

    const toggleAccordion = (index) => setExpandedIndex(index === expandedIndex ? null : index);

    const removeFile = (commId, indexToRemove) => {
        setUploadedFiles(prev => ({
            ...prev,
            [commId]: prev[commId].filter((_, i) => i !== indexToRemove)
        }));
    };

    const handleFileUpload = async (event, commId) => {
        const files = Array.from(event.target.files);
        if ((uploadedFiles[commId]?.length || 0) + files.length > 3) {
            alert(t.maxFilesError);
            return;
        }
        setIsUploading({ ...isUploading, [commId]: true });
        try {
            const newFiles = files.map(file => ({ fileName: file.name, url: `https://your-storage-service.com/${file.name}` }));
            setUploadedFiles(prev => ({ ...prev, [commId]: [...(prev[commId] || []), ...newFiles] }));
        } catch (error) {
            alert(t.fileUploadError);
        } finally {
            setIsUploading({ ...isUploading, [commId]: false });
        }
    };

    const handleSubmit = async (comm) => {
        const commId = comm.externalCommunicationId;
        if (!agreements[commId]) return alert('Please accept the declaration.');
        if (!responses[commId]?.trim()) return alert('Please enter a response.');
    
        setIsSubmitting({ ...isSubmitting, [commId]: true });
        try {
            await axios.post(`${API_ENDPOINT}/respond`, {
                commId,
                response: responses[commId],
                files: uploadedFiles[commId] || []
            });
            alert('Response submitted successfully.');
            onBackToList();
        } catch (error) {
            console.error("Submission error:", error);
            alert('Failed to submit response.');
        } finally {
            setIsSubmitting({ ...isSubmitting, [commId]: false });
        }
    };

    const allCommunications = details.externalCommunications || [];
    console.log("as",allCommunications)
    const activeCommunications = allCommunications.filter(c => c.comstatusCode === 116950002 && c.response === null);
    console.log("activeCommunications : ", activeCommunications);
    const previousCommunications = allCommunications.filter(c => c.comstatusCode === 116950004 && c.response !== null);
    
    const findDocument = (docTypeId) => details.projectInfo?.documents?.find(doc => doc["_swa_documenttype_value"] === docTypeId);
    const findContractDocument = (docTypeId) => details.contracts?.contractFile?.find(doc => doc["_swa_documenttype_value"] === docTypeId);

    return (
        <div className={`flex flex-col w-full min-h-screen bg-white ${language === 'ar' ? 'rtl' : 'ltr'}`}>
            <div className="flex-grow w-full px-4 md:px-8 py-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">{t.appDetails}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">{t.appNumber}</label>
                        <p className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md w-full">{details.applicationNumber}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">{t.requestType}</label>
                        <p className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md w-full">{details.requestType}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">{t.activityType}</label>
                        <p className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md w-full">{details.activityType}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">{t.submissionDate}</label>
                        <p className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md w-full">{details.submissionDate}</p>
                    </div>
                </div>

                <h2 className="text-xl font-bold text-gray-800 mb-4 mt-8">{t.license}</h2>
                <div className="overflow-x-auto rounded-md border border-gray-200">
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="p-3 text-left text-sm font-semibold text-gray-600">{t.licenseName}</th>
                                <th scope="col" className="p-3 text-left text-sm font-semibold text-gray-600">{t.status}</th>
                                <th scope="col" className="p-3 text-left text-sm font-semibold text-gray-600">{t.actions}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {details.licenses?.length > 0 ? (
                                details.licenses.map((license, index) => (
                                    <tr key={index} className="border-t border-gray-200">
                                        <td className="p-3 text-sm text-gray-700">{license.licenseName}</td>
                                        <td className="p-3 text-sm text-gray-700">
                                            <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full font-medium text-xs">{license.status}</span>
                                        </td>
                                        <td className="p-3 text-sm text-gray-700 flex items-center gap-4">
                                            <a href={license.url} target="_blank" rel="noopener noreferrer" className="text-gray-500 flex items-center gap-1 hover:text-blue-600 transition-colors" aria-label={t.preview} title={t.preview}>
                                                {t.preview} <FaEye />
                                            </a>
                                            <a href={license.url} download className="flex items-center gap-1 px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors" aria-label={t.download} title={t.download}>
                                                {t.download} <FaDownload />
                                            </a>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="3" className="text-center p-3 text-gray-500">No licenses found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <h2 className="text-xl font-bold text-gray-800 mb-4 mt-8">{t.permit}</h2>
                <div className="overflow-x-auto rounded-md border border-gray-200">
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="p-3 text-left text-sm font-semibold text-gray-600">{t.permitName}</th>
                                <th scope="col" className="p-3 text-left text-sm font-semibold text-gray-600">{t.issueDate}</th>
                                <th scope="col" className="p-3 text-left text-sm font-semibold text-gray-600">{t.actions}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {details.permits?.length > 0 ? (
                                details.permits.map((permit, index) => (
                                    <tr key={index} className="border-t border-gray-200">
                                        <td className="p-3 text-sm text-gray-700">{permit.permitName}</td>
                                        <td className="p-3 text-sm text-gray-700">{permit.issueDate}</td>
                                        <td className="p-3 text-sm text-gray-700 flex items-center gap-4">
                                            <a href={permit.url} target="_blank" rel="noopener noreferrer" className="text-gray-500 flex items-center gap-1 hover:text-blue-600 transition-colors" aria-label={t.preview} title={t.preview}>
                                                {t.preview} <FaEye />
                                            </a>
                                            <a href={permit.url} download className="flex items-center gap-1 px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors" aria-label={t.download} title={t.download}>
                                                {t.download} <FaDownload />
                                            </a>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="3" className="text-center p-3 text-gray-500">No permits found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <h2 className="text-xl font-bold text-gray-800 mb-4 mt-8">{t.formSubmitted}</h2>
                <div className="border-b border-gray-200">
                    <nav className="hidden md:flex -mb-px" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <TabButton key={tab} title={tab} activeTab={activeTab} setActiveTab={setActiveTab} />
                        ))}
                    </nav>
                    <div className="md:hidden">
                        <select
                            aria-label="Selected tab"
                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                            onChange={(e) => setActiveTab(e.target.value)}
                            value={activeTab}
                        >
                            {tabs.map(tab => <option key={tab} value={tab}>{tab}</option>)}
                        </select>
                    </div>
                </div>

                <div className="mt-6 min-h-[300px]">
                    {activeTab === t.additionalInfo && (
                        <div className="space-y-6">
                            {activeCommunications.length > 0 && (
                                <div className="flex items-center justify-between p-4 bg-yellow-50 text-yellow-700 rounded-md border border-yellow-200">
                                    <div className="flex items-center gap-2">
                                        <FaTimes className="text-yellow-700" />
                                        <span className="font-medium">{t.moreInfoNeeded}: {t.completeRequiredDetails}</span>
                                    </div>
                                    <button onClick={() => {}} className="text-yellow-700 hover:text-yellow-900"><FaTimes /></button>
                                </div>
                            )}
                            {!isResolutionState && activeCommunications.length === 0 && previousCommunications.length === 0 && (
                                <div className="flex flex-col items-center justify-center text-center p-16 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="p-4 rounded-full bg-green-100 text-green-600 mb-4">
                                        <VscPassFilled size={48} />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800">{t.noInfoNeeded}</h3>
                                    <p className="text-gray-500">{t.appreciateTime}</p>
                                </div>
                            )}

                            {(previousCommunications.length > 0) && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">{t.previousResponses}</h3>
                                    {previousCommunications.map((comm, index) => (
                                        <div key={comm.externalCommunicationId || index} className="border rounded-lg mb-4 overflow-hidden">
                                            <div 
                                                className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
                                                onClick={() => toggleAccordion(index)}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <span className="font-semibold text-gray-800">{comm.requestedInformation}</span>
                                                    <span className="text-xs font-medium text-green-700 px-2 py-1 bg-green-100 rounded-full">Resolved</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-sm text-gray-500">{comm.date}</span>
                                                    {expandedIndex === index ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
                                                </div>
                                            </div>
                                            {expandedIndex === index && (
                                                <div className="p-4 space-y-4">
                                                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md border border-gray-200">
                                                        {comm.response}
                                                    </p>
                                                    <div className="space-y-3">
                                                        {comm.attachedDocuments?.map((doc, docIndex) => (
                                                            <div key={docIndex} className="flex items-center justify-between p-3 border rounded-md bg-white">
                                                                <div className="flex items-center gap-3">
                                                                    <FaRegFilePdf className="text-red-500 text-lg" />
                                                                    <span className="text-sm font-medium text-gray-800">{doc.name}</span>
                                                                </div>
                                                                <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-gray-500 flex items-center gap-1 hover:text-blue-600 transition-colors" aria-label={t.preview}>
                                                                    {t.preview} <FaEye />
                                                                </a>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeCommunications.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">{t.additionalInformationRequired}</h3>
                                    {activeCommunications.map((comm, index) => (
                                        <div key={comm.externalCommunicationId} className="border rounded-lg mb-4 overflow-hidden">
                                            <div 
                                                className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
                                                onClick={() => toggleAccordion(index + previousCommunications.length)}
                                            >
                                                <span className="font-semibold text-gray-800">{t.responseRequired}: {comm.requestedInformation}</span>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-xs font-medium text-yellow-700 px-2 py-1 bg-yellow-100 rounded-full">In Progress</span>
                                                    {expandedIndex === index + previousCommunications.length ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
                                                </div>
                                            </div>
                                            {expandedIndex === index + previousCommunications.length && (
                                                <div className="p-4 space-y-6">
                                                    <textarea
                                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
                                                        placeholder={t.messagePlaceholder}
                                                        value={responses[comm.externalCommunicationId] || ''}
                                                        onChange={(e) => setResponses(prev => ({ ...prev, [comm.externalCommunicationId]: e.target.value }))}
                                                        rows="5"
                                                    />
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">{t.uploadFile}</label>
                                                        <input
                                                            type="file"
                                                            multiple
                                                            onChange={(e) => handleFileUpload(e, comm.externalCommunicationId)}
                                                            className="hidden"
                                                            id={`file-upload-${comm.externalCommunicationId}`}
                                                            accept=".pdf,.doc,.docx,.jpg,.png"
                                                        />
                                                        <label 
                                                            htmlFor={`file-upload-${comm.externalCommunicationId}`} 
                                                            className="cursor-pointer inline-flex px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                                                        >
                                                            {t.selectFiles}
                                                        </label>
                                                        {isUploading[comm.externalCommunicationId] && <p className="mt-2 text-sm text-gray-500">{t.uploadingFile}</p>}
                                                        <div className="mt-4 space-y-2">
                                                            {uploadedFiles[comm.externalCommunicationId]?.map((file, fileIndex) => (
                                                                <div key={fileIndex} className="flex items-center justify-between p-3 border rounded-md bg-white">
                                                                    <div className="flex items-center gap-3">
                                                                        <FaRegFilePdf className="text-red-500 text-lg" />
                                                                        <span className="text-sm font-medium text-gray-800">{file.fileName}</span>
                                                                    </div>
                                                                    <button 
                                                                        onClick={() => removeFile(comm.externalCommunicationId, fileIndex)} 
                                                                        className="text-red-600 w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-50 transition-colors"
                                                                        aria-label={t.removeFile}
                                                                    >
                                                                        <FaTrash />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <input
                                                            id={`declaration-${comm.externalCommunicationId}`}
                                                            type="checkbox"
                                                            className="h-5 w-5 mt-1 border-gray-300 rounded text-green-600 focus:ring-green-500"
                                                            checked={agreements[comm.externalCommunicationId] || false}
                                                            onChange={(e) => setAgreements(prev => ({ ...prev, [comm.externalCommunicationId]: e.target.checked }))}
                                                        />
                                                        <label htmlFor={`declaration-${comm.externalCommunicationId}`} className="text-sm text-gray-700">{t.declaration}</label>
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <button
                                                            onClick={() => handleSubmit(comm)}
                                                            disabled={isSubmitting[comm.externalCommunicationId] || !agreements[comm.externalCommunicationId]}
                                                            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                                                        >
                                                            {isSubmitting[comm.externalCommunicationId] ? t.submitting : t.submit}
                                                        </button>
                                                        <button onClick={onBackToList} className="px-6 py-2 border border-gray-200 rounded-md text-gray-700 hover:bg-gray-100 transition-colors">
                                                            {t.cancel}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {isResolutionState && (
                                <div className="mt-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <FaCheckCircle className="text-green-600 text-xl" />
                                        <h3 className="text-lg font-semibold text-gray-800">{t.caseResolution}</h3>
                                    </div>
                                    {loadingResolution ? (
                                        <p className="text-gray-500">{t.loadingResolution}</p>
                                    ) : resolutionError ? (
                                        <p className="text-red-500">{resolutionError}</p>
                                    ) : (
                                        <textarea 
                                            value={resolutionData?.subject || ''} 
                                            disabled 
                                            rows="4" 
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-700 resize-none"
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === t.assets && (
                        <div>
                            <div className="overflow-x-auto rounded-md border border-gray-200">
                                <table className="w-full table-fixed text-left border-collapse">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="w-[15%] p-3 text-sm font-semibold text-gray-600">{t.plantName}</th>
                                            <th scope="col" className="w-[10%] p-3 text-sm font-semibold text-gray-600">{t.city}</th>
                                            <th scope="col" className="w-[15%] p-3 text-sm font-semibold text-gray-600">{t.techType}</th>
                                            <th scope="col" className="w-[10%] p-3 text-sm font-semibold text-gray-600">{t.designCap}</th>
                                            <th scope="col" className="w-[15%] p-3 text-sm font-semibold text-gray-600">{t.opDate}</th>
                                            <th scope="col" className="w-[15%] p-3 text-sm font-semibold text-gray-600">{t.landPlan}</th>
                                            <th scope="col" className="w-[20%] p-3 text-sm font-semibold text-gray-600">{t.opPermit}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {details.assets?.length > 0 ? (
                                            details.assets.map((asset, i) => (
                                                <tr key={i} className="hover:bg-gray-50 border-t border-gray-200">
                                                    <td className="p-3 text-sm text-gray-700 truncate">{asset.plantName}</td>
                                                    <td className="p-3 text-sm text-gray-700 truncate">{asset.city}</td>
                                                    <td className="p-3 text-sm text-gray-700 truncate">{asset.techType}</td>
                                                    <td className="p-3 text-sm text-gray-700 truncate">{asset.designCap}</td>
                                                    <td className="p-3 text-sm text-gray-700 truncate">{asset.opDate}</td>
                                                    <td className="p-3 text-sm text-gray-700">
                                                        {asset.documnets.find(ele=> ele ["_swa_documenttype_value"]=="7ad6bfd7-5877-f011-9556-86126a732009") ? (
                                                            <a href={asset.documnets.find(ele=> ele ["_swa_documenttype_value"]=="7ad6bfd7-5877-f011-9556-86126a732009").swa_documentlink} target="_blank" rel="noopener noreferrer" className="text-green-600 font-semibold hover:underline flex items-center gap-1" aria-label={t.view}>
                                                                {t.view} <FaEye />
                                                            </a>
                                                        ) : 'N/A'}
                                                    </td>
                                                    <td className="p-3 text-sm text-gray-700">
                                                        {asset.documnets.find(ele=> ele ["_swa_documenttype_value"]=="ebffcac8-5877-f011-9556-86126a732009") ? (
                                                            <a href={asset.documnets.find(ele=> ele ["_swa_documenttype_value"]=="ebffcac8-5877-f011-9556-86126a732009").swa_documentlink} target="_blank" rel="noopener noreferrer" className="text-green-600 font-semibold hover:underline flex items-center gap-1" aria-label={t.view}>
                                                                {t.view} <FaEye />
                                                            </a>
                                                        ) : 'N/A'}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan="7" className="text-center p-3 text-gray-500">No assets found.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
                                <span>{t.pagination}</span>
                                <div className="flex items-center gap-1">
                                    <button className="px-2 py-1 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors" aria-label="Previous page"><FaChevronLeft size={12} /></button>
                                    <button className="px-3 py-1 border border-gray-200 rounded-md bg-green-600 text-white font-semibold">1</button>
                                    <button className="px-3 py-1 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors">2</button>
                                    <button className="px-3 py-1 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors">3</button>
                                    <span className="px-2">...</span>
                                    <button className="px-3 py-1 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors">999</button>
                                    <button className="px-2 py-1 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors" aria-label="Next page"><FaChevronRight size={12} /></button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === t.projectInfo && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">{t.nationalAddress}</label>
                                <p className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md">{details.projectInfo?.nationalAddress || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">{t.projectInvestmentAmount}</label>
                                <p className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md">{details.projectInfo?.investmentAmount || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">{t.ownershipStructure}</label>
                                {findDocument('6b6dd625-5d77-f011-9556-86126a732009') ? <DocumentLink doc={findDocument('6b6dd625-5d77-f011-9556-86126a732009')} t={t} /> : <p className='text-gray-400 text-sm'>No document submitted.</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">{t.accountingStandard}</label>
                                {findDocument('697ca7ed-6823-f011-9543-83eee60d0c38') ? <DocumentLink doc={findDocument('697ca7ed-6823-f011-9543-83eee60d0c38')} t={t} /> : <p className='text-gray-400 text-sm'>No document submitted.</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">{t.sitePlan}</label>
                                {findDocument('91d4b72e-5d77-f011-9556-86126a732009') ? <DocumentLink doc={findDocument('91d4b72e-5d77-f011-9556-86126a732009')} t={t} /> : <p className='text-gray-400 text-sm'>No document submitted.</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">{t.ownershipDeed}</label>
                                {findDocument('fe77cbbf-eb24-f011-9544-a163bb4a4376') ? <DocumentLink doc={findDocument('fe77cbbf-eb24-f011-9544-a163bb4a4376')} t={t} /> : <p className='text-gray-400 text-sm'>No document submitted.</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">{t.financialStatements}</label>
                                {findDocument('6862e439-5d77-f011-9556-86126a732009') ? <DocumentLink doc={findDocument('6862e439-5d77-f011-9556-86126a732009')} t={t} /> : <p className='text-gray-400 text-sm'>No document submitted.</p>}
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">{t.executedContracts}</label>
                                {findDocument('4189ae04-5a77-f011-9556-86126a732009') ? <DocumentLink doc={findDocument('4189ae04-5a77-f011-9556-86126a732009')} t={t} /> : <p className='text-gray-400 text-sm'>No document submitted.</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-500 mb-1">{t.securityCamerasCert}</label>
                                {findDocument('bcf89f39-ed24-f011-9544-a163bb4a4376') ? <DocumentLink doc={findDocument('bcf89f39-ed24-f011-9544-a163bb4a4376')} t={t} /> : <p className='text-gray-400 text-sm'>No document submitted.</p>}
                            </div>
                        </div>
                    )}

                    {activeTab === t.contracts && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">{t.otherPartyName}</label>
                                <p className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md">{details.contracts?.otherPartyName || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">{t.currentContractStatus}</label>
                                <p className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md">{details.contracts?.status || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">{t.contractType}</label>
                                <p className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md">{details.contracts?.type || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">{t.contractDuration}</label>
                                <p className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md">{details.contracts?.duration || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">{t.annualPricingRate}</label>
                                <p className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md">{details.contracts?.pricingRate || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">{t.contractedQuantity}</label>
                                <p className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md">{details.contracts?.quantity || 'N/A'}</p>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-500 mb-1">{t.notes}</label>
                                <textarea className="w-full p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-600 resize-none" rows="4" readOnly value={details.contracts?.notes || ''} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">{t.contractFile}</label>
                                {findContractDocument('4189ae04-5a77-f011-9556-86126a732009') ? <DocumentLink doc={findContractDocument('4189ae04-5a77-f011-9556-86126a732009')} t={t} /> : <p className='text-gray-400 text-sm'>No document submitted.</p>}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 z-10">
                <div className="w-full px-4 md:px-8 py-4 flex justify-start items-center gap-4">
                    <button onClick={onBackToList} className="px-6 py-2 rounded-md font-semibold transition-colors bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200 flex items-center gap-2">
                        <FaChevronLeft size={12} /> {t.backToList}
                    </button>
                    <button onClick={handleBackTab} className="px-6 py-2 rounded-md font-semibold transition-colors bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200 flex items-center gap-2" disabled={tabs.indexOf(activeTab) === 0}>
                        <FaChevronLeft size={12} /> {t.back}
                    </button>
                    <button 
                        onClick={handleNextTab} 
                        className="px-6 py-2 rounded-md font-semibold transition-colors bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2" 
                        disabled={tabs.indexOf(activeTab) === tabs.length - 1}
                    >
                        {t.next} <FaChevronRight size={12} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SWSDetails;