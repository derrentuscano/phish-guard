import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Link as LinkIcon, 
  Target,
  Lock,
  MousePointer2,
  FileSearch,
  ScanEye,
  Image,
  Activity,
  ChevronRight,
  Terminal,
  AlertTriangle
} from 'lucide-react';
import './Dashboard.css';

const Dashboard = ({ user }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user.uid]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="hud-spinner" />
        <div className="loading-text">INITIALIZING SYSTEMS...</div>
      </div>
    );
  }

  const overallScore = userData?.score || 100; // Mock starting score

  const features = [
    {
      title: 'Link Analyzer',
      description: 'Multi-engine URL threat scanning using VT & GSB heuristics.',
      icon: LinkIcon,
      color: '#00cc6a',
      path: '/link-analyzer'
    },
    {
      title: 'Password Checker',
      description: 'Client-side deep strength analysis across 8 complexity criteria.',
      icon: Lock,
      color: '#6366f1',
      path: '/password-checker'
    },
    {
      title: 'Link Hover Preview',
      description: 'Background extension engine assessing links before you click.',
      icon: MousePointer2,
      color: '#f59e0b',
      path: '/link-preview'
    },
    {
      title: 'File Scanner',
      description: 'Magic byte forensics and embedded malicious content detection.',
      icon: FileSearch,
      color: '#ef4444',
      path: '/file-scanner'
    },
    {
      title: 'AI Image Detector',
      description: '13-layer ELA, FFT, PRNU, and Vision LLM synthetic media detection.',
      icon: ScanEye,
      color: '#8b5cf6',
      path: '/image-detector'
    },
    {
      title: 'Reverse Image Search',
      description: 'Gemini Vision AI origin tracking and manipulation signaling.',
      icon: Image,
      color: '#0ea5e9',
      path: '/reverse-image-search'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="scan-line-overlay" />
      <div className="container hud-layout">
        
        {/* TOP STATUS BAR */}
        <header className="hud-header hud-fade-in">
          <div className="hud-greeting">
            <span className="terminal-prompt">$</span> 
            <h1>SYS.MSG: WELCOME_BACK_{userData?.displayName?.toUpperCase() || userData?.name?.toUpperCase() || 'AGENT'}</h1>
          </div>
          <div className="hud-status">
            <div className="status-indicator online" />
            <span>SYSTEM_SECURE</span>
          </div>
        </header>

        <div className="dashboard-grid">
          {/* MAIN COLUMN */}
          <main className="hud-main hud-fade-in" style={{ animationDelay: '0.1s' }}>
            
            {/* SCORE PANEL */}
            <section className="score-panel">
              <div className="score-header">
                <Target size={20} className="glow-icon" />
                <h2>THREAT AVOIDANCE INDEX</h2>
              </div>
              <div className="score-body">
                <div className="score-display">
                  <span className="score-number">{overallScore}</span>
                  <span className="score-max">/100</span>
                </div>
                <div className="score-context">
                  <p>Your current security posture based on recent scans.</p>
                  <div className="progress-bar-bg">
                    <div 
                      className="progress-bar-fill" 
                      style={{ width: `${Math.min(100, overallScore)}%`, backgroundColor: overallScore > 80 ? '#00ff41' : '#f59e0b' }} 
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* TOOLS GRID */}
            <section className="tools-section">
              <div className="section-title">
                <Terminal size={16} />
                AVAILABLE_MODULES
              </div>
              <div className="tools-grid">
                {features.map((feature, index) => (
                  <button 
                    key={index}
                    className="tool-card"
                    onClick={() => navigate(feature.path)}
                  >
                    <div className="tool-card-top">
                      <div className="tool-icon-box" style={{ color: feature.color, borderColor: `${feature.color}40`, background: `${feature.color}15` }}>
                        <feature.icon size={22} />
                      </div>
                      <ChevronRight size={18} className="tool-arrow" />
                    </div>
                    <div className="tool-card-body">
                      <h3>{feature.title}</h3>
                      <p>{feature.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </main>

          {/* RIGHT SIDEBAR - ACTIVITY PANEL */}
          <aside className="hud-sidebar hud-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="activity-panel">
              <div className="panel-header">
                <Activity size={18} />
                <h3>RECENT_LOGS</h3>
              </div>
              
              <div className="log-list">
                {/* Simulated empty logs or pull actual logic later */}
                <div className="log-item empty">
                  <AlertTriangle size={32} opacity={0.5} />
                  <p>NO RECENT SCANS LOGGED</p>
                  <span>Activity will appear here when you use the security tools.</span>
                </div>
              </div>
              
              <div className="panel-footer">
                <span className="terminal-status">STATUS: LISTENING</span>
                <span className="blink-cursor">_</span>
              </div>
            </div>
            
            {/* QUICK TIP PANEL */}
            <div className="tip-panel">
              <div className="panel-header">
                <Shield size={18} />
                <h3>SEC_BRIEF</h3>
              </div>
              <div className="tip-content">
                <p><strong>Reminder:</strong> No single tool provides 100% protection. Cross-verify suspicious links and downloads using multiple modules.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
