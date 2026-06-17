import React, { useState } from 'react';
import Card from './Card';
import circle from './public/images/img_checkmarkcircle02.svg';
import calculate from './public/images/img_calculate.svg';

const RelatedServicesArabic = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const services = [
    {
      icon: circle,
      title: 'خدمة تقارير مخالفات المواطنين',
      description:
        'تتيح هذه المنصة للمستخدمين تقديم وإدارة تقارير مخالفات المواطنين بكفاءة، وتوفر نظاماً لتوثيق ومعالجة القضايا المختلفة.',
      tag: 'فردي',
      buttonText: 'الذهاب للخدمة',
      buttonLink: '/citizens-violation-reports',
    },
    {
      icon: circle,
      title: 'خدمة الاستعلام عن تقارير مخالفات المواطنين',
      description:
        'تتيح هذه المنصة للمستفيدين الاستعلام عن حالة وتفاصيل تقارير مخالفات خدمات المياه والصرف الصحي الخاصة بهم.',
      tag: 'فردي',
      buttonText: 'الذهاب للخدمة',
      buttonLink: '/citizens-violation-reports-inquiry',
    },
    {
      icon: calculate,
      title: 'حاسبة فاتورة المياه',
      description:
        'تساعد حاسبة فاتورة المياه المستخدمين في تقدير فاتورة المياه الخاصة بهم بناءً على الاستهلاك، وحساب التكاليف وفقاً للاستخدام والتعريفات المعمول بها.',
      tag: 'فردي',
      buttonText: 'الذهاب للخدمة',
      buttonLink: '/water-bill-calculator',
    },
  ];

  const handleSlideChange = (index) => {
    setActiveSlide(index);
  };

  return (
    <div className="bg-secondary-light py-10" dir="rtl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
            الخدمات ذات الصلة
          </h2>
          <button className="text-sm sm:text-base font-medium text-text-primary hover:underline">
            عرض الكل
          </button>
        </div>

        <p className="text-sm sm:text-base text-text-primary mb-10 max-w-3xl">
          مثال على وصف الخدمة: لشراء قطعة أرض لبناء منزلك، يتطلب ذلك توثيق عملية البيع والشراء في المكاتب العدلية أو خدمات الكاتب العدل لتسجيل العقار باسمك.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              tag={service.tag}
              buttonText={service.buttonText}
              buttonLink={service.buttonLink}
            />
          ))}
        </div>

        <div className="flex justify-center mt-10 space-x-2" role="tablist" aria-label="شرائح الخدمات ذات الصلة">
          {[0, 1, 2].map((index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                activeSlide === index ? 'bg-primary-background' : 'bg-gray-300'
              }`}
              onClick={() => handleSlideChange(index)}
              aria-label={`الانتقال إلى الشريحة ${index + 1}`}
              aria-pressed={activeSlide === index}
              role="tab"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedServicesArabic;