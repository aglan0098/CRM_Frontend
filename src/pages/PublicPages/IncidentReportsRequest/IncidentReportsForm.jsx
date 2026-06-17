import React, { useState, useEffect, useRef } from 'react';
import { Upload, MapPin, ArrowRight, ArrowLeft, X, CheckCircle, Loader2 } from 'lucide-react';
import config from '@/utils/config';

// Cities grouped by Saudi region ISO code (ISO 3166-2:SA)
const CITIES_BY_REGION = {
  'SA-01': {
    ar: [
      'الدلم', 'عفيف', 'الافلاج', 'الغاط', 'الخرج', 'المجمعة',
      'القويعية', 'السليل', 'الحريق', 'الرين', 'الدوادمي',
      'ضرماء', 'الدرعية', 'حرمة', 'حوطة سدير', 'حوطة بني تميم',
      'حريملاء', 'مرات', 'المزاحمية', 'رماح', 'الرياض',
      'شقراء', 'ثادق', 'وادي الدواسر', 'الزلفي'
    ],
    en: [
      'Ad-Dilam', 'Afif', 'Al Aflaj', 'Al Ghat', 'Al Kharj',
      "Al Majma'ah", 'Al Quwaiiyah', 'As Sulayyil', 'Al-Hareeq',
      'Ar Rayn', 'Dawadmi', 'Dhurma', 'Diriyah', 'Harmah',
      'Hautat Sudair', 'Hotat Bani Tamim', 'Huraymila',
      'Marat', 'Muzahmiyya', 'Rimah', 'Riyadh',
      'Shaqra', 'Thadiq', 'Wadi Al-Dawaser', 'Zulfi'
    ]
  },

  'SA-02': {
    ar: [
      'أضم', 'الجموم', 'الكامل', 'جدة', 'الخرمة',
      'الليث', 'المويه', 'القنفذة', 'العرضيات', 'بحره',
      'خليص', 'مدينة الملك عبدالله الاقتصادية', 'ميسان',
      'مكة المكرمة', 'رابغ', 'رنيه', 'الطائف', 'تربة'
    ],
    en: [
      'Adham', 'Al Jumum', 'Al Kamil', 'Jeddah',
      'Al Khurma', 'Al Lith', 'Al Muwayh', 'Al Qunfudhah',
      'Ardiyat', 'Bahrah', 'Khulais',
      'King Abdullah Economic City', 'Maysan',
      'Mecca', 'Rabigh', 'Ranyah', 'Taif', 'Turbah'
    ]
  },

  'SA-03': {
    ar: [
      'العيص', 'الحناكية', 'المهد', 'العلا',
      'بدر', 'خيبر', 'المدينة المنورة',
      'وادي الفرع', 'ينبع'
    ],
    en: [
      'Al Ais', 'Al Hanakiyah', 'Al Mahd', 'Al-Ula',
      'Badr', 'Khaybar', 'Medina',
      "Wadi Al Fora'a", 'Yanbu'
    ]
  },

  'SA-04': {
    ar: [
      'بقيق', 'الاحساء', 'العديد', 'البيضاء',
      'الدمام', 'حفر الباطن', 'الخفجي',
      'الخبر', 'النعيرية', 'قرية العليا',
      'القطيف', 'رأس تنورة', 'الجبيل'
    ],
    en: [
      'Abqaiq', 'Al-Ahsa', "Alo'daid", 'Baithah',
      'Dammam', 'Hafr Al-Batin', 'Khafji',
      'Khobar', 'Nairyah', 'Qaryat Al Olaya',
      'Qatif', 'Ras Tanura', 'Jubail'
    ]
  },

  'SA-05': {
    ar: [
      'أبانات', 'الأسياح', 'البدائع', 'البكيرية',
      'المذنب', 'النبهانية', 'الرس', 'الشماسية',
      'بريدة', 'ضرية', 'رياض الخبراء',
      'عقلة الصقور', 'عنيزة', 'عيون الجواء'
    ],
    en: [
      'Abanat', 'Al Asyah', 'Al Badaya',
      'Al Bukayriyah', 'Al Midhnab',
      'An Nabhaniyah', 'Ar Rass',
      'Ash Shimasiyah', 'Buraydah',
      'Dariyah', 'Riyadh Al Khabra',
      'Uglat Asugoor', 'Unaizah',
      'Uyun Al Jawa'
    ]
  },

  'SA-06': {
    ar: [
      'الحائط', 'الغزالة', 'السليمي',
      'الشملي', 'الشنان', 'بقعاء',
      'حائل', 'موقق', 'سميراء'
    ],
    en: [
      'Al Hait', 'Al-Ghazalah',
      'As Sulaymi', 'Ash Shamli',
      'Ash Shinan', 'Baqa',
      "Ha'il", 'Moqaq', 'Samra'
    ]
  },

  'SA-07': {
    ar: [
      'البدع', 'الوجه', 'أملج',
      'تبوك', 'تيماء', 'حقل', 'ضباء'
    ],
    en: [
      'Al Bada', 'Al Wajh', 'Umluj',
      'Tabuk', 'Tayma', 'Haql', 'Duba'
    ]
  },

  'SA-08': {
    ar: [
      'العويقيلة', 'عرعر',
      'رفحاء', 'طريف'
    ],
    en: [
      'Al Uwayqilah',
      'Arar',
      'Rafha',
      'Turaif'
    ]
  },

  'SA-09': {
    ar: [
      'أبو عريش', 'أحد المسارحة', 'العارضة',
      'العيدابي', 'الدائر', 'الدرب',
      'الحرث', 'الريث', 'الطوال',
      'جازان', 'بيش', 'ضمد',
      'صامطة', 'صبياء',
      'فرسان', 'فيفا', 'هروب'
    ],
    en: [
      'Abu Arish', 'Ahad Al Masarihah',
      'Al Aridah', 'Al Aydabi',
      'Al Dayer', 'Al-Darb',
      'Al-Harth', 'Al Reeth',
      'Al Tuwal', 'Jizan',
      'Baysh', 'Damad',
      'Samta', 'Sabya',
      'Farasan Islands', 'Faifa',
      'Haroub'
    ]
  },

  'SA-10': {
    ar: [
      'بدر الجنوب', 'حبونا',
      'خباش', 'شرورة',
      'ثار', 'يدمة'
    ],
    en: [
      'Badr Al Janub',
      'Hubuna',
      'Khubash',
      'Sharurah',
      'Thar',
      'Yadmah'
    ]
  },

  'SA-11': {
    ar: [
      'العقيق', 'الباحة', 'الحجرة',
      'القرى', 'المخواة', 'المندق',
      'بني حسن', 'بالجرشي',
      'غامد الزناد', 'قلوه'
    ],
    en: [
      'Al Aqiq', 'Al Bahah',
      'Al Hujrah', 'Al Qura',
      'Al Makhwah', 'Al Mandaq',
      'Bani Hassan', 'Baljurashi',
      'Ghamid Al-Zinad', 'Qilwah'
    ]
  },

  'SA-12': {
    ar: [
      'القريات', 'الجندل',
      'سكاكا', 'صوير',
      'طبرجل'
    ],
    en: [
      'Qurayyat',
      'Dumat Al-Jandal',
      'Sakaka',
      'Suwayr',
      'Tabarjal'
    ]
  },

  'SA-14': {
    ar: [
      'ابها', 'أحد رفيدة', 'الأمواه',
      'البرك', 'الحرجة', 'الفرشة',
      'المجاردة', 'النماص',
      'بارق', 'بلقرن', 'بيشة',
      'تنومة', 'تثليث', 'رجال ألمع',
      'سراة عبيدة', 'طريب',
      'ظهران الجنوب', 'محايل',
      'خميس مشيط'
    ],
    en: [
      'Abha', 'Ahad Rufaida',
      'Al-Amwah', 'Al-Birk',
      'Al-Harajah', 'Al-Farshah',
      'Al-Majardah', 'Al-Namas',
      'Bareq', 'Balqarn',
      'Bisha', 'Tanuma',
      'Tathlith', 'Rijal Almaa',
      'Sarat Abidah', 'Tareeb',
      'Dharan Al Janub',
      'Mahayil',
      'Khamis Mushait'
    ]
  }
};

// Helper: get Nafath JWT token stored after successful Nafath verification
const getNafathToken = () => sessionStorage.getItem('nafath_jwt_token') || '';

// Helper: build auth headers, injecting the Nafath Bearer token when available
const authHeaders = (extra = {}) => {
  const token = getNafathToken();
  return {
    ...extra,
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const IncidentReportsForm = ({ language = 'ar', nafathData }) => {
  const isRtl = language === 'ar';
  const [currentStep, setCurrentStep] = useState(1);
  const topRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start'});
    }, 100);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const [mobileNumber, setMobileNumber] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  // Requester info
  const [REQUESTER_FIRSTNAME, setREQUESTER_FIRSTNAME] = useState('');
  const [REQUESTER_LASTNAME, setREQUESTER_LASTNAME] = useState('');
  const [REQUESTER_NATIONAL_ID, setREQUESTER_NATIONAL_ID] = useState('');

  useEffect(() => {
    if (nafathData?.person) {
      setREQUESTER_FIRSTNAME(isRtl ? nafathData.person.arFirst : nafathData.person.enFirst);
      setREQUESTER_LASTNAME(isRtl ? nafathData.person.arFamily : nafathData.person.enFamily);
      setREQUESTER_NATIONAL_ID(nafathData.nationalId || nafathData.person.id?.toString() || '');
    }
  }, [nafathData, isRtl]);

  // Contact creation state
  const [contactId, setContactId] = useState('');
  const [contactCreating, setContactCreating] = useState(false);
  const [contactError, setContactError] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(115); // 01:55
  const otpInputRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
  const [otpSending, setOtpSending] = useState(false);
  const [mobileError, setMobileError] = useState('');
  // OTP rate-limit: track number of send attempts and lock after max
  const OTP_MAX_ATTEMPTS = 3;
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [otpLocked, setOtpLocked] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapCoords, setMapCoords] = useState({ lat: 24.7136, lng: 46.6753 }); // Default: Riyadh
  const [mapLoading, setMapLoading] = useState(false);
  const [locationData, setLocationData] = useState({
    addressDesc: '',
    governorate: '',
    city: '',
    district: '',
    street: '',
    postalCode: '',
    regionCode: ''
  });
  const [reportData, setReportData] = useState({
    reportType: '',
    reportClass: '',
    caseDescription: ''
  });
  // Each entry: { id, file, name, status: 'uploading'|'done'|'error', url, errorMsg }
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Step 3 — dynamic categories & sub-categories
  const [reportCategories, setReportCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [subCategories, setSubCategories] = useState([]);
  const [subCategoriesLoading, setSubCategoriesLoading] = useState(false);
  const CASE_TYPE_ID = '35560E9C-BE3B-F111-957B-962697B5F82B';

  // Step 4 — form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitToast, setSubmitToast] = useState(null); // { type: 'success'|'error', msg }

  const showToast = (type, msg) => {
    setSubmitToast({ type, msg });
    setTimeout(() => setSubmitToast(null), 5000);
  };

  useEffect(() => {
    let interval = null;
    if (showOtpPopup && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (!showOtpPopup) {
      setTimer(115); // reset timer when popup closes
    }
    return () => clearInterval(interval);
  }, [showOtpPopup, timer]);

  // Fetch report categories — only after Nafath verification (token is available)
  useEffect(() => {
    if (!nafathData) return; // wait for token before making authenticated requests
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const res = await fetch(
          `${config.API_BASE_URL}/api/integration/categories`,
          { headers: authHeaders() }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setReportCategories(data.value || []);
      } catch (err) {
        console.error('Failed to fetch report categories:', err);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, [nafathData]);

  // Listen for postMessage from the map iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'MAP_LOCATION_SELECTED') {
        setMapCoords({ lat: event.data.lat, lng: event.data.lng });
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const formatTimer = () => {
    const m = Math.floor(timer / 60).toString().padStart(2, '0');
    const s = (timer % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Translations
  const t = {
    ar: {
      breadcrumb: 'الخدمات الإلكترونية > خدمات الهيئة > خدمة تقديم البلاغات',
      title: 'خدمة تقديم البلاغات',
      description: 'تتيح هذه الخدمة تقديم بلاغات عن تسرب المياه، وطفوحات الصرف الصحي من المباني؛ للمحافظة على الموارد المائية والبيئة.',
      steps: [
        'إدخال بيانات الطلب',
        'إدخال معلومات الموقع',
        'إدخال تفاصيل البلاغ',
        'تقديم الطلب'
      ],
      step1Title: 'معلومات طالب الخدمة',
      firstName: 'الاسم الأول',
      lastName: 'الاسم الأخير',
      idNumber: 'رقم الهوية / الإقامة',
      mobileNumber: 'رقم الجوال',
      mobilePlaceholder: '05XXXXXXXX',
      verifyMobile: 'تحقق من رقم الجوال',
      step2Title: 'معلومات الموقع',
      violationAddress: 'عنوان البلاغ',
      addressDesc: 'وصف العنوان',
      addressDescPlaceholder: 'مثال : الرياض حي العليا',
      selectFromMap: 'تحديد العنوان من الخريطة',
      governorate: 'محافظة',
      selectGovernorate: 'اختر محافظة',
      city: 'مدينة',
      selectCity: 'اختر المدينة',
      district: 'الحي',
      street: 'الشارع',
      postalCode: 'الرمز البريدي',
      step3Title: 'تفاصيل البلاغ',
      reportType: 'نوع البلاغ',
      selectReportType: 'اختر نوع البلاغ',
      reportClass: 'تصنيف البلاغ',
      selectReportClass: 'اختر نوع تصنيف البلاغ',
      caseDescription: 'وصف البلاغ',
      caseDescriptionPlaceholder: 'أدخل وصف البلاغ',
      reportImage: 'صورة البلاغ',
      dragDropFiles: 'اسحب و أفلت الملفات هنا للرفع',
      fileSizeLimit: 'الحد الأقصى للملفات هو 5، حجم كل ملف 10 ميجابايت',
      browseFiles: 'تصفح الملفات',
      maxFilesReached: 'لا يمكنك رفع أكثر من 5 ملفات.',
      maxFilesSelected: (n) => `تم اختيار أول ${n} ملف/ملفات للوصول للحد الأقصى (5 ملفات).`,
      step4Title: 'الإقرار',
      acknowledgmentText: 'أقر بأن جميع المعلومات الواردة صحيحة ودقيقة، وأتحمل كامل المسؤولية عن صحة هذه البيانات',
      next: 'التالي',
      previous: 'السابق',
      submit: 'إرسال الطلب',
      otpTitle: 'التحقق من رقم الجوال',
      otpSubtitle: 'الرجاء ادخال رمز التحقق المرسل الى',
      resendAfter: 'يمكنك طلب رمز تحقق جديد بعد',
      verify: 'تحقق',
      resendCode: 'اعادة ارسال الرمز',
      timerUnit: 'ق',
      mapPopupTitle: 'تحديد الموقع على الخريطة',
      confirmLocation: 'تأكيد الموقع',
      riyadhRegion: 'منطقة الرياض',
      riyadhCity: 'الرياض',
      makkahRegion: 'منطقة مكة المكرمة',
      easternRegion: 'المنطقة الشرقية',
      mobileInvalid: 'رقم الجوال يجب أن يكون 10 أرقام ويبدأ بـ 05',
      otpSendFailed: 'فشل في إرسال رمز التحقق. يرجى المحاولة مرة أخرى.',
      sending: 'جاري الإرسال...',
      otpMaxAttemptsReached: 'لقد تجاوزت الحد الأقصى لعدد محاولات إرسال رمز التحقق. يرجى المحاولة لاحقاً.',
      otpAttemptsLeft: (n) => `تبقى لك ${n} محاولة/محاولات.`,
      noCitiesFound: 'لا توجد مدن متاحة لهذه المنطقة'
    },
    en: {
      breadcrumb: 'E-Services > Authority Services > Incident Reporting Service',
      title: 'Incident Reporting Service',
      description: 'This service allows submitting reports about water leaks and sewage overflows from buildings; to preserve water resources and the environment.',
      steps: [
        'Enter request data',
        'Enter location information',
        'Enter report details',
        'Submit request'
      ],
      step1Title: 'Requester Information',
      firstName: 'First Name',
      lastName: 'Last Name',
      idNumber: 'ID / Iqama Number',
      mobileNumber: 'Mobile Number',
      mobilePlaceholder: '05XXXXXXXX',
      verifyMobile: 'Verify Mobile Number',
      step2Title: 'Location Information',
      violationAddress: 'Incident Address',
      addressDesc: 'Address Description',
      addressDescPlaceholder: 'Example: Riyadh Olaya District',
      selectFromMap: 'Select Address from Map',
      governorate: 'Governorate',
      selectGovernorate: 'Select Governorate',
      city: 'City',
      selectCity: 'Select City',
      district: 'District',
      street: 'Street',
      postalCode: 'Postal Code',
      step3Title: 'Report Details',
      reportType: 'Report Type',
      selectReportType: 'Select Report Type',
      reportClass: 'Report Classification',
      selectReportClass: 'Select Report Classification',
      caseDescription: 'Report Description',
      caseDescriptionPlaceholder: 'Enter report description',
      reportImage: 'Report Image',
      dragDropFiles: 'Drag and drop files here to upload',
      fileSizeLimit: 'Maximum 5 files allowed, 10MB each',
      browseFiles: 'Browse Files',
      maxFilesReached: 'You cannot upload more than 5 files.',
      maxFilesSelected: (n) => `Only the first ${n} file(s) were selected to reach the maximum limit (5 files).`,
      step4Title: 'Acknowledgment',
      acknowledgmentText: 'I acknowledge that all the information provided is correct and accurate, and I bear full responsibility for the validity of this data',
      next: 'Next',
      previous: 'Previous',
      submit: 'Submit Request',
      otpTitle: 'Verify Mobile Number',
      otpSubtitle: 'Please enter the verification code sent to',
      resendAfter: 'You can request a new verification code after',
      verify: 'Verify',
      resendCode: 'Resend Code',
      timerUnit: 'm',
      mapPopupTitle: 'Select Location on Map',
      confirmLocation: 'Confirm Location',
      riyadhRegion: 'Riyadh Region',
      riyadhCity: 'Riyadh',
      makkahRegion: 'Makkah Region',
      mobileInvalid: 'Mobile number must be 10 digits and start with 05',
      otpSendFailed: 'Failed to send OTP. Please try again.',
      sending: 'Sending...',
      otpMaxAttemptsReached: 'You have exceeded the maximum number of OTP send attempts. Please try again later.',
      otpAttemptsLeft: (n) => `You have ${n} attempt(s) remaining.`,
      easternRegion: 'Eastern Region',
      noCitiesFound: 'No cities available for this region'
    }
  };

  const texts = t[language];

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // ============= step 1 =============
  // Validate mobile: 10 digits, starts with 05
  const isMobileValid = /^05\d{8}$/.test(mobileNumber);

  // Step validation
  const isStep2Valid = locationData.governorate.trim() !== '' && locationData.city.trim() !== '';
  const isStep3Valid =
    reportData.reportType.trim() !== '' &&
    reportData.reportClass.trim() !== '' &&
    reportData.caseDescription.trim() !== '' &&
    uploadedFiles.some(f => f.status === 'done');

  const handleMobileChange = (e) => {
    // Only allow digits, max 10 chars
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setMobileNumber(value);
    setMobileError('');
  };

  const handleVerifyClick = async () => {
    if (isVerified) {
      handleNext();
      return;
    }

    if (!isMobileValid) {
      setMobileError(texts.mobileInvalid);
      return;
    }

    // Frontend rate-limit guard
    if (otpLocked) {
      setMobileError(texts.otpMaxAttemptsReached);
      return;
    }

    // Call send-otp API
    setOtpSending(true);
    setMobileError('');
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/integration/send-otp`, {
        method: 'POST',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ phoneNumber: mobileNumber })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      // Increment attempt counter
      const newAttempts = otpAttempts + 1;
      setOtpAttempts(newAttempts);
      if (newAttempts >= OTP_MAX_ATTEMPTS) {
        setOtpLocked(true);
      }

      // OTP sent successfully — open the popup
      setOtp(['', '', '', '', '', '']);
      setTimer(115);
      setShowOtpPopup(true);
    } catch (error) {
      console.error('Send OTP failed:', error);
      setMobileError(texts.otpSendFailed);
    } finally {
      setOtpSending(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Focus next input if value is entered
    if (value !== '' && index < 5) {
      otpInputRefs[index + 1].current.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs[index - 1].current.focus();
    }
  };

  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpError, setOtpError] = useState('');

  const handleOtpSubmit = async () => {
    if (!otp.every(digit => digit !== '')) return;

    setOtpVerifying(true);
    setOtpError('');
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/integration/verify-otp`, {
        method: 'POST',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          phoneNumber: mobileNumber,
          otp: otp.join('')
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.success === false) {
        throw new Error(data.message || 'Invalid OTP');
      }

      // OTP verified successfully — close popup then create contact
      setIsVerified(true);
      setShowOtpPopup(false);
      createContact();
    } catch (error) {
      console.error('OTP verification failed:', error);
      setOtpError(isRtl ? 'رمز التحقق غير صحيح. يرجى المحاولة مرة أخرى.' : 'Invalid verification code. Please try again.');
      setOtp(['', '', '', '', '', '']);
      if (otpInputRefs[0]?.current) otpInputRefs[0].current.focus();
    } finally {
      setOtpVerifying(false);
    }
  };

  // Create contact after OTP verification
  const createContact = async () => {
    setContactCreating(true);
    setContactError('');
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/integration/contacts`, {
        method: 'POST',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          firstname: REQUESTER_FIRSTNAME,
          lastname: REQUESTER_LASTNAME,
          swa_nationalid: REQUESTER_NATIONAL_ID,
          mobilephone: mobileNumber
        })
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      if (!data.success || !data.contactId) {
        throw new Error(data.message || 'Contact creation failed');
      }

      setContactId(data.contactId);
    } catch (error) {
      console.error('Create contact failed:', error);
      setContactError(
        isRtl
          ? 'حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.'
          : 'An error occurred while creating the account. Please try again.'
      );
    } finally {
      setContactCreating(false);
    }
  };


  // =========== Step 2  ===========  
  const handleConfirmLocation = async () => {
    setMapLoading(true);
    try {
      const lang = isRtl ? 'ar' : 'en';
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${mapCoords.lat}&lon=${mapCoords.lng}&addressdetails=1&accept-language=${lang}`
      );
      const data = await res.json();
      const addr = data.address || {};

      setLocationData({
        addressDesc: data.display_name || '',
        governorate: addr.state || addr.region || '',
        city: addr.city || addr.town || addr.village || '',
        district: addr.suburb || addr.neighbourhood || addr.quarter || '',
        street: addr.road || '',
        postalCode: addr.postcode || '',
        regionCode: addr['ISO3166-2-lvl4'] || ''
      });
    } catch (err) {
      console.error('Reverse geocoding failed:', err);
      setLocationData({
        addressDesc: `${mapCoords.lat.toFixed(6)}, ${mapCoords.lng.toFixed(6)}`,
        governorate: '', city: '', district: '', street: '', postalCode: '', regionCode: ''
      });
    } finally {
      setMapLoading(false);
      setShowMapModal(false);
    }
  };

  const openMapModal = () => {
    // Try to get user's current location before opening the map
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
          setShowMapModal(true);
        },
        () => {
          // Permission denied or error — use default (Riyadh)
          setShowMapModal(true);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setShowMapModal(true);
    }
  };

  // ============= step 3 =============
  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setLocationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const fetchSubCategories = async (categoryId) => {
    if (!categoryId) {
      setSubCategories([]);
      return;
    }
    setSubCategoriesLoading(true);
    try {
      const res = await fetch(
        `${config.API_BASE_URL}/api/integration/subcategories/${categoryId}`,
        { headers: authHeaders() }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setSubCategories(data.value || []);
    } catch (err) {
      console.error('Failed to fetch sub-categories:', err);
      setSubCategories([]);
    } finally {
      setSubCategoriesLoading(false);
    }
  };

  const handleReportChange = (e) => {
    const { name, value } = e.target;
    if (name === 'reportType') {
      // Reset sub-category selection and fetch new ones
      setReportData(prev => ({ ...prev, reportType: value, reportClass: '' }));
      fetchSubCategories(value);
    } else {
      setReportData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const uploadFilePipeline = async (fileEntry) => {
    const { id, file } = fileEntry;

    const setStatus = (patch) =>
      setUploadedFiles(prev =>
        prev.map(f => (f.id === id ? { ...f, ...patch } : f))
      );

    // ── Step 1: Virus scan ──────────────────────────────────────────────
    try {
      const scanForm = new FormData();
      scanForm.append('file', file);
      const scanRes = await fetch(`${config.API_BASE_URL}/virus-scanclam`, {
        method: 'POST',
        headers: authHeaders(),
        body: scanForm
      });
      if (!scanRes.ok) throw new Error(`Scan HTTP ${scanRes.status}`);
      const scanData = await scanRes.json();
      if (!scanData.success || !scanData.scanResult?.isClean) {
        throw new Error(
          isRtl ? 'الملف يحتوي على فيروس أو لم يجتز الفحص' : 'File failed virus scan'
        );
      }
    } catch (err) {
      setStatus({ status: 'error', errorMsg: err.message });
      return;
    }

    // ── Step 2: Upload to bucket ────────────────────────────────────────
    try {
      const uploadForm = new FormData();
      uploadForm.append('file', file);
      uploadForm.append('bucketType', 'cust');
      const uploadRes = await fetch(`${config.API_BASE_URL}/upload`, {
        method: 'POST',
        headers: authHeaders(),
        body: uploadForm
      });
      if (!uploadRes.ok) throw new Error(`Upload HTTP ${uploadRes.status}`);
      const uploadData = await uploadRes.json();
      setStatus({ status: 'done', url: uploadData.url });
    } catch (err) {
      setStatus({ status: 'error', errorMsg: isRtl ? 'فشل رفع الملف' : 'Upload failed' });
    }
  };

  const handleFileUpload = (e) => {
    const picked = Array.from(e.target.files);
    // Reset input so same file can be re-picked after removal
    e.target.value = '';

    const currentCount = uploadedFiles.length;
    const remainingSlots = 5 - currentCount;

    if (remainingSlots <= 0) {
      showToast('error', texts.maxFilesReached);
      return;
    }

    const toProcess = picked.slice(0, remainingSlots);
    if (picked.length > remainingSlots) {
       showToast('error', texts.maxFilesSelected(remainingSlots));
    }

    const valid = toProcess.filter(f => {
      const ext = f.name.split('.').pop().toLowerCase();
      return f.size <= 10 * 1024 * 1024 && ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff', 'tif', 'ico', 'heic', 'heif', 'pdf'].includes(ext);
    });

    const newEntries = valid.map(f => ({
      id: `${Date.now()}-${Math.random()}`,
      file: f,
      name: f.name,
      status: 'uploading',
      url: '',
      errorMsg: ''
    }));

    setUploadedFiles(prev => [...prev, ...newEntries]);

    // Start the pipeline for each new file immediately
    newEntries.forEach(entry => uploadFilePipeline(entry));
  };

  const removeFile = (id) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const retryFile = (id) => {
    setUploadedFiles(prev =>
      prev.map(f => (f.id === id ? { ...f, status: 'uploading', errorMsg: '' } : f))
    );
    const entry = uploadedFiles.find(f => f.id === id);
    if (entry) uploadFilePipeline({ ...entry, status: 'uploading' });
  };

  // ============= Step 4 — Submit =============

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Build documents object from successfully uploaded files
      const documents = {};
      uploadedFiles
        .filter(f => f.status === 'done')
        .forEach((f, i) => {
          const key = `file${i + 1}`;
          const fileName = f.url.split('/').pop();
          documents[key] = { fileName, url: f.url };
        });

      const body = {
        title: 'IncidentReport',
        description: reportData.caseDescription,
        contactId,
        categoryId: reportData.reportType,
        subCategoryId: reportData.reportClass,
        regionCode: locationData.regionCode,
        city: locationData.city,
        district: locationData.district,
        fullAddress: locationData.addressDesc,
        road: locationData.street,
        postalCode: locationData.postalCode,
        longitude: String(mapCoords.lng),
        latitude: String(mapCoords.lat),
        documents
      };

      const res = await fetch(`${config.API_BASE_URL}/api/integration/incidents`, {
        method: 'POST',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(body)
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (data.success === false) throw new Error(data.message || 'Submission failed');

      showToast(
        'success',
        isRtl ? 'تم تقديم البلاغ بنجاح ✔️' : 'Incident report submitted successfully ✔️'
      );
      setTimeout(() => {
        window.location.href="https://www.swa.gov.sa/"
      }, 2000)
    } catch (err) {
      console.error('Submit failed:', err);
      showToast(
        'error',
        isRtl ? 'حدث خطأ أثناء تقديم البلاغ. يرجى المحاولة مرة أخرى.' : 'An error occurred while submitting. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Build the srcdoc HTML for the Leaflet map iframe
  const buildMapSrcdoc = () => {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"><\/script>
  <style>
    * { margin: 0; padding: 0; }
    html, body, #map { width: 100%; height: 100%; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map').setView([${mapCoords.lat}, ${mapCoords.lng}], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    var marker = L.marker([${mapCoords.lat}, ${mapCoords.lng}], { draggable: true }).addTo(map);

    function sendCoords(lat, lng) {
      window.parent.postMessage({ type: 'MAP_LOCATION_SELECTED', lat: lat, lng: lng }, '*');
    }

    // Send initial coords
    sendCoords(${mapCoords.lat}, ${mapCoords.lng});

    // On marker drag
    marker.on('dragend', function(e) {
      var pos = e.target.getLatLng();
      sendCoords(pos.lat, pos.lng);
    });

    // On map click — move the marker
    map.on('click', function(e) {
      marker.setLatLng(e.latlng);
      sendCoords(e.latlng.lat, e.latlng.lng);
    });
  <\/script>
</body>
</html>`;
  };

  return (
    <div className="flex-grow" ref={topRef}>

      {/* ── Toast notification ── */}
      {submitToast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl text-white text-sm font-medium animate-fadeIn transition-all ${submitToast.type === 'success' ? 'bg-[#1e7b51]' : 'bg-red-600'
            }`}
        >
          {submitToast.type === 'success' ? (
            <CheckCircle className="w-5 h-5 shrink-0" />
          ) : (
            <X className="w-5 h-5 shrink-0" />
          )}
          <span>{submitToast.msg}</span>
          <button
            onClick={() => setSubmitToast(null)}
            className="ms-2 opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {/* Hero section */}
      <div className="bg-[#1e7b51] text-white pt-16 pb-32 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-20 relative z-10">
          <div className="text-sm mb-4 opacity-90 flex items-center gap-2">
            {texts.breadcrumb.split(' > ').map((crumb, idx, arr) => (
              <React.Fragment key={idx}>
                <span className={idx === arr.length - 1 ? 'font-bold' : ''}>{crumb}</span>
                {idx < arr.length - 1 && (
                  <span className="mx-1">{isRtl ? '<' : '>'}</span>
                )}
              </React.Fragment>
            ))}
          </div>
          <h1 className="text-4xl md:text-[50px] font-bold leading-tight mb-6">
            {texts.title}
          </h1>
          <p className="text-lg md:text-xl leading-relaxed mt-6 max-w-3xl opacity-90">
            {texts.description}
          </p>
        </div>
      </div>

      {/* Main content container */}
      <div className="container mx-auto px-4 md:px-20 relative -mt-20 mb-12">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 flex flex-col md:flex-row gap-8">

          {/* Sidebar / Stepper */}
          <div className="w-full md:w-1/4 bg-gray-50 rounded-xl p-6 relative">
            <div className="relative">
              {texts.steps.map((step, index) => {
                const stepNum = index + 1;
                const isCompleted = currentStep > stepNum;
                const isCurrent = currentStep === stepNum;

                return (
                  <div key={index} className="flex items-start mb-12 relative z-10">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                        ${isCompleted ? 'bg-[#1e7b51] border-[#1e7b51] text-white' :
                          isCurrent ? 'bg-white border-[#1e7b51] text-[#1e7b51]' :
                            'bg-white border-gray-300 text-gray-400'}`}>
                        {isCompleted ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        ) : (
                          <span className="text-sm font-semibold">{stepNum}</span>
                        )}
                      </div>
                      {/* Vertical line connector */}
                      {index < texts.steps.length - 1 && (
                        <div className={`absolute w-0.5 h-12 top-8 ${isRtl ? 'right-4' : 'left-4'} 
                          ${isCompleted ? 'bg-[#1e7b51]' : 'bg-gray-300'}`}></div>
                      )}
                    </div>
                    <div className={`mt-1 ${isRtl ? 'mr-4' : 'ml-4'}`}>
                      <span className={`text-sm font-medium ${isCurrent || isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                        {step}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Content */}
          <div className="w-full md:w-3/4">

            {/* Step 1 */}
            {currentStep === 1 && (
              <div className="animate-fadeIn">
                <div className="flex items-center gap-2 mb-8 border-r-4 border-[#1e7b51] pr-3" style={{ borderRightWidth: isRtl ? '4px' : '0', borderLeftWidth: !isRtl ? '4px' : '0', borderRightColor: '#1e7b51', borderLeftColor: '#1e7b51', paddingRight: isRtl ? '12px' : '0', paddingLeft: !isRtl ? '12px' : '0' }}>
                  <h2 className="text-xl font-bold text-gray-900">{texts.step1Title}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{texts.firstName}</label>
                    <input type="text" value={REQUESTER_FIRSTNAME} onChange={(e) => setREQUESTER_FIRSTNAME(e.target.value)} disabled className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-500 focus:outline-none cursor-not-allowed opacity-70" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{texts.lastName}</label>
                    <input type="text" value={REQUESTER_LASTNAME} onChange={(e) => setREQUESTER_LASTNAME(e.target.value)} disabled className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-500 focus:outline-none cursor-not-allowed opacity-70" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{texts.idNumber}</label>
                    <input type="text" value={REQUESTER_NATIONAL_ID} onChange={(e) => setREQUESTER_NATIONAL_ID(e.target.value)} disabled className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-500 focus:outline-none cursor-not-allowed opacity-70" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {texts.mobileNumber} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={mobileNumber}
                        onChange={handleMobileChange}
                        disabled={isVerified || otpSending}
                        maxLength={10}
                        placeholder={texts.mobilePlaceholder}
                        className={`w-full px-4 py-2 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e7b51] focus:border-transparent ${isVerified ? 'bg-gray-50 border-green-300' : mobileError ? 'border-red-400' : 'border-gray-300'}`}
                        dir="ltr"
                        style={{ textAlign: isRtl ? 'right' : 'left' }}
                      />
                      {isVerified && (
                        <div className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'left-3' : 'right-3'}`}>
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                      )}
                    </div>
                    {mobileError && (
                      <p className="text-red-500 text-xs mt-1">{mobileError}</p>
                    )}
                  </div>
                </div>

                {/* Contact creation feedback */}
                {isVerified && contactCreating && (
                  <div className="mt-6 flex items-center gap-3 text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-md px-4 py-3">
                    <Loader2 className="w-4 h-4 animate-spin text-[#1e7b51] shrink-0" />
                    <span>{isRtl ? 'جاري إنشاء الحساب...' : 'Creating your account...'}</span>
                  </div>
                )}
                {isVerified && contactError && (
                  <div className="mt-6 flex items-center justify-between gap-3 text-sm bg-red-50 border border-red-200 rounded-md px-4 py-3">
                    <span className="text-red-600">{contactError}</span>
                    <button
                      onClick={createContact}
                      className="shrink-0 text-[#1e7b51] font-medium hover:underline"
                    >
                      {isRtl ? 'إعادة المحاولة' : 'Retry'}
                    </button>
                  </div>
                )}
                {isVerified && contactId && (
                  <div className="mt-6 flex items-center gap-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-4 py-3">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>{isRtl ? 'تم إنشاء الحساب بنجاح' : 'Account created successfully'}</span>
                  </div>
                )}

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={isVerified && contactId ? handleNext : handleVerifyClick}
                    disabled={
                      // قبل التحقق: الجوال غير صالح أو جاري الإرسال
                      (!isVerified && !isMobileValid) ||
                      otpSending ||
                      contactCreating ||
                      // بعد التحقق من الجوال: لم يُنشأ الحساب بعد (جاري الإنشاء) أو فشل إنشاؤه
                      (isVerified && !contactId)
                    }
                    className={`px-6 py-2 rounded-md transition-colors font-medium flex items-center gap-2 ${(!isVerified && !isMobileValid) ||
                        otpSending ||
                        contactCreating ||
                        (isVerified && !contactId)
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-[#1e7b51] text-white hover:bg-[#165a3b]'
                      }`}
                  >
                    {otpSending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {texts.sending}
                      </>
                    ) : contactCreating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {isRtl ? 'جاري الإنشاء...' : 'Creating...'}
                      </>
                    ) : isVerified ? (
                      // سواء نجح إنشاء الحساب أو فشل: اعرض "التالي" لكن الزر سيكون معطلاً إذا !contactId
                      <>
                        {texts.next}
                        {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                      </>
                    ) : (
                      texts.verifyMobile
                    )}
                  </button>
                </div>

              </div>
            )}

            {/* Step 2 */}
            {currentStep === 2 && (
              <div className="animate-fadeIn">
                <div className="flex items-center gap-2 mb-8 border-r-4 border-[#1e7b51] pr-3" style={{ borderRightWidth: isRtl ? '4px' : '0', borderLeftWidth: !isRtl ? '4px' : '0', borderRightColor: '#1e7b51', borderLeftColor: '#1e7b51', paddingRight: isRtl ? '12px' : '0', paddingLeft: !isRtl ? '12px' : '0' }}>
                  <h2 className="text-xl font-bold text-gray-900">{texts.step2Title}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {texts.violationAddress} <span className="text-red-500">*</span>
                    </label>
                    <button
                      onClick={openMapModal}
                      className="w-full px-4 py-2 bg-[#1e7b51] text-white rounded-md hover:bg-[#165a3b] transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <MapPin className="w-4 h-4" /> {texts.selectFromMap}
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{texts.addressDesc}</label>
                    <input
                      type="text"
                      name="addressDesc"
                      value={locationData.addressDesc}
                      // onChange={handleLocationChange}
                      className="disabled bg-gray-100 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e7b51]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {texts.governorate} <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="governorate"
                      value={locationData.governorate}
                      // onChange={handleLocationChange}
                      className="disabled bg-gray-100 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e7b51] appearance-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {texts.city} <span className="text-red-500">*</span>
                    </label>
                    {(() => {
                      const regionCode = locationData.regionCode;
                      const citiesForRegion = regionCode ? CITIES_BY_REGION[regionCode] : null;
                      // If map returned a city directly → always readonly, even if we have cities for region
                      if (locationData.city) {
                        return (
                          <input
                            name="city"
                            value={locationData.city}
                            readOnly
                            className="bg-gray-100 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                          />
                        );
                      }
                      // No city from map, but we have a regionCode with known cities → show dropdown
                      if (citiesForRegion) {
                        const cityList = isRtl ? citiesForRegion.ar : citiesForRegion.en;
                        return (
                          <select
                            name="city"
                            value={locationData.city}
                            onChange={(e) => setLocationData(prev => ({ ...prev, city: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e7b51] bg-white appearance-none"
                          >
                            <option value="">{texts.selectCity}</option>
                            {cityList.map((city, idx) => (
                              <option key={idx} value={city}>{city}</option>
                            ))}
                          </select>
                        );
                      }
                      // No location selected yet — show placeholder input
                      return (
                        <input
                          name="city"
                          value={locationData.city}
                          readOnly
                          placeholder={isRtl ? 'يرجى تحديد الموقع من الخريطة أولاً' : 'Please select location from map first'}
                          className="bg-gray-100 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none text-gray-400"
                        />
                      );
                    })()}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{texts.district}</label>
                    <input
                      type="text"
                      name="district"
                      value={locationData.district}
                      // onChange={handleLocationChange}
                      className="disabled bg-gray-100 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e7b51]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{texts.street}</label>
                    <input
                      type="text"
                      name="street"
                      value={locationData.street}
                      // onChange={handleLocationChange}
                      className="disabled bg-gray-100 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e7b51]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{texts.postalCode}</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={locationData.postalCode}
                      // onChange={handleLocationChange}
                      className="disabled bg-gray-100 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e7b51]"
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-4">
                  <button onClick={handlePrevious} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium">
                    {isRtl ? <ArrowRight className="inline w-4 h-4 ml-2" /> : <ArrowLeft className="inline w-4 h-4 mr-2" />} {texts.previous}
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!isStep2Valid}
                    className={`px-6 py-2 rounded-md transition-colors font-medium ${!isStep2Valid ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#1e7b51] text-white hover:bg-[#165a3b]'}`}
                  >
                    {texts.next} {isRtl ? <ArrowLeft className="inline w-4 h-4 mr-2" /> : <ArrowRight className="inline w-4 h-4 ml-2" />}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {currentStep === 3 && (
              <div className="animate-fadeIn">
                <div className="flex items-center gap-2 mb-8 border-r-4 border-[#1e7b51] pr-3" style={{ borderRightWidth: isRtl ? '4px' : '0', borderLeftWidth: !isRtl ? '4px' : '0', borderRightColor: '#1e7b51', borderLeftColor: '#1e7b51', paddingRight: isRtl ? '12px' : '0', paddingLeft: !isRtl ? '12px' : '0' }}>
                  <h2 className="text-xl font-bold text-gray-900">{texts.step3Title}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {texts.reportType} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="reportType"
                        value={reportData.reportType}
                        onChange={handleReportChange}
                        disabled={categoriesLoading}
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e7b51] appearance-none disabled:bg-gray-100 disabled:cursor-wait"
                      >
                        <option value="">
                          {categoriesLoading
                            ? (isRtl ? 'جاري التحميل...' : 'Loading...')
                            : texts.selectReportType}
                        </option>
                        {reportCategories.map((cat) => (
                          <option key={cat.swa_casecategoryid} value={cat.swa_casecategoryid}>
                            {isRtl ? cat.swa_namearabic : cat.swa_name}
                          </option>
                        ))}
                      </select>
                      {categoriesLoading && (
                        <div className="absolute inset-y-0 end-3 flex items-center pointer-events-none">
                          <Loader2 className="w-4 h-4 animate-spin text-[#1e7b51]" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {texts.reportClass} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="reportClass"
                        value={reportData.reportClass}
                        onChange={handleReportChange}
                        disabled={!reportData.reportType || subCategoriesLoading}
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e7b51] appearance-none disabled:bg-gray-100 disabled:cursor-wait"
                      >
                        <option value="">
                          {subCategoriesLoading
                            ? (isRtl ? 'جاري التحميل...' : 'Loading...')
                            : texts.selectReportClass}
                        </option>
                        {subCategories.map((sub) => (
                          <option key={sub.swa_casesubcategoryid} value={sub.swa_casesubcategoryid}>
                            {isRtl ? sub.swa_namearabic : sub.swa_name}
                          </option>
                        ))}
                      </select>
                      {subCategoriesLoading && (
                        <div className="absolute inset-y-0 end-3 flex items-center pointer-events-none">
                          <Loader2 className="w-4 h-4 animate-spin text-[#1e7b51]" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {texts.caseDescription} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows="4"
                      name="caseDescription"
                      value={reportData.caseDescription}
                      onChange={handleReportChange}
                      placeholder={texts.caseDescriptionPlaceholder}
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e7b51] resize-none"
                    ></textarea>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {texts.reportImage} <span className="text-red-500">*</span>
                    </label>
                    <label className={`border-2 border-dashed border-gray-300 rounded-md p-8 text-center bg-gray-50 transition-colors block ${uploadedFiles.length >= 5 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer'}`}>
                      <input
                        type="file"
                        multiple
                        accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.bmp,.tiff,.tif,.ico,.heic,.heif,.pdf"
                        onChange={handleFileUpload}
                        disabled={uploadedFiles.length >= 5}
                        className="hidden"
                      />
                      <Upload className="mx-auto h-8 w-8 text-gray-400 mb-4" />
                      <p className="text-sm text-gray-900 font-medium mb-2">{texts.dragDropFiles}</p>
                      <p className="text-xs text-gray-500 mb-4">{texts.fileSizeLimit}</p>
                      <span className={`font-medium text-sm ${uploadedFiles.length >= 5 ? 'text-gray-500' : 'text-[#1e7b51] hover:underline'}`}>{texts.browseFiles}</span>
                    </label>
                    {uploadedFiles.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {uploadedFiles.map((entry) => (
                          <div
                            key={entry.id}
                            className={`flex items-center justify-between px-3 py-2 rounded-md border gap-2 ${entry.status === 'done'
                              ? 'bg-green-50 border-green-200'
                              : entry.status === 'error'
                                ? 'bg-red-50 border-red-200'
                                : 'bg-blue-50 border-blue-200'
                              }`}
                          >
                            {/* Left: icon + name + sub-message */}
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              {entry.status === 'uploading' && (
                                <Loader2 className="w-4 h-4 animate-spin text-[#1e7b51] shrink-0" />
                              )}
                              {entry.status === 'done' && (
                                <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                              )}
                              {entry.status === 'error' && (
                                <X className="w-4 h-4 text-red-500 shrink-0" />
                              )}
                              <div className="min-w-0">
                                <p className="text-sm text-gray-700 truncate">{entry.name}</p>
                                {entry.status === 'uploading' && (
                                  <p className="text-xs text-blue-500">
                                    {isRtl ? 'جاري الرفع...' : 'Uploading...'}
                                  </p>
                                )}
                                {entry.status === 'error' && (
                                  <p className="text-xs text-red-500">{entry.errorMsg}</p>
                                )}
                              </div>
                            </div>

                            {/* Right: retry + remove */}
                            <div className="flex items-center gap-2 shrink-0">
                              {entry.status === 'error' && (
                                <button
                                  onClick={() => retryFile(entry.id)}
                                  className="text-xs text-[#1e7b51] font-medium hover:underline"
                                >
                                  {isRtl ? 'إعادة' : 'Retry'}
                                </button>
                              )}
                              {entry.status !== 'uploading' && (
                                <button
                                  onClick={() => removeFile(entry.id)}
                                  className="text-red-400 hover:text-red-600 transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-4">
                  <button onClick={handlePrevious} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium">
                    {isRtl ? <ArrowRight className="inline w-4 h-4 ml-2" /> : <ArrowLeft className="inline w-4 h-4 mr-2" />} {texts.previous}
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!isStep3Valid}
                    className={`px-6 py-2 rounded-md transition-colors font-medium ${!isStep3Valid ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#1e7b51] text-white hover:bg-[#165a3b]'}`}
                  >
                    {texts.next} {isRtl ? <ArrowLeft className="inline w-4 h-4 mr-2" /> : <ArrowRight className="inline w-4 h-4 ml-2" />}
                  </button>
                </div>
              </div>
            )}

            {/* Step 4 */}
            {currentStep === 4 && (
              <div className="animate-fadeIn">
                <div className="py-12">
                  <div className="flex items-center gap-2 mb-8 border-r-4 border-[#1e7b51] pr-3" style={{ borderRightWidth: isRtl ? '4px' : '0', borderLeftWidth: !isRtl ? '4px' : '0', borderRightColor: '#1e7b51', borderLeftColor: '#1e7b51', paddingRight: isRtl ? '12px' : '0', paddingLeft: !isRtl ? '12px' : '0' }}>
                    <h2 className="text-xl font-bold text-gray-900">{texts.step4Title}</h2>
                  </div>
                  <div className="mb-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isAgreed}
                        onChange={(e) => setIsAgreed(e.target.checked)}
                        className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-gray-700">{texts.acknowledgmentText}</span>
                    </label>
                  </div>

                  <div className="mt-8 flex justify-center gap-4">
                    <button
                      onClick={handlePrevious}
                      disabled={isSubmitting}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
                    >
                      {isRtl ? <ArrowRight className="inline w-4 h-4 ml-2" /> : <ArrowLeft className="inline w-4 h-4 mr-2" />} {texts.previous}
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!isAgreed || isSubmitting}
                      className={`px-8 py-2 rounded-md transition-colors font-medium flex items-center gap-2 ${!isAgreed || isSubmitting ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#1e7b51] text-white hover:bg-[#165a3b]'}`}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {isRtl ? 'جاري الإرسال...' : 'Submitting...'}
                        </>
                      ) : texts.submit}
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Empty space above footer */}
      <div className="flex-grow min-h-[100px]"></div>

      {/* OTP Popup Modal */}
      {showOtpPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-md relative animate-fadeIn" dir={isRtl ? 'rtl' : 'ltr'}>
            <button
              onClick={() => setShowOtpPopup(false)}
              className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} text-gray-400 hover:text-gray-600 transition-colors`}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{texts.otpTitle}</h3>
              <p className="text-gray-500 text-sm">
                {texts.otpSubtitle} <span className="font-medium text-gray-700" dir="ltr">{mobileNumber.replace(/.(?=.{3})/g, '*')}</span>
              </p>
              {/* Show remaining attempts warning */}
              {!otpLocked && otpAttempts > 0 && otpAttempts < OTP_MAX_ATTEMPTS && (
                <p className="mt-2 text-xs text-amber-600 font-medium">
                  {texts.otpAttemptsLeft(OTP_MAX_ATTEMPTS - otpAttempts)}
                </p>
              )}
            </div>

            {/* Lockout message */}
            {otpLocked && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-md px-4 py-3 text-center">
                <p className="text-sm text-red-600 font-medium">{texts.otpMaxAttemptsReached}</p>
              </div>
            )}

            <div className="flex justify-center gap-3 md:gap-4 mb-8" dir="ltr">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={otpInputRefs[index]}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-12 h-12 md:w-14 md:h-14 text-center text-xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e7b51] focus:border-transparent bg-white"
                />
              ))}
            </div>

            <div className="text-center mb-8">
              <p className="text-sm text-gray-600">
                {texts.resendAfter} <span className="font-medium" dir="ltr">{formatTimer()} {texts.timerUnit}</span>
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleOtpSubmit}
                disabled={otp.some(digit => digit === '') || otpVerifying}
                className={`w-full py-3 rounded-md font-medium transition-colors ${otp.some(digit => digit === '') || otpVerifying ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-[#1e7b51] text-white hover:bg-[#165a3b]'}`}
              >
                {otpVerifying ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {isRtl ? 'جاري التحقق...' : 'Verifying...'}
                  </span>
                ) : texts.verify}
              </button>
              <button
                disabled={timer > 0 || otpSending || otpLocked}
                onClick={async () => {
                  // Frontend rate-limit guard for resend
                  if (otpLocked) return;

                  setOtpSending(true);
                  setOtpError('');
                  try {
                    const response = await fetch(`${config.API_BASE_URL}/api/integration/send-otp`, {
                      method: 'POST',
                      headers: authHeaders({ 'Content-Type': 'application/json' }),
                      body: JSON.stringify({ phoneNumber: mobileNumber })
                    });
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);

                    // Increment attempt counter
                    const newAttempts = otpAttempts + 1;
                    setOtpAttempts(newAttempts);
                    if (newAttempts >= OTP_MAX_ATTEMPTS) {
                      setOtpLocked(true);
                    }

                    setOtp(['', '', '', '', '', '']);
                    setTimer(115);
                    if (otpInputRefs[0]?.current) otpInputRefs[0].current.focus();
                  } catch (error) {
                    console.error('Resend OTP failed:', error);
                    setOtpError(isRtl ? 'فشل في إعادة إرسال رمز التحقق. يرجى المحاولة مرة أخرى.' : 'Failed to resend OTP. Please try again.');
                  } finally {
                    setOtpSending(false);
                  }
                }}
                className={`w-full py-3 rounded-md font-medium transition-colors border flex items-center justify-center gap-2 ${timer > 0 || otpSending || otpLocked ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50' : 'border-gray-300 text-gray-700 hover:bg-gray-50 bg-white'}`}
              >
                {otpSending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {isRtl ? 'جاري الإرسال...' : 'Sending...'}
                  </>
                ) : texts.resendCode}
              </button>
            </div>

            {otpError && (
              <p className="text-center text-sm text-red-500 mt-4">{otpError}</p>
            )}

            {timer === 0 && (
              <div className="text-center mt-4">
                <p className="text-sm text-gray-500">
                  {texts.resendAfter} <span className="font-medium" dir="ltr">00:00 {texts.timerUnit}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Map Popup Modal */}
      {showMapModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col relative animate-fadeIn" dir={isRtl ? 'rtl' : 'ltr'}>

            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">{texts.mapPopupTitle}</h3>
              <button
                onClick={() => setShowMapModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Map Body — Interactive Leaflet via srcdoc */}
            <div className="flex-grow bg-gray-100 relative">
              <iframe
                srcDoc={buildMapSrcdoc()}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                title="Location Map"
              ></iframe>
            </div>

            {/* Coordinates indicator */}
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 text-center" dir="ltr">
              {mapCoords.lat.toFixed(6)}, {mapCoords.lng.toFixed(6)}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
              <button
                onClick={() => setShowMapModal(false)}
                className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
              >
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={handleConfirmLocation}
                disabled={mapLoading}
                className={`px-6 py-2 rounded-md transition-colors font-medium flex items-center gap-2 ${mapLoading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#1e7b51] text-white hover:bg-[#165a3b]'}`}
              >
                {mapLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    {isRtl ? 'جاري التحميل...' : 'Loading...'}
                  </span>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    {texts.confirmLocation}
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentReportsForm;
