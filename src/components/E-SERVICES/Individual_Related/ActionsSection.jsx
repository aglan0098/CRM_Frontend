//=====================================
// Updated ActionsSection.jsx (Component 2)
import React from 'react';
import Exclamation from './Exclamation.png';
import Closer from './Closer.png';
import { useTranslation } from './TranslationContext';

const ActionsSection = ({ caseData, onViewDetails }) => {
  const { t, language } = useTranslation();
  
  // Get translated request type with fallback
  const getTranslatedRequestType = () => {
    if (!caseData?.requestType) {
      return t('complaintEscalationCase');
    }
    
    const requestType = caseData.requestType;
    
    // Direct mapping for request types to ensure translations work
    const requestTypeMap = {
      'Inquiries': t('Inquiries'),
      'General Complaint': t('General Complaint'),
      'Complaint Escalation': t('Complaint Escalation'),
      'Complaint Inquiry': t('Complaint Inquiry'),
      'Internal Complaint': t('Internal Complaint')
    };
    
    // Try direct map first, then fallback to generic translation
    const translated = requestTypeMap[requestType] || t(requestType);
    
    // Debug: Log to see what's happening
    console.log('ActionsSection - Language:', language);
    console.log('ActionsSection - requestType:', requestType);
    console.log('ActionsSection - Direct t("Inquiries"):', t('Inquiries'));
    console.log('ActionsSection - Translated result:', translated);
    
    // Return the translated value (it will be the key itself if translation doesn't exist)
    return translated || t('complaintEscalationCase');
  };
  
  const handleActionClick = () => {
    if (onViewDetails && caseData) {
      // Create complaint data from API response (same format as RequestsTable)
      const complaintData = {
        complaintNumber: caseData.complaintNumber,
        referenceId: caseData.caseNumber,
        subject: caseData.subject,
        subjectDescription: caseData.subjectDescription,
        region: caseData.regionName,
        relatedEntity: caseData.relatedAuthorityName,
        status: caseData.status.toLowerCase().replace(/\s+/g, '-'),
        statusCode: caseData.statusCode,
        requestType: caseData.requestType,
        activityType: caseData.activityType,
        creationDate: caseData.creationDate,
        caseId: caseData.caseId,
        documents: caseData.documents || [],
        externalCommunications: caseData.externalCommunications || [],
        // Create responses from external communications
        responses: caseData.externalCommunications?.map((comm, index) => ({
          id: comm.externalCommunicationId,
          title: comm.requestedInformation,
          date: caseData.creationDate,
          content: comm.response || t('noResponseYet'),
          statusCode: comm.comstatusCode,
          status: comm.comstatusName,
          active: comm.active,
          files: comm.documents || []
        })) || [],
        requiredInfo: caseData.externalCommunications?.map(comm => comm.requestedInformation) || [],
        resolution: t('defaultResolutionText')
      };
      
      onViewDetails(complaintData, 'requests');
    }
  };
  
  return (
    <div className="actions-section">
      <h3 className="section-title">{t('actionsRequired')}</h3>
      <div className="action-item" onClick={handleActionClick} style={{ cursor: 'pointer' }}>
        <img
          className="action-icon action-icon-shade"
          src={Exclamation}
          alt="More info needed"
        />
        <div className="action-text">
          <strong>{t('moreInfoNeeded')}</strong><br />
          {t('completeDetails')}
          <strong> {getTranslatedRequestType()}</strong> {t('processRequest')}
        </div>
        <button className="close-btn">
          <img src={Closer} alt="Close" className="close-icon" />
        </button>
      </div>
    </div>
  );
};

export default ActionsSection;