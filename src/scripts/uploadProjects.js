import { collection, addDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../Config/firebaseConfig.js';
import { projects } from '../assets/data/projects.js';

// Function to log messages (will be overridden by the web interface)
const log = window?.log || console.log;

// Cloudinary configuration from environment variables
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/**
 * Helper function to ensure collection exists
 */
async function ensureCollectionExists() {
  try {
    const portfolioRef = doc(db, 'portfolio', 'projects');
    const portfolioSnap = await getDoc(portfolioRef);
    
    if (!portfolioSnap.exists()) {
      await setDoc(portfolioRef, {
        initialized: true,
        createdAt: new Date().toISOString(),
        totalProjects: 0,
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
 * Upload a base64 image to Cloudinary
 * @param {string} base64Image - The base64 image string
 * @param {string} fileName - Optional filename for the upload
 * @returns {Promise<string>} - The uploaded image URL
 */
async function uploadImageToCloudinary(base64Image, fileName = 'project_image') {
  try {
    // Validate environment variables
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      throw new Error('Cloudinary credentials not found in environment variables. Check VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env file');
    }

    const formData = new FormData();
    
    // Handle base64 string - ensure it has proper data URL format
    let imageData = base64Image;
    if (!base64Image.startsWith('data:')) {
      imageData = `data:image/png;base64,${base64Image}`;
    }
    
    formData.append('file', imageData);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'projects');
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
 * Upload project data to Firebase Firestore
 * @param {Object} projectData - The project data to upload
 * @returns {Promise<string>} - The document ID of the uploaded project
 */
async function uploadProjectToFirebase(projectData) {
  try {
    // Ensure collection exists first
    await ensureCollectionExists();
    
    // Add project to the projects subcollection
    const projectsRef = collection(db, 'portfolio', 'projects', 'items');
    const timestamp = new Date().toISOString();
    
    const docRef = await addDoc(projectsRef, {
      ...projectData,
      createdAt: timestamp,
      updatedAt: timestamp
    });
    
    return docRef.id;
  } catch (error) {
    // Handle specific Firebase errors
    if (error.code === 'permission-denied') {
      throw new Error('Permission denied. Please check Firestore security rules.');
    } else if (error.code === 'unavailable') {
      throw new Error('Service temporarily unavailable. Please try again.');
    } else if (error.code === 'invalid-argument') {
      throw new Error('Invalid data provided. Please check your input.');
    }
    
    log('Error uploading project to Firebase:', error);
    throw new Error(`Firebase upload failed: ${error.message}`);
  }
}

/**
 * Normalize project category
 * @param {string} category - The category to normalize
 * @returns {string} - The normalized category
 */
function normalizeProjectCategory(category) {
  if (!category) return 'Other';
  
  const normalizedCategory = category.toLowerCase().trim();
  
  // Category mappings
  const categoryMap = {
    'web development': 'Web Development',
    'web dev': 'Web Development',
    'frontend': 'Web Development',
    'backend': 'Web Development',
    'fullstack': 'Web Development',
    'full stack': 'Web Development',
    'mobile development': 'Mobile Development',
    'mobile dev': 'Mobile Development',
    'android': 'Mobile Development',
    'ios': 'Mobile Development',
    'react native': 'Mobile Development',
    'flutter': 'Mobile Development',
    'machine learning': 'Machine Learning',
    'ml': 'Machine Learning',
    'ai': 'Machine Learning',
    'artificial intelligence': 'Machine Learning',
    'data science': 'Data Science',
    'data analysis': 'Data Science',
    'analytics': 'Data Science',
    'desktop': 'Desktop Application',
    'desktop app': 'Desktop Application',
    'desktop application': 'Desktop Application',
    'game': 'Game Development',
    'game dev': 'Game Development',
    'game development': 'Game Development',
    'devops': 'DevOps',
    'cloud': 'Cloud Computing',
    'api': 'API Development',
    'rest api': 'API Development',
    'graphql': 'API Development',
    'blockchain': 'Blockchain',
    'crypto': 'Blockchain',
    'cryptocurrency': 'Blockchain'
  };
  
  return categoryMap[normalizedCategory] || category;
}

/**
 * Validate and clean project tech array
 * @param {Array} techArray - Array of technologies
 * @returns {Array} - Cleaned tech array
 */
function validateAndCleanTechArray(techArray) {
  if (!Array.isArray(techArray)) {
    return [];
  }
  
  return techArray
    .filter(tech => tech && typeof tech === 'string' && tech.trim() !== '')
    .map(tech => tech.trim());
}

/**
 * Process a single project - upload image to Cloudinary and then to Firebase
 * @param {Object} project - The project object
 * @param {number} index - The index of the project (for logging)
 * @returns {Promise<Object>} - Result object with success/failure info
 */
async function processProject(project, index) {
  const startTime = Date.now();
  
  try {
    log(`🔄 Processing project ${index + 1}: "${project.title}"`);
    
    // Validate required fields
    const requiredFields = ['title', 'lang', 'overview', 'imgUrl', 'tech', 'category'];
    if (!project || typeof project !== 'object') {
      throw new Error('Project is not a valid object');
    }
    
    const missingFields = requiredFields.filter(field => 
      !Object.prototype.hasOwnProperty.call(project, field)
    );
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    // Check for empty required fields (except optional fields like live_link, git_link)
    const emptyFields = ['title', 'lang', 'overview', 'imgUrl'].filter(field => 
      !project[field] || (typeof project[field] === 'string' && project[field].trim() === '')
    );
    
    if (emptyFields.length > 0) {
      throw new Error(`Empty required fields: ${emptyFields.join(', ')}`);
    }
    
    // Validate tech array
    if (!Array.isArray(project.tech)) {
      throw new Error('Tech field must be an array');
    }
    
    // Upload image to Cloudinary
    log(`  📤 Uploading image to Cloudinary...`);
    const imageUrl = await uploadImageToCloudinary(
      project.imgUrl, 
      project.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()
    );
    
    // Prepare project data for Firebase
    const projectData = {
      id: project.id || Date.now(), // Use existing id or generate new one
      title: project.title.trim(),
      lang: project.lang.trim(),
      overview: project.overview.trim(),
      imgUrl: imageUrl,
      tech: validateAndCleanTechArray(project.tech),
      category: normalizeProjectCategory(project.category),
      live_link: project.live_link ? project.live_link.trim() : '',
      git_link: project.git_link ? project.git_link.trim() : '',
      // Additional metadata
      description: project.description || project.overview,
      status: project.status || 'completed',
      featured: project.featured || false
    };
    
    // Upload to Firebase
    log(`  📤 Uploading project data to Firebase...`);
    const documentId = await uploadProjectToFirebase(projectData);
    
    const processingTime = Date.now() - startTime;
    log(`  ✅ Successfully processed "${project.title}" (${processingTime}ms) - Document ID: ${documentId}`, 'success');
    
    return {
      success: true,
      project: project.title,
      documentId,
      imageUrl,
      processingTime,
      error: null
    };
    
  } catch (error) {
    const processingTime = Date.now() - startTime;
    log(`  ❌ Failed to process "${project.title || 'Unknown'}": ${error.message} (${processingTime}ms)`, 'error');
    
    return {
      success: false,
      project: project.title || 'Unknown',
      documentId: null,
      imageUrl: null,
      processingTime,
      error: error.message
    };
  }
}

/**
 * Process projects in batches with controlled concurrency
 * @param {Array} projects - Array of project objects
 * @param {number} batchSize - Number of projects to process concurrently
 * @returns {Promise<Array>} - Array of processing results
 */
async function processProjectsInBatches(projects, batchSize = 2) {
  const results = [];
  
  log(`📦 Processing ${projects.length} projects in batches of ${batchSize}`);
  
  for (let i = 0; i < projects.length; i += batchSize) {
    const batch = projects.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(projects.length / batchSize);
    
    log(`\n🔄 Processing batch ${batchNumber}/${totalBatches} (projects ${i + 1}-${Math.min(i + batchSize, projects.length)})`);
    
    // Process batch concurrently
    const batchPromises = batch.map((project, batchIndex) => 
      processProject(project, i + batchIndex)
    );
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // Small delay between batches to avoid overwhelming the APIs
    if (i + batchSize < projects.length) {
      log(`⏳ Waiting 1.5 seconds before next batch...`);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }
  
  return results;
}

/**
 * Main function to upload all projects
 * @returns {Promise<Object>} - Summary of the upload process
 */
async function uploadAllProjects() {
  const startTime = Date.now();
  
  try {
    log('🚀 Starting project upload process...');
    
    log(`🔗 Using Cloudinary: ${CLOUDINARY_CLOUD_NAME}`);
    log(`📋 Upload Preset: ${CLOUDINARY_UPLOAD_PRESET}`);
    log(`📊 Found ${projects.length} projects to process`);
    
    // Validate environment configuration
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      throw new Error('Missing Cloudinary configuration. Please check your .env file for VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET');
    }
    
    // Validate projects array
    if (!Array.isArray(projects)) {
      throw new Error('Projects data is not an array');
    }
    
    if (projects.length === 0) {
      log('⚠️  No projects found to upload', 'warning');
      return {
        totalProjects: 0,
        successful: 0,
        failed: 0,
        results: [],
        totalTime: Date.now() - startTime
      };
    }
    
    // Process all projects
    const results = await processProjectsInBatches(projects, 2); // Smaller batch size for projects (images are usually larger)
    
    // Generate summary
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    const totalTime = Date.now() - startTime;
    
    log('\n' + '='.repeat(60));
    log('📊 UPLOAD SUMMARY');
    log('='.repeat(60));
    log(`📁 Total projects: ${projects.length}`);
    log(`✅ Successful uploads: ${successful.length}`, 'success');
    log(`❌ Failed uploads: ${failed.length}`, failed.length > 0 ? 'error' : 'info');
    log(`⏱️  Total processing time: ${totalTime}ms (${(totalTime / 1000).toFixed(2)}s)`);
    log(`⚡ Average time per project: ${(totalTime / projects.length).toFixed(0)}ms`);
    
    if (successful.length > 0) {
      log('\n✅ SUCCESSFUL UPLOADS:', 'success');
      successful.forEach((result, index) => {
        log(`  ${index + 1}. "${result.project}" (${result.processingTime}ms)`, 'success');
        log(`     📄 Document ID: ${result.documentId}`);
        log(`     🖼️  Image URL: ${result.imageUrl}`);
      });
    }
    
    if (failed.length > 0) {
      log('\n❌ FAILED UPLOADS:', 'error');
      failed.forEach((result, index) => {
        log(`  ${index + 1}. "${result.project}": ${result.error}`, 'error');
      });
    }
    
    const summary = {
      totalProjects: projects.length,
      successful: successful.length,
      failed: failed.length,
      results: results,
      totalTime: totalTime,
      successRate: ((successful.length / projects.length) * 100).toFixed(1)
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
    
    // Create a small test image (1x1 pixel blue dot)
    const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAGA60e6kgAAAABJRU5ErkJggg==';
    
    const imageUrl = await uploadImageToCloudinary(testImage, 'test_connection_project');
    log('✅ Cloudinary connection successful!', 'success');
    log(`Test image URL: ${imageUrl}`);
    
    return true;
  } catch (error) {
    log('❌ Cloudinary connection failed:', error.message, 'error');
    return false;
  }
}

/**
 * Upload a single project with detailed validation
 * @param {Object} projectData - Single project object to upload
 * @returns {Promise<Object>} - Upload result
 */
async function uploadSingleProject(projectData) {
  try {
    log('🚀 Starting single project upload...');
    
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      throw new Error('Missing Cloudinary configuration. Please check your .env file');
    }
    
    const result = await processProject(projectData, 0);
    
    if (result.success) {
      log('✅ Single project upload completed successfully!', 'success');
    } else {
      log('❌ Single project upload failed!', 'error');
    }
    
    return result;
  } catch (error) {
    log('❌ Fatal error in single project upload:', error, 'error');
    throw error;
  }
}

// Export functions for external use
export {
  uploadImageToCloudinary,
  uploadProjectToFirebase,
  processProject,
  processProjectsInBatches,
  uploadAllProjects,
  uploadSingleProject,
  testCloudinaryConnection,
  normalizeProjectCategory,
  validateAndCleanTechArray
};

// Auto-run the script if it's being executed directly (Node.js environment)
if (typeof window === 'undefined' && import.meta.url.endsWith('/uploadProjects.js')) {
  uploadAllProjects()
    .then(() => {
      console.log('✅ Script execution completed successfully');
    })
    .catch(error => {
      console.error('❌ Script execution failed:', error);
    });
}
