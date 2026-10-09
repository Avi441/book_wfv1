import {
  BookOpen,
  ShoppingCart,
  ArrowRight,
  CheckCircle2,
  Quote,
  Github,
  Linkedin,
  Youtube,
  Mail,
  Upload,
} from 'lucide-react';
import { BOOKS_DATA, AUTHOR_INFO } from '../data/siteData';
import { BookCover } from './BookCover';
import { Book } from '../types';
import { compressAndProcessImage } from '../utils/imageUtils';
import { CurrencyCode, ExchangeRates, formatPrice, getDisplayPrice } from '../utils/pricing';

interface FeaturedBookSectionProps {
  books?: Book[];
  onSelectBook: (book: Book) => void;
  onBuyBook: (book: Book) => void;
  onSampleRead: (book: Book) => void;
  onAddToCart?: (book: Book) => void;
  onUpdateCover?: (bookId: number, coverUrl: string) => void;
  currency?: CurrencyCode;
  exchangeRates?: ExchangeRates;
}

export function FeaturedBookSection({
  books = BOOKS_DATA,
  onSelectBook,
  onBuyBook,
  onSampleRead,
  onAddToCart,
  onUpdateCover,
  currency = 'USD',
  exchangeRates,
}: FeaturedBookSectionProps) {
  const featuredBook = books.find((b) => b.featured) || books[0] || BOOKS_DATA[0];
  const featuredPrice = getDisplayPrice(featuredBook, currency, exchangeRates);

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <BookOpen className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Featured Book
          </h2>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Main Book Feature Card (Span 7) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col sm:flex-row gap-6 sm:gap-8 items-center shadow-xs">
            {/* Book Cover */}
            <div className="flex flex-col items-center gap-2 shrink-0">
              <div
                onClick={() => onSelectBook(featuredBook)}
                className="cursor-pointer group transform hover:-translate-y-1 transition-transform"
              >
                <BookCover book={featuredBook} size="md" showAuthor={true} />
              </div>
              {onUpdateCover && (
                <label
                  title="Upload your exact cover image file for this book"
                  className="inline-flex items-center gap-1.5 text-[11px] font-mono text-slate-500 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 px-2.5 py-1 rounded-md cursor-pointer transition-colors shadow-2xs"
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
                          onUpdateCover(featuredBook.id, optimized);
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

            {/* Book Details */}
            <div className="space-y-4 flex-1 text-left">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-bold mb-2">
                  <span>#1</span>
                  <span>BESTSELLER</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                  {featuredBook.title}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">
                  {featuredBook.subtitle}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {featuredBook.fullDescription}
              </p>

              {/* Checklist */}
              <ul className="space-y-2 pt-1 text-xs sm:text-sm text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Real device examples (Android, Laptop, USB)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Step-by-step code walkthroughs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Clear explanations with diagrams</span>
                </li>
              </ul>

              {/* CTAs: Sample Read, Buy Now, and View Details */}
              <div className="pt-3 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onSampleRead(featuredBook)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-xl border border-slate-300 transition-colors shadow-2xs hover:shadow-xs focus:outline-none"
                >
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>Sample Reading (Free 20%)</span>
                </button>

                <button
                  type="button"
                  onClick={() => onAddToCart ? onAddToCart(featuredBook) : onBuyBook(featuredBook)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-sm hover:shadow transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart • {formatPrice(featuredPrice.effectivePrice, currency)}</span>
                </button>

                <div className="inline-flex items-center gap-2 rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-600">
                  <span className="line-through text-slate-400">{formatPrice(featuredPrice.originalPrice, currency)}</span>
                  <span className="font-bold text-slate-900">{formatPrice(featuredPrice.effectivePrice, currency)}</span>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectBook(featuredBook)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors focus:outline-none"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Side: Quote & Author Card (Span 5) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            {/* Quote Card */}
            <div className="bg-slate-50/70 rounded-2xl border border-slate-200/80 p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between">
              <div className="text-blue-600/30 mb-2">
                <Quote className="w-10 h-10 transform -scale-x-100" />
              </div>

              <blockquote className="text-lg sm:text-xl font-medium text-slate-900 italic leading-snug">
                "{AUTHOR_INFO.quote}"
              </blockquote>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-800 font-mono">
                  — {AUTHOR_INFO.name}
                </span>
                <span className="text-xs text-slate-500">
                  Linux Kernel Author
                </span>
              </div>
            </div>

            {/* Author Profile Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row gap-5 items-center text-left">
              {/* Author Photo / Avatar */}
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-full bg-slate-900 ring-4 ring-blue-50 overflow-hidden flex items-center justify-center text-white font-bold text-2xl">
                  {/* Stylized Avatar */}
                  <div className="w-full h-full bg-gradient-to-br from-slate-800 via-slate-900 to-blue-950 flex flex-col items-center justify-center p-2 text-center">
                    <span className="font-mono text-sm tracking-wider text-sky-400 font-bold">
                      AP
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono mt-0.5">
                      KERNEL
                    </span>
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center border-2 border-white shadow-xs text-[10px] font-bold">
                  ✓
                </div>
              </div>

              {/* Author Info & Socials */}
              <div className="space-y-2 flex-1">
                <div>
                  <h4 className="text-lg font-bold text-slate-900">
                    {AUTHOR_INFO.name}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    {AUTHOR_INFO.role}
                  </p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {AUTHOR_INFO.bioCard}
                </p>

                {/* Social Icons */}
                <div className="flex items-center gap-3 pt-2 text-slate-500">
                  <a
                    href={AUTHOR_INFO.socials.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                    aria-label="Avinash Pal on GitHub"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                  <a
                    href={AUTHOR_INFO.socials.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    aria-label="Avinash Pal on LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a
                    href={AUTHOR_INFO.socials.youtube}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    aria-label="Avinash Pal on YouTube"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                  <a
                    href={`mailto:${AUTHOR_INFO.socials.email}`}
                    className="p-1.5 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    aria-label="Email Avinash Pal"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
