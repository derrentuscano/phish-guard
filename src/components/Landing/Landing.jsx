import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Link as LinkIcon,
  Lock,
  MousePointer2,
  FileSearch,
  ScanEye,
  Image,
  MessageCircle,
  Zap,
  Mail,
  Send,
  ChevronRight,
  CheckCircle,
  Globe,
  Eye,
  Terminal,
  Cpu,
  ArrowRight,
} from 'lucide-react';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  // ── Matrix rain animation ───────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ';
    const fontSize = 13;
    const cols = Math.floor(canvas.width / fontSize);
    const drops = Array(cols).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(2, 8, 20, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00ff4115';
      ctx.font = `${fontSize}px monospace`;
      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = i % 4 === 0 ? '#00ff4130' : '#00ff4108';
        ctx.fillText(char, i * fontSize, y * fontSize);
        if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
    };

    const interval = setInterval(draw, 60);
    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => { clearInterval(interval); window.removeEventListener('resize', handleResize); };
  }, []);

  const features = [
    {
      icon: LinkIcon,
      title: 'Link Analyzer',
      description: 'Scan any URL through VirusTotal (70+ engines), Google Safe Browsing, and 7 local heuristic rules. Get a 0–100 threat score in seconds.',
      color: '#00cc6a',
      accent: '#00ff8a',
      tag: 'MULTI-ENGINE',
      path: '/link-analyzer',
    },
    {
      icon: Lock,
      title: 'Password Checker',
      description: 'Real-time client-side strength analysis across 8 criteria: length, complexity, common patterns, and sequential characters.',
      color: '#6366f1',
      accent: '#818cf8',
      tag: 'REAL-TIME',
      path: '/password-checker',
    },
    {
      icon: MousePointer2,
      title: 'Link Hover Preview',
      description: 'Our Chrome extension checks every link you hover over using Google Safe Browsing. Dangerous URLs are flagged before you click.',
      color: '#f59e0b',
      accent: '#fcd34d',
      tag: 'BROWSER EXTENSION',
      path: '/link-preview',
    },
    {
      icon: FileSearch,
      title: 'File Scanner',
      description: 'Deep file analysis using magic byte detection (80+ signatures), content threat scanning, and VirusTotal SHA-256 hash lookup.',
      color: '#ef4444',
      accent: '#f87171',
      tag: 'FORENSIC',
      path: '/file-scanner',
    },
    {
      icon: ScanEye,
      title: 'AI Image Detector',
      description: '13-layer analysis combining ELA, FFT frequency domain, PRNU camera fingerprinting, EXIF forensics, and Groq Vision LLM.',
      color: '#8b5cf6',
      accent: '#a78bfa',
      tag: 'RESEARCH-GRADE',
      path: '/image-detector',
    },
    {
      icon: Image,
      title: 'Reverse Image Search',
      description: 'Powered by Gemini Vision AI — identifies image subject, origin, authenticity score, manipulation signals, and generates search links.',
      color: '#0ea5e9',
      accent: '#38bdf8',
      tag: 'GEMINI AI',
      path: '/reverse-image-search',
    },
  ];

  const stats = [
    { value: '6+', label: 'Security Tools', icon: Shield },
    { value: '80+', label: 'File Signatures', icon: FileSearch },
    { value: '13', label: 'AI Image Checks', icon: ScanEye },
    { value: '100%', label: 'Privacy Focused', icon: Lock },
  ];

  const techStack = [
    { icon: Globe, label: 'VirusTotal API', desc: '70+ antivirus engines' },
    { icon: Shield, label: 'Google Safe Browsing', desc: 'Threat intelligence' },
    { icon: Cpu, label: 'Groq Vision LLM', desc: 'AI image forensics' },
    { icon: Eye, label: 'Gemini Vision', desc: 'Reverse image analysis' },
    { icon: Terminal, label: 'Heuristic Engine', desc: 'Pattern detection' },
    { icon: CheckCircle, label: 'Firebase', desc: 'Auth + real-time DB' },
  ];

  return (
    <div className="landing-container">

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="hero-section">
        <canvas ref={canvasRef} className="hero-canvas" />
        <div className="hero-grid-overlay" />

        <div className="container hero-inner">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-dot" />
              <span>Active Threat Protection</span>
            </div>

            <h1 className="hero-title">
              Your Digital
              <br />
              <span className="hero-title-accent">Security Arsenal</span>
            </h1>

            <p className="hero-description">
              PhishGuard is a professional-grade cybersecurity platform with{' '}
              <strong>6 specialized tools</strong> — link analysis, file scanning,
              AI image forensics, password strength, browser-level link preview,
              and reverse image search. All in one place.
            </p>

            <div className="hero-buttons">
              <button className="btn-hero-primary" onClick={() => navigate('/register')}>
                <Zap size={18} />
                Start for Free
                <ArrowRight size={16} />
              </button>
              <button className="btn-hero-outline" onClick={() => navigate('/login')}>
                <Lock size={18} />
                Sign In
              </button>
            </div>

            <div className="hero-trust">
              {['VirusTotal', 'Google Safe Browsing', 'Groq AI', 'Gemini Vision'].map(t => (
                <span key={t} className="trust-badge">{t}</span>
              ))}
            </div>
          </div>

          <div className="hero-visual">
            <div className="shield-ring shield-ring-3" />
            <div className="shield-ring shield-ring-2" />
            <div className="shield-ring shield-ring-1" />
            <div className="shield-core">
              <img src="/phishguardlogo.svg" alt="PhishGuard" className="shield-logo" />
            </div>
            <div className="orbit-dot orbit-dot-1"><LinkIcon size={14} /></div>
            <div className="orbit-dot orbit-dot-2"><Lock size={14} /></div>
            <div className="orbit-dot orbit-dot-3"><FileSearch size={14} /></div>
            <div className="orbit-dot orbit-dot-4"><ScanEye size={14} /></div>
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────── */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((s, i) => (
              <div key={i} className="stat-card">
                <s.icon size={22} className="stat-icon" />
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────── */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag"><Terminal size={14} /> Security Suite</div>
            <h2>Six Tools. One Platform.</h2>
            <p>Each tool is purpose-built with real APIs and research-grade algorithms — not toy implementations.</p>
          </div>

          <div className="features-grid">
            {features.map((f, i) => (
              <div
                key={i}
                className="feature-card"
                style={{ '--accent': f.accent, '--card-color': f.color }}
                onClick={() => navigate('/register')}
              >
                <div className="feature-card-top">
                  <div className="feature-icon-box" style={{ background: `${f.color}18`, border: `1px solid ${f.color}35` }}>
                    <f.icon size={26} style={{ color: f.color }} />
                  </div>
                  <span className="feature-tag" style={{ color: f.color, background: `${f.color}12` }}>{f.tag}</span>
                </div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.description}</p>
                <div className="feature-footer">
                  <span className="feature-cta" style={{ color: f.color }}>
                    Try it <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section className="how-section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag"><Zap size={14} /> Workflow</div>
            <h2>Up and Running in Minutes</h2>
            <p>No complex setup. No subscriptions. Just powerful tools.</p>
          </div>

          <div className="steps-row">
            {[
              { n: '01', title: 'Create Account', desc: 'Sign up free — your data stays private with Firebase Auth and local persistence.' },
              { n: '02', title: 'Choose a Tool', desc: 'Pick from 6 security tools in the dashboard. Each has a focused, clean interface.' },
              { n: '03', title: 'Run Your Scan', desc: 'Paste a URL, upload a file, or drop an image. Results are delivered in seconds.' },
              { n: '04', title: 'Act on Results', desc: 'Get a detailed threat breakdown with score, verdict, and actionable recommendations.' },
            ].map((step, i) => (
              <div key={i} className="step-item">
                <div className="step-number-box">
                  <span className="step-number">{step.n}</span>
                  {i < 3 && <div className="step-connector" />}
                </div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECH STACK SECTION ────────────────────────────────── */}
      <section className="tech-section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag"><Cpu size={14} /> Technology</div>
            <h2>Built on Real APIs</h2>
            <p>No mock data. Every scan hits live production threat intelligence services.</p>
          </div>
          <div className="tech-grid">
            {techStack.map((t, i) => (
              <div key={i} className="tech-card">
                <div className="tech-icon"><t.icon size={20} /></div>
                <div className="tech-info">
                  <span className="tech-name">{t.label}</span>
                  <span className="tech-desc">{t.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-glow" />
            <Shield size={48} className="cta-shield" />
            <h2 className="cta-title">Ready to Secure Your Digital Life?</h2>
            <p className="cta-desc">
              Join PhishGuard and get access to all 6 security tools — completely free.
            </p>
            <div className="cta-buttons">
              <button className="btn-hero-primary" onClick={() => navigate('/register')}>
                <Shield size={18} />
                Create Free Account
                <ArrowRight size={16} />
              </button>
              <button className="btn-hero-outline" onClick={() => navigate('/login')}>
                Already have an account? Sign In
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ───────────────────────────────────────────── */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-left">
              <div className="section-tag"><Mail size={14} /> Contact</div>
              <h2>Get in Touch</h2>
              <p>Have questions, feedback, or found a bug? We'd love to hear from you.</p>
            </div>
            <div className="contact-cards">
              <a href="mailto:phishguardcontact@gmail.com" className="contact-card">
                <div className="contact-icon-box"><Mail size={20} /></div>
                <div>
                  <div className="contact-label">Email Us</div>
                  <div className="contact-value">phishguardcontact@gmail.com</div>
                </div>
                <ChevronRight size={16} className="contact-arrow" />
              </a>
              <div className="contact-card">
                <div className="contact-icon-box"><Send size={20} /></div>
                <div>
                  <div className="contact-label">Response Time</div>
                  <div className="contact-value">Within 24–48 hours</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-inner">
            <div className="footer-brand">
              <img src="/phishguardlogo.svg" alt="PhishGuard" className="footer-logo" />
              <span>PhishGuard</span>
            </div>
            <p className="footer-copy">© 2026 PhishGuard — Empowering users with cybersecurity awareness.</p>
            <div className="footer-tools">
              {['Link Analyzer', 'File Scanner', 'AI Detector', 'Password Checker', 'Reverse Search', 'Link Preview'].map(t => (
                <span key={t} className="footer-tool-tag">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
