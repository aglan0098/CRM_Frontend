import React, { useEffect } from "react";
import "./MR_Graph.css";
import TotalCases from './TotalCases.png';
import Opened from './Opened.png';
import Closed from './Closed.png';
import Pendings from './Pendings.png';

const MR_Graph = () => {
  useEffect(() => {
    const statCards = document.querySelectorAll(".stat-card");
    const paginationBtns = document.querySelectorAll(".pagination-btn");

    // Stat card functionality - they'll still be clickable but no visual change
    const handleStatCardClick = function () {
      statCards.forEach((c) => c.classList.remove("active"));
      this.classList.add("active");
    };

    statCards.forEach((card) => {
      card.addEventListener("click", handleStatCardClick);
    });

    // Pagination functionality
    const handlePaginationClick = function () {
      if (this.textContent === "...") return;
      paginationBtns.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
    };

    paginationBtns.forEach((btn) => {
      btn.addEventListener("click", handlePaginationClick);
    });

    // Cleanup event listeners on component unmount
    return () => {
      statCards.forEach((card) => {
        card.removeEventListener("click", handleStatCardClick);
      });
      paginationBtns.forEach((btn) => {
        btn.removeEventListener("click", handlePaginationClick);
      });
    };
  }, []);

  return (
    <div className="main-content">
      <div className="main-card">
        <div className="welcome-section">
          <h2 className="welcome-title">Requests Overview</h2>
        </div>

        <div className="stats-grid">
          <div className="stat-card" data-filter="total">
            <div className="stat-label">
              <img
                src={TotalCases}
                alt="Total Cases"
                className="stat-icon"
              />
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
          <div className="stat-card" data-filter="pending">
            <div className="stat-label">
              <img
                src={Pendings}
                alt="Pending Actions"
                className="stat-icon"
              />
              <span className="stat-label-text">Pending Actions</span>
            </div>
            <div className="stat-number stat-number-text">2</div>
          </div>
        </div>
      </div>
      <div className="requests-section">
        <h3 className="section-title">All Requests</h3>
        <div className="search-filters">
          <input type="text" className="search-input" placeholder="Search..." />
          <select className="filter-select">
            <option>Status</option>
          </select>
          <select className="filter-select">
            <option>Request Type</option>
          </select>
        </div>
        <div className="table-container">
          <table className="requests-table">
            <thead>
              <tr>
                <th>Request Number</th>
                <th>Request Type</th>
                <th>Activity Type</th>
                <th>Status</th>
                <th>Submission Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <a href="#" className="case-number">
                    43218765
                  </a>
                </td>
                <td>Complaints Escalation</td>
                <td>-</td>
                <td>
                  <span className="status-badge status-action-required">
                    Action Required
                  </span>
                </td>
                <td>27-05-2025</td>
                <td>View Details &gt;</td>
              </tr>
              <tr>
                <td>
                  <a href="#" className="case-number">
                    43218765
                  </a>
                </td>
                <td>General Complaints</td>
                <td>Water Storage</td>
                <td>
                  <span className="status-badge status-action-required">
                    Action Required
                  </span>
                </td>
                <td>27-05-2025</td>
                <td>View Details &gt;</td>
              </tr>
              <tr>
                <td>
                  <a href="#" className="case-number">
                    43218765
                  </a>
                </td>
                <td>License Issuance</td>
                <td>Water Production</td>
                <td>
                  <span className="status-badge status-resolved">Resolved</span>
                </td>
                <td>27-05-2025</td>
                <td>View Details &gt;</td>
              </tr>
              <tr>
                <td>
                  <a href="#" className="case-number">
                    43218765
                  </a>
                </td>
                <td>License Issuance</td>
                <td>-</td>
                <td>
                  <span className="status-badge status-draft">Draft</span>
                </td>
                <td>27-05-2025</td>
                <td>Edit Application ✏️</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <span className="pagination-info">1-10 of 16</span>
          <div className="pagination-controls">
            <button className="pagination-btn active">1</button>
            <button className="pagination-btn">2</button>
            <button className="pagination-btn">3</button>
            <button className="pagination-btn">...</button>
            <button className="pagination-btn">999</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MR_Graph;
