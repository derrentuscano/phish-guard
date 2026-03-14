import React, { useState } from 'react';
import {
  Link as LinkIcon,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Shield,
  Search,
  Loader,
  Globe,
  Activity,
  ExternalLink,
} from 'lucide-react';
import { scanURL } from '../../utils/urlScanner';
import './LinkAnalyzer.css';

/* ── SVG Speedometer Gauge ─────────────────────────────────── */
const SpeedometerGauge = ({ score }) => {
  const radius = 90;
  const stroke = 14;
  const center = 110;
  // Arc spans 240° (from 150° to 390°)
  const startAngle = 150;
  const endAngle = 390;
  const totalArc = endAngle - startAngle; // 240°

  const circumference = 2 * Math.PI * radius;
  const arcLength = (totalArc / 360) * circumference;
  const filledLength = (score / 100) * arcLength;

  const toRad = (deg) => (deg * Math.PI) / 180;

  const arcPath = (r) => {
    const x1 = center + r * Math.cos(toRad(startAngle));
    const y1 = center + r * Math.sin(toRad(startAngle));
    const x2 = center + r * Math.cos(toRad(endAngle));
    const y2 = center + r * Math.sin(toRad(endAngle));
    return `M ${x1} ${y1} A ${r} ${r} 0 1 1 ${x2} ${y2}`;
  };

  const getColor = (s) => {
    if (s >= 80) return '#10b981';
    if (s >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const getLabel = (s) => {
    if (s >= 80) return 'Safe';
    if (s >= 40) return 'Suspicious';
    return 'Malicious';
  };

  const color = getColor(score);

  return (
    <div className="speedometer">
      <svg viewBox="0 0 220 180" className="speedometer-svg">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background arc */}
        <path
          d={arcPath(radius)}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={stroke}
          strokeLinecap="round"
        />

        {/* Filled arc */}
        <path
          d={arcPath(radius)}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${filledLength} ${arcLength}`}
          filter="url(#glow)"
          style={{ transition: 'stroke-dasharray 1.2s ease' }}
        />

        {/* Score text */}
        <text x={center} y={center - 10} textAnchor="middle" className="gauge-score">
          {score}
        </text>
        <text x={center} y={center + 14} textAnchor="middle" className="gauge-max">
          / 100
        </text>
        <text x={center} y={center + 40} textAnchor="middle" className="gauge-label" fill={color}>
          {getLabel(score)}
        </text>

        {/* Scale labels */}
        <text x="18" y="170" className="gauge-tick">0</text>
        <text x="100" y="12" className="gauge-tick">50</text>
        <text x="193" y="170" className="gauge-tick">100</text>
      </svg>
    </div>
  );
};

/* ── SVG Donut Chart ───────────────────────────────────────── */
const DonutChart = ({ malicious, suspicious, harmless, undetected }) => {
  const total = malicious + suspicious + harmless + undetected || 1;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;

  const segments = [
    { value: malicious, color: '#ef4444', label: 'Malicious' },
    { value: suspicious, color: '#f59e0b', label: 'Suspicious' },
    { value: harmless, color: '#10b981', label: 'Harmless' },
    { value: undetected, color: '#94a3b8', label: 'Undetected' },
  ];

  let offset = 0;

  return (
    <div className="donut-chart-wrapper">
      <svg viewBox="0 0 160 160" className="donut-svg">
        {segments.map((seg, i) => {
          const dashLength = (seg.value / total) * circumference;
          const dashOffset = -offset;
          offset += dashLength;
          if (seg.value === 0) return null;
          return (
            <circle
              key={i}
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth="16"
              strokeDasharray={`${dashLength} ${circumference - dashLength}`}
              strokeDashoffset={dashOffset}
              style={{ transition: 'stroke-dasharray 0.8s ease' }}
            />
          );
        })}
        <text x="80" y="76" textAnchor="middle" className="donut-center-number">
          {total}
        </text>
        <text x="80" y="94" textAnchor="middle" className="donut-center-label">
          Engines
        </text>
      </svg>
      <div className="donut-legend">
        {segments.map((seg, i) => (
          <div key={i} className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: seg.color }}></span>
            <span className="legend-label">{seg.label}</span>
            <span className="legend-value">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Main Component ────────────────────────────────────────── */
const LinkAnalyzer = () => {
  const [url, setUrl] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');

  const handleScan = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    let targetUrl = url.trim();
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = 'https://' + targetUrl;
      setUrl(targetUrl);
    }

    setScanning(true);
    setAnalysis(null);
    setError('');

    try {
      const result = await scanURL(targetUrl);
      setAnalysis(result);
    } catch (err) {
      console.error('Scan error:', err);
      setError('An error occurred while scanning. Please try again.');
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="link-analyzer-container fade-in">
      <div className="container">
        {/* Header */}
        <div className="analyzer-header">
          <div className="header-icon-wrapper">
            <Shield size={48} className="header-icon" />
          </div>
          <h1>Phishing URL Scanner</h1>
          <p>
            Scan any URL against <strong>VirusTotal</strong>,{' '}
            <strong>Google Safe Browsing</strong>, and local heuristics
          </p>
        </div>

        {/* Scanner Input */}
        <div className="analyzer-card card">
          <form onSubmit={handleScan}>
            <div className="input-group">
              <label htmlFor="url-input">Enter a URL to scan:</label>
              <div className="url-input-wrapper">
                <div className="url-input-icon">
                  <Globe size={20} />
                </div>
                <input
                  type="text"
                  id="url-input"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="url-input"
                  disabled={scanning}
                />
                <button
                  type="submit"
                  className="btn btn-primary scan-btn"
                  disabled={scanning || !url.trim()}
                >
                  {scanning ? (
                    <>
                      <Loader size={20} className="spin" />
                      Scanning…
                    </>
                  ) : (
                    <>
                      <Search size={20} />
                      Scan URL
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Scanning Animation */}
          {scanning && (
            <div className="scanning-overlay">
              <div className="scanning-animation">
                <div className="pulse-ring"></div>
                <div className="pulse-ring delay-1"></div>
                <div className="pulse-ring delay-2"></div>
                <Shield size={40} className="scanning-icon" />
              </div>
              <div className="scanning-text">
                <h3>Scanning URL…</h3>
                <p>Checking against VirusTotal & Google Safe Browsing databases</p>
              </div>
              <div className="scanning-steps">
                <div className="scan-step active">
                  <Loader size={16} className="spin" />
                  <span>VirusTotal — Querying 70+ antivirus engines</span>
                </div>
                <div className="scan-step active">
                  <Loader size={16} className="spin" />
                  <span>Google Safe Browsing — Checking threat lists</span>
                </div>
                <div className="scan-step active">
                  <Loader size={16} className="spin" />
                  <span>Local heuristics — Pattern analysis</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="error-banner">
            <XCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* ── Results ────────────────────────────────────────── */}
        {analysis && (
          <div className="analysis-results fade-in">

            {/* Speedometer + Verdict */}
            <div className="scorecard">
              <div className="scorecard-gauge">
                <SpeedometerGauge score={analysis.score} />
              </div>
              <div className="scorecard-details">
                <div className={`verdict-badge ${analysis.verdict}`}>
                  {analysis.verdict === 'safe' && <CheckCircle size={28} />}
                  {analysis.verdict === 'suspicious' && <AlertTriangle size={28} />}
                  {analysis.verdict === 'malicious' && <XCircle size={28} />}
                  <span>{analysis.verdict.charAt(0).toUpperCase() + analysis.verdict.slice(1)}</span>
                </div>
                <div className="scorecard-meta">
                  <p className="scorecard-url" title={analysis.url}>
                    <ExternalLink size={14} />
                    {analysis.url.length > 60 ? analysis.url.slice(0, 60) + '…' : analysis.url}
                  </p>
                  <p className="scorecard-time">
                    Scanned at {new Date(analysis.scannedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* VirusTotal Detailed Section */}
            <div className="vt-detail-section">
              <div className="section-title">
                <Activity size={24} />
                <h2>VirusTotal Analysis</h2>
                {!analysis.virustotal.error && (
                  <span
                    className={`api-badge ${
                      analysis.virustotal.malicious > 0 ? 'threat' : 'clear'
                    }`}
                  >
                    {analysis.virustotal.malicious > 0
                      ? `${analysis.virustotal.malicious} Detection${analysis.virustotal.malicious > 1 ? 's' : ''}`
                      : '✓ Clean'}
                  </span>
                )}
              </div>

              {analysis.virustotal.error ? (
                <div className="api-error">
                  <AlertTriangle size={16} />
                  <span>{analysis.virustotal.error}</span>
                </div>
              ) : (
                <div className="vt-detail-grid">
                  {/* Donut Chart */}
                  <div className="vt-chart-card">
                    <h3>Engine Results</h3>
                    <DonutChart
                      malicious={analysis.virustotal.malicious}
                      suspicious={analysis.virustotal.suspicious}
                      harmless={analysis.virustotal.harmless}
                      undetected={analysis.virustotal.undetected}
                    />
                  </div>

                  {/* Stat Cards */}
                  <div className="vt-stats-detailed">
                    <div className="vt-stat-card malicious">
                      <div className="vt-stat-icon">
                        <XCircle size={24} />
                      </div>
                      <div className="vt-stat-info">
                        <div className="vt-stat-count">{analysis.virustotal.malicious}</div>
                        <div className="vt-stat-label">Malicious</div>
                        <div className="vt-stat-bar">
                          <div
                            className="vt-stat-bar-fill"
                            style={{
                              width: `${(analysis.virustotal.malicious / (analysis.virustotal.totalEngines || 1)) * 100}%`,
                              backgroundColor: '#ef4444',
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="vt-stat-card suspicious">
                      <div className="vt-stat-icon">
                        <AlertTriangle size={24} />
                      </div>
                      <div className="vt-stat-info">
                        <div className="vt-stat-count">{analysis.virustotal.suspicious}</div>
                        <div className="vt-stat-label">Suspicious</div>
                        <div className="vt-stat-bar">
                          <div
                            className="vt-stat-bar-fill"
                            style={{
                              width: `${(analysis.virustotal.suspicious / (analysis.virustotal.totalEngines || 1)) * 100}%`,
                              backgroundColor: '#f59e0b',
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="vt-stat-card harmless">
                      <div className="vt-stat-icon">
                        <CheckCircle size={24} />
                      </div>
                      <div className="vt-stat-info">
                        <div className="vt-stat-count">{analysis.virustotal.harmless}</div>
                        <div className="vt-stat-label">Harmless</div>
                        <div className="vt-stat-bar">
                          <div
                            className="vt-stat-bar-fill"
                            style={{
                              width: `${(analysis.virustotal.harmless / (analysis.virustotal.totalEngines || 1)) * 100}%`,
                              backgroundColor: '#10b981',
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="vt-stat-card undetected">
                      <div className="vt-stat-icon">
                        <Shield size={24} />
                      </div>
                      <div className="vt-stat-info">
                        <div className="vt-stat-count">{analysis.virustotal.undetected}</div>
                        <div className="vt-stat-label">Undetected</div>
                        <div className="vt-stat-bar">
                          <div
                            className="vt-stat-bar-fill"
                            style={{
                              width: `${(analysis.virustotal.undetected / (analysis.virustotal.totalEngines || 1)) * 100}%`,
                              backgroundColor: '#94a3b8',
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Google Safe Browsing */}
            <div className="gsb-detail-section">
              <div className="section-title">
                <Globe size={24} />
                <h2>Google Safe Browsing</h2>
                {!analysis.safebrowsing.error && (
                  <span
                    className={`api-badge ${
                      analysis.safebrowsing.threatsFound ? 'threat' : 'clear'
                    }`}
                  >
                    {analysis.safebrowsing.threatsFound ? 'Threats Found' : '✓ Clean'}
                  </span>
                )}
              </div>

              {analysis.safebrowsing.error ? (
                <div className="api-error">
                  <AlertTriangle size={16} />
                  <span>{analysis.safebrowsing.error}</span>
                </div>
              ) : analysis.safebrowsing.threatsFound ? (
                <div className="gsb-threats">
                  {analysis.safebrowsing.threats.map((t, i) => (
                    <div key={i} className="gsb-threat-item">
                      <XCircle size={18} />
                      <span>{t.type.replace(/_/g, ' ')}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="gsb-clean">
                  <CheckCircle size={36} />
                  <div>
                    <h3>No threats detected</h3>
                    <p>URL is not listed in any Google Safe Browsing threat list</p>
                  </div>
                </div>
              )}
              <div className="gsb-categories">
                <span>Checked: Malware · Social Engineering · Unwanted Software · Harmful Apps</span>
              </div>
            </div>

            {/* Local Heuristic Threats */}
            {analysis.localThreats.length > 0 && (
              <div className="threats-section">
                <div className="section-title">
                  <AlertTriangle size={24} />
                  <h2>Local Analysis</h2>
                  <span className="api-badge threat">{analysis.localThreats.length} Finding{analysis.localThreats.length > 1 ? 's' : ''}</span>
                </div>
                <div className="threats-list">
                  {analysis.localThreats.map((threat, index) => (
                    <div key={index} className={`threat-item ${threat.level}`}>
                      <div className="threat-icon">
                        {threat.level === 'high' && <XCircle size={20} />}
                        {threat.level === 'medium' && <AlertTriangle size={20} />}
                        {threat.level === 'warning' && <AlertTriangle size={20} />}
                      </div>
                      <div className="threat-content">
                        <div className="threat-message">{threat.message}</div>
                        <div className="threat-impact">Impact: {threat.impact} points</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Clear */}
            {analysis.localThreats.length === 0 &&
              !analysis.safebrowsing.threatsFound &&
              (!analysis.virustotal.malicious || analysis.virustotal.malicious === 0) && (
                <div className="no-threats card">
                  <CheckCircle size={36} />
                  <h3>All clear!</h3>
                  <p>No threats detected across all scanning engines and heuristic checks.</p>
                </div>
              )}

            {/* Tips */}
            <div className="tips-section card">
              <h3>
                <Shield size={24} />
                Security Tips
              </h3>
              <ul>
                <li>Always check the domain name carefully — look for misspellings</li>
                <li>Prefer HTTPS over HTTP for secure connections</li>
                <li>Be cautious of URLs with IP addresses instead of domain names</li>
                <li>Watch for character substitutions (0 for O, 1 for l)</li>
                <li>Be wary of shortened URLs that hide the destination</li>
                <li>When in doubt, go directly to the website rather than clicking links</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkAnalyzer;
