import React from 'react';

const ReqDocsArabic = () => {
  return (
    <div className="mt-8" dir="rtl">
      <div className="mb-8">
        <div className="flex items-center">
          <p className="text-base text-text-primary">1-</p>
          <p className="text-base text-text-primary mr-6">
            التعبئة الكاملة لنموذج الطلب.
          </p>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center">
          <p className="text-base text-text-primary">2-</p>
          <p className="text-base text-text-primary mr-6">
            إرفاق وثائق رسمية تثبت صلاحية مقدم الطلب لتمثيل الجهة المعنية (مثل: هوية الموظف، خطاب رسمي...).
          </p>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center">
          <p className="text-base text-text-primary">3-</p>
          <p className="text-base text-text-primary mr-6">
            إرفاق أي ملفات أو صور ذات صلة (إن وجدت).
          </p>
        </div>
      </div>
      
    </div>
  );
};

export default ReqDocsArabic;