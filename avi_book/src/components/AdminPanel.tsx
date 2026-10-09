import { useState } from 'react';
import {
  BookOpen,
  Calendar,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Search,
  Users,
  Eye,
  EyeOff,
  X,
  Palette,
  ArrowRight,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  Lock,
  KeyRound,
  ShieldCheck,
  User,
  LogOut,
  FileText,
  FileCheck,
} from 'lucide-react';
import { Book, UpcomingEvent, OneToOneSessionType } from '../types';
import { BookCover } from './BookCover';
import { compressAndProcessImage } from '../utils/imageUtils';
import { convertCurrencyAmount, CurrencyCode, ExchangeRates, getBookCurrency } from '../utils/pricing';

const ADMIN_AUTH_STORAGE_KEY = 'avinash_admin_auth_status_v1';
const ADMIN_CREDS_STORAGE_KEY = 'avinash_admin_credentials_v1';

interface StoredAdminCreds {
  adminId: string;
  password: string;
}

const getStoredAdminCreds = (): StoredAdminCreds => {
  try {
    const raw = localStorage.getItem(ADMIN_CREDS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.adminId && parsed.password) return parsed;
    }
  } catch {
    // ignore
  }
  return {
    adminId: '',
    password: '',
  };
};

interface AdminPanelProps {
  books: Book[];
  events: UpcomingEvent[];
  sessions: OneToOneSessionType[];
  exchangeRates: ExchangeRates;
  onAddBook: (book: Omit<Book, 'id'>) => Book;
  onUpdateBook: (id: number, data: Partial<Book>) => void;
  onDeleteBook: (id: number) => void;
  onAddEvent: (event: Omit<UpcomingEvent, 'id'>) => UpcomingEvent;
  onUpdateEvent: (id: string, data: Partial<UpcomingEvent>) => void;
  onDeleteEvent: (id: string) => void;
  onAddSession: (session: Omit<OneToOneSessionType, 'id'>) => OneToOneSessionType;
  onUpdateSession: (id: string, data: Partial<OneToOneSessionType>) => void;
  onDeleteSession: (id: string) => void;
  onResetDefaults: () => void;
  onViewLiveSite: (tab?: string) => void;
}

export function AdminPanel({
  books,
  events,
  sessions,
  exchangeRates,
  onAddBook,
  onUpdateBook,
  onDeleteBook,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  onAddSession,
  onUpdateSession,
  onDeleteSession,
  onResetDefaults,
  onViewLiveSite,
}: AdminPanelProps) {
  // Authentication & Security State
  const [storedCreds, setStoredCreds] = useState<StoredAdminCreds>(getStoredAdminCreds);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return (
        sessionStorage.getItem(ADMIN_AUTH_STORAGE_KEY) === 'true' ||
        localStorage.getItem(ADMIN_AUTH_STORAGE_KEY) === 'true'
      );
    } catch {
      return false;
    }
  });

  // Login form state
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Security Credentials Modal state
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [newAdminIdInput, setNewAdminIdInput] = useState('');
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [razorpayKeyInput, setRazorpayKeyInput] = useState('');
  const [securityModalError, setSecurityModalError] = useState<string | null>(null);

  // In-app confirmation dialog state (replaces native window.confirm which is blocked in iframes)
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    onConfirm: () => void;
  } | null>(null);

  const [activeAdminTab, setActiveAdminTab] = useState<'books' | 'events' | 'sessions'>('books');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  // Book Modal State
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [editingBookId, setEditingBookId] = useState<number | null>(null);
  const [isDraggingCover, setIsDraggingCover] = useState(false);
  const [coverUploadError, setCoverUploadError] = useState<string | null>(null);
  const [pdfUploadError, setPdfUploadError] = useState<string | null>(null);
  const [videoUploadError, setVideoUploadError] = useState<string | null>(null);
  const [bookUploadProgress, setBookUploadProgress] = useState<number | null>(null);
  const [pdfUploadProgress, setPdfUploadProgress] = useState<number | null>(null);
  const [eventUploadProgress, setEventUploadProgress] = useState<number | null>(null);
  const [bookForm, setBookForm] = useState<{
    title: string;
    subtitle: string;
    description: string;
    fullDescription: string;
    tag: string;
    color: string;
    spineColor: string;
    accentColor: string;
    targetKernel: string;
    pages: number;
    originalPrice: string;
    offerPrice: string;
    isbn: string;
    featured: boolean;
    chaptersInput: string;
    coverImage: string;
    pdfUrl: string;
    pdfFileName: string;
    pdfDownloadName: string;
    syllabusVideoUrl: string;
    syllabusVideoName: string;
  }>({
    title: '',
    subtitle: '',
    description: '',
    fullDescription: '',
    tag: 'Kernel Development',
    color: '#0e2439',
    spineColor: '#1e3a5f',
    accentColor: '#38bdf8',
    targetKernel: 'Linux 6.x LTS',
    pages: 350,
    originalPrice: '3999',
    offerPrice: '2999',
    isbn: '978-0-998123-09-0',
    featured: false,
    chaptersInput: 'Introduction to the Kernel\nArchitecture & Device Models\nWriting Drivers\nDebugging & Tracing',
    coverImage: '',
    pdfUrl: '',
    pdfFileName: '',
    pdfDownloadName: '',
    syllabusVideoUrl: '',
    syllabusVideoName: '',
  });

  // Event Modal State
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventForm, setEventForm] = useState<{
    title: string;
    type: 'Workshop' | 'Talk' | 'Meetup';
    month: string;
    day: string;
    year: string;
    time: string;
    location: string;
    price: string;
    seatsTotal: number;
    seatsLeft: number;
    description: string;
    bannerImage: string;
    iconType: 'camera' | 'kernel' | 'phone' | 'usb' | 'chip';
  }>({
    title: '',
    type: 'Workshop',
    month: 'NOV',
    day: '25',
    year: '2025',
    time: '10:00 AM – 1:00 PM (IST)',
    location: 'Online via Google Meet',
    price: '$49',
    seatsTotal: 30,
    seatsLeft: 30,
    description: '',
    bannerImage: '',
    iconType: 'kernel',
  });

  // Session Modal State
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [sessionForm, setSessionForm] = useState<{
    title: string;
    description: string;
    duration: string;
    durationMinutes: number;
    price: number;
    iconName: string;
  }>({
    title: '',
    description: '',
    duration: '45 mins',
    durationMinutes: 45,
    price: 99,
    iconName: 'Terminal',
  });

  const notify = (msg: string) => {
    setStatusNotification(msg);
    setTimeout(() => setStatusNotification(null), 3500);
  };

  // Authentication Handlers
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: loginId.trim(),
          password: loginPassword.trim(),
        }),
      });

      const payload = await response.json();

      if (!response.ok || !payload?.success) {
        setLoginError(payload?.message || 'Incorrect Admin ID or Password. Please try again.');
        setIsLoggingIn(false);
        return;
      }

      setIsAuthenticated(true);
      try {
        if (rememberMe) {
          localStorage.setItem(ADMIN_AUTH_STORAGE_KEY, 'true');
        } else {
          sessionStorage.setItem(ADMIN_AUTH_STORAGE_KEY, 'true');
        }
      } catch {
        // ignore
      }
      notify(`Welcome back, ${payload.adminId || 'Administrator'}!`);
    } catch {
      setLoginError('Unable to reach the admin service. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleFillDemoCredentials = () => {
    setLoginId(storedCreds.adminId);
    setLoginPassword(storedCreds.password);
    setLoginError(null);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // ignore
    }
    try {
      localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
      sessionStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
    setLoginPassword('');
    notify('Logged out of Admin Portal.');
  };

  const openSecurityModal = () => {
    setNewAdminIdInput(storedCreds.adminId);
    setCurrentPasswordInput('');
    setNewPasswordInput('');
    setConfirmPasswordInput('');
    setRazorpayKeyInput(localStorage.getItem('avinash_razorpay_key_id') || '');
    setSecurityModalError(null);
    setIsSecurityModalOpen(true);
  };

  const handleSaveSecurityCreds = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityModalError(null);

    if (currentPasswordInput !== storedCreds.password) {
      setSecurityModalError('Current password does not match.');
      return;
    }

    if (!newAdminIdInput.trim()) {
      setSecurityModalError('Admin ID cannot be empty.');
      return;
    }

    if (newPasswordInput) {
      if (newPasswordInput.length < 4) {
        setSecurityModalError('New password must be at least 4 characters long.');
        return;
      }
      if (newPasswordInput !== confirmPasswordInput) {
        setSecurityModalError('New password and confirmation do not match.');
        return;
      }
    }

    const updatedCreds: StoredAdminCreds = {
      adminId: newAdminIdInput.trim(),
      password: newPasswordInput ? newPasswordInput.trim() : storedCreds.password,
    };

    try {
      localStorage.setItem(ADMIN_CREDS_STORAGE_KEY, JSON.stringify(updatedCreds));
      setStoredCreds(updatedCreds);
      if (razorpayKeyInput.trim()) {
        localStorage.setItem('avinash_razorpay_key_id', razorpayKeyInput.trim());
      } else {
        localStorage.removeItem('avinash_razorpay_key_id');
      }
      notify('Admin security & Razorpay settings updated successfully!');
      setIsSecurityModalOpen(false);
    } catch {
      setSecurityModalError('Failed to save credentials to local storage.');
    }
  };

  // Color preset options for books
  const colorPresets = [
    { label: 'Deep Blue', color: '#0e2439', spine: '#1e3a5f', accent: '#38bdf8' },
    { label: 'Emerald Green', color: '#064e3b', spine: '#047857', accent: '#34d399' },
    { label: 'Royal Violet', color: '#311042', spine: '#4c1d95', accent: '#c084fc' },
    { label: 'Amber Bronze', color: '#451a03', spine: '#78350f', accent: '#f59e0b' },
    { label: 'Crimson Red', color: '#450a0a', spine: '#7f1d1d', accent: '#f87171' },
    { label: 'Cyan Tech', color: '#083344', spine: '#0e7490', accent: '#22d3ee' },
    { label: 'Slate Obsidian', color: '#0f172a', spine: '#334155', accent: '#94a3b8' },
  ];

  // Book Handlers
  const processCoverFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setCoverUploadError('Please select a valid image file (PNG, JPG, SVG, WebP).');
      return;
    }
    setCoverUploadError(null);
    setBookUploadProgress(10);
    try {
      const optimized = await compressAndProcessImage(file, {
        maxWidth: 1400,
        maxHeight: 2000,
        quality: 0.88,
        onProgress: (p) => setBookUploadProgress(p),
      });
      setBookForm((prev) => ({
        ...prev,
        coverImage: optimized,
      }));
      setTimeout(() => setBookUploadProgress(null), 1200);
    } catch (err: any) {
      setCoverUploadError(err?.message || 'Failed to process image');
      setBookUploadProgress(null);
    }
  };

  const handleQuickUploadCover = async (bookId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      notify('Please select an image file (PNG, JPG, SVG, WebP)');
      return;
    }

    notify('Optimizing & saving high-res book cover...');
    try {
      const optimized = await compressAndProcessImage(file, {
        maxWidth: 1400,
        maxHeight: 2000,
        quality: 0.88,
      });
      onUpdateBook(bookId, {
        coverImage: optimized,
        bannerImage: optimized,
      });
      notify(`Cover image updated and permanently saved for book #${bookId}!`);
    } catch (err) {
      notify('Failed to process image');
    }
    e.target.value = '';
  };

  const processPdfFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setPdfUploadError('Please select a valid PDF file (.pdf).');
      return;
    }
    setPdfUploadError(null);
    setPdfUploadProgress(15);
    const reader = new FileReader();
    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        const pct = Math.round((e.loaded / e.total) * 75) + 15;
        setPdfUploadProgress(pct);
      }
    };
    reader.onload = () => {
      setPdfUploadProgress(95);
      const dataUrl = reader.result as string;
      if (dataUrl) {
        setBookForm((prev) => ({
          ...prev,
          pdfUrl: dataUrl,
          pdfFileName: file.name,
          pdfDownloadName: file.name,
        }));
        setTimeout(() => setPdfUploadProgress(null), 1000);
      }
    };
    reader.onerror = () => {
      setPdfUploadError('Failed to read PDF file.');
      setPdfUploadProgress(null);
    };
    reader.readAsDataURL(file);
  };

  const processSyllabusVideoFile = (file: File) => {
    const supportedExtension = /\.(mp4|webm|mov|m4v|ogv)$/i.test(file.name);
    if (!file.type.startsWith('video/') && !supportedExtension) {
      setVideoUploadError('Select a supported video file (MP4, WebM, MOV, M4V, or OGV).');
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      setVideoUploadError('Video files must be 100 MB or smaller.');
      return;
    }

    setVideoUploadError(null);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setBookForm((prev) => ({
          ...prev,
          syllabusVideoUrl: reader.result as string,
          syllabusVideoName: file.name,
        }));
      }
    };
    reader.onerror = () => setVideoUploadError('Failed to read the video file.');
    reader.readAsDataURL(file);
  };

  const handleQuickUploadPdf = (bookId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      notify('Please select a valid .pdf file.');
      return;
    }
    notify(`Uploading & attaching PDF "${file.name}"...`);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (result) {
        onUpdateBook(bookId, {
          pdfUrl: result,
          pdfFileName: file.name,
          pdfDownloadName: file.name,
        });
        notify(`PDF "${file.name}" uploaded and attached to book #${bookId}!`);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const openNewBookModal = () => {
    setEditingBookId(null);
    setCoverUploadError(null);
    setPdfUploadError(null);
    setBookUploadProgress(null);
    setPdfUploadProgress(null);
    setIsDraggingCover(false);
    setBookForm({
      title: '',
      subtitle: '',
      description: '',
      fullDescription: '',
      tag: 'Linux Drivers',
      color: '#0e2439',
      spineColor: '#1e3a5f',
      accentColor: '#38bdf8',
      targetKernel: 'Linux 6.x LTS',
      pages: 380,
      originalPrice: '3999',
      offerPrice: '2999',
      isbn: `978-0-998123-0${books.length + 1}-0`,
      featured: false,
      chaptersInput: 'Architecture & Design\nDriver Implementation\nConcurrency & Locking\nTest & Verification',
      coverImage: '',
      pdfUrl: '',
      pdfFileName: '',
      pdfDownloadName: '',
      syllabusVideoUrl: '',
      syllabusVideoName: '',
    });
    setIsBookModalOpen(true);
  };

  const openEditBookModal = (book: Book) => {
    const bookCurrency = getBookCurrency(book);
    setEditingBookId(book.id);
    setCoverUploadError(null);
    setPdfUploadError(null);
    setBookUploadProgress(null);
    setPdfUploadProgress(null);
    setIsDraggingCover(false);
    setBookForm({
      title: book.title,
      subtitle: book.subtitle || '',
      description: book.description,
      fullDescription: book.fullDescription || book.description,
      tag: book.tag,
      color: book.color,
      spineColor: book.spineColor,
      accentColor: book.accentColor,
      targetKernel: book.targetKernel || 'Linux 6.x LTS',
      pages: book.pages || 400,
      originalPrice: String(convertCurrencyAmount(
        book.price ?? 39.99,
        bookCurrency,
        'INR',
        exchangeRates,
      )),
      offerPrice: String(convertCurrencyAmount(
        book.offerPrice ?? book.price ?? 39.99,
        bookCurrency,
        'INR',
        exchangeRates,
      )),
      isbn: book.isbn || '',
      featured: !!book.featured,
      chaptersInput: (book.chapters || []).join('\n'),
      coverImage: book.coverImage || '',
      pdfUrl: book.pdfUrl || '',
      pdfFileName: book.pdfFileName || '',
      pdfDownloadName: book.pdfDownloadName || '',
      syllabusVideoUrl: book.syllabusVideoUrl || '',
      syllabusVideoName: book.syllabusVideoName || '',
    });
    setIsBookModalOpen(true);
  };

  const handleSaveBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookForm.title.trim()) return;

    const originalPrice = Number(bookForm.originalPrice);
    const offerPrice = Number(bookForm.offerPrice);
    if (!Number.isFinite(originalPrice) || originalPrice <= 0 || !Number.isFinite(offerPrice) || offerPrice <= 0 || offerPrice > originalPrice) {
      notify('Enter a valid offer price that does not exceed the original price.');
      return;
    }

    const chapters = bookForm.chaptersInput
      .split('\n')
      .map((c) => c.trim())
      .filter(Boolean);

    const payload: Partial<Book> = {
      title: bookForm.title,
      subtitle: bookForm.subtitle,
      description: bookForm.description,
      fullDescription: bookForm.fullDescription,
      tag: bookForm.tag,
      color: bookForm.color,
      spineColor: bookForm.spineColor,
      accentColor: bookForm.accentColor,
      targetKernel: bookForm.targetKernel,
      pages: Number(bookForm.pages) || 350,
      price: originalPrice,
      offerPrice,
      priceCurrency: 'INR',
      discountPercent: Number((((originalPrice - offerPrice) / originalPrice) * 100).toFixed(1)),
      isbn: bookForm.isbn,
      featured: bookForm.featured,
      chapters,
      coverImage: bookForm.coverImage.trim() || undefined,
      bannerImage: bookForm.coverImage.trim() || undefined,
      pdfUrl: bookForm.pdfUrl.trim() || undefined,
      pdfFileName: bookForm.pdfFileName.trim() || undefined,
      pdfDownloadName: bookForm.pdfDownloadName.trim() || undefined,
      syllabusVideoUrl: bookForm.syllabusVideoUrl || undefined,
      syllabusVideoName: bookForm.syllabusVideoName || undefined,
    };

    if (editingBookId !== null) {
      onUpdateBook(editingBookId, payload);
      notify(`Updated book #${editingBookId}: "${payload.title}"`);
    } else {
      const created = onAddBook(payload as Omit<Book, 'id'>);
      notify(`Added new book #${created.id}: "${payload.title}"`);
    }

    setIsBookModalOpen(false);
  };

  const handleDeleteBook = (id: number, title: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Book',
      message: `Are you sure you want to delete book #${id} "${title}"? This cannot be undone.`,
      confirmText: 'Delete Book',
      onConfirm: () => {
        onDeleteBook(id);
        notify(`Deleted book #${id}`);
        setConfirmDialog(null);
      },
    });
  };

  // Event Handlers
  const openNewEventModal = () => {
    setEditingEventId(null);
    setEventForm({
      title: '',
      type: 'Workshop',
      month: 'NOV',
      day: '25',
      year: '2025',
      time: '10:00 AM – 1:00 PM (IST)',
      location: 'Online',
      price: '$49',
      seatsTotal: 30,
      seatsLeft: 30,
      description: '',
      bannerImage: '',
      iconType: 'kernel',
    });
    setIsEventModalOpen(true);
  };

  const openEditEventModal = (ev: UpcomingEvent) => {
    setEditingEventId(ev.id);
    setEventForm({
      title: ev.title,
      type: ev.type,
      month: ev.date.month,
      day: ev.date.day,
      year: ev.date.year,
      time: ev.time,
      location: ev.location,
      price: ev.price,
      seatsTotal: ev.seatsTotal,
      seatsLeft: ev.seatsLeft,
      description: ev.description || '',
      bannerImage: ev.bannerImage || '',
      iconType: ev.iconType || 'kernel',
    });
    setIsEventModalOpen(true);
  };

  const handleQuickUploadEventBanner = async (eventId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      notify('Please select an image file (PNG, JPG, WebP)');
      return;
    }
    notify('Optimizing & saving event banner...');
    try {
      const optimized = await compressAndProcessImage(file, {
        maxWidth: 1400,
        maxHeight: 800,
        quality: 0.88,
      });
      onUpdateEvent(eventId, { bannerImage: optimized });
      notify('Event banner image updated and permanently saved!');
    } catch (err) {
      notify('Failed to process banner image');
    }
    e.target.value = '';
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title.trim()) return;

    const payload = {
      title: eventForm.title,
      type: eventForm.type,
      date: {
        month: eventForm.month.toUpperCase(),
        day: eventForm.day,
        year: eventForm.year,
      },
      time: eventForm.time,
      location: eventForm.location,
      price: eventForm.price,
      seatsTotal: Number(eventForm.seatsTotal) || 30,
      seatsLeft: Number(eventForm.seatsLeft) || 30,
      description: eventForm.description,
      bannerImage: eventForm.bannerImage.trim() || undefined,
      iconType: eventForm.iconType,
    };

    if (editingEventId) {
      onUpdateEvent(editingEventId, payload);
      notify(`Updated event "${payload.title}"`);
    } else {
      onAddEvent(payload);
      notify(`Created upcoming event "${payload.title}"`);
    }

    setIsEventModalOpen(false);
  };

  const handleDeleteEvent = (id: string, title: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Upcoming Event',
      message: `Are you sure you want to delete event "${title}"? It will be removed immediately from the public events calendar.`,
      confirmText: 'Delete Event',
      onConfirm: () => {
        onDeleteEvent(id);
        notify(`Deleted event "${title}"`);
        setConfirmDialog(null);
      },
    });
  };

  // Session Handlers
  const openNewSessionModal = () => {
    setEditingSessionId(null);
    setSessionForm({
      title: '',
      description: '',
      duration: '45 mins',
      durationMinutes: 45,
      price: 99,
      iconName: 'Terminal',
    });
    setIsSessionModalOpen(true);
  };

  const openEditSessionModal = (s: OneToOneSessionType) => {
    setEditingSessionId(s.id);
    setSessionForm({
      title: s.title,
      description: s.description,
      duration: s.duration,
      durationMinutes: s.durationMinutes,
      price: s.price,
      iconName: s.iconName,
    });
    setIsSessionModalOpen(true);
  };

  const handleSaveSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionForm.title.trim()) return;

    const payload = {
      title: sessionForm.title,
      description: sessionForm.description,
      duration: sessionForm.duration,
      durationMinutes: Number(sessionForm.durationMinutes) || 45,
      price: Number(sessionForm.price) || 99,
      iconName: sessionForm.iconName,
    };

    if (editingSessionId) {
      onUpdateSession(editingSessionId, payload);
      notify(`Updated 1-to-1 track "${payload.title}"`);
    } else {
      onAddSession(payload);
      notify(`Added new 1-to-1 track "${payload.title}"`);
    }

    setIsSessionModalOpen(false);
  };

  const handleDeleteSession = (id: string, title: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete 1-to-1 Mentoring Track',
      message: `Are you sure you want to delete track "${title}"?`,
      confirmText: 'Delete Track',
      onConfirm: () => {
        onDeleteSession(id);
        notify(`Deleted 1-to-1 session "${title}"`);
        setConfirmDialog(null);
      },
    });
  };

  // Filtered lists
  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEvents = events.filter(
    (ev) =>
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSessions = sessions.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden select-none">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Toast Notification */}
        {statusNotification && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white text-sm font-medium rounded-xl shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{statusNotification}</span>
          </div>
        )}

        <div className="w-full max-w-md relative z-10">
          {/* Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl">
            {/* Header / Brand */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-400 p-0.5 mx-auto mb-4 shadow-lg shadow-blue-500/20 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-sky-400">
                  <ShieldCheck className="w-7 h-7 text-sky-400" />
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-blue-950/80 text-blue-400 border border-blue-800/60 mb-2">
                <Lock className="w-3 h-3" />
                <span>Protected Portal</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Author Admin Login
              </h1>
              <p className="text-xs text-slate-400 mt-1.5 max-w-xs mx-auto">
                Sign in with your Admin ID and Password to manage books, workshops, and 1-to-1 mentoring sessions.
              </p>
            </div>

            {/* Error message */}
            {loginError && (
              <div className="mb-5 p-3 rounded-xl bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <span className="leading-relaxed">{loginError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Admin ID / Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={loginId}
                    onChange={(e) => {
                      setLoginId(e.target.value);
                      setLoginError(null);
                    }}
                    placeholder="Enter Admin ID (e.g. admin)"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-950/80 border border-slate-700/80 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Admin Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showPassword ? 'Hide' : 'Show'}</span>
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      setLoginError(null);
                    }}
                    placeholder="Enter admin password"
                    className="w-full pl-9 pr-10 py-2.5 text-xs bg-slate-950/80 border border-slate-700/80 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono"
                  />
                </div>
              </div>

              {/* Remember me & Auto-fill demo button */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400 hover:text-slate-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500/20"
                  />
                  <span>Remember on this browser</span>
                </label>

                <button
                  type="button"
                  onClick={handleFillDemoCredentials}
                  className="text-[11px] text-sky-400 hover:text-sky-300 hover:underline font-mono cursor-pointer"
                >
                  Quick Fill Demo
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 active:scale-[0.99] text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoggingIn ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Log In to Admin Panel</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Credentials Info */}
            <div className="mt-5 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 space-y-1.5">
              <div className="flex items-center justify-between text-slate-300 font-semibold font-mono text-[10px] uppercase">
                <span>Default Credentials:</span>
                <span className="text-emerald-400 font-bold">Enabled</span>
              </div>
              <div className="flex items-center justify-between font-mono text-slate-300 bg-slate-900/80 px-2 py-1 rounded border border-slate-800">
                <span>ID: <strong className="text-white">admin</strong></span>
                <span>Password: <strong className="text-white">admin123</strong></span>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                Tip: You can update your ID &amp; Password at any time in Security Settings once logged in.
              </p>
            </div>

            {/* Return link */}
            <div className="mt-6 text-center">
              <button
                onClick={() => onViewLiveSite('home')}
                className="text-xs text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>← Return to Public Website</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 pb-24 text-slate-900 text-left">
      {/* Toast Notification */}
      {statusNotification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white text-sm font-medium rounded-xl shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{statusNotification}</span>
        </div>
      )}

      {/* Top Admin Navigation Header */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-mono font-bold text-sm shadow-md">
              AP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-white leading-none">
                  Avinash Pal — Content Admin Panel
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Live Management
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Add, edit, update, or remove your books, upcoming workshops, and 1-to-1 session tracks.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <div className="flex sm:flex items-center gap-2 px-3 py-1.5 bg-slate-800/90 rounded-lg border border-slate-700/80 text-xs font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Admin: <strong className="text-white">{storedCreds.adminId}</strong></span>
            </div>

            <button
              onClick={openSecurityModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-sky-300 bg-sky-950/80 hover:bg-sky-900 active:bg-sky-950 border border-sky-800 rounded-lg transition-colors cursor-pointer min-h-[38px] active:scale-95"
              title="Change Admin ID and Password"
            >
              <KeyRound className="w-3.5 h-3.5 text-sky-400" />
              <span>ID &amp; Password</span>
            </button>

            <button
              onClick={() => {
                setConfirmDialog({
                  isOpen: true,
                  title: 'Reset All Data to Defaults',
                  message: 'Are you sure you want to reset all books, events, and session tracks back to the initial seed catalog? Any custom additions or edits will be restored to defaults.',
                  confirmText: 'Reset Defaults',
                  onConfirm: () => {
                    onResetDefaults();
                    notify('Reset all content to original defaults.');
                    setConfirmDialog(null);
                  },
                });
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white active:text-white bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 rounded-lg transition-colors cursor-pointer min-h-[38px] active:scale-95"
              title="Reset data back to seed state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              onClick={() => onViewLiveSite('home')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer min-h-[38px] active:scale-95"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live Site</span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-300 bg-rose-950/80 hover:bg-rose-900 active:bg-rose-950 border border-rose-800 rounded-lg transition-colors cursor-pointer min-h-[38px] active:scale-95 ml-auto sm:ml-0"
              title="Log out from Admin Panel"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Admin Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Statistics Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div
            onClick={() => setActiveAdminTab('books')}
            className={`p-5 rounded-xl border transition-all cursor-pointer ${
              activeAdminTab === 'books'
                ? 'bg-white border-blue-500 shadow-md ring-2 ring-blue-500/20'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                Total Published Books
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 font-mono">
                {books.length}
              </span>
              <span className="text-xs text-slate-500">Books active in catalog</span>
            </div>
          </div>

          <div
            onClick={() => setActiveAdminTab('events')}
            className={`p-5 rounded-xl border transition-all cursor-pointer ${
              activeAdminTab === 'events'
                ? 'bg-white border-blue-500 shadow-md ring-2 ring-blue-500/20'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                Upcoming Events &amp; Workshops
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 font-mono">
                {events.length}
              </span>
              <span className="text-xs text-slate-500">Scheduled events</span>
            </div>
          </div>

          <div
            onClick={() => setActiveAdminTab('sessions')}
            className={`p-5 rounded-xl border transition-all cursor-pointer ${
              activeAdminTab === 'sessions'
                ? 'bg-white border-blue-500 shadow-md ring-2 ring-blue-500/20'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                1-to-1 Session Mentoring Tracks
              </span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 font-mono">
                {sessions.length}
              </span>
              <span className="text-xs text-slate-500">Active consultation options</span>
            </div>
          </div>
        </div>

        {/* Tab Selector & Search & Add Button Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg w-full md:w-auto">
            <button
              onClick={() => setActiveAdminTab('books')}
              className={`flex-1 md:flex-initial px-4 py-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-2 ${
                activeAdminTab === 'books'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Books ({books.length})</span>
            </button>

            <button
              onClick={() => setActiveAdminTab('events')}
              className={`flex-1 md:flex-initial px-4 py-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-2 ${
                activeAdminTab === 'events'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Events ({events.length})</span>
            </button>

            <button
              onClick={() => setActiveAdminTab('sessions')}
              className={`flex-1 md:flex-initial px-4 py-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-2 ${
                activeAdminTab === 'sessions'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>1-to-1 Tracks ({sessions.length})</span>
            </button>
          </div>

          {/* Search Input and Add button */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${activeAdminTab}...`}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            {activeAdminTab === 'books' && (
              <button
                onClick={openNewBookModal}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-1.5 shrink-0 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Book</span>
              </button>
            )}

            {activeAdminTab === 'events' && (
              <button
                onClick={openNewEventModal}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm flex items-center gap-1.5 shrink-0 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Event</span>
              </button>
            )}

            {activeAdminTab === 'sessions' && (
              <button
                onClick={openNewSessionModal}
                className="px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm flex items-center gap-1.5 shrink-0 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Track</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab 1: Books Table / Cards */}
        {activeAdminTab === 'books' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4"># ID</th>
                      <th className="py-3 px-4">Cover Page</th>
                      <th className="py-3 px-4">PDF Document</th>
                      <th className="py-3 px-4">Book Details</th>
                      <th className="py-3 px-4">Tag / Category</th>
                      <th className="py-3 px-4">Pages / Target</th>
                      <th className="py-3 px-4">Color Palette</th>
                      <th className="py-3 px-4 text-center">Featured</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredBooks.map((book) => (
                      <tr
                        key={book.id}
                        className="hover:bg-slate-50/60 transition-colors"
                      >
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          #{book.id}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="relative group/cover shrink-0">
                              {book.coverImage ? (
                                <img
                                  src={book.coverImage}
                                  alt={book.title}
                                  className="w-10 h-14 rounded-md shadow-xs border border-slate-300 object-cover object-top"
                                />
                              ) : (
                                <div
                                  className="w-10 h-14 rounded-md shadow-xs border border-black/20 flex flex-col items-center justify-center text-[9px] font-mono text-white font-bold"
                                  style={{ backgroundColor: book.color }}
                                >
                                  <span>#{book.id}</span>
                                  <span className="text-[7px] text-white/70">Theme</span>
                                </div>
                              )}
                              <label
                                className="absolute inset-0 bg-black/60 opacity-0 group-hover/cover:opacity-100 rounded-md flex flex-col items-center justify-center text-white cursor-pointer transition-opacity"
                                title="Click to upload new cover image"
                              >
                                <Upload className="w-3.5 h-3.5" />
                                <span className="text-[8px] font-mono mt-0.5 font-bold">Change</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleQuickUploadCover(book.id, e)}
                                />
                              </label>
                            </div>
                            <div className="hidden sm:block">
                              <label
                                className="px-2 py-1 text-[10px] font-mono font-medium rounded border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 text-slate-600 cursor-pointer inline-flex items-center gap-1 transition-colors"
                                title="Upload or change cover image"
                              >
                                <Upload className="w-2.5 h-2.5" />
                                <span>Upload</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleQuickUploadCover(book.id, e)}
                                />
                              </label>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-800 font-bold">
                              <FileText className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                              <span className="truncate max-w-[140px]" title={book.pdfFileName || 'PDF File'}>
                                {book.pdfFileName || (book.pdfUrl ? 'Attached PDF' : 'Default PDF')}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <label
                                className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 cursor-pointer inline-flex items-center gap-1 transition-colors"
                                title="Upload or replace book PDF file"
                              >
                                <Upload className="w-2.5 h-2.5" />
                                <span>Upload PDF</span>
                                <input
                                  type="file"
                                  accept=".pdf,application/pdf"
                                  className="hidden"
                                  onChange={(e) => handleQuickUploadPdf(book.id, e)}
                                />
                              </label>
                              {book.pdfUrl && (
                                <a
                                  href={book.pdfUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[10px] font-mono text-blue-600 hover:underline"
                                >
                                  View ↗
                                </a>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-2">
                              <span>{book.title}</span>
                              {book.featured && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-blue-50 text-blue-700 font-bold border border-blue-200">
                                  ★ Featured
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 line-clamp-1 max-w-sm mt-0.5">
                              {book.subtitle || book.description}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-slate-100 text-slate-700 border border-slate-200">
                            {book.tag}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[11px] text-slate-600 font-mono">
                          <div>{book.pages || 400} pages</div>
                          <div className="text-[10px] text-slate-400">{book.targetKernel || 'Linux 6.x'}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-4 h-4 rounded-full border border-black/20 shrink-0 shadow-2xs"
                              style={{ backgroundColor: book.color }}
                              title={`Cover: ${book.color}`}
                            />
                            <span
                              className="w-4 h-4 rounded-full border border-black/20 shrink-0 shadow-2xs"
                              style={{ backgroundColor: book.spineColor }}
                              title={`Spine: ${book.spineColor}`}
                            />
                            <span
                              className="w-4 h-4 rounded-full border border-black/20 shrink-0 shadow-2xs"
                              style={{ backgroundColor: book.accentColor }}
                              title={`Accent: ${book.accentColor}`}
                            />
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={!!book.featured}
                            onChange={(e) => {
                              onUpdateBook(book.id, { featured: e.target.checked });
                              notify(
                                e.target.checked
                                  ? `Marked "${book.title}" as featured`
                                  : `Unmarked "${book.title}" from featured`
                              );
                            }}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <label
                              className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                              title="Upload Cover Image"
                            >
                              <Upload className="w-4 h-4" />
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleQuickUploadCover(book.id, e)}
                              />
                            </label>
                            <button
                              onClick={() => openEditBookModal(book)}
                              className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit book details"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteBook(book.id, book.title)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete book"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredBooks.length === 0 && (
                      <tr>
                        <td colSpan={9} className="py-8 text-center text-slate-400">
                          No books matched "{searchQuery}".
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Events Table */}
        {activeAdminTab === 'events' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Banner</th>
                      <th className="py-3 px-4">Event Title</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Location &amp; Time</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Seats Availability</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredEvents.map((ev) => (
                      <tr
                        key={ev.id}
                        className="hover:bg-slate-50/60 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-center">
                            <span className="text-[9px] font-mono font-bold text-blue-600 uppercase">
                              {ev.date.month}
                            </span>
                            <span className="text-sm font-mono font-bold text-slate-900 leading-tight">
                              {ev.date.day}
                            </span>
                            <span className="text-[8px] font-mono text-slate-400">
                              {ev.date.year}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {ev.bannerImage ? (
                            <div className="relative group/b w-16 h-10 rounded-lg overflow-hidden border border-slate-200 shadow-2xs">
                              <img
                                src={ev.bannerImage}
                                alt={ev.title}
                                className="w-full h-full object-cover"
                              />
                              <label
                                className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover/b:opacity-100 flex items-center justify-center cursor-pointer transition-opacity"
                                title="Replace banner"
                              >
                                <Upload className="w-3.5 h-3.5 text-white" />
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleQuickUploadEventBanner(ev.id, e)}
                                />
                              </label>
                            </div>
                          ) : (
                            <label
                              className="w-16 h-10 rounded-lg border border-dashed border-slate-300 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/50 flex flex-col items-center justify-center text-[9px] font-mono text-slate-500 hover:text-blue-600 cursor-pointer transition-colors"
                              title="Upload banner"
                            >
                              <Upload className="w-3 h-3 text-slate-400" />
                              <span>Banner</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleQuickUploadEventBanner(ev.id, e)}
                              />
                            </label>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">
                            {ev.title}
                          </div>
                          {ev.description && (
                            <div className="text-[11px] text-slate-500 max-w-sm line-clamp-1 mt-0.5">
                              {ev.description}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                              ev.type === 'Workshop'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : ev.type === 'Talk'
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}
                          >
                            {ev.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[11px] text-slate-600">
                          <div className="font-medium text-slate-800">{ev.location}</div>
                          <div className="text-slate-400 font-mono text-[10px]">{ev.time}</div>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-blue-700">
                          {ev.price}
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px]">
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-emerald-500 h-1.5 rounded-full"
                                style={{
                                  width: `${Math.round(
                                    (ev.seatsLeft / ev.seatsTotal) * 100
                                  )}%`,
                                }}
                              />
                            </div>
                            <span className="text-slate-700 font-bold">
                              {ev.seatsLeft}/{ev.seatsTotal}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEditEventModal(ev)}
                              className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit event"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(ev.id, ev.title)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete event"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredEvents.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400">
                          No events found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: 1-to-1 Sessions Table */}
        {activeAdminTab === 'sessions' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Track Title</th>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4">Duration</th>
                      <th className="py-3 px-4">Fee (USD)</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredSessions.map((s) => (
                      <tr
                        key={s.id}
                        className="hover:bg-slate-50/60 transition-colors"
                      >
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {s.title}
                        </td>
                        <td className="py-3 px-4 text-slate-600 max-w-md">
                          {s.description}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-700">
                          {s.duration}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-emerald-600">
                          ${s.price}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEditSessionModal(s)}
                              className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit track"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteSession(s.id, s.title)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete track"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: ADD/EDIT BOOK */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-7 text-left my-8">
            <button
              onClick={() => setIsBookModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingBookId !== null ? `Edit Book #${editingBookId}` : 'Add Coming / New Book'}
                </h3>
                <p className="text-xs text-slate-500">
                  Update book information, cover themes, target kernel versions, and chapters.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveBook} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Book Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={bookForm.title}
                    onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                    placeholder="e.g. Linux Kernel eBPF Mastery"
                    className="w-full px-3 py-2 text-xs bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={bookForm.subtitle}
                    onChange={(e) => setBookForm({ ...bookForm, subtitle: e.target.value })}
                    placeholder="e.g. High Performance Observability & Networking"
                    className="w-full px-3 py-2 text-xs bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tag / Category
                  </label>
                  <input
                    type="text"
                    value={bookForm.tag}
                    onChange={(e) => setBookForm({ ...bookForm, tag: e.target.value })}
                    placeholder="e.g. eBPF & Observability"
                    className="w-full px-3 py-2 text-xs bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Kernel
                  </label>
                  <input
                    type="text"
                    value={bookForm.targetKernel}
                    onChange={(e) => setBookForm({ ...bookForm, targetKernel: e.target.value })}
                    placeholder="e.g. Linux 6.x LTS"
                    className="w-full px-3 py-2 text-xs bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Page Count
                  </label>
                  <input
                    type="number"
                    value={bookForm.pages}
                    onChange={(e) => setBookForm({ ...bookForm, pages: Number(e.target.value) })}
                    placeholder="380"
                    className="w-full px-3 py-2 text-xs bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Original Price (INR)
                  </label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    required
                    value={bookForm.originalPrice}
                    onChange={(e) => setBookForm({ ...bookForm, originalPrice: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Offer Price (INR)
                  </label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    required
                    value={bookForm.offerPrice}
                    onChange={(e) => setBookForm({ ...bookForm, offerPrice: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <p className="mt-1 text-[10px] text-slate-500">Offer price must be at or below the original price.</p>
                </div>
              </div>

              {/* Cover Page Uploading & Presets Option */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-blue-600" />
                    <span>Book Cover Page Image</span>
                    <span className="text-[10px] font-normal text-slate-500 font-mono">
                      (Upload custom cover or choose preset)
                    </span>
                  </label>
                  {bookForm.coverImage && (
                    <button
                      type="button"
                      onClick={() => setBookForm({ ...bookForm, coverImage: '' })}
                      className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove Cover</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                  {/* Left Column: File upload & URL & presets (8 cols) */}
                  <div className="md:col-span-8 space-y-3">
                    {/* Drag & Drop File Upload Box */}
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDraggingCover(true);
                      }}
                      onDragLeave={() => setIsDraggingCover(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDraggingCover(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) processCoverFile(file);
                      }}
                      className={`relative border-2 border-dashed rounded-xl p-4 text-center transition-all ${
                        isDraggingCover
                          ? 'border-blue-500 bg-blue-50/80 ring-2 ring-blue-500/20'
                          : 'border-slate-300 hover:border-blue-400 bg-white'
                      }`}
                    >
                      <input
                        type="file"
                        id="modal-cover-upload"
                        accept="image/png, image/jpeg, image/webp, image/svg+xml"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) processCoverFile(file);
                          e.target.value = '';
                        }}
                      />
                      <label
                        htmlFor="modal-cover-upload"
                        className="cursor-pointer flex flex-col items-center justify-center gap-1.5"
                      >
                        <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                          <Upload className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-blue-600 hover:text-blue-700 underline">
                            Click to upload cover image
                          </span>
                          <span className="text-xs text-slate-500"> or drag &amp; drop</span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          PNG, JPG, SVG, WebP (ratio ~1:1.45, up to 8MB)
                        </p>
                      </label>

                      {/* Live Upload & Optimization Progress Bar */}
                      {bookUploadProgress !== null && (
                        <div className="w-full mt-3 p-2.5 rounded-lg bg-blue-50/80 border border-blue-200 text-left">
                          <div className="flex items-center justify-between text-[11px] font-mono font-bold text-blue-900 mb-1">
                            <span>Processing &amp; Optimizing Cover...</span>
                            <span className="text-blue-700">{bookUploadProgress}%</span>
                          </div>
                          <div className="w-full bg-blue-200/80 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-blue-600 h-full rounded-full transition-all duration-150"
                              style={{ width: `${bookUploadProgress}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                            Compressing for high-speed permanent local storage
                          </span>
                        </div>
                      )}
                    </div>

                    {coverUploadError && (
                      <p className="text-xs text-rose-600 flex items-center gap-1 bg-rose-50 p-2 rounded-lg border border-rose-200">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{coverUploadError}</span>
                      </p>
                    )}

                    {/* Or Paste Image URL */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
                        <LinkIcon className="w-3 h-3 text-slate-400" />
                        <span>Or Paste Image URL / File Path</span>
                      </label>
                      <input
                        type="text"
                        value={bookForm.coverImage}
                        onChange={(e) => {
                          setBookForm({ ...bookForm, coverImage: e.target.value });
                          setCoverUploadError(null);
                        }}
                        placeholder="e.g. /covers/cover_storage.png or https://..."
                        className="w-full px-3 py-1.5 text-xs bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                      />
                    </div>

                    {/* Quick Official Cover Presets */}
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono block mb-1.5">
                        Official Trilogy Cover Presets:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setBookForm({
                              ...bookForm,
                              coverImage: '/covers/cover_storage.png',
                              color: '#851b1b',
                              spineColor: '#991b1b',
                              accentColor: '#ef4444',
                            });
                            setCoverUploadError(null);
                          }}
                          className={`px-2 py-1 text-[10px] font-mono font-medium rounded-md border transition-colors flex items-center gap-1 ${
                            bookForm.coverImage === '/covers/cover_storage.png'
                              ? 'bg-red-50 border-red-400 text-red-700 font-bold'
                              : 'bg-white border-slate-200 hover:border-red-300 text-slate-700'
                          }`}
                        >
                          <span>Storage Engineer</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setBookForm({
                              ...bookForm,
                              coverImage: '/covers/cover_kernel.png',
                              color: '#0e2439',
                              spineColor: '#1e3a5f',
                              accentColor: '#38bdf8',
                            });
                            setCoverUploadError(null);
                          }}
                          className={`px-2 py-1 text-[10px] font-mono font-medium rounded-md border transition-colors flex items-center gap-1 ${
                            bookForm.coverImage === '/covers/cover_kernel.png'
                              ? 'bg-sky-50 border-sky-400 text-sky-700 font-bold'
                              : 'bg-white border-slate-200 hover:border-sky-300 text-slate-700'
                          }`}
                        >
                          <span>Kernel Developer</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setBookForm({
                              ...bookForm,
                              coverImage: '/covers/cover_network.png',
                              color: '#064e3b',
                              spineColor: '#047857',
                              accentColor: '#10b981',
                            });
                            setCoverUploadError(null);
                          }}
                          className={`px-2 py-1 text-[10px] font-mono font-medium rounded-md border transition-colors flex items-center gap-1 ${
                            bookForm.coverImage === '/covers/cover_network.png'
                              ? 'bg-emerald-50 border-emerald-400 text-emerald-700 font-bold'
                              : 'bg-white border-slate-200 hover:border-emerald-300 text-slate-700'
                          }`}
                        >
                          <span>Network Engineer</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Live Cover Preview (4 cols) */}
                  <div className="md:col-span-4 flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono mb-2">
                      Live Preview
                    </span>

                    {bookForm.coverImage ? (
                      <div className="relative w-28 h-40 rounded-md overflow-hidden shadow-md border border-slate-300 bg-slate-900 group">
                        <img
                          src={bookForm.coverImage}
                          alt="Cover Preview"
                          className="w-full h-full object-cover object-top"
                          onError={() => {
                            setCoverUploadError('Unable to load image from provided path or URL.');
                          }}
                        />
                        {/* Book Spine Shadow Left */}
                        <div className="absolute top-0 bottom-0 left-0 w-2.5 bg-gradient-to-r from-black/40 via-black/10 to-transparent pointer-events-none" />
                        <div className="absolute top-0 bottom-0 left-2.5 w-[1px] bg-white/30 pointer-events-none" />
                        {/* Status tag */}
                        <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[9px] font-mono text-white font-bold">
                          Cover Ready
                        </div>
                      </div>
                    ) : (
                      <div
                        className="w-28 h-40 rounded-md border-2 border-dashed border-slate-300 flex flex-col items-center justify-center p-2 text-center text-slate-400 bg-slate-50 transition-colors"
                        style={{ backgroundColor: bookForm.color ? `${bookForm.color}15` : undefined }}
                      >
                        <ImageIcon className="w-6 h-6 mb-1 text-slate-300" />
                        <span className="text-[10px] font-bold text-slate-600">
                          No Custom Cover
                        </span>
                        <span className="text-[9px] text-slate-400 mt-1 leading-tight">
                          Uses color theme and generated cover
                        </span>
                      </div>
                    )}

                    {bookForm.coverImage ? (
                      <div className="mt-2 text-center">
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Custom cover set
                        </span>
                      </div>
                    ) : (
                      <div className="mt-2 text-center">
                        <span className="text-[10px] text-slate-400 font-mono">
                          Upload file to replace
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Book PDF Document File & Download Settings */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-rose-600" />
                    <span>Book Full PDF Document</span>
                    <span className="text-[10px] font-normal text-slate-500 font-mono">
                      (Used for 20% sample viewer &amp; full unabridged download)
                    </span>
                  </label>
                  {bookForm.pdfUrl && (
                    <button
                      type="button"
                      onClick={() =>
                        setBookForm({
                          ...bookForm,
                          pdfUrl: '',
                          pdfFileName: '',
                          pdfDownloadName: '',
                        })
                      }
                      className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove PDF</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                  {/* Left Column: Drag/Drop & Presets (8 cols) */}
                  <div className="md:col-span-8 space-y-3">
                    <div className="border-2 border-dashed border-slate-300 hover:border-rose-400 rounded-xl p-4 text-center bg-white transition-all">
                      <input
                        type="file"
                        id="modal-pdf-upload"
                        accept=".pdf,application/pdf"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) processPdfFile(file);
                          e.target.value = '';
                        }}
                      />
                      <label
                        htmlFor="modal-pdf-upload"
                        className="cursor-pointer flex flex-col items-center justify-center gap-1.5"
                      >
                        <div className="w-9 h-9 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                          <Upload className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-rose-600 hover:text-rose-700 underline">
                            Click to select &amp; upload PDF document
                          </span>
                          <span className="text-xs text-slate-500"> or drag &amp; drop</span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Format: .pdf (supports 20MB–50MB files via IndexedDB)
                        </p>
                      </label>

                      {/* Live PDF Upload Progress Bar */}
                      {pdfUploadProgress !== null && (
                        <div className="w-full mt-3 p-2.5 rounded-lg bg-rose-50/80 border border-rose-200 text-left">
                          <div className="flex items-center justify-between text-[11px] font-mono font-bold text-rose-900 mb-1">
                            <span>Uploading &amp; Encoding PDF Document...</span>
                            <span className="text-rose-700">{pdfUploadProgress}%</span>
                          </div>
                          <div className="w-full bg-rose-200/80 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-rose-600 h-full rounded-full transition-all duration-150"
                              style={{ width: `${pdfUploadProgress}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                            Saving directly to browser persistent storage database
                          </span>
                        </div>
                      )}
                    </div>

                    {pdfUploadError && (
                      <p className="text-xs text-rose-600 flex items-center gap-1 bg-rose-50 p-2 rounded-lg border border-rose-200">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{pdfUploadError}</span>
                      </p>
                    )}

                    {/* PDF Document URL or Relative Path */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
                          <LinkIcon className="w-3 h-3 text-slate-400" />
                          <span>PDF URL / File Path</span>
                        </label>
                        <input
                          type="text"
                          value={bookForm.pdfUrl}
                          onChange={(e) => {
                            setBookForm({ ...bookForm, pdfUrl: e.target.value });
                            setPdfUploadError(null);
                          }}
                          placeholder="e.g. /pdfs/think-like-a-linux-...pdf"
                          className="w-full px-3 py-1.5 text-xs bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Display / Download Filename
                        </label>
                        <input
                          type="text"
                          value={bookForm.pdfDownloadName}
                          onChange={(e) =>
                            setBookForm({
                              ...bookForm,
                              pdfDownloadName: e.target.value,
                              pdfFileName: e.target.value,
                            })
                          }
                          placeholder="e.g. linux-storage-guide.pdf"
                          className="w-full px-3 py-1.5 text-xs bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none font-mono"
                        />
                      </div>
                    </div>

                    {/* Official PDF Presets */}
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono block mb-1.5">
                        Trilogy Seed PDF Files:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setBookForm({
                              ...bookForm,
                              pdfUrl: '/pdfs/think-like-a-linux-storage-engineer_f-V2.pdf',
                              pdfFileName: 'think-like-a-linux-storage-engineer_f-V2.pdf',
                              pdfDownloadName: 'think-like-a-linux-storage-engineer_f-V2.pdf',
                            });
                            setPdfUploadError(null);
                          }}
                          className={`px-2 py-1 text-[10px] font-mono font-medium rounded-md border transition-colors flex items-center gap-1 ${
                            bookForm.pdfUrl === '/pdfs/think-like-a-linux-storage-engineer_f-V2.pdf'
                              ? 'bg-rose-50 border-rose-400 text-rose-700 font-bold'
                              : 'bg-white border-slate-200 hover:border-rose-300 text-slate-700'
                          }`}
                        >
                          <span>Storage PDF (273 pgs)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setBookForm({
                              ...bookForm,
                              pdfUrl: '/pdfs/think-like-a-linux-kernel-developer.pdf',
                              pdfFileName: 'think-like-a-linux-kernel-developer.pdf',
                              pdfDownloadName: 'think-like-a-linux-kernel-developer.pdf',
                            });
                            setPdfUploadError(null);
                          }}
                          className={`px-2 py-1 text-[10px] font-mono font-medium rounded-md border transition-colors flex items-center gap-1 ${
                            bookForm.pdfUrl === '/pdfs/think-like-a-linux-kernel-developer.pdf'
                              ? 'bg-sky-50 border-sky-400 text-sky-700 font-bold'
                              : 'bg-white border-slate-200 hover:border-sky-300 text-slate-700'
                          }`}
                        >
                          <span>Kernel C PDF (139 pgs)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setBookForm({
                              ...bookForm,
                              pdfUrl: '/pdfs/net_fV3.pdf',
                              pdfFileName: 'net_fV3.pdf',
                              pdfDownloadName: 'think-like-a-linux-network-engineer.pdf',
                            });
                            setPdfUploadError(null);
                          }}
                          className={`px-2 py-1 text-[10px] font-mono font-medium rounded-md border transition-colors flex items-center gap-1 ${
                            bookForm.pdfUrl === '/pdfs/net_fV3.pdf'
                              ? 'bg-emerald-50 border-emerald-400 text-emerald-700 font-bold'
                              : 'bg-white border-slate-200 hover:border-emerald-300 text-slate-700'
                          }`}
                        >
                          <span>Networking PDF</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: PDF Status Preview (4 cols) */}
                  <div className="md:col-span-4 flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-slate-200 shadow-2xs h-full min-h-[140px]">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono mb-2">
                      PDF Document Status
                    </span>

                    {bookForm.pdfUrl ? (
                      <div className="w-full text-center space-y-2">
                        <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
                          <FileCheck className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-[11px] font-mono font-bold text-slate-800 truncate px-2" title={bookForm.pdfFileName || 'PDF File'}>
                            {bookForm.pdfFileName || 'Attached PDF Document'}
                          </p>
                          <span className="text-[10px] text-emerald-600 font-semibold font-mono block mt-0.5">
                            ✓ Ready for Sample &amp; Purchase
                          </span>
                        </div>
                        <a
                          href={bookForm.pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] font-mono text-blue-600 hover:underline pt-1"
                        >
                          <span>Test Open PDF</span>
                          <span>↗</span>
                        </a>
                      </div>
                    ) : (
                      <div className="text-center py-2 text-slate-400">
                        <FileText className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                        <span className="text-[11px] font-medium text-slate-600 block">
                          No PDF Attached
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono">
                          Will use default system sample
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Interactive Syllabus Video</h4>
                  <p className="mt-1 text-[11px] text-slate-500">Attach a video lesson to this book. It appears automatically in Interactive Syllabus mode.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 hover:border-blue-400 hover:text-blue-700">
                    <Upload className="h-4 w-4" />
                    <span>{bookForm.syllabusVideoUrl ? 'Replace Video' : 'Upload Video'}</span>
                    <input
                      type="file"
                      accept="video/*,.mp4,.webm,.mov,.m4v,.ogv"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) processSyllabusVideoFile(file);
                        event.target.value = '';
                      }}
                    />
                  </label>
                  {bookForm.syllabusVideoName && (
                    <span className="max-w-full truncate text-xs text-slate-600">{bookForm.syllabusVideoName}</span>
                  )}
                  {bookForm.syllabusVideoUrl && (
                    <button
                      type="button"
                      onClick={() => setBookForm({ ...bookForm, syllabusVideoUrl: '', syllabusVideoName: '' })}
                      className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remove video
                    </button>
                  )}
                  <span className="text-[10px] text-slate-400">MP4, WebM, MOV, M4V or OGV; up to 100 MB</span>
                </div>
                {videoUploadError && (
                  <p className="text-xs text-rose-600" role="alert">{videoUploadError}</p>
                )}
              </div>

              {/* Color Presets */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-blue-600" />
                  <span>Select Book Cover Color Theme</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() =>
                        setBookForm({
                          ...bookForm,
                          color: preset.color,
                          spineColor: preset.spine,
                          accentColor: preset.accent,
                        })
                      }
                      className={`px-2.5 py-1 text-[11px] rounded-lg border flex items-center gap-1.5 font-medium transition-all ${
                        bookForm.color === preset.color
                          ? 'border-blue-600 bg-blue-50 text-blue-800 ring-1 ring-blue-500'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/20"
                        style={{ backgroundColor: preset.color }}
                      />
                      <span>{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Short Description (For Grid Cards)
                </label>
                <input
                  type="text"
                  required
                  value={bookForm.description}
                  onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })}
                  placeholder="One sentence explaining the practical outcome of the book..."
                  className="w-full px-3 py-2 text-xs bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Detailed Description (Modal / Feature View)
                </label>
                <textarea
                  rows={3}
                  value={bookForm.fullDescription}
                  onChange={(e) => setBookForm({ ...bookForm, fullDescription: e.target.value })}
                  placeholder="In-depth overview of the engineering concepts covered..."
                  className="w-full px-3 py-2 text-xs bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Chapters */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Chapters / Table of Contents (one per line)
                </label>
                <textarea
                  rows={3}
                  value={bookForm.chaptersInput}
                  onChange={(e) => setBookForm({ ...bookForm, chaptersInput: e.target.value })}
                  placeholder="Chapter 1: Title&#10;Chapter 2: Title"
                  className="w-full px-3 py-2 text-xs font-mono bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Featured toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featured-check"
                  checked={bookForm.featured}
                  onChange={(e) => setBookForm({ ...bookForm, featured: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="featured-check" className="text-xs font-semibold text-slate-800">
                  Highlight this as a Featured Book on the Homepage
                </label>
              </div>

              {/* Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsBookModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
                >
                  {editingBookId !== null ? 'Save Changes' : 'Publish Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD/EDIT EVENT */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-7 text-left my-8">
            <button
              onClick={() => setIsEventModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingEventId ? 'Edit Event / Workshop' : 'Add Upcoming Event'}
                </h3>
                <p className="text-xs text-slate-500">
                  Schedule talks, workshops, technical meetups, and seat limits.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Event Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  placeholder="e.g. Advanced eBPF & Kernel Tracing Live Workshop"
                  className="w-full px-3 py-2 text-xs bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Month
                  </label>
                  <input
                    type="text"
                    required
                    value={eventForm.month}
                    onChange={(e) => setEventForm({ ...eventForm, month: e.target.value })}
                    placeholder="NOV"
                    className="w-full px-3 py-2 text-xs font-mono uppercase bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Day
                  </label>
                  <input
                    type="text"
                    required
                    value={eventForm.day}
                    onChange={(e) => setEventForm({ ...eventForm, day: e.target.value })}
                    placeholder="25"
                    className="w-full px-3 py-2 text-xs font-mono bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Year
                  </label>
                  <input
                    type="text"
                    required
                    value={eventForm.year}
                    onChange={(e) => setEventForm({ ...eventForm, year: e.target.value })}
                    placeholder="2025"
                    className="w-full px-3 py-2 text-xs font-mono bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Event Type
                  </label>
                  <select
                    value={eventForm.type}
                    onChange={(e) =>
                      setEventForm({
                        ...eventForm,
                        type: e.target.value as 'Workshop' | 'Talk' | 'Meetup',
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Workshop">Workshop</option>
                    <option value="Talk">Talk</option>
                    <option value="Meetup">Meetup</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Fee / Price
                  </label>
                  <input
                    type="text"
                    value={eventForm.price}
                    onChange={(e) => setEventForm({ ...eventForm, price: e.target.value })}
                    placeholder="$49 or Free"
                    className="w-full px-3 py-2 text-xs bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Location / Platform
                  </label>
                  <input
                    type="text"
                    value={eventForm.location}
                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                    placeholder="Online or Bangalore, India"
                    className="w-full px-3 py-2 text-xs bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Time / Duration
                  </label>
                  <input
                    type="text"
                    value={eventForm.time}
                    onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                    placeholder="10:00 AM – 1:00 PM (IST)"
                    className="w-full px-3 py-2 text-xs bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Total Seats
                  </label>
                  <input
                    type="number"
                    value={eventForm.seatsTotal}
                    onChange={(e) => setEventForm({ ...eventForm, seatsTotal: Number(e.target.value) })}
                    placeholder="30"
                    className="w-full px-3 py-2 text-xs bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Available Seats Left
                  </label>
                  <input
                    type="number"
                    value={eventForm.seatsLeft}
                    onChange={(e) => setEventForm({ ...eventForm, seatsLeft: Number(e.target.value) })}
                    placeholder="25"
                    className="w-full px-3 py-2 text-xs bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Summary Description
                </label>
                <textarea
                  rows={2}
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  placeholder="Hands-on topics to be covered during the event..."
                  className="w-full px-3 py-2 text-xs bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Event Banner Image Upload */}
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <label className="block text-xs font-bold text-slate-800">
                  Event Banner Image
                </label>
                <div className="flex items-center gap-3">
                  {eventForm.bannerImage ? (
                    <div className="relative w-24 h-14 rounded-lg overflow-hidden border border-slate-300 shrink-0 shadow-2xs">
                      <img
                        src={eventForm.bannerImage}
                        alt="Event Banner Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setEventForm({ ...eventForm, bannerImage: '' })}
                        className="absolute top-1 right-1 p-0.5 bg-slate-900/80 hover:bg-rose-600 text-white rounded-full transition-colors"
                        title="Remove banner"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-24 h-14 rounded-lg border border-dashed border-slate-300 bg-white flex flex-col items-center justify-center text-slate-400 shrink-0">
                      <ImageIcon className="w-5 h-5 text-slate-300" />
                      <span className="text-[9px] font-mono mt-0.5">No Banner</span>
                    </div>
                  )}

                  <div className="flex-1 space-y-1.5">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-300 cursor-pointer transition-colors shadow-2xs">
                      <Upload className="w-3.5 h-3.5 text-blue-600" />
                      <span>Upload Banner Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setEventUploadProgress(15);
                            try {
                              const optimized = await compressAndProcessImage(file, {
                                maxWidth: 1400,
                                maxHeight: 800,
                                quality: 0.88,
                                onProgress: (p) => setEventUploadProgress(p),
                              });
                              setEventForm((prev) => ({
                                ...prev,
                                bannerImage: optimized,
                              }));
                              setTimeout(() => setEventUploadProgress(null), 1200);
                            } catch {
                              setEventUploadProgress(null);
                            }
                          }
                          e.target.value = '';
                        }}
                      />
                    </label>

                    {eventUploadProgress !== null && (
                      <div className="w-full mt-1.5 p-2 rounded-lg bg-blue-50 border border-blue-200">
                        <div className="flex items-center justify-between text-[10px] font-mono font-bold text-blue-900 mb-1">
                          <span>Uploading Banner...</span>
                          <span>{eventUploadProgress}%</span>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-blue-600 h-full rounded-full transition-all duration-150"
                            style={{ width: `${eventUploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <p className="text-[10px] text-slate-500 font-mono">
                      PNG, JPG, WebP up to 8MB. Displayed on public event cards.
                    </p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors"
                >
                  {editingEventId ? 'Update Event' : 'Save Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD/EDIT 1-TO-1 SESSION */}
      {isSessionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-7 text-left my-8">
            <button
              onClick={() => setIsSessionModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingSessionId ? 'Edit 1-to-1 Track' : 'Add 1-to-1 Session Track'}
                </h3>
                <p className="text-xs text-slate-500">
                  Define consultation topics, session length, and pricing.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveSession} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Track Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={sessionForm.title}
                  onChange={(e) => setSessionForm({ ...sessionForm, title: e.target.value })}
                  placeholder="e.g. Linux Kernel Architecture Review"
                  className="w-full px-3 py-2 text-xs bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Track Description
                </label>
                <textarea
                  rows={2}
                  required
                  value={sessionForm.description}
                  onChange={(e) => setSessionForm({ ...sessionForm, description: e.target.value })}
                  placeholder="Describe who this session is for and key outcomes..."
                  className="w-full px-3 py-2 text-xs bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Duration Label
                  </label>
                  <input
                    type="text"
                    value={sessionForm.duration}
                    onChange={(e) => setSessionForm({ ...sessionForm, duration: e.target.value })}
                    placeholder="45 mins"
                    className="w-full px-3 py-2 text-xs bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Price in USD ($)
                  </label>
                  <input
                    type="number"
                    value={sessionForm.price}
                    onChange={(e) => setSessionForm({ ...sessionForm, price: Number(e.target.value) })}
                    placeholder="99"
                    className="w-full px-3 py-2 text-xs bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsSessionModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm transition-colors"
                >
                  {editingSessionId ? 'Save Track' : 'Create Track'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: CHANGE ADMIN CREDENTIALS */}
      {isSecurityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-6 text-left my-8">
            <button
              onClick={() => setIsSecurityModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Admin Login &amp; Security
                </h3>
                <p className="text-xs text-slate-500">
                  Update your Admin ID and Password for logging into this panel.
                </p>
              </div>
            </div>

            {securityModalError && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{securityModalError}</span>
              </div>
            )}

            <form onSubmit={handleSaveSecurityCreds} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Admin ID / Username <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newAdminIdInput}
                  onChange={(e) => setNewAdminIdInput(e.target.value)}
                  placeholder="e.g. admin or avinash"
                  className="w-full px-3 py-2 text-xs bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Password <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={currentPasswordInput}
                  onChange={(e) => setCurrentPasswordInput(e.target.value)}
                  placeholder="Enter current password to verify"
                  className="w-full px-3 py-2 text-xs bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Current default is <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600 font-mono">admin123</code>
                </span>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Password (Optional, leave blank to keep unchanged)
                </label>
                <input
                  type="password"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  placeholder="Enter new password (min 4 characters)"
                  className="w-full px-3 py-2 text-xs bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                />
              </div>

              {newPasswordInput && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Confirm New Password <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    required={!!newPasswordInput}
                    value={confirmPasswordInput}
                    onChange={(e) => setConfirmPasswordInput(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full px-3 py-2 text-xs bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>
              )}

              {/* Razorpay API Configuration */}
              <div className="border-t border-slate-100 pt-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Razorpay Key ID (Live / Test Gateway)</span>
                  <span className="text-[10px] text-blue-600 font-mono font-bold">UPI &amp; Cards</span>
                </label>
                <input
                  type="text"
                  value={razorpayKeyInput}
                  onChange={(e) => setRazorpayKeyInput(e.target.value)}
                  placeholder="e.g. rzp_live_... or rzp_test_..."
                  className="w-full px-3 py-2 text-xs bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Optional. Leave blank to use the built-in interactive Razorpay checkout simulator.
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsSecurityModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  Save Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GLOBAL CONFIRMATION MODAL (Replaces window.confirm which is blocked in iframes) */}
      {confirmDialog && confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 p-6 text-left animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 border border-rose-100">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-1.5">
              {confirmDialog.title}
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              {confirmDialog.message}
            </p>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setConfirmDialog(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDialog.onConfirm}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-[0.98] rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{confirmDialog.confirmText}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
