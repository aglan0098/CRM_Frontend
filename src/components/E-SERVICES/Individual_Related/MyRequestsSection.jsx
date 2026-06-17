// Updated MyRequestsSection.jsx - Now integrates API data (Component 11)
import React, { useState, useEffect } from 'react';
import MyRequestsSearchFilters from './MyRequestsSearchFilters';
import MyRequestsTable from './MyRequestsTable';
import Pagination from './Pagination';
import { useTranslation } from './TranslationContext';
import CasesComponent from '../Individual/API/API';

const MyRequestsSection = ({ onViewDetails }) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [requestTypeFilter, setRequestTypeFilter] = useState('');
  
  const rowsPerPage = 4;
  
  // Get API data and functions
  const { apiResponse, loading, error, refetch } = CasesComponent({ language: t('language') || 'en' });
  
  // Filter and paginate data
  const getFilteredData = () => {
    if (!apiResponse?.data) return [];
    
    return apiResponse.data.filter(caseItem => {
      const matchesSearch = !searchTerm || 
        caseItem.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.subject.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !statusFilter || caseItem.status === statusFilter;
      const matchesRequestType = !requestTypeFilter || caseItem.requestType === requestTypeFilter;
      
      return matchesSearch && matchesStatus && matchesRequestType;
    });
  };
  
  const filteredData = getFilteredData();
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentPageData = filteredData.slice(startIndex, endIndex);
  
  // Get unique values for filters
  const getUniqueValues = (field) => {
    if (!apiResponse?.data) return [];
    return [...new Set(apiResponse.data.map(item => item[field]).filter(Boolean))];
  };
  
  const uniqueStatuses = getUniqueValues('status');
  const uniqueRequestTypes = getUniqueValues('requestType');
  
  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, requestTypeFilter]);
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };
  
  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
  };
  
  const handleRequestTypeFilterChange = (requestType) => {
    setRequestTypeFilter(requestType);
  };
  
  if (loading) {
    return (
      <div className="requests-section">
        <h3 className="section-title">{t('allRequests')}</h3>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          {t('loading') || 'Loading...'}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="requests-section">
        <h3 className="section-title">{t('allRequests')}</h3>
        <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
          {t('error') || 'Error'}: {error}
        </div>
      </div>
    );
  }
  
  return (
    <div className="requests-section">
      <h3 className="my-section-title">{t('allRequests')}</h3>
      <div className="table-content-wrapper">
        <MyRequestsSearchFilters 
          onSearchChange={handleSearchChange}
          onStatusFilterChange={handleStatusFilterChange}
          onRequestTypeFilterChange={handleRequestTypeFilterChange}
          uniqueStatuses={uniqueStatuses}
          uniqueRequestTypes={uniqueRequestTypes}
        />
        <MyRequestsTable 
          onViewDetails={onViewDetails}
          data={currentPageData}
          loading={loading}
        />
      </div>
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalItems={filteredData.length}
        itemsPerPage={rowsPerPage}
        totalUnfilteredItems={apiResponse?.totalCases || 0}
      />
    </div>
  );
};

export default MyRequestsSection;