import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Check } from 'lucide-react';
import cross from './cross.png';
import tick from './tick.png';
import './ResponseModalArabic.css'

export default function ResponseModalArabic({ onClose }) {
  const navigate = useNavigate();

  const handleClose = () => {
    onClose(); // Call the original onClose function
    navigate('/'); // Navigate to home page
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="modal-box-arabic">
        <div className="inner-1-arabic">
          <div className="inner-1-left-arabic">
            <img src={tick} alt="علامة صحيحة" className="tick-button-arabic" />
          </div>
          <div className="inner-1-right-arabic">
            <button
             onClick={handleClose}
             className="cross-button-arabic"
            >
              <img src={cross} alt="إغلاق" className="cross-button-arabic" />
            </button>
          </div>
        </div>

        <div className="inner-2-arabic">
          <h2 className="inner-2-upper-arabic">
            شكراً لك!
          </h2>
          <p className="inner-2-lower-arabic">
            نحن نقدر ملاحظاتك بصدق! مساهمتك تساعدنا في تحسين خدماتنا لتلبية احتياجاتك بشكل أفضل.
          </p>
        </div>

        <div className="inner-3-arabic">
          <div className="inner-3-entity-arabic">
          <button
            onClick={handleClose}
            className="close-button-arabic"
          >
            إغلاق
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}