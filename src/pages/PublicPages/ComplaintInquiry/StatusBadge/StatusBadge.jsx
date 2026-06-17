import React from 'react';
import './StatusBadge.css'; // Make sure this path is correct

const StatusBadge = ({ 
  status, 
  statusCode, 
  stageName, 
  showStatusCode = false, 
  size = 'default',
  language = 'en',
  externalCommunications = [],
  stateCode = null
}) => {
  
  const translations = {
    en: {
      submitted: 'Submitted',
      actionRequired: 'Action Required',
      inProgress: 'In Progress',
      caseResolved: 'Resolved',
      noStatus: 'In Progress'
    },
    ar: {
      submitted: 'تم التقديم',
      actionRequired: 'يتطلب إجراء',
      inProgress: 'قيد المعالجة',
      caseResolved: 'تم الحل',
      noStatus: 'قيد المعالجة'
    }
  };

  const t = translations[language] || translations.en;

  // Get CSS class based on status
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'Resolved':
      case 'Case Resolved':
      case t.caseResolved:
        return 'status-resolved';
      case 'In Progress':
      case t.inProgress:
        return 'status-in-progress';
      case 'Action Required':
      case t.actionRequired:
        return 'status-action-required';
      case 'Submitted':
      case t.submitted:
        return 'status-submitted';
      default: 
        return 'status-in-progress';
    }
  };

  const getDisplayStatus = (stageName, status, externalCommunications, stateCode) => {
    console.log("All values",stageName,status,stateCode)
    if (stateCode === 1) {
      return t.caseResolved;
    }
    const hasActiveResponse = externalCommunications?.some(comm => 
      (comm.comstatusCode === 1 || comm.comstatusCode === 116950000 ) && 
      comm.response === null && 
      (comm.comstatusName === 'Active' || comm.comstatusName === 'Request Sent')
    );
    
    if (hasActiveResponse) {
      return t.actionRequired;
    }

    if (stageName === 'Request Submission') return t.submitted;
    if (stageName === 'Evaluation') return t.inProgress;
    //if (stageName === 'Resolution') return t.caseResolved;
    return t.inProgress || t.noStatus;
  };

  const displayStatus = getDisplayStatus(stageName, status, externalCommunications, stateCode);
  const statusClass = getStatusBadgeClass(displayStatus);

  return (
    <div className="status-container">
      <span className={`status-badge ${statusClass} ${size !== 'default' ? size : ''}`}>
        {displayStatus}
        {showStatusCode && statusCode && ` (${statusCode})`}
      </span>
    </div>
  );
};

export default StatusBadge;