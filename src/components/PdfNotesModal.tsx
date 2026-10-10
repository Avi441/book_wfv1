import { useState, useEffect, useMemo, useRef } from 'react';
import {
  X,
  Download,
  BookOpen,
  FileText,
  Check,
  Copy,
  ExternalLink,
  Code2,
  HelpCircle,
  Sun,
  Moon,
  Coffee,
  ShoppingCart,
} from 'lucide-react';
import { Book } from '../types';

interface PdfNotesModalProps {
  book: Book | null;
  onClose: () => void;
  onBuyNow?: (book: Book) => void;
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

export function PdfNotesModal({ book, onClose, onBuyNow }: PdfNotesModalProps) {
  const [activeTab, setActiveTab] = useState<'notes' | 'preview'>('notes');
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [copiedSnippetIndex, setCopiedSnippetIndex] = useState<number | null>(null);
  const [readerTheme, setReaderTheme] = useState<'light' | 'sepia' | 'dark'>('light');
  const [blobPdfUrl, setBlobPdfUrl] = useState<string>('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const contentScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setScrollProgress(0);
    if (contentScrollRef.current) {
      contentScrollRef.current.scrollTop = 0;
    }
  }, [activeChapterIndex, activeTab]);

  const handleContentScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll <= 0) {
      setScrollProgress(100);
    } else {
      const pct = Math.min(100, Math.max(0, (scrollTop / maxScroll) * 100));
      setScrollProgress(pct);
    }
  };

  const rawPdfUrl = useMemo(() => {
    if (!book) return '';
    return book.pdfUrl || `/pdfs/${book.pdfFileName || 'think-like-a-linux-storage-engineer_f-V2.pdf'}`;
  }, [book?.pdfUrl, book?.pdfFileName]);

  useEffect(() => {
    if (!rawPdfUrl) {
      setBlobPdfUrl('');
      return;
    }
    if (rawPdfUrl.startsWith('data:')) {
      const generatedUrl = base64ToBlobUrl(rawPdfUrl);
      setBlobPdfUrl(generatedUrl);
      return () => {
        if (generatedUrl.startsWith('blob:')) {
          URL.revokeObjectURL(generatedUrl);
        }
      };
    } else {
      setBlobPdfUrl(rawPdfUrl);
    }
  }, [rawPdfUrl]);

  if (!book) return null;

  const pdfUrl = blobPdfUrl || rawPdfUrl;
  const downloadFileName = book.pdfDownloadName || book.pdfFileName || `${book.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pdf`;
  const chapters = book.pdfNotes || [];
  const activeChapter = chapters[activeChapterIndex] || chapters[0];

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard?.writeText(code);
    setCopiedSnippetIndex(index);
    setTimeout(() => setCopiedSnippetIndex(null), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  // Theme styling for the reader container
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-5xl h-[92vh] max-h-[850px] flex flex-col rounded-2xl shadow-2xl border overflow-hidden ${themeStyles[readerTheme]}`}
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
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-inherit bg-inherit/90 backdrop-blur-sm z-20 shrink-0">
          {/* Left Title & Badge */}
          <div className="flex items-center gap-3 min-w-0">
            {book.coverImage && (
              <img
                src={book.coverImage}
                alt={book.title}
                referrerPolicy="no-referrer"
                className="w-8 h-11 object-cover rounded shadow-xs shrink-0 hidden sm:block border border-slate-700/20"
              />
            )}
            <div className="min-w-0 text-left">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-600 text-white shrink-0">
                  PDF NOTES
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-sky-300 border border-blue-200 dark:border-blue-800 shrink-0">
                  {Math.round(scrollProgress)}% read
                </span>
                <span className="text-[11px] font-mono opacity-60 hidden md:inline truncate">
                  {downloadFileName}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-extrabold truncate leading-tight mt-0.5">
                {book.title}
              </h2>
            </div>
          </div>

          {/* Center Tabs: Notes vs PDF Document Preview */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-black/5 dark:bg-white/10 shrink-0">
            <button
              onClick={() => setActiveTab('notes')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'notes'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Interactive Notes</span>
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'preview'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>PDF Document</span>
            </button>
          </div>

          {/* Right Action Tools: Download, Theme Toggle, 3D Showcase & Close */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Theme switcher */}
            <div className="hidden sm:flex items-center gap-1 px-1 py-0.5 rounded-md bg-black/5 dark:bg-white/10">
              <button
                onClick={() => setReaderTheme('light')}
                title="Light Theme"
                className={`p-1.5 rounded ${readerTheme === 'light' ? 'bg-white text-slate-900 shadow-2xs' : 'opacity-60'}`}
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setReaderTheme('sepia')}
                title="Sepia Theme"
                className={`p-1.5 rounded ${readerTheme === 'sepia' ? 'bg-[#ebdcb9] text-[#433422] shadow-2xs' : 'opacity-60'}`}
              >
                <Coffee className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setReaderTheme('dark')}
                title="Dark Theme"
                className={`p-1.5 rounded ${readerTheme === 'dark' ? 'bg-slate-800 text-white shadow-2xs' : 'opacity-60'}`}
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Buy Now Button for Full Download */}
            {onBuyNow && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onBuyNow(book);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors shrink-0"
                title={`Buy full edition of ${book.title} for instant download`}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Buy Now (${book.price || 39.99})</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 opacity-60 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {activeTab === 'notes' ? (
            <>
              {/* Left Chapter Syllabus Sidebar */}
              <div className="w-full md:w-64 lg:w-72 border-r border-inherit bg-black/2 dark:bg-white/2 p-3 sm:p-4 overflow-y-auto shrink-0 flex flex-col justify-between text-left">
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider opacity-70">
                      Chapter Excerpts
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 font-bold">
                      {book.pages || 250} pp
                    </span>
                  </div>

                  <div className="space-y-1">
                    {chapters.map((chap, idx) => (
                      <button
                        key={chap.id || idx}
                        onClick={() => setActiveChapterIndex(idx)}
                        className={`w-full text-left p-2.5 rounded-lg text-xs transition-all flex items-start gap-2.5 ${
                          activeChapterIndex === idx
                            ? 'bg-blue-600 text-white font-bold shadow-xs'
                            : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                          activeChapterIndex === idx ? 'bg-white/20 text-white' : 'bg-black/10 dark:bg-white/10'
                        }`}>
                          {idx + 1}
                        </span>
                        <div className="flex-1 truncate">
                          <div className="truncate font-semibold">{chap.title}</div>
                          <div className={`text-[10px] truncate ${activeChapterIndex === idx ? 'text-white/80' : 'opacity-60'}`}>
                            {chap.keyConcepts?.length || 3} Core Concepts
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Complete Book Syllabus Outline */}
                  {book.chapters && (
                    <div className="pt-3 border-t border-inherit">
                      <span className="text-[10px] font-mono uppercase tracking-wider opacity-60 px-1 mb-1.5 block">
                        Full Book Syllabus ({book.chapters.length} Chapters)
                      </span>
                      <div className="space-y-1 max-h-36 overflow-y-auto text-[11px] opacity-75 pr-1">
                        {book.chapters.map((c, i) => (
                          <div key={i} className="py-1 px-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 truncate flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                            <span className="truncate">{c}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick PDF File Info */}
                <div className="pt-3 mt-3 border-t border-inherit">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-left">
                    <div className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 uppercase">
                      Offline eBook PDF
                    </div>
                    <div className="text-xs font-bold truncate mt-0.5">{downloadFileName}</div>
                    <a
                      href={pdfUrl}
                      download={downloadFileName}
                      className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      <Download className="w-3 h-3" />
                      <span>Direct Download</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Content Area: Detailed Chapter Notes */}
              <div
                ref={contentScrollRef}
                onScroll={handleContentScroll}
                className="flex-1 overflow-y-auto p-5 sm:p-8 text-left space-y-6"
              >
                {activeChapter ? (
                  <>
                    {/* Chapter Header */}
                    <div className="border-b border-inherit pb-5">
                      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-mono font-bold mb-2">
                        <span>Chapter {activeChapter.chapterNumber || activeChapterIndex + 1}</span>
                        <span>•</span>
                        <span>{book.tag}</span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
                        {activeChapter.title}
                      </h3>
                      <p className="text-sm opacity-80 mt-2 leading-relaxed max-w-3xl">
                        {activeChapter.summary}
                      </p>
                    </div>

                    {/* Key Technical Concepts */}
                    {activeChapter.keyConcepts && activeChapter.keyConcepts.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-bold uppercase tracking-wider font-mono flex items-center gap-2 text-blue-600 dark:text-blue-400">
                          <BookOpen className="w-4 h-4" />
                          <span>Core Architecture &amp; Key Concepts</span>
                        </h4>
                        <div className="grid grid-cols-1 gap-2.5">
                          {activeChapter.keyConcepts.map((concept, i) => (
                            <div
                              key={i}
                              className="p-3.5 rounded-xl border border-inherit bg-black/2 dark:bg-white/2 flex items-start gap-3"
                            >
                              <div className="w-5 h-5 rounded-full bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                                {i + 1}
                              </div>
                              <span className="text-xs sm:text-sm font-medium leading-relaxed">
                                {concept}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Code Snippets with Copy */}
                    {activeChapter.codeSnippets && activeChapter.codeSnippets.length > 0 && (
                      <div className="space-y-3 pt-2">
                        <h4 className="text-sm font-bold uppercase tracking-wider font-mono flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                          <Code2 className="w-4 h-4" />
                          <span>Production Code Snippets &amp; Diagnostics</span>
                        </h4>
                        <div className="space-y-4">
                          {activeChapter.codeSnippets.map((snippet, idx) => (
                            <div
                              key={idx}
                              className={`rounded-xl border overflow-hidden ${codeBoxStyles[readerTheme]}`}
                            >
                              <div className="flex items-center justify-between px-4 py-2 border-b border-inherit bg-black/40 text-xs font-mono">
                                <span className="font-bold text-sky-300">{snippet.title}</span>
                                <button
                                  onClick={() => handleCopyCode(snippet.code, idx)}
                                  className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white transition-colors"
                                >
                                  {copiedSnippetIndex === idx ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-400" />
                                      <span className="text-emerald-400">Copied</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3" />
                                      <span>Copy</span>
                                    </>
                                  )}
                                </button>
                              </div>
                              <pre className="p-4 overflow-x-auto text-xs font-mono leading-relaxed text-slate-200">
                                <code>{snippet.code}</code>
                              </pre>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Interview Mastery / Engineering Takeaways */}
                    {activeChapter.interviewTakeaways && activeChapter.interviewTakeaways.length > 0 && (
                      <div className="space-y-3 pt-2">
                        <h4 className="text-sm font-bold uppercase tracking-wider font-mono flex items-center gap-2 text-amber-600 dark:text-amber-400">
                          <HelpCircle className="w-4 h-4" />
                          <span>Kernel Systems Interview Mastery</span>
                        </h4>
                        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-3">
                          {activeChapter.interviewTakeaways.map((qa, i) => (
                            <div key={i} className="text-xs sm:text-sm leading-relaxed flex items-start gap-2.5">
                              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                              <span>{qa}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Bottom Download Card */}
                    <div className="p-5 rounded-2xl border border-inherit bg-blue-50/50 dark:bg-blue-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-8">
                      <div>
                        <div className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase">
                          Complete PDF eBook File
                        </div>
                        <h4 className="text-base font-bold mt-0.5">
                          Download full PDF: {downloadFileName}
                        </h4>
                        <p className="text-xs opacity-75 mt-0.5">
                          Includes high-resolution diagrams, benchmark recipes, and source repository.
                        </p>
                      </div>

                      <a
                        href={pdfUrl}
                        download={downloadFileName}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all shrink-0"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download eBook PDF</span>
                      </a>
                    </div>
                  </>
                ) : (
                  <div className="py-12 text-center opacity-60">
                    <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Select a chapter from the syllabus to view detailed technical notes.</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* PDF Document Viewer Tab (Embeds real PDF file) */
            <div className="flex-1 flex flex-col h-full bg-slate-900 p-2 sm:p-4 text-white">
              {/* PDF Toolbar */}
              <div className="flex items-center justify-between pb-3 px-2 text-xs font-mono text-slate-300 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-sky-400" />
                  <span className="font-bold text-white truncate max-w-xs">{downloadFileName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-sky-300 flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open in New Tab</span>
                  </a>
                  <a
                    href={pdfUrl}
                    download={downloadFileName}
                    className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                </div>
              </div>

              {/* PDF Object Embed */}
              <div className="flex-1 mt-3 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex flex-col">
                <object
                  data={pdfUrl}
                  type="application/pdf"
                  className="w-full h-full min-h-[500px]"
                >
                  {/* Fallback iframe */}
                  <iframe
                    src={`${pdfUrl}#toolbar=1`}
                    className="w-full h-full min-h-[500px] border-0"
                    title={book.title}
                  >
                    <div className="p-8 text-center text-slate-300 space-y-4">
                      <FileText className="w-16 h-16 mx-auto text-sky-400 opacity-80" />
                      <h4 className="text-lg font-bold text-white">PDF Ready for Download</h4>
                      <p className="text-xs text-slate-400 max-w-md mx-auto">
                        Your browser may not support inline PDF rendering. You can download the complete PDF or read via the Interactive Notes tab.
                      </p>
                      <a
                        href={pdfUrl}
                        download={downloadFileName}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download {downloadFileName}</span>
                      </a>
                    </div>
                  </iframe>
                </object>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
