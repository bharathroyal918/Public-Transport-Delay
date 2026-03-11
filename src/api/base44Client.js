// base44Client.js
// Replaced Base44 cloud with Supabase + localStorage fallback
import { createEntityClient } from './dbClient';

// primary db object used by the app; name kept generic so callers don't think `base44` is required
export const db = {
  entities: {
    Route: createEntityClient('routes'),
    DelayRecord: createEntityClient('delay_records'),
    Prediction: createEntityClient('predictions'),
    AppSettings: createEntityClient('app_settings'),
  },
  auth: {
    me: () => Promise.resolve({ id: 'local-user', email: 'local@localhost', full_name: 'Local User' }),
    logout: () => {},
    redirectToLogin: () => {},
  },
};

// legacy name available for backwards compatibility
export const base44 = db;

console.info('base44Client: initialized; using', import.meta.env.VITE_SUPABASE_URL ? 'Supabase' : 'localStorage', 'backend');
