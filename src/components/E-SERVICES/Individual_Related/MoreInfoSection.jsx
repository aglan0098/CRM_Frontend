
// MoreInfoSection_Fixed.jsx - Updated with collapsible chevron functionality (Component 39)
import React, { useState } from 'react';
import { useTranslation } from './TranslationContext';
import FileUpload from './FileUpload';

const MoreInfoSection = ({ onSubmit, onBack, requiredInfo = [] }) => {
  const { t } = useTranslation();
  const [response, setResponse] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const defaultRequiredInfo = requiredInfo.length > 0 ? requiredInfo : [
    t('nationalId'),
    t('waterBill')
  ];

  const handleSubmit = () => {
    if (!declarationAccepted) {
      alert(t('pleaseCheckDeclaration'));
      return;
    }

    const formData = {
      response,
      files: uploadedFiles,
      declaration: declarationAccepted
    };

    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const handleFileUpload = (files) => {
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const toggleExpanded = () => {
    console.log('Chevron clicked! Current state:', isExpanded);
    setIsExpanded(!isExpanded);
    console.log('New state will be:', !isExpanded);
  };

  console.log('MoreInfoSection rendered, isExpanded:', isExpanded);

  return (
    <div>
      <div style={{backgroundColor: 'red', color: 'white', padding: '10px', fontSize: '20px'}}>
        🚨 TEST: MoreInfoSection Component is Loading! 🚨
      </div>
      
      <div className="moreinfo-collapsible-card">
        {/* Collapsible Header */}
        <div className="moreinfo-header" onClick={toggleExpanded}>
          <div className={`moreinfo-chevron ${isExpanded ? 'moreinfo-expanded' : 'moreinfo-collapsed'}`}>
            ▶
          </div>
          <div className="moreinfo-title">{t('moreInfoNeeded')}</div>
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


          {/* <FileUpload onFileUpload={handleFileUpload} /> */}
        </div>

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

        <div className="complaint-button-group">
          <button className="complaint-btn-back" onClick={onBack}>
            {t('back')}
          </button>
          <button 
            className={`complaint-btn-submit ${declarationAccepted ? 'enabled' : ''}`}
            onClick={handleSubmit}
          >
            {t('submit')}
          </button>
          <button className="complaint-btn-draft">
            {t('saveAsDraft')}
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default MoreInfoSection;