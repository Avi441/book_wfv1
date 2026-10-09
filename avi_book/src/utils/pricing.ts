import { Book } from '../types';

export type CurrencyCode = 'USD' | 'INR' | 'GBP' | 'EUR' | 'AED' | 'SGD' | 'AUD' | 'CAD' | 'JPY';
export type ExchangeRates = Partial<Record<CurrencyCode, number>>;

export const DEFAULT_CURRENCY: CurrencyCode = 'USD';

export const CURRENCY_CONFIG: Record<
  CurrencyCode,
  {
    symbol: string;
    locale: string;
    usdRate: number;
    displayName: string;
  }
> = {
  USD: { symbol: '$', locale: 'en-US', usdRate: 1, displayName: 'US Dollar' },
  INR: { symbol: '₹', locale: 'en-IN', usdRate: 83, displayName: 'Indian Rupee' },
  GBP: { symbol: '£', locale: 'en-GB', usdRate: 0.78, displayName: 'British Pound' },
  EUR: { symbol: '€', locale: 'en-IE', usdRate: 0.92, displayName: 'Euro' },
  AED: { symbol: 'د.إ', locale: 'en-AE', usdRate: 3.67, displayName: 'UAE Dirham' },
  SGD: { symbol: 'S$', locale: 'en-SG', usdRate: 1.35, displayName: 'Singapore Dollar' },
  AUD: { symbol: 'A$', locale: 'en-AU', usdRate: 1.52, displayName: 'Australian Dollar' },
  CAD: { symbol: 'CA$', locale: 'en-CA', usdRate: 1.38, displayName: 'Canadian Dollar' },
  JPY: { symbol: '¥', locale: 'ja-JP', usdRate: 150, displayName: 'Japanese Yen' },
};

export function getBookCurrency(book: Pick<Book, 'priceCurrency'>): CurrencyCode {
  return book.priceCurrency && book.priceCurrency in CURRENCY_CONFIG
    ? book.priceCurrency as CurrencyCode
    : DEFAULT_CURRENCY;
}

export function getBookOriginalPrice(book: Pick<Book, 'price' | 'offerPrice' | 'discountPercent'>): number {
  const original = Number(book.price ?? 39.99);
  return Number.isFinite(original) ? Math.max(0, original) : 39.99;
}

export function getBookOfferPrice(book: Pick<Book, 'price' | 'offerPrice' | 'discountPercent'>): number {
  const original = getBookOriginalPrice(book);
  const explicitOffer = Number(book.offerPrice ?? 0);

  if (Number.isFinite(explicitOffer) && explicitOffer > 0 && explicitOffer < original) {
    return Number(explicitOffer.toFixed(2));
  }

  const discountPercent = Number(book.discountPercent ?? 0);
  if (Number.isFinite(discountPercent) && discountPercent > 0 && discountPercent < 100) {
    return Number((original * (1 - discountPercent / 100)).toFixed(2));
  }

  return original;
}

export function getBookPriceBreakdown(book: Pick<Book, 'price' | 'offerPrice' | 'discountPercent'>) {
  const originalPrice = getBookOriginalPrice(book);
  const offerPrice = getBookOfferPrice(book);
  const hasOffer = offerPrice > 0 && offerPrice < originalPrice;

  return {
    originalPrice,
    offerPrice: hasOffer ? offerPrice : originalPrice,
    effectivePrice: hasOffer ? offerPrice : originalPrice,
    hasOffer,
    discountPercent: hasOffer ? Number((((originalPrice - offerPrice) / originalPrice) * 100).toFixed(1)) : 0,
  };
}

export function convertUsdToCurrency(
  amount: number,
  currency: CurrencyCode = DEFAULT_CURRENCY,
  exchangeRates?: ExchangeRates,
): number {
  const config = CURRENCY_CONFIG[currency] ?? CURRENCY_CONFIG[DEFAULT_CURRENCY];
  const rate = exchangeRates?.[currency] ?? config.usdRate;
  return Number((amount * rate).toFixed(2));
}

export function formatPrice(amount: number, currency: CurrencyCode = DEFAULT_CURRENCY, locale?: string): string {
  const config = CURRENCY_CONFIG[currency] ?? CURRENCY_CONFIG[DEFAULT_CURRENCY];
  const formatter = new Intl.NumberFormat(locale ?? config.locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(amount);
}

export function convertCurrencyAmount(
  amount: number,
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode,
  exchangeRates?: ExchangeRates,
): number {
  const fromRate = exchangeRates?.[fromCurrency] ?? CURRENCY_CONFIG[fromCurrency].usdRate;
  const toRate = exchangeRates?.[toCurrency] ?? CURRENCY_CONFIG[toCurrency].usdRate;
  return Number(((amount / fromRate) * toRate).toFixed(2));
}

export function getDisplayPrice(
  book: Pick<Book, 'price' | 'offerPrice' | 'discountPercent' | 'priceCurrency'>,
  currency: CurrencyCode = DEFAULT_CURRENCY,
  exchangeRates?: ExchangeRates,
) {
  const breakdown = getBookPriceBreakdown(book);
  const storedCurrency = getBookCurrency(book);
  const convertedOriginal = convertCurrencyAmount(breakdown.originalPrice, storedCurrency, currency, exchangeRates);
  const convertedOffer = convertCurrencyAmount(breakdown.offerPrice, storedCurrency, currency, exchangeRates);
  const convertedEffective = convertCurrencyAmount(breakdown.effectivePrice, storedCurrency, currency, exchangeRates);

  return {
    ...breakdown,
    originalPrice: convertedOriginal,
    offerPrice: convertedOffer,
    effectivePrice: convertedEffective,
    formattedOriginal: formatPrice(convertedOriginal, currency),
    formattedOffer: formatPrice(convertedEffective, currency),
  };
}