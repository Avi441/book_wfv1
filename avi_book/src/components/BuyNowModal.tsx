import { useState } from 'react';
import {
  X,
  ShoppingCart,
  CheckCircle2,
  Download,
  ShieldCheck,
  Zap,
  CreditCard,
  FileCheck,
  Check,
  ArrowRight,
} from 'lucide-react';
import { Book } from '../types';
import { BookCover } from './BookCover';
import { markBookPurchased } from '../utils/purchaseEntitlements';
import { CurrencyCode, ExchangeRates, convertUsdToCurrency, formatPrice, getDisplayPrice } from '../utils/pricing';

interface BuyNowModalProps {
  book: Book | null;
  isOpen: boolean;
  quantity?: number;
  currency?: CurrencyCode;
  exchangeRates?: ExchangeRates;
  onClose: () => void;
  onSuccess: (book: Book, format: string) => void;
}

export function BuyNowModal({ book, isOpen, quantity = 1, currency = 'USD', exchangeRates, onClose, onSuccess }: BuyNowModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<'digital' | 'bundle'>('digital');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'card' | 'paypal'>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen || !book) return null;

  const priceBreakdown = getDisplayPrice(book, currency, exchangeRates);
  const unitPrice = priceBreakdown.effectivePrice;
  const pricing = {
    digital: {
      price: unitPrice * quantity,
      title: 'Digital Edition (Instant Full Download)',
      description: 'DRM-free high-resolution PDF + EPUB + full source code bundle',
    },
    bundle: {
      price: (unitPrice + convertUsdToCurrency(20, currency, exchangeRates)) * quantity,
      title: 'Hardcover + Digital Bundle',
      description: 'Collector’s foil hardcover + instant digital PDF & EPUB download',
    },
  };

  const subtotal = pricing[selectedFormat].price;
  const multiBookDiscount = 0;
  const finalAmount = Math.max(0, subtotal - multiBookDiscount);
  const formattedSubtotal = formatPrice(finalAmount, currency);

  const handleCompletePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsProcessing(true);
    setTimeout(async () => {
      setIsProcessing(false);
      await markBookPurchased(book.id);
      setIsCompleted(true);
      onSuccess(book, selectedFormat);

      // Trigger automatic file download of the book PDF
      if (book.pdfUrl) {
        const link = document.createElement('a');
        link.href = book.pdfUrl;
        link.download = book.pdfDownloadName || book.pdfFileName || `${book.title}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-7 text-left"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isCompleted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                Purchase Complete!
              </h3>
              <p className="text-sm text-slate-600">
                Your full download of <strong>{book.title}</strong> has started automatically.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 text-left space-y-2">
              <div className="flex items-center justify-between font-mono font-bold text-slate-800 pb-1 border-b border-slate-200">
                <span>Receipt Sent To:</span>
                <span>{email || 'Your Email'}</span>
              </div>
              <p className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <FileCheck className="w-4 h-4" />
                <span>Full DRM-Free Book ({book.pages || 273} pages) Unlocked</span>
              </p>
              <p className="flex items-center gap-1.5 text-slate-600">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Includes companion GitHub kernel repository code &amp; interview questions</span>
              </p>
            </div>

            {book.pdfUrl && (
              <a
                href={book.pdfUrl}
                download={book.pdfDownloadName || book.pdfFileName || `${book.title}.pdf`}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Again (Full PDF)</span>
              </a>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleCompletePurchase} className="space-y-5">
            {/* Header info */}
            <div className="flex gap-4 items-center border-b border-slate-100 pb-4">
              <div className="shrink-0 rounded overflow-hidden shadow-md border border-slate-200">
                <BookCover book={book} size="sm" showAuthor={false} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full mb-1">
                  <span>FULL DOWNLOAD EDITION</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight truncate">
                  {book.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 truncate">
                  By Avinash Pal • {book.pages || 273} Pages
                </p>
                <p className="text-sm font-bold text-slate-900 mt-1">
                  {formatPrice(pricing[selectedFormat].price, currency)}
                </p>
              </div>
            </div>

            {/* Edition Format Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 font-mono uppercase tracking-wider">
                Select Edition:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedFormat('digital')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedFormat === 'digital'
                      ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">Digital Edition</span>
                      <span className="font-mono font-bold text-xs text-blue-600">{formatPrice(pricing.digital.price, currency)}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-tight">
                    Instant Full PDF &amp; EPUB Download
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedFormat('bundle')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedFormat === 'bundle'
                      ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">Hardcover + Digital</span>
                      <span className="font-mono font-bold text-xs text-blue-600">{formatPrice(pricing.bundle.price, currency)}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-tight">
                    Printed Foil Book + Instant Download
                  </p>
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
              <div className="mb-2 flex items-center justify-between text-slate-700">
                <span className="font-semibold">Order summary</span>
                <span className="font-mono font-bold">{selectedFormat === 'bundle' ? 'Bundle' : 'Digital'} × {quantity}</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between"><span>Subtotal</span><span className="font-mono">{formatPrice(subtotal, currency)}</span></div>
                <div className="flex justify-between text-emerald-700"><span>Multi-book offer</span><span className="font-mono">-{formatPrice(multiBookDiscount, currency)}</span></div>
                <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-bold text-slate-900"><span>Total</span><span className="font-mono">{formattedSubtotal}</span></div>
              </div>
              <p className="mt-2 text-[11px] text-slate-500">Eligible for a bundled savings offer across multiple purchases.</p>
            </div>

            {/* Buyer Info */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address (for download delivery) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full px-3 py-2 text-xs bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Avinash Pal"
                  className="w-full px-3 py-2 text-xs bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'razorpay', label: 'Razorpay (UPI / Cards)', icon: Zap },
                  { id: 'card', label: 'Credit / Debit', icon: CreditCard },
                  { id: 'paypal', label: 'PayPal', icon: ShieldCheck },
                ].map((method) => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={`p-2 rounded-lg border text-center text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                        paymentMethod === method.id
                          ? 'border-blue-600 bg-blue-50 text-blue-800 ring-1 ring-blue-500'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{method.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* What's included checklist */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-slate-600 text-xs">
              <div className="flex items-center gap-2 text-slate-800 font-semibold">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Full Unabridged Working Guide ({book.pages || 273} Pages)</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Instant DRM-Free PDF &amp; EPUB direct download</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Full companion Linux source code repository</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>
                {isProcessing
                  ? 'Processing Purchase via Razorpay...'
                  : `Pay & Download • $${finalAmount.toFixed(2)} (₹${Math.round(finalAmount * 83).toLocaleString('en-IN')})`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[11px] text-center text-slate-400 font-mono">
              🔒 256-bit SSL encrypted · 30-day money-back guarantee · Instant download
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
