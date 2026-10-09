const STORAGE_KEY = 'avinash_purchased_books_v1';

export function getPurchasedBookIds(): number[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((value) => Number(value))
      .filter((value) => Number.isFinite(value) && value >= 0);
  } catch {
    return [];
  }
}

export async function hasPurchasedBook(bookId: number): Promise<boolean> {
  try {
    const response = await fetch(`/api/purchases/${bookId}`, { credentials: 'include' });
    const payload = await response.json();
    return response.ok && Boolean(payload?.purchased);
  } catch {
    return getPurchasedBookIds().includes(Number(bookId));
  }
}

export async function markBookPurchased(bookId: number): Promise<void> {
  try {
    const response = await fetch(`/api/purchases/${bookId}`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookId: Number(bookId) }),
    });
    if (response.ok) {
      return;
    }
  } catch {
    // ignore fetch failure and fall back to the local browser cache for demo compatibility
  }

  if (typeof window === 'undefined') return;

  const current = getPurchasedBookIds();
  if (!current.includes(Number(bookId))) {
    const next = [...current, Number(bookId)];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
}

export function clearBookPurchase(bookId: number): void {
  if (typeof window === 'undefined') return;

  const current = getPurchasedBookIds();
  const next = current.filter((value) => value !== Number(bookId));
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function getPreviewPageLimit(totalPages: number): number {
  if (!Number.isFinite(totalPages) || totalPages <= 0) return 0;
  return Math.ceil(totalPages * 0.2);
}
