import { useRef, useMemo, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  FaBriefcase,
  FaCalendarAlt,
  FaBuilding,
  FaCode,
  FaTrophy,
  FaStar,
  FaClock,
  FaChartLine,
  FaMapMarkerAlt,
} from "react-icons/fa";

function ExperienceSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.1 });
  const shouldReduceMotion = useReducedMotion();
  const workExperience = useSelector((state) => state.experience.experienceData);
  
  // Responsive state management
  const [screenSize, setScreenSize] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false
  });

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setScreenSize({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024
      });
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Optimized animation variants
  const containerVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          duration: shouldReduceMotion ? 0.1 : 0.4,
          staggerChildren: shouldReduceMotion ? 0.03 : 0.08,
          ease: "easeOut",
        },
      },
    }),
    [shouldReduceMotion]
  );

  const itemVariants = useMemo(
    () => ({
      hidden: {
        opacity: 0,
        y: shouldReduceMotion ? 5 : 25,
        scale: shouldReduceMotion ? 1 : 0.96,
      },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: shouldReduceMotion ? 0.15 : 0.5,
          ease: [0.25, 0.46, 0.45, 0.94],
        },
      },
    }),
    [shouldReduceMotion]
  );

  const timelineVariants = useMemo(
    () => ({
      hidden: { scaleY: 0, opacity: 0 },
      visible: {
        scaleY: 1,
        opacity: 1,
        transition: {
          duration: shouldReduceMotion ? 0.3 : 1.2,
          ease: "easeOut",
        },
      },
    }),
    [shouldReduceMotion]
  );

  const getExperienceIcon = (type) => {
    if (type.toLowerCase().includes("current")) return FaBriefcase;
    if (type.toLowerCase().includes("professional")) return FaCode;
    if (type.toLowerCase().includes("freelance")) return FaCode;
    return FaBuilding;
  };

  const getExperienceType = (type) => {
    if (type.toLowerCase().includes("current")) return "Current";
    if (type.toLowerCase().includes("professional")) return "Professional";
    if (type.toLowerCase().includes("freelance")) return "Freelance";
    return "Professional";
  };

  // Generate particles array only once
  const particles = useMemo(
    () =>
      Array.from({ length: shouldReduceMotion ? 4 : 12 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 4,
        size: Math.random() * 2 + 1,
      })),
    [shouldReduceMotion]
  );

  // Calculate timeline height based on screen size and experience count
  const getTimelineHeight = () => {
    if (screenSize.isMobile) return workExperience.length * 455 + 100;
    return workExperience.length * 491 + 180;
  };

  return (
    <motion.section
      ref={ref}
      id="experience"
      className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50 dark:from-slate-950 dark:via-slate-900 dark:to-black overflow-hidden py-12 sm:py-16 md:py-20 lg:py-24"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Primary gradient orbs */}
        {!shouldReduceMotion && (
          <>
            <motion.div
              className="absolute top-10 right-10 sm:top-20 sm:right-20 w-48 h-48 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-gradient-to-r from-green-500/12 via-emerald-500/8 to-teal-500/6 dark:from-green-500/12 dark:via-emerald-500/8 dark:to-teal-500/6 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.4, 0.7, 0.4],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute bottom-10 left-10 sm:bottom-20 sm:left-20 w-40 h-40 sm:w-64 sm:h-64 lg:w-80 lg:h-80 bg-gradient-to-r from-teal-500/10 via-cyan-500/8 to-blue-500/6 dark:from-teal-500/10 dark:via-cyan-500/8 dark:to-blue-500/6 rounded-full blur-3xl"
              animate={{
                scale: [1.1, 1, 1.1],
                opacity: [0.3, 0.6, 0.3],
                rotate: [360, 180, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 3,
              }}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-r from-emerald-500/8 via-green-500/6 to-teal-500/4 dark:from-emerald-500/8 dark:via-green-500/6 dark:to-teal-500/4 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 5,
              }}
            />
          </>
        )}

        {/* Floating particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-gradient-to-r from-slate-400/20 to-green-400/10 dark:from-white/20 dark:to-green-200/10"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
            animate={
              shouldReduceMotion
                ? {}
                : {
                    y: [0, -40, 0],
                    opacity: [0, 0.8, 0],
                    scale: [1, 1.2, 1],
                  }
            }
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Subtle overlay gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(34,197,94,0.02)_50%,transparent_100%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div variants={itemVariants} className="text-center mb-12 sm:mb-16 lg:mb-20">
          <motion.div
            className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 bg-gradient-to-r from-white/40 via-slate-100/30 to-white/40 dark:from-slate-800/40 dark:via-slate-700/30 dark:to-slate-800/40 border border-slate-300/30 dark:border-slate-600/30 rounded-xl lg:rounded-2xl backdrop-blur-xl mb-6 sm:mb-8 shadow-2xl"
            whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -2 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center mr-2 sm:mr-3"
              whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              <FaBriefcase className="text-white text-xs sm:text-sm" />
            </motion.div>
            <span className="text-xs sm:text-sm font-semibold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Professional Journey
            </span>
          </motion.div>

          <motion.h2
            className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-slate-900 via-green-800 to-emerald-800 dark:from-white dark:via-green-100 dark:to-emerald-100 bg-clip-text text-transparent mb-6"
            variants={itemVariants}
          >
            Experience
          </motion.h2>
          <motion.p
            className="text-sm sm:text-base lg:text-xl text-slate-600 dark:text-slate-400 max-w-xs sm:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed font-medium px-4 sm:px-0"
            variants={itemVariants}
          >
            A journey through my professional experiences as a Software Engineer,
            building secure and scalable applications with modern technologies
          </motion.p>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Mobile Timeline Line */}
          {screenSize.isMobile && (
            <motion.div
              className="absolute left-6 top-0 origin-top z-10"
              variants={timelineVariants}
            >
              <div
                className="w-1 bg-gradient-to-b from-green-400 via-emerald-500 to-teal-600 rounded-full relative"
                style={{ height: `${getTimelineHeight()}px` }}
              >
                <div className="absolute inset-0 w-3 -left-1 bg-gradient-to-b from-green-400/20 via-emerald-500/15 to-teal-600/10 rounded-full blur-sm" />
              </div>
            </motion.div>
          )}

          {/* Desktop Timeline Line */}
          {!screenSize.isMobile && (
            <motion.div
              className="absolute left-1/2  transform -translate-x-1/2 origin-top z-10"
              variants={timelineVariants}
            >
              <div
                className="w-1 bg-gradient-to-b from-green-400 via-emerald-500 to-teal-600 rounded-full relative"
                style={{ height: `${getTimelineHeight()}px` }}
              >
                <div className="absolute inset-0 w-3 -left-1 bg-gradient-to-b from-green-400/20 via-emerald-500/15 to-teal-600/10 rounded-full blur-sm" />
              </div>
            </motion.div>
          )}

          {/* Experience Items */}
          <div className={screenSize.isMobile ? "space-y-16" : "space-y-24 lg:space-y-32"}>
            {workExperience.map((exp, index) => {
              const isEven = index % 2 === 0;
              const IconComponent = getExperienceIcon(exp.type);
              const experienceType = getExperienceType(exp.type);

              return (
                <motion.div
                  key={exp.id}
                  className="relative"
                  variants={itemVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  transition={{ delay: index * 0.25 }}
                >
                  {/* Desktop Layout */}
                  {!screenSize.isMobile && (
                    <div className="flex items-center justify-center">
                      {/* Central Timeline Node */}
                      <motion.div
                        className="absolute left-1/2 transform -translate-x-1/2 z-30"
                        whileHover={shouldReduceMotion ? {} : { scale: 1.15 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="relative">
                          <motion.div
                            className="absolute inset-0 w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-green-400/30 to-emerald-500/30 rounded-full blur-lg"
                            animate={
                              shouldReduceMotion
                                ? {}
                                : {
                                    scale: [1, 1.2, 1],
                                    opacity: [0.5, 0.8, 0.5],
                                  }
                            }
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                          <div className="relative w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-white via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-900 rounded-full border-4 border-green-400/40 flex items-center justify-center shadow-2xl backdrop-blur-sm">
                            <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700 rounded-full flex items-center justify-center shadow-inner">
                              <IconComponent className="text-white text-lg lg:text-2xl" />
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Experience Card */}
                      <motion.div
                        className={`w-full max-w-lg lg:max-w-xl ${
                          isEven 
                            ? "mr-auto pr-20 lg:pr-32" 
                            : "ml-auto pl-20 lg:pl-32"
                        }`}
                        whileHover={
                          shouldReduceMotion
                            ? {}
                            : {
                                scale: 1.02,
                                y: -8,
                              }
                        }
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      >
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl lg:rounded-3xl blur-xl group-hover:from-green-500/20 group-hover:to-emerald-500/20 transition-all duration-500" />
                          
                          <div className="relative bg-gradient-to-br from-white/80 via-slate-100/60 to-slate-200/40 dark:from-slate-800/60 dark:via-slate-700/40 dark:to-slate-900/60 backdrop-blur-2xl rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 border border-slate-300/30 dark:border-slate-600/30 hover:border-slate-400/50 dark:hover:border-slate-500/50 transition-all duration-500 shadow-2xl">
                            {/* Type Badge */}
                            <motion.div
                              className="absolute -top-3 right-4 lg:-top-4 lg:right-6 px-3 py-1 lg:px-4 lg:py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-lg"
                              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                            >
                              <span className="text-white text-xs font-bold tracking-wide">
                                {experienceType}
                              </span>
                            </motion.div>

                            {/* Header */}
                            <div className="flex items-start gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-5 lg:mb-6">
                              <motion.a
                              href={exp.website || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-xl lg:rounded-2xl overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-800 p-1 lg:p-1.5 shadow-xl flex-shrink-0 flex items-center justify-center"
                                whileHover={
                                  shouldReduceMotion ? {} : { scale: 1.08 }
                                }
                                transition={{ duration: 0.4 }}
                              >
                                {exp.image ? (
                                  <img 
                                    src={exp.image} 
                                    alt={`${exp.company} logo`}
                                    className="w-full h-full object-contain rounded-lg lg:rounded-xl"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.nextSibling.style.display = 'flex';
                                    }}
                                  />
                                ) : null}
                                <FaBuilding 
                                  className="text-slate-600 dark:text-slate-300 text-2xl lg:text-3xl" 
                                  style={{ display: exp.image ? 'none' : 'flex' }}
                                />
                              </motion.a>

                              <div className="flex-1 min-w-0">
                                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-1 sm:mb-2 leading-tight">
                                  {exp.title}
                                </h3>
                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-1 sm:mb-2">
                                  <div className="w-4 h-4 lg:w-5 lg:h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                                    <FaBuilding className="text-white text-xs" />
                                  </div>
                                  <span className="font-semibold text-xs sm:text-sm">
                                    {exp.company}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-1 sm:mb-2">
                                  <div className="w-4 h-4 lg:w-5 lg:h-5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                                    <FaCalendarAlt className="text-white text-xs" />
                                  </div>
                                  <span className="font-semibold text-xs sm:text-sm">
                                    {exp.timestamp}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <FaMapMarkerAlt className="text-emerald-400 text-xs sm:text-sm" />
                                  <span className="text-emerald-400 text-xs sm:text-sm font-medium">
                                    {exp.location}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Description */}
                            <div className="mb-4 sm:mb-5 lg:mb-6">
                              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs sm:text-sm font-medium">
                                {exp.description}
                              </p>
                            </div>

                            {/* Skills */}
                            <div className="mb-4 sm:mb-5 lg:mb-6">
                              <div className="flex flex-wrap gap-2">
                                {exp.skills.map((skill, skillIndex) => (
                                  <motion.span
                                    key={skillIndex}
                                    className="px-2 py-1 text-xs bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-700 dark:text-green-300 rounded-lg border border-green-400/30"
                                    whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    {skill}
                                  </motion.span>
                                ))}
                              </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 sm:gap-3">
                                <motion.div
                                  className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden"
                                  whileHover={
                                    shouldReduceMotion ? {} : { scale: 1.1 }
                                  }
                                  transition={{ duration: 0.3 }}
                                >
                                  <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                                    animate={
                                      shouldReduceMotion
                                        ? {}
                                        : { x: ["-100%", "100%"] }
                                    }
                                    transition={{
                                      duration: 2,
                                      repeat: Infinity,
                                      repeatDelay: 3,
                                    }}
                                  />
                                  <FaTrophy className="text-white text-sm sm:text-base lg:text-lg relative z-10" />
                                </motion.div>
                                <div>
                                  <p className="text-xs text-slate-500 dark:text-slate-500 font-semibold uppercase tracking-wider mb-1">
                                    Duration
                                  </p>
                                  <p className="text-base sm:text-lg lg:text-xl font-black bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                                    {exp.duration}
                                  </p>
                                </div>
                              </div>

                              <motion.div
                                className="flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-3 sm:py-2 lg:px-4 lg:py-2 bg-gradient-to-r from-green-500/20 via-emerald-500/15 to-teal-500/20 border border-green-400/30 rounded-xl lg:rounded-2xl backdrop-blur-sm"
                                whileHover={
                                  shouldReduceMotion ? {} : { scale: 1.05, y: -2 }
                                }
                                transition={{ duration: 0.3 }}
                              >
                                <motion.div
                                  animate={
                                    shouldReduceMotion
                                      ? {}
                                      : { scale: [1, 1.1, 1] }
                                  }
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                  }}
                                >
                                  <FaChartLine className="text-green-400 text-xs sm:text-sm" />
                                </motion.div>
                                <span className="text-xs font-bold text-green-400">
                                  Active
                                </span>
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Connection Line */}
                      <motion.div
                        className={`absolute top-1/2 w-24 lg:w-36 h-0.5 bg-gradient-to-r ${
                          isEven
                            ? "right-1/2 from-green-400/60 via-emerald-500/40 to-transparent"
                            : "left-1/2 from-transparent via-emerald-500/40 to-green-400/60"
                        } z-20 rounded-full`}
                        initial={{ scaleX: 0 }}
                        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                        transition={{
                          delay: index * 0.25 + 0.5,
                          duration: shouldReduceMotion ? 0.3 : 0.8,
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-500/20 rounded-full blur-sm" />
                      </motion.div>
                    </div>
                  )}

                  {/* Mobile Layout */}
                  {screenSize.isMobile && (
                    <div className="flex items-start gap-4 pl-14">
                      {/* Mobile Timeline Node */}
                      <motion.div
                        className="absolute left-6 transform -translate-x-1/2 z-30"
                        whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="relative">
                          <motion.div
                            className="absolute inset-0 w-12 h-12 bg-gradient-to-r from-green-400/30 to-emerald-500/30 rounded-full blur-md"
                            animate={
                              shouldReduceMotion
                                ? {}
                                : {
                                    scale: [1, 1.2, 1],
                                    opacity: [0.4, 0.7, 0.4],
                                  }
                            }
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                          <div className="relative w-12 h-12 bg-gradient-to-br from-white via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-900 rounded-full border-3 border-green-400/40 flex items-center justify-center shadow-xl backdrop-blur-sm">
                            <div className="w-8 h-8 bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700 rounded-full flex items-center justify-center shadow-inner">
                              <IconComponent className="text-white text-sm" />
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Mobile Experience Card */}
                      <motion.div
                        className="flex-1"
                        whileHover={
                          shouldReduceMotion
                            ? {}
                            : {
                                scale: 1.02,
                                y: -4,
                              }
                        }
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      >
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-green-500/8 to-emerald-500/8 rounded-2xl blur-lg group-hover:from-green-500/15 group-hover:to-emerald-500/15 transition-all duration-500" />
                          
                          <div className="relative bg-gradient-to-br from-white/80 via-slate-100/70 to-slate-200/50 dark:from-slate-800/70 dark:via-slate-700/50 dark:to-slate-900/70 backdrop-blur-2xl rounded-2xl p-5 border border-slate-300/30 dark:border-slate-600/30 hover:border-slate-400/50 dark:hover:border-slate-500/50 transition-all duration-500 shadow-xl">
                            {/* Type Badge */}
                            <motion.div
                              className="absolute -top-3 right-4 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-lg"
                              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                            >
                              <span className="text-white text-xs font-bold tracking-wide">
                                {experienceType}
                              </span>
                            </motion.div>

                            {/* Header */}
                            <div className="flex items-start gap-4 mb-4">
                              <motion.div
                                className="w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-800 p-1 shadow-lg flex-shrink-0 flex items-center justify-center"
                                whileHover={
                                  shouldReduceMotion ? {} : { scale: 1.05 }
                                }
                                transition={{ duration: 0.4 }}
                              >
                                {exp.image ? (
                                  <img 
                                    src={exp.image} 
                                    alt={`${exp.company} logo`}
                                    className="w-full h-full object-contain rounded-lg"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.nextSibling.style.display = 'flex';
                                    }}
                                  />
                                ) : null}
                                <FaBuilding 
                                  className="text-slate-600 dark:text-slate-300 text-xl" 
                                  style={{ display: exp.image ? 'none' : 'flex' }}
                                />
                              </motion.div>

                              <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-1 leading-tight">
                                  {exp.title}
                                </h3>
                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-1">
                                  <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-md flex items-center justify-center">
                                    <FaBuilding className="text-white text-xs" />
                                  </div>
                                  <span className="font-semibold text-xs">
                                    {exp.company}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-1">
                                  <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-md flex items-center justify-center">
                                    <FaCalendarAlt className="text-white text-xs" />
                                  </div>
                                  <span className="font-semibold text-xs">
                                    {exp.timestamp}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <FaMapMarkerAlt className="text-emerald-400 text-xs" />
                                  <span className="text-emerald-400 text-xs font-medium">
                                    {exp.location}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Description */}
                            <div className="mb-4">
                              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
                                {exp.description}
                              </p>
                            </div>

                            {/* Skills */}
                            <div className="mb-4">
                              <div className="flex flex-wrap gap-1">
                                {exp.skills.map((skill, skillIndex) => (
                                  <span
                                    key={skillIndex}
                                    className="px-2 py-1 text-xs bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-700 dark:text-green-300 rounded-md border border-green-400/30"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <motion.div
                                  className="w-10 h-10 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden"
                                  whileHover={
                                    shouldReduceMotion ? {} : { scale: 1.1 }
                                  }
                                  transition={{ duration: 0.3 }}
                                >
                                  <FaTrophy className="text-white text-sm relative z-10" />
                                </motion.div>
                                <div>
                                  <p className="text-xs text-slate-500 dark:text-slate-500 font-semibold uppercase tracking-wider">
                                    Duration
                                  </p>
                                  <p className="text-lg font-black bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                                    {exp.duration}
                                  </p>
                                </div>
                              </div>

                              <motion.div
                                className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-green-500/20 via-emerald-500/15 to-teal-500/20 border border-green-400/30 rounded-xl backdrop-blur-sm"
                                whileHover={
                                  shouldReduceMotion ? {} : { scale: 1.05 }
                                }
                                transition={{ duration: 0.3 }}
                              >
                                <FaChartLine className="text-green-400 text-xs" />
                                <span className="text-xs font-bold text-green-400">
                                  Active
                                </span>
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* End Timeline Icon */}
          <motion.div
            className={`flex ${screenSize.isMobile ? 'justify-start pl-1' : 'justify-center'} mt-12 sm:mt-16 lg:mt-20`}
            variants={itemVariants}
          >
            <motion.div
              className="relative"
              whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className={`absolute inset-0 ${screenSize.isMobile ? 'w-12 h-12' : 'w-14 h-14 lg:w-16 lg:h-16'} bg-gradient-to-r from-emerald-400/30 to-green-500/30 rounded-full blur-lg`}
                animate={
                  shouldReduceMotion
                    ? {}
                    : {
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 0.8, 0.5],
                      }
                }
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <div className={`relative ${screenSize.isMobile ? 'w-12 h-12' : 'w-14 h-14 lg:w-16 lg:h-16'} bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700 rounded-full flex items-center justify-center shadow-2xl`}>
                <FaBriefcase className={`text-white ${screenSize.isMobile ? 'text-lg' : 'text-xl lg:text-2xl'}`} />
              </div>
            </motion.div>
          </motion.div>

          {/* Statistics */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 mt-20 lg:mt-24"
          >
            {[
              { 
                number: "1.2+", 
                label: "Years Experience", 
                icon: FaClock, 
                color: "from-emerald-400 to-green-500",
                bgGradient: "from-emerald-500/20 to-green-500/20"
              },
              { 
                number: "5+", 
                label: "Projects Completed", 
                icon: FaTrophy, 
                color: "from-emerald-400 to-green-500",
                bgGradient: "from-emerald-500/20 to-green-500/20"
              },
              { 
                number: "3.42", 
                label: "Academic CGPA", 
                icon: FaStar, 
                color: "from-emerald-400 to-green-500",
                bgGradient: "from-emerald-500/20 to-green-500/20"
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center group"
                whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -8 }}
                transition={{ duration: 0.4 }}
              >
                <motion.div
                  className={`inline-flex items-center justify-center w-18 h-18 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br ${stat.bgGradient} border border-slate-300/40 dark:border-slate-600/40 rounded-3xl mb-5 sm:mb-6 lg:mb-8 transition-all duration-500 backdrop-blur-xl shadow-2xl relative overflow-hidden group-hover:border-slate-400/60 dark:group-hover:border-slate-500/60`}
                  whileHover={shouldReduceMotion ? {} : { scale: 1.1, rotate: 3 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                    animate={shouldReduceMotion ? {} : { x: ["-100%", "100%"] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatDelay: 5,
                    }}
                  />
                  {/* Icon */}
                  <div className="relative z-10">
                    <stat.icon 
                      className={`text-3xl sm:text-4xl lg:text-5xl`}
                      style={{
                        background: `linear-gradient(135deg, rgb(34 197 94), rgb(16 185 129))`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    />
                  </div>
                </motion.div>
                <motion.div
                  className={`text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-3 sm:mb-4`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                  transition={{
                    delay: 1.5 + index * 0.2,
                    duration: 0.6,
                    type: "spring",
                    stiffness: 150,
                  }}
                >
                  {stat.number}
                </motion.div>
                <div className="text-slate-600 dark:text-slate-400 font-semibold text-base sm:text-lg lg:text-xl tracking-wide">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

export default ExperienceSection;
