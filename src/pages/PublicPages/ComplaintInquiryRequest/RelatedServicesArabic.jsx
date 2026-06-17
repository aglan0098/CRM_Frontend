import React, { useState } from 'react';
import Card from './Card';
import circle from './public/images/img_checkmarkcircle02.svg'
import calculate from './public/images/img_calculate.svg'

const RelatedServicesArabic = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  
  const services = [
    {
      icon: circle,
      title: "خدمة بلاغات مخالفات المواطنين",
      description: "تتيح هذه المنصة للمستخدمين تقديم وإدارة بلاغات مخالفات المواطنين بكفاءة، مما يوفر نظاماً لتوثيق ومعالجة مختلف القضايا.",
      tag: "فردي",
      buttonText: "اذهب للخدمة",
      buttonLink: "/citizens-violation-reports"
    },
    {
      icon: circle,
      title: "خدمة استعلام بلاغات مخالفات المواطنين",
      description: "تتيح هذه المنصة للمستفيدين الاستعلام عن حالة وتفاصيل بلاغات مخالفات خدمات المياه والصرف الصحي الخاصة بهم.",
      tag: "فردي",
      buttonText: "اذهب للخدمة",
      buttonLink: "/citizens-violation-reports-inquiry"
    },
    {
      icon: calculate,
      title: "حاسبة فاتورة المياه",
      description: "تساعد حاسبة فاتورة المياه المستخدمين على تقدير فاتورة المياه بناءً على الاستهلاك، وحساب التكاليف وفقاً للاستخدام والتعريفات المطبقة.",
      tag: "فردي",
      buttonText: "اذهب للخدمة",
      buttonLink: "/water-bill-calculator"
    }
  ];
  
  const handleSlideChange = (index) => {
    setActiveSlide(index);
  };
  
  return (
    <div className="bg-secondary-light py-8" dir="rtl">
      <div className="container mx-auto px-20">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-text-primary">الخدمات ذات الصلة</h2>
          <button className="text-base font-medium text-text-primary">عرض الكل</button>
        </div>
        
        {/* <p className="text-base text-text-primary mb-10">
          مثال على وصف الخدمة لشراء قطعة أرض لبناء منزلك، هذا يتطلب توثيق عملية البيع والشراء في المكاتب العدلية أو خدمات التوثيق لتسجيل العقار باسمك.
        </p> */}
        
        <div className="grid grid-cols-3 gap-8">
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
        
        <div className="flex justify-center mt-12 space-x-2">
          {[0, 1, 2, 3].map((index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full ${
                activeSlide === index ? 'bg-primary-background' : 'bg-gray-300'
              }`}
              onClick={() => handleSlideChange(index)}
              aria-label={`انتقل إلى الشريحة ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedServicesArabic;