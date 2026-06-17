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
    <div className="bg-white rounded-2xl border border-border-primary p-10">
      <div className="flex items-start mb-10">
        <img src={tag_aud} alt="User icon" className="w-6 h-6 mt-1" />
        <div className="ml-8">
          <h3 className="text-base font-bold text-text-secondary mb-1">Target audience</h3>
          <p className="text-base text-text-secondary">Individual</p>
        </div>
      </div>
      <div className="flex items-start mb-10">
        <img src={clock01} alt="Clock icon" className="w-6 h-6 mt-1" />
        <div className="ml-8">
          <h3 className="text-base font-bold text-text-secondary mb-1">Service duration</h3>
          <p className="text-base text-text-secondary">10 Day(s)</p>
        </div>
      </div>
      
      <div className="flex items-start mb-10">
        <img src={phone} alt="Channels icon" className="w-6 h-6 mt-1" />
        <div className="ml-8">
          <h3 className="text-base font-bold text-text-secondary mb-1">Service channels</h3>
          <p className="text-base text-text-secondary">Services portal</p>
        </div>
      </div>
      
      <div className="flex items-start mb-10">
        <img src={money} alt="Cost icon" className="w-6 h-6 mt-1" />
        <div className="ml-8">
          <h3 className="text-base font-bold text-text-secondary mb-1">Service cost</h3>
          <p className="text-base text-text-secondary">Free</p>
        </div>
      </div>
      
      <hr className="border-t border-border-primary mb-6" />
      
      <h2 className="text-lg font-bold text-text-secondary mb-4">Frequently Asked Questions</h2>
      
      <a href="#" className="flex items-center text-text-green mb-10">
        <span className="text-base">SWA-FAQ's-page</span>
        <img src={faq} alt="External link" className="w-5 h-5 ml-2" />
      </a>
      
      <div className="flex items-start mb-4">
        <img src={call} alt="Phone icon" className="w-6 h-6 mt-1" />
        <div className="ml-8">
          <h3 className="text-base font-bold text-text-secondary mb-1">Phone</h3>
          <a href="tel:0181188111" className="flex items-center text-text-green">
            <span className="text-base">0181188111</span>
            <img src={faq} alt="External link" className="w-5 h-5 ml-2" />
          </a>
        </div>
      </div>
      
      <div className="flex items-start">
        <img src={mail} alt="Email icon" className="w-6 h-6 mt-1" />
        <div className="ml-8">
          <h3 className="text-base font-bold text-text-secondary mb-1">Email</h3>
          <a href="mailto:GDL@SWA.GOV.SA" className="flex items-center text-text-green">
            <span className="text-base">GDL@SWA.GOV.SA</span>
            <img src={faq} alt="External link" className="w-5 h-5 ml-2" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ServiceInfo;