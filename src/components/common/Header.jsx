import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white w-full">
      <div className="flex items-center h-[72px]">
        <Link to="/" className="ml-8">
          <img src="/images/img_swa_logo.svg" alt="Saudi Water Authority Logo" className="h-[58px] w-[80px]" />
        </Link>
        
        <nav className="flex">
          <div className="flex items-center h-[72px] px-4">
            <span className="text-[16px] font-medium text-[#161616] mr-2">About</span>
            <img src="/images/img_chevron.svg" alt="Dropdown" className="w-5 h-5" />
          </div>
          
          <div className="flex items-center h-[72px] px-4 bg-[#1b8354] text-white">
            <span className="text-[16px] font-semibold text-white mr-2">Services</span>
            <div className="absolute bottom-0 left-0 w-full">
              <img src="/images/img_selection_indicator.svg" alt="Selected" className="h-[6px] w-full" />
            </div>
          </div>
          
          <div className="flex items-center h-[72px] px-4">
            <span className="text-[16px] font-medium text-[#161616] mr-2">Information Center</span>
            <img src="/images/img_chevron.svg" alt="Dropdown" className="w-5 h-5" />
          </div>
          
          <div className="flex items-center h-[72px] px-4">
            <span className="text-[16px] font-medium text-[#161616] mr-2">Water Sector System</span>
            <img src="/images/img_chevron.svg" alt="Dropdown" className="w-5 h-5" />
          </div>
          
          <div className="flex items-center h-[72px] px-4">
            <span className="text-[16px] font-medium text-[#161616] mr-2">Media Center</span>
            <img src="/images/img_chevron.svg" alt="Dropdown" className="w-5 h-5" />
          </div>
          
          <div className="flex items-center h-[72px] px-4">
            <span className="text-[16px] font-medium text-[#161616] mr-2">Contact Us</span>
            <img src="/images/img_chevron.svg" alt="Dropdown" className="w-5 h-5" />
          </div>
        </nav>
        
        <div className="ml-auto flex">
          <div className="flex items-center h-[72px] w-[72px] justify-center">
            <img src="/images/img_leading_icon.svg" alt="Theme toggle" className="w-6 h-6" />
          </div>
          
          <div className="flex items-center h-[72px] px-4">
            <img src="/images/img_leading_icon_24x24.svg" alt="Search" className="w-6 h-6 mr-2" />
            <span className="text-[16px] font-medium text-[#161616]">Search</span>
          </div>
          
          <div className="flex items-center h-[72px] px-4">
            <img src="/images/img_leading_icon_1.svg" alt="Language" className="w-6 h-6 mr-2" />
            <span className="text-[16px] font-medium text-[#161616]">العربية</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;