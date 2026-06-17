import React, { useState, useEffect, useRef } from 'react';
import { FaTimes, FaInfoCircle, FaCheckCircle, FaExclamationCircle, FaSpinner } from 'react-icons/fa';
import FileUploadImage from '@/assets/images/file-upload.png';
import { checkUserExists } from '@/components/Login/Firestore_SMS_CRMAuth/APIs';
// Import both English and Arabic feedback components
import ComplaintFeedbackForm from '@/pages/PublicPages/ComplaintEscalation/ReponseModal'; // English feedback
import ComplaintFeedbackFormArabic from '@/pages/PublicPages/ComplaintEscalation/ReponseModalArabic'; // Arabic feedback
import config from '@/utils/config';
// --- Reusable & Placeholder Components ---

const InfoField = ({ label, value }) => (
  <div>
    <label className="block text-sm font-medium text-gray-500 mb-1">{label}</label>
    <div className="w-full bg-gray-100/70 border border-gray-200 rounded-md p-3 text-base text-gray-900">
      {value}
    </div>
  </div>
);

// Enhanced FormField with Arabic input validation
const FormField = ({ label, placeholder, name, value, onChange, required = false, language = 'en' }) => {
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    
    // If Arabic mode, validate input
    if (language === 'ar') {
      // Allow Arabic letters, numbers (both Arabic and English), spaces, and common punctuation
      const arabicPattern = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF0-9٠-٩\s\-.,!?()]*$/;
      
      if (!arabicPattern.test(inputValue)) {
        // If input contains English letters, prevent the change
        return;
      }
    }
    
    onChange(e);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input 
        type="text" 
        name={name} 
        value={value} 
        onChange={handleInputChange}
        placeholder={placeholder} 
        className="w-full p-3 text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent" 
      />
    </div>
  );
};

// Enhanced FormTextArea with Arabic input validation
const FormTextArea = ({ label, placeholder, name, value, onChange, required = false, rows = 4, language = 'en' }) => {
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    
    // If Arabic mode, validate input
    if (language === 'ar') {
      // Allow Arabic letters, numbers (both Arabic and English), spaces, and common punctuation
      const arabicPattern = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF0-9٠-٩\s\-.,!?()]*$/;
      
      if (!arabicPattern.test(inputValue)) {
        // If input contains English letters, prevent the change
        return;
      }
    }
    
    onChange(e);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea 
        rows={rows} 
        name={name} 
        value={value} 
        onChange={handleInputChange}
        placeholder={placeholder} 
        className="w-full p-3 text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent" 
      />
    </div>
  );
};

const FileUploadBox = ({ label, hint, required = false, files = [], onRemoveFile, footerNote, onFileUpload, uploading = false }) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    selectedFiles.forEach(file => {
      if (onFileUpload) {
        onFileUpload(file);
      }
    });
    e.target.value = ''; // Reset input
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFiles = Array.from(e.dataTransfer.files);
    droppedFiles.forEach(file => {
      if (onFileUpload) {
        onFileUpload(file);
      }
    });
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div 
        className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg text-center bg-gray-50/50 min-h-[200px] hover:border-green-500 transition-colors"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="h-16 mb-3 opacity-80 flex items-center justify-center">
          <img src={FileUploadImage} alt="Upload" className="h-16 opacity-80" />
        </div>
        <p className="text-base text-gray-700 font-semibold">Drag and drop files here to upload</p>
        <p className="text-xs text-gray-500 mt-2 px-2">{hint}</p>
        <button 
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="bg-gray-800 text-white px-5 py-2 text-sm font-semibold rounded-md mt-4 hover:bg-black disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {uploading ? (
            <>
              <FaSpinner className="animate-spin" />
              Uploading...
            </>
          ) : (
            'Browse Files'
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".png,.jpg,.jpeg,.pdf"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
      {footerNote && (
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
          <FaInfoCircle />
          <span>{footerNote}</span>
        </div>
      )}
      <div className="space-y-2 mt-3">
        {files.map((file, index) => (
          <div key={index} className={`flex items-center justify-between p-2 rounded-md text-sm ${
            file.status === 'error' 
            ? 'bg-red-50 border border-red-200 text-red-800' 
            : file.status === 'uploading'
            ? 'bg-blue-50 border border-blue-200 text-blue-800'
            : 'bg-green-50 border border-green-200 text-green-800'
          }`}>
            <div className="flex items-center gap-2">
              {file.status === 'error' ? (
                <FaExclamationCircle />
              ) : file.status === 'uploading' ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaCheckCircle />
              )}
              <span>{file.originalName || file.fileName || file.name}</span>
              {file.status === 'uploading' && <span className="ml-2 text-xs">(Uploading...)</span>}
            </div>
            <button 
              type="button"
              onClick={() => onRemoveFile(index)} 
              className="text-lg hover:opacity-70"
              disabled={file.status === 'uploading'}
            >
              <FaTimes />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Ticket Validation Component ---
const TicketValidationField = ({ t, ticketNumber, setTicketNumber, validateTicket, ticketValidationState, ticketValidationMessage }) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {t.ticketNumber} <span className="text-red-500">*</span>
      </label>
      <div className="flex gap-3 max-w-lg">
        <input
          type="text"
          value={ticketNumber}
          onChange={(e) => setTicketNumber(e.target.value)}
          placeholder="SWA-XXXXX-XXXXX"
          className="flex-1 p-3 text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        <button
          type="button"
          onClick={validateTicket}
          disabled={!ticketNumber.trim() || ticketValidationState === 'validating'}
          className="px-6 py-2 bg-gray-800 text-white font-semibold rounded-md hover:bg-black disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
        >
          {ticketValidationState === 'validating' ? (
            <>
              <FaSpinner className="animate-spin" />
              {t.validating}
            </>
          ) : (
            t.validate
          )}
        </button>
      </div>
      {ticketValidationMessage && (
        <div className={`flex items-center gap-2 text-sm p-2 rounded-md max-w-lg ${
          ticketValidationState === 'success' 
            ? 'text-green-700 bg-green-50' 
            : 'text-orange-700 bg-orange-50'
        }`}>
          {ticketValidationState === 'success' ? (
            <FaCheckCircle className="text-green-600" />
          ) : (
            <FaExclamationCircle className="text-orange-600" />
          )}
          <span>{ticketValidationMessage}</span>
        </div>
      )}
    </div>
  );
};

// --- Helper function to build full Arabic name ---
const buildFullName = (user, language) => {
  if (language === 'ar') {
    // For Arabic, combine firstNameara and lastNameara
    const firstName = user.firstNameara || user.firstName || user.fullName?.split(' ')[0] || '';
    const lastName = user.lastNameara || user.lastName || user.fullName?.split(' ').slice(1).join(' ') || '';
    
    if (firstName || lastName) {
      return `${firstName} ${lastName}`.trim();
    }
  }
  
  // For English or fallback
  return user.fullName || user.name || 
         (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : '') ||
         '';
};

// --- Main Component ---
const RegSupportDetails = ({ onBack, language = 'en' }) => {
  const [formData, setFormData] = useState({ 
    requesterName: '', 
    phone: '', 
    email: '', 
    nationalId: '', 
    entityName: '', 
    supportType: '', 
    description: '',
    previousRequestNumber: '' // Add this new field
  });
  const [attachmentFiles, setAttachmentFiles] = useState([]);
  const [representativeFiles, setRepresentativeFiles] = useState([]);
  const [agree, setAgree] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasPreviousRequest, setHasPreviousRequest] = useState('no');
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);
  const [isUploadingAttachment, setIsUploadingAttachment] = useState(false);
  const [isUploadingRepresentative, setIsUploadingRepresentative] = useState(false);

  // New feedback-related state variables (similar to complaint files)
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');
  const [incidentId, setIncidentId] = useState('');
  const [contactId, setContactId] = useState('');

  // Ticket validation states from old file
  const [ticketNumberValidation, setTicketNumberValidation] = useState('');
  const [ticketValidationState, setTicketValidationState] = useState('idle'); // idle, validating, success, error
  const [ticketValidationMessage, setTicketValidationMessage] = useState('');
  const [parentIncidentId, setParentIncidentId] = useState('');

  // Load user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      setIsLoadingUserData(true);
      console.log('🔍 [USER DATA] Starting to load REAL user data first...');
      
      try {
        // First, try to get REAL user data from localStorage and API
        const userData = JSON.parse(localStorage.getItem('swa_user'));
        console.log('📱 [LOCALSTORAGE] Raw userData:', userData);
        
        if (userData?.userId) {
          console.log('✅ [USER ID FOUND] userId:', userData.userId);
          
          const result = await checkUserExists(userData.userId);
          console.log('📡 [API RESPONSE] checkUserExists result:', result);
          
          const user = result?.user;
          console.log('👤 [USER OBJECT] Extracted user:', user);
          
          if (user) {
            // Build full name based on language
            const fullName = buildFullName(user, language);
            console.log(`👤 [FULL NAME] Built name for ${language}:`, fullName);
            
            const realFormData = {
              requesterName: fullName || userData.fullName || userData.name,
              phone: user.phone || user.phoneNumber || userData.phone || userData.phoneNumber,
              email: user.email || userData.email,
              nationalId: user.nationalId || user.userId || userData.nationalId || userData.userId,
              entityName: user.accountName || user.companyName || user.entityName || userData.accountName || userData.companyName || userData.entityName,
              supportType: '',
              description: '',
              previousRequestNumber: '' // Add this field
            };
            
            console.log('✅ [REAL DATA SUCCESS] Setting real form data:', realFormData);
            setFormData(realFormData);
            return; // Exit early - we got real data
          } else {
            console.log('⚠️ [NO USER OBJECT] User object not found in API result');
            // Try localStorage data as fallback
            if (userData.fullName || userData.name || userData.firstNameara || userData.firstName) {
              const fullName = buildFullName(userData, language);
              const localStorageData = {
                requesterName: fullName || userData.fullName || userData.name,
                phone: userData.phone || userData.phoneNumber || '',
                email: userData.email || '',
                nationalId: userData.nationalId || userData.userId,
                entityName: userData.accountName || userData.companyName || userData.entityName || '',
                supportType: '',
                description: '',
                previousRequestNumber: '' // Add this field
              };
              console.log('🔄 [LOCALSTORAGE FALLBACK] Using localStorage data:', localStorageData);
              setFormData(localStorageData);
              return;
            }
          }
        } else {
          console.log('⚠️ [NO USER ID] No userId found in localStorage');
        }
        
        // If we reach here, real data failed - use dummy data as last resort
        throw new Error('No real user data found');
        
      } catch (error) {
        console.error("❌ [REAL DATA FAILED] Could not load real user data:", error);
        console.log('🎭 [FALLBACK TO DUMMY] Using dummy data as fallback');
        
        // Only use dummy data if real data completely failed
        const dummyData = language === 'ar' ? {
          requesterName: 'أحمد محمد الأحمد',
          phone: '+966501234567', 
          email: 'ahmed.mohammed@company.com',
          nationalId: '1234567890',
          entityName: 'شركة الأحمد المحدودة',
          supportType: '',
          description: '',
          previousRequestNumber: ''
        } : {
          requesterName: 'John Doe',
          phone: '+966501234567', 
          email: 'john.doe@company.com',
          nationalId: '1234567890',
          entityName: 'ABC Company Ltd',
          supportType: '',
          description: '',
          previousRequestNumber: ''
        };
        
        console.log('🎭 [DUMMY DATA] Setting dummy data as last resort:', dummyData);
        setFormData(dummyData);
        
      } finally {
        setIsLoadingUserData(false);
        console.log('🏁 [LOADING COMPLETE] User data loading finished');
      }
    };
    
    loadUserData();
  }, [language]); // Re-run when language changes

  // File upload function with detailed logging
  const uploadFile = async (file, section) => {
    const fileId = `${file.name}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log(`🚀 [UPLOAD START] File: ${file.name}, Section: ${section}, ID: ${fileId}`);
    
    const validateFileType = (file) => {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
      return allowedTypes.includes(file.type);
    };

    if (!validateFileType(file)) {
      console.log(`❌ [VALIDATION FAILED] File: ${file.name}, Type: ${file.type}`);
      alert('Only PNG, JPEG, and PDF files are allowed.');
      return;
    }

    console.log(`✅ [VALIDATION PASSED] File: ${file.name}, Type: ${file.type}, Size: ${file.size} bytes`);

    // Add file to appropriate state with uploading status
    const tempFile = {
      id: fileId,
      name: file.name,
      originalName: file.name,
      status: 'uploading',
      uploadStartTime: Date.now()
    };

    console.log(`📝 [STATE UPDATE] Adding file to ${section} state:`, tempFile);

    if (section === 'attachments') {
      setAttachmentFiles(prev => {
        const newState = [...prev, tempFile];
        console.log(`📊 [ATTACHMENT STATE] Before:`, prev.length, 'After:', newState.length);
        return newState;
      });
      setIsUploadingAttachment(true);
    } else if (section === 'representative') {
      setRepresentativeFiles(prev => {
        const newState = [...prev, tempFile];
        console.log(`📊 [REPRESENTATIVE STATE] Before:`, prev.length, 'After:', newState.length);
        return newState;
      });
      setIsUploadingRepresentative(true);
    }

    try {
      console.log(`🌐 [API CALL] Starting upload for ${file.name} (${fileId})`);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucketType', 'cust');

      const response = await fetch(`${config.API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData
      });

      console.log(`📡 [API RESPONSE] Status: ${response.status}, OK: ${response.ok}, File: ${file.name} (${fileId})`);
      
      const result = await response.json();
      console.log(`📄 [API RESULT] File: ${file.name} (${fileId}):`, result);

      if (response.ok) {
        const uploadedFile = {
          id: fileId,
          fileName: result.fileName,
          url: result.url,
          originalName: file.name,
          status: 'success',
          uploadTime: Date.now() - tempFile.uploadStartTime
        };

        console.log(`✅ [UPLOAD SUCCESS] File: ${file.name} (${fileId}), Time: ${uploadedFile.uploadTime}ms`);

        // Update the file in state using ID to find the correct file
        if (section === 'attachments') {
          setAttachmentFiles(prev => {
            const updatedState = prev.map(f => f.id === fileId ? uploadedFile : f);
            console.log(`🔄 [UPDATE ATTACHMENT] Updated file with ID: ${fileId}`);
            return updatedState;
          });
        } else if (section === 'representative') {
          setRepresentativeFiles(prev => {
            const updatedState = prev.map(f => f.id === fileId ? uploadedFile : f);
            console.log(`🔄 [UPDATE REPRESENTATIVE] Updated file with ID: ${fileId}`);
            return updatedState;
          });
        }
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error) {
      console.error(`❌ [UPLOAD ERROR] File: ${file.name} (${fileId}):`, error);
      
      // Update file status to error using ID
      const errorFile = {
        id: fileId,
        name: file.name,
        originalName: file.name,
        status: 'error',
        error: error.message
      };

      if (section === 'attachments') {
        setAttachmentFiles(prev => {
          const updatedState = prev.map(f => f.id === fileId ? errorFile : f);
          console.log(`💥 [ERROR UPDATE ATTACHMENT] Updated file with ID: ${fileId}`);
          return updatedState;
        });
      } else if (section === 'representative') {
        setRepresentativeFiles(prev => {
          const updatedState = prev.map(f => f.id === fileId ? errorFile : f);
          console.log(`💥 [ERROR UPDATE REPRESENTATIVE] Updated file with ID: ${fileId}`);
          return updatedState;
        });
      }
    } finally {
      console.log(`🏁 [UPLOAD END] File: ${file.name} (${fileId})`);
      
      // Check if there are any more uploading files before setting loading to false
      setTimeout(() => {
        if (section === 'attachments') {
          setAttachmentFiles(current => {
            const stillUploading = current.some(f => f.status === 'uploading');
            console.log(`🔍 [CHECK ATTACHMENT UPLOADING] Still uploading: ${stillUploading}`);
            if (!stillUploading) {
              setIsUploadingAttachment(false);
              console.log(`🔴 [ATTACHMENT LOADING OFF] All uploads completed`);
            }
            return current;
          });
        } else if (section === 'representative') {
          setRepresentativeFiles(current => {
            const stillUploading = current.some(f => f.status === 'uploading');
            console.log(`🔍 [CHECK REPRESENTATIVE UPLOADING] Still uploading: ${stillUploading}`);
            if (!stillUploading) {
              setIsUploadingRepresentative(false);
              console.log(`🔴 [REPRESENTATIVE LOADING OFF] All uploads completed`);
            }
            return current;
          });
        }
      }, 100);
    }
  };

  // Build docs structure for submission
  const buildDocsStructure = () => {
    console.log('🏗️ [BUILD DOCS] Starting to build docs structure');
    
    const docs1 = {};
    const docs2 = {};
    
    // Filter successful attachment files
    const successfulAttachments = attachmentFiles.filter(file => file.status === 'success');
    console.log(`📎 [DOCS1] Found ${successfulAttachments.length} successful attachment files:`, successfulAttachments);
    
    successfulAttachments.forEach((file, index) => {
      const docKey = `supporting_doc${index + 1}`;
      docs1[docKey] = {
        fileName: file.fileName,
        url: file.url
      };
      console.log(`📄 [DOCS1] Added ${docKey}:`, docs1[docKey]);
    });
    
    // Filter successful representative files
    const successfulRepresentative = representativeFiles.filter(file => file.status === 'success');
    console.log(`📋 [DOCS2] Found ${successfulRepresentative.length} successful representative files:`, successfulRepresentative);
    
    successfulRepresentative.forEach((file, index) => {
      const docKey = `required_doc${index + 1}`;
      docs2[docKey] = {
        fileName: file.fileName,
        url: file.url
      };
      console.log(`📄 [DOCS2] Added ${docKey}:`, docs2[docKey]);
    });
    
    const finalDocs = { docs1, docs2 };
    console.log('🎯 [FINAL DOCS STRUCTURE]:', finalDocs);
    console.log('📦 [DOCS1 PAYLOAD]:', JSON.stringify(docs1, null, 2));
    console.log('📦 [DOCS2 PAYLOAD]:', JSON.stringify(docs2, null, 2));
    
    return finalDocs;
  };

  // Get total successful files count
  const getTotalSuccessfulFiles = () => {
    const attachmentCount = attachmentFiles.filter(f => f.status === 'success').length;
    const representativeCount = representativeFiles.filter(f => f.status === 'success').length;
    const total = attachmentCount + representativeCount;
    console.log(`📊 [FILE COUNT] Attachments: ${attachmentCount}, Representative: ${representativeCount}, Total: ${total}`);
    return total;
  };

  // Ticket validation function from old file
  const validateTicket = async () => {
    if (!ticketNumberValidation.trim()) return;

    console.log('🎫 [TICKET VALIDATION] Starting validation for:', ticketNumberValidation);
    setTicketValidationState('validating');
    setTicketValidationMessage('');

    try {
      const payload = {
        ticketNumber: ticketNumberValidation.trim(),
        caseTypeId: "b90a0bc7-d125-f011-9544-a163bb4a4376",
        caseCategoryId: "ad81e3b9-7129-f011-9544-a163bb4a4376"
      };

      console.log('📦 [TICKET API] Sending payload:', payload);

      const response = await fetch(`${config.API_BASE_URL}/api/regulatoryparent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      console.log('📡 [TICKET API] Response:', result);

      if (response.ok && result.success) {
        console.log('✅ [TICKET VALIDATION] Success - Incident ID:', result.incidentId);
        setTicketValidationState('success');
        setTicketValidationMessage(currentLang.ticketValid || 'Ticket is valid');
        setParentIncidentId(result.incidentId);
      } else {
        console.log('❌ [TICKET VALIDATION] Failed:', result);
        setTicketValidationState('error');
        setTicketValidationMessage(currentLang.ticketInvalid || 'Ticket is invalid');
        setParentIncidentId('');
      }
    } catch (error) {
      console.error('💥 [TICKET VALIDATION] Error:', error);
      setTicketValidationState('error');
      setTicketValidationMessage(currentLang.ticketInvalid || 'Ticket is invalid');
      setParentIncidentId('');
    }
  };

  // Reset ticket validation when hasPreviousRequest changes
  useEffect(() => {
    if (hasPreviousRequest === 'no') {
      setTicketNumberValidation('');
      setTicketValidationState('idle');
      setTicketValidationMessage('');
      setParentIncidentId('');
    }
  }, [hasPreviousRequest]);

  // New feedback handlers (similar to complaint files)
  const handleFeedbackSubmit = (feedbackData) => {
    console.log('Feedback received:', feedbackData);
    // You can add API call here to send feedback to backend
    setShowSuccessModal(false);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    if (onBack) onBack();
  };

  const t = {
    en: {
        requestTitle: 'Request Regulatory Support', requesterName: 'Name of Requester', phone: 'Phone Number', email: 'Official Email', nationalId: 'National ID', entityName: 'Entity Name', supportType: 'Type Of Organizational Support', description: 'Description of the Request', attachments: 'Related Attachments Of Request', repLetter: 'Official Representative letter', combinePdfHint: 'Combine all your files in 1 PDF document.', prevRequest: 'Is there a previous request?', yes: 'Yes', no: 'No', responseLabel: 'Response', responsePlaceholder: 'Message...', uploadFile: 'Upload File', uploadHint: 'Maximum file size allowed is 2MB, supported file formats include .jpg, .png, and .pdf.', declaration: 'I declare that all information provided is true and accurate, and I bear full responsibility for the accuracy of this data', back: 'Back', submit: 'Submit', saveAsDraft: 'Save as Draft', submitting: 'Submitting...', modalTitle: 'Confirm Your Submission', modalQ1: 'Entity Name', modalQ2: 'Type of Support', modalQ3: 'Number of Attachments', modalFiles: 'Files', cancel: 'Cancel',
        ticketNumber: 'Previous Ticket Number', validate: 'Validate', validating: 'Validating...', ticketValid: 'Ticket is valid', ticketInvalid: 'Ticket is invalid or not found',
    },
    ar: {
        requestTitle: 'طلب دعم تنظيمي', requesterName: 'اسم مقدم الطلب', phone: 'رقم الجوال', email: 'البريد الإلكتروني الرسمي', nationalId: 'رقم الهوية الوطنية', entityName: 'اسم المنشأة', supportType: 'نوع الدعم التنظيمي', description: 'وصف الطلب', attachments: 'المرفقات ذات الصلة بالطلب', repLetter: 'خطاب الممثل الرسمي', combinePdfHint: 'اجمع كل ملفاتك في مستند PDF واحد.', prevRequest: 'هل يوجد طلب سابق؟', yes: 'نعم', no: 'لا', responseLabel: 'الرد', responsePlaceholder: 'رسالة...', uploadFile: 'رفع ملف', uploadHint: 'الحد الأقصى لحجم الملف هو 2 ميجابايت. الصيغ المدعومة: jpg, .png, .pdf.', declaration: 'أقر بأن جميع المعلومات المقدمة صحيحة ودقيقة، وأتحمل المسؤولية الكاملة عن دقة هذه البيانات', back: 'رجوع', submit: 'إرسال', saveAsDraft: 'حفظ كمسودة', submitting: 'جارٍ الإرسال...', modalTitle: 'تأكيد الإرسال', modalQ1: 'اسم المنشأة', modalQ2: 'نوع الدعم', modalQ3: 'عدد المرفقات', modalFiles: 'ملفات', cancel: 'إلغاء',
        ticketNumber: 'رقم التذكرة السابقة', validate: 'تحقق', validating: 'جارٍ التحقق...', ticketValid: 'التذكرة صحيحة', ticketInvalid: 'التذكرة غير صحيحة أو غير موجودة',
    },
  };

  const currentLang = t[language] || t.en;
  const totalFiles = getTotalSuccessfulFiles();
  const isSubmitEnabled = agree && !isSubmitting;
  
  const handleInputChange = (e) => { 
    const { name, value } = e.target; 
    console.log(`📝 [FORM INPUT] Field: ${name}, Value: ${value}`);
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      console.log(`📊 [FORM DATA UPDATE] Updated formData:`, newData);
      return newData;
    }); 
  };
  
  const handleRemoveAttachmentFile = (indexToRemove) => { 
    console.log(`🗑️ [REMOVE ATTACHMENT] Removing file at index: ${indexToRemove}`);
    setAttachmentFiles(files => {
      const newFiles = files.filter((_, index) => index !== indexToRemove);
      console.log(`📊 [ATTACHMENT FILES] Before: ${files.length}, After: ${newFiles.length}`);
      console.log(`📋 [ATTACHMENT LIST]`, newFiles.map(f => ({ name: f.originalName || f.name, status: f.status })));
      return newFiles;
    }); 
  };
  
  const handleRemoveRepresentativeFile = (indexToRemove) => { 
    console.log(`🗑️ [REMOVE REPRESENTATIVE] Removing file at index: ${indexToRemove}`);
    setRepresentativeFiles(files => {
      const newFiles = files.filter((_, index) => index !== indexToRemove);
      console.log(`📊 [REPRESENTATIVE FILES] Before: ${files.length}, After: ${newFiles.length}`);
      console.log(`📋 [REPRESENTATIVE LIST]`, newFiles.map(f => ({ name: f.originalName || f.name, status: f.status })));
      return newFiles;
    }); 
  };
  
  const handleDirectSubmit = async () => {
    console.log('🚀 [FORM SUBMISSION] Starting direct form submission process');
    setIsSubmitting(true);
    
    try {
      // Get user data from localStorage
      const userData = JSON.parse(localStorage.getItem('swa_user'));
      if (!userData?.userId) {
        throw new Error('User data not found');
      }
      
      // Build the final payload
      const docsStructure = buildDocsStructure();
      
      const apiPayload = {
        description: formData.description,
        customerid: userData.userId,
        typeOfOrganizationalSupport: formData.supportType,
        previousRequest: hasPreviousRequest === 'yes' ? true : false,
        ...(hasPreviousRequest === 'yes' && parentIncidentId && {
          parentIncidentId: parentIncidentId
        }),
        docs1: Object.keys(docsStructure.docs1).length > 0 ? docsStructure.docs1 : {},
        docs2: docsStructure.docs2
      };
      
      console.log('📦 [API PAYLOAD] Sending to backend:', apiPayload);
      
      // Make API call
      const response = await fetch(`${config.API_BASE_URL}/api/regulatory-support`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPayload)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('✅ [API SUCCESS] Response data:', result);
      
      // Extract all required data from API response
      const responseTicketNumber = result.data?.ticketNumber || result.ticketNumber || null;
      const responseIncidentId = result.data?.incidentId || result.incidentId || null; 
      const responseContactId = result.data?.contactId || result.contactId || null;
      
      console.log('🎫 [EXTRACTED DATA] Ticket:', responseTicketNumber, 'Incident:', responseIncidentId, 'Contact:', responseContactId);
      
      // Set extracted data to state
      setTicketNumber(responseTicketNumber);
      setIncidentId(responseIncidentId);
      setContactId(responseContactId);
      
      // Show feedback modal
      setShowSuccessModal(true);
      
    } catch (error) {
      console.error('❌ [SUBMISSION ERROR]:', error);
      alert(`Submission failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="w-full bg-white rounded-md shadow-lg p-6 md:p-8 animate-fadeIn space-y-8 font-['IBM_Plex_Sans_Arabic']">
      
      <div>
        <div className="pb-4 mb-6 border-b"><h2 className="text-2xl font-bold text-gray-800">{currentLang.requestTitle}</h2></div>
        <div className="space-y-6">
          {isLoadingUserData ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B8354]"></div>
              <p className="mt-2 text-gray-600">Loading user data...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <InfoField label={currentLang.requesterName} value={formData.requesterName} />
              <InfoField label={currentLang.phone} value={formData.phone} />
              <InfoField label={currentLang.email} value={formData.email} />
              <InfoField label={currentLang.nationalId} value={formData.nationalId} />
              <div className="md:col-span-2"><InfoField label={currentLang.entityName} value={formData.entityName} /></div>
              <FormField 
                name="supportType" 
                value={formData.supportType} 
                onChange={handleInputChange} 
                label={currentLang.supportType} 
                placeholder="Enter text" 
                required={true} 
                language={language}
              />
              <div className="md:col-span-2">
                <FormTextArea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  label={currentLang.description} 
                  placeholder="Enter text" 
                  required={true} 
                  language={language}
                />
              </div>
              <FileUploadBox 
                label={currentLang.attachments} 
                hint={currentLang.uploadHint} 
                files={attachmentFiles}
                onRemoveFile={handleRemoveAttachmentFile}
                onFileUpload={(file) => uploadFile(file, 'attachments')}
                uploading={isUploadingAttachment}
              />
              <FileUploadBox 
                label={currentLang.repLetter} 
                hint={currentLang.uploadHint} 
                required={true} 
                footerNote={currentLang.combinePdfHint} 
                files={representativeFiles} 
                onRemoveFile={handleRemoveRepresentativeFile}
                onFileUpload={(file) => uploadFile(file, 'representative')}
                uploading={isUploadingRepresentative}
              />
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">{currentLang.prevRequest}</label>
                <div className="flex items-center gap-x-8 mb-4">
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      id="prevReqYes" 
                      name="prevRequest" 
                      value="yes" 
                      checked={hasPreviousRequest === 'yes'} 
                      onChange={(e) => {
                        console.log(`🔘 [PREVIOUS REQUEST] Changed to: ${e.target.value}`);
                        setHasPreviousRequest(e.target.value);
                      }} 
                      className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500" 
                    />
                    <label htmlFor="prevReqYes" className="ltr:ml-2 rtl:mr-2 text-base text-gray-800">
                      {currentLang.yes}
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      id="prevReqNo" 
                      name="prevRequest" 
                      value="no" 
                      checked={hasPreviousRequest === 'no'} 
                      onChange={(e) => {
                        console.log(`🔘 [PREVIOUS REQUEST] Changed to: ${e.target.value}`);
                        setHasPreviousRequest(e.target.value);
                      }} 
                      className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500" 
                    />
                    <label htmlFor="prevReqNo" className="ltr:ml-2 rtl:mr-2 text-base text-gray-800">
                      {currentLang.no}
                    </label>
                  </div>
                </div>
                
                {/* Ticket Number Validation Field - Only show when "Yes" is selected */}
                {hasPreviousRequest === 'yes' && (
                  <TicketValidationField
                    t={currentLang}
                    ticketNumber={ticketNumberValidation}
                    setTicketNumber={setTicketNumberValidation}
                    validateTicket={validateTicket}
                    ticketValidationState={ticketValidationState}
                    ticketValidationMessage={ticketValidationMessage}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-start mb-6">
            <input id="declaration" type="checkbox" checked={agree} onChange={(e) => {
              console.log(`☑️ [DECLARATION] Checkbox changed to: ${e.target.checked}`);
              setAgree(e.target.checked);
            }} className="h-5 w-5 mt-0.5 ltr:mr-3 rtl:ml-3 text-green-600 border-gray-400 rounded focus:ring-green-500" />
            <label htmlFor="declaration" className="block text-base text-gray-800">{currentLang.declaration}</label>
        </div>
        <div className="flex items-center gap-4">
            <button onClick={() => onBack && onBack()} className="px-6 py-2 border border-gray-300 rounded-md text-gray-900 font-semibold hover:bg-gray-100 transition-colors">{currentLang.back}</button>
            <button onClick={handleDirectSubmit} disabled={!isSubmitEnabled} className={`px-6 py-2 text-white font-semibold rounded-md transition-colors ${isSubmitEnabled ? 'bg-[#1B8354] hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}>{isSubmitting ? currentLang.submitting : currentLang.submit}</button>
            <button className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 transition-colors">{currentLang.saveAsDraft}</button>
        </div>
      </div>

      {/* Conditionally render feedback modal based on language */}
      {language === 'ar' ? (
        <ComplaintFeedbackFormArabic
          isVisible={showSuccessModal}
          onClose={handleCloseModal}
          ticketNumber={ticketNumber}
          incidentId={incidentId}
          contactId={contactId}
          onSubmit={handleFeedbackSubmit}
        />
      ) : (
        <ComplaintFeedbackForm
          isVisible={showSuccessModal}
          onClose={handleCloseModal}
          ticketNumber={ticketNumber}
          incidentId={incidentId}
          contactId={contactId}
          onSubmit={handleFeedbackSubmit}
        />
      )}

    </div>
  );
};

export default RegSupportDetails;