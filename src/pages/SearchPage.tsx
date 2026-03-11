import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  BookOpen,
  X,
  Clock,
  TrendingUp,
} from 'lucide-react';
import type { Book, User, Genre, Publisher } from '@/types';
import { booksApi, genresApi, leaderboardApi, publishersApi, searchApi } from '@/services/api';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<{ books: Book[]; authors: User[] }>({ books: [], authors: [] });
  const [genres, setGenres] = useState<Genre[]>([]);
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [allAuthors, setAllAuthors] = useState<User[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingSearches, setTrendingSearches] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [genreData, publisherData, authorLeaderboard, trendingBooks] = await Promise.all([
          genresApi.getAll(),
          publishersApi.getAll(),
          leaderboardApi.getAuthors(),
          booksApi.getTrending(),
        ]);

        const mappedAuthors = authorLeaderboard
          .map((entry: any) => entry?.user)
          .filter((author: User | undefined): author is User => Boolean(author));

        setGenres(genreData);
        setPublishers(publisherData);
        setAllAuthors(mappedAuthors);
        setTrendingSearches(trendingBooks.map((book) => book.title).slice(0, 6));
      } catch (error) {
        setGenres([]);
        setPublishers([]);
        setAllAuthors([]);
        setTrendingSearches([]);
      }
    };

    const storedRecent = localStorage.getItem('recent_searches');
    if (storedRecent) {
      try {
        const parsedRecent = JSON.parse(storedRecent);
        if (Array.isArray(parsedRecent)) {
          setRecentSearches(parsedRecent.slice(0, 8));
        }
      } catch (error) {
        setRecentSearches([]);
      }
    }

    loadInitialData();
  }, []);

  useEffect(() => {
    const runSearch = async () => {
      if (!query) {
        setResults({ books: [], authors: [] });
        setSuggestions([]);
        return;
      }

      setIsSearching(true);
      try {
        const [books, suggestionData] = await Promise.all([
          searchApi.search(query),
          searchApi.getSuggestions(query),
        ]);
        const normalizedQuery = query.toLowerCase();
        const authorResults = allAuthors.filter((author) =>
          `${author.first_name} ${author.last_name}`.toLowerCase().includes(normalizedQuery) ||
          author.username.toLowerCase().includes(normalizedQuery)
        );
        setResults({ books, authors: authorResults });
        setSuggestions(suggestionData.slice(0, 6));
      } catch (error) {
        setResults({ books: [], authors: [] });
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    };

    runSearch();
  }, [query, allAuthors]);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value) {
      setSearchParams({ q: value });
      setRecentSearches((prev) => {
        const next = [value, ...prev.filter((item) => item !== value)].slice(0, 8);
        localStorage.setItem('recent_searches', JSON.stringify(next));
        return next;
      });
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
            {suggestions.length > 0 && (
              <div className="mb-6">
                <h2 className="font-semibold text-gray-dark mb-3">Suggestions</h2>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleSearch(term)}
                      className="px-3 py-1.5 rounded-full bg-white border border-gray-light text-sm text-gray-dark hover:border-forest"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

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
                      Aucun resultat trouve
                    </h3>
                    <p className="text-gray-medium">
                      Essayez avec d'autres mots-cles
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
                <h2 className="font-semibold text-gray-dark">Recherches Recentes</h2>
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

            {/* Browse by Publisher */}
            <div className="mt-8">
              <h2 className="font-semibold text-gray-dark mb-4">Parcourir par Editeur</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {publishers.slice(0, 6).map((publisher) => (
                  <Link
                    key={publisher.id}
                    to={`/library?publisher=${publisher.slug}`}
                    className="p-4 bg-white rounded-xl border border-gray-light hover:border-forest hover:shadow-light transition-all"
                  >
                    <BookOpen className="w-6 h-6 text-forest mb-2" />
                    <p className="font-medium text-gray-dark line-clamp-1">{publisher.name}</p>
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
