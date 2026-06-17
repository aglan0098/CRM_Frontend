//=====================================
// Updated MyRequestsSearchFilters.jsx (Component 10) - Now with API integration
import React from 'react';
import { useTranslation } from './TranslationContext';

const MyRequestsSearchFilters = ({ 
  onSearchChange,
  onStatusFilterChange,
  onRequestTypeFilterChange,
  uniqueStatuses,
  uniqueRequestTypes
}) => {
  const { t } = useTranslation();
  
  const handleSearchInputChange = (e) => {
    onSearchChange(e.target.value);
  };

  // Helper function to get status text
   const getStatusText = (status) => {
        const statusLower = status?.toLowerCase() || '';
        if (statusLower.includes('action required')) return t('actionRequired');
        if (statusLower.includes('resolved')) return t('resolved');
        if (statusLower.includes('submitted')) return t('Submitted');
        if (statusLower.includes('in progress')) return t('InProgress');
        if (statusLower.includes('draft')) return t('draft');
        return t('InProgress') || t('InProgress');
   };
  
  const handleStatusChange = (e) => {
    onStatusFilterChange(e.target.value);
  };
  
  const handleRequestTypeChange = (e) => {
    onRequestTypeFilterChange(e.target.value);
  };
  
  return (
    <div className="search-filters">
      <input 
        type="text" 
        className="search-input" 
        placeholder={`${t('search')}...`}
        onChange={handleSearchInputChange}
      />
      <select className="filter-select" onChange={handleStatusChange}>
        <option value="">{t('status')}</option>
        {uniqueStatuses.map((status, index) => (
          <option key={index} value={status}>{getStatusText(status)}</option>
        ))}
      </select>
      <select className="filter-select" onChange={handleRequestTypeChange}>
        <option value="">{t('requestType')}</option>
        {uniqueRequestTypes.map((requestType, index) => (
          <option key={index} value={requestType}>{t(requestType)}</option>
        ))}
      </select>
    </div>
  );
};

export default MyRequestsSearchFilters;