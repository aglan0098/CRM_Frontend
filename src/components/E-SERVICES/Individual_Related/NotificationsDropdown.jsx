// NotificationsDropdown.jsx - Dropdown component for notifications
import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { useTranslation } from './TranslationContext';
import { getRemovedNotifications, setRemovedNotifications, addRemovedNotification, addAllRemovedNotifications } from './sharedNotificationsState';

const NotificationsDropdown = ({ isOpen, onClose, notifications = [], notificationsLoading, notificationsError, onNotificationsRemoved, userFirstName = '' }) => {
  const { t, language } = useTranslation();
  const [removedNotifications, setRemovedNotifications] = useState(getRemovedNotifications());

  // Helper functions - MOVED BEFORE useMemo
  const getStatusType = (status) => {
    switch (status) {
      case 'Action Required': return 'action-required';
      case 'Resolved': return 'resolved';
      case 'In Progress': return 'inprogress';
      case 'Submitted': return 'submitted';
      default: return 'default';
    }
  };

  const getNotificationTitle = (status, isModified) => {
    if (isModified) {
      switch (status) {
        case 'Action Required': return t('additionalInfoRequired');
        case 'Resolved': return t('complaintResolved');
        case 'In Progress': return t('statusUpdated');
        case 'Submitted': return t('requestUpdated');
        default: return t('notificationUpdate');
      }
    } else {
      switch (status) {
        case 'Action Required': return t('additionalInfoRequired');
        case 'Resolved': return t('complaintResolved');
        case 'In Progress': return t('complaintUpdate');
        case 'Submitted': return t('requestSubmitted');
        default: return t('newNotification');
      }
    }
  };

  const getNotificationMessage = (status, caseNumber, isModified, oldStatus, userName) => {
    const displayName = userName || 'User';
    
    switch (status) {
      case 'Action Required':
        return t('requireAdditionalInfo')
          .replace('{userName}', displayName)
          .replace('{caseNumber}', caseNumber);
      case 'Resolved':
        return t('successfullyResolved')
          .replace('{userName}', displayName)
          .replace('{caseNumber}', caseNumber);
      case 'In Progress':
        return t('underReview')
          .replace('{userName}', displayName)
          .replace('{caseNumber}', caseNumber);
      case 'Submitted':
        return t('requestReceived')
          .replace('{userName}', displayName)
          .replace('{caseNumber}', caseNumber);
      default:
        const prefix = isModified 
          ? t('yourCaseUpdated').replace('{caseNumber}', caseNumber)
          : t('yourRequest').replace('{caseNumber}', caseNumber);
        return `${prefix} ${t('hasBeenUpdated')}`;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Action Required': return <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.91024 8.83008C5.91024 8.50791 6.1714 8.24674 6.49357 8.24674H6.49881C6.82098 8.24674 7.08214 8.50791 7.08214 8.83008C7.08214 9.15224 6.82098 9.41341 6.49881 9.41341H6.49357C6.1714 9.41341 5.91024 9.15224 5.91024 8.83008Z" fill="#93370D"/>
        <path d="M6.06063 7.08008C6.06063 7.3217 6.2565 7.51758 6.49813 7.51758C6.73975 7.51758 6.93563 7.3217 6.93563 7.08008V4.74674C6.93563 4.50512 6.73975 4.30924 6.49813 4.30924C6.2565 4.30924 6.06063 4.50512 6.06063 4.74674V7.08008Z" fill="#93370D"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M5.54262 0.672162C6.16355 0.46605 6.83271 0.46605 7.45364 0.672162C8.072 0.877421 8.55752 1.36423 9.04528 2.04821C9.53142 2.72993 10.0686 3.68045 10.761 4.9057L10.7882 4.95381C11.4808 6.17925 12.0179 7.12972 12.3527 7.90052C12.689 8.67508 12.8566 9.34385 12.7229 9.98632C12.5883 10.6332 12.2564 11.2214 11.7731 11.6661C11.2909 12.1096 10.6344 12.2967 9.80772 12.3866C8.98573 12.4759 7.91049 12.4759 6.52657 12.4759H6.46969C5.08577 12.4759 4.01053 12.4759 3.18854 12.3866C2.36187 12.2967 1.70534 12.1096 1.22317 11.6661C0.739825 11.2214 0.407941 10.6332 0.273351 9.98632C0.139677 9.34385 0.307212 8.67508 0.643594 7.90052C0.978346 7.12972 1.5155 6.17924 2.20805 4.9538L2.23523 4.9057C2.92767 3.68045 3.46484 2.72993 3.95098 2.04821C4.43874 1.36423 4.92426 0.877421 5.54262 0.672162ZM7.17798 1.50261C6.73602 1.3559 6.26024 1.3559 5.81828 1.50261C5.47062 1.61801 5.12113 1.91437 4.66339 2.55625C4.20723 3.19591 3.69229 4.10592 2.98335 5.36037C2.27445 6.61474 1.76044 7.52545 1.44617 8.24908C1.13136 8.97396 1.0525 9.43554 1.13001 9.80808C1.22778 10.278 1.46836 10.7027 1.81555 11.0221C2.08822 11.2729 2.5131 11.433 3.28311 11.5167C4.05219 11.6003 5.07981 11.6009 6.49813 11.6009C7.91645 11.6009 8.94407 11.6003 9.71315 11.5167C10.4832 11.433 10.908 11.2729 11.1807 11.0221C11.5279 10.7027 11.7685 10.278 11.8663 9.80808C11.9438 9.43554 11.8649 8.97396 11.5501 8.24908C11.2358 7.52545 10.7218 6.61474 10.0129 5.36037C9.30398 4.10592 8.78903 3.19591 8.33287 2.55625C7.87513 1.91437 7.52564 1.61801 7.17798 1.50261Z" fill="#93370D"/>
        </svg>;
      case 'Resolved': return <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.82324 0.220703C7.7566 0.220691 8.50425 0.220747 9.09082 0.303711C9.69951 0.389854 10.199 0.572936 10.5918 0.986328C10.9816 1.3966 11.152 1.91317 11.2324 2.54297C11.3107 3.15584 11.3106 3.93848 11.3105 4.9248V7.07422C11.3105 7.31584 11.1147 7.51172 10.873 7.51172C10.6314 7.51172 10.4355 7.31584 10.4355 7.07422V4.95605C10.4355 3.93122 10.4346 3.20436 10.3643 2.65332C10.2952 2.11283 10.1661 1.80804 9.95801 1.58887C9.75279 1.37285 9.47192 1.24114 8.96875 1.16992C8.85743 1.15417 8.73831 1.14162 8.61035 1.13184C8.56188 1.42138 8.51924 1.67511 8.45801 1.88086C8.38525 2.12523 8.27508 2.35386 8.06348 2.5332C7.85174 2.71257 7.60758 2.78383 7.35449 2.81543C7.11969 2.84469 6.83069 2.84475 6.49902 2.84473H5.3291C4.99733 2.84475 4.70845 2.84475 4.47363 2.81543C4.22064 2.78381 3.97729 2.71251 3.76562 2.5332C3.55395 2.35385 3.44386 2.12528 3.37109 1.88086C3.30985 1.67507 3.26626 1.42146 3.21777 1.13184C3.0903 1.14161 2.9713 1.15422 2.86035 1.16992C2.35739 1.24115 2.07626 1.3729 1.87109 1.58887C1.66305 1.80803 1.53387 2.11294 1.46484 2.65332C1.39446 3.20436 1.39355 3.93122 1.39355 4.95605L1.39355 8.02637C1.39355 9.0512 1.39446 9.77806 1.46484 10.3291C1.53387 10.8695 1.66305 11.1744 1.87109 11.3936C2.07626 11.6095 2.35739 11.7413 2.86035 11.8125C3.37857 11.8858 4.06459 11.8867 5.04004 11.8867H5.91504C6.15641 11.8869 6.35236 12.0829 6.35254 12.3242C6.35254 12.5657 6.15651 12.7615 5.91504 12.7617H5.00586C4.07234 12.7617 3.3249 12.7617 2.73828 12.6787C2.12956 12.5926 1.63007 12.4095 1.2373 11.9961C0.847619 11.5858 0.677113 11.0692 0.59668 10.4395C0.518456 9.82658 0.518546 9.04392 0.518555 8.05762L0.518555 4.9248C0.518546 3.9385 0.518456 3.15584 0.59668 2.54297C0.677113 1.91323 0.847618 1.39658 1.2373 0.986328C1.63007 0.572895 2.12956 0.389858 2.73828 0.303711C3.3249 0.220702 4.07233 0.220691 5.00586 0.220703L6.82324 0.220703ZM11.8936 8.41211C12.1213 8.33144 12.3715 8.45095 12.4521 8.67871C12.5327 8.90644 12.4133 9.15665 12.1855 9.2373C11.8493 9.35645 11.4737 9.60712 11.0869 9.94629C10.7044 10.2817 10.3337 10.6826 10.0078 11.0732C9.68274 11.4629 9.40661 11.8365 9.21191 12.1123C9.11471 12.25 8.9611 12.4816 8.90918 12.5596C8.82464 12.6924 8.67485 12.7697 8.51758 12.7617C8.36017 12.7537 8.21898 12.6614 8.14844 12.5205C7.88283 11.9893 7.63701 11.7626 7.49512 11.668C7.42412 11.6206 7.37441 11.6027 7.35352 11.5967L7.34375 11.5947C7.11585 11.5797 6.93565 11.3899 6.93555 11.1582C6.93555 10.9166 7.13142 10.7207 7.37305 10.7207C7.69202 10.7207 7.83309 10.8412 7.98047 10.9395C8.16326 11.0613 8.3623 11.2445 8.5625 11.5166C8.76139 11.2386 9.02677 10.8833 9.33594 10.5127C9.6791 10.1014 10.0817 9.66448 10.5098 9.28906C10.9334 8.91757 11.4064 8.58464 11.8936 8.41211ZM5.91504 8.38672C6.15641 8.38689 6.35236 8.58285 6.35254 8.82422C6.35254 9.06573 6.15651 9.26154 5.91504 9.26172L3.58105 9.26172C3.33958 9.26154 3.14355 9.06573 3.14355 8.82422C3.14373 8.58285 3.33969 8.38689 3.58105 8.38672L5.91504 8.38672ZM8.24805 5.4707C8.48967 5.4707 8.68555 5.66658 8.68555 5.9082C8.68537 6.14968 8.48956 6.3457 8.24805 6.3457L3.58105 6.3457C3.33969 6.34553 3.14373 6.14957 3.14355 5.9082C3.14355 5.66669 3.33958 5.47088 3.58105 5.4707L8.24805 5.4707ZM5.04004 1.0957C4.69149 1.0957 4.37968 1.09707 4.09961 1.10059C4.1398 1.33507 4.17134 1.50212 4.20996 1.63184C4.25636 1.78753 4.2981 1.83722 4.33105 1.86523C4.36408 1.89321 4.42011 1.92702 4.58203 1.94727C4.75627 1.96902 4.99022 1.96973 5.35547 1.96973L6.47363 1.96973C6.83851 1.96973 7.07191 1.96896 7.24609 1.94727C7.40821 1.92703 7.46501 1.89322 7.49805 1.86523C7.53099 1.8372 7.57278 1.7874 7.61914 1.63184C7.65775 1.50214 7.68833 1.335 7.72852 1.10059C7.44887 1.09709 7.13792 1.0957 6.79004 1.0957L5.04004 1.0957Z" fill="#085D3A"/>
        </svg>;
      case 'In Progress': return <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.86676 1.27622C5.34864 0.603852 2.77283 1.80588 1.63397 4.01871L2.46943 4.06957C2.71061 4.08425 2.89422 4.29167 2.87954 4.53285C2.86485 4.77402 2.65744 4.95763 2.41626 4.94295L0.952013 4.85381C0.813211 4.84536 0.686692 4.77143 0.611193 4.65465C0.535695 4.53787 0.520209 4.39215 0.569478 4.26211C1.69847 1.28227 4.93722 -0.411656 8.09248 0.430837C11.4533 1.3282 13.4535 4.76583 12.5537 8.11225C11.654 11.4581 8.19806 13.4379 4.83786 12.5407C2.34169 11.8742 0.597301 9.80717 0.232371 7.4177C0.195891 7.17885 0.35995 6.95564 0.598805 6.91917C0.837661 6.88269 1.06086 7.04674 1.09734 7.2856C1.41132 9.34143 2.91292 11.121 5.06358 11.6953C7.96186 12.4692 10.9355 10.7604 11.7087 7.88504C12.4817 5.01027 10.7645 2.04994 7.86676 1.27622Z" fill="#384250"/>
        <path d="M6.93569 4.15243C6.93569 3.91081 6.73982 3.71493 6.49819 3.71493C6.25657 3.71493 6.06069 3.91081 6.06069 4.15243V6.48577C6.06069 6.6018 6.10678 6.71308 6.18883 6.79513L7.3555 7.96179C7.52635 8.13265 7.80336 8.13265 7.97422 7.96179C8.14507 7.79094 8.14507 7.51393 7.97422 7.34307L6.93569 6.30455V4.15243Z" fill="#384250"/>
        </svg>;
      case 'Submitted': return <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.29555 3.27344C2.97355 3.27344 2.70931 3.0121 2.70931 2.6901C2.70931 2.3681 2.96774 2.10677 3.28974 2.10677H3.29555C3.61755 2.10677 3.87888 2.3681 3.87888 2.6901C3.87888 3.0121 3.61755 3.27344 3.29555 3.27344Z" fill="#1849A9"/>
        <path d="M5.04264 2.6901C5.04264 3.0121 5.30688 3.27344 5.62888 3.27344C5.95088 3.27344 6.21221 3.0121 6.21221 2.6901C6.21221 2.3681 5.95088 2.10677 5.62888 2.10677H5.62307C5.30107 2.10677 5.04264 2.3681 5.04264 2.6901Z" fill="#1849A9"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M5.32913 11.5848H5.33146C5.57238 11.5848 5.76779 11.3905 5.76896 11.1496C5.77013 10.9075 5.5753 10.7109 5.3338 10.7098C3.29796 10.6999 2.3541 10.6077 1.7766 10.0623C1.12794 9.44743 1.10229 8.4056 1.10229 5.89844C1.10229 5.52715 1.10286 5.18799 1.10592 4.8776L11.3082 4.8776C11.3094 5.01801 11.3102 5.16414 11.3106 5.31627C11.3112 5.55777 11.5072 5.7526 11.7481 5.7526H11.7493C11.9908 5.75202 12.1862 5.55544 12.1856 5.31394C12.1798 3.18885 12.1325 1.9452 11.2383 1.09995C10.3009 0.210951 8.93238 0.210938 6.20646 0.210938H6.19478C3.47645 0.210938 2.11089 0.212701 1.17464 1.09995C0.227309 1.9977 0.227295 3.30144 0.227295 5.89844C0.227295 8.49544 0.227295 9.7986 1.17521 10.6975C2.03563 11.5107 3.31838 11.5749 5.32913 11.5848ZM11.2889 4.0026L1.12563 4.0026C1.17433 2.80213 1.32342 2.16416 1.7766 1.73461C2.46085 1.08594 3.71271 1.08594 6.20646 1.08594C8.70016 1.08594 9.95206 1.08594 10.6369 1.73518C11.0929 2.16646 11.2412 2.82057 11.2889 4.0026Z" fill="#1849A9"/>
        <path d="M8.80873 10.7109H8.83146V10.7121C8.98021 10.7121 9.11965 10.6362 9.20015 10.5097C9.52856 9.99457 10.2332 9.11199 10.7273 8.93699C10.9548 8.8559 11.0738 8.60565 10.9933 8.37815C10.9122 8.15065 10.6626 8.03167 10.4345 8.11217C9.81791 8.33092 9.20307 9.02625 8.82565 9.52209C8.56723 9.28 8.33506 9.25375 8.24756 9.25375C8.00606 9.25375 7.81006 9.44975 7.81006 9.69125C7.81006 9.91 7.97047 10.0908 8.17988 10.1235C8.20963 10.141 8.31346 10.2168 8.44005 10.47C8.51063 10.6106 8.65123 10.7027 8.80873 10.7109Z" fill="#1849A9"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M9.41479 12.7526C7.56504 12.7526 6.06063 11.2482 6.06063 9.39844C6.06063 7.54869 7.56504 6.04427 9.41479 6.04427C11.2645 6.04427 12.769 7.54869 12.769 9.39844C12.769 11.2482 11.2645 12.7526 9.41479 12.7526ZM9.41479 6.91927C8.04804 6.91927 6.93563 8.03169 6.93563 9.39844C6.93563 10.7652 8.04804 11.8776 9.41479 11.8776C10.7815 11.8776 11.894 10.7652 11.894 9.39844C11.894 8.03169 10.7815 6.91927 9.41479 6.91927Z" fill="#1849A9"/>
        </svg>;
      default: return '🔔';
    }
  };

  const getTranslatedStatus = (status) => {
    switch (status) {
      case 'Action Required': return t('actionRequired');
      case 'Resolved': return t('resolved');
      case 'In Progress': return t('InProgress');
      case 'Submitted': return t('Submitted');
      case 'Draft': return t('draft');
      default: return status;
    }
  };

  const formatTimestamp = (isoString) => {
    if (!isoString) return '';
    
    const date = new Date(isoString);
    const monthKeys = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    
    const month = t(monthKeys[date.getMonth()]);
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    
    return `${month} ${day}, ${displayHours}:${minutes} ${ampm}`;
  };

  // Transform API notifications into UI format
  const transformedNotifications = useMemo(() => {
    console.log('🔍 NotificationsDropdown - notifications:', notifications);
    
    if (!notifications || notifications.length === 0) {
      console.log('🔍 NotificationsDropdown - no notifications to display');
      return [];
    }

    const result = notifications.flatMap(notification => {
      console.log('🔍 NotificationsDropdown - processing notification:', notification);
      
      if (!notification.cases || notification.cases.length === 0) {
        console.log('🔍 NotificationsDropdown - notification has no cases');
        return [];
      }
      
      return notification.cases.map(caseItem => {
        const status = caseItem.newStatus || caseItem.status;
        const isModified = notification.type === 'modified_cases';
        
        const transformed = {
          id: caseItem.caseId,
          caseNumber: caseItem.caseNumber,
          status: status,
          statusType: getStatusType(status),
          title: getNotificationTitle(status, isModified),
          message: getNotificationMessage(status, caseItem.caseNumber, isModified, caseItem.oldStatus, userFirstName),
          timestamp: formatTimestamp(caseItem.newModifiedon || caseItem.modifiedon),
          icon: getStatusIcon(status)
        };
        
        console.log('🔍 NotificationsDropdown - transformed case:', transformed);
        return transformed;
      });
    }).filter(notif => !removedNotifications.includes(notif.id));
    
    console.log('🔍 NotificationsDropdown - final transformed notifications:', result);
    return result;
  }, [notifications, removedNotifications, language, userFirstName]);

  const handleRemoveAll = () => {
    const allIds = transformedNotifications.map(n => n.id);
    
    // Update local state
    const newRemovedIds = [...removedNotifications, ...allIds];
    setRemovedNotifications(newRemovedIds);
    
    // Update global state
    addAllRemovedNotifications(allIds);
    
    // Notify parent component to update count
    if (onNotificationsRemoved) {
      onNotificationsRemoved();
    }
    
    console.log('🗑️ Removing all notifications:', allIds);
  };

  const handleRemoveNotification = (id) => {
    // Update local state
    const newRemovedIds = [...removedNotifications, id];
    setRemovedNotifications(newRemovedIds);
    
    // Update global state
    addRemovedNotification(id);
    
    // Notify parent component to update count
    if (onNotificationsRemoved) {
      onNotificationsRemoved();
    }
    
    console.log('🗑️ Removing notification:', id);
  };

  const getStatusBadgeClass = (statusType) => {
    switch (statusType) {
      case 'action-required':
        return 'status-action-required';
      case 'resolved':
        return 'status-resolved';
      case 'inprogress':
        return 'status-inprogress';
      case 'submitted':
        return 'status-submitted';
      case 'draft':
        return 'status-draft';
      default:
        return 'status-default';
    }
  };

  if (!isOpen) return null;

  // Render the dropdown using a Portal to the document body
  // This ensures it's outside any scrollable containers
  return ReactDOM.createPortal(
    <div className="notifications-dropdown-overlay" onClick={onClose}>
      <div className="notifications-dropdown" onClick={(e) => e.stopPropagation()}>
        <div className="notifications-header">
          <h3 className="notifications-title">{t('notifications')}</h3>
          <div className="notifications-actions">
            <button className="remove-all-btn" onClick={handleRemoveAll}>
              <span className="remove-all-text">{t('removeAll')}</span>
              <span className="trash-icon"><svg width="13" height="15" viewBox="0 0 13 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M6.73703 0.33122C6.98406 0.331883 7.19966 0.335197 7.38504 0.351768C7.63111 0.373775 7.86051 0.421422 8.08331 0.537035C8.17138 0.582722 8.25558 0.635482 8.33511 0.694795C8.53638 0.844888 8.67931 1.0305 8.80644 1.24231C8.92618 1.44184 9.04784 1.69281 9.19111 1.98845L9.51878 2.66439H12.5017C12.7778 2.66439 13.0017 2.88825 13.0017 3.16439C13.0017 3.44053 12.7778 3.66439 12.5017 3.66439H11.9718L11.586 9.90445C11.5346 10.7364 11.4938 11.3965 11.4102 11.9239C11.3244 12.4647 11.187 12.9151 10.9124 13.309C10.661 13.6693 10.3375 13.9735 9.96231 14.2021C9.55224 14.4519 9.09424 14.5612 8.54918 14.6135C8.01771 14.6644 7.35624 14.6644 6.52271 14.6644H6.47098C5.63638 14.6644 4.9741 14.6644 4.44198 14.6134C3.89628 14.561 3.43782 14.4515 3.0274 14.2013C2.65196 13.9723 2.32832 13.6675 2.07712 13.3066C1.80252 12.912 1.66562 12.461 1.58048 11.9194C1.49746 11.3913 1.45756 10.7303 1.40726 9.89712L1.031 3.66439H0.501709C0.225569 3.66439 0.00170898 3.44053 0.00170898 3.16439C0.00170898 2.88825 0.225569 2.66439 0.501709 2.66439H3.54874L3.8281 2.05154C3.96781 1.74502 4.08632 1.48502 4.20432 1.27821C4.32953 1.05874 4.4719 0.866042 4.67556 0.709795C4.75595 0.648128 4.8413 0.593228 4.93076 0.545668C5.15741 0.425148 5.39178 0.375535 5.64344 0.352628C5.88058 0.331055 6.16631 0.331055 6.50318 0.331055L6.73703 0.33122ZM10.9698 3.66439H2.03282L2.40389 9.81105C2.45609 10.6757 2.49364 11.2889 2.56835 11.7641C2.64179 12.2313 2.74464 12.5151 2.89792 12.7354C3.0698 12.9823 3.29123 13.1908 3.54812 13.3475C3.77721 13.4872 4.06676 13.5728 4.53748 13.6179C5.01628 13.6639 5.63064 13.6644 6.49691 13.6644C7.36204 13.6644 7.97551 13.6639 8.45371 13.6181C8.92384 13.5729 9.21311 13.4876 9.44204 13.3481C9.69878 13.1917 9.92018 12.9836 10.0921 12.737C10.2454 12.5171 10.3485 12.2337 10.4225 11.7672C10.4978 11.2927 10.5362 10.6805 10.5895 9.81692L10.9698 3.66439ZM4.83504 5.99772C5.11118 5.99772 5.33504 6.22159 5.33504 6.49772V10.4977C5.33504 10.7739 5.11118 10.9977 4.83504 10.9977C4.5589 10.9977 4.33504 10.7739 4.33504 10.4977V6.49772C4.33504 6.22159 4.5589 5.99772 4.83504 5.99772ZM8.16838 5.99772C8.44451 5.99772 8.66838 6.22159 8.66838 6.49772V10.4977C8.66838 10.7739 8.44451 10.9977 8.16838 10.9977C7.89224 10.9977 7.66838 10.7739 7.66838 10.4977V6.49772C7.66838 6.22159 7.89224 5.99772 8.16838 5.99772ZM6.80117 1.33153L6.27374 1.3314C6.04386 1.33233 5.87391 1.33578 5.73411 1.34851C5.55711 1.36462 5.46711 1.39304 5.40024 1.42861C5.35958 1.45023 5.32078 1.47518 5.28424 1.50321C5.22418 1.54931 5.16096 1.61941 5.07289 1.77377C4.98011 1.93637 4.88014 2.15454 4.72908 2.48595L4.64774 2.66439H8.40751L8.30051 2.44364C8.14551 2.12389 8.04304 1.9136 7.94898 1.75695C7.85978 1.60831 7.79678 1.54077 7.73724 1.49639C7.70111 1.46943 7.66284 1.44545 7.62278 1.42468C7.55691 1.39049 7.46864 1.36323 7.29598 1.34779C7.16598 1.33617 7.00948 1.33261 6.80117 1.33153Z" fill="#161616"/>
</svg>
</span>
            </button>
          </div>
        </div>
        
        <div className="notifications-list">
          {notificationsLoading ? (
            <div className="no-notifications">
              <p>{t('loadingNotifications')}</p>
            </div>
          ) : notificationsError ? (
            <div className="no-notifications">
              <p>{t('errorLoadingNotifications')} {notificationsError}</p>
            </div>
          ) : transformedNotifications.length === 0 ? (
            <div className="no-notifications">
              <p>{t('noNotificationsAvailable')}</p>
            </div>
          ) : (
            transformedNotifications.map((notification) => (
              <div key={notification.id} className="notification-card">
                <button 
                  className="notification-close-btn"
                  onClick={() => handleRemoveNotification(notification.id)}
                >
                  <span className="close-icon"><svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M0.226759 0.221144C0.470837 -0.0229335 0.866565 -0.0229335 1.11064 0.221144L6.50203 5.61254L11.8934 0.221144C12.1375 -0.0229335 12.5332 -0.0229335 12.7773 0.221144C13.0214 0.465222 13.0214 0.86095 12.7773 1.10503L7.38592 6.49642L12.7773 11.8878C13.0214 12.1319 13.0214 12.5276 12.7773 12.7717C12.5332 13.0158 12.1375 13.0158 11.8934 12.7717L6.50203 7.3803L1.11064 12.7717C0.866565 13.0158 0.470837 13.0158 0.226759 12.7717C-0.0173182 12.5276 -0.0173182 12.1319 0.226759 11.8878L5.61815 6.49642L0.226759 1.10503C-0.0173182 0.86095 -0.0173182 0.465222 0.226759 0.221144Z" fill="#384250"/>
                    </svg></span>
                </button>
                
                <div className="notification-content">
                  <div className="notification-header">
                    <h4 className="notification-title">{notification.title}</h4>
                    <div className="notification-status-row">
                      <div className={`status-badge ${getStatusBadgeClass(notification.statusType)}`}>
                        <span className="status-icon">{notification.icon}</span>
                        <span className="status-text">{getTranslatedStatus(notification.status)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="notification-message">{notification.message}</p>
                  
                  <div className="notification-footer">
                    <span className="notification-timestamp">
                      <span className="calendar-icon"><svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M2.99821 0.723633C3.23983 0.723633 3.43571 0.919508 3.43571 1.16113V1.37457C4.09841 1.30695 4.91389 1.30696 5.9086 1.30697H7.08782C8.08253 1.30696 8.89801 1.30695 9.56071 1.37457V1.16113C9.56071 0.919508 9.75659 0.723633 9.99821 0.723633C10.2398 0.723633 10.4357 0.919508 10.4357 1.16113V1.53143C10.9052 1.66448 11.3011 1.88073 11.6306 2.23701C12.0844 2.72758 12.2861 3.34742 12.3827 4.12418C12.4774 4.88531 12.4774 5.86075 12.4774 7.10534V7.46693C12.4774 8.71152 12.4774 9.68695 12.3827 10.4481C12.2861 11.2248 12.0844 11.8447 11.6306 12.3353C11.1724 12.8307 10.5858 13.0553 9.85163 13.162C9.14111 13.2653 8.23331 13.2653 7.08782 13.2653H5.9086C4.76311 13.2653 3.85531 13.2653 3.14479 13.162C2.41066 13.0553 1.82404 12.8307 1.36578 12.3353C0.911996 11.8447 0.710288 11.2248 0.613688 10.4481C0.519032 9.68696 0.519037 8.71153 0.519043 7.46695V7.10532C0.519037 5.86074 0.519032 4.88531 0.613688 4.12418C0.710288 3.34742 0.911996 2.72758 1.36578 2.23701C1.69533 1.88073 2.09127 1.66448 2.56071 1.53143V1.16113C2.56071 0.919508 2.75659 0.723633 2.99821 0.723633ZM2.99821 2.7653C2.79823 2.7653 2.62958 2.63112 2.57739 2.44788C2.3398 2.54241 2.1594 2.66763 2.00811 2.83117C1.73263 3.12899 1.56935 3.53726 1.48307 4.22363H11.5134C11.4271 3.53726 11.2638 3.12899 10.9883 2.83117C10.837 2.66762 10.6566 2.54242 10.419 2.44788C10.3668 2.63112 10.1982 2.7653 9.99821 2.7653C9.75659 2.7653 9.56071 2.56942 9.56071 2.3278V2.25464C8.94179 2.18288 8.14183 2.18197 7.05238 2.18197H5.94404C4.85459 2.18197 4.05463 2.18288 3.43571 2.25464V2.3278C3.43571 2.56942 3.23983 2.7653 2.99821 2.7653ZM11.5797 5.09863H1.41675C1.39436 5.65682 1.39404 6.3241 1.39404 7.13636V7.43591C1.39404 8.71825 1.39484 9.63926 1.482 10.3401C1.568 11.0316 1.73149 11.442 2.00811 11.7411C2.28025 12.0353 2.64662 12.2054 3.27065 12.2961C3.91099 12.3892 4.75514 12.3903 5.94404 12.3903H7.05238C8.24128 12.3903 9.08543 12.3892 9.72577 12.2961C10.3498 12.2054 10.7162 12.0353 10.9883 11.7411C11.2649 11.442 11.4284 11.0316 11.5144 10.3401C11.6016 9.63926 11.6024 8.71825 11.6024 7.43591V7.13636C11.6024 6.3241 11.6021 5.65682 11.5797 5.09863Z" fill="#384250"/>
                        </svg>
                        </span>
                      {notification.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>,
    document.body  // Render directly to document.body
  );
};

export default NotificationsDropdown;
