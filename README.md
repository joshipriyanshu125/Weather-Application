# ⛅ Weather Dashboard — MERN Application

**Intern Career Path — Web Development**
**Portal ID:** `ICP-2AA73905-2026`
**Project:** Weather Dashboard Application (Week 4 — Project 2)

A full-stack weather dashboard built with **MongoDB, Express, React, and Node.js**, powered by the **OpenWeatherMap API**. It provides live current conditions, hourly and multi-day forecasts, interactive charts, AI-generated weather insights, configurable severe-weather alerts, browser geolocation, and account-based favorite locations.

---

## 🚀 Live Deployment

| Service | URL | Status |
| :--- | :--- | :---: |
| **Frontend (Vercel)** | [https://weather-application-frontend-seven.vercel.app/](https://weather-application-frontend-seven.vercel.app/) | ✅ Live |
| **Backend API (Render)** | [https://weather-application-s73i.onrender.com/](https://weather-application-s73i.onrender.com/) | ✅ Live |
| **Health Check** | [https://weather-application-s73i.onrender.com/health](https://weather-application-s73i.onrender.com/health) | ✅ Live |
| **GitHub Repository** | [github.com/joshipriyanshu125/Weather-Application](https://github.com/joshipriyanshu125/Weather-Application) | ✅ Public |

> **Note:** The backend runs on Render's free tier, so the first request after inactivity may take 30–60 seconds while the service wakes up.

### Quick verification

```bash
# Backend health — should report database "connected" and weatherApi "configured"
curl https://weather-application-s73i.onrender.com/health

# Live weather for a city (no API key needed from the browser)
curl "https://weather-application-s73i.onrender.com/api/weather/current?city=Pune"
```

---

## 📋 Overview

The Weather Dashboard demonstrates real-world **external REST API integration**, **asynchronous data fetching**, **data visualization**, **JWT authentication**, and **MongoDB persistence**. The OpenWeatherMap API key is stored only on the backend — the React client never receives it.

### Feature summary

| Feature | Status | Implementation |
| :--- | :---: | :--- |
| OpenWeatherMap integration | ✅ | Server-side proxy for current weather, forecast, and geocoding |
| City search with suggestions | ✅ | Debounced, keyboard-navigable geocoding search |
| Current conditions | ✅ | Temperature, feels-like, condition, humidity, wind, pressure, visibility, sunrise/sunset |
| Next-24-hour forecast | ✅ | Up to 9 three-hour slots with icons and rain probability |
| Interactive charts | ✅ | recharts temperature area chart + daily precipitation bar chart (lazy-loaded) |
| Multi-day forecast | ✅ | 5 days on the free plan; automatic 7-day upgrade with One Call 3.0 |
| AI weather briefing | ✅ | LLM insights with a deterministic rule-engine fallback that never fails |
| Severe-weather alerts | ✅ | Official OWM alerts + custom temperature/wind thresholds |
| Alert center | ✅ | `/alerts` page with live preview and deduplicated alert history |
| Browser geolocation | ✅ | Permission handling, accuracy display, graceful fallback to city search |
| Authentication | ✅ | Email/password signup and signin with bcrypt + JWT |
| Saved locations | ✅ | Per-user favorites stored in MongoDB |
| Alert preferences | ✅ | Per-user thresholds stored in MongoDB |
| Dark / light theme | ✅ | Persistent theme with condition-aware accent colours |
| Responsive UI | ✅ | Mobile, tablet, and desktop layouts |
| Automated tests | ✅ | 22 backend tests using Node's built-in test runner |

---

## 🏗️ Architecture

```
┌─────────────────────────────┐        HTTPS        ┌──────────────────────────────┐
│  Frontend — Vercel          │ ──────────────────> │  Backend — Render            │
│  React 18 + Vite 5          │                     │  Node.js + Express 4         │
│  weather-application-       │ <────────────────── │  weather-application-s73i    │
│  frontend-seven.vercel.app  │      JSON API       │  .onrender.com               │
└─────────────────────────────┘                     └──────────────┬───────────────┘
                                                                   │
                                          ┌────────────────────────┼────────────────────────┐
                                          │                        │                        │
                                          v                        v                        v
                                 ┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
                                 │ MongoDB Atlas    │   │ OpenWeatherMap   │   │ LLM (optional)   │
                                 │ users, favorites │   │ weather + alerts │   │ AI Gateway /     │
                                 │ history, alerts  │   │ + geocoding      │   │ OpenAI           │
                                 └──────────────────┘   └──────────────────┘   └──────────────────┘
```

**Security principle:** the browser only talks to the Express API. `WEATHER_API_KEY`, `JWT_SECRET`, MongoDB credentials, and any AI key remain server-side.

---

## 🧰 Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, React Router 6, Vite 5, recharts 2, CSS custom properties |
| **Backend** | Node.js 18+, Express 4, ES Modules |
| **Database** | MongoDB Atlas / local MongoDB via Mongoose 8 |
| **Validation** | zod 3 |
| **Authentication** | bcryptjs, jsonwebtoken (JWT Bearer tokens) |
| **Rate limiting** | express-rate-limit (weather, insights, auth tiers) |
| **Weather data** | OpenWeatherMap Current Weather, 5-day Forecast, Geocoding, optional One Call 3.0 |
| **AI insights** | OpenAI-compatible API / Vercel AI Gateway, with a local rule engine fallback |
| **Hosting** | Vercel (frontend), Render (backend), MongoDB Atlas (database) |
| **Testing** | Node.js built-in test runner (`node:test`) |

---

## 📁 Project Structure

```
Weather-Application/
├── README.md                       # This file
├── documentation.md                # Full technical documentation
├── deployment-guide.md             # Step-by-step deployment guide
├── .gitignore
└── Weather Application/
    ├── backend/
    │   ├── package.json
    │   ├── src/
    │   │   ├── server.js           # Express entry point, CORS, routes, / and /health
    │   │   ├── config/db.js        # MongoDB connection
    │   │   ├── models/             # User, SearchHistory, FavoriteCity, UserSettings, AlertHistory
    │   │   ├── routes/             # auth.js, weather.js, settings.js
    │   │   ├── controllers/        # authController, weatherController, settingsController
    │   │   ├── services/           # weatherService, insightsService, alertService
    │   │   └── middleware/         # auth, validate, schemas, errorHandler, rateLimiter
    │   └── tests/api.test.js       # 22 automated tests
    └── frontend/
        ├── package.json
        ├── vite.config.js          # Dev proxy: /api and /health → localhost:5000
        ├── vercel.json             # SPA rewrites for /auth and /alerts
        ├── index.html
        ├── public/favicon.svg
        └── src/
            ├── main.jsx            # Theme → Auth → Router providers
            ├── App.jsx             # Routes: /, /auth, /alerts
            ├── api.js              # Central API client with JWT and base-URL normalization
            ├── context/            # ThemeContext, AuthContext
            ├── hooks/              # useGeolocation + formatting helpers
            ├── pages/              # Dashboard, AuthPage, AlertsPage
            └── components/         # SearchForm, CurrentWeatherCard, StatTiles, HourlyStrip,
                                    # ForecastCharts, ForecastList, WeatherInsights, AlertBanner,
                                    # AlertSettings, FavoritesBar, GeolocationBadge, ThemeToggle
```

---

## 💻 Local Development

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or newer
- npm
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- A free [OpenWeatherMap API key](https://openweathermap.org/api)

### 1. Clone the repository

```bash
git clone https://github.com/joshipriyanshu125/Weather-Application.git
cd Weather-Application
```

### 2. Start the backend

```bash
cd "Weather Application/backend"
npm install
```

Create `Weather Application/backend/.env`:

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb://127.0.0.1:27017/weather_dashboard
# or: MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/weather_dashboard

WEATHER_API_KEY=your_openweathermap_api_key
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173

# Optional — AI weather insights (the rule engine is used when empty)
# OPENAI_API_KEY=sk-...
# AI_GATEWAY_API_KEY=...
# AI_GATEWAY_BASE_URL=https://ai-gateway.vercel.sh/v1
# AI_GATEWAY_MODEL=openai/gpt-4o-mini

# Optional — cache and One Call overrides
# CACHE_TTL_SECONDS=600
# OPENWEATHER_BASE_URL=https://api.openweathermap.org/data/2.5
```

Run it:

```bash
npm run dev
# → Weather API listening on http://localhost:5000
```

### 3. Start the frontend

In a second terminal:

```bash
cd "Weather Application/frontend"
npm install
npm run dev
# → http://localhost:5173
```

During development the frontend uses the Vite proxy, so `/api` and `/health` requests are forwarded to `http://localhost:5000`. No frontend environment variable is required.

### 4. Run the tests

```bash
cd "Weather Application/backend"
npm test
```

Expected result: **22 tests passing**. The tests use Node's built-in runner and do not require a live MongoDB or OpenWeatherMap key.

---

## 🔐 Environment Variables

### Backend (Render)

| Variable | Required | Description |
| :--- | :---: | :--- |
| `PORT` | Auto | Assigned by Render |
| `NODE_ENV` | Recommended | Set to `production` |
| `MONGODB_URI` | ✅ | MongoDB Atlas connection string |
| `WEATHER_API_KEY` | ✅ | OpenWeatherMap key (server-side only) |
| `JWT_SECRET` | ✅ | Long random string used to sign JWTs |
| `JWT_EXPIRES_IN` | Optional | Token lifetime, default `7d` |
| `CLIENT_ORIGIN` | Optional | Allowed frontend origin(s), comma-separated, e.g. `https://weather-application-frontend-seven.vercel.app,http://localhost:5173` |
| `OPENAI_API_KEY` | Optional | Enables LLM-generated insights |
| `AI_GATEWAY_API_KEY` | Optional | Vercel AI Gateway alternative to OpenAI |
| `AI_GATEWAY_BASE_URL` | Optional | Defaults to `https://ai-gateway.vercel.sh/v1` |
| `AI_GATEWAY_MODEL` | Optional | Defaults to `openai/gpt-4o-mini` |
| `CACHE_TTL_SECONDS` | Optional | Weather cache TTL, default `600` |

### Frontend (Vercel)

| Variable | Required | Description |
| :--- | :---: | :--- |
| `VITE_API_BASE_URL` | Optional | Backend base URL. Defaults to the deployed Render API in production builds; empty in development so the Vite proxy is used. |

> Trailing slashes are normalized automatically, so `https://weather-application-s73i.onrender.com` and `https://weather-application-s73i.onrender.com/` both work.

---

## 📡 API Reference

**Base URL:** `https://weather-application-s73i.onrender.com`

| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/` | — | API information and available route groups |
| `GET` | `/health` | — | Server, database, and weather-key status |
| `POST` | `/api/auth/signup` | — | Create an account — `{ name, email, password }` |
| `POST` | `/api/auth/signin` | — | Sign in — `{ email, password }` |
| `GET` | `/api/auth/me` | ✅ | Current signed-in user |
| `GET` | `/api/weather/current` | — | Current weather — `?city=Pune` or `?lat=…&lon=…` |
| `GET` | `/api/weather/forecast` | — | Hourly + daily forecast — city or coordinates |
| `GET` | `/api/weather/search` | — | City suggestions — `?q=Pun` |
| `GET` | `/api/weather/insights` | — | AI/rule-engine weather briefing — city or coordinates, optional `?unit=F` |
| `GET` | `/api/weather/history` | — | Recent search history |
| `DELETE` | `/api/weather/history` | — | Clear search history |
| `GET` | `/api/weather/favorites` | ✅ | List the user's saved cities |
| `POST` | `/api/weather/favorites` | ✅ | Save a city — `{ city, country, coords, label }` |
| `DELETE` | `/api/weather/favorites/:city` | ✅ | Remove a saved city |
| `GET` | `/api/weather/alerts/preview` | ✅ | Evaluate alerts for every saved city |
| `GET` | `/api/weather/alerts/history` | ✅ | Stored alert history for the user |
| `GET` | `/api/settings` | ✅ | Get alert preferences |
| `PUT` | `/api/settings` | ✅ | Update `alertEnabled`, `minTempAlert`, `maxWindAlert` |

Authenticated requests use:

```http
Authorization: Bearer <JWT>
```

### Example requests

```bash
# Current weather
curl "https://weather-application-s73i.onrender.com/api/weather/current?city=Pune"

# Forecast by coordinates
curl "https://weather-application-s73i.onrender.com/api/weather/forecast?lat=18.5204&lon=73.8567"

# Geocoding suggestions
curl "https://weather-application-s73i.onrender.com/api/weather/search?q=Pun"

# Sign up
curl -X POST "https://weather-application-s73i.onrender.com/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{"name":"Demo User","email":"demo@example.com","password":"password123"}'
```

---

## ☁️ Deployment

### Backend on Render

1. Create a **Web Service** from the GitHub repository.
2. **Root Directory:** `Weather Application/backend`
3. **Build Command:** `npm install`
4. **Start Command:** `npm start`
5. Add the backend environment variables listed above.
6. Set `CLIENT_ORIGIN` to the deployed frontend URL:
   `https://weather-application-frontend-seven.vercel.app`
7. Deploy. The service is live at:
   **https://weather-application-s73i.onrender.com/**

Render terminates TLS at a proxy. The server sets `trust proxy` so `express-rate-limit` correctly reads `X-Forwarded-For`.

### Frontend on Vercel

1. Import the same repository.
2. **Root Directory:** `Weather Application/frontend`
3. **Framework Preset:** Vite
4. **Build Command:** `npm run build`
5. **Output Directory:** `dist`
6. Optionally set `VITE_API_BASE_URL=https://weather-application-s73i.onrender.com`.
7. Deploy. The live frontend is:
   **https://weather-application-frontend-seven.vercel.app/**

`vercel.json` provides SPA rewrites so refreshing `/auth` or `/alerts` serves the React app instead of a 404.

---

## 🔍 Troubleshooting

| Symptom | Cause | Fix |
| :--- | :--- | :--- |
| `Route not found: //api/...` | `VITE_API_BASE_URL` had a trailing slash | Fixed by client normalization + server duplicate-slash handling; redeploy both services |
| CORS error in the browser | Frontend origin is not allowed | Set `CLIENT_ORIGIN` to the exact frontend URL (comma-separated list supported) |
| `ERR_ERL_UNEXPECTED_X_FORWARDED_FOR` | Express did not trust Render's proxy | `app.set('trust proxy', 1)` is configured in `server.js` |
| `/health` shows database `disconnected` | MongoDB Atlas network access | Add the Render outbound IPs or `0.0.0.0/0` in Atlas Network Access |
| `401` from weather endpoints | Missing or inactive OpenWeatherMap key | Verify `WEATHER_API_KEY`; new keys can take time to activate |
| `429 Too Many Requests` | Rate limit or OpenWeatherMap quota | Wait for the window to reset or increase `CACHE_TTL_SECONDS` |
| AI insights show the fallback | Missing/invalid AI key or quota exhausted | Add a valid `OPENAI_API_KEY` / `AI_GATEWAY_API_KEY`; the dashboard intentionally falls back to the rule engine |
| First request is slow | Render free-tier cold start | Wait 30–60 seconds; subsequent requests are fast |
| Sign-in works but data does not persist | Backend database disconnected | Check `/health` and the MongoDB Atlas allowlist |

---

## 🧪 Tests

```bash
cd "Weather Application/backend"
npm test
```

The suite covers forecast aggregation, payload normalization, query validation, authentication schemas, alert evaluation, insights fallback, and error handling.

---

## 📚 Documentation

| Document | Description |
| :--- | :--- |
| [`documentation.md`](documentation.md) | Full technical documentation and design decisions |
| [`deployment-guide.md`](deployment-guide.md) | Deployment instructions for Render + Vercel + MongoDB Atlas |

---

## 📬 Project Information

- **Repository:** [Weather-Application](https://github.com/joshipriyanshu125/Weather-Application)
- **Live Frontend:** [weather-application-frontend-seven.vercel.app](https://weather-application-frontend-seven.vercel.app/)
- **Live Backend:** [weather-application-s73i.onrender.com](https://weather-application-s73i.onrender.com/)
- **Portal ID:** `ICP-2AA73905-2026`
- **Internship Track:** Web Development Self-Learning Program
- **Module:** Week 4 — External API Integration & Data Visualization
