import React, { useState, useMemo } from 'react';
import {
  Shield,
  Eye,
  EyeOff,
  Lock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Hash,
  Type,
  AtSign,
} from 'lucide-react';
import { checkPasswordStrength, getPasswordTips } from '../../utils/passwordStrength';
import './PasswordChecker.css';

/* ── SVG Circular Gauge ────────────────────────────────────── */
const StrengthGauge = ({ score, maxScore, color, label }) => {
  const radius = 80;
  const stroke = 12;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / maxScore) * circumference;
  const center = 100;

  return (
    <div className="pw-gauge">
      <svg viewBox="0 0 200 200" className="pw-gauge-svg">
        <defs>
          <filter id="pw-glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={stroke}
        />
        {/* Progress circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference - progress}`}
          strokeDashoffset={circumference / 4}
          filter="url(#pw-glow)"
          style={{ transition: 'stroke-dasharray 0.6s ease, stroke 0.4s ease' }}
        />
        {/* Score */}
        <text x={center} y={center - 8} textAnchor="middle" className="pw-gauge-score">
          {score}
        </text>
        <text x={center} y={center + 14} textAnchor="middle" className="pw-gauge-max">
          / {maxScore}
        </text>
        <text
          x={center}
          y={center + 40}
          textAnchor="middle"
          className="pw-gauge-label"
          fill={color}
        >
          {label}
        </text>
      </svg>
    </div>
  );
};

/* ── Criteria Check Ring ───────────────────────────────────── */
const CriteriaRing = ({ met, icon: Icon, label }) => {
  const r = 16;
  const circ = 2 * Math.PI * r;

  return (
    <div className={`criteria-ring ${met ? 'met' : 'unmet'}`}>
      <svg viewBox="0 0 40 40" className="criteria-svg">
        <circle cx="20" cy="20" r={r} fill="none" stroke="#e5e7eb" strokeWidth="3" />
        <circle
          cx="20"
          cy="20"
          r={r}
          fill="none"
          stroke={met ? '#10b981' : '#ef4444'}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${met ? circ : 0} ${circ}`}
          strokeDashoffset={circ / 4}
          style={{ transition: 'stroke-dasharray 0.5s ease' }}
        />
      </svg>
      <div className="criteria-icon-wrap">
        <Icon size={16} />
      </div>
      <span className="criteria-label">{label}</span>
      <span className="criteria-status">{met ? '✓' : '✗'}</span>
    </div>
  );
};

/* ── Crack Time Estimator ──────────────────────────────────── */
function estimateCrackTime(password) {
  if (!password) return '—';
  const poolSize =
    (/[a-z]/.test(password) ? 26 : 0) +
    (/[A-Z]/.test(password) ? 26 : 0) +
    (/[0-9]/.test(password) ? 10 : 0) +
    (/[^A-Za-z0-9]/.test(password) ? 33 : 0);
  if (poolSize === 0) return '—';

  const guessesPerSec = 1e10; // 10 billion guesses/sec
  const combinations = Math.pow(poolSize, password.length);
  const seconds = combinations / guessesPerSec / 2; // average case

  if (seconds < 1) return 'Instantly';
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
  if (seconds < 31536000 * 1000) return `${Math.round(seconds / 31536000)} years`;
  if (seconds < 31536000 * 1e6) return `${Math.round(seconds / 31536000 / 1000)}k years`;
  if (seconds < 31536000 * 1e9) return `${Math.round(seconds / 31536000 / 1e6)}M years`;
  return 'Centuries+';
}

function getCrackTimeColor(password) {
  if (!password) return '#9ca3af';
  const poolSize =
    (/[a-z]/.test(password) ? 26 : 0) +
    (/[A-Z]/.test(password) ? 26 : 0) +
    (/[0-9]/.test(password) ? 10 : 0) +
    (/[^A-Za-z0-9]/.test(password) ? 33 : 0);
  if (poolSize === 0) return '#9ca3af';
  const seconds = Math.pow(poolSize, password.length) / 1e10 / 2;
  if (seconds < 3600) return '#ef4444';
  if (seconds < 86400 * 365) return '#f59e0b';
  return '#10b981';
}

/* ── Main Component ────────────────────────────────────────── */
const PasswordChecker = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const strength = checkPasswordStrength(password);
  const tips = getPasswordTips();

  const criteria = useMemo(
    () => [
      { met: password.length >= 8, icon: Hash, label: '8+ characters' },
      { met: password.length >= 12, icon: Hash, label: '12+ characters' },
      { met: /[a-z]/.test(password), icon: Type, label: 'Lowercase' },
      { met: /[A-Z]/.test(password), icon: Type, label: 'Uppercase' },
      { met: /[0-9]/.test(password), icon: Hash, label: 'Numbers' },
      { met: /[^A-Za-z0-9]/.test(password), icon: AtSign, label: 'Symbols' },
    ],
    [password]
  );

  const crackTime = estimateCrackTime(password);
  const crackColor = getCrackTimeColor(password);

  return (
    <div className="password-checker-container">
      <div className="container">
        {/* Header */}
        <div className="password-checker-header">
          <div className="pw-header-icon">
            <Lock size={48} />
          </div>
          <h1>Password Strength Checker</h1>
          <p>Analyze your password's strength with real-time visual feedback</p>
        </div>

        {/* Input + Results */}
        <div className="pw-main-card">
          {/* Input */}
          <div className="pw-input-section">
            <div className="password-input-wrapper">
              <Lock size={20} className="pw-field-icon" />
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
          </div>

          {/* Results — only if password entered */}
          {password && (
            <div className="pw-results fade-in">
              {/* Top row: Gauge + Criteria */}
              <div className="pw-results-top">
                {/* Gauge */}
                <div className="pw-gauge-section">
                  <StrengthGauge
                    score={strength.score}
                    maxScore={6}
                    color={strength.color}
                    label={strength.strength}
                  />
                  {/* Crack time card */}
                  <div className="crack-time-card" style={{ borderColor: crackColor }}>
                    <Clock size={20} style={{ color: crackColor }} />
                    <div>
                      <div className="crack-time-label">Estimated crack time</div>
                      <div className="crack-time-value" style={{ color: crackColor }}>
                        {crackTime}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Criteria rings */}
                <div className="pw-criteria-section">
                  <h3>Password Criteria</h3>
                  <div className="criteria-grid">
                    {criteria.map((c, i) => (
                      <CriteriaRing key={i} met={c.met} icon={c.icon} label={c.label} />
                    ))}
                  </div>

                  {/* Strength bar */}
                  <div className="pw-strength-bar-section">
                    <div className="pw-strength-bar-labels">
                      <span>Weak</span>
                      <span>Fair</span>
                      <span>Good</span>
                      <span>Strong</span>
                    </div>
                    <div className="pw-strength-bar">
                      {[1, 2, 3, 4, 5, 6].map((seg) => (
                        <div
                          key={seg}
                          className={`pw-bar-segment ${seg <= strength.score ? 'filled' : ''}`}
                          style={{
                            backgroundColor:
                              seg <= strength.score ? strength.color : '#e5e7eb',
                            transition: 'background-color 0.3s ease',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Feedback */}
              {strength.feedback.length > 0 && (
                <div className="pw-feedback">
                  <h3>
                    <AlertCircle size={18} />
                    Suggestions to Improve
                  </h3>
                  <div className="pw-feedback-list">
                    {strength.feedback.map((item, index) => (
                      <div key={index} className="pw-feedback-item">
                        <XCircle size={16} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Success */}
              {strength.score >= 5 && (
                <div className="pw-success">
                  <CheckCircle size={24} />
                  <span>Excellent! This is a strong password.</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tips + Examples side-by-side */}
        <div className="pw-bottom-grid">
          {/* Tips */}
          <div className="pw-tips-card">
            <div className="pw-tips-header">
              <Shield size={24} />
              <h2>Security Tips</h2>
            </div>
            <div className="pw-tips-list">
              {tips.map((tip, index) => (
                <div key={index} className="pw-tip-item">
                  {tip}
                </div>
              ))}
            </div>
            <div className="pw-info-box">
              <h3>💡 Did You Know?</h3>
              <p>
                A 12-character password with mixed types would take centuries to crack,
                but the same password at 8 characters could fall in hours!
              </p>
            </div>
          </div>

          {/* Examples */}
          <div className="pw-examples-card">
            <h2>Password Examples</h2>
            <div className="pw-examples-stack">
              <div className="pw-example weak">
                <div className="pw-example-header">
                  <XCircle size={18} />
                  <span>Weak</span>
                </div>
                <div className="pw-example-passwords">
                  <code>password123</code>
                  <code>qwerty</code>
                  <code>12345678</code>
                </div>
                <p>❌ Easy to guess</p>
              </div>

              <div className="pw-example fair">
                <div className="pw-example-header">
                  <AlertCircle size={18} />
                  <span>Fair</span>
                </div>
                <div className="pw-example-passwords">
                  <code>MyPassword2024</code>
                  <code>JohnDoe$123</code>
                  <code>Welcome@Home</code>
                </div>
                <p>⚠️ Better but improvable</p>
              </div>

              <div className="pw-example strong">
                <div className="pw-example-header">
                  <CheckCircle size={18} />
                  <span>Strong</span>
                </div>
                <div className="pw-example-passwords">
                  <code>p7K$mQ9#vL2@xN4!</code>
                  <code>Blue$Sky7!Mountain</code>
                  <code>T3ch@2024#Secure!</code>
                </div>
                <p>✅ Long, complex, unique</p>
              </div>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="pw-warning-card">
          <h3>⚠️ Never:</h3>
          <div className="pw-warning-grid">
            <span>Share passwords with anyone</span>
            <span>Reuse passwords across sites</span>
            <span>Store passwords in plain text</span>
            <span>Include personal info</span>
            <span>Send passwords via email</span>
            <span>Use dictionary words alone</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordChecker;
