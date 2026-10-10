import { useState, useEffect, useMemo, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import {
  X,
  BookOpen,
  Check,
  Copy,
  Sparkles,
  Lock,
  Sun,
  Moon,
  Coffee,
  ShoppingCart,
  Layers,
  Terminal,
  ArrowRight,
  ShieldCheck,
  FileText,
  ExternalLink,
  Bookmark,
  RotateCcw,
} from 'lucide-react';
import { Book } from '../types';
import { getPreviewPageLimit, hasPurchasedBook } from '../utils/purchaseEntitlements';
import { CurrencyCode, ExchangeRates, getDisplayPrice } from '../utils/pricing';
import {
  getSavedReadingPosition,
  saveReadingPosition,
  SavedReadingPosition,
} from '../utils/readingProgress';

interface SampleReadModalProps {
  book: Book | null;
  currency?: CurrencyCode;
  exchangeRates?: ExchangeRates;
  onClose: () => void;
  onBuyNow: (book: Book) => void;
}

function base64ToBlobUrl(base64DataUrl: string): string {
  try {
    const parts = base64DataUrl.split(',');
    if (parts.length < 2) return base64DataUrl;
    const mimeMatch = parts[0].match(/:(.*?);/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'application/pdf';
    const bstr = atob(parts[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const blob = new Blob([u8arr], { type: mimeType });
    return URL.createObjectURL(blob);
  } catch (err) {
    console.warn('Failed to convert base64 to blob url', err);
    return base64DataUrl;
  }
}

export function SampleReadModal({ book, currency = 'USD', exchangeRates, onClose, onBuyNow }: SampleReadModalProps) {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [copiedSnippetIndex, setCopiedSnippetIndex] = useState<number | null>(null);
  const [readerTheme, setReaderTheme] = useState<'light' | 'sepia' | 'dark'>('dark');
  const [activeMode, setActiveMode] = useState<'pdf-sample' | 'reader'>('reader');
  const [blobPdfUrl, setBlobPdfUrl] = useState<string>('');
  const [sampleError, setSampleError] = useState<string | null>(null);
  const [actualPdfPageCount, setActualPdfPageCount] = useState<number | null>(null);
  const [isLockedPopupOpen, setIsLockedPopupOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [savedPosition, setSavedPosition] = useState<SavedReadingPosition | null>(null);
  const [showContinueBanner, setShowContinueBanner] = useState(false);
  const contentScrollRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Track and load saved reading progress when specific book is opened
  useEffect(() => {
    if (!book) {
      setSavedPosition(null);
      setShowContinueBanner(false);
      return;
    }

    const saved = getSavedReadingPosition(book.id);
    if (saved && (saved.scrollTop > 40 || saved.chapterIndex > 0 || saved.scrollProgress > 3)) {
      setSavedPosition(saved);
      setShowContinueBanner(true);
    } else {
      setSavedPosition(null);
      setShowContinueBanner(false);
    }
  }, [book?.id]);

  useEffect(() => {
    setScrollProgress(0);
    if (contentScrollRef.current) {
      contentScrollRef.current.scrollTop = 0;
    }
  }, [activeChapterIndex, activeMode]);

  const handleResumeReading = () => {
    if (!savedPosition) return;
    setActiveMode('reader');
    if (savedPosition.chapterIndex !== activeChapterIndex) {
      setActiveChapterIndex(savedPosition.chapterIndex);
    }
    setScrollProgress(savedPosition.scrollProgress);
    setShowContinueBanner(false);

    // Smooth scroll to the saved scroll position
    setTimeout(() => {
      if (contentScrollRef.current) {
        contentScrollRef.current.scrollTo({
          top: savedPosition.scrollTop,
          behavior: 'smooth',
        });
      }
    }, 120);
  };

  const handleDismissResume = () => {
    setShowContinueBanner(false);
  };

  const handleContentScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const maxScroll = scrollHeight - clientHeight;
    const pct = maxScroll <= 0 ? 100 : Math.min(100, Math.max(0, (scrollTop / maxScroll) * 100));
    setScrollProgress(pct);

    // Debounced tracking of last scroll position to local state
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      if (book && (scrollTop > 30 || pct > 2)) {
        const data: SavedReadingPosition = {
          bookId: book.id,
          chapterIndex: activeChapterIndex,
          scrollTop,
          scrollProgress: pct,
          timestamp: Date.now(),
        };
        saveReadingPosition(data);
        setSavedPosition(data);
      }
    }, 350);
  };

  const rawPdfUrl = useMemo(() => {
    if (!book) return '';
    return (
      book.pdfUrl ||
      (book.id === 1
        ? '/pdfs/think-like-a-linux-storage-engineer_f-V2.pdf'
        : book.id === 2
        ? '/pdfs/think-like-a-linux-kernel-developer.pdf'
        : book.id === 3
        ? '/pdfs/net_fV3.pdf'
        : `/pdfs/${book.pdfFileName || 'think-like-a-linux-storage-engineer_f-V2.pdf'}`)
    );
  }, [book?.pdfUrl, book?.id, book?.pdfFileName]);

  const [isPurchased, setIsPurchased] = useState(false);

  useEffect(() => {
    let disposed = false;

    const syncAccess = async () => {
      if (!book) {
        setIsPurchased(false);
        return;
      }

      const purchased = await hasPurchasedBook(book.id);
      if (!disposed) {
        setIsPurchased(Boolean(purchased));
      }
    };

    syncAccess();
    return () => {
      disposed = true;
    };
  }, [book?.id]);

  useEffect(() => {
    if (!book) return;
    if (!isPurchased && activeChapterIndex > 0) {
      setActiveChapterIndex(0);
    }
  }, [book, isPurchased, activeChapterIndex]);

  useEffect(() => {
    let disposed = false;

    const generateSampleFromPdf = async () => {
      if (!rawPdfUrl) {
        setBlobPdfUrl('');
        setSampleError(null);
        setActualPdfPageCount(Number(book?.pages) || null);
        return;
      }

      if (isPurchased) {
        setBlobPdfUrl(rawPdfUrl);
        setActualPdfPageCount(Number(book?.pages) || 250);
        setSampleError(null);
        return;
      }

      try {
        const response = await fetch(rawPdfUrl);
        if (!response.ok) throw new Error(`Sample generation failed: ${response.status}`);

        const originalPdf = await PDFDocument.load(await response.arrayBuffer());
        const totalPages = originalPdf.getPageCount();
        const previewLimit = getPreviewPageLimit(totalPages);

        const samplePdf = await PDFDocument.create();
        const pageIndexes = Array.from({ length: previewLimit }, (_, index) => index);
        const pagesToCopy = await samplePdf.copyPages(originalPdf, pageIndexes);
        pagesToCopy.forEach((page) => samplePdf.addPage(page));
        const pdfBytes = await samplePdf.save();
        const sampleBuffer = new Uint8Array(pdfBytes).buffer;
        const blob = new Blob([sampleBuffer], { type: 'application/pdf' });
        const generatedUrl = URL.createObjectURL(blob);

        if (!disposed) {
          setBlobPdfUrl(generatedUrl);
          setActualPdfPageCount(totalPages);
          setSampleError(null);
        } else {
          URL.revokeObjectURL(generatedUrl);
        }
      } catch (error) {
        console.warn('Sample PDF generation failed. Full PDF preview is intentionally blocked.', error);
        if (!disposed) {
          setBlobPdfUrl('');
          setActualPdfPageCount(Number(book?.pages) || 250);
          setSampleError('Preview is restricted until purchase. Buy the full book to unlock the complete PDF.');
        }
      }
    };

    generateSampleFromPdf();

    return () => {
      disposed = true;
      if (blobPdfUrl.startsWith('blob:')) {
        URL.revokeObjectURL(blobPdfUrl);
      }
    };
  }, [book, isPurchased, rawPdfUrl]);

  if (!book) return null;

  const pdfUrl = isPurchased ? rawPdfUrl : blobPdfUrl;
  const priceSummary = getDisplayPrice(book, currency, exchangeRates);
  const displayPrice = priceSummary.formattedOffer;
  const originalPrice = priceSummary.formattedOriginal;
  const totalAvailablePages = actualPdfPageCount ?? (Number(book.pages) || 250);
  const samplePagesCount = isPurchased ? totalAvailablePages : getPreviewPageLimit(totalAvailablePages);
  const chapters = book.pdfNotes || [];
  const activeChapter = isPurchased ? (chapters[activeChapterIndex] || chapters[0]) : chapters[0];
  const allToc = book.chapters || [
    'Chapter 1 — Fundamentals and Architecture',
    'Chapter 2 — Kernel Data Paths & Core Data Structures',
    'Chapter 3 — Advanced Subsystems and Driver Hooks',
    'Chapter 4 — Multi-Queue blk-mq & Performance Optimization',
    'Chapter 5 — Filesystem & Memory Management Interactions',
    'Chapter 6 — High-Speed Hardware Protocols & Bus Interfaces',
    'Chapter 7 — Latency Profiling with bpftrace & eBPF',
    'Chapter 8 — Production Reliability, Failure & Case Studies',
    'Chapter 9 — Interview Questions & Architecture Mastery',
    'Chapter 10 — Future Linux Subsystem Roadmaps',
  ];

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard?.writeText(code);
    setCopiedSnippetIndex(index);
    setTimeout(() => setCopiedSnippetIndex(null), 2500);
  };

  const handleLockedChapterClick = (index: number) => {
    if (isPurchased || index === 0) {
      setActiveChapterIndex(index);
      setShowContinueBanner(false);
      return;
    }
    setIsLockedPopupOpen(true);
  };

  const handleContinueReadingPreview = () => {
    setIsLockedPopupOpen(false);
    setActiveChapterIndex(0);
  };

  const themeStyles = {
    light: 'bg-white text-slate-900 border-slate-200',
    sepia: 'bg-[#fcf7ed] text-[#433422] border-[#e8ddcb]',
    dark: 'bg-slate-950 text-slate-100 border-slate-800',
  };

  const codeBoxStyles = {
    light: 'bg-slate-900 text-slate-100 border-slate-800',
    sepia: 'bg-[#2a241b] text-[#f4ede2] border-[#44392b]',
    dark: 'bg-slate-900 text-slate-100 border-slate-800',
  };

  const cardStyles = {
    light: 'bg-slate-50 border-slate-200',
    sepia: 'bg-[#f4ebd9] border-[#dfd1bb]',
    dark: 'bg-slate-900 border-slate-800',
  };

  const headingTextStyles = {
    light: 'text-slate-900',
    sepia: 'text-[#2d2016]',
    dark: 'text-slate-100',
  };

  const mutedTextStyles = {
    light: 'text-slate-600',
    sepia: 'text-[#5a4633]',
    dark: 'text-slate-300',
  };

  const bodyTextStyles = {
    light: 'text-slate-700',
    sepia: 'text-[#4d3c2f]',
    dark: 'text-slate-200',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-5xl h-[94vh] max-h-[900px] flex flex-col rounded-2xl shadow-2xl border overflow-hidden ${themeStyles[readerTheme]}`}
      >
        {/* Top Scroll Progress Bar */}
        <div
          className="w-full h-1 bg-slate-200/50 dark:bg-slate-800/80 shrink-0 z-30 relative overflow-hidden"
          role="progressbar"
          aria-valuenow={Math.round(scrollProgress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Reading preview progress"
        >
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 transition-all duration-150 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* Top Sticky Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-inherit bg-inherit/95 backdrop-blur-sm z-20 shrink-0">
          {/* Left Title & Badge */}
          <div className="flex items-center gap-3 min-w-0">
            {book.coverImage && (
              <img
                src={book.coverImage}
                alt={book.title}
                referrerPolicy="no-referrer"
                className="w-8 h-11 object-cover rounded shadow-xs shrink-0 hidden sm:block border border-slate-300"
              />
            )}
            <div className="min-w-0 text-left">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500 text-slate-950 shrink-0">
                  {isPurchased ? 'FULL ACCESS' : 'FREE 20% PDF SAMPLE'}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-sky-300 border border-blue-200 dark:border-blue-800 shrink-0">
                  {Math.round(scrollProgress)}% read
                </span>
                {savedPosition && (
                  <button
                    type="button"
                    onClick={handleResumeReading}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-blue-900/60 dark:hover:bg-blue-800 dark:text-sky-300 border border-blue-300 dark:border-blue-700 transition-colors cursor-pointer active:scale-95 shadow-2xs"
                    title={`Continue reading from Chapter ${savedPosition.chapterIndex + 1} (${Math.round(savedPosition.scrollProgress)}%)`}
                  >
                    <RotateCcw className="w-3 h-3 text-blue-600 dark:text-sky-400" />
                    <span>Continue reading ({Math.round(savedPosition.scrollProgress)}%)</span>
                  </button>
                )}
                <span className="text-[11px] font-mono opacity-70 hidden sm:inline truncate">
                  {isPurchased ? `All ${totalAvailablePages} pages unlocked` : `Pages 1–${samplePagesCount} of ${totalAvailablePages}`}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-extrabold truncate leading-tight mt-0.5">
                {book.title}
              </h2>
              <div
                className={`mt-1.5 inline-flex items-center gap-2 rounded-lg border px-2 py-1 text-[10px] font-mono ${
                  readerTheme === 'dark'
                    ? 'border-slate-700 bg-slate-900/80 text-slate-200'
                    : 'border-slate-200 bg-slate-100 text-slate-700'
                }`}
              >
                <span className="uppercase tracking-[0.15em] text-red-900 dark:text-red-300 font-bold">Price</span>
                <span className="line-through text-red-800 dark:text-red-400 font-semibold decoration-red-800">{originalPrice}</span>
                <span className="text-sm font-black text-blue-500">{displayPrice}</span>
                {priceSummary.hasOffer && (
                  <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400">
                    Save {priceSummary.discountPercent}%
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* View Mode Toggle: Interactive Notes vs PDF View */}
            <div className="hidden sm:flex items-center rounded-lg p-0.5 border border-inherit text-xs font-medium">
              <button
                type="button"
                onClick={() => setActiveMode('pdf-sample')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  activeMode === 'pdf-sample'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                PDF Format (20%)
              </button>
              <button
                type="button"
                onClick={() => setActiveMode('reader')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  activeMode === 'reader'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                Interactive Syllabus
              </button>
            </div>

            {/* Reading Theme Toggle */}
            <div className="flex items-center rounded-lg p-1 border border-inherit text-xs">
              <button
                type="button"
                onClick={() => setReaderTheme('light')}
                className={`p-1 rounded ${readerTheme === 'light' ? 'bg-black/10' : 'opacity-50 hover:opacity-100'}`}
                title="Light Theme"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setReaderTheme('sepia')}
                className={`p-1 rounded ${readerTheme === 'sepia' ? 'bg-amber-900/20' : 'opacity-50 hover:opacity-100'}`}
                title="Sepia Reading"
              >
                <Coffee className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setReaderTheme('dark')}
                className={`p-1 rounded ${readerTheme === 'dark' ? 'bg-white/20' : 'opacity-50 hover:opacity-100'}`}
                title="Dark Theme"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Primary Buy Now for Full Download */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onBuyNow(book);
              }}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 min-h-[38px] bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-sm transition-all active:scale-95"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span className="inline-flex items-center gap-1.5">
                <span className="line-through opacity-75 text-[10px]">{originalPrice}</span>
                <span>Buy ({displayPrice})</span>
              </span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-xl opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 active:bg-black/10 transition-colors active:scale-95"
              aria-label="Close sample preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Continue Reading Resume Prompt Banner */}
        {showContinueBanner && savedPosition && (
          <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0 shadow-sm border-b border-blue-500/40 animate-in slide-in-from-top-1 duration-200">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="p-1 rounded-md bg-white/15 text-white shrink-0">
                <Bookmark className="w-4 h-4 text-amber-300" />
              </span>
              <div className="truncate">
                <span className="font-bold">Welcome back!</span>
                <span className="opacity-90 ml-1.5 hidden sm:inline">
                  You previously read up to Chapter {savedPosition.chapterIndex + 1} ({Math.round(savedPosition.scrollProgress)}% completed).
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleResumeReading}
                className="px-3.5 py-1.5 bg-white hover:bg-slate-100 active:bg-slate-200 text-blue-900 font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
                <span>Continue reading</span>
              </button>
              <button
                type="button"
                onClick={handleDismissResume}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors opacity-80 hover:opacity-100"
                title="Dismiss and start from top"
                aria-label="Dismiss resume prompt"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Notice & Progress Ribbon */}
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-semibold text-amber-800 dark:text-amber-300">
              Free 20% Sample Preview (Pages 1–{samplePagesCount})
            </span>
            <span className="opacity-70 hidden md:inline">
              — Full {book.pages || 250}-page unabridged PDF &amp; EPUB available on Buy Now.
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              onClose();
              onBuyNow(book);
            }}
            className="text-blue-600 dark:text-sky-400 font-bold hover:underline inline-flex items-center gap-1 text-[11px] cursor-pointer"
          >
            <span>Get Full Book ({displayPrice})</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Modal Main Body */}
        {activeMode === 'pdf-sample' ? (
          <div className="flex-1 flex flex-col min-h-0 bg-slate-900 relative">
            {/* Top Toolbar inside PDF Preview */}
            <div className="p-2.5 bg-slate-800 text-slate-200 text-xs flex flex-wrap items-center justify-between px-4 border-b border-slate-700 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="font-mono font-bold text-sky-400 truncate max-w-[200px] sm:max-w-xs" title={book.pdfFileName || book.title}>
                  {book.pdfFileName || book.title}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                  Sample Preview (1–{samplePagesCount})
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                {pdfUrl && (
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-300 hover:text-white transition-colors text-xs font-mono inline-flex items-center gap-1 bg-slate-700/80 hover:bg-slate-700 px-2.5 py-1 rounded-md"
                  >
                    <span>Open in Tab</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onBuyNow(book);
                  }}
                  className="px-3 py-1 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center gap-1"
                >
                  <ShoppingCart className="w-3 h-3" />
                  <span className="hidden sm:inline">Buy Full Edition</span>
                  <span className="sm:hidden">Buy</span>
                </button>
              </div>
            </div>

            {/* Embedded PDF object & iframe */}
            <div className="flex-1 relative w-full h-full bg-slate-950 overflow-hidden">
              {pdfUrl ? (
                <object
                  data={pdfUrl.startsWith('blob:') ? `${pdfUrl}#toolbar=1&navpanes=0&page=1` : pdfUrl}
                  type="application/pdf"
                  className="w-full h-full border-0"
                >
                  <iframe
                    src={pdfUrl.startsWith('blob:') ? `${pdfUrl}#toolbar=1&navpanes=0&page=1` : pdfUrl}
                    title={`${book.title} Sample PDF`}
                    className="w-full h-full border-0"
                  >
                    <div className="p-8 text-center text-slate-300 space-y-4">
                      <FileText className="w-12 h-12 text-slate-500 mx-auto" />
                      <p className="text-sm">
                        PDF preview is ready. If your browser does not support inline embedding, you can open it directly:
                      </p>
                      <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open PDF in New Window</span>
                      </a>
                    </div>
                  </iframe>
                </object>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-300 p-6 space-y-4 text-center">
                  <FileText className="w-12 h-12 text-slate-500 animate-pulse" />
                  <p className="text-sm font-mono">
                    {isPurchased ? 'Loading full PDF...' : 'Preview is restricted until purchase.'}
                  </p>
                  {!isPurchased && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onBuyNow(book);
                      }}
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Unlock the Full Book</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Bottom 20% Limit Footer Banner */}
            <div className="p-3 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-300 px-5 gap-2">
              <span className="font-mono text-[11px]">
                Showing the first {Math.min(samplePagesCount, book.pages || 250)} pages of the authorized sample preview.
              </span>
              {sampleError && (
                <span className="text-amber-300 text-[10px]">{sampleError}</span>
              )}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onBuyNow(book);
                }}
                className="text-sky-400 hover:text-sky-300 font-bold hover:underline flex items-center gap-1 font-mono text-[11px]"
              >
                <span>Unlock all {book.pages || 250} pages</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
            {/* Sidebar Table of Contents */}
            <div className="w-full md:w-72 lg:w-80 border-b md:border-b-0 md:border-r border-inherit bg-black/2 shrink-0 flex flex-col overflow-y-auto">
              <div className="p-3.5 border-b border-inherit bg-inherit sticky top-0 z-10 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider font-mono opacity-80 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                  Table of Contents
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300">
                  {isPurchased ? 'Full Access' : '20% Sample'}
                </span>
              </div>

              <div className="p-2 space-y-1">
                {allToc.map((chapterTitle, index) => {
                  const isUnlocked = isPurchased || index === 0;
                  const isSelected = isUnlocked && activeChapterIndex === index;

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleLockedChapterClick(index)}
                      className={`w-full text-left p-2.5 rounded-lg text-xs transition-all flex items-start gap-2.5 ${
                        isSelected
                          ? 'bg-blue-600 text-white font-bold shadow-xs'
                          : isUnlocked
                            ? 'hover:bg-black/5 dark:hover:bg-white/5 opacity-90'
                            : 'opacity-60 hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-mono shrink-0 mt-0.5 ${
                        isSelected ? 'bg-white/20 text-white' : isUnlocked ? 'bg-emerald-500/10 text-emerald-600 font-bold' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {isUnlocked ? (index + 1) : <Lock className="w-3 h-3" />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate leading-snug">{chapterTitle}</p>
                        <span className={`text-[10px] block mt-0.5 ${isSelected ? 'text-white/80' : isUnlocked ? 'text-emerald-600 font-semibold' : 'text-slate-500 font-semibold'}`}>
                          {isUnlocked ? (index === 0 ? '✓ Free Chapter 1' : '✓ Unlocked') : 'Locked – purchase to unlock'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Sidebar Bottom Banner */}
              <div className="mt-auto p-4 border-t border-inherit bg-blue-50/50 dark:bg-blue-950/20 text-left">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Ready for the full working guide?
                </p>
                <p className="text-[11px] opacity-75 mt-1 leading-relaxed">
                  Unlock all 10 chapters ({book.pages || 273} pages) with companion code &amp; interview questions.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onBuyNow(book);
                  }}
                  className="mt-3 w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Buy Now ({displayPrice})</span>
                </button>
              </div>
            </div>

            {/* Main Chapter Content Preview Area */}
            <div
              ref={contentScrollRef}
              onScroll={handleContentScroll}
              className="flex-1 overflow-y-auto p-4 sm:p-7 space-y-6 text-left"
            >
              {book.syllabusVideoUrl && (
                <section className="space-y-2">
                  <h3 className={`text-sm font-bold ${headingTextStyles[readerTheme]}`}>
                    {book.syllabusVideoName || 'Syllabus video lesson'}
                  </h3>
                  <video
                    controls
                    preload="metadata"
                    src={book.syllabusVideoUrl}
                    className="aspect-video w-full max-h-[440px] rounded-lg bg-black object-contain"
                    aria-label={`${book.title} interactive syllabus video`}
                  />
                </section>
              )}
              {activeChapter ? (
                <>
                  {/* Chapter Header */}
                  <div className="border-b border-inherit pb-4 space-y-2">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-sky-300">
                      <span>Chapter {activeChapter.chapterNumber}</span>
                      <span>•</span>
                      <span>Sample Excerpt</span>
                    </div>
                    <h3 className={`text-xl sm:text-2xl font-black tracking-tight leading-tight ${headingTextStyles[readerTheme]}`}>
                      {activeChapter.title}
                    </h3>
                    <p className={`text-sm opacity-80 leading-relaxed font-serif ${mutedTextStyles[readerTheme]}`}>
                      {activeChapter.summary}
                    </p>
                  </div>

                  {/* Core Architecture Concepts */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 opacity-80">
                      <Layers className="w-3.5 h-3.5 text-blue-600" />
                      Key Subsystem Architecture
                    </h4>
                    <div className={`p-4 rounded-xl border ${cardStyles[readerTheme]} space-y-2`}>
                      {activeChapter.keyConcepts.map((concept, idx) => (
                        <div key={idx} className={`flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed ${bodyTextStyles[readerTheme]}`}>
                          <span className="w-4 h-4 rounded-full bg-blue-600/10 text-blue-600 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[11px]">
                            {idx + 1}
                          </span>
                          <span>{concept}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Linux Kernel C Code Snippets */}
                  {activeChapter.codeSnippets && activeChapter.codeSnippets.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 opacity-80">
                        <Terminal className="w-3.5 h-3.5 text-emerald-600" />
                        Production Linux Kernel Code Excerpt
                      </h4>
                      {activeChapter.codeSnippets.map((snippet, idx) => (
                        <div
                          key={idx}
                          className={`rounded-xl border overflow-hidden font-mono text-xs ${codeBoxStyles[readerTheme]}`}
                        >
                          <div className="flex items-center justify-between px-4 py-2 border-b border-inherit bg-black/20 text-slate-300 text-[11px]">
                            <span className="font-bold flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-400" />
                              {snippet.title}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyCode(snippet.code, idx)}
                              className="inline-flex items-center gap-1 hover:text-white transition-colors"
                            >
                              {copiedSnippetIndex === idx ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-emerald-400">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                          <pre className="p-4 overflow-x-auto text-[11.5px] leading-relaxed">
                            <code>{snippet.code}</code>
                          </pre>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Interview Takeaways */}
                  {activeChapter.interviewTakeaways && activeChapter.interviewTakeaways.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 opacity-80">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        Kernel Engineer Interview Takeaways
                      </h4>
                      <div className={`p-4 rounded-xl border ${cardStyles[readerTheme]} space-y-2`}>
                        {activeChapter.interviewTakeaways.map((takeaway, idx) => (
                          <div key={idx} className={`flex items-start gap-2 text-xs sm:text-sm ${bodyTextStyles[readerTheme]}`}>
                            <span className="text-amber-500 font-bold shrink-0 mt-0.5 font-mono">Q:</span>
                            <span className="font-medium">{takeaway}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* End of Sample Notice Box */}
                  <div className="mt-8 p-6 rounded-2xl border-2 border-blue-500/30 bg-gradient-to-br from-blue-500/5 via-blue-500/10 to-indigo-500/5 space-y-4 text-center">
                    <div className="w-12 h-12 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
                      <Lock className="w-6 h-6" />
                    </div>
                    <div className="max-w-xl mx-auto space-y-1">
                      <h4 className={`text-lg font-black tracking-tight ${headingTextStyles[readerTheme]}`}>
                        You've Reached the End of the Free Sample (20%)
                      </h4>
                      <p className={`text-xs sm:text-sm opacity-80 leading-relaxed ${mutedTextStyles[readerTheme]}`}>
                        To continue reading Chapters 3 through 10 with the complete {book.pages || 273}-page working guide, production benchmarks, and DRM-free downloads, get the full book today.
                      </p>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onBuyNow(book);
                        }}
                        className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Buy Now — {displayPrice} (Full Download)</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-center gap-4 text-[11px] font-mono opacity-70 pt-2">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Instant DRM-free PDF &amp; EPUB
                      </span>
                      <span>•</span>
                      <span>Lifetime Updates Included</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-16 opacity-60">
                  <p>Select a chapter to begin reading sample notes.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {isLockedPopupOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xl text-left">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.16em] text-slate-500">Enjoying the book?</p>
                <h3 className="text-xl font-black text-slate-900">Unlock the full ebook</h3>
              </div>
            </div>

            <p className="text-sm leading-6 text-slate-600">
              You’ve reached the end of your free preview. Purchase the full ebook to unlock every PDF page and all chapters in the interactive reader.
            </p>

            <div className="my-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-semibold text-slate-700">{book.title}</span>
                <span className="font-mono font-bold text-slate-900">{displayPrice}</span>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  setIsLockedPopupOpen(false);
                  onClose();
                  onBuyNow(book);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
              >
                <ShoppingCart className="h-4 w-4" />
                Buy Full Book
              </button>
              <button
                type="button"
                onClick={handleContinueReadingPreview}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Continue Reading Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
