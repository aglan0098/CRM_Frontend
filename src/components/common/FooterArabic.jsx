import React from 'react';

const FooterArabic = () => {
  const browseLinks = [
    { name: 'الأحكام والسياسات', url: 'https://www.swa.gov.sa/ar/terms-and-policies' },
    { name: 'الاستخدام وإخلاء المسؤولية', url: 'https://www.swa.gov.sa/ar/use-and-disclaimer' },
    { name: 'سياسة الخصوصية', url: 'https://www.swa.gov.sa/ar/privacy-policy' },
    { name: 'حقوق الملكية الفكرية', url: 'https://www.swa.gov.sa/ar/intellectual-property-rights' },
    { name: 'ميثاق العملاء', url: 'https://www.swa.gov.sa/ar/customer-charter' },
    { name: 'حق الوصول إلي المعلومة', url: 'https://www.swa.gov.sa/ar/freedom-of-information-overview' },
    { name: 'سياسة الاستخدام الآمن', url: 'https://www.swa.gov.sa/ar/safe-usage-policy' },
    { name: 'اتفاقية مستوى الخدمات', url: 'https://www.swa.gov.sa/ar/service-level-agreement' },
    { name: 'المشاركة المجتمعية', url: 'https://www.swa.gov.sa/ar/community-participation' },
    { name: 'سياسة سهولة الوصول', url: 'https://www.swa.gov.sa/ar/digital-accessibility-policy' },
    { name: 'خريطة الموقع', url: 'https://www.swa.gov.sa/ar/site-map' },
  ];

  const relatedLinks = [
    { name: 'المنصة الوطنية', url: 'https://my.gov.sa/ar' },
    { name: 'المنصة الوطنية الموحدة للتوظيف', url: 'https://www.swa.gov.sa/ar/jadarat' },
    { name: 'بوابة الموظفين', url: 'https://sts.swcc.gov.sa/adfs/ls/?SAMLRequest=hZLRbtsgFEB%2FxaLPBozd1EFOpGxR1UjtFjXZHvaGgSRI9iXl4nj9%2B9G0U%2FrS9hF0ru45gmYxxAM82qfBYswWiDZE5%2BG7Bxx6GzY2nJy2vx7vZ%2BQQ4xElY0ofjDl1%2BEyV1n6AiNSDsb0CQ7XvGaq%2BE8yZYyLxK5pk6%2BCj17775sA42M%2FIEEB6hQ4lqN6ijFpuFg%2F3UlAu21cI5d12u87XPzdbki2TuQP1on2RxLQHR63p3p8oKqbMDlmHjGSr5Yxs6roV%2FEbzvCjLSV7V0zJXrW7zNp2FmE7Ktr5OKOJgV4BRQZwRwUWV82nOq21RyLKW1TWd8Js%2FJPttA563J0WS%2Fe07wM8zjm%2FNb7AEFJ8PqP8Pc5moXmNT6ziOdCypD3smOC8Yr1iCLOirC11%2BQHPGpy%2B0Qbe%2FIvMmmchzdph%2F8XINe8c2P5Lyarn2ndPP2a0PvYofFxW0ON84k%2B%2FOqBwAj1a7nbOGsHnD3v%2FK%2BT8%3D&RelayState=__HOST-arcacfe1c&SigAlg=http%3A%2F%2Fwww.w3.org%2F2001%2F04%2Fxmldsig-more%23rsa-sha256&Signature=RsWQh2bt%2By7ih8WWkUApZM7sLRUFZh4pXZX7nbGtY2FsG2Zjs6HWHualMwcJJ%2FeEHkzjgQ%2BjIF%2FTgZxh8aYg%2BO%2BgWrWOPEY2h6RQXcRSeXomYTetL8nOVOimTT8aWHTixFxcnk%2BOX8acJBRhH535pGn9sXf1wdK96VnFmUDKGjO6CsM7tv85cSyDZCoaqCxo%2F96vXd3QpJOXddr3h%2BoHqLBRQqL62SHbWOzTzU18kzMyegNuvpuUaAZe9rqj2TrbSQ2PpQ2iIpdITe8w8USUH3MCY9PjPGUWUKXeFK8DrRHHDWZ0Uxk7TTPb8OufqPSjvQz57hoWo6slB6VaVgCLxw%3D%3D' },
  ];

  const socialLinks = [
    { name: 'Facebook', url: 'https://www.facebook.com/people/%D8%A7%D9%84%D9%87%D9%8A%D8%A6%D8%A9-%D8%A7%D9%84%D8%B3%D8%B9%D9%88%D8%AF%D9%8A%D8%A9-%D9%84%D9%84%D9%85%D9%8A%D8%A7%D9%87/61557153702553/', icon: 'img_leading_icon_8.svg' },
    { name: 'X', url: 'https://twitter.com/swa_gov', icon: 'img_leading_icon_7.svg' },
    { name: 'Snapchat', url: 'https://www.snapchat.com/add/swa_gov', icon: 'img_leading_icon_6.svg' },
    { name: 'Instagram', url: 'https://www.instagram.com/swa_gov/', icon: 'img_leading_icon_5.svg' },
    { name: 'Youtube', url: 'https://www.youtube.com/@swa_gov', icon: 'img_leading_icon_4.svg' },
    { name: 'TikTok', url: 'https://www.tiktok.com/@swa_gov', icon: 'img_leading_icon_3.svg' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/company/saudi-water-authority/?_l=en_US', icon: 'img_leading_icon_20x20.svg' },
  ];

  return (
    <>
      <footer className="bg-[#074c30] text-white" dir="rtl">
        <div className="relative w-full">
          <img
            src="/images/img_blue_background_shape_2.png"
            alt="الخلفية"
            className="absolute top-0 right-0 h-full w-[690px] object-cover"
          />

          <div className="container mx-auto px-6 sm:px-10 lg:px-20 py-14 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {/* تصفح */}
              <div>
                <div className="border-b border-white/30 pb-2 mb-4">
                  <h3 className="text-[16px] font-medium text-right">تصفح</h3>
                </div>
                <ul className="space-y-3">
                  {browseLinks.map((item, idx) => (
                    <li key={idx}>
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[14px] hover:underline text-right block"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* تواصل */}
              <div>
                <div className="border-b border-white/30 pb-2 mb-4">
                  <h3 className="text-[16px] font-medium text-right">المساعدة والدعم</h3>
                </div>
                <ul className="space-y-3 text-[14px] leading-5 text-right">
                  <li>
                    <a href="https://www.swa.gov.sa/ar/communication-channels" className="hover:underline">
                      تواصل معنا
                    </a>
                  </li>
                  <li>
                    <a href="https://www.swa.gov.sa/ar/faq" className="hover:underline">
                     الأسئلة الشائعة
                    </a>
                  </li>
                </ul>
              </div>

              {/* روابط ذات صلة */}
              <div>
                <div className="border-b border-white/30 pb-2 mb-4">
                  <h3 className="text-[16px] font-medium text-right">روابط ذات صلة</h3>
                </div>
                <ul className="space-y-3">
                  {relatedLinks.map((link, idx) => (
                    <li key={idx}>
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[14px] hover:underline text-right block"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* وسائل التواصل الاجتماعي */}
              <div>
                <div className="border-b border-white/30 pb-2 mb-4">
                  <h3 className="text-[16px] font-medium text-right">تابعنا</h3>
                </div>
                <div className="flex flex-wrap gap-2 mt-4 justify-end">
                  {socialLinks.map((social, idx) => (
                    <a
                      key={idx}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 border border-white/30 rounded flex items-center justify-center hover:bg-white/10 transition-colors"
                      aria-label={social.name}
                    >
                      <img
                        src={`/images/${social.icon}`}
                        alt={social.name}
                        className="w-5 h-5"
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* أسفل التذييل */}
            <div className="mt-12 flex flex-col lg:flex-row items-center justify-between gap-6">
              <p className="text-[14px] font-semibold text-center lg:text-right">
                جميع الحقوق محفوظة للهيئة السعودية للمياه © 2026
              </p>
              <div className="flex items-center gap-4 flex-wrap justify-center lg:justify-start">
                <img src="/images/img_swa_logo_outline_1.png" alt="شعار هيئة المياه" className="h-[50px] w-auto" />
                <img src="/images/img_2030vision_1.svg" alt="رؤية 2030" className="h-[50px] w-auto" />
                <img src="/images/img_image_2.png" alt="الشهادة" className="h-[50px] w-auto" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default FooterArabic;