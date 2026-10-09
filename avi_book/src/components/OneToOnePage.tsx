import { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Terminal,
  Camera,
  Cpu,
  Users,
  Compass,
  CheckCircle2,
  Lock,
  ArrowRight,
  Check,
  Video,
} from 'lucide-react';
import { ONE_TO_ONE_SESSIONS, AUTHOR_INFO } from '../data/siteData';
import { OneToOneSessionType } from '../types';
import { RazorpayModal, PaymentItem } from './RazorpayModal';

interface OneToOnePageProps {
  sessions?: OneToOneSessionType[];
  onNavigateHome: () => void;
  onNavigateToEvents: () => void;
  onOpenContact: () => void;
}

export function OneToOnePage({
  sessions = ONE_TO_ONE_SESSIONS,
  onNavigateHome,
  onNavigateToEvents,
  onOpenContact,
}: OneToOnePageProps) {
  const [selectedSessionId, setSelectedSessionId] = useState<string>(
    sessions[0]?.id || ONE_TO_ONE_SESSIONS[0].id
  );
  const [currentYear, setCurrentYear] = useState(2025);
  const [currentMonth, setCurrentMonth] = useState(10); // 10 = November
  const [selectedDate, setSelectedDate] = useState<number>(15);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('10:00 AM');
  const [timezone, setTimezone] = useState<string>('IST');

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingCode, setBookingCode] = useState('');
  const [paymentRefId, setPaymentRefId] = useState<string>('');
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);

  const selectedSession =
    sessions.find((s) => s.id === selectedSessionId) || sessions[0] || ONE_TO_ONE_SESSIONS[0];

  const calendarMonthLabel = new Date(currentYear, currentMonth, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
  const monthNameOnly = new Date(currentYear, currentMonth, 1).toLocaleDateString('en-US', {
    month: 'short',
  });

  const paymentItem: PaymentItem = {
    id: selectedSession.id,
    title: `1-to-1: ${selectedSession.title}`,
    type: 'session',
    price: selectedSession.price,
    subtitle: `${monthNameOnly} ${selectedDate} at ${selectedTimeSlot} (${timezone}) • ${selectedSession.duration}`,
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const timeSlots = [
    '09:00 AM',
    '09:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '12:00 PM',
    '01:00 PM',
    '02:00 PM',
    '02:30 PM',
    '03:00 PM',
    '03:30 PM',
    '04:00 PM',
    '04:30 PM',
    '05:00 PM',
  ];

  const daysInMonthCount = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInMonth = Array.from({ length: daysInMonthCount }, (_, i) => i + 1);

  const getSessionIcon = (iconName: string) => {
    switch (iconName) {
      case 'Terminal':
        return <Terminal className="w-5 h-5 text-blue-600" />;
      case 'Camera':
        return <Camera className="w-5 h-5 text-sky-600" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-emerald-600" />;
      case 'Users':
        return <Users className="w-5 h-5 text-purple-600" />;
      case 'Compass':
        return <Compass className="w-5 h-5 text-amber-600" />;
      default:
        return <Terminal className="w-5 h-5 text-blue-600" />;
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;
    setIsRazorpayOpen(true);
  };

  const handleRazorpaySuccess = (paymentId: string) => {
    setIsRazorpayOpen(false);
    const code = `AVP-1ON1-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingCode(code);
    setPaymentRefId(paymentId);
    setBookingConfirmed(true);
  };

  const resetBooking = () => {
    setBookingConfirmed(false);
    setFullName('');
    setEmail('');
    setNotes('');
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Top Breadcrumbs Bar */}
      <div className="bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-slate-500">
            <button
              onClick={onNavigateHome}
              className="hover:text-blue-600 transition-colors font-medium"
            >
              Home
            </button>
            <span>/</span>
            <span className="text-slate-900 font-semibold">1-to-1 Sessions</span>
          </div>

          <button
            onClick={onNavigateToEvents}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span>Explore Group Events &amp; Workshops</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Hero Header */}
      <section className="bg-white border-b border-slate-200/80 pt-10 sm:pt-14 pb-10 sm:pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Personal Guidance</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Book a 1-to-1 Session
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
            Get personalized guidance on Linux kernel internals, device drivers, camera drivers,
            embedded systems, or technical interview prep. Choose a time that works for you and book
            a private 1-to-1 video session with <strong className="text-slate-900">{AUTHOR_INFO.name}</strong>.
          </p>

          {/* 4 Feature Badges */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Personalized Mentoring</div>
                <div className="text-[11px] text-slate-500">Your goals, my focus</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Deep Technical Guidance</div>
                <div className="text-[11px] text-slate-500">From basics to advanced</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Code Review &amp; Debugging</div>
                <div className="text-[11px] text-slate-500">Fix issues, improve code</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Flexible Time Slots</div>
                <div className="text-[11px] text-slate-500">Book a time that works</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main 3-Column Booking Layout */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Column 1: Select Session Type (Span 4) */}
            <div className="lg:col-span-4 space-y-4 text-left">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  Select a Session Type
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Choose the engineering topic you want to discuss.
                </p>
              </div>

              <div className="space-y-3">
                {sessions.map((session) => {
                  const isSelected = selectedSessionId === session.id;

                  return (
                    <div
                      key={session.id}
                      onClick={() => setSelectedSessionId(session.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                        isSelected
                          ? 'bg-blue-50/40 border-blue-600 ring-2 ring-blue-500/20'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                              isSelected
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {getSessionIcon(session.iconName)}
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-slate-900">
                              {session.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[11px] font-mono text-slate-500">
                                {session.duration}
                              </span>
                              <span className="text-slate-300">•</span>
                              <span className="text-[11px] font-mono font-bold text-blue-600">
                                ${session.price} USD
                              </span>
                            </div>
                          </div>
                        </div>

                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-1 ${
                            isSelected
                              ? 'border-blue-600 bg-blue-600 text-white'
                              : 'border-slate-300'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 mt-2.5 leading-relaxed pl-12">
                        {session.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Column 2: Choose Date & Time (Span 4) */}
            <div className="lg:col-span-4 space-y-5 text-left">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  Choose a Date &amp; Time
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select your preferred slot in your local timezone.
                </p>
              </div>

              {/* Calendar Widget */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-900 font-mono">
                    {calendarMonthLabel}
                  </span>
                  <div className="flex items-center gap-1 text-slate-400">
                    <button
                      className="p-1.5 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                      onClick={handlePrevMonth}
                      title="Previous Month"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1.5 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                      onClick={handleNextMonth}
                      title="Next Month"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Days of week */}
                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-mono text-slate-400 mb-1.5">
                  <span>Su</span>
                  <span>Mo</span>
                  <span>Tu</span>
                  <span>We</span>
                  <span>Th</span>
                  <span>Fr</span>
                  <span>Sa</span>
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1 text-center">
                  {daysInMonth.map((day) => {
                    const isSelected = selectedDate === day;
                    // Available days (skip Sundays e.g. day % 7 !== 1)
                    const isAvailable = day % 7 !== 1;

                    return (
                      <button
                        key={day}
                        disabled={!isAvailable}
                        onClick={() => setSelectedDate(day)}
                        className={`h-7 rounded-md text-xs font-mono font-semibold transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white font-bold'
                            : isAvailable
                            ? 'text-slate-700 hover:bg-blue-50 hover:text-blue-600'
                            : 'text-slate-300 cursor-not-allowed'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots Selection */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">
                    Available Times ({monthNameOnly} {selectedDate})
                  </span>
                  {/* Timezone Selector */}
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="text-[11px] font-mono bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-slate-700 focus:outline-none"
                  >
                    <option value="IST">IST (UTC+5:30)</option>
                    <option value="UTC">UTC (GMT)</option>
                    <option value="PST">PST (UTC-8)</option>
                    <option value="EST">EST (UTC-5)</option>
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-1.5 max-h-48 overflow-y-auto pr-1">
                  {timeSlots.map((slot) => {
                    const isSelected = selectedTimeSlot === slot;
                    return (
                      <button
                        key={slot}
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`py-1.5 px-2 text-[11px] font-mono rounded-lg border text-center transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50/50'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Time Callout */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 text-left text-xs space-y-1.5 shadow-xs">
                <p className="font-bold text-slate-900">
                  Need a different time or group request?
                </p>
                <p className="text-slate-500 text-[11px]">
                  You can request custom hours or book a corporate training session for your team.
                </p>
                <button
                  onClick={onOpenContact}
                  className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700 pt-1"
                >
                  <span>Contact Me</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Column 3: Profile & Booking Confirmation (Span 4) */}
            <div className="lg:col-span-4 space-y-5 text-left">
              {/* Author Mini Card */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 flex items-center gap-3.5 shadow-xs">
                <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-mono font-bold text-sm shrink-0 border border-slate-800">
                  AP
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <span>{AUTHOR_INFO.name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 inline" />
                  </h4>
                  <p className="text-xs text-slate-500">
                    Linux Kernel Author &amp; Mentor
                  </p>
                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                    "{AUTHOR_INFO.quote}"
                  </p>
                </div>
              </div>

              {/* Checkout / Booking Card */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
                {bookingConfirmed ? (
                  <div className="space-y-4 text-center animate-in fade-in duration-200">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <Check className="w-6 h-6" />
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Session Booked!
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Confirmation code: <strong className="font-mono text-slate-900">{bookingCode}</strong>
                      </p>
                    </div>

                    <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-left text-xs space-y-1.5 font-mono">
                      <div className="text-slate-900 font-bold font-sans">
                        {selectedSession.title}
                      </div>
                      <div className="text-slate-600 text-[11px]">
                        Date: {monthNameOnly} {selectedDate}, {currentYear} at {selectedTimeSlot} ({timezone})
                      </div>
                      <div className="text-slate-600 text-[11px]">
                        Duration: {selectedSession.duration}
                      </div>
                      <div className="text-emerald-700 font-bold text-[11px] pt-1">
                        ✓ Google Meet Link sent to {email}
                      </div>
                    </div>

                    <button
                      onClick={resetBooking}
                      className="w-full py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      Book Another Session
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="space-y-4">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Video className="w-4 h-4 text-blue-600" />
                        <span>Session Summary</span>
                      </h3>
                      <div className="mt-2 p-2.5 rounded-lg bg-blue-50/60 border border-blue-100 text-xs">
                        <div className="font-bold text-slate-900">
                          {selectedSession.title}
                        </div>
                        <div className="text-slate-600 mt-0.5 flex items-center justify-between">
                          <span>
                            {monthNameOnly} {selectedDate} @ {selectedTimeSlot} ({timezone})
                          </span>
                          <span className="font-bold text-blue-700 font-mono">
                            ${selectedSession.price}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Inputs */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Your Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Greg Kroah-Hartman"
                        className="w-full px-3 py-1.5 text-xs bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. greg@kernel.org"
                        className="w-full px-3 py-1.5 text-xs bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Topics / Problem to Debug (Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Briefly describe what you'd like help with..."
                        className="w-full px-3 py-1.5 text-xs bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 active:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Pay with Razorpay &amp; Book (${selectedSession.price})</span>
                    </button>

                    <div className="pt-1 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Secure 1-to-1 video link provided upon booking.</span>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Razorpay Gateway Checkout Modal */}
      <RazorpayModal
        isOpen={isRazorpayOpen}
        item={paymentItem}
        customerName={fullName}
        customerEmail={email}
        onClose={() => setIsRazorpayOpen(false)}
        onSuccess={handleRazorpaySuccess}
      />
    </div>
  );
}
