import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Search, 
  BookOpen, 
  User, 
  Bell, 
  LogOut,
  ChevronDown,
  Library,
  Headphones,
  Users,
  Trophy,
  Home
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-cream/95 backdrop-blur-md shadow-light'
          : 'bg-cream'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 bg-forest rounded-full flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-serif text-xl font-bold text-forest hidden sm:block">
              BiblioCongo
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                  isActive(link.path)
                    ? 'text-forest bg-forest/10'
                    : 'text-gray-dark hover:text-forest hover:bg-forest/5'
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gold rounded-full"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center flex-1 max-w-md mx-4 lg:mx-8"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-medium" />
              <input
                type="text"
                placeholder="Rechercher des livres, auteurs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-light rounded-full text-sm focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20 transition-all"
              />
            </div>
          </form>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search Button - Mobile */}
            <button
              onClick={() => navigate('/search')}
              className="md:hidden p-2 text-gray-dark hover:text-forest transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {user ? (
              <>
                {/* Notifications */}
                <button className="relative p-2 text-gray-dark hover:text-forest transition-colors hidden sm:block">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-gold rounded-full" />
                </button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 p-1 rounded-full hover:bg-forest/5 transition-colors">
                      <Avatar className="w-8 h-8 border-2 border-gold">
                        <AvatarImage src={user.avatar} alt={user.first_name} />
                        <AvatarFallback className="bg-forest text-white text-sm">
                          {user.first_name?.[0]}{user.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className="w-4 h-4 text-gray-medium hidden sm:block" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-3 py-2 border-b border-gray-light">
                      <p className="font-medium text-sm">{user.first_name} {user.last_name}</p>
                      <p className="text-xs text-gray-medium">@{user.username}</p>
                    </div>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="w-4 h-4 mr-2" />
                        Mon Profil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/library" className="cursor-pointer">
                        <Library className="w-4 h-4 mr-2" />
                        Ma Bibliothèque
                      </Link>
                    </DropdownMenuItem>
                    {user.role_id === 2 && (
                      <DropdownMenuItem asChild>
                        <Link to="/author/dashboard" className="cursor-pointer">
                          <BookOpen className="w-4 h-4 mr-2" />
                          Espace Auteur
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-red-brick">
                      <LogOut className="w-4 h-4 mr-2" />
                      Déconnexion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="hidden sm:flex text-forest hover:text-forest hover:bg-forest/10"
                >
                  Connexion
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('/register')}
                  className="bg-forest hover:bg-forest-dark text-white"
                >
                  S'inscrire
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-dark hover:text-forest transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-light"
          >
            <div className="px-4 py-4 space-y-2">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-medium" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-light rounded-lg text-sm focus:outline-none focus:border-forest"
                  />
                </div>
              </form>

              {/* Mobile Nav Links */}
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(link.path)
                      ? 'bg-forest/10 text-forest'
                      : 'text-gray-dark hover:bg-gray-50'
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              ))}

              {!user && (
                <div className="pt-4 border-t border-gray-light space-y-2">
                  <Button
                    variant="outline"
                    className="w-full border-forest text-forest"
                    onClick={() => {
                      navigate('/login');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Connexion
                  </Button>
                  <Button
                    className="w-full bg-forest hover:bg-forest-dark text-white"
                    onClick={() => {
                      navigate('/register');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    S'inscrire
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
