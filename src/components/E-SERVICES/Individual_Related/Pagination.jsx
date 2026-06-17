//=====================================
// Updated Pagination.jsx (Component 16) - Fixed pagination logic
import React from 'react';
import { useTranslation } from './TranslationContext';

const Pagination = ({ 
  currentPage = 1, 
  totalPages = 1, 
  onPageChange, 
  totalItems = 0, 
  itemsPerPage = 4,
  totalUnfilteredItems = 0
}) => {
  const { t } = useTranslation();

  const handlePageClick = (page) => {
    if (page === '...' || page === currentPage) return;
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages with ellipsis
      if (currentPage <= 2) {
        // Show first 3 pages, ellipsis, and last page
        // Changed condition from <= 3 to <= 2
        for (let i = 1; i <= 3; i++) {
          pages.push(i);
        }
        if (totalPages > 4) {
          pages.push('...');
        }
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 1) {
        // Show first page, ellipsis, and last 3 pages
        // Changed condition from >= totalPages - 2 to >= totalPages - 1
        pages.push(1);
        if (totalPages > 4) {
          pages.push('...');
        }
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show first page, ellipsis, current-1, current, current+1, ellipsis, last page
        pages.push(1);
        if (currentPage > 3) {
          pages.push('...');
        }
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
          pages.push(i);
        }
        if (currentPage < totalPages - 2) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }
    
    return [...new Set(pages)]; // Remove duplicates
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  
  const paginationInfo = totalItems > 0 
    ? `${startItem}-${endItem} of ${totalUnfilteredItems || totalItems}`
    : t('paginationInfo');

  if (totalPages <= 1) {
    return (
      <div className="pagination">
        <span className="pagination-info">{paginationInfo}</span>
      </div>
    );
  }

  return (
    <div className="pagination">
      <span className="pagination-info">{paginationInfo}</span>
      <div className="pagination-controls">
        {/* Previous button */}
        <button 
          className="pagination-btn"
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ‹
        </button>
        
        {/* Page numbers */}
        {generatePageNumbers().map((page, index) => (
          <button 
            key={index}
            className={`pagination-btn ${page === currentPage ? 'active' : ''} ${page === '...' ? 'ellipsis' : ''}`}
            onClick={() => handlePageClick(page)}
            disabled={page === '...'}
          >
            {page}
          </button>
        ))}
        
        {/* Next button */}
        <button 
          className="pagination-btn"
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default Pagination;