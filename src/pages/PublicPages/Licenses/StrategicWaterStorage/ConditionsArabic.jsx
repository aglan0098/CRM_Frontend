import React from 'react';

const ConditionsArabic = () => {
  return (
    <div className="mt-8" dir="rtl">
      <div className="mb-8">
        <div className="flex items-center">
          <p className="text-base text-text-primary">1-</p>
          <p className="text-base text-text-primary mr-6">
            الخدمات أو المواضيع التي يمكن معالجة الاستفسارات حولها من خلال حساب خدمة المستفيدين الرسمي:
            شكاوى الفواتير
            نقص المياه
            طلبات الصهاريج
            طلبات توصيل المياه والصرف الصحي
            التراخيص
          </p>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center">
          <p className="text-base text-text-primary">2-</p>
          <p className="text-base text-text-primary mr-6">
            يستجيب حساب خدمة المستفيدين الرسمي عادة للاستفسارات خلال 3 ساعات، مع مراعاة عطل نهاية الأسبوع والعطل الرسمية والأوقات خارج ساعات العمل العادية في أيام العمل.
          </p>
        </div>
      </div>
      
      
      <div className="mb-8">
        <div className="flex items-center">
          <p className="text-base text-text-primary">4-</p>
          <p className="text-base text-text-primary mr-6">
            يحق للمستهلك تصعيد الشكوى إلى الهيئة إذا مرت 30 يوم عمل منذ تصعيد الشكوى مع مقدم الخدمة ولم يتم تلقي رد.
          </p>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center">
          <p className="text-base text-text-primary">5-</p>
          <p className="text-base text-text-primary mr-6">
            كما يحق للمستهلك تصعيد الشكوى إلى الهيئة خلال 30 يوم عمل من إغلاق الشكوى من قبل مقدم الخدمة.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConditionsArabic;