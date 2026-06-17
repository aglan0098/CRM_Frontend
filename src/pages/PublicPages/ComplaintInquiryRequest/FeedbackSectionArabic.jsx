import React, { useState } from 'react';
import Card from './Card';
import Button from '../ComplaintEscalation/ui/Button';
import Circle from './public/images/img_checkmarkcircle02.svg'

const FeedbackSectionArabic = () => {
  const [feedback, setFeedback] = useState(null);
  
  const handleFeedback = (isUseful) => {
    setFeedback(isUseful);
    // Here you would typically send this feedback to a server
    console.log(`User found the page ${isUseful ? 'useful' : 'not useful'}`);
  };
  
  return (
    <div dir="rtl">
      <div className="container mx-auto px-20 mb-16">
        <Card
          icon={Circle} title="التعليقات والاقتراحات" description="لأي استفسار أو تعليق على الخدمات الحكومية، يرجى تعبئة المعلومات المطلوبة." buttonText="اتصل بنا"
          onClick={() => window.location.href = '/contact'}
        />
      </div>
      
      <div className="border-t border-primary-background">
        <div className="container mx-auto px-20 py-8 flex justify-between items-center">
          <div className="flex items-center">
            <p className="text-base text-text-primary ml-4">هل كانت هذه الصفحة مفيدة؟</p>
            <Button 
              variant="primary" size="small" className="ml-4"
              onClick={() => handleFeedback(true)}
            >
              نعم
            </Button>
            <Button 
              variant="primary" size="small"
              onClick={() => handleFeedback(false)}
            >
              لا
            </Button>
          </div>
          <p className="text-sm text-text-primary">60% من المستخدمين قالوا نعم من 2843 تقييماً</p>
        </div>
      </div>
      
      <div className="text-center py-4 bg-white border-t border-gray-200">
        <p className="text-sm text-text-primary">
          تاريخ آخر تعديل: 04/12/2020 - 4:13 م بتوقيت المملكة العربية السعودية
        </p>
      </div>
    </div>
  );
};

export default FeedbackSectionArabic;