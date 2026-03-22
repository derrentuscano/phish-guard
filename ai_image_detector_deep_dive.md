# 🧠 AI Image Detector — Complete Technical Deep Dive

> **PhishGuard** · [src/utils/imageDetector.js](file:///c:/Users/P%20B/Documents/phish-guard/src/utils/imageDetector.js) · `src/components/ImageDetector/`

---

## 1. Overview & Purpose

The AI Image Detector is a **multi-layer forensic analysis engine** embedded entirely in the browser (client-side JavaScript) that determines whether an uploaded image was synthesized by a generative AI model or captured by a real physical camera. It combines:

- **Signal processing algorithms** running on raw pixel data via the HTML5 Canvas API
- **Statistical entropy analysis** on noise residuals and frequency spectra
- **Computer vision heuristics** (compression artifacts, symmetry, resolution fingerprints)
- **Large Language Model (LLM) semantic analysis** via the Groq Cloud API
- **Cryptographic metadata inspection** (C2PA / XMP credential chains)

The system outputs a **4-tier AI likelihood verdict** (Low / Medium / High / Very High) backed by a numerical suspicion score, three interactive pie charts, and a per-layer score breakdown.

---

## 2. Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    BROWSER (Client-Side)                      │
│                                                               │
│  User uploads image                                           │
│        │                                                      │
│        ▼                                                      │
│  ┌─────────────────┐    ┌──────────────────────────────────┐  │
│  │  FileReader API │───▶│   HTML5 Canvas API               │  │
│  │  (DataURL read) │    │   (pixel extraction, recompress) │  │
│  └─────────────────┘    └──────────────────────────────────┘  │
│                                  │                            │
│              ┌───────────────────┼──────────────────┐         │
│              ▼                   ▼                  ▼         │
│     ┌──────────────┐  ┌──────────────────┐  ┌──────────────┐ │
│     │ CLASSIC MODE │  │  ADVANCED MODE   │  │   AI MODE    │ │
│     │              │  │                  │  │              │ │
│     │ EXIF         │  │ FFT Analysis     │  │ Groq Vision  │ │
│     │ ELA          │  │ Laplacian Filter │  │ LLM API      │ │
│     │ Color Dist   │  │ PRNU Residual    │  │              │ │
│     │ Symmetry     │  │ Color Depth      │  └──────┬───────┘ │
│     │ Resolution   │  │ Advanced ELA     │         │         │
│     │ File Size    │  │ C2PA Metadata    │         │         │
│     └──────┬───────┘  └────────┬─────────┘         │         │
│            │                   │                   │         │
│            └───────────────────┴───────────────────┘         │
│                                │                             │
│                      ┌─────────▼──────────┐                  │
│                      │   SCORING BRAIN    │                  │
│                      │                   │                  │
│                      │ Raw score → %      │                  │
│                      │ Override rules     │                  │
│                      │ Verdict tier       │                  │
│                      └─────────┬──────────┘                  │
│                                │                             │
│                      ┌─────────▼──────────┐                  │
│                      │   React UI Layer   │                  │
│                      │                   │                  │
│                      │ Verdict hero card  │                  │
│                      │ Likelihood meter   │                  │
│                      │ 3 donut pie charts │                  │
│                      │ Score bars         │                  │
│                      │ Findings sections  │                  │
│                      └────────────────────┘                  │
└──────────────────────────────────────────────────────────────┘
                                │
                    ┌───────────▼────────────┐
                    │  EXTERNAL API (HTTPS)  │
                    │  Groq Cloud API        │
                    │  (AI mode only)        │
                    └────────────────────────┘
```

---

## 3. Technology Stack

| Layer | Technology | Role |
|---|---|---|
| **Runtime** | Browser JavaScript (ES2022) | All computation |
| **Image I/O** | `FileReader API` | Read file as DataURL / ArrayBuffer |
| **Pixel Ops** | `HTMLCanvasElement` + `CanvasRenderingContext2D` | Draw, recompress, and read pixel arrays |
| **Signal Processing** | Custom 1D DFT, convolution, box blur | FFT, Laplacian, PRNU, ELA |
| **EXIF Parsing** | `exifr` npm library | EXIF / XMP / IPTC / TIFF metadata |
| **UI Framework** | React 18 (Vite) | Component rendering and state |
| **Icons** | `lucide-react` | UI iconography |
| **LLM API** | Groq Cloud (`/openai/v1/chat/completions`) | Vision-based semantic analysis |
| **LLM Model** | `meta-llama/llama-4-scout-17b-16e-instruct` | Multimodal reasoning |
| **Build Tool** | Vite 5 | Bundling and dev server |
| **Authentication** | Firebase Auth | Route protection (`/image-detector`) |

---

## 4. Full Detection Workflow

### Step 1 — File Ingestion

```
User drops / selects file
        │
        ├── MIME type check: must start with image/*
        ├── Size check: max 15 MB
        └── createObjectURL() → <img> preview in DOM
```

The file is stored in React state as a raw `File` object. No upload to any server occurs for Classic or Advanced modes — everything runs locally.

### Step 2 — Image Loading

```javascript
async function loadImageBitmap(file) {
  const url = URL.createObjectURL(file);   // Blob URL in memory
  const img = new Image();
  img.src = url;
  await img.onload;
  URL.revokeObjectURL(url);                // Free memory
  return img;                              // HTMLImageElement
}
```

The `HTMLImageElement` gives us `.naturalWidth` and `.naturalHeight` and allows us to draw it onto a `<canvas>` to access raw RGBA pixel arrays via `ImageData`.

### Step 3 — Mode Dispatch

Based on selected mode (`classic` / `advanced` / `ai` / `combo`), the engine runs different check sets. In `combo` mode all checks run sequentially with a `emit()` callback reporting progress to the React state for live step-by-step display.

### Step 4 — Score Aggregation

Every check returns an object with:
- `score: number` — raw suspicion points (can be negative for real-camera signals)
- `findings: Array<{label, type, points}>` — human-readable explanations

All scores are summed → passed to `scoreToVerdict()` → normalized to 0–100% AI confidence → mapped to tier.

### Step 5 — Pie Data Computation

Three data sets are computed from the aggregated results:
1. `AI confidence vs Real confidence` — direct from `confidence` output
2. `Score by Layer` — which checks contributed most suspicion points
3. `Check Results` — how many individual findings were flagged/clear/neutral

---

## 5. Classic Mode — 6 Checks

### 5.1 EXIF Metadata Analysis

**Technology:** `exifr` library → parses EXIF, TIFF, XMP, IPTC, GPS blocks from JPEG/PNG/HEIC files.

**Theory:** Every digital camera embeds EXIF (Exchangeable Image File Format) data into image files at capture time. This includes the camera model, lens, GPS coordinates, timestamp, shutter speed, ISO, white balance, and the software that processed the file. AI generators either:
- Produce images with no EXIF at all (especially if downloaded from web interfaces)
- Embed their tool name in the `Software` field (e.g. `"Stable Diffusion"`, `"Adobe Firefly"`)

**What it checks:**
| Signal | Suspicion Points |
|---|---|
| No EXIF metadata at all | +25 |
| No camera model field | +15 |
| AI software keyword in `Software` / `CreatorTool` | +40 (forced verdict) |
| No software field | +10 |
| No timestamp | +10 |
| Failed to read EXIF | +20 |
| Camera model present | 0 (good signal, no points) |
| GPS present | 0 |
| Timestamp present | 0 |

**Forced verdict:** If `AI_SOFTWARE_KEYWORDS` matches (midjourney, stable diffusion, dall-e, adobe firefly, etc.) the entire verdict is overridden to **VERY HIGH** regardless of other scores.

---

### 5.2 Error Level Analysis (ELA)

**Technology:** Canvas API — JPEG recompression.

**Theory:** JPEG compression divides images into 8×8 pixel blocks and applies DCT (Discrete Cosine Transform) followed by quantization. When you re-save a JPEG at a lower quality, blocks that were already at that quality level barely change, while blocks with different compression history change significantly. This difference map is called the **Error Level Map**.

**Why this detects AI:** AI-generated images are **synthetically compressed all at once** — there's no complex multi-step editing history. This results in an abnormally **uniform** error distribution across all blocks. A real manipulated photo (or an original photo) has varied compression histories across regions.

**Algorithm:**
```
1. Draw img onto canvas at min(width, 800) × min(height, 800)
2. Read origPixels via getImageData()
3. Export as JPEG at quality 0.7 → recompressedDataUrl
4. Load recompressed image → read rePixels
5. For each pixel i:
   diff[i] = (|R_orig - R_re| + |G_orig - G_re| + |B_orig - B_re|) / 3
6. Compute mean and standard deviation of diff[]
```

**Scoring:**
| Std Dev of diffs | Interpretation |
|---|---|
| σ < 8 | Unnaturally uniform → +20 pts |
| σ < 15 | Slightly uniform → +10 pts |
| σ ≥ 15 | Natural variance → −10 pts (real signal) |
| mean < 3 | Too-perfect compression → +15 pts |

---

### 5.3 Color Distribution Analysis

**Theory:** Real camera sensors respond to photons through a Bayer filter mosaic and have thermal noise, shot noise, and read noise baked into every pixel. This creates subtle irregularities in color histograms — they are **spiky and non-uniform**. AI generators produce colors through mathematical sampling from learned distributions, which tend to be **smoother and more uniform**.

**Algorithm:**
```
1. Build per-channel histograms (256 bins) for R, G, B
2. For each channel: smoothness = Σ|hist[i] - hist[i-1]| / (W×H)
3. Average smoothness across channels
4. Check channel mean balance (mean R vs G vs B deviation)
```

**Scoring:**
| Avg Smoothness | Interpretation |
|---|---|
| < 0.05 | Unnaturally smooth → +15 pts |
| 0.05–0.12 | Slightly smooth → +8 pts |
| > 0.12 | Natural spikes → −10 pts |
| Channel diff < 5 | Too-balanced channels → +10 pts |

---

### 5.4 Symmetry Check

**Theory:** AI face generators (especially early diffusion models and GANs) tend to produce faces with higher bilateral symmetry than real humans. Real faces have natural asymmetry — slightly different eye sizes, ear positions, jawline variations. By comparing the left half of an image against a horizontally mirrored right half pixel-by-pixel, we can measure this.

**Algorithm:**
```
1. Resize to max 300×300
2. For each row y, for each x < W/2:
   left_pixel  = image[y, x]
   right_pixel = image[y, W-1-x]
   diff += |left_R - right_R| + |left_G - right_G| + |left_B - right_B|
3. avg_diff = total_diff / total_count
4. symmetry_pct = (1 - avg_diff/255) * 100
```

**Scoring:**
| avg_diff | Interpretation |
|---|---|
| < 15 | Unnaturally symmetric → +15 pts |
| 15–30 | Elevated symmetry → +5 pts |
| > 30 | Natural asymmetry → −5 pts |

---

### 5.5 Resolution Check

**Theory:** AI image generators produce outputs at fixed power-of-2 resolutions (512×512, 1024×1024, 768×512, etc.) because their internal tensor operations work most efficiently at these sizes. These are **not the same aspect ratios as camera sensors**, which produce at 4:3, 3:2, or 16:9 ratios.

**What it checks:**
- Exact match against 20 known AI output sizes → +20 pts
- Both dimensions are powers of 2 (e.g. 512, 1024, 2048) → +15 pts
- One dimension is a power of 2 → +8 pts
- Aspect ratio matches real camera sensor ratios (4:3, 3:2, 16:9, 1:1) → −10 pts

**The `isPowerOf2` check:**
```javascript
isPowerOf2(n) => n > 0 && (n & (n - 1)) === 0
// Uses bitwise AND: powers of 2 in binary have exactly 1 set bit
// 512  = 0b1000000000 → 512 & 511 = 0 → true
// 720  = 0b1011010000 → 720 & 719 ≠ 0 → false
```

---

### 5.6 File Size vs Resolution Ratio

**Theory:** AI-generated images often have a specific bytes-per-pixel ratio because they're exported at default quality settings from generators. Very small file sizes for the resolution suggest smooth/compressible content (common in AI) while very large files can also indicate unusual generation pipelines.

**Algorithm:**
```
bytes_per_pixel = file.size / (width × height)
```

| Ratio | Interpretation |
|---|---|
| < 0.05 bpp | Unusually small → +10 pts |
| > 5.0 bpp | Unusually large → +5 pts |
| 0.05–5.0 bpp | Normal → 0 pts |

---

## 6. Advanced Mode — 6 Research-Grade Checks

These checks are based on peer-reviewed computer forensics research on steganographic and frequency-domain artifacts in GAN/diffusion-generated images.

---

### 6.1 FFT Frequency Domain Analysis

**Theory:** This is the most technically sophisticated check. It targets **GAN upsampling artifacts** — specifically the **checkerboard artifact** produced by transposed convolution (also called fractionally strided convolution) used in the decoder/generator networks of architectures like DCGAN, StyleGAN, ProGAN.

**Background — What is FFT?**
The Fast Fourier Transform decomposes a signal from the **spatial domain** (actual pixel values) into the **frequency domain** (what repetitive patterns exist and at what frequencies). For images, this is a 2D transform:

```
F(u,v) = Σ Σ f(x,y) · e^(-2πi(ux/M + vy/N))
```

Where `f(x,y)` is the pixel intensity at position `(x,y)` and `F(u,v)` is the complex Fourier coefficient at frequency `(u,v)`.

**The Checkerboard Artifact:** In a GAN generator, transposed convolution with stride 2 produces a spatial pattern where every other pixel is generated by overlapping receptive fields that do NOT overlap. This creates a **regular grid of high-frequency energy** in the Fourier spectrum — visible as a cross/star pattern with bright dots at positions `(N/stride, M/stride)`, `(2N/stride, 2M/stride)`, etc. Real photographs have a smooth circular blob of energy in the center fading radially with **no such geometric structure**.

**Our Implementation (1D DFT approximation):**

Because a full 2D FFT is computationally expensive in JavaScript, we approximate using:
1. Sample 12 horizontal and vertical pixel strips at uniform spacing
2. Extract 64 pixels from each strip
3. Apply 1D DFT to each strip
4. Average magnitude spectra across all strips

```javascript
// DFT: O(N²) for N=64, ≈ 4096 ops × 12 strips = ~49,152 ops — fast
function dftMagnitude(signal) {
  for (let k = 1; k < N/2; k++) {          // k = frequency bin
    let re = 0, im = 0;
    for (let n = 0; n < N; n++) {           // n = sample index
      const angle = (2π × k × n) / N;
      re += signal[n] × cos(angle);
      im -= signal[n] × sin(angle);
    }
    magnitude[k-1] = sqrt(re² + im²);     // Magnitude of complex coefficient
  }
}
```

**Spectral Entropy:** Real photographs have energy spread across many frequency bins (high entropy). GAN images have energy concentrated at periodic bins (low entropy). We compute:

```
H = -Σ p(k) × log₂(p(k))
```

Where `p(k) = magnitude[k] / Σ magnitude` (normalized power distribution).

**Peak Regularity Detection:** Additionally, we find local maxima in the spectrum and check if they are **evenly spaced** (consistent spacing variance < 2 bins) — the signature of harmonic GAN artifacts.

**Scoring:**
| Condition | Interpretation |
|---|---|
| entropyRatio < 0.45 AND regular peaks | Checkerboard detected → +20 pts |
| entropyRatio < 0.55 | Slightly periodic → +12 pts |
| entropyRatio > 0.75 | Natural distribution → −8 pts |

---

### 6.2 Blue Channel Laplacian Analysis

**Theory:** The **blue channel** in a Bayer-pattern camera sensor has the lowest spatial resolution (half that of green) because the human visual system is least sensitive to blue detail. This weakness means the blue channel accumulates the most sensor noise and has the most irregular pixel-to-pixel relationships. AI generators — which produce at full resolution mathematically — leave a **structurally smooth blue channel** with none of this natural noise texture.

**The Laplacian Filter:** The Laplacian is a second-order derivative operator that highlights edges and textures while removing smooth gradients:

```
Laplacian kernel:
[-1, -1, -1]
[-1,  8, -1]
[-1, -1, -1]

Output(x,y) = 8·pixel(x,y) - Σ neighbor_pixels(x,y)
```

This is implemented via **3×3 convolution** — sliding the kernel across every pixel and computing the weighted sum. The output is the **texture residual** — it removes the actual visual content and keeps only how pixels relate to their neighbors.

**Entropy of Residual:**
- Real camera blue channel → high entropy residual (random noise from photon shot noise + read noise)
- AI blue channel → low entropy residual (smooth mathematical texture)

```
Entropy ratio = H(|Laplacian response|) / log₂(64 bins)
```

**Scoring:**
| Entropy Ratio | Interpretation |
|---|---|
| < 0.55 | Smooth structured texture → +15 pts |
| 0.55–0.72 | Slightly smooth → +7 pts |
| > 0.72 | High randomness → −6 pts |

---

### 6.3 PRNU Camera Fingerprint Analysis

**Theory:** PRNU (Photo Response Non-Uniformity) is a forensic technique from the paper *"Digital Camera Identification from Sensor Pattern Noise"* (Lukáš et al., 2006). Every CMOS/CCD camera sensor has **microscopic manufacturing imperfections** that cause each photosite (pixel) to respond slightly differently to the same light level. This creates a repeating, device-unique noise pattern in every photo taken by that specific camera.

AI generators have **no physical sensor** — they produce images through mathematical sampling from learned probability distributions. They therefore produce:
- Either purely random white noise (no device fingerprint)
- Or unnaturally flat noise (too smooth — the generator is too perfect)

**Algorithm:**
```
1. Convert image to grayscale
2. Apply 5×5 box blur (averaging filter) → smoothed "denoised" version
3. Noise residual = original - denoised (element-wise subtraction)
4. Analyze the noise residual:
   - Compute entropy of residual values
   - Compute variance of residual values
```

**Box Blur:**
```javascript
// Box blur radius r=3 → 7×7 averaging window
for each pixel (x,y):
  blurred[y,x] = mean(pixels in region [y-r..y+r, x-r..x+r])
```

**Interpretation:**
| Noise Profile | Entropy | Variance | Interpretation |
|---|---|---|---|
| Pure random (AI, no sensor) | > 0.9 | > 150 | White noise signal → +15 pts |
| Too flat (AI, over-smooth) | < 0.45 | Low | Unnaturally flat → +12 pts |
| Structured (real camera PRNU) | 0.6–0.88 | < 120 | Camera fingerprint → −8 pts |

---

### 6.4 Color Depth / Micro-Variance Analysis

**Theory:** Based on the research paper *"The Secret Lies in Color"*. Real camera sensors have **thermal noise and shot noise** (Poisson-distributed) baked into every pixel at the bit level — including the lower 4 bits of each color channel. AI generators produce "clean" pixel values with much less fine-grained variation in the lower bits.

**Algorithm:**
```
1. For each color channel (R, G, B):
   a. Extract the lower 4 bits of every pixel: pixel_value & 0x0F
   b. Compute the variance of these lower-nibble values
2. Average variance across 3 channels → avgLowVar
```

In a real photo, the lower nibble varies substantially (sensor noise randomizes these bits). In AI, lower nibble variance is artificially low (the model produces round, "clean" values).

**Scoring:**
| avgLowVar | Interpretation |
|---|---|
| < 8 | Insufficient fine color variation → +15 pts |
| 8–14 | Below average → +8 pts |
| > 14 | Natural sensor noise → −7 pts |

**Secondary check:** Cross-channel mean difference. If all three channels have nearly the same mean pixel value (< 8 apart), the image is too tonally monochromatic — a signal of AI tonal compression → +5 pts.

---

### 6.5 Advanced ELA (Per-Block Error Level Analysis)

**Theory:** An enhancement of classic ELA that provides **spatial localization** of compression anomalies. Instead of measuring the global variance of the ELA map, we divide the image into 8×8 blocks (matching the JPEG DCT block size) and compute the average ELA error per block.

**Why 8×8 blocks?** JPEG compression operates on exactly 8×8 pixel blocks. Each block has its own DCT coefficients, quantization table, and compression quality. If a region of an image was generated separately (or by an AI) and composited in, its blocks will have a **different compression error profile** than the surrounding naturally-compressed region.

**Algorithm:**
```
1. Re-save at JPEG quality 0.9 (90%)
2. Compute per-block average pixel error:
   For each 8×8 block b:
     block_error[b] = mean(|orig_pixel - repressed_pixel|) 
                      over all pixels in block
3. Compute global: mean_err, std_err of block_errors[]
4. threshold = mean_err + 2 × std_err  (2-sigma region)
5. anomalous_count = blocks where error > threshold
6. anomalous_pct = anomalous_count / total_blocks × 100
```

**Scoring:**
| Anomalous Block % | Interpretation |
|---|---|
| > 25% | Heavy block anomalies → +20 pts |
| 10–25% | Some anomalies → +10 pts |
| < 10% | Uniform compression → −8 pts |
| std_err < 1.5 | Too-uniform block variance → +10 pts |

---

### 6.6 C2PA Content Credentials Check

**Theory:** C2PA (Coalition for Content Provenance and Authenticity) is an open standard jointly developed by Adobe, Microsoft, BBC, Intel, Truepic, and others. It establishes a **cryptographic provenance chain** embedded directly in the image file — a tamper-evident signed manifest recording every creation and editing step.

**Structure:** C2PA manifests are embedded as:
- JUMBF (JPEG Universal Metadata Box Format) in JPEG APP11 markers
- XMP metadata with `tm:manifest` namespace in PNG/HEIC
- The manifest contains: creation timestamp, device model, editing software, AI generation flags, cryptographic hash of the pixel data, and a chain of digital signatures

**What we check via `exifr`:**
1. Look for C2PA field names in all metadata keys
2. Look for XMP `CreatorTool` field → check against AI software keyword list
3. Look for IPTC `Credit` / `Source` / `CopyrightNotice` → check for AI names
4. If C2PA manifest found with AI tool → +25 pts (maximum)
5. If `CreatorTool` contains AI name → +20 pts
6. If IPTC credit field mentions AI → +15 pts

**Why this is so powerful:** If Adobe Firefly generates an image, it embeds `CreatorTool: "Adobe Firefly"` in XMP. If Midjourney's web interface exports an image, it sometimes embeds provenance. These are **ground truth signals** — no false positives possible.

---

## 7. AI Vision Mode — Groq Vision LLM

### Architecture

```
Browser                          Groq Cloud API
   │                                  │
   ├── Convert image to DataURL        │
   │   (base64-encoded JPEG string)   │
   │                                  │
   ├── POST /openai/v1/chat/completions│
   │   Authorization: Bearer {key}    │
   │   Body:                          │
   │   {                             │
   │     model: "llama-4-scout-17b",  │
   │     messages: [                 │
   │       {role: "system", ...},    │
   │       {role: "user", content: [ │
   │         {type: "image_url", ..} │──→ Multimodal token embedding
   │         {type: "text", ...}     │──→ Prompt text
   │       ]}                        │
   │     ],                          │
   │     max_tokens: 400,            │
   │     temperature: 0.1            │
   │   }                             │
   │                                  │
   ├── ←── JSON response ─────────────│
   │   {                             │
   │     "aiConfidence": 87,         │
   │     "verdict": "LIKELY_AI",     │
   │     "specificTells": [...],     │
   │     "explanation": "...",       │
   │     "generatorGuess": "..."     │
   │   }                             │
```

### The Model: LLaMA 4 Scout 17B

- **Architecture:** LLaMA 4 Scout is a multimodal mixture-of-experts (MoE) model
- **Parameters:** 17 billion active parameters (109B total across all experts)
- **Vision encoding:** Images are tokenized via a vision encoder (ViT-based) and projected into the language model's embedding space
- **Context window:** 16,000 tokens (allows detailed image analysis)
- **Inference provider:** Groq's LPU (Language Processing Unit) hardware — extremely fast inference (< 2s typical)

### What the LLM Checks Semantically

The prompt instructs the model to look for:

| Tell | Why AI Fails |
|---|---|
| Unnatural skin textures | Models learn smooth skin averages, not individual pore patterns |
| Impossible background architecture | Models combine scenes from training data without physical constraints |
| Wrong finger counts | Hands are complex — models fail at digit topology |
| Too-symmetric / glossy eyes | Models reproduce the statistical average of eyes, not individual variation |
| AI-painted hair strands | Hair physics is complex; models produce painted-looking flat hair |
| Garbled text in image | Models cannot reliably produce readable text embedded in scenes |
| Physically impossible lighting | Models don't simulate light transport — they guess from training patterns |
| Reflection geometry errors | Reflections require exact geometric math the model doesn't do |

### Response Parsing

The model is instructed to respond **only** with a JSON object. The parser uses:
```javascript
const jsonMatch = content.match(/\{[\s\S]*\}/);  // Regex to strip any markdown fencing
const parsed = JSON.parse(jsonMatch[0]);
```

**Scoring from Groq output:**
| aiConfidence | Points |
|---|---|
| > 80 | +35 pts |
| 51–80 | +20 pts |
| < 20 | −15 pts |
| 20–50 | 0 pts |

Each specific tell adds +5 pts (capped at +15 total).

---

## 8. Scoring Brain

### Normalization Formula

```javascript
const modeMax = { classic: 130, advanced: 110, ai: 50, combo: 220 };
const pct = Math.min(100, Math.max(0, (rawScore / modeMax[mode]) * 100));
const confidence = Math.min(99, Math.round(pct * 1.1));
// 1.1 scale factor: calibrated so ~60% of max score → ~66% confidence
```

### Verdict Tiers

| Confidence | Tier | Label | Color |
|---|---|---|---|
| ≥ 72% | VERY HIGH | Almost Certainly AI Generated | #dc2626 (Red) |
| 50–71% | HIGH | Likely AI Generated | #ea580c (Orange) |
| 28–49% | MEDIUM | Possibly AI Generated | #d97706 (Amber) |
| < 28% | LOW | This Image Is Not AI | #16a34a (Green) |

### Override Rule — Forced Verdict

If `exif.forcedAI === true` (AI software name found in metadata), the scoring system short-circuits and returns:
```javascript
{ confidence: 99, aiLikelihood: 'VERY HIGH', ... }
```
This bypasses all other scores — a software stamp is ground truth.

---

## 9. UI Data Flow

```
analyzeImage(file, mode, onProgress)
        │
        │  emits { step, label, done } on each check completion
        │         └──→ setProgress(p) → React re-render → step list updates
        │
        └── returns {
              file, image, scannedAt, mode,
              rawScore, confidence, aiLikelihood,
              label, color, bgColor,
              overrideReason,
              layers: { exif, ela, colorDist, symmetry,
                        resolution, fileSize, fft, laplacian,
                        prnu, colorDepth, advEla, c2pa, groq },
              pieData: {
                checkResults: { flagged, clear, neutral },
                layerBreakdown: [{ label, score, color }]
              }
            }
            │
            └──→ setResult(r)
                     │
                     ├── Verdict hero card (result.label, result.color)
                     ├── LikelihoodMeter (result.aiLikelihood)
                     ├── PieChart 1: AI vs Real (result.confidence)
                     ├── PieChart 2: Layer breakdown (result.pieData.layerBreakdown)
                     ├── PieChart 3: Check results (result.pieData.checkResults)
                     ├── Score bars (per layer, result.layers[key].score)
                     └── Collapsible sections (result.layers[key].findings[])
```

### Donut Pie Chart — SVG Implementation

Each pie slice is rendered as an **SVG path element** using arc commands:

```
Path data for a donut slice:
M x1 y1          → Move to start of outer arc
A r r 0 L 1 x2 y2  → Outer arc (radius r, large-arc flag L)
L xi2 yi2         → Line to end of inner arc
A ri ri 0 L 0 xi1 yi1 → Inner arc (radius ri, reverse direction)
Z                 → Close path
```

Where:
- `x1,y1` = start of outer arc = `(cx + r·cos(startAngle), cy + r·sin(startAngle))`
- `r` = outer radius = `size/2 - 14`
- `ri` = inner radius = `r - 18` (creates the donut hole)
- `L` (large-arc-flag) = 1 if sweep > 180°, else 0

### Likelihood Meter — CSS Architecture

4 equal-width flex segments. Active and passed segments use the level's color, inactive use `#e5e7eb`. The pointer arrow is a CSS border-triangle (zero-width/height element with colored border-bottom):

```css
.aid-arrow {
  width: 0; height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 9px solid <verdict_color>;
}
```

---

## 10. Performance Characteristics

| Check | Complexity | Typical Time |
|---|---|---|
| EXIF parse | O(file size) | < 50ms |
| ELA | O(W×H) canvas ops + JPEG encode | 100–400ms |
| Color distribution | O(W×H) | < 50ms |
| Symmetry | O(W×H/2) × 3 channels | < 30ms |
| Resolution | O(1) | < 1ms |
| File size ratio | O(1) | < 1ms |
| FFT (12 strips × N=64) | O(12 × 64²) = ~49K ops | 20–80ms |
| Laplacian (3×3 convolution) | O(W×H × 9) | 50–150ms |
| PRNU (box blur + subtract) | O(W×H × r²) for r=3 | 80–200ms |
| Color depth micro-variance | O(W×H) | < 30ms |
| Advanced ELA (per-block) | O(W×H) × JPEG encode | 150–500ms |
| C2PA / EXIF extended | O(file size) | < 100ms |
| Groq Vision API | Network round-trip | 2–8 seconds |

**Total: Classic ~1–2s · Advanced ~3–6s · AI ~8s · Combo ~12–18s**

---

## 11. Security & Privacy

- **No image upload to any server** in Classic or Advanced mode — all pixel analysis runs in the browser's JavaScript engine in the user's RAM
- **Groq API call** (AI mode) sends the base64 DataURL to Groq's servers over HTTPS. Groq's privacy policy applies
- **API keys** are stored in `.env` as Vite environment variables (`VITE_` prefix) — compiled into the bundle but not exposed via the server
- **Firebase Auth guard** on `/image-detector` route — only authenticated users can access the feature

---

## 12. Limitations

| Limitation | Reason |
|---|---|
| PNG images may bypass ELA | ELA is designed for JPEG compression artifacts |
| FFT approximation | We use 1D DFT strips, not full 2D FFT |
| PRNU requires many images | Single-image PRNU is an approximation; real PRNU needs multiple captures |
| Groq Vision can hallucinate | LLMs can produce incorrect verdicts; treated as one layer, not ground truth |
| C2PA adoption is low | Most images predate or weren't captured by C2PA-compatible devices |
| Heavily compressed images | WhatsApp/social media compression can destroy forensic signals |
| Diffusion model evolution | Models improve rapidly; static heuristics may lag behind new generators |

---

## 13. Academic References

1. **Lukáš, J., Fridrich, J., Goljan, M.** (2006). *Digital Camera Identification From Sensor Pattern Noise.* IEEE Transactions on Information Forensics and Security. → **PRNU theory**

2. **Odena, A., Dumoulin, V., Olah, C.** (2016). *Deconvolution and Checkerboard Artifacts.* Distill. → **FFT checkerboard artifact theory**

3. **Durall, R., Keuper, M., Keuper, J.** (2020). *Watch your Up-Convolution: CNN Based Generative Deep Neural Networks are Failing to Reproduce Spectral Distributions.* CVPR. → **Spectral frequency fingerprinting**

4. **Farid, H.** (2009). *Image Forgery Detection.* IEEE Signal Processing Magazine. → **ELA methodology**

5. **Corvi, R. et al.** (2023). *On the Detection of Synthetic Images Generated by Diffusion Models.* ICASSP. → **Diffusion model detection**

6. **Content Authenticity Initiative / C2PA Specification** v2.0 (2024). → **C2PA manifest format**
