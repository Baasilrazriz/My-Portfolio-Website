import  {  useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  FaPlus,
  FaSearch,
  FaFilter,
  FaCode,
  FaRocket,
  FaChevronDown,
  FaLaptopCode,
  FaMobile,
  FaDesktop,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle
} from "react-icons/fa";

import ProjectCard from "../Components/Projects/ProjectCard";
import { 
  fetchProjects, 
  openProjectModal, 
  setFilter,
  setSearchQuery 
} from "../Store/Features/projectSlice";
import ProjectsModal from "../Modals/ProjectsModal";

const ProjectSection = () => {
  const dispatch = useDispatch();
  const shouldReduceMotion = useReducedMotion();
  
  // Redux state
  const {
    projects,
    filteredProjects,
    loading,
    error,
    filter,
    searchQuery,
    isModalOpen
  } = useSelector((state) => state.projects);

  // Local state
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: ""
  });

  // Session validation for admin
  const isAdminLoggedIn = 
    sessionStorage.getItem("isAdminAuthenticated") === "true" ||
    localStorage.getItem("adminToken") !== null;

  // Project categories with icons
  const categories = useMemo(() => [
    { value: "All", label: "All Projects", icon: FaCode, count: projects.length },
    { value: "Web Development", label: "Web Apps", icon: FaLaptopCode, count: projects.filter(p => p.category === "Web Development").length },
    { value: "Mobile App", label: "Mobile Apps", icon: FaMobile, count: projects.filter(p => p.category === "Mobile App").length },
    { value: "Desktop Application", label: "Desktop Apps", icon: FaDesktop, count: projects.filter(p => p.category === "Desktop Application").length }
  ], [projects]);

  // Fetch projects on component mount
  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  // Projects to display (limited or all)
  const displayedProjects = useMemo(() => {
    return showAllProjects ? filteredProjects : filteredProjects.slice(0, 6);
  }, [filteredProjects, showAllProjects]);

  // Statistics
  const stats = useMemo(() => ({
    total: projects.length,
    web: projects.filter(p => p.category === "Web Development").length,
    mobile: projects.filter(p => p.category === "Mobile App").length,
    desktop: projects.filter(p => p.category === "Desktop Application").length,
    featured: projects.filter(p => p.featured).length
  }), [projects]);

  // Handlers
  const handleCategoryFilter = useCallback((category) => {
    dispatch(setFilter(category));
    setShowAllProjects(false);
  }, [dispatch]);

  const handleSearchChange = useCallback((e) => {
    dispatch(setSearchQuery(e.target.value));
    setShowAllProjects(false);
  }, [dispatch]);

  const handleOpenModal = useCallback(() => {
    dispatch(openProjectModal());
  }, [dispatch]);

  const showNotification = useCallback((type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: "", message: "" });
    }, 4000);
  }, []);

  // Animation variants
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 120
      }
    }
  }), []);

  const filterVariants = useMemo(() => ({
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.2 }
    },
    hover: shouldReduceMotion ? {} : {
      scale: 1.02,
      y: -2,
      transition: { duration: 0.2 }
    }
  }), [shouldReduceMotion]);

  if (loading && projects.length === 0) {
    return (
      <section id="projects" className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4 text-center">
          <FaSpinner className="text-6xl text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-xl text-slate-600 dark:text-slate-400">Loading amazing projects...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Notification */}
      <AnimatePresence mode="wait">
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-4 right-4 z-50 max-w-md"
          >
            <div className={`p-4 rounded-xl shadow-lg backdrop-blur-sm border ${
              notification.type === "success"
                ? "bg-green-500/90 border-green-400"
                : notification.type === "error"
                ? "bg-red-500/90 border-red-400"
                : "bg-blue-500/90 border-blue-400"
            }`}>
              <div className="flex items-center gap-3">
                {notification.type === "success" ? (
                  <FaCheckCircle className="text-white text-xl" />
                ) : notification.type === "error" ? (
                  <FaExclamationTriangle className="text-white text-xl" />
                ) : (
                  <FaRocket className="text-white text-xl" />
                )}
                <p className="text-white font-medium">{notification.message}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.section
        id="proj"
        className="relative min-h-screen py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
      >
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          {!shouldReduceMotion && (
            <>
              <motion.div
                className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-r from-cyan-500/8 to-teal-500/8 rounded-full blur-3xl"
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2,
                }}
              />
            </>
          )}
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
              {/* Header Section - Fixed Responsive Design */}
          <motion.div variants={itemVariants} className="text-center mb-8 sm:mb-12 lg:mb-16">
            <motion.div
              className="inline-flex items-center px-3 py-2 sm:px-6 sm:py-3 bg-white/90 dark:bg-slate-800/70 border border-blue-200/60 dark:border-slate-600/40 rounded-xl sm:rounded-2xl backdrop-blur-xl mb-6 sm:mb-8 shadow-xl"
              whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 via-purple-600 to-cyan-500 rounded-lg flex items-center justify-center mr-2 sm:mr-3"
                whileHover={shouldReduceMotion ? {} : { scale: 1.1, rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <FaRocket className="text-white text-xs sm:text-sm" />
              </motion.div>
              <span className="text-xs sm:text-sm font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                Portfolio Showcase
              </span>
            </motion.div>

            <motion.h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-slate-800 via-blue-600 via-purple-600 to-cyan-600 dark:from-white dark:via-blue-100 dark:via-purple-100 dark:to-cyan-100 bg-clip-text text-transparent leading-tight px-4"
              variants={itemVariants}
            >
              My Projects
            </motion.h2>
            <motion.p
              className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-400 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed px-4"
              variants={itemVariants}
            >
              Explore my collection of innovative projects built with cutting-edge technologies. 
              From full-stack web applications to mobile solutions.
            </motion.p>

            {/* Statistics Cards - Responsive Grid */}
            <motion.div
              className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8 sm:mt-12 max-w-sm sm:max-w-2xl lg:max-w-4xl mx-auto px-4"
              variants={itemVariants}
            >
              {[
                { label: "Total Projects", value: stats.total, icon: FaCode, color: "from-blue-500 to-blue-600" },
                { label: "Web Apps", value: stats.web, icon: FaLaptopCode, color: "from-green-500 to-green-600" },
                { label: "Mobile Apps", value: stats.mobile, icon: FaMobile, color: "from-purple-500 to-purple-600" },
                { label: "Desktop Apps", value: stats.desktop, icon: FaDesktop, color: "from-orange-500 to-orange-600" }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.3 }}
                  whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -2 }}
                >
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r ${stat.color} rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3 lg:mb-4 mx-auto`}>
                    <stat.icon className="text-white text-sm sm:text-lg lg:text-xl" />
                  </div>
                  <div className={`text-xl sm:text-2xl lg:text-3xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1 sm:mb-2`}>
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium leading-tight">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Controls Section - Responsive Design */}
          <motion.div
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-xl mb-8 sm:mb-12 mx-4 sm:mx-0"
            variants={itemVariants}
          >
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 sm:justify-between items-center">
              
              {/* Category Filters - Responsive */}
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {categories.map((category) => (
                  <motion.button
                    key={category.value}
                    onClick={() => handleCategoryFilter(category.value)}
                    className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 ${
                      filter === category.value
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                    }`}
                    variants={filterVariants}
                    whileHover="hover"
                    whileTap={{ scale: 0.95 }}
                  >
                    <category.icon className="text-xs sm:text-sm" />
                    <span className="hidden sm:inline">{category.label}</span>
                    <span className="sm:hidden">{category.label.split(' ')[0]}</span>
                    <span className={`text-xs px-1.5 sm:px-2 py-0.5 rounded-full ${
                      filter === category.value 
                        ? "bg-white/20" 
                        : "bg-slate-200 dark:bg-slate-600"
                    }`}>
                      {category.count}
                    </span>
                  </motion.button>
                ))}
              </div>

              {/* Search and Add Button - Responsive Stack */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                {/* Search Bar - Responsive Width */}
                <motion.div 
                  className="relative flex-1 sm:flex-none"
                  variants={filterVariants}
                >
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full sm:w-48 md:w-56 lg:w-64 px-3 sm:px-4 py-2 pl-8 sm:pl-10 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 transition-all duration-200 text-sm sm:text-base"
                  />
                  <FaSearch className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-xs sm:text-sm" />
                </motion.div>

                {/* Add Project Button (Admin Only) - Responsive */}
                {isAdminLoggedIn && (
                  <motion.button
                    onClick={handleOpenModal}
                    className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg sm:rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg text-sm sm:text-base"
                    whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    variants={filterVariants}
                  >
                    <FaPlus className="text-xs sm:text-sm" />
                    <span className="hidden sm:inline">Add Project</span>
                    <span className="sm:hidden">Add</span>
                  </motion.button>
                )}
              </div>
            </div>

            {/* Filter Results Info - Responsive Text */}
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs sm:text-sm">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <FaFilter className="text-blue-500 flex-shrink-0" />
                  <span className="break-words">
                    Showing {displayedProjects.length} of {filteredProjects.length} projects
                    {filter !== "All" && (
                      <span className="hidden sm:inline"> in {filter}</span>
                    )}
                    {searchQuery && (
                      <span className="block sm:inline mt-1 sm:mt-0">{` matching ${searchQuery}`}</span>
                    )}
                  </span>
                </div>
                
                {error && (
                  <div className="flex items-center gap-2 text-red-500 flex-shrink-0">
                    <FaExclamationTriangle />
                    <span className="hidden sm:inline">Error loading projects</span>
                    <span className="sm:hidden">Error</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
          {/* Projects Grid */}
          <AnimatePresence mode="wait">
            {displayedProjects.length > 0 ? (
              <motion.div
                key={`${filter}-${searchQuery}`}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {displayedProjects.map((project, index) => (
                  <motion.div
                    key={project.id || index}
                    variants={itemVariants}
                    layout
                  >
                    <ProjectCard
                      project={project}
                      index={index}
                      showNotification={showNotification}
                      shouldReduceMotion={shouldReduceMotion}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                className="text-center py-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-24 h-24 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FaCode className="text-4xl text-slate-500 dark:text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
                  No Projects Found
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                  {searchQuery 
                    ? `No projects match "${searchQuery}". Try a different search term.`
                    : `No projects found in ${filter} category.`
                  }
                </p>
                <motion.button
                  onClick={() => {
                    dispatch(setFilter("All"));
                    dispatch(setSearchQuery(""));
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
                  whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Show All Projects
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Load More Button */}
          {filteredProjects.length > 6 && (
            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <motion.button
                onClick={() => setShowAllProjects(!showAllProjects)}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-600 to-cyan-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>
                  {showAllProjects 
                    ? "Show Less Projects" 
                    : `Load More Projects (${filteredProjects.length - 6} remaining)`
                  }
                </span>
                <motion.div
                  animate={showAllProjects ? { rotate: 180 } : { rotate: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaChevronDown className="text-sm" />
                </motion.div>
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Project Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <ProjectsModal
            showNotification={showNotification}
            shouldReduceMotion={shouldReduceMotion}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ProjectSection;