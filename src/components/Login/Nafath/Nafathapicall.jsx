import { useState } from 'react';
import config from '@/utils/config';
// Custom hook for API calls
const useNafathAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const verifyNationalId = async (nationalId) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const apiEndpoint = `${config.API_BASE_URL}/api/nafath/send-request?nationalId=${nationalId}`;
      
      const response = await fetch(apiEndpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add any other headers you need (Authorization, etc.)
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      
      // Handle API response based on isSuccess flag
      if (!result.isSuccess) {
        const errorMessage = result.errorCode || result.message || 'Verification failed';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
      
      return result;

    } catch (err) {
      const errorMessage = err.message || 'An error occurred while verifying the National ID';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setLoading(false);
    setError(null);
    setData(null);
  };

  return {
    loading,
    error,
    data,
    verifyNationalId,
    resetState
  };
};

export default useNafathAPI;