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
  BookOpen
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
      description: 'Learn to spot suspicious URLs and understand threat indicators',
      color: '#f59e0b'
    },
    {
      icon: Trophy,
      title: 'Quiz Mode',
      description: 'Test your cybersecurity knowledge with timed quizzes',
      color: '#10b981'
    },
    {
      icon: BookOpen,
      title: 'Security Articles',
      description: 'Read in-depth guides on phishing, passwords, and cyber threats',
      color: '#8b5cf6'
    },
    {
      icon: TrendingUp,
      title: 'Performance Tracking',
      description: 'Monitor your progress and earn badges as you improve',
      color: '#2563eb'
    }
  ];

  const stats = [
    { icon: Target, value: '30+', label: 'Training Scenarios' },
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
              <Shield size={24} />
              <span>Cybersecurity Training Platform</span>
            </div>
            <h1 className="hero-title">
              Master Phishing Detection with <span className="gradient-text">PhishGuard</span>
            </h1>
            <p className="hero-description">
              Learn to recognize and avoid phishing attacks through interactive simulations, 
              real-world scenarios, and comprehensive training modules.
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
              <Shield size={120} className="shield-icon" />
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
            <p>Comprehensive training modules designed to enhance your cybersecurity awareness</p>
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
