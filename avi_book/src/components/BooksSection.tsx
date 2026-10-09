import { BookOpen, ShoppingCart, Upload } from 'lucide-react';
import { BOOKS_DATA } from '../data/siteData';
import { BookCover } from './BookCover';
import { Book } from '../types';
import { compressAndProcessImage } from '../utils/imageUtils';
import { CurrencyCode, ExchangeRates, formatPrice, getDisplayPrice } from '../utils/pricing';

interface BooksSectionProps {
  books?: Book[];
  onSelectBook: (book: Book) => void;
  onViewAllBooks: () => void;
  onSampleRead: (book: Book) => void;
  onAddToCart: (book: Book) => void;
  onUpdateCover?: (bookId: number, coverUrl: string) => void;
  currency?: CurrencyCode;
  exchangeRates?: ExchangeRates;
}

export function BooksSection({
  books = BOOKS_DATA,
  onSelectBook,
  onViewAllBooks,
  onSampleRead,
  onAddToCart,
  onUpdateCover,
  currency = 'USD',
  exchangeRates,
}: BooksSectionProps) {
  return (
    <section id="books-section" className="py-12 sm:py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <BookOpen className="w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                All {books.length} Books
              </h2>
            </div>
            <p className="text-sm text-slate-500 mt-1 sm:ml-11">
              Practical engineering books for Linux storage, kernel internals, networking, debugging, and interview preparation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
              ✓ Free 20% Sample Preview • Full Download on Buy Now
            </span>
          </div>
        </div>

        {/* Dynamic Books Grid (3-column layout) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {books.map((book) => (
            <div
              key={book.id}
              className="group bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 p-5 flex flex-col justify-between hover:shadow-xl transition-all duration-300 text-left relative overflow-hidden"
            >
              {/* Top Accent Stripe */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ backgroundColor: book.accentColor }}
              />

              <div>
                {/* Book Banner / Cover Display */}
                <div className="flex flex-col items-center mb-5 pt-2">
                  <div
                    onClick={() => onSelectBook(book)}
                    className="transform group-hover:-translate-y-1.5 group-hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
                  >
                    <BookCover book={book} size="md" showAuthor={true} />
                  </div>
                  {onUpdateCover && (
                    <label
                      title="Upload your exact cover image file for this book"
                      className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-mono text-slate-500 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 px-2.5 py-1 rounded-md cursor-pointer transition-colors shadow-2xs"
                    >
                      <Upload className="w-3 h-3 text-slate-400 group-hover:text-blue-500" />
                      <span>Upload Cover</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              const optimized = await compressAndProcessImage(file, {
                                maxWidth: 1400,
                                maxHeight: 2000,
                                quality: 0.88,
                              });
                              onUpdateCover(book.id, optimized);
                            } catch {
                              // ignore
                            }
                          }
                          e.target.value = '';
                        }}
                      />
                    </label>
                  )}
                </div>

                {/* Number Badge & Tag */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold font-mono flex items-center justify-center shadow-xs">
                      {book.id}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-semibold">
                      {book.tag}
                    </span>
                  </div>

                  {book.badge && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {book.badge}
                    </span>
                  )}
                </div>

                {/* Title & Description */}
                <h3
                  onClick={() => onSelectBook(book)}
                  className="text-lg font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug cursor-pointer"
                >
                  {book.title}
                </h3>

                {book.subtitle && (
                  <p className="text-xs font-medium text-slate-500 mt-1 line-clamp-1">
                    {book.subtitle}
                  </p>
                )}

                <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                  {book.description}
                </p>

                {/* Book Specs Indicator */}
                <div className="mt-3 py-2 px-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-600">
                  <span className="flex items-center gap-1.5 text-blue-700 font-semibold">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Free 20% Sample Read</span>
                  </span>
                  <span>{book.pages} Pages</span>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2">
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-slate-400">Price</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 line-through">
                        {formatPrice(getDisplayPrice(book, currency, exchangeRates).originalPrice, currency)}
                      </span>
                      <span className="text-base font-bold text-slate-900">
                        {formatPrice(getDisplayPrice(book, currency, exchangeRates).effectivePrice, currency)}
                      </span>
                    </div>
                  </div>
                  {getDisplayPrice(book, currency, exchangeRates).hasOffer && (
                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-700">
                      Save {getDisplayPrice(book, currency, exchangeRates).discountPercent}%
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons Section: Sample Read & Buy Now */}
              <div className="pt-4 mt-4 border-t border-slate-100 space-y-2.5">
                <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                  {/* Sample Read Button */}
                  <button
                    type="button"
                    onClick={() => onSampleRead(book)}
                    className="w-full min-h-[44px] py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 text-xs font-bold transition-all border border-slate-300 flex items-center justify-center gap-1.5 shadow-2xs hover:shadow-xs active:scale-[0.98]"
                    title={`Open free 20% sample preview of ${book.title}`}
                  >
                    <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Sample Reading</span>
                  </button>

                  {/* Add to Cart Button for Full Download */}
                  <button
                    type="button"
                    onClick={() => onAddToCart(book)}
                    className="w-full min-h-[44px] py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold transition-all shadow-xs hover:shadow flex items-center justify-center gap-1.5 active:scale-[0.98]"
                    title={`Add ${book.title} to cart`}
                  >
                    <ShoppingCart className="w-4 h-4 shrink-0" />
                    <span>Add to Cart</span>
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

