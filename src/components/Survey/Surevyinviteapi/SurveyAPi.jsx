// api/surveyApi.js
import config from "@/utils/config";
const API_BASE_URL = `${config.API_BASE_URL}`;

export const surveyApi = {
  // Check survey invite validity
  async checkSurveyInvite(caseId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/survey-invites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ caseId }),
      });

      const data = await response.json();
      
      return {
        status: response.status,
        ...data
      };
    } catch (error) {
      console.error('Error checking survey invite:', error);
      return {
        status: 500,
        success: false,
        message: 'Network error. Please try again later.'
      };
    }
  },

  // Submit survey response
  async submitSurvey(surveyData) {
    try {
      const response = await fetch(`${API_BASE_URL}/submit-response`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(surveyData),
      });

      const data = await response.json();
      
      return {
        status: response.status,
        ...data
      };
    } catch (error) {
      console.error('Error submitting survey:', error);
      return {
        status: 500,
        success: false,
        message: 'Failed to submit survey. Please try again.'
      };
    }
  }
};