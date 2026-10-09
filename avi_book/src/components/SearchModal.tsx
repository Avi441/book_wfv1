import { useState, useMemo } from 'react';
import { Search, X, BookOpen, Calendar, FileText, ArrowRight } from 'lucide-react';
import { BOOKS_DATA, UPCOMING_EVENTS, TECHNICAL_NOTES, INTERVIEW_NOTES } from '../data/siteData';
import { Book, UpcomingEvent } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBook: (book: Book) => void;
  onSelectEvent?: (event: UpcomingEvent) => void;
  onSelectNote?: (noteTitle: string) => void;
  books?: Book[];
  events?: UpcomingEvent[];
}

export function SearchModal({
  isOpen,
  onClose,
  onSelectBook,
  onSelectEvent,
  onSelectNote,
  books = BOOKS_DATA,
  events = UPCOMING_EVENTS,
}: SearchModalProps) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const bookMatches = books.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.tag.toLowerCase().includes(q)
    ).map((b) => ({ type: 'book' as const, data: b }));

    const eventMatches = events.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q)
    ).map((e) => ({ type: 'event' as const, data: e }));

    const techMatches = TECHNICAL_NOTES.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    ).map((t) => ({ type: 'tech' as const, data: t }));

    const interviewMatches = INTERVIEW_NOTES.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q)
    ).map((i) => ({ type: 'interview' as const, data: i }));

    return [...bookMatches, ...techMatches, ...interviewMatches, ...eventMatches];
  }, [query]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-slate-900/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white w-full max-w-xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden text-left"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search books, camera drivers, V4L2, kernel notes, events..."
            autoFocus
            className="w-full px-3 py-4 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-1">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-xs text-slate-500">
              Type keywords like <span className="font-mono text-blue-600 font-semibold">camera</span>,{' '}
              <span className="font-mono text-blue-600 font-semibold">V4L2</span>, or{' '}
              <span className="font-mono text-blue-600 font-semibold">eBPF</span> to search.
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No results found for "{query}".
            </div>
          ) : (
            results.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  if (item.type === 'book') {
                    onSelectBook(item.data);
                    onClose();
                  } else if (item.type === 'event') {
                    onSelectEvent?.(item.data);
                    onClose();
                  } else if (item.type === 'tech' || item.type === 'interview') {
                    onSelectNote?.(item.data.title);
                    onClose();
                  }
                }}
                className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-100"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-md bg-blue-50 text-blue-600 shrink-0">
                    {item.type === 'book' ? (
                      <BookOpen className="w-4 h-4" />
                    ) : item.type === 'event' ? (
                      <Calendar className="w-4 h-4" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                  </div>
                  <div className="truncate">
                    <h5 className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                      {item.data.title}
                    </h5>
                    <p className="text-[11px] text-slate-500 capitalize">
                      {item.type === 'book' ? `Book #${item.data.id}` : item.type}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
