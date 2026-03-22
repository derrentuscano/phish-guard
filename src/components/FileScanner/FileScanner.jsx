import React, { useState, useRef, useCallback } from 'react';
import {
  Upload,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  Search,
  Loader,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  File,
  Fingerprint,
  Code,
  Database,
  BarChart2,
} from 'lucide-react';
import { scanFile, FILE_CATEGORIES } from '../../utils/fileScanner';
import './FileScanner.css';

// ── Helpers ──────────────────────────────────────────────────
const formatBytes = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
};

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

// ── Score Gauge ───────────────────────────────────────────────
const ScoreGauge = ({ score, verdict }) => {
  const radius = 80;
  const stroke = 12;
  const center = 100;
  const startAngle = 150;
  const endAngle = 390;
  const totalArc = endAngle - startAngle;
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

  const colorMap = { safe: '#10b981', suspicious: '#f59e0b', dangerous: '#ef4444' };
  const color = colorMap[verdict] || '#94a3b8';

  return (
    <div className="fs-gauge">
      <svg viewBox="0 0 200 170" className="fs-gauge-svg">
        <defs>
          <filter id="fs-glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path d={arcPath(radius)} fill="none" stroke="#e5e7eb" strokeWidth={stroke} strokeLinecap="round" />
        <path
          d={arcPath(radius)}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${filledLength} ${arcLength}`}
          filter="url(#fs-glow)"
          style={{ transition: 'stroke-dasharray 1.2s ease' }}
        />
        <text x={center} y={center - 14} textAnchor="middle" className="fs-gauge-score">{score}</text>
        <text x={center} y={center + 10} textAnchor="middle" className="fs-gauge-max">/ 100</text>
        <text x={center} y={center + 34} textAnchor="middle" className="fs-gauge-label" fill={color}>
          {verdict.charAt(0).toUpperCase() + verdict.slice(1)}
        </text>
        <text x="20" y="158" className="fs-gauge-tick">0</text>
        <text x="92" y="14" className="fs-gauge-tick">50</text>
        <text x="172" y="158" className="fs-gauge-tick">100</text>
      </svg>
    </div>
  );
};

// ── Collapsible Section ───────────────────────────────────────
const Section = ({ icon: Icon, title, badge, badgeType, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="fs-section">
      <div className="fs-section-header" onClick={() => setOpen(o => !o)}>
        <div className="fs-section-title">
          <Icon size={20} />
          <span>{title}</span>
        </div>
        <div className="fs-section-right">
          {badge && <span className={`fs-badge fs-badge-${badgeType}`}>{badge}</span>}
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>
      {open && <div className="fs-section-body">{children}</div>}
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────
const FileScanner = () => {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const STEPS = [
    { step: 1, icon: Fingerprint, label: 'Magic Byte Detection' },
    { step: 2, icon: Code, label: 'Content Analysis' },
    { step: 3, icon: Database, label: 'VirusTotal Hash Check' },
    { step: 4, icon: BarChart2, label: 'Risk Score Calculation' },
  ];

  const handleFile = useCallback((f) => {
    if (!f) return;
    if (f.size > MAX_FILE_SIZE) {
      setError(`File too large. Maximum size is 100 MB. Your file is ${formatBytes(f.size)}.`);
      return;
    }
    setFile(f);
    setResult(null);
    setError('');
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer?.files?.[0];
    handleFile(f);
  }, [handleFile]);

  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  const handleScan = async () => {
    if (!file) return;
    setScanning(true);
    setResult(null);
    setError('');
    setProgress({ step: 0, label: 'Initialising scan…', done: false });

    try {
      const scanResult = await scanFile(file, (p) => setProgress(p));
      setResult(scanResult);
    } catch (err) {
      console.error('File scan error:', err);
      setError('An error occurred during scanning. Please try again.');
    } finally {
      setScanning(false);
      setProgress(null);
    }
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setError('');
    setProgress(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="fs-container fade-in">
      <div className="container">

        {/* ── Header ───────────────────────────────────────── */}
        <div className="fs-header">
          <div className="fs-header-icon">
            <Shield size={48} />
          </div>
          <h1>File Safety Scanner</h1>
          <p>Upload any file to check if it&apos;s safe before opening it</p>
          <div className="fs-checks-row">
            <span className="fs-check-pill"><Fingerprint size={14} /> Magic Bytes</span>
            <span className="fs-check-pill"><Code size={14} /> Content Analysis</span>
            <span className="fs-check-pill"><Database size={14} /> VirusTotal</span>
            <span className="fs-check-pill"><BarChart2 size={14} /> Risk Score</span>
          </div>
        </div>

        {/* ── Upload Zone ───────────────────────────────────── */}
        <div className="card fs-card">
          {!scanning && !result && (
            <>
              <div
                id="file-drop-zone"
                className={`fs-dropzone ${dragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onClick={() => !file && inputRef.current?.click()}
              >
                <input
                  ref={inputRef}
                  id="file-input"
                  type="file"
                  className="fs-hidden-input"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
                {file ? (
                  <div className="fs-file-info">
                    <div className="fs-file-icon">
                      <File size={40} />
                    </div>
                    <div className="fs-file-meta">
                      <div className="fs-file-name" title={file.name}>{file.name}</div>
                      <div className="fs-file-size">{formatBytes(file.size)}</div>
                    </div>
                  </div>
                ) : (
                  <div className="fs-upload-prompt">
                    <div className="fs-upload-icon">
                      <Upload size={40} />
                    </div>
                    <p className="fs-upload-title">Drag &amp; drop your file here</p>
                    <p className="fs-upload-sub">or click to browse — max 100 MB</p>
                  </div>
                )}
              </div>

              <div className="fs-actions">
                {file && (
                  <button className="btn btn-outline fs-reset-btn" onClick={reset}>
                    Choose different file
                  </button>
                )}
                <button
                  id="scan-button"
                  className="btn btn-primary fs-scan-btn"
                  disabled={!file}
                  onClick={handleScan}
                >
                  <Search size={20} />
                  Scan File
                </button>
              </div>
            </>
          )}

          {/* ── Scanning Progress ───────────────────────── */}
          {scanning && (
            <div className="fs-progress-wrapper">
              <div className="fs-scanning-anim">
                <div className="fs-pulse-ring" />
                <div className="fs-pulse-ring fs-delay-1" />
                <div className="fs-pulse-ring fs-delay-2" />
                <Shield size={38} className="fs-scanning-icon" />
              </div>
              <h3 className="fs-scanning-title">Scanning {file?.name}…</h3>
              <div className="fs-steps">
                {STEPS.map(({ step, icon: Icon, label }) => {
                  const current = progress?.step || 0;
                  const isDone = current > step || (current === step && progress?.done);
                  const isActive = current === step && !progress?.done;
                  return (
                    <div key={step} className={`fs-step ${isDone ? 'done' : isActive ? 'active' : 'pending'}`}>
                      <div className="fs-step-icon">
                        {isDone ? <CheckCircle size={18} /> : isActive ? <Loader size={18} className="spin" /> : <Icon size={18} />}
                      </div>
                      <span>{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── Error ──────────────────────────────────────────── */}
        {error && (
          <div className="fs-error-banner">
            <XCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* ── Results ─────────────────────────────────────────── */}
        {result && (
          <div className="fs-results fade-in">

            {/* Verdict Card */}
            <div className={`fs-verdict-card fs-verdict-${result.verdict}`}>
              <div className="fs-verdict-gauge">
                <ScoreGauge score={result.score} verdict={result.verdict} />
              </div>
              <div className="fs-verdict-info">
                <div className={`fs-verdict-badge fs-verdict-badge-${result.verdict}`}>
                  {result.verdict === 'safe' && <CheckCircle size={28} />}
                  {result.verdict === 'suspicious' && <AlertTriangle size={28} />}
                  {result.verdict === 'dangerous' && <XCircle size={28} />}
                  <span>{result.verdict.charAt(0).toUpperCase() + result.verdict.slice(1)}</span>
                </div>
                <div className="fs-verdict-filename" title={result.file.name}>
                  <File size={16} />
                  {result.file.name}
                </div>
                <div className="fs-verdict-meta">
                  <span>{formatBytes(result.file.size)}</span>
                  <span>·</span>
                  <span>Scanned {new Date(result.scannedAt).toLocaleTimeString()}</span>
                </div>
                {result.deductions.length > 0 && (
                  <div className="fs-deductions">
                    <p className="fs-deductions-title">Why this score?</p>
                    {result.deductions.map((d, i) => (
                      <div key={i} className="fs-deduction-item">
                        <span className="fs-deduction-points">−{d.points}</span>
                        <span>{d.reason}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Check 1 — Magic Bytes */}
            <Section
              icon={Fingerprint}
              title="File Identity Check (Magic Bytes)"
              badge={
                result.magicResult.isMismatch
                  ? '⚠ Extension Mismatch!'
                  : result.magicResult.isDangerousTrueType && !result.magicResult.isDangerousExtension
                  ? '⚠ Executable Disguised'
                  : result.magicResult.isDangerousExtension
                  ? '⚠ Dangerous Extension'
                  : '✓ Looks Genuine'
              }
              badgeType={
                result.magicResult.isMismatch || result.magicResult.isDangerousTrueType
                  ? 'danger'
                  : result.magicResult.isDangerousExtension
                  ? 'danger'
                  : 'safe'
              }
            >
              {/* ── True Type Hero Card ── */}
              <div
                className="fs-truetype-card"
                style={{
                  borderColor: result.magicResult.categoryInfo?.color + '55',
                  background:  result.magicResult.categoryInfo?.color + '10',
                }}
              >
                <div className="fs-truetype-icon" style={{ backgroundColor: result.magicResult.categoryInfo?.color + '22' }}>
                  <span className="fs-truetype-emoji">{result.magicResult.categoryInfo?.icon || '❓'}</span>
                </div>
                <div className="fs-truetype-body">
                  <div className="fs-truetype-label">True File Type Detected</div>
                  <div className="fs-truetype-name">{result.magicResult.detectedName}</div>
                  <div className="fs-truetype-meta">
                    <span
                      className="fs-truetype-category"
                      style={{ backgroundColor: result.magicResult.categoryInfo?.color + '22', color: result.magicResult.categoryInfo?.color }}
                    >
                      {result.magicResult.categoryInfo?.label || 'Unknown'}
                    </span>
                    {result.magicResult.knownExtensions?.length > 0 && (
                      <span className="fs-truetype-exts">
                        Normally: {result.magicResult.knownExtensions.slice(0, 6).map(e => <code key={e}>.{e}</code>)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Detail Grid ── */}
              <div className="fs-magic-grid">
                <div className="fs-magic-item">
                  <span className="fs-magic-label">Claimed Extension</span>
                  <span className="fs-magic-value">.{result.magicResult.claimedExtension}</span>
                </div>
                <div className="fs-magic-item">
                  <span className="fs-magic-label">Magic Bytes (hex)</span>
                  <span className="fs-magic-value fs-mono">{result.magicResult.hexHeader}</span>
                </div>
                <div className="fs-magic-item">
                  <span className="fs-magic-label">File Category</span>
                  <span className="fs-magic-value" style={{ color: result.magicResult.categoryInfo?.color }}>
                    {result.magicResult.categoryInfo?.icon} {result.magicResult.categoryInfo?.label}
                  </span>
                </div>
                <div className="fs-magic-item">
                  <span className="fs-magic-label">Extension Safety</span>
                  <span className={`fs-magic-value ${result.magicResult.isDangerousExtension ? 'fs-text-danger' : 'fs-text-safe'}`}>
                    {result.magicResult.isDangerousExtension ? '🚨 Executable / Dangerous' : '✅ Non-executable'}
                  </span>
                </div>
              </div>

              {result.magicResult.isMismatch && (
                <div className="fs-alert fs-alert-danger">
                  <XCircle size={16} />
                  <span>{result.magicResult.mismatchDetail}</span>
                </div>
              )}
              {!result.magicResult.isMismatch && result.magicResult.isDangerousTrueType && !result.magicResult.isDangerousExtension && (
                <div className="fs-alert fs-alert-danger">
                  <XCircle size={16} />
                  <span>The true content is an executable/system file despite the extension suggesting otherwise. This is highly suspicious.</span>
                </div>
              )}
              {!result.magicResult.isMismatch && !result.magicResult.isDangerousTrueType && (
                <div className="fs-alert fs-alert-safe">
                  <CheckCircle size={16} />
                  <span>The file type matches its extension — no disguise detected.</span>
                </div>
              )}
            </Section>

            {/* Check 2 — Content Analysis */}
            <Section
              icon={Code}
              title="Content Analysis"
              badge={
                result.contentFindings.length === 0
                  ? '✓ Nothing Suspicious'
                  : `${result.contentFindings.length} Finding${result.contentFindings.length > 1 ? 's' : ''}`
              }
              badgeType={result.contentFindings.length === 0 ? 'safe' : 'danger'}
            >
              {result.contentFindings.length === 0 ? (
                <div className="fs-alert fs-alert-safe">
                  <CheckCircle size={16} />
                  <span>No suspicious scripts, macros, or embedded commands were found.</span>
                </div>
              ) : (
                <div className="fs-findings-list">
                  {result.contentFindings.map((f, i) => (
                    <div key={i} className={`fs-finding fs-finding-${f.level}`}>
                      <div className="fs-finding-icon">
                        {f.level === 'high' ? <XCircle size={18} /> : <AlertTriangle size={18} />}
                      </div>
                      <div className="fs-finding-content">
                        <div className="fs-finding-message">{f.message}</div>
                        <div className="fs-finding-detail">{f.detail}</div>
                      </div>
                      <span className={`fs-finding-badge fs-finding-badge-${f.level}`}>{f.level}</span>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            {/* Check 3 — VirusTotal */}
            <Section
              icon={Database}
              title="VirusTotal Hash Check"
              badge={
                result.vtResult.error
                  ? 'Error'
                  : !result.vtResult.found
                  ? 'Not in Database'
                  : result.vtResult.malicious > 0
                  ? `${result.vtResult.malicious} Engines Flagged`
                  : '✓ Clean'
              }
              badgeType={
                result.vtResult.error || result.vtResult.malicious > 0 ? 'danger' : 'safe'
              }
            >
              {result.vtResult.error ? (
                <div className="fs-alert fs-alert-warn">
                  <AlertTriangle size={16} />
                  <span>{result.vtResult.error}</span>
                </div>
              ) : (
                <>
                  <div className="fs-vt-hash">
                    <span className="fs-magic-label">SHA-256 Fingerprint</span>
                    <span className="fs-mono fs-hash-value">{result.vtResult.sha256}</span>
                  </div>

                  {!result.vtResult.found ? (
                    <div className="fs-alert fs-alert-info">
                      <Shield size={16} />
                      <span>{result.vtResult.note}</span>
                    </div>
                  ) : (
                    <>
                      <div className="fs-vt-stats">
                        {[
                          { label: 'Malicious', value: result.vtResult.malicious, color: '#ef4444' },
                          { label: 'Suspicious', value: result.vtResult.suspicious, color: '#f59e0b' },
                          { label: 'Harmless', value: result.vtResult.harmless, color: '#10b981' },
                          { label: 'Undetected', value: result.vtResult.undetected, color: '#94a3b8' },
                        ].map(({ label, value, color }) => (
                          <div key={label} className="fs-vt-stat-item">
                            <div className="fs-vt-stat-count" style={{ color }}>{value}</div>
                            <div className="fs-vt-stat-label">{label}</div>
                            <div className="fs-vt-bar">
                              <div
                                className="fs-vt-bar-fill"
                                style={{
                                  width: `${(value / Math.max(result.vtResult.totalEngines, 1)) * 100}%`,
                                  backgroundColor: color,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {result.vtResult.flaggedEngines?.length > 0 && (
                        <div className="fs-flagged-engines">
                          <p className="fs-flagged-title">Engines that flagged this file:</p>
                          <div className="fs-engine-tags">
                            {result.vtResult.flaggedEngines.map((e, i) => (
                              <span key={i} className={`fs-engine-tag fs-engine-tag-${e.verdict}`}>
                                {e.engine}: {e.result || e.verdict}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <a
                        href={result.vtResult.permalink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="fs-vt-link"
                      >
                        <ExternalLink size={14} />
                        View full report on VirusTotal
                      </a>
                    </>
                  )}
                </>
              )}
            </Section>

            {/* Scan Another */}
            <div className="fs-rescan">
              <button className="btn btn-primary" onClick={reset}>
                <FileText size={18} />
                Scan another file
              </button>
            </div>
          </div>
        )}

        {/* ── Info Cards (shown before scan) ─────────────────── */}
        {!result && !scanning && (
          <div className="fs-info-grid">
            {[
              {
                icon: Fingerprint,
                color: '#6366f1',
                title: 'Magic Byte Detection',
                desc: 'Reads the hidden byte signature of the file to reveal its true identity, catching disguised executables.',
              },
              {
                icon: Code,
                color: '#f59e0b',
                title: 'Content Analysis',
                desc: 'Scans file contents for JavaScript, macros, PowerShell commands, suspicious URLs, and embedded executables.',
              },
              {
                icon: Database,
                color: '#0ea5e9',
                title: 'VirusTotal Check',
                desc: "Calculates the file's SHA-256 fingerprint and checks it against 70+ antivirus engines — without uploading the file.",
              },
              {
                icon: BarChart2,
                color: '#10b981',
                title: 'Risk Score',
                desc: 'Combines all checks into a score out of 100 with a clear verdict: Safe, Suspicious, or Dangerous.',
              },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="fs-info-card card">
                <div className="fs-info-icon" style={{ backgroundColor: `${color}18` }}>
                  <Icon size={28} style={{ color }} />
                </div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileScanner;
