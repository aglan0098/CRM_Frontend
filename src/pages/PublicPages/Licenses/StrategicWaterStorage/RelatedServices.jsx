import React, { useState } from 'react';
import Card from './Card';
import circle from './public/images/img_checkmarkcircle02.svg';
import calculate from './public/images/img_calculate.svg';

const RelatedServices = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const services = [
    {
      icon: circle,
      title: 'Citizens Violation Reports Service',
      description:
        'This platform allows users to efficiently submit, and manage Citizens Violation reports, providing a system for documenting and addressing various issues.',
      tag: 'Individual',
      buttonText: 'Go To Service',
      // buttonLink: '/citizens-violation-reports', // Removed to trigger modal
    },
    {
      icon: circle,
      title: 'Citizens Violation Reports Inquiry Service',
      description:
        'This platform allows beneficiaries to inquire about the status and details of their water and sewage service Violation Reports.',
      tag: 'Individual',
      buttonText: 'Go To Service',
      // buttonLink: '/citizens-violation-reports-inquiry', // Removed to trigger modal
    },
    {
      icon: calculate,
      title: 'Water Bill Calculator',
      description:
        'The Water Bill Calculator helps users estimate their water bill based on consumption, calculating costs according to usage and applicable tariffs.',
      tag: 'Individual',
      buttonText: 'Go To Service',
      // buttonLink: '/water-bill-calculator', // Removed to trigger modal
    },
  ];

  const handleSlideChange = (index) => {
    setActiveSlide(index);
  };

  const handleServiceClick = () => {
    setShowModal(true);
  };

  return (
    <div className="bg-secondary-light py-10 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
            Related Services
          </h2>
          <button className="text-sm sm:text-base font-medium text-text-primary hover:underline">
            View all
          </button>
        </div>
        <p className="text-sm sm:text-base text-text-primary mb-10 max-w-3xl">
          Service description example: To buy a plot to build your house, this requires documenting the sale and purchase process in the notarial offices or notary services to register the property in your name.
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
              onCardClick={handleServiceClick}
            />
          ))}
        </div>
        <div className="flex justify-center mt-10 space-x-2" role="tablist" aria-label="Related Services Slides">
          {[0, 1, 2].map((index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                activeSlide === index ? 'bg-primary-background' : 'bg-gray-300'
              }`}
              onClick={() => handleSlideChange(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-pressed={activeSlide === index}
              role="tab"
            />
          ))}
        </div>
      </div>

      {/* Under Development Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-[#006C45] text-white rounded-xl p-8 max-w-sm w-full relative shadow-lg mx-4">
            <button
              className="absolute top-3 right-3 text-white text-xl font-bold hover:text-gray-300 focus:outline-none focus:border-black"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold mb-2">Under Development</h2>
            <p className="text-base">
              This service is currently under development. Please check back later.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RelatedServices;