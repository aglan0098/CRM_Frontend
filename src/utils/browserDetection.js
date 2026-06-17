// utils/browserDetection.js

/**
 * Detects browser information from user agent
 * @returns {object} Browser information
 */
export const detectBrowser = () => {
  const userAgent = navigator.userAgent;
  const platform = navigator.platform;
  
  // Detect browser name and version
  let browserName = 'Unknown';
  let browserVersion = 'Unknown';
  let os = 'Unknown';
  
  // Detect Chrome
  if (userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Edg') === -1) {
    browserName = 'Chrome';
    const match = userAgent.match(/Chrome\/(\d+)/);
    if (match) browserVersion = match[1];
  }
  // Detect Edge
  else if (userAgent.indexOf('Edg') > -1) {
    browserName = 'Edge';
    const match = userAgent.match(/Edg\/(\d+)/);
    if (match) browserVersion = match[1];
  }
  // Detect Firefox
  else if (userAgent.indexOf('Firefox') > -1) {
    browserName = 'Firefox';
    const match = userAgent.match(/Firefox\/(\d+)/);
    if (match) browserVersion = match[1];
  }
  // Detect Safari
  else if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) {
    browserName = 'Safari';
    const match = userAgent.match(/Version\/(\d+)/);
    if (match) browserVersion = match[1];
  }
  
  // Detect OS
  if (platform.indexOf('Win') > -1) os = 'Windows';
  else if (platform.indexOf('Mac') > -1) os = 'macOS';
  else if (platform.indexOf('Linux') > -1) os = 'Linux';
  else if (/Android/.test(userAgent)) os = 'Android';
  else if (/iPhone|iPad|iPod/.test(userAgent)) os = 'iOS';
  
  return {
    name: browserName,
    version: browserVersion,
    os: os,
    userAgent: userAgent
  };
}; 