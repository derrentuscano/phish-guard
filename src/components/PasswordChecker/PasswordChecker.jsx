import React, { useState, useMemo } from 'react';
import {
  Shield, Eye, EyeOff, Lock, CheckCircle, XCircle, AlertCircle, Clock, Hash, Type, AtSign, Terminal
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

  // Remap standard green/red to neon theme if needed, but we'll trust the color prop
  const themeColor = color === '#10b981' ? '#00ff41' : color === '#ef4444' ? '#ff7351' : color;

  return (
    <div className="pw-gauge">
      <svg viewBox="0 0 200 200" className="pw-gauge-svg">
        <defs>
          <filter id="pw-glow">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx={center} cy={center} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} />
        <circle
          cx={center} cy={center} r={radius} fill="none"
          stroke={themeColor} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference - progress}`}
          strokeDashoffset={circumference / 4}
          filter="url(#pw-glow)"
          style={{ transition: 'stroke-dasharray 0.6s ease, stroke 0.4s ease' }}
        />
        <text x={center} y={center - 8} textAnchor="middle" className="pw-gauge-score">{score}</text>
        <text x={center} y={center + 14} textAnchor="middle" className="pw-gauge-max">/ {maxScore}</text>
        <text x={center} y={center + 40} textAnchor="middle" className="pw-gauge-label" fill={themeColor}>
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
  const themeColor = met ? '#00ff41' : '#ff7351';

  return (
    <div className={`criteria-ring ${met ? 'met' : 'unmet'}`}>
      <svg viewBox="0 0 40 40" className="criteria-svg">
        <circle cx="20" cy="20" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
        <circle
          cx="20" cy="20" r={r} fill="none"
          stroke={themeColor} strokeWidth="3" strokeLinecap="square"
          strokeDasharray={`${met ? circ : 0} ${circ}`}
          strokeDashoffset={circ / 4}
          style={{ transition: 'stroke-dasharray 0.5s ease' }}
        />
      </svg>
      <div className="criteria-icon-wrap" style={{ color: themeColor, background: `${themeColor}15` }}>
        <Icon size={16} />
      </div>
      <span className="criteria-label">{label}</span>
      <span className="criteria-status" style={{ color: themeColor }}>{met ? 'OK' : 'FAIL'}</span>
    </div>
  );
};

/* ── Crack Time Estimator ──────────────────────────────────── */
function estimateCrackTime(password) {
  if (!password) return '—';
  const poolSize = (/[a-z]/.test(password) ? 26 : 0) + (/[A-Z]/.test(password) ? 26 : 0) + (/[0-9]/.test(password) ? 10 : 0) + (/[^A-Za-z0-9]/.test(password) ? 33 : 0);
  if (poolSize === 0) return '—';
  const seconds = Math.pow(poolSize, password.length) / 1e10 / 2;
  if (seconds < 1) return 'Instantly';
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} mins`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
  if (seconds < 31536000 * 1000) return `${Math.round(seconds / 31536000)} yrs`;
  return 'Centuries+';
}

function getCrackTimeColor(password) {
  if (!password) return '#6b7280';
  const poolSize = (/[a-z]/.test(password) ? 26 : 0) + (/[A-Z]/.test(password) ? 26 : 0) + (/[0-9]/.test(password) ? 10 : 0) + (/[^A-Za-z0-9]/.test(password) ? 33 : 0);
  if (poolSize === 0) return '#6b7280';
  const seconds = Math.pow(poolSize, password.length) / 1e10 / 2;
  if (seconds < 3600) return '#ff7351';
  if (seconds < 86400 * 365) return '#f59e0b';
  return '#00ff41';
}

/* ── Main Component ────────────────────────────────────────── */
const PasswordChecker = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const strength = checkPasswordStrength(password);
  const tips = getPasswordTips();

  const criteria = useMemo(() => [
    { met: password.length >= 8, icon: Hash, label: '8+ CHARS' },
    { met: password.length >= 12, icon: Hash, label: '12+ CHARS' },
    { met: /[a-z]/.test(password), icon: Type, label: 'LOWERCASE' },
    { met: /[A-Z]/.test(password), icon: Type, label: 'UPPERCASE' },
    { met: /[0-9]/.test(password), icon: Hash, label: 'NUMBERS' },
    { met: /[^A-Za-z0-9]/.test(password), icon: AtSign, label: 'SYMBOLS' },
  ], [password]);

  const crackTime = estimateCrackTime(password);
  const crackColor = getCrackTimeColor(password);
  const themeColor = strength.color === '#10b981' ? '#00ff41' : strength.color === '#ef4444' ? '#ff7351' : strength.color;

  return (
    <div className="password-checker-container">
      <div className="scan-line-overlay" />
      <div className="container hud-layout">
        <div className="password-checker-header fade-in">
          <div className="pw-header-icon">
            <Lock size={36} />
          </div>
          <h1>PASSWORD_ANALYST_HUD</h1>
          <p>Real-time heuristic evaluation of cryptographic key complexity</p>
        </div>

        <div className="pw-main-card fade-in" style={{animationDelay: '0.1s'}}>
          <div className="pw-input-section">
            <div className="password-input-wrapper">
              <Terminal size={18} className="pw-field-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="password-input"
                placeholder="INPUT_KEY_FOR_ANALYSIS..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="toggle-visibility" onClick={() => setShowPassword(!showPassword)} type="button">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {password && (
            <div className="pw-results hud-fade-in">
              <div className="pw-results-top">
                <div className="pw-gauge-section">
                  <StrengthGauge score={strength.score} maxScore={6} color={themeColor} label={strength.strength} />
                  <div className="crack-time-card" style={{ borderColor: crackColor, background: `${crackColor}08` }}>
                    <Clock size={16} style={{ color: crackColor }} />
                    <div>
                      <div className="crack-time-label">BRUTE_FORCE_ESTIMATE</div>
                      <div className="crack-time-value" style={{ color: crackColor }}>{crackTime}</div>
                    </div>
                  </div>
                </div>

                <div className="pw-criteria-section">
                  <h3>COMPLEXITY_CRITERIA</h3>
                  <div className="criteria-grid">
                    {criteria.map((c, i) => <CriteriaRing key={i} met={c.met} icon={c.icon} label={c.label} />)}
                  </div>

                  <div className="pw-strength-bar-section">
                    <div className="pw-strength-bar-labels">
                      <span>CRIT</span><span>LOW</span><span>MED</span><span>HIGH</span>
                    </div>
                    <div className="pw-strength-bar">
                      {[1, 2, 3, 4, 5, 6].map((seg) => (
                        <div
                          key={seg}
                          className={`pw-bar-segment ${seg <= strength.score ? 'filled' : ''}`}
                          style={{
                             backgroundColor: seg <= strength.score ? themeColor : 'rgba(255,255,255,0.05)',
                             boxShadow: seg <= strength.score ? `0 0 10px ${themeColor}80` : 'none'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {strength.feedback.length > 0 && (
                <div className="pw-feedback">
                  <h3><AlertCircle size={14} /> VULNERABILITY_WARNINGS</h3>
                  <div className="pw-feedback-list">
                    {strength.feedback.map((item, index) => (
                      <div key={index} className="pw-feedback-item">
                        <XCircle size={14} /> <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {strength.score >= 5 && (
                <div className="pw-success">
                  <CheckCircle size={18} /> <span>OPTIMAL COMPLEXITY ACHIEVED. KEY APPROVED.</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="pw-bottom-grid fade-in" style={{animationDelay: '0.2s'}}>
          <div className="pw-tips-card hud-panel">
            <div className="pw-tips-header">
              <Shield size={20} /><h2>SEC_PROTOCOLS</h2>
            </div>
            <div className="pw-tips-list">
              {tips.map((tip, index) => <div key={index} className="pw-tip-item">{tip}</div>)}
            </div>
            <div className="pw-info-box">
              <h3>SYSTEM.LOG: Entropy Info</h3>
              <p>A 12-char mixed key resists brute force for centuries. The same key at 8 chars fails in hours.</p>
            </div>
          </div>

          <div className="pw-examples-card hud-panel">
            <h2>SIGNATURE_EXAMPLES</h2>
            <div className="pw-examples-stack">
              <div className="pw-example weak">
                <div className="pw-example-header"><XCircle size={14} /><span>CRITICAL VULN</span></div>
                <div className="pw-example-passwords"><code>password123</code><code>qwerty</code></div>
                <p>High dictionary match probability</p>
              </div>
              <div className="pw-example fair">
                <div className="pw-example-header"><AlertCircle size={14} /><span>MODERATE RISK</span></div>
                <div className="pw-example-passwords"><code>MyPassword2024</code><code>Welcome@1</code></div>
                <p>Predictable substitution patterns</p>
              </div>
              <div className="pw-example strong">
                <div className="pw-example-header"><CheckCircle size={14} /><span>SECURE</span></div>
                <div className="pw-example-passwords"><code>p7K$mQ9#vL2@xN4!</code><code>Blue$Sky7!Mnt</code></div>
                <p>High entropy characteristics</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordChecker;
