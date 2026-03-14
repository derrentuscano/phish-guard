// ============================================================
// background.js — PhishGuard Extension Service Worker
// Calls Google Safe Browsing API + saves results to Firestore
// ============================================================

const GSB_API_KEY  = 'AIzaSyDuGWhyde55yiu7EJM7eUOR22lVUAPNyYI';
const FIREBASE_API_KEY = 'AIzaSyC8WXo-4AwPrdjX6OmSuZr-I2Edx57ICOM';
const FIREBASE_PROJECT  = 'phish-guard-316c9';

// In-memory cache to avoid redundant API calls
const cache = {};

// ── Google Safe Browsing check ───────────────────────────────
async function checkWithGSB(url) {
  if (cache[url]) return cache[url];

  try {
    const res = await fetch(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${GSB_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client: { clientId: 'phishguard-extension', clientVersion: '1.0.0' },
          threatInfo: {
            threatTypes: [
              'MALWARE',
              'SOCIAL_ENGINEERING',
              'UNWANTED_SOFTWARE',
              'POTENTIALLY_HARMFUL_APPLICATION',
            ],
            platformTypes: ['ANY_PLATFORM'],
            threatEntryTypes: ['URL'],
            threatEntries: [{ url }],
          },
        }),
      }
    );

    if (!res.ok) throw new Error(`GSB ${res.status}`);
    const data = await res.json();
    const threats = (data.matches || []).map((m) => m.threatType);
    const result = {
      safe: threats.length === 0,
      threats,
      checkedAt: new Date().toISOString(),
      url,
    };
    cache[url] = result;
    return result;
  } catch (err) {
    console.error('[PhishGuard] GSB error:', err);
    return { safe: null, error: err.message, url };
  }
}

// ── Save scan result to Firestore ───────────────────────────
async function saveToFirestore(userId, idToken, scanData) {
  try {
    const endpoint = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT}/databases/(default)/documents/users/${userId}/extensionScans`;
    await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        fields: {
          url:       { stringValue: scanData.url },
          safe:      { booleanValue: scanData.safe === true },
          threats:   { arrayValue: { values: (scanData.threats || []).map(t => ({ stringValue: t })) } },
          checkedAt: { stringValue: scanData.checkedAt || new Date().toISOString() },
          pageTitle: { stringValue: scanData.pageTitle || '' },
          pageHost:  { stringValue: new URL(scanData.url).hostname },
        },
      }),
    });
  } catch (err) {
    console.error('[PhishGuard] Firestore write error:', err);
  }
}

// ── Get stored Firebase auth from extension storage ─────────
async function getAuthData() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['userId', 'idToken', 'tokenExpiry'], (result) => {
      resolve(result);
    });
  });
}

// ── External messages from the PhishGuard WEBSITE ────────────
// NOTE: chrome.runtime.onMessage only handles messages from within
// the extension (content scripts, popup). Messages sent from a
// web page via chrome.runtime.sendMessage(EXTENSION_ID, ...) MUST
// use onMessageExternal — they are completely separate listeners.
chrome.runtime.onMessageExternal.addListener((msg, sender, sendResponse) => {
  console.log('[BG] External message received:', msg.type, 'from:', sender.origin);

  if (msg.type === 'SAVE_AUTH') {
    console.log('[BG] ✅ SAVE_AUTH from website! user:', msg.userEmail, 'expires in:', Math.round((msg.tokenExpiry - Date.now()) / 60000), 'min');
    chrome.storage.local.set({
      userId: msg.userId,
      idToken: msg.idToken,
      tokenExpiry: msg.tokenExpiry,
      userEmail: msg.userEmail,
    }, () => {
      console.log('[BG] Auth saved to chrome.storage ✓');
      sendResponse({ ok: true });
    });
    return true;
  }

  if (msg.type === 'GET_AUTH') {
    getAuthData().then((data) => {
      console.log('[BG] GET_AUTH (external) → userId:', data.userId);
      sendResponse(data);
    });
    return true;
  }

  if (msg.type === 'CLEAR_AUTH') {
    console.log('[BG] CLEAR_AUTH (external) — removing credentials');
    chrome.storage.local.remove(['userId', 'idToken', 'tokenExpiry', 'userEmail'], () => {
      sendResponse({ ok: true });
    });
    return true;
  }
});

// ── Message handler from content.js ─────────────────────────
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log('[BG] Message received:', msg.type, 'from:', sender.origin || sender.url || 'internal');

  if (msg.type === 'CHECK_URL') {
    const { url, pageTitle } = msg;
    console.log('[BG] Checking URL:', url);

    checkWithGSB(url).then(async (result) => {
      console.log('[BG] GSB result:', result.safe ? '✅ Safe' : '🚫 Dangerous');
      sendResponse(result);

      const auth = await getAuthData();
      if (auth.userId && auth.idToken && Date.now() < (auth.tokenExpiry || 0)) {
        console.log('[BG] Saving scan to Firestore for user:', auth.userId);
        await saveToFirestore(auth.userId, auth.idToken, { ...result, pageTitle });
      } else {
        console.log('[BG] Not saving — user not authenticated. userId:', auth.userId, 'tokenValid:', Date.now() < (auth.tokenExpiry || 0));
      }

      const tabId = sender.tab?.id;
      if (tabId != null && result.safe === false) {
        chrome.action.setBadgeText({ text: '!', tabId });
        chrome.action.setBadgeBackgroundColor({ color: '#ef4444', tabId });
      }
    });

    return true;
  }

  if (msg.type === 'SAVE_AUTH') {
    console.log('[BG] ✅ SAVE_AUTH received! user:', msg.userEmail, 'expires in:', Math.round((msg.tokenExpiry - Date.now()) / 60000), 'min');
    chrome.storage.local.set({
      userId: msg.userId,
      idToken: msg.idToken,
      tokenExpiry: msg.tokenExpiry,
      userEmail: msg.userEmail,
    }, () => {
      console.log('[BG] Auth saved to chrome.storage ✓');
      sendResponse({ ok: true });
    });
    return true;
  }

  if (msg.type === 'GET_AUTH') {
    getAuthData().then((data) => {
      console.log('[BG] GET_AUTH → userId:', data.userId, 'valid until:', data.tokenExpiry ? new Date(data.tokenExpiry).toLocaleTimeString() : 'N/A');
      sendResponse(data);
    });
    return true;
  }

  if (msg.type === 'CLEAR_AUTH') {
    console.log('[BG] CLEAR_AUTH — removing stored credentials');
    chrome.storage.local.remove(['userId', 'idToken', 'tokenExpiry', 'userEmail'], () => {
      sendResponse({ ok: true });
    });
    return true;
  }
});

