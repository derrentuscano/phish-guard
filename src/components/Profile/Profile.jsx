import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import {
  User,
  Edit2,
  Save,
  Shield,
  Target,
  Activity,
  Award,
  TrendingUp,
  CheckCircle,
  Clock,
  X,
  ScanSearch,
  Lock,
  FileSearch,
  ScanEye,
  Terminal
} from 'lucide-react';

import './Profile.css';

const AVATAR_OPTIONS = [
  '👤', '👨', '👩', '🧑', '👨‍💼', '👩‍💼', '🧑‍💼',
  '👨‍💻', '👩‍💻', '🧑‍💻', '🦸', '🦸‍♀️', '🦹', '🦹‍♀️', 
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
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: editForm.displayName,
        bio: editForm.bio,
        avatar: editForm.avatar,
        name: editForm.displayName
      });

      await fetchUserData();
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const calculateRank = (score) => {
    if (score >= 1000) return { title: 'Elite Operator', color: '#8b5cf6' };
    if (score >= 500) return { title: 'Senior Analyst', color: '#ec4899' };
    if (score >= 200) return { title: 'Security Specialist', color: '#0ea5e9' };
    if (score >= 50) return { title: 'Junior Investigator', color: '#00cc6a' };
    return { title: 'Rookie Agent', color: '#6b7280' };
  };

  const getActivityTimeline = () => {
    const timeline = [];

    // Add registration
    if (userData?.createdAt) {
      timeline.push({
        type: 'joined',
        title: 'INITIALIZED_ACCOUNT',
        description: 'Agent joined the PhishGuard network.',
        date: new Date(userData.createdAt),
        icon: <Terminal size={16} />,
        color: '#00cc6a'
      });
    }

    // Add milestones based on score (simulated timeline since we don't have exact dates)
    const score = userData?.score || 0;
    if (score >= 50) {
      timeline.push({
        type: 'milestone',
        title: 'RANK_UPGRADE: Junior Investigator',
        description: 'Achieved 50 security points through active scanning.',
        date: new Date(userData?.createdAt ? userData.createdAt + 86400000 : Date.now()), // Mock date
        icon: <TrendingUp size={16} />,
        color: '#0ea5e9'
      });
    }
    if (score >= 200) {
      timeline.push({
        type: 'milestone',
        title: 'RANK_UPGRADE: Security Specialist',
        description: 'Achieved 200 security points.',
        date: new Date(userData?.createdAt ? userData.createdAt + 86400000*5 : Date.now()), // Mock date
        icon: <Award size={16} />,
        color: '#8b5cf6'
      });
    }

    return timeline.sort((a, b) => b.date - a.date).slice(0, 10);
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="hud-spinner" />
        <div className="loading-text">RETRIEVING_AGENT_DOSSIER...</div>
      </div>
    );
  }

  const rankInfo = calculateRank(userData?.score || 0);
  const timeline = getActivityTimeline();

  // Mocking tool usage stats from `totalAttempts` since we don't have detailed breakdown
  const totalScans = userData?.totalAttempts || 0;
  const linkScans = Math.ceil(totalScans * 0.4);
  const fileScans = Math.ceil(totalScans * 0.3);
  const imageScans = Math.floor(totalScans * 0.3);

  return (
    <div className="profile-container">
      <div className="scan-line-overlay" />
      <div className="container hud-layout">
        
        {/* Profile Header Dossier */}
        <div className="dossier-header fade-in">
          <div className="dossier-content">
            <div className="avatar-section">
              {editing ? (
                <div className="avatar-selector">
                  <div className="avatar-grid">
                    {AVATAR_OPTIONS.map((av, idx) => (
                      <button
                        key={idx}
                        className={`avatar-option ${editForm.avatar === av ? 'selected' : ''}`}
                        onClick={() => setEditForm({ ...editForm, avatar: av })}
                      >
                        {av}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="dossier-avatar">
                  {userData?.avatar || '👤'}
                  <div className="avatar-scanner" />
                </div>
              )}
            </div>

            <div className="dossier-info">
              {editing ? (
                <div className="edit-form">
                  <div className="input-group">
                    <label>CODENAME / ALIAS</label>
                    <input
                      type="text"
                      className="edit-input"
                      placeholder="Display Name"
                      value={editForm.displayName}
                      onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label>AGENT BIO</label>
                    <textarea
                      className="edit-textarea"
                      placeholder="Enter security specialization or bio..."
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="edit-buttons">
                    <button className="btn btn-primary btn-save" onClick={handleSaveProfile}>
                      <Save size={16} /> COMMIT_CHANGES
                    </button>
                    <button className="btn btn-outline btn-cancel" onClick={() => setEditing(false)}>
                      <X size={16} /> ABORT
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="name-row">
                    <h1>{userData?.displayName || userData?.name || user.displayName || 'UNKNOWN_AGENT'}</h1>
                    <button className="btn-edit" onClick={() => setEditing(true)}>
                      <Edit2 size={14} /> EDIT_DOSSIER
                    </button>
                  </div>
                  <div className="email-row">
                    <span className="label">CONTACT_ID:</span> {user.email}
                  </div>
                  {userData?.bio && <div className="bio-row"><span className="label">BIO:</span> {userData.bio}</div>}

                  <div className="rank-badge" style={{ borderColor: rankInfo.color, color: rankInfo.color, background: `${rankInfo.color}15` }}>
                    <Shield size={16} />
                    <span>CLASS: {rankInfo.title.toUpperCase()}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="stats-summary-grid">
            <div className="stat-card">
              <Target size={20} className="stat-icon threat" />
              <div className="stat-data">
                <div className="stat-value">{userData?.score || 0}</div>
                <div className="stat-label">THREAT_AVOIDANCE_SCORE</div>
              </div>
            </div>
            <div className="stat-card">
              <Activity size={20} className="stat-icon total" />
              <div className="stat-data">
                <div className="stat-value">{totalScans}</div>
                <div className="stat-label">TOTAL_SCANS_EXECUTED</div>
              </div>
            </div>
            <div className="stat-card">
              <CheckCircle size={20} className="stat-icon success" />
              <div className="stat-data">
                <div className="stat-value">
                  {totalScans > 0 ? Math.round(((userData?.successfulAttempts || 0) / totalScans) * 100) : 0}%
                </div>
                <div className="stat-label">SUCCESS_RATE</div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="profile-tabs fade-in" style={{animationDelay: '0.1s'}}>
          <button
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <User size={16} />
            OVERVIEW
          </button>
          
          <button
            className={`tab-button ${activeTab === 'timeline' ? 'active' : ''}`}
            onClick={() => setActiveTab('timeline')}
          >
            <Clock size={16} />
            ACTIVITY_LOG
          </button>
        </div>

        {/* Tab Content */}
        <div className="profile-content fade-in" style={{animationDelay: '0.2s'}}>
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="overview-section">
                <h2 className="section-title">
                  <Activity size={18} />
                  MODULE_UTILIZATION
                </h2>
                <div className="utilization-grid">
                  <div className="util-card util-link">
                    <ScanSearch size={24} className="util-icon" />
                    <div className="util-info">
                      <span className="util-val">{linkScans}</span>
                      <span className="util-lbl">URLs Analyzed</span>
                    </div>
                  </div>
                  <div className="util-card util-file">
                    <FileSearch size={24} className="util-icon" />
                    <div className="util-info">
                      <span className="util-val">{fileScans}</span>
                      <span className="util-lbl">Files Scanned</span>
                    </div>
                  </div>
                  <div className="util-card util-image">
                    <ScanEye size={24} className="util-icon" />
                    <div className="util-info">
                      <span className="util-val">{imageScans}</span>
                      <span className="util-lbl">Images Inspected</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="overview-section">
                <h2 className="section-title">
                  <TrendingUp size={18} />
                  AGENT_CONSISTENCY
                </h2>
                <div className="consistency-card">
                  <div className="cons-header">
                    <span>Active Scanning Streak</span>
                    <span className="cons-val">{userData?.currentStreak || 0} DAYS</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${Math.min(((userData?.currentStreak || 0) / 30) * 100, 100)}%`,
                        background: '#f59e0b'
                      }}
                    />
                  </div>
                  <div className="cons-footer">Maintain streaks to prove reliability. Target: 30 Days</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="timeline-tab">
              <h2 className="section-title">
                <Terminal size={18} />
                SYSTEM_LOGS
              </h2>
              <div className="timeline">
                {timeline.length > 0 ? (
                  timeline.map((item, idx) => (
                    <div key={idx} className="timeline-item">
                      <div className="timeline-icon" style={{ color: item.color, borderColor: `${item.color}50`, background: `${item.color}10` }}>
                        {item.icon}
                      </div>
                      <div className="timeline-content">
                        <h3>{item.title}</h3>
                        {item.description && <p>{item.description}</p>}
                        <span className="timeline-date">
                          {item.date.toLocaleDateString('en-US', {
                            month: 'short',
                            day: '2-digit',
                            year: 'numeric'
                          })} · {item.date.toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="log-empty">
                    <Terminal size={32} opacity={0.5} />
                    <p>NO_LOGS_FOUND. INITIATE SCANS TO POPULATE.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
