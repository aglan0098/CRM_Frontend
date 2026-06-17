import React from 'react';

const ReqDocs = () => {
  return (
    <div className="mt-8">
      <div className="mb-8">
        <div className="flex items-center">
          <p className="text-base text-text-primary">1-</p>
          <p className="text-base text-text-primary ml-6">
            Full completion of the request form.
          </p>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center">
          <p className="text-base text-text-primary">2-</p>
          <p className="text-base text-text-primary ml-6">
            Attachment of official documentation proving the requester's authority to represent the concerned entity (e.g., employee ID, official letter...).
          </p>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center">
          <p className="text-base text-text-primary">3-</p>
          <p className="text-base text-text-primary ml-6">
            Attachment of any related files or images (if applicable).
          </p>
        </div>
      </div>
      
    </div>
  );
};

export default ReqDocs;