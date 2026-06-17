export default function SurveyCompletedArabic() {


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

    .welcometext{
      color: var(--Text-text-default, #161616);
      font-family: "IBM Plex Sans Arabic", var(--Font-Family-font-family-text, "IBM Plex Sans"), sans-serif;
      font-size: var(--Size-Text-typo-size-text-Ig, 18px);
      font-style: normal;
      font-weight: 400;
      line-height: var(--Line-Height-Text-line-heights-text-Ig, 28px);
      text-align: center;
      margin: 0;
      max-width: 500px;
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
      
      .welcometext {
        font-size: 16px;
        line-height: 24px;
        max-width: 350px;
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
      
      .image_back-rtl svg {
        width: 100px;
        height: 100px;
      }
      
      .headertext-rtl {
        font-size: 18px;
        line-height: 24px;
      }
      
      .welcometext {
        max-width: 280px;
      }
    }

    /* Better line height for Arabic text readability */
    .headertext-rtl,
    .welcometext {
      line-height: 1.6;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="container-rtl">
        <div className="image_back-rtl">
          <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 120 120" fill="none">
            <path d="M60 6.25C65.6116 6.25 71.0294 7.11081 76.124 8.71094C78.0998 9.33161 79.1987 11.4373 78.5781 13.4131C77.9574 15.3888 75.8518 16.4868 73.876 15.8662C69.5003 14.492 64.8403 13.75 60 13.75C34.4568 13.75 13.75 34.4568 13.75 60C13.75 85.5432 34.4568 106.25 60 106.25C85.5432 106.25 106.25 85.5432 106.25 60C106.25 55.1597 105.508 50.4997 104.134 46.124C103.513 44.1482 104.611 42.0426 106.587 41.4219C108.563 40.8013 110.668 41.9002 111.289 43.876C112.889 48.9706 113.75 54.3884 113.75 60C113.75 89.6853 89.6853 113.75 60 113.75C30.3147 113.75 6.25 89.6853 6.25 60C6.25 30.3147 30.3147 6.25 60 6.25ZM102.214 12.4912C103.599 10.9519 105.97 10.8274 107.51 12.2129C109.049 13.5984 109.174 15.9694 107.788 17.5088L62.7871 67.5088C62.0989 68.2733 61.1269 68.722 60.0986 68.749C59.0702 68.7761 58.0761 68.3788 57.3486 67.6514L39.8486 50.1514C38.3842 48.6869 38.3842 46.3131 39.8486 44.8486C41.3131 43.3842 43.6869 43.3842 45.1514 44.8486L59.8564 59.5537L102.214 12.4912Z" fill="#067647"/>
          </svg>
        </div>
        <h1 className="headertext-rtl">Field Inspection Completed</h1>
        <p className="welcometext">.The Field Inspection task has been successfully completed</p>
      </div>
    </>
  );
}