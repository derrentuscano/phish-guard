# 🛡️ PhishGuard - Phishing Awareness & Detection Training Platform

**Tagline:** Train users to recognize cyber threats before they fall for them.

## 🎯 Overview

PhishGuard is an interactive web application that simulates phishing attacks and teaches users how to identify malicious emails, links, and websites in a safe, educational environment.

## 🧠 Problem It Solves

- Many people fall for phishing emails
- Lack of cybersecurity awareness among students and professionals
- Need for safe training environments to practice threat detection

## ⚙️ Tech Stack

| Layer    | Technology              |
| -------- | ----------------------- |
| Frontend | React + Vite            |
| Auth     | Firebase Authentication |
| Database | Firestore               |
| Hosting  | Firebase Hosting        |

## ✨ Key Features

### 👤 User Authentication

- User account management
- Progress tracking across sessions

### 📧 Phishing Simulation

- Realistic fake emails displayed in UI
- User classification: Safe, Suspicious, or Phishing
- Instant feedback with explanations

### 🔍 Link Analyzer

- Educational URL analysis tool
- Identify suspicious patterns:
  - Misspelled domains
  - Character substitutions
  - Fake subdomains
  - HTTP vs HTTPS

### 🎯 Quiz Mode

- Multiple phishing scenarios
- Score-based learning
- Progressive difficulty

### 📊 Performance Dashboard

- Track accuracy percentage
- Identify weak areas
- Progress over time

### 🏆 Gamification

- Level progression (Beginner → Expert)
- Achievement badges
- Leaderboard

### 👨‍💼 Admin Panel

- Add new phishing scenarios
- Manage content
- View platform statistics

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Firebase account

### Installation

1. Clone the repository
   \`\`\`bash
   git clone <repository-url>
   cd PhishGuard
   \`\`\`

2. Install dependencies
   \`\`\`bash
   npm install
   \`\`\`

3. Configure Firebase
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Copy your Firebase config to \`.env\`:

\`\`\`env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
\`\`\`

4. Run the development server
   \`\`\`bash
   npm run dev
   \`\`\`

5. Build for production
   \`\`\`bash
   npm run build
   \`\`\`

## 🗄️ Firestore Structure

\`\`\`
users
└── userId
├── name
├── email
├── score
├── level
├── badges
└── completedScenarios

scenarios
└── scenarioId
├── type (email/link/website)
├── content
├── correctAnswer
├── explanation
├── difficulty
└── createdAt

attempts
└── attemptId
├── userId
├── scenarioId
├── userAnswer
├── isCorrect
└── timestamp
\`\`\`

## 🧩 Detection Logic

The link analyzer checks for common phishing patterns:

- Numbers replacing letters (paypa1.com, g00gle.com)
- Extra characters or typos (micr0soft.com)
- Long or suspicious subdomains (login.secure.paypal-verify.com)
- HTTP instead of HTTPS for sensitive sites
- Suspicious TLDs (.tk, .ml, .ga)
- IP addresses instead of domain names

## 🎓 Educational Value

✅ Cybersecurity domain expertise  
✅ Real-world threat awareness  
✅ Interactive learning approach  
✅ Safe, ethical implementation  
✅ Measurable progress tracking  
✅ Gamified engagement

## 📝 License

This project is for educational purposes.

## 🤝 Contributing

This is an educational project. Feel free to fork and enhance!

---

**Difficulty:** ⭐⭐ Medium  
**Innovation:** ⭐⭐⭐⭐⭐  
**Academic Value:** Very High
