import { useState, useEffect, useMemo } from 'react';
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
  AlertTriangle,
  List,
  Search,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import type { Annotation, Book, Bookmark as ReaderBookmark, Review, User } from '@/types';
import { annotationsApi, bookmarksApi, booksApi, downloadsApi, libraryApi, ratingsApi, readingApi, reportsApi, reviewsApi } from '@/services/api';
import { toast } from 'sonner';

interface BookReaderProps {
  user: User | null;
}

interface ReaderSection {
  title: string;
  content: string;
}

export default function BookReader({ user }: BookReaderProps) {
  const { slug } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [similarBooks, setSimilarBooks] = useState<Book[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [showToc, setShowToc] = useState(false);
  const [showAnnotations, setShowAnnotations] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [bookmarks, setBookmarks] = useState<ReaderBookmark[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [hasRating, setHasRating] = useState(false);

  const currentUser = user;
  void currentUser;

  useEffect(() => {
    const loadReaderData = async () => {
      if (!slug) {
        return;
      }

      try {
        const [bookData, reviewData, similar] = await Promise.all([
          booksApi.getBySlug(slug),
          booksApi.getReviews(slug),
          booksApi.getSimilar(slug),
        ]);
        setBook(bookData);
        setReviews(reviewData);
        setSimilarBooks(similar);
        setCurrentSectionIndex(0);

        const hasToken = Boolean(localStorage.getItem('auth_token'));
        if (hasToken) {
          const [bookmarkData, annotationData] = await Promise.all([
            bookmarksApi.getAll(bookData.id).catch(() => []),
            annotationsApi.getAll(bookData.id).catch(() => []),
          ]);

          setBookmarks(bookmarkData);
          setAnnotations(annotationData);

          try {
            await readingApi.startReading(bookData.id);
          } catch (error) {
            // Ignore if reading session already exists or cannot be started now.
          }
        } else {
          setBookmarks([]);
          setAnnotations([]);
          setIsFavorite(false);
        }
      } catch (error) {
        setBook(null);
        setSimilarBooks([]);
        setReviews([]);
        setBookmarks([]);
        setAnnotations([]);
        setIsFavorite(false);
      }
    };

    loadReaderData();
  }, [slug]);

  const sections = useMemo<ReaderSection[]>(() => {
    if (!book) {
      return [];
    }

    const baseSections: ReaderSection[] = [
      {
        title: 'Description',
        content: book.description || 'Aucune description disponible pour ce livre.',
      },
    ];

    const reviewSections = reviews.slice(0, 10).map((review, index) => ({
      title: `Avis ${index + 1}`,
      content: review.content,
    }));

    return reviewSections.length > 0 ? [...baseSections, ...reviewSections] : baseSections;
  }, [book, reviews]);

  const totalSections = Math.max(sections.length, 1);
  const currentSection = sections[currentSectionIndex] || { title: 'Contenu', content: 'Aucun contenu disponible.' };

  useEffect(() => {
    const syncReadingProgress = async () => {
      if (!book || !user || !localStorage.getItem('auth_token')) {
        return;
      }

      try {
        await readingApi.updateProgress(book.id, {
          current_page: currentSectionIndex + 1,
          progress_percent: Math.round(((currentSectionIndex + 1) / totalSections) * 100),
        });
      } catch (error) {
        // Progress sync failure should not block reading.
      }
    };

    syncReadingProgress();
  }, [book, user, currentSectionIndex, totalSections]);

  const requireAuth = () => {
    if (!user || !localStorage.getItem('auth_token')) {
      toast.error('Connectez-vous pour utiliser cette fonctionnalite.');
      return false;
    }
    return true;
  };

  const handleBookmark = async () => {
    if (!book || !requireAuth()) return;
    const actionKey = 'bookmark';
    if (pendingAction === actionKey) return;

    setPendingAction(actionKey);
    try {
      const created = await bookmarksApi.create(book.id, {
        page: currentSectionIndex + 1,
        note: `Section ${currentSectionIndex + 1}: ${currentSection.title}`,
        color: 'gold',
      });
      setBookmarks((prev) => [created, ...prev]);
      toast.success('Marque-page ajoute.');
    } catch (error) {
      toast.error("Impossible d'ajouter un marque-page.");
    } finally {
      setPendingAction(null);
    }
  };

  const handleHighlight = async () => {
    if (!book || !requireAuth()) return;
    const actionKey = 'highlight';
    if (pendingAction === actionKey) return;

    setPendingAction(actionKey);
    try {
      const created = await annotationsApi.create(book.id, {
        selected_text: currentSection.content.slice(0, 180),
        page: currentSectionIndex + 1,
        color: 'yellow',
      });
      setAnnotations((prev) => [created, ...prev]);
      toast.success('Surlignage enregistre.');
    } catch (error) {
      toast.error('Impossible de creer cette annotation.');
    } finally {
      setPendingAction(null);
    }
  };

  const handleUpdateLatestBookmark = async () => {
    if (!book || !requireAuth()) return;
    const latest = bookmarks[0];
    if (!latest) {
      toast.error('Aucun marque-page a modifier.');
      return;
    }
    const note = window.prompt('Nouvelle note', latest.note ?? '');
    if (note === null) return;

    const actionKey = `bookmark-update-${latest.id}`;
    if (pendingAction === actionKey) return;
    setPendingAction(actionKey);
    try {
      const updated = await bookmarksApi.update(book.id, latest.id, { note });
      setBookmarks((prev) => prev.map((item) => (item.id === latest.id ? updated : item)));
      toast.success('Marque-page mis a jour.');
    } catch (error) {
      toast.error('Mise a jour du marque-page impossible.');
    } finally {
      setPendingAction(null);
    }
  };

  const handleDeleteLatestBookmark = async () => {
    if (!book || !requireAuth()) return;
    const latest = bookmarks[0];
    if (!latest) {
      toast.error('Aucun marque-page a supprimer.');
      return;
    }

    const actionKey = `bookmark-delete-${latest.id}`;
    if (pendingAction === actionKey) return;
    setPendingAction(actionKey);
    try {
      await bookmarksApi.delete(book.id, latest.id);
      setBookmarks((prev) => prev.filter((item) => item.id !== latest.id));
      toast.success('Marque-page supprime.');
    } catch (error) {
      toast.error('Suppression du marque-page impossible.');
    } finally {
      setPendingAction(null);
    }
  };

  const handleUpdateLatestAnnotation = async () => {
    if (!book || !requireAuth()) return;
    const latest = annotations[0];
    if (!latest) {
      toast.error('Aucune annotation a modifier.');
      return;
    }
    const note = window.prompt('Note annotation', latest.note ?? '');
    if (note === null) return;

    const actionKey = `annotation-update-${latest.id}`;
    if (pendingAction === actionKey) return;
    setPendingAction(actionKey);
    try {
      const updated = await annotationsApi.update(book.id, latest.id, { note });
      setAnnotations((prev) => prev.map((item) => (item.id === latest.id ? updated : item)));
      toast.success('Annotation mise a jour.');
    } catch (error) {
      toast.error('Mise a jour annotation impossible.');
    } finally {
      setPendingAction(null);
    }
  };

  const handleDeleteLatestAnnotation = async () => {
    if (!book || !requireAuth()) return;
    const latest = annotations[0];
    if (!latest) {
      toast.error('Aucune annotation a supprimer.');
      return;
    }

    const actionKey = `annotation-delete-${latest.id}`;
    if (pendingAction === actionKey) return;
    setPendingAction(actionKey);
    try {
      await annotationsApi.delete(book.id, latest.id);
      setAnnotations((prev) => prev.filter((item) => item.id !== latest.id));
      toast.success('Annotation supprimee.');
    } catch (error) {
      toast.error('Suppression annotation impossible.');
    } finally {
      setPendingAction(null);
    }
  };

  const handleAddNote = async () => {
    if (!book || !requireAuth()) return;

    const note = window.prompt('Entrez votre note:');
    if (!note || !note.trim()) return;

    const actionKey = 'note';
    if (pendingAction === actionKey) return;

    setPendingAction(actionKey);
    try {
      const created = await annotationsApi.create(book.id, {
        selected_text: currentSection.title,
        note: note.trim(),
        page: currentSectionIndex + 1,
        color: 'blue',
      });
      setAnnotations((prev) => [created, ...prev]);
      toast.success('Note ajoutee.');
    } catch (error) {
      toast.error("Impossible d'ajouter une note.");
    } finally {
      setPendingAction(null);
    }
  };

  const handleToggleFavorite = async () => {
    if (!book || !requireAuth()) return;
    const actionKey = 'favorite';
    if (pendingAction === actionKey) return;

    setPendingAction(actionKey);
    try {
      const response = await libraryApi.toggleFavorite(book.id);
      setIsFavorite(Boolean(response.is_favorite));
      toast.success(response.is_favorite ? 'Livre ajoute aux favoris.' : 'Livre retire des favoris.');
    } catch (error) {
      toast.error('Impossible de mettre a jour les favoris.');
    } finally {
      setPendingAction(null);
    }
  };

  const handleDownload = async () => {
    if (!book || !requireAuth()) return;
    const actionKey = 'download';
    if (pendingAction === actionKey) return;

    const format: 'pdf' | 'epub' | 'audio' =
      book.file_epub ? 'epub' : book.file_pdf ? 'pdf' : 'audio';

    setPendingAction(actionKey);
    try {
      const { download_url } = await downloadsApi.download(book.slug, format);
      if (download_url) {
        window.open(download_url, '_blank', 'noopener,noreferrer');
      }
      toast.success('Telechargement initialise.');
    } catch (error) {
      toast.error('Telechargement indisponible pour ce livre.');
    } finally {
      setPendingAction(null);
    }
  };

  const handleReportBook = async () => {
    if (!book || !requireAuth()) return;
    const reason = window.prompt('Raison du signalement');
    if (!reason || !reason.trim()) return;

    const actionKey = 'report';
    if (pendingAction === actionKey) return;
    setPendingAction(actionKey);
    try {
      await reportsApi.create({
        reportable_type: 'book',
        reportable_id: book.id,
        reason: reason.trim(),
      });
      toast.success('Signalement envoye.');
    } catch (error) {
      toast.error('Signalement impossible.');
    } finally {
      setPendingAction(null);
    }
  };

  const handleRateBook = async () => {
    if (!book || !requireAuth()) return;
    const score = Number(window.prompt('Note (1-5)'));
    if (!Number.isFinite(score) || score < 1 || score > 5) {
      toast.error('Note invalide.');
      return;
    }

    const actionKey = 'rate';
    if (pendingAction === actionKey) return;
    setPendingAction(actionKey);
    try {
      await ratingsApi.rate(book.id, score);
      setHasRating(true);
      toast.success('Note enregistree.');
    } catch (error) {
      toast.error('Notation impossible.');
    } finally {
      setPendingAction(null);
    }
  };

  const handleDeleteRate = async () => {
    if (!book || !requireAuth()) return;
    const actionKey = 'delete-rate';
    if (pendingAction === actionKey) return;
    setPendingAction(actionKey);
    try {
      await ratingsApi.delete(book.id);
      setHasRating(false);
      toast.success('Note supprimee.');
    } catch (error) {
      toast.error('Suppression note impossible.');
    } finally {
      setPendingAction(null);
    }
  };

  const handleUpsertReview = async () => {
    if (!book || !requireAuth()) return;
    const content = window.prompt('Votre avis');
    if (!content || !content.trim()) return;

    const existingReview = reviews.find((review) => review.user_id === user?.id);
    const actionKey = 'review-upsert';
    if (pendingAction === actionKey) return;
    setPendingAction(actionKey);
    try {
      if (existingReview) {
        const updated = await reviewsApi.update(existingReview.id, content.trim());
        setReviews((prev) => prev.map((review) => (review.id === existingReview.id ? updated : review)));
        toast.success('Avis mis a jour.');
      } else {
        const created = await reviewsApi.create(book.id, content.trim());
        setReviews((prev) => [created, ...prev]);
        toast.success('Avis ajoute.');
      }
    } catch (error) {
      toast.error('Operation avis impossible.');
    } finally {
      setPendingAction(null);
    }
  };

  const handleDeleteMyReview = async () => {
    if (!requireAuth()) return;
    const existingReview = reviews.find((review) => review.user_id === user?.id);
    if (!existingReview) {
      toast.error('Aucun avis personnel a supprimer.');
      return;
    }

    const actionKey = 'review-delete';
    if (pendingAction === actionKey) return;
    setPendingAction(actionKey);
    try {
      await reviewsApi.delete(existingReview.id);
      setReviews((prev) => prev.filter((review) => review.id !== existingReview.id));
      toast.success('Avis supprime.');
    } catch (error) {
      toast.error('Suppression avis impossible.');
    } finally {
      setPendingAction(null);
    }
  };

  const handleLikeFirstReview = async () => {
    if (!requireAuth()) return;
    const review = reviews[0];
    if (!review) {
      toast.error('Aucun avis a liker.');
      return;
    }

    const actionKey = `review-like-${review.id}`;
    if (pendingAction === actionKey) return;
    setPendingAction(actionKey);
    try {
      await reviewsApi.like(review.id);
      toast.success('Avis like.');
    } catch (error) {
      toast.error('Like impossible.');
    } finally {
      setPendingAction(null);
    }
  };

  const handleFinishReading = async () => {
    if (!book || !requireAuth()) return;
    const actionKey = 'finish-reading';
    if (pendingAction === actionKey) return;
    setPendingAction(actionKey);
    try {
      await readingApi.finishReading(book.id);
      toast.success('Lecture marquee comme terminee.');
    } catch (error) {
      toast.error('Impossible de terminer cette lecture.');
    } finally {
      setPendingAction(null);
    }
  };

  const handleAbandonReading = async () => {
    if (!book || !requireAuth()) return;
    const actionKey = 'abandon-reading';
    if (pendingAction === actionKey) return;
    setPendingAction(actionKey);
    try {
      await readingApi.abandonReading(book.id);
      toast.success('Lecture marquee comme abandonnee.');
    } catch (error) {
      toast.error('Impossible de marquer cette lecture.');
    } finally {
      setPendingAction(null);
    }
  };

  if (!book) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-light mx-auto mb-4" />
          <p className="text-gray-medium">Livre non trouve</p>
          <Button asChild className="mt-4">
            <Link to="/library">Retour a la bibliotheque</Link>
          </Button>
        </div>
      </div>
    );
  }

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
                <h1 className={`font-serif font-semibold ${isDarkMode ? 'text-white' : 'text-gray-dark'}`}>{book.title}</h1>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-medium'}`}>{book.author_name}</p>
              </div>
            </div>

            {/* Center - Progress */}
            <div className="hidden md:flex items-center gap-4">
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-medium'}`}>
                Section {currentSectionIndex + 1} sur {totalSections}
              </span>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-forest rounded-full transition-all" style={{ width: `${((currentSectionIndex + 1) / totalSections) * 100}%` }} />
              </div>
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-medium'}`}>
                {Math.round(((currentSectionIndex + 1) / totalSections) * 100)}%
              </span>
            </div>

            {/* Right - Controls */}
            <div className="flex items-center gap-2">
              <button onClick={() => setShowToc(!showToc)} className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-dark'}`}>
                <List className="w-5 h-5" />
              </button>
              <button onClick={() => setShowAnnotations(!showAnnotations)} className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-dark'}`}>
                <Highlighter className="w-5 h-5" />
              </button>
              <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-dark'}`}>
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
                <h3 className="font-serif font-semibold mb-4">Table des Matieres</h3>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-medium" />
                  <input
                    type="text"
                    placeholder="Rechercher dans le livre..."
                    className={`w-full pl-9 pr-4 py-2 rounded-lg text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-light'}`}
                  />
                </div>
                <ul className="space-y-2">
                  {sections.map((section, index) => (
                    <li key={section.title}>
                      <button
                        onClick={() => setCurrentSectionIndex(index)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          currentSectionIndex === index ? 'bg-forest text-white' : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                        }`}
                      >
                        {section.title}
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
                key={currentSectionIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={`min-h-[60vh] ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-light p-8 lg:p-12`}
              >
                <h2 className="font-serif text-2xl lg:text-3xl font-bold mb-8" style={{ fontSize: `${fontSize + 8}px` }}>
                  {currentSection.title}
                </h2>
                <div className="prose prose-lg max-w-none leading-relaxed" style={{ fontSize: `${fontSize}px`, lineHeight: '1.8' }}>
                  {currentSection.content.split('\n\n').map((paragraph, index) => (
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
                  onClick={() => setCurrentSectionIndex(Math.max(0, currentSectionIndex - 1))}
                  disabled={currentSectionIndex === 0}
                  className={isDarkMode ? 'border-gray-700 text-gray-300' : ''}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Precedent
                </Button>
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-medium'}`}>Section {currentSectionIndex + 1}</span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentSectionIndex(Math.min(totalSections - 1, currentSectionIndex + 1))}
                  disabled={currentSectionIndex >= totalSections - 1}
                  className={isDarkMode ? 'border-gray-700 text-gray-300' : ''}
                >
                  Suivant
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleFinishReading}
                  disabled={pendingAction === 'finish-reading'}
                >
                  Terminer la lecture
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAbandonReading}
                  disabled={pendingAction === 'abandon-reading'}
                >
                  Abandonner
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
                <h3 className={`font-serif font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-dark'}`}>Outils</h3>

                {/* Font Size */}
                <div className="mb-6">
                  <label className={`text-sm mb-2 block ${isDarkMode ? 'text-gray-400' : 'text-gray-medium'}`}>Taille du texte</label>
                  <div className="flex items-center gap-2">
                    <Type className="w-4 h-4 text-gray-medium" />
                    <Slider value={[fontSize]} min={12} max={24} step={1} onValueChange={(value) => setFontSize(value[0])} className="flex-1" />
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <button
                    onClick={handleBookmark}
                    disabled={pendingAction === 'bookmark'}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-dark'}`}
                  >
                    <Bookmark className="w-4 h-4" />
                    Ajouter un marque-page ({bookmarks.length})
                  </button>
                  <button
                    onClick={handleHighlight}
                    disabled={pendingAction === 'highlight'}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-dark'}`}
                  >
                    <Highlighter className="w-4 h-4" />
                    Surligner ({annotations.length})
                  </button>
                  <button
                    onClick={handleUpdateLatestBookmark}
                    disabled={pendingAction?.startsWith('bookmark-update-') || bookmarks.length === 0}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-dark'}`}
                  >
                    <Bookmark className="w-4 h-4" />
                    Modifier dernier marque-page
                  </button>
                  <button
                    onClick={handleDeleteLatestBookmark}
                    disabled={pendingAction?.startsWith('bookmark-delete-') || bookmarks.length === 0}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-dark'}`}
                  >
                    <Bookmark className="w-4 h-4" />
                    Supprimer dernier marque-page
                  </button>
                  <button
                    onClick={handleUpdateLatestAnnotation}
                    disabled={pendingAction?.startsWith('annotation-update-') || annotations.length === 0}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-dark'}`}
                  >
                    <Highlighter className="w-4 h-4" />
                    Modifier derniere annotation
                  </button>
                  <button
                    onClick={handleDeleteLatestAnnotation}
                    disabled={pendingAction?.startsWith('annotation-delete-') || annotations.length === 0}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-dark'}`}
                  >
                    <Highlighter className="w-4 h-4" />
                    Supprimer derniere annotation
                  </button>
                  <button
                    onClick={handleAddNote}
                    disabled={pendingAction === 'note'}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-dark'}`}
                  >
                    <Pen className="w-4 h-4" />
                    Ajouter une note
                  </button>
                  <button
                    onClick={handleRateBook}
                    disabled={pendingAction === 'rate'}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-dark'}`}
                  >
                    <Heart className="w-4 h-4" />
                    Noter (1-5)
                  </button>
                  <button
                    onClick={handleDeleteRate}
                    disabled={pendingAction === 'delete-rate' || !hasRating}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-dark'}`}
                  >
                    <Heart className="w-4 h-4" />
                    Supprimer note
                  </button>
                  <button
                    onClick={handleUpsertReview}
                    disabled={pendingAction === 'review-upsert'}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-dark'}`}
                  >
                    <Pen className="w-4 h-4" />
                    Ajouter/Modifier avis
                  </button>
                  <button
                    onClick={handleDeleteMyReview}
                    disabled={pendingAction === 'review-delete'}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-dark'}`}
                  >
                    <Pen className="w-4 h-4" />
                    Supprimer mon avis
                  </button>
                  <button
                    onClick={handleLikeFirstReview}
                    disabled={pendingAction?.startsWith('review-like-')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-dark'}`}
                  >
                    <Heart className="w-4 h-4" />
                    Liker un avis
                  </button>
                </div>

                {/* Book Info */}
                <div className={`mt-6 pt-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-light'}`}>
                  <img src={book.cover_image} alt={book.title} className="w-24 h-36 object-cover rounded-lg mx-auto mb-4" />
                  <h4 className={`font-medium text-center ${isDarkMode ? 'text-white' : 'text-gray-dark'}`}>{book.title}</h4>
                  <p className={`text-sm text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-medium'}`}>{book.author_name}</p>
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <button
                      onClick={handleToggleFavorite}
                      disabled={pendingAction === 'favorite'}
                      className={`p-2 rounded-full transition-colors ${isFavorite ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-medium'}`}
                    >
                      <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                    </button>
                    <button className="p-2 rounded-full bg-gray-100 text-gray-medium hover:bg-gray-200 transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleDownload}
                      disabled={pendingAction === 'download'}
                      className="p-2 rounded-full bg-gray-100 text-gray-medium hover:bg-gray-200 transition-colors"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleReportBook}
                      disabled={pendingAction === 'report'}
                      className="p-2 rounded-full bg-gray-100 text-gray-medium hover:bg-gray-200 transition-colors"
                    >
                      <AlertTriangle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </div>
        {similarBooks.length > 0 && (
          <div className={`mt-8 rounded-xl border p-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-light'}`}>
            <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-dark'}`}>Livres similaires</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {similarBooks.slice(0, 4).map((item) => (
                <Link key={item.id} to={`/book/${item.slug}`} className="group">
                  <img src={item.cover_image} alt={item.title} className="w-full h-28 object-cover rounded-lg mb-2 group-hover:opacity-90" />
                  <p className={`text-xs line-clamp-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-dark'}`}>{item.title}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
