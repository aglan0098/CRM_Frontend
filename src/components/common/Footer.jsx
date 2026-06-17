import React from 'react';

const Footer = () => {
  const browseLinks = [
    { name: 'Terms and policies', url: 'https://www.swa.gov.sa/en/terms-and-policies' },
    { name: 'Use and Disclaimer', url: 'https://www.swa.gov.sa/en/use-and-disclaimer' },
    { name: 'Privacy policy', url: 'https://www.swa.gov.sa/en/privacy-policy' },
    { name: 'Intellectual property rights', url: 'https://www.swa.gov.sa/en/intellectual-property-rights' },
    { name: 'Customer Charter', url: 'https://www.swa.gov.sa/en/customer-charter' },
    { name: 'Right to Access Information', url: 'https://www.swa.gov.sa/en/freedom-of-information-overview' },
    { name: 'Safe Usage Policy', url: 'https://www.swa.gov.sa/en/safe-usage-policy' },
    { name: 'Service Level Agreement', url: 'https://www.swa.gov.sa/en/service-level-agreement' },
    { name: 'Community Participation', url: 'https://www.swa.gov.sa/en/community-participation' },
    { name: 'Accessibility Policy', url: 'https://www.swa.gov.sa/en/digital-accessibility-policy' },
    { name: 'Site map', url: 'https://www.swa.gov.sa/en/site-map' },
  ];

  const relatedLinks = [
    { name: 'National platform', url: 'https://my.gov.sa/en' },
    { name: 'Unified National Employment Platform', url: 'https://www.swa.gov.sa/en/jadarat' },
    { name: 'Employee portal', url: 'https://sts.swcc.gov.sa/adfs/ls/?SAMLRequest=hZLRbtsgFEB%2FxaLPBozd1EFOpGxR1UjtFjXZHvaGgSRI9iXl4nj9%2B9G0U%2FrS9hF0ru45gmYxxAM82qfBYswWiDZE5%2BG7Bxx6GzY2nJy2vx7vZ%2BQQ4xElY0ofjDl1%2BEyV1n6AiNSDsb0CQ7XvGaq%2BE8yZYyLxK5pk6%2BCj17775sA42M%2FIEEB6hQ4lqN6ijFpuFg%2F3UlAu21cI5d12u87XPzdbki2TuQP1on2RxLQHR63p3p8oKqbMDlmHjGSr5Yxs6roV%2FEbzvCjLSV7V0zJXrW7zNp2FmE7Ktr5OKOJgV4BRQZwRwUWV82nOq21RyLKW1TWd8Js%2FJPttA563J0WS%2Fe07wM8zjm%2FNb7AEFJ8PqP8Pc5moXmNT6ziOdCypD3smOC8Yr1iCLOirC11%2BQHPGpy%2B0Qbe%2FIvMmmchzdph%2F8XINe8c2P5Lyarn2ndPP2a0PvYofFxW0ON84k%2B%2FOqBwAj1a7nbOGsHnD3v%2FK%2BT8%3D&RelayState=__HOST-arcacfe1c&SigAlg=http%3A%2F%2Fwww.w3.org%2F2001%2F04%2Fxmldsig-more%23rsa-sha256&Signature=RsWQh2bt%2By7ih8WWkUApZM7sLRUFZh4pXZX7nbGtY2FsG2Zjs6HWHualMwcJJ%2FeEHkzjgQ%2BjIF%2FTgZxh8aYg%2BO%2BgWrWOPEY2h6RQXcRSeXomYTetL8nOVOimTT8aWHTixFxcnk%2BOX8acJBRhH535pGn9sXf1wdK96VnFmUDKGjO6CsM7tv85cSyDZCoaqCxo%2F96vXd3QpJOXddr3h%2BoHqLBRQqL62SHbWOzTzU18kzMyegNuvpuUaAZe9rqj2TrbSQ2PpQ2iIpdITe8w8USUH3MCY9PjPGUWUKXeFK8DrRHHDWZ0Uxk7TTPb8OufqPSjvQz57hoWo6slB6VaVgCLxw%3D%3D' },
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
    <footer className="bg-[#074c30] text-white">
      <div className="relative w-full">
        <img
          src="/images/img_blue_background_shape_2.png"
          alt="Background"
          className="absolute top-0 left-0 h-full w-[690px] object-cover"
        />

        <div className="container mx-auto px-6 sm:px-10 lg:px-20 py-14 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Browse */}
            <div>
              <div className="border-b border-white/30 pb-2 mb-4">
                <h3 className="text-[16px] font-medium">Browse</h3>
              </div>
              <ul className="space-y-3">
                {browseLinks.map((item, idx) => (
                  <li key={idx}>
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[14px] hover:underline"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <div className="border-b border-white/30 pb-2 mb-4">
                <h3 className="text-[16px] font-medium">Contact & Support</h3>
              </div>
              <ul className="space-y-3 text-[14px] leading-5">
                <li>
                  <a href="https://www.swa.gov.sa/en/communication-channels" className="hover:underline">
                   contact us
                  </a>
                </li>
                <li>
                  <a href="https://www.swa.gov.sa/en/faq" className="hover:underline">
                    FAQs
                  </a>
                </li>
              </ul>
            </div>

            {/* Related Links */}
            <div>
              <div className="border-b border-white/30 pb-2 mb-4">
                <h3 className="text-[16px] font-medium">Related links</h3>
              </div>
              <ul className="space-y-3">
                {relatedLinks.map((link, idx) => (
                  <li key={idx}>
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[14px] hover:underline"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <div className="border-b border-white/30 pb-2 mb-4">
                <h3 className="text-[16px] font-medium">Follow us</h3>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
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

          {/* Footer Bottom */}
          <div className="mt-12 flex flex-col lg:flex-row items-center justify-between gap-6">
            <p className="text-[14px] font-semibold text-center lg:text-left">
              All rights reserved to the Saudi Water Authority © 2026
            </p>
            <div className="flex items-center gap-4 flex-wrap justify-center lg:justify-end">
              <a 
                href="https://www.swa.gov.sa/" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <img src="/images/img_swa_logo_outline_1.png" alt="SWA Logo" className="h-[50px] w-auto" />
              </a>
              <a 
                href="https://www.vision2030.gov.sa/" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <img src="/images/img_2030vision_1.svg" alt="Vision 2030" className="h-[50px] w-auto" />
              </a>
              <img src="/images/img_image_2.png" alt="Certificate" className="h-[50px] w-auto" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;