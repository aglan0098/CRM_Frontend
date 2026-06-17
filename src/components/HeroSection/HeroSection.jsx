import React, { useState, useEffect, useRef } from "react";

const HeroSection = ({ className = "" }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const overlayRef = useRef(null);
  const [sectionHeight, setSectionHeight] = useState(680);

  useEffect(() => {
    if (overlayRef.current) {
      const img = overlayRef.current;
      img.onload = () => {
        setSectionHeight(img.naturalHeight);
      };
    }
  }, []);

  return (
    <section
      className={`relative w-full overflow-hidden ${className}`}
      style={{
        height: `${sectionHeight}px`,
      }}
    >
      {/* Background Image */}
      <img
        src="/images/Rectangle 697.png"
        alt="background"
        className="absolute top-0 left-0 w-full h-full object-cover z-0 pointer-events-none"
      />

      {/* Decorative Animation */}
      <img
        src="/images/7ce5e730420fadb5314ca3096149520fec97f7b1.gif"
        alt="Decorative Animation"
        className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-40 pointer-events-none"
        ref={overlayRef}
        style={{
          mixBlendMode: "screen",
        }}
      />

      {/* Hero Content */}
      <div className="relative z-20 mx-auto px-8 sm:px-16 pt-[190px]" style={{ maxWidth: "1548px" }}>
        <h1 className="text-white font-ibm-plex font-bold text-4xl sm:text-5xl lg:text-7xl leading-tight lg:leading-[90px] mb-[64px] max-w-[1100px]">
          Welcome to the<br />SWA Water Portal
        </h1>

        <p className="text-white font-ibm-plex text-lg sm:text-xl leading-relaxed max-w-[655px] mb-[25px]">
          Manage customer data, track service requests, and collaborate efficiently—all in one place.
          Please log in to access your tools and manage tasks with ease.
        </p>

        {/* Search Form - Modified for responsive behavior */}
      </div>
    </section>
  );
};

export default HeroSection;