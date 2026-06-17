import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FooterArabic = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLinkClick = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <footer 
        className="bg-[#074c30] text-white mt-48 w-full" 
        style={{
          position: 'fixed',
          bottom: '0',
          left: '0',
          right: '0',
          width: '100%',
          zIndex: '100'
        }}
        dir="rtl"
      >
        <div className="relative w-full">
          <img
            src="/images/img_blue_background_shape_2.png"
            alt="الخلفية"
            className="absolute top-0 right-0 h-full w-[690px] object-cover"
          />

          <div className="container mx-auto px-6 sm:px-10 lg:px-20 py-14 relative z-10">
            {/* أسفل التذييل */}
            <div className="mt-12 flex flex-col lg:flex-row items-center justify-between gap-6">
              <p className="text-[14px] font-semibold text-center lg:text-right">
                جميع الحقوق محفوظة لهيئة المياه السعودية © 2024
              </p>
              <div className="flex items-center gap-4 flex-wrap justify-center lg:justify-start">
                <img src="/images/img_swa_logo_outline_1.png" alt="شعار هيئة المياه" className="h-[50px] w-auto" />
                <img src="/images/img_2030vision_1.svg" alt="رؤية 2030" className="h-[50px] w-auto" />
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* النافذة المنبثقة */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-[#074c30] rounded-md shadow-lg w-[350px] max-w-full" dir="rtl">
            {/* رأس النافذة المنبثقة */}
            <div className="bg-[#074c30] px-6 py-3 flex items-center justify-between">
              <h2 className="text-white text-[18px] font-semibold">قيد التطوير</h2>
              <button
                onClick={closeModal}
                className="text-white text-xl font-semibold leading-none focus:outline-none"
              >
                &times;
              </button>
            </div>

            {/* محتوى النافذة المنبثقة */}
            <div className="px-6 py-3 text-white">
              <p className="text-[16px] text-right">هذه الميزة قيد التطوير حالياً.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FooterArabic;
