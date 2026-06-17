import React, { useState, useEffect } from "react";
import "./NavbarArabic.css";
import {
  FaChevronDown,
  FaSearch,
  FaGlobeAmericas,
  FaMoon,
  FaBell,
  FaExternalLinkAlt,
  FaUser,
  FaBars,
  FaTimes,
  FaSignOutAlt
} from "react-icons/fa";
import SWAlogo from "./assest/SWA.png";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { checkUserExists, deleteUser } from "../Login/Firestore_SMS_CRMAuth/APIs";
import sessionManager from "@/utils/sessionManager";

// Helper function to get stored language with fallback
const getStoredLanguage = () => {
  try {
    const storedLanguage = localStorage.getItem('swa_user_language');
    // Validate that it's a supported language
    if (storedLanguage && ['en', 'ar'].includes(storedLanguage)) {
      return storedLanguage;
    }
  } catch (error) {
    console.warn('Error accessing localStorage for language:', error);
  }
  return 'en'; // Default fallback
};

// Helper function to store language safely
const storeLanguage = (language) => {
  try {
    localStorage.setItem('swa_user_language', language);
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: language }));
  } catch (error) {
    console.warn('Error storing language in localStorage:', error);
  }
};

const dropdownItems = {
  "من نحن": ["من نحن", "مهمتنا", "الفريق"],
  "مركز المعلومات": ["التقارير", "الإحصائيات", "المنشورات"],
  "نظام قطاع المياه": ["البنية التحتية", "الإدارة", "التكنولوجيا"],
  "المركز الإعلامي": ["الأخبار", "البيانات الصحفية", "المعرض"],
  "اتصل بنا": ["المواقع", "ملاحظات", "الشكاوى"],
};

const NavbarArabic = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState(getStoredLanguage());
  // ADD this loading state:
const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const navigate = useNavigate();
  
  // Check if user is logged in on component mount and on localStorage changes
  useEffect(() => {
    checkLoginStatus();
    
    // Listen for storage events (in case user logs in/out in another tab)
    const handleStorageChange = () => {
      checkLoginStatus();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Listen for language changes
    const handleLanguageChange = () => {
      setCurrentLanguage(getStoredLanguage());
    };
    
    window.addEventListener('storage', handleLanguageChange);
    window.addEventListener('languageChanged', handleLanguageChange);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('storage', handleLanguageChange);
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, []);

  // Helper function to handle user not found scenarios
  const handleUserNotFound = () => {
    localStorage.removeItem('swa_user'); // Clean up invalid data
    setIsLoggedIn(false);
    setUserData(null);
    setUserName('');
    setUserPhone('');
  };
  // Add this helper function at the top of your NavbarArabic component
const getArabicDisplayName = (userData) => {
  console.log('Getting Arabic name for userData:', userData); // Debug log
  
  // Try combining firstNameara + lastNameara
  if (userData.firstNameara || userData.lastNameara) {
    const arabicName = `${userData.firstNameara || ''} ${userData.lastNameara || ''}`.trim();
    if (arabicName) {
      console.log('Using Arabic names:', arabicName);
      return arabicName;
    }
  }
  
  // Fallback to English names if Arabic names not available
  if (userData.fullName && userData.fullName.trim()) {
    console.log('Falling back to fullName:', userData.fullName);
    return userData.fullName.trim();
  }
  
  // Last resort: combine English first + last names
  const englishName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim();
  if (englishName) {
    console.log('Falling back to English first+last:', englishName);
    return englishName;
  }
  
  console.log('No name found, using default');
  return 'المستخدم';
};
  // Replace your checkLoginStatus function with this fixed version:
const checkLoginStatus = async () => {
  setIsCheckingAuth(true);
  const storedUser = localStorage.getItem('swa_user');
  if (storedUser) {
    try {
      const parsedData = JSON.parse(storedUser);
      
      if (parsedData.userId) {
        // Add retry logic for API calls
        let retries = 3;
        let response;
        
        while (retries > 0) {
          try {
            response = await checkUserExists(parsedData.userId);
            break;
          } catch (error) {
            retries--;
            if (retries === 0) {
              // After all retries failed, keep user logged in but log the error
              console.error("Failed to verify user after retries:", error);
              // Use stored data to keep user logged in with Arabic name
              setIsLoggedIn(true);
              const displayName = getArabicDisplayName(parsedData);
              setUserName(displayName);
              setUserPhone(parsedData.phone || '');
              setIsCheckingAuth(false);
              return;
            }
            // Wait 1 second before retry
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
        
        if (response && response.success && response.exists && response.user) {
          setIsLoggedIn(true);
          setUserData(response.user);
          console.log("Full user data received:", response.user);
          
          // Use Arabic name display function
          const displayName = getArabicDisplayName(response.user);
          console.log("Setting Arabic display name to:", displayName);
          setUserName(displayName);
          setUserPhone(response.user.phone || '');
        } else if (response) {
          // Only clear data if API explicitly says user doesn't exist
          console.warn("User not found on server, logging out");
          handleUserNotFound();
        }
      } else {
        handleUserNotFound();
      }
    } catch (error) {
      console.error("Error parsing stored user data:", error);
      // Don't automatically log out on parsing errors either
      // Only clear if data is definitely corrupted
      try {
        JSON.parse(storedUser); // Test if it's valid JSON
        // If we reach here, JSON is valid but missing userId
        handleUserNotFound();
      } catch {
        // JSON is corrupted, clear it
        handleUserNotFound();
      }
    }
  } else {
    handleUserNotFound();
  }
  setIsCheckingAuth(false);
};

  const handleLoginClick = () => {
    navigate('/login');
  };
  
  const handleLogout = async () => {
    try {
      await sessionManager.logout();
    } catch (error) {
      console.error("Error during logout:", error);
    }
    setIsLoggedIn(false);
    setUserData(null);
    setUserName('');
    setUserPhone('');
    setUserDropdownOpen(false);
    navigate('/');
  };

  const handleLanguageChange = (language) => {
    storeLanguage(language);
    setCurrentLanguage(language);
    setLangDropdownOpen(false);
    
    // Force a page refresh to reload the appropriate language component
    window.location.reload();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".dropdown") && !e.target.closest(".lang-switch") && !e.target.closest(".user-dropdown")) {
        setOpenDropdown(null);
        setLangDropdownOpen(false);
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleDropdown = (key) => {
    setOpenDropdown((prev) => (prev === key ? null : key));
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className={`lang-${currentLanguage} ${currentLanguage === 'ar' ? 'rtl' : 'ltr'}`}>
      <nav className="navbar-arabic" style={{ direction: currentLanguage === 'ar' ? 'rtl' : 'ltr' }}>
        {/* Mobile Hamburger Menu (only visible on mobile) */}
        <div className="mobile-menu-toggle-arabic" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* Logo - positioned left on desktop, right on mobile */}
        <Link to="/" className="logo-container-arabic">
          <img src={SWAlogo} className="logo-arabic" alt="شعار هيئة المياه" />
        </Link>

        {/* Desktop Navigation (visible on desktop) */}
        <div className="nav-left-arabic">
          <ul className="nav-menu-arabic">
            {Object.keys(dropdownItems).map((title, index, array) => (
              <React.Fragment key={title}>
                <li
                  className={`nav-item-arabic dropdown-arabic ${
                    openDropdown === title ? "show-arabic" : ""
                  }`}
                >
                  <a
                    href="#"
                    className="nav-link-arabic"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleDropdown(title);
                    }}
                  >
                    {title}{" "}
                    <FaChevronDown
                      className={`icon-arabic chevron-icon-arabic ${
                        openDropdown === title ? "rotate-arabic" : ""
                      }`}
                    />
                  </a>
                  <div
                    className={`dropdown-content-arabic ${
                      openDropdown === title ? "show-arabic" : ""
                    }`}
                  >
                    {dropdownItems[title].map((subItem) => (
                      <a href="#" key={subItem}>
                        {subItem}
                      </a>
                    ))}
                  </div>
                </li>
                {title === "من نحن" && (
                  <li className="nav-item-arabic" key="Services">
                    <a
                      href="#services"
                      className="nav-link-arabic"
                      onClick={(e) => {
                        e.preventDefault();
                        const element = document.getElementById("services");
                        if (element) {
                          element.scrollIntoView({ behavior: "smooth" });
                        } else {
                          console.warn("Element with id 'services' not found");
                        }
                      }}
                    >
                      الخدمات
                    </a>
                  </li>
                )}
              </React.Fragment>
            ))}
          </ul>
        </div>

        {/* Desktop Right Side (visible on desktop) */}
        <div className="nav-right-arabic">
          <FaSearch className="nav-icon-arabic" />

          <div
            className={`lang-switch-arabic dropdown-arabic ${
              langDropdownOpen ? "show-arabic" : ""
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setLangDropdownOpen((prev) => !prev);
              setOpenDropdown(null);
              setUserDropdownOpen(false);
            }}
          >
            <FaGlobeAmericas className="nav-icon-arabic" />
            <span>عر</span>
            <FaChevronDown
              className={`icon-arabic chevron-icon-arabic ${
                langDropdownOpen ? "rotate-arabic" : ""
              }`}
            />
            <div
              className={`dropdown-content-arabic ${
                langDropdownOpen ? "show-arabic" : ""
              }`}
            >
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  handleLanguageChange('ar');
                }}
                className={currentLanguage === 'ar' ? 'active' : ''}
              >
                العربية
              </a>
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  handleLanguageChange('en');
                }}
                className={currentLanguage === 'en' ? 'active' : ''}
              >
                English
              </a>
            </div>
          </div>

          <FaMoon className="nav-icon-arabic" />
          <FaBell className="nav-icon-arabic" />

          {/* Conditional rendering with loading state */}
{isCheckingAuth ? (
  <div className="auth-loading-arabic">
    <div className="loading-placeholder-arabic"></div>
  </div>
) : !isLoggedIn ? (
  <button className="login-btn-arabic" onClick={handleLoginClick}>
    تسجيل الدخول <FaExternalLinkAlt className="login-arrow-arabic" />
  </button>
) : (
  <div className="user-dropdown-container-arabic">
    <div
      className={`user-dropdown-arabic ${userDropdownOpen ? "show-arabic" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        setUserDropdownOpen(!userDropdownOpen);
        setOpenDropdown(null);
        setLangDropdownOpen(false);
      }}
    >
      <FaUser className="nav-icon-arabic user-icon-arabic" />
      <span className="username-arabic">{userName || 'المستخدم'}</span>
      <FaChevronDown
        className={`icon-arabic chevron-icon-arabic ${
          userDropdownOpen ? "rotate-arabic" : ""
        }`}
      />
      <div
        className={`dropdown-content-arabic ${
          userDropdownOpen ? "show-arabic" : ""
        }`}
      >
        <Link to="/Dashboard">الخدمات الإلكترونية</Link>
        <div className="user-info-arabic">
          <div className="user-name-arabic">{userName}</div>
          <div className="user-phone-arabic">{userPhone}</div>
        </div>
        <a href="#" onClick={handleLogout}>
          <FaSignOutAlt className="logout-icon-arabic" /> تسجيل الخروج
        </a>
      </div>
    </div>
  </div>
)}
        </div>

        {/* Mobile Menu (only visible when toggled) */}
        <div className={`mobile-menu-arabic ${mobileMenuOpen ? "open-arabic" : ""}`}>
          <ul className="mobile-nav-menu-arabic">
            {Object.keys(dropdownItems).map((title, index, array) => (
              <React.Fragment key={title}>
                <li
                  className={`mobile-nav-item-arabic dropdown-arabic ${
                    openDropdown === title ? "show-arabic" : ""
                  }`}
                >
                  <a
                    href="#"
                    className="mobile-nav-link-arabic"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleDropdown(title);
                    }}
                  >
                    {title}{" "}
                    <FaChevronDown
                      className={`icon-arabic chevron-icon-arabic ${
                        openDropdown === title ? "rotate-arabic" : ""
                      }`}
                    />
                  </a>
                  <div
                    className={`mobile-dropdown-content-arabic ${
                      openDropdown === title ? "show-arabic" : ""
                    }`}
                  >
                    {dropdownItems[title].map((subItem) => (
                      <a href="#" key={subItem} onClick={closeMobileMenu}>
                        {subItem}
                      </a>
                    ))}
                  </div>
                </li>
                {title === "من نحن" && (
                  <li className="mobile-nav-item-arabic" key="Services">
                    <a
                      href="#services"
                      className="mobile-nav-link-arabic"
                      onClick={(e) => {
                        e.preventDefault();
                        const element = document.getElementById("services");
                        if (element) {
                          element.scrollIntoView({ behavior: "smooth" });
                        } else {
                          console.warn("Element with id 'services' not found");
                        }
                        closeMobileMenu();
                      }}
                    >
                      الخدمات
                    </a>
                  </li>
                )}
              </React.Fragment>
            ))}
          </ul>

          <div className="mobile-nav-right-arabic">
            <div className="mobile-nav-icons-arabic">
              <FaSearch className="mobile-nav-icon-arabic" />
              <div
                className={`mobile-lang-switch-arabic dropdown-arabic ${
                  langDropdownOpen ? "show-arabic" : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setLangDropdownOpen((prev) => !prev);
                  setOpenDropdown(null);
                  setUserDropdownOpen(false);
                }}
              >
                <FaGlobeAmericas className="mobile-nav-icon-arabic" />
                <span>عر</span>
                <FaChevronDown
                  className={`icon-arabic chevron-icon-arabic ${
                    langDropdownOpen ? "rotate-arabic" : ""
                  }`}
                />
                <div
                  className={`mobile-dropdown-content-arabic ${
                    langDropdownOpen ? "show-arabic" : ""
                  }`}
                >
                  <a 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      handleLanguageChange('ar');
                      closeMobileMenu();
                    }}
                    className={currentLanguage === 'ar' ? 'active' : ''}
                  >
                    العربية
                  </a>
                  <a 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      handleLanguageChange('en');
                      closeMobileMenu();
                    }}
                    className={currentLanguage === 'en' ? 'active' : ''}
                  >
                    English
                  </a>
                </div>
              </div>
              <FaMoon className="mobile-nav-icon-arabic" />
              <FaBell className="mobile-nav-icon-arabic" />
            </div>

            {/* Conditional rendering for mobile menu with loading */}
{isCheckingAuth ? (
  <div className="mobile-auth-loading-arabic">
    <div className="mobile-loading-placeholder-arabic"></div>
  </div>
) : !isLoggedIn ? (
  <button className="mobile-login-btn-arabic" onClick={() => {
    navigate('/Enter');
    closeMobileMenu();
  }}>
    تسجيل الدخول <FaExternalLinkAlt className="login-arrow-arabic" />
  </button>
) : (
  <div className="mobile-user-dropdown-container-arabic">
    <div
      className={`mobile-user-dropdown-arabic ${userDropdownOpen ? "show-arabic" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        setUserDropdownOpen(!userDropdownOpen);
        setOpenDropdown(null);
        setLangDropdownOpen(false);
      }}
    >
      <FaUser className="mobile-nav-icon-arabic user-icon-arabic" />
      <span>{userName || 'الحساب'}</span>
      <FaChevronDown
        className={`icon-arabic chevron-icon-arabic ${
          userDropdownOpen ? "rotate-arabic" : ""
        }`}
      />
      <div
        className={`mobile-dropdown-content-arabic ${
          userDropdownOpen ? "show-arabic" : ""
        }`}
      >
        <Link to="/DashBoard" onClick={closeMobileMenu}>الخدمات الإلكترونية</Link>
        <a href="#" onClick={() => {
          handleLogout();
          closeMobileMenu();
        }}>
          <FaSignOutAlt className="logout-icon-arabic" /> تسجيل الخروج
        </a>
      </div>
    </div>
  </div>
)}
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-[#006C45] text-white rounded-xl p-8 max-w-sm w-full relative shadow-lg">
              <button
                className="absolute top-3 right-3 text-white text-xl font-bold hover:text-gray-300"
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
              <h2 className="text-2xl font-semibold mb-2">قيد التطوير</h2>
              <p className="text-base">
                هذه الخدمة قيد التطوير حالياً. يرجى المراجعة لاحقاً.
              </p>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default NavbarArabic;