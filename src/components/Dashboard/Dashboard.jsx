import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
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
  BookOpen,
  Flame,
  Calendar,
  Lock
} from 'lucide-react';
import BadgeDisplay from '../Badges/BadgeDisplay';
import BadgeNotification from '../Badges/BadgeNotification';
import { checkBadges, getNewBadges, BADGES } from '../../utils/badges';
import { updateStreak, getStreakMessage, getStreakEmoji } from '../../utils/streakTracker';
import './Dashboard.css';

const Dashboard = ({ user }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newBadge, setNewBadge] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
          
          // Update streak
          const streakUpdate = updateStreak(data);
          if (streakUpdate) {
            await updateDoc(doc(db, 'users', user.uid), streakUpdate);
            setUserData(prev => ({ ...prev, ...streakUpdate }));
          }
          
          // Check for new badges
          const earnedBadges = checkBadges(data);
          const oldBadges = data.earnedBadges || [];
          const newBadges = getNewBadges(oldBadges, earnedBadges);
          
          if (newBadges.length > 0) {
            // Show first new badge
            setNewBadge(newBadges[0]);
            
            // Update user's badges in Firestore
            await updateDoc(doc(db, 'users', user.uid), {
              earnedBadges: earnedBadges
            });
            setUserData(prev => ({ ...prev, earnedBadges }));
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    
    // Auto-refresh user data every 10 seconds
    const refreshInterval = setInterval(() => {
      fetchUserData();
    }, 10000);

    return () => clearInterval(refreshInterval);
  }, [user.uid]);

  if (loading) {
    return <div className="spinner"></div>;
  }

  // Calculate level from score
  const calculateLevel = (score) => {
    if (score >= 500) return 'Master';
    if (score >= 300) return 'Expert';
    if (score >= 150) return 'Advanced';
    if (score >= 50) return 'Intermediate';
    return 'Beginner';
  };

  const currentLevel = calculateLevel(userData?.score || 0);
  const earnedBadges = userData?.earnedBadges || [];
  const currentStreak = userData?.currentStreak || 0;
  const longestStreak = userData?.longestStreak || 0;

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
      title: 'Password Checker',
      description: 'Learn to create strong passwords',
      icon: Lock,
      color: '#6366f1',
      path: '/password-checker'
    },
    {
      title: 'Security Articles',
      description: 'Read expert security guides',
      icon: BookOpen,
      color: '#8b5cf6',
      path: '/articles'
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
      {newBadge && (
        <BadgeNotification 
          badge={newBadge} 
          onClose={() => setNewBadge(null)} 
        />
      )}
      
      <div className="container">
        <div className="dashboard-header">
          <div className="dashboard-welcome">
            <div className="dashboard-avatar">
              {userData?.avatar || '👤'}
            </div>
            <div>
              <h1>Welcome back, {userData?.displayName || userData?.name || user.displayName}!</h1>
              <p>Continue your cybersecurity training journey</p>
            </div>
          </div>
          <div className="level-badge">
            <Award size={24} />
            <div>
              <div className="level-text">Level</div>
              <div className="level-value">{currentLevel}</div>
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
              <div className="stat-value">{userData?.totalAttempts || 0}</div>
            </div>
          </div>

          <div className="stat-card streak-card">
            <div className="stat-icon" style={{ backgroundColor: '#ffedd5' }}>
              <Flame size={28} style={{ color: '#f97316' }} />
            </div>
            <div className="stat-content">
              <div className="stat-label">Current Streak {getStreakEmoji(currentStreak)}</div>
              <div className="stat-value">{currentStreak} days</div>
              <div className="stat-subtitle">{getStreakMessage(currentStreak)}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#fef3c7' }}>
              <Trophy size={28} style={{ color: '#f59e0b' }} />
            </div>
            <div className="stat-content">
              <div className="stat-label">Badges Earned</div>
              <div className="stat-value">{earnedBadges.length} / {Object.keys(BADGES).length}</div>
            </div>
          </div>
        </div>

        {/* Streak Details */}
        {(currentStreak > 0 || longestStreak > 0) && (
          <div className="streak-details-card">
            <div className="streak-details-header">
              <Calendar size={24} />
              <h3>Streak Information</h3>
            </div>
            <div className="streak-details-content">
              <div className="streak-detail">
                <span className="streak-detail-label">Current Streak:</span>
                <span className="streak-detail-value">{currentStreak} days {getStreakEmoji(currentStreak)}</span>
              </div>
              <div className="streak-detail">
                <span className="streak-detail-label">Longest Streak:</span>
                <span className="streak-detail-value">{longestStreak} days 🏆</span>
              </div>
              <div className="streak-motivation">
                {currentStreak === longestStreak && currentStreak > 0 
                  ? "You're at your personal best! 🎉" 
                  : currentStreak > 0 
                  ? "Keep going to beat your record!" 
                  : "Start a streak today!"
                }
              </div>
            </div>
          </div>
        )}

        {/* Badges Section */}
        {earnedBadges.length > 0 && (
          <div className="badges-showcase">
            <div className="section-header">
              <h2>Your Achievements</h2>
              <p>You've earned {earnedBadges.length} out of {Object.keys(BADGES).length} badges!</p>
            </div>
            <div className="badges-grid badges-grid-small">
              {earnedBadges.slice(0, 6).map((badge) => (
                <BadgeDisplay key={badge.id} badge={badge} size="small" />
              ))}
              {earnedBadges.length > 6 && (
                <div className="view-all-badges" onClick={() => navigate('/performance')}>
                  <span>+{earnedBadges.length - 6} more</span>
                  <p>View All</p>
                </div>
              )}
            </div>
          </div>
        )}

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
      </div>
    </div>
  );
};

export default Dashboard;
