import  { useState, memo, useMemo } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  FaGithub,
  FaExternalLinkAlt,
  FaCalendarAlt,
  FaCode,
  FaEye,
  FaPlay,
  FaEdit,
  FaTrash,
  FaStar,
} from "react-icons/fa";
import { setEditingProject, deleteProject } from "../../Store/Features/projectSlice";

const ProjectCard = memo(({ project, index, showNotification, shouldReduceMotion }) => {
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Admin check
  const isAdminLoggedIn = 
    sessionStorage.getItem("isAdminAuthenticated") === "true" ||
    localStorage.getItem("adminToken") !== null;

  // Format date
  const formatDate = (date) => {
    if (!date) return "Recently";
    const projectDate = date.toDate ? date.toDate() : new Date(date);
    return projectDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  // Get tech stack colors
  const getTechColor = (tech) => {
    const colors = {
      'React': 'from-cyan-500 to-blue-500',
      'Next.js': 'from-gray-800 to-black',
      'Node.js': 'from-green-500 to-emerald-500',
      'MongoDB': 'from-green-600 to-green-700',
      'Firebase': 'from-yellow-500 to-orange-500',
      'TypeScript': 'from-blue-600 to-blue-800',
      'JavaScript': 'from-yellow-400 to-orange-500',
      'Python': 'from-blue-500 to-yellow-500',
      'React Native': 'from-cyan-400 to-blue-500',
      'Tailwind': 'from-teal-400 to-cyan-500'
    };
    return colors[tech] || 'from-slate-500 to-slate-600';
  };

  // Handle edit
  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(setEditingProject(project));
  };

  // Handle delete
  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000);
      return;
    }
    
    try {
      await dispatch(deleteProject(project.id)).unwrap();
      showNotification("success", "Project deleted successfully!");
    } catch (error) {
      showNotification("error", "Failed to delete project");
    }
    setShowDeleteConfirm(false);
  };

  // Optimized animation variants - Much faster and smoother
  const cardVariants = useMemo(() => ({
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "tween",
        duration: 0.3,
        ease: "easeOut",
        delay: Math.min(index * 0.05, 0.3) // Cap delay at 0.3s
      }
    },
    hover: shouldReduceMotion ? {} : {
      y: -6,
      scale: 1.01,
      transition: {
        type: "tween",
        duration: 0.15,
        ease: "easeOut"
      }
    }
  }), [shouldReduceMotion, index]);

  // Simplified image animations
  const imageVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.2 }
    },
    hover: shouldReduceMotion ? {} : {
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  }), [shouldReduceMotion]);


  return (
    <motion.div
      className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-2xl transition-all duration-300"
      variants={cardVariants}
      whileHover="hover"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      layout={false} // Disable layout animations for better performance
    >
      {/* Featured Badge */}
      {project.featured && (
        <div
          className="absolute top-4 left-4 z-20 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg"
        >
          <FaStar className="text-xs" />
          Featured
        </div>
      )}

      {/* Admin Controls - Simplified */}
      {isAdminLoggedIn && (
        <div
          className={`absolute top-4 right-4 z-20 flex gap-2 transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <button
            onClick={handleEdit}
            className="w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors duration-150"
          >
            <FaEdit className="text-xs" />
          </button>
          <button
            onClick={handleDelete}
            className={`w-8 h-8 ${showDeleteConfirm ? 'bg-red-600' : 'bg-red-500 hover:bg-red-600'} text-white rounded-full flex items-center justify-center shadow-lg transition-colors duration-150`}
          >
            <FaTrash className="text-xs" />
          </button>
        </div>
      )}

      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800">
        <motion.img
          src={project.images?.[0] || project.imgUrl || "/api/placeholder/400/300"}
          alt={project.title}
          className="w-full h-full object-fill transition-transform duration-300 group-hover:scale-105"
          variants={imageVariants}
          initial="hidden"
          animate={imageLoaded ? "visible" : "hidden"}
          whileHover="hover"
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.target.src = "/api/placeholder/400/300";
            setImageLoaded(true);
          }}
        />
        
        {/* Simplified Overlay */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Quick Actions - Simplified */}
        <motion.div
          className={`absolute inset-0 flex items-center justify-center gap-3 transition-all duration-200 ${
            isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          {project.live_link && (
            <a
              href={project.live_link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-white/90 hover:bg-white text-slate-800 rounded-full flex items-center justify-center shadow-lg transition-all duration-150 hover:scale-105"
              onClick={(e) => e.stopPropagation()}
            >
              <FaExternalLinkAlt className="text-lg" />
            </a>
          )}
          
          {project.git_link && (
            <a
              href={project.git_link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-gray-900/90 hover:bg-gray-900 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-150 hover:scale-105"
              onClick={(e) => e.stopPropagation()}
            >
              <FaGithub className="text-lg" />
            </a>
          )}

          {project.videoDemo && (
            <a
              href={project.videoDemo}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-red-500/90 hover:bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-150 hover:scale-105"
              onClick={(e) => e.stopPropagation()}
            >
              <FaPlay className="text-lg" />
            </a>
          )}
          
          <Link
            to={`/project/${project.id}`}
            className="w-12 h-12 bg-blue-500/90 hover:bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-150 hover:scale-105"
            onClick={(e) => e.stopPropagation()}
          >
            <FaEye className="text-lg" />
          </Link>
        </motion.div>

        {/* Loading State */}
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-200 dark:bg-slate-700">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Content - Remove individual animations for better performance */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
              {project.title}
            </h3>
            
            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <FaCalendarAlt />
              <span>{formatDate(project.createdAt)}</span>
            </div>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
            {project.overview || project.description}
          </p>
        </div>

        {/* Tech Stack */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <FaCode className="text-blue-500 text-sm" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Tech Stack
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {(project.tech || project.skills || []).slice(0, 4).map((tech, techIndex) => (
              <span
                key={techIndex}
                className={`px-2 py-1 text-xs font-medium text-white rounded-lg bg-gradient-to-r ${getTechColor(tech)} shadow-sm hover:scale-105 transition-transform duration-150`}
              >
                {tech}
              </span>
            ))}
            {(project.tech || project.skills || []).length > 4 && (
              <span className="px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 rounded-lg">
                +{(project.tech || project.skills || []).length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
              project.category === 'Web Development' 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                : project.category === 'Mobile App'
                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
            }`}>
              {project.category || project.type}
            </span>
          </div>

          <Link
            to={`/project/${project.id}`}
            className="group/link text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-sm transition-colors duration-200"
          >
            <div className="flex items-center gap-1 group-hover/link:translate-x-1 transition-transform duration-150">
              View Details
              <FaExternalLinkAlt className="text-xs" />
            </div>
          </Link>
        </div>
      </div>

      {/* Simplified Hover Glow Effect */}
      <div
        className={`absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5 transition-opacity duration-300 pointer-events-none rounded-3xl ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </motion.div>
  );
});

ProjectCard.displayName = 'ProjectCard';

ProjectCard.propTypes = {
  project: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  showNotification: PropTypes.func.isRequired,
  shouldReduceMotion: PropTypes.bool
};

export default ProjectCard;