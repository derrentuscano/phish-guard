import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Mail, 
  Link as LinkIcon, 
  Trophy, 
  TrendingUp,
  Target,
  Award,
  CheckCircle,
  Zap,
  Lock,
  BookOpen,
  Send,
  MessageCircle,
  Flame
} from 'lucide-react';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Mail,
      title: 'Email Simulation',
      description: 'Practice identifying phishing emails with real-world scenarios',
      color: '#ef4444'
    },
    {
      icon: LinkIcon,
      title: 'Link Analyzer',
      description: 'Check if URLs are suspicious before you click on them',
      color: '#f59e0b'
    },
    {
      icon: Lock,
      title: 'Password Checker',
      description: 'Evaluate the strength of your passwords to ensure they\'re secure',
      color: '#dc2626'
    },
    {
      icon: Trophy,
      title: 'Quiz Mode',
      description: 'Test your cybersecurity knowledge with interactive quizzes',
      color: '#10b981'
    },
    {
      icon: MessageCircle,
      title: 'AI Chatbot Assistant',
      description: 'Get instant answers about PhishGuard and cybersecurity from our AI',
      color: '#14b8a6'
    },
    {
      icon: BookOpen,
      title: 'Security Articles',
      description: 'Read expert guides on phishing, passwords, and cyber threats',
      color: '#8b5cf6'
    },
    {
      icon: Award,
      title: 'Badge System',
      description: 'Earn achievements like Beginner, Expert, and Master as you learn',
      color: '#f59e0b'
    },
    {
      icon: Flame,
      title: 'Streak Tracking',
      description: 'Build consistent learning habits by maintaining your daily streak',
      color: '#ff6b35'
    },
    {
      icon: TrendingUp,
      title: 'Performance Stats',
      description: 'Track your learning progress and see how you\'re improving',
      color: '#2563eb'
    }
  ];

  const stats = [
    { icon: Target, value: '9+', label: 'Features' },
    { icon: Trophy, value: '5+', label: 'Achievement Badges' },
    { icon: Award, value: '5', label: 'Skill Levels' }
  ];

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <img src="/phishguardlogo.svg" alt="PhishGuard" className="hero-badge-logo" />
              <span>Cybersecurity Training Platform</span>
            </div>
            <h1 className="hero-title">
              Master Phishing Detection with <span className="gradient-text">PhishGuard</span>
            </h1>
            <p className="hero-description">
              Learn to recognize and avoid phishing attacks through interactive simulations, 
              AI-powered assistance, password security tools, and comprehensive training modules. 
              Track your progress, earn badges, and become a cybersecurity expert.
            </p>
            <div className="hero-buttons">
              <button 
                className="btn btn-primary btn-large"
                onClick={() => navigate('/register')}
              >
                <Zap size={20} />
                Get Started Free
              </button>
              <button 
                className="btn btn-outline btn-large"
                onClick={() => navigate('/login')}
              >
                <Lock size={20} />
                Sign In
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="visual-card">
              <img src="/phishguardlogo.svg" alt="PhishGuard" className="shield-icon" />
              <div className="visual-stats">
                <div className="visual-stat">
                  <CheckCircle size={20} />
                  <span>Safe</span>
                </div>
                <div className="visual-stat warning">
                  <Target size={20} />
                  <span>Phishing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <stat.icon size={32} />
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Everything You Need to Stay Secure</h2>
            <p>9+ comprehensive features designed to enhance your cybersecurity awareness and keep you protected</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div 
                  className="feature-icon-wrapper"
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <feature.icon size={32} style={{ color: feature.color }} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <h2>How PhishGuard Works</h2>
            <p>Simple, effective, and engaging training process</p>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Sign Up</h3>
              <p>Create your free account and start your cybersecurity journey</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Train</h3>
              <p>Practice with realistic phishing scenarios and learn to identify threats</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Test</h3>
              <p>Take quizzes to validate your knowledge and track improvement</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Master</h3>
              <p>Level up, earn badges, and become a phishing detection expert</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Enhance Your Security Skills?</h2>
            <p>Join thousands of users learning to protect themselves from cyber threats</p>
            <button 
              className="btn btn-primary btn-large"
              onClick={() => navigate('/register')}
            >
              <Shield size={20} />
              Start Training Now
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-content">
            <div className="contact-header">
              <Mail size={48} className="contact-icon" />
              <h2>Contact Us</h2>
              <p>Have questions or need support? We're here to help!</p>
            </div>
            <div className="contact-info">
              <div className="contact-item">
                <Mail size={24} />
                <div className="contact-details">
                  <h3>Email</h3>
                  <a href="mailto:phishguardcontact@gmail.com">phishguardcontact@gmail.com</a>
                </div>
              </div>
              <div className="contact-item">
                <Send size={24} />
                <div className="contact-details">
                  <h3>Response Time</h3>
                  <p>We typically respond within 24-48 hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <Shield size={32} />
              <span>PhishGuard</span>
            </div>
            <p>© 2026 PhishGuard. Empowering users with cybersecurity awareness.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
