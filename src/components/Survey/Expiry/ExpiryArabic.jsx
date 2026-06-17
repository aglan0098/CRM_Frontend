import Navbar from "@/components/NavBar/NavbarArabic";
import Footer from "@/components/common/FooterArabic";
import { useNavigate } from 'react-router-dom';

export default function SurveyExpiredArabic() {
  const navigate = useNavigate();
  const handleHomeNavigation = () => {
    navigate('/');
  };

  const styles = `
    .container-rtl {
      min-height: calc(100vh - 200px); /* Adjust based on your navbar/footer height */
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 20px;
      padding: 40px 20px;
      direction: rtl;
      text-align: center;
    }

    .image_back-rtl{
      display: flex;
      width: 200px;
      height: 200px;
      padding: 40px;
      justify-content: center;
      align-items: center;
      aspect-ratio: 1/1;
      border-radius: var(--radius-full, 9999px);
      background: var(--Icon-Bg-icon-brand-light, #F3FCF6);
    }

    .headertext-rtl{
      color: var(--Text-text-default, #161616);
      font-family: "IBM Plex Sans Arabic", var(--Font-Family-font-family-display, "IBM Plex Sans"), sans-serif;
      font-size: var(--Size-Display-typo-size-display-xs, 24px);
      font-style: normal;
      font-weight: 600;
      line-height: var(--Line-Height-Display-line-heights-display-xs, 32px);
      text-align: center;
      margin: 0;
      direction: rtl;
    }

    .welcometext-rtl{
      color: var(--Text-text-default, #161616);
      font-family: "IBM Plex Sans Arabic", var(--Font-Family-font-family-text, "IBM Plex Sans"), sans-serif;
      font-size: var(--Size-Text-typo-size-text-Ig, 18px);
      font-style: normal;
      font-weight: 400;
      line-height: var(--Line-Height-Text-line-heights-text-Ig, 28px);
      text-align: center;
      margin: 0;
      max-width: 400px;
      direction: rtl;
    }

    .home-rtl{
      display: flex;
      height: 40px;
      min-height: 40px;
      max-height: 40px;
      padding: var(--Global-spacing-none, 0px) var(--Button-buttons-lg-padding, 16px);
      justify-content: center;
      align-items: center;
      gap: var(--Button-buttons-lg-gap, 4px);
      border-radius: var(--Radius-radius-sm, 4px);
      border: 1px solid #1B8354;
      background: var(--Button-button-background-primary-default, #1B8354);
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .home-rtl:hover {
      background-color: #0f6b40;
    }

    .linkcolro-rtl {
      color: #067647;
      font-family: "IBM Plex Sans Arabic", var(--Font-Family-font-family-text, "IBM Plex Sans"), sans-serif;
      font-size: var(--Size-Text-typo-size-text-Ig, 18px);
      font-style: normal;
      font-weight: 500;
      line-height: var(--Line-Height-Text-line-heights-text-Ig, 28px);
      text-decoration: underline;
      text-align: center;
      margin: 0;
      cursor: pointer;
      transition: color 0.2s ease;
      direction: ltr; /* Keep email as LTR */
    }

    .linkcolro-rtl:hover {
      color: #0f6b40;
    }

    .but-text-rtl{
      color: var(--Text-text-oncolor-primary, #FFF);
      font-family: "IBM Plex Sans Arabic", var(--Font-Family-font-family-text, "IBM Plex Sans"), sans-serif;
      font-size: var(--Size-Text-typo-size-text-md, 16px);
      font-style: normal;
      font-weight: 500;
      line-height: var(--Line-Height-Text-line-heights-text-md, 24px);
      margin: 0;
    }

    /* Additional RTL optimizations */
    .container-rtl * {
      letter-spacing: normal;
      word-spacing: normal;
    }

    /* Responsive adjustments for RTL */
    @media (max-width: 768px) {
      .container-rtl {
        padding: 20px 15px;
        gap: 15px;
      }
      
      .image_back-rtl {
        width: 150px;
        height: 150px;
        padding: 30px;
      }
      
      .headertext-rtl {
        font-size: 20px;
        line-height: 28px;
      }
      
      .welcometext-rtl {
        font-size: 16px;
        line-height: 24px;
        max-width: 300px;
      }
    }

    @media (max-width: 480px) {
      .container-rtl {
        padding: 15px 10px;
      }
      
      .image_back-rtl {
        width: 120px;
        height: 120px;
        padding: 20px;
      }
      
      .headertext-rtl {
        font-size: 18px;
        line-height: 24px;
      }
    }
  `;

  return (
    <>
      <Navbar/>
      <style>{styles}</style>
      <div className="container-rtl">
        <div className="image_back-rtl">
          <svg xmlns="http://www.w3.org/2000/svg" width="108" height="108" viewBox="0 0 108 108" fill="none">
            <path d="M1.34686 1.4668C2.81053 0.00156662 5.18532 0.000232577 6.65057 1.46387L106.651 101.357C108.116 102.821 108.117 105.196 106.654 106.661C105.19 108.126 102.815 108.128 101.35 106.664L92.7502 98.0732V104.026C92.7502 106.097 91.0712 107.776 89.0002 107.776C88.8518 107.776 88.7056 107.767 88.5617 107.75H19.4387C19.2948 107.767 19.1486 107.776 19.0002 107.776C18.8518 107.776 18.7056 107.767 18.5617 107.75H14.0002C11.9291 107.75 10.2502 106.071 10.2502 104C10.2502 101.929 11.9291 100.25 14.0002 100.25H15.2502V89.043C15.2502 73.618 24.2792 60.3032 37.342 54.0801C24.7246 48.0692 15.8715 35.4418 15.2824 20.6875L1.34979 6.77051C-0.115441 5.30684 -0.116774 2.93205 1.34686 1.4668ZM52.4992 57.8652C35.934 58.6475 22.7502 72.3108 22.7502 89.043V100.25H85.2502V90.5811L52.4992 57.8652ZM94.3127 0.25C96.3837 0.25 98.0627 1.92893 98.0627 4C98.0627 6.07107 96.3837 7.75 94.3127 7.75H92.9025C92.9032 7.84418 92.9038 7.93859 92.9045 8.0332C92.9244 10.9381 92.9456 14.0428 92.8889 16.9678C92.8054 21.2697 92.5527 25.6409 91.7619 28.8916C88.5404 42.1345 80.7883 48.4321 77.1066 51.4229C76.9209 51.5737 76.7451 51.7161 76.5812 51.8506C74.9803 53.1644 72.6178 52.9319 71.3039 51.3311C69.9901 49.7301 70.2224 47.3666 71.8234 46.0527C71.9856 45.9196 72.1566 45.7811 72.3342 45.6367C75.7529 42.8567 81.8531 37.8961 84.4748 27.1191C85.0511 24.7502 85.3065 21.118 85.3898 16.8223C85.4447 13.9915 85.4252 11.0725 85.4055 8.22656C85.4044 8.06747 85.4026 7.90861 85.4016 7.75H26.8127C24.7416 7.75 23.0627 6.07107 23.0627 4C23.0627 1.92893 24.7416 0.25 26.8127 0.25H94.3127Z" fill="#067647"/>
          </svg>
        </div>
        <h1 className="headertext-rtl">انتهت صلاحية الاستطلاع</h1>
        <p className="welcometext-rtl">هذا الاستطلاع لم يعد متاحاً</p>
        <p className="welcometext-rtl">يرجى التواصل مع الدعم الفني إذا كنت بحاجة إلى مساعدة.</p>
        <a className="linkcolro-rtl">CMP@SWA.GOV.SA</a>
        <button className="home-rtl" onClick={handleHomeNavigation}>
          <p className="but-text-rtl">العودة إلى الصفحة الرئيسية</p>
        </button>
      </div>
      <Footer/>
    </>
  );
}