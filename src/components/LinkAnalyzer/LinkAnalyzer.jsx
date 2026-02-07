import React, { useState } from 'react';
import { 
  Link as LinkIcon, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Shield,
  Search
} from 'lucide-react';
import './LinkAnalyzer.css';

const LinkAnalyzer = () => {
  const [url, setUrl] = useState('');
  const [analysis, setAnalysis] = useState(null);

  const analyzeURL = (e) => {
    e.preventDefault();
    if (!url) return;

    const results = {
      url: url,
      threats: [],
      score: 100,
      verdict: 'safe'
    };

    // Check for HTTP instead of HTTPS
    if (url.toLowerCase().startsWith('http://')) {
      results.threats.push({
        level: 'warning',
        message: 'Not using HTTPS - data is not encrypted',
        impact: -15
      });
      results.score -= 15;
    }

    // Check for IP address instead of domain
    if (/https?:\/\/\d+\.\d+\.\d+\.\d+/.test(url)) {
      results.threats.push({
        level: 'high',
        message: 'Uses IP address instead of domain name - highly suspicious',
        impact: -40
      });
      results.score -= 40;
    }

    // Check for common character substitutions
    const suspiciousPatterns = [
      { pattern: /paypa1|g00gle|faceb00k|amaz0n|micr0soft/i, name: 'Character substitution (0 for O, 1 for l)' },
      { pattern: /\d{3,}/, name: 'Contains long number sequences' },
    ];

    suspiciousPatterns.forEach(({ pattern, name }) => {
      if (pattern.test(url)) {
        results.threats.push({
          level: 'high',
          message: name,
          impact: -30
        });
        results.score -= 30;
      }
    });

    // Check for suspicious TLDs
    const suspiciousTLDs = ['.tk', '.ml', '.ga', '.cf', '.gq', '.xyz'];
    if (suspiciousTLDs.some(tld => url.toLowerCase().includes(tld))) {
      results.threats.push({
        level: 'medium',
        message: 'Uses a suspicious top-level domain often associated with phishing',
        impact: -25
      });
      results.score -= 25;
    }

    // Check for excessive subdomains
    const urlParts = url.replace(/https?:\/\//, '').split('/')[0];
    const subdomains = urlParts.split('.');
    if (subdomains.length > 4) {
      results.threats.push({
        level: 'medium',
        message: 'Excessive subdomains - may be trying to hide the real domain',
        impact: -20
      });
      results.score -= 20;
    }

    // Check for suspicious keywords in URL
    const phishingKeywords = ['verify', 'account', 'secure', 'update', 'confirm', 'login', 'banking'];
    const foundKeywords = phishingKeywords.filter(keyword => 
      url.toLowerCase().includes(keyword)
    );
    if (foundKeywords.length >= 2) {
      results.threats.push({
        level: 'warning',
        message: `Contains suspicious keywords: ${foundKeywords.join(', ')}`,
        impact: -15
      });
      results.score -= 15;
    }

    // Check for URL shorteners
    const shorteners = ['bit.ly', 'tinyurl', 'goo.gl', 't.co', 'ow.ly'];
    if (shorteners.some(shortener => url.toLowerCase().includes(shortener))) {
      results.threats.push({
        level: 'warning',
        message: 'URL shortener detected - destination is hidden',
        impact: -10
      });
      results.score -= 10;
    }

    // Check for @ symbol (used to trick users about the actual domain)
    if (url.includes('@')) {
      results.threats.push({
        level: 'high',
        message: '@ symbol in URL - everything before @ is ignored by browsers',
        impact: -35
      });
      results.score -= 35;
    }

    // Determine verdict
    results.score = Math.max(0, results.score);
    if (results.score >= 80) {
      results.verdict = 'safe';
    } else if (results.score >= 50) {
      results.verdict = 'suspicious';
    } else {
      results.verdict = 'dangerous';
    }

    setAnalysis(results);
  };

  const sampleURLs = [
    { url: 'https://www.google.com', type: 'safe' },
    { url: 'http://paypa1-secure.com/login', type: 'phishing' },
    { url: 'https://login.microsofft-account.support.com', type: 'phishing' },
    { url: 'http://192.168.1.100/banking', type: 'suspicious' },
    { url: 'https://github.com', type: 'safe' },
    { url: 'https://secure-verify-account-amazon.tk', type: 'phishing' }
  ];

  const loadSample = (sampleUrl) => {
    setUrl(sampleUrl);
    setAnalysis(null);
  };

  return (
    <div className="link-analyzer-container fade-in">
      <div className="container">
        <div className="analyzer-header">
          <LinkIcon size={48} className="header-icon" />
          <h1>🔗 Link Analyzer</h1>
          <p>Learn to identify suspicious URLs and phishing links</p>
        </div>

        <div className="analyzer-card card">
          <form onSubmit={analyzeURL}>
            <div className="input-group">
              <label htmlFor="url">Enter a URL to analyze:</label>
              <div className="url-input-wrapper">
                <input
                  type="text"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="url-input"
                />
                <button type="submit" className="btn btn-primary">
                  <Search size={20} />
                  Analyze
                </button>
              </div>
            </div>
          </form>

          <div className="sample-urls">
            <p><strong>Try these sample URLs:</strong></p>
            <div className="sample-buttons">
              {sampleURLs.map((sample, index) => (
                <button
                  key={index}
                  onClick={() => loadSample(sample.url)}
                  className="sample-btn"
                >
                  {sample.url}
                  <span className={`sample-type ${sample.type}`}>
                    {sample.type === 'safe' ? '✅' : sample.type === 'phishing' ? '🎣' : '⚠️'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {analysis && (
          <div className="analysis-results fade-in">
            <div className="result-header">
              <div className={`verdict-badge ${analysis.verdict}`}>
                {analysis.verdict === 'safe' && <CheckCircle size={32} />}
                {analysis.verdict === 'suspicious' && <AlertTriangle size={32} />}
                {analysis.verdict === 'dangerous' && <XCircle size={32} />}
                <span>{analysis.verdict.toUpperCase()}</span>
              </div>
              <div className="score-display">
                <div className="score-label">Safety Score</div>
                <div className="score-value">{analysis.score}/100</div>
              </div>
            </div>

            <div className="analyzed-url card">
              <strong>Analyzed URL:</strong>
              <div className="url-display">{analysis.url}</div>
            </div>

            {analysis.threats.length > 0 ? (
              <div className="threats-section">
                <h3>
                  <AlertTriangle size={24} />
                  Detected Threats ({analysis.threats.length})
                </h3>
                <div className="threats-list">
                  {analysis.threats.map((threat, index) => (
                    <div key={index} className={`threat-item ${threat.level}`}>
                      <div className="threat-icon">
                        {threat.level === 'high' && <XCircle size={20} />}
                        {threat.level === 'medium' && <AlertTriangle size={20} />}
                        {threat.level === 'warning' && <AlertTriangle size={20} />}
                      </div>
                      <div className="threat-content">
                        <div className="threat-message">{threat.message}</div>
                        <div className="threat-impact">Impact: {threat.impact} points</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="no-threats card">
                <CheckCircle size={32} />
                <h3>No threats detected!</h3>
                <p>This URL appears to be safe based on our analysis.</p>
              </div>
            )}

            <div className="tips-section card">
              <h3>
                <Shield size={24} />
                Security Tips
              </h3>
              <ul>
                <li>Always check the domain name carefully - look for misspellings</li>
                <li>Prefer HTTPS over HTTP for secure connections</li>
                <li>Be cautious of URLs with IP addresses instead of domain names</li>
                <li>Watch for character substitutions (0 for O, 1 for l)</li>
                <li>Verify the domain before clicking - hover over links to preview</li>
                <li>Be wary of shortened URLs that hide the destination</li>
                <li>Check for unusual subdomains or extra words in the domain</li>
                <li>When in doubt, go directly to the website rather than clicking links</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkAnalyzer;
