import React, { useState, useRef, useCallback } from 'react';
import {
  Upload, Shield, CheckCircle, XCircle, FileImage,
  Search, Loader, ChevronDown, ChevronUp, Eye, Brain,
  BarChart2, ScanEye, Sparkles, Info, Zap, FlaskConical,
  Cpu, ScanSearch, Terminal
} from 'lucide-react';
import { analyzeImage } from '../../utils/imageDetector';
import './ImageDetector.css';

const formatBytes = b => b<1024?b+' B':b<1048576?(b/1024).toFixed(1)+' KB':(b/1048576).toFixed(2)+' MB';
const MAX_SIZE = 15*1024*1024;

// ── Mode definitions ──────────────────────────────────────────
const MODES = [
  {
    id:'classic', icon: Eye, label:'CLASSIC', sublabel:'Basic Analysis',
    desc:'EXIF Metadata · ELA · Color · Symmetry · Resolution · File Size',
    color:'#0ea5e9', bg:'rgba(14,165,233,0.1)', time:'~3s', // Neon Blue
    steps:['Reading EXIF Metadata','Checking Compression (ELA)','Checking Color & Symmetry','Calculating Result'],
  },
  {
    id:'advanced', icon: FlaskConical, label:'ADVANCED', sublabel:'Deep Scan',
    desc:'FFT · Edge Sharpness · PRNU Fingerprint · Color Depth · Block ELA · C2PA',
    color:'#8b5cf6', bg:'rgba(139,92,246,0.1)', time:'~6s', // Neon Purple
    steps:['Reading EXIF Metadata','FFT Frequency Pattern Check','Edge Sharpness (Laplacian)','Camera Fingerprint (PRNU)','Color Depth Analysis','Block-Level ELA Check','C2PA Content Credentials','Calculating Result'],
  },
  {
    id:'ai', icon: Brain, label:'AI_VISION', sublabel:'AI-Powered Check',
    desc:'Groq Vision AI — reads the image and looks for AI generation signs',
    color:'#ec4899', bg:'rgba(236,72,153,0.1)', time:'~8s', // Neon Pink
    steps:['Sending image to Groq AI','AI Vision Analysis in progress','Calculating Result'],
  },
  {
    id:'combo', icon: Zap, label:'FULL_POWER', sublabel:'Maximum Accuracy',
    desc:'All checks combined — Basic + Deep Scan + AI Vision',
    color:'#00ff41', bg:'rgba(0,255,65,0.1)', time:'~15s', // Neon Green
    steps:['Reading EXIF Metadata','Compression Check (ELA)','Color & Symmetry Check','FFT Frequency Patterns','Edge Sharpness + PRNU','Color Depth + Block ELA','C2PA Credentials','Groq AI Vision Analysis','Calculating Result'],
  },
];

// ── Radial Arc Gauge ─────────────────────────────────────────
const RadialGauge = ({ value, color, size = 190 }) => {
  const cx = size/2, cy = size/2, r = size/2 - 22;
  const toRad = d => d * Math.PI / 180;
  const startA = toRad(-210), endA = toRad(30);
  const v = Math.max(0, Math.min(100, value));
  const curA = startA + (v / 100) * (endA - startA);
  const arc = (a1, a2, rad) => {
    const x1=cx+rad*Math.cos(a1), y1=cy+rad*Math.sin(a1);
    const x2=cx+rad*Math.cos(a2), y2=cy+rad*Math.sin(a2);
    const large=(a2-a1)>Math.PI?1:0;
    return `M ${x1} ${y1} A ${rad} ${rad} 0 ${large} 1 ${x2} ${y2}`;
  };
  const dotX=cx+r*Math.cos(curA), dotY=cy+r*Math.sin(curA);
  return (
    <div className="aid-gauge-wrap">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} overflow="visible">
        <path d={arc(startA,endA,r)} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="14" strokeLinecap="round"/>
        {v>0&&<path d={arc(startA,curA,r)} fill="none" stroke={color} strokeWidth="14" strokeLinecap="round" style={{filter:`drop-shadow(0 0 10px ${color})`}}/>}
        {v>0&&<circle cx={dotX} cy={dotY} r="7" fill={color} style={{filter:`drop-shadow(0 0 8px ${color})`}}/>}
        <text x={cx} y={cy-4} textAnchor="middle" fill="#fff" fontSize="38" fontWeight="800" fontFamily="'Space Grotesk',sans-serif">{value}%</text>
        <text x={cx} y={cy+18} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="'JetBrains Mono',monospace">AI probability</text>
      </svg>
      <div className="aid-gauge-labs"><span>Real</span><span style={{color}}>AI Generated</span></div>
    </div>
  );
};

// ── Fake PieChart stub — kept so no other ref breaks ─────────
const PieChart = ({ slices, size=140, centerLabel, centerSub }) => {
  const cx=size/2, cy=size/2, r=size/2-14, ri=r-18;
  const total=slices.reduce((s,sl)=>s+sl.value,0);
  if(!total) return <div className="aid-pie-empty">No data registered</div>;
  let angle=-90;
  const arcs=slices.map(sl=>{
    const pct=sl.value/total, sweep=pct*360, end=angle+sweep;
    const toR=d=>d*Math.PI/180;
    const [x1,y1]=[cx+r*Math.cos(toR(angle)),cy+r*Math.sin(toR(angle))];
    const [x2,y2]=[cx+r*Math.cos(toR(end)),cy+r*Math.sin(toR(end))];
    const [xi1,yi1]=[cx+ri*Math.cos(toR(angle)),cy+ri*Math.sin(toR(angle))];
    const [xi2,yi2]=[cx+ri*Math.cos(toR(end)),cy+ri*Math.sin(toR(end))];
    const large=sweep>180?1:0;
    const d=slices.length===1
      ?`M ${cx-r} ${cy} A ${r} ${r} 0 1 1 ${cx+r} ${cy} A ${r} ${r} 0 1 1 ${cx-r} ${cy} M ${cx-ri} ${cy} A ${ri} ${ri} 0 1 0 ${cx+ri} ${cy} A ${ri} ${ri} 0 1 0 ${cx-ri} ${cy}`
      :`M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${ri} ${ri} 0 ${large} 0 ${xi1} ${yi1} Z`;
    angle=end;
    return {...sl, d, pct:Math.round(pct*100)};
  });
  return (
    <div className="aid-pie-chart">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {arcs.map((a,i)=>(
          <path key={i} d={a.d} fill={a.color} stroke="rgba(0,0,0,0.5)" strokeWidth="1.5" className="aid-pie-slice" />
        ))}
        {centerLabel&&<>
          <text x={cx} y={cy-5} textAnchor="middle" className="aid-pie-cl" fill="#fff">{centerLabel}</text>
          {centerSub&&<text x={cx} y={cy+15} textAnchor="middle" className="aid-pie-cs">{centerSub}</text>}
        </>}
      </svg>
      <div className="aid-pie-legend">
        {arcs.map((a,i)=>(
          <div key={i} className="aid-pie-li">
            <span className="aid-pie-dot" style={{background:a.color, boxShadow: `0 0 5px ${a.color}`}}/>
            <span className="aid-pie-ln">{a.label}</span>
            <span className="aid-pie-lp">{a.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Likelihood Meter ──────────────────────────────────────────
const LEVELS=[
  {key:'LOW',label:'LOW',color:'#00ff41'},
  {key:'MEDIUM',label:'MODERATE',color:'#f59e0b'},
  {key:'HIGH',label:'HIGH',color:'#ff7351'},
  {key:'VERY HIGH',label:'CRITICAL',color:'#ef4444'},
];
const LikelihoodMeter=({aiLikelihood,color})=>{
  const ai=LEVELS.findIndex(l=>l.key===aiLikelihood);
  return(
    <div className="aid-meter">
      <div className="aid-meter-label">AI Detection Likelihood</div>
      <div className="aid-meter-track">
        {LEVELS.map((l,i)=>(
          <div key={l.key} className={`aid-ms ${i===ai?'ams-active':i<ai?'ams-passed':'ams-off'}`}
            style={i<=ai?{background:l.color, boxShadow: `inset 0 0 5px rgba(0,0,0,0.5)`}:{}}>
            <span>{l.label}</span>
          </div>
        ))}
      </div>
      <div className="aid-meter-below">
        {LEVELS.map((l,i)=>(
          <div key={l.key} className="aid-mnc">
            {i===ai&&<div className="aid-arrow" style={{borderBottomColor:color}}/>}
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Collapsible Section ───────────────────────────────────────
const Section=({icon:Icon,title,badge,badgeType,children,defaultOpen=false})=>{
  const [open,setOpen]=useState(defaultOpen);
  return(
    <div className="aid-section">
      <div className="aid-sh" onClick={()=>setOpen(o=>!o)}>
        <div className="aid-st"><Icon size={16}/><span>{title}</span></div>
        <div className="aid-sr">
          {badge&&<span className={`aid-badge ab-${badgeType}`}>{badge}</span>}
          {open?<ChevronUp size={14}/>:<ChevronDown size={14}/>}
        </div>
      </div>
      {open&&<div className="aid-sb">{children}</div>}
    </div>
  );
};
const Finding=({f})=>{
  const badColor = '#ff7351';
  const goodColor = '#00ff41';
  const infoColor = '#0ea5e9';
  const color = f.type==='bad'?badColor:f.type==='good'?goodColor:infoColor;
  return (
    <div className="aid-f" style={{borderLeft: `2px solid ${color}`, background: `rgba(0,0,0,0.2)`}}>
      <span className="aid-fi" style={{color}}>
        {f.type==='bad'?<XCircle size={12}/>:f.type==='good'?<CheckCircle size={12}/>:<Info size={12}/>}
      </span>
      <span className="aid-ft">{f.label}</span>
      {f.points!==0&&<span className="aid-fp" style={{color}}>{f.points>0?`+${f.points}`:f.points}</span>}
    </div>
  );
};

// ── Layer groups for display ──────────────────────────────────
const CLASSIC_LAYERS=[
  {key:'exif',label:'EXIF Metadata (Photo Info)',icon:Eye},
  {key:'ela',label:'Compression Check (ELA)',icon:BarChart2},
  {key:'colorDist',label:'Color Distribution',icon:Sparkles},
  {key:'symmetry',label:'Symmetry Check',icon:Sparkles},
  {key:'resolution',label:'Resolution & DPI Check',icon:ScanSearch},
  {key:'fileSize',label:'File Size Ratio',icon:Info},
];
const ADVANCED_LAYERS=[
  {key:'fft',label:'Frequency Patterns (FFT)',icon:BarChart2},
  {key:'laplacian',label:'Edge Sharpness (Laplacian)',icon:Eye},
  {key:'prnu',label:'Camera Fingerprint (PRNU)',icon:Cpu},
  {key:'colorDepth',label:'Color Depth Analysis',icon:Sparkles},
  {key:'advEla',label:'Block-Level ELA (Advanced)',icon:FlaskConical},
  {key:'c2pa',label:'C2PA Content Credentials',icon:Shield},
];

// ── Score bar configs with plain-English descriptions ─────────
const SCORE_BAR_DEFS = [
  {key:'exif',      label:'EXIF',        desc:'Hidden camera metadata & software tags',        max:90, color:'#8b5cf6', classic:true, advanced:true},
  {key:'ela',       label:'ELA',         desc:'Detects image edits via compression patterns',  max:35, color:'#f59e0b', classic:true},
  {key:'colorDist', label:'Color',       desc:'Unnaturally smooth or AI-clean color gradients',max:25, color:'#0ea5e9', classic:true},
  {key:'symmetry',  label:'Symmetry',    desc:'Suspicious mirror-image patterns in pixels',    max:15, color:'#00ff41', classic:true},
  {key:'resolution',label:'Resolution',  desc:'Size matches known AI generator output sizes',  max:35, color:'#ec4899', classic:true},
  {key:'fft',       label:'FFT',         desc:'Repeating patterns only AI generators create',  max:20, color:'#06b6d4', advanced:true},
  {key:'laplacian', label:'Laplacian',   desc:'Edge sharpness typical of AI-generated textures',max:15,color:'#f59e0b', advanced:true},
  {key:'prnu',      label:'PRNU',        desc:'Missing real camera sensor noise fingerprint',  max:15, color:'#00ff41', advanced:true},
  {key:'colorDepth',label:'Color Depth', desc:'Too-clean pixel detail — no sensor grain noise', max:20, color:'#ec4899', advanced:true},
  {key:'advEla',    label:'Block ELA',   desc:'Compression inconsistency across image regions', max:30, color:'#ff7351', advanced:true},
  {key:'c2pa',      label:'C2PA',        desc:'Digital certificate verifying content origin',  max:45, color:'#7c3aed', advanced:true},
  {key:'groq',      label:'AI Vision',   desc:'AI visually inspects image for generation signs',max:50, color:'#ff7351', groq:true},
];

// ── Main Component ────────────────────────────────────────────
const ImageDetector=()=>{
  const [mode,setMode]=useState('combo');
  const [file,setFile]=useState(null);
  const [preview,setPreview]=useState(null);
  const [dragging,setDragging]=useState(false);
  const [scanning,setScanning]=useState(false);
  const [progress,setProgress]=useState(null);
  const [result,setResult]=useState(null);
  const [error,setError]=useState('');
  const inputRef=useRef(null);

  const modeObj=MODES.find(m=>m.id===mode);

  const handleFile=useCallback(f=>{
    if(!f)return;
    if(!f.type.startsWith('image/')){setError('ERR: Please upload a valid image file (JPG, PNG, WEBP).');return;}
    if(f.size>MAX_SIZE){setError(`ERR: File exceeds 15 MB threshold.`);return;}
    setFile(f);setResult(null);setError('');
    if(preview)URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(f));
  },[preview]);

  const onDrop=useCallback(e=>{e.preventDefault();setDragging(false);handleFile(e.dataTransfer?.files?.[0]);},[handleFile]);

  const handleScan=async()=>{
    if(!file)return;
    setScanning(true);setResult(null);setError('');setProgress({step:0,label:'INITIALIZING SCAN ENGINE…'});
    try{
      const r=await analyzeImage(file,mode,p=>setProgress(p));
      r.color = r.color === '#ef4444' ? '#ff7351' : r.color === '#10b981' ? '#00ff41' : r.color; // Convert standard green/red to neon theme
      setResult(r);
    }catch(e){console.error(e);setError('ERR: Scan failed due to generic exception.');}
    finally{setScanning(false);setProgress(null);}
  };

  const reset=()=>{
    setFile(null);setResult(null);setError('');setProgress(null);
    if(preview)URL.revokeObjectURL(preview);setPreview(null);
    if(inputRef.current)inputRef.current.value='';
  };

  const showClassic=result&&(result.mode==='classic'||result.mode==='combo');
  const showAdvanced=result&&(result.mode==='advanced'||result.mode==='combo');
  const showGroq=result&&(result.mode==='ai'||result.mode==='combo');

  return(
    <div className="aid-container">
      <div className="scan-line-overlay" />
      <div className="container hud-layout">

        {/* Header */}
        <div className="aid-header fade-in">
          <div className="aid-hico"><ScanEye size={36}/></div>
          <h1>AI Image Detector</h1>
          <p>Scan any image to detect if it was AI-generated or manipulated</p>
        </div>

        {/* Mode Toggle */}
        {!scanning&&!result&&(
          <div className="aid-mode-grid fade-in" style={{animationDelay: '0.1s'}}>
            {MODES.map(m=>(
              <div key={m.id} className={`aid-mode-card ${mode===m.id?'amc-active':''}`}
                style={mode===m.id?{borderColor:m.color,background:'rgba(6,14,27,0.8)'}:{background:'rgba(6,14,27,0.5)'}}
                onClick={()=>{setMode(m.id);setResult(null);}}>
                <div className="amc-icon" style={{background:m.bg,color:m.color}}><m.icon size={20}/></div>
                <div className="amc-body">
                  <div className="amc-label" style={mode===m.id?{color:m.color}:{color:'var(--text-primary)'}}>{m.label}</div>
                  <div className="amc-desc">{m.desc}</div>
                </div>
                {mode===m.id&&<div className="amc-sel" style={{background:m.color}}><CheckCircle size={12}/></div>}
              </div>
            ))}
          </div>
        )}

        {/* Upload Card */}
        <div className="hud-panel aid-card fade-in" style={{animationDelay: '0.2s'}}>
          {!scanning&&!result&&(
            <>
              <div className="aid-dz"
                style={{ borderColor: dragging ? modeObj.color : 'rgba(255,255,255,0.2)', background: dragging ? modeObj.bg : 'rgba(0,0,0,0.3)' }}
                onDrop={onDrop} onDragOver={e=>{e.preventDefault();setDragging(true);}} onDragLeave={()=>setDragging(false)}
                onClick={()=>!file&&inputRef.current?.click()}>
                <input ref={inputRef} id="image-input" type="file" accept="image/*" className="aid-hidden"
                  onChange={e=>handleFile(e.target.files?.[0])}/>
                {file?(
                  <div className="aid-prev">
                    {preview&&<img src={preview} alt="preview" className="aid-thumb"/>}
                    <div className="aid-fn">{file.name}</div>
                    <div className="aid-fs">{formatBytes(file.size)}</div>
                  </div>
                ):(
                  <div className="aid-up">
                    <div className="aid-uico"><Upload size={28}/></div>
                     <p className="aid-ut">Drop an image here or click to browse</p>
                     <p className="aid-us">JPG, PNG, WEBP — up to 15 MB</p>
                  </div>
                )}
              </div>
              <div className="aid-acts">
                {file&&<button className="btn btn-outline" style={{borderColor:'var(--text-secondary)',color:'var(--text-secondary)'}} onClick={reset}>Clear</button>}
                <button className="btn btn-primary" disabled={!file} onClick={handleScan}
                  style={file?{borderColor:modeObj.color,color:modeObj.color,background:modeObj.bg}:{}}>
                  <Terminal size={14}/> Run {modeObj.label} Scan
                </button>
              </div>
            </>
          )}

          {/* Progress */}
          {scanning&&(
            <div className="aid-prog">
              <div className="aid-spin-wrap">
                <ScanEye size={40} style={{color:modeObj.color,position:'relative',zIndex:1}} className="hud-pulse" />
              </div>
              <h3>Running {modeObj.label} Scan…</h3>
              <p className="aid-pl">{progress?.label}</p>
              <div className="aid-steps-list">
                {modeObj.steps.map((s,i)=>{
                  const cur=progress?.step||0;
                  const done=cur>i+1||(cur===i+1&&progress?.done);
                  const active=cur===i+1&&!progress?.done;
                  return(
                    <div key={i} className={`aid-step ${done?'as-done':active?'as-active':'as-pend'}`}
                         style={active ? {color: modeObj.color} : done ? {color: 'rgba(255,255,255,0.8)'} : {}}>
                      <span className="as-ico">{done?<CheckCircle size={14}/>:active?<Loader size={14} className="spin"/>:<span className="as-dot"/>}</span>
                      <span>{s}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {error&&<div className="aid-err"><XCircle size={16}/><span>{error}</span></div>}

        {/* Results */}
        {result&&(
          <div className="aid-results hud-fade-in">

            {/* Verdict Hero */}
            <div className="aid-hero" style={{borderColor:result.color,background:`${result.color}15`,boxShadow:`0 0 30px ${result.color}20`}}>
              {preview&&<img src={preview} alt="" className="aid-hi"/>}
              <div className="aid-hm">
                <div className="aid-hbig" style={{color:result.color}}>{result.label.toUpperCase()}</div>
                <div className="aid-hfile">
                  <FileImage size={12}/>{result.file.name}
                  <span className="dot">/</span>{formatBytes(result.file.size)}
                </div>
                <LikelihoodMeter aiLikelihood={result.aiLikelihood} color={result.color}/>
              </div>
              <div className="aid-hbadge" style={{borderColor:result.color,background:`rgba(0,0,0,0.5)`}}>
                <div className="aid-hnum" style={{color:result.color}}>{result.confidence}%</div>
                <div className="aid-hdesc">AI-Generated %</div>
                <div className="aid-hraw">{result.rawScore} pts</div>
              </div>
            </div>

            {/* AI Vision Analysis — shown immediately below image in combo/ai modes */}
            {showGroq&&result.layers.groq&&(
              <Section icon={Brain} title="AI Vision Analysis"
                badge={result.layers.groq.error?'Error':`${result.layers.groq.confidence}% AI Probability`}
                badgeType={result.layers.groq.confidence>60?'danger':result.layers.groq.confidence>30?'warn':'safe'}
                defaultOpen={true}>
                {result.layers.groq.explanation&&(
                  <div className="aid-groq-exp">{result.layers.groq.explanation}</div>
                )}
                {result.layers.groq.specificTells?.length>0&&(
                  <div className="aid-sub">
                    <div className="aid-subt">AI Telltale Signs Found</div>
                    {result.layers.groq.specificTells.map((t,i)=>(
                      <Finding key={i} f={{label:t,type:'bad',points:0}}/>
                    ))}
                  </div>
                )}
              </Section>
            )}

            {/* Stats Overview */}
            <div className="aid-stats-row">
              {/* Radial Gauge */}
              <div className="hud-panel aid-gauge-card">
                <div className="aid-ct">AI Generation Confidence</div>
                <RadialGauge value={result.confidence} color={result.color}/>
              </div>
              {/* Scan Summary */}
              <div className="hud-panel aid-summary-card">
                <div className="aid-ct">Scan Summary</div>
                <div className="aid-qc-grid">
                  <div className="aid-qc-item" style={{borderColor:'#ff7351',background:'rgba(255,115,81,0.06)'}}>
                    <XCircle size={22} color="#ff7351"/>
                    <div className="aid-qc-num" style={{color:'#ff7351'}}>{result.pieData.checkResults.flagged}</div>
                    <div className="aid-qc-lbl">Issues Found</div>
                  </div>
                  <div className="aid-qc-item" style={{borderColor:'#00ff41',background:'rgba(0,255,65,0.06)'}}>
                    <CheckCircle size={22} color="#00ff41"/>
                    <div className="aid-qc-num" style={{color:'#00ff41'}}>{result.pieData.checkResults.clear}</div>
                    <div className="aid-qc-lbl">Checks Passed</div>
                  </div>
                  <div className="aid-qc-item" style={{borderColor:'rgba(255,255,255,0.1)',background:'rgba(255,255,255,0.02)'}}>
                    <Info size={22} color="#a3abbc"/>
                    <div className="aid-qc-num" style={{color:'#a3abbc'}}>{result.pieData.checkResults.neutral}</div>
                    <div className="aid-qc-lbl">Inconclusive</div>
                  </div>
                </div>
                {result.pieData.layerBreakdown.length>0&&(
                  <div className="aid-layer-mini">
                    <div className="aid-layer-mini-title">Top Suspicious Checks</div>
                    {result.pieData.layerBreakdown.slice(0,5).map((l,i)=>{
                      const c=l.color==='#ef4444'?'#ff7351':l.color==='#10b981'?'#00ff41':l.color;
                      return(
                        <div key={i} className="aid-lm-row">
                          <span className="aid-lm-lbl">{l.label}</span>
                          <div className="aid-lm-bar"><div className="aid-lm-fill" style={{width:`${Math.min(100,(l.score/50)*100)}%`,background:c,boxShadow:`0 0 6px ${c}`}}/></div>
                          <span className="aid-lm-val" style={{color:c}}>{l.score}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Fake charts div to keep structure — immediately closed */}
            <div className="aid-charts" style={{display:'none'}}>
              <div className="hud-panel aid-cc">
                <div className="aid-ct">Confidence Score</div>
                <PieChart slices={[
                  {label:'Synthetic',value:result.confidence,color:result.color},
                  {label:'Real / Authentic',value:Math.max(0,100-result.confidence),color:'#00ff41'},
                ]} size={130} centerLabel={`${result.confidence}%`}/>
              </div>
              <div className="hud-panel aid-cc">
                <div className="aid-ct">Check Breakdown</div>
                {result.pieData.layerBreakdown.length>0?(
                  <PieChart slices={result.pieData.layerBreakdown.map(l=>{
                    let color = l.color;
                    if(color === '#ef4444') color = '#ff7351';
                    if(color === '#10b981') color = '#00ff41';
                    return {label:l.label,value:l.score,color:color}
                  })} size={130}/>
                ):<div className="aid-pie-empty">No suspicious signals found</div>}
              </div>
              <div className="hud-panel aid-cc">
                <div className="aid-ct">Check Results</div>
                <PieChart slices={[
                  ...(result.pieData.checkResults.flagged>0?[{label:'Flags',value:result.pieData.checkResults.flagged,color:'#ff7351'}]:[]),
                  ...(result.pieData.checkResults.clear>0?[{label:'Clear',value:result.pieData.checkResults.clear,color:'#00ff41'}]:[]),
                  ...(result.pieData.checkResults.neutral>0?[{label:'Neutral',value:result.pieData.checkResults.neutral,color:'#a3abbc'}]:[]),
                ]} size={130}/>
              </div>
            </div>

            {/* Score Bars */}
            <div className="hud-panel aid-bars-card">
              <div className="aid-bars-title"><BarChart2 size={16}/> Detection Score Breakdown</div>
              <div className="aid-bars">
                {SCORE_BAR_DEFS.filter(d=>{
                  if(!result.layers[d.key]) return false;
                  if(d.groq) return showGroq;
                  if(d.classic&&d.advanced) return showClassic||showAdvanced;
                  if(d.classic) return showClassic;
                  if(d.advanced) return showAdvanced;
                  return false;
                }).map(({key,label,desc,max,color})=>{
                  const score=Math.max(0,result.layers[key]?.score||0);
                  const pct=Math.min(100,(score/max)*100);
                  return(
                    <div key={key} className="aid-bar-row">
                      <div className="aid-bar-h">
                        <div>
                          <div className="aid-bar-l">{label}</div>
                          <div className="aid-bar-desc">{desc}</div>
                        </div>
                        <span className="aid-bar-v" style={{color}}>{score} / {max}</span>
                      </div>
                      <div className="aid-bar-tr">
                        <div className="aid-bar-f" style={{width:`${Math.max(0,pct)}%`,background:color,boxShadow:`0 0 10px ${color}`}}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Text detail sections */}
            {showClassic&&(
              <Section icon={Eye} title="Basic Analysis Report"
                badge={`${CLASSIC_LAYERS.flatMap(l=>result.layers[l.key]?.findings||[]).filter(f=>f.type==='bad').length} Issues Found`}
                badgeType="warn">
                {CLASSIC_LAYERS.map(({key,label})=>result.layers[key]?.findings?.length?(
                  <div key={key} className="aid-sub">
                    <div className="aid-subt">{label}</div>
                    {result.layers[key].findings.map((f,i)=><Finding key={i} f={f}/>)}
                  </div>
                ):null)}
              </Section>
            )}

            {showAdvanced&&(
              <Section icon={FlaskConical} title="Deep Scan Report"
                badge={`${ADVANCED_LAYERS.flatMap(l=>result.layers[l.key]?.findings||[]).filter(f=>f.type==='bad').length} Issues Found`}
                badgeType="warn">
                {/* Show EXIF findings in advanced mode too */}
                {result.layers.exif?.findings?.length?(
                  <div className="aid-sub">
                    <div className="aid-subt">EXIF Metadata (Photo Info)</div>
                    {result.layers.exif.findings.map((f,i)=><Finding key={i} f={f}/>)}
                  </div>
                ):null}
                {ADVANCED_LAYERS.map(({key,label})=>result.layers[key]?.findings?.length?(
                  <div key={key} className="aid-sub">
                    <div className="aid-subt">{label}</div>
                    {result.layers[key].findings.map((f,i)=><Finding key={i} f={f}/>)}
                  </div>
                ):null)}
              </Section>
            )}

            <div className="aid-rescan">
              <button className="btn btn-outline" onClick={()=>setResult(null)}>Change Mode</button>
              <button className="btn btn-primary" onClick={reset} style={{borderColor:result.color,color:result.color,background:`${result.color}20`}}>
                Scan Another Image
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ImageDetector;
