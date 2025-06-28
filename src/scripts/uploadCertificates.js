import { collection, addDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../Config/firebaseConfig.js';
import { certificates } from '../assets/data/certificates.js';

// Function to log messages (will be overridden by the web interface)
const log = window?.log || console.log;

// Cloudinary configuration from environment variables
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/**
 * Helper function to ensure collection exists (same as AddCertificateModal)
 */
async function ensureCollectionExists() {
  try {
    const portfolioRef = doc(db, 'portfolio', 'certificates');
    const portfolioSnap = await getDoc(portfolioRef);
    
    if (!portfolioSnap.exists()) {
      await setDoc(portfolioRef, {
        initialized: true,
        createdAt: new Date().toISOString(),
        totalCertificates: 0,
        lastUpdated: new Date().toISOString()
      });
    }
    return true;
  } catch (error) {
    log('Error ensuring collection exists:', error);
    throw error;
  }
}

/**
 * Upload a base64 image to Cloudinary (same logic as AddCertificateModal)
 * @param {string} base64Image - The base64 image string
 * @param {string} fileName - Optional filename for the upload
 * @returns {Promise<string>} - The uploaded image URL
 */
async function uploadImageToCloudinary(base64Image, fileName = 'certificate_image') {
  try {
    // Validate environment variables
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      throw new Error('Cloudinary credentials not found in environment variables. Check VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env file');
    }

    const formData = new FormData();
    
    // Handle base64 string - ensure it has proper data URL format (same as modal)
    let imageData = base64Image;
    if (!base64Image.startsWith('data:')) {
      imageData = `data:image/png;base64,${base64Image}`;
    }
    
    formData.append('file', imageData);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'certificates');
    formData.append('public_id', `${fileName}_${Date.now()}`);
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Cloudinary upload failed: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data = await response.json();
    
    if (!data.secure_url) {
      throw new Error('Cloudinary response missing secure_url');
    }
    
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
}

/**
 * Upload certificate data to Firebase Firestore (same structure as AddCertificateModal)
 * @param {Object} certificateData - The certificate data to upload
 * @returns {Promise<string>} - The document ID of the uploaded certificate
 */
async function uploadCertificateToFirebase(certificateData) {
  try {
    // Ensure collection exists first (same as modal)
    await ensureCollectionExists();
    
    // Add certificate to the certificates subcollection (same path as modal)
    const certificatesRef = collection(db, 'portfolio', 'certificates', 'items');
    const timestamp = new Date().toISOString();
    
    const docRef = await addDoc(certificatesRef, {
      ...certificateData,
      createdAt: timestamp,
      updatedAt: timestamp
    });
    
    return docRef.id;
  } catch (error) {
    // Handle specific Firebase errors (same as modal)
    if (error.code === 'permission-denied') {
      throw new Error('Permission denied. Please check Firestore security rules.');
    } else if (error.code === 'unavailable') {
      throw new Error('Service temporarily unavailable. Please try again.');
    } else if (error.code === 'invalid-argument') {
      throw new Error('Invalid data provided. Please check your input.');
    }
    
    log('Error uploading certificate to Firebase:', error);
    throw new Error(`Firebase upload failed: ${error.message}`);
  }
}

/**
 * Map certificate name to appropriate category (same categories as AddCertificateModal)
 * @param {string} certificateName - The name of the certificate
 * @param {string} organization - The issuing organization
 * @returns {string} - The mapped category
 */
function mapCertificateCategory(certificateName, organization) {
  const name = certificateName.toLowerCase();
  const org = organization.toLowerCase();
  
  // Category mappings based on keywords
  if (name.includes('javascript') || name.includes('react') || name.includes('html') || name.includes('css') || name.includes('web')) {
    return 'Web Development';
  }
  if (name.includes('python') || name.includes('java') || name.includes('programming')) {
    return 'Software Engineering';
  }
  if (name.includes('aws') || name.includes('azure') || name.includes('cloud') || name.includes('gcp')) {
    return 'Cloud Computing';
  }
  if (name.includes('mysql') || name.includes('database') || name.includes('sql')) {
    return 'Database';
  }
  if (name.includes('data science') || name.includes('machine learning') || name.includes('ai')) {
    return 'Data Science';
  }
  if (name.includes('security') || name.includes('cyber')) {
    return 'Cybersecurity';
  }
  if (name.includes('mobile') || name.includes('android') || name.includes('ios')) {
    return 'Mobile Development';
  }
  if (name.includes('devops') || name.includes('docker') || name.includes('kubernetes')) {
    return 'DevOps';
  }
  if (name.includes('design') || name.includes('ui') || name.includes('ux')) {
    return 'Design';
  }
  if (name.includes('project management') || name.includes('scrum') || name.includes('agile')) {
    return 'Project Management';
  }
  if (name.includes('blockchain') || name.includes('crypto')) {
    return 'Blockchain';
  }
  
  // Organization-based mapping
  if (org.includes('udemy')) {
    return 'Web Development'; // Most Udemy courses are web dev related
  }
  if (org.includes('coursera') || org.includes('edx')) {
    return 'Data Science';
  }
  
  return 'Other';
}
/**
 * Process a single certificate - upload image to Cloudinary and then to Firebase
 * @param {Object} certificate - The certificate object
 * @param {number} index - The index of the certificate (for logging)
 * @returns {Promise<Object>} - Result object with success/failure info
 */
async function processCertificate(certificate, index) {
  const startTime = Date.now();
  
  try {
    log(`🔄 Processing certificate ${index + 1}: "${certificate.name}"`);
    
    // Validate required fields
    const requiredFields = ['name', 'image', 'organization', 'date'];
    if (!certificate || typeof certificate !== 'object') {
      throw new Error('Certificate is not a valid object');
    }
    
    const missingFields = requiredFields.filter(field => 
      !Object.prototype.hasOwnProperty.call(certificate, field)
    );
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    const emptyFields = requiredFields.filter(field => 
      !certificate[field] || (typeof certificate[field] === 'string' && certificate[field].trim() === '')
    );
    
    if (emptyFields.length > 0) {
      throw new Error(`Empty required fields: ${emptyFields.join(', ')}`);
    }
    
    // Upload image to Cloudinary
    log(`  📤 Uploading image to Cloudinary...`);
    const imageUrl = await uploadImageToCloudinary(
      certificate.image, 
      certificate.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()
    );
    
    // Prepare certificate data for Firebase (same structure as AddCertificateModal)
    const certificateData = {
      name: certificate.name.trim(),
      organization: certificate.organization.trim(),
      category: mapCertificateCategory(certificate.name, certificate.organization),
      link: certificate.link ? certificate.link.trim() : '',
      issueDate: certificate.date ? certificate.date.trim() : '',
      description: `Certificate in ${certificate.name} from ${certificate.organization}`,
      image: imageUrl, // Keep for backward compatibility
      imageUrl: imageUrl // Same as modal structure
    };
    
    // Upload to Firebase
    log(`  📤 Uploading certificate data to Firebase...`);
    const documentId = await uploadCertificateToFirebase(certificateData);
    
    const processingTime = Date.now() - startTime;
    log(`  ✅ Successfully processed "${certificate.name}" (${processingTime}ms) - Document ID: ${documentId}`, 'success');
    
    return {
      success: true,
      certificate: certificate.name,
      documentId,
      imageUrl,
      processingTime,
      error: null
    };
    
  } catch (error) {
    const processingTime = Date.now() - startTime;
    log(`  ❌ Failed to process "${certificate.name || 'Unknown'}": ${error.message} (${processingTime}ms)`, 'error');
    
    return {
      success: false,
      certificate: certificate.name || 'Unknown',
      documentId: null,
      imageUrl: null,
      processingTime,
      error: error.message
    };
  }
}

/**
 * Process certificates in batches with controlled concurrency
 * @param {Array} certificates - Array of certificate objects
 * @param {number} batchSize - Number of certificates to process concurrently
 * @returns {Promise<Array>} - Array of processing results
 */
async function processCertificatesInBatches(certificates, batchSize = 3) {
  const results = [];
  
  log(`📦 Processing ${certificates.length} certificates in batches of ${batchSize}`);
  
  for (let i = 0; i < certificates.length; i += batchSize) {
    const batch = certificates.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(certificates.length / batchSize);
    
    log(`\n🔄 Processing batch ${batchNumber}/${totalBatches} (certificates ${i + 1}-${Math.min(i + batchSize, certificates.length)})`);
    
    // Process batch concurrently
    const batchPromises = batch.map((cert, batchIndex) => 
      processCertificate(cert, i + batchIndex)
    );
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // Small delay between batches to avoid overwhelming the APIs
    if (i + batchSize < certificates.length) {
      log(`⏳ Waiting 1 second before next batch...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return results;
}

/**
 * Main function to upload all certificates
 * @returns {Promise<Object>} - Summary of the upload process
 */
async function uploadAllCertificates() {
  const startTime = Date.now();
  
  try {
    log('🚀 Starting certificate upload process...');
    
    log(`🔗 Using Cloudinary: ${CLOUDINARY_CLOUD_NAME}`);
    log(`📋 Upload Preset: ${CLOUDINARY_UPLOAD_PRESET}`);
    log(`📊 Found ${certificates.length} certificates to process`);
    
    // Validate environment configuration
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      throw new Error('Missing Cloudinary configuration. Please check your .env file for VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET');
    }
    
    // Validate certificates array
    if (!Array.isArray(certificates)) {
      throw new Error('Certificates data is not an array');
    }
    
    if (certificates.length === 0) {
      log('⚠️  No certificates found to upload', 'warning');
      return {
        totalCertificates: 0,
        successful: 0,
        failed: 0,
        results: [],
        totalTime: Date.now() - startTime
      };
    }
    
    // Process all certificates
    const results = await processCertificatesInBatches(certificates, 3);
    
    // Generate summary
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    const totalTime = Date.now() - startTime;
    
    log('\n' + '='.repeat(60));
    log('📊 UPLOAD SUMMARY');
    log('='.repeat(60));
    log(`📁 Total certificates: ${certificates.length}`);
    log(`✅ Successful uploads: ${successful.length}`, 'success');
    log(`❌ Failed uploads: ${failed.length}`, failed.length > 0 ? 'error' : 'info');
    log(`⏱️  Total processing time: ${totalTime}ms (${(totalTime / 1000).toFixed(2)}s)`);
    log(`⚡ Average time per certificate: ${(totalTime / certificates.length).toFixed(0)}ms`);
    
    if (successful.length > 0) {
      log('\n✅ SUCCESSFUL UPLOADS:', 'success');
      successful.forEach((result, index) => {
        log(`  ${index + 1}. "${result.certificate}" (${result.processingTime}ms)`, 'success');
        log(`     📄 Document ID: ${result.documentId}`);
        log(`     🖼️  Image URL: ${result.imageUrl}`);
      });
    }
    
    if (failed.length > 0) {
      log('\n❌ FAILED UPLOADS:', 'error');
      failed.forEach((result, index) => {
        log(`  ${index + 1}. "${result.certificate}": ${result.error}`, 'error');
      });
    }
    
    const summary = {
      totalCertificates: certificates.length,
      successful: successful.length,
      failed: failed.length,
      results: results,
      totalTime: totalTime,
      successRate: ((successful.length / certificates.length) * 100).toFixed(1)
    };
    
    log(`\n🎯 Success Rate: ${summary.successRate}%`, summary.successRate == '100.0' ? 'success' : 'warning');
    log('='.repeat(60));
    
    return summary;
    
  } catch (error) {
    log('❌ Fatal error in upload process:', error, 'error');
    throw error;
  }
}

/**
 * Utility function to test Cloudinary connection
 * @returns {Promise<boolean>} - True if connection is successful
 */
async function testCloudinaryConnection() {
  try {
    log('🔍 Testing Cloudinary connection...');
    log(`Cloud Name: ${CLOUDINARY_CLOUD_NAME}`);
    log(`Upload Preset: ${CLOUDINARY_UPLOAD_PRESET}`);
    
    // Create a small test image (1x1 pixel red dot)
    const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    
    const imageUrl = await uploadImageToCloudinary(testImage, 'test_connection');
    log('✅ Cloudinary connection successful!', 'success');
    log(`Test image URL: ${imageUrl}`);
    
    return true;
  } catch (error) {
    log('❌ Cloudinary connection failed:', error.message, 'error');
    return false;
  }
}

// Export functions for external use
export {
  uploadImageToCloudinary,
  uploadCertificateToFirebase,
  processCertificate,
  processCertificatesInBatches,
  uploadAllCertificates,
  testCloudinaryConnection
};

// Auto-run the script if it's being executed directly (Node.js environment)
if (typeof window === 'undefined' && import.meta.url.endsWith('/uploadCertificates.js')) {
  uploadAllCertificates()
    .then(() => {
      console.log('✅ Script execution completed successfully');
    })
    .catch(error => {
      console.error('❌ Script execution failed:', error);
    });
}
