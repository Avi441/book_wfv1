import {
  BookOpen,
  Terminal,
  Cpu,
  GraduationCap,
  Users,
  Award,
  Github,
  Linkedin,
  Youtube,
  Mail,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { AUTHOR_INFO, BOOKS_DATA } from '../data/siteData';
import { TuxLogo } from './TuxLogo';

interface AboutPageProps {
  onExploreBooks: () => void;
  onBookSession: () => void;
  onViewEvents: () => void;
  onOpenContact: () => void;
}

export function AboutPage({
  onExploreBooks,
  onBookSession,
  onViewEvents,
  onOpenContact,
}: AboutPageProps) {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Header */}
      <section className="bg-slate-900 text-white py-16 sm:py-24 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-slate-800 border-2 border-slate-700/80 p-4 flex items-center justify-center shrink-0 shadow-2xl">
              <TuxLogo className="w-full h-full" />
            </div>

            <div className="space-y-4 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs font-semibold">
                <Terminal className="w-3.5 h-3.5" />
                <span>Linux Kernel Developer &amp; Systems Author</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                {AUTHOR_INFO.name}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                Demystifying the Linux kernel, storage subsystems, network queues, and device drivers through rigorous mental models, practical C implementations, and production diagnostics.
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-sm text-slate-400">
                <span className="flex items-center gap-1.5 font-medium text-slate-300">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  <span>3 Published Books</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 font-medium text-slate-300">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>1,000+ Engineers Mentored</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 font-medium text-slate-300">
                  <Cpu className="w-4 h-4 text-purple-400" />
                  <span>Bangalore, India</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Philosophy & Mission */}
      <section className="py-16 sm:py-20 border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6 text-slate-700 leading-relaxed text-base">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                The Engineering Philosophy: <br />
                <span className="text-blue-600">"Learn Why It's Designed That Way"</span>
              </h2>

              <p>
                Too many Linux engineering resources present the kernel as an opaque set of command-line tools or fragmented API headers. When a production disk latency spike hits, when an NVMe queue stalls, or when a camera driver drops frames under high CPU load, memorized commands aren't enough.
              </p>

              <p>
                My work centers on building deep, enduring mental models: tracing data structures from userspace system calls down to PCIe register doorbells and interrupt controller top-halves.
              </p>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Core Guiding Principles</span>
                </h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-2" />
                    <span><strong>Hardware Invariants:</strong> Code must respect physical cache lines, memory ordering, and PCIe DMA topology.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-2" />
                    <span><strong>No Magic:</strong> Every kernel abstraction (folious, sk_buff, blk-mq) was born to solve a concrete architectural bottleneck.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-2" />
                    <span><strong>Production Diagnostics:</strong> Master bpftrace, ftrace, perf, and KGDB to verify hypotheses against live kernel memory.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Quick Stats Sidebar Card */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900">
                  Connect &amp; Follow
                </h3>
                <div className="space-y-2.5 text-sm">
                  <a
                    href={AUTHOR_INFO.socials.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-slate-200/80 hover:border-slate-400 text-slate-700 transition-colors"
                  >
                    <Github className="w-4 h-4 text-slate-900" />
                    <span className="font-medium">GitHub / avinashpal</span>
                  </a>
                  <a
                    href={AUTHOR_INFO.socials.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-slate-200/80 hover:border-blue-400 text-slate-700 transition-colors"
                  >
                    <Linkedin className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">LinkedIn Profile</span>
                  </a>
                  <a
                    href={AUTHOR_INFO.socials.youtube}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-slate-200/80 hover:border-red-400 text-slate-700 transition-colors"
                  >
                    <Youtube className="w-4 h-4 text-red-600" />
                    <span className="font-medium">YouTube Channel</span>
                  </a>
                  <a
                    href={`mailto:${AUTHOR_INFO.socials.email}`}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-slate-200/80 hover:border-blue-400 text-slate-700 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">Direct Email</span>
                  </a>
                </div>
              </div>

              <button
                onClick={onOpenContact}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors shadow-sm"
              >
                Send Message / Inquire
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* The Linux Trilogy Showcase */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              The Linux Systems Trilogy
            </h2>
            <p className="text-slate-600 text-sm">
              Comprehensive reference manuals engineered for practicing systems programmers, SREs, and kernel engineers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BOOKS_DATA.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md hover:border-blue-300 transition-all space-y-4"
              >
                <div className="space-y-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shadow-xs"
                    style={{ backgroundColor: book.color }}
                  >
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {book.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    Target: {book.targetKernel || 'Linux 6.x LTS'} • {book.pages} Pages
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {book.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                  <span>{book.badge || 'Trilogy Edition'}</span>
                  <button
                    onClick={onExploreBooks}
                    className="hover:underline flex items-center gap-1"
                  >
                    <span>View Manual</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Speaking & Mentoring CTA */}
      <section className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl text-center md:text-left">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Workshops &amp; 1-to-1 Mentorship
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Looking to transition into Linux kernel and systems programming, resolve tricky driver race conditions, or level up your systems design?
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <button
                onClick={onBookSession}
                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-colors shadow-md"
              >
                Book 1-to-1 Session
              </button>
              <button
                onClick={onViewEvents}
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-colors border border-white/15"
              >
                Explore Upcoming Talks
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
