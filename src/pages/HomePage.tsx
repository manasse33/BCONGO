import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  BookOpen, 
  Globe, 
  MessageSquare, 
  Headphones,
  ArrowRight,
  Star,
  ChevronLeft,
  ChevronRight,
  Play,
  TrendingUp,
  Users,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { books, authors, challenges } from '@/data/mockData';
import type { Book, User, ReadingChallenge } from '@/types';

interface HomePageProps {
  user: User | null;
}

// African Pattern SVG Component
const AfricanPattern = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 200 400" 
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g opacity="0.15">
      <ellipse cx="100" cy="50" rx="30" ry="20" stroke="#1B5E45" strokeWidth="3" fill="none"/>
      <circle cx="100" cy="50" r="10" fill="#1B5E45"/>
      <ellipse cx="100" cy="100" rx="30" ry="20" stroke="#E8A838" strokeWidth="3" fill="none"/>
      <circle cx="100" cy="100" r="10" fill="#E8A838"/>
      <path d="M40 150 L70 180 L100 150 L130 180 L160 150" stroke="#1B5E45" strokeWidth="3" fill="none"/>
      <path d="M40 180 L70 210 L100 180 L130 210 L160 180" stroke="#E8A838" strokeWidth="3" fill="none"/>
      <circle cx="60" cy="250" r="25" stroke="#1B5E45" strokeWidth="2" fill="none"/>
      <circle cx="60" cy="250" r="15" stroke="#E8A838" strokeWidth="2" fill="none"/>
      <circle cx="60" cy="250" r="5" fill="#1B5E45"/>
      <circle cx="140" cy="250" r="25" stroke="#E8A838" strokeWidth="2" fill="none"/>
      <circle cx="140" cy="250" r="15" stroke="#1B5E45" strokeWidth="2" fill="none"/>
      <circle cx="140" cy="250" r="5" fill="#E8A838"/>
      <path d="M70 320 Q80 300 90 320 Q100 340 110 320 Q120 300 130 320" stroke="#1B5E45" strokeWidth="3" fill="none"/>
      <ellipse cx="100" cy="350" rx="20" ry="30" stroke="#E8A838" strokeWidth="2" fill="none"/>
      <circle cx="50" cy="30" r="4" fill="#E8A838"/>
      <circle cx="150" cy="30" r="4" fill="#1B5E45"/>
      <circle cx="50" cy="380" r="4" fill="#1B5E45"/>
      <circle cx="150" cy="380" r="4" fill="#E8A838"/>
    </g>
  </svg>
);

// Category Card Component
const CategoryCard = ({ icon: Icon, title, href, delay }: { icon: any; title: string; href: string; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
  >
    <Link
      to={href}
      className="group flex flex-col items-center p-8 bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-100 hover:border-gold/50 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 ease-out relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-forest/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="w-20 h-20 bg-forest/5 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-forest group-hover:scale-110 transition-all duration-500 z-10">
        <Icon className="w-10 h-10 text-forest group-hover:text-white transition-colors duration-500" />
      </div>
      <h3 className="font-serif text-lg font-bold text-gray-800 mb-4 text-center z-10">{title}</h3>
      <Button 
        variant="outline" 
        size="sm"
        className="border-forest/20 text-forest hover:bg-forest hover:text-white rounded-full px-6 z-10 transition-colors duration-300"
      >
        Explorer
      </Button>
    </Link>
  </motion.div>
);

// Book Card Component
const BookCard = ({ book, index }: { book: Book; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="group h-full"
  >
    <div className="flex flex-col h-full bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-forest/10 transition-all duration-500 hover:-translate-y-2">
      <div className="relative overflow-hidden aspect-[2/3]">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
        <img
          src={book.cover_image}
          alt={book.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        {book.is_featured && (
          <Badge className="absolute top-3 right-3 bg-gold/90 backdrop-blur-md text-gray-900 border-none font-semibold shadow-lg z-20">
            En Vedette
          </Badge>
        )}
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-serif font-bold text-gray-900 line-clamp-2 mb-1 group-hover:text-forest transition-colors">
          {book.title}
        </h3>
        <p className="text-sm text-gray-500 mb-3">{book.author_name}</p>
        <div className="flex items-center gap-1.5 mb-5 mt-auto">
          <Star className="w-4 h-4 text-gold fill-gold" />
          <span className="text-sm font-bold text-gray-700">{book.avg_rating}</span>
          <span className="text-xs text-gray-400">({book.ratings_count} avis)</span>
        </div>
        <div className="flex gap-2 mt-auto">
          <Button 
            size="sm" 
            className="flex-1 bg-forest hover:bg-forest-dark text-white rounded-xl shadow-md shadow-forest/20 transition-all hover:shadow-lg hover:shadow-forest/40"
          >
            Obtenir
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            className="flex-1 border-forest/20 text-forest hover:bg-forest hover:text-white rounded-xl transition-colors"
            asChild
          >
            <Link to={`/book/${book.slug}`}>Lire</Link>
          </Button>
        </div>
      </div>
    </div>
  </motion.div>
);

// Author Card Component
const AuthorCard = ({ author, index }: { author: User; index: number }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.15 }}
    className="group flex items-center gap-5 bg-white rounded-2xl p-5 border border-gray-100 hover:border-gold/30 hover:shadow-xl hover:shadow-gold/5 transition-all duration-300"
  >
    <div className="relative">
      <div className="absolute inset-0 bg-gold rounded-full scale-110 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
      <img
        src={author.avatar}
        alt={`${author.first_name} ${author.last_name}`}
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-gold/50 shadow-sm relative z-10"
      />
    </div>
    <div className="flex-1">
      <h3 className="font-serif text-lg font-bold text-gray-900 group-hover:text-forest transition-colors">
        {author.first_name} {author.last_name}
      </h3>
      <p className="text-sm text-gray-500 line-clamp-2 mt-1">{author.bio}</p>
    </div>
    <Button 
      size="icon" 
      variant="ghost"
      className="hidden sm:flex text-forest hover:bg-forest hover:text-white rounded-full h-10 w-10 transition-colors"
    >
      <ArrowRight className="w-5 h-5" />
    </Button>
  </motion.div>
);

// Challenge Banner Component
const ChallengeBanner = ({ challenge }: { challenge: ReadingChallenge }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="relative bg-gradient-to-br from-gold via-yellow-400 to-yellow-500 rounded-3xl p-8 lg:p-10 overflow-hidden shadow-2xl shadow-gold/20 group"
  >
    {/* Decorative background elements */}
    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/20 rounded-full blur-2xl transform group-hover:scale-150 transition-transform duration-700" />
    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-forest/10 rounded-full blur-xl transform group-hover:scale-150 transition-transform duration-700" />
    
    <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
      <div className="flex items-center gap-5">
        <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
          <Play className="w-7 h-7 text-forest ml-1" />
        </div>
        <div>
          <Badge className="bg-white/20 text-gray-900 border-none mb-2 font-medium backdrop-blur-md">Défi du mois</Badge>
          <h3 className="font-serif text-2xl font-bold text-gray-900 leading-tight">
            {challenge.title}
          </h3>
          <p className="text-gray-900/80 font-medium mt-1">
            🔥 {challenge.participants_count} participants inscrits
          </p>
        </div>
      </div>
      <Button 
        className="w-full sm:w-auto bg-gray-900 hover:bg-forest text-white rounded-xl px-8 py-6 text-md font-semibold shadow-xl transition-all hover:scale-105"
        asChild
      >
        <Link to="/social">Rejoindre le défi</Link>
      </Button>
    </div>
  </motion.div>
);

// Stats Section Component
const StatsSection = () => {
  const stats = [
    { icon: BookOpen, value: '10,000+', label: 'Livres Disponibles' },
    { icon: Users, value: '5,000+', label: 'Lecteurs Actifs' },
    { icon: TrendingUp, value: '500+', label: 'Auteurs' },
    { icon: Award, value: '50+', label: 'Concours Organisés' },
  ];

  return (
    <section className="relative py-20 bg-forest overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <AfricanPattern className="w-full h-full object-cover" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center p-6 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors duration-300"
            >
              <div className="w-14 h-14 mx-auto bg-gold/10 rounded-full flex items-center justify-center mb-4">
                <stat.icon className="w-7 h-7 text-gold" />
              </div>
              <p className="font-serif text-3xl lg:text-5xl font-bold text-white mb-2 tracking-tight">
                {stat.value}
              </p>
              <p className="text-white/70 font-medium text-sm uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function HomePage({ user }: HomePageProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [trendingAuthors, setTrendingAuthors] = useState<User[]>([]);
  const [activeChallenge, setActiveChallenge] = useState<ReadingChallenge | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFeaturedBooks(books.filter(b => b.is_featured).slice(0, 4));
    setTrendingAuthors(authors.slice(0, 2));
    setActiveChallenge(challenges[0]);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const scrollBooks = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth > 768 ? 600 : 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const categories = [
    { icon: BookOpen, title: 'Livres Scolaires', href: '/school' },
    { icon: Globe, title: 'Romans Africains', href: '/library?genre=roman-africain' },
    { icon: MessageSquare, title: 'Bandes Dessinées', href: '/library?genre=bande-dessinee' },
    { icon: Headphones, title: 'Livres Audio', href: '/audiobooks' },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 selection:bg-forest selection:text-white">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-cream to-gray-50/50 pt-20 pb-16">
        {/* Decorative Blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gold/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-forest/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
        
        <div className="absolute left-0 top-0 bottom-0 w-32 lg:w-48 hidden lg:block opacity-60">
          <AfricanPattern className="h-full w-full" />
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-32 lg:w-48 hidden lg:block transform rotate-180 opacity-60">
          <AfricanPattern className="h-full w-full" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Badge className="bg-forest/10 text-forest border-none mb-6 px-4 py-1.5 text-sm font-medium">
              ✨ La 1ère bibliothèque numérique du Congo
            </Badge>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-[1.1] tracking-tight">
              Votre Passerelle vers <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest to-green-600">le Savoir</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Explorez un monde d'histoires, de connaissances et d'idées. 
              Accédez à des milliers de ressources éducatives et culturelles.
            </p>

            {/* Search Bar - Modernized with Glassmorphism */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-10 relative group">
              <div className="absolute inset-0 bg-gold/20 rounded-full blur-xl transition-all duration-300 group-hover:bg-gold/30" />
              <div className="relative flex items-center bg-white/90 backdrop-blur-md border border-gray-200 rounded-full p-2 shadow-xl focus-within:ring-2 focus-within:ring-forest/50 transition-all">
                <Search className="w-6 h-6 text-gray-400 ml-4 hidden sm:block" />
                <input
                  type="text"
                  placeholder="Rechercher des livres, auteurs, genres..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 sm:px-6 py-3 bg-transparent text-gray-900 text-lg focus:outline-none placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  className="bg-forest hover:bg-forest-dark text-white p-3 sm:px-8 sm:py-3 rounded-full transition-colors flex items-center justify-center gap-2"
                >
                  <span className="hidden sm:inline font-medium">Rechercher</span>
                  {/* Keep the original SVG but used as a filter/menu icon fallback if you intended, or just an arrow for submit */}
                  <svg className="w-5 h-5 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex justify-center"
            >
              <Button
                size="lg"
                className="bg-gold hover:bg-yellow-500 text-gray-900 font-bold px-8 py-6 rounded-2xl text-lg shadow-lg shadow-gold/30 transition-all hover:scale-105"
                asChild
              >
                <Link to="/library">
                  Découvrir le catalogue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2"
        >
          <span className="text-xs text-gray-400 font-medium uppercase tracking-widest">Défiler</span>
          <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 bg-forest rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Categories Section */}
      <section className="py-20 relative z-20 -mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {categories.map((category, index) => (
              <CategoryCard
                key={category.title}
                icon={category.icon}
                title={category.title}
                href={category.href}
                delay={index * 0.1}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                Livres en Vedette
              </h2>
              <p className="text-gray-500">Sélectionnés avec soin pour votre plaisir de lecture.</p>
            </motion.div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => scrollBooks('left')}
                className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-forest hover:text-white hover:border-forest transition-all shadow-sm hover:shadow-md"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => scrollBooks('right')}
                className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-forest hover:text-white hover:border-forest transition-all shadow-sm hover:shadow-md"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
            
            <div
              ref={scrollRef}
              className="flex gap-6 lg:gap-8 overflow-x-auto scrollbar-hide pb-10 pt-4 -mx-4 px-4 snap-x"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {featuredBooks.map((book, index) => (
                <div key={book.id} className="flex-shrink-0 w-64 sm:w-72 snap-start">
                  <BookCard book={book} index={index} />
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-4">
            <Button
              variant="outline"
              size="lg"
              className="border-gray-300 text-gray-700 hover:bg-forest hover:border-forest hover:text-white rounded-xl px-8 transition-colors duration-300"
              asChild
            >
              <Link to="/library">Voir Tout le Catalogue</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trending Authors & Challenge Section */}
      <section className="py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Authors */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="mb-10"
              >
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  Auteurs en Tendance
                </h2>
                <p className="text-gray-500">Découvrez les créateurs qui passionnent nos lecteurs.</p>
              </motion.div>
              <div className="space-y-4">
                {trendingAuthors.map((author, index) => (
                  <AuthorCard key={author.id} author={author} index={index} />
                ))}
              </div>
            </div>

            {/* Challenge */}
            <div className="flex flex-col justify-center">
              <motion.h2
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-10 hidden lg:block"
              >
                Prêt pour un défi ?
              </motion.h2>
              {activeChallenge && <ChallengeBanner challenge={activeChallenge} />}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* CTA Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-forest rounded-[2.5rem] p-10 lg:p-20 text-center relative overflow-hidden shadow-2xl shadow-forest/20"
          >
            {/* Rich Background Pattern */}
            <div className="absolute inset-0 opacity-10 mix-blend-overlay">
              <AfricanPattern className="w-full h-full object-cover" />
            </div>
            
            {/* Glowing orbs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <Badge className="bg-white/10 text-gold border-gold/20 mb-6 px-4 py-1.5 backdrop-blur-md">Publication Indépendante</Badge>
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
                Devenez Auteur
              </h2>
              <p className="text-white/80 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                Partagez vos histoires avec le monde. Publiez vos livres, poèmes et nouvelles 
                sur la première plateforme d'édition numérique du Congo.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gold hover:bg-yellow-500 text-gray-900 font-bold px-10 py-6 rounded-xl text-lg shadow-xl shadow-gold/20 transition-all hover:scale-105"
                  asChild
                >
                  <Link to={user ? "/author/dashboard" : "/register"}>
                    Commencer à Écrire
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-2 border-white/30 text-white hover:bg-white hover:text-forest rounded-xl px-10 py-6 text-lg transition-all"
                  asChild
                >
                  <Link to="/contests">Voir les Concours</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}