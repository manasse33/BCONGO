import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Star, 
  Download, 
  BookOpen,
  ChevronDown,
  X,
  Grid3X3,
  List
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

// Languages and formats available for future filter implementation
// const languages = [
//   { value: 'fr', label: 'Français' },
//   { value: 'ln', label: 'Lingala' },
//   { value: 'kg', label: 'Kikongo' },
//   { value: 'en', label: 'Anglais' },
// ];

// const formats = [
//   { value: 'pdf', label: 'PDF' },
//   { value: 'epub', label: 'EPUB' },
//   { value: 'audio', label: 'Audio' },
// ];

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

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author_name.toLowerCase().includes(query)
      );
    }

    // Genre filter
    if (filters.genres.length > 0) {
      // In real app, would filter by book genres relation
      result = result.filter(() => Math.random() > 0.3);
    }

    // Type filter
    if (filters.types.length > 0) {
      result = result.filter(book => filters.types.includes(book.type));
    }

    // Rating filter
    if (filters.rating) {
      result = result.filter(book => book.avg_rating >= filters.rating!);
    }

    // Free filter
    if (filters.isFree !== null) {
      result = result.filter(book => book.is_free === filters.isFree);
    }

    // Sort
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
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-white border-b border-gray-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-serif text-3xl lg:text-4xl font-bold text-gray-dark mb-2">
              Bibliothèque Numérique
            </h1>
            <p className="text-gray-medium">
              Découvrez notre collection de {books.length}+ livres numériques
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-dark">Filtres</h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-forest hover:underline"
                  >
                    Réinitialiser
                  </button>
                )}
              </div>

              {/* Genres */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-dark mb-3">Genres</h4>
                <div className="space-y-2">
                  {genres.slice(0, 8).map(genre => (
                    <label key={genre.id} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={filters.genres.includes(genre.slug)}
                        onCheckedChange={() => toggleFilter('genres', genre.slug)}
                      />
                      <span className="text-sm text-gray-medium">{genre.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Types */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-dark mb-3">Types</h4>
                <div className="space-y-2">
                  {bookTypes.map(type => (
                    <label key={type.value} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={filters.types.includes(type.value)}
                        onCheckedChange={() => toggleFilter('types', type.value)}
                      />
                      <span className="text-sm text-gray-medium">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-dark mb-3">Note minimale</h4>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map(rating => (
                    <label key={rating} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        checked={filters.rating === rating}
                        onChange={() => setFilters(prev => ({ ...prev, rating }))}
                        className="text-forest focus:ring-forest"
                      />
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < rating ? 'text-gold fill-gold' : 'text-gray-light'}`}
                          />
                        ))}
                        <span className="text-sm text-gray-medium ml-1">et plus</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-dark mb-3">Prix</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      checked={filters.isFree === true}
                      onChange={() => setFilters(prev => ({ ...prev, isFree: true }))}
                      className="text-forest focus:ring-forest"
                    />
                    <span className="text-sm text-gray-medium">Gratuit</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      checked={filters.isFree === false}
                      onChange={() => setFilters(prev => ({ ...prev, isFree: false }))}
                      className="text-forest focus:ring-forest"
                    />
                    <span className="text-sm text-gray-medium">Payant</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              {/* Search */}
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-medium" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-light rounded-lg text-sm focus:outline-none focus:border-forest"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* Mobile Filter Button */}
                <Button
                  variant="outline"
                  className="lg:hidden flex items-center gap-2"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  <Filter className="w-4 h-4" />
                  Filtres
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>

                {/* Sort */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="appearance-none bg-white border border-gray-light rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:border-forest"
                  >
                    <option value="popular">Plus populaires</option>
                    <option value="newest">Plus récents</option>
                    <option value="rating">Mieux notés</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-medium pointer-events-none" />
                </div>

                {/* View Mode */}
                <div className="flex items-center border border-gray-light rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-forest text-white' : 'bg-white text-gray-medium'}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-forest text-white' : 'bg-white text-gray-medium'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Filters */}
            {isFilterOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="lg:hidden bg-white rounded-xl p-4 mb-6 border border-gray-light"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Filtres</h3>
                  <button onClick={() => setIsFilterOpen(false)}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {/* Mobile filter content - simplified */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Types</h4>
                    <div className="flex flex-wrap gap-2">
                      {bookTypes.map(type => (
                        <button
                          key={type.value}
                          onClick={() => toggleFilter('types', type.value)}
                          className={`px-3 py-1 rounded-full text-sm ${
                            filters.types.includes(type.value)
                              ? 'bg-forest text-white'
                              : 'bg-gray-100 text-gray-medium'
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Results Count */}
            <p className="text-sm text-gray-medium mb-4">
              Affichage de {filteredBooks.length} livre{filteredBooks.length !== 1 ? 's' : ''}
            </p>

            {/* Books Grid/List */}
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
            }>
              {filteredBooks.map((book, index) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
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
              <div className="text-center py-16">
                <BookOpen className="w-16 h-16 text-gray-light mx-auto mb-4" />
                <h3 className="font-serif text-xl font-semibold text-gray-dark mb-2">
                  Aucun livre trouvé
                </h3>
                <p className="text-gray-medium mb-4">
                  Essayez de modifier vos filtres ou votre recherche
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Book Grid Card
function BookGridCard({ book }: { book: Book }) {
  return (
    <div className="group bg-white rounded-xl border border-gray-light overflow-hidden hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
      <div className="relative">
        <img
          src={book.cover_image}
          alt={book.title}
          className="w-full aspect-[2/3] object-cover"
        />
        {book.is_free && (
          <Badge className="absolute top-2 left-2 bg-forest text-white">
            Gratuit
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
            <Download className="w-4 h-4 mr-1" />
            Télécharger
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            className="flex-1 border-forest text-forest hover:bg-forest hover:text-white"
            asChild
          >
            <Link to={`/book/${book.slug}`}>
              <BookOpen className="w-4 h-4 mr-1" />
              Lire
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

// Book List Card
function BookListCard({ book }: { book: Book }) {
  return (
    <div className="group flex gap-4 bg-white rounded-xl border border-gray-light p-4 hover:shadow-medium transition-all">
      <img
        src={book.cover_image}
        alt={book.title}
        className="w-24 h-36 object-cover rounded-lg flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-serif font-semibold text-gray-dark line-clamp-1">
              {book.title}
            </h3>
            <p className="text-sm text-gray-medium">{book.author_name}</p>
          </div>
          {book.is_free && (
            <Badge className="bg-forest text-white flex-shrink-0">Gratuit</Badge>
          )}
        </div>
        <p className="text-sm text-gray-medium line-clamp-2 mt-2">
          {book.description}
        </p>
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-gold fill-gold" />
            <span className="text-sm font-medium">{book.avg_rating}</span>
          </div>
          <span className="text-sm text-gray-medium">{book.pages_count} pages</span>
          <span className="text-sm text-gray-medium">{book.read_count} lectures</span>
        </div>
        <div className="flex gap-2 mt-3">
          <Button size="sm" className="bg-forest hover:bg-forest-dark text-white">
            <Download className="w-4 h-4 mr-1" />
            Télécharger
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            className="border-forest text-forest hover:bg-forest hover:text-white"
            asChild
          >
            <Link to={`/book/${book.slug}`}>
              <BookOpen className="w-4 h-4 mr-1" />
              Lire
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
