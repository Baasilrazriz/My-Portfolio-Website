import  { useState, useCallback, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  FaTimes,
  FaUpload,
  FaSpinner,
  FaImage,
  FaCheck,
  FaExclamationTriangle,
  FaCertificate,
  FaBuilding,
  FaCalendarAlt,
  FaLink,
  FaTag,
  FaFileAlt,
  FaCloudUploadAlt,
  FaEye,
  FaTrash,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  addCertificate,
  clearError,
  clearSuccess,
} from "../../Store/Features/certificateSlice";

const AddCertificateModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const shouldReduceMotion = useReducedMotion();
  const { uploading, error, success } = useSelector((state) => state.certificate);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    category: "",
    link: "",
    issueDate: "",
    description: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });

  const categories = useMemo(() => [
    "Web Development",
    "Cloud Computing", 
    "Data Science",
    "Cybersecurity",
    "Mobile Development",
    "DevOps",
    "AI/ML",
    "Database",
    "Design",
    "Project Management",
    "Blockchain",
    "Software Engineering",
    "Other",
  ], []);

  // Optimized notification handler
  const showNotification = useCallback((type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: "", message: "" });
    }, 3000);
  }, []);

  // Optimized Cloudinary upload function (similar to AboutSection)
  const uploadToCloudinary = useCallback(async (file) => {
    if (!file) return null;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      throw new Error("Please select a valid image file");
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error("Image size should be less than 10MB");
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
      );
      formData.append("folder", "portfolio/certificates");

      // Use XMLHttpRequest for progress tracking
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(percentComplete);
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            if (response.secure_url) {
              resolve(response.secure_url);
            } else {
              reject(new Error("No secure URL received"));
            }
          } else {
            reject(new Error(`Upload failed with status: ${xhr.status}`));
          }
        });

        xhr.addEventListener("error", () => {
          reject(new Error("Network error during upload"));
        });

        xhr.addEventListener("timeout", () => {
          reject(new Error("Upload timeout"));
        });

        xhr.timeout = 30000; // 30 second timeout

        xhr.open(
          "POST",
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`
        );
        
        xhr.send(formData);
      });
    } finally {
      setIsUploading(false);
    }
  }, []);

  // Optimized validation function
  const validateForm = useCallback(() => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Certificate name is required";
    }
    if (!formData.organization.trim()) {
      errors.organization = "Organization is required";
    }
    if (!formData.category) {
      errors.category = "Category is required";
    }
    if (!selectedFile) {
      errors.image = "Certificate image is required";
    }

    // URL validation
    if (formData.link && !isValidUrl(formData.link)) {
      errors.link = "Please enter a valid URL";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData, selectedFile]);

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Optimized input change handler
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [validationErrors]);

  // Optimized image change handler
  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Clear previous errors
    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.image;
      return newErrors;
    });

    // Validate file
    if (!file.type.startsWith("image/")) {
      setValidationErrors((prev) => ({
        ...prev,
        image: "Please select a valid image file",
      }));
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setValidationErrors((prev) => ({
        ...prev,
        image: "File size must be less than 10MB",
      }));
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  }, []);

  // Optimized form submission handler
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showNotification("error", "Please fix the errors before submitting");
      return;
    }

    try {
      // Upload image first
      const imageUrl = await uploadToCloudinary(selectedFile);
      
      if (!imageUrl) {
        throw new Error("Failed to upload image");
      }

      // Prepare certificate data for Firebase
      const certificateData = {
        name: formData.name.trim(),
        organization: formData.organization.trim(),
        category: formData.category,
        link: formData.link.trim() || null,
        issueDate: formData.issueDate || null,
        description: formData.description.trim() || null,
        image: imageUrl,
        verified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Dispatch to Redux store (which handles Firebase)
      await dispatch(addCertificate(certificateData)).unwrap();
      
      showNotification("success", "Certificate added successfully!");
      
      // Reset form after short delay
      setTimeout(() => {
        handleReset();
        onClose();
      }, 1500);

    } catch (error) {
      console.error("Error adding certificate:", error);
      showNotification("error", error.message || "Failed to add certificate");
    }
  }, [formData, selectedFile, validateForm, uploadToCloudinary, dispatch, showNotification, onClose]);

  // Reset form function
  const handleReset = useCallback(() => {
    setFormData({
      name: "",
      organization: "",
      category: "",
      link: "",
      issueDate: "",
      description: "",
    });
    setSelectedFile(null);
    setImagePreview(null);
    setUploadProgress(0);
    setValidationErrors({});
    setIsUploading(false);
    dispatch(clearError());
    dispatch(clearSuccess());
  }, [dispatch]);

  // Handle modal close
  const handleClose = useCallback(() => {
    if (isUploading || uploading) {
      showNotification("warning", "Please wait for upload to complete");
      return;
    }
    handleReset();
    onClose();
  }, [isUploading, uploading, handleReset, onClose, showNotification]);

  // Remove selected image
  const removeSelectedImage = useCallback(() => {
    setSelectedFile(null);
    setImagePreview(null);
    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.image;
      return newErrors;
    });
  }, []);

  // Auto-close on success
  useEffect(() => {
    if (success && !uploading && !isUploading) {
      const timer = setTimeout(() => {
        handleClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, uploading, isUploading, handleClose]);

  // Optimized animation variants
  const modalVariants = useMemo(() => ({
    hidden: {
      opacity: 0,
      scale: 0.96,
      y: 10,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.1 : 0.2,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.96,
      y: 10,
      transition: {
        duration: shouldReduceMotion ? 0.05 : 0.15,
        ease: "easeIn",
      },
    },
  }), [shouldReduceMotion]);

  const backdropVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: shouldReduceMotion ? 0.05 : 0.1 },
    },
    exit: {
      opacity: 0,
      transition: { duration: shouldReduceMotion ? 0.05 : 0.1 },
    },
  }), [shouldReduceMotion]);

  if (!isOpen) return null;

  return (
    <>
      {/* Optimized Notification */}
      <AnimatePresence mode="wait">
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="fixed top-4 right-4 z-[60] max-w-md"
          >
            <div className={`p-4 rounded-xl shadow-lg backdrop-blur-sm border ${
              notification.type === "success"
                ? "bg-green-500/90 border-green-400"
                : notification.type === "error"
                ? "bg-red-500/90 border-red-400"
                : "bg-amber-500/90 border-amber-400"
            }`}>
              <div className="flex items-center gap-3">
                {notification.type === "success" ? (
                  <FaCheck className="text-white text-xl" />
                ) : notification.type === "error" ? (
                  <FaExclamationTriangle className="text-white text-xl" />
                ) : (
                  <FaExclamationTriangle className="text-white text-xl" />
                )}
                <p className="text-white font-medium">{notification.message}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={!isUploading && !uploading ? handleClose : undefined}
          />

          {/* Modal Content */}
          <motion.div
            className="relative w-full max-w-4xl max-h-[95vh] overflow-hidden bg-white/95 dark:bg-slate-800/95 rounded-3xl shadow-2xl border border-amber-200/30 dark:border-amber-500/20 backdrop-blur-xl"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-700 border-b border-amber-200/30 dark:border-amber-500/20 p-6 rounded-t-3xl z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center"
                    whileHover={shouldReduceMotion ? {} : { scale: 1.1, rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FaCertificate className="text-white text-sm" />
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                      Add New Certificate
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Upload and showcase your professional achievements
                    </p>
                  </div>
                </div>

                <motion.button
                  onClick={handleClose}
                  disabled={isUploading || uploading}
                  className="p-3 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaTimes className="text-slate-500 dark:text-slate-400" />
                </motion.button>
              </div>
            </div>

            {/* Success/Error Messages */}
            <AnimatePresence>
              {(success || error) && (
                <motion.div
                  className={`mx-6 mt-4 p-4 rounded-xl flex items-center gap-3 ${
                    success
                      ? "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-500/30"
                      : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30"
                  }`}
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                >
                  {success ? (
                    <FaCheck className="text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <FaExclamationTriangle className="text-red-600 dark:text-red-400" />
                  )}
                  <span className={`text-sm font-medium ${
                    success
                      ? "text-emerald-800 dark:text-emerald-200"
                      : "text-red-800 dark:text-red-200"
                  }`}>
                    {success || error}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form Content */}
            <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                
                {/* Image Upload Section */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                    <FaImage className="text-amber-500" />
                    Certificate Image *
                  </label>
                  
                  <div className="relative group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="certificate-image"
                      disabled={isUploading || uploading}
                    />
                    
                    {imagePreview ? (
                      <div className="relative aspect-video bg-slate-100 dark:bg-slate-700 rounded-2xl overflow-hidden border-2 border-amber-200 dark:border-amber-500/30">
                        <img
                          src={imagePreview}
                          alt="Certificate preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        
                        {/* Image Controls */}
                        <div className="absolute top-3 right-3 flex gap-2">
                          <button
                            type="button"
                            onClick={() => window.open(imagePreview, '_blank')}
                            className="w-8 h-8 bg-blue-500/80 hover:bg-blue-500 text-white rounded-lg flex items-center justify-center transition-colors"
                          >
                            <FaEye className="text-xs" />
                          </button>
                          <button
                            type="button"
                            onClick={removeSelectedImage}
                            disabled={isUploading || uploading}
                            className="w-8 h-8 bg-red-500/80 hover:bg-red-500 text-white rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
                          >
                            <FaTrash className="text-xs" />
                          </button>
                        </div>
                        
                        {/* File Info */}
                        <div className="absolute bottom-3 left-3 right-3">
                          <p className="text-white font-medium text-sm truncate">
                            {selectedFile?.name}
                          </p>
                          <p className="text-white/70 text-xs">
                            {selectedFile && (selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    ) : (
                      <label
                        htmlFor="certificate-image"
                        className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 ${
                          validationErrors.image
                            ? "border-red-300 dark:border-red-500/50 bg-red-50/50 dark:bg-red-950/20"
                            : "border-amber-300 dark:border-amber-500/50 hover:border-amber-400 dark:hover:border-amber-400 bg-amber-50/50 dark:bg-amber-950/20 group-hover:bg-amber-100/50 dark:group-hover:bg-amber-900/30"
                        } ${isUploading || uploading ? "pointer-events-none opacity-50" : ""}`}
                      >
                        <motion.div
                          className="text-center p-6"
                          whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                        >
                          <motion.div
                            className="mx-auto w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mb-4"
                            whileHover={shouldReduceMotion ? {} : { rotate: 10 }}
                          >
                            <FaCloudUploadAlt className="text-white text-2xl" />
                          </motion.div>
                          <p className="text-amber-600 dark:text-amber-400 font-bold mb-2">
                            Click to upload certificate image
                          </p>
                          <p className="text-slate-500 dark:text-slate-400 text-sm">
                            PNG, JPG, WEBP up to 10MB
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                            Recommended: 800x600px
                          </p>
                        </motion.div>
                      </label>
                    )}

                    {validationErrors.image && (
                      <motion.p
                        className="text-red-600 dark:text-red-400 text-sm mt-2 flex items-center gap-2"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <FaExclamationTriangle className="text-xs" />
                        {validationErrors.image}
                      </motion.p>
                    )}
                  </div>
                </div>

                {/* Upload Progress */}
                <AnimatePresence>
                  {(isUploading || uploading) && (
                    <motion.div
                      className="space-y-3"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center justify-between text-sm font-medium text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-2">
                          <FaSpinner className="animate-spin" />
                          Uploading certificate...
                        </span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Certificate Name */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                      <FaCertificate className="text-amber-500" />
                      Certificate Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={isUploading || uploading}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 bg-white dark:bg-slate-700 text-slate-800 dark:text-white ${
                        validationErrors.name
                          ? "border-red-300 dark:border-red-500/30 focus:ring-red-400/50 focus:border-red-400"
                          : "border-amber-200 dark:border-amber-500/30 focus:ring-amber-400/50 focus:border-amber-400"
                      }`}
                      placeholder="e.g., AWS Solutions Architect Associate"
                    />
                    {validationErrors.name && (
                      <motion.p
                        className="text-red-600 dark:text-red-400 text-sm mt-1 flex items-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <FaExclamationTriangle className="text-xs" />
                        {validationErrors.name}
                      </motion.p>
                    )}
                  </div>

                  {/* Organization */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                      <FaBuilding className="text-amber-500" />
                      Issuing Organization *
                    </label>
                    <input
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={handleInputChange}
                      disabled={isUploading || uploading}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 bg-white dark:bg-slate-700 text-slate-800 dark:text-white ${
                        validationErrors.organization
                          ? "border-red-300 dark:border-red-500/30 focus:ring-red-400/50 focus:border-red-400"
                          : "border-amber-200 dark:border-amber-500/30 focus:ring-amber-400/50 focus:border-amber-400"
                      }`}
                      placeholder="e.g., Amazon Web Services"
                    />
                    {validationErrors.organization && (
                      <motion.p
                        className="text-red-600 dark:text-red-400 text-sm mt-1 flex items-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <FaExclamationTriangle className="text-xs" />
                        {validationErrors.organization}
                      </motion.p>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                      <FaTag className="text-amber-500" />
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      disabled={isUploading || uploading}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 bg-white dark:bg-slate-700 text-slate-800 dark:text-white ${
                        validationErrors.category
                          ? "border-red-300 dark:border-red-500/30 focus:ring-red-400/50 focus:border-red-400"
                          : "border-amber-200 dark:border-amber-500/30 focus:ring-amber-400/50 focus:border-amber-400"
                      }`}
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {validationErrors.category && (
                      <motion.p
                        className="text-red-600 dark:text-red-400 text-sm mt-1 flex items-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <FaExclamationTriangle className="text-xs" />
                        {validationErrors.category}
                      </motion.p>
                    )}
                  </div>

                  {/* Issue Date */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                      <FaCalendarAlt className="text-amber-500" />
                      Issue Date
                    </label>
                    <input
                      type="date"
                      name="issueDate"
                      value={formData.issueDate}
                      onChange={handleInputChange}
                      disabled={isUploading || uploading}
                      className="w-full px-4 py-3 border border-amber-200 dark:border-amber-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 bg-white dark:bg-slate-700 text-slate-800 dark:text-white transition-all duration-200"
                    />
                  </div>

                  {/* Certificate Link */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                      <FaLink className="text-amber-500" />
                      Certificate Link (Optional)
                    </label>
                    <input
                      type="url"
                      name="link"
                      value={formData.link}
                      onChange={handleInputChange}
                      disabled={isUploading || uploading}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 bg-white dark:bg-slate-700 text-slate-800 dark:text-white ${
                        validationErrors.link
                          ? "border-red-300 dark:border-red-500/30 focus:ring-red-400/50 focus:border-red-400"
                          : "border-amber-200 dark:border-amber-500/30 focus:ring-amber-400/50 focus:border-amber-400"
                      }`}
                      placeholder="https://www.credly.com/badges/..."
                    />
                    {validationErrors.link && (
                      <motion.p
                        className="text-red-600 dark:text-red-400 text-sm mt-1 flex items-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <FaExclamationTriangle className="text-xs" />
                        {validationErrors.link}
                      </motion.p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                    <FaFileAlt className="text-amber-500" />
                    Description (Optional)
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    disabled={isUploading || uploading}
                    rows={3}
                    className="w-full px-4 py-3 border border-amber-200 dark:border-amber-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 bg-white dark:bg-slate-700 text-slate-800 dark:text-white transition-all duration-200 resize-none"
                    placeholder="Brief description of the certificate and skills covered..."
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t border-amber-200/30 dark:border-amber-500/20">
                  <motion.button
                    type="button"
                    onClick={handleClose}
                    disabled={isUploading || uploading}
                    className="flex-1 px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>

                  <motion.button
                    type="submit"
                    disabled={isUploading || uploading || success}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isUploading || uploading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        <span>Adding Certificate...</span>
                      </>
                    ) : success ? (
                      <>
                        <FaCheck />
                        <span>Added Successfully!</span>
                      </>
                    ) : (
                      <>
                        <FaUpload />
                        <span>Add Certificate</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

AddCertificateModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddCertificateModal;