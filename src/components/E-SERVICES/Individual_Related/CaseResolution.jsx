// CaseResolution.jsx - Case resolution display component (Component 40)
import React, { useState, useEffect } from 'react';
import { useTranslation } from './TranslationContext';
import config from "@/utils/config";
import sessionManager from '@/utils/sessionManager';

const CaseResolution = ({ caseId, resolution, onBack }) => {
  const { t } = useTranslation();
  const [apiResolution, setApiResolution] = useState('');
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = `${config.API_BASE_URL}`;
  // Function to extract text from HTML
  const extractTextFromHTML = (htmlString) => {
    if (!htmlString) return '';
    
    // Create a temporary DOM element to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    
    // Extract text content and clean it up
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    return textContent.trim();
  };

  // Fetch resolution from API
  useEffect(() => {
    if (caseId) {
      setLoading(true);
      let sessionHeaders = sessionManager.getSessionHeaders();
      fetch(`${API_BASE_URL}/api/incident-resolution/subject`, {
      //fetch(`http://localhost:8080/api/incident-resolution/subject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...sessionHeaders //
        },
        body: JSON.stringify({
          incidentId: caseId
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success && data.subject) {
          const extractedText = extractTextFromHTML(data.subject);
          setApiResolution(extractedText);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching resolution:', error);
        setLoading(false);
      });
    }
  }, [caseId]);

  // Use API resolution if available, otherwise show empty
  const displayResolution = apiResolution || '';

  return (
    <div className="complaint-case-resolution">
      <div className="complaint-case-resolution-header">
        <div className="complaint-checkmark-icon"></div>
        <span className="complaint-case-resolution-title">{t('caseResolution')}</span>
      </div>
      <div className="complaint-case-resolution-text">
        {loading ? t('loading') : displayResolution}
      </div>
      <button className="complaint-back-button" onClick={onBack}>
        {t('back')}
      </button>
    </div>
  );
};

export default CaseResolution;