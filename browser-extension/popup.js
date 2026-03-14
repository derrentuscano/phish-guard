// popup.js — Extension popup logic
// Detects sign-in status and opens PhishGuard login when needed

// Auto-detect: use localhost in dev, production URL otherwise
const PHISHGUARD_URL = 'http://localhost:3000';

const statusDisplay = document.getElementById('status-display');
const infoText      = document.getElementById('info-text');
const openSiteBtn   = document.getElementById('open-site-btn');
const disconnectBtn = document.getElementById('disconnect-btn');

function renderConnected(email) {
  statusDisplay.innerHTML = `
    <div class="status-connected">
      <span class="status-dot"></span> Connected
    </div>
    <div class="user-email">${email || ''}</div>`;
  infoText.textContent = 'Your hover scans are being saved to your PhishGuard account.';
  openSiteBtn.textContent = '📊 View My Scan Report';
  openSiteBtn.onclick = () => chrome.tabs.create({ url: `${PHISHGUARD_URL}/link-preview` });
  disconnectBtn.style.display = 'block';
}

function renderDisconnected() {
  statusDisplay.innerHTML = `<div class="status-disconnected">⚠️ Not signed in</div>`;
  infoText.textContent = 'Sign in to PhishGuard so your hover scans are saved and visible in your dashboard.';
  openSiteBtn.textContent = '🔑 Sign in to PhishGuard';
  // Open the login page — the website will send tokens back after login
  openSiteBtn.onclick = () => {
    chrome.tabs.create({ url: `${PHISHGUARD_URL}/login?from=extension` });
  };
  disconnectBtn.style.display = 'none';
}

// Load auth state from storage
chrome.storage.local.get(['userId', 'idToken', 'tokenExpiry', 'userEmail'], (auth) => {
  const valid = auth.userId && auth.idToken && Date.now() < (auth.tokenExpiry || 0);
  if (valid) {
    renderConnected(auth.userEmail);
  } else {
    renderDisconnected();
  }
});

disconnectBtn.addEventListener('click', () => {
  chrome.storage.local.remove(['userId', 'idToken', 'tokenExpiry', 'userEmail'], () => {
    renderDisconnected();
  });
});
