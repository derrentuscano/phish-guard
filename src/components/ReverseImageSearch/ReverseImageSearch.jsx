import React, { useState, useRef, useCallback } from 'react';
import {
  Upload, Shield, CheckCircle, XCircle, FileImage,
  Search, Loader, Eye, Brain, ScanSearch, Sparkles,
  Info, Copy, ExternalLink, Camera, MapPin, Clock,
  AlertTriangle, Zap, Globe, Image, ChevronDown, ChevronUp,
} from 'lucide-react';
import { runReverseImageSearch } from '../../utils/reverseImageSearch';
import './ReverseImageSearch.css';

const formatBytes = b => b < 1024 ? b + ' B' : b < 1048576 ? (b / 1024).toFixed(1) + ' KB' : (b / 1048576).toFixed(2) + ' MB';
const MAX_SIZE = 20 * 1024 * 1024;

const STEPS = [
  'Loading image',
  'Gemini Vision AI',
  'Extracting metadata',
  'Error Level Analysis',
  'Color distribution',
  'Computing score',
];

// ── Score Badge ───────────────────────────────────────────────
const AuthenticityBadge = ({ score }) => {
  let label, color, bg;
  if (score <= 20)      { label = 'Authentic';       color = '#16a34a'; bg = '#f0fdf4'; }
  else if (score <= 40) { label = 'Likely Authentic'; color = '#65a30d'; bg = '#f7fee7'; }
  else if (score <= 60) { label = 'Uncertain';        color = '#d97706'; bg = '#fffbeb'; }
  else if (score <= 80) { label = 'Possibly Edited';  color = '#ea580c'; bg = '#fff7ed'; }
  else                  { label = 'Likely AI / Fake'; color = '#dc2626'; bg = '#fef2f2'; }
  return (
    <div className="ris-auth-badge" style={{ background: bg, borderColor: color + '44' }}>
      <div className="ris-auth-num" style={{ color }}>{score}</div>
      <div className="ris-auth-label" style={{ color }}>{label}</div>
      <div className="ris-auth-sub">Manipulation Score</div>
    </div>
  );
};

// ── Score Bar ────────────────────────────────────────────────
const ScoreBar = ({ label, score, max = 100, color = '#7c3aed' }) => {
  const pct = Math.min(100, Math.round((score / max) * 100));
  return (
    <div className="ris-bar-row">
      <div className="ris-bar-h">
        <span className="ris-bar-l">{label}</span>
        <span className="ris-bar-v" style={{ color }}>{score}/{max}</span>
      </div>
      <div className="ris-bar-track">
        <div className="ris-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
};

// ── Collapsible Section ───────────────────────────────────────
const Section = ({ icon: Icon, title, badge, badgeType = 'info', children, defaultOpen = true, accent = '#7c3aed' }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="ris-section">
      <div className="ris-sh" onClick={() => setOpen(o => !o)}>
        <div className="ris-st"><Icon size={17} style={{ color: accent }} /><span>{title}</span></div>
        <div className="ris-sr">
          {badge && <span className={`ris-badge rb-${badgeType}`}>{badge}</span>}
          {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </div>
      </div>
      {open && <div className="ris-sb">{children}</div>}
    </div>
  );
};

// ── Safe Search Pill ─────────────────────────────────────────
const SafePill = ({ label, rating }) => {
  const colors = {
    VERY_UNLIKELY: '#16a34a', UNLIKELY: '#65a30d',
    POSSIBLE: '#d97706', LIKELY: '#ea580c', VERY_LIKELY: '#dc2626',
  };
  const color = colors[rating] || '#9ca3af';
  return (
    <div className="ris-safe-pill" style={{ borderColor: color + '55', background: color + '12' }}>
      <span className="ris-sp-label">{label}</span>
      <span className="ris-sp-val" style={{ color }}>{(rating || 'UNKNOWN').replace('_', ' ')}</span>
    </div>
  );
};

// ── Copy Button ──────────────────────────────────────────────
const CopyBtn = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <button className="ris-copy-btn" onClick={copy} title="Copy">
      {copied ? <CheckCircle size={13} /> : <Copy size={13} />}
    </button>
  );
};

// ── Main Component ────────────────────────────────────────────
const ReverseImageSearch = () => {
  const [file, setFile]       = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(null);
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState('');
  const inputRef = useRef(null);

  const handleFile = useCallback(f => {
    if (!f) return;
    if (!f.type.startsWith('image/')) { setError('Please upload an image file (JPG, PNG, WEBP, etc.)'); return; }
    if (f.size > MAX_SIZE) { setError(`File too large. Max 20 MB. Your file: ${formatBytes(f.size)}`); return; }
    setFile(f); setResult(null); setError('');
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(f));
  }, [preview]);

  const onDrop = useCallback(e => {
    e.preventDefault(); setDragging(false);
    handleFile(e.dataTransfer?.files?.[0]);
  }, [handleFile]);

  const handleScan = async () => {
    if (!file) return;
    setScanning(true); setResult(null); setError('');
    setProgress({ step: 0, label: 'Initialising…' });
    try {
      const r = await runReverseImageSearch(file, p => setProgress(p));
      setResult(r);
    } catch (e) {
      console.error(e);
      setError('Analysis failed: ' + e.message);
    } finally {
      setScanning(false); setProgress(null);
    }
  };

  const reset = () => {
    setFile(null); setResult(null); setError(''); setProgress(null);
    if (preview) URL.revokeObjectURL(preview); setPreview(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const g = result?.gemini;

  return (
    <div className="ris-container fade-in">
      <div className="container">

        {/* Header */}
        <div className="ris-header">
          <div className="ris-hico"><ScanSearch size={42} /></div>
          <h1>Reverse Image Search</h1>
          <p>Gemini Vision AI identifies subjects, context, manipulation signals & generates search terms</p>
        </div>

        {/* Upload Card */}
        <div className="card ris-card">
          {!scanning && !result && (
            <>
              <div
                id="ris-drop-zone"
                className={`ris-dz ${dragging ? 'dz-drag' : ''} ${file ? 'dz-file' : ''}`}
                onDrop={onDrop}
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onClick={() => !file && inputRef.current?.click()}
              >
                <input ref={inputRef} id="ris-input" type="file" accept="image/*" className="ris-hidden"
                  onChange={e => handleFile(e.target.files?.[0])} />
                {file ? (
                  <div className="ris-prev">
                    {preview && <img src={preview} alt="preview" className="ris-thumb" />}
                    <div>
                      <div className="ris-fn">{file.name}</div>
                      <div className="ris-fs">{formatBytes(file.size)}</div>
                    </div>
                  </div>
                ) : (
                  <div className="ris-up">
                    <div className="ris-uico"><Upload size={36} /></div>
                    <p className="ris-ut">Drop image here or click to browse</p>
                    <p className="ris-us">JPG · PNG · WEBP · max 20 MB</p>
                  </div>
                )}
              </div>
              <div className="ris-acts">
                {file && <button className="btn ris-rbtn" onClick={reset}>Choose different image</button>}
                <button id="ris-analyze-btn" className="btn ris-sbtn" disabled={!file} onClick={handleScan}>
                  <Search size={18} />Analyse Image
                </button>
              </div>
            </>
          )}

          {/* Progress */}
          {scanning && (
            <div className="ris-prog">
              <div className="ris-spin-wrap">
                <div className="ris-ring" /><div className="ris-ring ris-r2" /><div className="ris-ring ris-r3" />
                <ScanSearch size={30} style={{ color: '#7c3aed', position: 'relative', zIndex: 1 }} />
              </div>
              <h3>Analysing with Gemini Vision AI…</h3>
              <p className="ris-pl">{progress?.label}</p>
              <div className="ris-steps-list">
                {STEPS.map((s, i) => {
                  const cur = progress?.step || 0;
                  const done = cur > i + 1;
                  const active = cur === i + 1;
                  return (
                    <div key={i} className={`ris-step ${done ? 'rs-done' : active ? 'rs-active' : 'rs-pend'}`}>
                      <span className="rs-ico">
                        {done ? <CheckCircle size={14} /> : active ? <Loader size={14} className="spin" /> : <span className="rs-dot" />}
                      </span>
                      <span>{s}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="ris-err"><XCircle size={18} /><span>{error}</span></div>
        )}

        {/* Results */}
        {result && (
          <div className="ris-results fade-in">

            {/* Hero */}
            <div className="ris-hero">
              {preview && <img src={preview} alt="" className="ris-hi" />}
              <div className="ris-hm">
                <div className="ris-htag">
                  {g?.subjectType && <span className="ris-type-chip">{g.subjectType.toUpperCase()}</span>}
                  {g?.estimatedYear && g.estimatedYear !== 'Unknown' && (
                    <span className="ris-year-chip"><Clock size={11} />{g.estimatedYear}</span>
                  )}
                </div>
                <div className="ris-hsubject">{g?.subject || 'Subject not identified'}</div>
                <div className="ris-horigin">
                  <Globe size={13} />{g?.likelyOrigin || 'Origin unknown'}
                </div>
                <div className="ris-hmeta">
                  <FileImage size={12} /><span>{result.file.name}</span>
                  <span className="dot">·</span><span>{formatBytes(result.file.size)}</span>
                  <span className="dot">·</span><span>{result.image.width}×{result.image.height}px</span>
                </div>
              </div>
              <AuthenticityBadge score={result.combinedManipScore} />
            </div>

            {/* Gemini Error Banner */}
            {result.geminiError && (
              <div className="ris-gwarn">
                <AlertTriangle size={16} />
                <span>Gemini Vision unavailable ({result.geminiError.slice(0, 80)}). Showing local analysis only.</span>
              </div>
            )}

            {/* 3-column info grid */}
            <div className="ris-info-grid">

              {/* Context */}
              {g?.context && (
                <div className="card ris-ic">
                  <div className="ris-ic-title"><Brain size={15} />AI Context Analysis</div>
                  <p className="ris-ic-text">{g.context}</p>
                </div>
              )}

              {/* Notable Elements */}
              {g?.notableElements?.length > 0 && (
                <div className="card ris-ic">
                  <div className="ris-ic-title"><Eye size={15} />Notable Elements</div>
                  <ul className="ris-nel">
                    {g.notableElements.map((el, i) => (
                      <li key={i}><Sparkles size={11} />{el}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Dominant Colors */}
              {g?.dominantColors?.length > 0 && (
                <div className="card ris-ic">
                  <div className="ris-ic-title"><Image size={15} />Dominant Colors</div>
                  <div className="ris-colors">
                    {g.dominantColors.map((c, i) => (
                      <span key={i} className="ris-color-tag">{c}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Suggested Search Terms */}
            {g?.suggestedSearchTerms?.length > 0 && (
              <Section icon={Search} title="Suggested Search Terms" badge="Copy & paste into Google Images / TinEye" badgeType="info">
                <p className="ris-terms-hint">Use these terms on Google Images, TinEye, or Yandex to find original source:</p>
                <div className="ris-terms-grid">
                  {g.suggestedSearchTerms.map((t, i) => (
                    <div key={i} className="ris-term-chip">
                      <span>{t}</span>
                      <CopyBtn text={t} />
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Quick Search Links */}
            <Section icon={Globe} title="Quick Search Links" badge="Open in new tab" badgeType="info">
              <p className="ris-terms-hint">Upload the image directly to these services for visual reverse search:</p>
              <div className="ris-links-grid">
                {result.searchLinks.map((link, i) => (
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="ris-link-card">
                    <div className="ris-lc-name">{link.name}</div>
                    <div className="ris-lc-hint">{link.hint}</div>
                    <ExternalLink size={14} className="ris-lc-ico" />
                  </a>
                ))}
              </div>
            </Section>

            {/* Manipulation Analysis */}
            <Section icon={Shield} title="Manipulation & Authenticity" badge={`Score: ${result.combinedManipScore}/100`} badgeType={result.combinedManipScore > 60 ? 'danger' : result.combinedManipScore > 30 ? 'warn' : 'safe'}>
              <div className="ris-manip">
                {g?.manipulationSignals && (
                  <div className="ris-manip-verdict">
                    <span className="ris-mv-label">Gemini Verdict:</span>
                    <span className={`ris-mv-tag ${g.manipulationSignals.isAIGenerated ? 'mvt-bad' : 'mvt-good'}`}>
                      {g.manipulationSignals.verdict?.replace(/_/g, ' ')}
                    </span>
                    {g.manipulationSignals.isAIGenerated && (
                      <span className="ris-ai-flag"><Zap size={11} />AI Generated</span>
                    )}
                  </div>
                )}
                <div className="ris-bars">
                  <ScoreBar label="Combined Manipulation Score" score={result.combinedManipScore} color="#7c3aed" />
                  {g?.manipulationSignals && (
                    <ScoreBar label="Gemini Manipulation Signal" score={g.manipulationSignals.score} color="#dc2626" />
                  )}
                  <ScoreBar label="ELA Score" score={result.ela.elaScore} max={45} color="#f59e0b" />
                  <ScoreBar label="Color Smoothness Signal" score={result.color.colorScore} max={20} color="#0ea5e9" />
                </div>
                {g?.manipulationSignals?.signals?.length > 0 && (
                  <div className="ris-signals">
                    <div className="ris-sig-title">Detected Signals:</div>
                    {g.manipulationSignals.signals.map((s, i) => (
                      <div key={i} className="ris-sig-item"><AlertTriangle size={12} />{s}</div>
                    ))}
                  </div>
                )}
                <div className="ris-tech-row">
                  <div className="ris-tech-item">
                    <span className="ris-tl">ELA std‑dev:</span>
                    <span className="ris-tv">{result.ela.std}</span>
                  </div>
                  <div className="ris-tech-item">
                    <span className="ris-tl">ELA mean:</span>
                    <span className="ris-tv">{result.ela.mean}</span>
                  </div>
                  <div className="ris-tech-item">
                    <span className="ris-tl">Color smoothness:</span>
                    <span className="ris-tv">{result.color.smoothness}</span>
                  </div>
                  <div className="ris-tech-item">
                    <span className="ris-tl">ELA signal:</span>
                    <span className="ris-tv">{result.ela.elaSignal}</span>
                  </div>
                </div>
              </div>
            </Section>

            {/* Safe Search */}
            {g?.safeSearch && (
              <Section icon={Shield} title="Safe Search Flags" badge="Content Safety" badgeType="info">
                <div className="ris-safe-grid">
                  <SafePill label="Adult" rating={g.safeSearch.adult} />
                  <SafePill label="Violence" rating={g.safeSearch.violence} />
                  <SafePill label="Spoof" rating={g.safeSearch.spoof} />
                </div>
              </Section>
            )}

            {/* Metadata */}
            <Section icon={Camera} title="Image Metadata" badge={result.meta.hasExif ? 'EXIF Found' : 'No EXIF'} badgeType={result.meta.hasExif ? 'safe' : 'warn'} defaultOpen={false}>
              {result.meta.hasExif ? (
                <div className="ris-meta-grid">
                  {result.meta.camera    && <div className="ris-mi"><Camera size={13}/><span className="ris-ml">Camera</span><span className="ris-mv">{result.meta.camera}</span></div>}
                  {result.meta.software  && <div className="ris-mi"><Info size={13}/><span className="ris-ml">Software</span><span className="ris-mv">{result.meta.software}</span></div>}
                  {result.meta.dateTaken && <div className="ris-mi"><Clock size={13}/><span className="ris-ml">Taken</span><span className="ris-mv">{new Date(result.meta.dateTaken).toLocaleDateString()}</span></div>}
                  {result.meta.gps       && <div className="ris-mi"><MapPin size={13}/><span className="ris-ml">GPS</span><span className="ris-mv">{result.meta.gps.lat}, {result.meta.gps.lng}</span></div>}
                  {result.meta.iso       && <div className="ris-mi"><Zap size={13}/><span className="ris-ml">ISO</span><span className="ris-mv">{result.meta.iso}</span></div>}
                  {result.meta.focalLength && <div className="ris-mi"><Eye size={13}/><span className="ris-ml">Focal Length</span><span className="ris-mv">{result.meta.focalLength}</span></div>}
                  {result.meta.exposureTime && <div className="ris-mi"><Clock size={13}/><span className="ris-ml">Exposure</span><span className="ris-mv">{result.meta.exposureTime}</span></div>}
                  {result.meta.fNumber   && <div className="ris-mi"><Camera size={13}/><span className="ris-ml">Aperture</span><span className="ris-mv">{result.meta.fNumber}</span></div>}
                </div>
              ) : (
                <div className="ris-no-meta">
                  <Info size={16} />No EXIF metadata found. Image may be AI-generated, screenshot, or metadata was stripped.
                </div>
              )}
            </Section>

            {/* Rescan */}
            <div className="ris-rescan">
              <button className="btn ris-sbtn" onClick={reset}><FileImage size={16} />Search Another Image</button>
              <button className="btn ris-rbtn" onClick={() => { setResult(null); }}>Re-analyse Same Image</button>
            </div>
          </div>
        )}

        {/* How it works */}
        {!result && !scanning && (
          <div className="ris-expl">
            <div className="ris-expl-title">How it works</div>
            <div className="ris-expl-grid">
              {[
                { icon: Brain, color: '#7c3aed', title: 'Gemini Vision AI', items: ['Identifies subjects & landmarks', 'Detects AI generation signals', 'Safe-search content flags', 'Suggests top search terms'] },
                { icon: Search, color: '#0ea5e9', title: 'Smart Search Terms', items: ['5 optimized search queries', 'One-click copy to clipboard', 'Paste into Google Images', 'Works with TinEye & Yandex'] },
                { icon: Shield, color: '#dc2626', title: 'Manipulation Detection', items: ['JPEG Error Level Analysis', 'Color gradient smoothness', 'Gemini manipulation score', 'Combined authenticity rating'] },
                { icon: Camera, color: '#16a34a', title: 'Metadata Forensics', items: ['Camera make & model', 'Capture timestamp & GPS', 'Software & creator tool', 'ISO, aperture, focal length'] },
              ].map(({ icon: Icon, color, title, items }) => (
                <div key={title} className="card ris-ex-card">
                  <div className="ris-ex-ico" style={{ background: `${color}18`, color }}><Icon size={20} /></div>
                  <div className="ris-ex-title">{title}</div>
                  <ul className="ris-ex-list">
                    {items.map(it => <li key={it}><CheckCircle size={10} />{it}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReverseImageSearch;
