import React, { useState, useEffect } from 'react';
import './NotificationSystem.css';

const NotificationSystem = ({ 
  isVisible, 
  onClose, 
  onNotificationCountChange, 
  currentItems = [],
  itemType = 'complaint' // 'complaint', 'inquiry', or 'internal'
}) => {
  const [notifications, setNotifications] = useState([]);
  const [previousItems, setPreviousItems] = useState([]);

  // Get the appropriate storage keys based on item type
  const getStorageKeys = () => {
    if (itemType === 'inquiry') {
      return {
        notifications: 'inquiry_notifications',
        previousItems: 'previous_inquiries'
      };
    } else if (itemType === 'internal') {
      return {
        notifications: 'internal_notifications',
        previousItems: 'previous_internal_complaints'
      };
    }
    return {
      notifications: 'complaint_notifications',
      previousItems: 'previous_complaints'
    };
  };

  // Get item properties based on type
  const getItemProps = (item) => {
    if (itemType === 'inquiry') {
      return {
        id: item.inquiryId,
        number: item.inquiryNumber,
        subject: item.subject,
        status: item.status
      };
    } else if (itemType === 'internal') {
      return {
        id: item.complaintId,
        number: item.complaintNumber,
        subject: item.subject,
        status: item.status
      };
    }
    return {
      id: item.complaintId,
      number: item.complaintNumber,
      subject: item.subject,
      status: item.status
    };
  };

  // Load notifications and previous items from localStorage on component mount
  useEffect(() => {
    const { notifications: notifKey, previousItems: prevKey } = getStorageKeys();
    const savedNotifications = localStorage.getItem(notifKey);
    const savedPreviousItems = localStorage.getItem(prevKey);
    
    if (savedNotifications) {
      const parsedNotifications = JSON.parse(savedNotifications);
      setNotifications(parsedNotifications);
      
      // Count unread notifications
      const unreadCount = parsedNotifications.filter(n => !n.isRead).length;
      onNotificationCountChange(unreadCount);
    }
    
    if (savedPreviousItems) {
      setPreviousItems(JSON.parse(savedPreviousItems));
    }
  }, [itemType]);

  // Compare current items with previous items to detect changes
  useEffect(() => {
    const { notifications: notifKey, previousItems: prevKey } = getStorageKeys();
    
    if (currentItems.length === 0 || previousItems.length === 0) {
      // First load or no previous data - just store current items
      if (currentItems.length > 0) {
        setPreviousItems(currentItems);
        localStorage.setItem(prevKey, JSON.stringify(currentItems));
      }
      return;
    }

    const newNotifications = [];

    // Check for new items
    const previousItemIds = new Set(previousItems.map(item => getItemProps(item).id));
    const newItems = currentItems.filter(item => !previousItemIds.has(getItemProps(item).id));
    
    newItems.forEach(item => {
      const props = getItemProps(item);
      newNotifications.push({
        id: `new_${props.id}_${Date.now()}`,
        type: `new_${itemType}`,
        itemNumber: props.number,
        itemId: props.id,
        subject: props.subject,
        timestamp: new Date(),
        isRead: false
      });
    });

    // Check for status changes
    currentItems.forEach(currentItem => {
      const currentProps = getItemProps(currentItem);
      const previousItem = previousItems.find(p => getItemProps(p).id === currentProps.id);
      
      if (previousItem && getItemProps(previousItem).status !== currentProps.status) {
        newNotifications.push({
          id: `status_${currentProps.id}_${Date.now()}`,
          type: 'status_change',
          itemNumber: currentProps.number,
          itemId: currentProps.id,
          oldStatus: getItemProps(previousItem).status,
          newStatus: currentProps.status,
          timestamp: new Date(),
          isRead: false
        });
      }
    });

    // Add new notifications if any
    if (newNotifications.length > 0) {
      setNotifications(prev => {
        const updated = [...newNotifications, ...prev];
        localStorage.setItem(notifKey, JSON.stringify(updated));
        return updated;
      });
      
      // Update unread count
      const currentUnread = notifications.filter(n => !n.isRead).length;
      onNotificationCountChange(currentUnread + newNotifications.length);
    }

    // Update previous items
    setPreviousItems(currentItems);
    localStorage.setItem(prevKey, JSON.stringify(currentItems));

  }, [currentItems, itemType]);

  const markAsRead = (notificationId) => {
    const { notifications: notifKey } = getStorageKeys();
    setNotifications(prev => {
      const updated = prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      );
      localStorage.setItem(notifKey, JSON.stringify(updated));
      return updated;
    });
    
    // Update unread count
    const unreadCount = notifications.filter(n => n.id !== notificationId && !n.isRead).length;
    onNotificationCountChange(unreadCount);
  };

  const markAllAsRead = () => {
    const { notifications: notifKey } = getStorageKeys();
    setNotifications(prev => {
      const updated = prev.map(notification => ({ ...notification, isRead: true }));
      localStorage.setItem(notifKey, JSON.stringify(updated));
      return updated;
    });
    onNotificationCountChange(0);
  };

  const deleteNotification = (notificationId) => {
    const { notifications: notifKey } = getStorageKeys();
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== notificationId);
      localStorage.setItem(notifKey, JSON.stringify(updated));
      return updated;
    });
    
    const remainingUnread = notifications.filter(n => n.id !== notificationId && !n.isRead).length;
    onNotificationCountChange(remainingUnread);
  };

  const clearAllNotifications = () => {
    const { notifications: notifKey } = getStorageKeys();
    setNotifications([]);
    localStorage.removeItem(notifKey);
    onNotificationCountChange(0);
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getStatusBadgeClass = (status) => {
    return status?.toLowerCase().replace(/\s+/g, '-') || 'default';
  };

  const renderNotificationContent = (notification) => {
    let itemTypeName, itemTypeNameLower;
    
    if (itemType === 'inquiry') {
      itemTypeName = 'Inquiry';
      itemTypeNameLower = 'inquiry';
    } else if (itemType === 'internal') {
      itemTypeName = 'Internal Complaint';
      itemTypeNameLower = 'internal complaint';
    } else {
      itemTypeName = 'Complaint';
      itemTypeNameLower = 'complaint';
    }
    
    switch (notification.type) {
      case 'status_change':
        return (
          <div className="notification-content">
            <div className="notification-header">
              <h4>Status Changed</h4>
              <span className={`status-badge ${getStatusBadgeClass(notification.newStatus)}`}>
                {notification.newStatus}
              </span>
            </div>
            <p className="notification-message">
              Your {itemTypeNameLower} status has been updated to <strong>{notification.newStatus}</strong> for {itemTypeNameLower} number <strong>{notification.itemNumber}</strong>
            </p>
            {notification.oldStatus && (
              <p className="notification-sub-message">
                Previous status: {notification.oldStatus}
              </p>
            )}
          </div>
        );
      
      case `new_${itemType}`:
        return (
          <div className="notification-content">
            <div className="notification-header">
              <h4>New {itemTypeName} Registered</h4>
              <span className="status-badge new">New</span>
            </div>
            <p className="notification-message">
              New {itemTypeNameLower} <strong>{notification.itemNumber}</strong> has been registered
            </p>
            {notification.subject && (
              <p className="notification-sub-message">
                Subject: {notification.subject}
              </p>
            )}
          </div>
        );
      
      default:
        return (
          <div className="notification-content">
            <p className="notification-message">Notification update</p>
          </div>
        );
    }
  };

  if (!isVisible) return null;

  let itemTypeName;
  if (itemType === 'inquiry') {
    itemTypeName = 'Inquiry';
  } else if (itemType === 'internal') {
    itemTypeName = 'Internal Complaint';
  } else {
    itemTypeName = 'Complaint';
  }

  return (
    <div className="notification-overlay" onClick={onClose}>
      <div className="notification-panel" onClick={(e) => e.stopPropagation()}>
        <div className="notification-header-panel">
          <h3>{itemTypeName} Notifications ({notifications.filter(n => !n.isRead).length})</h3>
          <div className="notification-actions">
            {notifications.length > 0 && (
              <>
                <button 
                  className="mark-all-read-btn"
                  onClick={markAllAsRead}
                  disabled={notifications.every(n => n.isRead)}
                >
                  Mark all as read
                </button>
                <button 
                  className="clear-all-btn"
                  onClick={clearAllNotifications}
                >
                  Clear all
                </button>
              </>
            )}
            <button className="close-btn" onClick={onClose}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
        
        <div className="notification-list">
          {notifications.length === 0 ? (
            <div className="no-notifications">
              <p>No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                onClick={() => markAsRead(notification.id)}
              >
                {renderNotificationContent(notification)}
                <div className="notification-footer">
                  <span className="notification-time">
                    {formatTimeAgo(notification.timestamp)}
                  </span>
                  <button 
                    className="delete-notification-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3,6 5,6 21,6"></polyline>
                      <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                    </svg>
                  </button>
                </div>
                {!notification.isRead && <div className="unread-indicator"></div>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationSystem;