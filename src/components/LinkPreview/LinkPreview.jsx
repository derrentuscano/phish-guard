import React, { useState, useEffect, useCallback } from 'react';
import {
  MousePointer2,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Activity,
  Globe,
  Clock,
  Trash2,
  RefreshCw,
  Download,
  Puzzle,
} from 'lucide-react';
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  deleteDoc,
  doc,
  getDocs,
} from 'firebase/firestore';
import { db, auth } from '../../firebase/config';
import './LinkPreview.css';

// ── Push auth tokens to the extension (so it can write to Firestore) ──────
const EXTENSION_ID = import.meta.env.VITE_EXTENSION_ID?.trim();


async function connectExtension() {
  if (!window.chrome?.runtime?.sendMessage) return false;
  const user = auth.currentUser;
  if (!user) return false;
  try {
    const idToken = await user.getIdToken();
    return await new Promise((resolve) => {
      window.chrome.runtime.sendMessage(
        EXTENSION_ID,
        { type: 'SAVE_AUTH', userId: user.uid, userEmail: user.email, idToken, tokenExpiry: Date.now() + 55 * 60 * 1000 },
        (response) => {
          resolve(!window.chrome.runtime.lastError && response?.ok);
        }
      );
    });
  } catch {
    return false;
  }
}

// ── Donut chart (re-used for safe vs dangerous) ────────────────────────────
const MiniDonut = ({ safe, dangerous }) => {
  const total = safe + dangerous || 1;
  const r = 40;
  const circ = 2 * Math.PI * r;
  const safeLen = (safe / total) * circ;
  return (
    <svg viewBox="0 0 100 100" className="mini-donut">
      <circle cx="50" cy="50" r={r} fill="none" stroke="#e5e7eb" strokeWidth="14" />
      <circle cx="50" cy="50" r={r} fill="none" stroke="#ef4444"
        strokeWidth="14" strokeDasharray={`${(dangerous / total) * circ} ${circ}`}
        strokeDashoffset={circ / 4} />
      <circle cx="50" cy="50" r={r} fill="none" stroke="#10b981"
        strokeWidth="14" strokeDasharray={`${safeLen} ${circ - safeLen}`}
        strokeDashoffset={circ / 4 - (dangerous / total) * circ} />
      <text x="50" y="46" textAnchor="middle" className="donut-pct">
        {total > 1 ? Math.round((safe / total) * 100) : 0}%
      </text>
      <text x="50" y="62" textAnchor="middle" className="donut-lbl">Safe</text>
    </svg>
  );
};

// ── Stat card ──────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, value, label, color }) => (
  <div className="lp-stat-card">
    <div className="lp-stat-icon" style={{ background: `${color}20` }}>
      <Icon size={24} style={{ color }} />
    </div>
    <div className="lp-stat-value" style={{ color }}>{value}</div>
    <div className="lp-stat-label">{label}</div>
  </div>
);

// ── Main Component ─────────────────────────────────────────────────────────
const LinkPreview = ({ user }) => {
  const [scans, setScans]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [extConnected, setExtConnected] = useState(false);

  // Live-listen to Firestore extensionScans subcollection
  // NOTE: No orderBy here — it would require a Firestore composite index.
  // We sort client-side instead.
  useEffect(() => {
    if (!user) return;
    console.log('[LinkPreview] Subscribing to extensionScans for uid:', user.uid);

    const q = query(
      collection(db, 'users', user.uid, 'extensionScans'),
      limit(100)
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        console.log('[LinkPreview] Firestore snapshot received, docs:', snap.size);
        const docs = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => new Date(b.checkedAt) - new Date(a.checkedAt)); // newest first
        setScans(docs);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('[LinkPreview] Firestore error:', err.code, err.message);
        setError(`Could not load scan history: ${err.message}`);
        setLoading(false);
      }
    );
    return unsub;
  }, [user]);

  // Try to connect extension on mount
  useEffect(() => {
    connectExtension().then((ok) => {
      console.log('[LinkPreview] Extension connected:', ok);
      setExtConnected(ok);
    });
  }, []);

  // ── Clear all history ─────────────────────────────────────────────────
  const clearHistory = async () => {
    if (!window.confirm('Delete all scan history?')) return;
    const snap = await getDocs(collection(db, 'users', user.uid, 'extensionScans'));
    await Promise.all(snap.docs.map((d) => deleteDoc(doc(db, 'users', user.uid, 'extensionScans', d.id))));
  };

  // ── Export CSV ────────────────────────────────────────────────────────
  const exportCSV = () => {
    const rows = [
      ['URL', 'Safe', 'Threats', 'Checked At', 'Page Host'],
      ...scans.map((s) => [
        s.url, s.safe ? 'Yes' : 'No',
        (s.threats || []).join('; '),
        s.checkedAt, s.pageHost || '',
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = 'phishguard_scan_history.csv';
    a.click();
  };

  // ── Stats ─────────────────────────────────────────────────────────────
  const total       = scans.length;
  const safeCnt     = scans.filter((s) => s.safe === true).length;
  const dangerCnt   = scans.filter((s) => s.safe === false).length;
  const unknownCnt  = total - safeCnt - dangerCnt;

  return (
    <div className="link-preview-container fade-in">
      <div className="container">
        {/* Header */}
        <div className="lp-header">
          <div className="lp-header-icon">
            <MousePointer2 size={48} />
          </div>
          <h1>Link Hover Preview</h1>
          <p>Your browser extension scan history — see every link you've hovered</p>
        </div>

        {/* Extension Status Banner */}
        <div className={`lp-ext-banner ${extConnected ? 'connected' : 'disconnected'}`}>
          <Puzzle size={22} />
          <div className="lp-ext-banner-text">
            {extConnected ? (
              <>
                <strong>Extension connected</strong>
                <span>Your hover scans are being synced in real-time</span>
              </>
            ) : (
              <>
                <strong>Extension not detected</strong>
                <span>Install the PhishGuard Chrome extension to start collecting hover data</span>
              </>
            )}
          </div>
          {!extConnected && (
            <a
              className="btn btn-primary lp-ext-btn"
              href="#install"
              onClick={(e) => { e.preventDefault(); alert('See browser-extension/ folder in the project. Load it unpacked in chrome://extensions'); }}
            >
              How to Install
            </a>
          )}
        </div>

        {/* Stats Row */}
        {!loading && (
          <div className="lp-stats-row">
            <StatCard icon={Activity}     value={total}      label="Total Scanned"   color="#6366f1" />
            <StatCard icon={CheckCircle}  value={safeCnt}    label="Safe Links"      color="#10b981" />
            <StatCard icon={XCircle}      value={dangerCnt}  label="Dangerous Links" color="#ef4444" />
            <StatCard icon={AlertTriangle} value={unknownCnt} label="Unknown"         color="#f59e0b" />
          </div>
        )}

        {/* Donut + recent section */}
        {!loading && total > 0 && (
          <div className="lp-overview-grid">
            {/* Donut chart */}
            <div className="lp-donut-card card">
              <h3>Safe vs Dangerous</h3>
              <MiniDonut safe={safeCnt} dangerous={dangerCnt} />
              <div className="lp-donut-legend">
                <span className="legend-dot" style={{ background: '#10b981' }} /> Safe ({safeCnt})
                &nbsp;&nbsp;
                <span className="legend-dot" style={{ background: '#ef4444' }} /> Dangerous ({dangerCnt})
              </div>
            </div>

            {/* Timeline (last 5) */}
            <div className="lp-timeline-card card">
              <h3>Recent Activity</h3>
              <div className="lp-timeline">
                {scans.slice(0, 5).map((s) => (
                  <div key={s.id} className={`lp-timeline-item ${s.safe ? 'safe' : s.safe === false ? 'danger' : 'unknown'}`}>
                    <div className="lp-timeline-dot" />
                    <div className="lp-timeline-content">
                      <div className="lp-timeline-url">{s.pageHost || s.url}</div>
                      <div className="lp-timeline-meta">
                        <Clock size={12} />
                        {new Date(s.checkedAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="lp-timeline-badge">
                      {s.safe === true  ? <CheckCircle size={16} className="safe" />
                     : s.safe === false ? <XCircle size={16} className="danger" />
                     : <AlertTriangle size={16} className="unknown" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Full History Table */}
        <div className="lp-history-card card">
          <div className="lp-history-header">
            <h2>
              <Globe size={22} />
              Scan History
            </h2>
            {total > 0 && (
              <div className="lp-history-actions">
                <button className="btn-icon" onClick={exportCSV} title="Export CSV">
                  <Download size={18} />
                </button>
                <button className="btn-icon danger" onClick={clearHistory} title="Clear all">
                  <Trash2 size={18} />
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="lp-loading">
              <RefreshCw size={24} className="spin" />
              <span>Loading scan history…</span>
            </div>
          ) : total === 0 ? (
            <div className="lp-empty">
              <MousePointer2 size={36} />
              <h3>No scans yet</h3>
              <p>Install the PhishGuard extension and hover over links on any website to start collecting data.</p>
            </div>
          ) : (
            <div className="lp-table-wrapper">
              <table className="lp-table">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>URL</th>
                    <th>Threat Type</th>
                    <th>Page</th>
                    <th>Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {scans.map((s) => (
                    <tr key={s.id} className={s.safe === false ? 'row-danger' : ''}>
                      <td>
                        {s.safe === true  ? <span className="badge safe">✅ Safe</span>
                       : s.safe === false ? <span className="badge danger">🚫 Dangerous</span>
                       : <span className="badge unknown">⚠️ Unknown</span>}
                      </td>
                      <td className="url-cell" title={s.url}>
                        {s.url.length > 55 ? s.url.slice(0, 55) + '…' : s.url}
                      </td>
                      <td className="threat-cell">
                        {(s.threats || []).length > 0
                          ? s.threats[0].replace(/_/g, ' ')
                          : <span className="muted">—</span>}
                      </td>
                      <td className="host-cell">{s.pageHost || '—'}</td>
                      <td className="date-cell">
                        {new Date(s.checkedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Install instructions */}
        <div className="lp-install-card card">
          <h2>
            <Puzzle size={22} />
            Install the Extension
          </h2>
          <div className="lp-install-steps">
            <div className="lp-install-step">
              <div className="step-num">1</div>
              <div>
                <strong>Download extension files</strong>
                <p>The <code>browser-extension/</code> folder is included in your PhishGuard project.</p>
              </div>
            </div>
            <div className="lp-install-step">
              <div className="step-num">2</div>
              <div>
                <strong>Open Chrome Extensions</strong>
                <p>Navigate to <code>chrome://extensions</code> and enable <strong>Developer Mode</strong>.</p>
              </div>
            </div>
            <div className="lp-install-step">
              <div className="step-num">3</div>
              <div>
                <strong>Load the extension</strong>
                <p>Click <strong>Load unpacked</strong> and select the <code>browser-extension/</code> folder.</p>
              </div>
            </div>
            <div className="lp-install-step">
              <div className="step-num">4</div>
              <div>
                <strong>You're live!</strong>
                <p>Hover over any link on any website — the PhishGuard tooltip will appear with a safety verdict.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkPreview;
