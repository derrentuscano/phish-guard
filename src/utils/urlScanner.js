// ============================================================
// urlScanner.js — VirusTotal + Google Safe Browsing + Heuristics
// ============================================================

const VT_API_KEY  = import.meta.env.VITE_VIRUSTOTAL_API_KEY?.trim();
const GSB_API_KEY = import.meta.env.VITE_GOOGLE_SAFE_BROWSING_API_KEY?.trim();

// ── VirusTotal v3 ──────────────────────────────────────────────
async function scanWithVirusTotal(url) {
  if (!VT_API_KEY) {
    return { error: 'VirusTotal API key not configured', source: 'virustotal' };
  }

  try {
    // Step 1 — Submit the URL for scanning
    const submitRes = await fetch('https://www.virustotal.com/api/v3/urls', {
      method: 'POST',
      headers: {
        'x-apikey': VT_API_KEY,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `url=${encodeURIComponent(url)}`,
    });

    if (!submitRes.ok) {
      const errText = await submitRes.text();
      throw new Error(`Submit failed (${submitRes.status}): ${errText}`);
    }

    const submitData = await submitRes.json();

    // Step 2 — Get the analysis ID and poll for results
    const analysisId = submitData.data?.id;
    if (!analysisId) throw new Error('No analysis ID returned');

    // Wait a moment for analysis to complete
    await new Promise((r) => setTimeout(r, 3000));

    const analysisRes = await fetch(
      `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
      { headers: { 'x-apikey': VT_API_KEY } }
    );

    if (!analysisRes.ok) {
      throw new Error(`Analysis fetch failed (${analysisRes.status})`);
    }

    const analysisData = await analysisRes.json();
    const stats = analysisData.data?.attributes?.stats || {};

    console.log('🔍 VirusTotal Raw Response:', analysisData);
    console.log('🔍 VirusTotal Stats:', stats);

    return {
      source: 'virustotal',
      malicious: stats.malicious || 0,
      suspicious: stats.suspicious || 0,
      harmless: stats.harmless || 0,
      undetected: stats.undetected || 0,
      timeout: stats.timeout || 0,
      totalEngines:
        (stats.malicious || 0) +
        (stats.suspicious || 0) +
        (stats.harmless || 0) +
        (stats.undetected || 0) +
        (stats.timeout || 0),
      status: analysisData.data?.attributes?.status || 'unknown',
    };
  } catch (err) {
    console.error('VirusTotal error:', err);
    return { error: err.message, source: 'virustotal' };
  }
}

// ── Google Safe Browsing v4 ────────────────────────────────────
async function scanWithGoogleSafeBrowsing(url) {
  if (!GSB_API_KEY) {
    return { error: 'Google Safe Browsing API key not configured', source: 'safebrowsing' };
  }

  try {
    const res = await fetch(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${GSB_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client: { clientId: 'phishguard', clientVersion: '1.0.0' },
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

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`GSB request failed (${res.status}): ${errText}`);
    }

    const data = await res.json();
    const matches = data.matches || [];

    console.log('🔍 Google Safe Browsing Raw Response:', data);
    console.log('🔍 GSB Threats Found:', matches.length > 0, matches);

    return {
      source: 'safebrowsing',
      threatsFound: matches.length > 0,
      threats: matches.map((m) => ({
        type: m.threatType,
        platform: m.platformType,
      })),
    };
  } catch (err) {
    console.error('Google Safe Browsing error:', err);
    return { error: err.message, source: 'safebrowsing' };
  }
}

// ── Local heuristic checks ────────────────────────────────────
function runLocalHeuristics(url) {
  const threats = [];

  // HTTP instead of HTTPS
  if (url.toLowerCase().startsWith('http://')) {
    threats.push({
      level: 'warning',
      message: 'Not using HTTPS — data is not encrypted',
      impact: -10,
    });
  }

  // IP address instead of domain
  if (/https?:\/\/\d+\.\d+\.\d+\.\d+/.test(url)) {
    threats.push({
      level: 'high',
      message: 'Uses IP address instead of domain name — highly suspicious',
      impact: -15,
    });
  }

  // Character substitution
  if (/paypa1|g00gle|faceb00k|amaz0n|micr0soft/i.test(url)) {
    threats.push({
      level: 'high',
      message: 'Character substitution detected (0↔O, 1↔l)',
      impact: -15,
    });
  }

  // Suspicious TLDs
  const suspiciousTLDs = ['.tk', '.ml', '.ga', '.cf', '.gq', '.xyz'];
  if (suspiciousTLDs.some((tld) => url.toLowerCase().includes(tld))) {
    threats.push({
      level: 'medium',
      message: 'Suspicious top-level domain often used in phishing',
      impact: -10,
    });
  }

  // Excessive subdomains
  const host = url.replace(/https?:\/\//, '').split('/')[0];
  if (host.split('.').length > 4) {
    threats.push({
      level: 'medium',
      message: 'Excessive subdomains — may hide the real domain',
      impact: -10,
    });
  }

  // @ symbol trick
  if (url.includes('@')) {
    threats.push({
      level: 'high',
      message: '@ symbol in URL — everything before @ is ignored by browsers',
      impact: -15,
    });
  }

  // URL shorteners
  const shorteners = ['bit.ly', 'tinyurl', 'goo.gl', 't.co', 'ow.ly'];
  if (shorteners.some((s) => url.toLowerCase().includes(s))) {
    threats.push({
      level: 'warning',
      message: 'URL shortener detected — destination is hidden',
      impact: -5,
    });
  }

  // Suspicious keywords
  const keywords = ['verify', 'account', 'secure', 'update', 'confirm', 'login', 'banking'];
  const found = keywords.filter((k) => url.toLowerCase().includes(k));
  if (found.length >= 2) {
    threats.push({
      level: 'warning',
      message: `Suspicious keywords found: ${found.join(', ')}`,
      impact: -10,
    });
  }

  return threats;
}

// ── Main scanner ───────────────────────────────────────────────
export async function scanURL(url) {
  // Run all checks in parallel
  const [vtResult, gsbResult] = await Promise.all([
    scanWithVirusTotal(url),
    scanWithGoogleSafeBrowsing(url),
  ]);

  const localThreats = runLocalHeuristics(url);

  // ── Scoring ──────────────────────────────────────────────────
  let score = 100;

  // VirusTotal deductions  (max −60)
  if (!vtResult.error && vtResult.totalEngines > 0) {
    const malRatio = (vtResult.malicious + vtResult.suspicious) / vtResult.totalEngines;
    score -= Math.round(malRatio * 60);
  }

  // Google Safe Browsing deductions (−30 if threats)
  if (!gsbResult.error && gsbResult.threatsFound) {
    score -= 30;
  }

  // Local heuristic deductions
  localThreats.forEach((t) => {
    score += t.impact; // impact is already negative
  });

  score = Math.max(0, Math.min(100, score));

  // ── Verdict ──────────────────────────────────────────────────
  let verdict;
  if (score >= 80) verdict = 'safe';
  else if (score >= 40) verdict = 'suspicious';
  else verdict = 'malicious';

  return {
    url,
    score,
    verdict,
    virustotal: vtResult,
    safebrowsing: gsbResult,
    localThreats,
    scannedAt: new Date().toISOString(),
  };
}
