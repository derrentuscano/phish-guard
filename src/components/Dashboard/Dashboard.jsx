import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Mail, 
  Link as LinkIcon, 
  Trophy, 
  TrendingUp,
  Target,
  Award,
  BookOpen
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
    return <div className="spinner"></div>;
  }

  const features = [
    {
      title: 'Email Simulation',
      description: 'Practice identifying phishing emails',
      icon: Mail,
      color: '#ef4444',
      path: '/simulation'
    },
    {
      title: 'Link Analyzer',
      description: 'Learn to spot suspicious URLs',
      icon: LinkIcon,
      color: '#f59e0b',
      path: '/link-analyzer'
    },
    {
      title: 'Quiz Mode',
      description: 'Test your knowledge',
      icon: Trophy,
      color: '#10b981',
      path: '/quiz'
    },
    {
      title: 'Performance',
      description: 'Track your progress',
      icon: TrendingUp,
      color: '#2563eb',
      path: '/performance'
    }
  ];

  return (
    <div className="dashboard-container fade-in">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>Welcome back, {userData?.name || user.displayName}!</h1>
            <p>Continue your cybersecurity training journey</p>
          </div>
          <div className="level-badge">
            <Award size={24} />
            <div>
              <div className="level-text">Level</div>
              <div className="level-value">{userData?.level || 'Beginner'}</div>
            </div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#dbeafe' }}>
              <Target size={28} style={{ color: '#2563eb' }} />
            </div>
            <div className="stat-content">
              <div className="stat-label">Total Score</div>
              <div className="stat-value">{userData?.score || 0}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#d1fae5' }}>
              <BookOpen size={28} style={{ color: '#10b981' }} />
            </div>
            <div className="stat-content">
              <div className="stat-label">Scenarios Completed</div>
              <div className="stat-value">{userData?.completedScenarios?.length || 0}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#fef3c7' }}>
              <Award size={28} style={{ color: '#f59e0b' }} />
            </div>
            <div className="stat-content">
              <div className="stat-label">Badges Earned</div>
              <div className="stat-value">{userData?.badges?.length || 0}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#e0e7ff' }}>
              <Shield size={28} style={{ color: '#6366f1' }} />
            </div>
            <div className="stat-content">
              <div className="stat-label">Threat Awareness</div>
              <div className="stat-value">
                {userData?.completedScenarios?.length > 0 ? 'Good' : 'Getting Started'}
              </div>
            </div>
          </div>
        </div>

        <div className="features-section">
          <h2>Training Modules</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="feature-card"
                onClick={() => navigate(feature.path)}
              >
                <div 
                  className="feature-icon" 
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <feature.icon size={32} style={{ color: feature.color }} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <button 
                  className="btn btn-outline"
                  style={{ 
                    borderColor: feature.color, 
                    color: feature.color 
                  }}
                >
                  Start Training
                </button>
              </div>
            ))}
          </div>
        </div>

        {userData?.badges && userData.badges.length > 0 && (
          <div className="badges-section">
            <h2>Your Achievements</h2>
            <div className="badges-container">
              {userData.badges.map((badge, index) => (
                <div key={index} className="badge-item">
                  <Award size={24} />
                  <span>{badge}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
