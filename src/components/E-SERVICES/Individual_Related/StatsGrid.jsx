//=====================================
// Updated StatsGrid.jsx (Component 29)
import React from 'react';
import StatCard from './StatCard';
import TotalCases from './TotalCases.png'
import Opened from './Opened.png';
import Closed from './Closed.png';
import Pendings from './Pendings.png';
import { useTranslation } from './TranslationContext';
import CasesComponent from '../Individual/API/API';

const StatsGrid = () => {
  const { t, language } = useTranslation();
  const { apiResponse, loading, error } = CasesComponent({ language });
  
  // Extract stats from API response with fallbacks
  const totalCases = apiResponse?.totalCases || 0;
  const openCounts = apiResponse?.openCounts || 0;
  const closedCounts = apiResponse?.closedCounts || 0;
  const pendingActions = apiResponse?.pendingActions || 0;

  // Show loading state with animated dots or skeleton
  if (loading) {
    return (
      <div className="stats-grid">
        <StatCard icon={TotalCases} label={t('totalCases')} number="--" filter="total" />
        <StatCard icon={Opened} label={t('open')} number="--" filter="open" />
        <StatCard icon={Closed} label={t('closed')} number="--" filter="closed" />
        <StatCard icon={Pendings} label={t('pendingActions')} number="--" filter="pending" />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="stats-grid">
        <StatCard icon={TotalCases} label={t('totalCases')} number="0" filter="total" />
        <StatCard icon={Opened} label={t('open')} number="0" filter="open" />
        <StatCard icon={Closed} label={t('closed')} number="0" filter="closed" />
        <StatCard icon={Pendings} label={t('pendingActions')} number="0" filter="pending" />
      </div>
    );
  }

  return (
    <div className="stats-grid">
      <StatCard 
        icon={TotalCases} 
        label={t('totalCases')} 
        number={loading ? "--" : totalCases.toString()} 
        filter="total" 
      />
      <StatCard 
        icon={Opened} 
        label={t('open')} 
        number={loading ? "--" : openCounts.toString()} 
        filter="open" 
      />
      <StatCard 
        icon={Closed} 
        label={t('closed')} 
        number={loading ? "--" : closedCounts.toString()} 
        filter="closed" 
      />
      <StatCard 
        icon={Pendings} 
        label={t('pendingActions')} 
        number={loading ? "--" : pendingActions.toString()} 
        filter="pending" 
      />
    </div>
  );
};

export default StatsGrid;