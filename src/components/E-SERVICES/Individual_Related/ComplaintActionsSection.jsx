// ComplaintActionsSection_Updated.jsx - Declaration and buttons (removed isResolved check)
import React from 'react';
import { useTranslation } from './TranslationContext';

const ComplaintActionsSection = ({ 
  declarationAccepted, 
  setDeclarationAccepted, 
  onBack, 
  onSubmit,
  onSaveAsDraft,
  isSubmitting
}) => {
  const { t } = useTranslation();

  return (
    <div style={{ marginTop: '20px' }}>
      {/* Declaration Checkbox */}
      <div className="complaint-declaration-section">
        <div className="complaint-declaration-checkbox">
          <input 
            type="checkbox" 
            id="declaration" 
            checked={declarationAccepted}
            onChange={(e) => setDeclarationAccepted(e.target.checked)}
          />
          <label htmlFor="declaration" className="complaint-declaration-text">
            {t('declarationText')}
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="complaint-button-group">
        <button className="complaint-btn-back" onClick={onBack}>
          {t('back')}
        </button>
        <button 
          className={`complaint-btn-submit ${declarationAccepted ? 'enabled' : ''}`}
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? t('submitting') || 'Submitting...' : t('submit')}
        </button>
        <button 
          className="complaint-btn-draft"
          onClick={onSaveAsDraft}
        >
          {t('saveAsDraft')}
        </button>
      </div>
    </div>
  );
};

export default ComplaintActionsSection;
