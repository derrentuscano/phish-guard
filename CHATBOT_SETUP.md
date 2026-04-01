# 🤖 PhishGuard AI ChatBot Setup Guide

## Overview

The AI ChatBot is powered by **Google Gemini 1.5 Flash** and provides:

- 24/7 cybersecurity assistance
- Answers about PhishGuard features
- Phishing detection tips
- Password security guidance
- Context-aware responses based on user progress

## 🔑 Getting Your Free API Key

### Step 1: Get Gemini API Key

1. Visit: **https://aistudio.google.com/app/apikey** (Updated URL)
2. Sign in with your Google account
3. Click **"Get API Key"** or **"Create API Key"**
4. **Important**: Make sure to select **"Create API key in new project"** for better quota management
5. Copy your API key (starts with `AIza...`)

### ⚠️ Common Issues:

**"Quota exceeded" Error (429)**:

- Your API key may have exhausted its free tier quota
- Free tier resets daily
- Solution: Create a **new API key in a new project** at https://aistudio.google.com/app/apikey
- Or wait 24 hours for quota reset

**Model Not Found (404)**:

- The chatbot now uses `gemini-2.0-flash-lite` (faster, better free tier support)
- Updated: February 2026 - Gemini 1.5 models deprecated

### Step 2: Add API Key to Your Project

1. Create a `.env` file in the project root (if it doesn't exist):

```bash
cp .env.example .env
```

2. Open `.env` and add your Gemini API key:

```env
VITE_GEMINI_API_KEY=AIzaSyC...your_actual_key_here
```

3. **Important**: Never commit `.env` to version control! It should already be in `.gitignore`.

### Step 3: Restart Development Server

```bash
npm run dev
```

The chatbot will now work! Look for the green chat bubble in the bottom-right corner.

## 🎯 Features

### Smart Context Awareness

The chatbot knows:

- Your name and display name
- Your current level (Beginner, Intermediate, etc.)
- Your score and progress
- Badges you've earned
- Your learning streak

### Topic Restrictions

The bot **ONLY** answers questions about:

- ✅ PhishGuard features and how to use them
- ✅ Cybersecurity concepts (phishing, malware, etc.)
- ✅ Password security and best practices
- ✅ Email safety and suspicious links
- ✅ Online security tips

If asked about unrelated topics (sports, cooking, etc.), it will politely redirect to cybersecurity topics.

### Quick Prompts

Pre-defined questions include:

- "What is phishing?"
- "How do I spot a phishing email?"
- "What features does PhishGuard offer?"
- "Tips for creating strong passwords"
- "How can I improve my security score?"
- "What are common phishing techniques?"

## 💰 API Costs & Limits

### Free Tier (Gemini 1.5 Flash)

- **15 requests per minute**
- **1,500 requests per day**
- **1 million requests per month**
- This is MORE than enough for most applications!

### Cost (If you exceed free tier)

- Input: $0.075 per 1 million tokens
- Output: $0.30 per 1 million tokens
- **Very affordable** - typical chat costs less than $0.001

### Rate Limiting

The chatbot automatically handles rate limits. If you hit the limit, it will show an error message.

## 🛠️ Customization

### Change AI Model

Edit `/src/components/ChatBot/ChatBot.jsx` line 130:

```javascript
// Current: gemini-1.5-flash (fastest, free)
// Options:
// - gemini-1.5-flash-latest (fastest, recommended)
// - gemini-1.5-pro-latest (more capable, slower)
// - gemini-1.0-pro (older, stable)
```

### Modify System Prompt

Edit lines 95-125 in `ChatBot.jsx` to change:

- Bot personality
- Topics it can discuss
- Response format
- Context awareness

### Styling

Edit `/src/components/ChatBot/ChatBot.css` to customize:

- Colors (currently green theme)
- Size and position
- Animations
- Mobile responsiveness

## 🔒 Security Best Practices

1. **Never expose API key in frontend code** - Always use environment variables
2. **Add rate limiting** - Consider adding backend proxy for production
3. **Monitor usage** - Check Google AI Studio dashboard regularly
4. **Sanitize inputs** - Already implemented in the component
5. **Content filtering** - Gemini has built-in safety filters

## 🐛 Troubleshooting

### "API key not configured" Error

- Check `.env` file exists in project root
- Verify `VITE_GEMINI_API_KEY=AIza...` is set
- Restart dev server (`npm run dev`)
- Clear browser cache

### "API error: 429" (Rate Limit)

- You've exceeded 15 requests/minute
- Wait 60 seconds and try again
- Consider implementing request queue

### "API error: 400" (Bad Request)

- Check API key is valid
- Verify you copied the full key (starts with `AIza`)
- Try generating a new key

### Bot Not Responding

- Open browser console (F12) and check for errors
- Verify internet connection
- Check if API key has proper permissions

### "Blocked by CORS" Error

- This shouldn't happen with Gemini API
- If it does, check if you're using a VPN/proxy
- Try disabling browser extensions

## 📊 Monitoring Usage

1. Visit: https://makersuite.google.com/
2. Click on your project
3. View **"API Usage"** tab
4. Monitor requests, tokens, and errors

## 🚀 Production Deployment

### Option 1: Client-Side (Current)

**Pros**: Simple, no backend needed
**Cons**: API key visible in network tab (though requests are still secure)

### Option 2: Backend Proxy (Recommended for Production)

Create a Firebase Function or API route that:

1. Receives chat messages from frontend
2. Calls Gemini API with server-side key
3. Returns response to frontend

This keeps your API key completely hidden.

## 📝 Usage Tips

### For Best Results:

1. Ask specific questions about PhishGuard or cybersecurity
2. Be clear and concise
3. Use the quick prompts for common questions
4. Clear chat if starting a new topic

### Example Good Questions:

- "How do I use the Email Simulation feature?"
- "What are red flags in a phishing email?"
- "Explain password hashing"
- "How do badges work in PhishGuard?"

### Example Questions It Won't Answer:

- "What's the weather today?" ❌
- "Tell me a joke" ❌
- "What sports are on TV?" ❌

## 🎨 UI Features

- **Floating bubble** - Always accessible, bottom-right corner
- **Expandable window** - 400x600px (responsive on mobile)
- **Typing indicator** - Shows when AI is thinking
- **Message history** - Persists in session storage
- **Auto-scroll** - Always shows latest message
- **Quick prompts** - Suggested questions on first load
- **Clear chat** - Start fresh conversation
- **Dark mode** - Automatically adapts to system preference

## 🔗 Additional Resources

- [Google AI Studio](https://makersuite.google.com/)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Gemini Pricing](https://ai.google.dev/pricing)
- [Rate Limits Guide](https://ai.google.dev/docs/rate_limits)

## 📞 Support

If you encounter issues:

1. Check this guide first
2. Review browser console errors
3. Verify API key configuration
4. Check Google AI Studio dashboard
5. Try with a fresh API key

---

**Enjoy your AI-powered PhishGuard assistant! 🛡️🤖**
