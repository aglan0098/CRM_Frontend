import React, { useState } from 'react';
import './Accsel.css';
import person from './person-icon.png'
import business from './business-icon.png'
import arrow from './arrow-icon.png'
import { useNavigate } from 'react-router-dom';

const AccountSelectionEnglish = ({ language = 'en', onLanguageChange }) => {
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
    <div className="blur-container">
      <p className="main-title">Welcome to Saudi Water Authority</p>
      <p className="desctext">
        SWA is Saudi Arabia's regulatory authority for water systems, ensuring sustainable management, 
        service excellence, and sector innovation.
      </p>
      
      <div className="cards-container">
        <div className="service-card" onClick={selectIndividuals}>
          <div className="card-content">
            <div className="card-icon">
              <img src={person} alt="Person Icon" />
            </div>
            <h3 className="card-title">SWA Individuals</h3>
            <p className="card-description">E-Services for citizens, and residents.</p>
          </div>
          <button className="card-arrow">
            <img src={arrow} alt="Arrow" />
          </button>
        </div>
        
        <div className="service-card" onClick={selectBusiness}>
          <div className="card-content">
            <div className="card-icon">
              <img src={business} alt="Business Icon" />
            </div>
            <h3 className="card-title">SWA Business</h3>
            <p className="card-description">E-Services for establishments and business.</p>
          </div>
          <button className="card-arrow">
            <img src={arrow} alt="Arrow" />
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Under Development</h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <p>This feature is currently under development. Please check back later.</p>
            </div>
          </div>
        </div>
      )}

      {/* Debug info - remove in production */}
      {/* <div style={{ 
        position: 'absolute', 
        bottom: '10px', 
        left: '10px', 
        color: 'white', 
        fontSize: '12px',
        background: 'rgba(0,0,0,0.5)',
        padding: '5px',
        borderRadius: '3px'
      }}>
        Current Language: {language}
      </div> */}
    </div>
  );
};

export default AccountSelectionEnglish;