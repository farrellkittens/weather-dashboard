const crypto = require('crypto');

const DEFAULT_TTL_SECONDS = 10 * 60;
const MAX_TTL_SECONDS = 60 * 60;
const CACHE_PREFIX = 'nws-cache:v2:';

function sendJson(res, status, body, headers = {}) {
  res.statusCode = status;
  Object.entries({
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    ...headers,
  }).forEach(([key, value]) => res.setHeader(key, value));
  res.end(JSON.stringify(body));
}

function allowedNwsUrl(rawUrl) {
  let url;
  try {
    url = new URL(rawUrl);
  } catch (_) {
    return null;
  }
  if (url.protocol !== 'https:') return null;
  if (url.hostname !== 'api.weather.gov') return null;
  if (!/^\/(points|gridpoints)\//.test(url.pathname)) return null;
  return url.toString();
}

function cacheKey(url) {
  const hash = crypto.createHash('sha256').update(url).digest('hex');
  return `${CACHE_PREFIX}${hash}`;
}

async function redisCommand(command) {
  const restUrl = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!restUrl || !token) return { skipped: true };

  const response = await fetch(restUrl, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(command),
  });
  if (!response.ok) throw new Error(`Redis request failed: ${response.status}`);
  return response.json();
}

async function readCache(key) {
  const data = await redisCommand(['GET', key]);
  if (data.skipped || data.result == null) return null;
  try {
    return JSON.parse(data.result);
  } catch (_) {
    return null;
  }
}

async function writeCache(key, value, ttlSeconds) {
  await redisCommand(['SET', key, JSON.stringify(value), 'EX', String(ttlSeconds)]);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  const targetUrl = allowedNwsUrl(req.query?.url);
  if (!targetUrl) {
    sendJson(res, 400, { error: 'Only api.weather.gov points and gridpoints URLs are allowed.' });
    return;
  }

  const ttlSeconds = Math.min(
    MAX_TTL_SECONDS,
    Math.max(60, Number(req.query?.ttlSeconds) || DEFAULT_TTL_SECONDS)
  );
  const key = cacheKey(targetUrl);

  try {
    const cached = await readCache(key);
    if (cached) {
      sendJson(res, 200, cached, { 'x-cache': 'HIT' });
      return;
    }
  } catch (_) {
    // If Redis is unavailable, keep the proxy useful by falling through to NWS.
  }

  try {
    const upstream = await fetch(targetUrl, {
      headers: {
        accept: 'application/geo+json, application/json',
        'user-agent': 'weather-dashboard-cache/1.0',
      },
    });
    const text = await upstream.text();
    if (!upstream.ok) {
      sendJson(res, upstream.status, { error: `NWS request failed: ${upstream.status}` });
      return;
    }

    const json = JSON.parse(text);
    writeCache(key, json, ttlSeconds).catch(() => {});
    sendJson(res, 200, json, { 'x-cache': 'MISS' });
  } catch (error) {
    sendJson(res, 502, { error: error.message || 'Proxy request failed.' });
  }
};
