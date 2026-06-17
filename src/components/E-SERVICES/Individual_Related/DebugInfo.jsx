// DebugInfo.jsx - Temporary component to help debug the state
import React from 'react';

const DebugInfo = ({ activeMenuItem, complaintData }) => {
  // Only show in development - you can remove this component later
  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <div><strong>Active Menu:</strong> {activeMenuItem}</div>
      <div><strong>Complaint Data:</strong> {complaintData ? 'Present' : 'None'}</div>
      {complaintData && (
        <div><strong>Complaint ID:</strong> {complaintData.complaintNumber}</div>
      )}
    </div>
  );
};

export default DebugInfo;
