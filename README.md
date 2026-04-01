# 🛡️ PhishGuard - Phishing Awareness & Detection Training Platform

**Tagline:** Train users to recognize cyber threats before they fall for them.

## 🎯 Overview

PhishGuard is a comprehensive cybersecurity awareness platform that combines interactive phishing simulations, advanced media analysis, and educational tools to teach users how to identify and prevent cyber threats in a safe, engaging environment. Features AI-powered image and file analysis, password security verification, and real-time threat detection across emails, links, and media.

## 🧠 Problem It Solves

- Many people fall for phishing emails and malicious links
- Lack of cybersecurity awareness among students and professionals
- Growing threat of AI-generated deepfakes and manipulated media
- Weak password practices leading to account compromises
- Need for safe training environments to practice threat detection
- Difficulty verifying image authenticity and detecting AI-generated content

## ⚙️ Tech Stack

| Layer            | Technology                                |
| ---------------- | ----------------------------------------- |
| Frontend         | React + Vite                              |
| Auth             | Firebase Authentication                   |
| Database         | Firestore                                 |
| Hosting          | Firebase Hosting                          |
| AI & Vision APIs | Groq Vision API, Google Gemini Vision API |
| Image Analysis   | EXIF parsing, FFT, ELA, PRNU analysis     |
| Cloud Functions  | Firebase Cloud Functions                  |

## ✨ Key Features

### 👤 User Authentication

- User account management
- Progress tracking across sessions
- Profile management and statistics

### 📧 Phishing Simulation & Email Training

- Realistic fake emails displayed in UI
- User classification: Safe, Suspicious, or Phishing
- Instant feedback with explanations
- Interactive email analysis training

### 🔍 Link Analysis & Security Tools

- **Link Analyzer** - Educational URL analysis with pattern detection:
  - Misspelled domains
  - Character substitutions
  - Fake subdomains
  - HTTP vs HTTPS verification
- **Link Preview** - Real-time link preview and metadata extraction

### 🖼️ Advanced Image & Media Analysis

- **Image Detector** - Multi-mode image authentication analysis:
  - **Classic Mode** - EXIF metadata, Error Level Analysis (ELA), color symmetry
  - **Advanced Mode** - FFT analysis, edge sharpness, PRNU fingerprint, C2PA credentials
  - **AI Vision Mode** - Groq Vision AI to detect AI-generated images
- **Reverse Image Search** - Gemini Vision AI-powered image authenticity verification
- Detects manipulated, deepfake, and AI-generated images

### 💾 File Security Scanner

- Upload and scan files for security threats
- Analyzes file metadata and signatures
- Categorizes suspicious files
- Maximum file size: 100MB

### 🔐 Password Strength Checker

- Real-time password strength analysis
- Detailed security feedback and tips
- Entropy calculation and character diversity analysis
- Suggestions for strong password creation

### 💬 AI ChatBot Assistant

- 24/7 conversational security guidance
- Quick prompts for common security questions
- Training on phishing identification techniques
- Session-based conversation history
- Provides tips for creating strong passwords and improving security

### 🎯 Interactive Learning Modes

- Multiple phishing scenarios
- Score-based learning
- Progressive difficulty levels
- Real-world threat training

### 📊 Performance Dashboard

- Track accuracy percentage across all security tests
- Identify weak areas
- Progress tracking over time
- Security score visualization

### 🏆 Gamification

- Level progression (Beginner → Expert)
- Achievement badges
- Leaderboard system
- Points-based rewards

### 👨‍💼 Admin Panel

- Add new phishing scenarios
- Manage content and training materials
- View platform statistics
- User management

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

### Link Analysis

The link analyzer checks for common phishing patterns:

- Numbers replacing letters (paypa1.com, g00gle.com)
- Extra characters or typos (micr0soft.com)
- Long or suspicious subdomains (login.secure.paypal-verify.com)
- HTTP instead of HTTPS for sensitive sites
- Suspicious TLDs (.tk, .ml, .ga)
- IP addresses instead of domain names

### Image Authentication

Multi-layered image analysis detects:

- **EXIF Metadata Tampering** - Inconsistent image metadata
- **Error Level Analysis (ELA)** - Compression artifacts indicating manipulation
- **AI Detection (Groq Vision)** - Identifies AI-generated and deepfake images
- **PRNU Fingerprinting** - Camera source verification
- **Color & Symmetry Analysis** - Structural anomalies
- **Edge Sharpness Analysis** - Laplacian-based detection
- **Gemini Vision AI** - Comprehensive visual authenticity verification

### File Security Analysis

Comprehensive file scanning for:

- Malware signatures
- Suspicious file types and extensions
- Metadata analysis
- Hash-based threat detection
- File integrity verification

## 💻 Browser Extension

PhishGuard includes a browser extension for real-time protection:

- Background link scanning
- Integration with the main platform authentication
- Content script-based threat detection
- Secure communication with the web application
- Check [browser-extension/README.md](browser-extension) for setup instructions

## 🔐 Security Best Practices

PhishGuard teaches and implements:

- Defense-in-depth security architecture
- Zero-trust verification principles
- Multi-factor security checks
- Real-time threat monitoring
- Privacy-first data handling

## 📈 Use Cases

**For Students:**

- Build cybersecurity awareness
- Learn threat identification
- Prepare for security certifications

**For Enterprises:**

- Employee security training programs
- Phishing simulation campaigns
- Security awareness metrics

**For Security Professionals:**

- Advanced threat analysis tools
- Image forensics capabilities
- File integrity verification

## 🎓 Educational Value

✅ Cybersecurity domain expertise  
✅ Real-world threat awareness  
✅ Interactive learning approach  
✅ AI-powered threat detection  
✅ Safe, ethical implementation  
✅ Measurable progress tracking  
✅ Gamified engagement

## 📚 Available Tools Summary

| Tool                 | Purpose              | Key Feature                         |
| -------------------- | -------------------- | ----------------------------------- |
| Link Analyzer        | URL verification     | Pattern-based phishing detection    |
| Image Detector       | Media authentication | Multi-mode AI & forensics analysis  |
| Reverse Image Search | Image verification   | Gemini Vision AI authenticity check |
| File Scanner         | Malware detection    | Metadata & signature analysis       |
| Password Checker     | Security analysis    | Entropy & strength evaluation       |
| ChatBot              | User guidance        | 24/7 AI-powered assistance          |
| Dashboard            | Progress tracking    | Personalized security metrics       |

## 🛠️ Installation & Deployment

### Local Development Setup

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed setup instructions.

### Firebase Deployment

```bash
npm run firebase:deploy
```

### Browser Extension Setup

See [browser-extension/README.md](browser-extension) for extension installation instructions.

## 📝 License

This project is for educational purposes.

## 🤝 Contributing

This is an educational project. Feel free to fork and enhance!

---

**Difficulty:** ⭐⭐ Medium  
**Innovation:** ⭐⭐⭐⭐⭐  
**Academic Value:** Very High  
**Real-World Application:** Enterprise-Grade
