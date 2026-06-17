// utils/sessionManager.js

import { detectBrowser } from './browserDetection';
import { deleteUser } from '@/components/Login/Firestore_SMS_CRMAuth/APIs';
import config from './config';
const SESSION_API_BASE_URL = `${config.API_BASE_URL}/api/sessions`;

// Session configuration (must match backend)
const SESSION_CONFIG = {
  MAX_SESSION_DURATION: 2 * 60 * 60 * 1000, // 2 hours in milliseconds
  INACTIVITY_TIMEOUT: 30 * 60 * 1000, // 30 minutes in milliseconds
  WARNING_BEFORE_TIMEOUT: 2 * 60 * 1000, // 2 minutes warning
};

/**
 * Session Manager - Handles all session-related operations
 */
class SessionManager {
  constructor() {
    this.sessionId = null;
    this.userId = null;
    this.browserInfo = detectBrowser();
    this.activityListeners = [];
    this.inactivityTimer = null;
    this.warningTimer = null;
    this.sessionCheckInterval = null;
    this.lastActivityTime = Date.now();
    this.lastActivityUpdateTime = Date.now(); // Track when we last updated backend
    this.activityTrackingStarted = false;
    this.sessionValidationStarted = false;
  }

  /**
   * Generates a unique session ID
   */
  generateSessionId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Creates a new session after successful login
   */
  async createSession(userId) {
    try {
      this.userId = userId;
      this.sessionId = this.generateSessionId();
      
      const response = await fetch(`${SESSION_API_BASE_URL}/create`, {
        method: 'POST',
        credentials: 'include', // ✅ SECURITY: Include cookies in request
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.userId,
          sessionId: this.sessionId,
          browserInfo: this.browserInfo
        })
      });

      const result = await response.json();

      if (result.success) {
        const now = Date.now();
        // Store session info in localStorage with expiration and activity tracking
        const sessionObj = {
          sessionId: this.sessionId,
          userId: this.userId,
          browserInfo: this.browserInfo,
          createdAt: now,
          expiresAt: result.data?.expiresAt || (now + SESSION_CONFIG.MAX_SESSION_DURATION),
          lastActivity: now // Initialize lastActivity
        };
        localStorage.setItem('swa_session', JSON.stringify(sessionObj));
        //console.log('[SessionManager] Session stored in localStorage:', sessionObj);

        // Start activity tracking
        this.startActivityTracking();
        
        // Start local session validation (no API calls)
        this.startSessionValidation();

        return {
          success: true,
          sessionId: this.sessionId
        };
      } else {
        throw new Error(result.error || 'Failed to create session');
      }
    } catch (error) {
      console.error('Create session error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Validates current session locally (no API call)
   * Checks expiration, inactivity, and JWT expiration
   */
  checkSessionValidity() {
    const sessionData = this.getStoredSession();
    if (!sessionData) {
      return { valid: false, reason: 'No session found' };
    }

    const now = Date.now();

    // Check if session has expired (max duration)
    if (sessionData.expiresAt && now > sessionData.expiresAt) {
      return { valid: false, reason: 'Session has expired' };
    }

    // Check for inactivity timeout
    if (sessionData.lastActivity) {
      const inactiveTime = now - sessionData.lastActivity;
      if (inactiveTime > SESSION_CONFIG.INACTIVITY_TIMEOUT) {
        return { 
          valid: false, 
          reason: 'Session inactive timeout',
          inactiveFor: inactiveTime
        };
      }
    }

    // Check JWT expiration if JWT is present
    if (sessionData.jwtSignature && sessionData.jwtExpiresAt) {
      const jwtExpired = this.isJWTExpired();
      if (jwtExpired) {
        return { valid: false, reason: 'JWT token expired' };
      }
    }

    // Calculate time until inactivity warning
    let timeUntilInactive = null;
    let shouldWarn = false;
    if (sessionData.lastActivity) {
      const inactiveTime = now - sessionData.lastActivity;
      timeUntilInactive = SESSION_CONFIG.INACTIVITY_TIMEOUT - inactiveTime;
      shouldWarn = timeUntilInactive <= SESSION_CONFIG.WARNING_BEFORE_TIMEOUT && 
                   timeUntilInactive > 0;
    }

    return {
      valid: true,
      sessionId: sessionData.sessionId,
      timeUntilInactive: timeUntilInactive,
      shouldWarnInactivity: shouldWarn,
      warningMessage: shouldWarn ? `You will be logged out in ${Math.ceil(timeUntilInactive / 60000)} minutes due to inactivity` : null
    };
  }

  /**
   * Validates current session (backward compatibility - now uses local check)
   * This method is kept for compatibility but now does local validation
   */
  async validateSession() {
    return this.checkSessionValidity();
  }

  /**
   * Updates session activity
   * Updates both localStorage and Firestore
   */
  async updateActivity() {
    try {
      const sessionData = this.getStoredSession();
      if (!sessionData) return;

      const now = Date.now();
      
      // ✅ Update localStorage first (immediate)
      sessionData.lastActivity = now;
      localStorage.setItem('swa_session', JSON.stringify(sessionData));
      
      // Update last activity update time (when we called backend)
      this.lastActivityUpdateTime = now;
      //console.log('[SessionManager] updateActivity called. Updating localStorage and backend at:', new Date(now).toLocaleString());

      // ✅ Update Firestore (async, non-blocking)
      const response = await fetch(`${SESSION_API_BASE_URL}/activity`, {
        method: 'POST',
        credentials: 'include', // ✅ SECURITY: Include cookies in request
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionData.sessionId
        })
      });

      const result = await response.json();
      
      if (!result.success) {
        console.error('Failed to update activity in Firestore:', result.error);
        // Note: localStorage is already updated, so session is still valid locally
      }
    } catch (error) {
      console.error('Update activity error:', error);
      // Note: localStorage is already updated, so session is still valid locally
    }
  }

  /**
   * Starts tracking user activity
   */
  startActivityTracking() {
    //console.log('[SessionManager] startActivityTracking called');
    if (this.activityTrackingStarted) return;
    this.activityTrackingStarted = true;
    // Track various user activities
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    
    const activityHandler = () => {
      const now = Date.now();
      const timeSinceLastActivity = now - this.lastActivityTime;
      const timeSinceLastUpdate = now - this.lastActivityUpdateTime;
      
      // ✅ Option 3: Immediate update if user was inactive (no activity for > 2 minutes)
      // Otherwise, throttle to every 30 seconds during normal active use
      const wasInactive = timeSinceLastActivity > 2 * 60 * 1000; // 2 minutes
      const shouldUpdate = wasInactive || timeSinceLastUpdate > 30000; // 30 seconds throttle
      
      if (shouldUpdate) {
        if (wasInactive) {
          //console.log('[SessionManager] User returned after inactivity, updating immediately.');
        } else {
          //console.log('[SessionManager] Activity detected, updating activity timer.');
        }
        this.lastActivityTime = now;
        this.updateActivity();
      }
    };

    events.forEach(event => {
      const listener = activityHandler;
      document.addEventListener(event, listener);
      this.activityListeners.push({ event, listener });
    });
    //console.log('[SessionManager] Activity tracking started.');
  }

  /**
   * Stops tracking user activity
   */
  stopActivityTracking() {
    this.activityListeners.forEach(({ event, listener }) => {
      document.removeEventListener(event, listener);
    });
    this.activityListeners = [];
    this.activityTrackingStarted = false;
    //console.log('[SessionManager] Activity tracking stopped.');
  }

  /**
   * Starts periodic session validation (LOCAL - no API calls)
   * Checks session validity locally every 30 seconds
   */
  startSessionValidation() {
    //console.log('[SessionManager] startSessionValidation called (local validation)');
    if (this.sessionValidationStarted) return;
    this.sessionValidationStarted = true;
    
    // Check session locally every 30 seconds (no API call)
    this.sessionCheckInterval = setInterval(() => {
      const result = this.checkSessionValidity();
      
      if (!result.valid) {
        // Session is invalid - handle expiration
        this.handleSessionExpired(result.reason || 'Session expired');
        return;
      }
      
      // Show inactivity warning if needed
      if (result.shouldWarnInactivity && result.warningMessage) {
        this.showInactivityWarning(result.warningMessage, result.timeUntilInactive);
      } else {
        // Clear warning if session is active
        this.clearWarningTimer();
      }
    }, 30000); // Check every 30 seconds
  }

  /**
   * Shows inactivity warning modal
   */
  showInactivityWarning(message, timeRemaining) {
    // Clear any existing warning
    this.clearWarningTimer();

    // Debug log
    //console.log('[SessionManager] showInactivityWarning called. Message:', message, 'Time remaining (ms):', timeRemaining);

    // Create custom event for the app to handle
    const warningEvent = new CustomEvent('sessionInactivityWarning', {
      detail: {
        message,
        timeRemaining,
        onStayActive: () => this.handleStayActive(),
        onLogout: () => this.logout()
      }
    });
    window.dispatchEvent(warningEvent);

    // Set timer to auto-logout
    this.warningTimer = setTimeout(() => {
      this.handleSessionExpired('Inactivity timeout');
    }, timeRemaining);
  }

  /**
   * Handles user choosing to stay active
   */
  async handleStayActive() {
    this.clearWarningTimer();
    await this.updateActivity();
    
    // Dispatch event to close warning modal
    window.dispatchEvent(new CustomEvent('sessionWarningDismissed'));
  }

  /**
   * Clears warning timer
   */
  clearWarningTimer() {
    if (this.warningTimer) {
      clearTimeout(this.warningTimer);
      this.warningTimer = null;
    }
  }

  /**
   * Handles session expiration
   */
  async handleSessionExpired(reason) {
    try {
      const sessionData = this.getStoredSession();
      if (sessionData) {
        // Delete session from backend
        await fetch(`${SESSION_API_BASE_URL}/${sessionData.sessionId}`, {
          method: 'DELETE',
          credentials: 'include', // ✅ SECURITY: Include cookies in request
          headers: {
            'Content-Type': 'application/json',
          }
        });

        // Delete user data from Firestore
        await this.deleteUserData(sessionData.userId);
      }
    } catch (error) {
      console.error('Session expired cleanup error:', error);
    } finally {
      this.clearSession();
      // Dispatch event for the app to handle
      const expiredEvent = new CustomEvent('sessionExpired', {
        detail: { reason }
      });
      window.dispatchEvent(expiredEvent);
    }
  }

  /**
   * Gets stored session from localStorage
   */
  getStoredSession() {
    const sessionStr = localStorage.getItem('swa_session');
    if (!sessionStr) return null;
    
    try {
      return JSON.parse(sessionStr);
    } catch {
      return null;
    }
  }

  /**
   * Stores session with JWT signature in localStorage
   * If session already exists, replaces it (for login scenario)
   * @param {string} sessionId - Session ID
   * @param {string} jwtSignature - JWT token
   * @param {number} expiresAt - JWT expiration timestamp (seconds)
   * @param {string|null} userId - User ID (null for captcha)
   */
  storeSessionWithJWT(sessionId, jwtSignature, expiresAt, userId = null) {
    // Check if session already exists
    const existingSession = this.getStoredSession();
    
    if (existingSession) {
      //console.log('[SessionManager] Replacing existing session with new session (login or captcha)');
    }
    
    const now = Date.now();
    // Store/Replace session in localStorage with expiration and activity tracking
    const sessionObj = {
      sessionId: sessionId,
      userId: userId,
      jwtSignature: jwtSignature,
      jwtExpiresAt: expiresAt,
      browserInfo: this.browserInfo,
      createdAt: now,
      expiresAt: now + SESSION_CONFIG.MAX_SESSION_DURATION, // Max session duration
      lastActivity: now // Initialize lastActivity
    };
    
    localStorage.setItem('swa_session', JSON.stringify(sessionObj));
    //console.log('[SessionManager] Session stored/replaced in localStorage with JWT');
    
    // Update instance variables
    this.sessionId = sessionId;
    this.userId = userId;
    
    // Start activity tracking and validation if not already started
    if (!this.activityTrackingStarted) {
      this.startActivityTracking();
    }
    if (!this.sessionValidationStarted) {
      this.startSessionValidation();
    }
  }

  /**
   * Gets JWT token from stored session
   * @returns {string|null} JWT token or null if not found
   */
  getJWTToken() {
    const sessionData = this.getStoredSession();
    return sessionData?.jwtSignature || null;
  }

  /**
   * Checks if JWT is expired
   * @returns {boolean} True if expired or not found, false if valid
   */
  isJWTExpired() {
    const sessionData = this.getStoredSession();
    if (!sessionData || !sessionData.jwtExpiresAt) {
      return true; // No expiration = consider expired
    }
    
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    return sessionData.jwtExpiresAt < now;
  }

  /**
   * Gets JWT headers for API requests
   * Returns Authorization header with Bearer token
   * @returns {object} Headers object with JWT token
   */
  getJWTHeaders() {
    const sessionData = this.getStoredSession();
    
    if (!sessionData) {
      console.warn('[SessionManager] getJWTHeaders: No session data found');
      return {};
    }
    
    if (!sessionData.jwtSignature) {
      console.warn('[SessionManager] getJWTHeaders: No JWT signature found in session');
      return {};
    }
    
    // Check if JWT is expired
    if (this.isJWTExpired()) {
      console.warn('[SessionManager] getJWTHeaders: JWT token is expired');
      return {};
    }
    
    return {
      'Authorization': `Bearer ${sessionData.jwtSignature}`
    };
  }

  /**
   * Deletes user data from Firestore
   */
  async deleteUserData(userId) {
    try {
      const result = await deleteUser(userId);
      if (result.success) {
        //console.log('User deleted from Firestore successfully');
        return true;
      } else {
        console.error('Failed to delete user:', result.error);
        return false;
      }
    } catch (error) {
      console.error('Delete user data error:', error);
      return false;
    }
  }

  /**
   * Logs out the current session and deletes user data
   */
  async logout() {
    try {
      const sessionData = this.getStoredSession();
      if (sessionData) {
        // End session (mark as inactive)
        await fetch(`${SESSION_API_BASE_URL}/end`, {
          method: 'POST',
          credentials: 'include', // ✅ SECURITY: Include cookies in request
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId: sessionData.sessionId
          })
        });

        // Delete session completely from Firestore
        await fetch(`${SESSION_API_BASE_URL}/${sessionData.sessionId}`, {
          method: 'DELETE',
          credentials: 'include', // ✅ SECURITY: Include cookies in request
          headers: {
            'Content-Type': 'application/json',
          }
        });

        // Delete user data from Firestore
        await this.deleteUserData(sessionData.userId);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearSession();
    }
  }

  /**
   * Logs out from all devices and deletes user data
   */
  async logoutAllDevices() {
    try {
      const sessionData = this.getStoredSession();
      if (sessionData) {
        // End all sessions
        await fetch(`${SESSION_API_BASE_URL}/end-all`, {
          method: 'POST',
          credentials: 'include', // ✅ SECURITY: Include cookies in request
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: sessionData.userId
          })
        });

        // Delete user data from Firestore
        await this.deleteUserData(sessionData.userId);
      }
    } catch (error) {
      console.error('Logout all devices error:', error);
    } finally {
      this.clearSession();
    }
  }

  /**
   * Gets all active sessions for the current user
   */
  async getActiveSessions() {
    try {
      const sessionData = this.getStoredSession();
      if (!sessionData) return [];

      const response = await fetch(`${SESSION_API_BASE_URL}/user/${sessionData.userId}`, {
        method: 'GET',
        credentials: 'include', // ✅ SECURITY: Include cookies in request
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();
      return result.success ? result.data : [];
    } catch (error) {
      console.error('Get active sessions error:', error);
      return [];
    }
  }

  /**
   * Clears session data and stops all timers
   */
  clearSession() {
    // Clear localStorage
    localStorage.removeItem('swa_session');
    localStorage.removeItem('swa_user');
    //console.log('[SessionManager] Session data cleared from localStorage.');
    
    // Clear timers
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
      this.sessionCheckInterval = null;
    }
    this.sessionValidationStarted = false;
    
    this.clearWarningTimer();
    
    // Stop activity tracking
    this.stopActivityTracking();
    
    // Reset properties
    this.sessionId = null;
    this.userId = null;
  }

  /**
   * Checks if there's an active session
   */
  hasActiveSession() {
    return !!this.getStoredSession();
  }

  /**
   * Checks if user is logged in with a real login session (not captcha)
   * Captcha sessions have userId === null, real login sessions have userId !== null
   */
  isLoggedIn() {
    const session = this.getStoredSession();
    return !!(session && session.userId !== null);
  }

  /**
   * Checks if current session is a captcha session (userId is null)
   */
  isCaptchaSession() {
    const session = this.getStoredSession();
    return !!(session && session.userId === null);
  }

  /**
   * Alternative method that also checks localStorage for swa_user
   * This provides backward compatibility with existing code
   */
  isUserLoggedIn() {
    // Check both session and user data
    const hasSession = this.hasActiveSession();
    const hasUserData = !!localStorage.getItem('swa_user');
    return hasSession || hasUserData;
  }

  /**
   * Adds session info to API request headers
   * Returns empty object if no session found or session is invalid
   * ✅ SECURITY: Cookies (sessionId, jwtToken) are sent automatically by browser
   * ✅ Only sends JWT in Authorization header if available (cookies are HttpOnly)
   * ✅ Checks session validity locally before returning headers
   */
  getSessionHeaders() {
    // First check if session is valid locally
    const validityCheck = this.checkSessionValidity();
    if (!validityCheck.valid) {
      console.warn('[SessionManager] getSessionHeaders: Session is invalid:', validityCheck.reason);
      return {};
    }
    
    const sessionData = this.getStoredSession();
    if (!sessionData) {
      console.warn('[SessionManager] getSessionHeaders: No session data found in localStorage');
      return {};
    }
    
    // ✅ SECURITY: Cookies (sessionId, jwtToken) are sent automatically by browser
    // ✅ We only need to send JWT in Authorization header if available
    // ✅ Note: Cookies are HttpOnly, so we can't read them from JavaScript
    // ✅ Backend will read from cookies first, then fallback to headers
    
    const headers = {};
    
    // ✅ If JWT is available and not expired, send it in Authorization header
    // ✅ This is for backward compatibility - backend reads cookies first
    if (sessionData.jwtSignature && !this.isJWTExpired()) {
      headers['Authorization'] = `Bearer ${sessionData.jwtSignature}`;
      //console.log('[SessionManager] getSessionHeaders: Using JWT token in Authorization header (cookies sent automatically)');
    } else if (sessionData.sessionId) {
      // Fallback: Send sessionId in Authorization header (backward compatibility)
      headers['Authorization'] = `Bearer ${sessionData.sessionId}`;
      //console.log('[SessionManager] getSessionHeaders: Using sessionId in Authorization header (cookies sent automatically)');
    }
    
    // ✅ Note: sessionId and jwtToken cookies are sent automatically by browser
    // ✅ No need to manually set X-Session-ID or X-JWT-Token headers
    // ✅ Backend middleware reads from cookies first, then headers as fallback
    
    return headers;
  }

  /**
   * Waits for session to be available in localStorage
   * Useful when navigating immediately after login
   * @param {number} maxWaitMs - Maximum time to wait in milliseconds (default: 1000ms)
   * @param {number} checkIntervalMs - How often to check in milliseconds (default: 50ms)
   * @returns {Promise<object|null>} Session data if found, null if timeout
   */
  async waitForSession(maxWaitMs = 1000, checkIntervalMs = 50) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWaitMs) {
      const sessionData = this.getStoredSession();
      if (sessionData && sessionData.sessionId) {
        //console.log('[SessionManager] waitForSession: Session found after', Date.now() - startTime, 'ms');
        return sessionData;
      }
      await new Promise(resolve => setTimeout(resolve, checkIntervalMs));
    }
    
    console.warn('[SessionManager] waitForSession: Timeout waiting for session');
    return null;
  }
}

// Create singleton instance
const sessionManager = new SessionManager();

export default sessionManager;