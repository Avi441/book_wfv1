import { useState } from 'react';
import { X, Clock, Terminal, CheckCircle2, Copy, Check, BookOpen, HelpCircle } from 'lucide-react';
import { AUTHOR_INFO } from '../data/siteData';

interface NoteDetailModalProps {
  note: {
    title: string;
    category?: string;
    readTime?: string;
    summary?: string;
    keyPoints?: string[];
    questions?: { q: string; a: string }[];
    codeSnippet?: {
      title: string;
      language: string;
      code: string;
    };
    content?: string;
  } | null;
  onClose: () => void;
  onExploreBook?: () => void;
}

export function NoteDetailModal({ note, onClose, onExploreBook }: NoteDetailModalProps) {
  const [copied, setCopied] = useState(false);

  if (!note) return null;

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-8 text-left"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-2 border-b border-slate-100 pb-5 pr-8">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 uppercase">
              {note.category || 'Kernel Architecture'}
            </span>
            <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {note.readTime || '5 min read'}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
            {note.title}
          </h3>

          <p className="text-xs text-slate-500 font-mono">
            Author: {AUTHOR_INFO.name} • Linux Kernel Author
          </p>
        </div>

        {/* Technical Content */}
        <div className="py-6 space-y-5 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
          {/* Summary */}
          {note.summary && (
            <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed">
              {note.summary}
            </p>
          )}

          {/* Key Architectural Concepts */}
          {note.keyPoints && note.keyPoints.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Core Architectural Invariants</span>
              </h4>
              <ul className="space-y-2 pl-2">
                {note.keyPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-2" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Code Snippet if present */}
          {note.codeSnippet && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                <div className="flex items-center gap-1.5 font-bold text-slate-700">
                  <Terminal className="w-3.5 h-3.5 text-blue-600" />
                  <span>{note.codeSnippet.title}</span>
                </div>
                <button
                  onClick={() => handleCopyCode(note.codeSnippet!.code)}
                  className="flex items-center gap-1 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto border border-slate-800">
                <pre>{note.codeSnippet.code}</pre>
              </div>
            </div>
          )}

          {/* Interview Questions if present */}
          {note.questions && note.questions.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                <span>Production Interview Q&A</span>
              </h4>
              <div className="space-y-3">
                {note.questions.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-200/90 bg-white space-y-1.5">
                    <p className="font-semibold text-slate-900 text-xs sm:text-sm">
                      Q{idx + 1}: {item.q}
                    </p>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-slate-500 font-mono text-center sm:text-left">
            Complete manuals &amp; labs in Avinash Pal's Trilogy Books
          </span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onExploreBook && (
              <button
                onClick={() => {
                  onClose();
                  onExploreBook();
                }}
                className="flex-1 sm:flex-none px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Explore Books</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
