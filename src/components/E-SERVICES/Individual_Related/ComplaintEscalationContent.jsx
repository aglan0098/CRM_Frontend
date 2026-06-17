// ComplaintEscalationContent_Fixed.jsx - Removed file handling from parent
import React, { useState, useEffect } from 'react';
import ComplaintEscalationMainCard from './ComplaintEscalationMainCard';
import ComplaintEscalationFormCard from './ComplaintEscalationFormCard';
import ComplaintActionsSection from './ComplaintActionsSection';
import CaseResolution from './CaseResolution';
import { useTranslation } from './TranslationContext';

const ComplaintEscalationContent = ({ isActive, complaintData, onBack }) => {
  const [response, setResponse] = useState('');
  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const [isResolved, setIsResolved] = useState(complaintData?.status === 'resolved');
  const { t } = useTranslation();
  
  // Status-based logic
  const status = complaintData?.status?.toLowerCase() || '';
  const isActionRequired = status.includes('action') || status.includes('required');
  const isCaseResolved = status.includes('resolved');
  const isSubmitted = status.includes('submitted');
  const isInProgress = status.includes('in progress') || status.includes('in-progress');
  
  // LIFTED STATE: Warning banner state controls entire page layout
  const [showWarning, setShowWarning] = useState(isActionRequired);

  // Filter for active external communications that require responses
  const activeExternalComms = complaintData?.externalCommunications?.filter(comm => 
    comm.active === 1 && comm.comstatusCode === 116950000
  ) || [];

  const [forms, setForms] = useState([]);

  // SIMPLIFIED: Only manage form expansion states and responses (no file handling)
  useEffect(() => {
    const newForms = activeExternalComms.map((comm, index) => {
      // Create stable ID
      const stableId = comm.externalCommunicationId || `temp_${index}`;
      
      // Find existing form to preserve its state
      const existingForm = forms.find(form => form.id === stableId);
      
      return {
        id: stableId,
        title: comm.requestedInformation || `Additional Information Request ${index + 1}`,
        isExpanded: existingForm?.isExpanded || false, // Preserve existing expansion state
        response: existingForm?.response || '', // Preserve existing response
        requiredInfo: [comm.requestedInformation] || [`Required Info ${index + 1}`],
        caseId: complaintData?.caseId,
        heading: comm.heading
      };
    });
    
    // Only update if forms actually changed (prevent unnecessary re-renders)
    const formsChanged = JSON.stringify(newForms.map(f => ({ id: f.id, title: f.title }))) !== 
                        JSON.stringify(forms.map(f => ({ id: f.id, title: f.title })));
    
    if (formsChanged) {
      setForms(newForms);
    }
  }, [activeExternalComms, complaintData?.caseId]);

  const handleCloseWarning = () => {
    setShowWarning(0);
    setIsResolved(true);
  };

  // SIMPLIFIED: Only handle form expansion and response updates
  const toggleFormExpansion = (formId) => {
    setForms(prevForms => prevForms.map(form => 
      form.id === formId 
        ? { ...form, isExpanded: !form.isExpanded }
        : form
    ));
  };

  const updateFormResponse = (formId, response) => {
    setForms(prevForms => prevForms.map(form => 
      form.id === formId 
        ? { ...form, response }
        : form
    ));
  };

  // Store form validation states
  const [formValidations, setFormValidations] = useState({});

  // Handle form data changes with validation
  const handleFormDataChange = (formId, formData) => {
    setFormValidations(prev => ({
      ...prev,
      [formId]: formData.validation
    }));
  };

  // SIMPLIFIED: Submit function with validation
  const handleSubmit = () => {
    if (!declarationAccepted) {
      alert('Please check the declaration checkbox');
      return;
    }

    // Validate all forms
    const invalidForms = Object.entries(formValidations).filter(([formId, validation]) => 
      !validation?.isValid
    );

    if (invalidForms.length > 0) {
      const firstInvalidForm = forms.find(form => form.id === invalidForms[0][0]);
      alert(`Please complete the response for: ${firstInvalidForm?.title || 'form'}`);
      return;
    }

    // Check if all forms have responses
    const formsWithoutResponse = forms.filter(form => 
      !form.response || form.response.trim() === ''
    );

    if (formsWithoutResponse.length > 0) {
      alert(`Please provide a response for all forms. Missing response for: ${formsWithoutResponse[0]?.title}`);
      return;
    }

    // Collect all form data (FormCard components will handle their own file data)
    const allFormsData = forms.map(form => ({
      formId: form.id,
      response: form.response,
      validation: formValidations[form.id],
      // Files will be handled by each FormCard individually
    }));

    console.log('Submitting complaint response:', {
      forms: allFormsData,
      declaration: declarationAccepted
    });

    setIsResolved(true);
    setShowWarning(0);
  };

  return (
    <div id="complaint-escalation-content" className={`dashboard-content ${isActive ? 'active' : ''}`}>
      <div className="main-content-top-margin">
        {/* CARD 1 - Main complaint information */}
        <div className="main-card">
          <ComplaintEscalationMainCard 
            complaintData={complaintData}
            showWarning={isActionRequired}
            onCloseWarning={handleCloseWarning}
          />
        </div>
        
        {/* CONDITIONAL RENDERING BASED ON STATUS */}
        {isActionRequired ? (
          <>
            {/* WRAPPER CARD CONTAINING MULTIPLE SUB-CARDS */}
            <div className="main-card" style={{ marginTop: '20px' }}>
              {forms.map((form, index) => (
                <div key={form.id} style={{ marginBottom: index < forms.length - 1 ? '20px' : '0' }}>
                  {/* SUB-CARD - Each form in its own card within the wrapper */}
                  <div className="moreinfo-collapsible-card">
                    {/* Collapsible Header */}
                    <div 
                      className="moreinfo-header" 
                      onClick={() => {
                        console.log('Toggling form:', form.id, 'Current expanded:', form.isExpanded);
                        toggleFormExpansion(form.id);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className={`moreinfo-chevron ${form.isExpanded ? 'moreinfo-expanded' : 'moreinfo-collapsed'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="9" height="6" viewBox="0 0 9 6" fill="none">
                          <path d="M0.902478 0.703524C0.983736 0.811106 1.22634 1.13227 1.37083 1.31741C1.66021 1.68822 2.05561 2.18094 2.48215 2.67221C2.91085 3.16595 3.36119 3.64681 3.76126 4.00031C3.96187 4.17756 4.13809 4.31225 4.28351 4.39992C4.42028 4.48237 4.50107 4.49951 4.50107 4.49951C4.50107 4.49951 4.57949 4.48236 4.71625 4.39992C4.86167 4.31225 5.03789 4.17757 5.2385 4.00031C5.63858 3.64682 6.08892 3.16595 6.51761 2.6722C6.94415 2.18093 7.33955 1.6882 7.62894 1.31739C7.77342 1.13224 8.01569 0.811535 8.09695 0.703952C8.2607 0.481603 8.57404 0.433646 8.79639 0.597401C9.01874 0.761156 9.06623 1.07415 8.90248 1.2965L8.9013 1.29806C8.81618 1.41077 8.56477 1.74363 8.41729 1.93261C8.12137 2.3118 7.71441 2.81907 7.27271 3.32781C6.83316 3.83406 6.34938 4.35319 5.90064 4.74969C5.67684 4.94744 5.44998 5.12525 5.23253 5.25634C5.02882 5.37915 4.77089 5.5 4.49988 5.5C4.22887 5.5 3.97095 5.37914 3.76723 5.25633C3.54979 5.12525 3.32293 4.94744 3.09913 4.74969C2.65038 4.35319 2.1666 3.83406 1.72705 3.32782C1.28535 2.81909 0.878398 2.31182 0.582479 1.93264C0.434942 1.74359 0.183627 1.41086 0.0985969 1.29828L0.0975196 1.29686C-0.0662368 1.07451 -0.0189732 0.761191 0.203374 0.597435C0.425715 0.433684 0.738717 0.481194 0.902478 0.703524Z" fill="currentColor"/>
                        </svg>
                      </div>
                      <div className="moreinfo-title">{t("additionalinformationrequest")}</div>
                      <div className="moreinfo-date">{new Date().toLocaleDateString()}</div>
                    </div>

                    {/* Collapsible Content */}
                    <div className={`moreinfo-content ${form.isExpanded ? '' : 'moreinfo-hidden'}`}>
                      <ComplaintEscalationFormCard
                        complaintData={{
                          ...complaintData,
                          requiredInfo: form.requiredInfo,
                          externalCommunicationId: form.id,
                          heading: form.heading,
                          onFormDataChange: (formData) => handleFormDataChange(form.id, formData)
                        }}
                        onBack={onBack}
                        response={form.response}
                        setResponse={(response) => updateFormResponse(form.id, response)}
                        disableCollapsible={true}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No global ComplaintActionsSection - each form has its own */}
          </>
        ) : isCaseResolved ? (
          /* CASE RESOLUTION - Show when status is resolved */
          <CaseResolution 
            caseId={complaintData?.caseId}
            resolution={complaintData?.resolution}
            onBack={onBack}
          />
        ) : (
          /* NO ACTION - Show for submitted/in progress statuses */
          <div className="complaint-case-resolution">
            <button className="complaint-back-button" onClick={onBack}>
              {t('back')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintEscalationContent;