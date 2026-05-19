import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, User, Bot, Crown, Mic, MicOff } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { GoogleGenerativeAI } from "@google/generative-ai";
import '../styles/Chatbot.css';

const Chatbot = () => {
  const { isPremium } = useUser();
  const { user, addHistory } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const baseTextRef = useRef('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(120, Math.max(42, scrollHeight))}px`;
    }
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let speechText = '';
        for (let i = 0; i < event.results.length; ++i) {
          speechText += event.results[i][0].transcript;
        }
        const base = baseTextRef.current || '';
        setInput(base ? `${base} ${speechText.trim()}` : speechText.trim());
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        setIsListening(false);
      };
    }
  }, []);

  useEffect(() => {
    if (isOpen && addHistory) {
      addHistory('Visited HealHabit AI Coach', 'AI Coach');
    }
  }, [isOpen]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please try Chrome or Safari.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      baseTextRef.current = input;
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
      }
    }
  };
  
  const initialMessage = { 
    id: 1, 
    text: `Hello ${user?.name || 'Guest'}! I'm your Aura Wellness Coach. How can I help you improve your daily routine today?`, 
    sender: 'bot',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  const [messages, setMessages] = useState([initialMessage]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const userMsg = {
      id: Date.now(),
      text: input,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    if (addHistory) {
      addHistory(`Asked AI Coach: "${currentInput.length > 25 ? currentInput.slice(0, 25) + '...' : currentInput}"`, 'AI Coach');
    }
    setInput('');
    setIsTyping(true);

    try {
      // Enforce a 15-second maximum wait time for the AI response
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("The AI took too long to respond. Please try again.")), 15000)
      );
      
      const botResponse = await Promise.race([
        getAIResponse(currentInput, isPremium),
        timeoutPromise
      ]);

      const botMsg = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        isAI: isPremium,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      const botMsg = {
        id: Date.now() + 1,
        text: `<b>System Error:</b> ${error.message}<br/><br/><i>Tip: If this is a Quota error, you may need to wait for your daily limit to reset or check your API key status in Google AI Studio.</i>`,
        sender: 'bot',
        isAI: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const getAIResponse = async (query, premium) => {
    if (!premium) {
      return "I'm here to help! For deep analysis and step-by-step solutions, consider upgrading to Aura Premium.";
    }

    const userDataContext = `
    Current User Data:
    - Name: ${user?.name || 'User'}
    - Water Intake: ${user?.water || 0}L (Goal: 2.5L)
    - Screen Time: ${user?.screenTime || 'Unknown'}
    - Sleep Quality: ${user?.sleepQuality || 0}%
    - Focus Score: ${user?.focusScore || 0}/100
    `;

    const systemPrompt = `You are HealHabit AI, the official AI Wellness Coach for the HealHabit platform. 
    Your goal is to help users improve their habits and digital well-being.
    
    Current User Data from HealHabit Wellness:
    ${userDataContext}
    
    Instructions:
    1. If the user's question is about health, habits, wellness, or their current stats on this website, use the "Current User Data" above to provide a highly personalized, data-driven response.
    2. If the user asks a general question not related to HealHabit Wellness or health, answer it normally using your general knowledge, but maintain your polite and professional "HealHabit" persona.
    3. Always respond in a point-wise format using HTML tags (<b>, <ul>, <li>, <p>) for a clean, user-friendly UI. <b>CRITICAL: Use <b> tags to bold all important keywords, goals, and metrics.</b>
    4. Keep answers concise, helpful, and encouraging.
    
    User Question: ${query}`;

    // 1. Try Gemini 1.5 Flash first (Optimized for ultra-low latency)
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const result = await model.generateContent(systemPrompt);
      const response = await result.response;
      let text = response.text();
      text = text.replace(/```html/g, '').replace(/```/g, '').trim();
      return text;
    } catch (geminiError) {
      console.error("Gemini API failed:", geminiError);
      throw new Error(`Gemini Error: ${geminiError.message || "Failed to connect to Google Gemini. Please check your API key."}`);
    }
  };

  return (
    <div className="chatbot-container">
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="chat-overlay"
              onClick={() => setIsOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="chat-window glass-card"
            >
            <div className="chat-header">
              <div className="chat-header-info">
                <div className="bot-avatar">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h4>HealHabit AI Coach</h4>
                  <span className="status">Always here to help you</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="close-btn">
                <X size={20} />
              </button>
            </div>

            <div className="chat-messages">
              {messages.map((msg) => (
                <div key={msg.id} className={`message-wrapper ${msg.sender}`}>
                  <div className="message-avatar">
                    {msg.sender === 'bot' ? (msg.isAI ? <Crown size={14} className="premium-icon" /> : <Bot size={14} />) : <User size={14} />}
                  </div>
                  <div className={`message-bubble ${msg.isAI ? 'premium-ai' : ''}`}>
                    {msg.isAI && <div className="ai-badge">Premium AI</div>}
                    {msg.sender === 'bot' && msg.isAI ? (
                      <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                    ) : (
                      <p>{msg.text}</p>
                    )}
                    <span className="message-time">{msg.time}</span>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="message-wrapper bot">
                  <div className="message-avatar"><Bot size={14} /></div>
                  <div className="message-bubble typing">
                    <div className="dot-flashing"></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area">
              <textarea 
                ref={textareaRef}
                placeholder={isListening ? "Listening..." : "Ask your coach anything..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
              />
              <button 
                className={`mic-btn ${isListening ? 'listening' : ''}`}
                onClick={toggleListening}
                title={isListening ? "Stop listening" : "Start voice input"}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
              <button onClick={handleSend} className="send-btn">
                <Send size={18} />
              </button>
            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="chat-trigger btn-primary"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </motion.button>
    </div>
  );
};

export default Chatbot;
