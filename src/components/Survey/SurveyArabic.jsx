// components/SWASurveyArabic.js
import React, { useState } from 'react';
import './SurveyArabic.css'
import vector from './Vector.png'
import phone from './Phone.png'
import copy from './copy.png'
import email from './email.png'
import location from './location.png'
import Link from './Link.png'
import X from './X.png'
import linkedin from './linkedin.png'
import Insta from './Insta.png'
import Navbar from '../NavBar/NavbarArabic';
import Footer from '../common/FooterArabic';
import ResponseModalArabic from './ResponseModalArabic'; // Import the Arabic ResponseModal
import { surveyApi } from './Surevyinviteapi/SurveyAPi';
 
const SWASurveyArabic = ({ surveyData }) => {
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
      alert('يرجى الإجابة على جميع الأسئلة المطلوبة.');
      return;
    }

    // Check if reason is required when quality is low
    if ((formData.quality === '1' || formData.quality === '2' || formData.quality === '3') && !formData.reasonFeedback.trim()) {
      alert('يرجى ذكر سبب تقييمك لجودة الخدمة.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Score to Arabic text mapping
      const scoreToText = {
        '1': 'غير راضٍ تماماً',
        '2': 'غير راضٍ', 
        '3': 'متوسط',
        '4': 'راضٍ',
        '5': 'راضٍ تماماً'
      };

      // Question configuration with IDs (you'll need to replace these with actual question IDs)
      const questionConfig = {
        overall: {
          questionId: 'a10a7324-bd55-f011-954e-b745906b6e05', // Replace with actual question ID
          text: 'ما مدى رضاك عن الخدمة المقدمة بشكل عام؟' // Question 1
        },
        speed: {
          questionId: 'b03bfc5f-bc55-f011-954e-b745906b6e05', // Replace with actual question ID
          text: 'ما مدى رضاك عن سرعة تقديم الخدمة؟' // Question 2
        },
        quality: {
          questionId: '6125e570-bc55-f011-954e-b745906b6e05', // Replace with actual question ID
          text: 'ما مدى رضاك عن جودة الخدمة المقدمة؟' // Question 3
        },
        reasonFeedback: {
          questionId: 'c100d514-bd55-f011-954e-b745906b6e05', // Replace with actual question ID
          text: 'يرجى ذكر السبب.' // Question 4 - Only appears when Question 3 (quality) options 1, 2, or 3 are selected
        },
        generalFeedback: {
          questionId: '7adb823d-bd55-f011-954e-b745906b6e05', // Replace with actual question ID
          text: 'يرجى مشاركتنا أي اقتراحات أو ملاحظات لتحسين جودة الخدمة.' // Question 5 - Optional
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
        // Show the Arabic ResponseModal instead of alert
        setShowModal(true);
      } else {
        alert(response.message || 'فشل في إرسال الاستطلاع. يرجى المحاولة مرة أخرى.');
      }
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert('حدث خطأ أثناء إرسال الاستطلاع. يرجى المحاولة مرة أخرى.');
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
    alert('شكراً لك على رغبتك في تقييم خدمتنا!');
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
      <div className="card-back-rtl">
        <img
          src={vector}
          alt="Vector"
          className="Vector-img-rtl"
        />
        <div className="header-text-container-rtl">
          <h1 className="card-header-rtl">استطلاع رضا العملاء</h1>
          <p className="card-text-rtl">تم إغلاق قضيتك بنجاح، ونأمل أن تكون مشكلتك قد تم حلها على نحو مرضٍ لك. لمساعدتنا على تحسين خدماتنا، يرجى تخصيص لحظة لإكمال استطلاع قصير. لن يستغرق الأمر سوى ١-٢ دقيقة، وملاحظاتك ستساعدنا مباشرة في تعزيز جودة دعمنا.</p>
        </div>
        <div className="contactcard-rtl">
          <div className="contact-header-rtl">اتصل بهيئة المياه السعودية</div>
         
          <div className="contact-item-rtl">
            <img src={phone} alt="Phone" className="contact-icon-rtl" />
            <div className="contact-details-rtl">
              <div className="contact-label-rtl">الهاتف</div>
              <div className="contact-value-rtl">
                0181188111
                <img src={copy} alt="Copy" className="copy-icon-rtl" />
              </div>
            </div>
          </div>
         
          <div className="contact-item-rtl">
            <img src={email} alt="Email" className="contact-icon-rtl" />
            <div className="contact-details-rtl">
              <div className="contact-label-rtl">البريد الإلكتروني</div>
              <div className="contact-value-rtl">
                CMP@SWA.GOV.SA
                <img src={copy} alt="Copy" className="copy-icon-rtl" />
              </div>
            </div>
          </div>
         
          <div className="contact-item-rtl">
            <img src={location} alt="Location" className="contact-icon-rtl" />
            <div className="contact-details-rtl">
              <div className="contact-label-rtl">الموقع</div>
              <div className="contact-value-rtl">
                الرياض - العليا
                <img src={Link} alt="Link" className="copy-icon-rtl" />
              </div>
            </div>
          </div>
         
          <div className="follow-section-rtl">
            <div className="follow-header-rtl">تابعنا</div>
            <div className="social-icons-rtl">
              <img src={X} alt="Twitter" className="social-icon-rtl" />
              <img src={linkedin} alt="LinkedIn" className="social-icon-rtl" />
              <img src={Insta} alt="Instagram" className="social-icon-rtl" />
            </div>
          </div>
        </div>
      </div>
 
      <div className="survey-container-rtl">
        <div>
          <div className="survey-question-rtl">
            <div className="question-text-rtl">
              <span className="question-required-rtl">*</span> ما مدى رضاك عن الخدمة المقدمة بشكل عام؟
            </div>
            <div className="rating-container-rtl">
              <div className="rating-option-rtl">
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
              <div className="rating-option-rtl">
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
              <div className="rating-option-rtl">
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
              <div className="rating-option-rtl">
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
              <div className="rating-option-rtl">
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
            <div className="rating-labels-rtl">
              <span className="rating-label-rtl rating-label-right-rtl">راضٍ تماماً</span>
              <span className="rating-label-rtl rating-label-left-rtl">غير راضٍ تماماً</span>
            </div>
          </div>
 
          <div className="survey-question-rtl">
            <div className="question-text-rtl">
              <span className="question-required-rtl">*</span> ما مدى رضاك عن سرعة تقديم الخدمة؟
            </div>
            <div className="rating-container-rtl">
              <div className="rating-option-rtl">
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
              <div className="rating-option-rtl">
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
              <div className="rating-option-rtl">
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
              <div className="rating-option-rtl">
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
              <div className="rating-option-rtl">
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
            <div className="rating-labels-rtl">
              <span className="rating-label-rtl rating-label-right-rtl">راضٍ تماماً</span>
              <span className="rating-label-rtl rating-label-left-rtl">غير راضٍ تماماً</span>
            </div>
          </div>
 
          <div className="survey-question-rtl">
            <div className="question-text-rtl">
              <span className="question-required-rtl">*</span> ما مدى رضاك عن جودة الخدمة المقدمة؟
            </div>
            <div className="rating-container-rtl">
              <div className="rating-option-rtl">
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
              <div className="rating-option-rtl">
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
              <div className="rating-option-rtl">
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
              <div className="rating-option-rtl">
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
              <div className="rating-option-rtl">
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
            <div className="rating-labels-rtl">
              <span className="rating-label-rtl rating-label-right-rtl">راضٍ تماماً</span>
              <span className="rating-label-rtl rating-label-left-rtl">غير راضٍ تماماً</span>
            </div>
          </div>
 
          {/* Conditional rendering: Only show when quality rating is 1, 2, or 3 */}
          {(formData.quality === '1' || formData.quality === '2' || formData.quality === '3') && (
            <div className="survey-question-rtl">
              <div className="question-text-rtl">
                <span className="question-required-rtl">*</span> يرجى ذكر السبب.
              </div>
              <textarea
                className="feedback-textarea-rtl"
                placeholder="يرجى تقديم تفاصيل حول تجربتك..."
                value={formData.reasonFeedback}
                onChange={(e) => handleTextareaChange('reasonFeedback', e.target.value)}
              />
            </div>
          )}
 
          <div className="survey-question-rtl">
            <div className="question-text-rtl">
              يرجى مشاركتنا أي اقتراحات أو ملاحظات لتحسين جودة الخدمة.
            </div>
            <textarea
              className="feedback-textarea-rtl"
              placeholder="اقتراحاتك وملاحظاتك مهمة بالنسبة لنا..."
              value={formData.generalFeedback}
              onChange={(e) => handleTextareaChange('generalFeedback', e.target.value)}
            />
          </div>
 
          <button 
            type="button" 
            className={`submit-button-rtl ${isSubmitting ? 'submitting' : ''}`}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'جاري الإرسال...' : 'إرسال'}
          </button>
        </div>
      </div>
 
      <div className="Review-section-rtl">
        <div className="last-modified-rtl">
          تاريخ آخر تعديل: 04/12/2020 - 4:13 م بتوقيت المملكة العربية السعودية
        </div>
       
        <div className="service-rating-section-rtl">
          <div className="service-rating-left-rtl">
            <span className="service-rating-text-rtl">هذه الخدمة مقيمة بمتوسط</span>
            <span className="rating-value-rtl">3.9</span>
            <div className="stars-container-rtl">
              <svg className="star-rtl" viewBox="0 0 20 20">
                <defs>
                  <linearGradient id="half-star">
                    <stop offset="50%" stopColor="#10B981"/>
                    <stop offset="50%" stopColor="#D1D5DB"/>
                  </linearGradient>
                </defs>
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              <svg className="star-rtl" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              <svg className="star-rtl" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              <svg className="star-rtl half" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              <svg className="star-rtl empty" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </div>
            <span className="review-count-rtl">1544 تقييم</span>
          </div>
         
          <button className="rate-service-button-rtl" onClick={handleRateService}>
            قيم هذه الخدمة
          </button>
        </div>
      </div>

      {/* Arabic ResponseModal Component */}
      {showModal && <ResponseModalArabic onClose={handleModalClose} />}
      
      <Footer/>
    </>
  );
};
 
export default SWASurveyArabic;