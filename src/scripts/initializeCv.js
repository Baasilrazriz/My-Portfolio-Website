/**
 * Initialize CV in Firebase - Run this once to set up the default CV URL
 * This ensures the CV is available from the first load
 */

import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../Config/firebaseConfig';

const initializeCvInDatabase = async () => {
  try {
    console.log('🚀 Initializing CV in database...');
    
    const aboutRef = doc(db, 'portfolio', 'about');
    const aboutSnap = await getDoc(aboutRef);
    
    // Use local accessible URL as primary, with Cloudinary as backup
    const cvUrl = "/cv.pdf"; // Always accessible local file
    const cvFileName = "Muhammad_Basil_Irfan_CV.pdf";
    
    if (aboutSnap.exists()) {
      // Update existing document
      await updateDoc(aboutRef, {
        cvUrl: cvUrl,
        cvFileName: cvFileName
      });
      console.log('✅ CV URL updated in existing document');
    } else {
      // Create new document with default data
      const defaultData = {
        name: "Muhammad Basil Irfan",
        title: "Full Stack Developer",
        dob: "June 30, 2003",
        location: "Karachi, Sindh, Pakistan",
        email: "baasilrazriz@gmail.com",
        phone: "+923237184249",
        about: "Passionate Full Stack Developer with 3+ years of experience creating innovative digital solutions. I specialize in MERN stack development and love turning complex problems into elegant, user-friendly applications.",
        education: "Bachelor's in Computer Science",
        languages: "English, Urdu, Hindi",
        interests: "Web Development, UI/UX Design, Open Source",
        certifications: "AWS Certified, React Developer Certified",
        Profilepic: "",
        cvUrl: cvUrl,
        cvFileName: cvFileName,
      };
      
      await setDoc(aboutRef, defaultData);
      console.log('✅ New document created with CV URL');
    }
    
    console.log('📄 CV URL:', cvUrl);
    console.log('📁 CV Filename:', cvFileName);
    console.log('🎉 CV initialization completed successfully!');
    console.log('💡 Note: Using local accessible URL for reliable downloads');
    
  } catch (error) {
    console.error('❌ Error initializing CV:', error);
    throw error;
  }
};

// Export for use
export { initializeCvInDatabase };

// Auto-run function for browser console
window.initializeCvInDatabase = initializeCvInDatabase;
