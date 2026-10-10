import { useState } from 'react';
import {
  FileText,
  Users,
  Search,
  ChevronRight,
  Clock,
  Terminal,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { INTERVIEW_NOTES, TECHNICAL_NOTES, REAL_DEVICES } from '../data/siteData';
import { InterviewNote, TechnicalNote } from '../types';

interface NotesPageProps {
  onSelectNote: (note: InterviewNote | TechnicalNote) => void;
  onExploreBooks: () => void;
  onBookSession: () => void;
}

export function NotesPage({ onSelectNote, onExploreBooks, onBookSession }: NotesPageProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'interview' | 'technical' | 'devices'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInterview = INTERVIEW_NOTES.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.summary && n.summary.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredTechnical = TECHNICAL_NOTES.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.summary && t.summary.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredDevices = REAL_DEVICES.filter(
    (d) =>
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.specs.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 text-blue-800 text-xs font-semibold">
            <Terminal className="w-3.5 h-3.5" />
            <span>Linux Kernel & Systems Knowledge Base</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Interview Notes &amp; Systems Guides
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Direct takeaways, architectural diagrams, concurrency rules, and real interview questions curated from production Linux kernel and storage engineering practice.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto pt-2">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search kernel drivers, V4L2, blk-mq, memory..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {[
              { id: 'all', label: 'All Resources' },
              { id: 'interview', label: 'Interview Questions' },
              { id: 'technical', label: 'Technical Guides' },
              { id: 'devices', label: 'Device Subsystems' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-12">
          {/* 1. Interview Questions */}
          {(activeTab === 'all' || activeTab === 'interview') && filteredInterview.length > 0 && (
            <section className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Users className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-bold text-slate-900">
                    Production Interview Deep Dives
                  </h2>
                </div>
                <span className="text-xs text-slate-500 font-mono">
                  {filteredInterview.length} Guides
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInterview.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => onSelectNote(note)}
                    className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                          {note.category}
                        </span>
                        <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {note.readTime}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {note.title}
                      </h3>

                      {note.summary && (
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {note.summary}
                        </p>
                      )}

                      {note.keyPoints && note.keyPoints.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          {note.keyPoints.slice(0, 2).map((pt, i) => (
                            <div key={i} className="flex items-start gap-1.5 text-xs text-slate-500">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{pt}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:text-blue-700">
                      <span>{note.questionCount || 'Read Full Note'}</span>
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 2. Technical Notes */}
          {(activeTab === 'all' || activeTab === 'technical') && filteredTechnical.length > 0 && (
            <section className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-bold text-slate-900">
                    Technical Notes &amp; Subsystem Guides
                  </h2>
                </div>
                <span className="text-xs text-slate-500 font-mono">
                  {filteredTechnical.length} Guides
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTechnical.map((tech) => (
                  <div
                    key={tech.id}
                    onClick={() => onSelectNote(tech)}
                    className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                          {tech.category}
                        </span>
                        <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {tech.readTime}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {tech.title}
                      </h3>

                      {tech.summary && (
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {tech.summary}
                        </p>
                      )}

                      {tech.keyPoints && tech.keyPoints.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          {tech.keyPoints.slice(0, 2).map((pt, i) => (
                            <div key={i} className="flex items-start gap-1.5 text-xs text-slate-500">
                              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{pt}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:text-blue-700">
                      <span>Read Technical Note</span>
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 3. Real Hardware Breakdown Examples */}
          {(activeTab === 'all' || activeTab === 'devices') && filteredDevices.length > 0 && (
            <section className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Terminal className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-bold text-slate-900">
                    Real Device Driver Breakdowns
                  </h2>
                </div>
                <span className="text-xs text-slate-500 font-mono">
                  {filteredDevices.length} Hardware Platforms
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredDevices.map((dev) => (
                  <div
                    key={dev.id}
                    onClick={() =>
                      onSelectNote({
                        id: dev.id,
                        title: `${dev.title} — Hardware Architecture`,
                        category: 'Hardware Subsystem',
                        readTime: '6 min read',
                        summary: `End-to-end driver architecture breakdown for ${dev.title}: ${dev.subtitle}. Covers hardware register offsets, kernel interrupt processing, and userspace bridge.`,
                        keyPoints: [
                          `Hardware Specification: ${dev.specs}`,
                          'Zero-copy DMA streaming with platform specific ISP pipeline.',
                          'Device tree OF node configuration and clock gating.',
                        ],
                      })
                    }
                    className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                        <Terminal className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {dev.title}
                      </h3>
                      <p className="text-xs text-slate-500">{dev.subtitle}</p>
                      <p className="text-xs font-mono text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        {dev.specs}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:text-blue-700">
                      <span>View Stack Details</span>
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Bottom Banner to Explore Books & Mentorship */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-blue-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              Ready for production kernel engineering?
            </h3>
            <p className="text-sm text-slate-300 max-w-xl">
              Deepen your mental models with Avinash Pal's complete Trilogy books or book a 1-to-1 code review and mentoring session.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onExploreBooks}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-sm flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore Trilogy Books</span>
            </button>
            <button
              onClick={onBookSession}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-colors border border-white/15"
            >
              Book 1-to-1 Mentoring
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
