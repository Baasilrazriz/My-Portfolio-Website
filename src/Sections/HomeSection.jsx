import { memo, useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

function HomeSection() {
  const image = useSelector((state) => state.home.image);
  const description = useSelector((state) => state.home.description);
  const socialAccounts = useSelector((state) => state.socialAccount?.socialAccounts || []);
  
  const roles = useMemo(() => [
    "Full Stack Developer",
    "MERN Stack Expert", 
    "React.js Specialist",
    "Node.js Developer"
  ], []);

  const [currentRole, setCurrentRole] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  // Enhanced typewriter effect
  useEffect(() => {
    const typeSpeed = isDeleting ? 75 : 150;
    const role = roles[roleIndex];

    const timer = setTimeout(() => {
      if (!isDeleting && charIndex < role.length) {
        setCurrentRole(role.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      } else if (isDeleting && charIndex > 0) {
        setCurrentRole(role.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      } else if (!isDeleting && charIndex === role.length) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % roles.length);
      }
    }, typeSpeed);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, roleIndex, roles]);

  // Cursor blinking effect
  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorTimer);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  // Social icons mapping
  const getSocialIcon = (name) => {
    const icons = {
      github: (
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      ),
      linkedin: (
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      ),
      twitter: (
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
      ),
      instagram: (
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      ),
      facebook: (
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      )
    };
    return icons[name.toLowerCase()] || icons.github;
  };

  return (
    <>
      {/* SEO Meta Tags */}
      <head>
        <title>Muhammad Basil Irfan - Full Stack Developer | MERN Stack Expert</title>
        <meta name="description" content="Muhammad Basil Irfan - Professional Full Stack Developer specializing in MERN Stack, React.js, Node.js, and modern web development. Available for freelance projects." />
        <meta name="keywords" content="Full Stack Developer, MERN Stack, React.js, Node.js, JavaScript, Web Developer, Frontend Developer, Backend Developer, Muhammad Basil Irfan" />
        <meta name="author" content="Muhammad Basil Irfan" />
        <meta property="og:title" content="Muhammad Basil Irfan - Full Stack Developer" />
        <meta property="og:description" content="Professional Full Stack Developer specializing in MERN Stack development" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Muhammad Basil Irfan - Full Stack Developer" />
        <meta name="twitter:description" content="Professional Full Stack Developer specializing in MERN Stack development" />
        <link rel="canonical" href="https://yourwebsite.com" />
      </head>

      <motion.section
        className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black overflow-hidden"
        id="home"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Subtle gradient orbs */}
          <motion.div
            className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
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
            className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-red-500/8 to-orange-500/8 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
          
          {/* Floating geometric shapes */}
          <motion.div
            className="absolute top-1/4 right-1/4 w-4 h-4 bg-yellow-400/40 rounded-full"
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/3 left-1/4 w-3 h-3 bg-cyan-400/50 rotate-45"
            animate={{
              rotate: [45, 225, 45],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </div>

        {/* Main Content Container */}
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center">
              
              {/* Left Content */}
              <motion.div 
                className="space-y-8 text-center lg:text-left order-2 lg:order-1"
                variants={itemVariants}
              >
                {/* Status Badge */}
                <motion.div
                  className="inline-flex items-center px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full backdrop-blur-sm"
                  variants={itemVariants}
                >
                  <motion.div
                    className="w-2 h-2 bg-green-400 rounded-full mr-3"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.8, 1, 0.8],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                  <span className="text-sm font-medium text-green-300">
                    Available for projects
                  </span>
                </motion.div>

                {/* Greeting */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <h2 className="text-xl sm:text-2xl font-light text-slate-300">
                    {"Hello, I'm"}
                  </h2>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                    Muhammad Basil Irfan
                  </h1>
                </motion.div>

                {/* Dynamic Role with Typewriter */}
                <motion.div 
                  variants={itemVariants}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-center lg:justify-start space-x-2 text-2xl sm:text-3xl lg:text-4xl font-semibold">
                    <span className="text-slate-300">{"I'm a"}</span>
                    <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent min-w-[280px] text-left">
                      {currentRole}
                      <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100 text-blue-400`}>
                        |
                      </span>
                    </span>
                  </div>
                </motion.div>

                {/* Description */}
                <motion.p
                  variants={itemVariants}
                  className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto lg:mx-0"
                >
                  {description || "Passionate about creating exceptional digital experiences with modern technologies. Specialized in building scalable web applications that deliver real value to users and businesses."}
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  variants={itemVariants}
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                >
                  <motion.a
                    href="#proj"
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg"
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('proj')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    View My Work
                  </motion.a>
                  
                  <motion.a
                    href="https://drive.google.com/file/d/11LkjodG_xPY63FGX1_7Hf2eSKhhQzbse/view?usp=drive_link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 bg-transparent border-2 border-slate-600 text-slate-300 font-semibold rounded-lg hover:border-slate-400 hover:text-white transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Download CV
                  </motion.a>
                </motion.div>

                {/* Social Links */}
                <motion.div
                  variants={itemVariants}
                  className="flex items-center justify-center lg:justify-start space-x-6"
                >
                  <span className="text-slate-500 text-sm font-medium">
                    Connect with me:
                  </span>
                  <div className="flex space-x-4">
                    {socialAccounts.length > 0 ? (
                      socialAccounts.map((social, index) => (
                        <motion.a
                          key={social.name || index}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-slate-800/50 border border-slate-700 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all duration-300"
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 + index * 0.1 }}
                          aria-label={`Follow me on ${social.name}`}
                        >
                          {social.image ? (
                            <img 
                              src={social.image} 
                              alt={social.name}
                              className="w-5 h-5 object-contain"
                            />
                          ) : (
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                              {getSocialIcon(social.name)}
                            </svg>
                          )}
                        </motion.a>
                      ))
                    ) : (
                      // Fallback social links
                      [
                        { name: "github", url: "https://github.com" },
                        { name: "linkedin", url: "https://linkedin.com" },
                        { name: "twitter", url: "https://twitter.com" }
                      ].map((social, index) => (
                        <motion.a
                          key={social.name}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-slate-800/50 border border-slate-700 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all duration-300"
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 + index * 0.1 }}
                          aria-label={`Follow me on ${social.name}`}
                        >
                          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                            {getSocialIcon(social.name)}
                          </svg>
                        </motion.a>
                      ))
                    )}
                  </div>
                </motion.div>
              </motion.div>

              {/* Right Content - Profile Image */}
              <motion.div
                className="relative order-1 lg:order-2 flex justify-center"
                variants={imageVariants}
              >
                <div className="relative">
                  {/* Glow effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-2xl"
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  
                  {/* Profile image container */}
                  <motion.div
                    className="relative w-80 h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-slate-700/50 bg-gradient-to-br from-slate-800 to-slate-900 p-2"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-full h-full rounded-full overflow-hidden">
                      <img
                        src={image}
                        alt="Muhammad Basil Irfan - Full Stack Developer"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    
                    {/* Floating badge */}
                    <motion.div
                      className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg"
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </motion.div>
                  </motion.div>

                  {/* Decorative elements */}
                  <motion.div
                    className="absolute -top-4 -left-4 w-20 h-20 border-4 border-yellow-400/30 rounded-full"
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 15,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  
                  <motion.div
                    className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl rotate-45"
                    animate={{
                      rotate: [45, 225, 45],
                    }}
                    transition={{
                      duration: 12,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>
              </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
            >
              <motion.div
                className="flex flex-col items-center space-y-2 text-slate-500"
                animate={{
                  y: [0, 8, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <span className="text-xs font-medium tracking-wider uppercase">Scroll to explore</span>
                <div className="w-6 h-10 border-2 border-slate-600 rounded-full flex justify-center">
                  <motion.div
                    className="w-1 h-3 bg-slate-500 rounded-full mt-2"
                    animate={{
                      y: [0, 12, 0],
                      opacity: [1, 0, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </>
  );
}

export default memo(HomeSection);