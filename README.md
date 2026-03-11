# TransitPredict — Local Setup Guide

A full-stack public transport delay analytics app with ML predictions.
Runs locally with either **Supabase** (real DB + auth) or **localStorage** (offline/demo mode).

---

## Quick Start

```bash
npm install
npm run dev
```

Open: http://localhost:5173

> No setup needed for demo mode — data is stored in your browser's localStorage.

---

## Enable Real Database (Supabase)

### Step 1: Create a Supabase project
Go to https://app.supabase.com → New project

### Step 2: Run the schema
In Supabase → SQL Editor → New Query, paste and run the contents of **`supabase_schema.sql`**

> **Troubleshooting:** If you later see errors like
> `Could not find the table 'public.routes' in the schema cache` when the
> app tries to generate data, it means the schema wasn’t applied to the
> project you’re connected to. Make sure the SQL ran successfully and that
> your `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` point to the same
> project. You can verify by opening the **Table editor** in Supabase and
> confirming that `routes`, `delay_records`, `predictions`, and
> `app_settings` exist.

### Step 3: Get your credentials
Supabase → Project Settings → API:
- **Project URL** (looks like `https://xxxx.supabase.co`)
- **anon/public key**

### Step 4: Add to `.env`
```env
VITE_SUPABASE_URL=https://axuyaockmuflkbhrfett.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4dXlhb2NrbXVmbGtiaHJmZXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMDI5NzksImV4cCI6MjA4ODc3ODk3OX0.a0LOiVd3q6JAjynR2JyN6QWWKpKwx7pqopn39__ljPQ

# Google Maps API Key (optional - for route input on Predictions page)
VITE_GOOGLE_MAPS_API_KEY="AIzaSyCi3U0TUQmlrrrVOaR-aG6k4KNusN8DOKg"
```

Restart `npm run dev` — the app will now use Supabase automatically.

---

## Authentication

When Supabase is configured, full auth is enabled:

| Feature | Supported |
|---|---|
| Email + Password sign up/in | ✅ |
| Google OAuth | ✅ (enable in Supabase → Auth → Providers) |
| GitHub OAuth | ✅ (enable in Supabase → Auth → Providers) |
| Password reset via email | ✅ |
| Protected routes | ✅ |
| Guest mode (no config) | ✅ |

---

## Install Dependencies

```bash
npm install
```

### Key libraries used

| Library | Purpose |
|---|---|
| `react` + `react-dom` | UI framework |
| `react-router-dom` | Routing |
| `@tanstack/react-query` | Data fetching |
| `@supabase/supabase-js` | Database + Auth |
| `recharts` | Charts |
| `tailwindcss` | Styling |
| `lucide-react` | Icons |
| `framer-motion` | Animations |
| `sonner` | Toast notifications |
| `@radix-ui/*` | UI primitives |
| `react-hook-form` + `zod` | Forms |
| `@react-google-maps/api` | Maps (needs API key) |

---

## What Changed from Base44

| File | Change |
|---|---|
| `src/api/supabaseClient.js` | NEW — Supabase client |
| `src/api/dbClient.js` | NEW — Supabase + localStorage fallback |
| `src/api/base44Client.js` | Replaced SDK with dbClient |
| `src/lib/AuthContext.jsx` | Full Supabase auth (signup, login, OAuth, reset) |
| `src/Layout.jsx` | Added user profile dropdown + logout |
| `src/App.jsx` | Protected routes + auth pages routing |
| `src/pages/Login.jsx` | NEW — Login page |
| `src/pages/Signup.jsx` | NEW — Signup page |
| `src/pages/ForgotPassword.jsx` | NEW — Password reset page |
| `src/lib/NavigationTracker.jsx` | Removed Base44 dependency |
| `src/lib/PageNotFound.jsx` | Removed Base44 dependency |
| `vite.config.js` | Removed @base44 plugin, fixed @ alias |
| `package.json` | Removed @base44 packages, added @supabase/supabase-js |
| `supabase_schema.sql` | NEW — Database schema |

---

## Google Maps (Optional)

Add to `.env`:
```
VITE_GOOGLE_MAPS_API_KEY=your_key_here
```

Get a key: https://console.cloud.google.com/
