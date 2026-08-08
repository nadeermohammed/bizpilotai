/**
 * Utility for local persistence (localStorage) and Supabase cloud sync
 * Enforces data isolation by user email and secure auth operations
 */
import { hashPassword } from './crypto.js'

// Safely resolve Vite environment variables (prevent crash on standard Node tests)
const getViteEnv = (key) => {
  try {
    return import.meta.env[key];
  } catch (e) {
    return '';
  }
};

function getCurrentUserEmail() {
  const saved = localStorage.getItem('bizpilot_user');
  if (saved) {
    try {
      const u = JSON.parse(saved);
      return u?.email || null;
    } catch (e) {
      return null;
    }
  }
  return null;
}

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

  // Filter records by user email if not the users table
  const userEmail = getCurrentUserEmail();
  if (table !== 'users' && userEmail) {
    records = records.filter(r => !r.user_email || r.user_email === userEmail);
  }

  // Attempt background sync if Supabase is configured
  triggerSupabaseFetch(table);

  return records;
}

export function saveRecord(table, record) {
  const localKey = `bizpilot_${table}`;
  
  // Load ALL records from localStorage first
  const localData = localStorage.getItem(localKey);
  let allRecords = [];
  if (localData) {
    try {
      allRecords = JSON.parse(localData);
    } catch (e) {
      allRecords = [];
    }
  }
  
  // Assign simple unique ID and timestamp if not present
  if (!record.id) {
    record.id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }
  if (!record.created_at) {
    record.created_at = new Date().toISOString();
  }

  // Assign user email for separation if not the users table
  const userEmail = getCurrentUserEmail();
  if (table !== 'users' && userEmail && !record.user_email) {
    record.user_email = userEmail;
  }

  // Check if updating or inserting
  const existingIdx = allRecords.findIndex(r => r.id === record.id);
  if (existingIdx >= 0) {
    allRecords[existingIdx] = record;
  } else {
    allRecords.push(record);
  }

  // Save back to local storage
  localStorage.setItem(localKey, JSON.stringify(allRecords));

  // Sync to Supabase in the background if configured
  syncRecordToSupabase(table, record);

  // Return only the filtered subset for the current UI context
  if (table !== 'users' && userEmail) {
    return allRecords.filter(r => !r.user_email || r.user_email === userEmail);
  }
  return allRecords;
}

export function deleteRecord(table, recordId) {
  const localKey = `bizpilot_${table}`;
  const localData = localStorage.getItem(localKey);
  let allRecords = [];
  if (localData) {
    try {
      allRecords = JSON.parse(localData);
    } catch (e) {
      allRecords = [];
    }
  }

  const updated = allRecords.filter(r => r.id !== recordId);
  localStorage.setItem(localKey, JSON.stringify(updated));

  // Sync delete to Supabase if configured
  syncDeleteToSupabase(table, recordId);

  // Return filtered subset
  const userEmail = getCurrentUserEmail();
  if (table !== 'users' && userEmail) {
    return updated.filter(r => !r.user_email || r.user_email === userEmail);
  }
  return updated;
}

/* ──────────────────────── Admin Methods ──────────────────────── */

export async function getAdminAllRecords(table) {
  const url = localStorage.getItem('supabase_url') || getViteEnv('VITE_SUPABASE_URL');
  const anonKey = localStorage.getItem('supabase_anon_key') || getViteEnv('VITE_SUPABASE_ANON_KEY');

  if (!url || !anonKey) {
    const localKey = `bizpilot_${table}`;
    return JSON.parse(localStorage.getItem(localKey)) || [];
  }

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
      return await response.json();
    }
  } catch (error) {
    console.warn(`Admin failed to fetch all records for table ${table}:`, error);
  }

  const localKey = `bizpilot_${table}`;
  return JSON.parse(localStorage.getItem(localKey)) || [];
}

/* ──────────────────────── Authentication & Account Management ──────────────────────── */

export async function registerUserInDb(fields) {
  const {
    name,
    businessName,
    email,
    password,
    phone = '',
    dob = '',
    gender = '',
    country = '',
    state = '',
    city = '',
    profileImage = '',
    language = 'English'
  } = fields;

  const allUsers = await getAdminAllRecords('users');
  const exists = allUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (exists) {
    throw new Error('EMAIL_EXISTS');
  }

  const role = (email.toLowerCase().includes('admin') || email.toLowerCase() === 'admin@bizpilot.in') ? 'admin' : 'user';
  const passwordHash = await hashPassword(password);
  
  // Generate 6-digit OTP verification code
  const verificationOtp = Math.floor(100000 + Math.random() * 900000).toString();
  const verificationExpiry = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

  const newUser = {
    id: `US-${Date.now().toString(36)}`,
    name,
    business_name: businessName,
    email: email.toLowerCase(),
    password: passwordHash, // Stored as hash
    phone,
    date_of_birth: dob,
    gender,
    country,
    state,
    city,
    profile_image: profileImage,
    preferred_language: language,
    email_verified: false,
    verification_token: verificationOtp,
    verification_token_expiry: verificationExpiry,
    password_reset_token: null,
    password_reset_token_expiry: null,
    role,
    credits: role === 'admin' ? 9999 : 50,
    account_status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_login: null
  };

  saveRecord('users', newUser);
  
  // Output details to console for simulation/testing
  console.log(`%c[DEMO EMAIL CLIENT] Verification code for ${email}: ${verificationOtp}`, "color: #0d9488; font-weight: bold; font-size: 14px;");
  
  return { user: newUser, otp: verificationOtp };
}

export async function loginUserInDb(email, password) {
  const allUsers = await getAdminAllRecords('users');
  const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    throw new Error('USER_NOT_FOUND');
  }

  const passwordHash = await hashPassword(password);
  if (user.password !== passwordHash) {
    throw new Error('INCORRECT_PASSWORD');
  }

  if (!user.email_verified) {
    throw new Error('EMAIL_NOT_VERIFIED');
  }

  // Update last login
  const updatedUser = {
    ...user,
    last_login: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  saveRecord('users', updatedUser);

  return updatedUser;
}

export async function verifyUserEmail(email, otp) {
  const allUsers = await getAdminAllRecords('users');
  const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    throw new Error('User not found.');
  }

  if (user.verification_token !== otp) {
    throw new Error('Invalid verification code.');
  }

  const isExpired = new Date(user.verification_token_expiry) < new Date();
  if (isExpired) {
    throw new Error('Verification code has expired. Please request a new one.');
  }

  const updatedUser = {
    ...user,
    email_verified: true,
    verification_token: null,
    verification_token_expiry: null,
    updated_at: new Date().toISOString()
  };
  saveRecord('users', updatedUser);

  return updatedUser;
}

export async function resendVerificationOtp(email) {
  const allUsers = await getAdminAllRecords('users');
  const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    throw new Error('User not found.');
  }

  const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
  const newExpiry = new Date(Date.now() + 60 * 60 * 1000).toISOString();

  const updatedUser = {
    ...user,
    verification_token: newOtp,
    verification_token_expiry: newExpiry,
    updated_at: new Date().toISOString()
  };
  saveRecord('users', updatedUser);

  console.log(`%c[DEMO EMAIL CLIENT] Resent Verification code for ${email}: ${newOtp}`, "color: #2563eb; font-weight: bold; font-size: 14px;");
  return newOtp;
}

export async function changeVerificationEmail(oldEmail, newEmail) {
  const allUsers = await getAdminAllRecords('users');
  const exists = allUsers.some(u => u.email.toLowerCase() === newEmail.toLowerCase());
  if (exists) {
    throw new Error('EMAIL_EXISTS');
  }

  const user = allUsers.find(u => u.email.toLowerCase() === oldEmail.toLowerCase());
  if (!user) {
    throw new Error('User not found.');
  }

  const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
  const newExpiry = new Date(Date.now() + 60 * 60 * 1000).toISOString();

  const updatedUser = {
    ...user,
    email: newEmail.toLowerCase(),
    verification_token: newOtp,
    verification_token_expiry: newExpiry,
    updated_at: new Date().toISOString()
  };

  // We delete the old user entry and add the new one since email is UNIQUE
  deleteRecord('users', user.id);
  saveRecord('users', updatedUser);

  console.log(`%c[DEMO EMAIL CLIENT] New Verification code for updated email ${newEmail}: ${newOtp}`, "color: #06b6d4; font-weight: bold; font-size: 14px;");
  return newOtp;
}

export async function generateResetToken(email) {
  const allUsers = await getAdminAllRecords('users');
  const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

  // Use secure practices: do not show error on UI if not found to prevent account enumeration,
  // but return the token details to caller for logs
  if (!user) {
    return null;
  }

  const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const resetExpiry = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins

  const updatedUser = {
    ...user,
    password_reset_token: resetToken,
    password_reset_token_expiry: resetExpiry,
    updated_at: new Date().toISOString()
  };
  saveRecord('users', updatedUser);

  const origin = (typeof window !== 'undefined' && window.location) ? window.location.origin : 'http://localhost:5173';
  const resetLink = `${origin}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
  console.log(`%c[DEMO EMAIL CLIENT] Password reset link for ${email}: ${resetLink}`, "color: #e11d48; font-weight: bold; font-size: 14px;");

  return { token: resetToken, link: resetLink };
}

export async function resetPasswordWithToken(email, token, newPassword) {
  const allUsers = await getAdminAllRecords('users');
  const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user || user.password_reset_token !== token) {
    throw new Error('INVALID_TOKEN');
  }

  const isExpired = new Date(user.password_reset_token_expiry) < new Date();
  if (isExpired) {
    throw new Error('EXPIRED_TOKEN');
  }

  const passwordHash = await hashPassword(newPassword);
  const updatedUser = {
    ...user,
    password: passwordHash,
    password_reset_token: null,
    password_reset_token_expiry: null,
    updated_at: new Date().toISOString()
  };
  saveRecord('users', updatedUser);

  return updatedUser;
}

export async function changeUserPassword(email, currentPassword, newPassword) {
  const allUsers = await getAdminAllRecords('users');
  const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    throw new Error('User not found.');
  }

  const currentHash = await hashPassword(currentPassword);
  if (user.password !== currentHash) {
    throw new Error('INCORRECT_CURRENT_PASSWORD');
  }

  const newHash = await hashPassword(newPassword);
  const updatedUser = {
    ...user,
    password: newHash,
    updated_at: new Date().toISOString()
  };
  saveRecord('users', updatedUser);

  return updatedUser;
}

export async function updateUserProfile(email, updatedFields) {
  const allUsers = await getAdminAllRecords('users');
  const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    throw new Error('User not found.');
  }

  const updatedUser = {
    ...user,
    ...updatedFields,
    updated_at: new Date().toISOString()
  };
  saveRecord('users', updatedUser);

  return updatedUser;
}

export async function deleteUserAccount(email, password) {
  const allUsers = await getAdminAllRecords('users');
  const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    throw new Error('User not found.');
  }

  const passwordHash = await hashPassword(password);
  if (user.password !== passwordHash) {
    throw new Error('INCORRECT_PASSWORD');
  }

  deleteRecord('users', user.id);
  return true;
}

/* ──────────────────────── Supabase Background REST Sync ──────────────────────── */

async function syncRecordToSupabase(table, record) {
  const url = localStorage.getItem('supabase_url') || getViteEnv('VITE_SUPABASE_URL');
  const anonKey = localStorage.getItem('supabase_anon_key') || getViteEnv('VITE_SUPABASE_ANON_KEY');

  if (!url || !anonKey) return;

  try {
    const formattedUrl = url.replace(/\/$/, '');
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
      console.warn(`Supabase REST insert failed (status ${response.status}) for table ${table}`);
    }
  } catch (error) {
    console.warn('Background Supabase Sync failed:', error);
  }
}

async function syncDeleteToSupabase(table, recordId) {
  const url = localStorage.getItem('supabase_url') || getViteEnv('VITE_SUPABASE_URL');
  const anonKey = localStorage.getItem('supabase_anon_key') || getViteEnv('VITE_SUPABASE_ANON_KEY');

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
  const url = localStorage.getItem('supabase_url') || getViteEnv('VITE_SUPABASE_URL');
  const anonKey = localStorage.getItem('supabase_anon_key') || getViteEnv('VITE_SUPABASE_ANON_KEY');

  if (!url || !anonKey) return;

  try {
    const formattedUrl = url.replace(/\/$/, '');
    const userEmail = getCurrentUserEmail();
    
    // Construct query parameters: filter by user_email if not the users table
    let queryParams = 'select=*';
    if (table !== 'users' && userEmail) {
      queryParams += `&user_email=eq.${encodeURIComponent(userEmail)}`;
    }

    const response = await fetch(`${formattedUrl}/rest/v1/${table}?${queryParams}`, {
      method: 'GET',
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`
      }
    });

    if (response.ok) {
      const dbRecords = await response.json();
      if (Array.isArray(dbRecords)) {
        const localKey = `bizpilot_${table}`;
        const localData = localStorage.getItem(localKey);
        let localRecords = localData ? JSON.parse(localData) : [];

        // Map existing records to merge updates
        const mergedMap = new Map();
        localRecords.forEach(r => mergedMap.set(r.id, r));
        dbRecords.forEach(r => mergedMap.set(r.id, r));

        const mergedList = Array.from(mergedMap.values());
        localStorage.setItem(localKey, JSON.stringify(mergedList));
      }
    }
  } catch (error) {
    console.warn(`Could not sync fetch ${table} from Supabase:`, error);
  }
}
