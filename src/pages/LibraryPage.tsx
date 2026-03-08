import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Star, 
  Download, 
  BookOpen,
  ChevronDown,
  X,
  Grid3X3,
  List,
  SlidersHorizontal,
  Clock,
  BookMarked
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { books, genres } from '@/data/mockData';
import type { Book, BookType } from '@/types';

interface FilterState {
  genres: string[];
  types: BookType[];
  languages: string[];
  formats: string[];
  rating: number | null;
  isFree: boolean | null;
}

const bookTypes: { value: BookType; label: string }[] = [
  { value: 'livre', label: 'Livre' },
  { value: 'roman', label: 'Roman' },
  { value: 'bd', label: 'Bande Dessinée' },
  { value: 'jeunesse', label: 'Jeunesse' },
  { value: 'scolaire', label: 'Scolaire' },
  { value: 'universitaire', label: 'Universitaire' },
  { value: 'audio', label: 'Audio' },
  { value: 'poeme', label: 'Poésie' },
  { value: 'nouvelle', label: 'Nouvelle' },
];

export default function LibraryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'rating'>('popular');
  const [filters, setFilters] = useState<FilterState>({
    genres: [],
    types: [],
    languages: [],
    formats: [],
    rating: null,
    isFree: null,
  });

  // Get genre from URL params
  useEffect(() => {
    const genreParam = searchParams.get('genre');
    if (genreParam) {
      setFilters(prev => ({ ...prev, genres: [genreParam] }));
    }
  }, [searchParams]);

  // Filter and sort books
  const filteredBooks = useMemo(() => {
    let result = [...books];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author_name.toLowerCase().includes(query)
      );
    }

    if (filters.genres.length > 0) {
      result = result.filter(() => Math.random() > 0.3);
    }

    if (filters.types.length > 0) {
      result = result.filter(book => filters.types.includes(book.type));
    }

    if (filters.rating) {
      result = result.filter(book => book.avg_rating >= filters.rating!);
    }

    if (filters.isFree !== null) {
      result = result.filter(book => book.is_free === filters.isFree);
    }

    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'rating':
        result.sort((a, b) => b.avg_rating - a.avg_rating);
        break;
      case 'popular':
      default:
        result.sort((a, b) => b.read_count - a.read_count);
        break;
    }

    return result;
  }, [searchQuery, filters, sortBy]);

  const toggleFilter = (category: keyof FilterState, value: string) => {
    setFilters(prev => {
      const current = prev[category] as string[];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
  };

  const clearFilters = () => {
    setFilters({
      genres: [],
      types: [],
      languages: [],
      formats: [],
      rating: null,
      isFree: null,
    });
    setSearchParams({});
  };

  const activeFiltersCount = 
    filters.genres.length + 
    filters.types.length + 
    filters.languages.length + 
    filters.formats.length +
    (filters.rating ? 1 : 0) +
    (filters.isFree !== null ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header enrichi */}
      <div className="relative bg-white border-b border-gray-200 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-forest/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gold/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="bg-forest/10 text-forest border-none mb-4 font-medium px-4 py-1">Catalogue complet</Badge>
            <h1 className="font-serif text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Bibliothèque Numérique
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl">
              Découvrez notre vaste collection de <span className="font-semibold text-forest">{books.length}+</span> ressources éducatives, romans et documents académiques.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-28 bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
                  <SlidersHorizontal className="w-5 h-5 text-forest" />
                  <h3>Filtres</h3>
                </div>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors"
                  >
                    Effacer ({activeFiltersCount})
                  </button>
                )}
              </div>

              <div className="space-y-8 max-h-[calc(100vh-250px)] overflow-y-auto scrollbar-hide pr-2">
                {/* Genres */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Genres populaires</h4>
                  <div className="space-y-3">
                    {genres.slice(0, 8).map(genre => (
                      <label key={genre.id} className="flex items-center gap-3 cursor-pointer group">
                        <Checkbox
                          checked={filters.genres.includes(genre.slug)}
                          onCheckedChange={() => toggleFilter('genres', genre.slug)}
                          className="data-[state=checked]:bg-forest data-[state=checked]:border-forest"
                        />
                        <span className="text-sm text-gray-600 group-hover:text-forest transition-colors">{genre.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Types */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Catégories</h4>
                  <div className="flex flex-wrap gap-2">
                    {bookTypes.map(type => (
                      <button
                        key={type.value}
                        onClick={() => toggleFilter('types', type.value)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          filters.types.includes(type.value)
                            ? 'bg-forest text-white shadow-md shadow-forest/20'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Avis des lecteurs</h4>
                  <div className="space-y-3">
                    {[4, 3, 2, 1].map(rating => (
                      <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="rating"
                          checked={filters.rating === rating}
                          onChange={() => setFilters(prev => ({ ...prev, rating }))}
                          className="w-4 h-4 text-forest focus:ring-forest border-gray-300"
                        />
                        <div className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-lg group-hover:bg-gold/10 transition-colors">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < rating ? 'text-gold fill-gold' : 'text-gray-300'}`}
                            />
                          ))}
                          <span className="text-sm font-medium text-gray-600 ml-2">& plus</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Tarification</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${filters.isFree === true ? 'border-forest bg-forest/5' : 'border-gray-200 hover:border-forest/50'}`}>
                      <input
                        type="radio"
                        name="price"
                        checked={filters.isFree === true}
                        onChange={() => setFilters(prev => ({ ...prev, isFree: true }))}
                        className="sr-only"
                      />
                      <span className={`text-sm font-semibold ${filters.isFree === true ? 'text-forest' : 'text-gray-600'}`}>Gratuit</span>
                    </label>
                    <label className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${filters.isFree === false ? 'border-forest bg-forest/5' : 'border-gray-200 hover:border-forest/50'}`}>
                      <input
                        type="radio"
                        name="price"
                        checked={filters.isFree === false}
                        onChange={() => setFilters(prev => ({ ...prev, isFree: false }))}
                        className="sr-only"
                      />
                      <span className={`text-sm font-semibold ${filters.isFree === false ? 'text-forest' : 'text-gray-600'}`}>Premium</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar - Sticky on mobile for better UX */}
            <div className="sticky top-0 z-20 bg-gray-50/95 backdrop-blur-xl py-4 mb-6 border-b border-gray-200 lg:static lg:bg-transparent lg:border-none lg:py-0 lg:mb-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                
                {/* Search - Modernized */}
                <div className="relative w-full sm:max-w-md group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-gray-400 group-focus-within:text-forest transition-colors" />
                  </div>
                  <input
                    type="text"
                    placeholder="Chercher par titre, auteur..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all shadow-sm"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  {/* Mobile Filter Button */}
                  <Button
                    variant="outline"
                    className="lg:hidden flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl bg-white border-gray-200 hover:bg-gray-50"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                  >
                    <Filter className="w-4 h-4" />
                    <span>Filtres</span>
                    {activeFiltersCount > 0 && (
                      <Badge className="ml-1 bg-forest text-white border-none">{activeFiltersCount}</Badge>
                    )}
                  </Button>

                  {/* Sort Dropdown */}
                  <div className="relative flex-1 sm:flex-none">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest shadow-sm cursor-pointer"
                    >
                      <option value="popular">🔥 Plus populaires</option>
                      <option value="newest">✨ Plus récents</option>
                      <option value="rating">⭐ Mieux notés</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>

                  {/* View Mode Toggle - Desktop Only */}
                  <div className="hidden sm:flex items-center bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-forest/10 text-forest shadow-sm' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
                      aria-label="Vue grille"
                    >
                      <Grid3X3 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-forest/10 text-forest shadow-sm' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
                      aria-label="Vue liste"
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Filters Dropdown */}
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="lg:hidden bg-white rounded-2xl p-5 mb-6 border border-gray-200 shadow-lg overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900">Filtres Rapides</h3>
                    <button onClick={() => setIsFilterOpen(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                      <X className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  <div className="space-y-5">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-3">Catégories</h4>
                      <div className="flex flex-wrap gap-2">
                        {bookTypes.map(type => (
                          <button
                            key={type.value}
                            onClick={() => toggleFilter('types', type.value)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                              filters.types.includes(type.value)
                                ? 'bg-forest text-white'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {type.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Simplified mobile resets */}
                    <Button variant="outline" className="w-full rounded-xl border-gray-200" onClick={clearFilters}>
                      Réinitialiser tout
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                <span className="text-forest font-bold">{filteredBooks.length}</span> résultat{filteredBooks.length !== 1 ? 's' : ''} trouvé{filteredBooks.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Books Grid/List */}
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'
              : 'flex flex-col gap-4'
            }>
              {filteredBooks.map((book, index) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="h-full"
                >
                  {viewMode === 'grid' ? (
                    <BookGridCard book={book} />
                  ) : (
                    <BookListCard book={book} />
                  )}
                </motion.div>
              ))}
            </div>

            {/* Empty State */}
            {filteredBooks.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 bg-white rounded-3xl border border-gray-200 shadow-sm mt-6"
              >
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookMarked className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-gray-900 mb-3">
                  Aucun ouvrage trouvé
                </h3>
                <p className="text-gray-500 max-w-md mx-auto mb-8">
                  Nous n'avons trouvé aucun livre correspondant à vos critères actuels. Essayez de retirer quelques filtres ou de modifier votre recherche.
                </p>
                <Button 
                  onClick={clearFilters} 
                  className="bg-forest hover:bg-forest-dark text-white rounded-xl px-8 py-6 text-md font-medium shadow-lg shadow-forest/20"
                >
                  Réinitialiser les filtres
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Composants Isolés et Améliorés
function BookGridCard({ book }: { book: Book }) {
  return (
    <div className="group flex flex-col h-full bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-forest/5 transition-all duration-300 hover:-translate-y-1">
      <div className="relative aspect-[2/3] overflow-hidden bg-gray-100">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
        <img
          src={book.cover_image}
          alt={book.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        {book.is_free && (
          <Badge className="absolute top-3 left-3 bg-forest/90 backdrop-blur-md text-white border-none shadow-md z-20">
            Gratuit
          </Badge>
        )}
      </div>
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <h3 className="font-serif font-bold text-gray-900 line-clamp-2 mb-1 group-hover:text-forest transition-colors">
          {book.title}
        </h3>
        <p className="text-sm font-medium text-gray-500 mb-3 line-clamp-1">{book.author_name}</p>
        
        <div className="flex items-center justify-between mt-auto mb-4">
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-gold fill-gold" />
            <span className="text-sm font-bold text-gray-700">{book.avg_rating}</span>
            <span className="text-xs text-gray-400">({book.ratings_count})</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            size="sm" 
            className="flex-1 bg-gray-900 hover:bg-forest text-white rounded-xl transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Obtenir</span>
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            className="flex-1 border-gray-200 text-gray-700 hover:bg-forest hover:border-forest hover:text-white rounded-xl transition-all"
            asChild
          >
            <Link to={`/book/${book.slug}`} className="flex items-center justify-center">
              <BookOpen className="w-4 h-4 mr-2" />
              <span>Lire</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function BookListCard({ book }: { book: Book }) {
  return (
    <div className="group flex flex-col sm:flex-row gap-4 sm:gap-6 bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-xl hover:shadow-forest/5 transition-all duration-300">
      <div className="relative w-full sm:w-32 h-48 sm:h-auto flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
        <img
          src={book.cover_image}
          alt={book.title}
          className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {book.is_free && (
          <Badge className="absolute top-2 left-2 bg-forest/90 backdrop-blur-md text-white border-none text-xs sm:hidden">
            Gratuit
          </Badge>
        )}
      </div>
      
      <div className="flex-1 min-w-0 flex flex-col py-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-forest transition-colors">
              {book.title}
            </h3>
            <p className="text-sm font-medium text-gray-500 mt-1">{book.author_name}</p>
          </div>
          {book.is_free && (
            <Badge className="hidden sm:flex bg-forest/10 text-forest border-none px-3 py-1">Gratuit</Badge>
          )}
        </div>
        
        <p className="text-sm text-gray-600 line-clamp-2 sm:line-clamp-3 mt-3 leading-relaxed">
          {book.description || "Aucune description disponible pour cet ouvrage. Plongez-vous dans sa lecture pour en découvrir les secrets."}
        </p>
        
        <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-gray-50">
          <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg">
            <Star className="w-4 h-4 text-gold fill-gold" />
            <span className="text-sm font-bold text-gray-700">{book.avg_rating}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500 text-sm">
            <BookOpen className="w-4 h-4" />
            <span>{book.pages_count} pages</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500 text-sm">
            <Clock className="w-4 h-4" />
            <span>{book.read_count} lectures</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-4 sm:mt-auto pt-2">
          <Button size="sm" className="bg-gray-900 hover:bg-forest text-white rounded-xl px-5">
            <Download className="w-4 h-4 mr-2" />
            Télécharger
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            className="border-gray-200 text-gray-700 hover:bg-forest hover:border-forest hover:text-white rounded-xl px-5"
            asChild
          >
            <Link to={`/book/${book.slug}`}>
              Lire les détails
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}