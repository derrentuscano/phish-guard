import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Link as LinkIcon, 
  TrendingUp,
  Target,
  Award,
  Lock,
  MousePointer2
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
          const data = userDoc.data();
          setUserData(data);
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
      title: 'Link Analyzer',
      description: 'Analyze URLs to detect suspicious patterns and phishing attempts',
      icon: LinkIcon,
      color: '#f59e0b',
      path: '/link-analyzer'
    },
    {
      title: 'Password Checker',
      description: 'Evaluate the strength and security of your passwords',
      icon: Lock,
      color: '#6366f1',
      path: '/password-checker'
    },
    {
      title: 'Link Hover Preview',
      description: 'Browser extension that checks links on hover — view your scan history & reports',
      icon: MousePointer2,
      color: '#0ea5e9',
      path: '/link-preview'
    }
  ];

  return (
    <div className="dashboard-container fade-in">
      <div className="container">
        <div className="dashboard-header">
          <div className="dashboard-welcome">
            <div className="dashboard-avatar">
              {userData?.avatar || '👤'}
            </div>
            <div>
              <h1>Welcome back, {userData?.displayName || userData?.name || user.displayName}!</h1>
              <p>Your cybersecurity toolkit is ready</p>
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
        </div>

        <div className="features-section">
          <h2>Security Tools</h2>
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
                  Open Tool
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
