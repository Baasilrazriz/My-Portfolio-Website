import { memo } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { FaExternalLinkAlt, FaCalendar, FaBuilding, FaAward } from 'react-icons/fa';

const CertificateCard = memo(({ 
  image, 
  link, 
  title, 
  org, 
  category = "General",
  issueDate,
  index,
  shouldReduceMotion 
}) => {
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30, 
      scale: 0.9,
      rotateX: 15 
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100,
        duration: 0.6,
        delay: index * 0.1
      }
    },
    hover: shouldReduceMotion ? {} : {
      y: -10,
      scale: 1.05,
      rotateX: 5,
      rotateY: 5,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 200,
        duration: 0.3
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 200,
        duration: 0.3
      }
    }
  };

  const formatDate = (date) => {
    if (!date) return "Date not available";
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block w-full max-w-sm mx-auto bg-white/95 dark:bg-slate-800/95 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-amber-200/30 dark:border-amber-500/20 backdrop-blur-xl"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px"
      }}
    >
      {/* Certificate Image */}
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <motion.img
          src={image}
          alt={title}
          className="w-full h-full object-fill transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Category Badge */}
        <motion.div
          className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg"
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring",
            damping: 20,
            stiffness: 200,
            delay: index * 0.1 + 0.3
          }}
        >
          {category}
        </motion.div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content Section */}
      <div className="relative p-6">
        {/* Title */}
        <motion.h3
          className="text-xl font-bold text-slate-800 dark:text-white mb-2 line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 + 0.4 }}
        >
          {title}
        </motion.h3>

        {/* Organization */}
        <motion.div
          className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 + 0.5 }}
        >
          <FaBuilding className="text-sm text-amber-500" />
          <span className="text-sm font-medium">{org}</span>
        </motion.div>

        {/* Issue Date */}
        {issueDate && (
          <motion.div
            className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.6 }}
          >
            <FaCalendar className="text-sm text-amber-500" />
            <span className="text-xs">{formatDate(issueDate)}</span>
          </motion.div>
        )}

        {/* View Certificate Button */}
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 + 0.7 }}
        >
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-sm group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors duration-300">
            <FaAward className="text-sm" />
            <span>View Certificate</span>
          </div>
          
          <motion.div
            className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full group-hover:bg-amber-200 dark:group-hover:bg-amber-800/50 transition-colors duration-300"
            whileHover={shouldReduceMotion ? {} : { scale: 1.1, rotate: 15 }}
            transition={{ duration: 0.2 }}
          >
            <FaExternalLinkAlt className="text-amber-600 dark:text-amber-400 text-sm" />
          </motion.div>
        </motion.div>
      </div>

      {/* Hover Overlay Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"
        variants={overlayVariants}
        initial="hidden"
        whileHover="visible"
      />

      {/* Floating Shine Effect */}
      {!shouldReduceMotion && (
        <motion.div
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 translate-x-full group-hover:-translate-x-full transition-all duration-1000 pointer-events-none"
          style={{ zIndex: 10 }}
        />
      )}

      {/* Border Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r from-amber-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ 
          background: "linear-gradient(45deg, transparent, rgba(245, 158, 11, 0.3), transparent)",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "exclude"
        }}
      />
    </motion.a>
  );
});
CertificateCard.displayName = 'CertificateCard';

CertificateCard.propTypes = {
  image: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  org: PropTypes.string.isRequired,
  category: PropTypes.string,
  issueDate: PropTypes.string,
  isHovered: PropTypes.bool,
  index: PropTypes.number.isRequired,
  shouldReduceMotion: PropTypes.bool
};

export default CertificateCard;