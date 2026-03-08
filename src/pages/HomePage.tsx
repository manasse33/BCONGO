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

// Animation variants (available for future use)
// const fadeInUp = {
//   initial: { opacity: 0, y: 30 },
//   animate: { opacity: 1, y: 0 },
//   transition: { duration: 0.6, ease: 'easeOut' }
// };

// const staggerContainer = {
//   animate: {
//     transition: {
//       staggerChildren: 0.1
//     }
//   }
// };

// African Pattern SVG Component
const AfricanPattern = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 200 400" 
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Geometric African-inspired patterns */}
    <g opacity="0.15">
      {/* Eyes pattern */}
      <ellipse cx="100" cy="50" rx="30" ry="20" stroke="#1B5E45" strokeWidth="3" fill="none"/>
      <circle cx="100" cy="50" r="10" fill="#1B5E45"/>
      <ellipse cx="100" cy="100" rx="30" ry="20" stroke="#E8A838" strokeWidth="3" fill="none"/>
      <circle cx="100" cy="100" r="10" fill="#E8A838"/>
      
      {/* Zigzag pattern */}
      <path d="M40 150 L70 180 L100 150 L130 180 L160 150" stroke="#1B5E45" strokeWidth="3" fill="none"/>
      <path d="M40 180 L70 210 L100 180 L130 210 L160 180" stroke="#E8A838" strokeWidth="3" fill="none"/>
      
      {/* Circles pattern */}
      <circle cx="60" cy="250" r="25" stroke="#1B5E45" strokeWidth="2" fill="none"/>
      <circle cx="60" cy="250" r="15" stroke="#E8A838" strokeWidth="2" fill="none"/>
      <circle cx="60" cy="250" r="5" fill="#1B5E45"/>
      
      <circle cx="140" cy="250" r="25" stroke="#E8A838" strokeWidth="2" fill="none"/>
      <circle cx="140" cy="250" r="15" stroke="#1B5E45" strokeWidth="2" fill="none"/>
      <circle cx="140" cy="250" r="5" fill="#E8A838"/>
      
      {/* Hand pattern */}
      <path d="M70 320 Q80 300 90 320 Q100 340 110 320 Q120 300 130 320" stroke="#1B5E45" strokeWidth="3" fill="none"/>
      <ellipse cx="100" cy="350" rx="20" ry="30" stroke="#E8A838" strokeWidth="2" fill="none"/>
      
      {/* Decorative dots */}
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
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <Link
      to={href}
      className="group flex flex-col items-center p-6 bg-white rounded-2xl border border-gray-light hover:border-gold hover:shadow-medium transition-all duration-300"
    >
      <div className="w-20 h-20 bg-forest/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-forest/20 transition-colors">
        <Icon className="w-10 h-10 text-forest" />
      </div>
      <h3 className="font-serif text-lg font-semibold text-gray-dark mb-3">{title}</h3>
      <Button 
        variant="outline" 
        size="sm"
        className="border-forest text-forest hover:bg-forest hover:text-white"
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
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="group"
  >
    <div className="bg-white rounded-xl border border-gray-light overflow-hidden hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
      <div className="relative">
        <img
          src={book.cover_image}
          alt={book.title}
          className="w-full aspect-[2/3] object-cover"
        />
        {book.is_featured && (
          <Badge className="absolute top-2 right-2 bg-gold text-gray-dark">
            En Vedette
          </Badge>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-serif font-semibold text-gray-dark line-clamp-2 mb-1">
          {book.title}
        </h3>
        <p className="text-sm text-gray-medium mb-2">{book.author_name}</p>
        <div className="flex items-center gap-1 mb-3">
          <Star className="w-4 h-4 text-gold fill-gold" />
          <span className="text-sm font-medium">{book.avg_rating}</span>
          <span className="text-xs text-gray-medium">({book.ratings_count})</span>
        </div>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            className="flex-1 bg-forest hover:bg-forest-dark text-white"
          >
            Télécharger
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            className="flex-1 border-forest text-forest hover:bg-forest hover:text-white"
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
    initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: index * 0.15 }}
    className="flex items-center gap-4 bg-white rounded-xl p-4 border border-gray-light hover:border-gold hover:shadow-light transition-all"
  >
    <div className="relative">
      <img
        src={author.avatar}
        alt={`${author.first_name} ${author.last_name}`}
        className="w-16 h-16 rounded-full object-cover border-2 border-gold"
      />
    </div>
    <div className="flex-1">
      <h3 className="font-serif font-semibold text-gray-dark">
        {author.first_name} {author.last_name}
      </h3>
      <p className="text-sm text-gray-medium line-clamp-1">{author.bio}</p>
    </div>
    <Button 
      size="sm" 
      variant="outline"
      className="border-forest text-forest hover:bg-forest hover:text-white"
    >
      Lire la Suite
    </Button>
  </motion.div>
);

// Challenge Banner Component
const ChallengeBanner = ({ challenge }: { challenge: ReadingChallenge }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay: 0.3 }}
    className="bg-gradient-to-r from-gold to-gold-light rounded-2xl p-6 lg:p-8"
  >
    <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center flex-shrink-0">
          <Play className="w-6 h-6 text-forest ml-1" />
        </div>
        <div>
          <h3 className="font-serif text-xl font-bold text-gray-dark">
            {challenge.title}
          </h3>
          <p className="text-gray-dark/80">
            {challenge.participants_count} participants déjà inscrits
          </p>
        </div>
      </div>
      <Button 
        className="bg-forest hover:bg-forest-dark text-white px-8"
        asChild
      >
        <Link to="/social">Rejoindre Maintenant</Link>
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
    <section className="py-16 bg-forest">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <stat.icon className="w-8 h-8 text-gold mx-auto mb-3" />
              <p className="font-serif text-3xl lg:text-4xl font-bold text-white mb-1">
                {stat.value}
              </p>
              <p className="text-white/70 text-sm">{stat.label}</p>
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
    // Load mock data
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
      const scrollAmount = 300;
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-cream">
        {/* African Pattern Decorations */}
        <div className="absolute left-0 top-0 bottom-0 w-32 lg:w-48 hidden md:block">
          <AfricanPattern className="h-full w-full" />
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-32 lg:w-48 hidden md:block transform rotate-180">
          <AfricanPattern className="h-full w-full" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-forest mb-6 leading-tight">
              Votre Passerelle vers le Savoir
            </h1>
            <p className="text-lg sm:text-xl text-gray-medium mb-8 max-w-2xl mx-auto">
              Explorez un monde d'histoires, de connaissances et d'idées. 
              La première bibliothèque numérique de la République du Congo.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium" />
                <input
                  type="text"
                  placeholder="Rechercher des livres ou des auteurs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-light rounded-full text-base focus:outline-none focus:border-forest focus:ring-4 focus:ring-forest/10 transition-all shadow-light"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-medium" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </form>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button
                size="lg"
                className="bg-gold hover:bg-gold-dark text-gray-dark font-semibold px-8 py-6 text-lg"
                asChild
              >
                <Link to="/library">
                  Découvrir Maintenant
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
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-forest rounded-full flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-forest rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Categories Section */}
      <section className="py-16 lg:py-24">
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
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-serif text-3xl lg:text-4xl font-bold text-gray-dark">
                Livres en Vedette
              </h2>
            </motion.div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollBooks('left')}
                className="w-10 h-10 rounded-full border border-gray-light flex items-center justify-center hover:bg-forest hover:text-white hover:border-forest transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollBooks('right')}
                className="w-10 h-10 rounded-full border border-gray-light flex items-center justify-center hover:bg-forest hover:text-white hover:border-forest transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 snap-x"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {featuredBooks.map((book, index) => (
              <div key={book.id} className="flex-shrink-0 w-64 snap-start">
                <BookCard book={book} index={index} />
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button
              variant="outline"
              className="border-forest text-forest hover:bg-forest hover:text-white"
              asChild
            >
              <Link to="/library">Voir Tous les Livres</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trending Authors Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Authors */}
            <div>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="font-serif text-3xl lg:text-4xl font-bold text-gray-dark mb-8"
              >
                Auteurs en Tendance
              </motion.h2>
              <div className="space-y-4">
                {trendingAuthors.map((author, index) => (
                  <AuthorCard key={author.id} author={author} index={index} />
                ))}
              </div>
            </div>

            {/* Challenge */}
            <div>
              <motion.h2
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="font-serif text-3xl lg:text-4xl font-bold text-gray-dark mb-8"
              >
                Défi de Lecture
              </motion.h2>
              {activeChallenge && <ChallengeBanner challenge={activeChallenge} />}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-forest rounded-3xl p-8 lg:p-16 text-center relative overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <AfricanPattern className="w-full h-full" />
            </div>
            
            <div className="relative z-10">
              <h2 className="font-serif text-3xl lg:text-5xl font-bold text-white mb-6">
                Devenez Auteur
              </h2>
              <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
                Partagez vos histoires avec le monde. Publiez vos livres, poèmes et nouvelles 
                sur la première plateforme d'édition numérique du Congo.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-gold hover:bg-gold-dark text-gray-dark font-semibold px-8"
                  asChild
                >
                  <Link to={user ? "/author/dashboard" : "/register"}>
                    Commencer à Écrire
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-forest"
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
