// Updated RequestsSection.jsx - Now passes onViewDetails prop (Component 17)
import React, { useState, useMemo, useCallback } from 'react';
import SearchFilters from './SearchFilters';
import RequestsTable from './RequestsTable';
import { useTranslation } from './TranslationContext';
import CasesComponent from '../Individual/API/API';

const RequestsSection = ({ onViewDetails }) => {
  const { t, language } = useTranslation();
  const [filters, setFilters] = useState({});
  
  // Memoize the language to prevent unnecessary re-renders
  const memoizedLanguage = useMemo(() => language, [language]);
  
  const { apiResponse, loading, error } = CasesComponent({ language: memoizedLanguage });

  // Memoize the sliced data to prevent creating new arrays on every render
  const slicedData = useMemo(() => {
    return (apiResponse?.data || []).slice(0, 3);
  }, [apiResponse?.data]);

  // Memoize the handleFiltersChange function to prevent infinite re-renders
  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []); // Empty dependency array since setFilters is stable
  
  return (
    <div className="dash-requests-section">
      <h3 className="section-title section-title-margin">{t('latestRequests')}</h3>
      <SearchFilters 
        onFiltersChange={handleFiltersChange}
        allData={slicedData}
      />
      <RequestsTable 
        onViewDetails={onViewDetails}
        filters={filters}
        allData={slicedData}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default RequestsSection;