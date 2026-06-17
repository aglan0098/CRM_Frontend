// Updated PageHeader.jsx - Now handles complaint escalation breadcrumbs (Component 15)
import React, { useState, useEffect, useRef } from 'react';
import Moon from './Moon.png';
import Translate from './Translate.png';
import Bell from './Bell.png';
import Vector from './Vector.png';
import { useTranslation } from './TranslationContext';
import GlobalStyles from './GlobalStyles';
import NotificationsDropdown from './NotificationsDropdown';
import { getRemovedNotifications } from './sharedNotificationsState';

const PageHeader = ({ activeMenuItem, onMenuClick, originSection, notifications = [], notificationsLoading, notificationsError, userFirstName = '' }) => {
  const { t, toggleLanguage, isRTL } = useTranslation();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [previousCount, setPreviousCount] = useState(0);
  const [forceUpdate, setForceUpdate] = useState(0);
  const autoCloseTimerRef = useRef(null);

  // Calculate notification count - filter out removed notifications
  const getFilteredNotificationCount = () => {
    if (!notifications || notifications.length === 0) return 0;
    
    // Get all case IDs from notifications
    const allCaseIds = notifications.flatMap(n => 
      n.cases ? n.cases.map(c => c.caseId) : []
    );
    
    // Get current removed notifications from shared state
    const removedIds = getRemovedNotifications();
    
    // Filter out removed notifications
    const visibleCaseIds = allCaseIds.filter(id => !removedIds.includes(id));
    
    return visibleCaseIds.length;
  };
  
  const notificationCount = getFilteredNotificationCount();
  
  // Debug logging
  console.log('🔍 PageHeader - notifications:', notifications);
  console.log('🔍 PageHeader - removedNotifications:', getRemovedNotifications());
  console.log('🔍 PageHeader - notificationCount:', notificationCount);
  console.log('🔍 PageHeader - forceUpdate:', forceUpdate);

  // Auto-open dropdown when new notifications arrive
  useEffect(() => {
    if (notificationCount > previousCount && notificationCount > 0) {
      console.log('🔔 New notification detected! Auto-opening dropdown...');
      setIsNotificationsOpen(true);

      // Clear any existing timer
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
      }

      // Auto-close after 5 seconds
      autoCloseTimerRef.current = setTimeout(() => {
        console.log('⏰ Auto-closing notifications dropdown');
        setIsNotificationsOpen(false);
      }, 5000);
    }

    setPreviousCount(notificationCount);

    // Cleanup timer on unmount
    return () => {
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
      }
    };
  }, [notificationCount, previousCount]);

  const handleBellClick = () => {
    // Clear auto-close timer when user manually clicks
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
    }
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  const handleCloseNotifications = () => {
    // Clear auto-close timer when user manually closes
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
    }
    setIsNotificationsOpen(false);
  };
  
  const getPageConfig = (menuItem) => {
    switch (menuItem) {
      case 'dashboard':
        return {
          breadcrumbs: [{ text: t('dashboard'), menuItem: 'dashboard' }],
          title: t('dashboard')
        };
      case 'services':
        return {
          breadcrumbs: [
            { text: t('dashboard'), menuItem: 'dashboard' },
            { text: t('services'), menuItem: 'services' }
          ],
          title: t('services')
        };
      case 'requests':
        return {
          breadcrumbs: [
            { text: t('dashboard'), menuItem: 'dashboard' },
            { text: t('myRequests'), menuItem: 'requests' }
          ],
          title: t('myRequests')
        };
      case 'complaint-escalation':
        // Show different breadcrumbs based on where the user came from
        if (originSection === 'dashboard') {
          return {
            breadcrumbs: [
              { text: t('dashboard'), menuItem: 'dashboard' },
              { text: t('latestRequest'), menuItem: 'complaint-escalation' }
            ],
            title: t('requestDetails')
          };
        } else {
          return {
            breadcrumbs: [
              { text: t('dashboard'), menuItem: 'dashboard' },
              { text: t('myRequests'), menuItem: 'requests' },
              { text: t('requestDetails'), menuItem: 'complaint-escalation' }
            ],
            title: t('requestDetails')
          };
        }
      default:
        return {
          breadcrumbs: [{ text: t('dashboard'), menuItem: 'dashboard' }],
          title: t('dashboard')
        };
    }
  };

  const config = getPageConfig(activeMenuItem);

  return (
    <>
      <GlobalStyles />
      <div className="card-back">
        <img src={Vector} alt="Vector" className="Vector-img" />
        <div className="vernav">
          {/* <img src={Moon} alt="Moon" className="vernav-img" /> */}
          <img 
            src={Translate} 
            alt="Translate" 
            className="vernav-img" 
            onClick={toggleLanguage}
            style={{ cursor: 'pointer' }}
          />
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img 
              src={Bell} 
              alt="Bell" 
              className="vernav-img bell-icon" 
              onClick={handleBellClick}
              style={{ cursor: 'pointer' }}
            />
            {notificationCount > 0 && (
              <span 
                className="notification-badge"
                style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  backgroundColor: '#E53E3E',
                  color: 'white',
                  borderRadius: '50%',
                  padding: '2px 6px',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  minWidth: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                {notificationCount}
              </span>
            )}
          </div>
        </div>
      <ol className="BreadCrumbs">
        {config.breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            <li className="link-item">
              <button 
                className="text breadcrumb-link" 
                onClick={() => onMenuClick && onMenuClick(crumb.menuItem)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  textDecoration: 'none',
                  color: '#14573A',
                  fontSize: 'inherit',
                  fontFamily: 'inherit'
                }}
              >
                {crumb.text}
              </button>
            </li>
            {index < config.breadcrumbs.length - 1 && (
              <span className="arrow" aria-hidden="true">
                {'>'}
              </span>
            )}
          </React.Fragment>
        ))}
      </ol>
      <h1 className="service-title">{config.title}</h1>
      </div>
      <NotificationsDropdown 
        isOpen={isNotificationsOpen} 
        onClose={handleCloseNotifications}
        notifications={notifications}
        notificationsLoading={notificationsLoading}
        notificationsError={notificationsError}
        onNotificationsRemoved={() => setForceUpdate(prev => prev + 1)}
        userFirstName={userFirstName}
      />
    </>
  );
};

export default PageHeader;