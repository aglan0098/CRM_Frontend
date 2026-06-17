import React from 'react';

const Conditions = () => {
  return (
    <div className="mt-8">
      <div className="mb-8">
        <div className="flex items-center">
          <p className="text-base text-text-primary">1-</p>
          <p className="text-base text-text-primary ml-6">
            Services or topics for which inquiries can be addressed through the official Beneficiary Service account:
            Billing complaints
            Water shortage
            Tanker requests
            Water and sewage connection requests
            Licenses
          </p>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center">
          <p className="text-base text-text-primary">2-</p>
          <p className="text-base text-text-primary ml-6">
            The official Beneficiary Service account typically responds to inquiries within 3 hours, accounting for weekends, official holidays, and times outside of regular working hours on working days.
          </p>
        </div>
      </div>
      
      
      <div className="mb-8">
        <div className="flex items-center">
          <p className="text-base text-text-primary">4-</p>
          <p className="text-base text-text-primary ml-6">
            The consumer has the right to escalate a complaint to the Authority if 30 working days have passed since the complaint was escalated with the service provider and no response has been received.
          </p>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center">
          <p className="text-base text-text-primary">5-</p>
          <p className="text-base text-text-primary ml-6">
            The consumer also has the right to escalate the complaint to the Authority within 30 working days of the complaint being closed by the service provider.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Conditions;