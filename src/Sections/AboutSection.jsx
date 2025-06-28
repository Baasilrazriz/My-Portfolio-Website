import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  motion,
  useInView,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import {
  FaUser,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaBriefcase,
  FaEdit,
  FaTimes,
  FaDownload,
  FaCommentDots,
  FaCode,
  FaRocket,
  FaStar,
  FaHeart,
  FaGraduationCap,
  FaCoffee,
  FaGithub,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
  FaCertificate,
  FaLanguage,
  FaFilePdf,
  FaTrash,
  FaEye,
  FaCloudUploadAlt,
} from "react-icons/fa";

// Import Redux actions
import { fetchAboutInfo, updateAboutInfo } from "../Store/Features/aboutSlice";

// Import CV utilities
import { 
  uploadToCloudinary, 
  downloadFile, 
  validatePdfFile, 
  validateImageFile
} from "../utils/cvUtils";

function AboutSection() {
  const dispatch = useDispatch();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.1 });
  const shouldReduceMotion = useReducedMotion();

  // Redux state
  const {
    Profilepic: profilePic,
    about,
    name,
    title,
    dob,
    location,
    email,
    phone,
    education,
    languages,
    interests,
    certifications,
    cvUrl,
    cvFileName,
    loading,
    error,
  } = useSelector((state) => state.about || {});

  // Session validation for admin
  const isAdminLoggedIn =
    sessionStorage.getItem("isAdminAuthenticated") === "true" ||
    localStorage.getItem("adminToken") !== null;

  // Modal and form state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isCvUploading, setIsCvUploading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });

  // Default data for fallbacks
  const defaultData = useMemo(() => ({
    name: "Muhammad Basil Irfan",
    title: "Full Stack Developer",
    dob: "June 30, 2003",
    location: "Karachi, Sindh, Pakistan",
    email: "baasilrazriz@gmail.com",
    phone: "+923237184249",
    about: "Passionate Full Stack Developer with 3+ years of experience creating innovative digital solutions. I specialize in MERN stack development and love turning complex problems into elegant, user-friendly applications.",
    education: "Bachelor's in Computer Science",
    languages: "English, Urdu, Hindi",
    interests: "Web Development, UI/UX Design, Open Source",
    certifications: "AWS Certified, React Developer Certified",
    profilePic: "",
    cvUrl: "/cv.pdf", // Local fallback URL that's always accessible
    cvFileName: "Muhammad_Basil_Irfan_CV.pdf",
  }), []);

  // Create editData state that syncs with Redux store
  const [editData, setEditData] = useState(defaultData);

  // Fetch data when component mounts
  useEffect(() => {
    dispatch(fetchAboutInfo());
  }, [dispatch]);

  // Update local editData when Redux state changes
  useEffect(() => {
    setEditData({
      name: name || defaultData.name,
      title: title || defaultData.title,
      dob: dob || defaultData.dob,
      location: location || defaultData.location,
      email: email || defaultData.email,
      phone: phone || defaultData.phone,
      about: about || defaultData.about,
      education: education || defaultData.education,
      languages: languages || defaultData.languages,
      interests: interests || defaultData.interests,
      certifications: certifications || defaultData.certifications,
      profilePic: profilePic || defaultData.profilePic,
      // Force local CV URL for reliability
      cvUrl: "/cv.pdf",
      cvFileName: "Muhammad_Basil_Irfan_CV.pdf",
    });
  }, [name, title, dob, location, email, phone, about, education, languages, interests, certifications, profilePic, cvUrl, cvFileName, defaultData]);

 // Optimized notification handler
  const showNotification = useCallback((type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: "", message: "" });
    }, 3000);
  }, []);

  // Show error notification if Redux error occurs
  useEffect(() => {
    if (error) {
      showNotification("error", `Error: ${error}`);
    }
  }, [error, showNotification]);

  // Ultra-fast modal animation variants
  const modalVariants = useMemo(
    () => ({
      hidden: {
        opacity: 0,
        scale: 0.96,
        y: 10,
      },
      visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
          duration: 0.15,
          ease: [0.25, 0.46, 0.45, 0.94],
        },
      },
      exit: {
        opacity: 0,
        scale: 0.96,
        y: 10,
        transition: {
          duration: 0.1,
          ease: "easeIn",
        },
      },
    }),
    []
  );

  const backdropVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { duration: 0.1 },
      },
      exit: {
        opacity: 0,
        transition: { duration: 0.1 },
      },
    }),
    []
  );

  // Optimized animation variants with reduced motion support
  const containerVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          duration: shouldReduceMotion ? 0.1 : 0.3,
          staggerChildren: shouldReduceMotion ? 0.02 : 0.05,
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
        y: shouldReduceMotion ? 5 : 15,
        scale: shouldReduceMotion ? 1 : 0.98,
      },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: shouldReduceMotion ? 0.1 : 0.3,
          ease: "easeOut",
        },
      },
    }),
    [shouldReduceMotion]
  );

  const imageVariants = useMemo(
    () => ({
      hidden: {
        opacity: 0,
        scale: shouldReduceMotion ? 1 : 0.95,
        rotate: shouldReduceMotion ? 0 : -2,
      },
      visible: {
        opacity: 1,
        scale: 1,
        rotate: 0,
        transition: {
          duration: shouldReduceMotion ? 0.2 : 0.4,
          ease: "easeOut",
        },
      },
    }),
    [shouldReduceMotion]
  );

  const cardVariants = useMemo(
    () => ({
      hidden: {
        opacity: 0,
        y: shouldReduceMotion ? 3 : 10,
        scale: shouldReduceMotion ? 1 : 0.98,
      },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: shouldReduceMotion ? 0.1 : 0.25,
          ease: "easeOut",
        },
      },
    }),
    [shouldReduceMotion]
  );

 

  // Optimized image upload handler
  const handleImageUpload = useCallback(
    async (file) => {
      if (!file) return;

      // Validate file using utility
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        showNotification("error", validation.errors[0]);
        return;
      }

      setIsUploading(true);
      try {
        const data = await uploadToCloudinary(file, 'image');
        if (data.secure_url) {
          setEditData((prev) => ({ ...prev, profilePic: data.secure_url }));
          showNotification("success", "Image uploaded successfully!");
        }
      } catch (error) {
        showNotification("error", "Image upload failed. Please try again.");
        console.error("Image upload error:", error);
      } finally {
        setIsUploading(false);
      }
    },
    [showNotification]
  );

  // CV Upload Handler
  const handleCvUpload = useCallback(
    async (file) => {
      if (!file) return;

      // Validate file using utility
      const validation = validatePdfFile(file);
      if (!validation.isValid) {
        showNotification("error", validation.errors[0]);
        return;
      }

      setIsCvUploading(true);
      try {
        const data = await uploadToCloudinary(file, 'raw');
        if (data.secure_url) {
          setEditData((prev) => ({ 
            ...prev, 
            cvUrl: data.secure_url,
            cvFileName: file.name
          }));
          showNotification("success", "CV uploaded successfully!");
        }
      } catch (error) {
        showNotification("error", "CV upload failed. Please try again.");
        console.error("CV upload error:", error);
      } finally {
        setIsCvUploading(false);
      }
    },
    [showNotification]
  );

  // CV Download Handler
  const handleCvDownload = useCallback(async () => {
    try {
      console.log('Downloading CV from:', editData.cvUrl);
      const result = await downloadFile(editData.cvUrl, editData.cvFileName);
      
      if (result.success) {
        if (result.method === 'popup') {
          showNotification("success", "CV opened in new tab");
        } else {
          showNotification("success", "CV download started!");
        }
      }
    } catch (error) {
      console.error("Download error:", error);
      showNotification("error", "Failed to download CV. Please try again.");
    }
  }, [editData.cvUrl, editData.cvFileName, showNotification]);

  // CV Delete Handler
  const handleCvDelete = useCallback(() => {
    setEditData((prev) => ({ 
      ...prev, 
      cvUrl: "",
      cvFileName: ""
    }));
    showNotification("success", "CV removed successfully!");
  }, [showNotification]);

  // CV Preview Handler
  const handleCvPreview = useCallback(() => {
    if (editData.cvUrl) {
      window.open(editData.cvUrl, '_blank');
    }
  }, [editData.cvUrl]);

  // Optimized form submission handler
  const handleSaveChanges = useCallback(async () => {
    try {
      // Validate required fields
      if (!editData.name.trim() || !editData.email.trim()) {
        showNotification("error", "Name and email are required fields");
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editData.email)) {
        showNotification("error", "Please enter a valid email address");
        return;
      }

      // Prepare data for Firebase (match the field names)
      const dataToUpdate = {
        name: editData.name,
        title: editData.title,
        dob: editData.dob,
        location: editData.location,
        email: editData.email,
        phone: editData.phone,
        about: editData.about,
        education: editData.education,
        languages: editData.languages,
        interests: editData.interests,
        certifications: editData.certifications,
        Profilepic: editData.profilePic, // Note: Using 'Profilepic' to match Redux state
        cvUrl: editData.cvUrl,
        cvFileName: editData.cvFileName,
      };

      // Dispatch Redux action
      await dispatch(updateAboutInfo(dataToUpdate)).unwrap();

      setIsEditModalOpen(false);
      showNotification("success", "Information updated successfully!");
    } catch (error) {
      showNotification("error", "Update failed. Please try again.");
    }
  }, [editData, dispatch, showNotification]);

  // Optimized input change handler
  const handleInputChange = useCallback((key, value) => {
    setEditData((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Fast close modal handler
  const closeModal = useCallback(() => {
    setIsEditModalOpen(false);
  }, []);

  // Fast open modal handler
  const openModal = useCallback(() => {
    setIsEditModalOpen(true);
  }, []);

  // Memoized data arrays
  const personalInfo = useMemo(
    () => [
      {
        label: "Full Name",
        value: editData.name,
        icon: FaUser,
        gradient: "from-blue-500 to-cyan-500",
      },
      {
        label: "Date of Birth",
        value: editData.dob,
        icon: FaCalendarAlt,
        gradient: "from-purple-500 to-pink-500",
      },
      {
        label: "Location",
        value: editData.location,
        icon: FaMapMarkerAlt,
        gradient: "from-green-500 to-emerald-500",
      },
      {
        label: "Email Address",
        value: editData.email,
        icon: FaEnvelope,
        gradient: "from-orange-500 to-red-500",
      },
      {
        label: "Phone Number",
        value: editData.phone,
        icon: FaPhone,
        gradient: "from-indigo-500 to-purple-500",
      },
      {
        label: "Status",
        value: "Available for work",
        icon: FaBriefcase,
        gradient: "from-teal-500 to-cyan-500",
      },
    ],
    [editData]
  );

  const aboutDetails = useMemo(
    () => [
      {
        title: "Education",
        value: editData.education,
        icon: FaGraduationCap,
        color: "from-blue-500 to-cyan-500",
      },
      {
        title: "Languages",
        value: editData.languages,
        icon: FaLanguage,
        color: "from-green-500 to-emerald-500",
      },
      {
        title: "Interests",
        value: editData.interests,
        icon: FaHeart,
        color: "from-purple-500 to-pink-500",
      },
      {
        title: "Certifications",
        value: editData.certifications,
        icon: FaCertificate,
        color: "from-yellow-500 to-orange-500",
      },
    ],
    [editData]
  );

  const achievements = useMemo(
    () => [
      { number: "50+", label: "Projects Completed", icon: FaRocket },
      { number: "3+", label: "Years Experience", icon: FaGraduationCap },
      { number: "100%", label: "Client Satisfaction", icon: FaHeart },
      { number: "24/7", label: "Support Available", icon: FaCoffee },
    ],
    []
  );

  // Optimized form fields
  const formFields = useMemo(
    () => [
      {
        label: "Full Name",
        key: "name",
        type: "text",
        icon: FaUser,
        required: true,
      },
      {
        label: "Professional Title",
        key: "title",
        type: "text",
        icon: FaBriefcase,
      },
      { label: "Date of Birth", key: "dob", type: "text", icon: FaCalendarAlt },
      {
        label: "Location",
        key: "location",
        type: "text",
        icon: FaMapMarkerAlt,
      },
      {
        label: "Email Address",
        key: "email",
        type: "email",
        icon: FaEnvelope,
        required: true,
      },
      { label: "Phone Number", key: "phone", type: "tel", icon: FaPhone },
      {
        label: "Education",
        key: "education",
        type: "text",
        icon: FaGraduationCap,
      },
      { label: "Languages", key: "languages", type: "text", icon: FaLanguage },
      { label: "Interests", key: "interests", type: "text", icon: FaHeart },
      {
        label: "Certifications",
        key: "certifications",
        type: "text",
        icon: FaCertificate,
      },
    ],
    []
  );

  // Generate particles array only once
  const particles = useMemo(
    () =>
      Array.from({ length: shouldReduceMotion ? 3 : 6 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 3,
      })),
    [shouldReduceMotion]
  );

  // Show loading state while fetching initial data
  if (loading && !name && !editData.name) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <FaSpinner className="text-4xl text-blue-400 animate-spin" />
          <p className="text-slate-900 dark:text-white text-lg">Loading about information...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Notification */}
      <AnimatePresence mode="wait">
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="fixed top-4 right-4 z-[60] max-w-md"
          >
            <div
              className={`p-4 rounded-xl shadow-lg backdrop-blur-sm border ${
                notification.type === "success"
                  ? "bg-green-500/90 border-green-400"
                  : "bg-red-500/90 border-red-400"
              }`}
            >
              <div className="flex items-center gap-3">
                {notification.type === "success" ? (
                  <FaCheckCircle className="text-white text-xl" />
                ) : (
                  <FaExclamationTriangle className="text-white text-xl" />
                )}
                <p className="text-white font-medium">{notification.message}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.section
        ref={ref}
        className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-black overflow-hidden"
        id="about"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          {!shouldReduceMotion && (
            <>
              <motion.div
                className="absolute top-20 right-20 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/10 dark:to-purple-500/10 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute bottom-20 left-20 w-60 h-60 bg-gradient-to-r from-cyan-500/8 to-teal-500/8 dark:from-cyan-500/8 dark:to-teal-500/8 rounded-full blur-3xl"
                animate={{
                  scale: [1.1, 1, 1.1],
                  opacity: [0.15, 0.3, 0.15],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2,
                }}
              />
            </>
          )}

          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-1 h-1 bg-slate-400/30 dark:bg-white/20 rounded-full"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
              }}
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      y: [0, -30, 0],
                      opacity: [0, 0.6, 0],
                    }
              }
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: particle.delay,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-20">
            <motion.div
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 dark:border-blue-500/20 rounded-full backdrop-blur-sm mb-6"
              variants={itemVariants}
              whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
              transition={{ duration: 0.15 }}
            >
              <FaUser className="mr-2 text-blue-400" />
              <span className="text-sm font-medium text-blue-400">
                Get to know me better
              </span>
            </motion.div>

            <motion.h2
              className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent mb-6"
              variants={itemVariants}
            >
              About Me
            </motion.h2>
            <motion.p
              className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              Crafting digital experiences with passion, precision, and
              innovative thinking
            </motion.p>

            {/* Admin Edit Button */}
            {isAdminLoggedIn && (
              <motion.button
                onClick={openModal}
                className="mt-8 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-150 flex items-center gap-3 mx-auto shadow-lg"
                whileHover={shouldReduceMotion ? {} : { scale: 1.01, y: -1 }}
                whileTap={{ scale: 0.98 }}
                variants={itemVariants}
                disabled={loading}
              >
                {loading ? (
                  <FaSpinner className="text-lg animate-spin" />
                ) : (
                  <FaEdit className="text-lg" />
                )}
                {loading ? "Updating..." : "Edit Information"}
              </motion.button>
            )}
          </motion.div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-20 items-center mb-20">
            {/* Profile Image Section */}
            <motion.div
              className="relative order-2 lg:order-1 flex justify-center"
              variants={imageVariants}
            >
              <div className="relative">
                {!shouldReduceMotion && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/15 to-purple-500/15 rounded-full blur-2xl"
                    animate={{
                      scale: [1, 1.05, 1],
                      opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}

                <motion.div
                  className="relative w-64 h-80 lg:w-96 lg:h-[33rem]"
                  whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-1">
                    <div className="w-full h-full rounded-3xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800">
                      <img
                        src={editData.profilePic || "/api/placeholder/400/400"}
                        alt={`${editData.name} - ${editData.title}`}
                        className="w-full h-full object-cover object-center"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = "/api/placeholder/400/400";
                        }}
                      />
                    </div>
                  </div>

                  <motion.div
                    className="absolute top-4 right-4 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg"
                    animate={
                      shouldReduceMotion
                        ? {}
                        : {
                            scale: [1, 1.1, 1],
                          }
                    }
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                  >
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </motion.div>

                  {!shouldReduceMotion && (
                    <>
                      <motion.div
                        className="absolute -top-6 -left-6 w-14 h-14 bg-gradient-to-br from-blue-500/15 to-purple-500/15 rounded-2xl backdrop-blur-sm border border-blue-500/20 flex items-center justify-center"
                        animate={{
                          rotate: [0, 360],
                          y: [0, -3, 0],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <FaCode className="text-xl text-blue-400" />
                      </motion.div>

                      <motion.div
                        className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-br from-purple-500/15 to-pink-500/15 rounded-2xl backdrop-blur-sm border border-purple-500/20 flex items-center justify-center"
                        animate={{
                          rotate: [360, 0],
                          y: [0, 5, 0],
                        }}
                        transition={{
                          duration: 5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <FaGithub className="text-2xl text-purple-400" />
                      </motion.div>
                    </>
                  )}
                </motion.div>
              </div>
            </motion.div>

            {/* Content Section */}
            <motion.div
              className="space-y-8 order-1 lg:order-2"
              variants={itemVariants}
            >
              <motion.div variants={cardVariants}>
                <motion.h3
                  className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3"
                  whileHover={shouldReduceMotion ? {} : { x: 3 }}
                  transition={{ duration: 0.15 }}
                >
                  <span>السلام علیکم!</span>
                  <motion.span
                    animate={shouldReduceMotion ? {} : { rotate: [0, 10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    👋
                  </motion.span>
                </motion.h3>
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  {editData.about}
                </p>
              </motion.div>

              <motion.div variants={cardVariants} className="space-y-4">
                <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaStar className="text-yellow-400" />
                  My Background
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aboutDetails.map((detail, index) => (
                    <motion.div
                      key={detail.title}
                      className="bg-gradient-to-br from-white/80 to-slate-100/80 dark:from-slate-800/50 dark:to-slate-900/50 backdrop-blur-lg rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50 hover:border-slate-300/50 dark:hover:border-slate-600/50 transition-all duration-150"
                      initial={{ opacity: 0, y: 5 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.1 + index * 0.02, duration: 0.2 }}
                      whileHover={
                        shouldReduceMotion ? {} : { scale: 1.005, y: -1 }
                      }
                    >
                      <div className="flex items-start gap-3">
                        <motion.div
                          className={`w-10 h-10 bg-gradient-to-r ${detail.color} rounded-lg flex items-center justify-center shadow-lg`}
                          whileHover={
                            shouldReduceMotion
                              ? {}
                              : { rotate: 180, scale: 1.02 }
                          }
                          transition={{ duration: 0.2 }}
                        >
                          <detail.icon className="text-white text-sm" />
                        </motion.div>
                        <div className="flex-1">
                          <h5 className="text-slate-900 dark:text-white font-semibold mb-1">
                            {detail.title}
                          </h5>
                          <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                            {detail.value}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                variants={cardVariants}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.button
                  onClick={handleCvDownload}
                  disabled={!editData.cvUrl}
                  className={`flex-1 ${
                    editData.cvUrl 
                      ? 'cursor-pointer' 
                      : 'cursor-not-allowed opacity-50'
                  }`}
                  whileHover={shouldReduceMotion || !editData.cvUrl ? {} : { scale: 1.005, y: -1 }}
                  whileTap={editData.cvUrl ? { scale: 0.995 } : {}}
                  transition={{ duration: 0.15 }}
                >
                  <div className={`w-full px-8 py-4 bg-gradient-to-r ${
                    editData.cvUrl 
                      ? 'from-blue-600 to-purple-600 hover:shadow-xl' 
                      : 'from-gray-400 to-gray-500'
                  } text-white font-semibold rounded-xl shadow-lg transition-all duration-150 text-center group`}>
                    <span className="flex items-center justify-center gap-3">
                      <FaDownload
                        className={
                          shouldReduceMotion || !editData.cvUrl ? "" : "group-hover:animate-bounce"
                        }
                      />
                      {editData.cvUrl ? "Download CV" : "No CV Available"}
                    </span>
                    {editData.cvUrl && (
                      <span className="text-xs text-blue-100 block mt-1">
                        {editData.cvFileName || 'CV.pdf'}
                      </span>
                    )}
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => {
                    const contactSection = document.getElementById("con");
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="flex-1"
                  whileHover={shouldReduceMotion ? {} : { scale: 1.005, y: -1 }}
                  whileTap={{ scale: 0.995 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="w-full px-8 py-4 bg-transparent border-2 border-slate-400 dark:border-slate-600 text-slate-900 dark:text-white font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 hover:border-slate-500 dark:hover:border-slate-500 transition-all duration-150 text-center group">
                    <span className="flex items-center justify-center gap-3">
                      <FaCommentDots
                        className={
                          shouldReduceMotion ? "" : "group-hover:animate-pulse"
                        }
                      />
                      {"Let's Talk"}
                    </span>
                  </div>
                </motion.button>
              </motion.div>
            </motion.div>
          </div>

          {/* Personal Information Cards */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
          >
            {personalInfo.map((info, index) => (
              <motion.div
                key={info.label}
                className="bg-gradient-to-br from-white/80 to-slate-100/80 dark:from-slate-800/50 dark:to-slate-900/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 hover:border-slate-300/50 dark:hover:border-slate-600/50 transition-all duration-150"
                variants={cardVariants}
                whileHover={
                  shouldReduceMotion
                    ? {}
                    : {
                        scale: 1.005,
                        y: -1,
                      }
                }
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + index * 0.02, duration: 0.2 }}
              >
                <div className="flex items-start space-x-4">
                  <motion.div
                    className={`w-12 h-12 bg-gradient-to-r ${info.gradient} rounded-xl flex items-center justify-center shadow-lg`}
                    whileHover={
                      shouldReduceMotion ? {} : { rotate: 180, scale: 1.02 }
                    }
                    transition={{ duration: 0.2 }}
                  >
                    <info.icon className="text-white text-lg" />
                  </motion.div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                      {info.label}
                    </p>
                    <p className="text-slate-900 dark:text-white font-semibold leading-relaxed">
                      {info.value}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Achievement Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.label}
                className="text-center group"
                variants={cardVariants}
                whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.2 + index * 0.02, duration: 0.2 }}
              >
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl mb-4 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-150"
                  whileHover={shouldReduceMotion ? {} : { rotate: 180 }}
                  transition={{ duration: 0.25 }}
                >
                  <achievement.icon className="text-2xl text-blue-400" />
                </motion.div>
                <motion.div
                  className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2"
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{
                    delay: 0.3 + index * 0.02,
                    duration: 0.2,
                    type: "spring",
                  }}
                >
                  {achievement.number}
                </motion.div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                  {achievement.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Ultra-Fast Edit Modal */}
      <AnimatePresence mode="wait">
        {isEditModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={closeModal}
          >
            <motion.div
              className="bg-gradient-to-br from-white to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-slate-300 dark:border-slate-700 shadow-xl"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  <FaEdit className="text-blue-400" />
                  Edit Information
                </h3>
                <motion.button
                  onClick={closeModal}
                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors duration-100"
                  whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaTimes className="text-lg text-slate-600 dark:text-slate-400" />
                </motion.button>
              </div>

              <div className="space-y-6">
                {/* Profile Picture Upload */}
                <div className="text-center">
                  <label className="block text-lg font-medium text-slate-900 dark:text-white mb-3">
                    Profile Picture
                  </label>
                  <div className="flex flex-col items-center space-y-4">
                    <motion.div
                      className="relative"
                      whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
                    >
                      <img
                        src={editData.profilePic || "/api/placeholder/128/128"}
                        alt="Profile"
                        className="w-24 h-24 rounded-xl object-cover border-3 border-slate-400 dark:border-slate-600"
                        onError={(e) => {
                          e.target.src = "/api/placeholder/128/128";
                        }}
                      />
                      <div className="absolute inset-0 bg-black/30 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-100 flex items-center justify-center">
                        <FaEdit className="text-white text-lg" />
                      </div>
                    </motion.div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file);
                        }}
                        className="hidden"
                        id="profile-upload"
                        disabled={isUploading}
                      />
                      <motion.label
                        htmlFor="profile-upload"
                        className={`px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 cursor-pointer inline-flex items-center gap-2 font-medium transition-all duration-100 ${
                          isUploading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        whileHover={
                          !isUploading && !shouldReduceMotion
                            ? { scale: 1.01 }
                            : {}
                        }
                        whileTap={!isUploading ? { scale: 0.98 } : {}}
                      >
                        {isUploading ? (
                          <>
                            <FaSpinner className="animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <FaEdit />
                            Change Photo
                          </>
                        )}
                      </motion.label>
                    </div>
                  </div>
                </div>

                {/* CV Upload Section */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50">
                  <div className="text-center mb-4">
                    <label className="text-lg font-medium text-slate-900 dark:text-white mb-3 flex items-center justify-center gap-2">
                      <FaFilePdf className="text-red-500" />
                      CV Document
                    </label>
                    
                    {editData.cvUrl ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center gap-2 p-3 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-600/30 rounded-lg">
                          <FaFilePdf className="text-red-500" />
                          <span className="text-slate-900 dark:text-white font-medium">
                            {editData.cvFileName || 'CV.pdf'}
                          </span>
                        </div>
                        
                        <div className="flex gap-2 justify-center">
                          <motion.button
                            onClick={handleCvPreview}
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-150 flex items-center gap-2"
                            whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <FaEye />
                            Preview
                          </motion.button>
                          
                          <motion.button
                            onClick={handleCvDelete}
                            className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-150 flex items-center gap-2"
                            whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <FaTrash />
                            Remove
                          </motion.button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleCvUpload(file);
                          }}
                          className="hidden"
                          id="cv-upload"
                          disabled={isCvUploading}
                        />
                        <motion.label
                          htmlFor="cv-upload"
                          className={`px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 cursor-pointer inline-flex items-center gap-3 font-medium transition-all duration-100 ${
                            isCvUploading ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          whileHover={
                            !isCvUploading && !shouldReduceMotion
                              ? { scale: 1.02 }
                              : {}
                          }
                          whileTap={!isCvUploading ? { scale: 0.98 } : {}}
                        >
                          {isCvUploading ? (
                            <>
                              <FaSpinner className="animate-spin" />
                              Uploading CV...
                            </>
                          ) : (
                            <>
                              <FaCloudUploadAlt className="text-xl" />
                              Upload CV (PDF)
                            </>
                          )}
                        </motion.label>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Upload your CV in PDF format (Max: 10MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {formFields.map((field, index) => (
                    <motion.div
                      key={field.key}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02, duration: 0.15 }}
                      className={
                        field.key === "interests" ||
                        field.key === "certifications"
                          ? "lg:col-span-2"
                          : ""
                      }
                    >
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-2">
                        <field.icon className="text-blue-400" />
                        {field.label}
                        {field.required && (
                          <span className="text-red-400">*</span>
                        )}
                      </label>
                      <input
                        type={field.type}
                        value={editData[field.key] || ""}
                        onChange={(e) =>
                          handleInputChange(field.key, e.target.value)
                        }
                        className="w-full p-3 bg-slate-100/50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 transition-all duration-100"
                        placeholder={`Enter your ${field.label.toLowerCase()}`}
                        required={field.required}
                      />
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.15 }}
                >
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    About Description
                  </label>
                  <textarea
                    value={editData.about || ""}
                    onChange={(e) => handleInputChange("about", e.target.value)}
                    rows={4}
                    className="w-full p-3 bg-slate-100/50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 resize-none transition-all duration-100"
                    placeholder="Tell us about yourself..."
                  />
                </motion.div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <motion.button
                    onClick={handleSaveChanges}
                    disabled={loading || isUploading || isCvUploading}
                    className={`flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-100 font-medium flex items-center justify-center gap-2 ${
                      loading || isUploading || isCvUploading
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    whileHover={
                      !(loading || isUploading || isCvUploading) && !shouldReduceMotion
                        ? { scale: 1.005 }
                        : {}
                    }
                    whileTap={!(loading || isUploading || isCvUploading) ? { scale: 0.995 } : {}}
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaUser />
                        Save Changes
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    onClick={closeModal}
                    disabled={loading || isUploading || isCvUploading}
                    className="px-6 py-3 bg-slate-400 dark:bg-slate-600 hover:bg-slate-500 dark:hover:bg-slate-500 text-white rounded-lg transition-colors duration-100 font-medium flex items-center gap-2"
                    whileHover={!shouldReduceMotion ? { scale: 1.005 } : {}}
                    whileTap={{ scale: 0.995 }}
                  >
                    <FaTimes />
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const MemoizedAboutSection = React.memo(AboutSection);
MemoizedAboutSection.displayName = "AboutSection";
export default MemoizedAboutSection;