import { useDispatch } from "react-redux";
import { toggleNavbarDropdown } from "../../Store/Features/navbarSlice";
import Switcher from "../Theme/Switcher";
import { useState, useEffect, useCallback } from "react";
import {
  HiOutlineHome,
  HiOutlineUser,
  HiOutlineAcademicCap,
  HiOutlineLightningBolt,
  HiOutlineBriefcase,
  HiOutlineMail,
  HiOutlineOfficeBuilding,
} from "react-icons/hi";

function Navbar() {
  const dispatch = useDispatch();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Optimized scroll handler with throttling
  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    setIsScrolled(scrollY > 20);

    // Active section detection
    const sections = [
      "home",
      "about",
      "services",
      "achievements",
      "education",
      "experience",
      "skills",
      "proj",
      "con",
    ];
    const current = sections.find((section) => {
      const element = document.getElementById(section);
      if (element) {
        const rect = element.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      }
      return false;
    });
    if (current) setActiveSection(current);
  }, []);

  // Single scroll listener with throttling
  useEffect(() => {
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => window.removeEventListener("scroll", throttledScroll);
  }, [handleScroll]);

  const handleToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    dispatch(toggleNavbarDropdown());
  };

  const navItems = [
    { id: "home", label: "Home", icon: HiOutlineHome },
    { id: "about", label: "About", icon: HiOutlineUser },
    { id: "services", label: "Services", icon: HiOutlineLightningBolt },
    { id: "education", label: "Education", icon: HiOutlineAcademicCap },
    { id: "experience", label: "Experience", icon: HiOutlineOfficeBuilding },
    { id: "skills", label: "Skills", icon: HiOutlineLightningBolt },
    { id: "proj", label: "Projects", icon: HiOutlineBriefcase },
    { id: "con", label: "Contact", icon: HiOutlineMail },
  ];

  return (
    <>
      {/* Main Navbar - Enhanced Dynamic Island */}
      <nav
        className={`
        fixed top-2 sm:top-4 left-1/2 transform -translate-x-1/2 z-50 
        transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${
          isScrolled
            ? "w-[96%] sm:w-[95%] md:w-[90%] lg:w-[85%] xl:w-[80%] max-w-6xl"
            : "w-[98%] sm:w-[97%] md:w-[95%] lg:w-[90%] xl:w-[85%] max-w-7xl"
        }
      `}
      >
        {/* Exotic Dynamic Island Container */}
        <div
          className={`
          relative overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${
            isScrolled
              ? "rounded-[32px] bg-white/90 dark:bg-gray-900/90 backdrop-blur-3xl shadow-2xl border border-white/50 dark:border-gray-700/60"
              : "rounded-[40px] bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl shadow-xl border border-white/40 dark:border-gray-700/50"
          }
          ${
            isMenuOpen
              ? "rounded-[28px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-3xl shadow-3xl border border-white/60 dark:border-gray-700/70"
              : ""
          }
        `}
        >
          {/* Multi-Layer Animated Background */}
          <div className="absolute inset-0">
            {/* Primary Flowing Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 via-pink-500/10 to-orange-500/10 dark:from-blue-400/10 dark:via-purple-400/10 dark:via-pink-400/10 dark:to-orange-400/10 animate-gradient-flow"></div>

            {/* Secondary Diagonal Shimmer */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/15 dark:via-gray-100/8 to-transparent animate-shimmer opacity-60"></div>

            {/* Tertiary Pulse Layer */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-violet-500/5 animate-pulse-slow"></div>
          </div>

          {/* Main Content Container */}
          <div
            className={`
            relative flex items-center justify-between px-3 sm:px-4 md:px-6 transition-all duration-500
            ${isMenuOpen ? "py-4 sm:py-5" : "py-3 sm:py-4"}
          `}
          >
            {/* Enhanced Logo Section */}
            <div className="flex-shrink-0 z-20">
              <a
                href="#home"
                className="group relative block transition-all duration-500 hover:scale-110"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="relative">
                  {/* Multi-layer Glow System */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/40 via-orange-500/30 to-red-600/40 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-red-400/20 via-orange-400/15 to-red-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                  {/* Logo with Enhanced Effects */}
                  <img
                    src="/bas.png"
                    alt="Basil Razriz - Transforming Visions into Code"
                    className={`
                      relative transition-all duration-500 ease-out object-contain
                      ${isScrolled ? "h-7 sm:h-8 md:h-9 w-auto" : "h-8 sm:h-9 md:h-10 lg:h-11 w-auto"}
                      filter drop-shadow-lg group-hover:drop-shadow-2xl
                      group-hover:brightness-110 group-hover:contrast-125 group-hover:saturate-110
                    `}
                  />

                  {/* Animated Ring Effects */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-red-500/30 transition-all duration-500"></div>
                  <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-orange-400/20 transition-all duration-700 delay-100"></div>
                </div>
              </a>
            </div>

            {/* Enhanced Center Navigation - Desktop */}
            <div className="hidden md:flex items-center">
              <div
                className={`
                flex items-center space-x-0.5 lg:space-x-1 rounded-full p-1 lg:p-1.5 backdrop-blur-sm transition-all duration-500
                ${
                  isScrolled
                    ? "bg-white/30 dark:bg-gray-800/40 border border-white/50 dark:border-gray-700/60 shadow-lg"
                    : "bg-white/25 dark:bg-gray-800/35 border border-white/40 dark:border-gray-700/50 shadow-md"
                }
              `}
              >
                {navItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`
                        relative px-2 md:px-3 lg:px-4 py-2 lg:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-400
                        group flex items-center space-x-1 lg:space-x-2 overflow-hidden backdrop-blur-sm
                        ${
                          activeSection === item.id
                            ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-lg scale-105 lg:scale-110 border border-white/60 dark:border-gray-700/60"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/40 dark:hover:bg-gray-800/40 hover:scale-105"
                        }
                      `}
                    >
                      {/* Enhanced Active Section Effects */}
                      {activeSection === item.id && (
                        <>
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-pulse-slow" />
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/15 dark:from-gray-100/8 to-transparent animate-shimmer-fast" />
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/10 to-violet-500/10 animate-gradient-flow" />
                        </>
                      )}

                      <IconComponent className="w-3 md:w-4 h-3 md:h-4 opacity-80 group-hover:opacity-100 transition-all duration-300 relative z-10" />
                      <span className="relative z-10 font-medium tracking-wide hidden lg:inline">
                        {item.label}
                      </span>
                      <span className="relative z-10 font-medium tracking-wide lg:hidden text-xs">
                        {item.label.slice(0, 3)}
                      </span>

                      {/* Enhanced Hover Effects */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/15 via-purple-500/15 to-pink-500/15 opacity-0 group-hover:opacity-100 transition-all duration-400 scale-0 group-hover:scale-100" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Enhanced Right Controls */}
            <div className="flex items-center space-x-2 sm:space-x-3 z-20">
              {/* Advanced Theme Switcher */}
              <div className="relative group">
                <div
                  className={`
                  p-2 sm:p-2.5 rounded-full backdrop-blur-sm transition-all duration-400 group-hover:scale-110
                  ${
                    isScrolled
                      ? "bg-white/30 dark:bg-gray-800/40 border border-white/50 dark:border-gray-700/60 shadow-lg"
                      : "bg-white/25 dark:bg-gray-800/35 border border-white/40 dark:border-gray-700/50 shadow-md"
                  }
                `}
                >
                  <Switcher />
                </div>
                {/* Multi-layer Glow */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/25 to-purple-500/25 opacity-0 group-hover:opacity-100 blur-lg transition-all duration-500 -z-10"></div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/15 to-violet-400/15 opacity-0 group-hover:opacity-100 blur-md transition-all duration-700 -z-10"></div>
              </div>

              {/* Exotic Mobile Menu Button */}
              <button
                onClick={handleToggle}
                className={`
                  md:hidden p-2 sm:p-2.5 rounded-full backdrop-blur-sm transition-all duration-400 hover:scale-110
                  ${
                    isScrolled
                      ? "bg-white/30 dark:bg-gray-800/40 border border-white/50 dark:border-gray-700/60 shadow-lg"
                      : "bg-white/25 dark:bg-gray-800/35 border border-white/40 dark:border-gray-700/50 shadow-md"
                  }
                  ${
                    isMenuOpen
                      ? "bg-white/40 dark:bg-gray-800/50 scale-105"
                      : ""
                  }
                `}
              >
                <div className="w-5 h-5 sm:w-6 sm:h-6 flex flex-col justify-center items-center">
                  <span
                    className={`block w-4 sm:w-5 h-0.5 bg-gray-700 dark:bg-gray-300 transform transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                      isMenuOpen
                        ? "rotate-45 translate-y-0.5 sm:translate-y-1 bg-blue-600 dark:bg-blue-400"
                        : "-translate-y-0.5 sm:-translate-y-1"
                    }`}
                  />
                  <span
                    className={`block w-4 sm:w-5 h-0.5 bg-gray-700 dark:bg-gray-300 transition-all duration-400 ${
                      isMenuOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"
                    }`}
                  />
                  <span
                    className={`block w-4 sm:w-5 h-0.5 bg-gray-700 dark:bg-gray-300 transform transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                      isMenuOpen
                        ? "-rotate-45 -translate-y-0.5 sm:-translate-y-1 bg-blue-600 dark:bg-blue-400"
                        : "translate-y-0.5 sm:translate-y-1"
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>

          {/* Exotic Expandable Mobile Menu */}
          <div
            className={`
            md:hidden overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]
            ${isMenuOpen ? "max-h-full opacity-100" : "max-h-0 opacity-0"}
          `}
          >
            <div className="px-3 sm:px-4 md:px-6 pb-4 sm:pb-6">
              {/* Elegant Divider */}
              <div className="relative mb-4 sm:mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent opacity-50"></div>
                </div>
                <div className="relative flex justify-center">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>
                </div>
              </div>

              {/* Streamlined Mobile Navigation */}
              <div className="space-y-2 sm:space-y-3">
                {navItems.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={() => setIsMenuOpen(false)}
                      className={`
                        group relative flex items-center p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-400
                        transform hover:scale-[1.02] overflow-hidden backdrop-blur-sm
                        ${
                          activeSection === item.id
                            ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg border border-white/30"
                            : "bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 hover:bg-white/90 dark:hover:bg-gray-800/90 border border-white/40 dark:border-gray-700/40"
                        }
                      `}
                      style={{
                        animationDelay: `${index * 0.08}s`,
                        animation: isMenuOpen
                          ? "slideInScale 0.6s ease-out both"
                          : "none",
                      }}
                    >
                      {/* Enhanced Background Effects */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-all duration-400"></div>

                      <div className="relative z-10 flex items-center space-x-3 sm:space-x-4 w-full">
                        <div
                          className={`
                          p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all duration-300
                          ${
                            activeSection === item.id
                              ? "bg-white/20"
                              : "bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600"
                          }
                        `}
                        >
                          <IconComponent
                            className={`w-4 sm:w-5 h-4 sm:h-5 transition-all duration-300 ${
                              activeSection === item.id
                                ? "text-white"
                                : "text-gray-600 dark:text-gray-400"
                            }`}
                          />
                        </div>
                        <span className="font-medium text-sm sm:text-base tracking-wide">
                          {item.label}
                        </span>

                        {/* Active Pulse Indicator */}
                        {activeSection === item.id && (
                          <div className="ml-auto">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          </div>
                        )}
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Advanced Animation Styles */}
      <style>{`
        @keyframes slideInScale {
          from {
            opacity: 0;
            transform: translateY(15px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes gradient-flow {
          0%, 100% {
            transform: translateX(-100%) rotate(45deg);
          }
          50% {
            transform: translateX(100%) rotate(45deg);
          }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-15deg);
          }
          100% {
            transform: translateX(200%) skewX(-15deg);
          }
        }
        
        @keyframes shimmer-fast {
          0% {
            transform: translateX(-100%) rotate(10deg);
          }
          100% {
            transform: translateX(100%) rotate(10deg);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }
        
        .animate-gradient-flow {
          animation: gradient-flow 25s ease infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 10s ease-in-out infinite;
        }
        
        .animate-shimmer-fast {
          animation: shimmer-fast 3s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}

export default Navbar;
