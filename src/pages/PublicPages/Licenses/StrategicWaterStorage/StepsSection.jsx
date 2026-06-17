import React from 'react';

const StepsSection = () => {
  return (
    <div className="mt-8">
      <div className="mb-8">
        <div className="flex items-center">
          <p className="text-base text-text-primary">1-</p>
          <p className="text-base text-text-primary ml-6">
            Click on “Start Service.”
          </p>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center">
          <p className="text-base text-text-primary">2-</p>
          <p className="text-base text-text-primary ml-6">
            Log in through the National Single Sign-On (Nafath)
          </p>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center">
          <p className="text-base text-text-primary">3-</p>
          <p className="text-base text-text-primary ml-6">
            Fill in the asset data related to the activity (if any).
          </p>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center">
          <p className="text-base text-text-primary">4-</p>
          <p className="text-base text-text-primary ml-6">
            Ensure that all conditions and requirements are met.
          </p>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center">
          <p className="text-base text-text-primary">5-</p>
          <p className="text-base text-text-primary ml-6">
            Submit the application and attach the required files.
          </p>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center">
          <p className="text-base text-text-primary">6-</p>
          <p className="text-base text-text-primary ml-6">
            Pay the fees (if any).
          </p>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center">
          <p className="text-base text-text-primary">7-</p>
          <p className="text-base text-text-primary ml-6">
            Share your feedback about the service (optional).
          </p>
        </div>
      </div>

    </div>
  );
};

export default StepsSection;