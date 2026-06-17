import React, { useState, useEffect } from 'react';
import { Pagination } from './ui/Pagination';

const SectorServices = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileView, setIsMobileView] = useState(false);

  const services = [
    {
      id: '1',
      title: 'Customer Services',
      description: 'Descriptive body copy with more detailed information about the card contents.',
      image: '/images/img_rectangle_6243.png',
    },
    {
      id: '2',
      title: 'Marketing',
      description: 'Descriptive body copy with more detailed information about the card contents.',
      image: '/images/img_vaultexecssoccconroomv10925_1.png',
    },
    {
      id: '3',
      title: 'Sales',
      description: 'Descriptive body copy with more detailed information about the card contents.',
      image: '/images/img_rectangle_6244.png',
    },
    {
      id: '4',
      title: 'Support',
      description: 'Learn how our support services can help your business run smoother.',
      image: '/images/img_rectangle_6243.png',
    },
    {
      id: '5',
      title: 'Research',
      description: 'We offer research-based solutions tailored to your needs.',
      image: '/images/img_vaultexecssoccconroomv10925_1.png',
    },
    {
      id: '6',
      title: 'Development',
      description: 'We innovate with technology to deliver transformative services.',
      image: '/images/img_rectangle_6244.png',
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 1024); // 'lg' breakpoint
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    console.log(`Navigating to page ${page}`);
  };

  const totalPages = isMobileView
    ? services.length
    : Math.ceil(services.length / 3);

  const getVisibleServices = () => {
    if (isMobileView) {
      return [services[currentPage - 1]];
    }
    const startIdx = (currentPage - 1) * 3;
    return services.slice(startIdx, startIdx + 3);
  };

  return (
    <section className="py-16 px-6 sm:px-8 lg:px-16">
      {/* Section Header */}
      <div className="mb-12">
        <h2 className="text-3xl sm:text-5xl font-ibm-plex font-medium text-text-primary mb-4 text-left">
          Sector Services
        </h2>
        <p className="text-base sm:text-lg font-ibm-plex text-text-secondary mb-4 text-left">
          Explore the various services we offer. Select a category to learn more.
        </p>
      </div>

      {/* Cards */}
      <div className={`grid ${isMobileView ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'} gap-8 mb-8`}>
        {getVisibleServices().map((service) => (
          <div
            key={service.id}
            className="relative bg-white rounded-xl shadow-lg overflow-hidden group h-[400px]"
          >
            <div className="w-full h-full relative">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-transparent to-transparent p-4 text-white">
              <h3 className="text-lg sm:text-xl font-bold mb-1">{service.title}</h3>
              <p className="text-sm sm:text-base">{service.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-12">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </section>
  );
};

export default SectorServices;
