# PhishGuard - Setup Guide

## 🚀 Quick Start Guide

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Setup

#### Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add Project"
3. Enter project name: "PhishGuard"
4. Follow the setup wizard

#### Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click **Get Started**
3. Enable **Email/Password** sign-in method

#### Create Firestore Database

1. Go to **Firestore Database**
2. Click **Create Database**
3. Choose **Start in test mode** (we'll add rules later)
4. Select your preferred location
5. Click **Enable**

#### Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to **Your apps**
3. Click the **Web** icon (</>)
4. Register your app with nickname "PhishGuard Web"
5. Copy the Firebase configuration object

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Deploy Firestore Rules

In the Firebase Console:

1. Go to **Firestore Database** → **Rules**
2. Replace with the content from `firestore.rules`
3. Click **Publish**

### 5. Run the Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### 6. Create Your First Account

1. Click **Register**
2. Enter your details
3. Start training!

## 🌐 Deployment to Firebase Hosting

### 1. Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Login to Firebase

```bash
firebase login
```

### 3. Initialize Firebase

```bash
firebase init
```

Select:

- **Hosting**: Configure files for Firebase Hosting
- **Firestore**: Deploy Firestore Rules

Choose existing project (select your PhishGuard project)

For Hosting setup:

- Public directory: `dist`
- Configure as single-page app: **Yes**
- Set up automatic builds: **No**

### 4. Build the App

```bash
npm run build
```

### 5. Deploy to Firebase

```bash
firebase deploy
```

Your app will be live at: `https://your-project-id.web.app`

## 📱 Features Overview

### User Features

- **Email Simulation**: Practice identifying phishing emails with real-world examples
- **Link Analyzer**: Learn to spot suspicious URLs and domains
- **Quiz Mode**: Test knowledge with timed quizzes
- **Performance Dashboard**: Track progress and identify improvement areas
- **Gamification**: Earn badges and level up

### Admin Features

- **Add Scenarios**: Create custom phishing scenarios
- **Manage Content**: Edit and delete scenarios
- **Track Platform Stats**: Monitor user engagement

## 🎓 For Academic/Viva Presentations

### Key Points to Highlight:

1. **Problem Statement**: Lack of cybersecurity awareness leads to successful phishing attacks
2. **Solution**: Interactive, gamified training platform
3. **Tech Stack**: Modern web technologies (React, Firebase)
4. **Educational Value**: Safe environment to learn threat detection
5. **Real-World Application**: Skills directly applicable to cybersecurity

### Demo Flow:

1. Register/Login
2. Show Dashboard with stats
3. Complete an Email Simulation
4. Analyze a URL in Link Analyzer
5. Take a Quiz
6. Show Performance Dashboard
7. Demonstrate Admin Panel (adding scenarios)

## 🔐 Security Best Practices

- Never commit `.env` file to version control
- Use Firestore security rules to protect user data
- Implement rate limiting for authentication
- Regular security audits of scenarios

## 🐛 Troubleshooting

### Firebase Connection Issues

- Check if `.env` variables are correct
- Ensure Firebase project is active
- Verify billing is enabled (if using paid features)

### Build Errors

- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

### Authentication Not Working

- Check Firebase Authentication is enabled
- Verify Email/Password provider is active
- Check browser console for errors

## 📞 Support

For issues or questions:

- Check the README.md
- Review Firebase documentation
- Check browser console for errors

## 🎉 Success!

You now have a fully functional PhishGuard platform! Start training and help build cybersecurity awareness.

---

**Built with ❤️ for education and cybersecurity awareness**
