import { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  Video,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Send,
  Ticket,
  Terminal,
  Camera,
  Cpu,
  Smartphone,
  Check,
} from 'lucide-react';
import { UPCOMING_EVENTS, AUTHOR_INFO } from '../data/siteData';
import { UpcomingEvent } from '../types';
import { RazorpayModal, PaymentItem } from './RazorpayModal';

interface EventsPageProps {
  events?: UpcomingEvent[];
  onNavigateHome: () => void;
  onNavigateToOneToOne: () => void;
  onOpenContact: () => void;
}

export function EventsPage({
  events = UPCOMING_EVENTS,
  onNavigateHome,
  onNavigateToOneToOne,
  onOpenContact,
}: EventsPageProps) {
  const [selectedEventId, setSelectedEventId] = useState<string>(
    events[0]?.id || UPCOMING_EVENTS[0].id
  );
  const [currentYear, setCurrentYear] = useState(2025);
  const [currentMonth, setCurrentMonth] = useState(10); // 10 = November (0-indexed)
  const [selectedDay, setSelectedDay] = useState<number>(15);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);
  const [confirmedBookingData, setConfirmedBookingData] = useState<{
    event: UpcomingEvent;
    name: string;
    ticketId: string;
    paymentId?: string;
  } | null>(null);

  const selectedEvent =
    events.find((e) => e.id === selectedEventId) || events[0] || UPCOMING_EVENTS[0];

  const parsedPrice = parseInt(selectedEvent.price.replace(/[^0-9]/g, ''), 10) || 49;

  const paymentItem: PaymentItem = {
    id: selectedEvent.id,
    title: selectedEvent.title,
    type: 'event',
    price: parsedPrice,
    subtitle: `${selectedEvent.type} on ${selectedEvent.date.month} ${selectedEvent.date.day}, ${selectedEvent.date.year}`,
  };

  const handleBookNowClick = (eventId: string, day: number) => {
    setSelectedEventId(eventId);
    setSelectedDay(day);
    // Smooth scroll to form on small screens
    const formElement = document.getElementById('booking-form-card');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;
    setIsRazorpayOpen(true);
  };

  const handleRazorpaySuccess = (paymentId: string) => {
    setIsRazorpayOpen(false);
    const ticketId = `AVP-EVT-${Math.floor(100000 + Math.random() * 900000)}`;
    setConfirmedBookingData({
      event: selectedEvent,
      name: fullName,
      ticketId,
      paymentId,
    });
    setBookingConfirmed(true);
  };

  const resetBooking = () => {
    setBookingConfirmed(false);
    setConfirmedBookingData(null);
    setFullName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  const monthNamesShort = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const currentMonthShort = monthNamesShort[currentMonth];
  const calendarMonthLabel = new Date(currentYear, currentMonth, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

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

  // Dynamic days in active month
  const daysInMonthCount = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInMonth = Array.from({ length: daysInMonthCount }, (_, i) => i + 1);

  // Dynamic event days for the current displayed month
  const eventDays = events
    .filter((e) => {
      const matchMonth = e.date.month?.toUpperCase() === currentMonthShort;
      const matchYear = !e.date.year || e.date.year === currentYear.toString();
      return matchMonth && matchYear;
    })
    .map((e) => parseInt(e.date.day, 10))
    .filter((d) => !isNaN(d));

  const handleSelectCalendarDay = (day: number) => {
    setSelectedDay(day);
    const matchingEvent = events.find((e) => {
      const matchDay = parseInt(e.date.day, 10) === day;
      const matchMonth = e.date.month?.toUpperCase() === currentMonthShort;
      const matchYear = !e.date.year || e.date.year === currentYear.toString();
      return matchDay && matchMonth && matchYear;
    });
    if (matchingEvent) {
      setSelectedEventId(matchingEvent.id);
    }
  };

  const getEventIcon = (iconType?: string) => {
    switch (iconType) {
      case 'camera':
        return <Camera className="w-3.5 h-3.5 text-sky-600" />;
      case 'kernel':
        return <Terminal className="w-3.5 h-3.5 text-emerald-600" />;
      case 'phone':
        return <Smartphone className="w-3.5 h-3.5 text-indigo-600" />;
      case 'usb':
        return <Video className="w-3.5 h-3.5 text-amber-600" />;
      case 'chip':
        return <Cpu className="w-3.5 h-3.5 text-rose-600" />;
      default:
        return <CalendarIcon className="w-3.5 h-3.5 text-blue-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Top Breadcrumb Bar */}
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
            <span className="text-slate-900 font-semibold">Events &amp; Workshops</span>
          </div>

          <button
            onClick={onNavigateToOneToOne}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span>Looking for 1-to-1 Mentoring?</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200/80 pt-10 sm:pt-14 pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content (Span 7) */}
            <div className="lg:col-span-7 text-left space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-bold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Events &amp; Booking</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Book an Event
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                Join live workshops, talks, and interactive deep-dive sessions with{' '}
                <strong className="text-slate-900">{AUTHOR_INFO.name}</strong> to learn Linux
                kernel architecture, camera drivers, and embedded systems with real code.
              </p>

              {/* 4 Feature Badges */}
              <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100/80 text-blue-600 flex items-center justify-center shrink-0">
                    <Video className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-900">Live Sessions</div>
                    <div className="text-[11px] text-slate-500">Hands-on learning</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100/80 text-emerald-600 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-900">Live Q&amp;A</div>
                    <div className="text-[11px] text-slate-500">Ask your questions</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100/80 text-indigo-600 flex items-center justify-center shrink-0">
                    <Terminal className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-900">Real Code</div>
                    <div className="text-[11px] text-slate-500">Demos &amp; drivers</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-100/80 text-amber-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-900">Certificate</div>
                    <div className="text-[11px] text-slate-500">For workshops</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Graphic Preview (Span 5) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-xl text-white relative overflow-hidden">
                {/* Window header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                    <span className="ml-2 text-slate-300">live-workshop.sh</span>
                  </div>
                  <span className="text-emerald-400 text-[11px]">● LIVE STREAM</span>
                </div>

                <div className="pt-4 font-mono text-xs text-left space-y-2">
                  <p className="text-slate-400">
                    $ <span className="text-sky-300">git clone</span>{' '}
                    https://github.com/avinashpal/kernel-camera-labs.git
                  </p>
                  <p className="text-slate-400">
                    $ <span className="text-sky-300">make</span> -C /lib/modules/$(uname -r)/build M=$PWD
                  </p>
                  <p className="text-emerald-400 font-semibold">
                    [OK] Building V4L2 sensor subdevice modules...
                  </p>
                  <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700 mt-3">
                    <p className="text-sky-400 font-bold text-sm">
                      "Build Kernel Drivers Together"
                    </p>
                    <p className="text-slate-300 text-[11px] mt-1">
                      Instructor: {AUTHOR_INFO.name} (Linux Kernel Author)
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-700/60 pt-2">
                      <span>Live Q&amp;A + Screen Share</span>
                      <span className="text-amber-400 font-semibold">Limited Seats</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid: Upcoming Events (Left) + Calendar & Booking Form (Right) */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Upcoming Events List (Span 7) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Upcoming Events
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Book your seat for upcoming workshops, talks, and meetups.
                </p>
              </div>

              {/* Event Cards */}
              <div className="space-y-4">
                {events.map((event) => {
                  const isSelected = selectedEventId === event.id;
                  const dayNum = parseInt(event.date.day, 10) || 15;

                  return (
                    <div
                      key={event.id}
                      className={`bg-white rounded-2xl border p-5 sm:p-6 transition-all shadow-xs ${
                        isSelected
                          ? 'border-blue-500 ring-2 ring-blue-500/10'
                          : 'border-slate-200/90 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        {/* Left Info with Date badge */}
                        <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                          {/* Banner or Date Stamp */}
                          {event.bannerImage ? (
                            <div className="relative w-16 sm:w-24 h-16 sm:h-20 rounded-xl overflow-hidden border border-slate-200 shrink-0 shadow-xs">
                              <img
                                src={event.bannerImage}
                                alt={event.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-[9px] font-mono font-bold text-white text-center py-0.5">
                                {event.date.month} {event.date.day}
                              </div>
                            </div>
                          ) : (
                            <div className="w-14 h-14 rounded-xl bg-slate-900 text-white flex flex-col items-center justify-center text-center shrink-0 shadow-xs border border-slate-800">
                              <span className="text-[10px] font-mono font-bold text-sky-400 uppercase leading-none">
                                {event.date.month}
                              </span>
                              <span className="text-lg font-extrabold leading-tight">
                                {event.date.day}
                              </span>
                              <span className="text-[9px] font-mono text-slate-400 leading-none">
                                {event.date.year}
                              </span>
                            </div>
                          )}

                          {/* Details */}
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1">
                                {getEventIcon(event.iconType)}
                                <span>{event.type}</span>
                              </span>
                              <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                {event.location}
                              </span>
                              <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                {event.time}
                              </span>
                            </div>

                            <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                              {event.title}
                            </h3>

                            {event.description && (
                              <p className="text-xs text-slate-600 line-clamp-2">
                                {event.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Right Price & CTA */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 shrink-0 gap-3">
                          <div className="text-left sm:text-right">
                            <span className="text-lg font-black text-slate-900">
                              {event.price}
                            </span>
                            <span className="text-xs text-slate-500 block">Per person</span>
                          </div>

                          <button
                            onClick={() => handleBookNowClick(event.id, dayNum)}
                            className={`px-4 py-2 text-xs font-semibold rounded-lg shadow-xs transition-all ${
                              isSelected
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-slate-900 text-white hover:bg-slate-800'
                            }`}
                          >
                            {isSelected ? 'Selected' : 'Book Now'}
                          </button>
                        </div>
                      </div>

                      {/* Seats Left Bar */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-mono">
                            {event.seatsLeft} / {event.seatsTotal} seats left
                          </span>
                        </div>

                        {/* Visual mini bar */}
                        <div className="w-28 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-600 h-full rounded-full"
                            style={{
                              width: `${(event.seatsLeft / event.seatsTotal) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Custom Workshop Callout */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left shadow-xs">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Can't find a suitable date or need custom training?
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Avinash Pal delivers dedicated on-site or remote workshops for corporate teams,
                    universities, and conferences.
                  </p>
                </div>
                <button
                  onClick={onOpenContact}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200 shrink-0"
                >
                  <span>Contact Me</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Column: Calendar Widget & Booking Form (Span 5) */}
            <div id="booking-form-card" className="lg:col-span-5 space-y-6 text-left">
              {/* 1. Date Picker Calendar */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-blue-600" />
                    <span>Select Date:</span>
                    <span className="text-blue-600 font-mono font-semibold">
                      {calendarMonthLabel}
                    </span>
                  </h3>
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

                {/* Calendar Days of Week */}
                <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-mono text-slate-400 mb-2">
                  <span>Su</span>
                  <span>Mo</span>
                  <span>Tu</span>
                  <span>We</span>
                  <span>Th</span>
                  <span>Fr</span>
                  <span>Sa</span>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 text-center">
                  {daysInMonth.map((day) => {
                    const hasEvent = eventDays.includes(day);
                    const isSelected = selectedDay === day;

                    return (
                      <button
                        key={day}
                        onClick={() => handleSelectCalendarDay(day)}
                        className={`h-8 rounded-lg text-xs font-mono font-semibold transition-all relative flex items-center justify-center ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-xs font-bold'
                            : hasEvent
                            ? 'bg-blue-50 text-blue-700 font-bold border border-blue-300 ring-1 ring-blue-400/30'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span>{day}</span>
                        {hasEvent && !isSelected && (
                          <span className="absolute bottom-1 w-1 h-1 rounded-full bg-blue-600" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    Workshop dates
                  </span>
                  <span>Timezone: IST (UTC+5:30)</span>
                </div>
              </div>

              {/* 2. Book Your Seat Form or Confirmation Pass */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
                {bookingConfirmed && confirmedBookingData ? (
                  /* Confirmed Ticket Pass */
                  <div className="space-y-5 animate-in fade-in duration-300">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <Check className="w-6 h-6" />
                    </div>

                    <div className="text-center space-y-1">
                      <h3 className="text-xl font-bold text-slate-900">
                        Seat Confirmed!
                      </h3>
                      <p className="text-xs text-slate-500">
                        Confirmation email and invite have been dispatched.
                      </p>
                    </div>

                    {/* Ticket Card */}
                    <div className="p-4 rounded-xl bg-slate-900 text-white font-mono space-y-3 border border-slate-800">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs">
                        <span className="text-sky-400 font-bold">EVENT PASS</span>
                        <span className="text-slate-400">
                          {confirmedBookingData.ticketId}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="text-sm font-sans font-bold text-white">
                          {confirmedBookingData.event.title}
                        </div>
                        <div className="text-xs text-slate-400">
                          Attendee: {confirmedBookingData.name}
                        </div>
                        <div className="text-xs text-slate-400">
                          Date: {confirmedBookingData.event.date.month}{' '}
                          {confirmedBookingData.event.date.day},{' '}
                          {confirmedBookingData.event.date.year} (
                          {confirmedBookingData.event.time})
                        </div>
                        <div className="text-xs text-slate-400">
                          Format: {confirmedBookingData.event.location}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                        <span>Host: {AUTHOR_INFO.name}</span>
                        <span className="text-emerald-400 font-bold">✓ Paid via Razorpay ({confirmedBookingData.event.price})</span>
                      </div>
                      {confirmedBookingData.paymentId && (
                        <div className="text-[10px] text-slate-500 font-mono truncate">
                          Ref: {confirmedBookingData.paymentId}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={resetBooking}
                      className="w-full py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      Book Another Seat or Event
                    </button>
                  </div>
                ) : (
                  /* Form */
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Ticket className="w-5 h-5 text-blue-600" />
                        <span>Book Your Seat</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Fill out your information to reserve a spot.
                      </p>
                    </div>

                    {/* Selected Event Preview */}
                    <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200/80 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-blue-700 uppercase">
                          Selected Event:
                        </span>
                        <div className="font-bold text-slate-900">
                          {selectedEvent.title}
                        </div>
                        <div className="text-slate-500">
                          {selectedEvent.time} • {selectedEvent.location}
                        </div>
                      </div>
                      <div className="text-right font-mono font-bold text-blue-700 text-sm">
                        {selectedEvent.price}
                      </div>
                    </div>

                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Linus Torvalds"
                        className="w-full px-3.5 py-2 text-xs bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400"
                      />
                    </div>

                    {/* Email Address */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. developer@example.com"
                        className="w-full px-3.5 py-2 text-xs bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400"
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210 (Optional)"
                        className="w-full px-3.5 py-2 text-xs bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400"
                      />
                    </div>

                    {/* Select Event dropdown */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Change Event
                      </label>
                      <select
                        value={selectedEventId}
                        onChange={(e) => setSelectedEventId(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {events.map((evt) => (
                          <option key={evt.id} value={evt.id}>
                            {evt.title} ({evt.price}) — {evt.date.month} {evt.date.day}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Message (Optional) */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Special Requests or Focus Areas (Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Any specific camera driver questions or kernel modules you want to review?"
                        className="w-full px-3.5 py-2 text-xs bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 active:bg-blue-800 text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                    >
                      <Ticket className="w-4 h-4" />
                      <span>Pay &amp; Register with Razorpay ({selectedEvent.price})</span>
                    </button>

                    {/* Security Guarantee */}
                    <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Your information is safe and secure.</span>
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
        customerPhone={phone}
        onClose={() => setIsRazorpayOpen(false)}
        onSuccess={handleRazorpaySuccess}
      />
    </div>
  );
}
