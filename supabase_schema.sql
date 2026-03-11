-- ============================================================
-- TransitPredict — Supabase Schema
-- Run this in your Supabase SQL Editor:
-- https://app.supabase.com → Project → SQL Editor → New Query
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────
-- ROUTES
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS routes (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  route_name    TEXT NOT NULL,
  route_type    TEXT CHECK (route_type IN ('bus', 'train', 'metro')) NOT NULL,
  origin        TEXT NOT NULL,
  destination   TEXT NOT NULL,
  distance_km   NUMERIC,
  estimated_duration_mins INTEGER,
  stops_count   INTEGER,
  peak_hours    TEXT[],
  avg_daily_passengers INTEGER,
  created_date  TIMESTAMPTZ DEFAULT NOW(),
  updated_date  TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- DELAY RECORDS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS delay_records (
  id                        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  route_id                  UUID REFERENCES routes(id) ON DELETE SET NULL,
  route_name                TEXT NOT NULL,
  route_type                TEXT CHECK (route_type IN ('bus', 'train', 'metro')),
  delay_minutes             NUMERIC NOT NULL,
  delay_category            TEXT CHECK (delay_category IN ('on_time', 'minor', 'moderate', 'severe')),
  date                      DATE NOT NULL,
  day_of_week               TEXT,
  hour                      INTEGER,
  is_peak_hour              BOOLEAN,
  temperature_c             NUMERIC,
  precipitation_mm          NUMERIC,
  wind_speed_kmh            NUMERIC,
  visibility_km             NUMERIC,
  weather_condition         TEXT CHECK (weather_condition IN ('clear','cloudy','rainy','stormy','foggy','snowy')),
  has_event                 BOOLEAN DEFAULT FALSE,
  event_type                TEXT CHECK (event_type IN ('none','sports','concert','festival','conference','parade')),
  event_crowd_size          INTEGER,
  traffic_congestion_level  INTEGER CHECK (traffic_congestion_level BETWEEN 1 AND 10),
  created_date              TIMESTAMPTZ DEFAULT NOW(),
  updated_date              TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- PREDICTIONS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS predictions (
  id                        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  route_id                  UUID,
  route_name                TEXT,
  predicted_delay_minutes   NUMERIC,
  predicted_category        TEXT,
  confidence_score          NUMERIC,
  model_used                TEXT,
  input_parameters          JSONB,
  prediction_date           DATE,
  map_route                 JSONB,
  created_date              TIMESTAMPTZ DEFAULT NOW(),
  updated_date              TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- APP SETTINGS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS app_settings (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key         TEXT UNIQUE,
  value       JSONB,
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS)
-- Uncomment to restrict data per-user
-- ─────────────────────────────────────────
-- ALTER TABLE routes       ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE delay_records ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE predictions  ENABLE ROW LEVEL SECURITY;

-- Public read/write policies (simple - all authenticated users):
-- CREATE POLICY "Allow authenticated" ON routes       FOR ALL USING (auth.role() = 'authenticated');
-- CREATE POLICY "Allow authenticated" ON delay_records FOR ALL USING (auth.role() = 'authenticated');
-- CREATE POLICY "Allow authenticated" ON predictions  FOR ALL USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────
-- INDEXES for performance
-- ─────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_delay_records_route_name ON delay_records(route_name);
CREATE INDEX IF NOT EXISTS idx_delay_records_date       ON delay_records(date);
CREATE INDEX IF NOT EXISTS idx_delay_records_created    ON delay_records(created_date DESC);
CREATE INDEX IF NOT EXISTS idx_predictions_created      ON predictions(created_date DESC);
CREATE INDEX IF NOT EXISTS idx_routes_created           ON routes(created_date DESC);
