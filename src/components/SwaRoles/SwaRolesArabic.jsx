import React, { useState } from 'react';
import BG from "../../styles/bg.png";

const SwaRolesArabic = () => {
  const roles = [
    {
      id: '1',
      title: 'حماية المستفيدين',
      description:
        'حماية المستفيدين من خلال تنظيم الموارد المائية وضمان استخدامها المستدام، مع مراقبة جودة الخدمات المقدمة. كما تعمل على رفع الوعي المجتمعي حول أهمية المحافظة على المياه وتوفر قنوات اتصال متنوعة لاستقبال الشكاوى والملاحظات.',
      icon: '/images/img_leading_icon copy.svg',
    },
    {
      id: '2',
      title: 'تخطيط وإدارة الأمن المائي',
      description:
        'تكامل مشاريع وخدمات سلسلة إمداد المياه وتعظيم الفوائد، وضمان توفر متطلبات الأمن المائي ووضع الخطط والبرامج اللازمة لذلك، ومراقبة وتحليل البيانات وقياس أداء الخدمات والمشاريع.',
      icon: '/images/img_leading_icon copy.svg',
    },
    {
      id: '3',
      title: 'الإشراف على تنفيذ التوجهات الاستراتيجية',
      description:
        'التكامل مع الاستراتيجيات الوطنية، وبرامج توطين صناعة قطاع المياه ورفع نسبة المحتوى المحلي، وبرامج تطبيق المعايير البيئية والاجتماعية وجودة الحياة، وبرامج تعزيز البحث والابتكار والتعاون الدولي للحلول المائية.',
      icon: '/images/img_leading_icon copy.svg',
    },
    {
      id: '4',
      title: 'تنظيم قطاع المياه',
      description:
        'إصدار التراخيص والتصاريح والإرشادات المتعلقة بالكيانات والأصول التشغيلية، وتحديد المواصفات ومعايير الجودة للمياه والخدمات ذات الصلة.',
      icon: '/images/img_leading_icon copy.svg',
    },
  ];

  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  // Close modal if clicking on background outside modal content
  const onModalBackgroundClick = (e) => {
    if (e.target.id === 'modal-background') closeModal();
  };

  return (
    <section
      className="relative py-16 px-6 sm:px-12 lg:px-24 bg-white overflow-hidden min-h-[800px]"
      style={{
        backgroundImage: `url(${BG})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      dir="rtl"
    >
      <img
        src="/images/img_vector_1041x1546.png"
        alt="خلفية المتجه"
        className="absolute top-0 left-0 h-full w-full object-contain opacity-10 z-0 pointer-events-none"
      />

      <div className="relative z-10">
        <div className="mb-12 max-w-4xl">
          <h2 className="text-4xl sm:text-5xl font-ibm-plex font-medium text-text-primary mb-4 text-right">
            أدوار هيئة المياه السعودية
          </h2>
          <p className="text-base sm:text-lg font-ibm-plex text-text-secondary text-right">
            تتمتع هيئة المياه السعودية بولاية تعزيز المحافظة على المياه <br />
            وضمان توفرها للجميع. أدوار هيئة المياه السعودية هي:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role, index) => (
            <div
              key={role.id}
              className="flex flex-col h-full bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center mb-4 justify-end">
                <div className="w-10 h-10 rounded-full bg-[#1b8354] text-white flex items-center justify-center text-xl font-bold">
                  {`0${index + 1}`}
                </div>
              </div>

              <div className="flex flex-col flex-grow">
                <h3 className="text-base font-semibold text-text-primary mb-2 text-right">{role.title}</h3>
                <p className="text-sm text-text-secondary line-clamp-[6] text-right">{role.description}</p>
              </div>

              <div className="mt-4 flex justify-start">
                {/* Button to open the "Under Development" modal */}
                <button
                  type="button"
                  onClick={openModal}
                  className="w-10 h-10 bg-[#1b8354] rounded flex items-center justify-center hover:opacity-90"
                  aria-label={`فتح نافذة قيد التطوير لـ ${role.title}`}
                >
                  <img src={role.icon} alt={role.title} className="w-6 h-6" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Under Development Modal */}
      {showModal && (
        <div
          id="modal-background"
          onClick={onModalBackgroundClick}
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          aria-modal="true"
          role="dialog"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <div
            className="rounded-lg w-[350px] max-w-full p-6 relative shadow-lg"
            style={{ backgroundColor: '#006C45' }}
            dir="rtl"
          >
            <button
              onClick={closeModal}
              className="absolute top-4 left-4 text-white hover:text-gray-200 text-2xl font-bold focus:outline-none"
              aria-label="إغلاق النافذة المنبثقة"
            >
              &times;
            </button>
            <h2
              id="modal-title"
              className="text-2xl font-semibold mb-4 text-white text-right"
            >
              قيد التطوير
            </h2>
            <p id="modal-description" className="text-white text-base text-right">
              هذه الميزة قيد التطوير حالياً. يرجى المراجعة لاحقاً.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default SwaRolesArabic;