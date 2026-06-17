import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Wait for the DOM to be fully updated
    const scrollToTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToTop();
        console.log('Final scroll position:', window.scrollY);
      });
    });

    // Also try after a longer delay for slow-loading content
    setTimeout(() => {
      scrollToTop();
      console.log('Delayed scroll position:', window.scrollY);
    }, 500);

  }, [pathname]);

  return null;
};

export default ScrollToTop;