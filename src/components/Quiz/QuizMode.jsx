import React, { useState, useEffect } from 'react';
import { doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { phishingScenarios } from '../../data/scenarios';
import { Trophy, Clock, CheckCircle, XCircle, Award, RefreshCw } from 'lucide-react';
import './QuizMode.css';

const QuizMode = ({ user }) => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [quizComplete, setQuizComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  useEffect(() => {
    if (quizStarted && !quizComplete) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            submitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quizStarted, quizComplete]);

  const startQuiz = () => {
    // Select 5 random questions
    const shuffled = [...phishingScenarios].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);
    setQuestions(selected);
    setQuizStarted(true);
    setCurrentQuestion(0);
    setAnswers([]);
    setQuizComplete(false);
    setScore(0);
    setTimeLeft(300);
    setSelectedAnswer(null);
  };

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
  };

  const nextQuestion = () => {
    const newAnswers = [...answers, {
      questionId: questions[currentQuestion].id,
      userAnswer: selectedAnswer,
      correctAnswer: questions[currentQuestion].correctAnswer,
      isCorrect: selectedAnswer === questions[currentQuestion].correctAnswer
    }];
    
    setAnswers(newAnswers);
    setSelectedAnswer(null);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitQuiz(newAnswers);
    }
  };

  const submitQuiz = async (finalAnswers = answers) => {
    const correctCount = finalAnswers.filter(a => a.isCorrect).length;
    const finalScore = Math.round((correctCount / questions.length) * 100);
    setScore(finalScore);
    setQuizComplete(true);

    // Update user stats in Firestore
    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();
      
      await updateDoc(userRef, {
        quizzesCompleted: increment(1),
        totalQuizScore: increment(finalScore),
        score: increment(correctCount * 10)
      });

      // Award badges
      const quizzesCompleted = (userData.quizzesCompleted || 0) + 1;
      const badges = userData.badges || [];

      if (finalScore === 100 && !badges.includes('Perfect Score')) {
        await updateDoc(userRef, {
          badges: [...badges, 'Perfect Score']
        });
      }

      if (quizzesCompleted === 10 && !badges.includes('Quiz Master')) {
        await updateDoc(userRef, {
          badges: [...badges, 'Quiz Master']
        });
      }
    } catch (error) {
      console.error('Error updating quiz results:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!quizStarted) {
    return (
      <div className="quiz-container fade-in">
        <div className="container">
          <div className="quiz-start">
            <Trophy size={64} className="quiz-icon" />
            <h1>🏆 Quiz Challenge</h1>
            <p>Test your phishing detection skills!</p>

            <div className="quiz-info card">
              <h3>Quiz Information</h3>
              <ul>
                <li>📝 5 random phishing scenarios</li>
                <li>⏱️ 5 minutes time limit</li>
                <li>🎯 Score based on correct answers</li>
                <li>🏅 Earn badges for achievements</li>
              </ul>
            </div>

            <button onClick={startQuiz} className="btn btn-primary btn-large">
              <Trophy size={24} />
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (quizComplete) {
    const correctCount = answers.filter(a => a.isCorrect).length;
    const percentage = Math.round((correctCount / questions.length) * 100);

    return (
      <div className="quiz-container fade-in">
        <div className="container">
          <div className="quiz-results">
            <div className="results-header">
              {percentage >= 80 ? (
                <Trophy size={64} className="result-icon success" />
              ) : percentage >= 60 ? (
                <Award size={64} className="result-icon warning" />
              ) : (
                <XCircle size={64} className="result-icon error" />
              )}
              
              <h1>Quiz Complete!</h1>
              <div className="score-circle">
                <div className="score-percentage">{percentage}%</div>
                <div className="score-text">{correctCount} of {questions.length} correct</div>
              </div>
            </div>

            <div className="answers-review">
              <h2>Answer Review</h2>
              {questions.map((question, index) => {
                const userAnswer = answers[index];
                return (
                  <div key={index} className={`answer-card card ${userAnswer?.isCorrect ? 'correct' : 'incorrect'}`}>
                    <div className="answer-header">
                      <span className="question-number">Question {index + 1}</span>
                      {userAnswer?.isCorrect ? (
                        <CheckCircle size={24} className="answer-icon correct" />
                      ) : (
                        <XCircle size={24} className="answer-icon incorrect" />
                      )}
                    </div>
                    
                    <div className="question-content">
                      <strong>From:</strong> {question.from}
                      <br />
                      <strong>Subject:</strong> {question.subject}
                    </div>

                    <div className="answer-details">
                      <div className="answer-row">
                        <span>Your Answer:</span>
                        <span className={userAnswer?.isCorrect ? 'correct-text' : 'incorrect-text'}>
                          {userAnswer?.userAnswer || 'Not answered'}
                        </span>
                      </div>
                      {!userAnswer?.isCorrect && (
                        <div className="answer-row">
                          <span>Correct Answer:</span>
                          <span className="correct-text">{question.correctAnswer}</span>
                        </div>
                      )}
                    </div>

                    <div className="explanation">
                      <strong>Explanation:</strong> {question.explanation}
                    </div>
                  </div>
                );
              })}
            </div>

            <button onClick={startQuiz} className="btn btn-primary">
              <RefreshCw size={20} />
              Take Another Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="quiz-container fade-in">
      <div className="container">
        <div className="quiz-header">
          <div className="quiz-progress">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="quiz-timer">
            <Clock size={20} />
            <span className={timeLeft < 60 ? 'time-warning' : ''}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <div className="question-card card">
          <div className="question-header">
            <h2>Analyze this email:</h2>
            <span className={`difficulty-badge badge-${currentQ.difficulty}`}>
              {currentQ.difficulty}
            </span>
          </div>

          <div className="email-preview">
            <div className="email-meta">
              <div><strong>From:</strong> {currentQ.from}</div>
              <div><strong>Subject:</strong> {currentQ.subject}</div>
            </div>
            <div className="email-content">
              {currentQ.content.split('\n').map((line, i) => (
                <p key={i}>{line || '\u00A0'}</p>
              ))}
            </div>
          </div>

          <div className="quiz-answers">
            <h3>What is your assessment?</h3>
            <div className="answer-options">
              <button
                onClick={() => handleAnswer('safe')}
                className={`answer-option ${selectedAnswer === 'safe' ? 'selected' : ''}`}
                disabled={selectedAnswer !== null}
              >
                <CheckCircle size={24} />
                <span>Safe</span>
              </button>
              <button
                onClick={() => handleAnswer('suspicious')}
                className={`answer-option ${selectedAnswer === 'suspicious' ? 'selected' : ''}`}
                disabled={selectedAnswer !== null}
              >
                <Award size={24} />
                <span>Suspicious</span>
              </button>
              <button
                onClick={() => handleAnswer('phishing')}
                className={`answer-option ${selectedAnswer === 'phishing' ? 'selected' : ''}`}
                disabled={selectedAnswer !== null}
              >
                <XCircle size={24} />
                <span>Phishing</span>
              </button>
            </div>

            {selectedAnswer && (
              <button onClick={nextQuestion} className="btn btn-primary fade-in">
                {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizMode;
