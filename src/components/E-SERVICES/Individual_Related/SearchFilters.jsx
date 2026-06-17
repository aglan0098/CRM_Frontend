//=====================================
// Updated SearchFilters.jsx (Component 20) - Fixed infinite re-render issue
import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from './TranslationContext';

const SearchFilters = ({ onFiltersChange, allData = [] }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('');

  // Get unique values for filter options
  const uniqueStatuses = [...new Set(allData.map(item => item.status).filter(Boolean))];
  const uniqueServiceTypes = [...new Set(allData.map(item => item.requestType).filter(Boolean))];

  // Memoize the filter object to prevent unnecessary calls
  const filterObject = useCallback(() => ({
    searchTerm,
    statusFilter,
    serviceTypeFilter
  }), [searchTerm, statusFilter, serviceTypeFilter]);
  

  // Notify parent component when filters change
  // REMOVED onFiltersChange from dependencies to prevent infinite loop
  useEffect(() => {
    if (onFiltersChange) {
      onFiltersChange(filterObject());
    }
  }, [searchTerm, statusFilter, serviceTypeFilter, filterObject]); // Removed onFiltersChange

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
  
  return (
    <div className="search-filters">
      <input
        type="text"
        className="search-input"
        placeholder={`${t('search')}...`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select 
        className="filter-select"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="">{t('status')}</option>
        {uniqueStatuses.map(status => (
          <option key={status} value={status}>
            {getStatusText(status)}
          </option>
        ))}
      </select>
      <select 
        className="filter-select"
        value={serviceTypeFilter}
        onChange={(e) => setServiceTypeFilter(e.target.value)}
      >
        <option value="">{t('serviceType')}</option>
        {uniqueServiceTypes.map(serviceType => (
          <option key={serviceType} value={serviceType}>
            {t(serviceType)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchFilters;