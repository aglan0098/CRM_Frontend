import React from 'react';

const StepsSection = () => {
  return (
    <div className="mt-8">
      <div className="mb-8">
        <div className="flex items-center">
          <p className="text-base text-text-primary">1-</p>
          <p className="text-base text-text-primary ml-6">
            Complete the organizational Support Request Form.
          </p>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center">
          <p className="text-base text-text-primary">2-</p>
          <p className="text-base text-text-primary ml-6">
            Specify the type of support required.
          </p>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center">
          <p className="text-base text-text-primary">3-</p>
          <p className="text-base text-text-primary ml-6">
            Provide a precise and detailed description of the request.
          </p>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center">
          <p className="text-base text-text-primary">4-</p>
          <p className="text-base text-text-primary ml-6">
            Attach any related files or images (if applicable).
          </p>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center">
          <p className="text-base text-text-primary">5-</p>
          <p className="text-base text-text-primary ml-6">
            Attach official documentation proving the requester's authority to represent the concerned entity (e.g., employee ID, official letter).
          </p>
        </div>
      </div>

    </div>
  );
};

export default StepsSection;