import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { 
  User, 
  Edit2, 
  Save, 
  Shield, 
  Trophy,
  Target,
  Calendar,
  BookOpen,
  StickyNote,
  Award,
  TrendingUp,
  CheckCircle,
  Clock,
  X
} from 'lucide-react';
import BadgeDisplay from '../Badges/BadgeDisplay';
import { BADGES } from '../../utils/badges';
import './Profile.css';

const AVATAR_OPTIONS = [
  '👤', '👨', '👩', '🧑', '👨‍💼', '👩‍💼', '🧑‍💼',
  '👨‍🎓', '👩‍🎓', '🧑‍🎓', '👨‍💻', '👩‍💻', '🧑‍💻',
  '🦸', '🦸‍♀️', '🦹', '🦹‍♀️', '🧙', '🧙‍♀️',
  '🤖', '👽', '🦊', '🦁', '🐯', '🐻'
];

const Profile = ({ user }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: '',
    bio: '',
    avatar: '👤'
  });
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchUserData();
  }, [user.uid]);

  const fetchUserData = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data);
        setEditForm({
          displayName: data.displayName || data.name || user.displayName || '',
          bio: data.bio || '',
          avatar: data.avatar || '👤'
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      console.log('Saving profile with avatar:', editForm.avatar);
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: editForm.displayName,
        bio: editForm.bio,
        avatar: editForm.avatar,
        name: editForm.displayName
      });
      
      console.log('Profile saved successfully');
      await fetchUserData();
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const calculateLevel = (score) => {
    if (score >= 500) return { level: 'Master', color: '#8b5cf6' };
    if (score >= 300) return { level: 'Expert', color: '#10b981' };
    if (score >= 150) return { level: 'Advanced', color: '#3b82f6' };
    if (score >= 50) return { level: 'Intermediate', color: '#f59e0b' };
    return { level: 'Beginner', color: '#6b7280' };
  };

  const getSkills = () => {
    const score = userData?.score || 0;
    const attempts = userData?.totalAttempts || 0;
    const successRate = attempts > 0 
      ? ((userData?.successfulAttempts || 0) / attempts) * 100 
      : 0;

    const skills = [];
    
    if (successRate >= 80) skills.push({ name: 'Phishing Detection', level: 'Expert', icon: '🎯' });
    else if (successRate >= 60) skills.push({ name: 'Phishing Detection', level: 'Advanced', icon: '🎯' });
    else if (successRate >= 40) skills.push({ name: 'Phishing Detection', level: 'Intermediate', icon: '🎯' });
    else skills.push({ name: 'Phishing Detection', level: 'Beginner', icon: '🎯' });

    if (score >= 200) skills.push({ name: 'Cyber Awareness', level: 'Expert', icon: '🛡️' });
    else if (score >= 100) skills.push({ name: 'Cyber Awareness', level: 'Advanced', icon: '🛡️' });
    else if (score >= 50) skills.push({ name: 'Cyber Awareness', level: 'Intermediate', icon: '🛡️' });
    else skills.push({ name: 'Cyber Awareness', level: 'Beginner', icon: '🛡️' });

    if (userData?.articlesRead >= 10) skills.push({ name: 'Security Knowledge', level: 'Expert', icon: '📚' });
    else if (userData?.articlesRead >= 5) skills.push({ name: 'Security Knowledge', level: 'Advanced', icon: '📚' });
    else if (userData?.articlesRead >= 2) skills.push({ name: 'Security Knowledge', level: 'Intermediate', icon: '📚' });
    else skills.push({ name: 'Security Knowledge', level: 'Beginner', icon: '📚' });

    const streak = userData?.currentStreak || 0;
    if (streak >= 30) skills.push({ name: 'Consistency', level: 'Master', icon: '🔥' });
    else if (streak >= 14) skills.push({ name: 'Consistency', level: 'Expert', icon: '🔥' });
    else if (streak >= 7) skills.push({ name: 'Consistency', level: 'Advanced', icon: '🔥' });
    else if (streak >= 3) skills.push({ name: 'Consistency', level: 'Intermediate', icon: '🔥' });
    else skills.push({ name: 'Consistency', level: 'Beginner', icon: '🔥' });

    return skills;
  };

  const getActivityTimeline = () => {
    const timeline = [];
    
    // Add registration
    if (userData?.createdAt) {
      timeline.push({
        type: 'joined',
        title: 'Joined PhishGuard',
        date: new Date(userData.createdAt),
        icon: '🎉',
        color: '#10b981'
      });
    }

    // Add badge achievements
    if (userData?.earnedBadges) {
      userData.earnedBadges.forEach(badge => {
        timeline.push({
          type: 'badge',
          title: `Earned ${badge.name}`,
          description: badge.description,
          date: new Date(), // In real app, track badge earn date
          icon: badge.icon,
          color: '#f59e0b'
        });
      });
    }

    // Add milestones
    const score = userData?.score || 0;
    if (score >= 50) {
      timeline.push({
        type: 'milestone',
        title: 'Reached 50 points',
        date: new Date(),
        icon: '⭐',
        color: '#3b82f6'
      });
    }
    if (score >= 150) {
      timeline.push({
        type: 'milestone',
        title: 'Reached 150 points',
        date: new Date(),
        icon: '🌟',
        color: '#3b82f6'
      });
    }

    return timeline.sort((a, b) => b.date - a.date).slice(0, 10);
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  const levelInfo = calculateLevel(userData?.score || 0);
  const skills = getSkills();
  const timeline = getActivityTimeline();
  const earnedBadges = userData?.earnedBadges || [];
  const bookmarkedArticles = userData?.bookmarkedArticles || [];
  const scenarioNotes = userData?.scenarioNotes || [];

  return (
    <div className="profile-container">
      <div className="container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-header-content">
            <div className="profile-avatar-section">
              {editing ? (
                <div className="avatar-selector">
                  <div className="avatar-grid">
                    {AVATAR_OPTIONS.map((av, idx) => (
                      <button
                        key={idx}
                        className={`avatar-option ${editForm.avatar === av ? 'selected' : ''}`}
                        onClick={() => {
                          console.log('Avatar clicked:', av);
                          setEditForm({ ...editForm, avatar: av });
                        }}
                      >
                        {av}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="profile-avatar">
                  {userData?.avatar || '👤'}
                </div>
              )}
            </div>

            <div className="profile-info">
              {editing ? (
                <div className="edit-form">
                  <input
                    type="text"
                    className="edit-input"
                    placeholder="Display Name"
                    value={editForm.displayName}
                    onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                  />
                  <textarea
                    className="edit-textarea"
                    placeholder="Tell us about yourself..."
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    rows={3}
                  />
                  <div className="edit-buttons">
                    <button className="btn btn-primary" onClick={handleSaveProfile}>
                      <Save size={18} />
                      Save
                    </button>
                    <button className="btn btn-outline" onClick={() => setEditing(false)}>
                      <X size={18} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="profile-name-section">
                    <h1>{userData?.displayName || userData?.name || user.displayName || 'Anonymous User'}</h1>
                    <button className="btn-edit" onClick={() => setEditing(true)}>
                      <Edit2 size={18} />
                      Edit Profile
                    </button>
                  </div>
                  <p className="profile-email">{user.email}</p>
                  {userData?.bio && <p className="profile-bio">{userData.bio}</p>}
                  
                  <div className="profile-level-badge" style={{ background: levelInfo.color }}>
                    <Award size={20} />
                    <span>{levelInfo.level}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="profile-stats-summary">
            <div className="stat-summary-item">
              <Target size={24} />
              <div>
                <div className="stat-summary-value">{userData?.score || 0}</div>
                <div className="stat-summary-label">Total Points</div>
              </div>
            </div>
            <div className="stat-summary-item">
              <Trophy size={24} />
              <div>
                <div className="stat-summary-value">{earnedBadges.length}</div>
                <div className="stat-summary-label">Badges</div>
              </div>
            </div>
            <div className="stat-summary-item">
              <CheckCircle size={24} />
              <div>
                <div className="stat-summary-value">{userData?.totalAttempts || 0}</div>
                <div className="stat-summary-label">Completed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="profile-tabs">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <User size={18} />
            Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'skills' ? 'active' : ''}`}
            onClick={() => setActiveTab('skills')}
          >
            <Target size={18} />
            Skills
          </button>
          <button 
            className={`tab-button ${activeTab === 'badges' ? 'active' : ''}`}
            onClick={() => setActiveTab('badges')}
          >
            <Trophy size={18} />
            Badges ({earnedBadges.length})
          </button>
          <button 
            className={`tab-button ${activeTab === 'timeline' ? 'active' : ''}`}
            onClick={() => setActiveTab('timeline')}
          >
            <Clock size={18} />
            Timeline
          </button>
          <button 
            className={`tab-button ${activeTab === 'bookmarks' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookmarks')}
          >
            <BookOpen size={18} />
            Bookmarks ({bookmarkedArticles.length})
          </button>
          <button 
            className={`tab-button ${activeTab === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveTab('notes')}
          >
            <StickyNote size={18} />
            Notes ({scenarioNotes.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="profile-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="overview-section">
                <h2>
                  <TrendingUp size={24} />
                  Progress Overview
                </h2>
                <div className="progress-cards">
                  <div className="progress-card">
                    <div className="progress-card-header">
                      <span>Success Rate</span>
                      <span className="progress-percentage">
                        {userData?.totalAttempts > 0 
                          ? Math.round(((userData?.successfulAttempts || 0) / userData.totalAttempts) * 100)
                          : 0}%
                      </span>
                    </div>
                    <div className="progress-bar-container">
                      <div 
                        className="progress-bar-fill"
                        style={{ 
                          width: `${userData?.totalAttempts > 0 
                            ? ((userData?.successfulAttempts || 0) / userData.totalAttempts) * 100
                            : 0}%`,
                          background: '#10b981'
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="progress-card">
                    <div className="progress-card-header">
                      <span>Current Streak</span>
                      <span className="progress-percentage">{userData?.currentStreak || 0} days</span>
                    </div>
                    <div className="progress-bar-container">
                      <div 
                        className="progress-bar-fill"
                        style={{ 
                          width: `${Math.min((userData?.currentStreak || 0) / 30 * 100, 100)}%`,
                          background: '#f97316'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="overview-section">
                <h2>
                  <Target size={24} />
                  Top Skills
                </h2>
                <div className="skills-preview">
                  {skills.slice(0, 3).map((skill, idx) => (
                    <div key={idx} className="skill-preview-card">
                      <span className="skill-icon">{skill.icon}</span>
                      <div>
                        <div className="skill-name">{skill.name}</div>
                        <div className="skill-level">{skill.level}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="skills-tab">
              <h2>Your Skills</h2>
              <div className="skills-grid">
                {skills.map((skill, idx) => (
                  <div key={idx} className="skill-card">
                    <span className="skill-icon-large">{skill.icon}</span>
                    <h3>{skill.name}</h3>
                    <span className={`skill-badge ${skill.level.toLowerCase()}`}>
                      {skill.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'badges' && (
            <div className="badges-tab">
              <h2>All Badges ({earnedBadges.length} / {Object.keys(BADGES).length})</h2>
              <div className="badges-grid">
                {Object.values(BADGES).map((badge) => {
                  const earned = earnedBadges.find(b => b.id === badge.id);
                  return (
                    <BadgeDisplay 
                      key={badge.id} 
                      badge={badge} 
                      size="medium" 
                      earned={!!earned}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="timeline-tab">
              <h2>
                <Calendar size={24} />
                Activity Timeline
              </h2>
              <div className="timeline">
                {timeline.length > 0 ? (
                  timeline.map((item, idx) => (
                    <div key={idx} className="timeline-item">
                      <div className="timeline-icon" style={{ background: item.color }}>
                        {item.icon}
                      </div>
                      <div className="timeline-content">
                        <h3>{item.title}</h3>
                        {item.description && <p>{item.description}</p>}
                        <span className="timeline-date">
                          {item.date.toLocaleDateString('en-US', { 
                            month: 'long', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="empty-state">No activity yet. Start training to build your timeline!</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'bookmarks' && (
            <div className="bookmarks-tab">
              <h2>
                <BookOpen size={24} />
                Bookmarked Articles
              </h2>
              {bookmarkedArticles.length > 0 ? (
                <div className="bookmarks-list">
                  {bookmarkedArticles.map((article, idx) => (
                    <div key={idx} className="bookmark-card">
                      <span className="bookmark-icon">{article.icon || '📄'}</span>
                      <div>
                        <h3>{article.title}</h3>
                        <p>{article.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-state">No bookmarked articles yet. Browse articles and save your favorites!</p>
              )}
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="notes-tab">
              <h2>
                <StickyNote size={24} />
                Scenario Notes
              </h2>
              {scenarioNotes.length > 0 ? (
                <div className="notes-list">
                  {scenarioNotes.map((note, idx) => (
                    <div key={idx} className="note-card">
                      <div className="note-header">
                        <h3>{note.scenarioTitle}</h3>
                        <span className="note-date">
                          {new Date(note.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p>{note.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-state">No notes yet. Add notes to scenarios as you practice!</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
