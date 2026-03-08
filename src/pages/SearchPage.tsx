import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  BookOpen, 
  X,
  Clock,
  TrendingUp
} from 'lucide-react';
import { books, authors, genres } from '@/data/mockData';
// Type imports for reference
// import type { Book, User } from '@/types';

const recentSearches = [
  'Roman africain',
  'Poésie congolaise',
  'Histoire du Congo',
  'Mathématiques 3ème',
];

const trendingSearches = [
  'Le Cœur des Ténèbres',
  'Contes africains',
  'Littérature jeunesse',
  'Science',
];

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<{ books: typeof books; authors: typeof authors }>({ books: [], authors: [] });
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (query) {
      setIsSearching(true);
      // Simulate search
      const timeout = setTimeout(() => {
        const bookResults = books.filter(book =>
          book.title.toLowerCase().includes(query.toLowerCase()) ||
          book.author_name.toLowerCase().includes(query.toLowerCase())
        );
        const authorResults = authors.filter(author =>
          `${author.first_name} ${author.last_name}`.toLowerCase().includes(query.toLowerCase())
        );
        setResults({ books: bookResults, authors: authorResults });
        setIsSearching(false);
      }, 300);
      return () => clearTimeout(timeout);
    } else {
      setResults({ books: [], authors: [] });
    }
  }, [query]);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value) {
      setSearchParams({ q: value });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="font-serif text-3xl lg:text-4xl font-bold text-gray-dark mb-6">
            Recherche
          </h1>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium" />
            <input
              type="text"
              placeholder="Rechercher des livres, auteurs, genres..."
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-white border-2 border-gray-light rounded-xl text-lg focus:outline-none focus:border-forest transition-colors"
              autoFocus
            />
            {query && (
              <button
                onClick={() => handleSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-medium" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Results */}
        {query ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {isSearching ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest" />
              </div>
            ) : (
              <>
                {/* Books Results */}
                {results.books.length > 0 && (
                  <div className="mb-8">
                    <h2 className="font-serif text-xl font-bold text-gray-dark mb-4">
                      Livres ({results.books.length})
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {results.books.map((book) => (
                        <Link
                          key={book.id}
                          to={`/book/${book.slug}`}
                          className="group"
                        >
                          <div className="aspect-[2/3] rounded-lg overflow-hidden mb-2">
                            <img
                              src={book.cover_image}
                              alt={book.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <h3 className="font-medium text-gray-dark line-clamp-1 group-hover:text-forest transition-colors">
                            {book.title}
                          </h3>
                          <p className="text-sm text-gray-medium">{book.author_name}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Authors Results */}
                {results.authors.length > 0 && (
                  <div className="mb-8">
                    <h2 className="font-serif text-xl font-bold text-gray-dark mb-4">
                      Auteurs ({results.authors.length})
                    </h2>
                    <div className="space-y-3">
                      {results.authors.map((author) => (
                        <Link
                          key={author.id}
                          to={`/author/${author.username}`}
                          className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-light hover:border-forest transition-colors"
                        >
                          <img
                            src={author.avatar}
                            alt={`${author.first_name} ${author.last_name}`}
                            className="w-14 h-14 rounded-full object-cover"
                          />
                          <div>
                            <h3 className="font-medium text-gray-dark">
                              {author.first_name} {author.last_name}
                            </h3>
                            <p className="text-sm text-gray-medium">@{author.username}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {results.books.length === 0 && results.authors.length === 0 && (
                  <div className="text-center py-12">
                    <Search className="w-16 h-16 text-gray-light mx-auto mb-4" />
                    <h3 className="font-serif text-xl font-semibold text-gray-dark mb-2">
                      Aucun résultat trouvé
                    </h3>
                    <p className="text-gray-medium">
                      Essayez avec d'autres mots-clés
                    </p>
                  </div>
                )}
              </>
            )}
          </motion.div>
        ) : (
          /* Default Search Page */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Recent Searches */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-gray-medium" />
                <h2 className="font-semibold text-gray-dark">Recherches Récentes</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSearch(term)}
                    className="px-4 py-2 bg-white border border-gray-light rounded-full text-sm text-gray-dark hover:border-forest transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Trending Searches */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-gray-medium" />
                <h2 className="font-semibold text-gray-dark">Tendances</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSearch(term)}
                    className="px-4 py-2 bg-forest/10 border border-forest/20 rounded-full text-sm text-forest hover:bg-forest hover:text-white transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Browse by Genre */}
            <div>
              <h2 className="font-semibold text-gray-dark mb-4">Parcourir par Genre</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {genres.slice(0, 6).map((genre) => (
                  <Link
                    key={genre.id}
                    to={`/library?genre=${genre.slug}`}
                    className="p-4 bg-white rounded-xl border border-gray-light hover:border-forest hover:shadow-light transition-all"
                  >
                    <BookOpen className="w-6 h-6 text-forest mb-2" />
                    <p className="font-medium text-gray-dark">{genre.name}</p>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
