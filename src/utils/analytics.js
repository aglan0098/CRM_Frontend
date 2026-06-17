/**
 * Google Analytics Utility Module
 * 
 * This module provides helper functions for tracking events and page views
 * with Google Analytics (gtag.js). Events are sent to both GA4 properties:
 * - G-BQS9GWVTEZ
 * - G-W84DEBD9E0
 * 
 * Usage:
 *   import { trackEvent, trackPageView } from '@/utils/analytics';
 *   
 *   // Track a custom event
 *   trackEvent('form_submit', { form_name: 'complaint', status: 'success' });
 *   
 *   // Track a page view (automatic with usePageTracking hook)
 *   trackPageView('/ComplaintInquiry');
 */

/**
 * Safely call gtag - checks if gtag is available before calling
 */
function gtag() {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag.apply(null, arguments);
  }
}

/**
 * Track a custom event in Google Analytics
 * 
 * @param {string} eventName - The name of the event (e.g., 'form_submit', 'button_click')
 * @param {Object} [params={}] - Additional parameters for the event
 * 
 * @example
 * // Track a form submission
 * trackEvent('form_submit', {
 *   form_name: 'incident_report',
 *   status: 'success',
 *   category: 'water_incident'
 * });
 * 
 * @example
 * // Track a button click
 * trackEvent('button_click', {
 *   button_name: 'submit_complaint',
 *   page: '/ComplaintEscalation'
 * });
 */
export function trackEvent(eventName, params = {}) {
  gtag('event', eventName, params);
}

/**
 * Track a page view in Google Analytics
 * 
 * @param {string} pagePath - The path of the page (e.g., '/ComplaintInquiry')
 * @param {string} [pageTitle] - Optional page title
 * 
 * @example
 * trackPageView('/IncidentReportsRequest', 'Incident Reports');
 */
export function trackPageView(pagePath, pageTitle) {
  const params = {
    page_path: pagePath,
  };
  if (pageTitle) {
    params.page_title = pageTitle;
  }
  gtag('event', 'page_view', params);
}

/**
 * Set user properties for analytics (e.g., language preference)
 * 
 * @param {Object} properties - User properties to set
 * 
 * @example
 * setUserProperties({ language: 'ar', user_type: 'individual' });
 */
export function setUserProperties(properties) {
  gtag('set', 'user_properties', properties);
}

/**
 * React hook for automatic page view tracking on route changes.
 * Use this in App.jsx or a layout component.
 * 
 * @example
 * import { usePageTracking } from '@/utils/analytics';
 * 
 * function App() {
 *   usePageTracking();
 *   return <Routes />;
 * }
 */
export function usePageTracking() {
  if (typeof window !== 'undefined') {
    trackPageView(window.location.pathname + window.location.search, document.title);
  }
}
