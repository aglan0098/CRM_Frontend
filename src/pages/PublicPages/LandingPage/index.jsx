import React, { useState } from 'react';
import Navbar from '@/components/NavBar/Navbar';
import Footer from '../../../components/common/Footer';
import HeroSection from '@/components/HeroSection/HeroSection';
import PortalServices from '@/components/Portal/Portal';
import SwaRoles from '@/components/SwaRoles/SwaRoles';
import SectorServices from '@/components/SectorServices/SectorServices';
import EnablingServices from '@/components/EnablingServices/EnablingServices';
const LandingPage = () => {
  return (
    <div className="bg-[#f7fdf9]">
      <Navbar/>
      <HeroSection/>
      <div className="container mx-auto">
      <div id="services">
        <PortalServices />
      </div>
        <SwaRoles />
        <SectorServices />
        <EnablingServices />
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;