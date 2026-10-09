import { Github, Linkedin, Youtube, Mail } from 'lucide-react';
import { TuxLogo } from './TuxLogo';
import { AUTHOR_INFO } from '../data/siteData';

interface FooterProps {
  onSelectTab: (tab: string) => void;
}

export function Footer({ onSelectTab }: FooterProps) {
  const links = [
    { id: 'home', label: 'Home' },
    { id: 'books', label: 'Books' },
    { id: 'events', label: 'Events' },
    { id: 'one-to-one', label: '1-to-1 Sessions' },
    { id: 'interview-notes', label: 'Interview Notes' },
    { id: 'about', label: 'About' },
  ];

  return (
    <footer className="bg-white border-t border-slate-200/90 pt-10 pb-20 sm:pb-8 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-100">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <TuxLogo className="w-8 h-8" />
            <div className="text-left">
              <span className="block text-base font-bold text-slate-900 leading-tight">
                {AUTHOR_INFO.name}
              </span>
              <span className="block text-xs text-slate-500 leading-none mt-0.5">
                Linux Systems Books
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium text-slate-600">
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => onSelectTab(link.id)}
                className="hover:text-blue-600 transition-colors focus:outline-none"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Socials */}
          <div className="flex items-center gap-4 text-slate-500">
            <a
              href={AUTHOR_INFO.socials.github}
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-900 transition-colors p-1"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={AUTHOR_INFO.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-600 transition-colors p-1"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href={AUTHOR_INFO.socials.youtube}
              target="_blank"
              rel="noreferrer"
              className="hover:text-red-600 transition-colors p-1"
              aria-label="YouTube"
            >
              <Youtube className="w-4 h-4" />
            </a>
            <a
              href={`mailto:${AUTHOR_INFO.socials.email}`}
              className="hover:text-blue-600 transition-colors p-1"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Bottom Credits & Tagline */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3 text-center sm:text-left font-mono">
          <p>
            <button
              onClick={() => onSelectTab('admin')}
              className="hover:text-slate-800 transition-colors text-left focus:outline-none"
              title="Secure Admin Access (Ctrl+Shift+A or visit /#admin)"
            >
              © 2025 {AUTHOR_INFO.name}. All rights reserved.
            </button>
          </p>
          <p className="text-slate-600 font-semibold tracking-wide">
            Better Drivers. A Stronger Linux.
          </p>
        </div>
      </div>
    </footer>
  );
}
