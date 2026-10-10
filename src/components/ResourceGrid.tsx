import {
  Calendar,
  Users,
  FileText,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import {
  UPCOMING_EVENTS,
  INTERVIEW_NOTES,
  TECHNICAL_NOTES,
} from '../data/siteData';

import { UpcomingEvent } from '../types';

interface ResourceGridProps {
  events?: UpcomingEvent[];
  onNavigateTab: (tab: string) => void;
  onSelectEvent?: (eventId: string) => void;
  onSelectNote?: (title: string) => void;
  onSelectDevice?: (deviceId: string) => void;
}

export function ResourceGrid({
  events = UPCOMING_EVENTS,
  onNavigateTab,
  onSelectEvent,
  onSelectNote,
}: ResourceGridProps) {
  return (
    <section className="py-12 sm:py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Column 1: Upcoming Events */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              {/* Header */}
              <div className="flex items-center gap-2.5 mb-1">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  Upcoming Events
                </h3>
              </div>
              <p className="text-xs text-slate-500 mb-5">
                Talks, workshops &amp; meetups
              </p>

              {/* Event Items */}
              <div className="space-y-3.5">
                {events.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => onSelectEvent?.(event.id)}
                    className="group/item flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 active:bg-blue-50/60 active:scale-[0.99] transition-all cursor-pointer min-h-[54px]"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Date Badge or Banner */}
                      {event.bannerImage ? (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-200/80 shrink-0">
                          <img
                            src={event.bannerImage}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-200/80 flex flex-col items-center justify-center text-center shrink-0">
                          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase leading-none">
                            {event.date.month}
                          </span>
                          <span className="text-sm font-extrabold text-slate-900 leading-tight">
                            {event.date.day}
                          </span>
                          <span className="text-[8px] font-mono text-slate-400 leading-none">
                            {event.date.year}
                          </span>
                        </div>
                      )}

                      {/* Info */}
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 group-hover/item:text-blue-600 transition-colors truncate">
                          {event.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {event.location} • {(event.time.includes('–') ? event.time.split('–')[0] : event.time.split('-')[0]).trim()}
                        </p>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover/item:text-blue-600 group-hover/item:translate-x-0.5 transition-all shrink-0 ml-1" />
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Link */}
            <div className="pt-4 mt-4 border-t border-slate-100">
              <button
                onClick={() => onNavigateTab('events')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors group"
              >
                <span>View All Events</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Column 2: Interview Notes */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              {/* Header */}
              <div className="flex items-center gap-2.5 mb-1">
                <Users className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  Interview Notes
                </h3>
              </div>
              <p className="text-xs text-slate-500 mb-5">
                Real questions &amp; detailed answers
              </p>

              {/* Items */}
              <div className="space-y-3.5">
                {INTERVIEW_NOTES.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => onSelectNote?.(note.title)}
                    className="group/item p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 active:bg-blue-50/60 active:scale-[0.99] transition-all cursor-pointer min-h-[52px]"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${note.categoryColor}`}
                      >
                        {note.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {note.questionCount}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 group-hover/item:text-blue-600 transition-colors line-clamp-1">
                      {note.title}
                    </h4>

                    <p className="text-[11px] text-slate-500 mt-1">
                      {note.readTime}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Link */}
            <div className="pt-4 mt-4 border-t border-slate-100">
              <button
                onClick={() => onNavigateTab('interview-notes')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors group"
              >
                <span>View All Interview Notes</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Column 3: Technical Notes */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              {/* Header */}
              <div className="flex items-center gap-2.5 mb-1">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  Technical Notes
                </h3>
              </div>
              <p className="text-xs text-slate-500 mb-5">
                Deep dives, tutorials &amp; guides
              </p>

              {/* Items */}
              <div className="space-y-3.5">
                {TECHNICAL_NOTES.map((tech) => (
                  <div
                    key={tech.id}
                    onClick={() => onSelectNote?.(tech.title)}
                    className="group/item p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 active:bg-blue-50/60 active:scale-[0.99] transition-all cursor-pointer min-h-[52px]"
                  >
                    <div className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-blue-600 mt-0.5 shrink-0 group-hover/item:translate-x-0.5 transition-transform" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 group-hover/item:text-blue-600 transition-colors line-clamp-1">
                          {tech.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-1">
                          {tech.readTime}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Link */}
            <div className="pt-4 mt-4 border-t border-slate-100">
              <button
                onClick={() => onNavigateTab('technical-notes')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors group"
              >
                <span>View All Technical Notes</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
