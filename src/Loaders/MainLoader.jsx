import { motion } from 'framer-motion';

function MainLoader() {
  return (
    <motion.div 
      className="flex justify-center items-center bg-gradient-to-br from-slate-950 via-slate-900 to-black h-screen relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Sophisticated background effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating orbs with gentle movement */}
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-yellow-400/8 to-orange-500/8 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Floating hexagon */}
        <motion.div
          className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-r from-purple-500/6 to-pink-500/6"
          style={{
            clipPath: "polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)",
            filter: "blur(20px)"
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        {/* Gentle particle system */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-blue-400/40 to-cyan-500/40 rounded-full"
            style={{
              left: `${20 + (i * 10)}%`,
              top: `${30 + (i * 5)}%`,
            }}
            animate={{
              y: [0, -60, 0],
              x: [0, Math.sin(i) * 30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* Main loader content */}
      <div className="flex flex-col justify-center items-center space-y-8">
        
        {/* Revolutionary logo animation */}
        <div className="relative flex items-center justify-center">
          {/* Smooth rotating rings */}
          <motion.div
            className="absolute w-40 h-40 border-2 border-transparent border-t-red-500/30 rounded-full"
            animate={{ rotate: 360 }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          
          <motion.div
            className="absolute w-32 h-32 border-2 border-transparent border-r-orange-500/30 rounded-full"
            animate={{ rotate: -360 }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          
          <motion.div
            className="absolute w-24 h-24 border border-transparent border-b-yellow-400/40 rounded-full"
            animate={{ rotate: 360 }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Logo container with breathing effect */}
          <motion.div
            className="relative"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
            }}
            transition={{ duration: 1.2, delay: 0.3 }}
          >
            <div className="relative w-20 h-20 flex items-center justify-center">
              {/* Subtle glow backdrop */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-red-500/8 to-orange-500/8 rounded-2xl blur-xl"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              
              {/* Your Logo with smooth entrance */}
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
                className="relative z-10 drop-shadow-lg"
              >
                {/* Left part with smooth scale */}
                <motion.rect
                  x="10"
                  y="10"
                  width="25"
                  height="80"
                  fill="url(#gradient1)"
                  initial={{ scaleY: 0, originY: 0.5 }}
                  animate={{ scaleY: 1 }}
                  transition={{ 
                    duration: 1.2, 
                    delay: 0.8,
                    ease: "easeOut"
                  }}
                />
                
                {/* Right part with smooth draw */}
                <motion.path
                  d="M45 10 Q80 10 80 35 Q80 50 65 50 Q80 50 80 75 Q80 90 45 90 L45 75 Q65 75 65 62.5 Q65 50 50 50 L45 50 L45 40 Q60 40 60 25 Q60 10 45 10 Z"
                  fill="url(#gradient2)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ 
                    duration: 2, 
                    delay: 1.2,
                    ease: "easeInOut"
                  }}
                />
                
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#EF4444" />
                    <stop offset="50%" stopColor="#DC2626" />
                    <stop offset="100%" stopColor="#B91C1C" />
                  </linearGradient>
                  <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F97316" />
                    <stop offset="50%" stopColor="#EF4444" />
                    <stop offset="100%" stopColor="#DC2626" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </motion.div>
        </div>

        {/* Sophisticated loading indicators */}
        <div className="flex flex-col items-center space-y-6">
          {/* Dynamic text with smooth entrance */}
          <motion.h2
            className="text-3xl pt-10 md:text-4xl font-bold bg-gradient-to-r from-red-400 via-orange-500 to-yellow-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2 }}
          >
            Loading Portfolio
          </motion.h2>
          
          {/* Smooth wave dots */}
          <div className="flex space-x-2">
            {[0, 1, 2, 3, 4].map((index) => (
              <motion.div
                key={index}
                className="w-1.5 h-1.5 bg-gradient-to-r from-red-400 to-orange-500 rounded-full"
                animate={{
                  y: [0, -8, 0],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.15,
                }}
              />
            ))}
          </div>
          
          {/* Smooth progress bar */}
          <div className="w-64 h-2 bg-slate-800/30 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-red-400 via-orange-500 to-yellow-400 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </div>

        {/* Elegant subtitle */}
        <motion.p
          className="text-slate-400 text-sm md:text-base tracking-wider text-center px-4 font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{
            duration: 1.5,
            delay: 2.5,
            ease: "easeOut",
          }}
        >
          CRAFTING DIGITAL EXCELLENCE
        </motion.p>
      </div>

      {/* Smooth corner accents */}
      <motion.div
        className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-red-400/25"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 3 }}
      />
      
      <motion.div
        className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-orange-400/25"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 3.2 }}
      />
    </motion.div>
  );
}

export default MainLoader;