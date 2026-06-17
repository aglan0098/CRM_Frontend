//=====================================
// Updated ServicesSearchHeader.jsx (Component 25) - ENHANCED SEARCH FUNCTIONALITY
import React, { useState, useRef } from 'react';
import { useTranslation } from './TranslationContext';
import { useSearch } from './SearchContext';

const ServicesSearchHeader = () => {
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const { t } = useTranslation();
  const { updateSearchTerm, clearSearch } = useSearch();
  const inputRef = useRef(null);

  const handleSearch = () => {
    updateSearchTerm(localSearchTerm);
    setHasSearched(true);
  };

  const handleClearSearch = () => {
    setLocalSearchTerm('');
    clearSearch();
    setHasSearched(false);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleInputChange = (e) => {
    setLocalSearchTerm(e.target.value);
  };

  return (
    <div className="header-section">
      <div className="search-container">
        <div className="search-icon-services">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M8.16699 0.0415039C3.67968 0.0415039 0.0419922 3.67919 0.0419922 8.1665C0.0419922 12.6538 3.67968 16.2915 8.16699 16.2915C10.1857 16.2915 12.0324 15.5553 13.4534 14.3368L16.8917 17.7751C17.1358 18.0192 17.5315 18.0192 17.7756 17.7751C18.0197 17.531 18.0197 17.1353 17.7756 16.8912L14.3373 13.4529C15.5558 12.0319 16.292 10.1852 16.292 8.1665C16.292 3.67919 12.6543 0.0415039 8.16699 0.0415039ZM1.29199 8.1665C1.29199 4.36955 4.37004 1.2915 8.16699 1.2915C11.964 1.2915 15.042 4.36955 15.042 8.1665C15.042 11.9635 11.964 15.0415 8.16699 15.0415C4.37004 15.0415 1.29199 11.9635 1.29199 8.1665Z" fill="#161616"/>
          </svg>
        </div>
        <input 
          ref={inputRef}
          type="text" 
          className="search-input-services" 
          placeholder={t('searchServices')}
          value={localSearchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          autoComplete="off"
        />
      </div>
      <button className="filter-btn" onClick={handleSearch}>
        {t('search')}
      </button>
      {hasSearched && (
        <button className="clear-btn" onClick={handleClearSearch}>
          {t('clear')}
        </button>
      )}
    </div>
  );
};

export default ServicesSearchHeader;