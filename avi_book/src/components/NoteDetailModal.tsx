import { X, Clock, Terminal, CheckCircle2 } from 'lucide-react';
import { AUTHOR_INFO } from '../data/siteData';

interface NoteDetailModalProps {
  note: {
    title: string;
    category?: string;
    readTime?: string;
    content?: string;
  } | null;
  onClose: () => void;
}

export function NoteDetailModal({ note, onClose }: NoteDetailModalProps) {
  if (!note) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-8 text-left"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
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
        <div className="py-6 space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
          <p>
            In Linux kernel device driver development, managing memory and synchronization primitives correctly is critical to avoiding deadlocks, page faults, and buffer under-runs.
          </p>

          <div className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto border border-slate-800 space-y-1">
            <div className="text-slate-500">// Example: V4L2 buffer queuing and locking</div>
            <div><span className="text-purple-400">static int</span> <span className="text-sky-300">my_vb2_queue_setup</span>(<span className="text-purple-400">struct</span> vb2_queue *q,</div>
            <div className="pl-6"><span className="text-purple-400">unsigned int</span> *num_buffers, <span className="text-purple-400">unsigned int</span> *num_planes,</div>
            <div className="pl-6"><span className="text-purple-400">unsigned int</span> sizes[], <span className="text-purple-400">struct</span> device *alloc_devs[]) {'{'}</div>
            <div className="pl-4 text-emerald-400">if (*num_planes) return sizes[0] &lt; image_size ? -EINVAL : 0;</div>
            <div className="pl-4">*num_planes = 1;</div>
            <div className="pl-4">sizes[0] = image_size;</div>
            <div className="pl-4"><span className="text-purple-400">return</span> 0;</div>
            <div>{'}'}</div>
          </div>

          <h4 className="text-sm font-bold text-slate-900 pt-2 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-blue-600" />
            <span>Key Engineering Takeaways</span>
          </h4>

          <ul className="space-y-2 text-xs sm:text-sm text-slate-600 pl-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Always decouple DMA buffer allocation from streaming controls using the videobuf2 framework.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Never invoke sleepable functions (such as `msleep` or mutex locks) inside top-half interrupt service routines (ISR).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Use `v4l2-compliance` test suites to validate driver subdevice ioctl returns against the upstream Linux kernel standard.</span>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-mono">
            Full guides &amp; code available in Avinash Pal's Linux Trilogy Books
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
          >
            Close Note
          </button>
        </div>
      </div>
    </div>
  );
}
