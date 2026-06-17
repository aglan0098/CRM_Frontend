import { useEffect, useState } from "react";
import { getStoredLanguage, setupLanguageListener } from "./LanguageUtils";

const useHamsChatbot = () => {
  const [currentLang, setCurrentLang] = useState(getStoredLanguage());

  useEffect(() => {
    // Listen for language changes and update the state
    const cleanup = setupLanguageListener((newLang) => {
      setCurrentLang(newLang);
    });
    return cleanup;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const enforceRightPosition = () => {
      const container = document.getElementById("hams-widget-container");
      if (container && container.shadowRoot) {
        let style = container.shadowRoot.getElementById("hams-custom-position");
        if (!style) {
          style = document.createElement("style");
          style.id = "hams-custom-position";
          container.shadowRoot.appendChild(style);
        }
        // Force the widget button and pop-up to always be on the right
        style.textContent = `
          .fixed.z-50 {
             left: auto !important;
             right: 16px !important;
          }
          @media (min-width: 640px) {
            .fixed.z-999 {
               left: auto !important;
               right: 16px !important;
            }
          }
          .origin-bottom-left {
             transform-origin: bottom right !important;
          }
        `;
      }
    };

    const initWidget = () => {
      if (window.HamsWidget && window.HamsWidget.load) {
        window.HamsWidget.load({
          agentId:
            currentLang === "ar"
              ? "18e35b55-885f-4fa2-bac2-2f8ec45ba868"
              : "ebef8147-7a18-4eb9-a7ce-f26fce904c44",
          environment: "production",
          publicKey: "pk_A6j_KmQ8p1_kKtIh8WXNzZ4ZAbqxuPCgH2xgsEQJnJU",
        });
        
        // Apply custom position styles after a short delay to ensure Shadow DOM is ready
        setTimeout(enforceRightPosition, 100);
        setTimeout(enforceRightPosition, 500);
        setTimeout(enforceRightPosition, 1500);
      }
    };

    const isScriptLoaded = document.querySelector('script[src="https://storage.googleapis.com/hams-chatbot/widget_v2.js"]');

    if (!isScriptLoaded) {
      const s = document.createElement("script");
      s.src = "https://storage.googleapis.com/hams-chatbot/widget_v2.js";
      s.async = true;

      s.onload = () => {
        setTimeout(initWidget, 100);
      };

      document.head.appendChild(s);
    } else {
      // Script is already loaded, just re-initialize the widget for the new language
      initWidget();
    }
  }, [currentLang]);
};

export default useHamsChatbot;