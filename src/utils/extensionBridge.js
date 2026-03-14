// ============================================================
// extensionBridge.js — with full debug logging
// ============================================================

const EXTENSION_ID = 'kncilihcppcfldgjjhkmgdhijojebdgc';

export async function sendAuthToExtension(user) {
  console.log('[Bridge] sendAuthToExtension called, user:', user?.email);

  // Check 1: is chrome available?
  if (!window.chrome) {
    console.warn('[Bridge] ❌ window.chrome is not available');
    return false;
  }

  // Check 2: is runtime.sendMessage available?
  if (!window.chrome.runtime?.sendMessage) {
    console.warn('[Bridge] ❌ chrome.runtime.sendMessage is not available — extension not installed?');
    return false;
  }

  if (!EXTENSION_ID) {
    console.warn('[Bridge] ❌ EXTENSION_ID is not set');
    return false;
  }

  if (!user) {
    console.warn('[Bridge] ❌ user is null');
    return false;
  }

  try {
    console.log('[Bridge] Getting ID token...');
    const idToken = await user.getIdToken(false);
    console.log('[Bridge] ✅ Got ID token, length:', idToken.length);

    const payload = {
      type: 'SAVE_AUTH',
      userId: user.uid,
      userEmail: user.email,
      idToken,
      tokenExpiry: Date.now() + 55 * 60 * 1000,
    };

    console.log('[Bridge] Sending message to extension ID:', EXTENSION_ID);

    return await new Promise((resolve) => {
      window.chrome.runtime.sendMessage(EXTENSION_ID, payload, (response) => {
        const err = window.chrome.runtime.lastError;
        if (err) {
          console.error('[Bridge] ❌ sendMessage error:', err.message);
          console.error('[Bridge] Possible causes:');
          console.error('  1. Extension ID is wrong');
          console.error('  2. externally_connectable in manifest.json does not include this origin:', window.location.origin);
          console.error('  3. Extension is not loaded in Chrome');
          resolve(false);
        } else {
          console.log('[Bridge] ✅ Extension responded:', response);
          resolve(true);
        }
      });
    });
  } catch (err) {
    console.error('[Bridge] ❌ Exception:', err);
    return false;
  }
}

export async function clearExtensionAuth() {
  if (!window.chrome?.runtime?.sendMessage || !EXTENSION_ID) return;
  try {
    window.chrome.runtime.sendMessage(EXTENSION_ID, { type: 'CLEAR_AUTH' }, (response) => {
      const err = window.chrome.runtime.lastError;
      if (err) console.warn('[Bridge] clearAuth error:', err.message);
      else console.log('[Bridge] Auth cleared from extension');
    });
  } catch (err) {
    console.warn('[Bridge] clearAuth exception:', err);
  }
}
