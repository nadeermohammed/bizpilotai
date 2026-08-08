/**
 * Utility for local persistence (localStorage) and optional Supabase cloud sync
 */

export function getRecords(table) {
  const localKey = `bizpilot_${table}`;
  const localData = localStorage.getItem(localKey);
  let records = [];
  
  if (localData) {
    try {
      records = JSON.parse(localData);
    } catch (e) {
      console.error('Failed to parse local records for table:', table, e);
      records = [];
    }
  }

  // Attempt background sync if Supabase is configured
  triggerSupabaseFetch(table);

  return records;
}

export function saveRecord(table, record) {
  const localKey = `bizpilot_${table}`;
  const records = getRecords(table);
  
  // Assign simple unique ID and timestamp if not present
  if (!record.id) {
    record.id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }
  if (!record.created_at) {
    record.created_at = new Date().toISOString();
  }

  // Check if updating or inserting
  const existingIdx = records.findIndex(r => r.id === record.id);
  if (existingIdx >= 0) {
    records[existingIdx] = record;
  } else {
    records.push(record);
  }

  // Save back to local storage
  localStorage.setItem(localKey, JSON.stringify(records));

  // Sync to Supabase in the background if configured
  syncRecordToSupabase(table, record);

  return records;
}

export function deleteRecord(table, recordId) {
  const localKey = `bizpilot_${table}`;
  const records = getRecords(table);
  const updated = records.filter(r => r.id !== recordId);
  
  localStorage.setItem(localKey, JSON.stringify(updated));

  // Sync delete to Supabase if configured
  syncDeleteToSupabase(table, recordId);

  return updated;
}

/* ──────────────────────── Supabase Background REST Sync ──────────────────────── */

async function syncRecordToSupabase(table, record) {
  const url = localStorage.getItem('supabase_url') || import.meta.env.VITE_SUPABASE_URL;
  const anonKey = localStorage.getItem('supabase_anon_key') || import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return;

  try {
    const formattedUrl = url.replace(/\/$/, '');
    
    // We attempt an upsert: POST with Prefer: resolution=merge-duplicates or upsert
    const response = await fetch(`${formattedUrl}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(record)
    });

    if (!response.ok) {
      console.warn(`Supabase REST insert failed (status ${response.status}). Checking table availability...`);
    } else {
      console.log(`Successfully synced record to Supabase table: ${table}`);
    }
  } catch (error) {
    console.warn('Background Supabase Sync failed:', error);
  }
}

async function syncDeleteToSupabase(table, recordId) {
  const url = localStorage.getItem('supabase_url') || import.meta.env.VITE_SUPABASE_URL;
  const anonKey = localStorage.getItem('supabase_anon_key') || import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return;

  try {
    const formattedUrl = url.replace(/\/$/, '');
    await fetch(`${formattedUrl}/rest/v1/${table}?id=eq.${recordId}`, {
      method: 'DELETE',
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`
      }
    });
  } catch (error) {
    console.warn('Background Supabase Delete sync failed:', error);
  }
}

async function triggerSupabaseFetch(table) {
  const url = localStorage.getItem('supabase_url') || import.meta.env.VITE_SUPABASE_URL;
  const anonKey = localStorage.getItem('supabase_anon_key') || import.meta.env.VITE_SUPABASE_ANON_KEY;


  if (!url || !anonKey) return;

  try {
    const formattedUrl = url.replace(/\/$/, '');
    const response = await fetch(`${formattedUrl}/rest/v1/${table}?select=*`, {
      method: 'GET',
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`
      }
    });

    if (response.ok) {
      const dbRecords = await response.json();
      if (Array.isArray(dbRecords) && dbRecords.length > 0) {
        // Merge cloud records into local storage (prefer cloud records if ID matches)
        const localKey = `bizpilot_${table}`;
        const localData = localStorage.getItem(localKey);
        let localRecords = localData ? JSON.parse(localData) : [];

        const mergedMap = new Map();
        localRecords.forEach(r => mergedMap.set(r.id, r));
        dbRecords.forEach(r => mergedMap.set(r.id, r)); // Cloud overwrites local if there's conflict

        const mergedList = Array.from(mergedMap.values());
        localStorage.setItem(localKey, JSON.stringify(mergedList));
      }
    }
  } catch (error) {
    console.warn(`Could not sync fetch ${table} from Supabase:`, error);
  }
}
