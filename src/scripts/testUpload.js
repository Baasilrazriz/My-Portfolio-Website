/**
 * Test script to verify Cloudinary connection and certificates data
 */

// Function to log messages (will be overridden by the web interface)
const log = window?.log || console.log;

/**
 * Test Cloudinary connection with a small test image
 */
async function testCloudinaryConnection() {
  log('🔗 Test 1: Testing Cloudinary Connection');
  
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  
  if (!cloudName || !uploadPreset) {
    log('❌ Missing Cloudinary credentials in environment variables', 'error');
    return false;
  }
  
  log(`   Cloud Name: ${cloudName}`);
  log(`   Upload Preset: ${uploadPreset}`);
  
  // Create a small test image (1x1 pixel red dot)
  const testImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
  
  try {
    const formData = new FormData();
    formData.append('file', testImageBase64);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', 'test');
    
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData
    });
    
    if (response.ok) {
      const result = await response.json();
      log(`✅ Cloudinary connection successful! Test image uploaded: ${result.secure_url}`, 'success');
      return true;
    } else {
      const error = await response.text();
      log(`❌ Cloudinary upload failed: ${response.status} - ${error}`, 'error');
      return false;
    }
  } catch (error) {
    log(`❌ Cloudinary connection error: ${error.message}`, 'error');
    return false;
  }
}

/**
 * Test certificates data structure
 */
async function testCertificatesData() {
  log('\n📂 Test 2: Checking Certificates Data');
  try {
    const { certificates } = await import('../assets/data/certificates.js');
    log(`✅ Found ${certificates.length} certificates`);
    
    if (certificates.length > 0) {
      log('📋 Sample certificate structure:');
      const sample = certificates[0];
      log(`   Name: ${sample.name || 'Missing'}`);
      log(`   Organization: ${sample.organization || 'Missing'}`);
      log(`   Date: ${sample.date || 'Missing'}`);
      log(`   Image: ${sample.image ? 'Present' : 'Missing'}`);
      log(`   Link: ${sample.link || 'Not provided'}`);
      
      // Check for required fields
      let validCertificates = 0;
      let invalidCertificates = 0;
      
      for (const cert of certificates) {
        if (cert.name && cert.organization && cert.date && cert.image) {
          validCertificates++;
        } else {
          invalidCertificates++;
          log(`⚠️ Invalid certificate found: ${cert.name || 'Unnamed'}`, 'warning');
        }
      }
      
      log(`✅ Valid certificates: ${validCertificates}`);
      if (invalidCertificates > 0) {
        log(`⚠️ Invalid certificates: ${invalidCertificates}`, 'warning');
      }
      
      return invalidCertificates === 0;
    } else {
      log('⚠️ No certificates found in the data file', 'warning');
      return false;
    }
  } catch (error) {
    log(`❌ Error loading certificates: ${error.message}`, 'error');
    return false;
  }
}

/**
 * Run all tests
 */
export async function runTest() {
  log('🚀 Starting Certificate Upload Tests\n');
  
  try {
    const cloudinaryTest = await testCloudinaryConnection();
    const dataTest = await testCertificatesData();
    
    log('\n📊 Test Summary:');
    log(`   Cloudinary Connection: ${cloudinaryTest ? '✅ PASS' : '❌ FAIL'}`);
    log(`   Certificates Data: ${dataTest ? '✅ PASS' : '❌ FAIL'}`);
    
    const allTestsPassed = cloudinaryTest && dataTest;
    
    if (allTestsPassed) {
      log('\n🎉 All tests passed! You can proceed with the upload.', 'success');
    } else {
      log('\n❌ Some tests failed. Please fix the issues before uploading.', 'error');
    }
    
    return allTestsPassed;
  } catch (error) {
    log(`❌ Test execution failed: ${error.message}`, 'error');
    return false;
  }
}
