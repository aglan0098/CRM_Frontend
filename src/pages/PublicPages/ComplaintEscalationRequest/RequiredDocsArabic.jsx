import React from 'react';

const ReqDocsArabic = () => {
  return (
    <div className="mt-8" dir="rtl">
      <div className="mb-8">
        <div className="flex items-center">
          <p className="text-base text-text-primary">1-</p>
          <p className="text-base text-text-primary mr-6">
            يجب أن يكون مقدم الشكوى هو المستهلك أو المالك.
          </p>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center">
          <p className="text-base text-text-primary">2-</p>
          <p className="text-base text-text-primary mr-6">
            وجود شكوى سابقة لدى مقدم الخدمة برقم مرجعي.
          </p>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center">
          <p className="text-base text-text-primary">3-</p>
          <p className="text-base text-text-primary mr-6">
            فترة تصعيد 30 يوم عمل من تاريخ إغلاق شكوى مقدم الخدمة.
          </p>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center">
          <p className="text-base text-text-primary">4-</p>
          <p className="text-base text-text-primary mr-6">
            يجب تقديم الشكوى خلال 30 يوم عمل من عدم رد مقدم الخدمة.
          </p>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center">
          <p className="text-base text-text-primary">5-</p>
          <p className="text-base text-text-primary mr-6">
            يمكن إعادة فتح الشكوى خلال 3 أيام إذا تم إغلاقها دون رضا مقدم الشكوى.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReqDocsArabic;