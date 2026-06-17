// ComplaintEscalationFormCard_Updated.jsx - Self-contained file handling with ComplaintActionsSection
import React, { useState } from 'react';
import { useTranslation } from './TranslationContext';
import FileUpload from './FileUpload';
import CaseResolution from './CaseResolution';
import ComplaintActionsSection from './ComplaintActionsSection';
import config from "@/utils/config";
import sessionManager from '@/utils/sessionManager';
const ComplaintEscalationFormCard = ({ 
  complaintData, 
  onBack, 
  response, 
  setResponse, 
  isResolved, 
  setIsResolved, 
  disableCollapsible = false 
}) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  
  // MOVED: File handling is now internal to this component
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [showDraftSuccessBanner, setShowDraftSuccessBanner] = useState(false);
  const [isDraftLoading, setIsDraftLoading] = useState(false);
  const API_BASE_URL = `${config.API_BASE_URL}`;
  const defaultRequiredInfo = complaintData?.requiredInfo?.length > 0 ? complaintData.requiredInfo : [
    t('nationalId'),
    t('waterBill')
  ];

  // INTERNAL: Handle file uploads within this component
  const handleFileUpload = (uploadResults) => {
    console.log('📁 FileUpload Results in FormCard:', uploadResults);
    setUploadedFiles(uploadResults);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Fetch Draft API - Load existing draft when component mounts
  const fetchDraft = async () => {
    const externalCommunicationId = complaintData?.externalCommunicationId;
    
    if (!externalCommunicationId) {
      console.log('⚠️ No externalCommunicationId found, skipping draft fetch');
      return;
    }

    setIsDraftLoading(true);
    
    try {
      console.log('🔍 Fetching draft for externalCommunicationId:', externalCommunicationId);
      let sessionHeaders = sessionManager.getSessionHeaders();
      const response = await fetch(`${API_BASE_URL}/api/draft/${externalCommunicationId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...sessionHeaders //
        }
      });

      console.log('📡 Fetch Draft API Response status:', response.status);

      if (!response.ok) {
        if (response.status === 404) {
          console.log('ℹ️ No draft found for this case');
          return;
        }
        throw new Error(`Failed to fetch draft: ${response.status}`);
      }

      const result = await response.json();
      console.log('📥 Draft fetched successfully:', result);

      // Check if draft data exists and populate the form
      if (result.success && result.data && result.data.draftData) {
        const { responseText, documents } = result.data.draftData;
        
        // Pre-fill the response textarea
        if (responseText) {
          console.log('✏️ Pre-filling response text:', responseText);
          setResponse(responseText);
        }
        
        // Pre-fill the uploaded files
        if (documents && documents.length > 0 && documents[0]) {
          console.log('📎 Pre-filling uploaded files:', documents[0]);
          setUploadedFiles(documents[0]);
        }
        
        console.log('✅ Draft loaded and form pre-filled successfully');
      }
      
    } catch (error) {
      console.error('💥 Error fetching draft:', error);
      // Don't show alert for fetch errors - just log them
    } finally {
      setIsDraftLoading(false);
    }
  };

  // Fetch draft when component mounts
  React.useEffect(() => {
    fetchDraft();
  }, [complaintData?.externalCommunicationId]);

  // Delete Draft API - Remove draft after successful submission
  const deleteDraft = async () => {
    const externalCommunicationId = complaintData?.externalCommunicationId;
    
    if (!externalCommunicationId) {
      console.log('⚠️ No externalCommunicationId found, skipping draft deletion');
      return;
    }

    try {
      console.log('🗑️ Deleting draft for externalCommunicationId:', externalCommunicationId);
      let sessionHeaders = sessionManager.getSessionHeaders();
      const response = await fetch(`${API_BASE_URL}/api/draft/${externalCommunicationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...sessionHeaders //
        }
      });

      console.log('📡 Delete Draft API Response status:', response.status);

      if (!response.ok) {
        if (response.status === 404) {
          console.log('ℹ️ No draft found to delete');
          return;
        }
        throw new Error(`Failed to delete draft: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Draft deleted successfully:', result);
      
    } catch (error) {
      console.error('💥 Error deleting draft:', error);
      // Don't fail the submission if draft deletion fails
    }
  };

  // INTERNAL: Get all form data including files - matching API structure
  const getFormData = () => {
    // Determine docTypeId based on requestType
    let docTypeId;
    const requestType = complaintData?.requestType;
    
    if (requestType === 'General Complaint') {
      docTypeId = '1987ee13-5c6c-f011-9550-9f1353ac674c'; // Replace with your actual internal complaint doctype ID
    } else if (requestType === 'Inquiries') {
      docTypeId = '0d174d1c-5c6c-f011-9550-9f1353ac674c'; // Replace with your actual complaint inquiry doctype ID
    } else if (requestType === 'Complaint Escalation') {
      docTypeId = '1987ee13-5c6c-f011-9550-9f1353ac674c'; // Replace with your actual complaint escalation doctype ID
    } else {
      docTypeId = complaintData?.requestType || 'DEFAULT_DOCTYPE_ID';
    }

    return {
      complaintId: complaintData?.caseId,
      docTypeId: docTypeId,
      documents: uploadedFiles,
      externalCommunicationId: complaintData?.externalCommunicationId,
      responseText: response
    };
  };

  // API submission function for this specific form
  const handleSubmitForm = async () => {
    console.log('🚀 SUBMIT BUTTON CLICKED');
    
    const validation = validateForm();
    console.log('📋 Validation result:', validation);
    
    if (!validation.isValid) {
      console.log('❌ Validation failed:', validation.errors);
      alert(`Please fix the following errors:\n${validation.errors.join('\n')}`);
      return;
    }

    if (!declarationAccepted) {
      console.log('❌ Declaration not accepted');
      alert('Please check the declaration checkbox');
      return;
    }

    const formData = getFormData();
    console.log('📦 Form data structure:', formData);
    console.log('📦 Form data JSON:', JSON.stringify(formData, null, 2));
    console.log('📂 Documents object:', formData.documents);
    console.log('📂 Documents keys:', Object.keys(formData.documents));
    
    setIsSubmitting(true);
    
    try {
      console.log('🌐 Making API call to:', 'https://swacrmportal-dev-be.swa.gov.sa/api/insert-response');
      console.log('📤 Request body being sent:', JSON.stringify(formData, null, 2));
      let sessionHeaders = sessionManager.getSessionHeaders();
      // Your actual API endpoint
      const response = await fetch(`${API_BASE_URL}/api/insert-response`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...sessionHeaders //
        },
        body: JSON.stringify(formData)
      });

      console.log('📡 API Response status:', response.status);
      console.log('📡 API Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error response:', errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('📥 API Response body:', result);
      console.log('✅ Success field:', result.success);
      
      // Check for success in response
      if (result.success === true) {
  console.log('🎉 Form submitted successfully:', result);
  
  // Delete the draft after successful submission
  await deleteDraft();
  
  // Show banner instead of alert
  setShowSuccessBanner(true);
  
  // Hide banner after 5 seconds and refresh page
  setTimeout(() => {
    setShowSuccessBanner(false);
    window.location.reload(); // This will refresh the page and make back button work
    // onBack();
  }, 5000);
  
} else {
  console.error('❌ API returned success: false', result);
  throw new Error(result.message || 'Submission failed');
}
      
    } catch (error) {
      console.error('💥 Form submission error:', error);
      alert(`Failed to submit form: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      console.log('🔄 Submit process completed, isSubmitting set to false');
    }
  };

  // Save as draft function
  const handleSaveAsDraft = async () => {
    // Prepare draft data in the required format
    const draftPayload = {
      extComm_id: complaintData?.externalCommunicationId,
      draftData: {
        responseText: response,
        documents: [uploadedFiles] // uploadedFiles object wrapped in an array
      }
    };
    
    try {
      console.log('💾 Saving draft:', draftPayload);
      console.log('📤 Draft request body:', JSON.stringify(draftPayload, null, 2));
      let sessionHeaders = sessionManager.getSessionHeaders();
      // Draft API endpoint
      const draftResponse = await fetch(`${API_BASE_URL}/api/draft`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...sessionHeaders //
        },
        body: JSON.stringify(draftPayload)
      });

      console.log('📡 Draft API Response status:', draftResponse.status);

      if (!draftResponse.ok) {
        const errorText = await draftResponse.text();
        console.error('❌ Draft API Error response:', errorText);
        throw new Error(`Draft Save Error: ${draftResponse.status} - ${errorText}`);
      }

      const result = await draftResponse.json();
      console.log('✅ Draft saved successfully:', result);
      
      // Show draft success banner
      setShowDraftSuccessBanner(true);
      
      // Hide banner after 5 seconds (no page refresh)
      setTimeout(() => {
        setShowDraftSuccessBanner(false);
      }, 5000);
      
    } catch (error) {
      console.error('💥 Draft save error:', error);
      alert(`Failed to save draft: ${error.message}`);
    }
  };
  const validateForm = () => {
  const errors = [];
  
  // Check if response is empty or only whitespace
  if (!response || response.trim() === '') {
    errors.push('Response text is required');
  }
  // Check if response is within 1-500 character limit
  else if (response.trim().length < 1) {
    errors.push('Response must contain at least 1 character');
  }
  else if (response.trim().length > 500) {
    errors.push(`Response must not exceed 500 characters. Current: ${response.trim().length} characters`);
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

  // Expose form data and validation to parent if needed (optional)
  React.useEffect(() => {
    // You can add a callback prop to send data to parent when needed
    if (complaintData?.onFormDataChange) {
      const formData = getFormData();
      const validation = validateForm();
      
      complaintData.onFormDataChange({
        ...formData,
        validation: validation
      });
    }
  }, [response, uploadedFiles]);

  // If resolved, show case resolution instead of form
  if (isResolved) {
    return (
      <div style={{ 
        padding: '32px', 
        background: 'white', 
        borderRadius: '12px', 
        border: '1px solid #e5e7eb', 
        boxShadow: '0 4px 8px -2px rgba(16, 24, 40, 0.1), 0 2px 4px -2px rgba(16, 24, 40, 0.06)' 
      }}>
        <CaseResolution 
          resolution={complaintData?.resolution}
          onBack={onBack}
        />
      </div>
    );
  }

   // Show the More info needed form - with or without collapsible wrapper
   if (disableCollapsible) {
     // Simple form content without collapsible wrapper (for use inside other collapsible cards)
     return (
       <div>
         {/* Loading Draft Indicator */}
         {isDraftLoading && (
           <div style={{
             padding: '12px',
             backgroundColor: '#e3f2fd',
             color: '#1976d2',
             borderRadius: '8px',
             marginBottom: '16px',
             textAlign: 'center',
             fontSize: '14px',
             fontWeight: '500'
           }}>
             🔄 Loading saved draft...
           </div>
         )}

        {/* Success Banner */}
        {showSuccessBanner && (
          <div style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#28a745',
            color: 'white',
            padding: '16px 32px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
            fontSize: '16px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.25 6.25L8.125 14.375L3.75 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Form submitted successfully! Going back to dashboard...
          </div>
        )}

        {/* Draft Success Banner */}
        {showDraftSuccessBanner && (
          <div style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#28a745',
            color: 'white',
            padding: '16px 32px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
            fontSize: '16px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.25 6.25L8.125 14.375L3.75 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Draft saved successfully!
          </div>
        )}

        <div className="complaint-more-info-title">{complaintData?.heading || t('moreInfoNeeded')}:</div>
         <div className="complaint-more-info-list">
           <ul>
             {defaultRequiredInfo.map((item, index) => (
               <li key={index}>{item}</li>
             ))}
           </ul>
         </div>

         <div className="complaint-form-row">
           <div className="complaint-textarea-group">
             <label className="complaint-textarea-label">
               <span className="complaint-required-asterisk">*</span> {t('response')}
             </label>
             <textarea 
               className={`complaint-response-textarea ${
                 response && validateForm().errors.length > 0 ? 'error' : 
                 response && validateForm().isValid ? 'valid' : ''
               }`}
               placeholder={t('messagePlaceholder')}
               value={response}
               onChange={(e) => setResponse(e.target.value)}
               maxLength={500} // HTML attribute to prevent typing beyond 500 chars
             />
             {/* Validation Error Messages */}
             <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '4px',
    fontSize: '12px'
  }}>
    {/* Validation Error Messages */}
    <div style={{ color: '#dc3545' }}>
      {response && validateForm().errors.length > 0 && validateForm().errors[0]}
    </div>
    
    {/* Character Count */}
    <div style={{ 
      color: response && response.trim().length > 450 ? '#dc3545' : '#6c757d',
      fontWeight: response && response.trim().length > 450 ? '500' : 'normal'
    }}>
      {response ? response.trim().length : 0}/500 characters
    </div>
  </div>
           </div>

           {/* INTERNAL: FileUpload now uses internal state */}
           <FileUpload 
             onFileUpload={handleFileUpload} 
             uploadedFiles={uploadedFiles} 
           />
         </div>

        {/* ComplaintActionsSection for this specific form */}
        <ComplaintActionsSection
          declarationAccepted={declarationAccepted}
          setDeclarationAccepted={setDeclarationAccepted}
          onBack={onBack}
          onSubmit={handleSubmitForm}
          onSaveAsDraft={handleSaveAsDraft}
          isSubmitting={isSubmitting}
        />

         

         {/* OPTIONAL: Debug info for development */}
         {/* {process.env.NODE_ENV === 'development' && (
           <div style={{ marginTop: '10px', padding: '10px', background: '#f0f0f0', fontSize: '12px' }}>
             <strong>Form Data:</strong>
             <pre>{JSON.stringify(getFormData(), null, 2)}</pre>
           </div>
         )} */}
       </div>
     );
   }

   // Show the More info needed form with collapsible chevron (standalone usage)
   return (
     <div className="moreinfo-collapsible-card">
       {/* Loading Draft Indicator */}
       {isDraftLoading && (
         <div style={{
           padding: '12px',
           backgroundColor: '#e3f2fd',
           color: '#1976d2',
           borderRadius: '8px',
           marginBottom: '16px',
           textAlign: 'center',
           fontSize: '14px',
           fontWeight: '500'
         }}>
           🔄 Loading saved draft...
         </div>
       )}

      {/* Success Banner */}
      {showSuccessBanner && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#28a745',
          color: 'white',
          padding: '16px 32px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          zIndex: 1000,
          fontSize: '16px',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.25 6.25L8.125 14.375L3.75 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Form submitted successfully! Going back to dashboard...
        </div>
      )}

      {/* Draft Success Banner */}
      {showDraftSuccessBanner && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#28a745',
          color: 'white',
          padding: '16px 32px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          zIndex: 1000,
          fontSize: '16px',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.25 6.25L8.125 14.375L3.75 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Draft saved successfully!
        </div>
      )}

      {/* Collapsible Header */}
       <div className="moreinfo-header" onClick={toggleExpanded}>
         <div className={`moreinfo-chevron ${isExpanded ? 'moreinfo-expanded' : 'moreinfo-collapsed'}`}>
           <svg xmlns="http://www.w3.org/2000/svg" width="9" height="6" viewBox="0 0 9 6" fill="none">
             <path d="M0.902478 0.703524C0.983736 0.811106 1.22634 1.13227 1.37083 1.31741C1.66021 1.68822 2.05561 2.18094 2.48215 2.67221C2.91085 3.16595 3.36119 3.64681 3.76126 4.00031C3.96187 4.17756 4.13809 4.31225 4.28351 4.39992C4.42028 4.48237 4.50107 4.49951 4.50107 4.49951C4.50107 4.49951 4.57949 4.48236 4.71625 4.39992C4.86167 4.31225 5.03789 4.17757 5.2385 4.00031C5.63858 3.64682 6.08892 3.16595 6.51761 2.6722C6.94415 2.18093 7.33955 1.6882 7.62894 1.31739C7.77342 1.13224 8.01569 0.811535 8.09695 0.703952C8.2607 0.481603 8.57404 0.433646 8.79639 0.597401C9.01874 0.761156 9.06623 1.07415 8.90248 1.2965L8.9013 1.29806C8.81618 1.41077 8.56477 1.74363 8.41729 1.93261C8.12137 2.3118 7.71441 2.81907 7.27271 3.32781C6.83316 3.83406 6.34938 4.35319 5.90064 4.74969C5.67684 4.94744 5.44998 5.12525 5.23253 5.25634C5.02882 5.37915 4.77089 5.5 4.49988 5.5C4.22887 5.5 3.97095 5.37914 3.76723 5.25633C3.54979 5.12525 3.32293 4.94744 3.09913 4.74969C2.65038 4.35319 2.1666 3.83406 1.72705 3.32782C1.28535 2.81909 0.878398 2.31182 0.582479 1.93264C0.434942 1.74359 0.183627 1.41086 0.0985969 1.29828L0.0975196 1.29686C-0.0662368 1.07451 -0.0189732 0.761191 0.203374 0.597435C0.425715 0.433684 0.738717 0.481194 0.902478 0.703524Z" fill="currentColor"/>
           </svg>
         </div>
         <div className="moreinfo-title">{complaintData?.heading || t('moreInfoNeeded')}</div>
         <div className="moreinfo-date">{new Date().toLocaleDateString()}</div>
       </div>

       {/* Collapsible Content */}
       <div className={`moreinfo-content ${isExpanded ? '' : 'moreinfo-hidden'}`}>
         <div className="complaint-more-info-list">
           <ul>
             {defaultRequiredInfo.map((item, index) => (
               <li key={index}>{item}</li>
             ))}
           </ul>
         </div>

         <div className="complaint-form-row">
           <div className="complaint-textarea-group">
             <label className="complaint-textarea-label">
               <span className="complaint-required-asterisk">*</span> {t('response')}
             </label>
             <textarea 
               className="complaint-response-textarea" 
               placeholder={t('messagePlaceholder')}
               value={response}
               onChange={(e) => setResponse(e.target.value)}
             />
           </div>

           {/* INTERNAL: FileUpload now uses internal state */}
           <FileUpload 
             onFileUpload={handleFileUpload} 
             uploadedFiles={uploadedFiles} 
           />
         </div>

         {/* OPTIONAL: Debug info for development */}
         {process.env.NODE_ENV === 'development' && (
           <div style={{ marginTop: '10px', padding: '10px', background: '#f0f0f0', fontSize: '12px' }}>
             <strong>Form Data:</strong>
             <pre>{JSON.stringify(getFormData(), null, 2)}</pre>
           </div>
         )}
       </div>
     </div>
   );
};

export default ComplaintEscalationFormCard;