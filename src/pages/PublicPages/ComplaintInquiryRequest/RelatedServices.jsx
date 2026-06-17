import React, { useState } from 'react';
import Card from './Card';
import circle from './public/images/img_checkmarkcircle02.svg'
import calculate from './public/images/img_calculate.svg'

const RelatedServices = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  
  const services = [
    {
      icon: circle,
      title: "Citizens Violation Reports Service",
      description: "This platform allows users to efficiently submit, and manage Citizens Violation reports, providing a system for documenting and addressing various issues.",
      tag: "Individual",
      buttonText: "Go To Service",
      buttonLink: "/citizens-violation-reports"
    },
    {
      icon: circle,
      title: "Citizens Violation Reports inquiry service",
      description: "This platform allows beneficiaries to inquire about the status and details of their water and sewage service Violation Reportes.",
      tag: "Individual",
      buttonText: "Go To Service",
      buttonLink: "/citizens-violation-reports-inquiry"
    },
    {
      icon: calculate,
      title: "Water Bill Calculator",
      description: "The Water Bill Calculator helps users estimate their water bill based on consumption, calculating costs according to usage and applicable tariffs.",
      tag: "Individual",
      buttonText: "Go To Service",
      buttonLink: "/water-bill-calculator"
    }
  ];
  
  const handleSlideChange = (index) => {
    setActiveSlide(index);
  };
  
  return (
    <div className="bg-secondary-light py-8">
      <div className="container mx-auto px-20">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-text-primary">Related Services</h2>
          <button className="text-base font-medium text-text-primary">View all</button>
        </div>
        
        <p className="text-base text-text-primary mb-10">
          Service description example To buy a plot to build your house, this requires documenting the sale and purchase process in the notarial offices or notary services to register the property in your name.
        </p>
        
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
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedServices;