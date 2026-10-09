import crypto from 'crypto';
import express from 'express';

const app = express();
const PORT = Number(process.env.PORT || 3001);
const DEFAULT_CURRENCY = 'USD';
const ADMIN_ID = process.env.ADMIN_ID || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'change-me-in-production';
const SESSION_TTL_MS = 1000 * 60 * 60 * 8;
const ADMIN_COOKIE_NAME = 'admin_session';
const sessions = new Map();
const purchasedBookIds = new Set();

const FALLBACK_EXCHANGE_RATES = {
  USD: 1,
  INR: 83,
  GBP: 0.78,
  EUR: 0.92,
  AED: 3.67,
  SGD: 1.35,
  AUD: 1.52,
  CAD: 1.38,
  JPY: 150,
};

const COUNTRY_CURRENCY_MAP = {
  US: 'USD',
  IN: 'INR',
  GB: 'GBP',
  DE: 'EUR',
  FR: 'EUR',
  AT: 'EUR',
  BE: 'EUR',
  CY: 'EUR',
  EE: 'EUR',
  ES: 'EUR',
  FI: 'EUR',
  GR: 'EUR',
  HR: 'EUR',
  IT: 'EUR',
  IE: 'EUR',
  LT: 'EUR',
  LU: 'EUR',
  LV: 'EUR',
  MT: 'EUR',
  NL: 'EUR',
  PT: 'EUR',
  SK: 'EUR',
  SI: 'EUR',
  AE: 'AED',
  SG: 'SGD',
  AU: 'AUD',
  CA: 'CAD',
  JP: 'JPY',
};

let exchangeRates = { ...FALLBACK_EXCHANGE_RATES };
let rateLastFetchedAt = 0;

function getSessionCookie(request) {
  const cookieHeader = request.headers.cookie || '';
  const match = cookieHeader.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${ADMIN_COOKIE_NAME}=`));
  return match ? decodeURIComponent(match.split('=')[1]) : null;
}

function createSessionToken() {
  return crypto.randomBytes(32).toString('hex');
}

function setSessionCookie(response, sessionId) {
  const secureFlag = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  response.setHeader('Set-Cookie', `${ADMIN_COOKIE_NAME}=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}${secureFlag}`);
}

function clearSessionCookie(response) {
  response.setHeader('Set-Cookie', `${ADMIN_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
}

function isAuthenticatedRequest(request) {
  const sessionId = getSessionCookie(request);
  if (!sessionId) return false;
  const session = sessions.get(sessionId);
  if (!session) return false;
  if (session.expiresAt < Date.now()) {
    sessions.delete(sessionId);
    return false;
  }
  session.expiresAt = Date.now() + SESSION_TTL_MS;
  return true;
}

async function fetchExchangeRates() {
  const now = Date.now();
  if (now - rateLastFetchedAt < 1000 * 60 * 60 * 6) {
    return exchangeRates;
  }

  try {
    const response = await fetch('https://open.er-api.com/v6/latest/USD');
    if (!response.ok) {
      return exchangeRates;
    }

    const payload = await response.json();
    const nextRates = payload?.rates && typeof payload.rates === 'object' ? payload.rates : null;
    if (!nextRates) {
      return exchangeRates;
    }

    exchangeRates = {
      USD: 1,
      INR: Number(nextRates.INR ?? FALLBACK_EXCHANGE_RATES.INR),
      GBP: Number(nextRates.GBP ?? FALLBACK_EXCHANGE_RATES.GBP),
      EUR: Number(nextRates.EUR ?? FALLBACK_EXCHANGE_RATES.EUR),
      AED: Number(nextRates.AED ?? FALLBACK_EXCHANGE_RATES.AED),
      SGD: Number(nextRates.SGD ?? FALLBACK_EXCHANGE_RATES.SGD),
      AUD: Number(nextRates.AUD ?? FALLBACK_EXCHANGE_RATES.AUD),
      CAD: Number(nextRates.CAD ?? FALLBACK_EXCHANGE_RATES.CAD),
      JPY: Number(nextRates.JPY ?? FALLBACK_EXCHANGE_RATES.JPY),
    };
    rateLastFetchedAt = now;
  } catch {
    // Keep the last known exchange rate snapshot and fall back to the local default map.
  }

  return exchangeRates;
}

function getClientIp(request) {
  const forwarded = request.headers['x-forwarded-for'];
  if (Array.isArray(forwarded)) return forwarded[0];
  if (typeof forwarded === 'string') return forwarded.split(',')[0]?.trim();
  return request.socket?.remoteAddress || '127.0.0.1';
}

async function resolveCurrencyFromRequest(request) {
  const ip = getClientIp(request);
  const fallbackCountry = 'US';

  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    if (!response.ok) {
      return { countryCode: fallbackCountry, countryName: 'United States', currency: DEFAULT_CURRENCY };
    }

    const payload = await response.json();
    const countryCode = (payload?.country_code || fallbackCountry).toUpperCase();
    const currency = COUNTRY_CURRENCY_MAP[countryCode] || DEFAULT_CURRENCY;

    return {
      countryCode,
      countryName: payload?.country_name || 'Unknown Region',
      currency,
    };
  } catch {
    return { countryCode: fallbackCountry, countryName: 'United States', currency: DEFAULT_CURRENCY };
  }
}

app.use(express.json());

app.get('/api/geo', async (request, response) => {
  const rates = await fetchExchangeRates();
  const region = await resolveCurrencyFromRequest(request);

  response.json({
    success: true,
    region,
    currency: region.currency,
    defaultCurrency: DEFAULT_CURRENCY,
    exchangeRates: rates,
  });
});

app.post('/api/admin/login', (request, response) => {
  const { adminId, password } = request.body || {};
  const normalizedId = String(adminId || '').trim();
  const normalizedPassword = String(password || '').trim();

  if (normalizedId !== ADMIN_ID || normalizedPassword !== ADMIN_PASSWORD) {
    return response.status(401).json({ success: false, message: 'Invalid admin credentials.' });
  }

  const sessionId = createSessionToken();
  sessions.set(sessionId, { adminId: ADMIN_ID, expiresAt: Date.now() + SESSION_TTL_MS });
  setSessionCookie(response, sessionId);

  return response.json({ success: true, adminId: ADMIN_ID, authenticated: true });
});

app.post('/api/admin/logout', (request, response) => {
  const sessionId = getSessionCookie(request);
  if (sessionId) sessions.delete(sessionId);
  clearSessionCookie(response);
  return response.json({ success: true });
});

app.get('/api/admin/me', (request, response) => {
  const authenticated = isAuthenticatedRequest(request);
  return response.json({
    authenticated,
    adminId: authenticated ? ADMIN_ID : null,
  });
});

app.get('/api/purchases/:bookId', (request, response) => {
  if (!isAuthenticatedRequest(request)) {
    return response.status(401).json({ success: false, purchased: false, message: 'Authentication required.' });
  }

  const bookId = Number(request.params.bookId);
  return response.json({ success: true, purchased: purchasedBookIds.has(bookId) });
});

app.post('/api/purchases/:bookId', (request, response) => {
  if (!isAuthenticatedRequest(request)) {
    return response.status(401).json({ success: false, message: 'Authentication required.' });
  }

  const bookId = Number(request.params.bookId);
  if (!Number.isFinite(bookId)) {
    return response.status(400).json({ success: false, message: 'Invalid book id.' });
  }

  purchasedBookIds.add(bookId);
  return response.json({ success: true, purchased: true, bookId });
});

app.get('/api/purchases', (request, response) => {
  if (!isAuthenticatedRequest(request)) {
    return response.status(401).json({ success: false, purchases: [] });
  }

  return response.json({ success: true, purchases: Array.from(purchasedBookIds).sort((a, b) => a - b) });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Regional pricing API listening on http://0.0.0.0:${PORT}`);
});
