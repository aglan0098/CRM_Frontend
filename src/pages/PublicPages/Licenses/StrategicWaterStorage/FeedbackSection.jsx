import React, { useState } from 'react';
import Card from './Card';
// import Button from '../ComplaintEscalation/ui/Button';
import Button from '../../ComplaintEscalation/ui/Button';
import Circle from './public/images/img_checkmarkcircle02.svg';

const FeedbackSection = () => {
  const [feedback, setFeedback] = useState(null);

  const handleFeedback = (isUseful) => {
    setFeedback(isUseful);
    console.log(`User found the page ${isUseful ? 'useful' : 'not useful'}`);
  };

  return (
    <div>
      {/* Contact Card Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-20 mb-16">
        <Card
          icon={Circle}
          title="Comments & suggestions"
          description="For any inquiry or feedback on Government Services, please fill the required information."
          buttonText="Contact us"
          onClick={() => (window.location.href = '/contact')}
        />
      </div>

      {/* Feedback Buttons */}
      <div className="border-t border-primary-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-20 py-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-y-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <p className="text-base text-text-primary">Was this page useful?</p>
            <Button
              variant="primary"
              size="small"
              className="min-w-[60px]"
              onClick={() => handleFeedback(true)}
            >
              Yes
            </Button>
            <Button
              variant="primary"
              size="small"
              className="min-w-[60px]"
              onClick={() => handleFeedback(false)}
            >
              No
            </Button>
          </div>
          <p className="text-sm text-text-primary mt-2 md:mt-0">
            60% of users said Yes from 2,843 Feedbacks
          </p>
        </div>
      </div>

      {/* Last Modified Info */}
      <div className="text-center py-4 bg-white border-t border-gray-200">
        <p className="text-sm text-text-primary">
          Last Modified Date: 04/12/2020 - 4:13 PM Saudi Arabia Time
        </p>
      </div>
    </div>
  );
};

export default FeedbackSection;
