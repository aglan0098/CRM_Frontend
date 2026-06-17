import React from 'react';

const RenewalStatusBadge = ({ 
  status, 
  size = 'default',
  language = 'en'
}) => {
  
  const translations = {
    en: {
      active: 'Active',
      expiring: 'Expiring',
      expired: 'Expired',
      noStatus: 'No Status'
    },
    ar: {
      active: 'نشط',
      expiring: 'ينتهي قريباً',
      expired: 'منتهي الصلاحية',
      noStatus: 'لا يوجد حالة'
    }
  };

  const t = translations[language] || translations.en;

  // Get CSS classes based on status
  const getStatusClasses = (status) => {
    const baseClasses = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";
    
    switch(status) {
      case 'Active':
      case t.active:
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'Expiring':
      case t.expiring:
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'Expired':
      case t.expired:
        return `${baseClasses} bg-red-100 text-red-800`;
      default: 
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const displayStatus = status || t.noStatus;
  const statusClasses = getStatusClasses(displayStatus);

  return (
    <span className={statusClasses}>
      {displayStatus}
    </span>
  );
};

export default RenewalStatusBadge;