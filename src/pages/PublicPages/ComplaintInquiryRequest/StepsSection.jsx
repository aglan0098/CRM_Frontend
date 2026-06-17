import React from 'react';

const StepsSection = () => {
  return (
    <div className="mt-8">
      <div className="mb-8">
        <div className="flex items-center">
          <p className="text-base text-text-primary">1-</p>
          <p className="text-base text-text-primary ml-6">
            The complaint number must be provided by the user.
          </p>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center">
          <p className="text-base text-text-primary">2-</p>
          <p className="text-base text-text-primary ml-6">
            The ID or residency number of the complainant must be provided.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StepsSection;