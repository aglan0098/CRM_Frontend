// Updated RequestsTable.jsx - Now translates data values (Component 18)
import React from 'react';
import { useTranslation } from './TranslationContext';
import edit from './edit.png'

const RequestsTable = ({ onViewDetails, filters = {}, allData = [], loading, error }) => {
  const { t, isRTL } = useTranslation();

  // Filter the data based on search and filter criteria
  const getFilteredData = () => {
    if (!allData || allData.length === 0) return [];
    
    let filteredData = [...allData];
   
    
    // Search filter (searches in caseNumber, subject, requestType)
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filteredData = filteredData.filter(item => 
        item.caseNumber?.toLowerCase().includes(searchLower) ||
        item.subject?.toLowerCase().includes(searchLower) ||
        item.requestType?.toLowerCase().includes(searchLower)
      );

    }
    
    // Status filter
    if (filters.statusFilter) {
      filteredData = filteredData.filter(item => 
        item.status === filters.statusFilter
      );

    }
    
    // Service type filter
    if (filters.serviceTypeFilter) {
      filteredData = filteredData.filter(item => 
        item.requestType === filters.serviceTypeFilter
      );

    }
    

    return filteredData;
  };

  const handleViewDetails = (caseData) => {
    // Create complaint data from API response
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

    if (onViewDetails) {
      onViewDetails(complaintData, 'dashboard');
    }
  };
  
  
  return (
    <div className="table-wrapper">
      <table className="requests-table">
        <thead>
          <tr>
            <th>{t('requestNumber')}</th>
            <th>{t('serviceType')}</th>
            <th>{t('activityType')}</th>
            <th>{t('status')}</th>
            <th>{t('submissionDate')}</th>
            <th>{t('actions')}</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            // Loading state - show 3 skeleton rows
            Array.from({ length: 3 }).map((_, index) => (
              <tr key={`loading-${index}`}>
                <td>--</td>
                <td>--</td>
                <td>--</td>
                <td><span className="status-badge">--</span></td>
                <td>--</td>
                <td>--</td>
              </tr>
            ))
          ) : error ? (
            // Error state
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                Error loading data
              </td>
            </tr>
          ) : (
            // Real data - show filtered records (first 3)
            getFilteredData().slice(0, 3).map((caseItem, index) => {
              // Helper function to get status class
              const getStatusClass = (status) => {
                const statusLower = status?.toLowerCase() || '';
                if (statusLower.includes('action required')) return 'status-action-required';
                if (statusLower.includes('resolved')) return 'status-resolved';
                if (statusLower.includes('submitted')) return 'status-submitted';
                if (statusLower.includes('in progress')) return 'status-inprogress';
                if (statusLower.includes('draft')) return 'status-draft';
                return 'status-inprogress';
              };

              // Helper function to get status text
              const getStatusText = (status) => {
                const statusLower = status?.toLowerCase() || '';
                if (statusLower.includes('action required')) return t('actionRequired');
                if (statusLower.includes('resolved')) return t('resolved');
                if (statusLower.includes('submitted')) return t('Submitted');
                if (statusLower.includes('in progress')) return t('InProgress');
                if (statusLower.includes('draft')) return t('draft');
                return t('InProgress');
              };

              return (
                <tr key={caseItem.caseId || index}>
                  <td>
                    <a href="#" className="case-number" onClick={(e) => {
                  e.preventDefault();
                  handleViewDetails(caseItem);
                }}>
                  {caseItem.caseNumber}
                </a>
                  </td>
                  {/* CHANGED: Now using t() to translate data values */}
                  <td>{t(caseItem.requestType) || '-'}</td>
                  <td>{t(caseItem.activityType) || '-'}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(caseItem.status)}`}>
                      {getStatusText(caseItem.status)}
                    </span>
                  </td>
                  <td>{caseItem.creationDate || '-'}</td>
                  <td>
                    {caseItem.status?.toLowerCase().includes('draft') ? (
                      <>
                        {t('editApplication')} <img src={edit} alt="edit" className="menu1img" />
                      </>
                    ) : (
                      <button 
                        onClick={() => handleViewDetails(caseItem)}
                        style={{ background: 'none', border: 'none', color: 'black', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'}}
                      >
                        {t('viewDetails')} {isRTL ? <svg xmlns="http://www.w3.org/2000/svg" width="5" height="9" viewBox="0 0 5 9" fill="none">
  <path d="M4.79648 0.902478C4.68889 0.983736 4.36773 1.22634 4.18259 1.37083C3.81178 1.66021 3.31906 2.05561 2.82779 2.48215C2.33405 2.91085 1.85319 3.36119 1.49969 3.76126C1.32244 3.96187 1.18775 4.13809 1.10008 4.28351C1.01763 4.42028 1.00049 4.50107 1.00049 4.50107C1.00049 4.50107 1.01764 4.57949 1.10008 4.71625C1.18775 4.86167 1.32243 5.03789 1.49969 5.2385C1.85318 5.63858 2.33405 6.08892 2.8278 6.51761C3.31907 6.94415 3.8118 7.33955 4.18261 7.62894C4.36776 7.77342 4.68846 8.01569 4.79605 8.09695C5.0184 8.2607 5.06635 8.57404 4.9026 8.79639C4.73884 9.01873 4.42584 9.06623 4.2035 8.90248L4.20194 8.9013C4.08923 8.81618 3.75637 8.56477 3.56739 8.41728C3.1882 8.12137 2.68093 7.71441 2.17219 7.27271C1.66594 6.83316 1.14681 6.34938 0.750305 5.90064C0.552559 5.67684 0.374748 5.44998 0.243664 5.23253C0.120854 5.02882 -2.30468e-06 4.77089 0 4.49988C2.30475e-06 4.22887 0.120858 3.97095 0.243668 3.76723C0.374752 3.54979 0.552562 3.32293 0.750307 3.09913C1.14681 2.65038 1.66594 2.1666 2.17218 1.72705C2.68091 1.28535 3.18818 0.878398 3.56736 0.582479C3.75641 0.434942 4.08914 0.183626 4.20172 0.0985967L4.20314 0.0975198C4.42549 -0.0662366 4.73881 -0.018973 4.90257 0.203375C5.06632 0.425715 5.01881 0.738717 4.79648 0.902478Z" fill="#161616"/>
</svg> : <svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" viewBox="0 0 6 10" fill="none">
  <path d="M0.316096 8.15999C0.423678 8.07874 0.744841 7.83613 0.929981 7.69165C1.30079 7.40226 1.79352 7.00686 2.28478 6.58032C2.77852 6.15163 3.25939 5.70128 3.61288 5.30121C3.79013 5.1006 3.92482 4.92438 4.01249 4.77896C4.09494 4.64219 4.11208 4.5614 4.11208 4.5614C4.11208 4.5614 4.09494 4.48298 4.01249 4.34622C3.92483 4.2008 3.79014 4.02458 3.61288 3.82397C3.25939 3.4239 2.77852 2.97356 2.28477 2.54486C1.7935 2.11832 1.30077 1.72292 0.929958 1.43354C0.744816 1.28905 0.424108 1.04678 0.316524 0.965525C0.0941753 0.80177 0.0462179 0.488434 0.209973 0.266085C0.373728 0.0437366 0.686727 -0.00376274 0.909076 0.159993L0.910769 0.161271C1.02361 0.246498 1.35628 0.497765 1.54519 0.645186C1.92437 0.941104 2.43164 1.34806 2.94038 1.78976C3.44663 2.22931 3.96576 2.71309 4.36227 3.16183C4.56001 3.38563 4.73782 3.61249 4.86891 3.82994C4.99172 4.03366 5.11257 4.29158 5.11257 4.56259C5.11257 4.8336 4.99171 5.09153 4.8689 5.29524C4.73782 5.51268 4.56001 5.73954 4.36227 5.96335C3.96577 6.41209 3.44664 6.89587 2.94039 7.33542C2.43166 7.77712 1.9244 8.18407 1.54521 8.47999C1.35618 8.62752 1.02349 8.8788 0.910884 8.96385L0.909428 8.96495C0.68708 9.12871 0.373764 9.08144 0.210007 8.8591C0.0462561 8.63676 0.0937666 8.32376 0.316096 8.15999Z" fill="#161616"/>
</svg>}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RequestsTable;