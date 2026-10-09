import { useState, useEffect } from 'react';
import { Book, UpcomingEvent, OneToOneSessionType } from '../types';
import { BOOKS_DATA, UPCOMING_EVENTS, ONE_TO_ONE_SESSIONS } from '../data/siteData';
import { savePersistentItem, loadPersistentItem, removePersistentItem } from '../utils/persistentStorage';

const BOOKS_STORAGE_KEY = 'avinash_books_v9_persistent';
const EVENTS_STORAGE_KEY = 'avinash_events_v2_persistent';
const SESSIONS_STORAGE_KEY = 'avinash_sessions_v2_persistent';

// Obsolete keys from previous iterations that might contain AI generated dark banners
const OBSOLETE_BOOK_KEYS = [
  'avinash_books_v1',
  'avinash_books_v2',
  'avinash_books_v3',
  'avinash_books_v3_trilogy',
  'avinash_books_v4_author_exact_covers',
  'avinash_books_v5_pure_covers',
  'avinash_books_v6_clean_exact_covers',
  'avinash_books_v7_exact_cover_art',
];

export function useSiteData() {
  // Clean up any stale legacy localStorage caches
  useEffect(() => {
    try {
      OBSOLETE_BOOK_KEYS.forEach((key) => localStorage.removeItem(key));
    } catch {
      // ignore
    }
  }, []);

  const [books, setBooks] = useState<Book[]>(() => {
    try {
      const saved = localStorage.getItem(BOOKS_STORAGE_KEY);
      if (saved) {
        const parsed: Book[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return BOOKS_DATA;
  });

  const [events, setEvents] = useState<UpcomingEvent[]>(() => {
    try {
      const saved = localStorage.getItem(EVENTS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return UPCOMING_EVENTS;
  });

  const [sessions, setSessions] = useState<OneToOneSessionType[]>(() => {
    try {
      const saved = localStorage.getItem(SESSIONS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return ONE_TO_ONE_SESSIONS;
  });

  // Load complete persistent state from IndexedDB on startup
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const dbBooks = await loadPersistentItem<Book[]>(BOOKS_STORAGE_KEY, []);
        if (isMounted && Array.isArray(dbBooks) && dbBooks.length > 0) {
          setBooks(dbBooks);
        }
        const dbEvents = await loadPersistentItem<UpcomingEvent[]>(EVENTS_STORAGE_KEY, []);
        if (isMounted && Array.isArray(dbEvents) && dbEvents.length > 0) {
          setEvents(dbEvents);
        }
        const dbSessions = await loadPersistentItem<OneToOneSessionType[]>(SESSIONS_STORAGE_KEY, []);
        if (isMounted && Array.isArray(dbSessions) && dbSessions.length > 0) {
          setSessions(dbSessions);
        }
      } catch (err) {
        console.warn('Persistent storage restore notice', err);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  // Save to persistent storage (both IndexedDB + localStorage) when updated
  useEffect(() => {
    savePersistentItem(BOOKS_STORAGE_KEY, books);
  }, [books]);

  useEffect(() => {
    savePersistentItem(EVENTS_STORAGE_KEY, events);
  }, [events]);

  useEffect(() => {
    savePersistentItem(SESSIONS_STORAGE_KEY, sessions);
  }, [sessions]);

  // Book Actions
  const addBook = (bookData: Omit<Book, 'id'>) => {
    const nextId = books.length > 0 ? Math.max(...books.map((b) => b.id)) + 1 : 1;
    const newBook: Book = { ...bookData, id: nextId };
    setBooks((prev) => [...prev, newBook]);
    return newBook;
  };

  const updateBook = (id: number, updatedData: Partial<Book>) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updatedData } : b))
    );
  };

  const setBookCover = (id: number, coverImageUrl: string) => {
    setBooks((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, coverImage: coverImageUrl, bannerImage: coverImageUrl }
          : b
      )
    );
  };

  const deleteBook = (id: number) => {
    setBooks((prev) => prev.filter((b) => b.id !== id));
  };

  // Event Actions
  const addEvent = (eventData: Omit<UpcomingEvent, 'id'>) => {
    const newId = `evt-${Date.now()}`;
    const newEvent: UpcomingEvent = { ...eventData, id: newId };
    setEvents((prev) => [newEvent, ...prev]);
    return newEvent;
  };

  const updateEvent = (id: string, updatedData: Partial<UpcomingEvent>) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updatedData } : e))
    );
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  // Session Actions
  const addSession = (sessionData: Omit<OneToOneSessionType, 'id'>) => {
    const newId = `session-${Date.now()}`;
    const newSession: OneToOneSessionType = { ...sessionData, id: newId };
    setSessions((prev) => [...prev, newSession]);
    return newSession;
  };

  const updateSession = (id: string, updatedData: Partial<OneToOneSessionType>) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updatedData } : s))
    );
  };

  const deleteSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  // Reset to initial seed data
  const resetToDefaults = () => {
    setBooks(BOOKS_DATA);
    setEvents(UPCOMING_EVENTS);
    setSessions(ONE_TO_ONE_SESSIONS);
    removePersistentItem(BOOKS_STORAGE_KEY);
    removePersistentItem(EVENTS_STORAGE_KEY);
    removePersistentItem(SESSIONS_STORAGE_KEY);
  };

  return {
    books,
    events,
    sessions,
    addBook,
    updateBook,
    setBookCover,
    deleteBook,
    addEvent,
    updateEvent,
    deleteEvent,
    addSession,
    updateSession,
    deleteSession,
    resetToDefaults,
  };
}
