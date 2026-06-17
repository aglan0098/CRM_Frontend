// components/SurveyContainerArabic.js - Final Fixed Version
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { surveyApi } from '../Surevyinviteapi/SurveyAPi';
import SurveyModalArabic from '../SurveyModal/SurveyModalArabic';
import SWASurveyArabic from '../SurveyArabic';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const SurveyContainerArabic = () => {
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
          // Survey is invalid, show modal with Arabic error handling
          let status = 'error';
          let arabicMessage = '';
          
          // Check response message and set appropriate Arabic messages
          if (response.message.includes('already been responded')) {
            status = 'already_responded';
            arabicMessage = 'تم الرد على هذا الاستطلاع مسبقاً.';
          } else if (response.message.includes('expired')) {
            status = 'expired';
            arabicMessage = 'انتهت صلاحية هذا الاستطلاع.';
          } else if (response.message.includes('not found')) {
            status = 'not_found';
            arabicMessage = 'الاستطلاع غير موجود أو غير متاح.';
          } else {
            // Generic error message in Arabic
            arabicMessage = getArabicErrorMessage(response.message);
          }
          
          setModalState({
            isOpen: true,
            status,
            message: arabicMessage
          });
          setLoading(false);
        }
      } catch (error) {
        console.error('Error checking survey validity:', error);
        setModalState({
          isOpen: true,
          status: 'error',
          message: 'حدث خطأ أثناء تحميل الاستطلاع. يرجى المحاولة مرة أخرى.'
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
        <SWASurveyArabic surveyData={surveyData} />
      )}
      
      <SurveyModalArabic
        isOpen={modalState.isOpen}
        status={modalState.status}
        message={modalState.message}
        onClose={handleModalClose}
      />
    </>
  );
};

// Helper function to translate common error messages to Arabic
const getArabicErrorMessage = (originalMessage) => {
  if (!originalMessage) return 'حدث خطأ غير متوقع.';
  
  const lowerMessage = originalMessage.toLowerCase();
  
  // Common error message translations
  if (lowerMessage.includes('network') || lowerMessage.includes('connection')) {
    return 'خطأ في الشبكة. يرجى التحقق من اتصالك بالإنترنت.';
  }
  
  if (lowerMessage.includes('timeout')) {
    return 'انتهت مهلة الاتصال. يرجى المحاولة مرة أخرى.';
  }
  
  if (lowerMessage.includes('unauthorized') || lowerMessage.includes('permission')) {
    return 'غير مصرح لك بالوصول إلى هذا الاستطلاع.';
  }
  
  if (lowerMessage.includes('server') || lowerMessage.includes('internal')) {
    return 'خطأ في الخادم. يرجى المحاولة لاحقاً.';
  }
  
  if (lowerMessage.includes('invalid') || lowerMessage.includes('malformed')) {
    return 'رابط الاستطلاع غير صحيح.';
  }
  
  if (lowerMessage.includes('maintenance')) {
    return 'الموقع قيد الصيانة حالياً. يرجى المحاولة لاحقاً.';
  }
  
  // If no specific match found, return generic error message
  return 'حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.';
};

export default SurveyContainerArabic;