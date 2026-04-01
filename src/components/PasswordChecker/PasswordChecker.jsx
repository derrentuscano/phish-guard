import React, { useState, useMemo, useCallback } from 'react';
import {
  Shield, Eye, EyeOff, Lock, CheckCircle, XCircle, AlertCircle,
  Clock, Hash, Type, AtSign, Terminal, RefreshCw, Copy, Check,
  Sliders, Zap
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
  const themeColor = met ? '#00ff41' : '#ff7351';
  return (
    <div className={`criteria-ring ${met ? 'met' : 'unmet'}`}>
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
  // Expand pool if Devanagari chars present (Unicode range 0900–097F = 128 chars)
  const hasDevanagari = /[\u0900-\u097F]/.test(password);
  const poolSize =
    (/[a-z]/.test(password) ? 26 : 0) +
    (/[A-Z]/.test(password) ? 26 : 0) +
    (/[0-9]/.test(password) ? 10 : 0) +
    (/[^A-Za-z0-9\u0900-\u097F]/.test(password) ? 33 : 0) +
    (hasDevanagari ? 128 : 0);
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
  const hasDevanagari = /[\u0900-\u097F]/.test(password);
  const poolSize =
    (/[a-z]/.test(password) ? 26 : 0) +
    (/[A-Z]/.test(password) ? 26 : 0) +
    (/[0-9]/.test(password) ? 10 : 0) +
    (/[^A-Za-z0-9\u0900-\u097F]/.test(password) ? 33 : 0) +
    (hasDevanagari ? 128 : 0);
  if (poolSize === 0) return '#6b7280';
  const seconds = Math.pow(poolSize, password.length) / 1e10 / 2;
  if (seconds < 3600) return '#ff7351';
  if (seconds < 86400 * 365) return '#f59e0b';
  return '#00ff41';
}

/* ── Devanagari Character Sets ─────────────────────────────── */
const DEVANAGARI_VOWELS   = ['अ','इ','उ','ए','ओ','आ','ई','ऊ','ऐ','औ'];
const DEVANAGARI_CONSONANTS = ['क','ख','ग','घ','च','ज','ट','ड','त','द','न','प','ब','म','य','र','ल','व','स','ह','श','ष','भ','ध','थ','फ','श'];
const DEVANAGARI_ALL = [...DEVANAGARI_VOWELS, ...DEVANAGARI_CONSONANTS];

/* ── Password Generator Logic ──────────────────────────────── */
function generatePassword(opts) {
  const { length, useUpper, useLower, useNumbers, useSymbols, useDevanagari, devanagariCount } = opts;
  const symbols = '!@#$%^&*()-_=+[]{}|;:,.<>?';
  const numbers = '0123456789';
  const lower   = 'abcdefghijklmnopqrstuvwxyz';
  const upper   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  let charPool = [];
  if (useLower)   charPool = [...charPool, ...lower.split('')];
  if (useUpper)   charPool = [...charPool, ...upper.split('')];
  if (useNumbers) charPool = [...charPool, ...numbers.split('')];
  if (useSymbols) charPool = [...charPool, ...symbols.split('')];
  if (charPool.length === 0) charPool = [...lower.split('')];

  const devCount = useDevanagari ? Math.min(devanagariCount, length - 1) : 0;
  const latinLength = length - devCount;

  // Generate latin portion
  let latin = [];
  // Guarantee at least one of each required type
  if (useLower)   latin.push(lower[Math.floor(Math.random() * lower.length)]);
  if (useUpper)   latin.push(upper[Math.floor(Math.random() * upper.length)]);
  if (useNumbers) latin.push(numbers[Math.floor(Math.random() * numbers.length)]);
  if (useSymbols) latin.push(symbols[Math.floor(Math.random() * symbols.length)]);

  while (latin.length < latinLength) {
    latin.push(charPool[Math.floor(Math.random() * charPool.length)]);
  }
  latin = latin.slice(0, latinLength);

  // Generate Devanagari portion
  let deva = [];
  for (let i = 0; i < devCount; i++) {
    deva.push(DEVANAGARI_ALL[Math.floor(Math.random() * DEVANAGARI_ALL.length)]);
  }

  // Shuffle & interleave
  const combined = [...latin, ...deva];
  for (let i = combined.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }

  return combined.join('');
}

/* ── Toggle Switch ─────────────────────────────────────────── */
const HudToggle = ({ id, checked, onChange, label, accent }) => (
  <label className="hud-toggle-row" htmlFor={id}>
    <span className="hud-toggle-label">{label}</span>
    <div
      className={`hud-toggle ${checked ? 'on' : 'off'}`}
      style={checked ? { '--toggle-color': accent || 'var(--primary-color)' } : {}}
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
      id={id}
    >
      <div className="hud-toggle-knob" />
    </div>
  </label>
);

/* ── Main Component ────────────────────────────────────────── */
const PasswordChecker = () => {
  const [activeTab, setActiveTab] = useState('checker'); // 'checker' | 'generator'

  /* Checker state */
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  /* Generator state */
  const [genOptions, setGenOptions] = useState({
    length: 16,
    useUpper: true,
    useLower: true,
    useNumbers: true,
    useSymbols: true,
    useDevanagari: true,
    devanagariCount: 3,
  });
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [showGenPassword, setShowGenPassword] = useState(true);

  /* Checker derived data */
  const strength = checkPasswordStrength(password);
  const tips = getPasswordTips();

  const criteria = useMemo(() => [
    { met: password.length >= 8,          icon: Hash,   label: '8+ CHARS'   },
    { met: password.length >= 12,         icon: Hash,   label: '12+ CHARS'  },
    { met: /[a-z]/.test(password),        icon: Type,   label: 'LOWERCASE'  },
    { met: /[A-Z]/.test(password),        icon: Type,   label: 'UPPERCASE'  },
    { met: /[0-9]/.test(password),        icon: Hash,   label: 'NUMBERS'    },
    { met: /[^A-Za-z0-9]/.test(password), icon: AtSign, label: 'SYMBOLS'    },
  ], [password]);

  const crackTime  = estimateCrackTime(password);
  const crackColor = getCrackTimeColor(password);
  const themeColor = strength.color === '#10b981' ? '#00ff41' : strength.color === '#ef4444' ? '#ff7351' : strength.color;

  /* Generator handlers */
  const handleGenerate = useCallback(() => {
    const pwd = generatePassword(genOptions);
    setGeneratedPassword(pwd);
    setCopied(false);
  }, [genOptions]);

  const handleCopy = useCallback(() => {
    if (!generatedPassword) return;
    navigator.clipboard.writeText(generatedPassword).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [generatedPassword]);

  const updateOpt = (key, val) => setGenOptions(prev => ({ ...prev, [key]: val }));

  /* Derived generator analysis */
  const genStrength = checkPasswordStrength(generatedPassword);
  const genThemeColor = genStrength.color === '#10b981' ? '#00ff41' : genStrength.color === '#ef4444' ? '#ff7351' : genStrength.color;
  const genCrackTime  = estimateCrackTime(generatedPassword);
  const genCrackColor = getCrackTimeColor(generatedPassword);

  return (
    <div className="password-checker-container">
      <div className="scan-line-overlay" />
      <div className="container hud-layout">

        {/* Header */}
        <div className="password-checker-header fade-in">
          <div className="pw-header-icon">
            <Lock size={36} />
          </div>
          <h1>PASSWORD_ANALYST_HUD</h1>
          <p>Real-time heuristic evaluation &amp; cryptographic key generation</p>
        </div>

        {/* Tab Switcher */}
        <div className="pw-tab-bar fade-in" style={{ animationDelay: '0.05s' }}>
          <button
            className={`pw-tab-btn ${activeTab === 'checker' ? 'active' : ''}`}
            onClick={() => setActiveTab('checker')}
          >
            <Shield size={14} /> ANALYZER
          </button>
          <button
            className={`pw-tab-btn ${activeTab === 'generator' ? 'active' : ''}`}
            onClick={() => setActiveTab('generator')}
          >
            <Zap size={14} /> GENERATOR
          </button>
        </div>

        {/* ════ CHECKER TAB ════ */}
        {activeTab === 'checker' && (
          <>
            <div className="pw-main-card fade-in" style={{ animationDelay: '0.1s' }}>
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

            <div className="pw-bottom-grid fade-in" style={{ animationDelay: '0.2s' }}>
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
          </>
        )}

        {/* ════ GENERATOR TAB ════ */}
        {activeTab === 'generator' && (
          <div className="fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="pw-main-card gen-layout">

              {/* Left: Controls */}
              <div className="gen-controls">
                <div className="gen-controls-header">
                  <Sliders size={16} /><span>CONFIG_PARAMETERS</span>
                </div>

                {/* Length Slider */}
                <div className="gen-slider-group">
                  <div className="gen-slider-row">
                    <span className="gen-slider-label">KEY_LENGTH</span>
                    <span className="gen-slider-value">{genOptions.length}</span>
                  </div>
                  <input
                    type="range" min={8} max={32} value={genOptions.length}
                    className="gen-slider"
                    onChange={e => updateOpt('length', parseInt(e.target.value))}
                  />
                  <div className="gen-slider-bounds"><span>8</span><span>32</span></div>
                </div>

                {/* Character type toggles */}
                <div className="gen-toggles">
                  <HudToggle id="tog-upper"   checked={genOptions.useUpper}   onChange={v => updateOpt('useUpper', v)}   label="UPPERCASE  [A–Z]" />
                  <HudToggle id="tog-lower"   checked={genOptions.useLower}   onChange={v => updateOpt('useLower', v)}   label="LOWERCASE  [a–z]" />
                  <HudToggle id="tog-numbers" checked={genOptions.useNumbers} onChange={v => updateOpt('useNumbers', v)} label="NUMERALS   [0–9]" />
                  <HudToggle id="tog-symbols" checked={genOptions.useSymbols} onChange={v => updateOpt('useSymbols', v)} label="SYMBOLS    [!@#…]" />
                </div>

                {/* Devanagari Section */}
                <div className="gen-deva-section">
                  <div className="gen-deva-header">
                    <HudToggle
                      id="tog-deva"
                      checked={genOptions.useDevanagari}
                      onChange={v => updateOpt('useDevanagari', v)}
                      label="DEVANAGARI  [देवनागरी]"
                      accent="#a78bfa"
                    />
                  </div>
                  {genOptions.useDevanagari && (
                    <div className="gen-deva-sub hud-fade-in">
                      <div className="gen-slider-row">
                        <span className="gen-slider-label" style={{ color: '#a78bfa' }}>DEVA_COUNT</span>
                        <span className="gen-slider-value" style={{ color: '#a78bfa' }}>{genOptions.devanagariCount}</span>
                      </div>
                      <input
                        type="range" min={1} max={Math.max(1, genOptions.length - 4)}
                        value={genOptions.devanagariCount}
                        className="gen-slider gen-slider-deva"
                        onChange={e => updateOpt('devanagariCount', parseInt(e.target.value))}
                      />
                      <div className="gen-deva-preview">
                        {DEVANAGARI_ALL.slice(0, 14).map((ch, i) => (
                          <span key={i} className="gen-deva-char">{ch}</span>
                        ))}
                        <span className="gen-deva-more">+{DEVANAGARI_ALL.length - 14} more</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Generate Button */}
                <button className="gen-btn" onClick={handleGenerate}>
                  <RefreshCw size={16} />
                  GENERATE_KEY
                </button>
              </div>

              {/* Right: Output */}
              <div className="gen-output">
                <div className="gen-output-header">
                  <span>GENERATED_KEY_OUTPUT</span>
                </div>

                {generatedPassword ? (
                  <>
                    <div className="gen-password-display">
                      <div className="gen-password-text" style={{ filter: showGenPassword ? 'none' : 'blur(6px)' }}>
                        {generatedPassword}
                      </div>
                      <div className="gen-password-actions">
                        <button className="gen-icon-btn" onClick={() => setShowGenPassword(p => !p)} title="Toggle visibility">
                          {showGenPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button
                          className={`gen-icon-btn ${copied ? 'copied' : ''}`}
                          onClick={handleCopy}
                          title="Copy to clipboard"
                        >
                          {copied ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                        <button className="gen-icon-btn" onClick={handleGenerate} title="Regenerate">
                          <RefreshCw size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Strength mini-analysis */}
                    <div className="gen-analysis hud-fade-in">
                      <div className="gen-analysis-row">
                        <span className="gen-analysis-label">STRENGTH</span>
                        <span className="gen-analysis-value" style={{ color: genThemeColor }}>{genStrength.strength.toUpperCase()}</span>
                      </div>
                      <div className="gen-analysis-row">
                        <span className="gen-analysis-label">SCORE</span>
                        <div className="gen-mini-bar">
                          {[1,2,3,4,5,6].map(s => (
                            <div key={s} className="gen-mini-seg"
                              style={{
                                background: s <= genStrength.score ? genThemeColor : 'rgba(255,255,255,0.06)',
                                boxShadow: s <= genStrength.score ? `0 0 8px ${genThemeColor}80` : 'none'
                              }}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="gen-analysis-row">
                        <span className="gen-analysis-label">BRUTE_FORCE_ETA</span>
                        <span className="gen-analysis-value" style={{ color: genCrackColor }}>{genCrackTime}</span>
                      </div>
                      <div className="gen-analysis-row">
                        <span className="gen-analysis-label">LENGTH</span>
                        <span className="gen-analysis-value" style={{ color: '#00ff41' }}>{generatedPassword.length} chars</span>
                      </div>
                      {genOptions.useDevanagari && (
                        <div className="gen-analysis-row">
                          <span className="gen-analysis-label">DEVANAGARI_CHARS</span>
                          <span className="gen-analysis-value" style={{ color: '#a78bfa' }}>
                            {[...generatedPassword].filter(c => /[\u0900-\u097F]/.test(c)).join(' ')}
                          </span>
                        </div>
                      )}
                      {genStrength.score >= 5 && (
                        <div className="pw-success" style={{ marginTop: '12px' }}>
                          <CheckCircle size={16} /> <span>KEY APPROVED — OPTIMAL COMPLEXITY</span>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="gen-empty-state">
                    <Zap size={32} style={{ color: 'rgba(0,255,65,0.2)' }} />
                    <p>Configure parameters and press</p>
                    <code>GENERATE_KEY</code>
                    <p style={{ fontSize: '11px', marginTop: '8px', color: 'rgba(255,255,255,0.3)' }}>
                      Devanagari characters (देवनागरी) expand<br />the entropy space by 128+ codepoints
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Info panel at bottom */}
            <div className="gen-info-grid fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="hud-panel gen-info-card">
                <h2><Shield size={14} /> WHY_DEVANAGARI?</h2>
                <p>Adding Devanagari script characters (अ, क, म, स…) expands the character pool by 128+ Unicode codepoints, making dictionary attacks virtually impossible. A brute-force attacker must now iterate over a vastly larger search space.</p>
              </div>
              <div className="hud-panel gen-info-card">
                <h2><Zap size={14} /> ENTROPY_BOOST</h2>
                <p>Each Devanagari character contributes ~7 bits of additional entropy (log₂128). A 16-char password with 3 Devanagari chars provides entropy equivalent to a 22+ character Latin-only password.</p>
              </div>
              <div className="hud-panel gen-info-card">
                <h2><Lock size={14} /> COMPATIBILITY</h2>
                <p>Devanagari passwords work on all UTF-8 compatible systems. Most modern password managers, websites, and apps fully support Unicode input. Always verify your target system accepts Unicode before use.</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PasswordChecker;
