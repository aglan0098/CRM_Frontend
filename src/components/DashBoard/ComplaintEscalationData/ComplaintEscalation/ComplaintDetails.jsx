import React, { useState, useEffect } from 'react';
import './ComplaintDetails.css';
import { FaEye, FaChevronDown, FaChevronUp, FaTimes, FaCheckCircle, FaTrash, FaUpload, FaDownload, FaFile } from 'react-icons/fa';
import FileUploadImage from '@/assets/images/file-upload.png';
import StatusBadge from '../StatusBadge/StatusBadge';
import config from '@/utils/config';
const translations = {
  en: {
    moreInfoNeeded: 'More info needed',
    completeRequiredDetails: 'Please complete the required details below to process your request.',
    complaintEscalation: 'Complaint Escalation',
    complaintInformation: 'Complaint Information',
    complaintTicket: 'Complaint Ticket',
    complaintNumber: 'Complaint Number',
    complaintSubject: 'Complaint Subject',
    region: 'Region',
    relatedEntity: 'Related Entity',
    complaintDescription: 'Complaint Description',
    uploadedFiles: 'Uploaded Files',
    previousCommunications: 'Previous Communications',
    communicationRequest: 'Communication Request',
    requestedInformation: 'Requested Information',
    yourResponse: 'Your Response',
    attachedFiles: 'Attached Files',
    additionalInformationRequired: 'Additional Information Required',
    responseRequired: 'Response Required',
    response: 'Response',
    messagePlaceholder: 'Message...',
    uploadFile: 'Upload file',
    fileUploadUnderDevelopment: 'File upload feature is under development.',
    declaration: 'I declare that all information provided is true and accurate, and I bear full responsibility for the accuracy of this data.',
    cancel: 'Cancel',
    submit: 'Submit',
    submitting: 'Submitting...',
    backToList: 'Back to List',
    acceptDeclarationError: 'Please accept the declaration before submitting.',
    enterResponseError: 'Please enter a response before submitting.',
    responseSubmittedSuccess: 'Response submitted successfully!',
    failedToSubmitError: 'Failed to submit response',
    genericSubmitError: 'An error occurred while submitting your response.',
    serverError: 'Server error occurred. Please try again later.',
    networkError: 'Network error. Please check your connection and try again.',
    caseResolution: 'Case Resolution',
    loadingResolution: 'Loading case resolution...',
    resolutionLoadError: 'Failed to load case resolution data.',
    maxFilesError: 'Maximum 3 files allowed',
    uploadingFile: 'Uploading file...',
    fileUploadError: 'Failed to upload file',
    removeFile: 'Remove file',
    selectFiles: 'Select files to upload (Max 3)',
    downloadFile: 'Download',
    attachedDocuments: 'Attached Documents',
    viewFile: 'View',
    noFilesUploaded: 'No files uploaded',
  },
  ar: {
    moreInfoNeeded: 'مطلوب مزيد من المعلومات',
    completeRequiredDetails: 'يرجى استكمال التفاصيل المطلوبة أدناه لمعالجة طلبك.',
    complaintEscalation: 'تصعيد الشكوى',
    complaintInformation: 'معلومات الشكوى',
    complaintTicket: 'تذكرة الشكوى',
    complaintNumber: 'رقم الشكوى',
    complaintSubject: 'موضوع الشكوى',
    region: 'المنطقة',
    relatedEntity: 'الجهة ذات الصلة',
    complaintDescription: 'وصف الشكوى',
    uploadedFiles: 'الملفات المرفوعة',
    previousCommunications: 'الاتصالات السابقة',
    communicationRequest: 'طلب اتصال',
    requestedInformation: 'المعلومات المطلوبة',
    yourResponse: 'ردك',
    attachedFiles: 'الملفات المرفقة',
    additionalInformationRequired: 'معلومات إضافية مطلوبة',
    responseRequired: 'الرد مطلوب',
    response: 'الرد',
    messagePlaceholder: 'رسالة...',
    uploadFile: 'رفع ملف',
    fileUploadUnderDevelopment: 'ميزة تحميل الملفات قيد التطوير.',
    declaration: 'أقر بأن جميع المعلومات المقدمة صحيحة ودقيقة، وأتحمل المسؤولية الكاملة عن دقة هذه البيانات.',
    cancel: 'إلغاء',
    submit: 'إرسال',
    submitting: 'جارٍ الإرسال...',
    backToList: 'العودة إلى القائمة',
    acceptDeclarationError: 'يرجى قبول الإقرار قبل الإرسال.',
    enterResponseError: 'يرجى إدخال رد قبل الإرسال.',
    responseSubmittedSuccess: 'تم إرسال الرد بنجاح!',
    failedToSubmitError: 'فشل إرسال الرد',
    genericSubmitError: 'حدث خطأ أثناء إرسال ردك.',
    serverError: 'حدث خطأ في الخادم. يرجى المحاولة مرة أخرى في وقت لاحق.',
    networkError: 'خطأ في الشبكة. يرجى التحقق من اتصالك والمحاولة مرة أخرى.',
    caseResolution: 'حل القضية',
    loadingResolution: 'جارٍ تحميل حل القضية...',
    resolutionLoadError: 'فشل في تحميل بيانات حل القضية.',
    maxFilesError: 'الحد الأقصى 3 ملفات مسموح',
    uploadingFile: 'جارٍ رفع الملف...',
    fileUploadError: 'فشل في رفع الملف',
    removeFile: 'إزالة الملف',
    selectFiles: 'اختر الملفات للرفع (الحد الأقصى 3)',
    downloadFile: 'تحميل',
    attachedDocuments: 'المستندات المرفقة',
    viewFile: 'عرض',
    noFilesUploaded: 'لم يتم رفع أي ملفات',
  },
};

const ComplaintDetails = ({ complaint, onBack, language = 'en' }) => {
  if (!complaint) return null;

  const [expandedIndex, setExpandedIndex] = useState(null);
  const [responses, setResponses] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [agreements, setAgreements] = useState({});
  const [showAlert, setShowAlert] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState({});
  const [isUploading, setIsUploading] = useState({});
  const [resolutionData, setResolutionData] = useState(null);
  const [loadingResolution, setLoadingResolution] = useState(false);
  const [resolutionError, setResolutionError] = useState(null);

  const t = translations[language];
  const isResolutionState = complaint.statecode === 1 || complaint.stagename === 'Resolution';

  useEffect(() => {
    const fetchResolutionData = async () => {
      if (!isResolutionState || !complaint.complaintId) return;

      setLoadingResolution(true);
      setResolutionError(null);

      try {
        const response = await fetch(`${config.API_BASE_URL}/api/incident-resolution/subject`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            incidentId: complaint.complaintId
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
  }, [complaint.complaintId, isResolutionState]);

  const toggleAccordion = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
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
        complaintId: complaint.complaintId,
        documents: documents,
        doctypeid: "1987ee13-5c6c-f011-9550-9f1353ac674c"
      };
      console.log('submit data',submitData)
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

  const previousResponses = complaint.externalCommunications
    ?.filter(comm =>
      comm.comstatusCode === 116950004 &&
      comm.response !== null
    )
    ?.map((comm, index) => ({
      title: `${t.communicationRequest}: ${comm.requestedInformation}`,
      date: new Date(comm.createdDate || new Date()).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-GB'),
      response: comm.response || null,
      files: comm.files || [],
      documents: comm.documents || [],
      hasResponse: true,
      isActive: false
    })) || [];

  const activeComms = complaint.externalCommunications
    ?.filter(comm =>
      (comm.comstatusCode === 116950000) &&
      comm.response === null
    )
    ?.map((comm, index) => ({
      title: `${t.responseRequired}: ${comm.requestedInformation}`,
      date: new Date(comm.createdDate || new Date()).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-GB'),
      externalCommunicationId: comm.externalCommunicationId,
      isActive: true
    })) || [];

  return (
    <div className={`complaint-details-wrapper p-6 md:p-8 animate-fadeIn ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      {showAlert && activeComms.length > 0 && (
        <div className="alert-warning">
          <div>
            ⚠️ {t.moreInfoNeeded}: <span>{t.completeRequiredDetails}</span>
          </div>
          <FaTimes className="close-alert" onClick={() => setShowAlert(false)} />
        </div>
      )}
      <div className="complaint-header">
        <h2 className="complaint-title">{t.complaintEscalation}</h2>
        <StatusBadge
          status={complaint.status}
          statusCode={complaint.statusCode}
          stageName={complaint.stagename}
          stateCode={complaint.statecode}
          size="default"
          language={language}
          externalCommunications={complaint.externalCommunications}
        />
      </div>
      <hr className="section-divider" />

      <div className="complaint-section">
        <h3 className="section-title">{t.complaintInformation}</h3>
        <div className="info-grid">
          <div className="info-field">
            <label>SWA Case Number</label>
            <input value={complaint.complaintTicket || ''} disabled />
          </div>
          <div className="info-field">
            <label>Service Provider Ticket Number</label>
            <input value={complaint.complaintNumber || ''} disabled />
          </div>
          <div className="info-field">
            <label>{t.complaintSubject}</label>
            <input value={complaint.subject || ''} disabled />
          </div>
          <div className="info-field">
            <label>{t.region}</label>
            <input value={complaint.regionName || ''} disabled />
          </div>
          <div className="info-field">
            <label>{t.relatedEntity}</label>
            <input value={complaint.relatedAuthorityName || ''} disabled />
          </div>
          <div className="info-field full-width">
            <label>{t.complaintDescription}</label>
            <textarea value={complaint.subjectdescription || ''} disabled rows="3" />
          </div>
          <div className="info-field full-width">
            <label>{t.uploadedFiles}</label>
            <div className="min-h-16 p-3 border border-gray-300 rounded-lg bg-gray-50">
              {complaint.documents && complaint.documents.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {complaint.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200">
                      <div className="flex items-center flex-1 min-w-0">
                        <FaFile className="text-gray-500 mr-2 flex-shrink-0 text-base" />
                        <span className="text-gray-700 font-medium text-sm truncate" title={doc.name}>
                          {doc.name}
                        </span>
                      </div>
                      <div className="flex gap-2 ml-3">
                        <button
                          onClick={() => window.open(doc.documentLink, '_blank')}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-md hover:bg-green-600 hover:text-white transition-all duration-200"
                          title={t.downloadFile}
                        >
                          <FaDownload className="text-xs" />
                          {t.downloadFile}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center py-5 text-gray-500 italic">
                  <FaFile className="mr-2 text-lg" />
                  <span>{t.noFilesUploaded}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <hr className="section-divider" />

      {previousResponses.length > 0 && (
        <>
          <div className="complaint-section">
            <h3 className="section-title">{t.previousCommunications}</h3>
            <div className="accordion">
              {previousResponses.map((item, index) => (
                <div key={index} className="accordion-item">
                  <div className="accordion-header" onClick={() => toggleAccordion(index)}>
                    <div className="accordion-left-icon">
                      {expandedIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                    <span className="accordion-title">{item.title}</span>
                    <span className="accordion-date">{item.date}</span>
                  </div>

                  {expandedIndex === index && (
                    <div className="accordion-body">
                      {item.hasResponse && (
                        <div style={{ marginBottom: '10px' }}>
                          <strong>{t.yourResponse}:</strong>
                          <textarea value={item.response} readOnly />
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
          </div>
          <hr className="section-divider" />
        </>
      )}

      {activeComms.length > 0 && (
        <div className="complaint-section">
          <h4 className="text-xl font-semibold text-gray-700 mb-4">{t.additionalInformationRequired}</h4>
          <div className="accordion">
            {activeComms.map((comm, index) => (
              <div key={comm.externalCommunicationId} className="accordion-item">
                <div className="accordion-header" onClick={() => toggleAccordion(index)}>
                  <div className="accordion-left-icon">
                    {expandedIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                  <span className="accordion-title">{comm.title}</span>
                  <span className="accordion-date">{comm.date}</span>
                </div>

                {expandedIndex === index && (
                  <div className="accordion-body">
                    <div className="p-4 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">{t.response}</label>
                          <textarea
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder={t.messagePlaceholder}
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
                                accept="*/*"
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
                          {t.cancel}
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
        </div>
      )}

      {isResolutionState && (
        <>
          <hr className="section-divider" />
          <div className="complaint-section">
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
          </div>
        </>
      )}

      <div className="bottom-spacer" />
      <button className="back-button" onClick={onBack}>
        {t.backToList}
      </button>
    </div>
  );
};

export default ComplaintDetails;