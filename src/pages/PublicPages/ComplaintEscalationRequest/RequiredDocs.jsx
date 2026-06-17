import React from 'react';

const ReqDocs = () => {
  return (
    <div className="mt-8">
      <div className="mb-8">
        <div className="flex items-center">
          <p className="text-base text-text-primary">1-</p>
          <p className="text-base text-text-primary ml-6">
            The complainant must be the consumer or owner.
          </p>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center">
          <p className="text-base text-text-primary">2-</p>
          <p className="text-base text-text-primary ml-6">
            There is a previous complaint with a reference number of the service provider.
          </p>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center">
          <p className="text-base text-text-primary">3-</p>
          <p className="text-base text-text-primary ml-6">
            An escalation period of 30 working days from the date of closure of the service provider's complaint.
          </p>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center">
          <p className="text-base text-text-primary">4-</p>
          <p className="text-base text-text-primary ml-6">
            The complaint shall be filed 30 working days after the service provider's failure to respond.
          </p>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center">
          <p className="text-base text-text-primary">5-</p>
          <p className="text-base text-text-primary ml-6">
            The complaint can be reopened within 3 days if it was closed without the complainant's satisfaction.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReqDocs;