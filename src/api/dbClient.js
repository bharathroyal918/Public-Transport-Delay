/**
 * dbClient.js
 * 
 * Unified database client. Uses Supabase when configured, falls back to
 * localStorage for offline/demo mode. Supports: list, create, update,
 * delete, bulkCreate.
 */

import { supabase } from './supabaseClient';

// ─────────────────────────────────────────────────────────────
// localStorage fallback (used when Supabase is not configured)
// ─────────────────────────────────────────────────────────────
const generateId = () =>
  Math.random().toString(36).substr(2, 9) + Date.now().toString(36);

const localGet = (table) => {
  try {
    return JSON.parse(localStorage.getItem(`pt_${table}`) || '[]');
  } catch {
    return [];
  }
};

const localSet = (table, data) =>
  localStorage.setItem(`pt_${table}`, JSON.stringify(data));

const localClient = (table) => ({
  list: (sortField = 'created_date', limit = 1000) => {
    return new Promise((resolve) => {
      let data = [...localGet(table)];
      const field = sortField.replace(/^-/, '');
      const desc = sortField.startsWith('-');
      data.sort((a, b) => {
        const av = a[field] ?? '';
        const bv = b[field] ?? '';
        return desc ? (bv > av ? 1 : -1) : (av > bv ? 1 : -1);
      });
      resolve(data.slice(0, limit));
    });
  },
  create: (data) => {
    return new Promise((resolve) => {
      const records = localGet(table);
      const newRecord = {
        id: generateId(),
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
        ...data,
      };
      records.push(newRecord);
      localSet(table, records);
      resolve(newRecord);
    });
  },
  update: (id, data) => {
    return new Promise((resolve, reject) => {
      const records = localGet(table);
      const idx = records.findIndex((r) => r.id === id);
      if (idx === -1) return reject(new Error(`Record ${id} not found`));
      records[idx] = { ...records[idx], ...data, updated_date: new Date().toISOString() };
      localSet(table, records);
      resolve(records[idx]);
    });
  },
  delete: (id) => {
    return new Promise((resolve) => {
      localSet(table, localGet(table).filter((r) => r.id !== id));
      resolve({ id });
    });
  },
  bulkCreate: (items) => {
    return new Promise((resolve) => {
      const records = localGet(table);
      const newRecords = items.map((data) => ({
        id: generateId(),
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
        ...data,
      }));
      localSet(table, [...records, ...newRecords]);
      resolve(newRecords);
    });
  },
});

// ─────────────────────────────────────────────────────────────
// Supabase client
// ─────────────────────────────────────────────────────────────
const wrapError = (err, table) => {
  // Supabase sometimes returns a cryptic message when the table is missing
  if (err && err.message && err.message.includes('schema cache')) {
    err.message = `Supabase table '${table}' not found. Have you run the schema (supabase_schema.sql) and correctly configured your project URL? Original: ${err.message}`;
  }
  return err;
};

const supabaseClient = (table) => ({
  list: async (sortField = 'created_date', limit = 1000) => {
    const field = sortField.replace(/^-/, '');
    const desc = sortField.startsWith('-');
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .order(field, { ascending: !desc })
      .limit(limit);
    if (error) throw wrapError(error, table);
    return data;
  },
  create: async (item) => {
    const { data, error } = await supabase
      .from(table)
      .insert([{ ...item, created_date: new Date().toISOString(), updated_date: new Date().toISOString() }])
      .select()
      .single();
    if (error) throw wrapError(error, table);
    return data;
  },
  update: async (id, item) => {
    const { data, error } = await supabase
      .from(table)
      .update({ ...item, updated_date: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw wrapError(error, table);
    return data;
  },
  delete: async (id) => {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw wrapError(error, table);
    return { id };
  },
  bulkCreate: async (items) => {
    const now = new Date().toISOString();
    const rows = items.map((item) => ({
      ...item,
      created_date: now,
      updated_date: now,
    }));
    const { data, error } = await supabase.from(table).insert(rows).select();
    if (error) throw wrapError(error, table);
    return data;
  },
});

// ─────────────────────────────────────────────────────────────
// Auto-detect: use Supabase if configured, else localStorage
// ─────────────────────────────────────────────────────────────
const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL || '';
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  // require both pieces and make sure they aren't the obvious placeholders
  return (
    url.length > 0 &&
    key.length > 0 &&
    !url.includes('placeholder') &&
    !url.includes('your-project') &&
    !key.includes('placeholder')
  );
};

export const createEntityClient = (table) => {
  const usingSupabase = isSupabaseConfigured();
  if (usingSupabase) {
    console.info('dbClient: using Supabase for table', table);
    return supabaseClient(table);
  } else {
    console.warn('dbClient: Supabase not configured, falling back to localStorage for table', table);
    return localClient(table);
  }
};
