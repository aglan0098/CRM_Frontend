import React from 'react';
import './MyDoc.css';

const MyDoc = () => {
  return (
    <div className="main-content">
      <div className="requests-section">
        <h3 className="section-title">My Documents</h3>
        <div className="search-filters">
          <input type="text" className="search-input" placeholder="Search..." />
          <select className="filter-select">
            <option>Status</option>
          </select>
        </div>
        <div className="table-container">
          <table className="requests-table">
            <thead>
              <tr>
                <th>License ID</th>
                <th>Activity Name</th>
                <th>Issue Date</th>
                <th>Expiration Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><a href="#" className="case-number">43218765</a></td>
                <td className="activity-name">
                  Non-Networked Water Services License Request (Tanker)
                </td>
                <td>27-05-2025</td>
                <td>27-05-2025</td>
                <td>
                  <span className="status-badge status-active">Active</span>
                </td>
                <td>
                  <div className="actions-cell">
                    <svg
                      className="action-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    <svg
                      className="action-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7,10 12,15 17,10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    <span className="action-text">View Details</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyDoc;