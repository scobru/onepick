export default async function handler(req, res) {
  // Allow all origins (CORS)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url } = req.query || {};
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Parametro URL mancante' });
  }

  try {
    const targetUrl = decodeURIComponent(url);
    const parsed = new URL(targetUrl);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return res.status(400).json({ error: 'Protocollo non supportato' });
    }

    const abortCtrl = new AbortController();
    const timeout = setTimeout(() => abortCtrl.abort(), 10000);

    const response = await fetch(targetUrl, {
      signal: abortCtrl.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 onepick/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,text/plain,*/*;q=0.8'
      }
    });
    clearTimeout(timeout);

    const text = await response.text();
    const contentType = response.headers.get('content-type') || 'text/plain; charset=utf-8';

    res.setHeader('Content-Type', contentType);
    // Edge cache for 5 minutes (300s) to keep latency low and avoid rate limits
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

    return res.status(response.status).send(text);
  } catch (err) {
    return res.status(502).json({
      error: 'Proxy fetch failed',
      message: err.message || String(err)
    });
  }
}
