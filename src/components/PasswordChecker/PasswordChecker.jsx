import React, { useState } from 'react';
import { Shield, Eye, EyeOff, Lock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { checkPasswordStrength, getPasswordTips } from '../../utils/passwordStrength';
import './PasswordChecker.css';

const PasswordChecker = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const strength = checkPasswordStrength(password);
  const tips = getPasswordTips();

  return (
    <div className="password-checker-container">
      <div className="container">
        <div className="password-checker-header">
          <div className="header-icon">
            <Lock size={48} />
          </div>
          <h1>Password Strength Checker</h1>
          <p>Learn to create strong, secure passwords that protect your accounts</p>
        </div>

        <div className="checker-main">
          <div className="password-input-section">
            <h2>Test Your Password</h2>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                className="password-input"
                placeholder="Enter a password to test..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                className="toggle-visibility"
                onClick={() => setShowPassword(!showPassword)}
                type="button"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {password && (
              <div className="strength-indicator">
                <div className="strength-header">
                  <span className="strength-label">Strength:</span>
                  <span 
                    className="strength-value" 
                    style={{ color: strength.color }}
                  >
                    {strength.strength}
                  </span>
                </div>
                <div className="strength-bar">
                  <div 
                    className="strength-fill"
                    style={{ 
                      width: `${(strength.score / 6) * 100}%`,
                      backgroundColor: strength.color
                    }}
                  />
                </div>
                <div className="strength-score">
                  {strength.score} / 6 points
                </div>
              </div>
            )}

            {password && strength.feedback.length > 0 && (
              <div className="feedback-section">
                <h3>
                  <AlertCircle size={18} />
                  Suggestions to Improve:
                </h3>
                <ul className="feedback-list">
                  {strength.feedback.map((item, index) => (
                    <li key={index}>
                      <XCircle size={16} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {password && strength.score >= 5 && (
              <div className="success-message">
                <CheckCircle size={20} />
                <span>Excellent! This is a strong password.</span>
              </div>
            )}
          </div>

          <div className="tips-section">
            <div className="tips-header">
              <Shield size={24} />
              <h2>Password Security Tips</h2>
            </div>
            <div className="tips-list">
              {tips.map((tip, index) => (
                <div key={index} className="tip-item">
                  {tip}
                </div>
              ))}
            </div>

            <div className="info-box">
              <h3>💡 Did You Know?</h3>
              <p>
                A password with 12 characters including uppercase, lowercase, 
                numbers, and symbols would take centuries to crack using modern 
                technology. But the same password with only 8 characters could 
                be cracked in hours!
              </p>
            </div>

            <div className="warning-box">
              <h3>⚠️ Never:</h3>
              <ul>
                <li>Share your passwords with anyone</li>
                <li>Use the same password across multiple sites</li>
                <li>Write passwords on paper or in plain text files</li>
                <li>Include personal information in passwords</li>
                <li>Send passwords via email or text message</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="examples-section">
          <h2>Password Examples</h2>
          <div className="examples-grid">
            <div className="example-card weak">
              <div className="example-header">
                <XCircle size={20} />
                <span>Weak Passwords</span>
              </div>
              <ul>
                <li>password123</li>
                <li>qwerty</li>
                <li>12345678</li>
                <li>abc123</li>
              </ul>
              <p className="example-note">❌ Easy to guess, common patterns</p>
            </div>

            <div className="example-card fair">
              <div className="example-header">
                <AlertCircle size={20} />
                <span>Fair Passwords</span>
              </div>
              <ul>
                <li>MyPassword2024</li>
                <li>JohnDoe$123</li>
                <li>Welcome@Home</li>
                <li>Computer#99</li>
              </ul>
              <p className="example-note">⚠️ Better but still improvable</p>
            </div>

            <div className="example-card strong">
              <div className="example-header">
                <CheckCircle size={20} />
                <span>Strong Passwords</span>
              </div>
              <ul>
                <li>p7K$mQ9#vL2@xN4!</li>
                <li>Blue$Sky7!Mountain</li>
                <li>T3ch@2024#Secure!</li>
                <li>Zy9$Qw!3Mx#Pr7@</li>
              </ul>
              <p className="example-note">✅ Long, complex, unpredictable</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordChecker;
