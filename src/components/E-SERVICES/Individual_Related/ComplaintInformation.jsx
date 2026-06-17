// ComplaintInformation_Updated.jsx - Displays complaint details with proper translations (Component 36)
import React, { useState } from 'react';
import { useTranslation } from './TranslationContext';
import sessionManager from '@/utils/sessionManager';

const ComplaintInformation = ({ complaintData }) => {
    const { t } = useTranslation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    // Function to handle document download with JWT token
    const handleDocumentDownload = (documentLink, documentName) => {
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
            
            // Append token as query parameter to the URL
            let authenticatedUrl;
            try {
                const url = new URL(documentLink);
                url.searchParams.set('token', token);
                authenticatedUrl = url.toString();
            } catch (error) {
                // Fallback: manually append token if URL constructor fails
                const separator = documentLink.includes('?') ? '&' : '?';
                authenticatedUrl = `${documentLink}${separator}token=${encodeURIComponent(token)}`;
            }
            
            // Create a temporary anchor element to trigger download
            const link = document.createElement('a');
            link.href = authenticatedUrl;
            link.download = documentName || 'document'; // Use filename if available
            link.target = '_blank'; // Open in new tab as fallback
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
        } catch (error) {
            console.error('File download error:', error);
            alert('Failed to prepare download. Please try again.');
        }
    };

    // Use actual complaint data or fallback to defaults
    const data = complaintData || {
        caseId: '',
        referenceId: '43218765',
        complaintNumber: '43218765',
        subject: t('waterBill'),
        region: 'Riyadh',
        relatedEntity: t('nationalWaterCompany'),
        uploadedFile: t('imagePng'),
        documents: []
    };
    // Detect request type
    const isInquiry = data.requestType === 'Inquiries';
    const isGeneralComplaint = data.requestType === 'General Complaint';
    const isIncident = data.requestType === 'Incidents' || data.requestType === 'Incident Report' || data.requestType === 'Incident Reports';
    const useSimplifiedLayout = isInquiry || isGeneralComplaint;

    // Determine the section title based on requestType
    const sectionTitle = isInquiry
        ? t('inquiryInformation')
        : isIncident
            ? t('incidentInformation')
            : t('complaintInformation');

    return (
        <div className="complaint-section">
            <div className="complaint-section-title">{sectionTitle}</div>
            
            {useSimplifiedLayout ? (
                isInquiry ? (
                    // Inquiry Layout - Only 3 fields: Inquiry Number, Inquiry Subject, Inquiry Date
                    <div className="complaint-form-grid">
                        <div className="complaint-form-group">
                            <label className="complaint-form-label">{t('inquiryNumber')}</label>
                            <div className="complaint-form-input">{data.referenceId || data.caseNumber || '-'}</div>
                        </div>
                        <div className="complaint-form-group">
                            <label className="complaint-form-label">{t('inquirySubject')}</label>
                            <div className="complaint-form-input">{data.subject || '-'}</div>
                        </div>
                        <div className="complaint-form-group">
                            <label className="complaint-form-label">{t('inquiryDate')}</label>
                            <div className="complaint-form-input">{data.creationDate || '-'}</div>
                        </div>
                    </div>
                ) : (
                    // General Complaint Layout - Only 3 fields: Complaint Number, Complaint Subject, Complaint Date
                    <div className="complaint-form-grid">
                        <div className="complaint-form-group">
                            <label className="complaint-form-label">{t('complaintNumber')}</label>
                            <div className="complaint-form-input">{data.referenceId || data.caseNumber || '-'}</div>
                        </div>
                        <div className="complaint-form-group">
                            <label className="complaint-form-label">{t('complaintSubject')}</label>
                            <div className="complaint-form-input">{data.subject || '-'}</div>
                        </div>
                        <div className="complaint-form-group">
                            <label className="complaint-form-label">{t('complaintDate')}</label>
                            <div className="complaint-form-input">{data.creationDate || '-'}</div>
                        </div>
                    </div>
                )
            ) : isIncident ? (
                // Incident Layout - incident-specific labels
                <>
                    <div className="complaint-form-grid">
                        <div className="complaint-form-group">
                            <label className="complaint-form-label">{t('incidentNumber')}</label>
                            <div className="complaint-form-input">{data.referenceId || data.caseNumber || '-'}</div>
                        </div>
                        <div className="complaint-form-group">
                            <label className="complaint-form-label">{t('incidentDate')}</label>
                            <div className="complaint-form-input">{data.creationDate || '-'}</div>
                        </div>
                    </div>
                    <div className="complaint-form-grid">
                        <div className="complaint-form-group">
                            <label className="complaint-form-label">{t('incidentSubject')}</label>
                            <div className="complaint-form-input">{data.subject || '-'}</div>
                        </div>
                        <div className="complaint-form-group">
                            <label className="complaint-form-label">{t('region')}</label>
                            <div className="complaint-form-input">{data.region || '-'}</div>
                        </div>
                    </div>
                    <div className="complaint-upload-section">
                        <div className="complaint-form-group">
                            <label className="complaint-form-label">{t('relatedEntity')}</label>
                            <div className="complaint-form-input">{data.relatedEntity || '-'}</div>
                        </div>
                        <div className="complaint-form-group">
                            <label className="complaint-form-label">{t('uploadedFile')}</label>
                            {/* Custom Dropdown exactly like SearchFilters */}
                            <div className="custom-dropdown-wrapper" style={{ position: 'relative' }}>
                                <button
                                    className="filter-select"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    style={{
                                        width: '100%',
                                        textAlign: 'left',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        background: 'white',
                                        border: '1px solid #ccc',
                                        padding: '8px 12px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <span>
                                        {data.documents && data.documents.length > 0 ? 'All Files' : 'No Files'}
                                    </span>
                                    {/* CHEVRON SVG ICON - Place your custom chevron here */}
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        style={{
                                            transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                            transition: 'transform 0.2s',
                                            flexShrink: 0
                                        }}
                                    >
                                        <polyline points="6,9 12,15 18,9"></polyline>
                                    </svg>
                                </button>
                                {isDropdownOpen && data.documents && data.documents.length > 0 && (
                                    <div
                                        className="custom-dropdown-menu"
                                        style={{
                                            position: 'absolute',
                                            top: '100%',
                                            left: 0,
                                            right: 0,
                                            background: 'white',
                                            border: '1px solid #ccc',
                                            borderTop: 'none',
                                            maxHeight: data.documents.length > 3 ? '160px' : 'auto',
                                            overflowY: data.documents.length > 3 ? 'auto' : 'visible',
                                            zIndex: 1000,
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        {data.documents.map((doc, index) => (
                                            <div
                                                key={index}
                                                className="custom-dropdown-option"
                                                onClick={() => {
                                                    handleDocumentDownload(doc.documentLink, doc.name);
                                                    setIsDropdownOpen(false);
                                                }}
                                                style={{
                                                    padding: '8px 12px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    gap: '8px',
                                                    borderBottom: index < data.documents.length - 1 ? '1px solid #eee' : 'none'
                                                }}
                                                onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                                                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                                            >
                                                <span className='complaint-upload-filename'>{doc.name}</span>
                                                {/* DOWNLOAD/VIEW SVG ICON - Place your custom download icon here */}
                                                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none">
                                                    <path d="M17.3678 6.08382L17.3669 6.08282L17.3608 6.07618C17.355 6.06984 17.3457 6.05972 17.333 6.04606C17.3075 6.01874 17.2684 5.97731 17.2162 5.92379C17.1119 5.8167 16.9558 5.66147 16.7536 5.47413C16.3485 5.09888 15.7615 4.5979 15.0372 4.09758C13.5767 3.08872 11.6191 2.125 9.49984 2.125C7.38055 2.125 5.42303 3.08872 3.9625 4.09758C3.23818 4.5979 2.65121 5.09888 2.24611 5.47413C2.04387 5.66147 1.8878 5.8167 1.78346 5.92379C1.73132 5.97731 1.69216 6.01874 1.66669 6.04606C1.65396 6.05972 1.64465 6.06984 1.63886 6.07618L1.63282 6.08282L1.63213 6.08359C1.40181 6.34037 1.00661 6.36243 0.749584 6.13228C0.492432 5.90202 0.470632 5.50689 0.700894 5.24974C0.70083 5.24983 0.701554 5.25048 0.758885 5.30178C0.817002 5.35378 0.933285 5.45783 1.16587 5.6661L0.700894 5.24974L0.702582 5.24786L0.705642 5.24447L0.715846 5.23324C0.724454 5.22382 0.73666 5.21055 0.752376 5.19369C0.783806 5.15997 0.829301 5.11188 0.888162 5.05147C1.00584 4.93069 1.1772 4.7604 1.39665 4.55712C1.83494 4.15112 2.46835 3.61044 3.25207 3.06909C4.80761 1.99461 7.01676 0.875 9.49984 0.875C11.9829 0.875 14.1921 1.99461 15.7476 3.06909C16.5313 3.61044 17.1647 4.15112 17.603 4.55712C17.8225 4.7604 17.9938 4.93069 18.1115 5.05147C18.1704 5.11188 18.2159 5.15997 18.2473 5.19369C18.263 5.21055 18.2752 5.22382 18.2838 5.23324L18.294 5.24447L18.2971 5.24786L18.2981 5.24899C18.2983 5.24916 18.2988 5.24974 17.8332 5.66667L18.2988 5.24974C18.5291 5.50689 18.5073 5.90202 18.2501 6.13228C17.993 6.36247 17.5981 6.34076 17.3678 6.08382Z" fill="#161616" />
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M9.49985 13.7917C7.77396 13.7917 6.37485 12.3926 6.37485 10.6667C6.37485 8.94078 7.77396 7.54167 9.49985 7.54167C11.2257 7.54167 12.6248 8.94078 12.6248 10.6667C12.6248 12.3926 11.2257 13.7917 9.49985 13.7917ZM7.62485 10.6667C7.62485 11.7022 8.46432 12.5417 9.49985 12.5417C10.5354 12.5417 11.3748 11.7022 11.3748 10.6667C11.3748 9.63113 10.5354 8.79167 9.49985 8.79167C8.46432 8.79167 7.62485 9.63113 7.62485 10.6667Z" fill="#161616" />
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M4.1001 6.26082C5.52148 5.15117 7.35772 4.20833 9.49985 4.20833C11.642 4.20833 13.4782 5.15117 14.8996 6.26082C16.3222 7.37146 17.3738 8.68312 17.962 9.50793L18.0064 9.56978C18.2173 9.86318 18.4582 10.1982 18.4582 10.6667C18.4582 11.1352 18.2173 11.4702 18.0064 11.7636L17.962 11.8254C17.3738 12.6502 16.3222 13.9619 14.8996 15.0725C13.4782 16.1822 11.642 17.125 9.49985 17.125C7.35772 17.125 5.52148 16.1822 4.10011 15.0725C2.67746 13.9619 1.6259 12.6502 1.03769 11.8254L0.993343 11.7636C0.782379 11.4702 0.541516 11.1352 0.541516 10.6667C0.541516 10.1982 0.782379 9.86318 0.993342 9.56978L1.03769 9.50793C1.6259 8.68312 2.67746 7.37146 4.1001 6.26082ZM4.86932 7.24612C3.57683 8.25515 2.60558 9.46224 2.05541 10.2337C1.91931 10.4246 1.85453 10.5177 1.81592 10.5919C1.79137 10.6391 1.79144 10.652 1.79151 10.6647L1.79152 10.6667L1.79151 10.6687C1.79144 10.6813 1.79137 10.6942 1.81592 10.7414C1.85453 10.8156 1.91931 10.9088 2.05541 11.0996C2.60558 11.8711 3.57683 13.0782 4.86932 14.0872C6.16308 15.0972 7.7343 15.875 9.49985 15.875C11.2654 15.875 12.8366 15.0972 14.1304 14.0872C15.4229 13.0782 16.3941 11.8711 16.9443 11.0996C17.0804 10.9088 17.1452 10.8156 17.1838 10.7414C17.2083 10.6942 17.2083 10.6813 17.2082 10.6687L17.2082 10.6667L17.2082 10.6647C17.2083 10.652 17.2083 10.6391 17.1838 10.5919C17.1452 10.5177 17.0804 10.4246 16.9443 10.2337C16.3941 9.46224 15.4229 8.25515 14.1304 7.24612C12.8366 6.23609 11.2654 5.45833 9.49985 5.45833C7.7343 5.45833 6.16308 6.23609 4.86932 7.24612Z" fill="#161616" />
                                                </svg>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                // Escalation / Default Layout - complaint-specific labels
                <>
                    <div className="complaint-form-grid">
                        <div className="complaint-form-group">
                            <label className="complaint-form-label">{t('complaintNumber')}</label>
                            <div className="complaint-form-input">{data.referenceId || '-'}</div>
                        </div>
                        {/* Only show Complaint Reference ID when Request Type is "Complaint Escalation" */}
                        {data.requestType === 'Complaint Escalation' && (
                            <div className="complaint-form-group">
                                <label className="complaint-form-label">{t('complaintReferenceId')}</label>
                                <div className="complaint-form-input">{data.complaintNumber || '-'}</div>
                            </div>
                        )}
                    </div>
                    <div className="complaint-form-grid">
                        <div className="complaint-form-group">
                            <label className="complaint-form-label">{t('complaintSubject')}</label>
                            <div className="complaint-form-input">{data.subject || '-'}</div>
                        </div>
                        <div className="complaint-form-group">
                            <label className="complaint-form-label">{t('region')}</label>
                            <div className="complaint-form-input">{data.region || '-'}</div>
                        </div>
                    </div>
                    <div className="complaint-upload-section">
                        <div className="complaint-form-group">
                            <label className="complaint-form-label">{t('relatedEntity')}</label>
                            <div className="complaint-form-input">{data.relatedEntity || '-'}</div>
                        </div>
                        <div className="complaint-form-group">
                            <label className="complaint-form-label">{t('uploadedFile')}</label>
                            {/* Custom Dropdown exactly like SearchFilters */}
                            <div className="custom-dropdown-wrapper" style={{ position: 'relative' }}>
                                <button
                                    className="filter-select"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    style={{
                                        width: '100%',
                                        textAlign: 'left',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        background: 'white',
                                        border: '1px solid #ccc',
                                        padding: '8px 12px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <span>
                                        {data.documents && data.documents.length > 0 ? 'All Files' : 'No Files'}
                                    </span>
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        style={{
                                            transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                            transition: 'transform 0.2s',
                                            flexShrink: 0
                                        }}
                                    >
                                        <polyline points="6,9 12,15 18,9"></polyline>
                                    </svg>
                                </button>
                                {isDropdownOpen && data.documents && data.documents.length > 0 && (
                                    <div
                                        className="custom-dropdown-menu"
                                        style={{
                                            position: 'absolute',
                                            top: '100%',
                                            left: 0,
                                            right: 0,
                                            background: 'white',
                                            border: '1px solid #ccc',
                                            borderTop: 'none',
                                            maxHeight: data.documents.length > 3 ? '160px' : 'auto',
                                            overflowY: data.documents.length > 3 ? 'auto' : 'visible',
                                            zIndex: 1000,
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        {data.documents.map((doc, index) => (
                                            <div
                                                key={index}
                                                className="custom-dropdown-option"
                                                onClick={() => {
                                                    handleDocumentDownload(doc.documentLink, doc.name);
                                                    setIsDropdownOpen(false);
                                                }}
                                                style={{
                                                    padding: '8px 12px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    gap: '8px',
                                                    borderBottom: index < data.documents.length - 1 ? '1px solid #eee' : 'none'
                                                }}
                                                onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                                                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                                            >
                                                <span className='complaint-upload-filename'>{doc.name}</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none">
                                                    <path d="M17.3678 6.08382L17.3669 6.08282L17.3608 6.07618C17.355 6.06984 17.3457 6.05972 17.333 6.04606C17.3075 6.01874 17.2684 5.97731 17.2162 5.92379C17.1119 5.8167 16.9558 5.66147 16.7536 5.47413C16.3485 5.09888 15.7615 4.5979 15.0372 4.09758C13.5767 3.08872 11.6191 2.125 9.49984 2.125C7.38055 2.125 5.42303 3.08872 3.9625 4.09758C3.23818 4.5979 2.65121 5.09888 2.24611 5.47413C2.04387 5.66147 1.8878 5.8167 1.78346 5.92379C1.73132 5.97731 1.69216 6.01874 1.66669 6.04606C1.65396 6.05972 1.64465 6.06984 1.63886 6.07618L1.63282 6.08282L1.63213 6.08359C1.40181 6.34037 1.00661 6.36243 0.749584 6.13228C0.492432 5.90202 0.470632 5.50689 0.700894 5.24974C0.70083 5.24983 0.701554 5.25048 0.758885 5.30178C0.817002 5.35378 0.933285 5.45783 1.16587 5.6661L0.700894 5.24974L0.702582 5.24786L0.705642 5.24447L0.715846 5.23324C0.724454 5.22382 0.73666 5.21055 0.752376 5.19369C0.783806 5.15997 0.829301 5.11188 0.888162 5.05147C1.00584 4.93069 1.1772 4.7604 1.39665 4.55712C1.83494 4.15112 2.46835 3.61044 3.25207 3.06909C4.80761 1.99461 7.01676 0.875 9.49984 0.875C11.9829 0.875 14.1921 1.99461 15.7476 3.06909C16.5313 3.61044 17.1647 4.15112 17.603 4.55712C17.8225 4.7604 17.9938 4.93069 18.1115 5.05147C18.1704 5.11188 18.2159 5.15997 18.2473 5.19369C18.263 5.21055 18.2752 5.22382 18.2838 5.23324L18.294 5.24447L18.2971 5.24786L18.2981 5.24899C18.2983 5.24916 18.2988 5.24974 17.8332 5.66667L18.2988 5.24974C18.5291 5.50689 18.5073 5.90202 18.2501 6.13228C17.993 6.36247 17.5981 6.34076 17.3678 6.08382Z" fill="#161616" />
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M9.49985 13.7917C7.77396 13.7917 6.37485 12.3926 6.37485 10.6667C6.37485 8.94078 7.77396 7.54167 9.49985 7.54167C11.2257 7.54167 12.6248 8.94078 12.6248 10.6667C12.6248 12.3926 11.2257 13.7917 9.49985 13.7917ZM7.62485 10.6667C7.62485 11.7022 8.46432 12.5417 9.49985 12.5417C10.5354 12.5417 11.3748 11.7022 11.3748 10.6667C11.3748 9.63113 10.5354 8.79167 9.49985 8.79167C8.46432 8.79167 7.62485 9.63113 7.62485 10.6667Z" fill="#161616" />
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M4.1001 6.26082C5.52148 5.15117 7.35772 4.20833 9.49985 4.20833C11.642 4.20833 13.4782 5.15117 14.8996 6.26082C16.3222 7.37146 17.3738 8.68312 17.962 9.50793L18.0064 9.56978C18.2173 9.86318 18.4582 10.1982 18.4582 10.6667C18.4582 11.1352 18.2173 11.4702 18.0064 11.7636L17.962 11.8254C17.3738 12.6502 16.3222 13.9619 14.8996 15.0725C13.4782 16.1822 11.642 17.125 9.49985 17.125C7.35772 17.125 5.52148 16.1822 4.10011 15.0725C2.67746 13.9619 1.6259 12.6502 1.03769 11.8254L0.993343 11.7636C0.782379 11.4702 0.541516 11.1352 0.541516 10.6667C0.541516 10.1982 0.782379 9.86318 0.993342 9.56978L1.03769 9.50793C1.6259 8.68312 2.67746 7.37146 4.1001 6.26082ZM4.86932 7.24612C3.57683 8.25515 2.60558 9.46224 2.05541 10.2337C1.91931 10.4246 1.85453 10.5177 1.81592 10.5919C1.79137 10.6391 1.79144 10.652 1.79151 10.6647L1.79152 10.6667L1.79151 10.6687C1.79144 10.6813 1.79137 10.6942 1.81592 10.7414C1.85453 10.8156 1.91931 10.9088 2.05541 11.0996C2.60558 11.8711 3.57683 13.0782 4.86932 14.0872C6.16308 15.0972 7.7343 15.875 9.49985 15.875C11.2654 15.875 12.8366 15.0972 14.1304 14.0872C15.4229 13.0782 16.3941 11.8711 16.9443 11.0996C17.0804 10.9088 17.1452 10.8156 17.1838 10.7414C17.2083 10.6942 17.2083 10.6813 17.2082 10.6687L17.2082 10.6667L17.2082 10.6647C17.2083 10.652 17.2083 10.6391 17.1838 10.5919C17.1452 10.5177 17.0804 10.4246 16.9443 10.2337C16.3941 9.46224 15.4229 8.25515 14.1304 7.24612C12.8366 6.23609 11.2654 5.45833 9.49985 5.45833C7.7343 5.45833 6.16308 6.23609 4.86932 7.24612Z" fill="#161616" />
                                                </svg>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
export default ComplaintInformation;