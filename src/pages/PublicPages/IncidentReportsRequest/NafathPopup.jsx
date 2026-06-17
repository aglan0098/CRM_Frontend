import React, { useState, useEffect } from 'react';
import { X, Loader2, CheckCircle } from 'lucide-react';
import config from '@/utils/config';
import nafath from '@/assets/images/nafath.svg';
import line from '@/assets/images/line.svg';
import swa from '@/assets/images/swa.svg';

const NafathPopup = ({ isOpen, onClose, onSuccess, language = 'ar' }) => {
  const isRtl = language === 'ar';
  const [nationalId, setNationalId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: Input, 2: Waiting
  const [transId, setTransId] = useState('');
  const [randomNumber, setRandomNumber] = useState('');

  // Translations
  const t = {
    ar: {
      title: 'التحقق من الهوية',
      description: 'التحقق من الهوية للمواطنين و المقيمين',
      nationalIdLabel: 'رقم الهوية / الإقامة',
      nationalIdPlaceholder: 'أدخل 10 أرقام',
      verify: 'تحقق',
      cancel: 'إلغاء',
      waitingTitle: 'في انتظار تأكيد النفاذ الوطني',
      waitingDesc: 'يرجى فتح تطبيق نفاذ وتأكيد الطلب باختيار الرقم',
      loading: 'جاري التحقق...',
      errors: {
        validation: 'رقم الهوية يجب أن يكون 10 أرقام',
        badRequest: 'تم رفض الطلب من نفاذ',
        unauthorized: 'مشكلة في المصادقة',
        forbidden: 'صلاحيات غير كافية',
        internal: 'خطأ داخلي في نفاذ',
        expired: 'انتهت صلاحية الجلسة أو بيانات خاطئة',
        default: 'حدث خطأ غير متوقع'
      }
    },
    en: {
      title: 'Identity Verification',
      description: 'Identity verification for citizens and residents',
      nationalIdLabel: 'National ID / Iqama',
      nationalIdPlaceholder: 'Enter 10 digits',
      verify: 'Verify',
      cancel: 'Cancel',
      waitingTitle: 'Waiting for Nafath Confirmation',
      waitingDesc: 'Please open the Nafath app and confirm the request by selecting the number',
      loading: 'Verifying...',
      errors: {
        validation: 'National ID must be 10 digits',
        badRequest: 'Request rejected by Nafath',
        unauthorized: 'Authentication issue',
        forbidden: 'Insufficient permissions',
        internal: 'Internal Nafath error',
        expired: 'Session expired or invalid data',
        default: 'An unexpected error occurred'
      }
    }
  };

  const texts = t[language];

  useEffect(() => {
    let intervalId;
    if (step === 2 && transId && randomNumber) {
      intervalId = setInterval(async () => {
        try {
          const response = await fetch(`${config.API_BASE_URL}/api/nafath-apigee/check-status`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              nationalId,
              transId,
              randomNumber
            })
          });

          if (response.status === 404 || response.status === 400 || response.status === 401 || response.status === 403 || response.status === 500) {
            clearInterval(intervalId);
            setStep(1);
            let errorMsg = texts.errors.default;
            if (response.status === 400) errorMsg = texts.errors.badRequest;
            if (response.status === 401) errorMsg = texts.errors.unauthorized;
            if (response.status === 403) errorMsg = texts.errors.forbidden;
            if (response.status === 404) errorMsg = texts.errors.expired;
            if (response.status === 500) errorMsg = texts.errors.internal;
            setError(errorMsg);
            return;
          }

          if (!response.ok) return;

          const data = await response.json();
          if (data.status === 'COMPLETED') {
            clearInterval(intervalId);
            // Store JWT token in sessionStorage
            if (data.token) {
              sessionStorage.setItem('nafath_jwt_token', data.token);
            }

            // Store session data for 30 minutes persistence
            const sessionData = {
              data: {
                person: data.person,
                nationalId
              },
              token: data.token || '',
              expiresAt: Date.now() + 30 * 60 * 1000 // 30 minutes
            };
            localStorage.setItem('nafath_session_incident', JSON.stringify(sessionData));

            onSuccess({
              person: data.person,
              nationalId
            });
          } else if (data.status === 'EXPIRED') {
            clearInterval(intervalId);
            setStep(1);
            setError(texts.errors.expired);
          }
        } catch (err) {
          console.error('Check status error:', err);
        }
      }, 5000); // Check every 5 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [step, transId, randomNumber, nationalId, onSuccess, texts]);

  if (!isOpen) return null;

  const isValid = nationalId.length === 10 && /^\d+$/.test(nationalId);

  const handleVerify = async () => {
    if (!isValid) return;
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${config.API_BASE_URL}/api/nafath-apigee/send-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nationalId })
      });

      if (!response.ok) {
        let errorMsg = texts.errors.default;
        if (response.status === 400) errorMsg = texts.errors.badRequest;
        if (response.status === 401) errorMsg = texts.errors.unauthorized;
        if (response.status === 403) errorMsg = texts.errors.forbidden;
        if (response.status === 500) errorMsg = texts.errors.internal;
        throw new Error(errorMsg);
      }

      const data = await response.json();
      if (data.transId && data.random) {
        setTransId(data.transId);
        setRandomNumber(data.random);
        setStep(2);
      } else {
        throw new Error(texts.errors.default);
      }
    } catch (err) {
      setError(err.message || texts.errors.default);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative">
        <button onClick={onClose} className="absolute top-4 end-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
        <div className="text-center mt-6 p-6 border-b border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">{texts.title}</h3>
          <p className="text-md font-medium text-gray-500">{texts.description}</p>
        </div>

        <div className="flex justify-center mt-4 gap-4">
          <img src={swa} alt="swa" className="w-24 h-24" />
          <img src={line} alt="line" className="w-24 h-24" />
          <img src={nafath} alt="nafath" className="w-24 h-24" />
        </div>

        <div className="p-3">
          {step === 1 ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {texts.nationalIdLabel}
                </label>
                <input
                  type="text"
                  maxLength={10}
                  value={nationalId}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setNationalId(val);
                  }}
                  placeholder={texts.nationalIdPlaceholder}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e7b51]"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="pt-4 flex gap-3">
                <button
                  onClick={handleVerify}
                  disabled={!isValid || loading}
                  className="flex-1 py-3 px-4 bg-[#1e7b51] text-white rounded-xl font-bold hover:bg-[#165a3b] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : texts.verify}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6 py-4">
              <div className="w-24 h-24 bg-[#1e7b51]/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-4xl font-bold text-[#1e7b51]">{randomNumber}</span>
              </div>

              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{texts.waitingTitle}</h4>
                <p className="text-gray-500 text-sm">{texts.waitingDesc}</p>
              </div>

              <div className="flex justify-center">
                <div className="flex items-center gap-2 text-[#1e7b51]">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm font-medium">{texts.loading}</span>
                </div>
              </div>

              <button
                onClick={() => setStep(1)}
                className="text-gray-500 hover:text-gray-700 text-sm font-medium underline"
              >
                {texts.cancel}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NafathPopup;
