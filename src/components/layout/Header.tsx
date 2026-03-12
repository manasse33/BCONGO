import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Search, 
  User, 
  Bell, 
  LogOut,
  ChevronDown,
  Library,
  Headphones,
  Users,
  Trophy,
  Home,
  LayoutDashboard,
  Shield,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { User as UserType } from '@/types';
import logoImage from '@/assets/logo.png';
import { canAccessAdminSpace, canAccessAuthorSpace } from '@/lib/rbac';

interface HeaderProps {
  user: UserType | null;
  onLogout: () => void;
}

const navLinks = [
  { path: '/', label: 'Accueil', icon: Home },
  { path: '/library', label: 'Bibliothèque', icon: Library },
  { path: '/audiobooks', label: 'Audio', icon: Headphones },
  { path: '/social', label: 'Communauté', icon: Users },
  { path: '/contests', label: 'Concours', icon: Trophy },
];

export default function Header({ user, onLogout }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer le menu mobile lors d'un changement de route
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-100 py-1'
          : 'bg-gradient-to-b from-white/90 to-transparent backdrop-blur-sm border-b border-transparent py-2'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          
          {/* Logo (Image Only) */}
          <Link to="/" className="flex items-center flex-shrink-0 group">
            <img
              src={logoImage}
              alt="BiblioCongo Logo"
              className="h-10 sm:h-12 lg:h-14 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden xl:flex items-center gap-2 mx-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2.5 text-sm font-bold transition-colors rounded-full ${
                  isActive(link.path)
                    ? 'text-forest'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-gold rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Barre de recherche & Actions Right */}
          <div className="flex items-center justify-end flex-1 gap-2 sm:gap-4 lg:gap-6 min-w-0">
            
            {/* Search Bar - Desktop */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex items-center flex-1 max-w-[14rem] lg:max-w-xs xl:max-w-sm relative group"
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-gray-400 group-focus-within:text-forest transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 hover:border-gray-300 rounded-full text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-forest focus:ring-4 focus:ring-forest/10 transition-all duration-300"
              />
            </form>

            {/* Mobile Search Icon */}
            <button
              onClick={() => navigate('/search')}
              className="md:hidden p-2 text-gray-500 hover:text-forest hover:bg-gray-50 rounded-full transition-all"
              aria-label="Rechercher"
            >
              <Search className="w-5 h-5" />
            </button>

            {user ? (
              <div className="flex items-center gap-2 sm:gap-4">
                {/* Notifications */}
                <button
                  className="relative p-2 text-gray-500 hover:text-forest hover:bg-forest/5 rounded-full transition-all hidden sm:flex items-center justify-center"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full animate-pulse" />
                </button>

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-forest/20 transition-all group">
                      <Avatar className="w-9 h-9 border-2 border-transparent group-hover:border-gold transition-colors">
                        <AvatarImage src={user.avatar} alt={user.first_name} className="object-cover" />
                        <AvatarFallback className="bg-forest text-white text-sm font-bold">
                          {user.first_name?.[0]}{user.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-forest transition-colors hidden sm:block" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2 shadow-xl border-gray-100">
                    <div className="px-4 py-3 bg-gray-50 rounded-xl mb-2">
                      <p className="font-bold text-gray-900 line-clamp-1">{user.first_name} {user.last_name}</p>
                      <p className="text-xs font-medium text-gray-500 line-clamp-1">@{user.username}</p>
                    </div>
                    <DropdownMenuItem asChild className="rounded-lg cursor-pointer hover:bg-forest/5">
                      <Link to="/profile" className="flex items-center py-2.5">
                        <User className="w-4 h-4 mr-3 text-gray-400" />
                        <span className="font-medium text-gray-700">Mon Profil</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-lg cursor-pointer hover:bg-forest/5">
                      <Link to="/settings" className="flex items-center py-2.5">
                        <Settings className="w-4 h-4 mr-3 text-gray-400" />
                        <span className="font-medium text-gray-700">Parametres</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-lg cursor-pointer hover:bg-forest/5">
                      <Link to="/library" className="flex items-center py-2.5">
                        <Library className="w-4 h-4 mr-3 text-gray-400" />
                        <span className="font-medium text-gray-700">Ma Bibliothèque</span>
                      </Link>
                    </DropdownMenuItem>
                    {canAccessAuthorSpace(user) && (
                      <DropdownMenuItem asChild className="rounded-lg cursor-pointer hover:bg-gold/10 text-gold-dark mt-1">
                        <Link to="/author/dashboard" className="flex items-center py-2.5">
                          <LayoutDashboard className="w-4 h-4 mr-3 text-gold" />
                          <span className="font-bold">Espace Auteur</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {canAccessAdminSpace(user) && (
                      <DropdownMenuItem asChild className="rounded-lg cursor-pointer hover:bg-red-50 text-red-700 mt-1">
                        <Link to="/admin" className="flex items-center py-2.5">
                          <Shield className="w-4 h-4 mr-3 text-red-600" />
                          <span className="font-bold">Administration</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="my-2 bg-gray-100" />
                    <DropdownMenuItem 
                      onClick={onLogout} 
                      className="rounded-lg cursor-pointer hover:bg-red-50 text-red-600 focus:text-red-600 focus:bg-red-50"
                    >
                      <div className="flex items-center py-2.5">
                        <LogOut className="w-4 h-4 mr-3" />
                        <span className="font-bold">Déconnexion</span>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/login')}
                  className="hidden sm:flex text-gray-600 hover:text-forest hover:bg-forest/5 rounded-full font-bold px-5"
                >
                  Connexion
                </Button>
                <Button
                  onClick={() => navigate('/register')}
                  className="bg-forest hover:bg-forest-dark text-white rounded-full font-bold px-4 sm:px-6 shadow-md shadow-forest/20 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  S'inscrire
                </Button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 text-gray-600 hover:text-forest bg-gray-50 hover:bg-forest/10 rounded-full transition-all"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Full-Screen Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="xl:hidden fixed top-0 left-0 right-0 bottom-0 bg-white/95 backdrop-blur-xl z-40 pt-24 px-4 pb-10 overflow-y-auto"
          >
            <div className="flex flex-col h-full max-w-md mx-auto">
              
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mb-8 relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400 group-focus-within:text-forest" />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher dans le catalogue..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-lg text-gray-900 focus:outline-none focus:border-forest focus:bg-white transition-colors shadow-sm"
                />
              </form>

              {/* Mobile Nav Links */}
              <nav className="flex flex-col gap-2 flex-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${
                      isActive(link.path)
                        ? 'bg-forest text-white shadow-md shadow-forest/20'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-forest'
                    }`}
                  >
                    <link.icon className={`w-6 h-6 ${isActive(link.path) ? 'text-white' : 'text-gray-400'}`} />
                    <span className="font-bold text-lg">{link.label}</span>
                  </Link>
                ))}
              </nav>

              {/* Mobile Auth Actions */}
              {!user && (
                <div className="mt-auto pt-8 flex flex-col gap-3">
                  <Button
                    variant="outline"
                    className="w-full rounded-2xl py-6 text-lg border-gray-200 text-gray-700 font-bold"
                    onClick={() => navigate('/login')}
                  >
                    Se connecter
                  </Button>
                  <Button
                    className="w-full rounded-2xl py-6 text-lg bg-forest hover:bg-forest-dark text-white font-bold shadow-lg shadow-forest/20"
                    onClick={() => navigate('/register')}
                  >
                    Créer un compte
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
