import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import {
  FaArrowLeft,
  FaExternalLinkAlt,
  FaGithub,
  FaExpand,
  FaShare,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaCalendarAlt,
  FaStar,
  FaEye,
  FaHeart,
  FaBookmark,
} from "react-icons/fa";
import { fetchProjects } from "../Store/Features/projectSlice";
import Switcher from "../Components/Theme/Switcher";
import MainLoader from "../Loaders/MainLoader";

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const shouldReduceMotion = useReducedMotion();

  const { projects, loading } = useSelector((state) => state.projects);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [viewCount, setViewCount] = useState(0);

  // Find the current project
  const project = useMemo(() => {
    return projects.find((p) => p.id.toString() === id);
  }, [projects, id]);

  // Sample additional data for enhanced project details
  const projectData = useMemo(() => {
    if (!project) return null;

    return {
      ...project,
      // Enhanced data structure
      images: [project.imgUrl, project.imgUrl, project.imgUrl].filter(Boolean),
      demoVideo:
        project.demoVideo ,
      longDescription: project.description,
      createdAt: project.createdAt || "2024-01-15",
      updatedAt: project.updatedAt || "2024-02-20",
      status: project.status || "Completed",
      featured: project.featured || false,
      likes: Math.floor(Math.random() * 100) + 20,
      views: Math.floor(Math.random() * 1000) + 100,
    };
  }, [project]);

  // Fetch projects if not loaded
  useEffect(() => {
    if (projects.length === 0) {
      dispatch(fetchProjects());
    }
  }, [dispatch, projects.length]);

  // Track view count
  useEffect(() => {
    if (projectData) {
      setViewCount(projectData.views);
      // Simulate view increment
      setTimeout(() => setViewCount((prev) => prev + 1), 1000);
    }
  }, [projectData]);

  // Check bookmark status
  useEffect(() => {
    const bookmarks = JSON.parse(
      localStorage.getItem("bookmarkedProjects") || "[]"
    );
    setIsBookmarked(bookmarks.includes(id));
  }, [id]);

  const handleBookmark = () => {
    const bookmarks = JSON.parse(
      localStorage.getItem("bookmarkedProjects") || "[]"
    );
    let newBookmarks;

    if (isBookmarked) {
      newBookmarks = bookmarks.filter((bookmarkId) => bookmarkId !== id);
    } else {
      newBookmarks = [...bookmarks, id];
    }

    localStorage.setItem("bookmarkedProjects", JSON.stringify(newBookmarks));
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: projectData.title,
          text: projectData.overview,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  };

const formatDescription = (html) => {
    return { __html: html };
};

  const nextImage = () => {
    setSelectedImageIndex((prev) => {
      const nextIndex = prev === projectData.images.length - 1 ? 0 : prev + 1;
      // Auto-scroll thumbnail into view
      setTimeout(() => {
        const thumbnailElement = document.querySelector(
          `[data-thumbnail-index="${nextIndex}"]`
        );
        if (thumbnailElement) {
          thumbnailElement.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
          });
        }
      }, 100);
      return nextIndex;
    });
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => {
      const prevIndex = prev === 0 ? projectData.images.length - 1 : prev - 1;
      // Auto-scroll thumbnail into view
      setTimeout(() => {
        const thumbnailElement = document.querySelector(
          `[data-thumbnail-index="${prevIndex}"]`
        );
        if (thumbnailElement) {
          thumbnailElement.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
          });
        }
      }, 100);
      return prevIndex;
    });
  };

  const handleThumbnailClick = (index) => {
    setSelectedImageIndex(index);
    // Auto-scroll thumbnail into view
    setTimeout(() => {
      const thumbnailElement = document.querySelector(
        `[data-thumbnail-index="${index}"]`
      );
      if (thumbnailElement) {
        thumbnailElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }, 100);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
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
  };

  if (loading || !projectData) {
    return <MainLoader/>;
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <motion.div
          className="text-center p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-24 h-24 bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FaTimes className="text-3xl text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
            Project Not Found
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            The project you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <motion.button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
            whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            Back to Projects
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {!shouldReduceMotion && (
          <>
            <motion.div
              className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-r from-cyan-500/8 to-teal-500/8 rounded-full blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
            />
          </>
        )}
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Back Button */}
        <motion.div
          className="flex items-center justify-between mb-8"
          variants={itemVariants}
        >
          <motion.button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-all duration-200"
            whileHover={shouldReduceMotion ? {} : { scale: 1.02, x: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaArrowLeft className="text-sm" />
            <span className="font-medium">Back to Projects</span>
          </motion.button>

          <div className="flex items-center gap-3">
            <motion.div
              className="p-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg"
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
            >
              <Switcher />
            </motion.div>

            <motion.button
              onClick={handleBookmark}
              className={`p-3 rounded-xl backdrop-blur-xl border shadow-lg transition-all duration-200 ${
                isBookmarked
                  ? "bg-red-500/90 border-red-400 text-white"
                  : "bg-white/80 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 text-slate-700 dark:text-slate-300"
              }`}
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaBookmark className="text-sm" />
            </motion.button>

            <motion.button
              onClick={handleShare}
              className="p-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-all duration-200"
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaShare className="text-sm" />
            </motion.button>
          </div>
        </motion.div>

        {/* Project Header with Integrated Description */}
        <motion.div
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-xl mb-8"
          variants={itemVariants}
        >
          <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
            {/* Project Info */}
            <div className="flex-1">
              <motion.div
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/30 dark:border-blue-700/30 rounded-xl mb-4"
                variants={itemVariants}
              >
                <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {projectData.category}
                </span>
              </motion.div>

              <motion.h1
                className="text-4xl lg:text-5xl font-black mb-4 bg-gradient-to-r from-slate-800 via-blue-600 to-purple-600 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent leading-tight"
                variants={itemVariants}
              >
                {projectData.title}
              </motion.h1>

              <motion.p
                className="text-lg text-slate-600 dark:text-slate-400 mb-6 leading-relaxed"
                variants={itemVariants}
              >
                {projectData.overview}
              </motion.p>

              {/* Tech Stack */}
              <motion.div className="mb-6" variants={itemVariants}>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3">
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {projectData.tech.map((tech, index) => (
                    <motion.span
                      key={tech}
                      className="px-3 py-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/30 dark:border-blue-700/30 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {/* Project Stats */}
              <motion.div
                className="flex flex-wrap gap-6 mb-6"
                variants={itemVariants}
              >
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <FaEye className="text-blue-500" />
                  <span className="text-sm font-medium">{viewCount} views</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <FaHeart className="text-red-500" />
                  <span className="text-sm font-medium">
                    {projectData.likes} likes
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <FaCalendarAlt className="text-green-500" />
                  <span className="text-sm font-medium">
                    {new Date(projectData.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {projectData.featured && (
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                    <FaStar className="text-amber-500" />
                    <span className="text-sm font-medium">Featured</span>
                  </div>
                )}
              </motion.div>

              <motion.div
                className="mb-6 p-6 bg-gradient-to-r from-slate-50/50 to-blue-50/50 dark:from-slate-800/50 dark:to-slate-700/50 rounded-2xl border border-slate-200/30 dark:border-slate-600/30"
                variants={itemVariants}
              >
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
                  Project Details
                </h3>
                <div
                  className="text-black dark:text-white prose prose-slate dark:prose-invert prose-sm max-w-none prose-headings:text-slate-800 dark:prose-headings:text-white prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-strong:text-slate-800 dark:prose-strong:text-white prose-ul:text-slate-600 dark:prose-ul:text-slate-300 prose-li:text-slate-600 dark:prose-li:text-slate-300 prose-a:text-blue-600 dark:prose-a:text-blue-400"
                  dangerouslySetInnerHTML={formatDescription(
                    projectData.longDescription
                  )}
                />
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                className="flex flex-wrap gap-4"
                variants={itemVariants}
              >
                {projectData.live_link && (
                  <motion.a
                    href={projectData.live_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg"
                    whileHover={
                      shouldReduceMotion ? {} : { scale: 1.02, y: -1 }
                    }
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaExternalLinkAlt className="text-sm" />
                    <span>Live Demo</span>
                  </motion.a>
                )}

                {projectData.git_link && (
                  <motion.a
                    href={projectData.git_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-slate-800 dark:bg-slate-700 text-white font-semibold rounded-xl hover:bg-slate-900 dark:hover:bg-slate-600 transition-all duration-200 shadow-lg"
                    whileHover={
                      shouldReduceMotion ? {} : { scale: 1.02, y: -1 }
                    }
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaGithub className="text-sm" />
                    <span>Source Code</span>
                  </motion.a>
                )}
              </motion.div>
            </div>

            {/* Project Images Slideshow */}
            <div className="lg:w-1/2 ">
              <motion.div className="space-y-4" variants={itemVariants}>
                {/* Main Image Display */}
                <div className="relative">
                  <motion.div
                    className="relative aspect-video overflow-hidden rounded-2xl cursor-pointer group bg-slate-100 dark:bg-slate-800"
                    whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
                    onClick={() => setIsImageModalOpen(true)}
                    layoutId={`main-image-${selectedImageIndex}`}
                  >
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={selectedImageIndex}
                        src={projectData.images[selectedImageIndex]}
                        alt={`${projectData.title} - Image ${
                          selectedImageIndex + 1
                        }`}
                        className="w-full h-full object-cover"
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                      />
                    </AnimatePresence>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                      <motion.div
                        className="opacity-0 group-hover:opacity-100 transition-all duration-300"
                        whileHover={{ scale: 1.1 }}
                      >
                        <FaExpand className="text-white text-2xl drop-shadow-lg" />
                      </motion.div>
                    </div>

                    {/* Navigation Arrows (if more than 1 image) */}
                    {projectData.images.length > 1 && (
                      <>
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            prevImage();
                          }}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-sm transition-all duration-200 opacity-0 group-hover:opacity-100"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaChevronLeft className="text-sm" />
                        </motion.button>

                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            nextImage();
                          }}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-sm transition-all duration-200 opacity-0 group-hover:opacity-100"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaChevronRight className="text-sm" />
                        </motion.button>
                      </>
                    )}

                    {/* Image Counter */}
                    {projectData.images.length > 1 && (
                      <div className="absolute bottom-3 right-3 px-3 py-1 bg-black/50 text-white text-sm rounded-full backdrop-blur-sm">
                        {selectedImageIndex + 1} / {projectData.images.length}
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Thumbnail Strip */}
                {projectData.images.length > 1 && (
                  <div className="relative">
                    <div className="overflow-x-auto scrollbar-hide">
                      <div
                        className="flex gap-3 pb-2 thumbnail-scroll"
                        style={{ width: "max-content" }}
                      >
                        {projectData.images.map((image, index) => (
                          <motion.div
                            key={index}
                            data-thumbnail-index={index}
                            className={`relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                              index === selectedImageIndex
                                ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-800"
                                : "hover:ring-2 hover:ring-slate-300 dark:hover:ring-slate-600"
                            }`}
                            onClick={() => handleThumbnailClick(index)}
                            whileHover={
                              shouldReduceMotion ? {} : { scale: 1.05, y: -2 }
                            }
                            whileTap={{ scale: 0.95 }}
                            layoutId={`thumbnail-${index}`}
                          >
                            <img
                              src={image}
                              alt={`${projectData.title} - Thumbnail ${
                                index + 1
                              }`}
                              className={`w-full h-full object-cover transition-all duration-300 ${
                                index === selectedImageIndex
                                  ? "opacity-100"
                                  : "opacity-70 hover:opacity-100"
                              }`}
                            />

                            {/* Active indicator */}
                            {index === selectedImageIndex && (
                              <motion.div
                                className="absolute inset-0 bg-blue-500/20"
                                layoutId="active-thumbnail"
                                transition={{
                                  type: "spring",
                                  bounce: 0.2,
                                  duration: 0.6,
                                }}
                              />
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Scroll indicators */}
                    <div className="absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-white dark:from-slate-800 to-transparent pointer-events-none opacity-50" />
                    <div className="absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-white dark:from-slate-800 to-transparent pointer-events-none opacity-50" />
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Demo Video Section */}
        {projectData.demoVideo && (
          <motion.div
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-xl mb-8"
            variants={itemVariants}
          >
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
              Demo Video
            </h2>
            <div className="relative">
              <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
                <iframe
                  src={projectData.demoVideo}
                  title={`${projectData.title} Demo`}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </motion.div>
        )}

        {/* Similar Projects Section */}
        <motion.div
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-xl"
          variants={itemVariants}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                Similar Projects
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Explore other projects with similar technologies
              </p>
            </div>
            <motion.button
              onClick={() => navigate('/#proj')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/30 dark:border-blue-700/30 rounded-xl text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
              whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-sm font-medium">View All</span>
              <FaArrowLeft className="text-xs transform rotate-180" />
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects
              .filter(p => 
                p.id !== projectData.id && 
                (p.category === projectData.category || 
                 p.tech?.some(tech => projectData.tech?.includes(tech)))
              )
              .slice(0, 3)
              .map((similarProject, index) => (
                <motion.div
                  key={similarProject.id}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 border border-slate-200/50 dark:border-slate-700/50 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
                  onClick={() => navigate(`/project/${similarProject.id}`)}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={shouldReduceMotion ? {} : { y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Project Image */}
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={similarProject.imgUrl}
                      alt={similarProject.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300">
                        {similarProject.category}
                      </span>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <motion.div
                        className="p-3 bg-white/20 backdrop-blur-md rounded-full"
                        whileHover={{ scale: 1.1 }}
                      >
                        <FaArrowLeft className="text-white text-lg transform rotate-180" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {similarProject.title}
                    </h3>
                    
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                      {similarProject.overview}
                    </p>

                    {/* Tech Stack Preview */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {similarProject.tech?.slice(0, 3).map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs rounded-md border border-blue-200/30 dark:border-blue-700/30"
                        >
                          {tech}
                        </span>
                      ))}
                      {similarProject.tech?.length > 3 && (
                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs rounded-md">
                          +{similarProject.tech.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Project Links */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {similarProject.live_link && (
                          <motion.a
                            href={similarProject.live_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors duration-200"
                            onClick={(e) => e.stopPropagation()}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FaExternalLinkAlt className="text-xs" />
                          </motion.a>
                        )}
                        {similarProject.git_link && (
                          <motion.a
                            href={similarProject.git_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200"
                            onClick={(e) => e.stopPropagation()}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FaGithub className="text-xs" />
                          </motion.a>
                        )}
                      </div>

                      {/* View Project Arrow */}
                      <motion.div
                        className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                        whileHover={{ scale: 1.1 }}
                      >
                        <FaArrowLeft className="text-xs transform rotate-180" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Decorative Border */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-200 dark:group-hover:border-blue-800 transition-all duration-300 pointer-events-none" />
                </motion.div>
              ))}
          </div>

          {/* No Similar Projects Message */}
          {projects.filter(p => 
            p.id !== projectData.id && 
            (p.category === projectData.category || 
             p.tech?.some(tech => projectData.tech?.includes(tech)))
          ).length === 0 && (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaStar className="text-2xl text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                No Similar Projects Found
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                This project is unique! Check out all projects to discover more.
              </p>
              <motion.button
                onClick={() => navigate('/#proj')}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg"
                whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                Explore All Projects
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {isImageModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsImageModalOpen(false)}
          >
            <motion.div
              className="relative max-w-6xl max-h-[90vh] w-full mx-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={projectData.images[selectedImageIndex]}
                alt={`${projectData.title} - Image ${selectedImageIndex + 1}`}
                className="w-full h-full object-contain rounded-2xl"
              />

              {/* Navigation Controls */}
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="absolute top-4 right-4 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-all duration-200"
              >
                <FaTimes />
              </button>

              {projectData.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-all duration-200"
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-all duration-200"
                  >
                    <FaChevronRight />
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-black/50 text-white rounded-full text-sm">
                {selectedImageIndex + 1} / {projectData.images.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProjectDetailPage;
