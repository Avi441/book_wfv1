import { Home, BookOpen, Calendar, Users, FileText } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  booksCount?: number;
}

export function MobileBottomNav({
  activeTab,
  onSelectTab,
  booksCount = 3,
}: MobileBottomNavProps) {
  const tabs = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
    },
    {
      id: 'books',
      label: 'Books',
      icon: BookOpen,
      badge: booksCount > 0 ? booksCount : undefined,
    },
    {
      id: 'events',
      label: 'Events',
      icon: Calendar,
    },
    {
      id: 'one-to-one',
      label: '1-to-1',
      icon: Users,
    },
    {
      id: 'interview-notes',
      label: 'Notes',
      icon: FileText,
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 pt-1.5 pb-[max(0.4rem,env(safe-area-inset-bottom,0.4rem))]"
    >
      <div className="grid grid-cols-5 items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 active:scale-95 select-none min-h-[48px] ${
                isActive
                  ? 'text-blue-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {/* Active Indicator Top Pill */}
              {isActive && (
                <span className="absolute -top-1.5 w-6 h-0.5 bg-blue-600 rounded-full" />
              )}

              {/* Icon Container with Badge */}
              <div className="relative">
                <div
                  className={`p-1 rounded-lg transition-colors ${
                    isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {tab.badge !== undefined && (
                  <span className="absolute -top-1 -right-1 px-1 min-w-[15px] h-[15px] rounded-full bg-blue-600 text-white text-[9px] font-mono font-bold flex items-center justify-center shadow-2xs">
                    {tab.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[10px] tracking-tight mt-0.5 ${
                  isActive ? 'font-bold text-blue-600' : 'font-medium text-slate-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
