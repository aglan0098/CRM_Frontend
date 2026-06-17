//=====================================
// Updated SearchBar.jsx (Component 19)
import React from 'react';
import searchicon from './searchicon.png'
import { useTranslation } from './TranslationContext';

const SearchBar = () => {
  const { t } = useTranslation();
  
  return (
    <div className="search-menubar">
      <img src={searchicon} alt="Search Icon" className="search-icon" />
      <input type="text" placeholder={t('search')} className="placeholdermenu" />
    </div>
  );
};

export default SearchBar;