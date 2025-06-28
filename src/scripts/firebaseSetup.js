/**
 * Quick Firebase Rules Setup Guide
 * 
 * Your certificate upload failed due to Firebase Firestore security rules.
 * Here's how to fix it:
 */

console.log(`
🔥 FIREBASE SECURITY RULES FIX NEEDED
==========================================

Your certificate uploads failed because of Firebase security rules.
Here's how to fix it:

📋 STEP-BY-STEP SOLUTION:

1. 🌐 Open Firebase Console: https://console.firebase.google.com
2. 📁 Select your project: "portfolio-razriz"
3. 🗄️  Go to "Firestore Database" → "Rules" tab
4. 📝 Replace the current rules with this:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}

5. 💾 Click "Publish" to save the rules
6. 🔄 Try uploading your certificates again

⚠️  IMPORTANT SECURITY NOTE:
This rule allows anyone to read/write to your database.
For production, you should implement proper authentication rules like:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /certificates/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}

🔐 ALTERNATIVE: Use Authentication
If you prefer to keep secure rules, the upload script now includes
anonymous authentication. Make sure to enable Anonymous Authentication
in Firebase Console → Authentication → Sign-in method → Anonymous.

==========================================
`);

// You can also run this in your browser console if needed
export function showFirebaseInstructions() {
  const instructions = `
🔥 FIREBASE SETUP REQUIRED

Your Firestore security rules are blocking the certificate uploads.

Quick Fix (Development):
1. Go to https://console.firebase.google.com
2. Select project: portfolio-razriz  
3. Firestore Database → Rules
4. Replace rules with:
   
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }

5. Click Publish
6. Try upload again

For production, use proper authentication rules!
  `;
  
  console.log(instructions);
  alert(instructions);
}
