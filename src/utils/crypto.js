/**
 * Secure password hashing using native Web Crypto API
 * Avoids heavy node binary compilation issues and runs natively in the browser
 */
export async function hashPassword(password) {
  if (!password) return '';
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
