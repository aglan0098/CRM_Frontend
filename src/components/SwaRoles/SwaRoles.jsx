import React, { useState } from 'react';
import BG from "../../styles/bg.png";

const SwaRoles = () => {
  const roles = [
    {
      id: '1',
      title: 'Beneficiaries Protection',
      description:
        'Protect beneficiaries by regulating water resources and ensuring their sustainable use, while monitoring the quality of services provided. It also works to raise community awareness about the importance of water conservation and offers various communication channels for receiving complaints and feedback.',
      icon: '/images/img_leading_icon copy.svg',
    },
    {
      id: '2',
      title: 'Water Security Planning and Management',
      description:
        'Integrating water supply chain projects and services and maximizing benefits, ensuring the availability of water security requirements and developing the necessary plans and programs for that, monitoring and analyzing data and measuring the performance of services and projects.',
      icon: '/images/img_leading_icon copy.svg',
    },
    {
      id: '3',
      title: 'Supervising the Implementation of Strategic Directions',
      description:
        'Integration with national strategies, programmes to localise the water sector industry and raise the percentage of local content, programmes to apply environmental, social and quality of life standards, and programmes to enhance research, innovation and international cooperation for water solutions.',
      icon: '/images/img_leading_icon copy.svg',
    },
    {
      id: '4',
      title: 'Water Sector Regulation',
      description:
        'Issuing licenses, permits, and guidelines related to entities and operational assets, defining specifications and quality standards for water and related services.',
      icon: '/images/img_leading_icon copy.svg',
    },
  ];

  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  // Close modal if clicking on background outside modal content
  const onModalBackgroundClick = (e) => {
    if (e.target.id === 'modal-background') closeModal();
  };

  return (
    <section
      className="relative py-16 px-6 sm:px-12 lg:px-24 bg-white overflow-hidden min-h-[800px]"
      style={{
        backgroundImage: `url(${BG})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <img
        src="/images/img_vector_1041x1546.png"
        alt="Vector Background"
        className="absolute top-0 right-0 h-full w-full object-contain opacity-10 z-0 pointer-events-none"
      />

      <div className="relative z-10">
        <div className="mb-12 max-w-4xl">
          <h2 className="text-4xl sm:text-5xl font-ibm-plex font-medium text-text-primary mb-4">
            SWA Roles
          </h2>
          <p className="text-base sm:text-lg font-ibm-plex text-text-secondary">
            The Saudi Water Authority has a mandate to promote water conservation <br />
            and ensure that water is available to all. The SWA roles are:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role, index) => (
            <div
              key={role.id}
              className="flex flex-col h-full bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-[#1b8354] text-white flex items-center justify-center text-xl font-bold">
                  {`0${index + 1}`}
                </div>
              </div>

              <div className="flex flex-col flex-grow">
                <h3 className="text-base font-semibold text-text-primary mb-2">{role.title}</h3>
                <p className="text-sm text-text-secondary line-clamp-[6]">{role.description}</p>
              </div>

              <div className="mt-4">
                {/* Button to open the "Under Development" modal */}
                <button
                  type="button"
                  onClick={openModal}
                  className="w-10 h-10 bg-[#1b8354] rounded flex items-center justify-center hover:opacity-90"
                  aria-label={`Open under development modal for ${role.title}`}
                >
                  <img src={role.icon} alt={role.title} className="w-6 h-6" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Under Development Modal */}
      {showModal && (
        <div
          id="modal-background"
          onClick={onModalBackgroundClick}
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          aria-modal="true"
          role="dialog"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <div
            className="rounded-lg w-[350px] max-w-full p-6 relative shadow-lg"
            style={{ backgroundColor: '#006C45' }}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white hover:text-gray-200 text-2xl font-bold focus:outline-none"
              aria-label="Close modal"
            >
              &times;
            </button>
            <h2
              id="modal-title"
              className="text-2xl font-semibold mb-4 text-white"
            >
              Under Development
            </h2>
            <p id="modal-description" className="text-white text-base">
              This feature is currently under development. Please check back
              later.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default SwaRoles;
