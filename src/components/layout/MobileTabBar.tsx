import { Link, useLocation } from 'react-router-dom';
import { Home, Library, Search, Users, User } from 'lucide-react';
import type { User as UserType } from '@/types';

interface MobileTabBarProps {
  user: UserType | null;
}

const baseTabs = [
  { id: 'home', label: 'Accueil', path: '/', icon: Home },
  { id: 'library', label: 'Bibliotheque', path: '/library', icon: Library },
  { id: 'search', label: 'Recherche', path: '/search', icon: Search },
  { id: 'social', label: 'Communaute', path: '/social', icon: Users },
];

export default function MobileTabBar({ user }: MobileTabBarProps) {
  const location = useLocation();
  const profilePath = user ? '/profile' : '/login';

  const tabs = [
    ...baseTabs,
    { id: 'profile', label: 'Profil', path: profilePath, icon: User },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    if (path === '/login') return location.pathname.startsWith('/login') || location.pathname.startsWith('/register');
    return location.pathname.startsWith(path);
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
      <div className="mx-auto max-w-md px-4 pb-3">
        <nav className="rounded-3xl border border-gray-light bg-white/90 backdrop-blur-xl shadow-elevated p-2">
          <ul className="grid grid-cols-5 gap-1">
            {tabs.map((tab) => {
              const active = isActive(tab.path);
              const Icon = tab.icon;
              return (
                <li key={tab.id}>
                  <Link
                    to={tab.path}
                    className={`flex flex-col items-center justify-center gap-1 rounded-2xl py-2 text-[11px] font-semibold transition-all ${
                      active
                        ? 'bg-forest text-white shadow-md shadow-forest/20'
                        : 'text-gray-500 hover:text-forest'
                    }`}
                    aria-label={tab.label}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="leading-none">{tab.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
