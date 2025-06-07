import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

function ErrorPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get error details from navigation state
  const errorDetails = location.state?.error;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const floatVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const glowVariants = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.5, 0.8, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating Orbs */}
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-full blur-3xl"
          variants={glowVariants}
          animate="animate"
        />
        <motion.div
          className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-purple-500/8 to-pink-500/8 rounded-full blur-3xl"
          variants={glowVariants}
          animate="animate"
          transition={{ delay: 1 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-r from-blue-500/8 to-cyan-500/8 rounded-full blur-2xl"
          variants={glowVariants}
          animate="animate"
          transition={{ delay: 0.5 }}
        />

        {/* Particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-red-400/30 rounded-full"
            style={{
              left: `${20 + (i * 8)}%`,
              top: `${25 + (i * 6)}%`,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, Math.sin(i) * 20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <motion.div
        className="text-center px-6 sm:px-8 max-w-2xl mx-auto relative z-10"
        variants={containerVariants}
      >
        {/* Error Number */}
        <motion.div
          className="relative mb-8"
          variants={itemVariants}
        >
          <motion.div
            className="text-8xl sm:text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent leading-none"
            variants={floatVariants}
            animate="animate"
          >
            {errorDetails ? 'ERROR' : '404'}
          </motion.div>
          
          {/* Glowing backdrop */}
          <motion.div
            className="absolute inset-0 text-8xl sm:text-9xl md:text-[12rem] font-bold text-red-500/10 leading-none blur-2xl"
            variants={glowVariants}
            animate="animate"
          >
            {errorDetails ? 'ERROR' : '404'}
          </motion.div>
        </motion.div>

        {/* Error Message */}
        <motion.div className="space-y-4 mb-8" variants={itemVariants}>
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4"
            variants={itemVariants}
          >
            {errorDetails ? 'Something Went Wrong' : 'Page Not Found'}
          </motion.h1>
          
          <motion.p
            className="text-lg sm:text-xl text-slate-400 leading-relaxed"
            variants={itemVariants}
          >
            {errorDetails 
              ? 'An unexpected error occurred while loading the portfolio.'
              : "Oops! The page you're looking for seems to have wandered off into the digital void."
            }
          </motion.p>
          
          <motion.p
            className="text-base text-slate-500"
            variants={itemVariants}
          >
            {errorDetails 
              ? 'Our team has been notified and is working on a fix.'
              : "Don't worry, even the best explorers sometimes take a wrong turn."
            }
          </motion.p>

          {/* Error Details (for debugging in development) */}
          {errorDetails && import.meta.env.DEV && (
            <motion.div
              className="mt-4 p-4 bg-slate-800/50 rounded-lg text-left"
              variants={itemVariants}
            >
              <p className="text-xs text-slate-400 mb-2">Error Details:</p>
              <code className="text-xs text-red-400 break-all">{errorDetails}</code>
            </motion.div>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          variants={itemVariants}
        >
          {/* Home Button */}
          <motion.button
            onClick={() => navigate('/')}
            className="group relative px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-lg overflow-hidden shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
            <span className="relative z-10 flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Back to Home
            </span>
          </motion.button>

          {/* Try Again Button (for errors) or Go Back Button */}
          <motion.button
            onClick={() => errorDetails ? window.location.reload() : navigate(-1)}
            className="group px-8 py-4 bg-transparent border-2 border-slate-600 text-slate-300 font-semibold rounded-lg hover:border-slate-500 hover:text-white transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <span className="flex items-center gap-2">
              {errorDetails ? (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Try Again
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Go Back
                </>
              )}
            </span>
          </motion.button>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          className="mt-12 pt-8 border-t border-slate-800"
          variants={itemVariants}
        >
          <motion.p
            className="text-sm text-slate-500 mb-4"
            variants={itemVariants}
          >
            {errorDetails 
              ? 'If this problem persists, please contact support'
              : 'If you believe this is an error, please contact support'
            }
          </motion.p>
          
          {/* Decorative Elements */}
          <motion.div
            className="flex justify-center space-x-4"
            variants={itemVariants}
          >
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="w-2 h-2 bg-gradient-to-r from-red-400 to-orange-500 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.3,
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Corner Decorations */}
      <motion.div
        className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-red-500/30"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 1.5 }}
      />
      <motion.div
        className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-orange-500/30"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 1.7 }}
      />
    </motion.div>
  );
}

export default ErrorPage;