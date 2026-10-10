import { Book } from '../types';

interface BookCoverProps {
  book: Book;
  size?: 'sm' | 'md' | 'lg';
  showAuthor?: boolean;
}

export function BookCover({
  book,
  size = 'md',
  showAuthor = true,
}: BookCoverProps) {
  // Dimensions with standard book proportions (~1 : 1.43)
  const dimensions = {
    sm: 'w-24 h-36 aspect-[1/1.43]',
    md: 'w-44 sm:w-48 h-64 sm:h-72 aspect-[1/1.43]',
    lg: 'w-64 sm:w-72 h-96 sm:h-[400px] aspect-[1/1.43]',
  };

  // If the book has an exact cover image, render it directly and faithfully!
  if (book.coverImage) {
    return (
      <div
        className={`relative rounded-md overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 select-none border border-slate-300/90 bg-white group shrink-0 ${dimensions[size]}`}
      >
        <img
          src={book.coverImage}
          alt={book.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-top"
        />

        {/* Realistic Book Spine Shadow on Left Edge */}
        <div className="absolute top-0 bottom-0 left-0 w-2.5 sm:w-3.5 bg-gradient-to-r from-black/35 via-black/10 to-transparent pointer-events-none z-10" />
        <div className="absolute top-0 bottom-0 left-2.5 sm:left-3.5 w-[1px] bg-white/40 pointer-events-none z-10" />

        {/* Right Edge Page Sheen */}
        <div className="absolute top-0 bottom-0 right-0 w-[1px] bg-black/10 pointer-events-none z-10" />

        {/* Hover Sheen */}
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors pointer-events-none z-10" />
      </div>
    );
  }

  // Fallback programmatic cover matching author style
  const fontSizes = {
    sm: 'text-[8px] p-2',
    md: 'text-xs p-3.5',
    lg: 'text-sm p-5',
  };

  return (
    <div
      className={`relative rounded-md overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between select-none text-slate-900 border border-slate-300 bg-gradient-to-b from-white via-slate-50 to-slate-100 ${dimensions[size]} ${fontSizes[size]}`}
    >
      {/* Spine Left Shadow Effect */}
      <div className="absolute top-0 bottom-0 left-0 w-2.5 bg-gradient-to-r from-black/30 via-black/10 to-transparent pointer-events-none z-10" />
      <div className="absolute top-0 bottom-0 left-2.5 w-[1px] bg-white/40 pointer-events-none z-10" />

      {/* Header */}
      <div className="text-center pt-1">
        {book.id <= 3 ? (
          <>
            <div className="text-[7px] sm:text-[9px] font-black tracking-widest text-slate-800 uppercase font-sans">
              THINK LIKE A
            </div>
            <div className="text-sm sm:text-lg font-black text-slate-900 tracking-tight leading-none mt-0.5">
              LINUX
            </div>
            <div
              className="text-sm sm:text-lg font-black tracking-tight leading-none mt-0.5"
              style={{ color: book.id === 1 ? '#b91c1c' : book.id === 3 ? '#047857' : '#0f172a' }}
            >
              {book.id === 1 ? 'STORAGE' : book.id === 2 ? 'KERNEL' : 'NETWORK'}
            </div>
            <div
              className="text-xs sm:text-base font-black tracking-tight leading-none mt-0.5"
              style={{ color: book.id === 2 ? '#b91c1c' : '#0f172a' }}
            >
              {book.id === 2 ? 'DEVELOPER' : 'ENGINEER'}
            </div>
          </>
        ) : (
          <>
            <div className="text-[7px] sm:text-[9px] font-mono font-bold tracking-wider text-slate-600 uppercase">
              {book.tag || 'LINUX GUIDE'}
            </div>
            <h4
              className="text-xs sm:text-sm font-black tracking-tight leading-snug mt-1 px-2 line-clamp-2"
              style={{ color: book.accentColor || '#0f172a' }}
            >
              {book.title}
            </h4>
          </>
        )}

        {size !== 'sm' && book.subtitle && (
          <p className="text-[7.5px] font-bold text-slate-700 mt-1 line-clamp-1 leading-tight px-1">
            {book.subtitle}
          </p>
        )}
      </div>

      {/* Center Graphic */}
      <div className="my-auto flex items-center justify-center py-1">
        {book.id === 1 ? (
          <div className="p-1 rounded bg-slate-900 border border-red-500/70 text-center">
            <span className="text-[8px] font-mono font-bold text-red-300">NVMe M.2</span>
            <div className="text-[6px] font-mono text-slate-300">blk-mq</div>
          </div>
        ) : book.id === 2 ? (
          <div className="p-1 rounded bg-slate-900 border border-sky-500/70 text-center">
            <span className="text-[8px] font-mono font-bold text-sky-300">container_of</span>
            <div className="text-[6px] font-mono text-slate-300">list_head</div>
          </div>
        ) : book.id === 3 ? (
          <div className="p-1 rounded bg-emerald-950 border border-emerald-500/70 text-center">
            <span className="text-[8px] font-mono font-bold text-emerald-300">sk_buff</span>
            <div className="text-[6px] font-mono text-slate-300">TCP / XDP</div>
          </div>
        ) : (
          <div
            className="p-1.5 rounded-md text-center border shadow-xs"
            style={{ backgroundColor: book.color || '#0f172a', borderColor: book.accentColor || '#38bdf8' }}
          >
            <span className="text-[8px] font-mono font-bold text-white block">
              {book.targetKernel || 'Linux 6.x'}
            </span>
            <div className="text-[6px] font-mono text-slate-300">
              {book.pages || 350} Pages
            </div>
          </div>
        )}
      </div>

      {/* Bottom Author Banner */}
      <div
        className="bg-slate-950 text-white py-1 px-2 rounded text-center tracking-widest font-black text-[8px] sm:text-[10px] uppercase font-sans border-t-2"
        style={{ borderColor: book.accentColor || (book.id === 1 ? '#b91c1c' : book.id === 3 ? '#047857' : '#38bdf8') }}
      >
        AVINASH PAL
      </div>
    </div>
  );
}
