import React, { useState, useCallback, useMemo } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import emailjs from "emailjs-com";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaPaperPlane,
  FaUser,
  FaComment,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner,
  FaRocket,
  FaLinkedin,
  FaGithub,
  FaTag,
  FaTimes,
  FaHeart,
  FaLightbulb,
  FaFacebook,
  FaInstagram,
  FaCode,
  FaMobile,
  FaServer,
  FaDesktop,
  FaBug,
  FaGraduationCap,
  FaCloud,
  FaPalette,
  FaCog,
  FaChevronDown,
} from "react-icons/fa";

const ContactSection = React.memo(() => {
  const [formData, setFormData] = useState({
    from_name: "",
    from_email: "",
    from_subject: "",
    selected_service: "",
    project_budget: "",
    project_timeline: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  const [errors, setErrors] = useState({});

  const shouldReduceMotion = useReducedMotion();

  // EmailJS Configuration from environment variables
  const emailConfig = useMemo(() => ({
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "uRsOwhI0RI7Tk9XQn", // Fallback to your current key
  }), []);

  // Service options for dropdown
  const serviceOptions = useMemo(() => [
    { 
      value: "web-development", 
      label: "Web Development", 
      icon: FaCode,
      price: "$499+",
      category: "Frontend"
    },
    { 
      value: "mobile-development", 
      label: "Mobile Development", 
      icon: FaMobile,
      price: "$899+",
      category: "Mobile"
    },
    { 
      value: "backend-development", 
      label: "Backend Development", 
      icon: FaServer,
      price: "$699+",
      category: "Backend"
    },
    { 
      value: "desktop-applications", 
      label: "Desktop Applications", 
      icon: FaDesktop,
      price: "$799+",
      category: "Desktop"
    },
    { 
      value: "error-solving", 
      label: "Error Solving & Debugging", 
      icon: FaBug,
      price: "$99/hr",
      category: "Support"
    },
    { 
      value: "semester-projects", 
      label: "Semester Projects", 
      icon: FaGraduationCap,
      price: "$299+",
      category: "Academic"
    },
    { 
      value: "cloud-solutions", 
      label: "Cloud Solutions", 
      icon: FaCloud,
      price: "$399+",
      category: "Cloud"
    },
    { 
      value: "ui-ux-design", 
      label: "UI/UX Design", 
      icon: FaPalette,
      price: "$399+",
      category: "Design"
    },
    { 
      value: "consultation", 
      label: "Project Consultation", 
      icon: FaCog,
      price: "Custom",
      category: "Consultation"
    },
    { 
      value: "other", 
      label: "Other Services", 
      icon: FaRocket,
      price: "Custom",
      category: "Other"
    }
  ], []);

  // Budget options
  const budgetOptions = useMemo(() => [
    "Under $500",
    "$500 - $1,000",
    "$1,000 - $2,500",
    "$2,500 - $5,000",
    "$5,000 - $10,000",
    "$10,000+",
    "Let's discuss"
  ], []);

  // Timeline options
  const timelineOptions = useMemo(() => [
    "ASAP (Rush job)",
    "1-2 weeks",
    "2-4 weeks",
    "1-2 months",
    "2-3 months",
    "3+ months",
    "Flexible timeline"
  ], []);

  // Enhanced form validation
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    // Name validation
    if (!formData.from_name.trim()) {
      newErrors.from_name = "Name is required";
    } else if (formData.from_name.trim().length < 2) {
      newErrors.from_name = "Name must be at least 2 characters";
    }
    
    // Email validation
    if (!formData.from_email.trim()) {
      newErrors.from_email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.from_email)) {
      newErrors.from_email = "Please enter a valid email address";
    }
    
    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Project details are required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Please provide more details (at least 10 characters)";
    } else if (formData.message.trim().length > 2000) {
      newErrors.message = "Message is too long (maximum 2000 characters)";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Enhanced email preparation
  const prepareEmailData = useCallback(() => {
    const selectedServiceObj = serviceOptions.find(
      service => service.value === formData.selected_service
    );

    const currentDate = new Date();
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    return {
      // Basic form data
      from_name: formData.from_name.trim(),
      from_email: formData.from_email.trim().toLowerCase(),
      from_subject: formData.from_subject.trim() || `New Project Inquiry - ${selectedServiceObj?.label || 'General'}`,
      message: formData.message.trim(),
      
      // Service information
      selected_service: formData.selected_service || "not-specified",
      service_name: selectedServiceObj?.label || "Not specified",
      service_price: selectedServiceObj?.price || "Custom pricing",
      service_category: selectedServiceObj?.category || "General",
      
      // Project details
      project_budget: formData.project_budget || "Not specified",
      project_timeline: formData.project_timeline || "Not specified",
      
      // Priority detection
      is_urgent: formData.project_timeline?.includes("ASAP") ? "Yes" : "No",
      priority_level: formData.project_timeline?.includes("ASAP") ? "High" : "Normal",
      
      // Formatted dates and metadata
      formatted_date: currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      }),
      submission_date: currentDate.toISOString(),
      client_timezone: timeZone,
      
      // Additional metadata
      estimated_response_time: formData.project_timeline?.includes("ASAP") ? "Within 2 hours" : "Within 24 hours",
      form_version: "2.0",
      source: "Portfolio Website",
      
      // Admin information
      to_name: "Muhammad Basil Irfan",
      to_email: import.meta.env.VITE_ADMIN_EMAIL || "baasilrazriz@gmail.com",
    };
  }, [formData, serviceOptions]);

  // Optimized form submission with better error handling
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      // Focus on first error field
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField}"]`);
        if (element) {
          element.focus();
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      return;
    }

    // Check if EmailJS is configured
    if (!emailConfig.serviceId || !emailConfig.templateId) {
      console.error('EmailJS configuration missing');
      setSubmitStatus("config_error");
      setTimeout(() => setSubmitStatus(null), 5000);
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Prepare email data
      const emailData = prepareEmailData();
      
      console.log('Sending email with data:', {
        ...emailData,
        from_email: emailData.from_email.substring(0, 5) + '***', // Hide email in logs
        message: emailData.message.substring(0, 50) + '...' // Truncate message in logs
      });

      // Send email using EmailJS
      const result = await emailjs.send(
        emailConfig.serviceId,
        emailConfig.templateId,
        emailData,
        emailConfig.publicKey
      );

      console.log("Email sent successfully:", result.status, result.text);
      
      // Success handling
      setSubmitStatus("success");
      
      // Reset form
      setFormData({
        from_name: "",
        from_email: "",
        from_subject: "",
        selected_service: "",
        project_budget: "",
        project_timeline: "",
        message: "",
      });
      setErrors({});
      setFocusedField(null);

      // Optional: Track success event for analytics
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'form_submit', {
          event_category: 'Contact',
          event_label: emailData.service_name,
          value: 1
        });
      }

    } catch (error) {
      console.error("Email sending failed:", error);
      
      // Enhanced error handling
      let errorType = "error";
      
      if (error.text?.includes('network') || error.message?.includes('network')) {
        errorType = "network_error";
      } else if (error.text?.includes('limit') || error.message?.includes('limit')) {
        errorType = "rate_limit";
      } else if (error.text?.includes('invalid') || error.message?.includes('invalid')) {
        errorType = "invalid_data";
      }
      
      setSubmitStatus(errorType);

      // Optional: Track error event for analytics
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'form_error', {
          event_category: 'Contact',
          event_label: error.text || error.message || 'Unknown error',
          value: 0
        });
      }

    } finally {
      setIsSubmitting(false);
      
      // Auto-hide status after delay
      setTimeout(() => setSubmitStatus(null), 6000);
    }
  }, [validateForm, emailConfig, prepareEmailData, errors]);

  // Enhanced input handler with debouncing for validation
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  // Get status message based on submit status
  const getStatusMessage = useCallback(() => {
    switch (submitStatus) {
      case "success":
        return {
          title: "Message Sent Successfully! 🎉",
          message: "Thank you for reaching out! I'll get back to you within 24 hours.",
          type: "success"
        };
      case "network_error":
        return {
          title: "Network Error 🌐",
          message: "Please check your internet connection and try again.",
          type: "error"
        };
      case "rate_limit":
        return {
          title: "Too Many Requests ⏱️",
          message: "Please wait a few minutes before sending another message.",
          type: "error"
        };
      case "invalid_data":
        return {
          title: "Invalid Data 📝",
          message: "Please check your information and try again.",
          type: "error"
        };
      case "config_error":
        return {
          title: "Configuration Error ⚙️",
          message: "Email service is not properly configured. Please contact directly.",
          type: "error"
        };
      default:
        return {
          title: "Something Went Wrong 😕",
          message: "Please try again or contact me directly via email or WhatsApp.",
          type: "error"
        };
    }
  }, [submitStatus]);

  // Animation variants (keeping existing ones...)
  const containerVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          delayChildren: 0.1,
          staggerChildren: 0.05,
        },
      },
    }),
    []
  );

  const itemVariants = useMemo(
    () => ({
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          type: "spring",
          damping: 25,
          stiffness: 120,
          duration: 0.3,
        },
      },
    }),
    []
  );

  const heroVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: -20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          type: "spring",
          damping: 20,
          stiffness: 100,
          duration: 0.4,
        },
      },
    }),
    []
  );

  // Contact information (keeping existing...)
  const contactInfo = useMemo(
    () => [
      {
        icon: FaMapMarkerAlt,
        label: "Location",
        value: "Karachi, Pakistan",
        href: "https://www.google.com/maps?q=Karachi",
        color: "from-emerald-400 to-teal-500",
        bgColor: "bg-emerald-500/10",
      },
      {
        icon: FaEnvelope,
        label: "Email",
        value: "baasilrazriz@gmail.com",
        href: "mailto:baasilrazriz@gmail.com",
        color: "from-blue-400 to-cyan-500",
        bgColor: "bg-blue-500/10",
      },
      {
        icon: FaPhone,
        label: "Phone",
        value: "+92 323 718 4249",
        href: "https://wa.me/+923237184249",
        color: "from-purple-400 to-pink-500",
        bgColor: "bg-purple-500/10",
      },
    ],
    []
  );

  // Social links (keeping existing...)
  const socialLinks = useMemo(
    () => [
      {
        icon: FaFacebook,
        href: "https://www.facebook.com/muhammadbaasil.irfan",
        color: "from-blue-600 to-blue-700",
        name: "Facebook",
        hoverColor: "hover:shadow-blue-500/25"
      },
      {
        icon: FaInstagram,
        href: "https://www.instagram.com/basilrazriz/",
        color: "from-pink-500 to-purple-600",
        name: "Instagram",
        hoverColor: "hover:shadow-pink-500/25"
      },
      {
        icon: FaLinkedin,
        href: "https://www.linkedin.com/in/muhammad-basil-irfan-rizvi-886157215/",
        color: "from-blue-500 to-blue-600",
        name: "LinkedIn",
        hoverColor: "hover:shadow-blue-500/25"
      },
      {
        icon: FaGithub,
        href: "https://github.com/Baasilrazriz",
        color: "from-gray-600 to-gray-700 dark:from-gray-500 dark:to-gray-600",
        name: "GitHub",
        hoverColor: "hover:shadow-gray-500/25"
      },
    ],
    []
  );

  // Particles (keeping existing...)
  const particles = useMemo(
    () =>
      Array.from({ length: shouldReduceMotion ? 3 : 8 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 2,
        size: Math.random() * 3 + 1,
        duration: 3 + Math.random() * 2,
      })),
    [shouldReduceMotion]
  );

  return (
    <motion.section
      id="con"
      className="relative min-h-screen py-12 md:py-16 lg:py-20 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-black"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
    >
      {/* Background Elements (keeping existing...) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {!shouldReduceMotion && (
          <>
            <motion.div
              className="absolute top-10 right-10 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 dark:from-blue-500/10 dark:to-purple-500/10 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute bottom-10 left-10 w-48 h-48 md:w-80 md:h-80 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 dark:from-emerald-500/10 dark:to-cyan-500/10 rounded-full blur-3xl"
              animate={{
                scale: [1.1, 1, 1.1],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />
          </>
        )}

        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-gradient-to-r from-blue-400/40 to-purple-400/40 dark:from-blue-400/20 dark:to-purple-400/20"
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
                    opacity: [0, 1, 0],
                    scale: [0.5, 1.5, 0.5],
                  }
            }
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Enhanced Status Messages */}
        <AnimatePresence>
          {submitStatus && (
            <motion.div
              className={`fixed top-4 right-4 z-50 max-w-sm p-4 rounded-xl shadow-lg border backdrop-blur-sm ${
                getStatusMessage().type === "success"
                  ? "bg-emerald-500/90 border-emerald-400/50 text-white"
                  : "bg-red-500/90 border-red-400/50 text-white"
              }`}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {getStatusMessage().type === "success" ? (
                    <FaCheckCircle className="text-lg" />
                  ) : (
                    <FaExclamationTriangle className="text-lg" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">
                    {getStatusMessage().title}
                  </p>
                  <p className="text-xs opacity-90">
                    {getStatusMessage().message}
                  </p>
                </div>
                <button
                  onClick={() => setSubmitStatus(null)}
                  className="flex-shrink-0 p-1 hover:bg-white/10 rounded"
                >
                  <FaTimes className="text-sm" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rest of the component remains the same... */}
        {/* Hero Section */}
        <motion.div variants={heroVariants} className="text-center mb-12 md:mb-16">
          <motion.div
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 dark:border-blue-500/20 rounded-full backdrop-blur-sm mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <FaHeart className="text-blue-400 mr-2" />
            <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              {"Let's Build Something Great"}
            </span>
          </motion.div>

          <motion.h2
            className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Get In Touch
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed mb-8"
            variants={itemVariants}
          >
            {"Ready to bring your ideas to life? Let's collaborate and create something amazing together."}
          </motion.p>

          <motion.div
            className="flex justify-center gap-4 mb-8"
            variants={itemVariants}
          >
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-12 h-12 bg-gradient-to-r ${social.color} rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl ${social.hoverColor} transition-all duration-200`}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                title={social.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <social.icon className="text-white text-lg" />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Contact Information */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-5 space-y-6"
          >
            {/* Contact Info Card */}
            <motion.div
              className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-xl"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Contact Information
              </h3>

              <div className="space-y-4">
                {contactInfo.map((item, index) => (
                  <motion.a
                    key={index}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center p-4 bg-slate-50/80 dark:bg-slate-700/30 hover:bg-slate-100/80 dark:hover:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/30 hover:border-slate-300/50 dark:hover:border-slate-500/50 rounded-xl transition-all duration-200"
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center mr-4 shadow-lg`}>
                      <item.icon className="text-white text-lg" />
                    </div>

                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-600 dark:text-slate-300 text-sm mb-1">
                        {item.label}
                      </h4>
                      <p className="text-slate-900 dark:text-white font-medium">{item.value}</p>
                    </div>

                    <FaRocket className="text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors duration-200" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-xl"
              variants={itemVariants}
            >
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
                  <div className="text-2xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent mb-1">
                    &lt;24h
                  </div>
                  <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Response Time
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                  <div className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-1">
                    100%
                  </div>
                  <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Satisfaction
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Enhanced Contact Form */}
          <motion.div variants={itemVariants} className="lg:col-span-7">
            <motion.div
              className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-xl"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <FaLightbulb className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Start Your Project
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {/* Name and Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <FaUser className="text-blue-400" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="from_name"
                      value={formData.from_name}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      required
                      className={`w-full px-4 py-3 bg-slate-50/80 dark:bg-slate-700/50 border rounded-xl backdrop-blur-sm focus:outline-none transition-all duration-200 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 ${
                        errors.from_name 
                          ? 'border-red-500 focus:border-red-400' 
                          : focusedField === "name" 
                            ? 'border-blue-500 focus:border-blue-400' 
                            : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 focus:border-blue-500'
                      }`}
                      placeholder="Enter your full name"
                      maxLength={100}
                    />
                    {errors.from_name && (
                      <p className="text-red-400 text-sm flex items-center gap-1">
                        <FaExclamationTriangle className="text-xs" />
                        {errors.from_name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <FaEnvelope className="text-purple-400" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="from_email"
                      value={formData.from_email}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      required
                      className={`w-full px-4 py-3 bg-slate-50/80 dark:bg-slate-700/50 border rounded-xl backdrop-blur-sm focus:outline-none transition-all duration-200 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 ${
                        errors.from_email 
                          ? 'border-red-500 focus:border-red-400' 
                          : focusedField === "email" 
                            ? 'border-purple-500 focus:border-purple-400' 
                            : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 focus:border-purple-500'
                      }`}
                      placeholder="your@email.com"
                      maxLength={100}
                    />
                    {errors.from_email && (
                      <p className="text-red-400 text-sm flex items-center gap-1">
                        <FaExclamationTriangle className="text-xs" />
                        {errors.from_email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Service Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <FaRocket className="text-emerald-400" />
                    Service Needed
                  </label>
                  <div className="relative">
                    <select
                      name="selected_service"
                      value={formData.selected_service}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField("service")}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full px-4 py-3 bg-slate-50/80 dark:bg-slate-700/50 border rounded-xl backdrop-blur-sm focus:outline-none transition-all duration-200 text-slate-900 dark:text-white appearance-none cursor-pointer ${
                        focusedField === "service" 
                          ? 'border-emerald-500 focus:border-emerald-400' 
                          : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 focus:border-emerald-500'
                      }`}
                    >
                      <option value="">Select a service...</option>
                      {serviceOptions.map((service) => (
                        <option key={service.value} value={service.value}>
                          {service.label} - {service.price}
                        </option>
                      ))}
                    </select>
                    <FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                  {formData.selected_service && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 mt-2 p-2 bg-emerald-500/10 rounded-lg"
                    >
                      {serviceOptions.find(s => s.value === formData.selected_service)?.icon && 
                        React.createElement(
                          serviceOptions.find(s => s.value === formData.selected_service).icon,
                          { className: "text-emerald-500" }
                        )
                      }
                      <span className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">
                        {serviceOptions.find(s => s.value === formData.selected_service)?.label} selected
                      </span>
                    </motion.div>
                  )}
                </div>

                {/* Budget and Timeline Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <FaTag className="text-cyan-400" />
                      Project Budget
                    </label>
                    <div className="relative">
                      <select
                        name="project_budget"
                        value={formData.project_budget}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("budget")}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full px-4 py-3 bg-slate-50/80 dark:bg-slate-700/50 border rounded-xl backdrop-blur-sm focus:outline-none transition-all duration-200 text-slate-900 dark:text-white appearance-none cursor-pointer ${
                          focusedField === "budget" 
                            ? 'border-cyan-500 focus:border-cyan-400' 
                            : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 focus:border-cyan-500'
                        }`}
                      >
                        <option value="">Select budget range...</option>
                        {budgetOptions.map((budget) => (
                          <option key={budget} value={budget}>
                            {budget}
                          </option>
                        ))}
                      </select>
                      <FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <FaCog className="text-orange-400" />
                      Timeline
                    </label>
                    <div className="relative">
                      <select
                        name="project_timeline"
                        value={formData.project_timeline}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("timeline")}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full px-4 py-3 bg-slate-50/80 dark:bg-slate-700/50 border rounded-xl backdrop-blur-sm focus:outline-none transition-all duration-200 text-slate-900 dark:text-white appearance-none cursor-pointer ${
                          focusedField === "timeline" 
                            ? 'border-orange-500 focus:border-orange-400' 
                            : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 focus:border-orange-500'
                        }`}
                      >
                        <option value="">Select timeline...</option>
                        {timelineOptions.map((timeline) => (
                          <option key={timeline} value={timeline}>
                            {timeline}
                          </option>
                        ))}
                      </select>
                      <FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <FaTag className="text-pink-400" />
                    Subject
                  </label>
                  <input
                    type="text"
                    name="from_subject"
                    value={formData.from_subject}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField("subject")}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-3 bg-slate-50/80 dark:bg-slate-700/50 border rounded-xl backdrop-blur-sm focus:outline-none transition-all duration-200 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 ${
                      focusedField === "subject" 
                        ? 'border-pink-500 focus:border-pink-400' 
                        : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 focus:border-pink-500'
                    }`}
                    placeholder="What's this about? (Optional)"
                    maxLength={150}
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <FaComment className="text-indigo-400" />
                    Project Details *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField("message")}
                    onBlur={() => setFocusedField(null)}
                    rows="6"
                    required
                    className={`w-full px-4 py-3 bg-slate-50/80 dark:bg-slate-700/50 border rounded-xl backdrop-blur-sm focus:outline-none transition-all duration-200 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 resize-none ${
                      errors.message 
                        ? 'border-red-500 focus:border-red-400' 
                        : focusedField === "message" 
                          ? 'border-indigo-500 focus:border-indigo-400' 
                          : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 focus:border-indigo-500'
                    }`}
                    placeholder="Tell me about your project requirements, goals, and any specific features you need. The more details, the better I can help you!"
                    maxLength={2000}
                  />
                  <div className="flex justify-between items-center">
                    {errors.message && (
                      <p className="text-red-400 text-sm flex items-center gap-1">
                        <FaExclamationTriangle className="text-xs" />
                        {errors.message}
                      </p>
                    )}
                    <p className="text-xs text-slate-500 dark:text-slate-400 ml-auto">
                      {formData.message.length}/2000 characters
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-2">
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={!isSubmitting ? { scale: 1.02, y: -1 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  >
                    <motion.div
                      animate={isSubmitting ? { rotate: 360 } : {}}
                      transition={{
                        duration: 1,
                        repeat: isSubmitting ? Infinity : 0,
                        ease: "linear"
                      }}
                    >
                      {isSubmitting ? (
                        <FaSpinner />
                      ) : (
                        <FaPaperPlane />
                      )}
                    </motion.div>
                    <span>
                      {isSubmitting ? 'Sending Message...' : 'Send Message'}
                    </span>
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
});

ContactSection.displayName = "ContactSection";

export default ContactSection;