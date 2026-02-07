import React, { useState, useEffect } from 'react';
import { doc, updateDoc, arrayUnion, increment, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { getRandomScenario } from '../../data/scenarios';
import { 
  Mail, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Info,
  Shield
} from 'lucide-react';
import './PhishingSimulation.css';

const PhishingSimulation = ({ user }) => {
  const [scenario, setScenario] = useState(null);
  const [userAnswer, setUserAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    loadNewScenario();
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setStats({
          correct: data.correctAnswers || 0,
          total: data.totalAttempts || 0
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadNewScenario = () => {
    const newScenario = getRandomScenario();
    setScenario(newScenario);
    setUserAnswer(null);
    setShowResult(false);
  };

  const handleAnswer = async (answer) => {
    setUserAnswer(answer);
    setShowResult(true);
    setLoading(true);

    const isCorrect = answer === scenario.correctAnswer;

    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();

      // Update user stats
      await updateDoc(userRef, {
        totalAttempts: increment(1),
        correctAnswers: isCorrect ? increment(1) : (userData.correctAnswers || 0),
        score: isCorrect ? increment(10) : (userData.score || 0),
        completedScenarios: arrayUnion(scenario.id)
      });

      // Award badges based on milestones
      const newCorrect = (userData.correctAnswers || 0) + (isCorrect ? 1 : 0);
      const badges = userData.badges || [];

      if (newCorrect === 5 && !badges.includes('Novice Detector')) {
        await updateDoc(userRef, {
          badges: arrayUnion('Novice Detector')
        });
      }
      if (newCorrect === 20 && !badges.includes('Phishing Expert')) {
        await updateDoc(userRef, {
          badges: arrayUnion('Phishing Expert')
        });
      }

      setStats({
        correct: newCorrect,
        total: (userData.totalAttempts || 0) + 1
      });
    } catch (error) {
      console.error('Error updating user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getResultIcon = () => {
    if (userAnswer === scenario.correctAnswer) {
      return <CheckCircle size={48} className="result-icon success" />;
    }
    return <XCircle size={48} className="result-icon error" />;
  };

  const getAnswerButton = (answerType, label, color) => {
    return (
      <button
        onClick={() => handleAnswer(answerType)}
        disabled={showResult || loading}
        className={`answer-btn ${userAnswer === answerType ? 'selected' : ''}`}
        style={{ borderColor: color }}
      >
        {label}
      </button>
    );
  };

  if (!scenario) {
    return <div className="spinner"></div>;
  }

  const accuracy = stats.total > 0 
    ? Math.round((stats.correct / stats.total) * 100) 
    : 0;

  return (
    <div className="simulation-container fade-in">
      <div className="container">
        <div className="simulation-header">
          <div>
            <h1>📧 Email Phishing Simulation</h1>
            <p>Analyze the email below and identify if it's safe, suspicious, or a phishing attempt</p>
          </div>
          <div className="stats-compact">
            <div className="stat-compact">
              <span className="stat-label">Accuracy</span>
              <span className="stat-value">{accuracy}%</span>
            </div>
            <div className="stat-compact">
              <span className="stat-label">Score</span>
              <span className="stat-value">{stats.correct}/{stats.total}</span>
            </div>
          </div>
        </div>

        <div className="email-container card">
          <div className="email-header">
            <Mail size={24} />
            <div className="email-meta">
              <div className="email-from">
                <strong>From:</strong> {scenario.from}
              </div>
              <div className="email-subject">
                <strong>Subject:</strong> {scenario.subject}
              </div>
            </div>
            <span className={`difficulty-badge badge-${scenario.difficulty}`}>
              {scenario.difficulty}
            </span>
          </div>

          <div className="email-body">
            {scenario.content.split('\n').map((line, index) => (
              <p key={index}>{line || '\u00A0'}</p>
            ))}
          </div>
        </div>

        {!showResult ? (
          <div className="answer-section">
            <h3>What is your assessment of this email?</h3>
            <div className="answer-buttons">
              {getAnswerButton('safe', '✅ Safe', '#10b981')}
              {getAnswerButton('suspicious', '⚠️ Suspicious', '#f59e0b')}
              {getAnswerButton('phishing', '🎣 Phishing', '#ef4444')}
            </div>
          </div>
        ) : (
          <div className="result-section fade-in">
            <div className="result-header">
              {getResultIcon()}
              <h2>
                {userAnswer === scenario.correctAnswer 
                  ? '🎉 Correct!' 
                  : '❌ Incorrect'}
              </h2>
            </div>

            <div className="result-details card">
              <div className="result-info">
                <Info size={20} />
                <strong>Explanation:</strong>
              </div>
              <p>{scenario.explanation}</p>

              <div className="indicators">
                <h4>Key Indicators:</h4>
                <ul>
                  {scenario.indicators.map((indicator, index) => (
                    <li key={index}>
                      <AlertTriangle size={16} />
                      {indicator}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="correct-answer">
                <Shield size={20} />
                <span>
                  Correct Answer: <strong>{scenario.correctAnswer.toUpperCase()}</strong>
                </span>
              </div>
            </div>

            <button 
              onClick={loadNewScenario} 
              className="btn btn-primary"
            >
              <RefreshCw size={20} />
              Next Scenario
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhishingSimulation;
