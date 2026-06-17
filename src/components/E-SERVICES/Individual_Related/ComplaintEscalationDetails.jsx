// ComplaintEscalationDetails_Final.jsx - Fixed with proper bottom separator (Component 35)
import React, { useState, useEffect } from 'react';
import { useTranslation } from './TranslationContext';
import ComplaintInformation from './ComplaintInformation';
import PreviousResponses from './PreviousResponses';
import MoreInfoSection from './MoreInfoSection';
import CaseResolution from './CaseResolution';
import WarningBanner from './WarningBanner';

const ComplaintEscalationDetails = ({ complaintData, onBack }) => {
  const { t } = useTranslation();
  const [showWarning, setShowWarning] = useState(1); // 1 = show warning, 0 = resolved

  // Initialize based on complaint status
  useEffect(() => {
    if (complaintData?.status === 'resolved') {
      setShowWarning(0);
    } else {
      setShowWarning(1);
    }
  }, [complaintData]);

  const handleCloseWarning = () => {
    setShowWarning(0);
  };

  const handleSubmit = (formData) => {
    console.log('Submitting complaint response:', formData);
    // Handle form submission
    setShowWarning(0); // Move to resolved state
  };

  return (
    <>
      {showWarning === 1 && (
        <WarningBanner onClose={handleCloseWarning} />
      )}

      <div className={`complaint-main-content ${showWarning === 1 ? 'with-warning' : ''}`}>
        <div className="complaint-header">
          <h1>{t('complaintEscalation')}</h1>
          <span className="complaint-status-badge">
            <span className="complaint-status-badge-text">
              {showWarning === 1 ? t('actionRequired') : t('resolved')}
            </span>
          </span>
        </div>
        <div className="complaint-header-separator"></div>

        <ComplaintInformation complaintData={complaintData} />
        <PreviousResponses responses={complaintData?.responses || []} />
        
        {/* Bottom separator line AFTER Previous Responses */}
		<div style={{ height: '1px', backgroundColor: '#dee2e6', margin: '30px 0' }}></div>
      </div>

      {showWarning === 1 ? (
        <div className="complaint-more-info-section">
          <MoreInfoSection 
            onSubmit={handleSubmit}
            onBack={onBack}
            requiredInfo={complaintData?.requiredInfo || []}
          />
        </div>
      ) : (
        <CaseResolution 
          resolution={complaintData?.resolution}
          onBack={onBack}
        />
      )}
    </>
  );
};

export default ComplaintEscalationDetails;

