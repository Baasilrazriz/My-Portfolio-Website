import { useState, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import PropTypes from 'prop-types';
import { 
  FaCloudUploadAlt,
  FaTimes,
  FaPlay,
  FaPause,
  FaStop
} from 'react-icons/fa';
import { addCertificate } from '../../Store/Features/certificateSlice';
import { certificates } from '../../assets/data/certificates.js';

const BulkUploadModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const shouldReduceMotion = useReducedMotion();

  // Upload state
  const [uploadState, setUploadState] = useState({
    isRunning: false,
    isPaused: false,
    currentIndex: 0,
    processed: 0,
    successful: 0,
    failed: 0,
    errors: [],
    startTime: null,
    endTime: null
  });

  const [uploadProgress, setUploadProgress] = useState({
    overall: 0,
    current: 0,
    currentCert: null
  });

  const [logs, setLogs] = useState([]);

  // Add log entry
  const addLog = useCallback((message, type = 'info', certificateName = null) => {
    const timestamp = new Date().toLocaleTimeString();
    const newLog = {
      id: Date.now(),
      timestamp,
      message,
      type,
      certificateName
    };
    setLogs(prev => [...prev, newLog]);
  }, []);

  // Cloudinary upload function (same as AddCertificateModal)
  const uploadToCloudinary = useCallback(async (base64Image, fileName) => {
    if (!base64Image) return null;

    try {
      const formData = new FormData();
      
      // Convert base64 to blob if needed
      let fileToUpload;
      if (base64Image.startsWith('data:')) {
        // It's already a data URL
        fileToUpload = base64Image;
      } else {
        // Create data URL
        fileToUpload = `data:image/png;base64,${base64Image}`;
      }

      formData.append('file', fileToUpload);
      formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', 'certificates');
      formData.append('public_id', fileName);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Cloudinary upload failed: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error(`Image upload failed: ${error.message}`);
    }
  }, []);

  // Process single certificate
  const processCertificate = useCallback(async (certificate) => {
    const startTime = Date.now();
    
    try {
      addLog(`Processing "${certificate.name}"...`, 'info', certificate.name);
      setUploadProgress(prev => ({
        ...prev,
        current: 0,
        currentCert: certificate.name
      }));

      // Upload image to Cloudinary
      addLog(`Uploading image to Cloudinary...`, 'info', certificate.name);
      setUploadProgress(prev => ({ ...prev, current: 30 }));
      
      const fileName = certificate.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      const imageUrl = await uploadToCloudinary(certificate.image, fileName);
      
      setUploadProgress(prev => ({ ...prev, current: 60 }));
      addLog(`Image uploaded successfully`, 'success', certificate.name);

      // Prepare certificate data
      const certificateData = {
        name: certificate.name.trim(),
        organization: certificate.organization.trim(),
        category: 'Other', // Default category since it's not in the data
        link: certificate.link || '',
        issueDate: certificate.date || '',
        description: `Certificate in ${certificate.name} from ${certificate.organization}`,
        image: imageUrl,
        imageUrl: imageUrl
      };

      // Upload to Firebase using Redux action
      addLog(`Saving to Firebase...`, 'info', certificate.name);
      setUploadProgress(prev => ({ ...prev, current: 90 }));
      
      const result = await dispatch(addCertificate(certificateData));
      
      if (addCertificate.fulfilled.match(result)) {
        const processingTime = Date.now() - startTime;
        setUploadProgress(prev => ({ ...prev, current: 100 }));
        addLog(`✅ Successfully processed (${processingTime}ms)`, 'success', certificate.name);
        
        return {
          success: true,
          certificate: certificate.name,
          processingTime,
          error: null
        };
      } else {
        throw new Error(result.payload || 'Firebase upload failed');
      }
      
    } catch (error) {
      const processingTime = Date.now() - startTime;
      addLog(`❌ Failed: ${error.message} (${processingTime}ms)`, 'error', certificate.name);
      
      return {
        success: false,
        certificate: certificate.name,
        processingTime,
        error: error.message
      };
    }
  }, [dispatch, uploadToCloudinary, addLog]);

  // Start bulk upload
  const startUpload = useCallback(async () => {
    if (!certificates || certificates.length === 0) {
      addLog('No certificates found to upload', 'error');
      return;
    }

    setUploadState(prev => ({
      ...prev,
      isRunning: true,
      isPaused: false,
      currentIndex: 0,
      processed: 0,
      successful: 0,
      failed: 0,
      errors: [],
      startTime: Date.now(),
      endTime: null
    }));

    setLogs([]);
    addLog(`🚀 Starting bulk upload of ${certificates.length} certificates`, 'info');

    try {
      for (let i = 0; i < certificates.length; i++) {
        // Check if paused
        while (uploadState.isPaused && uploadState.isRunning) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Check if stopped
        if (!uploadState.isRunning) {
          break;
        }

        const certificate = certificates[i];
        
        setUploadState(prev => ({
          ...prev,
          currentIndex: i,
          processed: i
        }));

        setUploadProgress(prev => ({
          ...prev,
          overall: Math.round((i / certificates.length) * 100),
          current: 0,
          currentCert: certificate.name
        }));

        const result = await processCertificate(certificate, i);
        
        setUploadState(prev => ({
          ...prev,
          processed: i + 1,
          successful: prev.successful + (result.success ? 1 : 0),
          failed: prev.failed + (result.success ? 0 : 1),
          errors: result.success ? prev.errors : [...prev.errors, result]
        }));

        // Small delay between uploads
        if (i < certificates.length - 1) {
          addLog('Waiting 1 second before next upload...', 'info');
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      const endTime = Date.now();
      const totalTime = endTime - uploadState.startTime;
      
      setUploadState(prev => ({
        ...prev,
        isRunning: false,
        endTime
      }));

      setUploadProgress(prev => ({
        ...prev,
        overall: 100,
        current: 100,
        currentCert: null
      }));

      // Final summary
      addLog(`\n📊 UPLOAD COMPLETE`, 'success');
      addLog(`Total: ${certificates.length} | Success: ${uploadState.successful} | Failed: ${uploadState.failed}`, 'info');
      addLog(`Total time: ${(totalTime / 1000).toFixed(2)}s`, 'info');

    } catch (error) {
      addLog(`Fatal error: ${error.message}`, 'error');
      setUploadState(prev => ({
        ...prev,
        isRunning: false,
        endTime: Date.now()
      }));
    }
  }, [certificates, uploadState.isPaused, uploadState.isRunning, uploadState.startTime, processCertificate, addLog]);

  // Control functions
  const pauseUpload = useCallback(() => {
    setUploadState(prev => ({ ...prev, isPaused: true }));
    addLog('Upload paused', 'warning');
  }, [addLog]);

  const resumeUpload = useCallback(() => {
    setUploadState(prev => ({ ...prev, isPaused: false }));
    addLog('Upload resumed', 'info');
  }, [addLog]);

  const stopUpload = useCallback(() => {
    setUploadState(prev => ({
      ...prev,
      isRunning: false,
      isPaused: false,
      endTime: Date.now()
    }));
    addLog('Upload stopped by user', 'warning');
  }, [addLog]);

  // Reset function
  const resetUpload = useCallback(() => {
    setUploadState({
      isRunning: false,
      isPaused: false,
      currentIndex: 0,
      processed: 0,
      successful: 0,
      failed: 0,
      errors: [],
      startTime: null,
      endTime: null
    });
    setUploadProgress({
      overall: 0,
      current: 0,
      currentCert: null
    });
    setLogs([]);
  }, []);

  // Handle modal close
  const handleClose = useCallback(() => {
    if (uploadState.isRunning) {
      addLog('Cannot close while upload is running', 'error');
      return;
    }
    resetUpload();
    onClose();
  }, [uploadState.isRunning, resetUpload, onClose, addLog]);

  // Animation variants
  const modalVariants = useMemo(() => ({
    hidden: { opacity: 0, scale: 0.96, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0.1 : 0.2, ease: "easeOut" }
    },
    exit: {
      opacity: 0,
      scale: 0.96,
      y: 10,
      transition: { duration: shouldReduceMotion ? 0.05 : 0.15, ease: "easeIn" }
    }
  }), [shouldReduceMotion]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={!uploadState.isRunning ? handleClose : undefined}
        />

        {/* Modal Content */}
        <motion.div
          className="relative w-full max-w-6xl max-h-[95vh] overflow-hidden bg-white/95 dark:bg-slate-800/95 rounded-3xl shadow-2xl border border-amber-200/30 dark:border-amber-500/20 backdrop-blur-xl"
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
                  <FaCloudUploadAlt className="text-white text-sm" />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    Bulk Certificate Upload
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Upload all {certificates?.length || 0} certificates from your data file
                  </p>
                </div>
              </div>

              <motion.button
                onClick={handleClose}
                disabled={uploadState.isRunning}
                className="p-3 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaTimes className="text-slate-500 dark:text-slate-400" />
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Progress Section */}
            <div className="space-y-4">
              {/* Overall Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm font-medium text-slate-600 dark:text-slate-400">
                  <span>Overall Progress</span>
                  <span>{uploadProgress.overall}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress.overall}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Current Certificate Progress */}
              {uploadProgress.currentCert && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm font-medium text-slate-600 dark:text-slate-400">
                    <span>Current: {uploadProgress.currentCert}</span>
                    <span>{uploadProgress.current}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress.current}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                  <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">
                    {uploadState.processed}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Processed</div>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {uploadState.successful}
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400">Success</div>
                </div>
                <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {uploadState.failed}
                  </div>
                  <div className="text-xs text-red-600 dark:text-red-400">Failed</div>
                </div>
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {certificates?.length || 0}
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400">Total</div>
                </div>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex gap-3">
              {!uploadState.isRunning ? (
                <motion.button
                  onClick={startUpload}
                  disabled={!certificates || certificates.length === 0}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaPlay />
                  <span>Start Upload</span>
                </motion.button>
              ) : (
                <>
                  {!uploadState.isPaused ? (
                    <motion.button
                      onClick={pauseUpload}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all font-semibold flex items-center justify-center gap-3"
                      whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaPause />
                      <span>Pause</span>
                    </motion.button>
                  ) : (
                    <motion.button
                      onClick={resumeUpload}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all font-semibold flex items-center justify-center gap-3"
                      whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaPlay />
                      <span>Resume</span>
                    </motion.button>
                  )}
                  
                  <motion.button
                    onClick={stopUpload}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transition-all font-semibold flex items-center justify-center gap-3"
                    whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaStop />
                    <span>Stop</span>
                  </motion.button>
                </>
              )}

              <motion.button
                onClick={resetUpload}
                disabled={uploadState.isRunning}
                className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                Reset
              </motion.button>
            </div>

            {/* Logs */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                Upload Log
              </h3>
              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 max-h-96 overflow-y-auto font-mono text-sm">
                {logs.length === 0 ? (
                  <p className="text-slate-500 dark:text-slate-400 text-center py-8">
                    No logs yet. Click "Start Upload" to begin.
                  </p>
                ) : (
                  logs.map((log) => (
                    <div
                      key={log.id}
                      className={`flex items-start gap-3 py-1 ${
                        log.type === 'success' ? 'text-green-600 dark:text-green-400' :
                        log.type === 'error' ? 'text-red-600 dark:text-red-400' :
                        log.type === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span className="text-slate-400 dark:text-slate-500 text-xs">
                        [{log.timestamp}]
                      </span>
                      <span className="flex-1">{log.message}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BulkUploadModal;
