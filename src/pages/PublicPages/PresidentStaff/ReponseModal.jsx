import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import config from '@/utils/config';
export default function ComplaintFeedbackForm({ 
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
  
  // Auto-hide success banner after 5 minutes and redirect
  useEffect(() => {
    if (showSuccessBanner) {
      const timer = setTimeout(() => {
        setShowSuccessBanner(false);
        navigate('/');
      }, 3 * 1000); // 5 minutes
      
      return () => clearTimeout(timer);
    }
  }, [showSuccessBanner, navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation for mandatory fields
    if (!overallSatisfaction) {
      setError('Please answer Question 1: How satisfied are you with the overall process?');
      return;
    }
    
    if (!speedSatisfaction) {
      setError('Please answer Question 2: How would you rate the clarity of requirements and guidelines?');
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
    try {
      setIsLoading(true);
      
      // Send feedback to backend API
      const response = await fetch(`${config.API_BASE_URL}/api/submit-feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRatingLabel = (value) => {
    switch(value) {
      case '1': return 'Poor';
      case '2': return 'Fair';
      case '3': return 'Good';
      case '4': return 'Very Good';
      case '5': return 'Excellent';
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
      width: '90%'
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
      <span>Feedback submitted successfully! Redirecting to home page...</span>
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
        border: '1px solid #fecaca'
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
        padding: '20px'
      }}>
        <div style={{
          display: 'flex',
          width: '702px',
          height: error ? '720px' : '640px',
          padding: 'var(--Model-modal-padding, 24px)',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: 'var(--Radius-radius-md, 8px)',
          background: 'var(--Background-background-white, #FFF)',
          boxShadow: '0 32px 64px -12px rgba(16, 24, 40, 0.14)',
          margin: 'auto',
          marginTop: '70px',
          transition: 'height 0.2s ease'
        }}>
          {/* Section 1 */}
          <div style={{
            display: 'flex',
            width: '646px',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--spacing-624-px, 24px)',
            position: 'relative'
          }}>
            {/* Section 1 Sub-section */}
            <div style={{
              display: 'flex',
              width: '612px',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 'var(--spacing-312-px, 12px)',
              position: 'relative'
            }}>
              {/* Inner Section 1 */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                alignSelf: 'stretch'
              }}>
                <div style={{
                  display: 'flex',
                  width: '48px',
                  height: '48px',
                  padding: '3.5px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  aspectRatio: '1/1'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="41" height="41" viewBox="0 0 41 41" fill="none">
                    <path d="M20.4998 41C29.8576 41 34.556 41 37.778 37.778C41 34.558 41 29.86 41 20.5C41 17.53 41 14.964 40.894 12.826C40.854 11.998 40.15 11.36 39.322 11.402C38.494 11.442 37.858 12.146 37.898 12.974C38 15.038 38 17.568 38 20.5C38 29.0319 38 33.316 35.658 35.658C33.314 38 29.032 38 20.5001 38C11.9681 38 7.686 38 5.342 35.658C3 33.314 3 29.032 3 20.5C3 11.968 3 7.68399 5.342 5.34199C7.686 3 11.968 3 20.4999 3H20.502C22.6551 3 24.5165 3 26.166 3.03799C26.994 3.05799 27.682 2.39997 27.7 1.57197C27.718 0.743973 27.062 0.0559883 26.234 0.0379883C24.5505 0 22.6732 0 20.502 0H20.5C11.1422 0 6.44397 0 3.222 3.22197C0 6.44197 0 11.142 0 20.5C0 29.858 0 34.556 3.222 37.778C6.44397 41 11.1419 41 20.4998 41Z" fill="#067647"/>
                    <path d="M18.1981 27.244C18.4641 27.712 18.9621 28 19.5001 28L19.5021 27.998H19.5121C20.0541 27.994 20.5521 27.698 20.8141 27.224C20.8381 27.178 23.3521 22.646 27.0181 17.742C31.7621 11.394 36.2601 7.30192 40.0221 5.90592C40.7981 5.61792 41.1941 4.75399 40.9061 3.97799C40.6181 3.20199 39.7541 2.80601 38.9781 3.09401C30.6921 6.16801 22.5401 18.508 19.4601 23.594C15.8721 18.298 13.0761 18 12.5001 18C12.5001 18 11.187 18 11.0223 19.3052C10.8102 20.9866 12.5001 21.0234 12.5001 21.0234C12.5001 20.978 14.8421 21.37 18.1981 27.244Z" fill="#067647"/>
                  </svg>
                </div>
                
                <Link 
                  to="/"
                  style={{
                    display: 'flex',
                    width: '40px',
                    height: '40px',
                    padding: '7.083px 7.082px 7.083px 7.084px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    aspectRatio: '1/1',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#666',
                    lineHeight: '1',
                    textDecoration: 'none'
                  }}
                  onMouseOver={(e) => e.target.style.color = '#333'}
                  onMouseOut={(e) => e.target.style.color = '#666'}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M0.366117 0.366117C0.854272 -0.122039 1.64573 -0.122039 2.13388 0.366117L12.9167 11.1489L23.6994 0.366117C24.1876 -0.122039 24.9791 -0.122039 25.4672 0.366117C25.9554 0.854272 25.9554 1.64573 25.4672 2.13388L14.6844 12.9167L25.4672 23.6994C25.9554 24.1876 25.9554 24.9791 25.4672 25.4672C24.9791 25.9554 24.1876 25.9554 23.6994 25.4672L12.9167 14.6844L2.13388 25.4672C1.64573 25.9554 0.854272 25.9554 0.366117 25.4672C-0.122039 24.9791 -0.122039 24.1876 0.366117 23.6994L11.1489 12.9167L0.366117 2.13388C-0.122039 1.64573 -0.122039 0.854272 0.366117 0.366117Z" fill="#384250"/>
                  </svg>
                </Link>
              </div>
              
              {/* Inner Section 2 */}
              <h2 style={{
                flex: '1 0 0',
                color: 'var(--Text-text-display, #1F2A37)',
                fontFamily: '"IBM Plex Sans Arabic"',
                fontSize: '18px',
                fontStyle: 'normal',
                fontWeight: '600',
                lineHeight: '28px',
                margin: 0
              }}>
                Suggestion Visit Request Submitted Successfully
              </h2>
              
              {/* Inner Section 3 */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                alignSelf: 'stretch'
              }}>
                <p style={{
                  alignSelf: 'stretch',
                  color: 'var(--Text-text-primary-paragraph, #384250)',
                  fontFamily: '"IBM Plex Sans Arabic"',
                  fontSize: '14px',
                  fontStyle: 'normal',
                  fontWeight: '400',
                  lineHeight: '20px',
                  margin: 0
                }}>
                  Share your thoughts by answering these quick questions:
                </p>
              </div>
            </div>
          </div>
          
          {/* Divider Section */}
          <div style={{
            width: '654px',
            height: '0',
            strokeWidth: '1px',
            stroke: 'var(--Border-border-neutral-primary, #D2D6DB)'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="654" height="1" viewBox="0 0 654 1" fill="none">
              <path d="M654 0.5H0" stroke="#D2D6DB"/>
            </svg>
          </div>
          
          {/* Section 3 */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--spacing-832-px, 32px)'
          }}>
            <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <ErrorBanner />
            
            {/* Section 3 Sub-section 1 */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 'var(--spacing-312-px, 12px)'
            }}>
            {/* Inner Section 1 */}
            <div style={{
              width: '605px',
              height: '28px',
              color: 'var(--Text-text-display, #1F2A37)',
              fontFamily: '"IBM Plex Sans Arabic"',
              fontSize: '16px',
              fontStyle: 'normal',
              fontWeight: '500',
              lineHeight: '24px'
            }}>
              1. How satisfied are you with the overall process?
            </div>
            
            {/* Inner Section 2 */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 'var(--spacing-1040-px, 40px)'
            }}>
              {['1', '2', '3', '4', '5'].map((value) => (
                <div key={value} style={{
                  display: 'flex',
                  padding: 'var(--Global-spacing-none, 0)',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: '8px',
                  borderRadius: 'var(--radius-sm, 4px)',
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    id={`overall-${value}`}
                    name="overallSatisfaction"
                    value={value}
                    checked={overallSatisfaction === value}
                    onChange={(e) => setOverallSatisfaction(e.target.value)}
                    disabled={isLoading}
                    style={{
                      display: 'flex',
                      width: '32px',
                      height: '32px',
                      padding: 'var(--Global-spacing-none, 0)',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: 'var(--Global-spacing-none, 0)',
                      border: `2px solid ${overallSatisfaction === value ? '#10b981' : '#d1d5db'}`,
                      borderRadius: '50%',
                      appearance: 'none',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      position: 'relative',
                      background: overallSatisfaction === value ? 'radial-gradient(circle, #10b981 3px, transparent 3px)' : 'white'
                    }}
                  />
                  <label 
                    htmlFor={`overall-${value}`}
                    style={{
                      color: 'var(--Text-text-display, #1F2A37)',
                      fontFamily: '"IBM Plex Sans Arabic"',
                      fontSize: '16px',
                      fontStyle: 'normal',
                      fontWeight: '500',
                      lineHeight: '24px',
                      cursor: isLoading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {getRatingLabel(value)}
                  </label>
                </div>
              ))}
            </div>
            </div>
            
            {/* Section 3 Sub-section 2 */}
            <div style={{
              display: 'flex',
              width: '604px',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 'var(--spacing-312-px, 12px)'
            }}>
            {/* Inner Section 1 */}
            <div style={{
              width: '552px',
              height: '28px',
              color: 'var(--Text-text-display, #1F2A37)',
              fontFamily: '"IBM Plex Sans Arabic"',
              fontSize: '16px',
              fontStyle: 'normal',
              fontWeight: '500',
              lineHeight: '24px'
            }}>
              2. How would you rate the clarity of requirements and guidelines?
            </div>
            
            {/* Inner Section 2 */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 'var(--spacing-1040-px, 40px)'
            }}>
              {['1', '2', '3', '4', '5'].map((value) => (
                <div key={value} style={{
                  display: 'flex',
                  padding: 'var(--Global-spacing-none, 0)',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: '8px',
                  borderRadius: 'var(--radius-sm, 4px)',
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    id={`speed-${value}`}
                    name="speedSatisfaction"
                    value={value}
                    checked={speedSatisfaction === value}
                    onChange={(e) => setSpeedSatisfaction(e.target.value)}
                    disabled={isLoading}
                    style={{
                      display: 'flex',
                      width: '32px',
                      height: '32px',
                      padding: 'var(--Global-spacing-none, 0)',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: 'var(--Global-spacing-none, 0)',
                      border: `2px solid ${speedSatisfaction === value ? '#10b981' : '#d1d5db'}`,
                      borderRadius: '50%',
                      appearance: 'none',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      position: 'relative',
                      background: speedSatisfaction === value ? 'radial-gradient(circle, #10b981 3px, transparent 3px)' : 'white'
                    }}
                  />
                  <label 
                    htmlFor={`speed-${value}`}
                    style={{
                      color: 'var(--Text-text-display, #1F2A37)',
                      fontFamily: '"IBM Plex Sans Arabic"',
                      fontSize: '16px',
                      fontStyle: 'normal',
                      fontWeight: '500',
                      lineHeight: '24px',
                      cursor: isLoading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {getRatingLabel(value)}
                  </label>
                </div>
              ))}
            </div>
            </div>
            
            {/* Section 3 Sub-section 3 */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: 'var(--spacing-312-px, 12px)',
              alignSelf: 'stretch'
            }}>
            {/* Inner Section 1 */}
            <div style={{
              width: '605px',
              height: '28px',
              color: 'var(--Text-text-display, #1F2A37)',
              fontFamily: '"IBM Plex Sans Arabic"',
              fontSize: '16px',
              fontStyle: 'normal',
              fontWeight: '500',
              lineHeight: '24px'
            }}>
              3. Would you like to provide additional feedback?
            </div>
            
            {/* Inner Section 2 */}
            <div style={{
              display: 'flex',
              minWidth: '200px',
              minHeight: '96px',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 'var(--Form-Iable-container, 8px)',
              alignSelf: 'stretch'
            }}>
              <textarea
                value={suggestions}
                onChange={(e) => setSuggestions(e.target.value)}
                placeholder="Share your feedback..."
                rows="4"
                disabled={isLoading}
                style={{
                  width: '100%',
                  minHeight: '80px',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  outline: 'none',
                  cursor: isLoading ? 'not-allowed' : 'text'
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
            </div>
            
            {/* Section 3 Sub-section 4 */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 'var(--spacing-312-px, 12px)',
              alignSelf: 'stretch'
            }}>
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: '100%'
            }}>
              {/* Ticket number on the left */}
              {ticketNumber && (
                <div style={{
                  fontSize: '12px',
                  color: '#374151',
                  backgroundColor: '#f3f4f6',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  marginRight: 'auto'
                }}>
                  <strong>Ticket #:</strong> {ticketNumber}
                </div>
              )}
              
              {/* Buttons on the left */}
              <div style={{
                display: 'flex',
                gap: '12px'
              }}>
                <Link
                  to="/"
                  style={{
                    width: '132px',
                    height: '40px',
                    minHeight: '40px',
                    maxHeight: '40px',
                    padding: '10px 20px',
                    borderRadius: 'var(--Radius-radius-sm, 4px)',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    border: '1px solid var(--Border-border-neutral-primary, #D2D6DB)',
                    transition: 'all 0.2s',
                    background: '#f9fafb',
                    color: '#374151',
                    textDecoration: 'none',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    opacity: isLoading ? 0.6 : 1
                  }}
                  onMouseOver={(e) => !isLoading && (e.target.style.background = '#f3f4f6')}
                  onMouseOut={(e) => !isLoading && (e.target.style.background = '#f9fafb')}
                  onClick={(e) => isLoading && e.preventDefault()}
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    width: '132px',
                    height: '40px',
                    minHeight: '40px',
                    maxHeight: '40px',
                    padding: '10px 20px',
                    borderRadius: 'var(--Radius-radius-sm, 4px)',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    border: '1px solid var(--Border-border-neutral-primary, #D2D6DB)',
                    transition: 'all 0.2s',
                    background: isLoading ? '#9ca3af' : '#1B8354',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: '8px'
                  }}
                  onMouseOver={(e) => !isLoading && (e.target.style.background = '#059669')}
                  onMouseOut={(e) => !isLoading && (e.target.style.background = '#1B8354')}
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
                      Submitting...
                    </>
                  ) : (
                    'Submit'
                  )}
                </button>
              </div>
            </div>
            </div>
          </form>
          </div>
        </div>
      </div>
    </>
  );
}