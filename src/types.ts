export interface PDFNoteChapter {
  id: string;
  chapterNumber: number;
  title: string;
  summary: string;
  keyConcepts: string[];
  codeSnippets?: {
    title: string;
    language: string;
    code: string;
  }[];
  interviewTakeaways?: string[];
}

export interface Book {
  id: number;
  title: string;
  subtitle?: string;
  description: string;
  fullDescription?: string;
  color: string;
  spineColor: string;
  accentColor: string;
  tag: string;
  chapters?: string[];
  pages?: number;
  isbn?: string;
  targetKernel?: string;
  featured?: boolean;
  coverImage?: string;
  bannerImage?: string;
  pdfUrl?: string;
  pdfFileName?: string;
  pdfDownloadName?: string;
  syllabusVideoUrl?: string;
  syllabusVideoName?: string;
  pdfNotes?: PDFNoteChapter[];
  tagline?: string;
  badge?: string;
  year?: string;
  price?: number;
  offerPrice?: number;
  priceCurrency?: string;
  discountPercent?: number;
  samplePercentage?: number;
}

export interface UpcomingEvent {
  id: string;
  date: {
    month: string;
    day: string;
    year: string;
  };
  title: string;
  type: 'Workshop' | 'Talk' | 'Meetup';
  location: string;
  time: string;
  price: string;
  seatsTotal: number;
  seatsLeft: number;
  description?: string;
  bannerImage?: string;
  iconType?: 'camera' | 'kernel' | 'phone' | 'usb' | 'chip';
}

export interface OneToOneSessionType {
  id: string;
  title: string;
  description: string;
  duration: string;
  durationMinutes: number;
  price: number;
  iconName: string;
}

export interface BookingDetails {
  fullName: string;
  email: string;
  phone?: string;
  eventId?: string;
  sessionTypeId?: string;
  selectedDate?: string;
  selectedTime?: string;
  notes?: string;
}

export interface InterviewNote {
  id: string;
  category: 'Kernel' | 'V4L2' | 'General' | 'Storage' | 'Networking';
  categoryColor: string;
  title: string;
  questionCount: string;
  readTime: string;
  summary?: string;
  keyPoints?: string[];
  questions?: { q: string; a: string }[];
  codeSnippet?: {
    title: string;
    language: string;
    code: string;
  };
}

export interface TechnicalNote {
  id: string;
  title: string;
  readTime: string;
  category: string;
  summary?: string;
  content?: string;
  keyPoints?: string[];
  codeSnippet?: {
    title: string;
    language: string;
    code: string;
  };
}

export interface RealDeviceExample {
  id: string;
  title: string;
  subtitle: string;
  iconType: 'phone' | 'laptop' | 'camera';
  specs: string;
}
