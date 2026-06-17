import React from 'react';
import './NoComplaintsModal.css';

const NoComplaintsModal = ({ isVisible, onClose, onEscalate }) => {
  if (!isVisible) return null;

  return (
    <div className="no-complaints-modal-overlay" onClick={onClose}>
      <div className="no-complaints-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Section 1: Warning Icon, Close Button, and Title */}
        <div className="no-complaints-modal-section-1">
          {/* Sub-section 1: Warning Icon and Close Button */}
          <div className="no-complaints-modal-section-1-sub1">
            {/* Warning Icon */}
            <div className="no-complaints-modal-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="24" viewBox="0 0 26 24" fill="none">
                <path d="M10.6304 0.309082C11.8722 -0.103123 13.2108 -0.103086 14.4526 0.309082C15.6894 0.7196 16.6607 1.69307 17.6362 3.06104C18.6085 4.42446 19.683 6.3254 21.0679 8.77588L21.1216 8.87256C22.5067 11.3234 23.581 13.2245 24.2505 14.7661C24.9231 16.315 25.2589 17.6522 24.9917 18.937C24.7225 20.2308 24.058 21.4072 23.0913 22.2964C22.127 23.1834 20.8139 23.5581 19.1606 23.7378C17.5168 23.9165 15.3666 23.9165 12.5991 23.9165H12.4849C9.71708 23.9165 7.56631 23.9165 5.92236 23.7378C4.26916 23.558 2.95597 23.1834 1.9917 22.2964C1.02517 21.4072 0.361439 20.2306 0.0922852 18.937C-0.174951 17.6523 0.159936 16.3149 0.83252 14.7661C1.50199 13.2246 2.57643 11.3233 3.96143 8.87256L4.01611 8.77588C5.40095 6.32543 6.47548 4.42444 7.44775 3.06104C8.42313 1.69329 9.39389 0.719682 10.6304 0.309082ZM13.9019 1.97021C13.0179 1.67681 12.0661 1.67681 11.1821 1.97021C10.4869 2.20103 9.78784 2.79325 8.87256 4.07666C7.96026 5.35596 6.93004 7.17625 5.51221 9.68506C4.09452 12.1936 3.06653 14.0152 2.43799 15.4624C1.80844 16.912 1.65025 17.8355 1.80518 18.5806C2.00067 19.5202 2.48214 20.3696 3.17627 21.0083C3.72161 21.5099 4.57182 21.8301 6.11182 21.9976C7.64991 22.1648 9.70505 22.1665 12.5415 22.1665C15.3781 22.1665 17.434 22.1648 18.9722 21.9976C20.512 21.8301 21.3614 21.5099 21.9067 21.0083C22.6011 20.3696 23.0823 19.5204 23.2778 18.5806C23.4328 17.8355 23.2756 16.9121 22.646 15.4624C22.0175 14.0152 20.9895 12.1937 19.5718 9.68506C18.1539 7.17619 17.1237 5.35598 16.2114 4.07666C15.2962 2.79331 14.597 2.20109 13.9019 1.97021ZM12.5435 15.4585C13.1876 15.4586 13.7093 15.9804 13.7095 16.6245C13.7095 17.2688 13.1877 17.7914 12.5435 17.7915H12.5327C11.8884 17.7915 11.3657 17.2688 11.3657 16.6245C11.3659 15.9803 11.8885 15.4585 12.5327 15.4585H12.5435ZM12.5415 7.5835C13.0248 7.5835 13.4165 7.97525 13.4165 8.4585V13.1245C13.4165 13.6078 13.0248 13.9995 12.5415 13.9995C12.0584 13.9993 11.6665 13.6076 11.6665 13.1245V8.4585C11.6665 7.97536 12.0584 7.58368 12.5415 7.5835Z" fill="#B54708"/>
              </svg>
            </div>

            {/* Close button */}
            <button 
              className="no-complaints-modal-close"
              onClick={onClose}
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M0.183059 0.183058C0.427136 -0.0610194 0.822864 -0.0610194 1.06694 0.183058L5.625 4.74112L10.1831 0.183059C10.4271 -0.0610191 10.8229 -0.0610191 11.0669 0.183059C11.311 0.427136 11.311 0.822864 11.0669 1.06694L6.50888 5.625L11.0669 10.1831C11.311 10.4271 11.311 10.8229 11.0669 11.0669C10.8229 11.311 10.4271 11.311 10.1831 11.0669L5.625 6.50888L1.06694 11.0669C0.822864 11.311 0.427136 11.311 0.183058 11.0669C-0.0610194 10.8229 -0.0610194 10.4271 0.183058 10.1831L4.74112 5.625L0.183059 1.06694C-0.0610191 0.822864 -0.0610191 0.427136 0.183059 0.183058Z" fill="#161616"/>
              </svg>
            </button>
          </div>

          {/* Sub-section 2: Title */}
          <div className="no-complaints-modal-section-1-sub2">
            <h2 className="no-complaints-modal-title">No Complaints Found</h2>
          </div>
        </div>

        {/* Section 2: Body text */}
        <div className="no-complaints-modal-section-2">
          <p className="no-complaints-modal-text">
            You currently don't have any registered complaints for this user.
          </p>
        </div>

        {/* Section 3: Action buttons */}
        <div className="no-complaints-modal-section-3">
          <button 
            className="no-complaints-modal-button no-complaints-modal-button-secondary"
            onClick={onEscalate}
          >
            Escalate a Complaint
          </button>
          <button 
            className="no-complaints-modal-button no-complaints-modal-button-primary"
            onClick={onClose}
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoComplaintsModal;

