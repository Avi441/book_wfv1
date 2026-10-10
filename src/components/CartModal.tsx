import { Minus, Plus, ShoppingCart, Trash2, X } from 'lucide-react';
import { Book } from '../types';
import { CurrencyCode, ExchangeRates, formatPrice, getDisplayPrice } from '../utils/pricing';

interface CartEntry {
  id: number;
  title: string;
  quantity: number;
}

interface CartModalProps {
  isOpen: boolean;
  entries: CartEntry[];
  books: Book[];
  currency: CurrencyCode;
  exchangeRates: ExchangeRates;
  onClose: () => void;
  onRemove: (bookId: number) => void;
  onQuantityChange: (bookId: number, quantity: number) => void;
  onCheckout: (book: Book, quantity: number) => void;
}

export function CartModal({
  isOpen,
  entries,
  books,
  currency,
  exchangeRates,
  onClose,
  onRemove,
  onQuantityChange,
  onCheckout,
}: CartModalProps) {
  if (!isOpen) return null;

  const items = entries
    .map((entry) => ({ entry, book: books.find((book) => book.id === entry.id) }))
    .filter((item): item is { entry: CartEntry; book: Book } => Boolean(item.book));
  const total = items.reduce(
    (sum, { entry, book }) => sum + getDisplayPrice(book, currency, exchangeRates).effectivePrice * entry.quantity,
    0,
  );

  return (
    <div
      className="fixed inset-0 z-[60] flex justify-end bg-slate-950/50 backdrop-blur-[2px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Shopping cart"
    >
      <section
        className="flex h-full w-full max-w-lg flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-200"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <ShoppingCart className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">Your Cart</h2>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
              {items.reduce((sum, item) => sum + item.entry.quantity, 0)}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingCart className="h-9 w-9 text-slate-300" />
            <p className="font-semibold text-slate-800">Your cart is empty</p>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Continue browsing
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto p-4 sm:p-5">
              {items.map(({ entry, book }) => {
                const price = getDisplayPrice(book, currency, exchangeRates);
                return (
                  <article key={book.id} className="border-b border-slate-200 pb-4 last:border-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-semibold leading-snug text-slate-900">{book.title}</h3>
                        <div className="mt-1 flex items-center gap-2 text-sm">
                          <span className="text-red-800 font-semibold line-through decoration-red-800">{formatPrice(price.originalPrice, currency)}</span>
                          <span className="font-bold text-slate-900">{formatPrice(price.effectivePrice, currency)}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemove(book.id)}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                        aria-label={`Remove ${book.title} from cart`}
                        title="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <div className="inline-flex items-center rounded-md border border-slate-200">
                        <button
                          type="button"
                          onClick={() => onQuantityChange(book.id, entry.quantity - 1)}
                          className="flex h-9 w-9 items-center justify-center text-slate-600 hover:bg-slate-50"
                          aria-label={`Decrease ${book.title} quantity`}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-8 text-center text-sm font-semibold text-slate-800">{entry.quantity}</span>
                        <button
                          type="button"
                          onClick={() => onQuantityChange(book.id, entry.quantity + 1)}
                          className="flex h-9 w-9 items-center justify-center text-slate-600 hover:bg-slate-50"
                          aria-label={`Increase ${book.title} quantity`}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-slate-900">
                        {formatPrice(price.effectivePrice * entry.quantity, currency)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onCheckout(book, entry.quantity)}
                      className="mt-3 inline-flex min-h-10 w-full items-center justify-center rounded-lg border border-blue-200 bg-blue-50 px-3 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                    >
                      Checkout this book
                    </button>
                  </article>
                );
              })}
            </div>

            <footer className="border-t border-slate-200 bg-slate-50 px-5 py-4">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="font-medium text-slate-600">Cart total</span>
                <span className="text-lg font-black text-slate-900">{formatPrice(total, currency)}</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500">
                Checkout is completed one title at a time in the current store flow.
              </p>
            </footer>
          </>
        )}
      </section>
    </div>
  );
}
