import { useState } from 'react';
import {
  BookOpen,
  ShoppingCart,
  Zap,
  CheckCircle2,
  Filter,
  Search,
  ArrowRight,
  ShieldCheck,
  Terminal,
  FileCheck,
  Sparkles,
} from 'lucide-react';
import { Book } from '../types';
import { BookCover } from './BookCover';
import { CurrencyCode, ExchangeRates, formatPrice, getDisplayPrice } from '../utils/pricing';

interface AllBooksPageProps {
  books: Book[];
  currency?: CurrencyCode;
  exchangeRates?: ExchangeRates;
  onSelectBook: (book: Book) => void;
  onBuyBook: (book: Book) => void;
  onSampleRead: (book: Book) => void;
  onAddToCart: (book: Book) => void;
  onNavigateHome: () => void;
}

export function AllBooksPage({
  books,
  currency = 'USD',
  exchangeRates,
  onSelectBook,
  onBuyBook,
  onSampleRead,
  onAddToCart,
  onNavigateHome,
}: AllBooksPageProps) {
  const [filterTag, setFilterTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filterOptions = [
    { id: 'all', label: 'All Trilogy Books' },
    { id: 'storage', label: 'Storage & I/O' },
    { id: 'kernel', label: 'Kernel & Drivers' },
    { id: 'networking', label: 'Networking & Protocols' },
  ];

  const filteredBooks = books.filter((book) => {
    const matchesFilter =
      filterTag === 'all' ||
      (filterTag === 'storage' && book.tag.toLowerCase().includes('storage')) ||
      (filterTag === 'kernel' && book.tag.toLowerCase().includes('kernel')) ||
      (filterTag === 'networking' && book.tag.toLowerCase().includes('network'));

    const matchesSearch =
      searchQuery.trim() === '' ||
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (book.subtitle && book.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      book.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 text-blue-800 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Complete Engineering Trilogy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Linux Systems Engineering Trilogy
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Written from production trenches. Deep architectural models, complete kernel subsystems, hardware invariants, and real debugging walkthroughs.
          </p>

          {/* Search & Filter Bar */}
          <div className="pt-2 max-w-xl mx-auto space-y-3">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search storage, folios, sk_buff, blk-mq..."
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {filterOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setFilterTag(opt.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    filterTag === opt.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {filteredBooks.map((book) => {
            const pricing = getDisplayPrice(book, currency, exchangeRates);

            return (
              <div
                key={book.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 flex flex-col justify-between hover:shadow-xl hover:border-blue-300 transition-all text-left relative overflow-hidden group"
              >
                {/* Accent Top Border */}
                <div
                  className="absolute top-0 left-0 right-0 h-2"
                  style={{ backgroundColor: book.accentColor }}
                />

                <div className="space-y-5">
                  {/* Book Cover Container */}
                  <div className="flex justify-center pt-2">
                    <div
                      onClick={() => onSelectBook(book)}
                      className="cursor-pointer transform group-hover:-translate-y-1.5 transition-transform"
                    >
                      <BookCover book={book} size="md" showAuthor={true} />
                    </div>
                  </div>

                  {/* Metadata Tag */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {book.tag}
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      {book.targetKernel || 'Linux 6.x LTS'} • {book.pages} Pages
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5">
                    <h2
                      onClick={() => onSelectBook(book)}
                      className="text-lg sm:text-xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug cursor-pointer"
                    >
                      {book.title}
                    </h2>
                    {book.subtitle && (
                      <p className="text-xs text-slate-500 font-medium line-clamp-2">
                        {book.subtitle}
                      </p>
                    )}
                    <p className="text-xs text-slate-600 pt-1 line-clamp-3 leading-relaxed">
                      {book.description}
                    </p>
                  </div>

                  {/* Pricing Badge */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-red-900 font-bold block">
                        Direct Edition Price
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-slate-900">
                          {formatPrice(pricing.effectivePrice, currency)}
                        </span>
                        {pricing.hasOffer && (
                          <span className="text-xs font-semibold text-red-800 line-through decoration-red-800">
                            {formatPrice(pricing.originalPrice, currency)}
                          </span>
                        )}
                      </div>
                    </div>
                    {pricing.hasOffer && (
                      <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        Save {pricing.discountPercent}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-6 mt-6 border-t border-slate-100 space-y-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onSampleRead(book)}
                      className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all border border-slate-300 flex items-center justify-center gap-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                      <span>Sample Read</span>
                    </button>
                    <button
                      onClick={() => onAddToCart(book)}
                      className="w-full py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-all border border-blue-200 flex items-center justify-center gap-1.5"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>

                  <button
                    onClick={() => onBuyBook(book)}
                    className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Buy Now (Instant Download)</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Complete Trilogy Bundle Guarantee Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Full DRM-Free Direct Downloads</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Instant Access on Purchase
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              All digital purchases include instant high-resolution PDF download, EPUB edition, complete chapter source code archives, and lifetime errata updates.
            </p>
          </div>
          <button
            onClick={onNavigateHome}
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors shrink-0"
          >
            Back to Homepage
          </button>
        </div>
      </div>
    </div>
  );
}
