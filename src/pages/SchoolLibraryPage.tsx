import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  FileText,
  ClipboardList,
  HelpCircle,
  Video,
  Download,
  ChevronLeft,
  GraduationCap,
  Calculator,
  FlaskConical,
  Globe,
  Atom,
  BookMarked,
  Languages,
  TrendingUp,
  Monitor,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Book, Genre } from '@/types';
import { booksApi, genresApi } from '@/services/api';

const quickAccessItems = [
  { icon: BookOpen, label: 'Tous les Manuels', href: '#' },
  { icon: ClipboardList, label: "Guides d'Etude", href: '#' },
  { icon: FileText, label: 'Fiches de Revision', href: '#' },
];

const studyMaterials = [
  { icon: FileText, label: 'Anciens Examens', color: 'bg-blue-100 text-blue-600' },
  { icon: ClipboardList, label: 'Corriges Types', color: 'bg-green-100 text-green-600' },
  { icon: HelpCircle, label: 'Questions Types', color: 'bg-purple-100 text-purple-600' },
  { icon: Video, label: 'Tutoriels Video', color: 'bg-red-100 text-red-600' },
];

const subjectIcons: Record<string, any> = {
  Mathematiques: Calculator,
  Francais: BookMarked,
  Histoire: Globe,
  SVT: FlaskConical,
  Physique: Atom,
  Philosophie: BookOpen,
  Anglais: Languages,
  Economie: TrendingUp,
  Informatique: Monitor,
  Education: GraduationCap,
};

export default function SchoolLibraryPage() {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [schoolBooks, setSchoolBooks] = useState<Book[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    const loadSchoolData = async () => {
      try {
        const [bookData, genreData] = await Promise.all([booksApi.getSchool(), genresApi.getAll()]);
        setSchoolBooks(bookData);
        setGenres(genreData);
      } catch (error) {
        setSchoolBooks([]);
        setGenres([]);
      }
    };

    loadSchoolData();
  }, []);

  const filteredBooks = selectedGenre
    ? schoolBooks.filter((book) => (book.genres || []).some((genre) => genre.slug === selectedGenre))
    : schoolBooks;

  const examPapers = filteredBooks
    .slice()
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4);

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
            <div className="flex items-center gap-2 text-sm text-gray-medium mb-2">
              <Link to="/" className="hover:text-forest">Accueil</Link>
              <span>/</span>
              <span className="text-forest">Bibliotheque Scolaire</span>
            </div>
            <div className="flex items-center justify-between">
              <h1 className="font-serif text-3xl lg:text-4xl font-bold text-gray-dark">Bibliotheque Scolaire</h1>
              <Button variant="outline" asChild>
                <Link to="/" className="flex items-center gap-2">
                  <ChevronLeft className="w-4 h-4" />
                  Retour a l'accueil
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Access & Grade Filter */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Quick Access */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="font-semibold text-gray-dark mb-4">Acces Rapide</h3>
            <div className="space-y-3">
              {quickAccessItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-light hover:border-forest hover:shadow-light transition-all"
                >
                  <div className="w-10 h-10 bg-forest/10 rounded-lg flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-forest" />
                  </div>
                  <span className="font-medium text-gray-dark">{item.label}</span>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Genre Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <h3 className="font-semibold text-gray-dark mb-4">Filtrer par Matiere</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedGenre(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedGenre === null
                    ? 'bg-forest text-white'
                    : 'bg-white text-gray-dark border border-gray-light hover:border-forest'
                }`}
              >
                Tous
              </button>
              {genres.slice(0, 12).map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => setSelectedGenre(genre.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedGenre === genre.slug
                      ? 'bg-forest text-white'
                      : 'bg-white text-gray-dark border border-gray-light hover:border-forest'
                  }`}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Study Materials */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-10"
        >
          <h3 className="font-serif text-2xl font-bold text-gray-dark mb-6">Materiaux d'Etude</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {studyMaterials.map((item) => (
              <button
                key={item.label}
                className="flex flex-col items-center p-6 bg-white rounded-xl border border-gray-light hover:border-gold hover:shadow-light transition-all"
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-3 ${item.color}`}>
                  <item.icon className="w-7 h-7" />
                </div>
                <span className="text-sm font-medium text-gray-dark text-center">{item.label}</span>
              </button>
            ))}
          </div>
        </motion.section>

        {/* Curriculum Organized Books */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-10"
        >
          <h3 className="font-serif text-2xl font-bold text-gray-dark mb-6">Livres par Matiere</h3>
          <div className="space-y-6">
            {genres.slice(0, 5).map((genre, index) => {
              const Icon = subjectIcons[genre.name.split(' ')[0]] || BookOpen;
              const subjectBooks = filteredBooks
                .filter((book) => (book.genres || []).some((bookGenre) => bookGenre.id === genre.id))
                .slice(0, 3);

              const fallbackBooks = subjectBooks.length > 0 ? subjectBooks : filteredBooks.filter((_, i) => i % 5 === index).slice(0, 3);

              return (
                <div key={genre.id} className="bg-white rounded-xl border border-gray-light p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-forest/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-forest" />
                    </div>
                    <h4 className="font-serif text-xl font-semibold text-gray-dark">{genre.name}</h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {fallbackBooks.length > 0 ? (
                      fallbackBooks.map((book) => (
                        <div key={book.id} className="flex items-center gap-3 p-3 bg-cream rounded-lg">
                          <img src={book.cover_image} alt={book.title} className="w-12 h-16 object-cover rounded" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-gray-dark line-clamp-1">{book.title}</p>
                            <p className="text-xs text-gray-medium">{book.pages_count} pages</p>
                          </div>
                          <Button size="sm" variant="ghost" className="text-forest">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-medium col-span-3">Aucun livre disponible pour cette matiere</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* Exam Papers Archive */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-10"
        >
          <h3 className="font-serif text-2xl font-bold text-gray-dark mb-6">Archives des Examens</h3>
          <div className="bg-white rounded-xl border border-gray-light overflow-hidden">
            {examPapers.map((paper, index) => (
              <div
                key={paper.id}
                className={`flex items-center justify-between p-4 ${index !== examPapers.length - 1 ? 'border-b border-gray-light' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-forest/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-forest" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-dark">{paper.title}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-medium">
                      <span>{new Date(paper.created_at).getFullYear()}</span>
                      <span>•</span>
                      <Badge variant="secondary" className="text-xs">PDF</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-medium hidden sm:block">{paper.download_count} telechargements</span>
                  <Button size="sm" className="bg-forest hover:bg-forest-dark text-white">
                    <Download className="w-4 h-4 mr-1" />
                    Telecharger
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Summary Notes */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h3 className="font-serif text-2xl font-bold text-gray-dark mb-6">Fiches de Revision</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredBooks.slice(0, 4).map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-xl border border-gray-light p-4 hover:border-gold hover:shadow-light transition-all"
              >
                <p className="font-medium text-gray-dark mb-3">{book.title}</p>
                <Button size="sm" variant="outline" className="w-full border-forest text-forest hover:bg-forest hover:text-white">
                  Voir la fiche
                </Button>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
