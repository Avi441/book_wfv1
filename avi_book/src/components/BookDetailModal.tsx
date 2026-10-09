import { X, ShoppingCart, BookOpen, Layers, Terminal, Upload, RotateCcw } from 'lucide-react';
import { Book } from '../types';
import { BookCover } from './BookCover';
import { BOOKS_DATA } from '../data/siteData';
import { compressAndProcessImage } from '../utils/imageUtils';
import { CurrencyCode, ExchangeRates, formatPrice, getDisplayPrice } from '../utils/pricing';

interface BookDetailModalProps {
  book: Book | null;
  currency?: CurrencyCode;
  exchangeRates?: ExchangeRates;
  onClose: () => void;
  onBuy: (book: Book) => void;
  onAddToCart?: (book: Book) => void;
  onSampleRead?: (book: Book) => void;
  onUpdateCover?: (bookId: number, coverUrl: string) => void;
}

export function BookDetailModal({ book, currency = 'USD', exchangeRates, onClose, onBuy, onAddToCart, onSampleRead, onUpdateCover }: BookDetailModalProps) {
  if (!book) return null;

  const defaultBook = BOOKS_DATA.find((b) => b.id === book.id);
  const isCustomCover = defaultBook?.coverImage !== book.coverImage;
  const priceSummary = getDisplayPrice(book, currency, exchangeRates);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-8 text-left"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 w-11 h-11 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors active:scale-95"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center border-b border-slate-100 pb-6">
          <div className="shrink-0 mx-auto sm:mx-0 flex flex-col items-center gap-2">
            <BookCover book={book} size="md" showAuthor={true} />
            {onUpdateCover && (
              <div className="flex flex-col items-center gap-1.5 w-full">
                <label className="inline-flex items-center justify-center gap-1.5 text-[11px] font-mono font-semibold px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 cursor-pointer transition-colors border border-blue-200 w-full text-center shadow-2xs">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload My Cover</span>
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
                {isCustomCover && defaultBook?.coverImage && (
                  <button
                    type="button"
                    onClick={() => onUpdateCover(book.id, defaultBook.coverImage!)}
                    className="inline-flex items-center justify-center gap-1 text-[10px] font-mono text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset to Original</span>
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2 flex-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-mono font-bold">
              <span>Book #{book.id}</span>
              <span>•</span>
              <span>{book.tag}</span>
            </div>

            <h3 className="text-2xl font-extrabold text-slate-900 leading-tight">
              {book.title}
            </h3>

            {book.subtitle && (
              <p className="text-sm font-semibold text-slate-600">
                {book.subtitle}
              </p>
            )}

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono text-slate-500">
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                {book.pages} Pages
              </span>
              <span className="flex items-center gap-1">
                <Terminal className="w-3.5 h-3.5 text-blue-600" />
                {book.targetKernel}
              </span>
              {book.isbn && <span>ISBN: {book.isbn}</span>}
            </div>

            <div className="pt-2 flex items-center gap-2 text-sm">
              <span className="text-slate-400 line-through">{formatPrice(priceSummary.originalPrice, currency)}</span>
              <span className="text-xl font-black text-slate-900">{formatPrice(priceSummary.effectivePrice, currency)}</span>
              {priceSummary.hasOffer && (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  Save {priceSummary.discountPercent}%
                </span>
              )}
            </div>

            {/* Action buttons: Sample Read & Add to Cart */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
              {onSampleRead && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSampleRead(book);
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 min-h-[46px] bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 text-sm font-bold rounded-xl border border-slate-300 shadow-2xs transition-colors active:scale-[0.98]"
                >
                  <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Sample Read (Free 20%)</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onAddToCart) {
                    onAddToCart(book);
                    return;
                  }
                  onBuy(book);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[46px] bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-bold rounded-xl shadow-sm hover:shadow transition-colors active:scale-[0.98]"
              >
                <ShoppingCart className="w-4 h-4 shrink-0" />
                <span>Add to Cart • {formatPrice(priceSummary.effectivePrice, currency)}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Overview */}
        <div className="py-6 space-y-4 border-b border-slate-100">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-mono">
            Book Overview
          </h4>
          <p className="text-sm text-slate-600 leading-relaxed">
            {book.fullDescription || book.description}
          </p>
        </div>

        {/* Chapters Outline */}
        {book.chapters && (
          <div className="pt-6 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-mono flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Table of Contents Highlights</span>
            </h4>
            <div className="space-y-2">
              {book.chapters.map((chap, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs font-medium text-slate-800"
                >
                  <span className="w-5 h-5 rounded bg-white border border-slate-200 text-slate-500 flex items-center justify-center font-mono text-[10px] shrink-0">
                    {idx + 1}
                  </span>
                  <span>{chap}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
