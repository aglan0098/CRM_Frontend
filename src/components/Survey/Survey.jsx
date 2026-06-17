// components/SWASurvey.js
import React, { useState } from 'react';
import './Survey.css'
import vector from './Vector.png'
import phone from './Phone.png'
import copy from './copy.png'
import email from './email.png'
import location from './location.png'
import Link from './Link.png'
import X from './X.png'
import linkedin from './linkedin.png'
import Insta from './Insta.png'
import Navbar from '../NavBar/Navbar';
import Footer from '../common/Footer';
import ResponseModal from './ResponseModal'; // Import the ResponseModal
import { surveyApi } from './Surevyinviteapi/SurveyAPi';
 
const SWASurvey = ({ surveyData }) => {
  const [formData, setFormData] = useState({
    overall: '',
    speed: '',
    quality: '',
    reasonFeedback: '',
    generalFeedback: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
 
  const handleSubmit = async () => {
    // Check if required fields are filled
    if (!formData.overall || !formData.speed || !formData.quality) {
      alert('Please answer all required questions.');
      return;
    }

    // Check if reason is required when quality is low
    if ((formData.quality === '1' || formData.quality === '2' || formData.quality === '3') && !formData.reasonFeedback.trim()) {
      alert('Please provide a reason for your quality rating.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Score to text mapping
      const scoreToText = {
        '1': 'Very Dissatisfied',
        '2': 'Dissatisfied', 
        '3': 'Average',
        '4': 'Satisfied',
        '5': 'Completely Satisfied'
      };

      // Question configuration with IDs (you'll need to replace these with actual question IDs)
      const questionConfig = {
        overall: {
          questionId: 'a10a7324-bd55-f011-954e-b745906b6e05', // Replace with actual question ID
          text: 'How satisfied are you with the overall service provided?' // Question 1
        },
        speed: {
          questionId: 'b03bfc5f-bc55-f011-954e-b745906b6e05', // Replace with actual question ID
          text: 'How satisfied are you with the speed of service delivery?' // Question 2
        },
        quality: {
          questionId: '6125e570-bc55-f011-954e-b745906b6e05', // Replace with actual question ID
          text: 'How satisfied are you with the quality of the service provided?' // Question 3
        },
        reasonFeedback: {
          questionId: 'c100d514-bd55-f011-954e-b745906b6e05', // Replace with actual question ID
          text: 'Please mention the reason.' // Question 4 - Only appears when Question 3 (quality) options 1, 2, or 3 are selected
        },
        generalFeedback: {
          questionId: '7adb823d-bd55-f011-954e-b745906b6e05', // Replace with actual question ID
          text: 'Please share with us any suggestions or feedback to improve the quality of service.' // Question 5 - Optional
        }
      };

      // Build the data object
      const surveyAnswers = {};
      let questionCount = 0;

      // Process required questions (overall, speed, quality)
      ['overall', 'speed', 'quality'].forEach((field) => {
        if (formData[field]) {
          questionCount++;
          surveyAnswers[questionCount] = {
            questionId: questionConfig[field].questionId,
            questionText: questionConfig[field].text,
            caseId: surveyData.caseId,
            inviteId: surveyData.inviteId,
            surveyId: surveyData.surveyId,
            swa_answerScore: formData[field],
            swa_anstext: scoreToText[formData[field]]
          };
        }
      });

      // Process reason feedback (only appears when Question 3 (quality) has options 1, 2, or 3 selected)
      // This question becomes mandatory when quality rating is 1, 2, or 3
      if ((formData.quality === '1' || formData.quality === '2' || formData.quality === '3') && 
          formData.reasonFeedback && formData.reasonFeedback.trim()) {
        questionCount++;
        surveyAnswers[questionCount] = {
          questionId: questionConfig.reasonFeedback.questionId,
          questionText: questionConfig.reasonFeedback.text,
          caseId: surveyData.caseId,
          inviteId: surveyData.inviteId,
          surveyId: surveyData.surveyId,
          swa_answerScore: null, // Text questions don't have scores
          swa_anstext: formData.reasonFeedback.trim()
        };
      }

      // Process general feedback (optional)
      if (formData.generalFeedback && formData.generalFeedback.trim()) {
        questionCount++;
        surveyAnswers[questionCount] = {
          questionId: questionConfig.generalFeedback.questionId,
          questionText: questionConfig.generalFeedback.text,
          caseId: surveyData.caseId,
          inviteId: surveyData.inviteId,
          surveyId: surveyData.surveyId,
          swa_answerScore: null, // Text questions don't have scores
          swa_anstext: formData.generalFeedback.trim()
        };
      }

      // Final submission data structure
      const submissionData = {
        count: questionCount,
        data: surveyAnswers,
        metadata: {
          caseId: surveyData.caseId,
          inviteId: surveyData.inviteId,
          surveyId: surveyData.surveyId,
          submittedAt: new Date().toISOString()
        }
      };

      console.log('Formatted submission data:', submissionData);

      const response = await surveyApi.submitSurvey(submissionData);
      
      if (response.success) {
        // Show the ResponseModal instead of alert
        setShowModal(true);
      } else {
        alert(response.message || 'Failed to submit survey. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert('An error occurred while submitting your survey. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
 
  const handleRatingChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
 
  const handleTextareaChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
 
  const handleRateService = () => {
    alert('Thank you for wanting to rate our service!');
  };

  const handleModalClose = () => {
    setShowModal(false);
    // Reset form after modal is closed
    setFormData({
      overall: '',
      speed: '',
      quality: '',
      reasonFeedback: '',
      generalFeedback: ''
    });
  };
 
  return (
    <>
      <Navbar/>
      <div className="card-back">
        <img
          src={vector}
          alt="Vector"
          className="Vector-img"
        />
        <div className="header-text-container">
          <h1 className="card-header">Customer Satisfaction Survey</h1>
          <p className="card-text">Your case has been successfully closed, and we hope your issue was resolved to your satisfaction. To help us improve our services, please take a moment to complete a short survey. It should only take 1–2 minutes, and your feedback will directly help us enhance the quality of our support.</p>
        </div>
        <div className="contactcard">
          <div className="contact-header">Contact Saudi Water Authority</div>
         
          <div className="contact-item">
            <img src={phone} alt="Phone" className="contact-icon" />
            <div className="contact-details">
              <div className="contact-label">Phone</div>
              <div className="contact-value">
                0181188111
                <img src={copy} alt="Copy" className="copy-icon" />
              </div>
            </div>
          </div>
         
          <div className="contact-item">
            <img src={email} alt="Email" className="contact-icon" />
            <div className="contact-details">
              <div className="contact-label">Email</div>
              <div className="contact-value">
                CMP@SWA.GOV.SA
                <img src={copy} alt="Copy" className="copy-icon" />
              </div>
            </div>
          </div>
         
          <div className="contact-item">
            <img src={location} alt="Location" className="contact-icon" />
            <div className="contact-details">
              <div className="contact-label">Location</div>
              <div className="contact-value">
                Riyadh - Olaya
                <img src={Link} alt="Link" className="copy-icon" />
              </div>
            </div>
          </div>
         
          <div className="follow-section">
            <div className="follow-header">Follow us</div>
            <div className="social-icons">
              <img src={X} alt="Twitter" className="social-icon" />
              <img src={linkedin} alt="LinkedIn" className="social-icon" />
              <img src={Insta} alt="Instagram" className="social-icon" />
            </div>
          </div>
        </div>
      </div>
 
      <div className="survey-container">
        <div>
          <div className="survey-question">
            <div className="question-text">
              <span className="question-required">*</span> How satisfied are you with the overall service provided?
            </div>
            <div className="rating-container">
              <div className="rating-option">
                <input
                  type="radio"
                  id="overall1"
                  name="overall"
                  value="1"
                  checked={formData.overall === '1'}
                  onChange={(e) => handleRatingChange('overall', e.target.value)}
                />
                <label htmlFor="overall1">1</label>
              </div>
              <div className="rating-option">
                <input
                  type="radio"
                  id="overall2"
                  name="overall"
                  value="2"
                  checked={formData.overall === '2'}
                  onChange={(e) => handleRatingChange('overall', e.target.value)}
                />
                <label htmlFor="overall2">2</label>
              </div>
              <div className="rating-option">
                <input
                  type="radio"
                  id="overall3"
                  name="overall"
                  value="3"
                  checked={formData.overall === '3'}
                  onChange={(e) => handleRatingChange('overall', e.target.value)}
                />
                <label htmlFor="overall3">3</label>
              </div>
              <div className="rating-option">
                <input
                  type="radio"
                  id="overall4"
                  name="overall"
                  value="4"
                  checked={formData.overall === '4'}
                  onChange={(e) => handleRatingChange('overall', e.target.value)}
                />
                <label htmlFor="overall4">4</label>
              </div>
              <div className="rating-option">
                <input
                  type="radio"
                  id="overall5"
                  name="overall"
                  value="5"
                  checked={formData.overall === '5'}
                  onChange={(e) => handleRatingChange('overall', e.target.value)}
                />
                <label htmlFor="overall5">5</label>
              </div>
            </div>
            <div className="rating-labels">
              <span className="rating-label rating-label-left">Very Dissatisfied</span>
              <span className="rating-label rating-label-right">Completely Satisfied</span>
            </div>
          </div>
 
          <div className="survey-question">
            <div className="question-text">
              <span className="question-required">*</span> How satisfied are you with the speed of service delivery?
            </div>
            <div className="rating-container">
              <div className="rating-option">
                <input
                  type="radio"
                  id="speed1"
                  name="speed"
                  value="1"
                  checked={formData.speed === '1'}
                  onChange={(e) => handleRatingChange('speed', e.target.value)}
                />
                <label htmlFor="speed1">1</label>
              </div>
              <div className="rating-option">
                <input
                  type="radio"
                  id="speed2"
                  name="speed"
                  value="2"
                  checked={formData.speed === '2'}
                  onChange={(e) => handleRatingChange('speed', e.target.value)}
                />
                <label htmlFor="speed2">2</label>
              </div>
              <div className="rating-option">
                <input
                  type="radio"
                  id="speed3"
                  name="speed"
                  value="3"
                  checked={formData.speed === '3'}
                  onChange={(e) => handleRatingChange('speed', e.target.value)}
                />
                <label htmlFor="speed3">3</label>
              </div>
              <div className="rating-option">
                <input
                  type="radio"
                  id="speed4"
                  name="speed"
                  value="4"
                  checked={formData.speed === '4'}
                  onChange={(e) => handleRatingChange('speed', e.target.value)}
                />
                <label htmlFor="speed4">4</label>
              </div>
              <div className="rating-option">
                <input
                  type="radio"
                  id="speed5"
                  name="speed"
                  value="5"
                  checked={formData.speed === '5'}
                  onChange={(e) => handleRatingChange('speed', e.target.value)}
                />
                <label htmlFor="speed5">5</label>
              </div>
            </div>
            <div className="rating-labels">
              <span className="rating-label rating-label-left">Very Dissatisfied</span>
              <span className="rating-label rating-label-right">Completely Satisfied</span>
            </div>
          </div>
 
          <div className="survey-question">
            <div className="question-text">
              <span className="question-required">*</span> How satisfied are you with the quality of the service provided?
            </div>
            <div className="rating-container">
              <div className="rating-option">
                <input
                  type="radio"
                  id="quality1"
                  name="quality"
                  value="1"
                  checked={formData.quality === '1'}
                  onChange={(e) => handleRatingChange('quality', e.target.value)}
                />
                <label htmlFor="quality1">1</label>
              </div>
              <div className="rating-option">
                <input
                  type="radio"
                  id="quality2"
                  name="quality"
                  value="2"
                  checked={formData.quality === '2'}
                  onChange={(e) => handleRatingChange('quality', e.target.value)}
                />
                <label htmlFor="quality2">2</label>
              </div>
              <div className="rating-option">
                <input
                  type="radio"
                  id="quality3"
                  name="quality"
                  value="3"
                  checked={formData.quality === '3'}
                  onChange={(e) => handleRatingChange('quality', e.target.value)}
                />
                <label htmlFor="quality3">3</label>
              </div>
              <div className="rating-option">
                <input
                  type="radio"
                  id="quality4"
                  name="quality"
                  value="4"
                  checked={formData.quality === '4'}
                  onChange={(e) => handleRatingChange('quality', e.target.value)}
                />
                <label htmlFor="quality4">4</label>
              </div>
              <div className="rating-option">
                <input
                  type="radio"
                  id="quality5"
                  name="quality"
                  value="5"
                  checked={formData.quality === '5'}
                  onChange={(e) => handleRatingChange('quality', e.target.value)}
                />
                <label htmlFor="quality5">5</label>
              </div>
            </div>
            <div className="rating-labels">
              <span className="rating-label rating-label-left">Very Dissatisfied</span>
              <span className="rating-label rating-label-right">Completely Satisfied</span>
            </div>
          </div>
 
          {/* Conditional rendering: Only show when quality rating is 1, 2, or 3 */}
          {(formData.quality === '1' || formData.quality === '2' || formData.quality === '3') && (
            <div className="survey-question">
              <div className="question-text">
                <span className="question-required">*</span> Please mention the reason.
              </div>
              <textarea
                className="feedback-textarea"
                placeholder="Please provide details about your experience..."
                value={formData.reasonFeedback}
                onChange={(e) => handleTextareaChange('reasonFeedback', e.target.value)}
              />
            </div>
          )}
 
          <div className="survey-question">
            <div className="question-text">
              Please share with us any suggestions or feedback to improve the quality of service.
            </div>
            <textarea
              className="feedback-textarea"
              placeholder="Your suggestions and feedback are valuable to us..."
              value={formData.generalFeedback}
              onChange={(e) => handleTextareaChange('generalFeedback', e.target.value)}
            />
          </div>
 
          <button 
            type="button" 
            className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
 
      <div className="Review-section">
        <div className="last-modified">
          Last Modified Date: 04/12/2020 - 4:13 PM Saudi Arabia Time
        </div>
       
        <div className="service-rating-section">
          <div className="service-rating-left">
            <span className="service-rating-text">This service is rated with an average of</span>
            <span className="rating-value">3.9</span>
            <div className="stars-container">
              <svg className="star" viewBox="0 0 20 20">
                <defs>
                  <linearGradient id="half-star">
                    <stop offset="50%" stopColor="#10B981"/>
                    <stop offset="50%" stopColor="#D1D5DB"/>
                  </linearGradient>
                </defs>
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              <svg className="star" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              <svg className="star" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              <svg className="star half" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              <svg className="star empty" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </div>
            <span className="review-count">1544 reviews</span>
          </div>
         
          <button className="rate-service-button" onClick={handleRateService}>
            Rate this service
          </button>
        </div>
      </div>

      {/* ResponseModal Component */}
      {showModal && <ResponseModal onClose={handleModalClose} />}
      
      <Footer/>
    </>
  );
};
 
export default SWASurvey;