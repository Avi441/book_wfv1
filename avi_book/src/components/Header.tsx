import { useState } from 'react';
import { Search, Menu, X, ShieldCheck, ShoppingCart } from 'lucide-react';
import { TuxLogo } from './TuxLogo';
import { AUTHOR_INFO } from '../data/siteData';

interface HeaderProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenSearch: () => void;
  onOpenSubscribe: () => void;
  cartCount?: number;
  onOpenCart: () => void;
}

export function Header({
  activeTab,
  onSelectTab,
  onOpenSearch,
  onOpenSubscribe,
  cartCount = 0,
  onOpenCart,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'books', label: 'All Books' },
    { id: 'events', label: 'Events' },
    { id: 'one-to-one', label: '1-to-1 Sessions' },
    { id: 'interview-notes', label: 'Interview Notes' },
  ];

  const handleNavClick = (id: string) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Identity */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left group focus:outline-none"
            aria-label="Avinash Pal Homepage"
          >
            <TuxLogo className="w-9 h-9 transition-transform group-hover:scale-105" />
            <div>
              <div className="text-base sm:text-lg font-bold tracking-tight text-slate-900 leading-tight">
                {AUTHOR_INFO.name}
              </div>
              <div className="text-xs text-slate-500 font-medium leading-none mt-0.5">
                Linux Systems Books
              </div>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors rounded-md focus:outline-none ${
                    isActive
                      ? 'text-blue-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Search & Subscribe */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              type="button"
              onClick={onOpenCart}
              className="relative inline-flex h-10 items-center gap-2 px-3 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
              aria-label={`Open cart, ${cartCount} items`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Cart</span>
              <span className="inline-flex min-w-5 h-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white px-1">
                {cartCount}
              </span>
            </button>
            <button
              onClick={onOpenSearch}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Search books and technical notes"
              title="Search (Ctrl + K)"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={onOpenSubscribe}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            >
              Subscribe
            </button>
          </div>

          {/* Mobile menu and search toggle */}
          <div className="flex items-center gap-1.5 sm:hidden">
            <button
              onClick={onOpenCart}
              className="relative w-11 h-11 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200 rounded-xl transition-colors"
              aria-label={`Open cart, ${cartCount} items`}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-blue-600 text-[9px] leading-4 text-white font-bold">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={onOpenSearch}
              className="w-11 h-11 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200 rounded-xl transition-colors"
              aria-label="Search"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="w-11 h-11 flex items-center justify-center text-slate-700 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200 rounded-xl transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Modern Mobile Slide-Over Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-over panel */}
          <div className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-250">
            {/* Drawer Top Header with Safe Area */}
            <div className="p-4 pt-[max(1rem,env(safe-area-inset-top,1rem))] border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2.5">
                <TuxLogo className="w-8 h-8" />
                <div>
                  <div className="text-sm font-bold text-slate-900 leading-tight">
                    {AUTHOR_INFO.name}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    Linux Systems Learning
                  </div>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors active:scale-95"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Navigation List */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
              <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
                Navigation
              </div>
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full text-left px-3.5 py-3 rounded-xl text-base font-medium flex items-center justify-between transition-colors active:scale-[0.98] ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-50 active:bg-slate-100'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 shadow-xs" />
                    )}
                  </button>
                );
              })}

              <div className="pt-4 border-t border-slate-100 mt-4 space-y-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenSubscribe();
                  }}
                  className="w-full py-3 px-3.5 text-center text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-sm transition-all"
                >
                  Subscribe for Updates
                </button>
              </div>
            </div>

            {/* Drawer Footer with Safe Area */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 text-xs text-slate-500 text-center pb-[max(1rem,env(safe-area-inset-bottom,1rem))]">
              <p className="font-medium text-slate-700">{AUTHOR_INFO.name}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Author of 3 Linux Kernel Engineering Books</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
