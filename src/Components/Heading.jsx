import { motion } from "framer-motion";
import PropTypes from "prop-types";

function Heading(props) {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2,
      },
    },
  };

  const headingVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const underlineVariants = {
    hidden: { scaleX: 0, opacity: 0 },
    visible: {
      scaleX: 1,
      opacity: 0.7,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.3,
      },
    },
  };

  const dotsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 0.4,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delay: 0.5,
      },
    },
  };

  const backgroundVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 0.05,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: "easeOut",
        staggerChildren: 0.3,
      },
    },
  };

  const orbVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className={`${
        props.theme == "l"
          ? "bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-900 dark:to-black"
          : "bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 dark:from-slate-900 dark:via-black dark:to-slate-950"
      } h-auto w-full flex flex-col items-center text-center px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8 lg:px-8 lg:py-10 relative overflow-hidden`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {/* Background decorative elements - subtle and optimized */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        variants={backgroundVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div
          className="absolute top-2 left-2 sm:top-4 sm:left-4 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-xl"
          variants={orbVariants}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.05, 0.08, 0.05],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 w-10 h-10 sm:w-14 sm:h-14 md:w-18 md:h-18 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl"
          variants={orbVariants}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.05, 0.08, 0.05],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/4 w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full blur-lg"
          variants={orbVariants}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.08, 0.05],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
      </motion.div>

      {/* Main content */}
      <motion.div
        className="flex flex-col items-center space-y-2 sm:space-y-3"
        variants={containerVariants}
      >
        {/* Compact heading */}
        <motion.div className="group cursor-default" variants={headingVariants}>
          <motion.h2
            className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 dark:from-gray-100 dark:via-gray-200 dark:to-white bg-clip-text text-transparent leading-tight tracking-tight"
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.3, ease: "easeOut" },
            }}
          >
            {props.heading}
          </motion.h2>

          {/* Minimal underline */}
          <motion.div className="flex justify-center mt-1 sm:mt-2">
            <motion.div
              className="w-12 sm:w-16 md:w-20 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full origin-center"
              variants={underlineVariants}
              animate={{
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </motion.div>

        {/* Simplified decorative dots */}
        <motion.div
          className="flex items-center space-x-1 dark:opacity-25"
          variants={dotsVariants}
        >
          <motion.div
            className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-yellow-400 rounded-full"
            animate={{
              y: [0, -4, 0],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-orange-400 rounded-full"
            animate={{
              y: [0, -4, 0],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.1,
            }}
          />
          <motion.div
            className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-red-400 rounded-full"
            animate={{
              y: [0, -4, 0],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.2,
            }}
          />
        </motion.div>
      </motion.div>

      {/* Minimal corner accents */}
      <motion.div
        className="absolute top-0 left-0 w-4 h-4 sm:w-6 sm:h-6 border-t border-l border-yellow-400/20 dark:border-yellow-400/10"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
        viewport={{ once: true }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-4 h-4 sm:w-6 sm:h-6 border-b border-r border-orange-400/20 dark:border-orange-400/10"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 1 }}
        viewport={{ once: true }}
      />
    </motion.div>
  );
}


Heading.propTypes = {
  theme: PropTypes.string,
  heading: PropTypes.string.isRequired,
};

export default Heading;