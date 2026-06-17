import React, { useState, useEffect, useRef } from "react";

const HeroSectionArabic = ({ className = "" }) => {
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
        direction: 'rtl'
      }}
    >
      {/* Background Image */}
      <img
        src="/images/Rectangle 697.png"
        alt="خلفية"
        className="absolute top-0 left-0 w-full h-full object-cover z-0 pointer-events-none"
      />

      {/* Decorative Animation */}
      <img
        src="/images/7ce5e730420fadb5314ca3096149520fec97f7b1.gif"
        alt="رسوم متحركة زخرفية"
        className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-40 pointer-events-none"
        ref={overlayRef}
        style={{
          mixBlendMode: "screen",
        }}
      />

      {/* Hero Content */}
      <div className="relative z-20 mx-auto px-8 sm:px-16 pt-[190px]" style={{ maxWidth: "1548px" }}>
        <h1 className="text-white font-ibm-plex font-bold text-4xl sm:text-5xl lg:text-7xl leading-tight lg:leading-[90px] mb-[64px] max-w-[1100px] text-right">
          مرحباً بكم في<br />بوابة المياه SWA
        </h1>

        <p className="text-white font-ibm-plex text-lg sm:text-xl leading-relaxed max-w-[655px] mb-[25px] text-right mr-auto">
          إدارة بيانات العملاء، وتتبع طلبات الخدمة، والتعاون بكفاءة - كل ذلك في مكان واحد.
          يرجى تسجيل الدخول للوصول إلى أدواتك وإدارة المهام بسهولة.
        </p>

        {/* Search Form - Modified for responsive behavior */}
      </div>
    </section>
  );
};

export default HeroSectionArabic;