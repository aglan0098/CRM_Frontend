// components/SurveyModal/SurveyModal.js
import React from 'react';
import SurveyExpired from '../Expiry/Expiry';// Your expired component
import SurveyCompleted from '../Responded/Response'; // Your responded component

const SurveyModal = ({ isOpen, status, message, onClose }) => {
  if (!isOpen) return null;

  // Use your custom components based on status
  if (status === 'expired') {
    return <SurveyExpired/>;
  }
  
  if (status === 'already_responded') {
    return <SurveyCompleted />;
  }

  // For other error statuses, you can either use a generic error component
  // or handle them as needed
  if (status === 'not_found' || status === 'error') {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Error</h2>
          <p>{message}</p>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  return null;
};

export default SurveyModal;