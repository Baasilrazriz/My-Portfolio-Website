import React, { useState, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import SocialAccountIcon from '../Components/SocialAccounts/SocialAccountIcon';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  HiOutlineHome, 
  HiOutlineUser, 
  HiOutlineAcademicCap, 
  HiOutlineLightningBolt, 
  HiOutlineBriefcase, 
  HiOutlineMail,
  HiOutlineArrowUp,
  HiOutlineHeart,
  HiOutlineCode,
} from "react-icons/hi";

const FooterSection = React.memo(() => {
  const socialAccounts = useSelector((state) => state.social.socialAccounts);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, { once: true, amount: 0.1 });

  // Memoized navigation items
  const navItems = useMemo(() => [
    { id: "home", label: "Home", icon: HiOutlineHome, color: "from-blue-400 to-blue-600" },
    { id: "about", label: "About", icon: HiOutlineUser, color: "from-emerald-400 to-emerald-600" },
    { id: "education", label: "Education", icon: HiOutlineAcademicCap, color: "from-purple-400 to-purple-600" },
    { id: "skills", label: "Skills", icon: HiOutlineLightningBolt, color: "from-yellow-400 to-orange-600" },
    { id: "proj", label: "Projects", icon: HiOutlineBriefcase, color: "from-pink-400 to-pink-600" },
    { id: "con", label: "Contact", icon: HiOutlineMail, color: "from-cyan-400 to-cyan-600" }
  ], []);

  // Optimized mouse tracking
  const handleMouseMove = useCallback((e) => {
    if (footerRef.current) {
      const rect = footerRef.current.getBoundingClientRect();
      setMousePosition({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100
      });
    }
  }, []);

  // Scroll to top functionality
  const scrollToTop = useCallback(() => {
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth',
      block: 'start'
    });
  }, []);

  // Enhanced animation variants
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.15,
        duration: 0.8
      }
    }
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { 
      y: 60, 
      opacity: 0,
      scale: 0.8
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 120,
        duration: 0.8
      }
    }
  }), []);

  const logoVariants = useMemo(() => ({
    hidden: { 
      y: -50, 
      opacity: 0,
      scale: 0.5,
      rotate: -180
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100,
        duration: 1.2
      }
    }
  }), []);

  // Memoized particles with enhanced movement
  const particles = useMemo(() => 
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: 5 + (i * 8),
      top: 10 + (i % 4) * 25,
      delay: i * 0.3,
      duration: 4 + (i % 3),
      size: 1 + (i % 3) * 0.5
    })), []
  );

  return (
    <motion.footer 
      ref={footerRef}
      className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-1000"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Dynamic Gradient Overlay with Smooth Animation */}
        <motion.div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.15), rgba(236, 72, 153, 0.1), transparent 60%)`
          }}
          animate={{
            opacity: isHovering ? 0.8 : 0.4,
            scale: isHovering ? 1.1 : 1
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        
        {/* Enhanced Animated Particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-gradient-to-r from-blue-400/50 to-purple-400/50"
            style={{
              width: `${particle.size * 8}px`,
              height: `${particle.size * 8}px`,
              left: `${particle.left}%`,
              top: `${particle.top}%`
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, 20, 0],
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1.2, 0.5],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Animated Geometric Patterns */}
        <motion.div 
          className="absolute inset-0 opacity-5 dark:opacity-15"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <svg width="100%" height="100%">
            <defs>
              <pattern id="footerGrid" width="80" height="80" patternUnits="userSpaceOnUse">
                <circle cx="40" cy="40" r="2" fill="currentColor" opacity="0.3"/>
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#footerGrid)" />
          </svg>
        </motion.div>

        {/* Floating Orbs */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute rounded-full bg-gradient-to-r from-blue-300/20 to-purple-300/20 backdrop-blur-sm"
            style={{
              width: `${60 + i * 20}px`,
              height: `${60 + i * 20}px`,
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 2) * 40}%`
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 360],
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        {/* Enhanced Logo & Brand Section */}
        <motion.div 
          className="text-center mb-12"
          variants={logoVariants}
        >
          <motion.button
            onClick={scrollToTop}
            className="group relative inline-block mb-6"
            whileHover={{ 
              scale: 1.08,
              rotate: [0, -5, 5, 0],
              transition: { duration: 0.6 }
            }}
            whileTap={{ scale: 0.92 }}
          >
            {/* Multi-layered Glow Effects */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-red-500/40 via-orange-500/30 to-red-600/40 rounded-3xl blur-3xl"
              animate={{
                opacity: [0, 1, 0],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-red-400/30 via-orange-400/20 to-red-500/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
            
            <motion.img 
              src="/bas.png"
              alt="Basil Razriz - Full Stack Developer"
              className="h-16 w-auto sm:h-18 md:h-20 filter drop-shadow-lg group-hover:drop-shadow-2xl transition-all duration-500 relative z-10"
              loading="lazy"
              whileHover={{
                filter: "brightness(1.2) contrast(1.1) saturate(1.1)",
                transition: { duration: 0.3 }
              }}
            />
          </motion.button>

          <motion.div 
            className="space-y-2"
            variants={itemVariants}
          >
            <motion.h3 
              className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-200"
              whileHover={{
                scale: 1.05,
                color: "#3b82f6",
                transition: { duration: 0.3 }
              }}
            >
              Basil Razriz
            </motion.h3>
            <motion.p 
              className="text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-md mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              Full Stack Developer crafting exceptional digital experiences
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Enhanced Navigation Grid */}
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 mb-12"
          variants={containerVariants}
        >
          {navItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.a
                key={item.id}
                href={`#${item.id}`}
                className="group relative p-4 md:p-6 rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all duration-500 text-center overflow-hidden"
                variants={itemVariants}
                whileHover={{ 
                  y: -8,
                  scale: 1.05,
                  boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
                  borderColor: "rgba(59, 130, 246, 0.3)"
                }}
                whileTap={{ scale: 0.98 }}
                custom={index}
              >
                {/* Enhanced Hover Background Effect */}
                <motion.div 
                  className={`absolute inset-0 bg-gradient-to-br ${item.color} rounded-2xl`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ 
                    opacity: 0.15, 
                    scale: 1,
                    transition: { duration: 0.4 }
                  }}
                />
                
                <div className="relative z-10 flex flex-col items-center space-y-3">
                  <motion.div 
                    className="p-3 rounded-xl bg-slate-100 dark:bg-slate-700 group-hover:bg-gradient-to-br transition-all duration-500"
                    whileHover={{
                      background: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
                      scale: 1.1,
                      rotate: [0, -10, 10, 0],
                      transition: { duration: 0.6 }
                    }}
                    style={{
                      background: `linear-gradient(to bottom right, transparent, transparent)`
                    }}
                  >
                    <IconComponent className="w-5 h-5 md:w-6 md:h-6 text-slate-600 dark:text-slate-400 group-hover:text-white transition-all duration-400" />
                  </motion.div>
                  <motion.span 
                    className="font-semibold text-sm md:text-base text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors duration-400"
                    whileHover={{
                      scale: 1.05,
                      transition: { duration: 0.2 }
                    }}
                  >
                    {item.label}
                  </motion.span>
                </div>

                {/* Enhanced Shine Effect */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-2xl"
                  initial={{ x: "-100%" }}
                  whileHover={{ 
                    x: "100%",
                    transition: { duration: 0.8, ease: "easeOut" }
                  }}
                />

                {/* Border Glow Effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl border-2 border-transparent"
                  whileHover={{
                    borderColor: "rgba(59, 130, 246, 0.4)",
                    boxShadow: "inset 0 0 20px rgba(59, 130, 246, 0.1)",
                    transition: { duration: 0.3 }
                  }}
                />
              </motion.a>
            );
          })}
        </motion.div>

        {/* Enhanced Social Media Section */}
        <motion.div 
          className="flex justify-center mb-12"
          variants={itemVariants}
        >
          <div className="flex flex-wrap justify-center gap-4">
            {socialAccounts.map((account, index) => (
              <motion.div
                key={account.name}
                className="group"
                initial={{ scale: 0, rotate: -180, opacity: 0 }}
                animate={isInView ? { 
                  scale: 1, 
                  rotate: 0, 
                  opacity: 1,
                  transition: {
                    type: "spring",
                    damping: 15,
                    stiffness: 200,
                    delay: 0.2 + (index * 0.1)
                  }
                } : { scale: 0, rotate: -180, opacity: 0 }}
                whileHover={{ 
                  scale: 1.2, 
                  rotate: [0, -10, 10, 0],
                  y: -5,
                  transition: { duration: 0.6 }
                }}
                whileTap={{ scale: 0.9 }}
              >
                <div className="relative p-2 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 group-hover:bg-white dark:group-hover:bg-slate-800 transition-all duration-300 shadow-lg group-hover:shadow-2xl">
                  {/* Multi-layered Glow Effect */}
                  <motion.div 
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 blur-lg"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ 
                      opacity: 1, 
                      scale: 1.3,
                      transition: { duration: 0.4 }
                    }}
                  />
                  <motion.div 
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/20 to-blue-400/20 blur-sm"
                    animate={{
                      opacity: [0, 0.5, 0],
                      rotate: [0, 180, 360]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <SocialAccountIcon 
                    name={account.name} 
                    url={account.url} 
                    image={account.image}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Divider */}
        <motion.div 
          className="relative mb-8"
          variants={itemVariants}
        >
          <motion.div 
            className="absolute inset-0 flex items-center"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 1.5, delay: 0.5 }}
          >
            <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent"></div>
          </motion.div>
          <div className="relative flex justify-center">
            <motion.div 
              className="flex items-center space-x-2 bg-white dark:bg-slate-900 px-4"
              whileHover={{
                scale: 1.1,
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                transition: { duration: 0.3 }
              }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <HiOutlineHeart className="w-4 h-4 text-red-500" />
              </motion.div>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Made with passion</span>
              <motion.div
                animate={{
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <HiOutlineCode className="w-4 h-4 text-blue-500" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Footer Bottom */}
        <motion.div 
          className="flex flex-col sm:flex-row justify-between items-center gap-6"
          variants={itemVariants}
        >
          <motion.div 
            className="text-center sm:text-left space-y-2"
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.3 }
            }}
          >
            <p className="text-slate-700 dark:text-slate-300 font-semibold">
              © 2024 Basil Razriz. All rights reserved.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Transforming ideas into exceptional digital experiences
            </p>
          </motion.div>
          
          {/* Enhanced Back to Top Button - Hidden when at top */}
          <motion.button
            onClick={scrollToTop}
            className="fixed group bottom-10 right-10 p-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transition-all duration-300 overflow-hidden"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: window.scrollY > 100 ? 1 : 0,
              scale: window.scrollY > 100 ? 1 : 0
            }}
            whileHover={{ 
              scale: window.scrollY > 100 ? 1.15 : 0,
              boxShadow: "0 25px 50px rgba(59, 130, 246, 0.4)",
              background: "linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899)"
            }}
            whileTap={{ scale: 0.9 }}
            aria-label="Back to top"
            style={{
              pointerEvents: window.scrollY > 100 ? 'auto' : 'none'
            }}
          >
            <motion.div
              animate={{
                y: [0, -2, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <HiOutlineArrowUp className="w-5 h-5 group-hover:transform group-hover:-translate-y-1 transition-transform duration-300" />
            </motion.div>
            
            {/* Animated Button Background */}
            <motion.div 
              className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-50 blur-lg transition-all duration-300"
              animate={{
                rotate: [0, 360]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </motion.button>
        </motion.div>
      </div>
    </motion.footer>
  );
});

FooterSection.displayName = "FooterSection";

export default FooterSection;