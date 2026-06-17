import React, { useState } from 'react';
import './AccselArabic.css';
import person from './person-icon.png';
import business from './business-icon.png';
import arrow from './arrow-icon.png';
import { useNavigate } from 'react-router-dom';

const AccountSelectionArabic = ({ language = 'ar', onLanguageChange }) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const selectIndividuals = () => {
    console.log('Individuals selected');
    console.log('Current language from props:', language);
    localStorage.removeItem('nafathOtpData');
    navigate('/');
  };

  const selectBusiness = () => {
    console.log('Business selected');
    console.log('Current language from props:', language);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="blur-container" dir="rtl">
      <p className="main-title">مرحباً بكم في هيئة المياه السعودية</p>
      <p className="desctext">
        هيئة المياه السعودية هي السلطة التنظيمية لأنظمة المياه في المملكة العربية السعودية، وتضمن
        الإدارة المستدامة وتميز الخدمات والابتكار في القطاع.
      </p>

      <div className="cards-container">
        <div className="service-card" onClick={selectIndividuals}>
          <div className="card-content">
            <div className="card-icon">
              <img src={person} alt="أيقونة شخص" />
            </div>
            <h3 className="card-title">الأفراد</h3>
            <p className="card-description">الخدمات الإلكترونية للمواطنين والمقيمين.</p>
          </div>
          <button className="card-arrowAr">
            <img src={arrow} alt="سهم" />
          </button>
        </div>

        <div className="service-card" onClick={selectBusiness}>
          <div className="card-content">
            <div className="card-icon">
              <img src={business} alt="أيقونة أعمال" />
            </div>
            <h3 className="card-title">هيئة المياه للأعمال</h3>
            <p className="card-description">الخدمات الإلكترونية للمؤسسات والشركات.</p>
          </div>
          <button className="card-arrowAr">
            <img src={arrow} alt="سهم" />
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>قيد التطوير</h3>
              <button className="modal-close" onClick={closeModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>هذه الميزة قيد التطوير حالياً. يرجى المراجعة لاحقاً.</p>
            </div>
          </div>
        </div>
      )}

      {/* Debug info - remove in production */}
      {/* <div style={{ 
        position: 'absolute', 
        bottom: '10px', 
        right: '10px', 
        color: 'white', 
        fontSize: '12px',
        background: 'rgba(0,0,0,0.5)',
        padding: '5px',
        borderRadius: '3px'
      }}>
        اللغة الحالية: {language}
      </div> */}
    </div>
  );
};

export default AccountSelectionArabic;