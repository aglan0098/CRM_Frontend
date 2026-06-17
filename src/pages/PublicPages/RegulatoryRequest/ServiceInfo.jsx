import React from 'react';
import  tag_aud from './public/images/img_user.svg'
import  clock01 from './public/images/img_clock01.svg'
import  phone from './public/images/img_computerphonesync.svg'
import  money from './public/images/img_money04.svg'
import  faq from './public/images/img_linksquare02.svg'
import  call from './public/images/img_call.svg'
import  mail from './public/images/img_mail01.svg'

const ServiceInfo = () => {
  return (
    <div className="bg-white rounded-2xl border border-border-primary p-6">
      <div className="flex items-start mb-6">
        <img src={tag_aud} alt="User icon" className="w-6 h-6 mt-1" />
        <div className="ml-6">
          <h3 className="text-base font-bold text-text-secondary mb-1">Target audience</h3>
          <p className="text-base text-text-secondary">Public Sector and Private Sector</p>
        </div>
      </div>
      <div className="flex items-start mb-6">
        <img src={clock01} alt="Clock icon" className="w-6 h-6 mt-1" />
        <div className="ml-6">
          <h3 className="text-base font-bold text-text-secondary mb-1">Service duration</h3>
          <p className="text-base text-text-secondary">15 Day(s)</p>
        </div>
      </div>
      
      <div className="flex items-start mb-6">
        <img src={phone} alt="Channels icon" className="w-6 h-6 mt-1" />
        <div className="ml-6">
          <h3 className="text-base font-bold text-text-secondary mb-1">Service channels</h3>
          <p className="text-base text-text-secondary">Services portal</p>
        </div>
      </div>
      
      <div className="flex items-start mb-6">
        <img src={money} alt="Cost icon" className="w-6 h-6 mt-1" />
        <div className="ml-6">
          <h3 className="text-base font-bold text-text-secondary mb-1">Service cost</h3>
          <p className="text-base text-text-secondary">Based on the size of the activity</p>
        </div>
      </div>
      
      <hr className="border-t border-border-primary mb-4" />
      
      <h2 className="text-lg font-bold text-text-secondary mb-3">Frequently Asked Questions</h2>
      
      <a href="#" className="flex items-center text-text-green mb-6">
        <span className="text-base">SWA-FAQ's-page</span>
        <img src={faq} alt="External link" className="w-5 h-5 ml-2" />
      </a>
      
      <div className="flex items-start mb-3">
        <img src={call} alt="Phone icon" className="w-6 h-6 mt-1" />
        <div className="ml-6">
          <h3 className="text-base font-bold text-text-secondary mb-1">Phone</h3>
          <a href="tel:0181188111" className="flex items-center text-[#059669]">
            <span className="text-base">0181188111</span>
            <img src={faq} alt="External link" className="w-5 h-5 ml-2" />
          </a>
        </div>
      </div>
      
      <div className="flex items-start">
        <img src={mail} alt="Email icon" className="w-6 h-6 mt-1" />
        <div className="ml-6">
          <h3 className="text-base font-bold text-text-secondary mb-1">Email</h3>
          <a href="mailto:GDL@SWA.GOV.SA" className="flex items-center text-[#059669]">
            <span className="text-base">GDL@SWA.GOV.SA</span>
            <img src={faq} alt="External link" className="w-5 h-5 ml-2" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ServiceInfo;