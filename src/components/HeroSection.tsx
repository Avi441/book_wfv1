import { ArrowRight, Calendar, User, Terminal, BookOpen, GraduationCap } from 'lucide-react';
import { AUTHOR_INFO } from '../data/siteData';
import { HeroBookShelf } from './HeroBookShelf';
import { Book } from '../types';

interface HeroSectionProps {
  books?: Book[];
  onExploreBooks: () => void;
  onViewEvents: () => void;
  onSelectBook: (book: Book) => void;
  onSampleRead?: (book: Book) => void;
}

export function HeroSection({
  books = [],
  onExploreBooks,
  onViewEvents,
  onSelectBook,
  onSampleRead,
}: HeroSectionProps) {
  const booksCount = books.length || 3;
  const leadBook = books.find((b) => b.featured) || books[0];
  return (
    <section className="relative overflow-hidden bg-white pt-8 sm:pt-14 pb-14 sm:pb-20 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-6 text-left">
            {/* Category / Eyebrow */}
            <div className="inline-flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold tracking-widest text-blue-600 uppercase font-mono">
                LEARN / BUILD / EXPLORE
              </span>
            </div>

            {/* Main Title */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl xl:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Practical Linux &amp; Embedded
                <br />
                Systems Books for Real Engineering Work
              </h1>
              <p className="text-lg sm:text-2xl font-semibold text-slate-700 tracking-tight">
                Clear, production-minded learning for software engineers and systems engineers
              </p>
            </div>

            {/* Bio Paragraph */}
            <p className="text-sm sm:text-lg text-slate-600 leading-relaxed max-w-xl font-normal">
              {AUTHOR_INFO.bioShort}
            </p>

            {/* Action Buttons: Explore All Books, Sample Read, Events */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={onExploreBooks}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 min-h-[46px] text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-sm hover:shadow transition-all group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-[0.98]"
              >
                <span>Explore All {booksCount} Books</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              {onSampleRead && leadBook && (
                <button
                  onClick={() => onSampleRead(leadBook)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 min-h-[46px] text-base font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 border border-slate-300 rounded-xl transition-colors focus:outline-none active:scale-[0.98]"
                >
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>Free Sample Read</span>
                </button>
              )}

              <button
                onClick={onViewEvents}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 min-h-[46px] text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors focus:outline-none active:scale-[0.98]"
              >
                <Calendar className="w-4 h-4 text-slate-500" />
                <span>Upcoming Events</span>
              </button>
            </div>

            {/* Author Credential Badges */}
            <div className="pt-5 border-t border-slate-100 flex flex-wrap items-center gap-y-2.5 gap-x-4 sm:gap-x-6 text-xs sm:text-sm text-slate-600 font-medium">
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-blue-600" />
                <span>Author</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-blue-600" />
                <span>Linux Developer</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>{booksCount} Books</span>
              </div>
              <div className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <span>Speaker &amp; Mentor</span>
              </div>
            </div>
          </div>

          {/* Right Hero Visual: 3D Books Showcase */}
          <div className="lg:col-span-6 xl:col-span-6 flex justify-center lg:justify-end">
            <HeroBookShelf books={books} onSelectBook={onSelectBook} />
          </div>
        </div>
      </div>
    </section>
  );
}
