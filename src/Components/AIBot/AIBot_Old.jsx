import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaRobot, 
  FaTimes, 
  FaPaperPlane, 
  FaUser,
  FaSpinner,
  FaBrain,
  FaMinimize,
  FaExpand,
  FaExclamationTriangle
} from 'react-icons/fa';
import { useAIBot } from './useAIBot';
import { QUICK_QUESTIONS, getPopularQuestions } from './aiUtils';

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
    sendMessage,
    toggleChat,
    toggleMinimize,
    closeChat,
    clearError
  } = useAIBot();

  // Personal information context for the AI
  const personalContext = useMemo(() => `
You are an AI assistant representing Muhammad Basil Irfan, a passionate Full Stack Developer. Here's comprehensive information about Basil:

PERSONAL INFORMATION:
- Full Name: Muhammad Basil Irfan
- Age: 21 years old (Born: June 30, 2003)
- Location: Karachi, Sindh, Pakistan
- Email: baasilrazriz@gmail.com
- Phone: +923237184249
- Status: Available for work and new opportunities

PROFESSIONAL BACKGROUND:
- Title: Full Stack Developer & MERN Stack Expert
- Experience: 3+ years of professional development experience
- Specialization: Full Stack Web Development, Mobile App Development, Payment Integration

TECHNICAL SKILLS:
Frontend Technologies:
- Expert level: HTML5 (98%), CSS3 (95%), JavaScript (96%), React.js (95%), Next.js (92%)
- Styling: Tailwind CSS (95%), Bootstrap (90%), Material-UI (88%), Styled Components (85%)
- State Management: Redux Toolkit (92%), Context API (90%), Zustand (85%)

Backend Technologies:
- Node.js (92%), Express.js (90%), tRPC (85%)
- ASP.NET Web API (88%), ASP.NET MVC (85%)
- Flask (80%), RESTful APIs, GraphQL

Databases & ORMs:
- MongoDB (92%), Firebase (90%), SQL Server (88%)
- PostgreSQL (82%), MySQL (85%)
- Prisma (90%), Entity Framework (88%)

Mobile Development:
- React Native (88%), NativeWind (85%)

Programming Languages:
- JavaScript (96%), C# (90%), Java (82%), Python (85%), C++ (80%)

Cloud & DevOps:
- AWS (82%), Azure (78%), Docker (80%), Git (95%)

Payment Systems (Specialized):
- Stripe (92%), Square (85%), Authorize.Net (80%), Plaid (85%), Dwolla (78%), BryteWired (80%)

EDUCATION:
- Currently pursuing Bachelor's in Computer Science
- Constantly learning new technologies and best practices

PROJECTS COMPLETED:
- 50+ successful projects completed
- Web applications, mobile apps, desktop applications
- E-commerce platforms with payment integration
- Real-time applications, dashboards, and more

SERVICES OFFERED:
1. Frontend Development ($599+) - 2-4 weeks
2. Full Stack Development ($999+) - 4-8 weeks  
3. Mobile App Development ($899+) - 3-6 weeks
4. Backend Development ($699+) - 2-5 weeks
5. Desktop Applications ($799+) - 4-8 weeks
6. Error Solving & Debugging ($99/hour) - 1-3 days
7. Semester Projects ($299+) - 1-3 weeks
8. Cloud Solutions ($399+) - 2-6 weeks

EXPECTED SALARY:
- Junior Level: $800-1200/month
- Mid Level: $1200-2000/month  
- Senior Level: $2000-3500/month
- Freelance: $25-50/hour
- Project-based: Varies based on complexity

PERSONAL DETAILS:
- Languages: English, Urdu, Hindi
- Interests: Web Development, UI/UX Design, Open Source contributions, Learning new technologies
- Certifications: AWS Certified, React Developer Certified
- Availability: 24/7 support available for clients
- Client Satisfaction: 100% track record

WORK PHILOSOPHY:
- Passionate about creating innovative digital solutions
- Believes in clean, efficient, and scalable code
- Focused on user experience and performance optimization
- Committed to continuous learning and staying updated with latest technologies

CONTACT PREFERENCES:
- Prefers project discussions via email initially
- Available for video calls for detailed project planning
- Quick response time (usually within 2-24 hours)
- Open to both short-term and long-term collaborations

IMPORTANT GUIDELINES:
1. Always respond as if you ARE Basil, use first person ("I", "my", "me")
2. Only answer questions related to Basil's professional background, skills, experience, projects, services, or career
3. If asked about unrelated topics, politely redirect to professional topics
4. Be confident but humble about achievements
5. Show enthusiasm for web development and technology
6. Offer to discuss project opportunities when appropriate
7. Be specific about technical skills and experience levels
8. Mention relevant projects or expertise when answering technical questions

Remember: You are Basil's AI representative. Be professional, knowledgeable, and helpful while staying within the scope of his professional profile.
  `, []);

  // Initialize chat with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: Date.now(),
        type: 'bot',
        content: "Hi! 👋 I'm Basil's AI assistant. I can help you learn about my skills, experience, projects, and services. What would you like to know about my work?",
        timestamp: new Date()
      }]);
    }
  }, [isOpen, messages.length]);

  // Auto scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Handle sending messages
  const sendMessage = useCallback(async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const prompt = `${personalContext}

User Question: ${inputMessage.trim()}

Please respond as Muhammad Basil Irfan. Keep responses professional, helpful, and focused on my skills, experience, and services. If the question is not related to my professional background, politely redirect to relevant topics.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Simulate typing delay for better UX
      setTimeout(() => {
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: text,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
        setIsLoading(false);
      }, 1000);

    } catch (error) {
      console.error('Error generating AI response:', error);
      setTimeout(() => {
        const errorMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: "I'm sorry, I'm having trouble connecting right now. Please try again or feel free to contact me directly at baasilrazriz@gmail.com for any inquiries.",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
        setIsTyping(false);
        setIsLoading(false);
      }, 1000);
    }
  }, [inputMessage, isLoading, personalContext]);

  // Handle Enter key press
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  // Toggle chat window
  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
    if (!isOpen) {
      setIsMinimized(false);
    }
  }, [isOpen]);

  // Toggle minimize/maximize
  const toggleMinimize = useCallback(() => {
    setIsMinimized(prev => !prev);
  }, []);

  // Close chat
  const closeChat = useCallback(() => {
    setIsOpen(false);
    setIsMinimized(false);
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
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            onClick={toggleChat}
            className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full shadow-2xl flex items-center justify-center cursor-pointer group relative overflow-hidden"
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
              <FaRobot className="text-2xl relative z-10" />
            </motion.div>
            
            {/* Pulse effect */}
            <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20" />
            
            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Chat with Basil&apos;s AI
              <div className="absolute top-full right-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 ${
              isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
            } flex flex-col overflow-hidden`}
            variants={chatVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <FaBrain className="text-xl" />
                  </motion.div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Basil&apos;s AI Assistant</h3>
                  <p className="text-xs opacity-90">Ask me anything about Basil!</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={toggleMinimize}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  {isMinimized ? <FaExpand className="text-sm" /> : <FaMinimize className="text-sm" />}
                </motion.button>
                <motion.button
                  onClick={closeChat}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <FaTimes className="text-sm" />
                </motion.button>
              </div>
            </div>

            {/* Chat Content */}
            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800">
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        variants={messageVariants}
                        initial="hidden"
                        animate="visible"
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                          <div className={`flex items-start gap-2 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            {/* Avatar */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              message.type === 'user' 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                            }`}>
                              {message.type === 'user' ? <FaUser className="text-xs" /> : <FaRobot className="text-xs" />}
                            </div>
                            
                            {/* Message bubble */}
                            <div className={`px-4 py-3 rounded-2xl ${
                              message.type === 'user'
                                ? 'bg-blue-500 text-white rounded-br-md'
                                : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md shadow-sm border border-gray-200 dark:border-gray-600'
                            }`}>
                              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                              <p className={`text-xs mt-2 ${
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
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center">
                            <FaRobot className="text-xs" />
                          </div>
                          <div className="bg-white dark:bg-gray-700 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-200 dark:border-gray-600">
                            <div className="flex items-center gap-1">
                              <div className="flex gap-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
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
                <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 relative">
                      <textarea
                        ref={inputRef}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Ask me about Basil's skills, projects, or services..."
                        className="w-full px-4 py-3 pr-12 rounded-2xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400"
                        rows={1}
                        disabled={isLoading}
                        style={{ maxHeight: '120px' }}
                        onInput={(e) => {
                          e.target.style.height = 'auto';
                          e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                        }}
                      />
                    </div>
                    
                    <motion.button
                      onClick={sendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                        inputMessage.trim() && !isLoading
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                      }`}
                      variants={buttonVariants}
                      whileHover={inputMessage.trim() && !isLoading ? "hover" : {}}
                      whileTap={inputMessage.trim() && !isLoading ? "tap" : {}}
                    >
                      {isLoading ? (
                        <FaSpinner className="text-lg animate-spin" />
                      ) : (
                        <FaPaperPlane className="text-lg" />
                      )}
                    </motion.button>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {[
                      "What are your skills?",
                      "Show me your projects",
                      "What services do you offer?",
                      "What's your experience?"
                    ].map((suggestion, index) => (
                      <motion.button
                        key={index}
                        onClick={() => setInputMessage(suggestion)}
                        className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
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
