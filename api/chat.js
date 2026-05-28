const allowedOriginPatterns = [
  /^https:\/\/2313623432\.github\.io$/,
  /^https:\/\/.+\.vercel\.app$/,
  /^http:\/\/localhost:\d+$/,
  /^http:\/\/127\.0\.0\.1:\d+$/
];

function normalizeBaseUrl(baseUrl = '') {
  return String(baseUrl).trim().replace(/\/+$/, '');
}

function normalizeProviderBaseUrl(baseUrl = '') {
  const normalized = normalizeBaseUrl(baseUrl);
  if (!normalized) return '';

  try {
    const url = new URL(normalized);
    if (url.hostname === 'platform.deepseek.com') return 'https://api.deepseek.com';
    return normalized;
  } catch {
    return normalized;
  }
}

function resolveChatEndpoint(baseUrl = '') {
  const normalized = normalizeProviderBaseUrl(baseUrl);
  if (!normalized) return '';
  return normalized.endsWith('/chat/completions') ? normalized : `${normalized}/chat/completions`;
}

function isAllowedOrigin(origin = '') {
  return allowedOriginPatterns.some((pattern) => pattern.test(origin));
}

function applyCors(req, res) {
  const origin = req.headers?.origin || '';
  const allowOrigin = isAllowedOrigin(origin) ? origin : 'https://2313623432.github.io';
  res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');
}

function getPayload(req) {
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}');
  return req.body || {};
}

async function readModelError(response) {
  const text = await response.text();
  try {
    const json = JSON.parse(text);
    return json.error?.message || json.error || json.message || text;
  } catch {
    return text;
  }
}

export default async function handler(req, res) {
  applyCors(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只支持 POST 请求。' });
  }

  try {
    const { baseUrl, apiKey, requestBody } = getPayload(req);
    const endpoint = resolveChatEndpoint(baseUrl);

    if (!endpoint || !apiKey || !requestBody?.model || !Array.isArray(requestBody?.messages)) {
      return res.status(400).json({ error: '缺少 baseUrl、apiKey、model 或 messages。' });
    }

    const modelResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!modelResponse.ok) {
      const message = await readModelError(modelResponse);
      return res.status(modelResponse.status).json({ error: message.slice(0, 500) });
    }

    const data = await modelResponse.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message || '代理请求失败。' });
  }
}
