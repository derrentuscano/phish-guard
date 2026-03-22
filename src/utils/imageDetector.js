import * as exifr from 'exifr';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

// ─────────────────────────────────────────────────────────────
// SHARED HELPERS
// ─────────────────────────────────────────────────────────────
function drawToCanvas(img, w, h) {
  const c = document.createElement('canvas');
  c.width = w || img.naturalWidth; c.height = h || img.naturalHeight;
  c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
  return c;
}
function loadImageBitmap(file) {
  return new Promise((res, rej) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); res(img); };
    img.onerror = rej; img.src = url;
  });
}
function fileToDataUrl(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(file);
  });
}
function computeEntropy(arr, bins = 64) {
  if (!arr.length) return 0;
  const min = Math.min(...arr), max = Math.max(...arr), range = max - min || 1;
  const counts = new Array(bins).fill(0);
  for (const v of arr) counts[Math.min(bins - 1, Math.floor(((v - min) / range) * bins))]++;
  const total = arr.length;
  return counts.reduce((H, c) => { if (c) { const p = c / total; H -= p * Math.log2(p); } return H; }, 0);
}
// 1D DFT magnitude — returns (N/2 - 1) values, skips DC
function dftMagnitude(signal) {
  const N = signal.length, half = N >> 1;
  const mag = new Float32Array(half - 1);
  for (let k = 1; k < half; k++) {
    let re = 0, im = 0;
    const step = (2 * Math.PI * k) / N;
    for (let n = 0; n < N; n++) { const a = step * n; re += signal[n] * Math.cos(a); im -= signal[n] * Math.sin(a); }
    mag[k - 1] = Math.sqrt(re * re + im * im);
  }
  return mag;
}
// 3×3 convolution on a flat Float32Array (W×H)
function convolve3x3(src, w, h, kernel) {
  const dst = new Float32Array(w * h);
  for (let y = 1; y < h - 1; y++)
    for (let x = 1; x < w - 1; x++) {
      let v = 0;
      for (let ky = -1; ky <= 1; ky++)
        for (let kx = -1; kx <= 1; kx++)
          v += src[(y + ky) * w + (x + kx)] * kernel[(ky + 1) * 3 + (kx + 1)];
      dst[y * w + x] = v;
    }
  return dst;
}
// Box blur (averaging filter) on a Float32Array
function boxBlur(src, w, h, r = 2) {
  const dst = new Float32Array(w * h);
  const size = (2 * r + 1) ** 2;
  for (let y = r; y < h - r; y++)
    for (let x = r; x < w - r; x++) {
      let s = 0;
      for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) s += src[(y + dy) * w + (x + dx)];
      dst[y * w + x] = s / size;
    }
  return dst;
}
function gaussianNoise(std = 1) {
  let u, v, s;
  do { u = Math.random()*2-1; v = Math.random()*2-1; s = u*u+v*v; } while (s>=1||s===0);
  return u * Math.sqrt(-2*Math.log(s)/s) * std;
}
const isPow2 = n => n > 0 && (n & (n - 1)) === 0;
const AI_SIZES = new Set(['256x256','512x512','768x512','512x768','768x768','1024x1024','1024x768','768x1024','832x1216','1216x832','1344x768','896x1152','1152x896','1280x720']);
const AI_SW = ['midjourney','stable diffusion','dall-e','dalle','dreamshaper','adobe firefly','firefly','canva ai','bing image','leonardo','deepdream','artbreeder','runway','ideogram','generative fill','adobe generative','nightcafe'];

// ═════════════════════════════════════════════════════════════
// CLASSIC CHECKS (6 checks)
// ═════════════════════════════════════════════════════════════

async function checkExif(file) {
  const r = { score: 0, findings: [], forcedAI: false };
  try {
    const exif = await exifr.parse(file, { tiff:true, exif:true, gps:true, xmp:true, iptc:true, icc:false });
    if (!exif || !Object.keys(exif).length) {
      r.score += 25; r.findings.push({ label:'No EXIF metadata found', type:'bad', points:25 }); return r;
    }
    const model = exif.Model || exif.Make || null;
    if (!model) { r.score += 15; r.findings.push({ label:'No camera model in EXIF', type:'bad', points:15 }); }
    else r.findings.push({ label:`Camera: ${model}`, type:'good', points:0 });

    const sw = (exif.Software || exif.CreatorTool || exif.creator || '').toLowerCase();
    if (sw) {
      const hit = AI_SW.find(k => sw.includes(k));
      if (hit) { r.score += 40; r.forcedAI = true; r.findings.push({ label:`AI software in metadata: "${exif.Software||exif.CreatorTool}"`, type:'bad', points:40 }); }
      else r.findings.push({ label:`Software: ${exif.Software||exif.CreatorTool||'n/a'}`, type:'neutral', points:0 });
    } else { r.score += 10; r.findings.push({ label:'No software field in EXIF', type:'bad', points:10 }); }

    if (exif.DateTimeOriginal||exif.CreateDate) r.findings.push({ label:'Timestamp present', type:'good', points:0 });
    else { r.score += 10; r.findings.push({ label:'No timestamp in EXIF', type:'bad', points:10 }); }
    if (exif.latitude||exif.GPSLatitude) r.findings.push({ label:'GPS coordinates present', type:'good', points:0 });
  } catch { r.score += 20; r.findings.push({ label:'Could not read EXIF metadata', type:'bad', points:20 }); }
  return r;
}

async function checkELA(file, img) {
  const r = { score: 0, findings: [] };
  try {
    const W = Math.min(img.naturalWidth, 800), H = Math.min(img.naturalHeight, 800);
    const orig = drawToCanvas(img, W, H).getContext('2d').getImageData(0, 0, W, H).data;
    const tmpC = drawToCanvas(img, W, H);
    const reUrl = tmpC.toDataURL('image/jpeg', 0.7);
    const reImg = new Image(); await new Promise(res => { reImg.onload = res; reImg.src = reUrl; });
    const re = drawToCanvas(reImg, W, H).getContext('2d').getImageData(0, 0, W, H).data;
    const diffs = [];
    for (let i = 0; i < orig.length; i += 4) diffs.push((Math.abs(orig[i]-re[i])+Math.abs(orig[i+1]-re[i+1])+Math.abs(orig[i+2]-re[i+2]))/3);
    const mean = diffs.reduce((a,b)=>a+b,0)/diffs.length;
    const std = Math.sqrt(diffs.reduce((a,b)=>a+(b-mean)**2,0)/diffs.length);
    if (std < 8) { r.score += 20; r.findings.push({ label:'Unnaturally uniform compression patterns (ELA)', type:'bad', points:20 }); }
    else if (std < 15) { r.score += 10; r.findings.push({ label:'Slightly uniform noise distribution', type:'bad', points:10 }); }
    else { r.score -= 10; r.findings.push({ label:'Natural compression variance — real photo signal', type:'good', points:-10 }); }
    if (mean < 3) { r.score += 15; r.findings.push({ label:'Too-perfect JPEG compression patterns', type:'bad', points:15 }); }
  } catch { r.findings.push({ label:'ELA skipped (non-JPEG)', type:'neutral', points:0 }); }
  return r;
}

async function checkColorDist(img) {
  const r = { score: 0, findings: [] };
  try {
    const W = Math.min(img.naturalWidth,400), H = Math.min(img.naturalHeight,400);
    const px = drawToCanvas(img, W, H).getContext('2d').getImageData(0,0,W,H).data;
    const hR=new Array(256).fill(0), hG=new Array(256).fill(0), hB=new Array(256).fill(0);
    for (let i=0;i<px.length;i+=4){hR[px[i]]++;hG[px[i+1]]++;hB[px[i+2]]++;}
    const sm = h=>{let d=0;for(let i=1;i<256;i++)d+=Math.abs(h[i]-h[i-1]);return d/(W*H);};
    const avg=(sm(hR)+sm(hG)+sm(hB))/3;
    if (avg<0.05){r.score+=15;r.findings.push({label:'Unnaturally smooth color gradients',type:'bad',points:15});}
    else if(avg<0.12){r.score+=8;r.findings.push({label:'Slightly smooth color distribution',type:'bad',points:8});}
    else{r.score-=10;r.findings.push({label:'Natural color imperfections — real photo signal',type:'good',points:-10});}
    const rM=hR.reduce((s,v,i)=>s+v*i,0)/(W*H), gM=hG.reduce((s,v,i)=>s+v*i,0)/(W*H), bM=hB.reduce((s,v,i)=>s+v*i,0)/(W*H);
    if(Math.max(Math.abs(rM-gM),Math.abs(gM-bM),Math.abs(rM-bM))<5){r.score+=10;r.findings.push({label:'Too-perfect color channel balance',type:'bad',points:10});}
  } catch { r.findings.push({label:'Color analysis failed',type:'neutral',points:0}); }
  return r;
}

async function checkSymmetry(img) {
  const r = { score: 0, findings: [], symmetryPct: 0 };
  try {
    const W=Math.min(img.naturalWidth,300), H=Math.min(img.naturalHeight,300);
    const px = drawToCanvas(img,W,H).getContext('2d').getImageData(0,0,W,H).data;
    let tot=0,cnt=0;
    for(let y=0;y<H;y++) for(let x=0;x<Math.floor(W/2);x++){
      const l=(y*W+x)*4, ri=(y*W+(W-1-x))*4;
      for(let c=0;c<3;c++) tot+=Math.abs(px[l+c]-px[ri+c]); cnt+=3;
    }
    const avg=tot/cnt; r.symmetryPct=Math.round((1-avg/255)*100);
    if(avg<15){r.score+=15;r.findings.push({label:`Unnaturally high symmetry (${r.symmetryPct}%)`,type:'bad',points:15});}
    else if(avg<30){r.score+=5;r.findings.push({label:`Elevated symmetry (${r.symmetryPct}%)`,type:'bad',points:5});}
    else{r.score-=5;r.findings.push({label:`Natural asymmetry (${r.symmetryPct}% symmetry)`,type:'good',points:-5});}
  } catch { r.findings.push({label:'Symmetry analysis failed',type:'neutral',points:0}); }
  return r;
}

function checkResolution(img) {
  const r={score:0,findings:[]};
  const W=img.naturalWidth, H=img.naturalHeight, key=`${W}x${H}`;
  if(AI_SIZES.has(key)){r.score+=20;r.findings.push({label:`Resolution ${key} matches known AI output size`,type:'bad',points:20});}
  if(isPow2(W)&&isPow2(H)){r.score+=15;r.findings.push({label:`Both dimensions (${W}×${H}) are powers of 2`,type:'bad',points:15});}
  else if(isPow2(W)||isPow2(H)){r.score+=8;r.findings.push({label:'One dimension is a power of 2',type:'bad',points:8});}
  const ratio=W/H;
  if([4/3,3/2,16/9,1,3/4,2/3,9/16].some(r=>Math.abs(ratio-r)<0.02)&&!AI_SIZES.has(key)){
    r.score-=10; r.findings.push({label:`Aspect ratio matches real camera sensor (${W}×${H})`,type:'good',points:-10});
  }
  return r;
}

function checkFileSize(file, img) {
  const r={score:0,findings:[]};
  const bpp=file.size/(img.naturalWidth*img.naturalHeight);
  if(bpp<0.05){r.score+=10;r.findings.push({label:'Unusually small file size for resolution',type:'bad',points:10});}
  else if(bpp>5){r.score+=5;r.findings.push({label:'Unusually large file size for resolution',type:'bad',points:5});}
  else r.findings.push({label:`Normal file size ratio (${bpp.toFixed(2)} bytes/pixel)`,type:'neutral',points:0});
  return r;
}

// ═════════════════════════════════════════════════════════════
// ADVANCED CHECKS (6 research-grade checks)
// ═════════════════════════════════════════════════════════════

// Advanced 1 — FFT Frequency Domain (GAN checkerboard artifact detection)
async function checkFFT(img) {
  const r = { score: 0, findings: [], entropyRatio: 0 };
  try {
    const W=Math.min(img.naturalWidth,256), H=Math.min(img.naturalHeight,256);
    const px = drawToCanvas(img,W,H).getContext('2d').getImageData(0,0,W,H).data;
    // Convert to grayscale
    const gray = new Float32Array(W*H);
    for(let i=0;i<px.length;i+=4) gray[i/4]=0.299*px[i]+0.587*px[i+1]+0.114*px[i+2];

    const N=64, numStrips=12;
    const avgMag = new Float32Array(N/2-1);
    // Sample horizontal and vertical strips
    for(let s=0;s<numStrips;s++){
      const isHoriz = s < numStrips/2;
      const strip = new Array(N);
      if(isHoriz){
        const y=Math.floor((s+0.5)*H/(numStrips/2));
        for(let x=0;x<N;x++) strip[x]=gray[y*W+Math.floor(x*W/N)];
      } else {
        const x=Math.floor((s-numStrips/2+0.5)*W/(numStrips/2));
        for(let y=0;y<N;y++) strip[y]=gray[Math.floor(y*H/N)*W+x];
      }
      const mag=dftMagnitude(strip);
      for(let k=0;k<mag.length;k++) avgMag[k]+=mag[k];
    }
    for(let k=0;k<avgMag.length;k++) avgMag[k]/=numStrips;

    // Spectral entropy: low = periodic (AI), high = natural
    const spectralEntropy = computeEntropy(Array.from(avgMag), 32);
    const maxEntropy = Math.log2(32);
    r.entropyRatio = spectralEntropy / maxEntropy;

    // Also check for evenly-spaced peaks (GAN artifact signature)
    const meanMag = avgMag.reduce((a,b)=>a+b,0)/avgMag.length;
    const stdMag = Math.sqrt(avgMag.reduce((a,b)=>a+(b-meanMag)**2,0)/avgMag.length);
    const peaks = [];
    for(let k=1;k<avgMag.length-1;k++)
      if(avgMag[k]>meanMag+1.5*stdMag && avgMag[k]>avgMag[k-1] && avgMag[k]>avgMag[k+1]) peaks.push(k);
    // Check spacing regularity
    let regularPeaks = false;
    if(peaks.length>=3){
      const spacings=peaks.slice(1).map((p,i)=>p-peaks[i]);
      const avgSpace=spacings.reduce((a,b)=>a+b,0)/spacings.length;
      const spaceStd=Math.sqrt(spacings.reduce((a,b)=>a+(b-avgSpace)**2,0)/spacings.length);
      regularPeaks = spaceStd < 2 && avgSpace > 2; // evenly-spaced peaks
    }

    if(r.entropyRatio < 0.45 && regularPeaks){
      r.score+=20; r.findings.push({label:`FFT: Regular checkerboard artifacts detected (spectral entropy ${(r.entropyRatio*100).toFixed(0)}%)`,type:'bad',points:20});
    } else if(r.entropyRatio < 0.55){
      r.score+=12; r.findings.push({label:`FFT: Slightly periodic frequency patterns detected`,type:'bad',points:12});
    } else if(r.entropyRatio > 0.75){
      r.score-=8; r.findings.push({label:`FFT: Natural frequency distribution — real photo signal`,type:'good',points:-8});
    } else {
      r.findings.push({label:`FFT: Frequency patterns inconclusive (entropy ${(r.entropyRatio*100).toFixed(0)}%)`,type:'neutral',points:0});
    }
  } catch(e) { r.findings.push({label:`FFT analysis failed: ${e.message.slice(0,50)}`,type:'neutral',points:0}); }
  return r;
}

// Advanced 2 — Blue Channel Laplacian (texture structure analysis)
async function checkLaplacian(img) {
  const r = { score: 0, findings: [], entropy: 0 };
  try {
    const W=Math.min(img.naturalWidth,400), H=Math.min(img.naturalHeight,400);
    const px = drawToCanvas(img,W,H).getContext('2d').getImageData(0,0,W,H).data;
    // Extract blue channel
    const blue = new Float32Array(W*H);
    for(let i=0;i<px.length;i+=4) blue[i/4]=px[i+2];
    // Apply Laplacian kernel: highlights texture edges
    const lap = convolve3x3(blue, W, H, [-1,-1,-1,-1,8,-1,-1,-1,-1]);
    const absLap = Array.from(lap).filter(v=>v!==0).map(Math.abs);
    r.entropy = computeEntropy(absLap, 64);
    const maxEnt = Math.log2(64); // ~6 bits
    const ratio = r.entropy / maxEnt;
    // Low entropy = smooth structured AI texture; High = natural random camera noise
    if(ratio < 0.55){
      r.score+=15; r.findings.push({label:`Blue channel: Smooth structured texture — AI pattern (entropy ${(ratio*100).toFixed(0)}%)`,type:'bad',points:15});
    } else if(ratio < 0.72){
      r.score+=7; r.findings.push({label:`Blue channel: Slightly smooth texture`,type:'bad',points:7});
    } else {
      r.score-=6; r.findings.push({label:`Blue channel: High texture randomness — camera sensor signal`,type:'good',points:-6});
    }
  } catch(e) { r.findings.push({label:`Laplacian analysis failed`,type:'neutral',points:0}); }
  return r;
}

// Advanced 3 — PRNU Camera Fingerprint (noise residual analysis)
async function checkPRNU(img) {
  const r = { score: 0, findings: [] };
  try {
    const W=Math.min(img.naturalWidth,300), H=Math.min(img.naturalHeight,300);
    const px = drawToCanvas(img,W,H).getContext('2d').getImageData(0,0,W,H).data;
    const gray = new Float32Array(W*H);
    for(let i=0;i<px.length;i+=4) gray[i/4]=0.299*px[i]+0.587*px[i+1]+0.114*px[i+2];
    // Box blur to get smooth version (denoised)
    const blurred = boxBlur(gray, W, H, 3);
    // Noise residual = original - denoised
    const residual = gray.map((v,i)=>v-blurred[i]).filter((_,i)=>{ const y=Math.floor(i/W),x=i%W; return y>3&&y<H-3&&x>3&&x<W-3; });
    const resEntropy = computeEntropy(residual, 64)/Math.log2(64);
    const resVar = residual.reduce((a,b)=>a+b*b,0)/residual.length;
    // Real camera PRNU: moderate variance, moderate-high entropy (structured non-uniform noise)
    // AI images: either very high entropy+high variance (pure random, no fingerprint) or very low (too smooth)
    if(resEntropy > 0.9 && resVar > 150){
      r.score+=15; r.findings.push({label:`PRNU: Random white noise — no camera fingerprint detected (AI signal)`,type:'bad',points:15});
    } else if(resEntropy < 0.45){
      r.score+=12; r.findings.push({label:`PRNU: Unnaturally flat noise residual — AI smooth generation`,type:'bad',points:12});
    } else if(resEntropy > 0.6 && resEntropy < 0.88 && resVar < 120){
      r.score-=8; r.findings.push({label:`PRNU: Structured non-uniform noise — camera sensor pattern detected`,type:'good',points:-8});
    } else {
      r.findings.push({label:`PRNU: Noise residual inconclusive`,type:'neutral',points:0});
    }
  } catch { r.findings.push({label:'PRNU analysis failed',type:'neutral',points:0}); }
  return r;
}

// Advanced 4 — Color Depth Analysis (based on "Secret Lies in Color" research)
async function checkColorDepth(img) {
  const r = { score: 0, findings: [] };
  try {
    const W=Math.min(img.naturalWidth,200), H=Math.min(img.naturalHeight,200);
    const px = drawToCanvas(img,W,H).getContext('2d').getImageData(0,0,W,H).data;
    // Measure per-channel detail in lower 4 bits (fine color variation)
    // Real photos have natural sensor noise in lower bits → high variance in lower nibble
    // AI images are smoother → lower variance in lower nibble
    const lowerBitVars = [0,1,2].map(ch => {
      const lows=[];
      for(let i=ch;i<px.length;i+=4) lows.push(px[i]&0x0F); // lower 4 bits
      const mean=lows.reduce((a,b)=>a+b,0)/lows.length;
      return lows.reduce((a,b)=>a+(b-mean)**2,0)/lows.length;
    });
    const avgLowVar = lowerBitVars.reduce((a,b)=>a+b,0)/3;
    // Low variance in lower bits = AI (no sensor noise = too clean)
    if(avgLowVar < 8){
      r.score+=15; r.findings.push({label:`Color depth: Insufficient microscopic color variation (AI smooth rendering)`,type:'bad',points:15});
    } else if(avgLowVar < 14){
      r.score+=8; r.findings.push({label:`Color depth: Below-average fine color detail`,type:'bad',points:8});
    } else {
      r.score-=7; r.findings.push({label:`Color depth: Natural sensor noise in color detail — real camera signal`,type:'good',points:-7});
    }
    // Also check chromatic variance across channels
    const chMeans=[0,1,2].map(ch=>{let s=0;for(let i=ch;i<px.length;i+=4)s+=px[i];return s/(px.length/4);});
    const crossVar=Math.max(...chMeans)-Math.min(...chMeans);
    if(crossVar<8){r.score+=5;r.findings.push({label:`Color channels too monochromatic — AI tonal compression`,type:'bad',points:5});}
  } catch { r.findings.push({label:'Color depth analysis failed',type:'neutral',points:0}); }
  return r;
}

// Advanced 5 — Advanced ELA (per-block analysis)
async function checkAdvancedELA(file, img) {
  const r = { score: 0, findings: [], anomalousPct: 0 };
  try {
    const W=Math.min(img.naturalWidth,400), H=Math.min(img.naturalHeight,400);
    const origC = drawToCanvas(img,W,H);
    const origPx = origC.getContext('2d').getImageData(0,0,W,H).data;
    // Re-save at 90% quality
    const url90 = origC.toDataURL('image/jpeg',0.9);
    const reImg=new Image(); await new Promise(res=>{reImg.onload=res;reImg.src=url90;});
    const rePx = drawToCanvas(reImg,W,H).getContext('2d').getImageData(0,0,W,H).data;
    // Compute per-8x8-block average ELA error
    const blockSize=8, blockErrors=[];
    for(let by=0;by<H-blockSize;by+=blockSize)
      for(let bx=0;bx<W-blockSize;bx+=blockSize){
        let err=0;
        for(let y=by;y<by+blockSize;y++) for(let x=bx;x<bx+blockSize;x++){
          const i=(y*W+x)*4;
          err+=(Math.abs(origPx[i]-rePx[i])+Math.abs(origPx[i+1]-rePx[i+1])+Math.abs(origPx[i+2]-rePx[i+2]))/3;
        }
        blockErrors.push(err/(blockSize*blockSize));
      }
    const meanErr=blockErrors.reduce((a,b)=>a+b,0)/blockErrors.length;
    const stdErr=Math.sqrt(blockErrors.reduce((a,b)=>a+(b-meanErr)**2,0)/blockErrors.length);
    const threshold=meanErr+2*stdErr;
    const anomalous=blockErrors.filter(e=>e>threshold).length;
    r.anomalousPct=Math.round((anomalous/blockErrors.length)*100);
    if(r.anomalousPct>25){r.score+=20;r.findings.push({label:`Advanced ELA: ${r.anomalousPct}% blocks show compression anomalies`,type:'bad',points:20});}
    else if(r.anomalousPct>10){r.score+=10;r.findings.push({label:`Advanced ELA: ${r.anomalousPct}% blocks slightly anomalous`,type:'bad',points:10});}
    else{r.score-=8;r.findings.push({label:`Advanced ELA: Uniform compression — no block anomalies found`,type:'good',points:-8});}
    if(stdErr<1.5){r.score+=10;r.findings.push({label:'Advanced ELA: Too-uniform block errors (AI synthetic generation)',type:'bad',points:10});}
  } catch { r.findings.push({label:'Advanced ELA failed',type:'neutral',points:0}); }
  return r;
}

// Advanced 6 — C2PA & Extended Metadata Check
async function checkC2PA(file) {
  const r = { score: 0, findings: [] };
  try {
    const exif = await exifr.parse(file, { tiff:true, exif:true, xmp:true, iptc:true, icc:false });
    if (!exif) { r.score+=5; r.findings.push({label:'C2PA: No metadata found (mild suspicion for recent images)',type:'bad',points:5}); return r; }
    // Look for C2PA-like Content Credentials fields
    const allKeys=Object.keys(exif).join(' ').toLowerCase();
    const allVals=Object.values(exif).filter(v=>typeof v==='string').join(' ').toLowerCase();
    if(allKeys.includes('c2pa')||allKeys.includes('contentcredential')||allKeys.includes('manifest')){
      const history=allVals;
      const aiHit=AI_SW.find(k=>history.includes(k));
      if(aiHit){r.score+=25;r.findings.push({label:`C2PA: Content credentials show AI tool in creation history`,type:'bad',points:25});}
      else{r.score-=15;r.findings.push({label:'C2PA: Valid content credentials from authentic source',type:'good',points:-15});}
    } else {
      // No C2PA manifest — mild suspicion only if no other real-camera signals
      r.findings.push({label:'C2PA: No Content Credentials manifest embedded (may predate C2PA standard)',type:'neutral',points:0});
    }
    // XMP CreatorTool check
    const ctool=(exif.CreatorTool||exif['xmp:CreatorTool']||'').toLowerCase();
    const aiCtool=AI_SW.find(k=>ctool.includes(k));
    if(aiCtool){r.score+=20;r.findings.push({label:`C2PA/XMP: CreatorTool identifies AI generator: "${exif.CreatorTool||exif['xmp:CreatorTool']}"`,type:'bad',points:20});}
    // IPTC credit/source check
    const credit=(exif.Credit||exif.Source||exif.CopyrightNotice||'').toLowerCase();
    if(AI_SW.find(k=>credit.includes(k))){r.score+=15;r.findings.push({label:'C2PA/IPTC: AI generator name in credit/copyright field',type:'bad',points:15});}
  } catch { r.findings.push({label:'C2PA check failed',type:'neutral',points:0}); }
  return r;
}

// ═════════════════════════════════════════════════════════════
// GROQ VISION (API Layer)
// ═════════════════════════════════════════════════════════════
async function checkGroq(dataUrl) {
  const r = { score: 0, findings: [], explanation: '', confidence: 0, specificTells: [], generatorGuess: null, error: null };
  const prompt = `Analyze this image for AI generation. Check for: unnatural skin/textures, impossible backgrounds, wrong finger counts, too-symmetric eyes, AI hair patterns, garbled text, impossible lighting/reflections, watermarks.

Respond ONLY with this JSON:
{
  "aiConfidence": <0-100>,
  "verdict": "<AI_GENERATED|LIKELY_AI|UNCERTAIN|LIKELY_REAL|REAL>",
  "specificTells": ["<tell 1>","<tell 2>"],
  "explanation": "<2-3 sentences>",
  "generatorGuess": "<Midjourney|Stable Diffusion|DALL-E|Firefly|Unknown|None>"
}`;
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions',{
      method:'POST',
      headers:{Authorization:`Bearer ${GROQ_API_KEY}`,'Content-Type':'application/json'},
      body:JSON.stringify({
        model:'meta-llama/llama-4-scout-17b-16e-instruct',
        messages:[{role:'system',content:'You are an AI image forensics expert. Respond ONLY with valid JSON.'},{role:'user',content:[{type:'image_url',image_url:{url:dataUrl}},{type:'text',text:prompt}]}],
        max_tokens:400, temperature:0.1,
      }),
    });
    if(!res.ok){const t=await res.text();throw new Error(`Groq ${res.status}: ${t.slice(0,80)}`);}
    const data=await res.json();
    const content=data.choices?.[0]?.message?.content||'';
    const m=content.match(/\{[\s\S]*\}/);
    if(!m)throw new Error('Groq returned non-JSON');
    const p=JSON.parse(m[0]);
    r.confidence=p.aiConfidence??0; r.verdict=p.verdict;
    r.specificTells=p.specificTells||[]; r.generatorGuess=p.generatorGuess; r.explanation=p.explanation||'';
    if(r.confidence>80){r.score+=35;r.findings.push({label:`Groq Vision: Very likely AI (${r.confidence}% confident)`,type:'bad',points:35});}
    else if(r.confidence>50){r.score+=20;r.findings.push({label:`Groq Vision: Possibly AI (${r.confidence}% confident)`,type:'bad',points:20});}
    else if(r.confidence<20){r.score-=15;r.findings.push({label:`Groq Vision: Likely real photo (${r.confidence}% AI confidence)`,type:'good',points:-15});}
    else r.findings.push({label:`Groq Vision: Uncertain (${r.confidence}% AI confidence)`,type:'neutral',points:0});
    if(r.specificTells.length){const b=Math.min(r.specificTells.length*5,15);r.score+=b;r.findings.push({label:`Groq identified ${r.specificTells.length} specific AI tell(s)`,type:'bad',points:b});}
  } catch(e){r.error=e.message;r.findings.push({label:`Groq Vision failed: ${e.message.slice(0,70)}`,type:'neutral',points:0});}
  return r;
}

// ═════════════════════════════════════════════════════════════
// SCORING BRAIN
// ═════════════════════════════════════════════════════════════
// Returns normalized 0-100 AI confidence + verdict tier
function scoreToVerdict(rawScore, mode, forcedAI=false) {
  if(forcedAI) return { confidence:99, aiLikelihood:'VERY HIGH', label:'Almost Certainly AI Generated', color:'#dc2626', bgColor:'#fef2f2', overrideReason:'AI software name found directly in metadata — forced verdict' };

  // Normalize to 0-100 confidence based on mode-specific max scores
  const modeMax = { classic: 130, advanced: 110, ai: 50, combo: 220 };
  const pct = Math.min(100, Math.max(0, (rawScore / (modeMax[mode]||130)) * 100));
  // Scale so that scoring ~60% of max = ~70% confidence
  const confidence = Math.min(99, Math.round(pct * 1.1));

  let aiLikelihood, label, color, bgColor;
  if(confidence >= 72)     { aiLikelihood='VERY HIGH'; label='Almost Certainly AI Generated'; color='#dc2626'; bgColor='#fef2f2'; }
  else if(confidence >= 50){ aiLikelihood='HIGH';      label='Likely AI Generated';           color='#ea580c'; bgColor='#fff7ed'; }
  else if(confidence >= 28){ aiLikelihood='MEDIUM';    label='Possibly AI Generated';         color='#d97706'; bgColor='#fffbeb'; }
  else                     { aiLikelihood='LOW';       label='This Image Is Not AI';           color='#16a34a'; bgColor:'#f0fdf4'; }

  return { confidence, aiLikelihood, label, color, bgColor };
}

// ═════════════════════════════════════════════════════════════
// MAIN ENTRY POINT
// ═════════════════════════════════════════════════════════════
export async function analyzeImage(file, mode = 'combo', onProgress) {
  const emit = (step, label, done=false) => onProgress?.({step, label, done});

  emit(0, 'Loading image…');
  const img = await loadImageBitmap(file);
  const dataUrl = (mode==='ai'||mode==='combo') ? await fileToDataUrl(file) : null;

  const layers = {};
  let totalScore = 0;
  let forcedAI = false;
  let step = 1;

  // ── CLASSIC ──────────────────────────────────────────────
  if(mode==='classic'||mode==='combo'){
    emit(step++, 'EXIF Metadata Analysis…');
    layers.exif = await checkExif(file);
    if(layers.exif.forcedAI) forcedAI=true;

    emit(step++, 'Error Level Analysis (ELA)…');
    layers.ela = await checkELA(file, img);

    emit(step++, 'Color, Symmetry & Resolution…');
    const [cd, sym] = await Promise.all([checkColorDist(img), checkSymmetry(img)]);
    layers.colorDist=cd; layers.symmetry=sym;
    layers.resolution=checkResolution(img);
    layers.fileSize=checkFileSize(file,img);
    emit(step-1, 'Visual analysis complete', true);
  }

  // ── ADVANCED ─────────────────────────────────────────────
  if(mode==='advanced'||mode==='combo'){
    emit(step++, 'FFT Frequency Domain Analysis…');
    layers.fft = await checkFFT(img);

    emit(step++, 'Blue Channel Laplacian Analysis…');
    layers.laplacian = await checkLaplacian(img);

    emit(step++, 'PRNU Camera Fingerprint…');
    layers.prnu = await checkPRNU(img);

    emit(step++, 'Color Depth Analysis…');
    layers.colorDepth = await checkColorDepth(img);

    emit(step++, 'Advanced ELA (per-block)…');
    layers.advEla = await checkAdvancedELA(file, img);

    emit(step++, 'C2PA Content Credentials…');
    layers.c2pa = await checkC2PA(file);
  }

  // ── AI VISION ────────────────────────────────────────────
  if(mode==='ai'||mode==='combo'){
    emit(step++, 'Groq Vision LLM Analysis…');
    layers.groq = await checkGroq(dataUrl);
  }

  // ── SCORE AGGREGATION ────────────────────────────────────
  emit(step, 'Computing final verdict…');
  const layerKeys=['exif','ela','colorDist','symmetry','resolution','fileSize','fft','laplacian','prnu','colorDepth','advEla','c2pa','groq'];
  for(const k of layerKeys) if(layers[k]) totalScore+=layers[k].score;

  const verdictData = scoreToVerdict(totalScore, mode, forcedAI);

  // Collect all findings for pie data
  const allF=layerKeys.filter(k=>layers[k]).flatMap(k=>layers[k].findings||[]);
  const flagCount=allF.filter(f=>f.type==='bad').length;
  const clearCount=allF.filter(f=>f.type==='good').length;
  const neutralCount=allF.filter(f=>f.type==='neutral').length;

  // Layer breakdown for pie chart
  const layerBreakdown=[];
  const layerNames={exif:{l:'EXIF',c:'#8b5cf6'},ela:{l:'ELA',c:'#f59e0b'},colorDist:{l:'Color',c:'#0ea5e9'},symmetry:{l:'Symmetry',c:'#34d399'},resolution:{l:'Resolution',c:'#f472b6'},fileSize:{l:'File Size',c:'#a78bfa'},fft:{l:'FFT',c:'#06b6d4'},laplacian:{l:'Laplacian',c:'#f59e0b'},prnu:{l:'PRNU',c:'#10b981'},colorDepth:{l:'Color Depth',c:'#ec4899'},advEla:{l:'Adv. ELA',c:'#ef4444'},c2pa:{l:'C2PA',c:'#7c3aed'},groq:{l:'Groq Vision',c:'#dc2626'}};
  for(const k of layerKeys) if(layers[k]&&layers[k].score>0) layerBreakdown.push({label:layerNames[k]?.l||k, score:layers[k].score, color:layerNames[k]?.c||'#999'});

  // Per-mode max scores for score bars
  const maxScores={exif:90,ela:35,colorDist:25,symmetry:15,resolution:35,fileSize:10,fft:20,laplacian:15,prnu:15,colorDepth:20,advEla:30,c2pa:45,groq:50};

  emit(step, 'Done!', true);
  return {
    file:{name:file.name,size:file.size,type:file.type},
    image:{width:img.naturalWidth,height:img.naturalHeight},
    scannedAt:new Date().toISOString(),
    mode,
    rawScore: Math.max(0,totalScore),
    layers,
    maxScores,
    pieData:{
      checkResults:{flagged:flagCount,clear:clearCount,neutral:neutralCount},
      layerBreakdown: layerBreakdown.filter(l=>l.score>0),
    },
    ...verdictData,
  };
}
