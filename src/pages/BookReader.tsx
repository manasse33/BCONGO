import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Moon, 
  Sun, 
  Type, 
  Bookmark,
  Highlighter,
  Pen,
  Share2,
  Download,
  Heart,
  List,
  Search,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { books } from '@/data/mockData';
import type { Book, User } from '@/types';

interface BookReaderProps {
  user: User | null;
}

// Mock book content
const mockBookContent = [
  {
    title: "Introduction",
    content: `L'Afrique est un continent riche en histoire, en culture et en diversité. Depuis les temps anciens, les peuples africains ont développé des civilisations florissantes, ont créé des œuvres d'art magnifiques et ont partagé des histoires qui traversent les générations.

Ce livre explore les multiples facettes du continent africain, de ses traditions ancestrales à ses défis contemporains. Nous découvrirons ensemble les récits de royaumes oubliés, les légendes transmises de bouche à oreille, et les voix d'aujourd'hui qui façonnent l'avenir de l'Afrique.`
  },
  {
    title: "Chapitre 1: Les Origines",
    content: `Les origines de l'humanité se trouvent en Afrique. C'est sur ce continent que nos ancêtres les plus lointains ont fait leurs premiers pas, ont développé les outils et ont commencé à raconter des histoires autour du feu.

Les premières civilisations africaines ont émergé le long des grands fleuves : le Nil en Égypte, le Niger dans l'ouest, le Congo au centre. Ces civilisations ont développé des systèmes d'écriture, des structures politiques complexes et des réalisations artistiques qui continuent d'émerveiller le monde entier.`
  },
  {
    title: "Chapitre 2: Les Royaumes",
    content: `L'histoire de l'Afrique est marquée par de grands royaumes et empires qui ont dominé le continent pendant des siècles. Le Mali sous Mansa Moussa, le plus riche homme de tous les temps. L'Éthiopie, seule nation africaine à n'avoir jamais été colonisée. Le Zimbabwe Grand, avec ses impressionnantes structures en pierre.

Ces royaumes ont été des centres de commerce, d'apprentissage et de culture. Ils ont établi des liens avec le monde arabe, l'Inde et même la Chine, échangeant des marchandises, des idées et des connaissances.`
  },
];

export default function BookReader({ user }: BookReaderProps) {
  const { slug } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [showToc, setShowToc] = useState(false);
  const [showAnnotations, setShowAnnotations] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const totalPages = 217;
  
  // Use user parameter to avoid unused warning
  const currentUser = user;
  void currentUser;
  
  // Progress is calculated from current page
  const progress = Math.round(((currentPage + 1) / totalPages) * 100);
  void progress;

  useEffect(() => {
    // Find book by slug
    const foundBook = books.find(b => b.slug === slug);
    if (foundBook) {
      setBook(foundBook);
    }
  }, [slug]);

  if (!book) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-light mx-auto mb-4" />
          <p className="text-gray-medium">Livre non trouvé</p>
          <Button asChild className="mt-4">
            <Link to="/library">Retour à la bibliothèque</Link>
          </Button>
        </div>
      </div>
    );
  }

  const currentChapter = mockBookContent[Math.floor(currentPage / 10) % mockBookContent.length];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-cream'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 border-b ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-light'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/library">
                  <ChevronLeft className="w-5 h-5 mr-1" />
                  Retour
                </Link>
              </Button>
              <div className="hidden sm:block">
                <h1 className={`font-serif font-semibold ${isDarkMode ? 'text-white' : 'text-gray-dark'}`}>
                  {book.title}
                </h1>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-medium'}`}>
                  {book.author_name}
                </p>
              </div>
            </div>

            {/* Center - Progress */}
            <div className="hidden md:flex items-center gap-4">
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-medium'}`}>
                Page {currentPage + 1} sur {totalPages}
              </span>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-forest rounded-full transition-all"
                  style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
                />
              </div>
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-medium'}`}>
                {Math.round(((currentPage + 1) / totalPages) * 100)}%
              </span>
            </div>

            {/* Right - Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowToc(!showToc)}
                className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-dark'}`}
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowAnnotations(!showAnnotations)}
                className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-dark'}`}
              >
                <Highlighter className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-dark'}`}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Table of Contents Sidebar */}
          {showToc && (
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={`w-64 flex-shrink-0 hidden lg:block ${isDarkMode ? 'text-gray-300' : 'text-gray-dark'}`}
            >
              <div className={`sticky top-24 rounded-xl border p-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-light'}`}>
                <h3 className="font-serif font-semibold mb-4">Table des Matières</h3>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-medium" />
                  <input
                    type="text"
                    placeholder="Rechercher dans le livre..."
                    className={`w-full pl-9 pr-4 py-2 rounded-lg text-sm ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-gray-50 border-gray-light'
                    }`}
                  />
                </div>
                <ul className="space-y-2">
                  {mockBookContent.map((chapter, index) => (
                    <li key={index}>
                      <button
                        onClick={() => setCurrentPage(index * 10)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          Math.floor(currentPage / 10) === index
                            ? 'bg-forest text-white'
                            : isDarkMode 
                              ? 'hover:bg-gray-700' 
                              : 'hover:bg-gray-100'
                        }`}
                      >
                        {chapter.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.aside>
          )}

          {/* Main Reader */}
          <div className="flex-1">
            <div className={`max-w-3xl mx-auto ${isDarkMode ? 'text-gray-200' : 'text-gray-dark'}`}>
              {/* Book Content */}
              <motion.div
                key={currentPage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={`min-h-[60vh] ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-light p-8 lg:p-12`}
              >
                <h2 
                  className="font-serif text-2xl lg:text-3xl font-bold mb-8"
                  style={{ fontSize: `${fontSize + 8}px` }}
                >
                  {currentChapter.title}
                </h2>
                <div 
                  className="prose prose-lg max-w-none leading-relaxed"
                  style={{ fontSize: `${fontSize}px`, lineHeight: '1.8' }}
                >
                  {currentChapter.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-6">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </motion.div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className={isDarkMode ? 'border-gray-700 text-gray-300' : ''}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Précédent
                </Button>
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-medium'}`}>
                  Page {currentPage + 1}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage >= totalPages - 1}
                  className={isDarkMode ? 'border-gray-700 text-gray-300' : ''}
                >
                  Suivant
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>

          {/* Annotations Sidebar */}
          {showAnnotations && (
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-64 flex-shrink-0 hidden lg:block"
            >
              <div className={`sticky top-24 rounded-xl border p-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-light'}`}>
                <h3 className={`font-serif font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-dark'}`}>
                  Outils
                </h3>
                
                {/* Font Size */}
                <div className="mb-6">
                  <label className={`text-sm mb-2 block ${isDarkMode ? 'text-gray-400' : 'text-gray-medium'}`}>
                    Taille du texte
                  </label>
                  <div className="flex items-center gap-2">
                    <Type className="w-4 h-4 text-gray-medium" />
                    <Slider
                      value={[fontSize]}
                      min={12}
                      max={24}
                      step={1}
                      onValueChange={(value) => setFontSize(value[0])}
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <button className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-dark'
                  }`}>
                    <Bookmark className="w-4 h-4" />
                    Ajouter un marque-page
                  </button>
                  <button className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-dark'
                  }`}>
                    <Highlighter className="w-4 h-4" />
                    Surligner
                  </button>
                  <button className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-dark'
                  }`}>
                    <Pen className="w-4 h-4" />
                    Ajouter une note
                  </button>
                </div>

                {/* Book Info */}
                <div className={`mt-6 pt-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-light'}`}>
                  <img
                    src={book.cover_image}
                    alt={book.title}
                    className="w-24 h-36 object-cover rounded-lg mx-auto mb-4"
                  />
                  <h4 className={`font-medium text-center ${isDarkMode ? 'text-white' : 'text-gray-dark'}`}>
                    {book.title}
                  </h4>
                  <p className={`text-sm text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-medium'}`}>
                    {book.author_name}
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <button
                      onClick={() => setIsLiked(!isLiked)}
                      className={`p-2 rounded-full transition-colors ${
                        isLiked ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-medium'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    </button>
                    <button className="p-2 rounded-full bg-gray-100 text-gray-medium hover:bg-gray-200 transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button className="p-2 rounded-full bg-gray-100 text-gray-medium hover:bg-gray-200 transition-colors">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </div>
      </div>
    </div>
  );
}
