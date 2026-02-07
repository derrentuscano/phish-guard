import React, { useState, useEffect } from 'react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { 
  TrendingUp, 
  Target, 
  Award, 
  Activity,
  CheckCircle,
  BookOpen,
  Trophy,
  Zap
} from 'lucide-react';
import './Performance.css';

const Performance = ({ user }) => {
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerformanceData();
  }, [user.uid]);

  const fetchPerformanceData = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data);

        // Calculate statistics
        const totalAttempts = data.totalAttempts || 0;
        const correctAnswers = data.correctAnswers || 0;
        const accuracy = totalAttempts > 0 
          ? Math.round((correctAnswers / totalAttempts) * 100) 
          : 0;

        const quizzesCompleted = data.quizzesCompleted || 0;
        const totalQuizScore = data.totalQuizScore || 0;
        const avgQuizScore = quizzesCompleted > 0
          ? Math.round(totalQuizScore / quizzesCompleted)
          : 0;

        setStats({
          accuracy,
          totalAttempts,
          correctAnswers,
          quizzesCompleted,
          avgQuizScore,
          score: data.score || 0,
          level: data.level || 'Beginner',
          badges: data.badges || [],
          completedScenarios: data.completedScenarios || []
        });
      }
    } catch (error) {
      console.error('Error fetching performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelProgress = () => {
    const score = stats?.score || 0;
    const levels = [
      { name: 'Beginner', min: 0, max: 50, color: '#94a3b8' },
      { name: 'Intermediate', min: 50, max: 150, color: '#3b82f6' },
      { name: 'Advanced', min: 150, max: 300, color: '#8b5cf6' },
      { name: 'Expert', min: 300, max: 500, color: '#f59e0b' },
      { name: 'Master', min: 500, max: Infinity, color: '#10b981' }
    ];

    const currentLevel = levels.find(l => score >= l.min && score < l.max) || levels[0];
    const nextLevel = levels[levels.indexOf(currentLevel) + 1];

    const progress = nextLevel 
      ? Math.round(((score - currentLevel.min) / (nextLevel.max - currentLevel.min)) * 100)
      : 100;

    return { currentLevel, nextLevel, progress };
  };

  const getStrengthsWeaknesses = () => {
    const accuracy = stats?.accuracy || 0;
    const quizPerformance = stats?.avgQuizScore || 0;
    const totalAttempts = stats?.totalAttempts || 0;

    const strengths = [];
    const weaknesses = [];

    if (accuracy >= 80) {
      strengths.push('Email Analysis - Excellent detection rate');
    } else if (accuracy < 60 && totalAttempts > 5) {
      weaknesses.push('Email Analysis - Need more practice identifying threats');
    }

    if (quizPerformance >= 80) {
      strengths.push('Quiz Performance - Consistently high scores');
    } else if (quizPerformance < 60 && stats.quizzesCompleted > 2) {
      weaknesses.push('Quiz Performance - Review threat indicators');
    }

    if (stats?.completedScenarios?.length >= 20) {
      strengths.push('Experience - Completed many scenarios');
    }

    if (totalAttempts < 10) {
      weaknesses.push('Practice - Complete more scenarios to improve');
    }

    return { strengths, weaknesses };
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  const levelInfo = getLevelProgress();
  const { strengths, weaknesses } = getStrengthsWeaknesses();

  return (
    <div className="performance-container fade-in">
      <div className="container">
        <div className="performance-header">
          <div>
            <h1>📊 Performance Dashboard</h1>
            <p>Track your progress and improve your cybersecurity skills</p>
          </div>
        </div>

        {/* Level Progress */}
        <div className="level-progress-section card">
          <h2>
            <TrendingUp size={24} />
            Your Level: {stats?.level}
          </h2>
          
          <div className="level-info">
            <div className="level-badges">
              <div 
                className="level-badge current"
                style={{ backgroundColor: levelInfo.currentLevel.color }}
              >
                {levelInfo.currentLevel.name}
              </div>
              {levelInfo.nextLevel && (
                <>
                  <div className="level-arrow">→</div>
                  <div 
                    className="level-badge next"
                    style={{ borderColor: levelInfo.nextLevel.color, color: levelInfo.nextLevel.color }}
                  >
                    {levelInfo.nextLevel.name}
                  </div>
                </>
              )}
            </div>

            <div className="level-progress-bar">
              <div 
                className="level-progress-fill"
                style={{ 
                  width: `${levelInfo.progress}%`,
                  backgroundColor: levelInfo.currentLevel.color 
                }}
              ></div>
            </div>

            <div className="level-text">
              {stats?.score || 0} points
              {levelInfo.nextLevel && ` - ${levelInfo.nextLevel.min - stats.score} points to ${levelInfo.nextLevel.name}`}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-section">
          <h2>Key Metrics</h2>
          <div className="metrics-grid">
            <div className="metric-card card">
              <div className="metric-icon" style={{ backgroundColor: '#dbeafe' }}>
                <Target size={32} style={{ color: '#2563eb' }} />
              </div>
              <div className="metric-value">{stats?.accuracy || 0}%</div>
              <div className="metric-label">Overall Accuracy</div>
            </div>

            <div className="metric-card card">
              <div className="metric-icon" style={{ backgroundColor: '#d1fae5' }}>
                <CheckCircle size={32} style={{ color: '#10b981' }} />
              </div>
              <div className="metric-value">{stats?.correctAnswers || 0}</div>
              <div className="metric-label">Correct Identifications</div>
            </div>

            <div className="metric-card card">
              <div className="metric-icon" style={{ backgroundColor: '#fef3c7' }}>
                <Trophy size={32} style={{ color: '#f59e0b' }} />
              </div>
              <div className="metric-value">{stats?.quizzesCompleted || 0}</div>
              <div className="metric-label">Quizzes Completed</div>
            </div>

            <div className="metric-card card">
              <div className="metric-icon" style={{ backgroundColor: '#e0e7ff' }}>
                <Zap size={32} style={{ color: '#6366f1' }} />
              </div>
              <div className="metric-value">{stats?.avgQuizScore || 0}%</div>
              <div className="metric-label">Avg Quiz Score</div>
            </div>

            <div className="metric-card card">
              <div className="metric-icon" style={{ backgroundColor: '#fce7f3' }}>
                <BookOpen size={32} style={{ color: '#ec4899' }} />
              </div>
              <div className="metric-value">{stats?.totalAttempts || 0}</div>
              <div className="metric-label">Total Attempts</div>
            </div>

            <div className="metric-card card">
              <div className="metric-icon" style={{ backgroundColor: '#fef2f2' }}>
                <Activity size={32} style={{ color: '#ef4444' }} />
              </div>
              <div className="metric-value">{stats?.completedScenarios?.length || 0}</div>
              <div className="metric-label">Scenarios Completed</div>
            </div>
          </div>
        </div>

        {/* Strengths and Weaknesses */}
        <div className="analysis-section">
          <div className="analysis-grid">
            <div className="analysis-card card strengths">
              <h3>
                <CheckCircle size={24} />
                Strengths
              </h3>
              {strengths.length > 0 ? (
                <ul>
                  {strengths.map((strength, index) => (
                    <li key={index}>
                      <CheckCircle size={16} />
                      {strength}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="empty-state">Complete more training to identify your strengths!</p>
              )}
            </div>

            <div className="analysis-card card weaknesses">
              <h3>
                <Target size={24} />
                Areas for Improvement
              </h3>
              {weaknesses.length > 0 ? (
                <ul>
                  {weaknesses.map((weakness, index) => (
                    <li key={index}>
                      <Target size={16} />
                      {weakness}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="empty-state">Great job! Keep up the good work!</p>
              )}
            </div>
          </div>
        </div>

        {/* Badges */}
        {stats?.badges && stats.badges.length > 0 && (
          <div className="badges-section">
            <h2>
              <Award size={28} />
              Earned Badges ({stats.badges.length})
            </h2>
            <div className="badges-grid">
              {stats.badges.map((badge, index) => (
                <div key={index} className="badge-card card">
                  <Award size={48} />
                  <div className="badge-name">{badge}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div className="recommendations-section card">
          <h3>
            <TrendingUp size={24} />
            Recommendations
          </h3>
          <ul>
            {stats?.totalAttempts < 10 && (
              <li>Complete more email simulations to improve your detection skills</li>
            )}
            {stats?.quizzesCompleted < 3 && (
              <li>Take more quizzes to test your knowledge under pressure</li>
            )}
            {stats?.accuracy < 70 && stats?.totalAttempts > 5 && (
              <li>Review the explanations for missed scenarios to learn from mistakes</li>
            )}
            {stats?.avgQuizScore < 70 && stats?.quizzesCompleted > 2 && (
              <li>Focus on understanding common phishing indicators</li>
            )}
            {stats?.score < 50 && (
              <li>Practice with the Link Analyzer to better understand URL threats</li>
            )}
            {stats?.accuracy >= 80 && stats?.quizzesCompleted >= 5 && (
              <li>Excellent progress! You're becoming a phishing detection expert!</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Performance;
