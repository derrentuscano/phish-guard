// ============================================================
// fileScanner.js — Magic Bytes + Content Analysis + VirusTotal
// ============================================================

const VT_API_KEY = import.meta.env.VITE_VIRUSTOTAL_API_KEY?.trim();

// ── Categories for display ────────────────────────────────────
export const FILE_CATEGORIES = {
  executable:  { label: 'Executable / Script',   color: '#ef4444', icon: '⚠️', risk: 'high' },
  document:    { label: 'Document',               color: '#6366f1', icon: '📄', risk: 'low'  },
  archive:     { label: 'Archive',                color: '#f59e0b', icon: '🗜️', risk: 'medium'},
  image:       { label: 'Image',                  color: '#10b981', icon: '🖼️', risk: 'low'  },
  audio:       { label: 'Audio',                  color: '#0ea5e9', icon: '🎵', risk: 'low'  },
  video:       { label: 'Video',                  color: '#8b5cf6', icon: '🎬', risk: 'low'  },
  database:    { label: 'Database',               color: '#ec4899', icon: '🗄️', risk: 'low'  },
  font:        { label: 'Font',                   color: '#14b8a6', icon: '🅰️', risk: 'low'  },
  crypto:      { label: 'Certificate / Key',      color: '#f97316', icon: '🔑', risk: 'medium'},
  disk:        { label: 'Disk Image',             color: '#64748b', icon: '💿', risk: 'medium'},
  system:      { label: 'System File',            color: '#dc2626', icon: '⚙️', risk: 'high' },
  text:        { label: 'Text / Data',            color: '#22c55e', icon: '📝', risk: 'low'  },
  unknown:     { label: 'Unknown / Binary',       color: '#94a3b8', icon: '❓', risk: 'medium'},
};

// ── Master Magic Bytes Table (80+ signatures) ─────────────────
// Entries are checked in ORDER — put longer/more-specific hex first
// where two formats share a prefix (e.g. ZIP family).
//
// Special hex sentinels handled in code:
//   'TEXT:<string>'  → literal ASCII match at offset 0
//   'UTF16LE:<hex>'  → UTF-16 LE BOM + optional prefix
//
// Fields: type, category, hex, name, extensions[]
const MAGIC_SIGNATURES = [

  // ── Executables & Scripts ─────────────────────────────────
  { type: 'exe',       category: 'executable', hex: '4D5A',             name: 'Windows Executable / DLL',    extensions: ['exe','dll','sys','scr','com','drv','ocx','cpl'] },
  { type: 'elf',       category: 'executable', hex: '7F454C46',         name: 'Linux/Unix Executable (ELF)', extensions: ['elf','so','out','bin'] },
  { type: 'mach_o32',  category: 'executable', hex: 'FEEDFACE',         name: 'macOS Executable (Mach-O 32)', extensions: [] },
  { type: 'mach_o64',  category: 'executable', hex: 'FEEDFACF',         name: 'macOS Executable (Mach-O 64)', extensions: [] },
  { type: 'mach_obe',  category: 'executable', hex: 'CEFAEDFE',         name: 'macOS Executable (Mach-O BE)', extensions: [] },
  { type: 'mach_o64be',category: 'executable', hex: 'CFFAEDFE',         name: 'macOS Executable (Mach-O 64 BE)', extensions: [] },
  { type: 'class',     category: 'executable', hex: 'CAFEBABE',         name: 'Java Class File',              extensions: ['class'] },
  { type: 'dex',       category: 'executable', hex: '6465780A',         name: 'Android DEX Bytecode',         extensions: ['dex'] },
  { type: 'pyc',       category: 'executable', hex: 'D00D0D0A',         name: 'Python Bytecode',              extensions: ['pyc', 'pyo'] },
  { type: 'wasm',      category: 'executable', hex: '0061736D',         name: 'WebAssembly Binary',           extensions: ['wasm'] },
  { type: 'sh',        category: 'executable', hex: 'TEXT:#!/',         name: 'Shell Script (#!/)',            extensions: ['sh','bash','zsh','fish','ksh'] },
  { type: 'ps1',       category: 'executable', hex: 'TEXT:# ',          name: 'PowerShell / Script',          extensions: ['ps1','psm1','psd1'] },
  { type: 'swf',       category: 'executable', hex: '435753',           name: 'Adobe Flash (SWF)',            extensions: ['swf'] },
  { type: 'swf_comp',  category: 'executable', hex: '465753',           name: 'Adobe Flash Compressed (SWF)', extensions: ['swf'] },
  { type: 'luac',      category: 'executable', hex: '1B4C7561',         name: 'Lua Bytecode',                 extensions: ['luac'] },

  // ── Documents ─────────────────────────────────────────────
  { type: 'pdf',       category: 'document',   hex: '25504446',         name: 'PDF Document',                 extensions: ['pdf'] },
  { type: 'doc_ole',   category: 'document',   hex: 'D0CF11E0A1B11AE1', name: 'MS Office (DOC / XLS / PPT)', extensions: ['doc','xls','ppt','pub','msi','msg'] },
  // OOXML / OpenDocument both start with PK (ZIP) — identified by name
  { type: 'docx',      category: 'document',   hex: '504B0304',         name: 'Office Open XML / ODF (ZIP)', extensions: ['docx','xlsx','pptx','odt','ods','odp','epub'] },
  { type: 'rtf',       category: 'document',   hex: '7B5C72746631',     name: 'Rich Text Format (RTF)',       extensions: ['rtf'] },
  { type: 'ps',        category: 'document',   hex: '25215053',         name: 'PostScript',                   extensions: ['ps','eps'] },
  { type: 'xps',       category: 'document',   hex: '504B0304',         name: 'XPS Document (ZIP)',           extensions: ['xps','oxps'] },
  { type: 'djvu',      category: 'document',   hex: '41542654',         name: 'DjVu Document',                extensions: ['djvu','djv'] },
  { type: 'oxf_zip',   category: 'document',   hex: '504B0304',         name: 'OpenDocument / EPUB (ZIP)',    extensions: ['odt','ods','odp','epub'] },
  { type: 'chm',       category: 'document',   hex: '49545346',         name: 'Windows Help (CHM)',            extensions: ['chm'] },

  // ── Archives & Compressed ──────────────────────────────────
  { type: 'zip',       category: 'archive',    hex: '504B0304',         name: 'ZIP Archive',                  extensions: ['zip','jar','apk','crx','xpi','nupkg'] },
  { type: 'zip_empty', category: 'archive',    hex: '504B0506',         name: 'ZIP Archive (empty)',          extensions: ['zip'] },
  { type: 'zip_span',  category: 'archive',    hex: '504B0708',         name: 'ZIP Archive (spanned)',        extensions: ['zip'] },
  { type: 'rar4',      category: 'archive',    hex: '526172211A0700',   name: 'RAR Archive v4',               extensions: ['rar'] },
  { type: 'rar5',      category: 'archive',    hex: '526172211A070100', name: 'RAR Archive v5',               extensions: ['rar'] },
  { type: '7z',        category: 'archive',    hex: '377ABCAF271C',     name: '7-Zip Archive',                extensions: ['7z'] },
  { type: 'gz',        category: 'archive',    hex: '1F8B',             name: 'GZIP Archive',                 extensions: ['gz','tgz','tar.gz'] },
  { type: 'bz2',       category: 'archive',    hex: '425A68',           name: 'BZip2 Archive',                extensions: ['bz2','tbz2'] },
  { type: 'xz',        category: 'archive',    hex: 'FD377A585A00',     name: 'XZ Archive',                   extensions: ['xz'] },
  { type: 'zstd',      category: 'archive',    hex: '28B52FFD',         name: 'Zstandard Archive',            extensions: ['zst'] },
  { type: 'lz4',       category: 'archive',    hex: '04224D18',         name: 'LZ4 Archive',                  extensions: ['lz4'] },
  { type: 'cab',       category: 'archive',    hex: '4D53434600000000', name: 'Windows Cabinet (CAB)',         extensions: ['cab'] },
  { type: 'iso',       category: 'disk',       hex: '4344303031',       name: 'ISO 9660 Disc Image',          extensions: ['iso'] },
  { type: 'lzip',      category: 'archive',    hex: '4C5A4950',         name: 'LZip Archive',                 extensions: ['lz'] },
  { type: 'ar',        category: 'archive',    hex: '213C617263683E',   name: 'Unix Archive (.ar / .deb)',     extensions: ['a','ar','deb'] },
  { type: 'tar',       category: 'archive',    hex: '7573746172',       name: 'TAR Archive',                  extensions: ['tar'] },
  { type: 'ace',       category: 'archive',    hex: '2A2A4143452A2A',   name: 'ACE Archive',                  extensions: ['ace'] },

  // ── Images ────────────────────────────────────────────────
  { type: 'png',       category: 'image',      hex: '89504E470D0A1A0A', name: 'PNG Image',                    extensions: ['png'] },
  { type: 'jpg',       category: 'image',      hex: 'FFD8FF',           name: 'JPEG Image',                   extensions: ['jpg','jpeg','jfif','jpe'] },
  { type: 'gif87',     category: 'image',      hex: '47494638376100',   name: 'GIF Image (87a)',              extensions: ['gif'] },
  { type: 'gif89',     category: 'image',      hex: '47494638396100',   name: 'GIF Image (89a)',              extensions: ['gif'] },
  { type: 'bmp',       category: 'image',      hex: '424D',             name: 'BMP / DIB Image',              extensions: ['bmp','dib'] },
  { type: 'ico',       category: 'image',      hex: '00000100',         name: 'Windows Icon (ICO)',           extensions: ['ico'] },
  { type: 'cur',       category: 'image',      hex: '00000200',         name: 'Windows Cursor (CUR)',         extensions: ['cur'] },
  { type: 'tiff_le',   category: 'image',      hex: '49492A00',         name: 'TIFF Image (little-endian)',   extensions: ['tif','tiff'] },
  { type: 'tiff_be',   category: 'image',      hex: '4D4D002A',         name: 'TIFF Image (big-endian)',      extensions: ['tif','tiff'] },
  { type: 'webp',      category: 'image',      hex: '52494646',         name: 'WebP Image (RIFF)',            extensions: ['webp'] },
  { type: 'psd',       category: 'image',      hex: '38425053',         name: 'Adobe Photoshop (PSD)',        extensions: ['psd','psb'] },
  { type: 'xcf',       category: 'image',      hex: '67696D702078636600', name: 'GIMP Image (XCF)',           extensions: ['xcf'] },
  { type: 'heic',      category: 'image',      hex: '0000001C66747970', name: 'HEIC/HEIF Image',              extensions: ['heic','heif'] },
  { type: 'avif',      category: 'image',      hex: '0000001C66747970', name: 'AVIF Image',                   extensions: ['avif'] },
  { type: 'jp2',       category: 'image',      hex: '0000000C6A502020', name: 'JPEG 2000 Image',              extensions: ['jp2','j2k','jpf','jpx'] },
  { type: 'cr2',       category: 'image',      hex: '49492A0010000000', name: 'Canon RAW (CR2)',              extensions: ['cr2'] },
  { type: 'svg',       category: 'image',      hex: 'TEXT:<svg',        name: 'SVG Vector Image',             extensions: ['svg'] },

  // ── Audio ─────────────────────────────────────────────────
  { type: 'mp3_id3',   category: 'audio',      hex: '494433',           name: 'MP3 Audio (ID3 tag)',          extensions: ['mp3'] },
  { type: 'mp3_sync',  category: 'audio',      hex: 'FFFB',             name: 'MP3 Audio (sync header)',      extensions: ['mp3'] },
  { type: 'flac',      category: 'audio',      hex: '664C6143',         name: 'FLAC Audio',                   extensions: ['flac'] },
  { type: 'ogg',       category: 'audio',      hex: '4F676753',         name: 'OGG Audio/Video',              extensions: ['ogg','oga','ogv','opus'] },
  { type: 'wav',       category: 'audio',      hex: '52494646',         name: 'WAV Audio (RIFF)',             extensions: ['wav'] },
  { type: 'aiff',      category: 'audio',      hex: '464F524D',         name: 'AIFF Audio (IFF)',             extensions: ['aif','aiff'] },
  { type: 'm4a',       category: 'audio',      hex: '00000020667479706D703432', name: 'M4A Audio (AAC)',      extensions: ['m4a','aac'] },
  { type: 'wma',       category: 'audio',      hex: '3026B2758E66CF11A6D900AA0062CE6C', name: 'WMA Audio (ASF)', extensions: ['wma'] },
  { type: 'mid',       category: 'audio',      hex: '4D546864',         name: 'MIDI Audio',                   extensions: ['mid','midi'] },

  // ── Video ─────────────────────────────────────────────────
  { type: 'mp4',       category: 'video',      hex: '00000018667479706D703432', name: 'MPEG-4 Video (MP4)',   extensions: ['mp4','m4v'] },
  { type: 'mp4_iso',   category: 'video',      hex: '0000002066747970', name: 'MP4 Video (ISO Base)',         extensions: ['mp4','mov','m4v'] },
  { type: 'mov',       category: 'video',      hex: '00000014667479',   name: 'QuickTime Video (MOV)',        extensions: ['mov'] },
  { type: 'avi',       category: 'video',      hex: '52494646',         name: 'AVI Video (RIFF)',             extensions: ['avi'] },
  { type: 'wmv',       category: 'video',      hex: '3026B2758E66CF11A6D900AA0062CE6C', name: 'WMV Video (ASF)', extensions: ['wmv'] },
  { type: 'mkv',       category: 'video',      hex: '1A45DFA3',         name: 'Matroska Video (MKV/WebM)',   extensions: ['mkv','webm','mka'] },
  { type: 'flv',       category: 'video',      hex: '464C5601',         name: 'Flash Video (FLV)',            extensions: ['flv'] },
  { type: 'mpeg',      category: 'video',      hex: '000001BA',         name: 'MPEG Video',                   extensions: ['mpg','mpeg','m2v'] },
  { type: '3gp',       category: 'video',      hex: '0000002066747970',  name: '3GP Video',                   extensions: ['3gp','3g2'] },

  // ── Disk Images ───────────────────────────────────────────
  { type: 'vmdk',      category: 'disk',       hex: '4B444D56',         name: 'VMware Disk (VMDK)',           extensions: ['vmdk'] },
  { type: 'vhd',       category: 'disk',       hex: '636F6E6563746978',  name: 'VirtualPC Disk (VHD)',         extensions: ['vhd'] },
  { type: 'dmg',       category: 'disk',       hex: '7801730D626260',    name: 'macOS Disk Image (DMG)',       extensions: ['dmg'] },
  { type: 'squashfs',  category: 'disk',       hex: '73717368',          name: 'SquashFS Filesystem',          extensions: ['squashfs','sqfs'] },

  // ── Databases ─────────────────────────────────────────────
  { type: 'sqlite',    category: 'database',   hex: '53514C69746520666F726D617420', name: 'SQLite Database',  extensions: ['db','sqlite','sqlite3'] },
  { type: 'mdb',       category: 'database',   hex: '00010000535461',   name: 'MS Access Database (MDB)',     extensions: ['mdb','accdb'] },

  // ── Fonts ─────────────────────────────────────────────────
  { type: 'ttf',       category: 'font',       hex: '0001000000',        name: 'TrueType Font (TTF)',          extensions: ['ttf'] },
  { type: 'otf',       category: 'font',       hex: '4F54544F',          name: 'OpenType Font (OTF)',          extensions: ['otf'] },
  { type: 'woff',      category: 'font',       hex: '774F4646',          name: 'Web Open Font (WOFF)',          extensions: ['woff'] },
  { type: 'woff2',     category: 'font',       hex: '774F4632',          name: 'Web Open Font 2 (WOFF2)',       extensions: ['woff2'] },
  { type: 'eot',       category: 'font',       hex: '4C500000',          name: 'Embedded OpenType Font (EOT)', extensions: ['eot'] },

  // ── Certificates & Crypto ─────────────────────────────────
  { type: 'der',       category: 'crypto',     hex: '3082',              name: 'DER Certificate / Key',        extensions: ['der','crt','cer'] },
  { type: 'pem',       category: 'crypto',     hex: 'TEXT:-----BEGIN',   name: 'PEM Certificate / Key',        extensions: ['pem','crt','key','csr'] },
  { type: 'pfx',       category: 'crypto',     hex: '3082',              name: 'PKCS#12 / PFX Certificate',   extensions: ['pfx','p12'] },
  { type: 'pgp',       category: 'crypto',     hex: '99',                name: 'PGP Data',                     extensions: ['pgp','gpg','asc'] },

  // ── System / Misc ─────────────────────────────────────────
  { type: 'lnk',       category: 'system',     hex: '4C000000',          name: 'Windows Shortcut (LNK)',       extensions: ['lnk'] },
  { type: 'reg',       category: 'system',     hex: 'TEXT:Windows Registry', name: 'Windows Registry File',   extensions: ['reg'] },
  { type: 'pcap',      category: 'system',     hex: 'D4C3B2A1',          name: 'Packet Capture (PCAP)',        extensions: ['pcap','cap'] },
  { type: 'pcapng',    category: 'system',     hex: '0A0D0D0A',          name: 'Packet Capture NG (PCAPNG)',   extensions: ['pcapng'] },
  { type: 'evt',       category: 'system',     hex: '30000000',          name: 'Windows Event Log (EVT)',      extensions: ['evt','evtx'] },
  { type: 'pf',        category: 'system',     hex: '11000000',          name: 'Windows Prefetch',             extensions: ['pf'] },
  { type: 'torrent',   category: 'system',     hex: '6433',              name: 'BitTorrent File',              extensions: ['torrent'] },

  // ── Text / Data (fallback for text signal) ────────────────
  { type: 'xml',       category: 'text',       hex: 'TEXT:<?xml',        name: 'XML Document',                 extensions: ['xml','xsl','xslt','svg','rss','atom'] },
  { type: 'html',      category: 'text',       hex: 'TEXT:<!doctype html',name: 'HTML Document',               extensions: ['html','htm','xhtml'] },
  { type: 'html2',     category: 'text',       hex: 'TEXT:<html',        name: 'HTML Document',                extensions: ['html','htm'] },
  { type: 'json',      category: 'text',       hex: 'TEXT:{',            name: 'JSON Data',                    extensions: ['json'] },
  { type: 'json_arr',  category: 'text',       hex: 'TEXT:[',            name: 'JSON Array Data',              extensions: ['json'] },
  { type: 'vbs',       category: 'executable', hex: 'TEXT:option explicit',name: 'VBScript File',              extensions: ['vbs','vbe'] },
  { type: 'vbs2',      category: 'executable', hex: 'TEXT:on error resume next', name: 'VBScript File',        extensions: ['vbs','vbe'] },
];

// ── Extension → allowed true categories (for mismatch) ───────
// If detected category is NOT in the allowed list, it's a mismatch.
const EXTENSION_ALLOWED_CATEGORIES = {
  // Documents
  pdf:  ['document'],
  doc:  ['document'], docx: ['document','archive'],
  xls:  ['document'], xlsx: ['document','archive'],
  ppt:  ['document'], pptx: ['document','archive'],
  odt:  ['document','archive'], ods: ['document','archive'], odp: ['document','archive'],
  rtf:  ['document'], epub: ['document','archive'],
  txt:  ['text'], csv: ['text'], tsv: ['text'],
  xml:  ['text','document'], html: ['text'], htm: ['text'],
  json: ['text'], yaml: ['text'], yml: ['text'],
  md:   ['text'], log: ['text'], ini: ['text'], cfg: ['text'], conf: ['text'],
  // Images
  png:  ['image'], jpg: ['image'], jpeg: ['image'], gif: ['image'],
  bmp:  ['image'], ico: ['image'], tif: ['image'], tiff: ['image'],
  webp: ['image'], svg: ['image','text'], psd: ['image'],
  heic: ['image'], heif: ['image'], avif: ['image'],
  raw:  ['image'], cr2: ['image'], nef: ['image'], arw: ['image'],
  // Audio
  mp3:  ['audio'], wav: ['audio'], flac: ['audio'], ogg: ['audio'],
  aac:  ['audio'], m4a: ['audio'], wma: ['audio'], mid: ['audio'], midi: ['audio'],
  aif:  ['audio'], aiff:['audio'],
  // Video
  mp4:  ['video'], avi: ['video'], mkv: ['video'], mov: ['video'],
  wmv:  ['video'], flv: ['video'], webm: ['video'], m4v: ['video'],
  mpg:  ['video'], mpeg: ['video'], '3gp': ['video'],
  // Archives
  zip:  ['archive'], rar: ['archive'], '7z': ['archive'],
  gz:   ['archive'], tgz: ['archive'], bz2: ['archive'], xz: ['archive'],
  zst:  ['archive'], tar: ['archive'], cab: ['archive'],
  jar:  ['archive','executable'], apk: ['archive'],
  // Executables (allowed to be what they claim)
  exe:  ['executable'], dll: ['executable'], sys: ['executable'],
  com:  ['executable'], bat: ['executable','text'], cmd: ['executable','text'],
  msi:  ['executable','document'], scr: ['executable'],
  ps1:  ['executable','text'], vbs: ['executable','text'],
  sh:   ['executable','text'], py:  ['executable','text'],
  js:   ['executable','text'], ts:  ['executable','text'],
  // Fonts
  ttf:  ['font'], otf: ['font'], woff: ['font'], woff2: ['font'],
  // Crypto
  pem:  ['crypto','text'], crt: ['crypto'], cer: ['crypto'],
  der:  ['crypto'], pfx: ['crypto'], p12: ['crypto'], key: ['crypto'],
  // Disk
  iso:  ['disk'], vmdk: ['disk'], vhd: ['disk'], dmg: ['disk'],
  // Database
  db:   ['database'], sqlite: ['database'], sqlite3: ['database'],
  mdb:  ['database'], accdb: ['database'],
  // System
  lnk:  ['system'], reg: ['system'], evt: ['system'], evtx: ['system'],
  pcap: ['system'], cap: ['system'],
};

// ── Dangerous extensions ──────────────────────────────────────
const DANGEROUS_EXTENSIONS = new Set([
  'exe','dll','bat','cmd','vbs','vbe','js','jse','wsf','wsh',
  'msi','scr','ps1','ps2','psc1','psc2','com','pif','lnk',
  'hta','reg','inf','msp','msh','msh1','msh2','cpl','jar',
  'ade','adp','app','asp','aspx','asx','bas','chm','crt',
  'elf','dex','sh','py','rb','pl','php'
]);

// ── STEP 1: Magic Byte Detection ─────────────────────────────
async function detectMagicBytes(file) {
  const fileName  = file.name;
  const dotIndex  = fileName.lastIndexOf('.');
  const claimedExtension = dotIndex >= 0 ? fileName.slice(dotIndex + 1).toLowerCase() : '(none)';

  // Read first 32 bytes — enough for all our signatures
  const buffer = await file.slice(0, 32).arrayBuffer();
  const bytes  = new Uint8Array(buffer);
  const hexHeader = Array.from(bytes).map(b => b.toString(16).padStart(2, '0').toUpperCase()).join('');

  // Text read (for text-based sigs)
  let textHeader = '';
  try { textHeader = new TextDecoder('utf-8', { fatal: false }).decode(bytes).toLowerCase(); } catch (_) {}

  let match = null;

  for (const sig of MAGIC_SIGNATURES) {
    const h = sig.hex;

    if (h.startsWith('TEXT:')) {
      // ASCII prefix match (case-insensitive)
      const needle = h.slice(5).toLowerCase();
      if (textHeader.startsWith(needle)) { match = sig; break; }
      continue;
    }

    // Hex match
    if (hexHeader.startsWith(h.toUpperCase())) { match = sig; break; }
  }

  // --- Resolve ambiguous ZIP-family entries by filename extension -------
  // ZIP, DOCX, XLSX, PPTX, ODF, JAR, APK, XPS all share PK header.
  // If we matched the generic ZIP and the extension gives a better answer, upgrade.
  if (match && ['zip','docx','oxf_zip','xps'].includes(match.type)) {
    const zipVariants = {
      docx: { type:'docx', category:'document', name:'Word Document (DOCX)' },
      xlsx: { type:'xlsx', category:'document', name:'Excel Spreadsheet (XLSX)' },
      pptx: { type:'pptx', category:'document', name:'PowerPoint Presentation (PPTX)' },
      odt:  { type:'odt',  category:'document', name:'OpenDocument Text (ODT)' },
      ods:  { type:'ods',  category:'document', name:'OpenDocument Spreadsheet (ODS)' },
      odp:  { type:'odp',  category:'document', name:'OpenDocument Presentation (ODP)' },
      epub: { type:'epub', category:'document', name:'EPUB eBook' },
      jar:  { type:'jar',  category:'executable', name:'Java Archive (JAR)' },
      apk:  { type:'apk',  category:'executable', name:'Android App Package (APK)' },
      xps:  { type:'xps',  category:'document', name:'XPS Document' },
      zip:  null, // keep generic
    };
    const upgrade = zipVariants[claimedExtension];
    if (upgrade) match = { ...match, ...upgrade };
  }

  // --- RIFF ambiguity (WEBP vs WAV vs AVI) ----
  if (match && match.type === 'wav') {
    // RIFF....WAVE vs RIFF....AVI  vs RIFF....WEBP
    const sub = hexHeader.slice(16, 24);
    if (sub === '57454250') match = { ...match, type:'webp', category:'image', name:'WebP Image' };
    else if (sub === '41564920') match = { ...match, type:'avi', category:'video', name:'AVI Video' };
    // else stays WAV
  }

  // -----------------------------------------------------------------

  const allowedCategories = EXTENSION_ALLOWED_CATEGORIES[claimedExtension] || [];

  // If we couldn't match the magic bytes, guess the category based on the extension
  let detectedCategory = match ? match.category : 'unknown';
  let categoryInfo = FILE_CATEGORIES[detectedCategory] || FILE_CATEGORIES.unknown;
  let detectedName = match ? match.name : 'Unknown / Unrecognised Binary';

  if (!match && allowedCategories.length > 0) {
    detectedCategory = allowedCategories[0];
    categoryInfo = FILE_CATEGORIES[detectedCategory] || FILE_CATEGORIES.unknown;
    detectedName = `${claimedExtension.toUpperCase()} File`;
  }

  const isMismatch = match !== null &&
    allowedCategories.length > 0 &&
    !allowedCategories.includes(detectedCategory);

  const isDangerousExtension   = DANGEROUS_EXTENSIONS.has(claimedExtension);
  const isDangerousTrueType    = match ? match.category === 'executable' || match.category === 'system' : false;

  return {
    claimedExtension,
    detectedType:        match ? match.type : 'unknown',
    detectedName,
    detectedCategory,
    categoryInfo,
    hexHeader:           hexHeader.slice(0, 24),   // show 12 bytes
    isMismatch,
    isDangerousExtension,
    isDangerousTrueType,
    knownExtensions:     match ? (match.extensions || []) : [],
    mismatchDetail: isMismatch
      ? `File is named .${claimedExtension} but its actual content is identified as: ${match.name}`
      : null,
  };
}

// ── STEP 2: Content Analysis ──────────────────────────────────
async function analyzeContent(file) {
  const findings = [];
  const ext = file.name.split('.').pop().toLowerCase();

  // Read up to 1 MB — try UTF-8 first (covers Notepad / VS Code saves),
  // then also latin1 (maps every byte 1:1, covers binary content).
  const slice = file.slice(0, 1024 * 1024);

  let rawText = '';
  try {
    // Read as ArrayBuffer to handle various encodings
    const buffer = await slice.arrayBuffer();
    const bytes  = new Uint8Array(buffer);

    // 1. Try UTF-8 (Most common for scripts/text)
    const utf8Text = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
    
    // 2. Try UTF-16 LE (PowerShell default often includes this)
    const utf16leText = new TextDecoder('utf-16le', { fatal: false }).decode(bytes);
    
    // 3. Try latin1 (1:1 byte mapping, catches binary/obfuscated strings)
    const latinText = new TextDecoder('latin1', { fatal: false }).decode(bytes);

    // Use whichever produced more printable ASCII content
    const printable = (s) => (s.match(/[\x20-\x7e\t\r\n]/g) || []).length;
    
    const candidates = [
      { text: utf8Text, score: printable(utf8Text) },
      { text: utf16leText, score: printable(utf16leText) },
      { text: latinText, score: printable(latinText) }
    ];
    
    // Sort by printable score descending
    candidates.sort((a, b) => b.score - a.score);
    rawText = candidates[0].text;

    // Special case: if it's mostly UTF-16 but the "best" was latin1 due to some noise,
    // we still want to search multiple versions. But for simplicity, we'll use the best one.
  } catch (err) { 
    console.error('📄 [FileScanner] Error decoding content:', err);
    rawText = ''; 
  }

  // Strip UTF-8 BOM if present
  if (rawText.charCodeAt(0) === 0xFEFF) rawText = rawText.slice(1);

  console.log('📄 [FileScanner] Content Analysis Debug:');
  console.log('   File:', file.name, '| Size:', file.size, '| Extension:', ext);
  console.log('   rawText length:', rawText.length);
  console.log('   First 500 chars:', JSON.stringify(rawText.slice(0, 500)));

  const text = rawText.toLowerCase();

  console.log('📄 [FileScanner] Starting analysis checks...');

  // — JavaScript inside PDFs / HTML
  if (/\/javascript|\/js\b/i.test(text) || /<script[\s>]/i.test(text)) {
    console.log('   HIT: JavaScript');
    findings.push({ level: 'high', message: 'JavaScript code detected inside document', detail: 'Scripts embedded in documents can execute automatically.' });
  }

  // — Auto-open / auto-run actions (PDF)
  if (/\/openaction|\/aa\s*<<|autoopen|auto_open|auto-open/i.test(rawText)) {
    console.log('   HIT: AutoAction');
    findings.push({ level: 'high', message: 'Auto-open action detected', detail: 'This file attempts to run code automatically when opened.' });
  }

  // — Macros in Office documents
  if (/vbaproject|macrosheet|auto_open|autoexec|workbook_open|document_open/i.test(rawText)) {
    console.log('   HIT: Macros');
    findings.push({ level: 'high', message: 'Macro code detected (VBA / Office macro)', detail: 'Macros can download and execute malicious programs.' });
  }

  // — PowerShell and common obfuscation patterns
  // Includes: iex, invoke-expression, downloadstring, webclient, bypass (execution policy), -enc/encodedcommand
  const psRegex = /(powershell|invoke-expression|iex|downloadstring|webclient|invoke-webrequest|new-object|bypass|set-executionpolicy|-enc(odedcommand)?)\b/i;
  // Also check for common `iex` obfuscation like `i`e`x` or vars
  const iexObfRegex = /\b(i`?e`?x)\b|get-command\s+iex|&.*?(iex|invoke-expression)/i;

  if (psRegex.test(text) || iexObfRegex.test(text)) {
    console.log('   HIT: PowerShell / Script Execution');
    findings.push({ level: 'high', message: 'PowerShell / Script execution command detected', detail: 'This file contains commands for running or downloading scripts, which is a common malware technique.' });
  }

  // — Obfuscated command line (suspicious backticks or string joins)
  // Requires quotes for string joins (e.g. 'p'+'o'+'w') or multiple backticks to avoid binary false positives
  if (/([a-z]`[a-z]){2,}/i.test(rawText) || /(['"][a-z]+['"]\s*\+\s*)+['"][a-z]+['"]/i.test(text)) {
    console.log('   HIT: Obfuscation');
    findings.push({ level: 'high', message: 'Command obfuscation detected', detail: 'The file uses backticks or character joining to hide its actual commands.' });
  }

  // — Suspicious remote payload links
  const payloadRegex = /https?:\/\/[^\s"'<>]+\.(exe|bat|ps1|vbs|dll|msi|scr|hta|jar|dex)/i;
  if (payloadRegex.test(rawText)) {
    console.log('   HIT: Payload Link');
    findings.push({ level: 'high', message: 'Embedded link to a remote executable', detail: 'The file contains URLs pointing to potentially malicious payloads.' });
  }

  // — Suspicious hosting services
  const suspiciousDomains = ['pastebin.com', 'raw.githubusercontent.com', 'bit.ly', 'tinyurl', 'ngrok.io', 'serveo.net', 'transfer.sh', 'temp.sh', 'discord.com/api/webhooks'];
  for (const domain of suspiciousDomains) {
    if (text.includes(domain)) {
      console.log('   HIT: Suspicious Domain:', domain);
      findings.push({ level: 'medium', message: `Reference to suspicious service: ${domain}`, detail: 'These services are frequently used to host payloads.' });
      break;
    }
  }

  // — Credential harvesting keywords
  const credKeywords = ['password', 'passwd', 'credential', 'login', 'username', 'secret', 'api_key', 'access_token', 'private_key', 'authorization'];
  const credFound = credKeywords.filter(k => text.includes(k));
  if (credFound.length >= 3) {
    console.log('   HIT: Credentials x', credFound.length);
    findings.push({ level: 'medium', message: `Credential keywords: ${credFound.slice(0, 3).join(', ')}`, detail: 'May indicate a phishing or credential harvesting file.' });
  }

  // — Large Base64 blob
  if (/[A-Za-z0-9+/]{300,}/.test(rawText)) {
    console.log('   HIT: Base64 Blob');
    findings.push({ level: 'medium', message: 'Large Base64-encoded payload found', detail: 'Attackers hide malware inside encoded strings.' });
  }

  // — Shell commands
  const shellRegex = /cmd\.exe|\/bin\/sh|\/bin\/bash|net user|reg add|schtasks|wscript|cscript|certutil|bitsadmin|mshta|sc\.exe|netsh|at\.exe/i;
  if (shellRegex.test(text)) {
    console.log('   HIT: Shell Command');
    findings.push({ level: 'high', message: 'System shell commands embedded in file', detail: 'The file contains references to system administration tools commonly exploited by attackers.' });
  }

  // — Executables inside archives
  if (['zip','rar','7z','jar','apk'].includes(ext)) {
    if (/\.exe|\.bat|\.dll|\.scr|\.vbs|\.ps1|\.hta/i.test(rawText)) {
      console.log('   HIT: Archive Payload');
      findings.push({ level: 'medium', message: 'Archive contains executable files', detail: 'Malware is often hidden inside compressed archives.' });
    }
  }

  // — Suspicious iframe / redirect in HTML
  if (['html','htm','svg'].includes(ext)) {
    if (/<iframe[^>]+src\s*=/i.test(rawText) || /window\.location\s*=/i.test(rawText)) {
      console.log('   HIT: HTML Redirect');
      findings.push({ level: 'medium', message: 'HTML contains hidden iframe or redirect', detail: 'Phishing pages use redirects to load malicious content.' });
    }
  }

  // — Keylogger / screen capture APIs
  if (/getasynckeystate|setwindowshookex|recordscreen|imagecapture|getcursorpos/i.test(text)) {
    console.log('   HIT: Keylogger API');
    findings.push({ level: 'high', message: 'Spyware API reference found', detail: 'These API calls are used by keyloggers and spyware.' });
  }

  // — Known ransomware strings
  if (/your files have been encrypted|bitcoin|pay the ransom|\.onion|decryption key/i.test(text)) {
    console.log('   HIT: Ransomware');
    findings.push({ level: 'high', message: 'Ransomware-related text found', detail: 'File contains strings commonly seen in ransomware notes.' });
  }

  // — Suspicious obfuscated JS (e.g. from phish kits)
  if (/(eval|atob|btoa|unescape|decodeURIComponent)\s*\(.*?\s*[a-z0-9+/]{100,}/i.test(text)) {
    console.log('   HIT: Obfuscated JS');
    findings.push({ level: 'high', message: 'Obfuscated JavaScript detected', detail: 'Malicious scripts often use encoding to hide their primary payload.' });
  }

  console.log('📄 [FileScanner] Analysis complete. Findings found:', findings.length);
  return findings;
}

// ── STEP 3: SHA-256 hash + VirusTotal lookup ─────────────────
async function hashAndCheckVirusTotal(file) {
  if (!VT_API_KEY) {
    return { error: 'VirusTotal API key not configured' };
  }

  let sha256 = '';
  try {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer  = await crypto.subtle.digest('SHA-256', arrayBuffer);
    sha256 = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (err) {
    return { error: 'Failed to compute file hash: ' + err.message };
  }

  try {
    const res = await fetch(`https://www.virustotal.com/api/v3/files/${sha256}`, {
      headers: { 'x-apikey': VT_API_KEY },
    });

    if (res.status === 404) {
      return { sha256, found: false, note: 'File not found in VirusTotal — it has never been scanned before.' };
    }

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`VT lookup failed (${res.status}): ${errText}`);
    }

    const data    = await res.json();
    const stats   = data.data?.attributes?.last_analysis_stats || {};
    const results = data.data?.attributes?.last_analysis_results || {};

    const flaggedEngines = Object.entries(results)
      .filter(([, v]) => v.category === 'malicious' || v.category === 'suspicious')
      .map(([engine, v]) => ({ engine, verdict: v.category, result: v.result }))
      .slice(0, 20);

    return {
      sha256,
      found: true,
      malicious:    stats.malicious   || 0,
      suspicious:   stats.suspicious  || 0,
      harmless:     stats.harmless    || 0,
      undetected:   stats.undetected  || 0,
      totalEngines: Object.keys(results).length,
      flaggedEngines,
      permalink: `https://www.virustotal.com/gui/file/${sha256}`,
    };
  } catch (err) {
    console.error('VirusTotal file check error:', err);
    return { sha256, error: err.message };
  }
}

// ── Score calculation ─────────────────────────────────────────
function calculateScore(magicResult, contentFindings, vtResult) {
  let score = 100;
  const deductions = [];

  // Mismatch is a huge red flag
  if (magicResult.isMismatch) {
    score -= 50;
    deductions.push({ reason: 'File extension mismatch (Possible disguise)', points: 50 });
  }

  // Dangerous original file type
  if (magicResult.isDangerousTrueType && !magicResult.isMismatch) {
    // If it's a known dangerous type (exe, sh) but not a mismatch (it's named .exe)
    score -= 30;
    deductions.push({ reason: 'High-risk executable format', points: 30 });
  } else if (magicResult.isDangerousTrueType && magicResult.isMismatch) {
    // Already deducted 50, let's add another 20 for the type being high risk
    score -= 20;
    deductions.push({ reason: 'Disguised high-risk executable content', points: 20 });
  }

  // Deduct based on content findings
  for (const finding of contentFindings) {
    // High risk = 40 pts, Medium = 20 pts, Low = 10 pts
    const pts = finding.level === 'high' ? 40 : finding.level === 'medium' ? 20 : 10;
    score -= pts;
    deductions.push({ reason: finding.message, points: pts });
  }

  // VirusTotal Findings (Strong signal)
  if (vtResult && !vtResult.error && vtResult.found) {
    if (vtResult.malicious > 0) {
      // 30 base + progressive based on engine count
      const vtPts = 30 + Math.min(vtResult.malicious * 10, 70); 
      score -= vtPts;
      deductions.push({ reason: `VirusTotal: ${vtResult.malicious} engines flagged this as malicious`, points: vtPts });
    } else if (vtResult.suspicious > 0) {
      score -= 20;
      deductions.push({ reason: 'VirusTotal: flagged as suspicious', points: 20 });
    }
  }

  // Final range normalization
  score = Math.max(0, Math.min(100, score));

  // Verdict thresholds
  // 85 - 100: Safe
  // 55 - 84:  Suspicious
  // 0  - 54:  Dangerous
  let verdict = 'safe';
  if (score < 55) verdict = 'dangerous';
  else if (score < 85) verdict = 'suspicious';

  return { score, verdict, deductions };
}

// ── Main export ───────────────────────────────────────────────
export async function scanFile(file, onProgress) {
  onProgress?.({ step: 1, label: 'Checking file signature (magic bytes)…', done: false });
  const magicResult = await detectMagicBytes(file);

  onProgress?.({ step: 2, label: 'Analysing file contents for threats…', done: false });
  const contentFindings = await analyzeContent(file);

  onProgress?.({ step: 3, label: 'Looking up file hash on VirusTotal…', done: false });
  const vtResult = await hashAndCheckVirusTotal(file);

  onProgress?.({ step: 4, label: 'Calculating risk score…', done: false });
  const { score, verdict, deductions } = calculateScore(magicResult, contentFindings, vtResult);

  onProgress?.({ step: 4, label: 'Scan complete!', done: true });

  return {
    file: {
      name:         file.name,
      size:         file.size,
      lastModified: new Date(file.lastModified).toISOString(),
    },
    magicResult,
    contentFindings,
    vtResult,
    score,
    verdict,
    deductions,
    scannedAt: new Date().toISOString(),
  };
}
