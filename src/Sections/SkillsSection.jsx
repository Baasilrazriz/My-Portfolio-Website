import React, { useState, useMemo, useCallback } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { 
  FaCode, 
  FaFilter, 
  FaChartLine, 
  FaStar, 
  FaRocket, 
  FaChevronDown, 
  FaEye, 
  FaTimes, 
  FaReact,
  FaNodeJs,
  FaPython,
  FaJava,
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaGitAlt,
  FaAws,
  FaDocker,
  FaDatabase,
  FaServer,
  FaMobile,
  FaPalette,
  FaCreditCard,
  FaCloud,
  FaShieldAlt,
  FaTools,
  FaLayerGroup
} from "react-icons/fa";
import { 
  SiNextdotjs,
  SiTypescript,
  SiMongodb,
  SiPostgresql,
  SiPrisma,
  SiFirebase,
  SiMysql,
  SiTailwindcss,
  SiRedux,
  SiBootstrap,
  SiChakraui,
  SiFramer,
  SiExpress,
  SiFlask,
  SiDotnet,
  SiStripe,
  SiTrpc,
  SiSquare,
  SiCplusplus,
} from "react-icons/si";
import { TbBrandReactNative,TbBrandCSharp, TbWebhook } from "react-icons/tb";
import { VscAzure } from "react-icons/vsc";

import SkillsCard from "../Components/Skills/SkillsCard";

// Comprehensive skills data with your actual expertise
const skillsData = [
  // Frontend Technologies
  { name: "HTML5", category: "Frontend", level: 98, icon: <FaHtml5 />, color: "from-orange-500 to-red-500" },
  { name: "CSS3", category: "Frontend", level: 95, icon: <FaCss3Alt />, color: "from-blue-500 to-cyan-500" },
  { name: "JavaScript", category: "Frontend", level: 96, icon: <FaJs />, color: "from-yellow-400 to-orange-500" },
  { name: "TypeScript", category: "Frontend", level: 90, icon: <SiTypescript />, color: "from-blue-600 to-blue-800" },
  { name: "React JS", category: "Frontend", level: 98, icon: <FaReact />, color: "from-cyan-400 to-blue-500" },
  { name: "Next.js", category: "Frontend", level: 95, icon: <SiNextdotjs />, color: "from-gray-800 to-black" },
  { name: "React Native", category: "Frontend", level: 95, icon: <TbBrandReactNative />, color: "from-gray-800 to-black" },

  // CSS Frameworks & UI Libraries
  { name: "Tailwind CSS", category: "Styling", level: 98, icon: <SiTailwindcss />, color: "from-teal-400 to-cyan-500" },
  { name: "Bootstrap", category: "Styling", level: 92, icon: <SiBootstrap />, color: "from-purple-600 to-indigo-600" },
  { name: "Material UI", category: "Styling", level: 88, icon: <FaPalette />, color: "from-blue-500 to-indigo-600" },
  { name: "Chakra UI", category: "Styling", level: 85, icon: <SiChakraui />, color: "from-teal-400 to-green-500" },
  { name: "Shadcn/ui", category: "Styling", level: 90, icon: <FaPalette />, color: "from-slate-600 to-gray-800" },
  { name: "Acernity UI", category: "Styling", level: 82, icon: <FaLayerGroup />, color: "from-purple-500 to-pink-500" },

  // State Management 
  { name: "Redux Toolkit", category: "State Management", level: 92, icon: <SiRedux />, color: "from-purple-600 to-indigo-700" },
  { name: "Zustand", category: "State Management", level: 88, icon: <FaReact />, color: "from-orange-500 to-red-500" },

  //Animation
  { name: "Framer Motion", category: "Animation", level: 94, icon: <SiFramer />, color: "from-pink-500 to-purple-600" },
  { name: "React Spring", category: "Animation", level: 85, icon: <FaRocket />, color: "from-green-500 to-teal-500" },
  { name: "React Transition Group", category: "Animation", level: 82, icon: <FaLayerGroup />, color: "from-blue-500 to-purple-500" },
  { name: "Lottie React", category: "Animation", level: 88, icon: <FaStar />, color: "from-yellow-500 to-orange-500" },
  { name: "React Animated", category: "Animation", level: 80, icon: <FaChartLine />, color: "from-cyan-500 to-blue-600" },
  { name: "Auto-Animate", category: "Animation", level: 90, icon: <FaRocket />, color: "from-indigo-500 to-purple-600" },

  // Backend Technologies
  { name: "Node.js", category: "Backend", level: 94, icon: <FaNodeJs />, color: "from-green-500 to-emerald-600" },
  { name: "Express.js", category: "Backend", level: 92, icon: <SiExpress />, color: "from-gray-700 to-black" },
  { name: "tRPC", category: "Backend", level: 85, icon: <SiTrpc />, color: "from-blue-600 to-indigo-700" },
  { name: "ASP.NET Web API", category: "Backend", level: 88, icon: <SiDotnet />, color: "from-purple-600 to-blue-600" },
  { name: "ASP.NET MVC", category: "Backend", level: 85, icon: <SiDotnet />, color: "from-blue-600 to-purple-600" },
  { name: "Flask", category: "Backend", level: 80, icon: <SiFlask />, color: "from-gray-700 to-green-600" },
  { name: "Webhooks", category: "Backend", level: 88, icon: <TbWebhook />, color: "from-indigo-500 to-purple-600" },

  // Programming Languages
  { name: "JavaScript", category: "Languages", level: 96, icon: <FaJs />, color: "from-yellow-400 to-orange-500" },
  { name: "C#", category: "Languages", level: 90, icon: <TbBrandCSharp />, color: "from-purple-600 to-indigo-700" },
  { name: "Java", category: "Languages", level: 82, icon: <FaJava />, color: "from-red-600 to-orange-600" },
  { name: "Python", category: "Languages", level: 85, icon: <FaPython />, color: "from-blue-500 to-yellow-500" },
  { name: "C++", category: "Languages", level: 80, icon:<SiCplusplus />, color: "from-blue-600 to-purple-600" },

  // Mobile Development
  { name: "React Native", category: "Mobile", level: 88, icon: <TbBrandReactNative />, color: "from-cyan-400 to-blue-500" },
  { name: "NativeWind", category: "Mobile", level: 85, icon: <FaMobile />, color: "from-teal-400 to-cyan-500" },

  // Databases & ORMs
  { name: "MongoDB", category: "Database", level: 92, icon: <SiMongodb />, color: "from-green-500 to-emerald-600" },
  { name: "SQL Server", category: "Database", level: 88, icon: <FaDatabase />, color: "from-red-600 to-orange-600" },
  { name: "MySQL", category: "Database", level: 85, icon: <SiMysql />, color: "from-blue-600 to-orange-500" },
  { name: "PostgreSQL", category: "Database", level: 82, icon: <SiPostgresql />, color: "from-blue-700 to-indigo-700" },
  { name: "Prisma", category: "Database", level: 90, icon: <SiPrisma />, color: "from-indigo-600 to-purple-600" },
  { name: "Entity Framework", category: "Database", level: 88, icon: <SiDotnet />, color: "from-purple-600 to-blue-600" },
  { name: "Firebase", category: "Database", level: 90, icon: <SiFirebase />, color: "from-yellow-500 to-orange-500" },

  // Cloud & DevOps
  { name: "AWS", category: "Cloud", level: 82, icon: <FaAws />, color: "from-orange-500 to-yellow-500" },
  { name: "Azure", category: "Cloud", level: 78, icon: <VscAzure />, color: "from-blue-500 to-cyan-500" },
  { name: "Docker", category: "DevOps", level: 80, icon: <FaDocker />, color: "from-blue-500 to-cyan-500" },
  { name: "Git", category: "DevOps", level: 95, icon: <FaGitAlt />, color: "from-orange-600 to-red-600" },

  // Payment Systems
  { name: "Stripe", category: "Payments", level: 92, icon: <SiStripe />, color: "from-indigo-600 to-purple-600" },
  { name: "Square", category: "Payments", level: 85, icon: <SiSquare />, color: "from-gray-700 to-black" },
  { name: "Authorize.Net", category: "Payments", level: 80, icon: <FaCreditCard />, color: "from-blue-600 to-green-600" },
  { name: "Plaid", category: "Payments", level: 85, icon: <FaCreditCard />, color: "from-blue-500 to-cyan-500" },
  { name: "Dwolla", category: "Payments", level: 78, icon: <FaCreditCard />, color: "from-orange-500 to-red-500" },
  { name: "BryteWired", category: "Payments", level: 80, icon: <FaShieldAlt />, color: "from-green-500 to-teal-500" },
];

// Performance constants
const INITIAL_DISPLAY_COUNT = 8;
const LOAD_MORE_COUNT = 12;

// Main Skills Section Component
const SkillsSection = React.memo(() => {
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [filter, setFilter] = useState("All");
  const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT);
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Memoized categories with proper ordering
  const categories = useMemo(() => [
    "All",
    "Frontend", 
    "Styling", 
    "Backend", 
    "Languages", 
    "Mobile", 
    "Database", 
    "Cloud", 
    "DevOps", 
    "Payments",
    "State Management",
    "Animation"
  ], []);

  // Memoized filtered skills
  const filteredSkills = useMemo(() => 
    filter === "All" ? skillsData : skillsData.filter((skill) => skill.category === filter),
    [filter]
  );

  // Memoized displayed skills (performance optimization)
  const displayedSkills = useMemo(() => 
    isExpanded ? filteredSkills : filteredSkills.slice(0, displayCount),
    [filteredSkills, displayCount, isExpanded]
  );

  // Enhanced statistics with more detail
  const statistics = useMemo(() => ({
    totalSkills: skillsData.length,
    avgMastery: skillsData.length > 0 ? Math.round(skillsData.reduce((acc, skill) => acc + skill.level, 0) / skillsData.length) : 0,
    totalCategories: categories.length - 1,
    expertLevel: skillsData.filter(skill => skill.level >= 90).length,
    masterLevel: skillsData.filter(skill => skill.level >= 95).length,
    yearsExperience: 3
  }), [categories.length]);

  // Performance check
  const hasMoreSkills = useMemo(() => 
    filteredSkills.length > displayCount && !isExpanded,
    [filteredSkills.length, displayCount, isExpanded]
  );

  // Optimized animation variants
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.05,
        staggerChildren: 0.03,
      },
    },
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 120,
        duration: 0.2
      },
    },
  }), []);

  const filterVariants = useMemo(() => ({
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 200
      }
    },
    hover: shouldReduceMotion ? {} : {
      scale: 1.03,
      y: -1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 400
      }
    },
  }), [shouldReduceMotion]);

  // Optimized handlers
  const handleFilterChange = useCallback((category) => {
    setFilter(category);
    setDisplayCount(INITIAL_DISPLAY_COUNT);
    setIsExpanded(false);
  }, []);

  const handleSeeMore = useCallback(() => {
    if (filteredSkills.length <= LOAD_MORE_COUNT) {
      setIsExpanded(true);
    } else {
      setDisplayCount(prev => Math.min(prev + LOAD_MORE_COUNT, filteredSkills.length));
    }
  }, [filteredSkills.length]);

  const handleShowLess = useCallback(() => {
    setDisplayCount(INITIAL_DISPLAY_COUNT);
    setIsExpanded(false);
  }, []);

  // Category icons mapping
  const categoryIcons = {
    "All": FaCode,
    "Frontend": FaReact,
    "Styling": FaPalette,
    "Backend": FaServer,
    "Languages": FaCode,
    "Mobile": FaMobile,
    "Database": FaDatabase,
    "Cloud": FaCloud,
    "DevOps": FaTools,
    "Payments": FaCreditCard,
    "State Management": SiRedux,
    "Animation": SiFramer
  };

  // Optimized background animation
  const backgroundElements = useMemo(() => 
    !shouldReduceMotion ? [...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-cyan-400/10"
        style={{
          width: Math.random() * 4 + 2,
          height: Math.random() * 4 + 2,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [-15, 15, -15],
          opacity: [0.2, 0.8, 0.2],
          scale: [0.8, 1.3, 0.8],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 5 + Math.random() * 3,
          repeat: Infinity,
          delay: Math.random() * 4,
          ease: "easeInOut"
        }}
      />
    )) : [],
    [shouldReduceMotion]
  );

  return (
    <motion.section
      id="skills"
      className="relative min-h-screen py-16 sm:py-20 lg:py-24 overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
    >
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute inset-0 opacity-30 dark:opacity-40"
          animate={{
            background: [
              "radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.12) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.12) 0%, transparent 50%)",
              "radial-gradient(circle at 40% 40%, rgba(16, 185, 129, 0.12) 0%, transparent 50%)",
              "radial-gradient(circle at 60% 70%, rgba(245, 158, 11, 0.12) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 12, repeat: Infinity, repeatType: "reverse" }}
        />

        {/* Enhanced floating elements */}
        {backgroundElements}

        {/* Tech pattern overlay */}
        <motion.div 
          className="absolute inset-0 opacity-5 dark:opacity-10"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        >
          <svg width="100%" height="100%">
            <defs>
              <pattern id="techGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="1" fill="currentColor" opacity="0.4"/>
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.2"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#techGrid)" />
          </svg>
        </motion.div>
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header Section */}
        <motion.div
          variants={itemVariants}
          className="text-center mb-12 sm:mb-16"
        >
          <motion.div
            className="inline-flex items-center px-6 py-3 bg-white/90 dark:bg-slate-800/70 border border-blue-200/60 dark:border-slate-600/40 rounded-2xl backdrop-blur-xl mb-8 shadow-xl"
            whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="w-8 h-8 bg-gradient-to-r from-blue-500 via-purple-600 to-cyan-500 rounded-lg flex items-center justify-center mr-3"
              whileHover={shouldReduceMotion ? {} : { scale: 1.1, rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <FaRocket className="text-white text-sm" />
            </motion.div>
            <span className="text-sm font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              Full-Stack Technology Arsenal
            </span>
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-slate-800 via-blue-600 via-purple-600 to-cyan-600 dark:from-white dark:via-blue-100 dark:via-purple-100 dark:to-cyan-100 bg-clip-text text-transparent leading-tight"
            variants={itemVariants}
          >
            Skills Mastery
          </motion.h2>
          <motion.p
            className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-4xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            A comprehensive showcase of cutting-edge technologies, frameworks, and tools 
            mastered through {statistics.yearsExperience}+ years of passionate development. 
            From frontend wizardry to backend architecture, mobile apps to payment systems.
          </motion.p>

          {/* Enhanced Skills Counter */}
          <motion.div
            className="mt-8 flex flex-wrap justify-center gap-4"
            variants={itemVariants}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-500/30 rounded-full backdrop-blur-sm">
              <FaEye className="text-blue-600 dark:text-blue-400 text-sm" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                {displayedSkills.length} of {filteredSkills.length} skills shown
              </span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-950/30 border border-purple-200/60 dark:border-purple-500/30 rounded-full backdrop-blur-sm">
              <FaStar className="text-purple-600 dark:text-purple-400 text-sm" />
              <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
                {statistics.expertLevel} expert-level skills
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced Category Filter */}
        <motion.div
          className="relative mb-12"
          variants={itemVariants}
        >
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center px-4 py-2 bg-white/90 dark:bg-slate-800/70 border border-blue-200/50 dark:border-slate-600/50 rounded-full backdrop-blur-xl shadow-lg">
              <FaFilter className="mr-2 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-slate-800 dark:text-white">Filter by Technology Domain</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category, index) => {
              const count = skillsData.filter(skill => skill.category === category || category === "All").length;
              const IconComponent = categoryIcons[category] || FaCode;
              
              return (
                <motion.button
                  key={category}
                  onClick={() => handleFilterChange(category)}
                  className={`relative px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 backdrop-blur-xl border ${
                    filter === category
                      ? "bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 text-white border-blue-400/50 shadow-lg"
                      : "bg-white/70 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border-blue-200/30 dark:border-slate-600/30 hover:bg-white/90 dark:hover:bg-slate-700/70"
                  }`}
                  variants={filterVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  whileTap={{ scale: 0.95 }}
                  custom={index}
                >
                  <AnimatePresence>
                    {filter === category && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-xl"
                        layoutId="activeFilterBg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", damping: 20, stiffness: 200 }}
                      />
                    )}
                  </AnimatePresence>
                  
                  <span className="relative z-10 flex items-center gap-2">
                    <IconComponent className="text-xs" />
                    {category}
                    <span className="hidden sm:inline text-xs opacity-70 bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded">
                      {category === "All" ? skillsData.length : count}
                    </span>
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Enhanced Skills Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${filter}-${displayCount}`}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {displayedSkills.map((skill, index) => (
              <motion.div
                key={skill.name}
                variants={itemVariants}
                layout
              >
                <SkillsCard
                  skill={skill}
                  index={index}
                  hoveredSkill={hoveredSkill}
                  setHoveredSkill={setHoveredSkill}
                  shouldReduceMotion={shouldReduceMotion}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* See More / Show Less Button */}
        {(hasMoreSkills || isExpanded) && (
          <motion.div
            className="flex justify-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {hasMoreSkills ? (
              <motion.button
                onClick={handleSeeMore}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-600 to-cyan-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-xl border border-blue-400/30"
                whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="flex items-center gap-2"
                  whileHover={shouldReduceMotion ? {} : { x: 2 }}
                >
                  <FaChevronDown className="text-sm" />
                  <span>
                    Explore More Skills ({filteredSkills.length - displayedSkills.length} remaining)
                  </span>
                </motion.div>
                
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-700 to-cyan-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ zIndex: -1 }}
                />
              </motion.button>
            ) : (
              <motion.button
                onClick={handleShowLess}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white/90 dark:bg-slate-800/90 text-slate-800 dark:text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-xl border border-slate-200/60 dark:border-slate-600/60"
                whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="flex items-center gap-2"
                  whileHover={shouldReduceMotion ? {} : { x: -2 }}
                >
                  <FaTimes className="text-sm" />
                  <span>Show Core Skills</span>
                </motion.div>
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Enhanced Skills Summary */}
        <motion.div
          className="mt-16 bg-white/90 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border-2 border-blue-200/50 dark:border-slate-700/50 shadow-2xl relative overflow-hidden"
          variants={itemVariants}
          whileHover={shouldReduceMotion ? {} : { scale: 1.01, y: -5 }}
          transition={{ duration: 0.3 }}
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-cyan-950/20 rounded-3xl"></div>
          
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 text-center relative z-10"
            variants={containerVariants}
          >
            {[
              { 
                number: statistics.totalSkills.toString(), 
                label: "Total Skills", 
                color: "from-blue-500 to-blue-700", 
                icon: FaCode,
                description: "Technologies mastered"
              },
              { 
                number: statistics.avgMastery + "%", 
                label: "Avg Mastery", 
                color: "from-green-500 to-emerald-600", 
                icon: FaChartLine,
                description: "Overall proficiency"
              },
              { 
                number: statistics.totalCategories.toString(), 
                label: "Tech Domains", 
                color: "from-purple-500 to-purple-700", 
                icon: FaFilter,
                description: "Specialized areas"
              },
              { 
                number: statistics.expertLevel.toString(), 
                label: "Expert Level", 
                color: "from-orange-500 to-red-600", 
                icon: FaRocket,
                description: "90%+ proficiency"
              },
              { 
                number: statistics.masterLevel.toString(), 
                label: "Master Level", 
                color: "from-pink-500 to-rose-600", 
                icon: FaStar,
                description: "95%+ expertise"
              },
              { 
                number: statistics.yearsExperience + "+", 
                label: "Years Exp", 
                color: "from-cyan-500 to-blue-600", 
                icon: FaRocket,
                description: "Professional experience"
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="space-y-3 group"
                variants={itemVariants}
                whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -3 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r ${stat.color} rounded-xl shadow-lg relative overflow-hidden`}
                  whileHover={shouldReduceMotion ? {} : { rotate: 180, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <stat.icon className="text-white text-lg sm:text-xl relative z-10" />
                </motion.div>
                
                <motion.div
                  className={`text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  {stat.number}
                </motion.div>
                
                <div className="space-y-1">
                  <div className="text-slate-800 dark:text-white font-bold text-sm">
                    {stat.label}
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 text-xs leading-tight">
                    {stat.description}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Additional tech highlights */}
          <motion.div
            className="mt-8 pt-6 border-t border-slate-200/50 dark:border-slate-700/50 relative z-10"
            variants={itemVariants}
          >
            <h4 className="text-center text-lg font-bold text-slate-800 dark:text-white mb-4">
              Technology Highlights
            </h4>
            <div className="flex flex-wrap justify-center gap-2 text-xs">
              {["Full-Stack Development", "Payment Integration", "Mobile Apps", "Cloud Architecture", "UI/UX Design", "Database Design"].map((highlight, index) => (
                <motion.span
                  key={highlight}
                  className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-950/40 dark:to-purple-950/40 text-slate-700 dark:text-slate-300 rounded-full font-medium"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                  whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                >
                  {highlight}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
});

SkillsSection.displayName = 'SkillsSection';

export default SkillsSection;