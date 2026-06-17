import React from 'react';

const StepsSectionArabic = () => {
  return (
    <div className="mt-8" dir="rtl">
      <div className="mb-8">
        <div className="flex items-center">
          <p className="text-base text-text-primary">1-</p>
          <p className="text-base text-text-primary mr-6">
            يجب على المستخدم تقديم رقم الشكوى.
          </p>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center">
          <p className="text-base text-text-primary">2-</p>
          <p className="text-base text-text-primary mr-6">
            يجب تقديم رقم الهوية أو الإقامة الخاص بمقدم الشكوى.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StepsSectionArabic;