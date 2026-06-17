import React, { useState, useEffect } from "react";
import "./Sidebar_Ind.css";
import SWA from './SWA.png';
import searchicon from './searchicon.png';
import menu1 from './menu1.png';
import menu2 from './menu2.png';
import menu3 from './menu3.png';
import menu4 from './menu4.png';
import menu5 from './menu5.png';
import menu6 from './menu6.png';
import menu7 from './menu7.png';

const Sidebar_Ind = ({ onMenuClick }) => {
  const [activeMenuItem, setActiveMenuItem] = useState(null);
  const [sidebarShow, setSidebarShow] = useState(false);

  const setActive = (menuItem) => {
    setActiveMenuItem(menuItem);

    // Close sidebar on mobile after selection
    if (window.innerWidth <= 1024) {
      closeSidebar();
    }
  };

  const handleDashboardClick = (e) => {
    setActive(e.target.closest(".menuitem1"));
    if (onMenuClick) {
      onMenuClick('dashboard');
    }
  };

  const handleMyRequestsClick = (e) => {
    setActive(e.target.closest(".menuitem1"));
    if (onMenuClick) {
      onMenuClick('requests');
    }
  };

  const toggleDropdown = (element) => {
    const dropdown = document.getElementById("complaintDropdown");
    const isCurrentlyActive = element.classList.contains("active");

    // Remove active from all other menu items
    const allMenuItems = document.querySelectorAll(
      ".menuitem1:not(.dropdown-parent)"
    );
    const allSubmenuItems = document.querySelectorAll(".submenu-item");

    allMenuItems.forEach((item) => {
      item.classList.remove("active");
    });

    allSubmenuItems.forEach((item) => {
      item.classList.remove("active");
    });

    // Toggle dropdown and active state
    if (isCurrentlyActive) {
      element.classList.remove("active");
      dropdown.classList.remove("show");
    } else {
      element.classList.add("active");
      dropdown.classList.add("show");
    }
  };

  const toggleSidebar = () => {
    setSidebarShow(!sidebarShow);
  };

  const closeSidebar = () => {
    setSidebarShow(false);
  };

  useEffect(() => {
    // Set Dashboard as active by default
    const firstMenuItem = document.querySelector(".menuitem1");
    if (firstMenuItem) {
      firstMenuItem.classList.add("active");
    }

    // Handle window resize
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setSidebarShow(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Hamburger Menu Button (ONLY ADDITION) */}
      <button className="hamburger" onClick={toggleSidebar}>
        <i className="fas fa-bars"></i>
      </button>

      {/* Overlay for Mobile (ONLY ADDITION) */}
      <div
        className={`overlay ${sidebarShow ? "show" : ""}`}
        onClick={closeSidebar}
      ></div>

      <div className="main-container">
        {/*SideBar*/}
        <div className={`sidebar ${sidebarShow ? "show" : ""}`} id="sidebar">
          {/*Imageu*/}
          <div className="image-container">
            <img
              className="logo-image"
              src={SWA}
              alt="Saudi Water Authority Logo"
            />
            {/*Sextion*/}
            <section
              className="section-container"
              style={{ marginTop: "20px" }}
            >
              {/*SearchBar*/}
              <div className="search-menubar">
                <img
                  src={searchicon}
                  alt="Search Icon"
                  className="search-icon"
                />
                <input
                  type="text"
                  placeholder="Search"
                  className="placeholdermenu"
                />
              </div>
              {/*Avatar and Name Container*/}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  width: "100%",
                  padding: "8px 0",
                  marginLeft: "-30px",
                }}
              >
                <div className="avatar">SK</div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    alignItems: "flex-start",
                  }}
                >
                  <p
                    style={{
                      color: "#161616",
                      fontFamily:
                        'var(--Font-Family-font-family-text, "IBM Plex Sans Arabic")',
                      fontSize: "14px",
                      fontWeight: "600",
                      lineHeight: "20px",
                      margin: "0",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Read Abdullah
                  </p>
                  <div
                    style={{
                      display: "flex",
                      height: "20px",
                      padding:
                        "var(--Global-spacing-none, 0) var(--Global-spacing-md, 8px)",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "var(--Global-spacing-xs, 4px)",
                      flexShrink: "0",
                      borderRadius: "var(--radius-sm, 4px)",
                      border:
                        "1px solid var(--Border-border-neutral-secondary, #e5e7eb)",
                      background:
                        "var(--Tag-tag-background-neutral-light, #f9fafb)",
                    }}
                  >
                    <p
                      style={{
                        color: "#161616",
                        fontFamily:
                          'var(--Font-Family-font-family-text, "IBM Plex Sans Arabic")',
                        fontSize: "14px",
                        fontWeight: "600",
                        lineHeight: "20px",
                        margin: "0",
                      }}
                    >
                      Individual
                    </p>
                  </div>
                </div>
              </div>
              {/*Side Menu*/}
              <div className="sidemenu" style={{ marginTop: "20px" }}>
                {/*Horizontal line above Dashboard*/}
                <div className="hr1">
                  <hr className="line" />
                </div>
                {/*Menu1*/}
                <div
                  className="menuitem1"
                  onClick={handleDashboardClick}
                >
                  <img src={menu1} alt="DashBoard" className="menu1img" />
                  <p className="menuheader">Dashboard</p>
                </div>
                <div className="hr1">
                  <hr className="line" />
                </div>
                {/*Menu2*/}
                <div
                  className="menuitem1"
                  onClick={(e) => setActive(e.target.closest(".menuitem1"))}
                >
                  <img src={menu2} alt="Services" className="menu1img" />
                  <p className="menuheader">Services</p>
                </div>
                <div className="hr1">
                  <hr className="line" />
                </div>
                {/*Menu3*/}
                <div
                  className="menuitem1"
                  onClick={handleMyRequestsClick}
                >
                  <img src={menu3} alt="My Requests" className="menu1img" />
                  <p className="menuheader">My Requests</p>
                </div>
              </div>
              {/*Botton Part*/}
              <div className="bottomsidemenu">
                {/*Menu1*/}
                <div
                  className="menuitem1"
                  onClick={(e) => setActive(e.target.closest(".menuitem1"))}
                >
                  <img src={menu6} alt="Account" className="menu1img" />
                  <p className="menuheader">Account</p>
                </div>
                {/*Menu2*/}
                <div
                  className="menuitem1"
                  onClick={(e) => setActive(e.target.closest(".menuitem1"))}
                >
                  <img src={menu7}alt="LogOut" className="menu1img" />
                  <p className="menuheader">Log Out</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar_Ind;