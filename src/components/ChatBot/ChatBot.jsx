import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Loader } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import './ChatBot.css';

const ChatBot = ({ user, userData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Quick prompt suggestions
  const quickPrompts = [
    "What is phishing?",
    "How do I spot a phishing email?",
    "What features does PhishGuard offer?",
    "Tips for creating strong passwords",
    "How can I improve my security score?",
    "What are common phishing techniques?"
  ];

  // Load conversation from session storage
  useEffect(() => {
    const savedMessages = sessionStorage.getItem('chatHistory');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      // Welcome message
      setMessages([{
        role: 'assistant',
        content: `👋 Hi ${userData?.displayName || 'there'}! I'm your PhishGuard AI assistant. I can help you with:\n\n• Understanding phishing attacks\n• Using PhishGuard features\n• Cybersecurity best practices\n• Password security tips\n• Email safety guidance\n\nWhat would you like to know?`,
        timestamp: Date.now()
      }]);
    }
  }, [userData]);

  // Save conversation to session storage
  useEffect(() => {
    if (messages.length > 1) {
      sessionStorage.setItem('chatHistory', JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text = input) => {
    if (!text.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: text,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Get AI response
      const aiResponse = await getGeminiResponse([...messages, userMessage]);
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: aiResponse,
        timestamp: Date.now()
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Sorry, I encountered an error. Please try again or check your API configuration.',
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const getGeminiResponse = async (conversationHistory) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.REACT_APP_GEMINI_API_KEY;
    
    if (!apiKey) {
      return "⚠️ API key not configured. Please add VITE_GEMINI_API_KEY to your .env file.\n\nGet your free API key at: https://aistudio.google.com/app/apikey\n\n**Important**: Create API key in a NEW project for best quota management.";
    }

    // Build context-aware system prompt
    const systemPrompt = `You are PhishGuard AI Assistant, a helpful cybersecurity expert for the PhishGuard training platform.

STRICT RULES:
- ONLY answer questions about PhishGuard features, cybersecurity, phishing, online safety, passwords, and related security topics
- If asked about unrelated topics (sports, cooking, movies, etc.), politely decline and redirect to cybersecurity topics
- Be concise, friendly, and educational
- Use emojis occasionally for engagement
- Format responses with bullet points when listing items

PHISHGUARD FEATURES YOU CAN EXPLAIN:

🔐 AUTHENTICATION & USER MANAGEMENT:
• User Registration & Login - Secure Firebase authentication
• User Profiles - Customize with display name, bio, avatar (20+ emoji options), activity tracking

🎯 SECURITY ANALYSIS TOOLS:
• Link Analyzer - Multi-engine URL threat detection with VirusTotal & Google Safe Browsing integration, 7 heuristic rules, 0-100 threat score
• Password Strength Checker - Real-time analysis with 8-criteria evaluation, entropy calculation, improvement suggestions
• File Scanner - Deep forensic analysis with 80+ file signatures, magic byte detection, VirusTotal hash lookup, <100MB limit
• Image Detector - Multiple modes (Classic/Advanced/AI Vision/Full Power) with EXIF, ELA, FFT, PRNU fingerprinting, Groq AI analysis
• Reverse Image Search - Gemini Vision AI integration, manipulation detection, authenticity scoring
• Link Preview - Hover-based real-time link checking, browser extension integration, historical scan records

📊 USER EXPERIENCE & GAMIFICATION:
• Dashboard - Overview of all tools with quick access navigation
• User Statistics - Track scans performed, articles read, detection rates, achievements
• Badge System - Earn achievements based on performance (Beginner, Expert, Master)
• Streak Tracking - Build consistent learning habits and track daily progress
• Performance Stats - Monitor learning progress and improvement over time

🤖 AI-POWERED ASSISTANCE:
• ChatBot (AI Assistant) - 24/7 cybersecurity guidance powered by Google Gemini API, context-aware responses

🌐 BROWSER EXTENSION:
• PhishGuard Link Preview Extension - Hover-over scanning on any website, real-time threat detection, tooltip display, synchronized with main platform

👨‍💼 ADMIN CAPABILITIES:
• Analytics Dashboard - View platform statistics, user metrics, top performers
• User Management - Track user activity and progress
• Scenario Management - Create/edit phishing scenarios
• Content Management - Manage educational articles and resources

USER CONTEXT:
- Name: ${userData?.displayName || 'User'}
- Level: ${calculateUserLevel(userData?.score || 0)}
- Score: ${userData?.score || 0} points
- Badges Earned: ${userData?.earnedBadges?.length || 0}
- Current Streak: ${userData?.currentStreak || 0} days

Provide helpful, accurate cybersecurity advice while staying on-topic.`;

    // Convert conversation to Gemini format
    const contents = conversationHistory
      .filter(msg => msg.role !== 'system')
      .map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

    // Add system prompt as first user message
    contents.unshift({
      role: 'user',
      parts: [{ text: systemPrompt }]
    });
    contents.splice(1, 0, {
      role: 'model',
      parts: [{ text: 'Understood. I will only answer questions about PhishGuard and cybersecurity topics.' }]
    });

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: contents,
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            },
            safetySettings: [
              {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              }
            ]
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Gemini API error:', errorData);
        console.error('Status:', response.status);
        console.error('Status Text:', response.statusText);
        
        // Return user-friendly error messages
        if (response.status === 400) {
          return `⚠️ API Error: Bad request. Please check your API key is correct.\n\nYour key: ${apiKey.substring(0, 10)}...\n\nVerify at: https://aistudio.google.com/app/apikey`;
        } else if (response.status === 403) {
          return `⚠️ API Error: Access forbidden. Your API key may not have proper permissions.\n\nTry generating a new key at: https://aistudio.google.com/app/apikey`;
        } else if (response.status === 429) {
          const errorMessage = errorData.error?.message || '';
          if (errorMessage.includes('quota')) {
            return `⚠️ **Quota Exceeded!** Your API key has run out of free tier requests.\n\n**Solutions:**\n1. Create a **NEW API key** in a **NEW project** at: https://aistudio.google.com/app/apikey\n2. Wait 24 hours for quota to reset\n3. Check your usage at: https://aistudio.google.com/\n\nFree Tier: 1500 requests/day per project`;
          }
          return `⚠️ Rate limit exceeded. Please wait a moment and try again.\n\nFree tier limit: 15 requests/minute`;
        }
        
        throw new Error(`API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      
      // Check if response has expected structure
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        console.error('Unexpected API response:', data);
        return `⚠️ Received an unexpected response from the API. Please try again.\n\nIf this persists, check the browser console for details.`;
      }
      
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API call failed:', error);
      console.error('Error details:', error.message);
      
      // Network errors
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        return `⚠️ Network Error: Could not connect to Gemini API.\n\n• Check your internet connection\n• Verify API endpoint is accessible\n• Try disabling VPN/proxy if you're using one`;
      }
      
      throw error;
    }
  };

  const calculateUserLevel = (score) => {
    if (score >= 500) return 'Master';
    if (score >= 300) return 'Expert';
    if (score >= 150) return 'Advanced';
    if (score >= 50) return 'Intermediate';
    return 'Beginner';
  };

  const handleQuickPrompt = (prompt) => {
    setInput(prompt);
    sendMessage(prompt);
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: `Chat cleared! How can I help you with PhishGuard or cybersecurity?`,
      timestamp: Date.now()
    }]);
    sessionStorage.removeItem('chatHistory');
  };

  return (
    <>
      {/* Chat Bubble */}
      {!isOpen && (
        <button 
          className="chatbot-bubble"
          onClick={() => setIsOpen(true)}
          aria-label="Open chat"
        >
          <MessageCircle size={24} />
          <span className="chatbot-badge">AI</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <img src="/phishguardlogo.svg" alt="PhishGuard" className="chatbot-header-logo" />
              <div>
                <h3>PhishGuard AI Assistant</h3>
                <span className="chatbot-status">
                  <span className="status-dot"></span>
                  Online
                </span>
              </div>
            </div>
            <button 
              className="chatbot-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div 
                key={idx}
                className={`chat-message ${msg.role}`}
              >
                <div className="message-content">
                  {msg.role === 'assistant' && (
                    <div className="message-avatar">
                      <img src="/phishguardlogo.svg" alt="AI" className="avatar-logo" />
                    </div>
                  )}
                  <div className="message-text">
                    {msg.role === 'assistant' ? (
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="chat-message assistant">
                <div className="message-content">
                  <div className="message-avatar">
                    <img src="/phishguardlogo.svg" alt="AI" className="avatar-logo" />
                  </div>
                  <div className="message-text typing-indicator">
                    <Loader size={16} className="spinner-icon" />
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length <= 1 && (
            <div className="chatbot-quick-prompts">
              <p className="quick-prompts-label">Quick questions:</p>
              {quickPrompts.slice(0, 4).map((prompt, idx) => (
                <button
                  key={idx}
                  className="quick-prompt-btn"
                  onClick={() => handleQuickPrompt(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="chatbot-input-container">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about PhishGuard or cybersecurity..."
              className="chatbot-input"
              disabled={isLoading}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="chatbot-send-btn"
              aria-label="Send message"
            >
              <Send size={20} />
            </button>
          </div>

          {/* Footer */}
          <div className="chatbot-footer">
            <button onClick={clearChat} className="clear-chat-btn">
              Clear chat
            </button>
            <span className="powered-by">Powered by Gemini AI</span>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
