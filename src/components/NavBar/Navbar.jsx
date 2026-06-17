import React, { useState, useEffect } from "react";
import "./Navbar.css";
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
  About: ["About Us", "Our Mission", "Team"],
  "Information Center": ["Reports", "Statistics", "Publications"],
  "Water Sector System": ["Infrastructure", "Management", "Technology"],
  "Media Center": ["News", "Press Releases", "Gallery"],
  "Contact Us": ["Locations", "Feedback", "Complaints"],
};

const Navbar = () => {
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
              // Use stored data to keep user logged in
              setIsLoggedIn(true);
              setUserName(parsedData.fullName || parsedData.firstName || 'User');
              setUserPhone(parsedData.phone || '');
              return; // Exit without clearing data
            }
            // Wait 1 second before retry
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
        
        if (response && response.success && response.exists && response.user) {
          setIsLoggedIn(true);
          setUserData(response.user);
          setUserName(response.user.fullName || `${response.user.firstName || ''} ${response.user.lastName || ''}`.trim());
          setUserPhone(response.user.phone || '');
          console.log("User data loaded:", response.user);
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
      <nav className="navbar" style={{ direction: currentLanguage === 'ar' ? 'rtl' : 'ltr' }}>
        {/* Mobile Hamburger Menu (only visible on mobile) */}
        <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* Logo - positioned left on desktop, right on mobile */}
        <Link to="/" className="logo-container">
          <img src={SWAlogo} className="logo" alt="SWA Logo" />
        </Link>

        {/* Desktop Navigation (visible on desktop) */}
        <div className="nav-left">
          <ul className="nav-menu">
            {Object.keys(dropdownItems).map((title, index, array) => (
              <React.Fragment key={title}>
                <li
                  className={`nav-item dropdown ${
                    openDropdown === title ? "show" : ""
                  }`}
                >
                  <a
                    href="#"
                    className="nav-link"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleDropdown(title);
                    }}
                  >
                    {title}{" "}
                    <FaChevronDown
                      className={`icon chevron-icon ${
                        openDropdown === title ? "rotate" : ""
                      }`}
                    />
                  </a>
                  <div
                    className={`dropdown-content ${
                      openDropdown === title ? "show" : ""
                    }`}
                  >
                    {dropdownItems[title].map((subItem) => (
                      <a href="#" key={subItem}>
                        {subItem}
                      </a>
                    ))}
                  </div>
                </li>
                {title === "About" && (
                  <li className="nav-item" key="Services">
                    <a
                      href="#services"
                      className="nav-link"
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
                      Services
                    </a>
                  </li>
                )}
              </React.Fragment>
            ))}
          </ul>
        </div>

        {/* Desktop Right Side (visible on desktop) */}
        <div className="nav-right">
          <FaSearch className="nav-icon" />

          <div
            className={`lang-switch dropdown ${
              langDropdownOpen ? "show" : ""
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setLangDropdownOpen((prev) => !prev);
              setOpenDropdown(null);
              setUserDropdownOpen(false);
            }}
          >
            <FaGlobeAmericas className="nav-icon" />
            <span>EN</span>
            <FaChevronDown
              className={`icon chevron-icon ${
                langDropdownOpen ? "rotate" : ""
              }`}
            />
            <div
              className={`dropdown-content ${
                langDropdownOpen ? "show" : ""
              }`}
            >
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
            </div>
          </div>

          <FaMoon className="nav-icon" />
          <FaBell className="nav-icon" />

          {/* Conditional rendering with loading state */}
{isCheckingAuth ? (
  <div className="auth-loading">
    <div className="loading-placeholder"></div>
  </div>
) : !isLoggedIn ? (
  <button className="login-btn" onClick={handleLoginClick}>
    Login <FaExternalLinkAlt className="login-arrow" />
  </button>
) : (
  <div className="user-dropdown-container">
    <div
      className={`user-dropdown ${userDropdownOpen ? "show" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        setUserDropdownOpen(!userDropdownOpen);
        setOpenDropdown(null);
        setLangDropdownOpen(false);
      }}
    >
      <FaUser className="nav-icon user-icon" />
      <span className="username">{userName || 'User'}</span>
      <FaChevronDown
        className={`icon chevron-icon ${
          userDropdownOpen ? "rotate" : ""
        }`}
      />
      <div
        className={`dropdown-content ${
          userDropdownOpen ? "show" : ""
        }`}
      >
        <Link to="/Dashboard">E-Services</Link>
        <div className="user-info">
          <div className="user-name">{userName}</div>
          <div className="user-phone">{userPhone}</div>
        </div>
        <a href="#" onClick={handleLogout}>
          <FaSignOutAlt className="logout-icon" /> Logout
        </a>
      </div>
    </div>
  </div>
)}
        </div>

        {/* Mobile Menu (only visible when toggled) */}
        <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
          <ul className="mobile-nav-menu">
            {Object.keys(dropdownItems).map((title, index, array) => (
              <React.Fragment key={title}>
                <li
                  className={`mobile-nav-item dropdown ${
                    openDropdown === title ? "show" : ""
                  }`}
                >
                  <a
                    href="#"
                    className="mobile-nav-link"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleDropdown(title);
                    }}
                  >
                    {title}{" "}
                    <FaChevronDown
                      className={`icon chevron-icon ${
                        openDropdown === title ? "rotate" : ""
                      }`}
                    />
                  </a>
                  <div
                    className={`mobile-dropdown-content ${
                      openDropdown === title ? "show" : ""
                    }`}
                  >
                    {dropdownItems[title].map((subItem) => (
                      <a href="#" key={subItem} onClick={closeMobileMenu}>
                        {subItem}
                      </a>
                    ))}
                  </div>
                </li>
                {title === "About" && (
                  <li className="mobile-nav-item" key="Services">
                    <a
                      href="#services"
                      className="mobile-nav-link"
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
                      Services
                    </a>
                  </li>
                )}
              </React.Fragment>
            ))}
          </ul>

          <div className="mobile-nav-right">
            <div className="mobile-nav-icons">
              <FaSearch className="mobile-nav-icon" />
              <div
                className={`mobile-lang-switch dropdown ${
                  langDropdownOpen ? "show" : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setLangDropdownOpen((prev) => !prev);
                  setOpenDropdown(null);
                  setUserDropdownOpen(false);
                }}
              >
                <FaGlobeAmericas className="mobile-nav-icon" />
                <span>EN</span>
                <FaChevronDown
                  className={`icon chevron-icon ${
                    langDropdownOpen ? "rotate" : ""
                  }`}
                />
                <div
                  className={`mobile-dropdown-content ${
                    langDropdownOpen ? "show" : ""
                  }`}
                >
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
                </div>
              </div>
              <FaMoon className="mobile-nav-icon" />
              <FaBell className="mobile-nav-icon" />
            </div>

            {/* Conditional rendering for mobile menu login/user */}
            {isCheckingAuth ? (
  <div className="mobile-auth-loading">
    <div className="mobile-loading-placeholder"></div>
  </div>
) : !isLoggedIn ? (
  <button className="mobile-login-btn" onClick={() => {
    navigate('/Enter');
    closeMobileMenu();
  }}>
    Login <FaExternalLinkAlt className="login-arrow" />
  </button>
) : (
              <div className="mobile-user-dropdown-container">
                <div
                  className={`mobile-user-dropdown ${userDropdownOpen ? "show" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setUserDropdownOpen(!userDropdownOpen);
                    setOpenDropdown(null);
                    setLangDropdownOpen(false);
                  }}
                >
                  <FaUser className="mobile-nav-icon user-icon" />
                  <span>{userName || 'Account'}</span>
                  <FaChevronDown
                    className={`icon chevron-icon ${
                      userDropdownOpen ? "rotate" : ""
                    }`}
                  />
                  <div
                    className={`mobile-dropdown-content ${
                      userDropdownOpen ? "show" : ""
                    }`}
                  >
                    <Link to="/DashBoard" onClick={closeMobileMenu}>E-Services</Link>
                    <a href="#" onClick={() => {
                      handleLogout();
                      closeMobileMenu();
                    }}>
                      <FaSignOutAlt className="logout-icon" /> Logout
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
              <h2 className="text-2xl font-semibold mb-2">Under Development</h2>
              <p className="text-base">
                This service is currently under development. Please check back later.
              </p>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;