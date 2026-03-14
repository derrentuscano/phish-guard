import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Link as LinkIcon, 
  Target,
  CheckCircle,
  Zap,
  Lock,
  Send,
  MessageCircle,
  Mail
} from 'lucide-react';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
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
      icon: MessageCircle,
      title: 'AI Chatbot Assistant',
      description: 'Get instant answers about PhishGuard and cybersecurity from our AI',
      color: '#14b8a6'
    }
  ];

  const stats = [
    { icon: Target, value: '3+', label: 'Security Tools' },
    { icon: Shield, value: '24/7', label: 'AI Assistance' },
    { icon: Lock, value: '100%', label: 'Privacy Focused' }
  ];

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <img src="/phishguardlogo.svg" alt="PhishGuard" className="hero-badge-logo" />
              <span>Cybersecurity Tools Platform</span>
            </div>
            <h1 className="hero-title">
              Stay Safe Online with <span className="gradient-text">PhishGuard</span>
            </h1>
            <p className="hero-description">
              Protect yourself from phishing attacks with our powerful security tools. 
              Analyze suspicious links, check your password strength, and get AI-powered 
              cybersecurity assistance — all in one platform.
            </p>
            <div className="hero-buttons">
              <button 
                className="btn btn-primary btn-large"
                onClick={() => navigate('/register')}
                style={{ border: '2px solid white' }}
              >
                <Zap size={20} />
                Get Started Free
              </button>
              <button 
                className="btn btn-primary btn-large"
                onClick={() => navigate('/login')}
                style={{ border: '2px solid white' }}
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
            <h2>Powerful Security Tools</h2>
            <p>Everything you need to stay protected online</p>
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
            <p>Simple, effective, and powerful security tools</p>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Sign Up</h3>
              <p>Create your free account to access all security tools</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Analyze</h3>
              <p>Use the Link Analyzer to check suspicious URLs for phishing patterns</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Secure</h3>
              <p>Check your passwords and get AI-powered security recommendations</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Stay Protected</h3>
              <p>Use our tools regularly to keep yourself safe from cyber threats</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Protect Yourself Online?</h2>
            <p>Access powerful security tools to stay safe from phishing and cyber threats</p>
            <button 
              className="btn btn-primary btn-large"
              onClick={() => navigate('/register')}
            >
              <Shield size={20} />
              Get Started Now
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
