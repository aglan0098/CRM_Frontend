// ComplaintInquiryApi.jsx
// Reusable API utility & React hook to query the SWA complaints search endpoint
// You can import either the `searchComplaints` function for ad-hoc requests or the
// `useComplaintSearch` hook from any component.
//
// Example (function call):
//   import { searchComplaints } from './ComplaintInquiryApi';
//   const result = await searchComplaints({ complaintTicket: 'SWA-02085-Q4G0J' });
//
// Example (hook):
//   const { data, loading, error, search } = useComplaintSearch();
//   useEffect(() => { search({ complaintTicket: 'SWA-02085-Q4G0J' }); }, []);

import { useState, useCallback } from 'react';
import axios from 'axios';
import config from '@/utils/config';
// === Configuration ==========================================================
// Base URL for the back-end; change here if the environment URL changes.
const API_BASE_URL = `${config.API_BASE_URL}/api/complaints`;

// === Stand-alone request helper ============================================
/**
 * POST /complaints/search
 *
 * @param {Object} payload – Request body accepted by the API. Omit undefined fields.
 * @param {Object} jwtHeaders – Optional JWT headers to include in the request.
 * @returns {Promise<Object>} – The parsed JSON body returned by the endpoint.
 */
export async function searchComplaints(payload, jwtHeaders = {}) {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/search`, payload, {
      headers: {
        'Content-Type': 'application/json',
        ...jwtHeaders
      },
    });
    return data; // { success, count, data: [...] }
  } catch (err) {
    // Normalise the error so that callers can decide what to do.
    const message = err?.response?.data?.message || err.message || 'Unknown error';
    // Useful for development debugging.
    // eslint-disable-next-line no-console
    console.error('Complaint search failed →', message);
    throw err;
  }
}

// === React hook ============================================================
/**
 * useComplaintSearch – Encapsulates loading / error / data state for the search.
 *
 *   const { data, loading, error, search } = useComplaintSearch();
 *   search({ complaintTicket: 'SWA-xxxxx' });
 */
export function useComplaintSearch() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const result = await searchComplaints(payload);
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data, // API response – see sample structure in docs.
    loading, // boolean
    error, // Error object (or null)
    search, // function to trigger the call
  };
}

// Default export kept so that you can `import * as ComplaintApi from ...` if preferred
export default {
  searchComplaints,
  useComplaintSearch,
};
