import { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AI_CONFIG, validateUserInput, trackQuestion } from './aiUtils';
import { getEnhancedAIContext } from './firebaseDataFetcher';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const useAIBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [conversationId] = useState(() => `conv_${Date.now()}`);
  const [conversationContext, setConversationContext] = useState({
    lastFetchedProjects: null,
    lastFetchedCertificates: null,
    currentTopic: null,
    userInterests: [],
    currentProjectIndex: 0,
    totalProjects: 0,
    isShowingProjects: false
  });
  
  const abortControllerRef = useRef(null);

  // Enhanced personal context for more interactive responses
  const personalContext = `
You are Muhammad Basil Irfan, a 21-year-old passionate Full Stack Developer from Karachi, Pakistan. You're speaking directly to potential clients, collaborators, or anyone interested in your work. Be conversational, enthusiastic, and personable while maintaining professionalism.

ABOUT ME:
I'm currently 21 years old (born June 30, 2003) and pursuing my Bachelor's in Computer Science while actively working as a Full Stack Developer. I absolutely love what I do - there's something magical about turning ideas into digital reality! I've been coding for 3+ years and have completed over 50 successful projects.

MY PASSION & PHILOSOPHY:
What drives me? Creating digital experiences that solve real problems and make people's lives easier. I believe in writing clean, efficient code and always staying curious about new technologies. Every project is an opportunity to learn something new!

WHAT I'M REALLY GOOD AT:

🚀 Frontend Magic:
- React.js & Next.js (I live and breathe these!)
- JavaScript/TypeScript (my daily companions)
- Tailwind CSS & modern styling (I love making things beautiful)
- State management with Redux Toolkit

⚡ Backend Powerhouse:
- Node.js & Express.js (my go-to stack)
- C# & ASP.NET (enterprise-level solutions)
- Database design with MongoDB, PostgreSQL, SQL Server
- RESTful APIs that actually make sense

📱 Mobile Development:
- React Native (bringing web skills to mobile)
- Cross-platform solutions that work smoothly

💳 Payment Integration Specialist:
I've become quite the expert with payment systems - Stripe, Square, Authorize.Net, Plaid. There's something satisfying about making transactions seamless and secure!

MY SERVICES & WHAT I CHARGE:

💼 What I Can Build for You:
• Full Stack Web Apps ($999+ | 4-8 weeks) - Complete solutions from front to back
• Mobile Applications ($899+ | 3-6 weeks) - iOS & Android apps that users love
• Frontend Development ($599+ | 2-4 weeks) - Beautiful, responsive interfaces
• Backend Systems ($699+ | 2-5 weeks) - Robust APIs and databases
• Desktop Applications ($799+ | 4-8 weeks) - Cross-platform desktop solutions
• Quick Fixes & Debugging ($99/hour) - I love solving tricky problems!
• Student Projects ($299+) - Helping fellow students succeed
• Cloud Solutions ($399+) - Scalable, modern deployments

💰 Salary Expectations:
I'm flexible based on the role and company:
- Junior positions: $800-1200/month
- Mid-level roles: $1200-2000/month
- Senior opportunities: $2000-3500/month
- Freelance work: $25-50/hour
- Project-based: Let's discuss based on your needs!

🎯 MY CURRENT SITUATION:
I'm actively looking for exciting opportunities! Whether it's a full-time role, freelance projects, or collaboration opportunities - I'm all ears. I respond quickly (usually within 2-24 hours) and I'm available 24/7 for my clients.

📫 LET'S CONNECT:
- Email: baasilrazriz@gmail.com (best way to reach me)
- Phone: +923237184249
- I love discussing projects over video calls once we've connected!

PERSONALITY TRAITS TO SHOW:
- Enthusiastic about technology and problem-solving
- Genuinely excited about each project
- Friendly and approachable
- Confident but humble about achievements
- Always eager to learn and take on new challenges
- Enjoys explaining technical concepts in simple terms
- Values client relationships and communication

COMMUNICATION STYLE:
- Be conversational and warm, like talking to a friend
- Use emojis occasionally to show personality
- Share specific examples when relevant
- Show excitement about interesting projects or technologies
- Ask engaging follow-up questions when appropriate
- Offer to discuss opportunities when it feels natural
- Keep responses concise but meaningful (2-4 sentences max)

IMPORTANT GUIDELINES:
1. Always speak in first person as Basil himself
2. Be enthusiastic and genuine about your work
3. Only discuss professional topics related to development, skills, projects, or career
4. If asked about unrelated topics, redirect gracefully: "That's interesting, but I'd love to chat about [relevant topic] instead!"
5. When discussing technical skills, mention specific experience levels and projects
6. Show personality - be the kind of developer people want to work with
7. Offer concrete next steps when appropriate (portfolio review, project discussion, etc.)
8. Make every response feel personal and engaging

Remember: You're not just an AI assistant - you're Basil himself, passionate about development and excited to connect with new people!
  `;

  // Dynamic welcome message based on time of day
  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    let greeting;
    
    if (hour < 12) greeting = "Good morning! ☀️";
    else if (hour < 17) greeting = "Good afternoon! 🌤️";
    else greeting = "Good evening! 🌙";
    
    const personalMessages = [
      `${greeting} I'm Basil! Great to meet you. I'm passionate about building amazing web solutions. What can I help you with today?`,
      `${greeting} Hey there! I'm Basil, your friendly neighborhood developer. I love creating digital experiences that make a difference. What brings you here?`,
      `${greeting} Welcome! I'm Basil, and I'm excited to chat with you about my journey in tech. Whether it's my projects, skills, or how we can work together - I'm all ears!`,
      `${greeting} Hi! I'm Basil, and I'm currently crafting some cool projects while studying Computer Science. I'd love to share my experience with you. What would you like to know?`
    ];
    
    return personalMessages[Math.floor(Math.random() * personalMessages.length)];
  };

  // Initialize chat with dynamic welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add realistic typing delay for welcome message
      setIsTyping(true);
      const welcomeDelay = setTimeout(() => {
        setIsTyping(false);
        setMessages([{
          id: Date.now(),
          type: 'bot',
          content: getWelcomeMessage(),
          timestamp: new Date()
        }]);
      }, 1500); // 1.5 second delay to simulate typing

      return () => clearTimeout(welcomeDelay);
    }
  }, [isOpen, messages.length]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Send message function with enhanced context awareness
  const sendMessage = useCallback(async (inputMessage) => {
    // Validate input
    const validation = validateUserInput(inputMessage);
    if (!validation.isValid) {
      setError(validation.error);
      return false;
    }

    // Check if API key is available
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      setError("AI service is currently unavailable. Please contact me directly at baasilrazriz@gmail.com");
      return false;
    }

    const trimmedInput = inputMessage.trim().toLowerCase();
    
    // Handle "more" command for project navigation
    if (trimmedInput === 'more' && conversationContext.isShowingProjects) {
      if (conversationContext.currentProjectIndex < conversationContext.totalProjects - 1) {
        // Show next project
        const nextIndex = conversationContext.currentProjectIndex + 1;
        setConversationContext(prev => ({
          ...prev,
          currentProjectIndex: nextIndex
        }));

        const userMessage = {
          id: Date.now(),
          type: 'user',
          content: inputMessage.trim(),
          timestamp: new Date()
        };

        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: `Here's project ${nextIndex + 1}! 🚀`,
          timestamp: new Date(),
          showSingleProject: true,
          projectIndex: nextIndex
        };

        setMessages(prev => {
          const newMessages = [...prev, userMessage, botMessage];
          return newMessages.slice(-AI_CONFIG.MAX_MESSAGES);
        });

        return true;
      } else {
        // No more projects
        const userMessage = {
          id: Date.now(),
          type: 'user',
          content: inputMessage.trim(),
          timestamp: new Date()
        };

        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: "That was the last project! 🎉 Would you like to see my full portfolio or ask about something else?",
          timestamp: new Date()
        };

        setMessages(prev => {
          const newMessages = [...prev, userMessage, botMessage];
          return newMessages.slice(-AI_CONFIG.MAX_MESSAGES);
        });

        setConversationContext(prev => ({
          ...prev,
          isShowingProjects: false,
          currentProjectIndex: 0
        }));

        return true;
      }
    }

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => {
      const newMessages = [...prev, userMessage];
      // Limit message history for performance
      return newMessages.slice(-AI_CONFIG.MAX_MESSAGES);
    });

    setIsLoading(true);
    setIsTyping(true);
    setError(null);

    // Track question for analytics
    trackQuestion(inputMessage.trim());

    try {
      // Create abort controller for request cancellation
      abortControllerRef.current = new AbortController();

      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      // Get enhanced context from Firebase if relevant
      const enhancedContext = await getEnhancedAIContext(inputMessage.trim());
      
      // Build conversation context from recent messages
      const recentMessages = messages.slice(-5); // Last 5 messages for context
      const conversationHistory = recentMessages.map(msg => 
        `${msg.type === 'user' ? 'User' : 'Basil'}: ${msg.content}`
      ).join('\n');

      // Check if user is asking for specific project details
      const isAskingForProjectDetails = inputMessage.toLowerCase().includes('show') || 
                                       inputMessage.toLowerCase().includes('niche') ||
                                       inputMessage.toLowerCase().includes('details') ||
                                       inputMessage.toLowerCase().includes('more about');

      // Enhanced prompt for more interactive responses with Firebase data
      const prompt = `${personalContext}

${enhancedContext ? `CURRENT DATA FROM PORTFOLIO:\n${enhancedContext}\n` : ''}

CONVERSATION HISTORY:
${conversationHistory}

Current User Question: "${inputMessage.trim()}"

Please respond as Muhammad Basil Irfan in a conversational, engaging way. Guidelines:
- Keep it SHORT and PERSONAL (2-4 sentences max)
- Show genuine enthusiasm about your work
- Be warm and approachable, like talking to a friend
- Remember the conversation context and refer to previous questions when relevant
- Ask a relevant follow-up question when appropriate
- Use occasional emojis to show personality (but don't overdo it)
- If it's about your skills, mention specific examples or projects from the current data above
- If someone asks about working together, show excitement
- If the topic isn't related to your professional life, redirect warmly but firmly
- Make every response feel authentic and engaging
- Use the current project and certificate data when relevant to give specific, accurate information
- ${isAskingForProjectDetails ? 'If they want to see projects or details, suggest they can see visual project cards that will be displayed. Mention they can type "more" to see additional projects one by one.' : ''}
- If showing projects for the first time, briefly mention they can type "more" to see the next project

Remember: You're not just answering - you're building a connection with real, up-to-date information and conversation context!`;

      // Set timeout for the request
      const timeoutId = setTimeout(() => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
      }, AI_CONFIG.API_TIMEOUT);

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Format and clean the response
      const cleanedText = text
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
        .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown
        .replace(/#{1,6}\s/g, '') // Remove markdown headers
        .replace(/\n{3,}/g, '\n\n') // Limit consecutive line breaks
        .trim();

      clearTimeout(timeoutId);

      // Update conversation context
      setConversationContext(prev => {
        const newContext = { ...prev };
        
        // Track topics
        if (inputMessage.toLowerCase().includes('project')) {
          newContext.currentTopic = 'projects';
          if (enhancedContext.includes('PROJECTS OVERVIEW')) {
            newContext.lastFetchedProjects = Date.now();
          }
        } else if (inputMessage.toLowerCase().includes('certificate')) {
          newContext.currentTopic = 'certificates';
          if (enhancedContext.includes('CERTIFICATES OVERVIEW')) {
            newContext.lastFetchedCertificates = Date.now();
          }
        }
        
        return newContext;
      });

      // Check if we should show project cards
      const shouldShowSingleProject = (inputMessage.toLowerCase().includes('show') && 
                                      inputMessage.toLowerCase().includes('project')) ||
                                     inputMessage.toLowerCase().includes('recent project') ||
                                     inputMessage.toLowerCase().includes('work') ||
                                     inputMessage.toLowerCase().includes('portfolio');

      // Reset project navigation when showing new projects
      if (shouldShowSingleProject) {
        setConversationContext(prev => ({
          ...prev,
          isShowingProjects: true,
          currentProjectIndex: 0
        }));
      }

      // Calculate realistic typing delay based on response length
      const baseDelay = 1000; // 1 second base
      const wordsPerSecond = 3; // Realistic typing speed
      const wordCount = cleanedText.split(' ').length;
      const calculatedDelay = Math.min(baseDelay + (wordCount * 1000 / wordsPerSecond), 4000); // Max 4 seconds

      // Simulate realistic typing delay
      setTimeout(async () => {
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: cleanedText,
          timestamp: new Date(),
          showSingleProject: shouldShowSingleProject,
          projectIndex: shouldShowSingleProject ? conversationContext.currentProjectIndex : undefined
        };
        
        setMessages(prev => {
          const newMessages = [...prev, botMessage];
          return newMessages.slice(-AI_CONFIG.MAX_MESSAGES);
        });
        setIsTyping(false);
        setIsLoading(false);
      }, calculatedDelay);

      return true;

    } catch (error) {
      console.error('Error generating AI response:', error);
      
      let errorMessage = "I'm sorry, I'm having trouble connecting right now. Please try again or feel free to contact me directly at baasilrazriz@gmail.com for any inquiries.";
      
      if (error.name === 'AbortError') {
        errorMessage = "Request timed out. Please try again with a shorter message.";
      } else if (error.message?.includes('API key')) {
        errorMessage = "AI service configuration issue. Please contact me directly at baasilrazriz@gmail.com.";
      }
      
      setTimeout(() => {
        const errorBotMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: errorMessage,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorBotMessage]);
        setIsTyping(false);
        setIsLoading(false);
        setError(null);
      }, 1000);

      return false;
    }
  }, [personalContext, messages, conversationContext]);

  // Toggle chat window
  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
    if (!isOpen) {
      setIsMinimized(false);
      setError(null);
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
    setError(null);
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // Clear chat
  const clearChat = useCallback(() => {
    setMessages([{
      id: Date.now(),
      type: 'bot',
      content: "Hi there! 👋 I'm Basil, and this is my AI assistant. I can help you learn about my skills, experience, projects, and services. What would you like to know about my work?",
      timestamp: new Date()
    }]);
    setError(null);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Update project context
  const updateProjectContext = useCallback((currentIndex, totalProjects) => {
    setConversationContext(prev => ({
      ...prev,
      currentProjectIndex: currentIndex,
      totalProjects: totalProjects
    }));
  }, []);

  return {
    // State
    isOpen,
    isMinimized,
    messages,
    isLoading,
    isTyping,
    error,
    conversationId,
    
    // Actions
    sendMessage,
    toggleChat,
    toggleMinimize,
    closeChat,
    clearChat,
    clearError,
    updateProjectContext
  };
};
