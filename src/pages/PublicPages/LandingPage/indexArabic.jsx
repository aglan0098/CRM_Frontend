import React, { useState } from 'react';
import NavbarArabic from '@/components/NavBar/NavbarArabic';
import Footer from '../../../components/common/FooterArabic';
import HeroSection from '@/components/HeroSection/HeroSectionArabic';
import PortalServices from '@/components/Portal/PortalArabic';
import SwaRoles from '@/components/SwaRoles/SwaRolesArabic';
import SectorServices from '@/components/SectorServices/SectorServicesArabic';
import EnablingServices from '@/components/EnablingServices/EnablingServicesArabic';

const LandingPageArabic = () => {
  return (
    <div className="bg-[#f7fdf9]" dir="rtl">
      <NavbarArabic/>
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

export default LandingPageArabic;