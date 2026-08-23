// Hashes a string with SHA-256 and returns it as a lowercase hex string.
// Used so the manager PIN is never stored in plain text in the database —
// only its hash is, which is useless to anyone reading the raw data.
export async function sha256Hex(text) {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// A valid SHA-256 hex digest is always exactly 64 hex characters. Anything
// else (including an old plain-text 4-digit PIN from before this change)
// is treated as "no valid pin set", which naturally prompts re-creating it.
export function isValidHash(value) {
  return typeof value === 'string' && /^[0-9a-f]{64}$/i.test(value);
}
