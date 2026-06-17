// components/SurveyContainer.js - Final Fixed Version
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { surveyApi } from '../Surevyinviteapi/SurveyAPi';
import SurveyModal from '../SurveyModal/SurveyModal';
import SWASurvey from '../Survey';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const SurveyContainer = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [surveyData, setSurveyData] = useState(null);
  const [modalState, setModalState] = useState({
    isOpen: false,
    status: null,
    message: ''
  });

  const caseId = searchParams.get('caseid');

  useEffect(() => {
    const checkSurveyValidity = async () => {
      // First, check if we have stored survey data from language switch
      const storedSurveyData = localStorage.getItem('swa_survey_data');
      if (storedSurveyData) {
        try {
          const parsedData = JSON.parse(storedSurveyData);
          setSurveyData(parsedData);
          setLoading(false);
          
          // Clean URL only if we have stored data
          const currentUrl = window.location.href;
          if (currentUrl.includes('caseid=')) {
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
          }
          
          return;
        } catch (error) {
          console.error('Error parsing stored survey data:', error);
          localStorage.removeItem('swa_survey_data');
        }
      }

      // If no caseId in URL and no stored data, redirect to home
      if (!caseId) {
        navigate('/');
        return;
      }

      try {
        const response = await surveyApi.checkSurveyInvite(caseId);
        
        if (response.success) {
          // Survey is valid, store survey data
          const surveyDataObj = {
            caseId: response.data.caseId,
            inviteId: response.data.inviteId,
            surveyId: response.data.surveyId
          };
          
          setSurveyData(surveyDataObj);
          
          // Store in localStorage for language switching
          localStorage.setItem('swa_survey_data', JSON.stringify(surveyDataObj));
          
          // Only remove caseId from URL after successfully storing data
          const newUrl = window.location.pathname;
          window.history.replaceState({}, '', newUrl);
          
          setLoading(false);
        } else {
          // Survey is invalid, show modal
          let status = 'error';
          if (response.message.includes('already been responded')) {
            status = 'already_responded';
          } else if (response.message.includes('expired')) {
            status = 'expired';
          } else if (response.message.includes('not found')) {
            status = 'not_found';
          }
          
          setModalState({
            isOpen: true,
            status,
            message: response.message
          });
          setLoading(false);
        }
      } catch (error) {
        console.error('Error checking survey validity:', error);
        setModalState({
          isOpen: true,
          status: 'error',
          message: 'An error occurred while loading the survey. Please try again.'
        });
        setLoading(false);
      }
    };

    checkSurveyValidity();
  }, [caseId, navigate]);

  // Clean up localStorage when component unmounts (user navigates away)
  useEffect(() => {
    return () => {
      // Only clean up if we're actually navigating away from survey page
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/Survey') && !currentPath.includes('/survey')) {
        localStorage.removeItem('swa_survey_data');
      }
    };
  }, []);

  const handleModalClose = () => {
    setModalState({
      isOpen: false,
      status: null,
      message: ''
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {surveyData && (
        <SWASurvey surveyData={surveyData} />
      )}
      
      <SurveyModal
        isOpen={modalState.isOpen}
        status={modalState.status}
        message={modalState.message}
        onClose={handleModalClose}
      />
    </>
  );
};

export default SurveyContainer;