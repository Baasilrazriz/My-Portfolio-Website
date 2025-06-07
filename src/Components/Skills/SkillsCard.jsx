import React, { memo, useMemo } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { FaStar, FaBolt, FaGem, FaCode } from "react-icons/fa";

// Memoized Skill Card Component with Premium Interview-Ready Design
const SkillsCard = memo(({ skill, index, setHoveredSkill, shouldReduceMotion }) => {
  // Enhanced color schemes based on skill mastery
  const colors = useMemo(() => {
    const colorMap = {
      expert: { 
        primary: "from-emerald-500 to-teal-600",
        secondary: "emerald",
        accent: "bg-emerald-50 dark:bg-emerald-950/20",
        text: "text-emerald-700 dark:text-emerald-300",
        border: "border-emerald-200/60 dark:border-emerald-500/30",
        glow: "shadow-emerald-500/25 hover:shadow-emerald-500/40",
        ring: "ring-emerald-400/30"
      },
      advanced: { 
        primary: "from-blue-500 to-indigo-600",
        secondary: "blue",
        accent: "bg-blue-50 dark:bg-blue-950/20",
        text: "text-blue-700 dark:text-blue-300",
        border: "border-blue-200/60 dark:border-blue-500/30",
        glow: "shadow-blue-500/25 hover:shadow-blue-500/40",
        ring: "ring-blue-400/30"
      },
      intermediate: { 
        primary: "from-purple-500 to-violet-600",
        secondary: "purple",
        accent: "bg-purple-50 dark:bg-purple-950/20",
        text: "text-purple-700 dark:text-purple-300",
        border: "border-purple-200/60 dark:border-purple-500/30",
        glow: "shadow-purple-500/25 hover:shadow-purple-500/40",
        ring: "ring-purple-400/30"
      },
      learning: { 
        primary: "from-amber-500 to-orange-600",
        secondary: "amber",
        accent: "bg-amber-50 dark:bg-amber-950/20",
        text: "text-amber-700 dark:text-amber-300",
        border: "border-amber-200/60 dark:border-amber-500/30",
        glow: "shadow-amber-500/25 hover:shadow-amber-500/40",
        ring: "ring-amber-400/30"
      }
    };

    if (skill.level >= 90) return colorMap.expert;
    if (skill.level >= 80) return colorMap.advanced;
    if (skill.level >= 70) return colorMap.intermediate;
    return colorMap.learning;
  }, [skill.level]);

  // Category-specific styling
  const categoryStyle = useMemo(() => {
    const styles = {
      Frontend: { 
        iconBg: "bg-gradient-to-br from-cyan-500/10 to-blue-500/10",
        iconColor: "text-cyan-600 dark:text-cyan-400"
      },
      Backend: { 
        iconBg: "bg-gradient-to-br from-green-500/10 to-emerald-500/10",
        iconColor: "text-green-600 dark:text-green-400"
      },
      Database: { 
        iconBg: "bg-gradient-to-br from-violet-500/10 to-purple-500/10",
        iconColor: "text-violet-600 dark:text-violet-400"
      },
      Mobile: { 
        iconBg: "bg-gradient-to-br from-pink-500/10 to-rose-500/10",
        iconColor: "text-pink-600 dark:text-pink-400"
      },
      Languages: { 
        iconBg: "bg-gradient-to-br from-orange-500/10 to-amber-500/10",
        iconColor: "text-orange-600 dark:text-orange-400"
      },
      Styling: { 
        iconBg: "bg-gradient-to-br from-indigo-500/10 to-blue-500/10",
        iconColor: "text-indigo-600 dark:text-indigo-400"
      },
      Cloud: { 
        iconBg: "bg-gradient-to-br from-sky-500/10 to-blue-500/10",
        iconColor: "text-sky-600 dark:text-sky-400"
      },
      DevOps: { 
        iconBg: "bg-gradient-to-br from-slate-500/10 to-gray-500/10",
        iconColor: "text-slate-600 dark:text-slate-400"
      },
      Animation: { 
        iconBg: "bg-gradient-to-br from-yellow-500/10 to-lime-500/10",
        iconColor: "text-yellow-600 dark:text-yellow-400"
      },
      Payments: { 
        iconBg: "bg-gradient-to-br from-teal-500/10 to-cyan-500/10",
        iconColor: "text-teal-600 dark:text-teal-400"
      },
      "State Management": { 
        iconBg: "bg-gradient-to-br from-purple-500/10 to-indigo-500/10",
        iconColor: "text-purple-600 dark:text-purple-400"
      }
    };
    return styles[skill.category] || styles.DevOps;
  }, [skill.category]);

  // Skill mastery info
  const masteryInfo = useMemo(() => {
    if (skill.level >= 90) return { 
      label: "Expert", 
      icon: FaGem, 
      description: "Production Ready",
      emoji: "💎"
    };
    if (skill.level >= 80) return { 
      label: "Advanced", 
      icon: FaBolt, 
      description: "Highly Proficient",
      emoji: "⚡"
    };
    if (skill.level >= 70) return { 
      label: "Proficient", 
      icon: FaStar, 
      description: "Solid Experience",
      emoji: "⭐"
    };
    return { 
      label: "Familiar", 
      icon: FaCode, 
      description: "Growing Skills",
      emoji: "🌱"
    };
  }, [skill.level]);

  // Optimized animation variants
  const cardVariants = useMemo(() => ({
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.9,
      rotateX: 15,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 120,
        duration: 0.6,
        delay: index * 0.04,
      },
    },
    hover: shouldReduceMotion ? {} : {
      y: -10,
      scale: 1.03,
      rotateX: 5,
      rotateY: 2,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300,
        duration: 0.3,
      },
    },
  }), [shouldReduceMotion, index]);

  // Progress circle calculations
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (skill.level / 100) * circumference;

  return (
    <motion.div
      className={`group relative w-full h-full bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-3xl border ${colors.border} transition-all duration-500 cursor-pointer overflow-hidden ${colors.glow} hover:${colors.ring} hover:ring-2`}
      variants={cardVariants}
      whileHover="hover"
      onMouseEnter={() => setHoveredSkill(skill.name)}
      onMouseLeave={() => setHoveredSkill(null)}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px"
      }}
    >
      {/* Animated Background Gradient */}
      <motion.div 
        className={`absolute inset-0 ${colors.accent} opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-3xl`}
        initial={{ scale: 0.8, opacity: 0 }}
        whileHover={{ scale: 1, opacity: 1 }}
      />

      {/* Content Container */}
      <div className="relative p-6 h-full flex flex-col">
        
        {/* Header with Mastery Badge */}
        <div className="flex items-start justify-between mb-6">
          <motion.div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${colors.primary} text-white text-xs font-bold shadow-lg`}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring", 
              damping: 20, 
              stiffness: 200,
              delay: index * 0.04 + 0.2
            }}
          >
            <masteryInfo.icon className="w-3 h-3" />
            <span className="hidden sm:inline">{masteryInfo.label}</span>
            <span className="sm:hidden">{masteryInfo.emoji}</span>
          </motion.div>

          <motion.div
            className="opacity-0 group-hover:opacity-100 transition-all duration-300"
            whileHover={shouldReduceMotion ? {} : { scale: 1.1, rotate: 15 }}
            transition={{ duration: 0.2 }}
          >
            <FaBolt className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          </motion.div>
        </div>

        {/* Main Content - Icon and Progress */}
        <div className="flex-1 flex flex-col items-center justify-center mb-6">
          
          {/* Progress Circle with Large Centered Icon */}
          <motion.div 
            className="relative w-28 h-28 mb-4"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring",
              damping: 20,
              stiffness: 100,
              delay: index * 0.04 + 0.4
            }}
          >
            {/* SVG Progress Circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background Circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                className="text-slate-200 dark:text-slate-700"
              />
              {/* Progress Circle */}
              <motion.circle
                cx="50"
                cy="50"
                r={radius}
                stroke={`url(#gradient-${index})`}
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ 
                  duration: 1.5, 
                  ease: "easeInOut",
                  delay: index * 0.04 + 0.6
                }}
              />
              {/* Gradient Definition */}
              <defs>
                <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={skill.level >= 90 ? '#10b981' : skill.level >= 80 ? '#3b82f6' : skill.level >= 70 ? '#8b5cf6' : '#f59e0b'} />
                  <stop offset="100%" stopColor={skill.level >= 90 ? '#0d9488' : skill.level >= 80 ? '#4f46e5' : skill.level >= 70 ? '#7c3aed' : '#ea580c'} />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Large Centered Icon Container */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className={`w-16 h-16 flex items-center justify-center ${categoryStyle.iconBg} ${categoryStyle.iconColor} rounded-full shadow-lg backdrop-blur-sm border border-white/20 dark:border-slate-700/20`}
                whileHover={shouldReduceMotion ? {} : { scale: 1.1, rotate: 10 }}
                transition={{ duration: 0.2 }}
              >
                {/* Large Icon - Properly sized and centered */}
                <div className="w-8 h-8 flex items-center justify-center">
                  {/* Clone the icon element with proper sizing */}
                  {React.cloneElement(skill.icon, { 
                    className: "w-full h-full",
                    style: { fontSize: '2rem' }
                  })}
                </div>
              </motion.div>
            </div>

            {/* Percentage Badge */}
            <motion.div
              className={`absolute -bottom-1 -right-1 w-9 h-9 bg-gradient-to-r ${colors.primary} rounded-full flex items-center justify-center text-white text-sm font-black shadow-lg border-2 border-white dark:border-slate-800`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring",
                damping: 15,
                stiffness: 200,
                delay: index * 0.04 + 0.8
              }}
            >
              {skill.level}
            </motion.div>
          </motion.div>

          {/* Skill Name */}
          <motion.h3 
            className="text-lg font-bold text-slate-800 dark:text-white text-center mb-2 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-800 group-hover:to-slate-600 dark:group-hover:from-white dark:group-hover:to-slate-200 transition-all duration-300"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 + 0.7 }}
            title={skill.name}
          >
            {skill.name}
          </motion.h3>

          {/* Mastery Description */}
          <motion.p
            className={`text-sm ${colors.text} text-center font-medium`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 + 0.8 }}
          >
            {masteryInfo.description}
          </motion.p>
        </div>

        {/* Enhanced Progress Bar */}
        <motion.div 
          className="w-full"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.04 + 0.9 }}
        >
          <div className="flex justify-between items-center text-xs font-medium text-slate-600 dark:text-slate-400 mb-3">
            <span className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${colors.primary}`}></span>
              Proficiency
            </span>
            <span className="font-bold text-slate-800 dark:text-white">{skill.level}%</span>
          </div>
          
          <div className="w-full h-3 rounded-full overflow-hidden bg-slate-200/80 dark:bg-slate-700/80 relative shadow-inner">
            <motion.div
              className={`bg-gradient-to-r ${colors.primary} h-3 rounded-full relative overflow-hidden shadow-sm`}
              initial={{ width: 0 }}
              animate={{ width: `${skill.level}%` }}
              transition={{ 
                duration: 1.2, 
                ease: "easeOut",
                delay: index * 0.04 + 1
              }}
            >
              {/* Animated Shine Effect */}
              {!shouldReduceMotion && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  animate={{ x: [-100, 100] }}
                  transition={{ 
                    duration: 2.5, 
                    repeat: Infinity, 
                    ease: "linear",
                    delay: 2
                  }}
                />
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Footer with Category */}
        <motion.div
          className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-700/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.04 + 1.1 }}
        >
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${colors.accent} ${colors.text} border border-current/20`}>
            {skill.category}
          </span>
          
          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <span>{masteryInfo.emoji}</span>
            <span className="hidden sm:inline font-medium">{skill.level}% Mastery</span>
          </div>
        </motion.div>
      </div>

      {/* Subtle Hover Glow */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${colors.primary} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl pointer-events-none`}
        initial={{ scale: 0.8 }}
        whileHover={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Floating Ambient Light */}
      {!shouldReduceMotion && (
        <motion.div
          className={`absolute top-4 right-4 w-2 h-2 bg-gradient-to-r ${colors.primary} rounded-full opacity-60`}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: index * 0.3,
          }}
        />
      )}
    </motion.div>
  );
});

SkillsCard.displayName = 'SkillsCard';

SkillsCard.propTypes = {
  skill: PropTypes.shape({
    name: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    level: PropTypes.number.isRequired,
    icon: PropTypes.element.isRequired
  }).isRequired,
  index: PropTypes.number.isRequired,
  setHoveredSkill: PropTypes.func.isRequired,
  shouldReduceMotion: PropTypes.bool.isRequired
};

export default SkillsCard;