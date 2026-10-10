export interface SavedReadingPosition {
  bookId: number;
  chapterIndex: number;
  scrollTop: number;
  scrollProgress: number; // 0 to 100
  timestamp: number;
  chapterTitle?: string;
}

const STORAGE_PREFIX = 'avinash_reading_progress_v1_';

export function getSavedReadingPosition(bookId: number): SavedReadingPosition | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${bookId}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.scrollTop === 'number') {
      return parsed as SavedReadingPosition;
    }
  } catch {
    // Ignore JSON parse errors
  }
  return null;
}

export function saveReadingPosition(data: SavedReadingPosition): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(`${STORAGE_PREFIX}${data.bookId}`, JSON.stringify(data));
  } catch {
    // Ignore storage errors
  }
}

export function clearReadingPosition(bookId: number): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(`${STORAGE_PREFIX}${bookId}`);
  } catch {
    // Ignore storage errors
  }
}
