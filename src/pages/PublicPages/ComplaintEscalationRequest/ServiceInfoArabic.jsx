import React from 'react';
import  tag_aud from './public/images/img_user.svg'
import  clock01 from './public/images/img_clock01.svg'
import  phone from './public/images/img_computerphonesync.svg'
import  money from './public/images/img_money04.svg'
import  faq from './public/images/img_linksquare02.svg'
import  call from './public/images/img_call.svg'
import  mail from './public/images/img_mail01.svg'

const ServiceInfoArabic = () => {
  return (
    <div className="bg-white rounded-2xl border border-border-primary p-10" dir="rtl">
      <div className="flex items-start mb-10">
        <img src={tag_aud} alt="أيقونة المستخدم" className="w-6 h-6 mt-1" />
        <div className="mr-8">
          <h3 className="text-base font-bold text-text-secondary mb-1">الجمهور المستهدف</h3>
          <p className="text-base text-text-secondary">فردي</p>
        </div>
      </div>
      <div className="flex items-start mb-10">
        <img src={clock01} alt="أيقونة الساعة" className="w-6 h-6 mt-1" />
        <div className="mr-8">
          <h3 className="text-base font-bold text-text-secondary mb-1">مدة الخدمة</h3>
          <p className="text-base text-text-secondary">10 يوم</p>
        </div>
      </div>
      
      <div className="flex items-start mb-10">
        <img src={phone} alt="أيقونة القنوات" className="w-6 h-6 mt-1" />
        <div className="mr-8">
          <h3 className="text-base font-bold text-text-secondary mb-1">قنوات الخدمة</h3>
          <p className="text-base text-text-secondary">بوابة الخدمات</p>
        </div>
      </div>
      
      <div className="flex items-start mb-10">
        <img src={money} alt="أيقونة التكلفة" className="w-6 h-6 mt-1" />
        <div className="mr-8">
          <h3 className="text-base font-bold text-text-secondary mb-1">تكلفة الخدمة</h3>
          <p className="text-base text-text-secondary">مجاني</p>
        </div>
      </div>
      
      <hr className="border-t border-border-primary mb-6" />
      
      <h2 className="text-lg font-bold text-text-secondary mb-4">الأسئلة الشائعة</h2>
      
      <a href="#" className="flex items-center text-text-green mb-10">
        <span className="text-base">صفحة الأسئلة الشائعة - هيئة المياه والصرف الصحي</span>
        <img src={faq} alt="رابط خارجي" className="w-5 h-5 mr-2" />
      </a>
      
      <div className="flex items-start mb-4">
        <img src={call} alt="أيقونة الهاتف" className="w-6 h-6 mt-1" />
        <div className="mr-8">
          <h3 className="text-base font-bold text-text-secondary mb-1">الهاتف</h3>
          <a href="tel:0181188111" className="flex items-center text-text-green">
            <span className="text-base">0181188111</span>
            <img src={faq} alt="رابط خارجي" className="w-5 h-5 mr-2" />
          </a>
        </div>
      </div>
      
      <div className="flex items-start">
        <img src={mail} alt="أيقونة البريد الإلكتروني" className="w-6 h-6 mt-1" />
        <div className="mr-8">
          <h3 className="text-base font-bold text-text-secondary mb-1">البريد الإلكتروني</h3>
          <a href="mailto:GDL@SWA.GOV.SA" className="flex items-center text-text-green">
            <span className="text-base">GDL@SWA.GOV.SA</span>
            <img src={faq} alt="رابط خارجي" className="w-5 h-5 mr-2" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ServiceInfoArabic;