import React, { useState, useMemo } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import {
  FaCode,
  FaMobile,
  FaBug,
  FaGraduationCap,
  FaDesktop,
  FaServer,
  FaDatabase,
  FaCloud,
  FaRocket,
  FaPalette,
  FaCog,
  FaShieldAlt,
  FaArrowRight,
  FaCheck,
  FaStar,
  FaLightbulb,
  FaHeart,
  FaGlobe,
  FaTools,
  FaChartLine,
  FaUsers,
} from "react-icons/fa";

const ServicesSection = () => {
  const [hoveredService, setHoveredService] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const shouldReduceMotion = useReducedMotion();

  // Services data with comprehensive offerings
  const services = useMemo(
    () => [
      {
        id: 1,
        title: "Web Development",
        category: "Frontend",
        description: "Modern, responsive websites with cutting-edge technologies",
        icon: FaCode,
        features: [
          "React.js & Next.js Applications",
          "Responsive Design & PWAs",
          "Performance Optimization",
          "SEO & Analytics Integration"
        ],
        technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
        color: "from-blue-500 to-cyan-500",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/20",
        hoverShadow: "hover:shadow-blue-500/25",
        price: "Starting at $499",
        duration: "2-4 weeks"
      },
      {
        id: 2,
        title: "Mobile Development",
        category: "Mobile",
        description: "Cross-platform mobile apps for iOS and Android",
        icon: FaMobile,
        features: [
          "React Native Applications",
          "Cross-Platform Development",
          "Native Performance",
          "App Store Deployment"
        ],
        technologies: ["React Native", "Expo", "Firebase", "Redux"],
        color: "from-purple-500 to-pink-500",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-500/20",
        hoverShadow: "hover:shadow-purple-500/25",
        price: "Starting at $899",
        duration: "4-8 weeks"
      },
      {
        id: 3,
        title: "Backend Development",
        category: "Backend",
        description: "Scalable server-side solutions and APIs",
        icon: FaServer,
        features: [
          "RESTful & GraphQL APIs",
          "Database Design & Optimization",
          "Authentication & Security",
          "Cloud Deployment"
        ],
        technologies: ["Node.js", "NestJS", "ASP.NET", "PostgreSQL"],
        color: "from-emerald-500 to-teal-500",
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-500/20",
        hoverShadow: "hover:shadow-emerald-500/25",
        price: "Starting at $699",
        duration: "3-6 weeks"
      },
      {
        id: 4,
        title: "Desktop Applications",
        category: "Desktop",
        description: "Powerful desktop applications using .NET Framework",
        icon: FaDesktop,
        features: [
          "Windows Forms & WPF",
          "Cross-Platform with .NET Core",
          "Database Integration",
          "Enterprise Solutions"
        ],
        technologies: [".NET", "C#", "WPF", "SQL Server"],
        color: "from-orange-500 to-red-500",
        bgColor: "bg-orange-500/10",
        borderColor: "border-orange-500/20",
        hoverShadow: "hover:shadow-orange-500/25",
        price: "Starting at $799",
        duration: "4-8 weeks"
      },
      {
        id: 5,
        title: "Error Solving & Debugging",
        category: "Support",
        description: "Quick fixes and optimization for existing projects",
        icon: FaBug,
        features: [
          "Code Review & Debugging",
          "Performance Optimization",
          "Security Auditing",
          "Refactoring Services"
        ],
        technologies: ["Various", "Testing", "Profiling", "Analysis"],
        color: "from-yellow-500 to-orange-500",
        bgColor: "bg-yellow-500/10",
        borderColor: "border-yellow-500/20",
        hoverShadow: "hover:shadow-yellow-500/25",
        price: "Starting at $99/hour",
        duration: "1-3 days"
      },
      {
        id: 6,
        title: "Semester Projects",
        category: "Academic",
        description: "Complete academic projects with documentation",
        icon: FaGraduationCap,
        features: [
          "Full Project Development",
          "Documentation & Reports",
          "Presentation Materials",
          "Source Code & Deployment"
        ],
        technologies: ["Custom", "Academic Requirements", "Documentation"],
        color: "from-indigo-500 to-purple-500",
        bgColor: "bg-indigo-500/10",
        borderColor: "border-indigo-500/20",
        hoverShadow: "hover:shadow-indigo-500/25",
        price: "Starting at $299",
        duration: "2-6 weeks"
      },
      {
        id: 7,
        title: "Cloud Solutions",
        category: "Cloud",
        description: "Modern cloud infrastructure and deployment",
        icon: FaCloud,
        features: [
          "AWS & Azure Deployment",
          "Containerization (Docker)",
          "CI/CD Pipelines",
          "Monitoring & Scaling"
        ],
        technologies: ["AWS", "Azure", "Docker", "Kubernetes"],
        color: "from-cyan-500 to-blue-500",
        bgColor: "bg-cyan-500/10",
        borderColor: "border-cyan-500/20",
        hoverShadow: "hover:shadow-cyan-500/25",
        price: "Starting at $399",
        duration: "1-3 weeks"
      },
      {
        id: 8,
        title: "UI/UX Design",
        category: "Design",
        description: "Beautiful and intuitive user interfaces",
        icon: FaPalette,
        features: [
          "Modern UI Design",
          "User Experience Optimization",
          "Prototyping & Wireframes",
          "Design Systems"
        ],
        technologies: ["Figma", "Adobe XD", "Sketch", "Principle"],
        color: "from-pink-500 to-rose-500",
        bgColor: "bg-pink-500/10",
        borderColor: "border-pink-500/20",
        hoverShadow: "hover:shadow-pink-500/25",
        price: "Starting at $399",
        duration: "1-4 weeks"
      }
    ],
    []
  );

  // Filter categories
  const categories = useMemo(() => {
    const cats = ["All", ...new Set(services.map(service => service.category))];
    return cats;
  }, [services]);

  // Filtered services
  const filteredServices = useMemo(() => {
    return selectedCategory === "All" 
      ? services 
      : services.filter(service => service.category === selectedCategory);
  }, [services, selectedCategory]);

  // Animation variants
  const containerVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          delayChildren: 0.1,
          staggerChildren: 0.08,
        },
      },
    }),
    []
  );

  const itemVariants = useMemo(
    () => ({
      hidden: { y: 30, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          type: "spring",
          damping: 25,
          stiffness: 120,
        },
      },
    }),
    []
  );

  const cardVariants = useMemo(
    () => ({
      rest: { 
        scale: 1,
        rotateY: 0,
        transition: { duration: 0.2 }
      },
      hover: { 
        scale: 1.02,
        rotateY: 5,
        transition: { duration: 0.2 }
      }
    }),
    []
  );

  // Scroll to contact section
  const scrollToContact = () => {
    const contactSection = document.getElementById('con');
    if (contactSection) {
      contactSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <motion.section
      id="services"
      className="relative min-h-screen py-12 md:py-16 lg:py-20 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-black"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient orbs */}
        {!shouldReduceMotion && (
          <>
            <motion.div
              className="absolute top-20 right-10 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 dark:from-blue-500/10 dark:to-purple-500/10 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
                x: [0, 50, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute bottom-20 left-10 w-64 h-64 md:w-80 md:h-80 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 dark:from-emerald-500/10 dark:to-cyan-500/10 rounded-full blur-3xl"
              animate={{
                scale: [1.1, 1, 1.1],
                opacity: [0.2, 0.5, 0.2],
                x: [0, -30, 0],
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

        {/* Floating particles */}
        {!shouldReduceMotion && Array.from({ length: 6 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400/40 to-purple-400/40 dark:from-blue-400/20 dark:to-purple-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0, 1, 0],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Hero Section */}
        <motion.div variants={itemVariants} className="text-center mb-12 md:mb-16">
          {/* Badge */}
          <motion.div
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 dark:border-blue-500/20 rounded-full backdrop-blur-sm mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <FaRocket className="text-blue-400 mr-2" />
            <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Expert Development Services
            </span>
          </motion.div>

          {/* Title */}
          <motion.h2
            className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Services & Solutions
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            From concept to deployment, I provide end-to-end development solutions 
            tailored to your needs. Let's bring your ideas to life with cutting-edge technology.
          </motion.p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center mb-12"
        >
          <div className="flex flex-wrap gap-2 p-2 bg-white/80 dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
            {categories.map((category, index) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-700/50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
        >
          <AnimatePresence mode="wait">
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                variants={cardVariants}
                initial="rest"
                whileHover="hover"
                onHoverStart={() => setHoveredService(service.id)}
                onHoverEnd={() => setHoveredService(null)}
                className="group relative"
                layout
                layoutId={`service-${service.id}`}
              >
                {/* Fixed height card with flexbox layout */}
                <div className={`relative h-[520px] flex flex-col p-6 bg-white/80 dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl border ${service.borderColor} dark:border-slate-700/50 shadow-xl ${service.hoverShadow} hover:shadow-2xl transition-all duration-300 overflow-hidden`}>
                  {/* Background Pattern */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  {/* Service Icon */}
                  <div className="relative mb-6 flex-shrink-0">
                    <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <service.icon className="text-white text-2xl" />
                    </div>
                    
                    {/* Floating badge */}
                    <motion.div
                      className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center shadow-lg"
                      initial={{ scale: 0 }}
                      animate={{ scale: hoveredService === service.id ? 1 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FaStar className="text-white text-xs" />
                    </motion.div>
                  </div>

                  {/* Content - Flexible section */}
                  <div className="relative flex-1 flex flex-col">
                    {/* Title and Description */}
                    <div className="mb-4 flex-shrink-0">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                        {service.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    {/* Features - Fixed height */}
                    <div className="mb-4 flex-shrink-0">
                      <div className="space-y-2 h-16">
                        {service.features.slice(0, 2).map((feature, idx) => (
                          <div key={idx} className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                            <FaCheck className="text-emerald-500 mr-2 text-xs flex-shrink-0" />
                            <span className="truncate">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Technologies - Fixed height */}
                    <div className="mb-4 flex-shrink-0">
                      <div className="flex flex-wrap gap-1 h-12 overflow-hidden">
                        {service.technologies.slice(0, 3).map((tech, idx) => (
                          <span
                            key={idx}
                            className={`px-2 py-1 ${service.bgColor} text-xs rounded-lg font-medium text-slate-700 dark:text-slate-300 h-fit`}
                          >
                            {tech}
                          </span>
                        ))}
                        {service.technologies.length > 3 && (
                          <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-xs rounded-lg font-medium text-slate-500 dark:text-slate-400 h-fit">
                            +{service.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Spacer to push button to bottom */}
                    <div className="flex-1"></div>

                    {/* Pricing & CTA - Fixed at bottom */}
                    <div className="flex-shrink-0 pt-4 border-t border-slate-200/50 dark:border-slate-700/50 mt-auto">
                      <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 mb-3">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{service.price}</span>
                        <span>{service.duration}</span>
                      </div>

                      {/* CTA Button - Always at same position */}
                      <motion.button
                        onClick={scrollToContact}
                        className={`w-full py-3 bg-gradient-to-r ${service.color} text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group/btn`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span>Get Started</span>
                        <FaArrowRight className="text-sm group-hover/btn:translate-x-1 transition-transform duration-200" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Hover Effect Overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    initial={false}
                    animate={{ opacity: hoveredService === service.id ? 1 : 0 }}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          variants={itemVariants}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { icon: FaUsers, value: "50+", label: "Happy Clients", color: "from-blue-500 to-purple-600" },
            { icon: FaRocket, value: "100+", label: "Projects Delivered", color: "from-emerald-500 to-cyan-500" },
            { icon: FaChartLine, value: "99%", label: "Success Rate", color: "from-orange-500 to-red-500" },
            { icon: FaHeart, value: "24/7", label: "Support", color: "from-pink-500 to-rose-500" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center p-6 bg-white/80 dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                <stat.icon className="text-white text-xl" />
              </div>
              <div className={`text-2xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
                {stat.value}
              </div>
              <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          variants={itemVariants}
          className="text-center mt-16"
        >
          <motion.div
            className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 cursor-pointer"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToContact}
          >
            <FaLightbulb className="text-xl" />
            <span>Ready to Start Your Project?</span>
            <FaArrowRight className="text-lg" />
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ServicesSection;