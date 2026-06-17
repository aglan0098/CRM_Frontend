import React, { useState, useEffect } from 'react';
import { FaTimes, FaExclamationCircle, FaCopy, FaUpload, FaChevronDown, FaChevronUp, FaEye, FaCheckCircle, FaTrash, FaDownload, FaFile } from 'react-icons/fa';
import { checkUserExists } from '@/components/Login/Firestore_SMS_CRMAuth/APIs';
import StatusBadge from './StatusBadge/StatusBadge';
import FileUploadImage from '@/assets/images/file-upload.png';
import config from '@/utils/config';
const translations = {
  en: {
    moreInfoNeeded: 'More info needed',
    completeRequiredDetails: 'Please complete the required details below to process your request.',
    requestTitle: 'Request Regulatory Support',
    actionRequired: 'Action Required',
    completed: 'Completed',
    requesterName: 'Name of Requester',
    phone: 'Phone Number',
    email: 'Official Email',
    nationalId: 'National ID',
    entityName: 'Entity Name',
    supportType: 'Type Of Organizational Support',
    description: 'Description of the Request',
    attachments: 'Related Attachments Of Request',
    repLetter: 'Official Representative letter',
    prevRequest: 'Is there a previous request?',
    yes: 'Yes',
    no: 'No',
    previousCommunications: 'Previous Communications',
    communicationRequest: 'Communication Request',
    requestedInformation: 'Requested Information',
    yourResponse: 'Your Response',
    attachedFiles: 'Attached Files',
    attachedDocuments: 'Attached Documents',
    additionalInformationRequired: 'Additional Information Required',
    responseRequired: 'Response Required',
    response: 'Response',
    responsePlaceholder: 'Message...',
    uploadFile: 'Upload File',
    uploadHint: 'Maximum file size allowed is 2MB, supported file formats include .jpg, .png, and .pdf.',
    browseFiles: 'Browse Files',
    declaration: 'I declare that all information provided is true and accurate, and I bear full responsibility for the accuracy of this data',
    back: 'Back',
    submit: 'Submit',
    submitting: 'Submitting...',
    saveAsDraft: 'Save as Draft',
    acceptDeclarationError: 'Please accept the declaration before submitting.',
    enterResponseError: 'Please enter a response before submitting.',
    responseSubmittedSuccess: 'Response submitted successfully!',
    failedToSubmitError: 'Failed to submit response',
    genericSubmitError: 'An error occurred while submitting your response.',
    serverError: 'Server error occurred. Please try again later.',
    networkError: 'Network error. Please check your connection and try again.',
    maxFilesError: 'Maximum 3 files allowed',
    uploadingFile: 'Uploading file...',
    fileUploadError: 'Failed to upload file',
    removeFile: 'Remove file',
    selectFiles: 'Select files to upload (Max 3)',
    uploadedFiles: 'Uploaded Files',
    downloadFile: 'Download',
    caseResolution: 'Recommendations',
    loadingResolution: 'Loading case resolution...',
    resolutionLoadError: 'Failed to load case resolution data.',
  },
  ar: {
    moreInfoNeeded: 'مطلوب مزيد من المعلومات',
    completeRequiredDetails: 'يرجى استكمال التفاصيل المطلوبة أدناه لمعالجة طلبك.',
    requestTitle: 'طلب الدعم التنظيمي',
    actionRequired: 'مطلوب إجراء',
    completed: 'مكتمل',
    requesterName: 'اسم مقدم الطلب',
    phone: 'رقم الجوال',
    email: 'البريد الإلكتروني الرسمي',
    nationalId: 'رقم الهوية الوطنية',
    entityName: 'اسم المنشأة',
    supportType: 'نوع الدعم التنظيمي',
    description: 'وصف الطلب',
    attachments: 'المرفقات ذات الصلة بالطلب',
    repLetter: 'خطاب الممثل الرسمي',
    prevRequest: 'هل يوجد طلب سابق؟',
    yes: 'نعم',
    no: 'لا',
    previousCommunications: 'الاتصالات السابقة',
    communicationRequest: 'طلب اتصال',
    requestedInformation: 'المعلومات المطلوبة',
    yourResponse: 'ردك',
    attachedFiles: 'الملفات المرفقة',
    attachedDocuments: 'المستندات المرفقة',
    additionalInformationRequired: 'معلومات إضافية مطلوبة',
    responseRequired: 'الرد مطلوب',
    response: 'الرد',
    responsePlaceholder: 'رسالة...',
    uploadFile: 'رفع ملف',
    uploadHint: 'الحد الأقصى لحجم الملف هو 2 ميجابايت. الصيغ المدعومة: jpg, .png, .pdf.',
    browseFiles: 'تصفح الملفات',
    declaration: 'أقر بأن جميع المعلومات المقدمة صحيحة ودقيقة، وأتحمل المسؤولية الكاملة عن دقة هذه البيانات',
    back: 'رجوع',
    submit: 'إرسال',
    submitting: 'جارٍ الإرسال...',
    saveAsDraft: 'حفظ كمسودة',
    acceptDeclarationError: 'يرجى قبول الإقرار قبل الإرسال.',
    enterResponseError: 'يرجى إدخال رد قبل الإرسال.',
    responseSubmittedSuccess: 'تم إرسال الرد بنجاح!',
    failedToSubmitError: 'فشل إرسال الرد',
    genericSubmitError: 'حدث خطأ أثناء إرسال ردك.',
    serverError: 'حدث خطأ في الخادم. يرجى المحاولة مرة أخرى في وقت لاحق.',
    networkError: 'خطأ في الشبكة. يرجى التحقق من اتصالك والمحاولة مرة أخرى.',
    maxFilesError: 'الحد الأقصى 3 ملفات مسموح',
    uploadingFile: 'جارٍ رفع الملف...',
    fileUploadError: 'فشل في رفع الملف',
    removeFile: 'إزالة الملف',
    selectFiles: 'اختر الملفات للرفع (الحد الأقصى 3)',
    uploadedFiles: 'الملفات المرفوعة',
    downloadFile: 'تحميل',
    caseResolution: 'حل القضية',
    loadingResolution: 'جارٍ تحميل حل القضية...',
    resolutionLoadError: 'فشل في تحميل بيانات حل القضية.',
  },
};

// --- Reusable Components ---
const InfoField = ({ label, value, colSpan = 'md:col-span-1' }) => (
  <div className={colSpan}>
    <label className="block text-sm font-medium text-gray-500 mb-1">{label}</label>
    <div className="w-full bg-gray-100/70 border border-gray-200 rounded-md p-3 text-base text-gray-900">
      {value}
    </div>
  </div>
);

const AttachedFile = ({ label, fileName, downloadLink }) => (
  <div>
    <label className="block text-sm font-medium text-gray-500 mb-1">{label}</label>
    <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200">
      <div className="flex items-center flex-1 min-w-0">
        <FaFile className="text-gray-500 mr-2 flex-shrink-0 text-base" />
        <span className="text-gray-700 font-medium text-sm truncate" title={fileName}>
          {fileName}
        </span>
      </div>
      <div className="flex gap-2 ml-3">
        <button
          onClick={() => downloadLink && window.open(downloadLink, '_blank')}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-md hover:bg-green-600 hover:text-white transition-all duration-200"
          title="Download"
        >
          <FaDownload className="text-xs" />
        </button>
      </div>
    </div>
  </div>
);

const FormTextArea = ({ label, placeholder, name, value, onChange, required = false, rows = 6 }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      rows={rows}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
    />
  </div>
);

const FileUploadBox = ({ 
  label, 
  hint, 
  browseText, 
  required = false, 
  uploadedFiles = [], 
  onFileUpload, 
  onFileRemove, 
  isUploading = false,
  t
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">
      {label} {required && <span className="text-gray-400">(Max 3)</span>}
    </label>
    <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-md text-center bg-gray-50 hover:bg-gray-100 cursor-pointer relative">
      <input
        type="file"
        multiple
        accept="*/*"
        onChange={onFileUpload}
        disabled={isUploading || uploadedFiles.length >= 3}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />
      <div className="pointer-events-none">
        {isUploading ? (
          <>
            <div className="animate-spin inline-block w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mb-2"></div>
            <p className="text-sm text-gray-600">{t.uploadingFile}</p>
          </>
        ) : uploadedFiles.length >= 3 ? (
          <>
            <FaUpload className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">{t.maxFilesError}</p>
          </>
        ) : (
          <>
            <img src={FileUploadImage} alt="Upload" className="h-16 mb-2" />
            <p className="text-sm text-gray-600">{t.selectFiles}</p>
            <p className="text-xs text-gray-500 mt-2 px-2">{hint}</p>
          </>
        )}
      </div>
    </div>
    
    {uploadedFiles.length > 0 && (
      <div className="mt-3">
        <label className="block text-sm font-medium text-gray-600 mb-2">{t.uploadedFiles}</label>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center flex-1 min-w-0">
                <span className="text-sm text-gray-700 truncate" title={file.fileName}>
                  {file.fileName}
                </span>
              </div>
              <button
                onClick={() => onFileRemove(index)}
                className="text-red-500 hover:text-red-700 ml-2 flex-shrink-0"
                title={t.removeFile}
              >
                <FaTrash className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

// --- Main Component ---
const RegSupportExtComm = ({ request, onBack, language = 'en' }) => {
  if (!request) return null;

  const t = translations[language];

  const [expandedPrevIndex, setExpandedPrevIndex] = useState(null);
  const [expandedActiveIndex, setExpandedActiveIndex] = useState(null);
  const [responses, setResponses] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [agreements, setAgreements] = useState({});
  const [showAlert, setShowAlert] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState({});
  const [isUploading, setIsUploading] = useState({});
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    nationalId: '',
    entityName: '',
    initials: 'SK'
  });
  const [resolutionData, setResolutionData] = useState(null);
  const [loadingResolution, setLoadingResolution] = useState(false);
  const [resolutionError, setResolutionError] = useState(null);

  const isResolutionState = request.statecode === 1 || request.stageName === 'Resolution';

  useEffect(() => {
    const loadUser = async () => {
      const userData = JSON.parse(localStorage.getItem('swa_user') || '{}');
      if (userData?.userId) {
        try {
          const result = await checkUserExists(userData.userId);
          const user = result?.user;
          if (user) {
            setUserInfo({
              firstName: user.firstName || '',
              lastName: user.lastName || '',
              phone: user.phone || '',
              email: user.email || '',
              nationalId: user.nationalId || '',
              entityName: user.accountName || '',
              initials: 'SK'
            });
          }
        } catch (error) {
          console.error("Failed to load user info:", error);
          setUserInfo({
            firstName: '',
            lastName: '',
            phone: '',
            email: '',
            nationalId: '',
            entityName: '',
            initials: 'SK'
          });
        }
      }
    };

    loadUser();

    const fetchResolutionData = async () => {
      if (!isResolutionState || !request.requestId) return;

      setLoadingResolution(true);
      setResolutionError(null);

      try {
        const response = await fetch(`${config.API_BASE_URL}/api/incident-resolution/subject`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            incidentId: request.requestId
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to fetch resolution data`);
        }

        const result = await response.json();

        if (result.success) {
          setResolutionData(result);
        } else {
          throw new Error('API returned unsuccessful response');
        }
      } catch (error) {
        console.error('Resolution fetch error:', error);
        setResolutionError(error.message);
      } finally {
        setLoadingResolution(false);
      }
    };

    fetchResolutionData();
  }, [request.requestId, isResolutionState]);

  const previousResponses = request.externalCommunications
  ?.filter(comm => comm.comstatusCode === 116950004 && comm.response !== null)
  ?.map((comm) => ({
    title: `${t.communicationRequest}: ${comm.requestedInformation || 'Communication Request'}`,
    date: new Date(comm.createdDate || new Date()).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-GB'),
    response: comm.response || '',
    files: comm.files || [],
    documents: comm.documents || [],
    hasResponse: true,
    isActive: false,
    externalCommunicationId: comm.externalCommunicationId
  })) || [];

// In the activeComms filter, update to (removed status code 1 condition):
const activeComms = request.externalCommunications
  ?.filter(comm => comm.comstatusCode === 116950000 && comm.response === null)
  ?.map((comm) => ({
    title: `${t.responseRequired}: ${comm.requestedInformation || 'Response Required'}`,
    date: new Date(comm.createdDate || new Date()).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-GB'),
    externalCommunicationId: comm.externalCommunicationId,
    isActive: true
  })) || [];

// Update the toggle functions:
const togglePrevAccordion = (index) => {
  setExpandedPrevIndex(index === expandedPrevIndex ? null : index);
};

const toggleActiveAccordion = (index) => {
  setExpandedActiveIndex(index === expandedActiveIndex ? null : index);
};

  const removeFile = (commId, indexToRemove) => {
    setUploadedFiles(prev => ({
      ...prev,
      [commId]: prev[commId].filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleFileUpload = async (event, commId) => {
    const files = Array.from(event.target.files);

    if ((uploadedFiles[commId]?.length || 0) + files.length > 3) {
      alert(t.maxFilesError);
      return;
    }

    setIsUploading(prev => ({ ...prev, [commId]: true }));

    try {
      const uploadResults = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`${language === 'ar' ? 'معالجة الملف' : 'Processing file'} ${i + 1}/${files.length}: ${file.name}`);

        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('bucketType', 'cust');

          const response = await fetch(`${config.API_BASE_URL}/upload`, {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`Failed to upload ${file.name}: HTTP ${response.status}`);
          }

          const result = await response.json();
          console.log(`${language === 'ar' ? 'تم رفع الملف بنجاح' : 'File uploaded successfully'}: ${file.name}`, result);
          
          uploadResults.push(result);

          if (i < files.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 300));
          }
        } catch (fileError) {
          console.error(`${language === 'ar' ? 'خطأ في رفع الملف' : 'File upload error'}: ${file.name}`, fileError);
          alert(`${t.fileUploadError} "${file.name}": ${fileError.message}`);
        }
      }

      if (uploadResults.length > 0) {
        setUploadedFiles(prev => ({
          ...prev,
          [commId]: [...(prev[commId] || []), ...uploadResults]
        }));
        console.log(`${language === 'ar' ? 'تمت معالجة جميع الملفات. تم رفع' : 'All files processed. Successfully uploaded'} ${uploadResults.length}/${files.length} ${language === 'ar' ? 'ملف' : 'files'}`);
      }
    } catch (error) {
      console.error('General file upload error:', error);
      alert(`${t.fileUploadError}: ${error.message}`);
    } finally {
      setIsUploading(prev => ({ ...prev, [commId]: false }));
      event.target.value = '';
    }
  };

  const handleSubmit = async (comm) => {
    const commId = comm.externalCommunicationId;

    if (!agreements[commId]) {
      alert(t.acceptDeclarationError);
      return;
    }

    if (!comm || !responses[commId]?.trim()) {
      alert(t.enterResponseError);
      return;
    }

    setIsSubmitting(prev => ({ ...prev, [commId]: true }));

    try {
      const documents = {};
      (uploadedFiles[commId] || []).forEach((file, index) => {
        const docKey = `doc${index + 1}`;
        documents[docKey] = {
          message: file.message,
          bucketType: file.bucketType,
          fileName: file.fileName,
          url: file.url
        };
      });

      console.log('Documents structure being sent:', documents);

      const submitData = {
        externalCommunicationId: commId,
        responseText: responses[commId].trim(),
        complaintId: request.requestId,
        documents: documents,
        doctypeid: "aaa6330d-5c6c-f011-9550-9f1353ac674c"
      };

      const submitResponse = await fetch(`${config.API_BASE_URL}/api/insert-response`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (!submitResponse.ok) {
        throw new Error(`HTTP ${submitResponse.status}: ${t.failedToSubmitError}`);
      }

      const result = await submitResponse.json();

      if (result.success === true) {
        alert(result.message || t.responseSubmittedSuccess);
        setResponses(prev => ({ ...prev, [commId]: '' }));
        setUploadedFiles(prev => ({ ...prev, [commId]: [] }));
        setAgreements(prev => ({ ...prev, [commId]: false }));
        onBack();
      } else {
        const errorMessage = result.error || result.message || t.failedToSubmitError;
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Submit error:', error);

      let errorMessage = t.genericSubmitError;

      if (error.message.includes('Internal server error')) {
        errorMessage = t.serverError;
      } else if (error.message.includes('HTTP')) {
        errorMessage = t.networkError;
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(`${language === 'ar' ? 'خطأ' : 'Error'}: ${errorMessage}`);
    } finally {
      setIsSubmitting(prev => ({ ...prev, [commId]: false }));
    }
  };

  const officialRepLetterDocs = request.documents?.filter(doc =>
    doc.doctypeid === 'f3678c7f-b04a-f011-954c-e03600ee8d3f'
  ) || [];

  const attachmentDocs = request.documents?.filter(doc =>
    doc.doctypeid !== 'f3678c7f-b04a-f011-954c-e03600ee8d3f'
  ) || [];

  const hasPreviousRequest = request.prevrrq || false;

  return (
    <div className={`complaint-details-wrapper p-6 md:p-8 animate-fadeIn ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      {showAlert && activeComms.length > 0 && !isResolutionState && (
        <div className="alert-warning">
          <div>
            ⚠️ {t.moreInfoNeeded}: <span>{t.completeRequiredDetails}</span>
          </div>
          <FaTimes className="close-alert" onClick={() => setShowAlert(false)} />
        </div>
      )}

      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-6 border-b border-gray-200">
        <h2 className="complaint-title">{t.requestTitle}</h2>
        <StatusBadge
          status={request.status}
          statusCode={request.statusCode}
          stageName={request.stageName}
          stateCode={request.statecode}
          size="default"
          language={language}
          externalCommunications={request.externalCommunications}
        />
      </header>

      <section className="complaint-section">
        <h3 className="section-title">{t.requestTitle}</h3>
        <div className="info-grid grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <InfoField
            label={t.requesterName}
            value={`${userInfo.firstName} ${userInfo.lastName}`.trim() || 'Not Available'}
          />
          <InfoField
            label={t.phone}
            value={userInfo.phone || 'Not Available'}
          />
          <InfoField
            label={t.email}
            value={userInfo.email || 'Not Available'}
          />
          <InfoField
            label={t.nationalId}
            value={userInfo.nationalId || 'Not Available'}
          />
          <InfoField
            label={t.entityName}
            value={userInfo.entityName || 'Not Available'}
            colSpan="md:col-span-2"
          />
          <InfoField
            label={t.supportType}
            value={request.subject || 'Not Available'}
            colSpan="md:col-span-2"
          />
          <div className="info-field full-width md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-1">{t.description}</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              value={request.description || 'No description available'}
              disabled
              rows="3"
            />
          </div>

          {officialRepLetterDocs.length > 0 && (
            <div className="info-field full-width md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-2">{t.repLetter}</label>
              <div className="flex flex-col gap-3">
                {officialRepLetterDocs.map((doc, index) => (
                  <AttachedFile
                    key={index}
                    fileName={doc.name}
                    downloadLink={doc.documentLink}
                  />
                ))}
              </div>
            </div>
          )}

          {attachmentDocs.length > 0 && (
            <div className="info-field full-width md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-2">{t.attachments}</label>
              <div className="flex flex-col gap-3">
                {attachmentDocs.map((doc, index) => (
                  <AttachedFile
                    key={index}
                    fileName={doc.name}
                    downloadLink={doc.documentLink}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="info-field full-width md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-2">{t.prevRequest}</label>
            <div className="flex items-center gap-x-8">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="prevReqYes"
                  name="prevRequest"
                  disabled
                  checked={hasPreviousRequest === true}
                  className="h-4 w-4 border-gray-300 disabled:cursor-not-allowed"
                />
                <label htmlFor="prevReqYes" className="ml-2 text-base text-gray-500">
                  {t.yes}
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="prevReqNo"
                  name="prevRequest"
                  disabled
                  checked={hasPreviousRequest !== true}
                  className="h-4 w-4 text-green-600 border-gray-300 disabled:cursor-not-allowed"
                />
                <label htmlFor="prevReqNo" className="ml-2 text-base text-gray-800">
                  {t.no}
                </label>
              </div>
            </div>
          </div>
        </div>
      </section>

      {previousResponses.length > 0 && (
        <>
          <hr className="section-divider" />
          <section className="complaint-section">
            <h3 className="section-title">{t.previousCommunications}</h3>
            <div className="accordion">
              {previousResponses.map((item, index) => (
                <div key={item.externalCommunicationId || index} className="accordion-item">
                  <div className="accordion-header" onClick={() => togglePrevAccordion(index)}>
                    <div className="accordion-left-icon">
                      {expandedPrevIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                    <span className="accordion-title">{item.title}</span>
                    <span className="accordion-date">{item.date}</span>
                  </div>
                  {expandedPrevIndex === index && (
                    <div className="accordion-body">
                      {item.hasResponse && (
                        <div style={{ marginBottom: '10px' }}>
                          <strong>{t.yourResponse}:</strong>
                          <textarea
                            value={item.response}
                            readOnly
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md bg-gray-100"
                          />
                        </div>
                      )}
                      {item.documents && item.documents.length > 0 && (
                        <div style={{ marginBottom: '10px' }}>
                          <strong>{t.attachedDocuments}:</strong>
                          <div className="space-y-2 mt-2">
                            {item.documents.map((doc, idx) => (
                              <div key={idx} className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded-md">
                                <span className="text-sm text-gray-700 flex-1 truncate" title={doc.name}>
                                  {doc.name}
                                </span>
                                <button
                                  onClick={() => window.open(doc.documentLink, '_blank')}
                                  className="text-blue-600 hover:text-blue-800 ml-2 flex-shrink-0 flex items-center gap-1 px-2 py-1 text-xs border border-blue-300 rounded hover:bg-blue-100"
                                  title={t.downloadFile}
                                >
                                  <FaDownload className="h-3 w-3" />
                                  {t.downloadFile}
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {item.files && item.files.length > 0 && (
                        <div style={{ marginBottom: '10px' }}>
                          <strong>{t.attachedFiles}:</strong>
                          {item.files.map((file, idx) => (
                            <div className="file-display" key={idx}>
                              <span>{file}</span>
                              <FaEye className="icon-eye" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {activeComms.length > 0 && !isResolutionState && (
        <section className="complaint-section">
          <h4 className="section-title">{t.additionalInformationRequired}</h4>
          <div className="accordion">
            {activeComms.map((comm, index) => (
              <div key={comm.externalCommunicationId} className="accordion-item">
                <div className="accordion-header" onClick={() => toggleActiveAccordion(index)}>
                  <div className="accordion-left-icon">
                    {expandedActiveIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                  <span className="accordion-title">{comm.title}</span>
                  <span className="accordion-date">{comm.date}</span>
                </div>
                {expandedActiveIndex === index && (
                  <div className="accordion-body">
                    <div className="p-4 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">{t.response}</label>
                          <textarea
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder={t.responsePlaceholder}
                            value={responses[comm.externalCommunicationId] || ''}
                            onChange={(e) => setResponses(prev => ({
                              ...prev,
                              [comm.externalCommunicationId]: e.target.value
                            }))}
                            rows="5"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            {t.uploadFile} <span className="text-gray-400">(Max 3)</span>
                          </label>
                          <div className="flex-grow flex flex-col">
                            <div className="flex-grow flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-md text-center bg-gray-50 hover:bg-gray-100 cursor-pointer relative">
                              <input
                                type="file"
                                multiple
                                accept=".jpg,.png,.pdf"
                                onChange={(e) => handleFileUpload(e, comm.externalCommunicationId)}
                                disabled={isUploading[comm.externalCommunicationId] || (uploadedFiles[comm.externalCommunicationId]?.length >= 3)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                              />
                              <div className="pointer-events-none">
                                {isUploading[comm.externalCommunicationId] ? (
                                  <>
                                    <div className="animate-spin inline-block w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mb-2"></div>
                                    <p className="text-sm text-gray-600">{t.uploadingFile}</p>
                                  </>
                                ) : (uploadedFiles[comm.externalCommunicationId]?.length >= 3) ? (
                                  <>
                                    <FaUpload className="h-8 w-8 text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-500">{t.maxFilesError}</p>
                                  </>
                                ) : (
                                  <>
                                    <img src={FileUploadImage} alt="Upload Preview" className="h-16 mb-2" />
                                    <p className="text-sm text-gray-600">{t.selectFiles}</p>
                                    <p className="text-xs text-gray-500 mt-2 px-2">{t.uploadHint}</p>
                                  </>
                                )}
                              </div>
                            </div>
                            {uploadedFiles[comm.externalCommunicationId]?.length > 0 && (
                              <div className="mt-3">
                                <label className="block text-sm font-medium text-gray-600 mb-2">{t.uploadedFiles}</label>
                                <div className="space-y-2 max-h-32 overflow-y-auto">
                                  {uploadedFiles[comm.externalCommunicationId].map((file, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded-md">
                                      <div className="flex items-center flex-1 min-w-0">
                                        <span className="text-sm text-gray-700 truncate" title={file.fileName}>
                                          {file.fileName}
                                        </span>
                                      </div>
                                      <button
                                        onClick={() => removeFile(comm.externalCommunicationId, index)}
                                        className="text-red-500 hover:text-red-700 ml-2 flex-shrink-0"
                                        title={t.removeFile}
                                      >
                                        <FaTrash className="h-4 w-4" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <input
                          id={`declaration-${comm.externalCommunicationId}`}
                          type="checkbox"
                          className="h-5 w-5 mt-1 text-green-600 border-gray-300 rounded focus:ring-green-500"
                          checked={agreements[comm.externalCommunicationId] || false}
                          onChange={(e) => setAgreements(prev => ({
                            ...prev,
                            [comm.externalCommunicationId]: e.target.checked
                          }))}
                        />
                        <label htmlFor={`declaration-${comm.externalCommunicationId}`} className="mr-3 ml-3 block text-sm text-gray-700">
                          {t.declaration}
                        </label>
                      </div>
                      <div className="flex justify-start gap-4">
                        <button
                          onClick={onBack}
                          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 font-semibold hover:bg-gray-100"
                        >
                          {t.back}
                        </button>
                        <button
                          onClick={() => handleSubmit(comm)}
                          disabled={
                            !agreements[comm.externalCommunicationId] ||
                            !responses[comm.externalCommunicationId]?.trim() ||
                            isSubmitting[comm.externalCommunicationId] ||
                            isUploading[comm.externalCommunicationId]
                          }
                          className="px-6 py-2 bg-[#1B8354] text-white font-semibold rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-green-700"
                        >
                          {isSubmitting[comm.externalCommunicationId] ? t.submitting : t.submit}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {isResolutionState && (
        <>
          <hr className="section-divider" />
          <section className="complaint-section">
            <div className="flex items-center mb-4">
              <FaCheckCircle className="text-green-600 mr-2 -mt-3" />
              <h3 className="section-title">{t.caseResolution}</h3>
            </div>
            {loadingResolution ? (
              <div className="p-4 text-center text-gray-600">
                <div className="animate-spin inline-block w-6 h-6 border-4 border-green-500 border-t-transparent rounded-full mr-2"></div>
                {t.loadingResolution}
              </div>
            ) : resolutionError ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
                {t.resolutionLoadError}: {resolutionError}
              </div>
            ) : resolutionData ? (
              <div className="info-field full-width">
                <textarea
                  value={resolutionData.subject || ''}
                  disabled
                  className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md text-gray-700 resize-none"
                  rows="4"
                  style={{ cursor: 'not-allowed' }}
                />
              </div>
            ) : null}
          </section>
        </>
      )}

      <div className="bottom-spacer" />
      <button className="back-button" onClick={onBack}>
        {t.back}
      </button>
    </div>
  );
};

export default RegSupportExtComm;