// ============================================================
// content.js — PhishGuard Extension Content Script
// Runs on every webpage. Detects link hovers and shows tooltip.
// ============================================================

let tooltip = null;
let activeLink = null;
let hoverTimer = null;

// ── Create tooltip element ───────────────────────────────────
function createTooltip() {
  const el = document.createElement('div');
  el.id = 'phishguard-tooltip';
  el.innerHTML = `
    <div class="pg-tooltip-inner">
      <div class="pg-logo">🛡️ PhishGuard</div>
      <div class="pg-status pg-loading">
        <span class="pg-spinner"></span>
        <span>Checking…</span>
      </div>
    </div>
  `;
  document.body.appendChild(el);
  return el;
}

function getTooltip() {
  if (!tooltip || !document.contains(tooltip)) {
    tooltip = createTooltip();
  }
  return tooltip;
}

// ── Update tooltip content ───────────────────────────────────
function setTooltipContent(result) {
  const inner = tooltip.querySelector('.pg-tooltip-inner');
  if (!inner) return;

  if (!result) {
    inner.innerHTML = `
      <div class="pg-logo">🛡️ PhishGuard</div>
      <div class="pg-status pg-loading">
        <span class="pg-spinner"></span>
        <span>Checking…</span>
      </div>`;
    return;
  }

  if (result.error) {
    inner.innerHTML = `
      <div class="pg-logo">🛡️ PhishGuard</div>
      <div class="pg-status pg-unknown">⚠️ Could not verify</div>`;
    return;
  }

  if (result.safe) {
    inner.innerHTML = `
      <div class="pg-logo">🛡️ PhishGuard</div>
      <div class="pg-status pg-safe">
        ✅ <strong>Safe</strong>
        <span class="pg-sub">No threats detected</span>
      </div>`;
  } else {
    const threat = result.threats?.[0]?.replace(/_/g, ' ') || 'Threat detected';
    inner.innerHTML = `
      <div class="pg-logo">🛡️ PhishGuard</div>
      <div class="pg-status pg-danger">
        🚫 <strong>Dangerous</strong>
        <span class="pg-sub">${threat}</span>
      </div>`;
  }
}

// ── Position tooltip near cursor ─────────────────────────────
function positionTooltip(e) {
  const t = getTooltip();
  const x = e.clientX + window.scrollX;
  const y = e.clientY + window.scrollY;
  t.style.left = `${x + 12}px`;
  t.style.top  = `${y - 60}px`;
}

// ── Show / hide ──────────────────────────────────────────────
function showTooltip() {
  getTooltip().classList.add('pg-visible');
}

function hideTooltip() {
  if (tooltip) tooltip.classList.remove('pg-visible');
  activeLink = null;
}

// ── Main hover handler ───────────────────────────────────────
document.addEventListener('mouseover', (e) => {
  const link = e.target.closest('a[href]');
  if (!link) return;

  const url = link.href;
  if (!url.startsWith('http')) return;
  if (link === activeLink) return;

  activeLink = link;
  clearTimeout(hoverTimer);

  // Reset tooltip to loading state
  const t = getTooltip();
  setTooltipContent(null);
  positionTooltip(e);
  showTooltip();

  // Debounce — only fire after 300ms of hover
  hoverTimer = setTimeout(() => {
    chrome.runtime.sendMessage(
      { type: 'CHECK_URL', url, pageTitle: document.title },
      (result) => {
        if (link === activeLink) {
          setTooltipContent(result);
        }
      }
    );
  }, 300);
});

document.addEventListener('mousemove', (e) => {
  if (tooltip?.classList.contains('pg-visible')) {
    positionTooltip(e);
  }
});

document.addEventListener('mouseout', (e) => {
  const link = e.target.closest('a[href]');
  if (!link) return;
  clearTimeout(hoverTimer);
  hideTooltip();
});
