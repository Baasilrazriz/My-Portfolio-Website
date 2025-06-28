// AI Bot Configuration and Utils
export const AI_CONFIG = {
  MAX_MESSAGES: 50, // Limit message history for performance
  TYPING_DELAY: 1000, // Simulate typing delay
  MAX_INPUT_LENGTH: 500, // Character limit for user input
  API_TIMEOUT: 30000, // 30 seconds timeout
};

export const QUICK_QUESTIONS = [
  "Show me your recent projects 🚀",
  "What's your favorite project? �",
  "Available for work? 💼",
  "Tell me about React skills ⚛️",
  "What technologies do you use? 🛠️",
  "Show me featured projects ⭐",
  "How do you solve problems? 🧠",
  "What makes you passionate? ✨"
];

export const formatAIResponse = (text) => {
  // Add proper formatting for better readability
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
    .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic text
    .replace(/\n/g, '<br/>') // Line breaks
    .replace(/- /g, '• '); // Better bullet points
};

export const validateUserInput = (input) => {
  if (!input || input.trim().length === 0) {
    return { isValid: false, error: "Please enter a message" };
  }
  
  if (input.length > AI_CONFIG.MAX_INPUT_LENGTH) {
    return { 
      isValid: false, 
      error: `Message too long. Please keep it under ${AI_CONFIG.MAX_INPUT_LENGTH} characters.` 
    };
  }
  
  return { isValid: true };
};

export const generateConversationId = () => {
  return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Analytics helper for tracking popular questions
export const trackQuestion = (question) => {
  try {
    const questions = JSON.parse(localStorage.getItem('ai_bot_questions') || '{}');
    questions[question] = (questions[question] || 0) + 1;
    localStorage.setItem('ai_bot_questions', JSON.stringify(questions));
  } catch (error) {
    console.warn('Failed to track question:', error);
  }
};

export const getPopularQuestions = () => {
  try {
    const questions = JSON.parse(localStorage.getItem('ai_bot_questions') || '{}');
    return Object.entries(questions)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([question]) => question);
  } catch (error) {
    console.warn('Failed to get popular questions:', error);
    return QUICK_QUESTIONS.slice(0, 5);
  }
};
