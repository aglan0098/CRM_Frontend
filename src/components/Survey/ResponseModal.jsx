import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Check } from 'lucide-react';
import cross from './cross.png';
import tick from './tick.png';
import './ResponseModal.css'

export default function ResponseModal({ onClose }) {
  const navigate = useNavigate();

  const handleClose = () => {
    onClose(); // Call the original onClose function
    navigate('/'); // Navigate to home page
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="modal-box">
        <div className="inner-1">
          <div className="inner-1-left">
            <img src={tick} alt="tick" className="tick-button" />
          </div>
          <div className="inner-1-right">
            <button
             onClick={handleClose}
            //  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <img src={cross} alt="cross" className="cross-button" />
            </button>
          </div>
        </div>

        <div className="inner-2">
          <h2 className="inner-2-upper">
            Thank You!
          </h2>
          <p className="inner-2-lower">
            We sincerely appreciate your feedback! Your input helps us improve our services to better meet your needs.
          </p>
        </div>

        <div className="inner-3">
          <div className="inner-3-entity">
          <button
            onClick={handleClose}
            className="close-button"
          >
            Close
          </button>
          </div>
        </div>
      </div>
      </div>
  );
}