import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaUpload,
  FaSpinner,
  FaImage,
  FaCheck,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  addCertificate,
  clearError,
  clearSuccess,
} from "../../Store/Features/certificateSlice";

const AddCertificateModal = ({ isOpen, onClose, shouldReduceMotion }) => {
  const dispatch = useDispatch();
  const { uploading, error, success } = useSelector(
    (state) => state.certificate
  );

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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});

  const categories = [
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
  ];

  // Cloudinary upload function
  const uploadToCloudinary = async (file, onProgress) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "your_upload_preset"
    ); // Ensure you have a valid upload preset
    formData.append("folder", "portfolio/certificates");
    formData.append("transformation", "c_fit,w_800,h_600,q_auto,f_auto");

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          onProgress(percentComplete);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          resolve(response.secure_url);
        } else {
          reject(new Error(`Upload failed with status: ${xhr.status}`));
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Network error during upload"));
      });

      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload`
      );
      xhr.send(formData);
    });
  };

  // Validation function
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = "Certificate name is required";
    if (!formData.organization.trim())
      errors.organization = "Organization is required";
    if (!formData.category) errors.category = "Category is required";
    if (!selectedFile) errors.image = "Certificate image is required";

    if (formData.link && !isValidUrl(formData.link)) {
      errors.link = "Please enter a valid URL";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Animation variants
  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      rotateX: -15,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 200,
        duration: 0.4,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      rotateX: 15,
      transition: {
        duration: 0.3,
      },
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  const progressVariants = {
    hidden: { scaleX: 0, opacity: 0 },
    visible: {
      scaleX: 1,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  // Handlers
  const handleInputChange = useCallback(
    (e) => {
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
    },
    [validationErrors]
  );

  const handleImageChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (file) {
        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          setValidationErrors((prev) => ({
            ...prev,
            image: "File size must be less than 10MB",
          }));
          return;
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
          setValidationErrors((prev) => ({
            ...prev,
            image: "Please select a valid image file",
          }));
          return;
        }

        setSelectedFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(file);

        // Clear image validation error
        if (validationErrors.image) {
          setValidationErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.image;
            return newErrors;
          });
        }
      }
    },
    [validationErrors.image]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setUploadProgress(0);

      // Upload image to Cloudinary
      const imageUrl = await uploadToCloudinary(
        selectedFile,
        setUploadProgress
      );

      // Prepare certificate data
      const certificateData = {
        ...formData,
        image: imageUrl,
        verified: true,
      };

      // Dispatch to Redux store
      await dispatch(addCertificate(certificateData)).unwrap();

      // Reset form on success
      handleReset();
    } catch (error) {
      console.error("Error adding certificate:", error);
    }
  };

  const handleReset = () => {
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
    dispatch(clearError());
    dispatch(clearSuccess());
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  // Success effect
  React.useEffect(() => {
    if (success && !uploading) {
      const timer = setTimeout(() => {
        handleClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, uploading]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Enhanced Backdrop */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-black/70 to-slate-900/80 backdrop-blur-md"
          onClick={!uploading ? handleClose : undefined}
        />

        {/* Modal Content */}
        <motion.div
          className="relative w-full max-w-4xl max-h-[95vh] overflow-hidden bg-white/95 dark:bg-slate-800/95 rounded-3xl shadow-2xl border border-amber-200/30 dark:border-amber-500/20 backdrop-blur-xl"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Animated Header */}
          <motion.div
            className="sticky top-0 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-700 border-b border-amber-200/30 dark:border-amber-500/20 p-6 rounded-t-3xl z-10"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center"
                  whileHover={
                    shouldReduceMotion ? {} : { scale: 1.1, rotate: 180 }
                  }
                  transition={{ duration: 0.3 }}
                >
                  <FaUpload className="text-white text-sm" />
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
                disabled={uploading}
                className="p-3 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaTimes className="text-slate-500 dark:text-slate-400" />
              </motion.button>
            </div>
          </motion.div>

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
                <span
                  className={`text-sm font-medium ${
                    success
                      ? "text-emerald-800 dark:text-emerald-200"
                      : "text-red-800 dark:text-red-200"
                  }`}
                >
                  {success || error}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Content */}
          <motion.div
            className="overflow-y-auto max-h-[calc(95vh-120px)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Image Upload Section */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                  Certificate Image *
                </label>
                <div className="relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="certificate-image"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="certificate-image"
                    className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${
                      validationErrors.image
                        ? "border-red-300 dark:border-red-500/50 bg-red-50/50 dark:bg-red-950/20"
                        : "border-amber-300 dark:border-amber-500/50 hover:border-amber-400 dark:hover:border-amber-400 bg-amber-50/50 dark:bg-amber-950/20 group-hover:bg-amber-100/50 dark:group-hover:bg-amber-900/30"
                    } ${uploading ? "pointer-events-none opacity-50" : ""}`}
                  >
                    {imagePreview ? (
                      <motion.div
                        className="relative w-full h-full overflow-hidden rounded-2xl"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <p className="text-white font-medium text-sm">
                            {selectedFile?.name}
                          </p>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        className="text-center p-6"
                        whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                      >
                        <motion.div
                          className="mx-auto w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mb-4"
                          whileHover={shouldReduceMotion ? {} : { rotate: 10 }}
                        >
                          <FaImage className="text-white text-2xl" />
                        </motion.div>
                        <p className="text-amber-600 dark:text-amber-400 font-bold mb-2">
                          Click to upload certificate image
                        </p>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                          PNG, JPG, WEBP up to 10MB
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                          Optimal size: 800x600px
                        </p>
                      </motion.div>
                    )}
                  </label>

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
              </motion.div>

              {/* Form Fields Grid */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {/* Certificate Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Certificate Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={uploading}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 bg-white dark:bg-slate-700 text-slate-800 dark:text-white ${
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
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Issuing Organization *
                  </label>
                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleInputChange}
                    disabled={uploading}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 bg-white dark:bg-slate-700 text-slate-800 dark:text-white ${
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
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    disabled={uploading}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 bg-white dark:bg-slate-700 text-slate-800 dark:text-white ${
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
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    name="issueDate"
                    value={formData.issueDate}
                    onChange={handleInputChange}
                    disabled={uploading}
                    className="w-full px-4 py-3 border border-amber-200 dark:border-amber-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 bg-white dark:bg-slate-700 text-slate-800 dark:text-white transition-all duration-300"
                  />
                </div>

                {/* Certificate Link */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Certificate Link (Optional)
                  </label>
                  <input
                    type="url"
                    name="link"
                    value={formData.link}
                    onChange={handleInputChange}
                    disabled={uploading}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 bg-white dark:bg-slate-700 text-slate-800 dark:text-white ${
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
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={uploading}
                  rows={3}
                  className="w-full px-4 py-3 border border-amber-200 dark:border-amber-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 bg-white dark:bg-slate-700 text-slate-800 dark:text-white transition-all duration-300 resize-none"
                  placeholder="Brief description of the certificate and skills covered..."
                />
              </motion.div>

              {/* Upload Progress */}
              <AnimatePresence>
                {uploading && (
                  <motion.div
                    className="space-y-3"
                    variants={progressVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <div className="flex items-center justify-between text-sm font-medium text-slate-600 dark:text-slate-400">
                      <span>Uploading certificate...</span>
                      <span>{Math.round(uploadProgress)}%</span>
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

              {/* Action Buttons */}
              <motion.div
                className="flex gap-4 pt-6 border-t border-amber-200/30 dark:border-amber-500/20"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <motion.button
                  type="button"
                  onClick={handleClose}
                  disabled={uploading}
                  className="flex-1 px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>

                <motion.button
                  type="submit"
                  disabled={uploading || success}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {uploading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : success ? (
                    <>
                      <FaCheck />
                      <span>Added!</span>
                    </>
                  ) : (
                    <>
                      <FaUpload />
                      <span>Add Certificate</span>
                    </>
                  )}
                </motion.button>
              </motion.div>
            </form>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
)};

AddCertificateModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  shouldReduceMotion: PropTypes.bool,
};

AddCertificateModal.defaultProps = {
  shouldReduceMotion: false,
};

export default AddCertificateModal;
