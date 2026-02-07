# 📁 PhishGuard - Project Structure

```
PhishGuard/
├── 📄 package.json                 # Dependencies and scripts
├── 📄 vite.config.js              # Vite configuration
├── 📄 index.html                  # HTML entry point
├── 📄 .gitignore                  # Git ignore rules
├── 📄 .env.example                # Environment variables template
├── 📄 firebase.json               # Firebase configuration
├── 📄 firestore.rules             # Firestore security rules
├── 📄 README.md                   # Project documentation
├── 📄 SETUP_GUIDE.md             # Detailed setup instructions
├── 📄 VIVA_QUESTIONS.md          # Viva preparation guide
│
├── 📁 src/
│   ├── 📄 main.jsx                # Application entry point
│   ├── 📄 App.jsx                 # Main app component with routing
│   ├── 📄 index.css               # Global styles and utilities
│   │
│   ├── 📁 firebase/
│   │   └── 📄 config.js           # Firebase initialization
│   │
│   ├── 📁 components/
│   │   ├── 📄 Navbar.jsx          # Navigation bar component
│   │   ├── 📄 Navbar.css          # Navbar styles
│   │   │
│   │   ├── 📁 Auth/
│   │   │   ├── 📄 Login.jsx       # Login page
│   │   │   ├── 📄 Register.jsx    # Registration page
│   │   │   └── 📄 Auth.css        # Auth pages styles
│   │   │
│   │   ├── 📁 Dashboard/
│   │   │   ├── 📄 Dashboard.jsx   # User dashboard
│   │   │   └── 📄 Dashboard.css   # Dashboard styles
│   │   │
│   │   ├── 📁 Simulation/
│   │   │   ├── 📄 PhishingSimulation.jsx  # Email simulation
│   │   │   └── 📄 PhishingSimulation.css  # Simulation styles
│   │   │
│   │   ├── 📁 LinkAnalyzer/
│   │   │   ├── 📄 LinkAnalyzer.jsx        # URL analyzer
│   │   │   └── 📄 LinkAnalyzer.css        # Analyzer styles
│   │   │
│   │   ├── 📁 Quiz/
│   │   │   ├── 📄 QuizMode.jsx    # Quiz component
│   │   │   └── 📄 QuizMode.css    # Quiz styles
│   │   │
│   │   ├── 📁 Performance/
│   │   │   ├── 📄 Performance.jsx # Performance dashboard
│   │   │   └── 📄 Performance.css # Performance styles
│   │   │
│   │   └── 📁 Admin/
│   │       ├── 📄 AdminPanel.jsx  # Admin interface
│   │       └── 📄 AdminPanel.css  # Admin styles
│   │
│   └── 📁 data/
│       └── 📄 scenarios.js        # Sample phishing scenarios
│
└── 📁 dist/                       # Production build (generated)
```

## 📋 File Descriptions

### Root Configuration Files

**package.json**

- Lists all project dependencies (React, Firebase, React Router, Lucide icons)
- Defines npm scripts (dev, build, preview)
- Project metadata

**vite.config.js**

- Vite bundler configuration
- React plugin setup
- Development server settings (port 3000)

**index.html**

- Single Page Application entry point
- Links to main.jsx
- Sets page title and metadata

**.env.example**

- Template for environment variables
- Firebase configuration placeholders
- Must be copied to `.env` with actual values

**firebase.json**

- Firebase Hosting configuration
- Points to `dist` folder for deployment
- Defines rewrite rules for SPA

**firestore.rules**

- Firestore security rules
- Controls read/write access to collections
- Ensures users can only access their own data

### Source Files (`src/`)

**main.jsx**

- Application entry point
- Renders React app to DOM
- Imports global CSS

**App.jsx**

- Main application component
- Manages authentication state
- Defines routing for all pages
- Protected routes implementation

**index.css**

- Global CSS variables (colors, shadows)
- Utility classes (buttons, cards, badges)
- Responsive design utilities
- Loading spinner animations

### Firebase (`src/firebase/`)

**config.js**

- Firebase initialization
- Exports `auth` and `db` instances
- Uses environment variables for configuration

### Components (`src/components/`)

#### Navbar

**Navbar.jsx / Navbar.css**

- Navigation bar with links to all features
- Displays user name
- Logout functionality
- Active route highlighting

#### Auth (`Auth/`)

**Login.jsx**

- Email/password login form
- Error handling for invalid credentials
- Redirects to dashboard on success

**Register.jsx**

- New user registration
- Creates Firestore user document
- Password validation
- Initializes user stats (score: 0, level: Beginner)

**Auth.css**

- Shared styles for login and register
- Gradient background
- Card layout with icons

#### Dashboard (`Dashboard/`)

**Dashboard.jsx**

- User overview page
- Displays stats (score, scenarios completed, badges)
- Quick access cards to all features
- Level display

**Dashboard.css**

- Grid layouts for stats and features
- Card hover effects
- Responsive design

#### Simulation (`Simulation/`)

**PhishingSimulation.jsx**

- Main email simulation feature
- Loads random scenarios
- Users choose: Safe, Suspicious, or Phishing
- Shows immediate feedback with explanations
- Updates user stats in Firestore
- Awards badges for milestones

**PhishingSimulation.css**

- Email display styling
- Answer button animations
- Result card layouts

#### LinkAnalyzer (`LinkAnalyzer/`)

**LinkAnalyzer.jsx**

- URL analysis tool
- Pattern matching for threats:
  - HTTP vs HTTPS
  - IP addresses
  - Character substitutions
  - Suspicious TLDs
  - URL shorteners
- Scoring system (0-100)
- Sample URLs for practice

**LinkAnalyzer.css**

- URL input styling
- Threat cards with color coding
- Safety score display

#### Quiz (`Quiz/`)

**QuizMode.jsx**

- Timed quiz feature (5 minutes)
- Randomly selects 5 scenarios
- Progress tracking
- Answer review with explanations
- Score calculation and storage

**QuizMode.css**

- Timer display with warning animation
- Progress bar
- Answer review cards
- Score circle display

#### Performance (`Performance/`)

**Performance.jsx**

- Comprehensive performance dashboard
- Calculates accuracy, averages
- Level progression system
- Strengths and weaknesses analysis
- Badge display
- Personalized recommendations

**Performance.css**

- Metric cards with icons
- Level progress bar
- Analysis grid layout
- Badge grid

#### Admin (`Admin/`)

**AdminPanel.jsx**

- Add new scenarios form
- Multi-field form (type, difficulty, content)
- Dynamic indicator list
- View existing scenarios
- Delete scenarios
- Firestore CRUD operations

**AdminPanel.css**

- Form layouts
- Scenario card grid
- Color-coded difficulty badges

### Data (`src/data/`)

**scenarios.js**

- Sample phishing email scenarios
- 8 pre-built examples (easy, medium, hard)
- Each contains:
  - Email metadata (from, subject)
  - Content
  - Correct answer
  - Detailed explanation
  - Key threat indicators
- Helper functions:
  - `getRandomScenario()`
  - `getScenariosByDifficulty()`

## 🎯 Data Flow

### Authentication Flow

```
User enters credentials → Firebase Auth validates →
onAuthStateChanged triggers → App.jsx updates user state →
Protected routes accessible → Dashboard loads user data
```

### Email Simulation Flow

```
User loads simulation → Random scenario selected →
User selects answer → Answer compared to correct answer →
Firestore updated (score, attempts, badges) →
Feedback displayed with explanation → Next scenario
```

### Quiz Flow

```
Quiz started → 5 random scenarios selected → Timer starts →
User answers each question → Timer expires or all answered →
Calculate score → Update Firestore → Show detailed review
```

### Link Analyzer Flow

```
User enters URL → Pattern matching algorithms run →
Threats identified → Score calculated →
Results displayed with recommendations
```

## 🗄️ Firestore Collections

### users

```javascript
{
  name: string,
  email: string,
  score: number,
  level: string,
  badges: array,
  completedScenarios: array,
  totalAttempts: number,
  correctAnswers: number,
  quizzesCompleted: number,
  totalQuizScore: number,
  createdAt: timestamp
}
```

### scenarios

```javascript
{
  id: string,
  type: string,           // 'email', 'link', 'website'
  difficulty: string,     // 'easy', 'medium', 'hard'
  from: string,
  subject: string,
  content: string,
  correctAnswer: string,  // 'safe', 'suspicious', 'phishing'
  explanation: string,
  indicators: array,
  createdAt: timestamp,
  createdBy: userId
}
```

## 🚀 Build Process

### Development

```bash
npm run dev
```

- Starts Vite dev server
- Hot Module Replacement (HMR)
- Runs on http://localhost:3000

### Production Build

```bash
npm run build
```

- Bundles all files
- Minifies JavaScript and CSS
- Optimizes images
- Outputs to `dist/` folder
- Ready for Firebase Hosting

### Preview Build

```bash
npm run preview
```

- Serves production build locally
- Test before deployment

## 🎨 Styling Architecture

### CSS Variables (index.css)

- Centralized color scheme
- Consistent spacing
- Shadow definitions
- Easy theme customization

### Component Styles

- Each component has its own CSS file
- BEM-like naming convention
- Responsive breakpoints at 768px

### Utility Classes

- `.btn`, `.btn-primary`, `.btn-secondary`
- `.card`
- `.badge`, `.badge-success`, `.badge-warning`
- `.spinner`
- `.fade-in` animation

## 🔐 Security Layers

1. **Firebase Authentication** - User identity
2. **Firestore Rules** - Database access control
3. **Environment Variables** - API key protection
4. **HTTPS** - Encrypted data transmission
5. **Input Validation** - Client-side checks

## 📱 Responsive Design

- **Desktop**: Full featured interface
- **Tablet**: Adapted layouts, stacked grids
- **Mobile**: Single column, optimized touches

---

This structure provides a complete, professional phishing awareness training platform ready for academic presentation and real-world deployment! 🛡️
