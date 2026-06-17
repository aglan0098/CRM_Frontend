import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import config from "@/utils/config";
import sessionManager from '@/utils/sessionManager';
import { checkUserExists, deleteUser } from '@/components/Login/Firestore_SMS_CRMAuth/APIs';

// ❌ REMOVED: const sessionHeaders = sessionManager.getSessionHeaders(); 
// This was being called at module load time, before session is stored!

const API_BASE_URL = `${config.API_BASE_URL}`;

// ✅ REQUEST DEDUPLICATION: Prevent multiple simultaneous calls
let casesRequestPromise = null;
let notificationsRequestPromise = null;

// Global singleton for notifications
let notificationsSingleton = {
  notifications: [],
  notificationsLoading: false,
  notificationsError: null,
  subscribers: new Set(),
  isPollingActive: false,
  pollingInterval: null,
  currentUserId: null
};

// Subscribe to notifications updates
const subscribeToNotifications = (callback) => {
  notificationsSingleton.subscribers.add(callback);
  callback(notificationsSingleton.notifications, notificationsSingleton.notificationsLoading, notificationsSingleton.notificationsError);
  return () => {
    notificationsSingleton.subscribers.delete(callback);
  };
};

// Notify all subscribers
const notifySubscribers = () => {
  notificationsSingleton.subscribers.forEach(callback => {
    callback(notificationsSingleton.notifications, notificationsSingleton.notificationsLoading, notificationsSingleton.notificationsError);
  });
};

const CasesComponent = ({ language = 'en' }) => {
  const navigate = useNavigate();
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState({ 
    firstName: '', 
    initials: 'SK', 
    userId: null 
  });
  
  // Notifications state - managed by singleton
  const [notifications, setNotifications] = useState(notificationsSingleton.notifications);
  const [notificationsLoading, setNotificationsLoading] = useState(notificationsSingleton.notificationsLoading);
  const [notificationsError, setNotificationsError] = useState(notificationsSingleton.notificationsError);

  // Subscribe to notifications updates
  useEffect(() => {
    const unsubscribe = subscribeToNotifications((notifications, loading, error) => {
      setNotifications(notifications);
      setNotificationsLoading(loading);
      setNotificationsError(error);
    });
    return unsubscribe;
  }, []);

  // Memoize loadUser function
  const loadUser = useCallback(async () => {
    const userData = JSON.parse(localStorage.getItem('swa_user'));
    
    if (userData?.userId) {
      try {
        const result = await checkUserExists(userData.userId);
        const user = result?.user;
        
        if (user) {
          const initials = (user.firstName?.[0] || '') + (user.lastName?.[0] || '');
          const displayFirstName = language === 'ar' 
            ? (user.firstNameara || user.firstName || '') 
            : (user.firstName || '');
            
          setUserInfo(prevInfo => {
            const newInfo = { 
              firstName: displayFirstName, 
              initials: initials || 'SK',
              userId: userData.userId
            };
            
            if (prevInfo.firstName === newInfo.firstName && 
                prevInfo.initials === newInfo.initials && 
                prevInfo.userId === newInfo.userId) {
              return prevInfo;
            }
            return newInfo;
          });
        } else {
          setUserInfo(prevInfo => {
            const newInfo = {
              firstName: '',
              initials: 'SK',
              userId: userData.userId
            };
            
            if (prevInfo.firstName === newInfo.firstName && 
                prevInfo.initials === newInfo.initials && 
                prevInfo.userId === newInfo.userId) {
              return prevInfo;
            }
            return newInfo;
          });
        }
      } catch (error) {
        console.error("Failed to load user info:", error);
        setUserInfo(prevInfo => {
          const newInfo = { 
            firstName: '', 
            initials: 'SK', 
            userId: userData?.userId || null 
          };
          
          if (prevInfo.firstName === newInfo.firstName && 
              prevInfo.initials === newInfo.initials && 
              prevInfo.userId === newInfo.userId) {
            return prevInfo;
          }
          return newInfo;
        });
      }
    } else {
      setUserInfo(prevInfo => {
        const newInfo = { firstName: '', initials: 'SK', userId: null };
        
        if (prevInfo.firstName === newInfo.firstName && 
            prevInfo.initials === newInfo.initials && 
            prevInfo.userId === newInfo.userId) {
          return prevInfo;
        }
        return newInfo;
      });
    }
  }, [language]);

  // ✅ FIXED: Request deduplication - prevents multiple simultaneous calls
  const fetchCases = useCallback(async () => {
    if (!userInfo.userId) {
      setError('User ID is required');
      return;
    }

    // ✅ If a request is already in progress, reuse it (prevents duplicate Firestore calls)
    if (casesRequestPromise) {
      console.log('[CasesComponent] fetchCases - Request already in progress, reusing...');
      try {
        const result = await casesRequestPromise;
        setApiResponse(result);
        return;
      } catch (err) {
        // If the in-progress request fails, continue with new request
        console.warn('[CasesComponent] Previous request failed, starting new one');
        casesRequestPromise = null;
      }
    }

    setLoading(true);
    setError(null);

    // ✅ Get fresh session headers each time
    const sessionHeaders = sessionManager.getSessionHeaders();
    console.log('[CasesComponent] fetchCases - Session headers:', sessionHeaders);
    
    if (!sessionHeaders || Object.keys(sessionHeaders).length === 0) {
      setError('Session not available. Please login again.');
      setLoading(false);
      return;
    }

    // ✅ Create a promise that other calls can wait for
    casesRequestPromise = fetch(`${API_BASE_URL}/api/cases/all`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...sessionHeaders
      },
      body: JSON.stringify({
        contactId: userInfo.userId
      })
    })
    .then(response => {
      // Handle 401 - session expired
      if (response.status === 401) {
        sessionManager.clearSession();
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    })
    .then(data => {
      casesRequestPromise = null; // Clear after success
      setApiResponse(data);
      if (!data.success) {
        setError(data.error || 'Failed to fetch cases');
      }
      return data;
    })
    .catch(err => {
      casesRequestPromise = null; // Clear after error
      throw err;
    });

    try {
      await casesRequestPromise;
    } catch (err) {
      console.error('Error fetching cases:', err);
      setError(err.message || 'Failed to fetch cases');
    } finally {
      setLoading(false);
    }
  }, [userInfo.userId]);

  // ✅ FIXED: Request deduplication for notifications
  const fetchNotifications = useCallback(async () => {
    if (!userInfo.userId) {
      notificationsSingleton.notificationsError = 'User ID is required';
      notificationsSingleton.notificationsLoading = false;
      notifySubscribers();
      return;
    }

    // ✅ If a request is already in progress, reuse it
    if (notificationsRequestPromise) {
      console.log('[CasesComponent] fetchNotifications - Request already in progress, reusing...');
      try {
        await notificationsRequestPromise;
        return; // Result already handled by the in-progress request
      } catch (err) {
        console.warn('[CasesComponent] Previous notification request failed, starting new one');
        notificationsRequestPromise = null;
      }
    }

    // ✅ Get fresh session headers each time
    const sessionHeaders = sessionManager.getSessionHeaders();
    
    if (!sessionHeaders || Object.keys(sessionHeaders).length === 0) {
      notificationsSingleton.notificationsError = 'Session not available';
      notificationsSingleton.notificationsLoading = false;
      notifySubscribers();
      return;
    }

    notificationsSingleton.notificationsLoading = true;
    notificationsSingleton.notificationsError = null;
    notifySubscribers();

    // ✅ Create a promise that other calls can wait for
    notificationsRequestPromise = fetch(`${API_BASE_URL}/api/notifications/${userInfo.userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...sessionHeaders
      }
    })
    .then(response => {
      if (response.status === 401) {
        sessionManager.clearSession();
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    })
    .then(data => {
      notificationsRequestPromise = null; // Clear after success
      
      console.log('🔔 Notifications response:', data);

      if (data.success) {
        const newNotifications = data.notifications || [];
        const existingNotifications = notificationsSingleton.notifications || [];
        const existingNotificationIds = new Set();
        
        existingNotifications.forEach(notification => {
          notification.cases?.forEach(caseItem => {
            existingNotificationIds.add(caseItem.caseId);
          });
        });
        
        const uniqueNewNotifications = newNotifications.filter(notification => {
          const hasNewCases = notification.cases?.some(caseItem => 
            !existingNotificationIds.has(caseItem.caseId)
          );
          return hasNewCases;
        });
        
        const mergedNotifications = [...uniqueNewNotifications, ...existingNotifications];
        
        notificationsSingleton.notifications = mergedNotifications;
        notificationsSingleton.notificationsLoading = false;
        notificationsSingleton.notificationsError = null;
        
        console.log('🔔 New notifications from API:', newNotifications);
        console.log('🔔 Unique new notifications:', uniqueNewNotifications);
        console.log('🔔 Merged notifications (total):', mergedNotifications);
      } else {
        const errorMsg = data.error || data.message || 'Failed to fetch notifications';
        notificationsSingleton.notificationsError = errorMsg;
        notificationsSingleton.notificationsLoading = false;
        console.log('🔔 Notifications error:', errorMsg);
      }
      
      notifySubscribers();
    })
    .catch(err => {
      notificationsRequestPromise = null; // Clear after error
      console.error('❌ Error fetching notifications:', err);
      const errorMsg = err.message || 'Failed to fetch notifications';
      notificationsSingleton.notificationsError = errorMsg;
      notificationsSingleton.notificationsLoading = false;
      console.log('🔔 Notifications error:', errorMsg);
      notifySubscribers();
    });

    try {
      await notificationsRequestPromise;
    } catch (err) {
      // Error already handled in promise chain
    }
  }, [userInfo.userId]);

  // ✅ FIXED: Get session headers INSIDE the function
  const handleLogout = useCallback(async () => {
    try {
      const storedUser = localStorage.getItem('swa_user');
      if (storedUser) {
        const parsedData = JSON.parse(storedUser);
        if (parsedData.userId) {
          // ✅ Get fresh session headers
          const sessionHeaders = sessionManager.getSessionHeaders();
          
          // Delete user's notifications from Firestore
          console.log('🗑️ Deleting notifications for user:', parsedData.userId);
          try {
            const deleteResponse = await fetch(`${API_BASE_URL}/api/notifications/${parsedData.userId}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                ...sessionHeaders
              }
            });

            if (deleteResponse.ok) {
              const deleteData = await deleteResponse.json();
              console.log('✅ Notifications deleted successfully:', deleteData);
            } else {
              console.warn('⚠️ Failed to delete notifications:', deleteResponse.status);
            }
          } catch (deleteError) {
            console.error('❌ Error deleting notifications:', deleteError);
          }
          
          // Delete user data from Firestore
          await deleteUser(parsedData.userId);
        }
      }
      
      // Clear notifications from global state
      notificationsSingleton.notifications = [];
      notificationsSingleton.notificationsLoading = false;
      notificationsSingleton.notificationsError = null;
      notifySubscribers();
      console.log('🧹 Cleared notifications from global state');
      
      // Clear request promises
      casesRequestPromise = null;
      notificationsRequestPromise = null;
      
      await sessionManager.logout();
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      navigate('/');
    }
  }, [navigate]);

  // Load user on component mount and language change
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Fetch cases when userInfo.userId is available
  useEffect(() => {
    if (userInfo.userId) {
      fetchCases();
    }
  }, [fetchCases, userInfo.userId]);

  // Fetch notifications when userInfo.userId is available
  useEffect(() => {
    if (userInfo.userId && userInfo.userId !== notificationsSingleton.currentUserId) {
      notificationsSingleton.currentUserId = userInfo.userId;
      fetchNotifications();
    }
  }, [fetchNotifications, userInfo.userId]);

  // Poll notifications every 3 minutes
  useEffect(() => {
    if (!userInfo.userId || notificationsSingleton.isPollingActive) return;

    console.log('⏰ Setting up notifications polling (every 3 minutes) - SINGLE INSTANCE');
    notificationsSingleton.isPollingActive = true;
    
    notificationsSingleton.pollingInterval = setInterval(() => {
      console.log('🔄 Auto-refreshing notifications...');
      fetchNotifications();
    }, 3 * 60 * 1000);

    return () => {
      console.log('🛑 Clearing notifications polling');
      if (notificationsSingleton.pollingInterval) {
        clearInterval(notificationsSingleton.pollingInterval);
        notificationsSingleton.pollingInterval = null;
      }
      notificationsSingleton.isPollingActive = false;
    };
  }, [userInfo.userId, fetchNotifications]);

  // ✅ FIXED: Get session headers INSIDE the function
  const checkTermsStatus = useCallback(async (contactId) => {
    try {
      console.log('🔍 Checking terms status for contactId:', contactId);
      
      // ✅ Get fresh session headers each time
      const sessionHeaders = sessionManager.getSessionHeaders();
      
      const response = await fetch(`${API_BASE_URL}/api/contact/terms-status?contactId=${contactId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...sessionHeaders
        }
      });

      if (response.status === 401) {
        sessionManager.clearSession();
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📋 Terms status response:', data);
      
      return data;
    } catch (err) {
      console.error('❌ Error checking terms status:', err);
      throw err;
    }
  }, []);

  // ✅ FIXED: Get session headers INSIDE the function
  const updateTermsStatus = useCallback(async (contactId, consented = true) => {
    try {
      console.log('✍️ Updating terms status for contactId:', contactId, 'consented:', consented);
      
      // ✅ Get fresh session headers each time
      const sessionHeaders = sessionManager.getSessionHeaders();
      
      const response = await fetch(`${API_BASE_URL}/api/contact/terms-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...sessionHeaders
        },
        body: JSON.stringify({
          contactId: contactId,
          consented: consented
        })
      });

      if (response.status === 401) {
        sessionManager.clearSession();
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Terms status updated:', data);
      
      return data;
    } catch (err) {
      console.error('❌ Error updating terms status:', err);
      throw err;
    }
  }, []);

  // Return the API response data and user functions
  return {
    apiResponse,
    loading,
    error,
    userInfo,
    refetch: fetchCases,
    logout: handleLogout,
    notifications,
    notificationsLoading,
    notificationsError,
    refetchNotifications: fetchNotifications,
    checkTermsStatus,
    updateTermsStatus
  };
};

export default CasesComponent;

