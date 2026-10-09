import { useState } from 'react';
import { BOOKS_DATA } from '../data/siteData';
import { Book } from '../types';

interface HeroBookShelfProps {
  books?: Book[];
  onSelectBook: (book: Book) => void;
}

export function HeroBookShelf({ books = BOOKS_DATA, onSelectBook }: HeroBookShelfProps) {
  const [activeBookId, setActiveBookId] = useState<number>(books[0]?.id || 1);
  const frontBook = books.find((b) => b.id === activeBookId) || books[0] || BOOKS_DATA[0];
  const standingBooks = books.filter((b) => b.id !== frontBook.id);

  return (
    <div className="relative w-full max-w-xl mx-auto lg:max-w-none flex flex-col items-center select-none">
      {/* Quick Title Switcher */}
      <div className="flex items-center gap-1.5 mb-3 bg-slate-100/90 p-1.5 rounded-xl border border-slate-200 shadow-2xs max-w-full overflow-x-auto">
        {books.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => setActiveBookId(b.id)}
            className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all active:scale-95 whitespace-nowrap min-h-[36px] flex items-center gap-1 ${
              b.id === frontBook.id
                ? 'bg-white text-slate-900 font-bold shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: b.accentColor || '#3b82f6' }} />
            <span>
              #{b.id}{' '}
              {b.id === 1
                ? 'Storage'
                : b.id === 2
                ? 'Kernel'
                : b.id === 3
                ? 'Network'
                : b.tag
                ? b.tag.split('&')[0].trim()
                : b.title.split(' ')[0]}
            </span>
          </button>
        ))}
      </div>

      {/* Books Display Container */}
      <div className="relative flex items-end justify-center pt-2 pb-4">
        {/* Front 3D Presentation of Active Book */}
        <div
          onClick={() => onSelectBook(frontBook)}
          className="relative z-20 cursor-pointer group transition-all duration-300 transform hover:-translate-y-2 hover:rotate-0 -rotate-1 origin-bottom-left active:scale-[0.98]"
          title={`Click to view details of ${frontBook.title}`}
        >
          {/* 3D Book Page Edge Behind */}
          <div className="absolute top-1 right-[-8px] sm:right-[-10px] bottom-1 w-[10px] sm:w-[12px] bg-gradient-to-r from-slate-200 via-slate-100 to-slate-300 rounded-r shadow-md border-y border-r border-slate-300" />
          {/* Top Page Edge */}
          <div className="absolute top-[-6px] left-2 right-[-2px] h-[8px] bg-slate-200/90 transform -skew-x-[25deg] rounded-t-xs border-t border-slate-300" />

          {/* Main Book Cover */}
          <div
            className="relative w-44 sm:w-60 md:w-64 h-64 sm:h-84 md:h-92 rounded-r-lg rounded-l-xs bg-white overflow-hidden shadow-2xl border-y border-r border-slate-300 flex flex-col justify-between"
            style={{ borderLeftWidth: '4px', borderLeftColor: frontBook.accentColor || '#b91c1c' }}
          >
            {frontBook.coverImage ? (
              <img
                src={frontBook.coverImage}
                alt={frontBook.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <div className="p-4 sm:p-5 flex flex-col justify-between h-full bg-slate-50">
                <span className="text-[10px] font-mono font-bold text-red-600 uppercase">Book {frontBook.id}</span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">{frontBook.title}</h3>
                <span className="text-xs font-bold text-slate-700">Avinash Pal</span>
              </div>
            )}

            {/* Spine Highlight Shadow */}
            <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-black/40 via-black/10 to-transparent pointer-events-none z-10" />
            <div className="absolute top-0 bottom-0 left-3 w-[1px] bg-white/40 pointer-events-none z-10" />
            {/* Top Page Edge Highlight */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/50 pointer-events-none z-10" />
          </div>
        </div>

        {/* Stack of Standing Books (Spine View) */}
        <div className="relative z-10 flex items-end -ml-1.5 sm:-ml-3 pb-0.5">
          {standingBooks.map((book) => (
            <div
              key={book.id}
              onClick={() => setActiveBookId(book.id)}
              title={`${book.title} (Book ${book.id}) - Click to bring to front`}
              className="relative cursor-pointer transition-all duration-200 hover:-translate-y-3 group active:scale-95"
              style={{
                zIndex: 10 + book.id,
              }}
            >
              {/* Top Page Edge */}
              <div className="h-2 w-8 sm:w-11 md:w-12 bg-slate-200 border-t border-x border-slate-300 transform -skew-x-[15deg] rounded-t-xs" />

              {/* Vertical Book Spine */}
              <div
                className="w-8 sm:w-11 md:w-12 h-60 sm:h-80 md:h-[340px] rounded-r-xs rounded-l-xs flex flex-col justify-between py-2 sm:py-3 items-center text-white border-r border-black/30 shadow-md group-hover:shadow-xl"
                style={{
                  backgroundColor: book.spineColor,
                  backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.4) 0%, rgba(255,255,255,0.15) 25%, rgba(0,0,0,0.35) 100%)`,
                }}
              >
                {/* Top Number */}
                <span className="text-[10px] sm:text-xs font-mono font-bold text-white/90 px-1 py-0.5 rounded bg-black/30">
                  #{book.id}
                </span>

                {/* Vertical Book Spine Title */}
                <div className="flex-1 flex items-center justify-center my-2">
                  <span
                    className="text-[9px] sm:text-[11px] font-bold tracking-wider text-white whitespace-nowrap opacity-90 group-hover:opacity-100 transition-opacity"
                    style={{
                      writingMode: 'vertical-rl',
                      transform: 'rotate(180deg)',
                    }}
                  >
                    {book.title}
                  </span>
                </div>

                {/* Bottom Tag */}
                <div className="text-[8px] sm:text-[9px] font-mono px-1 py-0.5 rounded bg-white/20 text-white font-bold group-hover:bg-white/40">
                  {book.id === 2 ? 'C/OS' : book.id === 3 ? 'NET' : 'IO'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hand-drawn style blue arrow & annotation */}
      <div className="relative mt-2 flex items-center justify-center gap-2">
        <svg
          className="w-24 h-8 text-blue-500 transform -rotate-6"
          viewBox="0 0 120 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 24 C 35 26, 75 22, 105 10"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeDasharray="3 0"
          />
          <path
            d="M96 6 L 108 9 L 102 18"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-xs sm:text-sm font-semibold text-blue-600 tracking-wide font-mono">
          3 Flagship Books · Complete Systems Engineering Trilogy
        </span>
      </div>
    </div>
  );
}
