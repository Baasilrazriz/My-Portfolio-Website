/**
 * Utility functions for CV management
 */

/**
 * Upload a file to Cloudinary with improved error handling
 * @param {File} file - The file to upload
 * @param {string} resourceType - 'image', 'raw', or 'video'
 * @returns {Promise<Object>} - The Cloudinary response
 */
export const uploadToCloudinary = async (file, resourceType = 'raw') => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "portfolio"
    );
    
    // Create a unique public_id to avoid conflicts
    const timestamp = Date.now();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const publicId = `${cleanFileName}_${timestamp}`;
    formData.append("public_id", publicId);
    
    if (resourceType === 'raw') {
      formData.append("resource_type", "raw");
    }

    const endpoint = resourceType === 'image' 
      ? `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`
      : `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/raw/upload`;

    const response = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cloudinary upload error:', errorText);
      throw new Error(`Upload failed with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Verify the uploaded file is accessible
    if (data.secure_url) {
      try {
        const testResponse = await fetch(data.secure_url, { method: 'HEAD' });
        if (!testResponse.ok) {
          console.warn('Uploaded file may not be publicly accessible');
        }
      } catch (testError) {
        console.warn('Could not verify file accessibility:', testError);
      }
    }
    
    return data;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

/**
 * Download a file from a URL with foolproof fallback options
 * @param {string} url - The file URL
 * @param {string} filename - The desired filename
 */
export const downloadFile = async (url, filename) => {
  try {
    console.log('Attempting to download:', url);
    
    // For local files, use direct method
    if (url.startsWith('/') || url.includes('localhost')) {
      console.log('Using direct download for local file');
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return { success: true, method: 'direct' };
    }
    
    // For external URLs, try fetch first
    console.log('Trying fetch method for external URL');
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the blob URL after a short delay
    setTimeout(() => {
      window.URL.revokeObjectURL(blobUrl);
    }, 1000);
    
    return { success: true, method: 'blob' };
    
  } catch (error) {
    console.warn('Download failed, trying popup method:', error);
    
    // Ultimate fallback - open in new tab
    try {
      window.open(url, '_blank');
      return { success: true, method: 'popup' };
    } catch (popupError) {
      console.error('All download methods failed:', popupError);
      throw new Error('All download methods failed');
    }
  }
};

/**
 * Validate a PDF file
 * @param {File} file - The file to validate
 * @param {number} maxSize - Maximum file size in bytes (default: 10MB)
 * @returns {Object} - Validation result
 */
export const validatePdfFile = (file, maxSize = 10 * 1024 * 1024) => {
  const errors = [];

  if (!file) {
    errors.push("No file selected");
    return { isValid: false, errors };
  }

  if (file.type !== "application/pdf") {
    errors.push("Please select a PDF file");
  }

  if (file.size > maxSize) {
    errors.push(`PDF size should be less than ${Math.round(maxSize / (1024 * 1024))}MB`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate an image file
 * @param {File} file - The file to validate
 * @param {number} maxSize - Maximum file size in bytes (default: 5MB)
 * @returns {Object} - Validation result
 */
export const validateImageFile = (file, maxSize = 5 * 1024 * 1024) => {
  const errors = [];

  if (!file) {
    errors.push("No file selected");
    return { isValid: false, errors };
  }

  if (!file.type.startsWith("image/")) {
    errors.push("Please select a valid image file");
  }

  if (file.size > maxSize) {
    errors.push(`Image size should be less than ${Math.round(maxSize / (1024 * 1024))}MB`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Get file extension from filename
 * @param {string} filename - The filename
 * @returns {string} - The file extension
 */
export const getFileExtension = (filename) => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

/**
 * Create a public accessible URL for Cloudinary files
 * @param {string} url - Original Cloudinary URL
 * @returns {string} - Transformed URL with better access
 */
export const getPublicCloudinaryUrl = (url) => {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }
  
  try {
    // Extract the public_id from the URL
    const urlParts = url.split('/');
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    
    if (uploadIndex === -1) return url;
    
    // Get everything after 'upload/v{version}/'
    const afterUpload = urlParts.slice(uploadIndex + 2);
    const publicId = afterUpload.join('/');
    
    // Create a new URL with fl_attachment flag for download
    const baseUrl = urlParts.slice(0, uploadIndex + 1).join('/');
    const downloadUrl = `${baseUrl}/fl_attachment/${publicId}`;
    
    return downloadUrl;
  } catch (error) {
    console.warn('Failed to transform Cloudinary URL:', error);
    return url;
  }
};

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
