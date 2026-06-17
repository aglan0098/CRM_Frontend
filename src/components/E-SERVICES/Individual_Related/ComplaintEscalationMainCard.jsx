// ComplaintEscalationMainCard_Corrected.jsx - First card content with corrected RTL positioning
import React from 'react';
import { useTranslation } from './TranslationContext';
import ComplaintInformation from './ComplaintInformation';
import PreviousResponses from './PreviousResponses';
import WarningBanner from './WarningBanner';

const ComplaintEscalationMainCard = ({ complaintData, showWarning, onCloseWarning }) => {
  const { t, language } = useTranslation();
  
  // Debug: Log current language and test translations
  console.log('Current language:', language);
  console.log('Test translation actionRequired:', t('actionRequired'));
  console.log('Test translation InProgress:', t('InProgress'));
  console.log('Test translation Submitted:', t('Submitted'));
  console.log('Test translation resolved:', t('resolved'));

  const getStatusBadgeClass = (status) => {
    if (!status) return 'status-default';
    const statusLower = status.toLowerCase();
    if (statusLower.includes('resolved')) return 'status-resolved';
    if (statusLower.includes('action') || statusLower.includes('required')) return 'status-action-required';
    if (statusLower.includes('submitted')) return 'status-submitted';
    if (statusLower.includes('in progress')) return 'status-inprogress';
    if (statusLower.includes('draft')) return 'status-draft';
    return 'status-inprogress';
  };

  // Status-based logic
  const status = complaintData?.status?.toLowerCase() || '';
  const isActionRequired = status.includes('action') || status.includes('required');
  const isCaseResolved = status.includes('resolved');
  const isSubmitted = status.includes('submitted');
  const isInProgress = status.includes('in progress') || status.includes('in-progress');


  // Helper function to get status text
   const getStatusText = (status) => {
        if (!status) return '-';
        
        // Debug: Log the status value to see what we're getting
        console.log('Status received:', status, 'Type:', typeof status);
        
        // Map exact status values to translation keys
        const statusMap = {
          'Action Required': 'actionRequired',
          'action-required': 'actionRequired',
          'ACTION-REQUIRED': 'actionRequired',
          'Resolved': 'resolved',
          'resolved': 'resolved',
          'Submitted': 'Submitted',
          'submitted': 'Submitted',
          'In Progress': 'InProgress',
          'in-progress': 'InProgress',
          'IN-PROGRESS': 'InProgress',
          'Draft': 'draft',
          'draft': 'draft'
        };
        
        // Check for exact match first
        if (statusMap[status]) {
          const translationKey = statusMap[status];
          const translatedText = t(translationKey);
          console.log('Exact match found:', status, '->', translationKey, '->', translatedText);
          return translatedText;
        }
        
        // Fallback to partial matching for variations
        const statusLower = status.toLowerCase();
        if (statusLower.includes('action required')) return t('actionRequired');
        if (statusLower.includes('resolved')) return t('resolved');
        if (statusLower.includes('submitted')) return t('Submitted');
        if (statusLower.includes('in progress')) return t('InProgress');
        if (statusLower.includes('draft')) return t('draft');
        
        console.log('No match found for status:', status);
        return t('InProgress');
   };
  return (
    <>
      {/* Warning Banner - appears above the card content */}
      {showWarning && (
        <WarningBanner onClose={onCloseWarning} />
      )}

      {/* Main card content */}
      <div className={`complaint-main-content ${showWarning ? 'with-warning' : ''}`}>
        <div className="complaint-header">
          <h1>{t(complaintData?.requestType) || t('complaintEscalation')}</h1>
          <span className={`status-badge ${getStatusBadgeClass(complaintData?.status)}`}>
            {getStatusText(complaintData?.status)}
          </span>
        </div>
        <div className="complaint-header-separator"></div>

        <ComplaintInformation complaintData={complaintData} />
        <PreviousResponses 
          responses={complaintData?.responses || []} 
          externalCommunications={complaintData?.externalCommunications || []}
        />
        
        {/* Bottom separator line AFTER Previous Responses - END OF CARD 1 */}
        <div style={{ height: '1px', backgroundColor: '#dee2e6', margin: '30px 0' }}></div>
      </div>
    </>
  );
};

export default ComplaintEscalationMainCard;
