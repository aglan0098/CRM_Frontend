import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CompInq from "./assest/Inquiry.png";
import CompEsc from "./assest/Esclations.png";
import InciRep from "./assest/Incidents.png";
import WatBill from "./assest/Calculators.png";
import LicPer from "./assest/License.png";
import OrgSp from "./assest/Organization.png";
import CostRp from "./assest/Cost.png";
import Wtrcnn from "./assest/LargeWater.png";
import wstwtr from "./assest/WasteWater.png";
import { Tabs } from './ui/Tabs';

const PortalServices = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'individuals', label: 'Individuals Services' },
    { id: 'providers', label: 'Service Providers' },
    { id: 'business', label: 'Business/ Governmental Entities' },
  ];

  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const services = [
    {
      id: '1',
      title: 'Complaints Escalation',
      description: 'This platform allows all beneficiaries to escalate water and sewage complaints to service providers in case of dissatisfaction with the service.',
      icon: CompEsc,
      category: 'individuals',
    },
    {
      id: '2',
      title: 'Complaints Inquiry',
      description: 'This platform allows beneficiaries to inquire about the status and details of their water and sewage service complaints.',
      icon: CompInq,
      category: 'individuals',
    },
    {
      id: '3',
      title: 'Incident Reports',
      description: 'This platform allows users to efficiently submit, track, and manage Citizens Violation reports, providing a centralized system for documenting and addressing various issues.',
      icon: InciRep,
      category: 'individuals',
    },
    {
      id: '4',
      title: 'Water Bill Calculator',
      description: 'Descriptive body copy with more detailed information about the card contents...',
      icon: WatBill,
      category: 'individuals',
    },
    {
      id: '5',
      title: 'License & Permits',
      description: 'Descriptive body copy with more detailed information about the card contents...',
      icon: LicPer,
      category: 'providers',
    },
    {
      id: '6',
      title: 'Organization Support',
      description: 'Descriptive body copy with more detailed information about the card contents...',
      icon: OrgSp,
      category: 'providers',
    },
    {
      id: '7',
      title: 'Cost Repair',
      description: 'Descriptive body copy with more detailed information about the card contents...',
      icon: CostRp,
      category: 'providers',
    },
    {
      id: '8',
      title: 'Large Water Connections',
      description: 'Descriptive body copy with more detailed information about the card contents...',
      icon: Wtrcnn,
      category: 'business',
    },
    {
      id: '9',
      title: 'Waste Water Management',
      description: 'Descriptive body copy with more detailed information about the card contents...',
      icon: wstwtr,
      category: 'business',
    }
  ];

  const filteredServices = activeTab === 'all'
    ? services
    : services.filter(service => service.category === activeTab);

  const handleServiceClick = (service) => {
    if (service.title === 'Complaints Escalation') {
      navigate('/ComplaintEscalationRequest');
    } else if (service.title === 'Complaints Inquiry') {
      navigate('/ComplaintInquiryRequest');
    } else if (service.title === 'Incident Reports') {
      navigate('/CitVioSerReq');
    }else if (service.title === 'Organization Support') {
      navigate('/RegulatoryRequest');
    } else {
      setShowModal(true);
    }
  };

  return (
    <section className="pt-[36px] px-6 md:px-12 lg:px-24 mb-[80px]">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-ibm-plex font-medium text-text-primary mb-8">
        Portal Services
      </h2>

      <p className="text-base sm:text-lg font-ibm-plex font-normal text-text-primary mb-10 max-w-3xl text-justify line-clamp-2">
        Section description goes here and can span across multiple lines. <br />Keep it short to maintain interest.
      </p>

      {isMobile ? (
        <div className="mb-10">
          <select
            className="w-full p-3 border rounded-md text-base font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-700"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
          >
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.label}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          className="mb-10 text-lg font-medium main-tabs-sec"
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map(service => (
          <div
            key={service.id}
            onClick={() => handleServiceClick(service)}
            className="cursor-pointer bg-white text-black border border-gray-200 rounded-xl px-4 pt-4 pb-1 transition-all duration-300 flex flex-col h-full min-h-[200px] 
            hover:bg-[#006C45] hover:text-white hover:shadow-xl hover:scale-[1.02] focus:outline-none"
          >
            <div className="mb-3">
              <img
                src={service.icon}
                alt={service.title}
                className="h-10 w-10 object-contain"
              />
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-1">{service.title}</h3>
            <p className="text-sm leading-relaxed">{service.description}</p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-[#006C45] text-white rounded-xl p-8 max-w-sm w-full relative shadow-lg">
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
    </section>
  );
};

export default PortalServices;
