import React, { useState, useMemo, useCallback, useEffect } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { 
  FaAward, 
  FaCertificate, 
  FaPlus, 
  FaFilter, 
  FaSearch, 
  FaEye, 
  FaTrophy,
  FaChevronDown,
  FaTimes,
  FaStar,
  FaCalendar,
  FaSpinner,
  FaExclamationTriangle,
  FaSync,
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { 
  fetchCertificates, 
  setFilter, 
  setSearchTerm, 
  applyFilters,
  clearError,
  clearSuccess
} from "../Store/Features/certificateSlice";
import CertificateCard from "../Components/Certification/CertificateCard";
import AddCertificateModal from "../Components/Certification/AddCertificateModal";

// Performance constants
const INITIAL_DISPLAY_COUNT = 6;
const LOAD_MORE_COUNT = 6;

// Skeleton Components
const CertificateCardSkeleton = React.memo(() => (
  <div className="bg-white/80 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl animate-pulse">
    {/* Image skeleton */}
    <div className="w-full h-48 bg-slate-200/50 dark:bg-slate-700/50 rounded-xl mb-4"></div>
    
    {/* Content skeleton */}
    <div className="space-y-3">
      <div className="h-6 bg-slate-200/50 dark:bg-slate-700/50 rounded w-3/4"></div>
      <div className="h-4 bg-slate-200/30 dark:bg-slate-700/30 rounded w-1/2"></div>
      <div className="h-4 bg-slate-200/30 dark:bg-slate-700/30 rounded w-2/3"></div>
      <div className="flex justify-between items-center mt-4">
        <div className="h-6 bg-slate-200/30 dark:bg-slate-700/30 rounded w-20"></div>
        <div className="h-8 bg-blue-200/20 dark:bg-blue-500/20 rounded-full w-24"></div>
      </div>
    </div>
  </div>
));

const StatCardSkeleton = React.memo(() => (
  <div className="space-y-4 animate-pulse">
    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-200/50 dark:bg-slate-700/50 rounded-2xl mx-auto"></div>
    <div className="h-8 sm:h-10 bg-slate-200/50 dark:bg-slate-700/50 rounded w-16 mx-auto"></div>
    <div className="space-y-1">
      <div className="h-4 bg-slate-200/30 dark:bg-slate-700/30 rounded w-20 mx-auto"></div>
      <div className="h-3 bg-slate-200/20 dark:bg-slate-700/20 rounded w-24 mx-auto"></div>
    </div>
  </div>
));

CertificateCardSkeleton.displayName = 'CertificateCardSkeleton';
StatCardSkeleton.displayName = 'StatCardSkeleton';

const CertificateSection = React.memo(() => {
  const dispatch = useDispatch();
  const { 
    certificates = [],
    filteredCertificates = [],
    loading = false, 
    error = null, 
    success = null,
    filters = { category: 'All', searchTerm: '' },
    stats = { total: 0, categories: 0, recent: 0, verified: 0 }
  } = useSelector(state => state.certificate || {});
  
  // Admin verification
  const isAdminLoggedIn = useMemo(() => 
    sessionStorage.getItem("isAdminAuthenticated") === "true" ||
    localStorage.getItem("adminToken") !== null,
    []
  );
  
  const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredCertificate, setHoveredCertificate] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);
  
  const shouldReduceMotion = useReducedMotion();

  // Fetch certificates on mount - Fixed to prevent infinite loading
  useEffect(() => {
    if (!hasInitiallyLoaded && !loading) {
      setHasInitiallyLoaded(true);
      dispatch(fetchCertificates());
    }
  }, [dispatch, hasInitiallyLoaded, loading]);

  // Apply filters when filter or search term changes
  useEffect(() => {
    if (certificates.length > 0) {
      dispatch(applyFilters());
    }
  }, [dispatch, filters.category, filters.searchTerm, certificates.length]);

  // Auto-clear success messages
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(clearSuccess());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  // Auto-clear error messages
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  // Extract unique categories with memoization
  const categories = useMemo(() => {
    if (!certificates.length) return ["All"];
    const cats = certificates.map(cert => cert.category || "General");
    return ["All", ...new Set(cats)];
  }, [certificates]);

  // Display certificates with pagination
  const displayedCertificates = useMemo(() => 
    filteredCertificates.slice(0, displayCount),
    [filteredCertificates, displayCount]
  );

  // Check if more certificates available
  const hasMoreCertificates = useMemo(() => 
    displayCount < filteredCertificates.length,
    [displayCount, filteredCertificates.length]
  );

  // Check if we're in initial loading state
  const isInitialLoading = useMemo(() => 
    loading && certificates.length === 0,
    [loading, certificates.length]
  );

  // Animation variants
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.08,
      },
    },
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { y: 30, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100,
        duration: 0.4
      },
    },
  }), []);

  const heroVariants = useMemo(() => ({
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 120,
        duration: 0.6
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
      scale: 1.05,
      y: -2,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 400
      }
    },
  }), [shouldReduceMotion]);

  // Optimized handlers
  const handleFilterChange = useCallback((category) => {
    dispatch(setFilter(category));
    setDisplayCount(INITIAL_DISPLAY_COUNT);
  }, [dispatch]);

  const handleSearchChange = useCallback((e) => {
    dispatch(setSearchTerm(e.target.value));
    setDisplayCount(INITIAL_DISPLAY_COUNT);
  }, [dispatch]);

  const handleLoadMore = useCallback(() => {
    setDisplayCount(prev => Math.min(prev + LOAD_MORE_COUNT, filteredCertificates.length));
  }, [filteredCertificates.length]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await dispatch(fetchCertificates()).unwrap();
    } catch (error) {
      console.error('Failed to refresh certificates:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [dispatch]);

  const handleClearSearch = useCallback(() => {
    dispatch(setSearchTerm(''));
    setDisplayCount(INITIAL_DISPLAY_COUNT);
  }, [dispatch]);

  const handleClearFilters = useCallback(() => {
    dispatch(setFilter('All'));
    dispatch(setSearchTerm(''));
    setDisplayCount(INITIAL_DISPLAY_COUNT);
  }, [dispatch]);

  // Generate floating particles array only once
  const particles = useMemo(
    () =>
      Array.from({ length: shouldReduceMotion ? 4 : 8 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 4,
        size: Math.random() * 2 + 1,
      })),
    [shouldReduceMotion]
  );

  return (
    <motion.section
      id="Achievements"
      className="relative min-h-screen py-16 sm:py-20 lg:py-24 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-black transition-colors duration-500"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
    >
      {/* Exotic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large Gradient Orbs */}
        {!shouldReduceMotion && (
          <>
            {/* Primary Blue-Purple Orb */}
            <motion.div
              className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-500/12 via-indigo-500/8 to-purple-500/6 dark:from-blue-500/15 dark:via-indigo-500/12 dark:to-purple-500/15 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.4, 0.2],
                x: [0, 20, 0],
                y: [0, -10, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            {/* Secondary Cyan-Teal Orb */}
            <motion.div
              className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-r from-cyan-500/10 via-teal-500/8 to-emerald-500/6 dark:from-cyan-500/12 dark:via-teal-500/12 dark:to-emerald-500/18 rounded-full blur-3xl"
              animate={{
                scale: [1.1, 1, 1.1],
                opacity: [0.15, 0.35, 0.15],
                x: [0, -15, 0],
                y: [0, 15, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
            />
            
            {/* Accent Orange Orb */}
            <motion.div
              className="absolute top-1/2 left-1/4 w-60 h-60 bg-gradient-to-r from-orange-500/8 to-amber-500/8 dark:from-orange-500/10 dark:via-orange-400/15 dark:to-amber-400/15 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.1, 0.25, 0.1],
                rotate: [0, 90, 180, 270, 360],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "linear",
                delay: 4,
              }}
            />
          </>
        )}

        {/* Floating Particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute bg-slate-400/20 dark:bg-white/20 rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={
              shouldReduceMotion
                ? {}
                : {
                    y: [0, -30, 0],
                    opacity: [0, 0.6, 0],
                    scale: [0.8, 1.2, 0.8],
                  }
            }
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Geometric Grid Pattern */}
        {!shouldReduceMotion && (
          <>
            {/* Rotating Ring */}
            <motion.div
              className="absolute top-32 left-32 w-40 h-40 border-2 border-blue-500/8 dark:border-blue-500/10 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Counter-rotating Square */}
            <motion.div
              className="absolute bottom-32 right-32 w-32 h-32 border-2 border-purple-500/8 dark:border-purple-500/10 rounded-lg"
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Floating Hexagon */}
            <motion.div
              className="absolute top-2/3 right-1/4 w-24 h-24 border-2 border-cyan-500/10 dark:border-cyan-500/15"
              style={{
                clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"
              }}
              animate={{
                rotate: [0, 120, 240, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </>
        )}

        {/* Neural Network Lines */}
        {!shouldReduceMotion && (
          <svg className="absolute inset-0 w-full h-full opacity-3 dark:opacity-5">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            <motion.path
              d="M100,200 Q300,100 500,200 T900,200"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.3 }}
              transition={{ duration: 3, ease: "easeInOut", delay: 1 }}
            />
            <motion.path
              d="M150,400 Q350,300 550,400 T950,400"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.3 }}
              transition={{ duration: 3, ease: "easeInOut", delay: 1.5 }}
            />
          </svg>
        )}
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Global Notification Messages */}
        <AnimatePresence>
          {(success || error) && (
            <motion.div
              className={`fixed top-4 right-4 z-50 max-w-md p-4 rounded-xl shadow-2xl border backdrop-blur-xl ${
                success 
                  ? 'bg-emerald-500/90 border-emerald-400/50 dark:bg-emerald-600/90 dark:border-emerald-400/50' 
                  : 'bg-red-500/90 border-red-400/50 dark:bg-red-600/90 dark:border-red-400/50'
              }`}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              transition={{ type: "spring", damping: 20, stiffness: 200 }}
            >
              <div className="flex items-center gap-3">
                {success ? (
                  <div className="w-8 h-8 bg-emerald-400 dark:bg-emerald-300 rounded-full flex items-center justify-center">
                    <FaAward className="text-white dark:text-emerald-800 text-sm" />
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-red-400 dark:bg-red-300 rounded-full flex items-center justify-center">
                    <FaExclamationTriangle className="text-white dark:text-red-800 text-sm" />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-sm text-white">
                    {success ? 'Success!' : 'Error'}
                  </p>
                  <p className="text-xs text-white/80">
                    {success || error}
                  </p>
                </div>
                <motion.button
                  onClick={() => success ? dispatch(clearSuccess()) : dispatch(clearError())}
                  className="ml-auto p-1 hover:bg-white/10 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaTimes className="text-xs text-white" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Section */}
        <motion.div
          variants={heroVariants}
          className="text-center mb-16"
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-400/15 dark:to-purple-400/15 border border-blue-500/20 dark:border-blue-400/30 rounded-2xl backdrop-blur-xl mb-8 shadow-xl"
            whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -3 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 rounded-lg flex items-center justify-center mr-3"
              whileHover={shouldReduceMotion ? {} : { scale: 1.2, rotate: 180 }}
              transition={{ duration: 0.4 }}
            >
              <FaTrophy className="text-white text-sm" />
            </motion.div>
            <span className="text-sm font-bold bg-gradient-to-r from-blue-400 to-purple-400 dark:from-blue-300 dark:to-purple-300 bg-clip-text text-transparent">
              Professional Certifications & Achievements
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h2
            className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            My Achievements
          </motion.h2>

          <motion.p
            className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto leading-relaxed mb-8"
            variants={itemVariants}
          >
            A curated collection of professional certifications and achievements that showcase 
            my commitment to continuous learning and technical excellence
          </motion.p>

          {/* Enhanced Stats Counter */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-4"
            variants={itemVariants}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-400/15 dark:to-purple-400/15 border border-blue-500/20 dark:border-blue-400/30 rounded-full backdrop-blur-xl">
              <FaEye className="text-blue-400 dark:text-blue-300 text-sm" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {isInitialLoading ? (
                  <span className="flex items-center gap-2">
                    <FaSpinner className="animate-spin" />
                    Loading...
                  </span>
                ) : (
                  `Showing ${displayedCertificates.length} of ${filteredCertificates.length} certificates`
                )}
              </span>
            </div>

            <motion.button
              onClick={handleRefresh}
              disabled={loading || isRefreshing}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 dark:from-cyan-400/15 dark:to-teal-400/15 border border-cyan-500/20 dark:border-cyan-400/30 rounded-full hover:bg-cyan-500/20 dark:hover:bg-cyan-400/25 transition-colors disabled:opacity-50 backdrop-blur-xl"
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaSync className={`text-cyan-400 dark:text-cyan-300 text-sm ${(loading || isRefreshing) ? 'animate-spin' : ''}`} />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Admin Controls */}
        {isAdminLoggedIn && (
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <motion.button
              onClick={() => setIsModalOpen(true)}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-emerald-400 dark:to-teal-500 text-white font-bold rounded-2xl shadow-2xl hover:shadow-emerald-500/25 dark:hover:shadow-emerald-400/25 transition-all duration-300"
              whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                whileHover={shouldReduceMotion ? {} : { rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <FaPlus className="text-lg" />
              </motion.div>
              <span>Add New Certificate</span>
              
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-700 dark:from-emerald-500 dark:to-teal-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ zIndex: -1 }}
              />
            </motion.button>
          </motion.div>
        )}

        {/* Enhanced Search and Filter Section */}
        <motion.div
          className="mb-12 space-y-6"
          variants={itemVariants}
        >
          {/* Search Bar with Clear */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-md">
              <motion.div
                className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
              >
                <FaSearch className="h-5 w-5 text-blue-400 dark:text-blue-300" />
              </motion.div>
              <input
                type="text"
                placeholder="Search certificates..."
                value={filters.searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-12 pr-12 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-300/50 dark:border-slate-700/50 rounded-2xl backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 focus:border-blue-500/50 dark:focus:border-blue-400/50 transition-all duration-300 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
              />
              {filters.searchTerm && (
                <motion.button
                  onClick={handleClearSearch}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaTimes className="h-4 w-4" />
                </motion.button>
              )}
            </div>
          </div>

          {/* Category Filter Header */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center px-4 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-300/50 dark:border-slate-700/50 rounded-full backdrop-blur-xl">
              <FaFilter className="mr-2 text-blue-400 dark:text-blue-300" />
              <span className="text-sm font-medium text-slate-900 dark:text-white">Filter by Category</span>
              {(filters.category !== 'All' || filters.searchTerm) && (
                <motion.button
                  onClick={handleClearFilters}
                  className="ml-3 px-2 py-1 text-xs bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-300 border border-red-300 dark:border-red-500/30 rounded-lg hover:bg-red-200 dark:hover:bg-red-500/30 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Clear All
                </motion.button>
              )}
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category, index) => {
              const count = category === "All" 
                ? certificates.length 
                : certificates.filter(cert => (cert.category || "General") === category).length;
              
              return (
                <motion.button
                  key={category}
                  onClick={() => handleFilterChange(category)}
                  className={`relative px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 backdrop-blur-xl border ${
                    filters.category === category
                      ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 dark:from-blue-400/25 dark:to-purple-400/25 text-slate-900 dark:text-white border-blue-500/50 dark:border-blue-400/50 shadow-lg shadow-blue-500/25 dark:shadow-blue-400/25"
                      : "bg-white/30 dark:bg-slate-800/30 text-slate-700 dark:text-slate-300 border-slate-300/30 dark:border-slate-700/30 hover:bg-slate-100/40 dark:hover:bg-slate-700/40 hover:border-slate-400/40 dark:hover:border-slate-600/40"
                  }`}
                  variants={filterVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  whileTap={{ scale: 0.95 }}
                  custom={index}
                >
                  <AnimatePresence>
                    {filters.category === category && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-400/15 dark:to-purple-400/15 rounded-xl"
                        layoutId="activeFilterBg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", damping: 20, stiffness: 200 }}
                      />
                    )}
                  </AnimatePresence>
                  
                  <span className="relative z-10 flex items-center gap-1">
                    <FaStar className="text-xs" />
                    {category}
                    <span className="text-xs opacity-70 ml-1">
                      ({count})
                    </span>
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Loading State with Skeletons */}
        {isInitialLoading && (
          <motion.div
            className="space-y-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Certificate Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {Array.from({ length: 6 }, (_, i) => (
                <CertificateCardSkeleton key={i} />
              ))}
            </div>

            {/* Stats Skeleton */}
            <div className="bg-gradient-to-br from-white/80 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border-2 border-slate-200/50 dark:border-slate-700/50 shadow-2xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {Array.from({ length: 4 }, (_, i) => (
                  <StatCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* No Results State */}
        {!isInitialLoading && !loading && filteredCertificates.length === 0 && certificates.length > 0 && (
          <motion.div
            className="flex flex-col items-center justify-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.div
              className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-blue-500/25 dark:shadow-blue-400/25"
              whileHover={{ scale: 1.1, rotate: 15 }}
            >
              <FaSearch className="text-white text-2xl" />
            </motion.div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              No certificates found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-center mb-4">
              Try adjusting your search terms or filters
            </p>
            <motion.button
              onClick={handleClearFilters}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 dark:hover:from-blue-500 dark:hover:to-purple-600 transition-all font-semibold shadow-lg shadow-blue-500/25 dark:shadow-blue-400/25"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Clear Filters
            </motion.button>
          </motion.div>
        )}

        {/* Certificates Grid */}
        <AnimatePresence mode="wait">
          {!isInitialLoading && displayedCertificates.length > 0 && (
            <motion.div
              key={`${filters.category}-${filters.searchTerm}-${displayCount}`}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {displayedCertificates.map((cert, index) => (
                <motion.div
                  key={cert.id || index}
                  variants={itemVariants}
                  layout
                  onHoverStart={() => setHoveredCertificate(cert.id)}
                  onHoverEnd={() => setHoveredCertificate(null)}
                >
                  <CertificateCard
                    image={cert.image}
                    link={cert.link}
                    title={cert.name}
                    org={cert.organization}
                    category={cert.category}
                    issueDate={cert.issueDate}
                    description={cert.description}
                    verified={cert.verified}
                    isHovered={hoveredCertificate === cert.id}
                    index={index}
                    shouldReduceMotion={shouldReduceMotion}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Load More Button */}
        {hasMoreCertificates && !isInitialLoading && (
          <motion.div
            className="flex justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <motion.button
              onClick={handleLoadMore}
              disabled={loading}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-blue-500/25 dark:hover:shadow-blue-400/25 transition-all duration-300 backdrop-blur-xl border border-blue-500/30 dark:border-blue-400/30 disabled:opacity-50"
              whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="flex items-center gap-2"
                whileHover={shouldReduceMotion ? {} : { x: 2 }}
              >
                {loading ? (
                  <FaSpinner className="text-sm animate-spin" />
                ) : (
                  <FaChevronDown className="text-sm" />
                )}
                <span>
                  {loading ? 'Loading...' : `Load More (${filteredCertificates.length - displayedCertificates.length} remaining)`}
                </span>
              </motion.div>
              
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 dark:from-blue-500 dark:to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ zIndex: -1 }}
              />
            </motion.button>
          </motion.div>
        )}

        {/* Enhanced Statistics Dashboard */}
        {!isInitialLoading && certificates.length > 0 && (
          <motion.div
            className="bg-gradient-to-br from-white/80 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border-2 border-slate-200/50 dark:border-slate-700/50 shadow-2xl relative overflow-hidden"
            variants={itemVariants}
            whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-3 dark:opacity-5">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 dark:from-blue-300 dark:to-purple-500" />
            </div>

            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center relative z-10"
              variants={containerVariants}
            >
              {[
                { 
                  number: stats.total.toString(), 
                  label: "Total Certificates", 
                  color: "from-blue-500 to-cyan-500 dark:from-blue-400 dark:to-cyan-400", 
                  icon: FaCertificate,
                  description: "Professional certifications earned"
                },
                { 
                  number: stats.categories.toString(), 
                  label: "Categories", 
                  color: "from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400", 
                  icon: FaFilter,
                  description: "Different skill domains"
                },
                { 
                  number: stats.recent.toString(), 
                  label: "Recent", 
                  color: "from-emerald-500 to-teal-500 dark:from-emerald-400 dark:to-teal-400", 
                  icon: FaCalendar,
                  description: "Earned in last 6 months"
                },
                { 
                  number: stats.verified.toString(), 
                  label: "Verified", 
                  color: "from-orange-500 to-red-500 dark:from-orange-400 dark:to-red-400", 
                  icon: FaAward,
                  description: "Authenticated credentials"
                },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="space-y-4 group"
                  variants={itemVariants}
                  whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -3 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${stat.color} rounded-2xl shadow-lg relative overflow-hidden`}
                    whileHover={shouldReduceMotion ? {} : { rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <stat.icon className="text-white text-lg sm:text-2xl relative z-10" />
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
                    <div className="text-slate-900 dark:text-white font-bold text-sm sm:text-base">
                      {stat.label}
                    </div>
                    <div className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-tight">
                      {stat.description}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Add Certificate Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <AddCertificateModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            shouldReduceMotion={shouldReduceMotion}
          />
        )}
      </AnimatePresence>
    </motion.section>
  );
});

CertificateSection.displayName = 'CertificateSection';

export default CertificateSection;