import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import weatherRoutes from './routes/weather.js';
import authRoutes from './routes/auth.js';
import settingsRoutes from './routes/settings.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.disable('x-powered-by');

/**
 * Render terminates TLS at a proxy and forwards the real client IP in
 * X-Forwarded-For. Without trusting that proxy, express-rate-limit refuses
 * the header and throws ERR_ERL_UNEXPECTED_X_FORWARDED_FOR on every request.
 */
app.set('trust proxy', 1);

// Collapse duplicate slashes in the request path (e.g. `//api/auth/signin`)
// so a misconfigured API base URL with a trailing slash still resolves.
app.use((req, res, next) => {
  const [path, query] = req.url.split('?');
  const normalized = path.replace(/\/{2,}/g, '/');
  req.url = query ? `${normalized}?${query}` : normalized;
  next();
});

// The deployed frontend origin is always allowed, even if CLIENT_ORIGIN on the
// host is missing or still points at localhost.
const PRODUCTION_ORIGINS = ['https://weather-application-frontend-seven.vercel.app'];
const DEFAULT_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:4173',
  ...PRODUCTION_ORIGINS
];
const configuredOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);

// If CLIENT_ORIGIN isn't configured, reflect the caller's origin so a freshly
// deployed frontend can connect. Set CLIENT_ORIGIN (comma-separated is fine)
// to lock the API down to specific sites.
const allowAnyOrigin = configuredOrigins.length === 0;
const allowedOrigins = [...new Set([...DEFAULT_ORIGINS, ...configuredOrigins])];
const VERCEL_PREVIEW_ORIGIN = /^https:\/\/weather-application-frontend-[a-z0-9-]+\.vercel\.app$/i;

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowAnyOrigin) return callback(null, true);
      const normalized = origin.replace(/\/$/, '');
      callback(null, allowedOrigins.includes(normalized) || VERCEL_PREVIEW_ORIGIN.test(normalized));
    },
    credentials: true
  })
);
app.use(express.json({ limit: '100kb' }));

// Root — lets you verify the deployed service from a browser
app.get('/', (req, res) => {
  res.json({
    ok: true,
    service: 'Weather Dashboard API',
    message: 'API is running. Use one of the endpoints below.',
    health: '/health',
    endpoints: {
      auth: '/api/auth',
      weather: '/api/weather',
      settings: '/api/settings'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    ok: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      database: globalThis.dbConnected ? 'connected' : 'disconnected',
      weatherApi: process.env.WEATHER_API_KEY ? 'configured' : 'missing'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/settings', settingsRoutes);

app.use(notFound);
app.use(errorHandler);

async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Weather API listening on http://localhost:${PORT}`);
      if (!process.env.WEATHER_API_KEY) {
        console.warn('[config] WEATHER_API_KEY is not set — /api/weather endpoints will fail.');
      }
    });
  } catch (err) {
    console.error('[startup] Failed to start server:', err.message);
    process.exit(1);
  }
}

start();
