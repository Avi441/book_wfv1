import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { BooksSection } from './components/BooksSection';
import { ResourceGrid } from './components/ResourceGrid';
import { FeaturedBookSection } from './components/FeaturedBookSection';
import { NewsletterSection } from './components/NewsletterSection';
import { Footer } from './components/Footer';
import { EventsPage } from './components/EventsPage';
import { OneToOnePage } from './components/OneToOnePage';
import { AdminPanel } from './components/AdminPanel';
import { BookDetailModal } from './components/BookDetailModal';
import { PdfNotesModal } from './components/PdfNotesModal';
import { SampleReadModal } from './components/SampleReadModal';
import { BuyNowModal } from './components/BuyNowModal';
import { SearchModal } from './components/SearchModal';
import { ContactModal } from './components/ContactModal';
import { NoteDetailModal } from './components/NoteDetailModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { CartModal } from './components/CartModal';
import { useSiteData } from './context/useSiteData';
import { Book } from './types';
import { Check } from 'lucide-react';
import { markBookPurchased } from './utils/purchaseEntitlements';
import { CurrencyCode, DEFAULT_CURRENCY, ExchangeRates } from './utils/pricing';

const CART_STORAGE_KEY = 'avinash_cart_v1';

type CartEntry = {
  id: number;
  title: string;
  quantity: number;
};

export default function App() {
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#admin') {
      return 'admin';
    }
    return 'home';
  });
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [sampleReadBook, setSampleReadBook] = useState<Book | null>(null);
  const [buyNowBook, setBuyNowBook] = useState<Book | null>(null);
  const [buyNowQuantity, setBuyNowQuantity] = useState(1);
  const [readingPdfBook, setReadingPdfBook] = useState<Book | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [activeNote, setActiveNote] = useState<{
    title: string;
    category?: string;
    readTime?: string;
  } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>(DEFAULT_CURRENCY);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartEntries, setCartEntries] = useState<CartEntry[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = window.localStorage.getItem(CART_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  // Dynamic Site Data with localStorage persistence
  const {
    books,
    events,
    sessions,
    addBook,
    updateBook,
    setBookCover,
    deleteBook,
    addEvent,
    updateEvent,
    deleteEvent,
    addSession,
    updateSession,
    deleteSession,
    resetToDefaults,
  } = useSiteData();

  // Secret keyboard shortcut (Ctrl+Shift+A or Cmd+Shift+A) & Hash routing for Admin Access
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setActiveTab((prev) => (prev === 'admin' ? 'home' : 'admin'));
        window.scrollTo({ top: 0, behavior: 'smooth' });
        showToast(activeTab === 'admin' ? 'Switched to Public View' : 'Admin Portal Activated');
      }
    };

    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setActiveTab('admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [activeTab]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartEntries));
    }
  }, [cartEntries]);

  useEffect(() => {
    const loadRegion = async () => {
      try {
        const response = await fetch('/api/geo', { headers: { Accept: 'application/json' } });
        if (!response.ok) return;
        const payload = await response.json();
        if (payload?.currency && ['USD', 'INR', 'GBP', 'EUR', 'AED', 'SGD', 'AUD', 'CAD', 'JPY'].includes(payload.currency)) {
          setSelectedCurrency(payload.currency);
        }
        if (payload?.exchangeRates && typeof payload.exchangeRates === 'object') {
          setExchangeRates(payload.exchangeRates);
        }
      } catch {
        // Fall back to the default storefront currency when the backend is unavailable.
      }
    };

    loadRegion();
  }, []);

  const handleUpdateCover = (bookId: number, coverUrl: string) => {
    setBookCover(bookId, coverUrl);
    if (selectedBook && selectedBook.id === bookId) {
      setSelectedBook((prev) => (prev ? { ...prev, coverImage: coverUrl, bannerImage: coverUrl } : null));
    }
    showToast('Book cover image updated successfully!');
  };

  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (tab === 'books') {
      setTimeout(() => {
        const el = document.getElementById('books-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else if (tab === 'interview-notes' || tab === 'technical-notes' || tab === 'real-devices') {
      setTimeout(() => {
        const el = document.getElementById('resources-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  const handleOpenSubscribe = () => {
    if (activeTab !== 'home') {
      setActiveTab('home');
      setTimeout(() => {
        const el = document.getElementById('newsletter-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          const input = el.querySelector('input');
          if (input) input.focus();
        }
      }, 100);
    } else {
      const el = document.getElementById('newsletter-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        const input = el.querySelector('input');
        if (input) input.focus();
      }
    }
  };

  const handleBuyBook = (book: Book) => {
    setBuyNowQuantity(1);
    setBuyNowBook(book);
  };

  const handleBuyCartItem = (book: Book, quantity: number) => {
    setBuyNowQuantity(quantity);
    setIsCartOpen(false);
    setBuyNowBook(book);
  };

  const handleOpenSampleRead = (book: Book) => {
    setSampleReadBook(book);
  };

  const handleBuySuccess = (book: Book, format: string) => {
    markBookPurchased(book.id);
    setCartEntries((prev) => prev.filter((entry) => entry.id !== book.id));
    showToast(`Order confirmed! Full download for "${book.title}" (${format}) has started.`);
  };

  const handleAddToCart = (book: Book) => {
    setCartEntries((prev) => {
      const existing = prev.find((entry) => entry.id === book.id);
      if (existing) {
        return prev.map((entry) =>
          entry.id === book.id ? { ...entry, quantity: entry.quantity + 1 } : entry,
        );
      }

      return [
        ...prev,
        {
          id: book.id,
          title: book.title,
          quantity: 1,
        },
      ];
    });

    showToast(`${book.title} added to cart.`);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white text-sm font-medium rounded-xl shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200 max-w-[calc(100vw-2rem)]">
          <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {/* Main Sticky Header with 1-to-1 Sessions, Events & Admin */}
      <Header
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenSubscribe={handleOpenSubscribe}
        cartCount={cartEntries.reduce((sum, entry) => sum + entry.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Main Page Content (with mobile safe bottom padding for bottom nav) */}
      <main className="flex-1 pb-20 sm:pb-0">
        {activeTab === 'admin' ? (
          /* 0. Dedicated Admin Panel to Manage Books, Events & Sessions */
          <AdminPanel
            books={books}
            events={events}
            sessions={sessions}
            exchangeRates={exchangeRates}
            onAddBook={addBook}
            onUpdateBook={updateBook}
            onDeleteBook={deleteBook}
            onAddEvent={addEvent}
            onUpdateEvent={updateEvent}
            onDeleteEvent={deleteEvent}
            onAddSession={addSession}
            onUpdateSession={updateSession}
            onDeleteSession={deleteSession}
            onResetDefaults={resetToDefaults}
            onViewLiveSite={(targetTab) => handleSelectTab(targetTab || 'home')}
          />
        ) : activeTab === 'events' ? (
          /* 1. Dedicated Events & Workshop Booking Page */
          <EventsPage
            events={events}
            onNavigateHome={() => handleSelectTab('home')}
            onNavigateToOneToOne={() => handleSelectTab('one-to-one')}
            onOpenContact={() => setIsContactOpen(true)}
          />
        ) : activeTab === 'one-to-one' ? (
          /* 2. Dedicated 1-to-1 Session Booking Page */
          <OneToOnePage
            sessions={sessions}
            onNavigateHome={() => handleSelectTab('home')}
            onNavigateToEvents={() => handleSelectTab('events')}
            onOpenContact={() => setIsContactOpen(true)}
          />
        ) : (
          /* 3. Comprehensive Home View */
          <>
            {/* 3a. Hero Section with 3D Book Shelf */}
            <HeroSection
              books={books}
              onExploreBooks={() => handleSelectTab('books')}
              onViewEvents={() => handleSelectTab('events')}
              onSelectBook={(book) => setSelectedBook(book)}
              onSampleRead={handleOpenSampleRead}
            />

            {/* 4b. All Books Section */}
            <BooksSection
              books={books}
              currency={selectedCurrency}
              exchangeRates={exchangeRates}
              onSelectBook={(book) => setSelectedBook(book)}
              onViewAllBooks={() => handleSelectTab('books')}
              onSampleRead={handleOpenSampleRead}
              onAddToCart={handleAddToCart}
              onUpdateCover={activeTab === 'admin' ? handleUpdateCover : undefined}
            />

            {/* 4c. Resource Grid */}
            <div id="resources-section">
              <ResourceGrid
                events={events}
                onNavigateTab={(tab) => handleSelectTab(tab)}
                onSelectEvent={() => handleSelectTab('events')}
                onSelectNote={(noteTitle) =>
                  setActiveNote({
                    title: noteTitle,
                    category: 'Linux Kernel Deep Dive',
                    readTime: '6 min read',
                  })
                }
              />
            </div>

            {/* 4d. Featured Book Section */}
            <FeaturedBookSection
              books={books}
              currency={selectedCurrency}
              exchangeRates={exchangeRates}
              onSelectBook={(book) => setSelectedBook(book)}
              onBuyBook={handleBuyBook}
              onAddToCart={handleAddToCart}
              onSampleRead={handleOpenSampleRead}
              onUpdateCover={activeTab === 'admin' ? handleUpdateCover : undefined}
            />

            {/* 4e. Newsletter Signup */}
            <NewsletterSection />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer onSelectTab={handleSelectTab} />

      {/* Modals with live synchronization to updated site books */}
      <BookDetailModal
        book={selectedBook ? books.find((b) => b.id === selectedBook.id) || selectedBook : null}
        currency={selectedCurrency}
        exchangeRates={exchangeRates}
        onClose={() => setSelectedBook(null)}
        onBuy={handleBuyBook}
        onAddToCart={handleAddToCart}
        onSampleRead={handleOpenSampleRead}
        onUpdateCover={activeTab === 'admin' ? handleUpdateCover : undefined}
      />

      {/* Free Sample Read Preview Modal (First 10-20% of Book with live uploaded PDF synchronization) */}
      <SampleReadModal
        book={sampleReadBook ? books.find((b) => b.id === sampleReadBook.id) || sampleReadBook : null}
        currency={selectedCurrency}
        exchangeRates={exchangeRates}
        onClose={() => setSampleReadBook(null)}
        onBuyNow={handleBuyBook}
      />

      {/* Buy Now Full Download Checkout Modal */}
      <BuyNowModal
        book={buyNowBook ? books.find((b) => b.id === buyNowBook.id) || buyNowBook : null}
        isOpen={!!buyNowBook}
        quantity={buyNowQuantity}
        currency={selectedCurrency}
        exchangeRates={exchangeRates}
        onClose={() => setBuyNowBook(null)}
        onSuccess={handleBuySuccess}
      />

      <CartModal
        isOpen={isCartOpen}
        entries={cartEntries}
        books={books}
        currency={selectedCurrency}
        exchangeRates={exchangeRates}
        onClose={() => setIsCartOpen(false)}
        onRemove={(bookId) => setCartEntries((prev) => prev.filter((entry) => entry.id !== bookId))}
        onQuantityChange={(bookId, quantity) =>
          setCartEntries((prev) =>
            quantity <= 0
              ? prev.filter((entry) => entry.id !== bookId)
              : prev.map((entry) => entry.id === bookId ? { ...entry, quantity } : entry),
          )
        }
        onCheckout={handleBuyCartItem}
      />

      {/* PDF Notes & eBook Reader Modal */}
      <PdfNotesModal
        book={readingPdfBook ? books.find((b) => b.id === readingPdfBook.id) || readingPdfBook : null}
        onClose={() => setReadingPdfBook(null)}
        onBuyNow={handleBuyBook}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectBook={(book) => setSelectedBook(book)}
        onSelectEvent={() => handleSelectTab('events')}
        onSelectNote={(noteTitle) =>
          setActiveNote({
            title: noteTitle,
            category: 'Linux Kernel Deep Dive',
            readTime: '6 min read',
          })
        }
        books={books}
        events={events}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      <NoteDetailModal
        note={activeNote}
        onClose={() => setActiveNote(null)}
      />

      {/* Mobile App Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        booksCount={books.length}
      />
    </div>
  );
}
