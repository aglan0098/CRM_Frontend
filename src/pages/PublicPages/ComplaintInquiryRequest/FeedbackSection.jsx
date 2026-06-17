import React, { useState } from 'react';
import Card from './Card';
import Button from '../ComplaintEscalation/ui/Button';
import Circle from './public/images/img_checkmarkcircle02.svg'

const FeedbackSection = () => {
  const [feedback, setFeedback] = useState(null);
  
  const handleFeedback = (isUseful) => {
    setFeedback(isUseful);
    // Here you would typically send this feedback to a server
    console.log(`User found the page ${isUseful ? 'useful' : 'not useful'}`);
  };
  
  return (
    <div>
      <div className="container mx-auto px-20 mb-16">
        <Card
          icon={Circle} title="Comments & suggestions" description="For any inquiry or feedback on Government Services, please fill the required information." buttonText="Contact us"
          onClick={() => window.location.href = '/contact'}
        />
      </div>
      
      <div className="border-t border-primary-background">
        <div className="container mx-auto px-20 py-8 flex justify-between items-center">
          <div className="flex items-center">
            <p className="text-base text-text-primary mr-4">Was this page useful?</p>
            <Button 
              variant="primary" size="small" className="mr-4"
              onClick={() => handleFeedback(true)}
            >
              Yes
            </Button>
            <Button 
              variant="primary" size="small"
              onClick={() => handleFeedback(false)}
            >
              No
            </Button>
          </div>
          <p className="text-sm text-text-primary">60% of users said Yes from 2843 Feedbacks</p>
        </div>
      </div>
      
      <div className="text-center py-4 bg-white border-t border-gray-200">
        <p className="text-sm text-text-primary">
          Last Modified Date: 04/12/2020 - 4:13 PM Saudi Arabia Time
        </p>
      </div>
    </div>
  );
};

export default FeedbackSection;