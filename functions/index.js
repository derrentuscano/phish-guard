const functions = require('firebase-functions');
const https = require('https');

/**
 * Thin proxy that forwards requests from the browser to the HuggingFace
 * Inference API. This avoids CORS entirely — the browser calls this function
 * (same domain via Firebase Hosting rewrite), and this function calls HF
 * server-to-server.
 *
 * Route: /hf-proxy/models/<model-id>
 * Maps to: https://api-inference.huggingface.co/models/<model-id>
 */
exports.hfProxy = functions.https.onRequest((req, res) => {
  // Allow CORS from the hosting domain
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  // Strip the /hf-proxy prefix to get the HF path
  const hfPath = req.path.replace(/^\/hf-proxy/, '') || '/';

  const options = {
    hostname: 'api-inference.huggingface.co',
    path: hfPath,
    method: 'POST',
    headers: {
      Authorization: req.headers['authorization'] || '',
      'Content-Type': req.headers['content-type'] || 'application/octet-stream',
    },
  };

  const hfReq = https.request(options, (hfRes) => {
    res.status(hfRes.statusCode);
    hfRes.headers['content-type'] && res.set('Content-Type', hfRes.headers['content-type']);
    hfRes.pipe(res);
  });

  hfReq.on('error', (err) => {
    console.error('HF proxy error:', err);
    res.status(502).json({ error: 'HuggingFace proxy error', detail: err.message });
  });

  // Pipe request body (image binary) through to HF
  req.pipe(hfReq);
});
