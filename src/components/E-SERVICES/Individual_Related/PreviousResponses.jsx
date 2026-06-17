// PreviousResponses_Corrected.jsx - Properly corrected RTL positioning(component 37)
// PreviousResponses_CSS_Fixed.jsx - Fixed RTL positioning with proper CSS direction
// UPDATED: Fixed file handling with proper names and download links
import React, { useState } from 'react';
import { useTranslation } from './TranslationContext';
import sessionManager from '@/utils/sessionManager';

const ResponseItem = ({ response, isExpanded, onToggle }) => {
  const { t, isRTL } = useTranslation();

  // Handle file download when eye icon is clicked
  const handleFileDownload = (documentLink, fileName) => {
    if (!documentLink) {
      console.error('No document link provided');
      return;
    }

    try {
      // Get JWT token from sessionManager
      const jwtHeaders = sessionManager.getJWTHeaders();
      
      if (!jwtHeaders || !jwtHeaders.Authorization) {
        console.error('No JWT token available');
        alert('Authentication required. Please log in or complete security verification.');
        return;
      }

      // Extract token from Authorization header (Bearer <token>)
      const token = jwtHeaders.Authorization.replace('Bearer ', '');
      
      if (!token || token.trim() === '') {
        console.error('Token is empty');
        alert('Authentication token is missing. Please log in again.');
        return;
      }
      
      console.log('Token extracted:', token.substring(0, 20) + '...');
      
      // Append token as query parameter to the URL
      let authenticatedUrl;
      try {
        const url = new URL(documentLink);
        url.searchParams.set('token', token);
        authenticatedUrl = url.toString();
      } catch (error) {
        // Fallback: manually append token if URL constructor fails
        console.warn('URL constructor failed, using manual append:', error);
        const separator = documentLink.includes('?') ? '&' : '?';
        authenticatedUrl = `${documentLink}${separator}token=${encodeURIComponent(token)}`;
      }
      
      console.log('Original URL:', documentLink);
      console.log('Authenticated URL:', authenticatedUrl);
      console.log('Token length:', token.length);
      
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = authenticatedUrl;
      link.download = fileName || 'document'; // Use filename if available
      link.target = '_blank'; // Open in new tab as fallback
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('File download error:', error);
      alert('Failed to prepare download. Please try again.');
    }
  };

  return (
    <div className="complaint-response-item">
      {/* FIXED: Add direction and flex-direction to the header container */}
      <div 
        className="complaint-response-header" 
        onClick={onToggle}
        style={{
          direction: isRTL ? 'rtl' : 'ltr',  // CRITICAL: Set text direction
          display: 'flex',                   // Ensure it's a flex container
          alignItems: 'center',              // Center align items
          justifyContent: 'space-between'    // Space between items
        }}
      >
        {/* Arrow positioning - simplified since we're using CSS direction */}
        <svg 
          className={`complaint-chevron ${isExpanded ? 'expanded' : 'collapsed-chevron'}`} 
          xmlns="http://www.w3.org/2000/svg" 
          width="9" 
          height="6" 
          viewBox="0 0 9 6" 
          fill="none"
          style={{ 
            order: 1,  // SIMPLIFIED: Always order 1 (left in LTR, right in RTL due to direction)
            flexShrink: 0
          }}
        >
          <path d="M0.902478 0.703524C0.983736 0.811106 1.22634 1.13227 1.37083 1.31741C1.66021 1.68822 2.05561 2.18094 2.48215 2.67221C2.91085 3.16595 3.36119 3.64681 3.76126 4.00031C3.96187 4.17756 4.13809 4.31225 4.28351 4.39992C4.42028 4.48237 4.50107 4.49951 4.50107 4.49951C4.50107 4.49951 4.57949 4.48236 4.71625 4.39992C4.86167 4.31225 5.03789 4.17757 5.2385 4.00031C5.63858 3.64682 6.08892 3.16595 6.51761 2.6722C6.94415 2.18093 7.33955 1.6882 7.62894 1.31739C7.77342 1.13224 8.01569 0.811535 8.09695 0.703952C8.2607 0.481603 8.57404 0.433646 8.79639 0.597401C9.01874 0.761156 9.06623 1.07415 8.90248 1.2965L8.9013 1.29806C8.81618 1.41077 8.56477 1.74363 8.41729 1.93261C8.12137 2.3118 7.71441 2.81907 7.27271 3.32781C6.83316 3.83406 6.34938 4.35319 5.90064 4.74969C5.67684 4.94744 5.44998 5.12525 5.23253 5.25634C5.02882 5.37915 4.77089 5.5 4.49988 5.5C4.22887 5.5 3.97095 5.37914 3.76723 5.25633C3.54979 5.12525 3.32293 4.94744 3.09913 4.74969C2.65038 4.35319 2.1666 3.83406 1.72705 3.32782C1.28535 2.81909 0.878398 2.31182 0.582479 1.93264C0.434942 1.74359 0.183627 1.41086 0.0985969 1.29828L0.0975196 1.29686C-0.0662368 1.07451 -0.0189732 0.761191 0.203374 0.597435C0.425715 0.433684 0.738717 0.481194 0.902478 0.703524Z" fill="#161616"/>
        </svg>
        
        <span 
          className="complaint-response-title"
          style={{ 
            order: 2,  // SIMPLIFIED: Always order 2 (middle)
            flex: 1,   // Take up remaining space
            textAlign: isRTL ? 'right' : 'left',
            margin: '0 10px'
          }}
        >
          {response.title}
        </span>
        
        <span 
          className="complaint-response-date"
          style={{ 
            order: 3,  // SIMPLIFIED: Always order 3 (right in LTR, left in RTL due to direction)
            flexShrink: 0,
            textAlign: isRTL ? 'left' : 'right'
          }}
        >
          {response.date}
        </span>
      </div>
      <div className={`complaint-response-content ${!isExpanded ? 'collapsed' : ''}`}>
        <div className="complaint-response-text">
          {response.content}
        </div>
        {response.files && response.files.length > 0 && (
          <div className="complaint-response-files">
            {response.files.map((file, index) => (
              <div key={index} className="complaint-response-file">
                {/* FIXED: Display the actual file name from the documents structure */}
                <span>{file.name || `Document ${index + 1}`}</span>
                {/* FIXED: Make the eye icon clickable to download/view the file */}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="18" 
                  height="18" 
                  viewBox="0 0 18 18" 
                  fill="none"
                  style={{ cursor: 'pointer' }} // Make it clear it's clickable
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the collapse/expand
                    handleFileDownload(file.documentLink, file.name);
                  }}
                  title={`View/Download ${file.name}`} // Tooltip for accessibility
                >
                  {/* EYE ICON SVG PLACEHOLDER - You'll replace this with your actual eye icon */}
                  <path d="M16.8678 6.08382L16.8669 6.08282L16.8608 6.07618C16.855 6.06984 16.8457 6.05972 16.833 6.04606C16.8075 6.01874 16.7684 5.97731 16.7162 5.92379C16.6119 5.8167 16.4558 5.66147 16.2536 5.47413C15.8485 5.09888 15.2615 4.5979 14.5372 4.09758C13.0767 3.08872 11.1191 2.125 8.99984 2.125C6.88055 2.125 4.92303 3.08872 3.4625 4.09758C2.73818 4.5979 2.15121 5.09888 1.74611 5.47413C1.54387 5.66147 1.3878 5.8167 1.28346 5.92379C1.23132 5.97731 1.19216 6.01874 1.16669 6.04606C1.15396 6.05972 1.14465 6.06984 1.13886 6.07618L1.13282 6.08282L1.13213 6.08359C0.901813 6.34037 0.506605 6.36243 0.249584 6.13228C-0.00756816 5.90202 -0.0293676 5.50689 0.200894 5.24974C0.20083 5.24983 0.201554 5.25048 0.258885 5.30178C0.317002 5.35378 0.433285 5.45783 0.665873 5.6661L0.200894 5.24974L0.202582 5.24786L0.205642 5.24447L0.215846 5.23324C0.224454 5.22382 0.23666 5.21055 0.252376 5.19369C0.283806 5.15997 0.329301 5.11188 0.388162 5.05147C0.505842 4.93069 0.677205 4.7604 0.896653 4.55712C1.33494 4.15112 1.96835 3.61044 2.75207 3.06909C4.30761 1.99461 6.51676 0.875 8.99984 0.875C11.4829 0.875 13.6921 1.99461 15.2476 3.06909C16.0313 3.61044 16.6647 4.15112 17.103 4.55712C17.3225 4.7604 17.4938 4.93069 17.6115 5.05147C17.6704 5.11188 17.7159 5.15997 17.7473 5.19369C17.763 5.21055 17.7752 5.22382 17.7838 5.23324L17.794 5.24447L17.7971 5.24786L17.7981 5.24899C17.7983 5.24916 17.7988 5.24974 17.3332 5.66667L17.7988 5.24974C18.0291 5.50689 18.0073 5.90202 17.7501 6.13228C17.493 6.36247 17.0981 6.34076 16.8678 6.08382Z" fill="#161616"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M8.99985 13.7917C7.27396 13.7917 5.87485 12.3926 5.87485 10.6667C5.87485 8.94078 7.27396 7.54167 8.99985 7.54167C10.7257 7.54167 12.1248 8.94078 12.1248 10.6667C12.1248 12.3926 10.7257 13.7917 8.99985 13.7917ZM7.12485 10.6667C7.12485 11.7022 7.96432 12.5417 8.99985 12.5417C10.0354 12.5417 10.8748 11.7022 10.8748 10.6667C10.8748 9.63113 10.0354 8.79167 8.99985 8.79167C7.96432 8.79167 7.12485 9.63113 7.12485 10.6667Z" fill="#161616"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M3.6001 6.26082C5.02148 5.15117 6.85772 4.20833 8.99985 4.20833C11.142 4.20833 12.9782 5.15117 14.3996 6.26082C15.8222 7.37146 16.8738 8.68312 17.462 9.50793L17.5064 9.56978C17.7173 9.86318 17.9582 10.1982 17.9582 10.6667C17.9582 11.1352 17.7173 11.4702 17.5064 11.7636L17.462 11.8254C16.8738 12.6502 15.8222 13.9619 14.3996 15.0725C12.9782 16.1822 11.142 17.125 8.99985 17.125C6.85772 17.125 5.02148 16.1822 3.60011 15.0725C2.17746 13.9619 1.1259 12.6502 0.537692 11.8254L0.493343 11.7636C0.282379 11.4702 0.0415159 11.1352 0.0415159 10.6667C0.0415159 10.1982 0.282379 9.86318 0.493342 9.56978L0.537691 9.50793C1.1259 8.68312 2.17746 7.37146 3.6001 6.26082ZM4.36932 7.24612C3.07683 8.25515 2.10558 9.46224 1.55541 10.2337C1.41931 10.4246 1.35453 10.5177 1.31592 10.5919C1.29137 10.6391 1.29144 10.652 1.29151 10.6647L1.29152 10.6667L1.29151 10.6687C1.29144 10.6813 1.29137 10.6942 1.31592 10.7414C1.35453 10.8156 1.41931 10.9088 1.55541 11.0996C2.10558 11.8711 3.07683 13.0782 4.36932 14.0872C5.66308 15.0972 7.2343 15.875 8.99985 15.875C10.7654 15.875 12.3366 15.0972 13.6304 14.0872C14.9229 13.0782 15.8941 11.8711 16.4443 11.0996C16.5804 10.9088 16.6452 10.8156 16.6838 10.7414C16.7083 10.6942 16.7083 10.6813 16.7082 10.6687L16.7082 10.6667L16.7082 10.6647C16.7083 10.652 16.7083 10.6391 16.6838 10.5919C16.6452 10.5177 16.5804 10.4246 16.4443 10.2337C15.8941 9.46224 14.9229 8.25515 13.6304 7.24612C12.3366 6.23609 10.7654 5.45833 8.99985 5.45833C7.2343 5.45833 5.66308 6.23609 4.36932 7.24612Z" fill="#161616"/>
                </svg>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const PreviousResponses = ({ responses, externalCommunications }) => {
  const { t } = useTranslation();
  const [expandedItems, setExpandedItems] = useState({ 0: true }); // First item expanded by default

  // Filter external communications for previous responses
  // active === 0 AND comstatusCode === 116950004
  const previousResponses = externalCommunications?.filter(comm => 
    comm.active === 0 && comm.comstatusCode === 116950004
  ).map((comm, index) => ({
    id: comm.externalCommunicationId || index,
    title: comm.requestedInformation || `Previous Response ${index + 1}`,
    date: comm.createdDate || comm.date || new Date().toLocaleDateString(),
    content: comm.response || t('noResponseYet'),
    // FIXED: Map the documents array properly with name and documentLink
    files: comm.documents ? comm.documents.map(doc => ({
      name: doc.name,
      documentLink: doc.documentLink
    })) : []
  })) || [];

  // Use filtered external communications, no default responses
  const responsesToShow = previousResponses;

  const toggleResponse = (index) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="complaint-section complaint-responses-section">
      {/* Top separator line before Previous Responses */}
      <div style={{ height: '1px', backgroundColor: '#dee2e6', margin: '30px 0 25px 0' }}></div>
      
      <div className="complaint-section-title">{t('previousResponses')}</div>
      
      {responsesToShow.length > 0 ? (
        responsesToShow.map((response, index) => (
          <React.Fragment key={response.id || index}>
            <ResponseItem
              response={response}
              isExpanded={expandedItems[index] || false}
              onToggle={() => toggleResponse(index)}
            />
            {index < responsesToShow.length - 1 && (
              <div style={{ height: '1px', backgroundColor: '#dee2e6', margin: '15px 0' }}></div>
            )}
          </React.Fragment>
        ))
      ) : (
        <div style={{ padding: '20px', textAlign: 'center', color: '#6c757d' }}>
          {t('noPreviousResponses') || 'No previous responses available'}
        </div>
      )}
    </div>
  );
};

export default PreviousResponses;