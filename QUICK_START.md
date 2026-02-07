# 🚀 PhishGuard - Quick Start

## Installation & Setup (5 minutes)

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

---

## Firebase Setup (10 minutes)

### Create Project

1. Go to https://console.firebase.google.com
2. Create new project: "PhishGuard"

### Enable Authentication

1. Authentication → Get Started
2. Enable Email/Password

### Create Firestore Database

1. Firestore Database → Create Database
2. Start in test mode
3. Choose location

### Get Config

1. Project Settings → Your apps → Web
2. Register app: "PhishGuard Web"
3. Copy config to `.env`

---

## Build & Deploy

### Build for Production

```bash
npm run build
```

### Deploy to Firebase

```bash
firebase login
firebase init
firebase deploy
```

---

## Key Features

✅ **Email Simulation** - Practice identifying phishing emails  
✅ **Link Analyzer** - Learn to spot suspicious URLs  
✅ **Quiz Mode** - Timed challenges with 5-minute limit  
✅ **Performance Dashboard** - Track progress and stats  
✅ **Gamification** - Levels, badges, and scoring  
✅ **Admin Panel** - Add custom scenarios

---

## Default Credentials

No default users. Create account via Register page.

---

## File Structure

```
PhishGuard/
├── src/
│   ├── components/      # All React components
│   ├── firebase/        # Firebase config
│   └── data/            # Sample scenarios
├── package.json         # Dependencies
├── vite.config.js       # Build config
└── firebase.json        # Firebase config
```

---

## Common Commands

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start dev server         |
| `npm run build`   | Build for production     |
| `npm run preview` | Preview production build |
| `firebase deploy` | Deploy to Firebase       |

---

## Troubleshooting

**Port 3000 already in use?**

```bash
# Edit vite.config.js and change port to 3001
```

**Firebase errors?**

```bash
# Check .env file has correct values
# Verify Firebase project is active
```

**Build errors?**

```bash
rm -rf node_modules
npm install
```

---

## Demo Flow for Presentations

1. **Login/Register** - Create account
2. **Dashboard** - Show overview
3. **Email Simulation** - Complete one scenario
4. **Link Analyzer** - Analyze a phishing URL
5. **Quiz** - Take a timed quiz
6. **Performance** - Show progress dashboard
7. **Admin Panel** - Add a new scenario

---

## Tech Stack

- **React 18** - UI Framework
- **Vite** - Build Tool
- **Firebase Auth** - User Management
- **Firestore** - Database
- **React Router** - Navigation
- **Lucide Icons** - Icon Library

---

## Support

📖 Read: [SETUP_GUIDE.md](SETUP_GUIDE.md)  
❓ Viva: [VIVA_QUESTIONS.md](VIVA_QUESTIONS.md)  
📁 Structure: [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)

---

**Built with ❤️ for cybersecurity education**

🛡️ PhishGuard - Train to recognize cyber threats!
