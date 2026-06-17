// authApi.js
import config from "@/utils/config";
const API_BASE_URL = `${config.API_BASE_URL}`;

// Authenticate user with phone number
export const authenticateUser = async (phoneNumber) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/authenticate-create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNum: phoneNumber,
        nationalId: ""
      })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Authentication API error:', error);
    throw new Error('Network error during authentication');
  }
};

// Store user data with OTP in Firestore
export const storeUserData = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();
    return {
      success: response.ok, // Just check if HTTP request was successful
      data: data
    };
  } catch (error) {
    console.error('Store user data API error:', error);
    throw new Error('Network error while storing user data');
  }
};


// Delete user
export const deleteUser = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      // Some DELETE endpoints return empty response body
      const data = response.status === 204 ? {} : await response.json();
      return {
        success: true,
        data: data
      };
    } else {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || 'Failed to delete user',
        data: errorData
      };
    }
  } catch (error) {
    console.error('Delete user API error:', error);
    throw new Error('Network error while deleting user');
  }
};

// ✅ SECURITY ENHANCED: Send SMS with sessionId (backend looks up userId from session)
export const sendSMS = async (sessionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/send-sms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: sessionId
      })
    });

    const data = await response.json();
    return {
      success: response.ok && data.success,
      data: data
    };
  } catch (error) {
    console.error('SMS API error:', error);
    throw new Error('Network error while sending SMS');
  }
};

// ✅ SECURITY ENHANCED: Verify OTP with sessionId (returns sessionId and userId after verification)
export const verifyOTP = async (sessionId, otp, browserInfo, captchaSessionId = null) => {
  try {
    const response = await fetch(`${API_BASE_URL}/phone/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: sessionId,
        otp: otp,
        browserInfo: browserInfo || {},
        captchaSessionId: captchaSessionId  // ✅ Send captcha sessionId if available
      })
    });

    const data = await response.json();
    return {
      success: response.ok && data.success,
      data: data
    };
  } catch (error) {
    console.error('Verify OTP API error:', error);
    throw new Error('Network error while verifying OTP');
  }
};

// Phone number validation
export const validatePhoneNumber = (phone) => {
  // Remove any non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Check if it starts with 05 and has exactly 10 digits
  return cleanPhone.length === 10 && cleanPhone.startsWith('05');
};

// Format phone number as user types
export const formatPhoneNumber = (value, currentValue) => {
  // Remove any non-digit characters
  const cleanValue = value.replace(/\D/g, '');
  
  // Limit to 10 digits
  if (cleanValue.length > 10) {
    return currentValue; // Don't update if exceeds 10 digits
  }
  
  // Format as 05X XXX XXXX
  if (cleanValue.length >= 3) {
    if (cleanValue.length >= 6) {
      return cleanValue.replace(/(\d{3})(\d{3})(\d{0,4})/, '$1 $2 $3').trim();
    }
    return cleanValue.replace(/(\d{3})(\d{0,3})/, '$1 $2').trim();
  }
  
  return cleanValue;
};
export const checkUserExists = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        exists: true,
        user: data
      };
    } else if (response.status === 404) {
      return {
        success: false,
        exists: false,
        user: null
      };
    } else {
      throw new Error('Failed to check user existence');
    }
  } catch (error) {
    console.error('Check user exists API error:', error);
    throw new Error('Network error while checking user existence');
  }
};