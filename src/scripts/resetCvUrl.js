/**
 * Reset CV URL to local file to fix download issues
 * Run this in browser console to immediately fix the CV download
 */

// Simple function to force local CV URL
const resetCvToLocal = () => {
  // Update Redux store directly if available
  if (window.__REDUX_STORE__) {
    window.__REDUX_STORE__.dispatch({
      type: 'about/updateAboutInfo/fulfilled',
      payload: {
        cvUrl: '/cv.pdf',
        cvFileName: 'Muhammad_Basil_Irfan_CV.pdf'
      }
    });
  }
  
  // Also update localStorage as fallback
  localStorage.setItem('cvUrl', '/cv.pdf');
  localStorage.setItem('cvFileName', 'Muhammad_Basil_Irfan_CV.pdf');
  
  console.log('✅ CV URL reset to local file: /cv.pdf');
  console.log('🔄 Please refresh the page to see changes');
};

// Auto-run
resetCvToLocal();

// Export for manual use
window.resetCvToLocal = resetCvToLocal;
