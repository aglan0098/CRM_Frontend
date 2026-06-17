import React from 'react';

const StepsFlow = ({ currentStep = 1, language = 'en' }) => {
  const translations = {
    en: {
      assets: 'Assets',
      projectInformation: 'Project Information',
      contracts: 'Contracts',
      declaration: 'Declaration',
    },
    ar: {
      assets: 'الأصول',
      projectInformation: 'معلومات المشروع',
      contracts: 'العقود',
      declaration: 'الإقرار',
    },
  };

  const t = translations[language] || translations.en;
  const fontClass = "font-['IBM_Plex_Sans_Arabic']";
  const isRTL = language === 'ar';

  const steps = [
    { id: 1, title: t.assets },
    { id: 2, title: t.projectInformation },
    { id: 3, title: t.contracts },
    { id: 4, title: t.declaration }
  ];

  return (
    <div className={`w-full mx-auto px-8 ${fontClass} ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="relative">
        {/* Continuous horizontal line */}
        <div 
          className="absolute top-4 h-0.5 bg-gray-300" 
          style={isRTL ? { right: '32px', left: '-32px' } : { left: '32px', right: '-32px' }}
        ></div>
        
        {/* Green progress line - only show from step 1 to current step */}
        {currentStep > 1 && (
          <div 
            className="absolute top-4 h-0.5 bg-[#1B8354] z-10" 
            style={
              isRTL 
                ? { 
                    right: '32px', 
                    width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`
                  }
                : { 
                    left: '32px', 
                    width: `${((currentStep - 1) / (steps.length - 1)) * (100 - 8)}%`
                  }
            }
          ></div>
        )}
        
        {/* Steps container */}
        <div className="flex justify-between relative">
          {steps.map((step, index) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            
            return (
              <div key={step.id} className="flex flex-col items-center relative">
                {/* Step Circle */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 relative z-20 ${
                    isCompleted
                      ? 'text-white bg-[#1B8354] border-[#1B8354]'
                      : isCurrent
                      ? 'text-black bg-white border-teal-600'
                      : 'text-gray-400 bg-white border-gray-300'
                  }`}
                >
                  {isCompleted ? '✓' : step.id}
                </div>
                
                {/* Step Title */}
                <div
                  className={`mt-3 text-sm font-medium whitespace-nowrap ${
                    isCompleted || isCurrent
                      ? 'text-black'
                      : 'text-gray-400'
                  }`}
                >
                  {step.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StepsFlow;