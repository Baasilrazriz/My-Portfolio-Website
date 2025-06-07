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
  FaTwitter,
  FaTag,
  FaTimes,
  FaHeart,
  FaLightbulb,
} from "react-icons/fa";

const ContactSection = React.memo(() => {
  const [formData, setFormData] = useState({
    from_name: "",
    from_email: "",
    from_subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  const [errors, setErrors] = useState({});

  const shouldReduceMotion = useReducedMotion();

  // Form validation
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!formData.from_name.trim()) {
      newErrors.from_name = "Name is required";
    }
    
    if (!formData.from_email.trim()) {
      newErrors.from_email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.from_email)) {
      newErrors.from_email = "Please enter a valid email";
    }
    
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Optimized Animation variants
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

  // Handlers
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear errors on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const result = await emailjs.sendForm(
        "service_e4ajvle",
        "template_yvzd4fl",
        e.target,
        "uRsOwhI0RI7Tk9XQn"
      );

      console.log("Email sent successfully:", result.text);
      setSubmitStatus("success");
      setFormData({
        from_name: "",
        from_email: "",
        from_subject: "",
        message: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Email sending failed:", error.text);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 4000);
    }
  }, [validateForm]);

  // Contact information
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

  // Social links
  const socialLinks = useMemo(
    () => [
      {
        icon: FaLinkedin,
        href: "#",
        color: "from-blue-500 to-blue-600",
        name: "LinkedIn"
      },
      {
        icon: FaGithub,
        href: "#",
        color: "from-gray-600 to-gray-700",
        name: "GitHub"
      },
      {
        icon: FaTwitter,
        href: "#",
        color: "from-sky-400 to-sky-500",
        name: "Twitter"
      },
    ],
    []
  );

  // Optimized particles
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
      id="contact"
      className="relative min-h-screen py-12 md:py-16 lg:py-20 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 dark:from-black dark:via-slate-900 dark:to-slate-800"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
    >
      {/* Optimized Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Simplified gradient orbs */}
        {!shouldReduceMotion && (
          <>
            <motion.div
              className="absolute top-10 right-10 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
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
              className="absolute bottom-10 left-10 w-48 h-48 md:w-80 md:h-80 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-full blur-3xl"
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

        {/* Optimized particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-gradient-to-r from-blue-400/40 to-purple-400/40"
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

        {/* Simplified geometric lines */}
        {!shouldReduceMotion && (
          <svg className="absolute inset-0 w-full h-full opacity-10">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            <motion.path
              d="M0,100 Q400,50 800,100 T1600,100"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3, ease: "easeInOut" }}
            />
          </svg>
        )}
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Status Messages */}
        <AnimatePresence>
          {submitStatus && (
            <motion.div
              className={`fixed top-4 right-4 z-50 max-w-sm p-4 rounded-xl shadow-lg border backdrop-blur-sm ${
                submitStatus === "success"
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
                  {submitStatus === "success" ? (
                    <FaCheckCircle className="text-lg" />
                  ) : (
                    <FaExclamationTriangle className="text-lg" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">
                    {submitStatus === "success" ? "Message Sent!" : "Error Occurred"}
                  </p>
                  <p className="text-xs opacity-90">
                    {submitStatus === "success"
                      ? "I'll get back to you soon."
                      : "Please try again."}
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

        {/* Hero Section */}
        <motion.div variants={heroVariants} className="text-center mb-12 md:mb-16">
          {/* Badge */}
          <motion.div
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full backdrop-blur-sm mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <FaHeart className="text-blue-400 mr-2" />
            <span className="text-sm font-medium bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {"Let's Build Something Great"}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h2
            className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Get In Touch
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-8"
            variants={itemVariants}
          >
            {"Ready to bring your ideas to life? Let's collaborate and create something amazing together."}
          </motion.p>

          {/* Social Links */}
          <motion.div
            className="flex justify-center gap-4 mb-8"
            variants={itemVariants}
          >
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                className={`w-12 h-12 bg-gradient-to-r ${social.color} rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200`}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                title={social.name}
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
              className="bg-slate-800/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-slate-700/50 shadow-xl"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-2xl font-bold text-white mb-6">
                Contact Information
              </h3>

              <div className="space-y-4">
                {contactInfo.map((item, index) => (
                  <motion.a
                    key={index}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center p-4 bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/30 hover:border-slate-500/50 rounded-xl transition-all duration-200"
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center mr-4 shadow-lg`}>
                      <item.icon className="text-white text-lg" />
                    </div>

                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-300 text-sm mb-1">
                        {item.label}
                      </h4>
                      <p className="text-white font-medium">{item.value}</p>
                    </div>

                    <FaRocket className="text-slate-500 group-hover:text-slate-400 transition-colors duration-200" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              className="bg-slate-800/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl"
              variants={itemVariants}
            >
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
                  <div className="text-2xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-1">
                    &lt;24h
                  </div>
                  <div className="text-sm font-medium text-slate-400">
                    Response Time
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                  <div className="text-2xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">
                    100%
                  </div>
                  <div className="text-sm font-medium text-slate-400">
                    Satisfaction
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div variants={itemVariants} className="lg:col-span-7">
            <motion.div
              className="bg-slate-800/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-slate-700/50 shadow-xl"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <FaLightbulb className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Send Message
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                      <FaUser className="text-blue-400" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="from_name"
                      value={formData.from_name}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      required
                      className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl backdrop-blur-sm focus:outline-none transition-all duration-200 text-white placeholder-slate-400 ${
                        errors.from_name 
                          ? 'border-red-500 focus:border-red-400' 
                          : focusedField === "name" 
                            ? 'border-blue-500 focus:border-blue-400' 
                            : 'border-slate-600 hover:border-slate-500 focus:border-blue-500'
                      }`}
                      placeholder="Enter your name"
                    />
                    {errors.from_name && (
                      <p className="text-red-400 text-sm flex items-center gap-1">
                        <FaExclamationTriangle className="text-xs" />
                        {errors.from_name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                      <FaEnvelope className="text-purple-400" />
                      Email
                    </label>
                    <input
                      type="email"
                      name="from_email"
                      value={formData.from_email}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      required
                      className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl backdrop-blur-sm focus:outline-none transition-all duration-200 text-white placeholder-slate-400 ${
                        errors.from_email 
                          ? 'border-red-500 focus:border-red-400' 
                          : focusedField === "email" 
                            ? 'border-purple-500 focus:border-purple-400' 
                            : 'border-slate-600 hover:border-slate-500 focus:border-purple-500'
                      }`}
                      placeholder="your@email.com"
                    />
                    {errors.from_email && (
                      <p className="text-red-400 text-sm flex items-center gap-1">
                        <FaExclamationTriangle className="text-xs" />
                        {errors.from_email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                    <FaTag className="text-emerald-400" />
                    Subject
                  </label>
                  <input
                    type="text"
                    name="from_subject"
                    value={formData.from_subject}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField("subject")}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl backdrop-blur-sm focus:outline-none transition-all duration-200 text-white placeholder-slate-400 ${
                      focusedField === "subject" 
                        ? 'border-emerald-500 focus:border-emerald-400' 
                        : 'border-slate-600 hover:border-slate-500 focus:border-emerald-500'
                    }`}
                    placeholder="What's this about? (Optional)"
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                    <FaComment className="text-cyan-400" />
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField("message")}
                    onBlur={() => setFocusedField(null)}
                    rows="6"
                    required
                    className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl backdrop-blur-sm focus:outline-none transition-all duration-200 text-white placeholder-slate-400 resize-none ${
                      errors.message 
                        ? 'border-red-500 focus:border-red-400' 
                        : focusedField === "message" 
                          ? 'border-cyan-500 focus:border-cyan-400' 
                          : 'border-slate-600 hover:border-slate-500 focus:border-cyan-500'
                    }`}
                    placeholder="Tell me about your project or just say hello! I'd love to hear from you."
                  />
                  {errors.message && (
                    <p className="text-red-400 text-sm flex items-center gap-1">
                      <FaExclamationTriangle className="text-xs" />
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-2">
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
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
                      {isSubmitting ? 'Sending...' : 'Send Message'}
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