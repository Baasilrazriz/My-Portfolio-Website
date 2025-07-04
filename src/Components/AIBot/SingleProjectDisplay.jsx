import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { 
  FaChevronRight, 
  FaExternalLinkAlt, 
  FaGithub, 
  FaCode,
  FaCalendarAlt,
  FaStar,
  FaArrowRight,
} from 'react-icons/fa';
import { fetchProjectsData } from './firebaseDataFetcher';
import MainLoader from '../../Loaders/MainLoader';

const SingleProjectDisplay = ({ currentProjectIndex = 0, onProjectChange }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  // Fetch projects on mount
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const projectsData = await fetchProjectsData();
        setProjects(projectsData);
      } catch (error) {
        console.error('Error loading projects:', error);
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  // Reset image loading state when project changes
  useEffect(() => {
    setImageError(false);
  }, [currentProjectIndex]);

  // Update parent component when project changes
  useEffect(() => {
    if (projects.length > 0 && onProjectChange) {
      onProjectChange(currentProjectIndex, projects.length);
    }
  }, [currentProjectIndex, projects.length, onProjectChange]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 1.05 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.4 }
    }
  };

  // Utility functions
  const formatDate = (date) => {
    if (!date) return 'Recent';
    const projectDate = date.toDate ? date.toDate() : new Date(date);
    return projectDate.toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return 'No description available';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) return <MainLoader/>

  if (error || projects.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-br from-red-50/80 to-orange-50/80 dark:from-red-900/20 dark:to-orange-900/20 backdrop-blur-sm rounded-2xl border border-red-200/50 dark:border-red-700/50 p-6 mb-4 text-center shadow-lg"
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <FaCode className="text-red-500 text-xl" />
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">
            {error || 'No projects available at the moment.'}
          </p>
        </div>
      </motion.div>
    );
  }

  const currentProject = projects[currentProjectIndex];
  const hasMoreProjects = currentProjectIndex < projects.length - 1;

  if (!currentProject) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-br from-yellow-50/80 to-orange-50/80 dark:from-yellow-900/20 dark:to-orange-900/20 backdrop-blur-sm rounded-2xl border border-yellow-200/50 dark:border-yellow-700/50 p-6 mb-4 text-center shadow-lg"
      >
        <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">
          Project not found.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden mb-4 shadow-xl hover:shadow-2xl transition-all duration-300"
    >
      {/* Header - Clean & Responsive */}
      <motion.div 
        variants={itemVariants}
        className="px-4 sm:px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-b border-gray-200 dark:border-gray-700"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
          <div className="flex-1 min-w-0">
             {hasMoreProjects && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 px-3 py-2 mb-5 rounded-lg text-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 shadow-sm"
            >
              <span className="hidden sm:inline">Type</span>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs font-mono">
                more
              </kbd>
              <span className="hidden sm:inline">for next</span>
              <FaChevronRight className="text-blue-500 text-sm" />
            </motion.div>
          )}
            <div className="flex items-center gap-3 mb-2">
              <motion.span 
                className="text-blue-500 text-xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                🚀
              </motion.span>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                Featured Project
              </h3>
              <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-semibold">
                {currentProjectIndex + 1} of {projects.length}
              </span>
            </div>
            <h4 className="text-base font-semibold text-gray-800 dark:text-gray-200 truncate">
              {currentProject.title}
            </h4>
          </div>
          
         
        </div>
      </motion.div>

      {/* Project Content */}
      <div className="p-4 sm:p-6">
        {/* Project Image */}
        <motion.div 
          variants={itemVariants}
          className="relative mb-6 rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 shadow-lg"
        >
          <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden">
            {!imageError && currentProject.imgUrl ? (
              <>
            
                <motion.img
                  variants={imageVariants}
                  src={currentProject.imgUrl}
                  alt={currentProject.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <FaCode className="text-6xl text-blue-400 dark:text-blue-500 mb-2 mx-auto opacity-50" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Project Preview</p>
                </div>
              </div>
            )}
            
            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-4 left-4 right-4 flex gap-3">
                {currentProject.liveUrl && (
                  <motion.a
                    href={currentProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-white/95 backdrop-blur-sm text-gray-900 px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-white transition-all duration-200 shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaExternalLinkAlt className="text-sm" />
                    <span className="hidden sm:inline">Live Demo</span>
                    <span className="sm:hidden">Demo</span>
                  </motion.a>
                )}
                {currentProject.githubUrl && (
                  <motion.a
                    href={currentProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-gray-900/95 backdrop-blur-sm text-white px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-gray-900 transition-all duration-200 shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaGithub className="text-sm" />
                    <span className="hidden sm:inline">Source Code</span>
                    <span className="sm:hidden">Code</span>
                  </motion.a>
                )}
              </div>
            </div>

            {/* Featured badge */}
            {currentProject.featured && (
              <div className="absolute top-4 right-4">
                <motion.div 
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg"
                >
                  <FaStar className="text-xs" />
                  Featured
                </motion.div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Project Details */}
        <motion.div variants={itemVariants} className="space-y-4">
          {/* Title and Category */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white mb-2 leading-tight">
                {currentProject.title}
              </h4>
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                {currentProject.category && (
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-full font-medium">
                    {currentProject.category}
                  </span>
                )}
                {currentProject.createdAt && (
                  <span className="flex items-center gap-1.5">
                    <FaCalendarAlt className="text-xs" />
                    {formatDate(currentProject.createdAt)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {truncateText(currentProject.description)}
            </p>
          </div>

          {/* Technologies */}
          {currentProject.technologies && currentProject.technologies.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                <FaCode className="text-xs text-blue-500" />
                Technologies Used
              </h5>
              <div className="flex flex-wrap gap-2">
                {currentProject.technologies.map((tech, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Footer - Clean & Responsive */}
      <motion.div 
        variants={itemVariants}
        className="px-4 sm:px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">
              Project {currentProjectIndex + 1} of {projects.length}
            </span>
        
          </div>
          
          <div className="flex items-center gap-3">
       
            <button
              onClick={() => window.location.href = '#proj'}
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500"
            >
              <span>View All</span>
              <FaArrowRight className="text-xs" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

SingleProjectDisplay.propTypes = {
  currentProjectIndex: PropTypes.number,
  onProjectChange: PropTypes.func
};

export default SingleProjectDisplay;
