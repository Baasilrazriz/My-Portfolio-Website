import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

function LoginForm() {
  const navigate = useNavigate();
  
  // State for managing form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [biometricSupported, setBiometricSupported] = useState(false);
  const [biometricType, setBiometricType] = useState('');
  const [biometricRegistered, setBiometricRegistered] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState('');

  // Your admin credentials
  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'baasilrazriz@gmail.com';
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'TEh7qmfs';

  // Session timeout duration (2 hours in milliseconds)
  const SESSION_TIMEOUT = 2 * 60 * 60 * 1000; // 2 hours

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  };

  const errorVariants = {
    hidden: { 
      opacity: 0, 
      y: -10, 
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      y: -10, 
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    }
  };

  const loadingVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  // Check for biometric support on component mount
  useEffect(() => {
    checkSessionAndRedirect();
    checkBiometricSupport();
    checkBiometricRegistration();
    
    // Set up session expiry checker
    const sessionCheckInterval = setInterval(checkSessionExpiry, 60000); // Check every minute
    
    // Cleanup interval on component unmount
    return () => clearInterval(sessionCheckInterval);
  }, []);

  // Function to check session and redirect if authenticated
  const checkSessionAndRedirect = () => {
    const isAuthenticated = sessionStorage.getItem('isAdminAuthenticated');
    const loginTime = sessionStorage.getItem('adminLoginTime');
    
    if (isAuthenticated && loginTime) {
      const currentTime = Date.now();
      const sessionAge = currentTime - parseInt(loginTime);
      
      if (sessionAge <= SESSION_TIMEOUT) {
        // Session is still valid, redirect to home
        console.log('✅ Valid session found, redirecting to home');
        navigate('/', { replace: true });
        return;
      } else {
        // Session expired, clear it
        expireSession();
      }
    }
  };

  // Function to check if session has expired
  const checkSessionExpiry = () => {
    const isAuthenticated = sessionStorage.getItem('isAdminAuthenticated');
    const loginTime = sessionStorage.getItem('adminLoginTime');
    
    if (isAuthenticated && loginTime) {
      const currentTime = Date.now();
      const sessionAge = currentTime - parseInt(loginTime);
      
      if (sessionAge > SESSION_TIMEOUT) {
        // Session expired
        console.log('⏰ Session expired after 2 hours');
        expireSession();
      }
    }
  };

  // Function to expire session
  const expireSession = () => {
    // Clear all session data
    sessionStorage.removeItem('isAdminAuthenticated');
    sessionStorage.removeItem('adminEmail');
    sessionStorage.removeItem('authMethod');
    sessionStorage.removeItem('adminLoginTime');
    
    console.log('🔒 Admin session expired and cleared');
  };

  // Enhanced function to detect biometric capabilities and device info
  const checkBiometricSupport = async () => {
    if (!window.PublicKeyCredential) {
      return;
    }

    try {
      const available = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      setBiometricSupported(available);
      
      // Enhanced device detection
      const userAgent = navigator.userAgent.toLowerCase();
      const platform = navigator.platform.toLowerCase();
      const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      
      let biometricTypeText = 'Biometric';
      let deviceInfoText = '';
      
      if (isMobile) {
        if (/iphone/i.test(userAgent)) {
          // iPhone detection - could have Face ID or Touch ID
          const iosVersion = userAgent.match(/os (\d+)_(\d+)_?(\d+)?/);
          const majorVersion = iosVersion ? parseInt(iosVersion[1]) : 0;
          
          // iPhone X and newer typically have Face ID
          // iPhone 8 and older have Touch ID
          if (userAgent.includes('iphone')) {
            if (majorVersion >= 11) {
              biometricTypeText = 'Face ID / Touch ID';
              deviceInfoText = 'iPhone with Face ID/Touch ID';
            } else {
              biometricTypeText = 'Touch ID';
              deviceInfoText = 'iPhone with Touch ID';
            }
          }
        } else if (/ipad/i.test(userAgent)) {
          biometricTypeText = 'Face ID / Touch ID';
          deviceInfoText = 'iPad with biometric authentication';
        } else if (/android/i.test(userAgent)) {
          biometricTypeText = 'Fingerprint / Face Unlock';
          deviceInfoText = 'Android device with biometric authentication';
        } else {
          biometricTypeText = 'Biometric Authentication';
          deviceInfoText = 'Mobile device with biometric support';
        }
      } else {
        // Desktop detection
        if (platform.includes('mac')) {
          biometricTypeText = 'Touch ID';
          deviceInfoText = 'Mac with Touch ID';
        } else if (platform.includes('win')) {
          biometricTypeText = 'Windows Hello';
          deviceInfoText = 'Windows with Hello';
        } else {
          biometricTypeText = 'Platform Authenticator';
          deviceInfoText = 'Desktop with biometric support';
        }
      }
      
      setBiometricType(biometricTypeText);
      setDeviceInfo(deviceInfoText);
      
      console.log('🔍 Device Detection:', {
        userAgent: userAgent.substring(0, 50) + '...',
        platform,
        biometricType: biometricTypeText,
        deviceInfo: deviceInfoText,
        biometricSupported: available
      });
      
    } catch (err) {
      console.log('Biometric check failed:', err);
    }
  };

  // Check if admin biometric is already registered locally
  const checkBiometricRegistration = () => {
    const savedCredentialId = localStorage.getItem('adminBiometricCredentialId');
    const savedAdminEmail = localStorage.getItem('adminBiometricEmail');
    const savedDeviceInfo = localStorage.getItem('adminBiometricDeviceInfo');
    
    // Check if biometric is registered for the current admin
    if (savedCredentialId && savedAdminEmail === ADMIN_EMAIL) {
      setBiometricRegistered(true);
      console.log('✅ Admin biometric credentials found locally');
      console.log('📱 Registered device:', savedDeviceInfo || 'Unknown device');
    } else {
      setBiometricRegistered(false);
      // Clean up any old credentials that don't match current admin
      if (savedCredentialId || savedAdminEmail) {
        localStorage.removeItem('adminBiometricCredentialId');
        localStorage.removeItem('adminBiometricEmail');
        localStorage.removeItem('adminBiometricPublicKey');
        localStorage.removeItem('adminBiometricDeviceInfo');
        localStorage.removeItem('adminBiometricRegisteredAt');
      }
    }
  };

  // Function to handle successful authentication
  const handleSuccessfulAuth = (authMethod = 'password') => {
    const loginTime = Date.now();
    
    // Store admin session with timestamp
    sessionStorage.setItem('isAdminAuthenticated', 'true');
    sessionStorage.setItem('adminEmail', authMethod === 'biometric' ? ADMIN_EMAIL : email);
    sessionStorage.setItem('authMethod', authMethod);
    sessionStorage.setItem('adminLoginTime', loginTime.toString());
    
    console.log('✅ Authentication successful via', authMethod);
    console.log('🕒 Session will expire at:', new Date(loginTime + SESSION_TIMEOUT).toLocaleString());
    
    // Navigate to home page with admin privileges
    navigate('/', { replace: true });
  };

  // Enhanced function to register admin biometric locally (iPhone Face ID optimized)
  const registerBiometric = async () => {
    if (!biometricSupported) {
      setError('Biometric authentication not supported on this device');
      return;
    }

    // First verify password before allowing biometric registration
    if (!sessionStorage.getItem('isAdminAuthenticated')) {
      setError('Please login with password first to register biometric');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Generate a unique challenge
      const challenge = crypto.getRandomValues(new Uint8Array(32));
      
      // Create credential ID based on admin email, device info, and timestamp
      const credentialId = new TextEncoder().encode(`portfolio-admin-${ADMIN_EMAIL}-${Date.now()}`);
      
      // Enhanced credential creation for iPhone Face ID/Touch ID
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: challenge,
          rp: {
            name: "Portfolio Admin Panel",
            id: window.location.hostname || "localhost",
          },
          user: {
            id: credentialId,
            name: ADMIN_EMAIL,
            displayName: "Portfolio Admin",
          },
          pubKeyCredParams: [
            {alg: -7, type: "public-key"},   // ES256 (preferred for mobile)
            {alg: -257, type: "public-key"}, // RS256 (fallback)
            {alg: -37, type: "public-key"}   // PS256 (additional support)
          ],
          authenticatorSelection: {
            authenticatorAttachment: "platform", // Use platform authenticator (Face ID/Touch ID)
            userVerification: "required",        // Require biometric verification
            residentKey: "preferred",           // Store credential on device when possible
            requireResidentKey: false           // Don't require if not supported
          },
          timeout: 60000,
          attestation: "direct" // Get device attestation if available
        }
      });

      if (credential) {
        // Save credential details locally for future authentication
        const credentialIdBase64 = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)));
        
        // Try to get public key if available
        let publicKeyBase64 = '';
        try {
          if (credential.response.publicKey) {
            publicKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(credential.response.publicKey)));
          }
        } catch (e) {
          console.log('Public key not available, continuing without it');
        }
        
        // Store in localStorage so it persists across deployments
        localStorage.setItem('adminBiometricCredentialId', credentialIdBase64);
        localStorage.setItem('adminBiometricEmail', ADMIN_EMAIL);
        localStorage.setItem('adminBiometricPublicKey', publicKeyBase64);
        localStorage.setItem('adminBiometricDeviceInfo', deviceInfo);
        localStorage.setItem('adminBiometricRegisteredAt', new Date().toISOString());
        
        setBiometricRegistered(true);
        setError('');
        
        console.log('✅ Admin biometric registered and saved locally');
        console.log('📱 Device:', deviceInfo);
        console.log('🔐 Biometric Type:', biometricType);
        
        // Show success message
        setTimeout(() => {
          setError(`✅ ${biometricType} registered successfully! You can now use it for future logins.`);
          setTimeout(() => setError(''), 4000);
        }, 500);
      }
    } catch (err) {
      console.log('❌ Biometric registration failed:', err);
      if (err.name === 'NotAllowedError') {
        setError(`${biometricType} registration was cancelled or denied`);
      } else if (err.name === 'InvalidStateError') {
        setError(`${biometricType} credential already exists for this device`);
      } else if (err.name === 'NotSupportedError') {
        setError(`${biometricType} is not supported on this device`);
      } else if (err.name === 'SecurityError') {
        setError('Security error occurred. Please try again.');
      } else {
        setError(`${biometricType} registration failed. Please try again.`);
      }
    }
    
    setIsLoading(false);
  };

  // Enhanced function to authenticate using saved biometric (iPhone Face ID optimized)
  const handleBiometricAuth = async () => {
    if (!biometricSupported || !biometricRegistered) {
      setError('Biometric authentication not available');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Get saved credential details
      const savedCredentialId = localStorage.getItem('adminBiometricCredentialId');
      const savedAdminEmail = localStorage.getItem('adminBiometricEmail');
      const savedDeviceInfo = localStorage.getItem('adminBiometricDeviceInfo');
      
      if (!savedCredentialId || savedAdminEmail !== ADMIN_EMAIL) {
        throw new Error('No valid admin biometric credentials found');
      }

      console.log('🔐 Attempting biometric authentication...');
      console.log('📱 Registered device:', savedDeviceInfo);

      // Convert base64 credential ID back to ArrayBuffer
      const credentialIdBuffer = Uint8Array.from(atob(savedCredentialId), c => c.charCodeAt(0)).buffer;

      // Generate new challenge for authentication
      const challenge = crypto.getRandomValues(new Uint8Array(32));
      
      // Authenticate using the saved credential (optimized for iPhone)
      const assertion = await navigator.credentials.get({
        publicKey: {
          challenge: challenge,
          allowCredentials: [{
            id: credentialIdBuffer,
            type: "public-key",
            transports: ["internal", "hybrid", "usb", "nfc", "ble"] // All possible transports
          }],
          userVerification: "required", // Require Face ID/Touch ID/PIN
          timeout: 60000
        }
      });

      if (assertion) {
        // Verify that the returned credential matches our saved one
        const responseCredentialId = btoa(String.fromCharCode(...new Uint8Array(assertion.rawId)));
        
        if (responseCredentialId === savedCredentialId) {
          // Successful biometric authentication for admin
          console.log('✅ Admin biometric authentication successful');
          console.log('🔐 Authentication method:', biometricType);
          handleSuccessfulAuth('biometric');
        } else {
          throw new Error('Credential verification failed');
        }
      }
    } catch (err) {
      console.log('❌ Biometric authentication failed:', err);
      if (err.name === 'NotAllowedError') {
        setError(`${biometricType} authentication was cancelled or failed`);
      } else if (err.name === 'InvalidStateError') {
        setError('Please try again');
      } else if (err.name === 'NotSupportedError') {
        setError(`${biometricType} is not supported`);
      } else if (err.name === 'SecurityError') {
        setError('Security error. Please use password login.');
      } else {
        setError(`${biometricType} authentication failed. Please use password login.`);
      }
    }
    
    setIsLoading(false);
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    console.log('=== Password Login Attempt ===');
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      // Validate credentials
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        // Handle successful password authentication
        handleSuccessfulAuth('password');
      } else {
        console.log('❌ Authentication failed');
        setError('Invalid admin credentials. Access denied.');
        setIsLoading(false);
      }
    }, 1500);
  };

  // Function to remove biometric registration
  const removeBiometric = () => {
    const savedDeviceInfo = localStorage.getItem('adminBiometricDeviceInfo');
    
    localStorage.removeItem('adminBiometricCredentialId');
    localStorage.removeItem('adminBiometricEmail');
    localStorage.removeItem('adminBiometricPublicKey');
    localStorage.removeItem('adminBiometricDeviceInfo');
    localStorage.removeItem('adminBiometricRegisteredAt');
    
    setBiometricRegistered(false);
    setError(`${biometricType} authentication removed successfully`);
    setTimeout(() => setError(''), 3000);
    
    console.log('🗑️ Admin biometric credentials removed');
    console.log('📱 Removed from device:', savedDeviceInfo);
  };

  return (
    <motion.section 
      className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{ 
            x: [0, 30, -20, 0],
            y: [0, -50, 20, 0],
            scale: [1, 1.1, 0.9, 1]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{ 
            x: [0, -30, 20, 0],
            y: [0, 50, -20, 0],
            scale: [1, 0.9, 1.1, 1]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div 
          className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{ 
            x: [0, 20, -30, 0],
            y: [0, -30, 10, 0],
            scale: [1, 1.2, 0.8, 1]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
      </div>

      <motion.div 
        className="relative z-10 w-full max-w-md bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700/50 p-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <motion.div 
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl mb-4"
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
          </motion.div>
          <motion.h2 
            className="text-3xl font-bold text-white mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Admin Access
          </motion.h2>
          <motion.p 
            className="text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Secure portfolio admin panel
          </motion.p>
          <motion.p 
            className="text-gray-500 text-xs mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Sessions expire after 2 hours
          </motion.p>
          <AnimatePresence>
            {deviceInfo && (
              <motion.p 
                className="text-gray-500 text-xs mt-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {deviceInfo}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Biometric Authentication Section */}
        <AnimatePresence>
          {biometricSupported && biometricRegistered && (
            <motion.div 
              className="mb-6"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <motion.button
                type="button"
                onClick={handleBiometricAuth}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-2"
                variants={buttonVariants}
                whileHover={!isLoading ? "hover" : undefined}
                whileTap={!isLoading ? "tap" : undefined}
              >
                {isLoading ? (
                  <>
                    <motion.svg 
                      className="w-5 h-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      variants={loadingVariants}
                      animate="animate"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </motion.svg>
                    Authenticating...
                  </>
                ) : (
                  <>
                    {/* Dynamic icon based on biometric type */}
                    {biometricType.includes('Face ID') ? (
                      <motion.svg 
                        className="w-5 h-5" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        whileHover={{ scale: 1.1 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v4m6 6v1a3 3 0 01-3 3H9a3 3 0 01-3-3v-1m6-6a3 3 0 00-3 3v4a3 3 0 006 0V7a3 3 0 00-3-3zm0 0V4"/>
                      </motion.svg>
                    ) : (
                      <motion.svg 
                        className="w-5 h-5" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        whileHover={{ scale: 1.1 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"/>
                      </motion.svg>
                    )}
                    Use {biometricType}
                  </>
                )}
              </motion.button>
              
              {/* Divider */}
              <motion.div 
                className="flex items-center my-6"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="flex-1 border-t border-gray-600"></div>
                <span className="px-4 text-gray-400 text-sm">or continue with password</span>
                <div className="flex-1 border-t border-gray-600"></div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div 
              className={`mb-6 p-4 rounded-xl ${
                error.includes('✅') 
                  ? 'bg-green-500/20 border border-green-500/50' 
                  : 'bg-red-500/20 border border-red-500/50'
              }`}
              variants={errorVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex items-center gap-2">
                <motion.svg 
                  className={`w-5 h-5 ${error.includes('✅') ? 'text-green-400' : 'text-red-400'}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={error.includes('✅') ? "M5 13l4 4L19 7" : "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"}/>
                </motion.svg>
                <span className={`text-sm ${error.includes('✅') ? 'text-green-300' : 'text-red-300'}`}>{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <motion.form onSubmit={handleSubmit} className="space-y-6" variants={itemVariants}>
          {/* Email Field */}
          <motion.div className="space-y-2" variants={itemVariants}>
            <label htmlFor="email" className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
              </svg>
              Admin Email
            </label>
            <div className="relative">
              <motion.input
                type="email"
                id="email"
                placeholder="Enter admin email"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                autoFocus
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                whileFocus={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </motion.div>

          {/* Password Field */}
          <motion.div className="space-y-2" variants={itemVariants}>
            <label htmlFor="password" className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
              Admin Password
            </label>
            <div className="relative">
              <motion.input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter admin password"
                minLength="6"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 pr-12"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                whileFocus={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              />
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                disabled={isLoading}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.275 4.057-5.065 7-9.543 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Login Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            variants={buttonVariants}
            whileHover={!isLoading ? "hover" : undefined}
            whileTap={!isLoading ? "tap" : undefined}
          >
            {isLoading ? (
              <>
                <motion.svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  variants={loadingVariants}
                  animate="animate"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </motion.svg>
                Authenticating...
              </>
            ) : (
              <>
                <motion.svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                </motion.svg>
                Access Admin Panel
              </>
            )}
          </motion.button>
        </motion.form>

        {/* Biometric Registration/Management Section */}
        <AnimatePresence>
          {biometricSupported && (
            <motion.div 
              className="mt-6"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {biometricRegistered ? (
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-green-400 text-sm mb-2">✅ {biometricType} is registered</p>
                  <p className="text-gray-400 text-xs mb-3">{localStorage.getItem('adminBiometricDeviceInfo')}</p>
                  <motion.button
                    type="button"
                    onClick={removeBiometric}
                    disabled={isLoading}
                    className="text-red-400 hover:text-red-300 text-sm py-1 transition-colors disabled:opacity-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Remove {biometricType} Authentication
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.button
                    type="button"
                    onClick={registerBiometric}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                    variants={buttonVariants}
                    whileHover={!isLoading ? "hover" : undefined}
                    whileTap={!isLoading ? "tap" : undefined}
                  >
                    {isLoading ? (
                      <>
                        <motion.svg 
                          className="w-4 h-4" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          variants={loadingVariants}
                          animate="animate"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                        </motion.svg>
                        Registering...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                        </svg>
                        Setup {biometricType} (After Login)
                      </>
                    )}
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Security Notice */}
        <motion.div 
          className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <motion.svg 
              className="w-4 h-4 text-blue-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              whileHover={{ scale: 1.1 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </motion.svg>
            <span className="text-blue-300 text-sm font-medium">Security Notice</span>
          </div>
          <p className="text-blue-200 text-xs">
            This is a secure admin portal. Sessions automatically expire after 2 hours for security.
            {biometricSupported && biometricRegistered && ` Your ${biometricType} is saved locally for quick access.`}
            {biometricSupported && !biometricRegistered && ` ${biometricType} setup available after password login.`}
          </p>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

export default LoginForm;