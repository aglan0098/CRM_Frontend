// Complete TranslationContext.jsx - Added all missing complaint escalation translations  (Component 34)
import React, { createContext, useContext, useState, useEffect } from 'react';

// Import the centralized language utils (adjust path as needed)
import { 
  getStoredLanguage, 
  storeLanguage, 
  setupLanguageListener, 
  applyLanguageSettings,
  isRTL 
} from '../../../utils/LanguageUtils'; // Adjust path to match your structure

const TranslationContext = createContext();

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

// Complete translations dictionary with all missing complaint escalation content
const translations = {
  en: {
    // Navigation
    dashboard: "Dashboard",
    services: "Services", 
    myRequests: "My Requests", 
    account: "Account", 
    logout: "Log Out", 
    search: "Search",
    
    // Dashboard
    hi: "Hi", 
    welcomeMessage: "Saudi Water Authority Portal a seamless gateway for managing water services, offering secure and efficient digital solutions.",
    totalCases: "Total Cases", 
    open: "Open", 
    closed: "Closed", 
    pendingActions: "Pending Actions", 
    actionsRequired: "Actions Required",
    latestRequests: "Latest Requests", 
    allRequests: "All Requests", 
    requestsOverview: "Requests Overview",
    requestDetails: "Request Details",
    latestRequest: "Latest Request",
    
    // Table headers
    requestNumber: "Request Number", 
    serviceType: "Service Type", 
    requestType: "Request Type", 
    activityType: "Activity Type",
    status: "Status", 
    submissionDate: "Submission Date", 
    actions: "Actions", 
    actionRequired: "Action Required",
    resolved: "Resolved", 
    draft: "Draft", 
    viewDetails: "View Details", 
    editApplication: "Edit Application",
    Submitted: "Submitted",
    InProgress: "In Progress",
    
    // Actions
    moreInfoNeeded: "More info needed", 
    completeDetails: "Please complete the required details in",
    complaintEscalationCase: "Complaint Escalation Case", 
    processRequest: "to process your request.",
    
    // Tip banner
    tipPrefix: "Tip:", 
    tipMessage: "Report leaks promptly—a dripping tap wastes 6,000+ liters/year",
    requestWorkshop: "Request Workshop", 
    
    // User info
    individual: "Individual", 
    paginationInfo: "1-10 of 16",
    
    // Services
    additionalinformationrequest:"Additional Information Request",
    complaintsEscalation: "Complaints Escalation",
    complaintsEscalationDesc: "This service allows beneficiaries to escalate their complaints to the Authority if the complaint was closed by the service provider without resolution...",
    complaintsInquiry: "Complaints Inquiry",
    complaintsInquiryDesc: "This platform allows beneficiaries to inquire about the status and details of their water and sewage service complaints.",
    incidentReports: "Incident Reports",
    incidentReportsDesc: "This platform allows users to efficiently submit, track, and manage Citizens Violation reports, providing a centralized system for documenting...",
    incidentReportsInquiry: "Incident Reports Inquiry",
    incidentReportsInquiryDesc: "This platform allows beneficiaries to inquire about the status and details of their water and sewage service Violation Reports.",
    waterBillCalculator: "Water Bill Calculator",
    waterBillCalculatorDesc: "The Water Bill Calculator helps users estimate their water bill based on consumption, calculating costs according to usage and applicable tariffs, fa...",
    meetThePresident: "Meet the President",
    meetThePresidentDesc: "Descriptive body copy with more detailed information about the card contents...",
    nonNetworkedWaterServices: "Non-Networked Water Services License Request (Tanker)",
    nonNetworkedWaterServicesDesc: "Descriptive body copy with more detailed information about the card contents...",
    contactPresident: "Contact the President",
    contactPresidentDesc: "Enhancing communication channels with beneficiaries lies at the heart of our strategic direction. The Saudi Water Authority is committed to continually renewing and improving its communication mechanisms to listen to beneficiary feedback and address their complaints, affirming its deep commitment to their interests and rights.",
    goToService: "Go To Service",

    // Table data values
    complaintsEscalationService: "Complaints Escalation",
    generalComplaints: "General Complaints", 
    internalComplaints: "Internal Complaint",
    licenseIssuance: "License Issuance",
    waterStorage: "Water Storage",
    waterProduction: "Water Production",
    serviceRequest: "Service Request",

    // Complaint Escalation Details
    complaintEscalation: "Complaint Escalation",
    complaintInformation: "Complaint Information",
    inquiryInformation: "Inquiry Information",
    incidentInformation: "Incident Information",
    complaintNumber: "Complaint Number",
    inquiryNumber: "Inquiry Number",
    incidentNumber: "Incident Number",
    complaintReferenceId: "Complaint Reference ID",
    complaintSubject: "Complaint Subject",
    inquirySubject: "Inquiry Subject",
    incidentSubject: "Incident Subject",
    complaintDate: "Complaint Date",
    inquiryDate: "Inquiry Date",
    incidentDate: "Incident Date",
    region: "Region",
    relatedEntity: "Related Entity",
    nationalWaterCompany: "National Water Company (NWC)",
    uploadedFile: "Uploaded file",
    imagePng: "Image.png",
    waterBillPdf: "WaterBill.PDF",
    nationalIdPdf: "National ID.PDF",
    previousResponses: "Previous Responses",
    additionalInfoRequestWaterBill: "Additional Information Request : Water Bill and National ID",
    additionalInfoRequestLocation: "Additional Information Request : Provide Site Location",
    accordionSampleText: "The accordion component delivers large amounts of content in a small space through progressive disclosure. The user gets key details about the underlying content and can choose to expand that content within the constraints of the accordion.\n\nThe accordion component delivers large amounts of content in a small space through progressive disclosure. The user gets key details about the underlying content and can choose to expand that content within the constraints of the accordion.",
    additionalInfoRequestContent: "Additional information request content would go here...",
    completeRequiredDetails: "Please complete the required details below to process your request.",
    nationalId: "National ID",
    waterBill: "Water Bill",
    response: "Response",
    messagePlaceholder: "Message...",
    uploadFile: "Upload file",
    dragDropFiles: "Drag and drop files here to upload",
    fileUploadInstructions: "Maximum file size allowed is 5MB, supported file formats include .jpg, .png, and .pdf.",
    browseFiles: "Browse Files",
    declarationText: "I declare that all information provided is true and accurate, and I bear full responsibility for the accuracy of this data",
    back: "Back",
    submit: "Submit",
    saveAsDraft: "Save as Draft",
    caseResolution: "Case Resolution",
    defaultResolutionText: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in",
    pleaseCheckDeclaration: "Please check the declaration checkbox before submitting.",
    fileSizeExceeded: "File size exceeds 5MB limit. Please choose a smaller file.",
    invalidFileFormat: "Invalid file format. Please upload .jpg, .png, or .pdf files only.",
   


    'Complaint Escalation': 'Complaint Escalation',
    'Complaint Inquiry': 'Complaint Inquiry', 
    'Inquiries': 'Inquiries',
    'Internal Complaint': 'Internal Complaint',
    'General Complaint': 'General Complaint',
    'Incident Report': 'Incident Report',
    'Incident Reports': 'Incident Reports',
    'Incidents': 'Incidents',
    'Billing': 'Billing',
    'Not Specified': 'Not Specified',
    
    // Search translations
    noServicesFound: 'No services found',
    tryDifferentSearch: 'Try a different search term',
    searchResults: 'Search Results',
    servicesFound: 'services found',
    searchServices: 'Search services...',
    clearSearch: 'Clear search',
    clear: 'Clear',
    
    // Notifications
    notifications: 'Notifications',
    removeAll: 'Remove All',
    loadingNotifications: 'Loading notifications...',
    errorLoadingNotifications: 'Error loading notifications:',
    noNotificationsAvailable: 'No notifications available',
    noPreviousResponses: "No previous responses",
    
    // Notification Titles
    additionalInfoRequired: 'Additional Info Required',
    complaintResolved: 'Complaint Resolved',
    statusUpdated: 'Status Updated',
    requestUpdated: 'Request Updated',
    notificationUpdate: 'Notification Update',
    complaintUpdate: 'Complaint Update',
    requestSubmitted: 'Request Submitted',
    newNotification: 'New Notification',
    
    // Notification Messages
    yourCaseUpdated: 'Your case (Ref No: {caseNumber}) has been updated',
    yourRequest: 'Your request (Ref No: {caseNumber})',
    requireAdditionalInfo: 'Dear {userName}, we require additional information to proceed with your request (Ref No: {caseNumber}).',
    successfullyResolved: 'Dear {userName}, your case (Ref No: {caseNumber}) has been successfully closed. Thank you for contacting us.',
    statusChangedFrom: 'from',
    statusChangedTo: 'to',
    willUpdateProgress: 'We will update you as soon as there is progress.',
    underReview: 'Dear {userName}, your request (Ref No: {caseNumber}) is under review. We will update you as soon as there is progress.',
    requestReceived: 'Dear {userName}, your Complaint Escalation request (Ref No: {caseNumber}) has been received. We will keep you updated. Thank you.',
    hasBeenUpdated: 'has been updated.',
    
    // Months (short form)
    jan: 'Jan',
    feb: 'Feb',
    mar: 'Mar',
    apr: 'Apr',
    may: 'May',
    jun: 'Jun',
    jul: 'Jul',
    aug: 'Aug',
    sep: 'Sep',
    oct: 'Oct',
    nov: 'Nov',
    dec: 'Dec',
  },
  ar: {
    // Navigation
    dashboard: "لوحة التحكم",
    services: "الخدمات", 
    myRequests: "طلباتي", 
    account: "الحساب", 
    logout: "تسجيل الخروج", 
    search: "بحث",
    
    // Dashboard
    additionalinformationrequest:"طلب معلومات إضافية",
    hi: "مرحباً", 
    welcomeMessage: "بوابة الهيئة السعودية للمياه هي بوابة سلسة لإدارة خدمات المياه، تقدم حلولاً رقمية آمنة وفعالة.",
    totalCases: "إجمالي الحالات", 
    open: "مفتوح", 
    closed: "مغلق", 
    pendingActions: "الإجراءات المعلقة", 
    actionsRequired: "الإجراءات المطلوبة",
    latestRequests: "أحدث الطلبات", 
    allRequests: "جميع الطلبات", 
    requestsOverview: "نظرة عامة على الطلبات",
    requestDetails: "تفاصيل الطلب",
    latestRequest: "أحدث طلب",
    
    // Table headers
    requestNumber: "رقم الطلب", 
    serviceType: "نوع الخدمة", 
    requestType: "نوع الطلب", 
    activityType: "نوع النشاط",
    status: "الحالة", 
    submissionDate: "تاريخ التقديم", 
    actions: "الإجراءات", 
    actionRequired: "إجراء مطلوب",
    resolved: "تم الحل", 
    draft: "مسودة", 
    viewDetails: "عرض التفاصيل", 
    editApplication: "تعديل الطلب",
    Submitted: "تم التقديم",
    InProgress: "قيدالمعالجة",
    
    // Actions
    moreInfoNeeded: "مطلوب معلومات إضافية", 
    completeDetails: "يرجى إكمال التفاصيل المطلوبة في",
    complaintEscalationCase: "حالة تصعيد الشكوى", 
    processRequest: "لمعالجة طلبك.",
    
    // Tip banner
    tipPrefix: "نصيحة:", 
    tipMessage: "أبلغ عن التسريبات فوراً - الصنبور المتسرب يهدر أكثر من 6000 لتر/سنة",
    requestWorkshop: "طلب ورشة عمل", 
    
    // User info
    individual: "أفراد", 
    paginationInfo: "1-10 من 16",
    
    // Services
    complaintsEscalation: "تصعيد الشكاوى",
    complaintsEscalationDesc: "تتيح هذه الخدمة للمستفيدين تصعيد شكاواهم إلى الهيئة إذا تم إغلاق الشكوى من قبل مقدم الخدمة دون حل...",
    complaintsInquiry: "الاستعلام عن الشكاوى",
    complaintsInquiryDesc: "تتيح هذه المنصة للمستفيدين الاستعلام عن حالة وتفاصيل شكاوى خدمات المياه والصرف الصحي.",
    incidentReports: "تقارير الحوادث",
    incidentReportsDesc: "تتيح هذه المنصة للمستخدمين تقديم وتتبع وإدارة تقارير مخالفات المواطنين بكفاءة، مما يوفر نظاماً مركزياً لتوثيق...",
    incidentReportsInquiry: "الاستعلام عن تقارير الحوادث",
    incidentReportsInquiryDesc: "تتيح هذه المنصة للمستفيدين الاستعلام عن حالة وتفاصيل تقارير مخالفات خدمات المياه والصرف الصحي.",
    waterBillCalculator: "حاسبة فاتورة المياه",
    waterBillCalculatorDesc: "تساعد حاسبة فاتورة المياه المستخدمين في تقدير فاتورة المياه بناءً على الاستهلاك، وحساب التكاليف وفقاً للاستخدام والتعريفات المطبقة...",
    meetThePresident: "لقاء مع الرئيس",
    meetThePresidentDesc: "نص وصفي مع معلومات أكثر تفصيلاً حول محتويات البطاقة...",
    nonNetworkedWaterServices: "طلب ترخيص خدمات المياه غير المشبوكة (صهريج)",
    nonNetworkedWaterServicesDesc: "نص وصفي مع معلومات أكثر تفصيلاً حول محتويات البطاقة...",
    contactPresident: "تواصل مع الرئيس",
    contactPresidentDesc: "تعزيز سُبل التواصل مع المستفيدين من صميم توجهاتنا الإستراتيجية؛ حيث تحرص الهيئة السعودية للمياه على تجديد وتحسين آليات التواصل للاستماع إلى آراء المستفيدين والعمل على حل شكاواهم، تأكيدًا للالتزام والاهتمام الراسخ بمصالحهم وحقوقهم.",
    goToService: "الذهاب للخدمة",

    // Table data values
    complaintsEscalationService: "تصعيد الشكاوى",
    generalComplaints: "الشكاوى العامة",
    internalComplaints: "شكوى عامة",
    licenseIssuance: "إصدار التراخيص", 
    waterStorage: "تخزين المياه",
    waterProduction: "إنتاج المياه",
    serviceRequest: "طلب خدمة",

    // Complaint Escalation Details
    complaintEscalation: "تصعيد الشكوى",
    complaintInformation: "معلومات الشكوى",
    inquiryInformation: "معلومات الاستعلام",
    incidentInformation: "معلومات البلاغ",
    complaintNumber: "رقم الشكوى",
    inquiryNumber: "رقم الاستعلام",
    incidentNumber: "رقم البلاغ",
    complaintReferenceId: "الرقم المرجعي للشكوى",
    complaintSubject: "موضوع الشكوى",
    inquirySubject: "موضوع الاستعلام",
    incidentSubject: "موضوع البلاغ",
    complaintDate: "تاريخ الشكوى",
    inquiryDate: "تاريخ الاستعلام",
    incidentDate: "تاريخ البلاغ",
    region: "المنطقة",
    relatedEntity: "الجهة ذات العلاقة",
    nationalWaterCompany: "الشركة الوطنية للمياه",
    uploadedFile: "الملف المرفوع",
    imagePng: "صورة.png",
    waterBillPdf: "فاتورة_المياه.PDF",
    nationalIdPdf: "الهوية_الوطنية.PDF",
    previousResponses: "الردود السابقة",
    additionalInfoRequestWaterBill: "طلب معلومات إضافية: فاتورة المياه والهوية الوطنية",
    additionalInfoRequestLocation: "طلب معلومات إضافية: تحديد موقع الموقع",
    accordionSampleText: "يقدم مكون الأكورديون كميات كبيرة من المحتوى في مساحة صغيرة من خلال الكشف التدريجي. يحصل المستخدم على تفاصيل مهمة حول المحتوى الأساسي ويمكنه اختيار توسيع هذا المحتوى ضمن قيود الأكورديون.\n\nيقدم مكون الأكورديون كميات كبيرة من المحتوى في مساحة صغيرة من خلال الكشف التدريجي. يحصل المستخدم على تفاصيل مهمة حول المحتوى الأساسي ويمكنه اختيار توسيع هذا المحتوى ضمن قيود الأكورديون.",
    additionalInfoRequestContent: "محتوى طلب المعلومات الإضافية سيظهر هنا...",
    completeRequiredDetails: "يرجى إكمال التفاصيل المطلوبة أدناه لمعالجة طلبك.",
    nationalId: "الهوية الوطنية",
    waterBill: "فاتورة المياه",
    response: "الرد",
    messagePlaceholder: "الرسالة...",
    uploadFile: "رفع ملف",
    dragDropFiles: "اسحب وأفلت الملفات هنا للرفع",
    fileUploadInstructions: "الحد الأقصى لحجم الملف المسموح به هو 5 ميجابايت، وتشمل صيغ الملفات المدعومة .jpg و .png و .pdf.",
    browseFiles: "تصفح الملفات",
    declarationText: "أقر بأن جميع المعلومات المقدمة صحيحة ودقيقة، وأتحمل المسؤولية الكاملة عن دقة هذه البيانات",
    back: "رجوع",
    submit: "إرسال",
    saveAsDraft: "حفظ كمسودة",
    caseResolution: "حل الحالة",
    defaultResolutionText: "لوريم إيبسوم هو ببساطة نص وهمي من صناعة الطباعة والتنضيد. لقد كان لوريم إيبسوم النص الوهمي المعياري في الصناعة منذ القرن الخامس عشر، عندما أخذت طابعة غير معروفة مجموعة من النوع وخلطتها لصنع كتاب عينة من النوع. لقد نجا ليس فقط خمسة قرون، ولكن أيضًا القفزة إلى التنضيد الإلكتروني، وبقي دون تغيير جوهري. تم نشره في",
    pleaseCheckDeclaration: "يرجى تحديد مربع الإقرار قبل الإرسال.",
    fileSizeExceeded: "يتجاوز حجم الملف الحد المسموح به وهو 5 ميجابايت. يرجى اختيار ملف أصغر.",
    invalidFileFormat: "صيغة الملف غير صالحة. يرجى رفع ملفات .jpg أو .png أو .pdf فقط.",

    'Complaint Escalation': 'تصعيد الشكوى',
    'Complaint Inquiry': 'الاستعلام عن الشكوى',
    'Inquiries': 'الاستعلامات',
    'Internal Complaint': 'شكوى عامة',
    'General Complaint': 'شكوى عامة',
    'Incident Report': 'بلاغ',
    'Incident Reports': 'البلاغات',
    'Incidents': 'البلاغات',
    'Billing': 'الفوترة', 
    'Not Specified': 'غير محدد',
    
    // Search translations
    noServicesFound: 'لم يتم العثور على خدمات',
    tryDifferentSearch: 'جرب مصطلح بحث مختلف',
    searchResults: 'نتائج البحث',
    servicesFound: 'خدمة موجودة',
    searchServices: 'البحث في الخدمات...',
    clearSearch: 'مسح البحث',
    clear: 'مسح',
    
    // Notifications
    notifications: 'الإشعارات',
    removeAll: 'إزالة الكل',
    loadingNotifications: 'جاري تحميل الإشعارات...',
    errorLoadingNotifications: 'خطأ في تحميل الإشعارات:',
    noNotificationsAvailable: 'لا توجد إشعارات متاحة',

    noPreviousResponses: "لا توجد ردود سابقة",
    
    // Notification Titles
    additionalInfoRequired: 'معلومات إضافية مطلوبة',
    complaintResolved: 'تم حل الشكوى',
    statusUpdated: 'تم تحديث الحالة',
    requestUpdated: 'تم تحديث الطلب',
    notificationUpdate: 'تحديث الإشعار',
    complaintUpdate: 'تحديث الشكوى',
    requestSubmitted: 'تم تقديم الطلب',
    newNotification: 'إشعار جديد',
    
    // Notification Messages
    yourCaseUpdated: 'تم تحديث حالتك (الرقم المرجعي: {caseNumber})',
    yourRequest: 'طلبك (الرقم المرجعي: {caseNumber})',
    requireAdditionalInfo: 'عزيزي {userName}، نحتاج إلى معلومات إضافية للمتابعة في طلبك (الرقم المرجعي: {caseNumber}).',
    successfullyResolved: 'عزيزي {userName}، تم إغلاق حالتك (الرقم المرجعي: {caseNumber}) بنجاح. شكراً لتواصلك معنا.',
    statusChangedFrom: 'من',
    statusChangedTo: 'إلى',
    willUpdateProgress: 'سنقوم بتحديثك بمجرد حدوث تقدم.',
    underReview: 'عزيزي {userName}، طلبك (الرقم المرجعي: {caseNumber}) قيد المراجعة. سنقوم بتحديثك بمجرد حدوث تقدم.',
    requestReceived: 'عزيزي {userName}، تم استلام طلب تصعيد الشكوى الخاص بك (الرقم المرجعي: {caseNumber}). سنبقيك على اطلاع. شكراً لك.',
    hasBeenUpdated: 'تم تحديثه.',
    
    // Months (short form)
    jan: 'يناير',
    feb: 'فبراير',
    mar: 'مارس',
    apr: 'أبريل',
    may: 'مايو',
    jun: 'يونيو',
    jul: 'يوليو',
    aug: 'أغسطس',
    sep: 'سبتمبر',
    oct: 'أكتوبر',
    nov: 'نوفمبر',
    dec: 'ديسمبر',
  }
};

export const TranslationProvider = ({ children }) => {
  // Use centralized language system instead of local state
  const [language, setLanguage] = useState(() => getStoredLanguage());
  const [isRTLMode, setIsRTLMode] = useState(() => isRTL(getStoredLanguage()));

  // Set up language change listener using centralized system
  useEffect(() => {
    const cleanup = setupLanguageListener((newLanguage) => {
      setLanguage(newLanguage);
      setIsRTLMode(isRTL(newLanguage));
      console.log(`Dashboard: Language changed to ${newLanguage} via centralized system`);
    });

    // Apply language settings on mount
    applyLanguageSettings(language);

    return cleanup;
  }, []);

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'ar' : 'en';
    
    // Use centralized storage - this will trigger the listener above
    storeLanguage(newLanguage);
    
    // Apply language settings immediately
    applyLanguageSettings(newLanguage);
    
    console.log(`Dashboard: Language toggled to ${newLanguage} using centralized system`);
  };

  const t = (key) => {
    if (!key) return key;
    const translation = translations[language]?.[key];
    // Debug for Inquiries specifically
    if (key === 'Inquiries') {
      console.log('TranslationContext - t("Inquiries") called');
      console.log('Language:', language);
      console.log('translations[language]:', translations[language]);
      console.log('translations[language][key]:', translations[language]?.[key]);
      console.log('Returning:', translation || key);
    }
    return translation || key;
  };

  return (
    <TranslationContext.Provider value={{ 
      language, 
      isRTL: isRTLMode, 
      toggleLanguage, 
      t 
    }}>
      {children}
    </TranslationContext.Provider>
  );
};
