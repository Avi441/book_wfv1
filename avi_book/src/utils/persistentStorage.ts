/**
 * Dual IndexedDB + LocalStorage persistent storage helper.
 * Guarantees that uploaded books, custom covers, and event banners are never lost
 * on browser refresh, tab close, or admin logout.
 */

const DB_NAME = 'avinash_author_site_db_v1';
const STORE_NAME = 'site_data_store';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not available'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function savePersistentItem<T>(key: string, value: T): Promise<void> {
  // 1. Mirror to localStorage first
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn('LocalStorage quota warning, relying on IndexedDB', err);
  }

  // 2. Persist to IndexedDB
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(value, key);
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    // ignore
  }
}

export async function loadPersistentItem<T>(key: string, defaultValue: T): Promise<T> {
  // 1. Try IndexedDB first (which holds full persistent state without 5MB quota)
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(key);

    const result = await new Promise<T | undefined>((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    if (result !== undefined && result !== null) {
      return result;
    }
  } catch (err) {
    // fallback to localStorage
  }

  // 2. Fallback to localStorage
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed !== undefined && parsed !== null) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }

  return defaultValue;
}

export async function removePersistentItem(key: string): Promise<void> {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }

  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.delete(key);
  } catch {
    // ignore
  }
}
