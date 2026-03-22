import * as exifr from 'exifr';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
function loadImageBitmap(file) {
  return new Promise((res, rej) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); res(img); };
    img.onerror = rej; img.src = url;
  });
}

function fileToBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => {
      // Strip the "data:image/jpeg;base64," prefix
      const base64 = r.result.split(',')[1];
      res(base64);
    };
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

function fileToDataUrl(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

function drawToCanvas(img, w, h) {
  const c = document.createElement('canvas');
  c.width = w || img.naturalWidth;
  c.height = h || img.naturalHeight;
  c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
  return c;
}

// ─────────────────────────────────────────────────────────────
// GEMINI VISION ANALYSIS
// ─────────────────────────────────────────────────────────────
const GEMINI_PROMPT = `You are a professional reverse image search and digital forensics expert. Analyze this image thoroughly and return ONLY valid JSON (no markdown, no extra text) with this exact structure:

{
  "subject": "<brief description of the main subject — person, object, landmark, artwork, etc.>",
  "subjectType": "<one of: person|animal|landmark|artwork|product|screenshot|document|nature|other>",
  "likelyOrigin": "<where this image likely comes from — news media, social media, stock photo, personal photo, AI generated, movie/TV still, advertisement, etc.>",
  "context": "<2-3 sentences giving context about this image — what it shows, notable features, time period if detectable, reason it might be shared>",
  "suggestedSearchTerms": ["<term 1>", "<term 2>", "<term 3>", "<term 4>", "<term 5>"],
  "notableElements": ["<element 1>", "<element 2>", "<element 3>"],
  "manipulationSignals": {
    "score": <0-100, 0=clearly authentic, 100=heavily manipulated/AI>,
    "verdict": "<one of: AUTHENTIC|LIKELY_AUTHENTIC|UNCERTAIN|LIKELY_MANIPULATED|AI_GENERATED>",
    "signals": ["<signal 1 if any>"],
    "isAIGenerated": <true|false>
  },
  "safeSearch": {
    "adult": "<VERY_UNLIKELY|UNLIKELY|POSSIBLE|LIKELY|VERY_LIKELY>",
    "violence": "<VERY_UNLIKELY|UNLIKELY|POSSIBLE|LIKELY|VERY_LIKELY>",
    "spoof": "<VERY_UNLIKELY|UNLIKELY|POSSIBLE|LIKELY|VERY_LIKELY>"
  },
  "dominantColors": ["<color 1>", "<color 2>", "<color 3>"],
  "estimatedYear": "<estimated year range or 'Unknown'>",
  "confidence": <0-100>
}`;

export async function analyzeWithGemini(file) {
  const base64 = await fileToBase64(file);
  const mimeType = file.type || 'image/jpeg';

  const body = {
    contents: [{
      parts: [
        { text: GEMINI_PROMPT },
        { inline_data: { mime_type: mimeType, data: base64 } }
      ]
    }],
    generationConfig: { temperature: 0.1, maxOutputTokens: 1024 }
  };

  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${text.slice(0, 120)}`);
  }

  const data = await res.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

  // Strip markdown fences if Gemini wraps it
  const cleaned = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('Gemini returned unexpected format');

  return JSON.parse(match[0]);
}

// ─────────────────────────────────────────────────────────────
// METADATA EXTRACTION
// ─────────────────────────────────────────────────────────────
export async function extractMetadata(file) {
  try {
    const exif = await exifr.parse(file, {
      tiff: true, exif: true, gps: true, xmp: true, iptc: true, icc: false
    });
    if (!exif) return { hasExif: false };

    return {
      hasExif: true,
      camera: exif.Make && exif.Model ? `${exif.Make} ${exif.Model}` : (exif.Model || exif.Make || null),
      software: exif.Software || exif.CreatorTool || null,
      dateTaken: exif.DateTimeOriginal || exif.CreateDate || null,
      gps: exif.latitude && exif.longitude
        ? { lat: exif.latitude.toFixed(5), lng: exif.longitude.toFixed(5) }
        : null,
      iso: exif.ISO || null,
      focalLength: exif.FocalLength ? `${exif.FocalLength}mm` : null,
      exposureTime: exif.ExposureTime ? `1/${Math.round(1 / exif.ExposureTime)}s` : null,
      fNumber: exif.FNumber ? `f/${exif.FNumber}` : null,
      colorSpace: exif.ColorSpace || null,
      orientation: exif.Orientation || null,
      raw: exif,
    };
  } catch {
    return { hasExif: false };
  }
}

// ─────────────────────────────────────────────────────────────
// LIGHTWEIGHT ELA (manipulation signal)
// ─────────────────────────────────────────────────────────────
export async function runELA(file, img) {
  try {
    const W = Math.min(img.naturalWidth, 600), H = Math.min(img.naturalHeight, 600);
    const origPx = drawToCanvas(img, W, H).getContext('2d').getImageData(0, 0, W, H).data;
    const tmpC = drawToCanvas(img, W, H);
    const reUrl = tmpC.toDataURL('image/jpeg', 0.75);
    const reImg = new Image();
    await new Promise(res => { reImg.onload = res; reImg.src = reUrl; });
    const rePx = drawToCanvas(reImg, W, H).getContext('2d').getImageData(0, 0, W, H).data;

    const diffs = [];
    for (let i = 0; i < origPx.length; i += 4) {
      diffs.push((Math.abs(origPx[i] - rePx[i]) + Math.abs(origPx[i+1] - rePx[i+1]) + Math.abs(origPx[i+2] - rePx[i+2])) / 3);
    }

    const mean = diffs.reduce((a, b) => a + b, 0) / diffs.length;
    const std = Math.sqrt(diffs.reduce((a, b) => a + (b - mean) ** 2, 0) / diffs.length);

    let elaScore = 0;
    let elaSignal = 'Natural compression variance detected';
    if (std < 6) { elaScore = 30; elaSignal = 'Unnaturally uniform compression — AI/generated image signal'; }
    else if (std < 12) { elaScore = 15; elaSignal = 'Slightly uniform compression patterns detected'; }
    else { elaScore = 0; elaSignal = 'Natural compression variance — consistent with real photograph'; }
    if (mean < 2.5) { elaScore += 15; }

    return { elaScore, elaSignal, mean: mean.toFixed(2), std: std.toFixed(2) };
  } catch {
    return { elaScore: 0, elaSignal: 'ELA skipped (non-JPEG or unsupported format)', mean: 0, std: 0 };
  }
}

// ─────────────────────────────────────────────────────────────
// COLOR ANALYSIS (manipulation signal)
// ─────────────────────────────────────────────────────────────
export async function runColorAnalysis(img) {
  try {
    const W = Math.min(img.naturalWidth, 300), H = Math.min(img.naturalHeight, 300);
    const px = drawToCanvas(img, W, H).getContext('2d').getImageData(0, 0, W, H).data;

    const hR = new Array(256).fill(0), hG = new Array(256).fill(0), hB = new Array(256).fill(0);
    for (let i = 0; i < px.length; i += 4) { hR[px[i]]++; hG[px[i+1]]++; hB[px[i+2]]++; }

    const smoothness = h => {
      let d = 0;
      for (let i = 1; i < 256; i++) d += Math.abs(h[i] - h[i-1]);
      return d / (W * H);
    };
    const avg = (smoothness(hR) + smoothness(hG) + smoothness(hB)) / 3;

    let colorScore = 0;
    let colorSignal = 'Natural color histogram — real photo signal';
    if (avg < 0.04) { colorScore = 20; colorSignal = 'Unnaturally smooth color gradients — AI generation signal'; }
    else if (avg < 0.10) { colorScore = 10; colorSignal = 'Slightly over-smooth color distribution'; }
    else { colorScore = 0; }

    return { colorScore, colorSignal, smoothness: avg.toFixed(4) };
  } catch {
    return { colorScore: 0, colorSignal: 'Color analysis failed', smoothness: 0 };
  }
}

// ─────────────────────────────────────────────────────────────
// GENERATE QUICK SEARCH LINKS
// ─────────────────────────────────────────────────────────────
export function buildSearchLinks(dataUrl, terms = []) {
  const encoded = encodeURIComponent(terms.slice(0, 3).join(' '));
  return [
    {
      name: 'Google Lens',
      url: 'https://lens.google.com/upload',
      hint: 'Open Google Lens and upload the image manually',
      icon: 'google',
      action: 'upload',
    },
    {
      name: 'TinEye',
      url: 'https://tineye.com/',
      hint: 'Upload to TinEye for exact match search',
      icon: 'tineye',
      action: 'upload',
    },
    {
      name: 'Yandex Images',
      url: 'https://yandex.com/images/',
      hint: 'Yandex reverse image search — excellent for face search',
      icon: 'yandex',
      action: 'upload',
    },
    {
      name: 'Google Search',
      url: `https://www.google.com/search?q=${encoded}`,
      hint: `Search: "${terms.slice(0, 2).join(' ')}"`,
      icon: 'search',
      action: 'search',
    },
  ];
}

// ─────────────────────────────────────────────────────────────
// MAIN ENTRY
// ─────────────────────────────────────────────────────────────
export async function runReverseImageSearch(file, onProgress) {
  const emit = (step, label) => onProgress?.({ step, label });

  emit(0, 'Loading image…');
  const img = await loadImageBitmap(file);
  const dataUrl = await fileToDataUrl(file);

  emit(1, 'Sending to Gemini Vision AI…');
  let gemini = null;
  let geminiError = null;
  try {
    gemini = await analyzeWithGemini(file);
  } catch (e) {
    geminiError = e.message;
    console.error('Gemini failed:', e);
  }

  emit(2, 'Extracting image metadata…');
  const meta = await extractMetadata(file);

  emit(3, 'Running Error Level Analysis…');
  const ela = await runELA(file, img);

  emit(4, 'Analysing color distribution…');
  const color = await runColorAnalysis(img);

  emit(5, 'Computing authenticity score…');

  // Combine scores
  const localManipScore = ela.elaScore + color.colorScore;
  const geminiManipScore = gemini?.manipulationSignals?.score ?? 50;
  // Weight: gemini 60%, local 40%
  const combinedManipScore = geminiError
    ? Math.min(100, localManipScore * 2)
    : Math.min(100, Math.round(geminiManipScore * 0.6 + localManipScore * 0.4 * 2.5));

  const searchLinks = buildSearchLinks(dataUrl, gemini?.suggestedSearchTerms || []);

  emit(6, 'Done!');

  return {
    file: { name: file.name, size: file.size, type: file.type },
    image: { width: img.naturalWidth, height: img.naturalHeight },
    scannedAt: new Date().toISOString(),
    dataUrl,
    gemini,
    geminiError,
    meta,
    ela,
    color,
    combinedManipScore,
    searchLinks,
  };
}
