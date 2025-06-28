import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaRobot, 
  FaTimes, 
  FaPaperPlane, 
  FaUser,
  FaSpinner,
  FaBrain,
  FaWindowMinimize,
  FaWindowMaximize,
  FaExclamationTriangle
} from 'react-icons/fa';
import { useAIBot } from './useAIBot';
import { QUICK_QUESTIONS, getPopularQuestions } from './aiUtils';
import SingleProjectDisplay from './SingleProjectDisplay';

const AIBot = () => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const {
    isOpen,
    isMinimized,
    messages,
    isLoading,
    isTyping,
    error,
    sendMessage: sendAIMessage,
    toggleChat,
    toggleMinimize,
    closeChat,
    clearError,
    updateProjectContext
  } = useAIBot();

  // Auto scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Handle sending messages
  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() || isLoading) return;

    const success = await sendAIMessage(inputMessage.trim());
    if (success) {
      setInputMessage('');
    }
  }, [inputMessage, isLoading, sendAIMessage]);

  // Handle Enter key press
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  // Handle suggestion click
  const handleSuggestionClick = useCallback((suggestion) => {
    setInputMessage(suggestion);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Get dynamic suggestions (popular questions + default)
  const suggestions = useMemo(() => {
    const popular = getPopularQuestions();
    const combined = [...new Set([...popular, ...QUICK_QUESTIONS])];
    return combined.slice(0, 4);
  }, []);

  // Animation variants
  const chatVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8, 
      y: 50,
      transition: { duration: 0.2 }
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      y: 50,
      transition: { duration: 0.2 }
    }
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            onClick={toggleChat}
            className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full shadow-2xl flex items-center justify-center cursor-pointer group relative overflow-hidden touch-manipulation"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Robot icon with animation */}
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <FaRobot className="text-xl sm:text-2xl relative z-10" />
            </motion.div>
            
            {/* Pulse effect */}
            <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20" />
            
            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-2 px-2 sm:px-3 py-1 bg-gray-900 text-white text-xs sm:text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Chat with Basil&apos;s AI
              <div className="absolute top-full right-2 sm:right-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 ${
              isMinimized 
                ? 'w-72 sm:w-80 h-16' 
                : 'w-[95vw] max-w-2xl sm:w-[480px] h-[90vh] max-h-[700px] sm:h-[700px]'
            } flex flex-col overflow-hidden fixed bottom-16 sm:bottom-20 right-4 sm:right-6`}
            variants={chatVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <FaBrain className="text-lg sm:text-xl" />
                  </motion.div>
                  <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg">Basil&apos;s AI Assistant</h3>
                  <p className="text-xs opacity-90">Ask me anything about Basil!</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1 sm:gap-2">
                <motion.button
                  onClick={toggleMinimize}
                  className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  {isMinimized ? <FaWindowMaximize className="text-xs sm:text-sm" /> : <FaWindowMinimize className="text-xs sm:text-sm" />}
                </motion.button>
                <motion.button
                  onClick={closeChat}
                  className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <FaTimes className="text-xs sm:text-sm" />
                </motion.button>
              </div>
            </div>

            {/* Chat Content */}
            {!isMinimized && (
              <>
                {/* Error Banner */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800/50 px-4 py-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FaExclamationTriangle className="text-red-500 text-sm" />
                          <span className="text-red-700 dark:text-red-300 text-sm">{error}</span>
                        </div>
                        <button
                          onClick={clearError}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <FaTimes className="text-xs" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        variants={messageVariants}
                        initial="hidden"
                        animate="visible"
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[90%] sm:max-w-[85%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                          <div className={`flex items-start gap-2 sm:gap-3 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            {/* Avatar */}
                            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
                              message.type === 'user' 
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                                : 'overflow-hidden ring-2 ring-purple-500/50 ring-offset-2'
                            }`}>
                              {message.type === 'user' ? (
                                <FaUser className="text-xs sm:text-sm" />
                              ) : (
                                <div className="relative w-full h-full">
                                  <img 
                                    src="https://res.cloudinary.com/dtgdm5jmv/image/upload/v1749322979/mpniptvuu79fy0whx2vv.jpg"
                                    alt="Basil's Avatar"
                                    className="w-full h-full object-cover rounded-full"
                                    onError={(e) => {
                                      // Fallback to robot icon if image fails to load
                                      e.target.style.display = 'none';
                                      e.target.nextSibling.style.display = 'flex';
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white items-center justify-center rounded-full hidden">
                                    <FaRobot className="text-xs sm:text-sm" />
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {/* Message bubble */}
                            <div className={`px-3 sm:px-5 py-3 sm:py-4 rounded-2xl max-w-full ${
                              message.type === 'user'
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-sm shadow-lg'
                                : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-sm shadow-lg border border-gray-200 dark:border-gray-600'
                            }`}>
                              <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
                              
                              {/* Show single project if message has showSingleProject flag */}
                              {message.type === 'bot' && message.showSingleProject && (
                                <div className="mt-3">
                                  <SingleProjectDisplay 
                                    currentProjectIndex={message.projectIndex || 0}
                                    onProjectChange={updateProjectContext}
                                  />
                                </div>
                              )}
                              
                              <p className={`text-[10px] sm:text-xs mt-2 sm:mt-3 ${
                                message.type === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                              }`}>
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {/* Typing indicator */}
                  <AnimatePresence>
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex justify-start"
                      >
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden ring-2 ring-purple-500/50 ring-offset-2 shadow-lg">
                            <img 
                              src="https://res.cloudinary.com/dtgdm5jmv/image/upload/v1749322979/mpniptvuu79fy0whx2vv.jpg"
                              alt="Basil typing..."
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                            <div className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 text-white items-center justify-center hidden">
                              <FaRobot className="text-xs sm:text-sm" />
                            </div>
                          </div>
                          <div className="bg-white dark:bg-gray-700 px-3 sm:px-5 py-3 sm:py-4 rounded-2xl rounded-bl-sm shadow-lg border border-gray-200 dark:border-gray-600">
                            <div className="flex items-center gap-1">
                              <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-3 sm:p-5 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-end gap-2 sm:gap-3">
                    <div className="flex-1 relative">
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Ask me about Basil&apos;s skills, projects, or services..."
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 text-sm sm:text-base"
                        disabled={isLoading}
                        maxLength={500}
                      />
                      <div className="absolute bottom-1 right-2 text-[10px] sm:text-xs text-gray-400">
                        {inputMessage.length}/500
                      </div>
                    </div>
                    
                    <motion.button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-200 ${
                        inputMessage.trim() && !isLoading
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                      }`}
                      variants={buttonVariants}
                      whileHover={inputMessage.trim() && !isLoading ? "hover" : {}}
                      whileTap={inputMessage.trim() && !isLoading ? "tap" : {}}
                    >
                      {isLoading ? (
                        <FaSpinner className="text-sm sm:text-lg animate-spin" />
                      ) : (
                        <FaPaperPlane className="text-sm sm:text-lg" />
                      )}
                    </motion.button>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 sm:mt-4">
                    {suggestions.map((suggestion, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 rounded-full hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-800/50 dark:hover:to-purple-800/50 transition-all duration-200 border border-blue-200 dark:border-blue-700/50 shadow-sm hover:shadow-md"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        {suggestion}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIBot;
