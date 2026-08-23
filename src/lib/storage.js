import { db } from '../firebase';
import { ref, onValue, set, get } from 'firebase/database';

// Live-subscribes to a path; callback fires immediately with the current
// value and again every time any device writes a change. Returns an
// unsubscribe function.
export function subscribe(path, callback, fallback) {
  const r = ref(db, path);
  return onValue(
    r,
    (snapshot) => {
      const val = snapshot.val();
      callback(val === null || val === undefined ? fallback : val);
    },
    (error) => {
      console.error(`storage subscribe error on ${path}:`, error);
      callback(fallback);
    }
  );
}

// One-time read (used where a live subscription isn't needed).
export async function readOnce(path, fallback) {
  try {
    const snapshot = await get(ref(db, path));
    const val = snapshot.val();
    return val === null || val === undefined ? fallback : val;
  } catch (e) {
    console.error(`storage readOnce error on ${path}:`, e);
    return fallback;
  }
}

// Overwrites the value at a path.
export async function writeData(path, value) {
  try {
    await set(ref(db, path), value);
    return true;
  } catch (e) {
    console.error(`storage write error on ${path}:`, e);
    return false;
  }
}
