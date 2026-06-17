import React, { useRef, useState } from 'react';

const EnablingServices = () => {
  const topRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const services = [
    {
      id: '1',
      title: 'Marketing',
      description: 'Descriptive body copy with more detailed information about the card contents.',
      image: '/images/img_image.png',
    },
    {
      id: '2',
      title: 'Sales',
      description: 'Descriptive body copy with more detailed information about the card contents.',
      image: '/images/img_image_336x247.png',
    },
  ];

  // Scroll window to top smoothly
  const scrollToTop = () => {
    window.scrollTo({ top: 1, behavior: 'smooth' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  // Open modal with generic Under Development message
  const openModal = () => {
    setModalContent({
      title: 'Under Development',
      description: 'This service is currently under development. Please check back later.',
      image: null,
    });
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setModalContent(null);
  };

  // Modal click outside content closes modal
  const modalBackgroundClick = (e) => {
    if (e.target.id === 'modal-background') {
      closeModal();
    }
  };

  return (
    <section className="py-16 px-6 md:px-16 bg-white">
      {/* Scroll target at the top */}
      <div ref={topRef}></div>

      {/* Header */}
      <div className="mb-12 max-w-3xl">
        <h2 className="text-3xl md:text-5xl font-semibold text-text-primary mb-4 font-ibm-plex">
          Enabling Services
        </h2>
        <p className="text-base md:text-lg text-text-secondary font-normal font-ibm-plex">
          Rich text – description text that spans multiple lines. Lorem ipsum perspiciatis unde omnis iste natus error sit voluptatem. This is an inline link sed ut perspiciatis unde omnis iste natus error sit voluptatem.
        </p>
      </div>

      {/* Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {services.map((service) => (
          <div
            key={service.id}
            className="
              flex flex-col
              md:flex-row
              bg-white shadow-card rounded-lg overflow-hidden
              border border-gray-200
              hover:border-[#037047] transition-all duration-200
              h-auto md:h-[190px]
            "
          >
            {/* Image with fixed rectangular size */}
            <div className="w-full md:w-[240px] h-[150px] md:h-[190px] flex-shrink-0">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover rounded-t-lg md:rounded-none"
              />
            </div>

            {/* Content */}
            <div className="flex flex-col justify-between p-4 flex-1">
              <h3 className="text-base font-semibold text-[#1f2a37] mb-2 mt-4 md:mt-0">{service.title}</h3>
              <p className="text-sm text-[#1f2a37] leading-snug">{service.description}</p>
              <div className="mt-4 flex justify-start md:justify-end">
                <button
                  type="button"
                  onClick={openModal}
                  className="w-10 h-10 bg-[#1b8354] rounded flex items-center justify-center hover:opacity-90"
                  aria-label={`Open details for ${service.title}`}
                >
                  <img
                    src="/images/img_leading_icon copy.svg"
                    alt="Action"
                    className="w-6 h-6"
                  />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Scroll to Top Button */}
      <div className="flex justify-end mt-10">
        <button
          onClick={scrollToTop}
          className="w-[60px] h-[60px] rounded-full border border-green-primary flex items-center justify-center shadow-md hover:shadow-lg transition hover:bg-gray-50"
          aria-label="Scroll to top"
        >
          <img
            src="/images/img_group_1171275028.svg"
            alt="Scroll to top"
            className="h-12 w-12"
          />
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          id="modal-background"
          onClick={modalBackgroundClick}
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          aria-modal="true"
          role="dialog"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <div
            className="rounded-lg max-w-sm w-full p-6 relative shadow-lg"
            style={{ backgroundColor: '#006C45', color: 'white' }}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl font-bold focus:outline-none"
              aria-label="Close modal"
            >
              &times;
            </button>
            <h2 id="modal-title" className="text-2xl font-semibold mb-4">
              {modalContent?.title}
            </h2>
            {modalContent?.image && (
              <img
                src={modalContent.image}
                alt={modalContent.title}
                className="mb-4 w-full h-48 object-cover rounded"
              />
            )}
            <p id="modal-description" className="text-base">
              {modalContent?.description}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default EnablingServices;
