import React, { useState, useEffect } from 'react';
import StatusBadge from './StatusBadge/StatusBadge';
import { searchComplaints } from './Api';
import Navbar from '@/components/NavBar/NavbarArabic';
import Footer from '@/components/common/FooterArabic';
import Card from './Card';
import Breadcrumbs from './ui/BreadcrumbsAr';
import InputField from './ui/InputField';
import Button from './ui/Button';
import { Loader2, AlertCircle, Download, ChevronDown, FileText } from 'lucide-react';
import NvArabic from '@/components/ServicesPage/NAVbAR/NvArabic';
import sessionManager from '@/utils/sessionManager';
import Recaptcha from '@/components/Captacha/Recaptcha';
// Import the centralized language utils
import {
  getStoredLanguage,
  storeLanguage,
  setupLanguageListener,
  applyLanguageSettings,
  isRTL
} from '../../../utils/LanguageUtils';
import config from '@/utils/config';

// Document Dropdown Component for Arabic
const DocumentDropdownArabic = ({ documents }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!documents || documents.length === 0) {
    return (
      <span className="text-gray-500 text-sm">لا توجد ملفات</span>
    );
  }

  const handleDownload = async (documentLink, documentName) => {
    try {
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = documentLink;
      link.download = documentName || 'document';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      alert('فشل في تحميل الملف. يرجى المحاولة مرة أخرى.');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
        dir="rtl"
      >
        <FileText className="h-4 w-4 text-blue-600" />
        <span className="text-blue-700 mr-2">
          {documents.length} ملف{documents.length > 1 ? 'ات' : ''}
        </span>
        <ChevronDown className={`h-4 w-4 text-blue-600 transition-transform mr-1 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10" dir="rtl">
          <div className="py-1">
            {documents.map((doc, index) => (
              <button
                key={index}
                onClick={() => handleDownload(doc.documentLink, doc.name)}
                className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Download className="h-4 w-4 text-gray-500 ml-3" />
                <span className="truncate flex-1 text-right">
                  {doc.name || `ملف ${index + 1}`}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

const ComplaintInquiryArabic = () => {

  // Language state and handlers - MOVED HERE FROM DocumentDropdown
  const [language, setLanguage] = useState(() => getStoredLanguage());

  // const [response, setResponse] = useState('');

  // Set up language change listener
  useEffect(() => {
    const cleanup = setupLanguageListener((newLanguage) => {
      setLanguage(newLanguage);
      applyLanguageSettings(newLanguage);
      console.log(`ComplaintInquiry: Language changed to ${newLanguage}`);
    });

    // Apply language settings on mount
    applyLanguageSettings(language);

    return cleanup;
  }, []);

  // Language change handler using centralized system
  const handleLanguageChange = (newLanguage) => {
    // Validate language
    if (!['en', 'ar'].includes(newLanguage)) {
      console.warn('Invalid language selected:', newLanguage);
      return;
    }

    // Use centralized language storage
    storeLanguage(newLanguage);
    setLanguage(newLanguage);

    // Apply language settings immediately
    applyLanguageSettings(newLanguage);

    console.log(`Language changed to: ${newLanguage} (using centralized system)`);
  };
  // Form state
  const [formData, setFormData] = useState({
    complaintNumber: '',
    nationalId: ''
  });

  // Form errors
  const [errors, setErrors] = useState({});

  // Loading and results state
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [apiError, setApiError] = useState(null);
  const [digitsOnlyError, setDigitsOnlyError] = useState(null);

  // Captcha state
  const [showCaptchaModal, setShowCaptchaModal] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'الصفحة الرئيسية', path: 'https://www.swa.gov.sa/services' },
    { label: 'الخدمات', path: 'https://www.swa.gov.sa/services' },
    { label: 'استعلام الشكاوى', active: true },
  ];

  /**
   * Get JWT headers for API calls
   * Logic:
   * 1. If userId exists (logged in) → use sessionManager.getJWTHeaders()
   * 2. If no userId but JWT exists (captcha) → use sessionManager.getJWTHeaders()
   * 3. If no JWT → return null (need captcha)
   * @returns {object|null} Headers object or null if JWT needed
   */
  const getAPIHeaders = () => {
    // Check if user is logged in (has userId)
    const storedUserData = localStorage.getItem('swa_user');
    const hasUserId = storedUserData && JSON.parse(storedUserData)?.userId;

    // Get JWT headers from sessionManager (works for both logged-in and captcha users)
    const jwtHeaders = sessionManager.getJWTHeaders();

    if (jwtHeaders && Object.keys(jwtHeaders).length > 0) {
      // JWT exists (either from login or captcha)
      console.log('[ComplaintInquiry Arabic] Using JWT headers', hasUserId ? '(logged in)' : '(captcha verified)');
      return jwtHeaders;
    }

    // No JWT found - need captcha
    console.log('[ComplaintInquiry Arabic] No JWT found - captcha required');
    return null;
  };

  /**
   * Handle captcha verification success
   */
  const handleCaptchaSuccess = () => {
    console.log('[ComplaintInquiry Arabic] Captcha verified, JWT now available');
    setCaptchaVerified(true);
    setShowCaptchaModal(false);
    // Retry the search if form was already submitted
    if (formData.complaintNumber && formData.nationalId && validateForm()) {
      const performSearch = async () => {
        const headers = getAPIHeaders();
        if (headers) {
          setIsLoading(true);
          setApiError(null);
          setResults([]);
          try {
            const payload = {
              ticketNumber: formData.complaintNumber,
              nationalId: formData.nationalId,
              caseTypeId: "bc2d08ed-4018-f011-953d-84156ab50ded"
            };
            const data = await searchComplaints(payload, headers);
            if (data?.success && Array.isArray(data.data) && data.data.length) {
              setResults(data.data);
            } else {
              throw new Error('لم يتم العثور على شكاوى بالمعلومات المقدمة.');
            }
          } catch (error) {
            console.error('API error:', error);
            setResults([]);
            setApiError(error.message || 'يرجى التحقق من رقم الشكوى/الهوية إذا تم تصعيدها مسبقاً.');
          } finally {
            setIsLoading(false);
          }
        }
      };
      performSearch();
    }
  };

  // Handle input changes
  const NATIONAL_ID_REGEX = /^[12][0-9]{0,9}$/; // up to 10 digits, first digit 1-9
  const CASE_REGEX = /^SWA-[0-9]{0,5}-?[A-Z0-9]{0,5}$/i; // progressive typing validation

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'nationalId') {
      // Keep only digits and limit to 10
      newValue = value.replace(/[^0-9]/g, '').slice(0, 10);
    }

    if (name === 'complaintNumber') {
      // Uppercase and limit length to 15
      newValue = value.toUpperCase().slice(0, 15);
    }

    setFormData({
      ...formData,
      [name]: newValue,
    });

    // Live validation errors
    if (name === 'nationalId') {
      if (!NATIONAL_ID_REGEX.test(newValue) || newValue.length !== 10) {
        setErrors((prev) => ({ ...prev, nationalId: 'رقم الهوية الوطنية يجب أن يكون 10 أرقام ويبدأ بـ 1 أو 2' }));
      } else {
        setErrors((prev) => ({ ...prev, nationalId: '' }));
      }
    }

    if (name === 'complaintNumber') {
      // Don't show format error if input is digits-only (will show blue banner instead)
      if (/^\d+$/.test(newValue.trim())) {
        setErrors((prev) => ({ ...prev, complaintNumber: '' }));
      } else if (!CASE_REGEX.test(newValue) || newValue.length !== 15) {
        setErrors((prev) => ({ ...prev, complaintNumber: 'تنسيق: SWA-12345-ABCDE' }));
      } else {
        setErrors((prev) => ({ ...prev, complaintNumber: '' }));
      }
    }

    // Clear errors when user starts typing
    if (apiError) setApiError(null);
    if (digitsOnlyError) setDigitsOnlyError(null);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Don't show format error if input is digits-only (will show blue banner instead)
    if (!/^\d+$/.test(formData.complaintNumber.trim())) {
      if (!CASE_REGEX.test(formData.complaintNumber) || formData.complaintNumber.length !== 15) {
        newErrors.complaintNumber = 'يرجى تقديم رقم قضية مياه الرياض صحيح (SWA-12345-ABCDE)';
      }
    }

    if (!NATIONAL_ID_REGEX.test(formData.nationalId) || formData.nationalId.length !== 10) {
      newErrors.nationalId = 'رقم الهوية الوطنية يجب أن يكون بالضبط 10 أرقام ويبدأ بـ 1 أو 2';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    setDigitsOnlyError(null);
    setResults([]);

    // Check if complaint number contains only digits
    if (formData.complaintNumber && /^\d+$/.test(formData.complaintNumber.trim())) {
      setDigitsOnlyError('الرجاء التواصل مع مركز الاتصال على الرقم 19913 للاستفسار عن الشكوى المصعدة.');
      return;
    }

    if (validateForm()) {
      // Check if JWT is available before submitting
      const headers = getAPIHeaders();
      if (!headers) {
        console.log('[ComplaintInquiry Arabic] No JWT - showing captcha modal before search');
        setShowCaptchaModal(true);
        return;
      }

      setIsLoading(true);
      try {
        const payload = {
          ticketNumber: formData.complaintNumber,
          nationalId: formData.nationalId,
          caseTypeId: "bc2d08ed-4018-f011-953d-84156ab50ded"
        };
        const data = await searchComplaints(payload, headers);
        console.log(data);
        if (data?.success && Array.isArray(data.data) && data.data.length) {
          setResults(data.data);
        } else {
          throw new Error('لم يتم العثور على شكاوى بالمعلومات المقدمة.');
        }

        // const response = await fetch(`${config.API_BASE_URL}/api/incident-resolution/subject`, {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({
        //     incidentId: data.data[0].complaintId
        //   }),
        // });

        // if (!response.ok) {
        //   throw new Error(`HTTP ${response.status}: Failed to fetch resolution data`);
        // }

        // const result = await response.json();

        // if (result.success) {
        //   setResponse(result);
        // } else {
        //   throw new Error('API returned unsuccessful response');
        // }

      } catch (error) {
        console.error('API error:', error);
        setResults([]);
        setApiError(error.message || 'يرجى التحقق من رقم الشكوى/الهوية إذا تم تصعيدها مسبقاً.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <NvArabic language={language} onLanguageChange={handleLanguageChange} />
      <main className="flex-grow">
        {/* Hero section with gradient background */}
        <div className="bg-gradient-to-br from-[#14573a] to-[#1b8354] text-white pt-16 pb-32 relative">
          <img src="/images/img_group_40016.png" alt="" className="absolute top-0 right-0 w-[1154px] h-full object-cover" />
          <div className="container mx-auto px-4 md:px-20 relative z-10">
            {/* Breadcrumbs */}
            <Breadcrumbs items={breadcrumbItems} className="mb-4" />

            {/* Page title */}
            <h1 className="text-4xl md:text-[60px] font-semibold leading-tight md:leading-[90px] mb-6">
              استعلام الشكاوى
            </h1>

            {/* Service type badge */}
            {/* <div className="inline-flex items-center px-2 py-1 bg-[#ecfdf3] border border-[#abefc6] rounded text-[#085d3a] text-xs md:text-sm font-medium">
              أفراد
            </div> */}

            {/* Service description */}
            <p className="text-lg md:text-xl leading-relaxed mt-6 max-w-3xl">
              تتيح هذه المنصة للمستفيدين الاستعلام عن حالة وتفاصيل شكاوى خدمات المياه والصرف الصحي الخاصة بهم.
            </p>
          </div>
        </div>

        {/* Main content container with negative margin to pull up */}
        <div className="container mx-auto px-4 md:px-20 relative -mt-20 mb-12">
          {/* Digits-only error banner */}
          {digitsOnlyError && (
            <div className="mb-6 p-4 rounded-md flex items-start shadow-md relative" style={{ backgroundColor: '#EFF8FF' }}>
              <button className="absolute left-2 top-2 text-gray-400 hover:text-gray-600" onClick={() => setDigitsOnlyError(null)}>
                <span className="text-lg">×</span>
              </button>
              <div className="flex-shrink-0 ml-3">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M11 22C17.0751 22 22 17.0751 22 11C22 4.92487 17.0751 0 11 0C4.92487 0 0 4.92487 0 11C0 17.0751 4.92487 22 11 22ZM11 6C10.4477 6 10 6.44772 10 7V11C10 11.5523 10.4477 12 11 12C11.5523 12 12 11.5523 12 11V7C12 6.44772 11.5523 6 11 6ZM11 14C10.4477 14 10 14.4477 10 15C10 15.5523 10.4477 16 11 16C11.5523 16 12 15.5523 12 15C12 14.4477 11.5523 14 11 14Z" fill="#175CD3" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-right" style={{ color: '#175CD3' }}>{digitsOnlyError}</p>
              </div>
            </div>
          )}

          {/* Enhanced Error notification with red circle icon matching the image */}
          {apiError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start shadow-md relative">
              <button className="absolute left-2 top-2 text-gray-400 hover:text-gray-600" onClick={() => setApiError(null)}>
                <span className="text-lg">×</span>
              </button>
              <div className="flex-shrink-0 ml-3">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M11 22C17.0751 22 22 17.0751 22 11C22 4.92487 17.0751 0 11 0C4.92487 0 0 4.92487 0 11C0 17.0751 4.92487 22 11 22ZM11 6C10.4477 6 10 6.44772 10 7V11C10 11.5523 10.4477 12 11 12C11.5523 12 12 11.5523 12 11V7C12 6.44772 11.5523 6 11 6ZM11 14C10.4477 14 10 14.4477 10 15C10 15.5523 10.4477 16 11 16C11.5523 16 12 15.5523 12 15C12 14.4477 11.5523 14 11 14Z" fill="#B42318" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm  text-red-800"><b>ﻟﻢ ﻳﺘﻢ ﺍﻟﻌﺜﻮﺭ ﻋﻠﻰ ﺷﻜﻮﻯ: </b>ﻟﻢ ﻳﺘﻢ ﺍﻟﻌﺜﻮﺭ ﻋﻠﻰ ﺷﻜﻮﻯ. ﻳﺮﺟﻰ ﺍﻟﺘﺄﻛﺪ ﻣﻦ ﺭﻗﻢ ﺍﻟﺸﻜﻮﻯ/ﺍﻟﻬﻮﻳﺔ.</p>
              </div>
            </div>
          )}

          {/* Form card */}
          <Card className={`p-6 mb-8 shadow-xl ${(apiError || digitsOnlyError) ? '-mt-6' : ''}`}>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <InputField
                  label="رقم الشكوى المصعدة لدى الهيئة"
                  maxLength={15}
                  name="complaintNumber"
                  value={formData.complaintNumber}
                  onChange={handleChange}
                  placeholder="أدخل رقم الشكوى المصعدة لدى الهيئة"
                  required
                  error={errors.complaintNumber}
                />

                <InputField
                  label="رقم الهوية الوطنية/الإقامة"
                  maxLength={10}
                  name="nationalId"
                  value={formData.nationalId}
                  onChange={handleChange}
                  placeholder="أدخل رقم الهوية الوطنية/الإقامة"
                  required
                  error={errors.nationalId}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-[132px] h-[40px]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="animate-spin ml-2" />
                    جاري المعالجة...
                  </span>
                ) : (
                  "استعلام"
                )}
              </Button>
            </form>
          </Card>

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-12 w-12 text-green-600 animate-spin" />
            </div>
          )}

          {/* Results section */}
          {results.length > 0 && !isLoading && (
            <div className="space-y-8">
              <Card className="p-6 shadow-xl">
                <h2 className="text-xl font-bold text-gray-800 mb-4">حالة الشكوى</h2>

                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white" dir="rtl">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم الشكوى</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">موضوع الشكوى</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المنطقة</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الجهة المختصة</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الرد</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الملفات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {results.map((c) => (
                        <tr key={c.complaintId}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.complaintNumber}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.subject}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.regionName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.relatedAuthorityName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <StatusBadge
                              status={c.status}
                              statusCode={c.statusCode}
                              stageName={c.stagename}
                              stateCode={c.statecode}
                              size="default"
                              language="ar"
                              externalCommunications={c.externalCommunications}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-pre-wrap break-words text-sm text-gray-900 leading-relaxed">{c.gmConsumerExperienceComments}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <DocumentDropdownArabic documents={c.documents} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Last update info */}
              <div className="pt-8 pb-4">
                <div className="text-sm text-gray-500">
                  تاريخ آخر تحديث: {new Date().toLocaleDateString('ar-SA')} {new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Empty space above footer */}
        <div className="flex-grow min-h-[100px]"></div>
      </main>

      {/* Captcha Modal - Recaptcha component has its own modal */}
      <Recaptcha
        isOpen={showCaptchaModal}
        onClose={() => setShowCaptchaModal(false)}
        onSuccess={handleCaptchaSuccess}
        onError={(error) => {
          console.error('[ComplaintInquiry Arabic] Captcha error:', error);
        }}
        title="التحقق من الأمان مطلوب"
      />

      <Footer />
    </div>
  );
};

export default ComplaintInquiryArabic;