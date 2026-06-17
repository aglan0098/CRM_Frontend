import React, { useState, useEffect } from 'react';
import './InquiryData.css'
import translate from './Translate.png'
import vector from './Vector.png'
import Moon from './Moon.png'
import Bell from './Bell.png'
import Search from './searchicon.png'
import InquiryPopup from './InquiryPopup/Popup';
import StatusBadge from './StatusBadge/StatusBadge';
import NotificationSystem from '../NotificationSystem/NotificationSystem'; // Import the notification component

const InquiryContent = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [uniqueTransformedStatuses, setUniqueTransformedStatuses] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);
  
  // Notification states
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  
  const itemsPerPage = 3;

  // Function to get transformed status (same logic as in StatusBadge)
  const getTransformedStatus = (stageName, status) => {
    if (stageName === "Request Submission") {
      return "Submitted";
    } else if (stageName === "Evaluation") {
      if (status === "Awaiting Beneficiary Response") {
        return "Action Required";
      } else {
        return "In Progress";
      }
    } else if (stageName === "Resolution") {
      return "Case Resolved";
    } else {
      return status; // Default to original status
    }
  };

  // Fetch inquiries from API
  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem('swa_user'));
      const { id } = userData.user;
      
      if (!id) {
        throw new Error('Contact ID not found in localStorage');
      }

      //const response = await fetch('http://localhost:5000/api/api/inquiries', {
      const response = await fetch('https://swacrmportal-dev-be.swa.gov.sa/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contactId: id,
          caseTypeId: "02b555e4-4018-f011-953d-84156ab50ded"
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        setInquiries(result.data);
        
        // Extract unique transformed statuses
        const transformedStatuses = result.data.map(inquiry => 
          getTransformedStatus(inquiry.stagename, inquiry.status)
        ).filter(Boolean);
        const uniqueTransformed = [...new Set(transformedStatuses)];
        
        setUniqueTransformedStatuses(uniqueTransformed.sort());
        setLastRefresh(new Date());
      } else {
        setInquiries([]);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchInquiries();
  }, []);

  // Manual refresh function
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchInquiries();
    setRefreshing(false);
  };

  // Handle notification count changes
  const handleNotificationCountChange = (count) => {
    setNotificationCount(count);
  };

  // Handle bell click to show/hide notifications
  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
  };

  // Handle notification panel close
  const handleNotificationClose = () => {
    setShowNotifications(false);
  };

  // Filter inquiries based on search and filters
  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = searchTerm === '' || 
      inquiry.inquiryNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by transformed status instead of original status
    const transformedStatus = getTransformedStatus(inquiry.stagename, inquiry.status);
    const matchesStatus = statusFilter === '' || transformedStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInquiries = filteredInquiries.slice(startIndex, endIndex);

  // Handle inquiry number click
  const handleInquiryClick = (inquiry) => {
    console.log(inquiry)
    setSelectedInquiry(inquiry);
    setIsPopupOpen(true);
  };

  // Handle popup close
  const handlePopupClose = () => {
    setIsPopupOpen(false);
    setSelectedInquiry(null);
  };

  // Pagination component
  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <a 
            key={i} 
            href="#" 
            className={currentPage === i ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage(i);
            }}
          >
            {i}
          </a>
        );
      }
    } else {
      // First page
      pages.push(
        <a 
          key={1} 
          href="#" 
          className={currentPage === 1 ? "active" : ""}
          onClick={(e) => {
            e.preventDefault();
            setCurrentPage(1);
          }}
        >
          1
        </a>
      );

      if (currentPage > 3) {
        pages.push(<span key="ellipsis1" className="ellipsis">...</span>);
      }

      // Middle pages
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(
            <a 
              key={i} 
              href="#" 
              className={currentPage === i ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(i);
              }}
            >
              {i}
            </a>
          );
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push(<span key="ellipsis2" className="ellipsis">...</span>);
      }

      // Last page
      if (totalPages > 1) {
        pages.push(
          <a 
            key={totalPages} 
            href="#" 
            className={currentPage === totalPages ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage(totalPages);
            }}
          >
            {totalPages}
          </a>
        );
      }
    }

    return pages;
  };

  return (
    <>
      <div className="inquiry-card-back">
        <img src={vector} alt="Vector" className="inquiry-vector-img" />
        <div className="inquiry-vernav">
          <img src={Moon} alt="Translate" className="inquiry-vernav-img" />
          <img src={translate} alt="Translate" className="inquiry-vernav-img" />
          
          {/* Bell icon with notification badge */}
          <div className="bell-container" onClick={handleBellClick}>
            <img src={Bell} alt="Bell" className="inquiry-vernav-img" style={{ cursor: 'pointer' }} />
            {notificationCount > 0 && (
              <span className={`notification-badge ${notificationCount > 9 ? 'large-count' : ''}`}>
                {notificationCount > 99 ? '99+' : notificationCount}
              </span>
            )}
          </div>
        </div> 
        <ol className="inquiry-breadcrumbs">
          <li className="inquiry-link-item">
            <a href="#" className="inquiry-text">E-Service</a>
          </li>
          <span className="inquiry-arrow">›</span>
          <li className="inquiry-link-item">
            <a href="#" className="inquiry-text">Inquires</a>
          </li>
        </ol>
        <h1 className="inquiry-service-title">Inquiries service</h1>
      </div>
      
      {/* Notification System */}
      <NotificationSystem
      isVisible={showNotifications}
      onClose={handleNotificationClose}
      onNotificationCountChange={handleNotificationCountChange}
      currentItems={inquiries}
      itemType="inquiry"
      />
      {/* Inline Notifications */}
      <NotificationSystem
        displayMode="inline"
        currentItems={inquiries}
        itemType="inquiry"
        onNotificationCountChange={() => {}} // Empty function since count is handled by the panel version
      />
      
      <div className="inquiry-table-data">
        <div className="inquiry-table-header">
          <div className="inquiry-headbut">
            <p className="inquiry-tablehead">Inquiries</p>
            {/* Refresh Button */}
            <button 
              className="inquiry-refresh-btn"
              onClick={handleRefresh}
              disabled={refreshing || loading}
              title="Refresh inquiries"
            >
                  <svg 
                  className={refreshing ? "inquiry-refresh-icon spinning" : "inquiry-refresh-icon"}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  >
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                    <path d="M21 3v5h-5" />
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                    <path d="M3 21v-5h5" />
                  </svg>
            </button>
          </div>
          <div className="inquiry-filter1-row">
            <div className="inquiry-search-menubar">
              <img src={Search} alt="Search Icon" className="inquiry-search-icon" />
              <input 
                type="text" 
                placeholder="Search" 
                className="inquiry-placeholdermenu"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="inquiry-status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Status</option>
              {uniqueTransformedStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <hr className="inquiry-line1"/>
          
          <div className="inquiry-table-container">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                Loading inquiries...
              </div>
            ) : error ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'black' }}>
                No inquiries Found aginst this contact
              </div>
            ) : (
              <table className="inquiry-data-table">
                <thead>
                  <tr>
                    <th>Inquiry Number</th>
                    <th>Inquiry Subject</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {currentInquiries.length > 0 ? (
                    currentInquiries.map((inquiry) => (
                      <tr key={inquiry.inquiryId}>
                        <td>
                          <a 
                            href="#" 
                            className="inquiry-number"
                            onClick={(e) => {
                              e.preventDefault();
                              handleInquiryClick(inquiry);
                            }}
                          >
                            {inquiry.inquiryNumber || 'Not assigned'}
                          </a>
                        </td>
                        <td>{inquiry.subject}</td>
                        <td>
                          <StatusBadge 
                            status={inquiry.status} 
                            statusCode={inquiry.statusCode}
                            stageName={inquiry.stagename}
                            size="default"
                          />
                        </td>
                        <td>
                          {inquiry.creationDate ? new Date(inquiry.creationDate).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>
                        No inquiries found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          <div className="inquiry-table-footer">
            <p className="inquiry-row-pages">
              {currentInquiries.length > 0 
                ? `${startIndex + 1}–${Math.min(endIndex, filteredInquiries.length)} of ${filteredInquiries.length}`
                : '0–0 of 0'
              }
            </p>
            <div className="inquiry-pagination">
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) setCurrentPage(currentPage - 1);
                }}
                style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
              >
                &lt;
              </a>
              {renderPagination()}
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                }}
                style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
              >
                &gt;
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Inquiry Details Popup */}
      <InquiryPopup
        inquiry={selectedInquiry}
        isOpen={isPopupOpen}
        onClose={handlePopupClose}
      />
      
      <button className="inquiry-help-btn">?</button>
    </>
  );
};

export default InquiryContent;