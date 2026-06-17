import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import config from '@/utils/config';
import sessionManager from '@/utils/sessionManager';
export default function ComplaintFeedbackFormArabic({ 
  isVisible, 
  onClose, 
  ticketNumber, 
  incidentId,
  contactId,
  onSubmit 
}) {
  const [overallSatisfaction, setOverallSatisfaction] = useState('');
  const [speedSatisfaction, setSpeedSatisfaction] = useState('');
  const [qualitySatisfaction, setQualitySatisfaction] = useState('');
  const [dissatisfactionReason, setDissatisfactionReason] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  // Auto-hide success banner after 3 seconds and redirect
  useEffect(() => {
    if (showSuccessBanner) {
      const timer = setTimeout(() => {
        setShowSuccessBanner(false);
        navigate('/');
      }, 3 * 1000); // 3 seconds
      
      return () => clearTimeout(timer);
    }
  }, [showSuccessBanner, navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation for mandatory fields
    if (!overallSatisfaction) {
      setError('يرجى الإجابة على السؤال 1: ما مدى رضاك عن الخدمة المقدمة بشكل عام؟');
      return;
    }
    
    if (!speedSatisfaction) {
      setError('يرجى الإجابة على السؤال 2: ما مدى رضاك عن سرعة تقديم الخدمة؟');
      return;
    }
    
    // Prepare feedback data in the required backend format
    const feedbackData = {
      contactid: contactId,
      incidentid: incidentId,
      businessunit: "abc3cd4b-361c-f011-953e-913e52b10f1d",
      name: ticketNumber + "Feedback",
      questions: {
        1: {
          Questionedid: "59b51fcf-9468-f011-9550-9f1353ac674c",
          Score: overallSatisfaction,
          Scoretext: getRatingLabel(overallSatisfaction)
        },
        2: {
          Questionedid: "cf3d7fe4-9468-f011-9550-9f1353ac674c",
          Score: speedSatisfaction,
          Scoretext: getRatingLabel(speedSatisfaction)
        },
        3: {
          Questionedid: "11edd2f5-9468-f011-9550-9f1353ac674c",
          Score: "",
          Scoretext: suggestions
        }
      }
    };
    
    console.log('Feedback data for backend:', feedbackData);
    
    // Check if JWT is available before submitting
    const jwtHeaders = sessionManager.getJWTHeaders();
    if (!jwtHeaders || Object.keys(jwtHeaders).length === 0) {
      setError('التحقق مطلوب. يرجى إكمال التحقق من reCAPTCHA أولاً.');
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      
      const headers = {
        'Content-Type': 'application/json',
        ...jwtHeaders
      };

      // Send feedback to backend API
      const response = await fetch(`${config.API_BASE_URL}/api/submit-feedback`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(feedbackData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Feedback submitted successfully:', result);
      
      // Call the parent's submit handler if provided
      if (onSubmit) {
        onSubmit(feedbackData);
      }
      
      // Show success banner
      setShowSuccessBanner(true);
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setError('فشل في إرسال التقييم. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRatingLabel = (value) => {
    switch(value) {
      case '1': return 'ممتاز';
      case '2': return 'جيد جداً';
      case '3': return 'جيد';
      case '4': return 'مقبول';
      case '5': return 'ضعيف';
      default: return '';
    }
  };

  // Success Banner Component
  const SuccessBanner = () => (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#10b981',
      color: 'white',
      padding: '16px 24px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontSize: '14px',
      fontWeight: '500',
      maxWidth: '400px',
      width: '90%',
      direction: 'rtl'
    }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path 
          d="M20 6L9 17L4 12" 
          stroke="white" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
      <span>تم إرسال التقييم بنجاح! جاري إعادة التوجيه للصفحة الرئيسية...</span>
    </div>
  );

  // Error Banner Component
  const ErrorBanner = () => (
    error && (
      <div style={{
        backgroundColor: '#fee2e2',
        color: '#dc2626',
        padding: '12px 16px',
        borderRadius: '6px',
        fontSize: '14px',
        marginBottom: '16px',
        border: '1px solid #fecaca',
        textAlign: 'right'
      }}>
        {error}
      </div>
    )
  );

  if (!isVisible) {
    return (
      <>
        {showSuccessBanner && <SuccessBanner />}
      </>
    );
  }

  return (
    <>
      {showSuccessBanner && <SuccessBanner />}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin: 0,
        boxSizing: 'border-box',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 50,
        padding: '20px',
        direction: 'rtl'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
          width: '100%',
          maxWidth: '800px',
          padding: '32px',
          position: 'relative',
          maxHeight: '85vh',
          overflowY: 'auto'
        }}>
          <Link 
            to="/"
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666',
              padding: '8px',
              lineHeight: '1',
              textDecoration: 'none'
            }}
            onMouseOver={(e) => e.target.style.color = '#333'}
            onMouseOut={(e) => e.target.style.color = '#666'}
          >
            &times;
          </Link>
          
          <div style={{
            width: '48px',
            height: '48px',
            background: '#10b981',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            color: 'white',
            fontSize: '24px'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path 
                d="M20 6L9 17L4 12" 
                stroke="white" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
          
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '8px',
            textAlign: 'right'
          }}>
            تم إنشاء تصعيد الشكوى بنجاح
          </h2>
          
          <p style={{
            color: '#6b7280',
            fontSize: '14px',
            marginBottom: '32px',
            textAlign: 'right'
          }}>
            شاركنا رأيك من خلال الإجابة على هذه الأسئلة السريعة:
          </p>
          
          <form onSubmit={handleSubmit}>
            <ErrorBanner />
            
            {/* Question 1 */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '12px',
                textAlign: 'right'
              }}>
                1. ما مدى رضاك عن الخدمة المقدمة بشكل عام؟ <span style={{color: '#dc2626', fontSize: '12px'}}>*</span>
              </div>
              <div style={{
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                direction: 'rtl'
              }}>
                {['1', '2', '3', '4', '5'].map((value) => (
                  <div key={value} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    direction: 'rtl'
                  }}>
                    <label 
                      htmlFor={`overall-${value}`}
                      style={{
                        fontSize: '14px',
                        color: '#374151',
                        cursor: isLoading ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {value} - {getRatingLabel(value)}
                    </label>
                    <input
                      type="radio"
                      id={`overall-${value}`}
                      name="overallSatisfaction"
                      value={value}
                      checked={overallSatisfaction === value}
                      onChange={(e) => setOverallSatisfaction(e.target.value)}
                      disabled={isLoading}
                      style={{
                        width: '18px',
                        height: '18px',
                        border: `2px solid ${overallSatisfaction === value ? '#10b981' : '#d1d5db'}`,
                        borderRadius: '50%',
                        appearance: 'none',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        position: 'relative',
                        background: overallSatisfaction === value ? 'radial-gradient(circle, #10b981 4px, transparent 4px)' : 'white'
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Question 2 */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '12px',
                textAlign: 'right'
              }}>
                2. ما مدى رضاك عن سرعة تقديم الخدمة؟ <span style={{color: '#dc2626', fontSize: '12px'}}>*</span>
              </div>
              <div style={{
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                direction: 'rtl'
              }}>
                {['1', '2', '3', '4', '5'].map((value) => (
                  <div key={value} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    direction: 'rtl'
                  }}>
                    <label 
                      htmlFor={`speed-${value}`}
                      style={{
                        fontSize: '14px',
                        color: '#374151',
                        cursor: isLoading ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {value} - {getRatingLabel(value)}
                    </label>
                    <input
                      type="radio"
                      id={`speed-${value}`}
                      name="speedSatisfaction"
                      value={value}
                      checked={speedSatisfaction === value}
                      onChange={(e) => setSpeedSatisfaction(e.target.value)}
                      disabled={isLoading}
                      style={{
                        width: '18px',
                        height: '18px',
                        border: `2px solid ${speedSatisfaction === value ? '#10b981' : '#d1d5db'}`,
                        borderRadius: '50%',
                        appearance: 'none',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        position: 'relative',
                        background: speedSatisfaction === value ? 'radial-gradient(circle, #10b981 4px, transparent 4px)' : 'white'
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>     
            {/* Question 4/5 */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '12px',
                textAlign: 'right'
              }}>
                3. يرجى مشاركتنا أي اقتراحات أو ملاحظات لتحسين جودة الخدمة:
              </div>
              <textarea
                value={suggestions}
                onChange={(e) => setSuggestions(e.target.value)}
                placeholder="شاركنا اقتراحاتك وملاحظاتك..."
                rows="4"
                disabled={isLoading}
                style={{
  width: '100%',
  minHeight: '80px',
  padding: '12px',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  fontSize: '14px',
  fontFamily: 'Tahoma, "Segoe UI", Arial, sans-serif', // CHANGED THIS
  resize: 'vertical',
  outline: 'none',
  cursor: isLoading ? 'not-allowed' : 'text',
  textAlign: 'right',
  direction: 'rtl',
  lineHeight: '1.6' // ADDED THIS
}}
                onFocus={(e) => {
                  if (!isLoading) {
                    e.target.style.borderColor = '#10b981';
                    e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                  }
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'space-between',
              alignItems: 'center',
              direction: 'rtl'
            }}>
              {/* Ticket number on the right in RTL */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                flex: '1'
              }}>
                {ticketNumber && (
                  <div style={{
                    fontSize: '12px',
                    color: '#374151',
                    backgroundColor: '#f3f4f6',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db'
                  }}>
                    <strong>رقم التذكرة:</strong> {ticketNumber}
                  </div>
                )}
              </div>
              
              {/* Buttons on the left in RTL */}
              <div style={{
                display: 'flex',
                gap: '12px'
              }}>
                <Link
                  to="/"
                  style={{
                    padding: '10px 20px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    border: '1px solid #d1d5db',
                    transition: 'all 0.2s',
                    background: '#f9fafb',
                    color: '#374151',
                    textDecoration: 'none',
                    display: 'inline-block',
                    opacity: isLoading ? 0.6 : 1
                  }}
                  onMouseOver={(e) => !isLoading && (e.target.style.background = '#f3f4f6')}
                  onMouseOut={(e) => !isLoading && (e.target.style.background = '#f9fafb')}
                  onClick={(e) => isLoading && e.preventDefault()}
                >
                  إلغاء
                </Link>
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    border: 'none',
                    transition: 'all 0.2s',
                    background: isLoading ? '#9ca3af' : '#10b981',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseOver={(e) => !isLoading && (e.target.style.background = '#059669')}
                  onMouseOut={(e) => !isLoading && (e.target.style.background = '#10b981')}
                >
                  {isLoading ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        <path d="M12 2v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <animateTransform
                            attributeName="transform"
                            type="rotate"
                            values="0 12 12;360 12 12"
                            dur="1s"
                            repeatCount="indefinite"
                          />
                        </path>
                      </svg>
                      جاري الإرسال...
                    </>
                  ) : (
                    'إرسال'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}