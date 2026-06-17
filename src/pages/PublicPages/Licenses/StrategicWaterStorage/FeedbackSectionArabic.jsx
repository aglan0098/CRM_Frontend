import React, { useState } from 'react';
import Card from './Card';
// import Button from '../ComplaintEscalation/ui/Button';
import Button from '../../ComplaintEscalation/ui/Button';
import Circle from './public/images/img_checkmarkcircle02.svg';

const FeedbackSectionArabic = () => {
  const [feedback, setFeedback] = useState(null);

  const handleFeedback = (isUseful) => {
    setFeedback(isUseful);
    console.log(`User found the page ${isUseful ? 'useful' : 'not useful'}`);
  };

  return (
    <div dir="rtl">
      {/* Contact Card Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-20 mb-16">
        <Card
          icon={Circle}
          title="التعليقات والاقتراحات"
          description="لأي استفسار أو ملاحظات حول الخدمات الحكومية، يرجى ملء المعلومات المطلوبة."
          buttonText="تواصل معنا"
          onClick={() => (window.location.href = '/contact')}
        />
      </div>

      {/* Feedback Buttons */}
      <div className="border-t border-primary-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-20 py-8 flex flex-col md:flex-row-reverse justify-between items-start md:items-center gap-y-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3 justify-end">
            <p className="text-base text-text-primary">هل كانت هذه الصفحة مفيدة؟</p>
            <Button
              variant="primary"
              size="small"
              className="min-w-[60px]"
              onClick={() => handleFeedback(true)}
            >
              نعم
            </Button>
            <Button
              variant="primary"
              size="small"
              className="min-w-[60px]"
              onClick={() => handleFeedback(false)}
            >
              لا
            </Button>
          </div>
          <p className="text-sm text-text-primary mt-2 md:mt-0 text-right">
            ٦٠٪ من المستخدمين قالوا نعم من ٢٬٨٤٣ تقييم
          </p>
        </div>
      </div>

      {/* Last Modified Info */}
      <div className="text-center py-4 bg-white border-t border-gray-200">
        <p className="text-sm text-text-primary">
          تاريخ آخر تعديل: ٠٤/١٢/٢٠٢٠ - ٤:١٣ مساءً بتوقيت المملكة العربية السعودية
        </p>
      </div>
    </div>
  );
};

export default FeedbackSectionArabic;