import PropTypes from 'prop-types';
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  FaTimes,
  FaImage,
  FaTrash,
  FaPlus,
  FaCode,
  FaExternalLinkAlt,
  FaGithub,
  FaPlay,
  FaCalendarAlt,
  FaFileAlt,
  FaTag,
  FaStar,
  FaSpinner,
  FaCheck,
  FaExclamationTriangle,
  FaCloudUploadAlt,
  FaEye,
} from "react-icons/fa";
import {
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiMongodb,
  SiFirebase,
  SiTailwindcss,
  SiTypescript,
  SiJavascript,
  SiPython,
} from "react-icons/si";
import {
  closeProjectModal,
  addProject,
  updateProject,
} from "../Store/Features/projectSlice";
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { TbBrandReactNative } from 'react-icons/tb';

// Cloudinary upload function
const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "your_upload_preset"
  );
  formData.append(
    "cloud_name",
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "your_cloud_name"
  );

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "your_cloud_name"
      }/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};

// Pre-defined tech stack options with icons
const TECH_STACK_OPTIONS = [
  { name: "React", icon: SiReact, color: "text-cyan-500" },
  { name: "Next.js", icon: SiNextdotjs, color: "text-black dark:text-white" },
  { name: "Node.js", icon: SiNodedotjs, color: "text-green-500" },
  { name: "MongoDB", icon: SiMongodb, color: "text-green-600" },
  { name: "Firebase", icon: SiFirebase, color: "text-yellow-500" },
  { name: "Tailwind CSS", icon: SiTailwindcss, color: "text-cyan-400" },
  { name: "TypeScript", icon: SiTypescript, color: "text-blue-600" },
  { name: "JavaScript", icon: SiJavascript, color: "text-yellow-500" },
  { name: "Python", icon: SiPython, color: "text-blue-500" },
  { name: "React Native", icon: TbBrandReactNative, color: "text-cyan-500" },
];

const PROJECT_CATEGORIES = [
  "Web Development",
  "Mobile App",
  "Desktop App",
  "Full Stack",
  "Frontend",
  "Backend",
  "API",
  "Machine Learning",
  "DevOps",
];

// Memoized form field component
const FormField = memo(({ label, icon, error, children, required = false }) => (
  <motion.div
    className="space-y-2"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2 }}
  >
    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
      {icon && <span className="text-blue-500">{icon}</span>}
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && (
      <motion.p
        className="text-red-500 text-xs flex items-center gap-1"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
      >
        <FaExclamationTriangle className="text-xs" />
        {error}
      </motion.p>
    )}
  </motion.div>
));
FormField.displayName = "FormField";

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.element,
  error: PropTypes.string,
  children: PropTypes.node.isRequired,
  required: PropTypes.bool,
};
FormField.displayName = "FormField";

const ProjectModal = memo(({ showNotification, shouldReduceMotion }) => {
  const dispatch = useDispatch();
  const { editingProject, loading } = useSelector((state) => state.projects);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    overview: "",
    description: "",
    category: "",
    tech: [],
    live_link: "",
    git_link: "",
    videoDemo: "",
    featured: false,
    startDate: "",
    endDate: "",
    purpose: "",
  });

  const [images, setImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [customTech, setCustomTech] = useState("");
  const [showTechDropdown, setShowTechDropdown] = useState(false);

  // Initialize form data when editing
  useEffect(() => {
    if (editingProject) {
      setFormData({
        title: editingProject.title || "",
        overview: editingProject.overview || "",
        description: editingProject.description || "",
        category: editingProject.category || "",
        tech: editingProject.tech || [],
        live_link: editingProject.live_link || "",
        git_link: editingProject.git_link || "",
        videoDemo: editingProject.videoDemo || "",
        featured: editingProject.featured || false,
        startDate: editingProject.startDate
          ? editingProject.startDate.toDate
            ? editingProject.startDate.toDate().toISOString().split("T")[0]
            : new Date(editingProject.startDate).toISOString().split("T")[0]
          : "",
        endDate: editingProject.endDate
          ? editingProject.endDate.toDate
            ? editingProject.endDate.toDate().toISOString().split("T")[0]
            : new Date(editingProject.endDate).toISOString().split("T")[0]
          : "",
        purpose: editingProject.purpose || "",
      });
      setImages(editingProject.images || []);
    }
  }, [editingProject]);

  // Handle form input changes
  const handleInputChange = useCallback(
    (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    },
    [errors]
  );

  // Handle image upload
  const handleImageUpload = useCallback(
    async (files) => {
      if (images.length + files.length > 5) {
        showNotification("error", "Maximum 5 images allowed");
        return;
      }

      setUploadingImages(Array.from(files));

      try {
        const uploadPromises = Array.from(files).map((file) =>
          uploadToCloudinary(file)
        );
        const uploadedUrls = await Promise.all(uploadPromises);

        setImages((prev) => [...prev, ...uploadedUrls]);
        setUploadingImages([]);
        showNotification(
          "success",
          `${uploadedUrls.length} image(s) uploaded successfully`
        );
      } catch (error) {
        console.error("Upload error:", error);
        setUploadingImages([]);
        showNotification("error", "Failed to upload images");
      }
    },
    [images.length, showNotification]
  );

  // Remove image
  const removeImage = useCallback((index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Add tech stack item
  const addTechItem = useCallback(
    (tech) => {
      if (!formData.tech.includes(tech)) {
        setFormData((prev) => ({
          ...prev,
          tech: [...prev.tech, tech],
        }));
      }
      setShowTechDropdown(false);
    },
    [formData.tech]
  );

  // Add custom tech
  const addCustomTech = useCallback(() => {
    if (customTech.trim() && !formData.tech.includes(customTech.trim())) {
      setFormData((prev) => ({
        ...prev,
        tech: [...prev.tech, customTech.trim()],
      }));
      setCustomTech("");
    }
  }, [customTech, formData.tech]);

  // Remove tech item
  const removeTechItem = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      tech: prev.tech.filter((_, i) => i !== index),
    }));
  }, []);

  // Form validation
  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.overview.trim()) newErrors.overview = "Overview is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (formData.tech.length === 0)
      newErrors.tech = "At least one technology is required";
    if (images.length === 0)
      newErrors.images = "At least one image is required";

    // URL validation
    const urlPattern = /^https?:\/\/.+/;
    if (formData.live_link && !urlPattern.test(formData.live_link)) {
      newErrors.live_link = "Please enter a valid URL";
    }
    if (formData.git_link && !urlPattern.test(formData.git_link)) {
      newErrors.git_link = "Please enter a valid URL";
    }
    if (formData.videoDemo && !urlPattern.test(formData.videoDemo)) {
      newErrors.videoDemo = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, images.length]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validateForm()) {
        showNotification("error", "Please fix the errors before submitting");
        return;
      }

      const projectData = {
        ...formData,
        images,
        startDate: formData.startDate ? new Date(formData.startDate) : null,
        endDate: formData.endDate ? new Date(formData.endDate) : null,
      };

      try {
        if (editingProject) {
          await dispatch(
            updateProject({
              id: editingProject.id,
              projectData,
            })
          ).unwrap();
          showNotification("success", "Project updated successfully!");
        } else {
          await dispatch(addProject(projectData)).unwrap();
          showNotification("success", "Project added successfully!");
        }
        handleClose();
      } catch (error) {
        console.error("Submit error:", error);
        showNotification(
          "error",
          `Failed to ${editingProject ? "update" : "add"} project`
        );
      }
    },
    [validateForm, formData, images, editingProject, dispatch, showNotification]
  );

  // Handle modal close
  const handleClose = useCallback(() => {
    dispatch(closeProjectModal());
    // Reset form state
    setFormData({
      title: "",
      overview: "",
      description: "",
      category: "",
      tech: [],
      live_link: "",
      git_link: "",
      videoDemo: "",
      featured: false,
      startDate: "",
      endDate: "",
      purpose: "",
    });
    setImages([]);
    setErrors({});
    setCustomTech("");
    setUploadingImages([]);
    document.body.style.overflow = "auto";
  }, [dispatch]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Animation variants
  const modalVariants = useMemo(
    () => ({
      hidden: {
        opacity: 0,
        scale: 0.95,
        y: 20,
      },
      visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
          type: "spring",
          damping: 25,
          stiffness: 300,
          duration: 0.3,
        },
      },
      exit: {
        opacity: 0,
        scale: 0.95,
        y: 20,
        transition: {
          duration: 0.2,
        },
      },
    }),
    []
  );

  const overlayVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { duration: 0.2 },
      },
      exit: {
        opacity: 0,
        transition: { duration: 0.2 },
      },
    }),
    []
  );

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-6xl max-h-[90vh] bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <FaCode className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                    {editingProject ? "Edit Project" : "Add New Project"}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {editingProject
                      ? "Update project details"
                      : "Create a new project showcase"}
                  </p>
                </div>
              </div>

              <motion.button
                onClick={handleClose}
                className="w-10 h-10 bg-slate-100 dark:bg-slate-700 hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-xl flex items-center justify-center transition-colors duration-200"
                whileHover={
                  shouldReduceMotion ? {} : { scale: 1.05, rotate: 90 }
                }
                whileTap={{ scale: 0.95 }}
              >
                <FaTimes className="text-lg" />
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <form
            onSubmit={handleSubmit}
            className="overflow-y-auto max-h-[calc(90vh-100px)]"
          >
            <div className="p-6 space-y-8">
              {/* Basic Information */}
              <motion.div
                className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                  <FaFileAlt className="text-blue-500" />
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <FormField
                    label="Project Title"
                    icon={<FaTag />}
                    error={errors.title}
                    required
                  >
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      placeholder="Enter project title..."
                      className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 transition-all duration-200"
                    />
                  </FormField>

                  <FormField
                    label="Category"
                    icon={<FaTag />}
                    error={errors.category}
                    required
                  >
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        handleInputChange("category", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-white transition-all duration-200"
                    >
                      <option value="">Select category...</option>
                      {PROJECT_CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </FormField>
                </div>

                <FormField
                  label="Project Overview"
                  icon={<FaFileAlt />}
                  error={errors.overview}
                  required
                >
                  <textarea
                    value={formData.overview}
                    onChange={(e) =>
                      handleInputChange("overview", e.target.value)
                    }
                    placeholder="Brief description of the project (shown on project card)..."
                    rows={3}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 resize-vertical transition-all duration-200"
                  />
                </FormField>

                <FormField label="Detailed Description" icon={<FaFileAlt />}>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Detailed project description including features, challenges, and solutions..."
                    rows={6}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 resize-vertical transition-all duration-200"
                  />
                </FormField>

                <FormField label="Purpose & Goals" icon={<FaStar />}>
                  <textarea
                    value={formData.purpose}
                    onChange={(e) =>
                      handleInputChange("purpose", e.target.value)
                    }
                    placeholder="Why was this project built? What problems does it solve?"
                    rows={3}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 resize-vertical transition-all duration-200"
                  />
                </FormField>
              </motion.div>

              {/* Tech Stack */}
              <motion.div
                className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                  <FaCode className="text-purple-500" />
                  Technology Stack
                </h3>

                {/* Selected Tech Stack */}
                {formData.tech.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Selected Technologies:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {formData.tech.map((tech, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {tech}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeTechItem(index)}
                            className="text-red-500 hover:text-red-700 transition-colors duration-200"
                          >
                            <FaTimes className="text-xs" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tech Stack Selection */}
                <div className="space-y-4">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowTechDropdown(!showTechDropdown)}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-left text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200"
                    >
                      Select from popular technologies...
                    </button>

                    <AnimatePresence>
                      {showTechDropdown && (
                        <motion.div
                          className="absolute top-full mt-2 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          {TECH_STACK_OPTIONS.map((tech, index) => (
                            <motion.button
                              key={tech.name}
                              type="button"
                              onClick={() => addTechItem(tech.name)}
                              disabled={formData.tech.includes(tech.name)}
                              className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200 ${
                                formData.tech.includes(tech.name)
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.02 }}
                            >
                              <tech.icon className={`text-xl ${tech.color}`} />
                              <span className="text-slate-700 dark:text-slate-300">
                                {tech.name}
                              </span>
                              {formData.tech.includes(tech.name) && (
                                <FaCheck className="text-green-500 ml-auto" />
                              )}
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Custom Tech Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customTech}
                      onChange={(e) => setCustomTech(e.target.value)}
                      placeholder="Add custom technology..."
                      className="flex-1 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 transition-all duration-200"
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), addCustomTech())
                      }
                    />
                    <motion.button
                      type="button"
                      onClick={addCustomTech}
                      disabled={!customTech.trim()}
                      className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-xl transition-colors duration-200 flex items-center gap-2"
                      whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaPlus className="text-sm" />
                      Add
                    </motion.button>
                  </div>
                </div>

                {errors.tech && (
                  <motion.p
                    className="text-red-500 text-xs flex items-center gap-1 mt-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <FaExclamationTriangle className="text-xs" />
                    {errors.tech}
                  </motion.p>
                )}
              </motion.div>

              {/* Project Images */}
              <motion.div
                className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                  <FaImage className="text-green-500" />
                  Project Images (Max 5)
                </h3>

                {/* Image Upload Area */}
                <div className="mb-6">
                  <label className="block w-full">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files)}
                      className="hidden"
                      disabled={
                        images.length >= 5 || uploadingImages.length > 0
                      }
                    />
                    <div
                      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
                        images.length >= 5 || uploadingImages.length > 0
                          ? "border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 cursor-not-allowed"
                          : "border-blue-300 dark:border-blue-600 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                      }`}
                    >
                      <FaCloudUploadAlt className="text-4xl text-blue-500 mx-auto mb-4" />
                      <p className="text-slate-700 dark:text-slate-300 font-medium">
                        {uploadingImages.length > 0
                          ? "Uploading images..."
                          : images.length >= 5
                          ? "Maximum images reached"
                          : "Click to upload images or drag and drop"}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                        PNG, JPG, GIF up to 10MB ({images.length}/5)
                      </p>
                    </div>
                  </label>
                </div>

                {/* Uploading Images */}
                {uploadingImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                    {uploadingImages.map((file, index) => (
                      <div
                        key={index}
                        className="relative aspect-video bg-slate-200 dark:bg-slate-700 rounded-xl overflow-hidden"
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt="Uploading"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <FaSpinner className="text-white text-2xl animate-spin" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Uploaded Images */}
                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <motion.div
                        key={index}
                        className="group relative aspect-video bg-slate-200 dark:bg-slate-700 rounded-xl overflow-hidden"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <img
                          src={image}
                          alt={`Project ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />

                        {/* Image Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300">
                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button
                              type="button"
                              onClick={() => window.open(image, "_blank")}
                              className="w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center transition-colors duration-200"
                            >
                              <FaEye className="text-xs" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center transition-colors duration-200"
                            >
                              <FaTrash className="text-xs" />
                            </button>
                          </div>
                        </div>

                        {/* Primary Image Badge */}
                        {index === 0 && (
                          <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-lg font-medium">
                            Primary
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}

                {errors.images && (
                  <motion.p
                    className="text-red-500 text-xs flex items-center gap-1 mt-4"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <FaExclamationTriangle className="text-xs" />
                    {errors.images}
                  </motion.p>
                )}
              </motion.div>

              {/* Links and Dates */}
              <motion.div
                className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                  <FaExternalLinkAlt className="text-orange-500" />
                  Links & Timeline
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <FormField
                    label="Live Demo Link"
                    icon={<FaExternalLinkAlt />}
                    error={errors.live_link}
                  >
                    <input
                      type="url"
                      value={formData.live_link}
                      onChange={(e) =>
                        handleInputChange("live_link", e.target.value)
                      }
                      placeholder="https://your-project.com"
                      className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 transition-all duration-200"
                    />
                  </FormField>

                  <FormField
                    label="GitHub Repository"
                    icon={<FaGithub />}
                    error={errors.git_link}
                  >
                    <input
                      type="url"
                      value={formData.git_link}
                      onChange={(e) =>
                        handleInputChange("git_link", e.target.value)
                      }
                      placeholder="https://github.com/username/repo"
                      className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 transition-all duration-200"
                    />
                  </FormField>

                  <FormField
                    label="Video Demo (Google Drive Link)"
                    icon={<FaPlay />}
                    error={errors.videoDemo}
                  >
                    <input
                      type="url"
                      value={formData.videoDemo}
                      onChange={(e) =>
                        handleInputChange("videoDemo", e.target.value)
                      }
                      placeholder="https://drive.google.com/..."
                      className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 transition-all duration-200"
                    />
                  </FormField>

                  <div className="space-y-4">
                    <FormField label="Start Date" icon={<FaCalendarAlt />}>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) =>
                          handleInputChange("startDate", e.target.value)
                        }
                        className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-white transition-all duration-200"
                      />
                    </FormField>

                    <FormField label="End Date" icon={<FaCalendarAlt />}>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) =>
                          handleInputChange("endDate", e.target.value)
                        }
                        className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-white transition-all duration-200"
                      />
                    </FormField>
                  </div>
                </div>

                {/* Featured Toggle */}
                <motion.div
                  className="mt-6 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-600"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) =>
                        handleInputChange("featured", e.target.checked)
                      }
                      className="sr-only"
                    />
                    <div
                      className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                        formData.featured
                          ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                          : "bg-slate-300 dark:bg-slate-600"
                      }`}
                    >
                      <div
                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                          formData.featured ? "translate-x-6" : "translate-x-0"
                        }`}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <FaStar
                        className={`text-lg ${
                          formData.featured
                            ? "text-yellow-500"
                            : "text-slate-400"
                        }`}
                      />
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Featured Project
                      </span>
                    </div>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      This project will be highlighted in your portfolio
                    </span>
                  </label>
                </motion.div>
              </motion.div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {editingProject
                    ? "Update your project details"
                    : "All fields marked with * are required"}
                </div>

                <div className="flex items-center gap-3">
                  <motion.button
                    type="button"
                    onClick={handleClose}
                    className="px-6 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-xl transition-colors duration-200"
                    whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>

                  <motion.button
                    type="submit"
                    disabled={loading || uploadingImages.length > 0}
                    className="relative px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-slate-400 disabled:to-slate-500 text-white font-bold rounded-xl transition-all duration-200 flex items-center gap-2"
                    whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading || uploadingImages.length > 0 ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        {uploadingImages.length > 0
                          ? "Uploading..."
                          : "Saving..."}
                      </>
                    ) : (
                      <>
                        <FaCheck />
                        {editingProject ? "Update Project" : "Create Project"}
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});

ProjectModal.displayName = "ProjectModal";

ProjectModal.propTypes = {
  showNotification: PropTypes.func.isRequired,
  shouldReduceMotion: PropTypes.bool,
};

export default ProjectModal;
