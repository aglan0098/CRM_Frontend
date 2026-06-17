import React, { useState, useEffect, useRef } from 'react';
import { trackEvent } from '@/utils/analytics';
import { useNavigate } from 'react-router-dom';

import Footer from '@/components/common/FooterArabic';
import Nv from '@/components/ServicesPage/NAVbAR/NvArabic';

import './CardArabic.css';
import {
  getStoredLanguage,
  storeLanguage,
  setupLanguageListener,
  applyLanguageSettings,
  isRTL
} from '../../../utils/LanguageUtils';





const ComplaintescalationrequestAr = () => {
  const framesRef = useRef(null);
  const controlsRef = useRef(null);

  useEffect(() => {
    const frames = framesRef.current;
    const cards = frames ? Array.from(frames.querySelectorAll('.Service-CardAr')) : [];
    const controls = controlsRef.current;
    const dots = controls ? Array.from(controls.querySelectorAll('.CarousalAr')) : [];

    if (!frames || cards.length === 0 || dots.length === 0) return;

    // Compute offsets (recomputed on resize/zoom)
    let baseOffsets = [];
    let firstLeft = 0;

    function computeOffsets() {
      baseOffsets = cards.map((c) => c.offsetLeft);
      firstLeft = baseOffsets[0] || 0;
    }
    computeOffsets();

    function slideToIndex(index) {
      const targetLeft = baseOffsets[index];
      if (typeof targetLeft !== 'number') return;
      // For RTL: reverse the translation direction
      const translate = (targetLeft - firstLeft);
      frames.style.transform = `translateX(${translate}px)`;
      updateDots(index);
    }

    function updateDots(activeIndex) {
      dots.forEach((dot, i) => {
        const img = dot.querySelector('.Carousal-ImgAr');
        if (!img) return;
        // Toggle active class instead of changing src
        if (i === activeIndex) {
          img.classList.add('active');
        } else {
          img.classList.remove('active');
        }
      });
    }

    dots.forEach((dot) => {
      const index = Number(dot.getAttribute('data-index')) || 0;
      const handleClick = () => slideToIndex(index);
      const handleKeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          slideToIndex(index);
        }
      };

      dot.addEventListener('click', handleClick);
      dot.addEventListener('keydown', handleKeydown);

      // Cleanup
      return () => {
        dot.removeEventListener('click', handleClick);
        dot.removeEventListener('keydown', handleKeydown);
      };
    });

    // Initialize
    updateDots(0);

    // Recompute on resize/zoom and keep current slide in view
    let rafId = null;
    function onResize() {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const activeIndex = dots.findIndex(
          (d) => d.querySelector('.Carousal-ImgAr')?.classList.contains('active')
        );
        computeOffsets();
        slideToIndex(activeIndex >= 0 ? activeIndex : 0);
      });
    }

    window.addEventListener('resize', onResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', onResize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const [language, setLanguage] = useState(() => getStoredLanguage());
  const [activeTab, setActiveTab] = useState('goals');
  const navigate = useNavigate();

  useEffect(() => {
      trackEvent('ec_esv_ld', { service_name: 'escalated complaint'})
    }, []);

  // Handle service button clicks - opens links in new tab
  const handleServiceClick = (url) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // Set up language change listener
  useEffect(() => {
    const cleanup = setupLanguageListener((newLanguage) => {
      setLanguage(newLanguage);
      applyLanguageSettings(newLanguage);
      console.log(`WrapService: Language changed to ${newLanguage}`);
    });

    // Apply language settings on mount
    applyLanguageSettings(language);

    return cleanup;
  }, []);

  // Language change handler using centralized system
  const handleLanguageChange = (newLanguage) => {
    // Validate language
    if (!['en', 'ar'].includes(newLanguage)) {
      console.warn('Invalid language selected:', newLanguage);
      return;
    }

    // Use centralized language storage
    storeLanguage(newLanguage);
    setLanguage(newLanguage);

    // Apply language settings immediately
    applyLanguageSettings(newLanguage);

    console.log(`Language changed to: ${newLanguage} (using centralized system)`);
  };


  return (
    <>
      <Nv language={language} onLanguageChange={handleLanguageChange} />

      <div className="GateAr">

        <div className="SerivceAr">
          {/* <img src="styles/vector.png" alt="Vector" className="Vector-imgAr" /> */}

          <div className="Serivce-InfoAr">
            <div className="DescriptionAr">
              <div className="ContentAr">
                <div className="TitleAr">
                  <div className="BreadcrumbAr">
                    <div className="_Breadcrumb-ItemAr">الصفحة الرئيسية</div>
                    <div className="_Breadcrumb-ItemAr">
                      <div className="arrowAr">
                        <svg xmlns="http://www.w3.org/2000/svg" width="6" height="12" viewBox="0 0 6 12" fill="none">
                          <path d="M1 1L5 6L1 11" stroke="#9DA4AE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                      </div>
                      الخدمات
                    </div>
                    <div className="_Breadcrumb-ItemAr _Breadcrumb-Item-TextAr">
                      <div className="arrowAr">
                        <svg xmlns="http://www.w3.org/2000/svg" width="6" height="12" viewBox="0 0 6 12" fill="none">
                          <path d="M1 1L5 6L1 11" stroke="#9DA4AE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                      </div>
                      خدمة تصعيد الشكاوى
                    </div>
                  </div>
                  <div className="T_TitleAr">خدمة تصعيد الشكاوى</div>
                </div>
                <button
                  type="button"
                  className="ButtonAr"
                  onClick={() => {
                    trackEvent('ec_srt_clk');
                    navigate('/ComplaintEscalation');
                  }}
                >
                  طلب الخدمة
                </button>
              </div>
              <div className="T-DescriptionAr">
                تتيح هذه الخدمة للمستفيد تصعيد الشكوى إلى الهيئة السعودية للمياه في حال عدم معالجة الشكوى من قبل مقدم الخدمة خلال (10) أيام عمل من تاريخ تقديمها، أو في حال إغلاقها دون حل مرضٍ.
              </div>
              <a
                className="LinkAr underline"
                href="https://swa-cdn.swa.gov.sa/ServiceGuides/ar/Complaint_Escalation_Service_AR.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('ec_gd_clk')}
              >
                دليل الخدمة
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M1.87232 10.0026C1.87238 8.84779 1.87406 7.94377 1.92252 7.20912C1.9734 6.43762 2.07777 5.80976 2.30706 5.23117C3.00549 3.46877 4.47618 2.09277 6.32227 1.44472C7.38046 1.07325 8.65992 1.04396 10.7857 1.04179C10.8007 1.0416 10.8156 1.0415 10.8306 1.0415C10.8364 1.0415 10.8422 1.04158 10.848 1.04174C11.0111 1.04161 11.1791 1.04162 11.3524 1.04164L11.6547 1.04162C13.0173 1.04134 13.8665 1.04117 14.567 1.28709C15.6912 1.68174 16.5925 2.52183 17.0217 3.60484C17.1673 3.97212 17.2298 4.36204 17.2597 4.81614C17.289 5.25996 17.289 5.80624 17.289 6.49321V8.33331C17.289 8.67849 17.0092 8.95831 16.664 8.95831C16.3188 8.95831 16.039 8.67849 16.039 8.33331V6.51513C16.039 5.80137 16.0387 5.29627 16.0124 4.89841C15.9866 4.50614 15.9374 4.26155 15.8596 4.06536C15.5708 3.33662 14.9537 2.74763 14.153 2.46653C13.6802 2.30057 13.0646 2.29164 11.5125 2.29164C11.2535 2.29164 11.0086 2.29173 10.7765 2.29217C9.61259 2.3209 8.67787 3.27343 8.67787 4.44428C8.67787 4.56689 8.68326 4.69871 8.69013 4.8467L8.6927 4.90155C8.69876 5.03065 8.70537 5.17113 8.70828 5.31125C8.71485 5.628 8.70485 5.99761 8.60925 6.3544C8.42303 7.04938 7.88019 7.59222 7.18521 7.77844C6.82842 7.87404 6.45881 7.88404 6.14206 7.87746C6.002 7.87456 5.86156 7.86796 5.7325 7.86189L5.67752 7.85932C5.52952 7.85245 5.3977 7.84706 5.27509 7.84706C4.08778 7.84706 3.12497 8.80824 3.12232 9.99493C3.12232 10.0465 3.12231 10.0987 3.12231 10.1515V12.2727C3.12231 13.5667 3.12333 14.4827 3.20634 15.1882C3.28762 15.879 3.44053 16.2912 3.69288 16.6085C3.8576 16.8156 4.05393 17.0007 4.27651 17.1575C4.62416 17.4025 5.07869 17.5507 5.82616 17.6286C6.5836 17.7075 7.56444 17.7083 8.93671 17.7083H12.4973C12.8425 17.7083 13.1223 17.9881 13.1223 18.3333C13.1223 18.6785 12.8425 18.9583 12.4973 18.9583H8.90058C7.57236 18.9583 6.52639 18.9583 5.69658 18.8718C4.8493 18.7835 4.15258 18.5993 3.55656 18.1794C3.2384 17.9552 2.95466 17.6885 2.71459 17.3866C2.26052 16.8157 2.06022 16.1444 1.9649 15.3343C1.8723 14.5473 1.8723 13.5577 1.87231 12.3128V10.1287C1.87231 10.0864 1.87232 10.0443 1.87232 10.0026ZM8.14152 2.35896C7.56395 2.40633 7.12712 2.48696 6.7363 2.62416C5.21368 3.15866 4.02717 4.28356 3.46913 5.6917C3.30764 6.0992 3.21662 6.58172 3.16981 7.29139C3.169 7.30361 3.16821 7.31588 3.16743 7.32821C3.74701 6.87035 4.47914 6.59706 5.27509 6.59706C5.42989 6.59706 5.5879 6.60382 5.73544 6.61066L5.792 6.6133C5.92257 6.61943 6.04548 6.62519 6.16802 6.62773C6.45189 6.63363 6.67904 6.61997 6.86169 6.57103C7.1253 6.5004 7.33121 6.29449 7.40184 6.03088C7.45078 5.84823 7.46444 5.62108 7.45855 5.3372C7.456 5.21468 7.45024 5.09179 7.44412 4.96124L7.44147 4.90463C7.43463 4.75709 7.42787 4.59908 7.42787 4.44428C7.42787 3.65852 7.6942 2.93497 8.14152 2.35896Z" fill="#1B8354" />
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M6.67967 10.2082L7.29164 10.2082C8.2118 10.2082 9.01039 10.926 9.01039 11.8749C9.01039 12.8238 8.2118 13.5416 7.29164 13.5416H6.45831V14.9999C6.45831 15.3451 6.17849 15.6249 5.83331 15.6249C5.48813 15.6249 5.20831 15.3451 5.20831 14.9999L5.2083 11.6372C5.20823 11.4669 5.20814 11.2801 5.23046 11.122C5.25708 10.9335 5.32561 10.6977 5.53042 10.5027C5.73094 10.3117 5.96581 10.252 6.14888 10.2285C6.30851 10.2081 6.49871 10.2082 6.67967 10.2082ZM6.45831 12.2916H7.29164C7.57961 12.2916 7.76039 12.0766 7.76039 11.8749C7.76039 11.6732 7.57961 11.4582 7.29164 11.4582H6.70831C6.60728 11.4582 6.52767 11.4583 6.45931 11.4598C6.45834 11.5173 6.45831 11.5839 6.45831 11.6666V12.2916Z" fill="#1B8354" />
                  <path d="M16.3715 10.2082L17.5 10.2082C17.8452 10.2082 18.125 10.4881 18.125 10.8332C18.125 11.1784 17.8452 11.4582 17.5 11.4582H16.4062C16.0456 11.4582 15.8351 11.4594 15.6855 11.4786C15.6471 11.4835 15.6206 11.4888 15.6031 11.4932C15.6002 11.5061 15.5968 11.5239 15.5935 11.5475C15.5744 11.6828 15.5729 11.8762 15.5729 12.2221V12.2916H16.7708C17.116 12.2916 17.3958 12.5714 17.3958 12.9166C17.3958 13.2617 17.116 13.5416 16.7708 13.5416H15.5729V14.9999C15.5729 15.3451 15.2931 15.6249 14.9479 15.6249C14.6027 15.6249 14.3229 15.3451 14.3229 14.9999L14.3229 12.1857C14.3228 11.89 14.3228 11.6061 14.3557 11.3728C14.393 11.1086 14.4829 10.8198 14.7304 10.584C14.9737 10.3524 15.2643 10.2723 15.5268 10.2387C15.7655 10.2082 16.0578 10.2082 16.3715 10.2082Z" fill="#1B8354" />
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M10.9188 10.2082L10.9375 10.2082C12.4617 10.2082 13.75 11.3924 13.75 12.9166C13.75 14.4407 12.4617 15.6249 10.9375 15.6249L10.9188 15.6249C10.7989 15.6249 10.6727 15.625 10.5644 15.6156C10.4429 15.6051 10.2852 15.5793 10.1259 15.4917C9.80673 15.3162 9.66727 15.036 9.61536 14.7933C9.57869 14.6218 9.58155 14.4318 9.58293 14.3399C9.58314 14.3261 9.58331 14.3144 9.58331 14.3055V11.5277C9.58331 11.5187 9.58314 11.5071 9.58293 11.4932C9.58155 11.4014 9.57869 11.2113 9.61536 11.0399C9.66727 10.7971 9.80673 10.5169 10.1259 10.3414C10.2852 10.2538 10.4429 10.228 10.5644 10.2175C10.6727 10.2082 10.7989 10.2082 10.9188 10.2082ZM10.8329 11.4584L10.8329 11.4597C10.8331 11.4809 10.8333 11.5057 10.8333 11.5277V14.3055C10.8333 14.3274 10.8331 14.3522 10.8329 14.3734L10.8329 14.3748C10.8637 14.3749 10.8981 14.3749 10.9375 14.3749C11.8295 14.3749 12.5 13.6936 12.5 12.9166C12.5 12.1395 11.8295 11.4582 10.9375 11.4582C10.8981 11.4582 10.8637 11.4582 10.8329 11.4584Z" fill="#1B8354" />
                </svg>
              </a>
            </div>
            <div className="InfoAr">
              <div className="Hor-Tab-ListAr" role="tablist">
                {[
                  { id: 'goals', label: 'أهداف الخدمة' },
                  { id: 'policy', label: 'شروط الاستخدام' },
                  { id: 'steps', label: 'خطوات التقديم' },
                  { id: 'requirements', label: 'المستندات المطلوبة' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    className={`Hor-TabAr${activeTab === tab.id ? ' Hor-Tab--active' : ''
                      }`}
                    onClick={() => {
                      setActiveTab(tab.id);
                      if (tab.id === 'policy') trackEvent('ec_pol_clk');
                      if (tab.id === 'requirements') trackEvent('ec_req_clk');
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="Tab-PanelAr">
                {activeTab === 'steps' && (
                  <div className="StepsAr" role="tabpanel">
                    <div className="List-ItemAr">
                      <div className="T-Steps-NumAr">1-</div>
                      <div className="T-Steps-TextAr">
                       الدخول إلى الموقع الإلكتروني للهيئة السعودية للمياه.
                      </div>
                    </div>
                    <div className="List-ItemAr">
                      <div className="T-Steps-NumAr">2-</div>
                      <div className="T-Steps-TextAr">
                        تسجيل الدخول إلى البوابة الإلكترونية عبر النفاذ الوطني الموحد.
                      </div>
                    </div>
                    <div className="List-ItemAr">
                      <div className="T-Steps-NumAr">3-</div>
                      <div className="T-Steps-TextAr">
                       اختيار خدمة تصعيد الشكاوى من قائمة الخدمات الإلكترونية. 
                      </div>
                    </div>
                    <div className="List-ItemAr">
                      <div className="T-Steps-NumAr">4-</div>
                      <div className="T-Steps-TextAr">
                        تعبئة المعلومات الشخصية. 
                      </div>
                    </div>
                    <div className="List-ItemAr">
                      <div className="T-Steps-NumAr">5-</div>
                      <div className="T-Steps-TextAr">إدخال تفاصيل الشكوى. </div>
                    </div>
                    <div className="List-ItemAr">
                      <div className="T-Steps-NumAr">6-</div>
                      <div className="T-Steps-TextAr">
                        إرفاق المستندات الداعمة (اختياري). 
                      </div>
                    </div>
                    <div className="List-ItemAr">
                      <div className="T-Steps-NumAr">7-</div>
                      <div className="T-Steps-TextAr">
                        الإقرار بصحة البيانات. 
                      </div>
                    </div>
                    <div className="List-ItemAr">
                      <div className="T-Steps-NumAr">8-</div>
                      <div className="T-Steps-TextAr">
                        إرسال الطلب.
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === 'policy' && (
                  <div className="Tab-Panel-BodyAr" role="tabpanel">
                    <div className="List-ItemAr">
                      <div className="T-Steps-TextAr">
                        يمكن إرفاق مستندات داعمة للشكوى بصيغ PDF أو PNG أو JPG وفق الحد الأقصى لعدد الملفات المسموح به في النظام.
                      </div>
                    </div>
                  </div>
                  // <div className="Tab-Panel-BodyAr" role="tabpanel">
                  //   <div className="List-ItemAr">
                  //     <div className="T-Steps-NumAr">1-</div>
                  //     <div className="T-Steps-TextAr">
                  //       الخدمات أو المواضيع التي يمكن معالجة الاستفسارات بشأنها من خلال حساب خدمة المستفيدين الرسمي:
                  //     </div>
                  //   </div>
                  //   <ul className="Tab-ListAr Tab-List--bulletedAr">
                  //     <li>شكاوى الفواتير</li>
                  //     <li>نقص المياه</li>
                  //     <li>طلبات الصهاريج</li>
                  //     <li>طلبات توصيل المياه والصرف الصحي</li>
                  //     <li>التراخيص</li>
                  //   </ul>
                  //   <div className="List-ItemAr">
                  //     <div className="T-Steps-NumAr">2-</div>
                  //     <div className="T-Steps-TextAr">
                  //       عادة ما يستجيب حساب خدمة المستفيدين الرسمي للاستفسارات خلال 3 ساعات،
                  //       مع مراعاة عطلات نهاية الأسبوع والعطلات الرسمية والأوقات خارج ساعات العمل الرسمية في أيام العمل.
                  //     </div>
                  //   </div>
                  //   <div className="List-ItemAr">
                  //     <div className="T-Steps-NumAr">3-</div>
                  //     <div className="T-Steps-TextAr">
                  //       يحق للمستهلك تصعيد الشكوى إلى الهيئة إذا مرت 30 يوم عمل منذ
                  //       تصعيد الشكوى مع مقدم الخدمة ولم يتم تلقي رد.
                  //     </div>
                  //   </div>
                  //   <div className="List-ItemAr">
                  //     <div className="T-Steps-NumAr">4-</div>
                  //     <div className="T-Steps-TextAr">
                  //       كما يحق للمستهلك تصعيد الشكوى إلى الهيئة خلال 30 يوم عمل
                  //       من إغلاق الشكوى من قبل مقدم الخدمة.
                  //     </div>
                  //   </div>
                  // </div>
                )}
                {activeTab === 'requirements' && (
                  <div className="Tab-Panel-BodyAr" role="tabpanel">
                    <div className="List-ItemAr">
                      <div className="T-Steps-NumAr">1-</div>
                      <div className="T-Steps-TextAr">أن يكون مقدم الطلب هو المستفيد أو المالك المعني بالخدمة.</div>
                    </div>
                    <div className="List-ItemAr">
                      <div className="T-Steps-NumAr">2-</div>
                      <div className="T-Steps-TextAr">
                       وجود شكوى سابقة مسجلة لدى مقدم الخدمة.
                      </div>
                    </div>
                    <div className="List-ItemAr">
                      <div className="T-Steps-NumAr">3-</div>
                      <div className="T-Steps-TextAr">
                       مرور (10) أيام عمل دون معالجة الشكوى أو إغلاقها دون حل مرضٍ.
                      </div>
                    </div>
                    <div className="List-ItemAr">
                      <div className="T-Steps-NumAr">4-</div>
                      <div className="T-Steps-TextAr">
                       ألا تتجاوز الشكوى 30 يومًا من تاريخ إغلاقها من قبل مقدم الخدمة.
                      </div>
                    </div>
                    <div className="List-ItemAr">
                      <div className="T-Steps-NumAr">5-</div>
                      <div className="T-Steps-TextAr">
                       إدخال رقم الشكوى المسجل لدى مقدم الخدمة.
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === 'goals' && (
                  <div className="Tab-Panel-BodyAr" role="tabpanel">
                    <div className="List-ItemAr">
                      <div className="T-Steps-NumAr">1-</div>
                      <div className="T-Steps-TextAr">تمكين الهيئة السعودية للمياه من ممارسة دورها التنظيمي والرقابي في التحقق من التزام مقدمي خدمات المياه بالأنظمة واللوائح المعتمدة.</div>
                    </div>
                    <div className="List-ItemAr">
                      <div className="T-Steps-NumAr">2-</div>
                      <div className="T-Steps-TextAr">
                        حماية حقوق المستفيدين وضمان معالجة شكاواهم وفق الإجراءات النظامية المعتمدة.
                      </div>
                    </div>
                    <div className="List-ItemAr">
                      <div className="T-Steps-NumAr">3-</div>
                      <div className="T-Steps-TextAr">
                        تعزيز جودة خدمات المياه والصرف الصحي ورفع مستوى الامتثال ضمن منظومة المياه في المملكة.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="Info-CardAr">
            <div className="IC-Service-InfoAr">
              <div className="IC-SI-ContentAr">
                <div className="UserAr">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" viewBox="0 0 20 22" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M9.75 0C6.8505 0 4.5 2.3505 4.5 5.25C4.5 8.14949 6.8505 10.5 9.75 10.5C12.6495 10.5 15 8.14949 15 5.25C15 2.3505 12.6495 0 9.75 0ZM6 5.25C6 3.17893 7.67893 1.5 9.75 1.5C11.8211 1.5 13.5 3.17893 13.5 5.25C13.5 7.32107 11.8211 9 9.75 9C7.67893 9 6 7.32107 6 5.25Z" fill="#1B8354" />
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M15.9788 13.8292C15.8162 13.7374 15.6726 13.6564 15.5563 13.5872C12.0023 11.4709 7.49809 11.4709 3.94404 13.5872C3.82773 13.6564 3.68405 13.7375 3.52139 13.8293C2.80857 14.2314 1.73106 14.8393 0.992896 15.5618C0.531228 16.0137 0.092574 16.6092 0.0128283 17.3388C-0.0719782 18.1146 0.266485 18.8427 0.945503 19.4896C2.11695 20.6056 3.52274 21.5 5.34104 21.5H14.1593C15.9776 21.5 17.3834 20.6056 18.5548 19.4896C19.2339 18.8427 19.5723 18.1146 19.4875 17.3388C19.4078 16.6092 18.9691 16.0137 18.5075 15.5618C17.7693 14.8393 16.6917 14.2313 15.9788 13.8292ZM4.71146 14.876C7.79264 13.0413 11.7077 13.0413 14.7889 14.876C14.9568 14.976 15.1407 15.0803 15.3334 15.1897C16.046 15.5939 16.8781 16.066 17.4582 16.6338C17.8183 16.9863 17.9718 17.2771 17.9964 17.5017C18.0159 17.6801 17.9708 17.9742 17.5202 18.4035C16.4843 19.3904 15.4318 20 14.1593 20H5.34104C4.0686 20 3.01602 19.3904 1.98017 18.4035C1.52954 17.9742 1.48445 17.6801 1.50395 17.5017C1.52851 17.2771 1.68202 16.9863 2.04214 16.6338C2.62223 16.066 3.45426 15.594 4.16686 15.1897C4.35953 15.0804 4.5436 14.976 4.71146 14.876Z" fill="#1B8354" />
                  </svg>
                </div>
                <div className="Inner-ContentAr">
                  <div className="Inner-Content-T1Ar">الفئة المستهدفة</div>
                  <div className="Inner-Content-T2Ar-Blk">الأفراد</div>
                </div>
              </div>
              <div className="IC-SI-ContentAr">
                <div className="UserAr">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M11.5 6.75C11.5 6.33579 11.1642 6 10.75 6C10.3358 6 10 6.33579 10 6.75V10.75C10 10.9489 10.079 11.1397 10.2197 11.2803L12.2197 13.2803C12.5126 13.5732 12.9874 13.5732 13.2803 13.2803C13.5732 12.9874 13.5732 12.5126 13.2803 12.2197L11.5 10.4393V6.75Z" fill="#1B8354" />
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M10.75 0C4.81294 0 0 4.81294 0 10.75C0 16.6871 4.81294 21.5 10.75 21.5C16.6871 21.5 21.5 16.6871 21.5 10.75C21.5 4.81294 16.6871 0 10.75 0ZM1.5 10.75C1.5 5.64137 5.64137 1.5 10.75 1.5C15.8586 1.5 20 5.64137 20 10.75C20 15.8586 15.8586 20 10.75 20C5.64137 20 1.5 15.8586 1.5 10.75Z" fill="#1B8354" />
                  </svg>
                </div>
                <div className="Inner-ContentAr">
                  <div className="Inner-Content-T1Ar">مدة تنفيذ الخدمة</div>
                  <div className="Inner-Content-T2Ar-Blk">5 أيام</div>
                </div>
              </div>
              <div className="IC-SI-ContentAr">
                <div className="UserAr">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M16.25 9.25C15.6977 9.25 15.25 9.69772 15.25 10.25C15.25 10.8023 15.6977 11.25 16.25 11.25H16.259C16.8113 11.25 17.259 10.8023 17.259 10.25C17.259 9.69772 16.8113 9.25 16.259 9.25H16.25Z" fill="#1B8354" />
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M15.698 1.06084e-06H16.802C17.7005 -2.71407e-05 18.4497 -5.06565e-05 19.0445 0.0799147C19.6723 0.164319 20.2391 0.34999 20.6945 0.80546C21.15 1.26093 21.3357 1.82773 21.4201 2.45552C21.5001 3.05027 21.5 3.79943 21.5 4.69784V8.802C21.5 9.70041 21.5001 10.4497 21.4201 11.0445C21.3357 11.6723 21.15 12.2391 20.6945 12.6945C20.2391 13.15 19.6723 13.3357 19.0445 13.4201C18.4497 13.5001 17.7005 13.5 16.802 13.5H15.698C14.7995 13.5 14.0503 13.5001 13.4555 13.4201C12.8277 13.3357 12.2609 13.15 11.8055 12.6945C11.35 12.2391 11.1643 11.6723 11.0799 11.0445C10.9999 10.4497 11 9.70048 11 8.802V4.698C11 3.79954 10.9999 3.0503 11.0799 2.45552C11.1643 1.82773 11.35 1.26093 11.8055 0.805459C12.2609 0.34999 12.8277 0.164319 13.4555 0.0799144C14.0503 -5.088e-05 14.7995 -2.72599e-05 15.698 1.06084e-06ZM13.6554 1.56654C13.1939 1.62858 12.9964 1.7358 12.8661 1.86612C12.7358 1.99644 12.6286 2.19393 12.5665 2.6554C12.5016 3.13843 12.5 3.78599 12.5 4.75V8.75C12.5 9.71402 12.5016 10.3616 12.5665 10.8446C12.6286 11.3061 12.7358 11.5036 12.8661 11.6339C12.9964 11.7642 13.1939 11.8714 13.6554 11.9335C14.1384 11.9984 14.786 12 15.75 12H16.75C17.714 12 18.3616 11.9984 18.8446 11.9335C19.3061 11.8714 19.5036 11.7642 19.6339 11.6339C19.7642 11.5036 19.8714 11.3061 19.9335 10.8446C19.9984 10.3616 20 9.71401 20 8.75V4.75C20 3.78599 19.9984 3.13843 19.9335 2.6554C19.8714 2.19393 19.7642 1.99644 19.6339 1.86612C19.5036 1.7358 19.3061 1.62858 18.8446 1.56654C18.3616 1.5016 17.714 1.5 16.75 1.5H15.75C14.786 1.5 14.1384 1.5016 13.6554 1.56654Z" fill="#1B8354" />
                    <path d="M8.67035 1.06084e-06H8.71412C9.12833 1.06084e-06 9.46412 0.335788 9.46412 0.750001C9.46412 1.16421 9.12833 1.5 8.71412 1.5C7.06557 1.5 5.88798 1.50098 4.97587 1.59756C4.07731 1.6927 3.52328 1.87377 3.09178 2.17727C2.73538 2.42795 2.42522 2.73945 2.17544 3.09779C1.87261 3.53222 1.692 4.09017 1.59718 4.99386C1.50097 5.91072 1.5 7.09424 1.5 8.75C1.5 10.4058 1.50097 11.5893 1.59718 12.5061C1.692 13.4098 1.87261 13.9678 2.17544 14.4022C2.42522 14.7606 2.73538 15.0721 3.09178 15.3227C3.52328 15.6262 4.07731 15.8073 4.97587 15.9024C5.88798 15.999 7.06557 16 8.71412 16H12.6962C14.3447 16 15.5223 15.999 16.4344 15.9024C17.333 15.8073 17.887 15.6262 18.3185 15.3227C18.6573 15.0844 19.1252 15.1659 19.3635 15.5047C19.6018 15.8435 19.5203 16.3113 19.1815 16.5496C18.4559 17.06 17.6153 17.2858 16.5924 17.3941C15.5921 17.5 14.3351 17.5 12.7399 17.5H11.5V20H14.75C15.1642 20 15.5 20.3358 15.5 20.75C15.5 21.1642 15.1642 21.5 14.75 21.5H6.75C6.33579 21.5 6 21.1642 6 20.75C6 20.3358 6.33579 20 6.75 20H10V17.5H8.67037C7.07519 17.5 5.81822 17.5 4.81793 17.3941C3.79498 17.2858 2.95436 17.06 2.22882 16.5496C1.72908 16.1981 1.29458 15.7616 0.944896 15.26C0.437557 14.5322 0.21308 13.6892 0.105367 12.6627C-1.49533e-05 11.6584 -8.27828e-06 10.3962 1.50335e-07 8.79343V8.70657C-8.27828e-06 7.10376 -1.49533e-05 5.84158 0.105367 4.83732C0.21308 3.81083 0.437557 2.96784 0.944896 2.24002C1.29458 1.73836 1.72908 1.30186 2.22882 0.950364C2.95436 0.440047 3.79498 0.21421 4.81793 0.105897C5.81822 -1.45137e-05 7.07518 -7.60011e-06 8.67035 1.06084e-06Z" fill="#1B8354" />
                  </svg>
                </div>
                <div className="Inner-ContentAr">
                  <div className="Inner-Content-T1Ar">قنوات تقديم الخدمة</div>
                  <div className="Inner-Content-T2Ar-Blk">بوابة الخدمات</div>
                </div>
              </div>
              <div className="IC-SI-ContentAr">
                <div className="UserAr">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M10.75 21.5C16.6871 21.5 21.5 16.6869 21.5 10.75C21.5 4.81292 16.6871 0 10.75 0C4.81292 0 0 4.81292 0 10.75C0 16.6869 4.81291 21.5 10.75 21.5ZM10.75 20C5.64136 20 1.5 15.8585 1.5 10.75C1.5 5.64135 5.64135 1.5 10.75 1.5C15.8587 1.5 20 5.64135 20 10.75C20 15.8585 15.8586 20 10.75 20ZM9.08594 14.0635C9.35752 14.0088 9.5914 13.8535 9.74316 13.6396L10.3545 12.7617C10.418 12.6709 10.4551 12.5613 10.4551 12.4434V11.1523L11.6318 10.9111V13.2383L15.4082 12.4609C15.5865 12.0783 15.7048 11.6631 15.75 11.2275L12.8086 11.833V10.6689L15.4082 10.1338C15.5865 9.75116 15.7048 9.3359 15.75 8.90039L12.8086 9.50488L12.8086 5.31934C12.3579 5.56421 11.9572 5.88996 11.6318 6.27441L11.6318 9.74707L10.4551 9.98926L10.4551 4.75C10.0046 4.99472 9.60458 5.32078 9.2793 5.70508L9.2793 10.2305L6.64648 10.7725C6.46818 11.1551 6.34999 11.5704 6.30469 12.0059L9.2793 11.3945V12.8604L6.0918 13.5156C5.91335 13.8984 5.79519 14.3142 5.75 14.75L9.08594 14.0635ZM15.418 14.9775C15.5913 14.5968 15.706 14.1834 15.75 13.75L12.082 14.5225C11.9087 14.9033 11.7939 15.3166 11.75 15.75L15.418 14.9775Z" fill="#1B8354" />
                  </svg>
                </div>
                <div className="Inner-ContentAr">
                  <div className="Inner-Content-T1Ar">تكلفة الخدمة</div>
                  <div className="Inner-Content-T2Ar-Blk">مجاني</div>
                </div>
              </div>
            </div>

            <hr className="Line-1Ar" />

            <div className="Contact-InfoAr">
              <div className="Inner-Content-LowerAr">
                <div className="Inner-Content-Lower-T1Ar">
                  الأسئلة الشائعة
                </div>
                <div className="Inner-Content-Lower-T2Ar">
                 <a href="https://www.swa.gov.sa/ar/faq" target="_blank" className="underline" onClick={() => trackEvent('ec_faq_clk')}>
                   صفحة الأسئلة الشائعة - SWA
                  </a>
                  <div className="Inner-Content-Lower-T2-ImgAr">
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                      <path d="M8.1241 16.25H8.125C11.8283 16.25 13.6867 16.25 14.9683 14.9683C16.18 13.755 16.2425 11.9541 16.2483 8.87581C16.2483 8.53081 15.9692 8.25 15.6242 8.25H15.6225C15.2775 8.25 14.9975 8.52919 14.9975 8.87419C14.9917 11.8667 14.9042 13.2641 14.0833 14.085C13.1675 15 11.4825 15 8.12419 15C4.76585 15 3.08 15 2.165 14.085C1.25 13.1691 1.25 11.4833 1.25 8.12502C1.25 4.76668 1.25002 3.08087 2.16585 2.16504C2.98585 1.34421 4.38331 1.25583 7.37581 1.25C7.72165 1.25 8 0.969186 8 0.624186C7.99917 0.279186 7.72 0 7.375 0H7.37333C4.29416 0.00583333 2.49332 0.0683235 1.28166 1.28166C0 2.56248 0 4.42164 0 8.12491C0 11.8282 0 13.6867 1.28166 14.9683C2.56248 16.25 4.42166 16.25 8.1241 16.25Z" fill="#1B8354" />
                      <path d="M6.89175 9.45009C7.01425 9.57092 7.17341 9.63173 7.33258 9.63173C7.49342 9.63173 7.6534 9.56925 7.7759 9.44676L14.9251 2.25592C14.9742 2.76092 15.0126 3.55842 14.9951 4.80426C14.9901 5.15009 15.2659 5.43337 15.6109 5.43837C15.9576 5.44671 16.2401 5.16757 16.2451 4.82257C16.2967 1.19825 15.9071 0.807065 15.6978 0.597002C15.4878 0.386968 15.0968 -0.00407002 11.4751 0.0475851C11.1301 0.0525851 10.8542 0.3367 10.8592 0.6817C10.8642 1.02337 11.1434 1.29759 11.4842 1.29759H11.4934C12.7442 1.28009 13.5425 1.31839 14.0459 1.36839L6.88922 8.5659C6.64589 8.8109 6.64675 9.20676 6.89175 9.45009Z" fill="#1B8354" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="IC-SI-ContentAr">
                <div className="UserAr">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M4.06726 0.0365676C4.63395 0.153692 5.08524 0.534431 5.36564 1.03746L6.25885 2.6399C6.58785 3.23011 6.86473 3.72679 7.04554 4.15857C7.23735 4.61658 7.35126 5.06824 7.29919 5.5676C7.24711 6.06696 7.04246 6.4854 6.76029 6.89399C6.49428 7.27917 6.12088 7.70804 5.67718 8.21767L3.44932 10.7767C5.21617 13.6727 7.8251 16.2828 10.7241 18.0514L13.2831 15.8236C13.7927 15.3799 14.2216 15.0065 14.6068 14.7405C15.0153 14.4583 15.4338 14.2536 15.9331 14.2016C16.4325 14.1495 16.8842 14.2634 17.3422 14.4552C17.774 14.636 18.2706 14.9129 18.8609 15.2419L20.4633 16.1351C20.9663 16.4155 21.3471 16.8668 21.4642 17.4335C21.5825 18.0061 21.408 18.5816 21.0224 19.0547C19.6235 20.771 17.3822 21.8639 15.031 21.3896C13.5858 21.098 12.1598 20.6123 10.4351 19.6232C6.9697 17.6358 3.86263 14.527 1.87755 11.0657C0.888434 9.34099 0.402719 7.915 0.111176 6.46974C-0.36312 4.11852 0.729715 1.87724 2.44608 0.478334C2.91911 0.0927917 3.49466 -0.0817795 4.06726 0.0365676ZM12.1212 18.8239C13.2876 19.3986 14.302 19.7123 15.3276 19.9192C17.0237 20.2613 18.7359 19.4858 19.8597 18.107C20.0072 17.926 20.0082 17.7996 19.9952 17.7371C19.9811 17.6687 19.9238 17.5517 19.733 17.4453L18.1665 16.5721C17.5308 16.2178 17.1077 15.9832 16.7628 15.8388C16.4354 15.7017 16.2476 15.6769 16.0887 15.6935C15.9299 15.71 15.7512 15.7731 15.4592 15.9747C15.1515 16.1872 14.7858 16.5041 14.237 16.9819L12.1212 18.8239ZM2.67685 9.37956L4.51884 7.26376C4.99667 6.7149 5.31355 6.34925 5.52602 6.04159C5.7277 5.74956 5.79072 5.57086 5.80728 5.41202C5.82384 5.25319 5.79905 5.06533 5.66196 4.73797C5.51754 4.3931 5.28292 3.96993 4.92861 3.33429L4.05543 1.76778C3.94905 1.57693 3.83207 1.51966 3.76365 1.50552C3.70115 1.4926 3.57478 1.49351 3.39374 1.64106C2.01497 2.76482 1.23943 4.47708 1.58156 6.17313C1.78844 7.19871 2.10213 8.21319 2.67685 9.37956Z" fill="#1B8354" />
                  </svg>
                </div>
                <div className="Inner-ContentAr">
                  <div className="Inner-Content-T1Ar">الهاتف</div>
                  <div className="Inner-Content-T2Ar" onClick={() => trackEvent('ec_ph_clk')}>
                    <span className="underline">
                      19913
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                      <path d="M8.1241 16.25H8.125C11.8283 16.25 13.6867 16.25 14.9683 14.9683C16.18 13.755 16.2425 11.9541 16.2483 8.87581C16.2483 8.53081 15.9692 8.25 15.6242 8.25H15.6225C15.2775 8.25 14.9975 8.52919 14.9975 8.87419C14.9917 11.8667 14.9042 13.2641 14.0833 14.085C13.1675 15 11.4825 15 8.12419 15C4.76585 15 3.08 15 2.165 14.085C1.25 13.1691 1.25 11.4833 1.25 8.12502C1.25 4.76668 1.25002 3.08087 2.16585 2.16504C2.98585 1.34421 4.38331 1.25583 7.37581 1.25C7.72165 1.25 8 0.969186 8 0.624186C7.99917 0.279186 7.72 0 7.375 0H7.37333C4.29416 0.00583333 2.49332 0.0683235 1.28166 1.28166C0 2.56248 0 4.42164 0 8.12491C0 11.8282 0 13.6867 1.28166 14.9683C2.56248 16.25 4.42166 16.25 8.1241 16.25Z" fill="#1B8354" />
                      <path d="M6.89175 9.45009C7.01425 9.57092 7.17341 9.63173 7.33258 9.63173C7.49342 9.63173 7.6534 9.56925 7.7759 9.44676L14.9251 2.25592C14.9742 2.76092 15.0126 3.55842 14.9951 4.80426C14.9901 5.15009 15.2659 5.43337 15.6109 5.43837C15.9576 5.44671 16.2401 5.16757 16.2451 4.82257C16.2967 1.19825 15.9071 0.807065 15.6978 0.597002C15.4878 0.386968 15.0968 -0.00407002 11.4751 0.0475851C11.1301 0.0525851 10.8542 0.3367 10.8592 0.6817C10.8642 1.02337 11.1434 1.29759 11.4842 1.29759H11.4934C12.7442 1.28009 13.5425 1.31839 14.0459 1.36839L6.88922 8.5659C6.64589 8.8109 6.64675 9.20676 6.89175 9.45009Z" fill="#1B8354" />
                    </svg>
                  </div>
                </div>
              </div>

              
            </div>
          </div>
        </div>

        <div className="Footer-AboveAr">
          <div className="Comments-N-SuggestonsAr">
            <div className="CnS-CardAr">
              <div className="Cns-Card-Icon-DivAr">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M15.3029 8.2568C15.5828 7.95146 15.5621 7.47703 15.2568 7.19714C14.9515 6.91724 14.477 6.93787 14.1971 7.24321L9.22644 12.6658L7.28033 10.7197C6.98744 10.4268 6.51256 10.4268 6.21967 10.7197C5.92678 11.0126 5.92678 11.4874 6.21967 11.7803L8.71967 14.2803C8.86432 14.425 9.06178 14.5043 9.26629 14.4998C9.47081 14.4954 9.66464 14.4076 9.80287 14.2568L15.3029 8.2568Z" fill="#067647" />
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M10.75 21.5C4.81294 21.5 0 16.6871 0 10.75C0 4.81294 4.81294 0 10.75 0C16.6871 0 21.5 4.81294 21.5 10.75C21.5 16.6871 16.6871 21.5 10.75 21.5ZM1.5 10.75C1.5 15.8586 5.64137 20 10.75 20C15.8586 20 20 15.8586 20 10.75C20 5.64137 15.8586 1.5 10.75 1.5C5.64137 1.5 1.5 5.64137 1.5 10.75Z" fill="#067647" />
                </svg>
              </div>
              <div className="CnS-Card-ContentAr">
                <div className="CnS-Card-Content-T1Ar">التعليقات والاقتراحات</div>
                <div className="CnS-Card-Content-T2Ar">
                  لأي استفسار أو ملاحظات حول الخدمات الحكومية، يرجى ملء
                  المعلومات المطلوبة.
                </div>
              </div>
              <div className="Cns-Card-ActionsAr">
                <a href="https://www.swa.gov.sa/ar/communication-channels" target="_blank" className="CnS-Card-Button" onClick={() => trackEvent('ec_ctc_clk')}>اتصل بنا</a>
              </div>
            </div>
          </div>

          <div className="Modified-DateAr">
            <div className="Modified-Date-TAr">
              تاريخ آخر تعديل: 04/12/2020 - 4:13 مساءً بتوقيت المملكة العربية السعودية
            </div>
          </div>

          <div className="RatingAr">
            <div className="Rating-bodyAr">
              <div className="Rating-ContentAr">
                <div className="Rating-Content-Right-TAr">1544 تقييم</div>
                <div className="RatingStarAr">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M15.0919 1.96866C15.4494 1.19379 16.5506 1.19379 16.9081 1.96866L20.2797 9.27846C20.4254 9.59426 20.7247 9.81171 21.0701 9.85266L29.064 10.8005C29.9114 10.9009 30.2517 11.9483 29.6252 12.5277L23.7151 17.9932C23.4597 18.2293 23.3454 18.5812 23.4132 18.9223L24.982 26.8178C25.1483 27.6548 24.2574 28.3021 23.5128 27.8853L16.4884 23.9534C16.185 23.7835 15.815 23.7835 15.5116 23.9534L8.48722 27.8853C7.74261 28.3021 6.85165 27.6548 7.01795 26.8178L8.5868 18.9223C8.65458 18.5812 8.54026 18.2293 8.28492 17.9932L2.3748 12.5277C1.7483 11.9483 2.08862 10.9009 2.93601 10.8005L10.9299 9.85266C11.2753 9.81171 11.5746 9.59426 11.7203 9.27846L15.0919 1.96866Z" fill="#1B8354" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M15.0919 1.96866C15.4494 1.19379 16.5506 1.19379 16.9081 1.96866L20.2797 9.27846C20.4254 9.59426 20.7247 9.81171 21.0701 9.85266L29.064 10.8005C29.9114 10.9009 30.2517 11.9483 29.6252 12.5277L23.7151 17.9932C23.4597 18.2293 23.3454 18.5812 23.4132 18.9223L24.982 26.8178C25.1483 27.6548 24.2574 28.3021 23.5128 27.8853L16.4884 23.9534C16.185 23.7835 15.815 23.7835 15.5116 23.9534L8.48722 27.8853C7.74261 28.3021 6.85165 27.6548 7.01795 26.8178L8.5868 18.9223C8.65458 18.5812 8.54026 18.2293 8.28492 17.9932L2.3748 12.5277C1.7483 11.9483 2.08862 10.9009 2.93601 10.8005L10.9299 9.85266C11.2753 9.81171 11.5746 9.59426 11.7203 9.27846L15.0919 1.96866Z" fill="#1B8354" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M15.0919 1.96866C15.4494 1.19379 16.5506 1.19379 16.9081 1.96866L20.2797 9.27846C20.4254 9.59426 20.7247 9.81171 21.0701 9.85266L29.064 10.8005C29.9114 10.9009 30.2517 11.9483 29.6252 12.5277L23.7151 17.9932C23.4597 18.2293 23.3454 18.5812 23.4132 18.9223L24.982 26.8178C25.1483 27.6548 24.2574 28.3021 23.5128 27.8853L16.4884 23.9534C16.185 23.7835 15.815 23.7835 15.5116 23.9534L8.48722 27.8853C7.74261 28.3021 6.85165 27.6548 7.01795 26.8178L8.5868 18.9223C8.65458 18.5812 8.54026 18.2293 8.28492 17.9932L2.3748 12.5277C1.7483 11.9483 2.08862 10.9009 2.93601 10.8005L10.9299 9.85266C11.2753 9.81171 11.5746 9.59426 11.7203 9.27846L15.0919 1.96866Z" fill="#1B8354" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <mask
                      id="mask0_81_4083"
                      mask-type="alpha"
                      maskUnits="userSpaceOnUse"
                      x="2"
                      y="1"
                      width="28"
                      height="28"
                    >
                      <path d="M15.0919 1.96866C15.4494 1.19379 16.5506 1.19379 16.9081 1.96866L20.2797 9.27846C20.4254 9.59426 20.7247 9.81171 21.0701 9.85266L29.064 10.8005C29.9114 10.9009 30.2517 11.9483 29.6252 12.5277L23.7151 17.9932C23.4597 18.2293 23.3454 18.5812 23.4132 18.9223L24.982 26.8178C25.1483 27.6548 24.2574 28.3021 23.5128 27.8853L16.4884 23.9534C16.185 23.7835 15.815 23.7835 15.5116 23.9534L8.48722 27.8853C7.74261 28.3021 6.85165 27.6548 7.01795 26.8178L8.5868 18.9223C8.65458 18.5812 8.54026 18.2293 8.28492 17.9932L2.3748 12.5277C1.7483 11.9483 2.08862 10.9009 2.93601 10.8005L10.9299 9.85266C11.2753 9.81171 11.5746 9.59426 11.7203 9.27846L15.0919 1.96866Z" fill="#D2D6DB" />
                    </mask>
                    <g mask="url(#mask0_81_4083)">
                      <path d="M16.38 0.690983C16.2791 0.507512 16.0002 0.579129 16.0002 0.788491V24.2452C16.0002 24.6303 16.2213 24.9812 16.5686 25.1473L24.9331 29.1487C25.6719 29.5021 26.499 28.8661 26.3473 28.0613L24.7718 19.703C24.7067 19.3575 24.8279 19.003 25.091 18.7697L31.6958 12.9115C32.3368 12.343 32.0127 11.2843 31.1633 11.172L21.8618 9.9422C21.5443 9.90023 21.2662 9.70877 21.1136 9.42723L16.38 0.690983Z" fill="#1B8354" />
                      <path d="M15.6638 0.690983C15.7459 0.522151 15.9998 0.580608 15.9998 0.768341V24.2793C15.9998 24.6465 15.7985 24.9842 15.4755 25.1589L8.32162 29.0275C7.58968 29.4233 6.72271 28.8042 6.85957 27.9834L8.24866 19.6527C8.3017 19.3346 8.19807 19.0104 7.97032 18.7821L2.06521 12.8614C1.48582 12.2805 1.81397 11.2875 2.62542 11.1662L10.7369 9.9538C11.065 9.90476 11.3475 9.69619 11.4909 9.39702L15.6638 0.690983Z" fill="#E5E7EB" />
                    </g>
                  </svg>

                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M15.0919 1.96866C15.4494 1.19379 16.5506 1.19379 16.9081 1.96866L20.2797 9.27846C20.4254 9.59426 20.7247 9.81171 21.0701 9.85266L29.064 10.8005C29.9114 10.9009 30.2517 11.9483 29.6252 12.5277L23.7151 17.9932C23.4597 18.2293 23.3454 18.5812 23.4132 18.9223L24.982 26.8178C25.1483 27.6548 24.2574 28.3021 23.5128 27.8853L16.4884 23.9534C16.185 23.7835 15.815 23.7835 15.5116 23.9534L8.48722 27.8853C7.74261 28.3021 6.85165 27.6548 7.01795 26.8178L8.5868 18.9223C8.65458 18.5812 8.54026 18.2293 8.28492 17.9932L2.3748 12.5277C1.7483 11.9483 2.08862 10.9009 2.93601 10.8005L10.9299 9.85266C11.2753 9.81171 11.5746 9.59426 11.7203 9.27846L15.0919 1.96866Z" fill="#E5E7EB" />
                  </svg>
                </div>
                <div className="Rating-Content-Left-Text-TAr">
                  تم تقييم هذه الخدمة بمتوسط
                  <span className="Rating-Content-Left-Digit-TAr">3.9</span>
                </div>
              </div>
              <div className="Rating-ActionsAr">
                <div className="Rate-TagAr">قيّم هذه الخدمة</div>
              </div>
            </div>
          </div>

          <div className="FeedbackAr">
            <div className="Feedback-SectionAr">
              <div className="Feedback-Section-ContentAr">
                <div className="Content-TextAr">هل كانت هذه الصفحة مفيدة؟</div>
                <div className="Content-ActionsAr">
                  <button className="choiceAr">نعم</button>
                  <button className="choiceAr">لا</button>
                </div>
              </div>
              <div className="Feedback-Section-TextAr">
                60% من المستخدمين قالوا نعم من 2843 تقييم
              </div>
            </div>
          </div>
        </div>

      </div>
      <Footer />
    </>

  );
};

export default ComplaintescalationrequestAr;