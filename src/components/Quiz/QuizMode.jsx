import React, { useState, useEffect } from 'react';
import { doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { getRandomQuestions } from '../../data/quizQuestions';
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
    // Get 10 random cybersecurity questions
    const selected = getRandomQuestions(10);
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
      
      // Calculate new score and level
      const newScore = (userData.score || 0) + (correctCount * 10);
      let newLevel = 'Beginner';
      if (newScore >= 500) newLevel = 'Master';
      else if (newScore >= 300) newLevel = 'Expert';
      else if (newScore >= 150) newLevel = 'Advanced';
      else if (newScore >= 50) newLevel = 'Intermediate';
      
      await updateDoc(userRef, {
        quizzesCompleted: increment(1),
        totalQuizScore: increment(finalScore),
        score: increment(correctCount * 10),
        level: newLevel
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
            <p>Test your cybersecurity knowledge!</p>

            <div className="quiz-info card">
              <h3>Quiz Information</h3>
              <ul>
                <li>📝 10 cybersecurity knowledge questions</li>
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
                      <strong>{question.question}</strong>
                    </div>

                    <div className="answer-details">
                      <div className="answer-row">
                        <span>Your Answer:</span>
                        <span className={userAnswer?.isCorrect ? 'correct-text' : 'incorrect-text'}>
                          {typeof userAnswer?.userAnswer === 'number' 
                            ? question.options[userAnswer.userAnswer] 
                            : 'Not answered'}
                        </span>
                      </div>
                      {!userAnswer?.isCorrect && (
                        <div className="answer-row">
                          <span>Correct Answer:</span>
                          <span className="correct-text">{question.options[question.correctAnswer]}</span>
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
            <h2>{currentQ.question}</h2>
          </div>

          <div className="quiz-answers">
            <div className="answer-options">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={`answer-option ${selectedAnswer === index ? 'selected' : ''}`}
                  disabled={selectedAnswer !== null}
                >
                  <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                  <span className="option-text">{option}</span>
                </button>
              ))}
            </div>

            {selectedAnswer !== null && (
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
