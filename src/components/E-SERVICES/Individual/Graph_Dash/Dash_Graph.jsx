import React, { useEffect } from 'react';
import './Dash_Graph.css';
import TotalCases from './TotalCases.png';
import Opened from './Opened.png';
import Closed from './Closed.png';
import Pendings from './Pendings.png';
import Closer from './Closer.png';
import Exclamation from './Exclamation.png';

const Dash_Graph = () => {
  useEffect(() => {
    const statCards = document.querySelectorAll(".stat-card");

    const handleCardClick = function() {
      // Remove active class from all cards
      statCards.forEach((c) => c.classList.remove("active"));

      // Add active class to clicked card
      this.classList.add("active");
    };

    statCards.forEach((card) => {
      card.addEventListener("click", handleCardClick);
    });

    // Cleanup event listeners on component unmount
    return () => {
      statCards.forEach((card) => {
        card.removeEventListener("click", handleCardClick);
      });
    };
  }, []);

  return (
    <>
      <div className="tip-banner">
        <div className="tip-text">
          <strong>Tip:</strong> Report leaks promptly—a dripping tap wastes 6,000+ liters/year
        </div>
        <button className="request-workshop-btn">
          <span className="request-workshop-text">Request Workshop</span>
        </button>
      </div>

      <div className="main-content">
        <div className="main-card">
          <div className="welcome-section">
            <h2 className="welcome-title">Hi Read!</h2>
            <p className="welcome-text">
              Saudi Water Authority Portal a seamless gateway for managing water
              services, offering secure and efficient digital solutions.
            </p>
          </div>

          <div className="stats-grid">
            <div className="stat-card" data-filter="total">
              <div className="stat-label">
                <img src={TotalCases} alt="Total Cases" className="stat-icon" />
                <span className="stat-label-text">Total Cases</span>
              </div>
              <div className="stat-number stat-number-text">12</div>
            </div>
            <div className="stat-card" data-filter="open">
              <div className="stat-label">
                <img src={Opened} alt="Open" className="stat-icon" />
                <span className="stat-label-text">Open</span>
              </div>
              <div className="stat-number stat-number-text">5</div>
            </div>
            <div className="stat-card" data-filter="closed">
              <div className="stat-label">
                <img src={Closed} alt="Closed" className="stat-icon" />
                <span className="stat-label-text">Closed</span>
              </div>
              <div className="stat-number stat-number-text">5</div>
            </div>
            <div className="stat-card pending" data-filter="pending">
              <div className="stat-label">
                <img src={Pendings} alt="Pending Actions" className="stat-icon" />
                <span className="stat-label-text">Pending Actions</span>
              </div>
              <div className="stat-number stat-number-text">2</div>
            </div>
          </div>

          <div className="actions-section">
            <h3 className="section-title">Actions Required</h3>
            <div className="action-item">
              <img
                className="action-icon action-icon-shade"
                src={Exclamation}
                alt="More info needed"
              />
              <div className="action-text">
                <strong>More info needed:</strong><br />
                Please complete the required details in
                <strong> Complaint Escalation Case</strong> to process your
                request.
              </div>
              <button className="close-btn">
                <img src={Closer} alt="Close" className="close-icon" />
              </button>
            </div>
          </div>

          <div className="requests-section">
            <h3 className="section-title">Latest Requests</h3>
            <div className="search-filters">
              <input type="text" className="search-input" placeholder="Search..." />
              <select className="filter-select">
                <option>Status</option>
              </select>
              <select className="filter-select">
                <option>Service Type</option>
              </select>
            </div>
            <div className="table-wrapper">
              <table className="requests-table">
                <thead>
                  <tr>
                    <th>Request Number</th>
                    <th>Service Type</th>
                    <th>Activity Type</th>
                    <th>Status</th>
                    <th>Submission Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><a href="#" className="case-number">43218765</a></td>
                    <td>Complaints Escalation</td>
                    <td>-</td>
                    <td>
                      <span className="status-badge status-action-required"
                        >Action Required</span
                      >
                    </td>
                    <td>27-05-2025</td>
                    <td>View Details &gt;</td>
                  </tr>
                  <tr>
                    <td><a href="#" className="case-number">43218765</a></td>
                    <td>General Complaints</td>
                    <td>Water Storage</td>
                    <td>
                      <span className="status-badge status-action-required"
                        >Action Required</span
                      >
                    </td>
                    <td>27-05-2025</td>
                    <td>View Details &gt;</td>
                  </tr>
                  <tr>
                    <td><a href="#" className="case-number">43218765</a></td>
                    <td>License Issuance</td>
                    <td>Water Production</td>
                    <td>
                      <span className="status-badge status-resolved">Resolved</span>
                    </td>
                    <td>27-05-2025</td>
                    <td>View Details &gt;</td>
                  </tr>
                  <tr>
                    <td><a href="#" className="case-number">43218765</a></td>
                    <td>License Issuance</td>
                    <td>-</td>
                    <td><span className="status-badge status-draft">Draft</span></td>
                    <td>27-05-2025</td>
                    <td>Edit Application ✏️</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dash_Graph;