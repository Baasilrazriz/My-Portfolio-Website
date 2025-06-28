/**
 * One-time script to upload the existing CV to Cloudinary
 * Run this script once to upload your CV to Cloudinary and get the URL
 */

const uploadExistingCv = async () => {
  try {
    // Read the CV file from public folder
    const response = await fetch('/Basil\'s CV.pdf');
    const blob = await response.blob();
    const file = new File([blob], 'Basils_CV.pdf', { type: 'application/pdf' });

    console.log('File created:', file.name, file.size);

    // Create FormData for Cloudinary upload
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "portfolio");
    formData.append("resource_type", "raw");

    console.log('Uploading to Cloudinary...');

    // Upload to Cloudinary
    const uploadResponse = await fetch(
      'https://api.cloudinary.com/v1_1/dtgdm5jmv/raw/upload',
      {
        method: "POST",
        body: formData,
      }
    );

    if (!uploadResponse.ok) {
      throw new Error(`Upload failed with status: ${uploadResponse.status}`);
    }

    const data = await uploadResponse.json();
    console.log('Upload successful!');
    console.log('CV URL:', data.secure_url);
    console.log('Copy this URL to update your aboutSlice defaultData');

    return data;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};

// Export for use in browser console or component
window.uploadExistingCv = uploadExistingCv;

// Auto-run if script is loaded
// uploadExistingCv();
