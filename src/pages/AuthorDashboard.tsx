import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Upload,
  BarChart3,
  FileText,
  Image,
  Eye,
  Download,
  TrendingUp,
  CheckCircle,
  ChevronRight,
  Plus,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Book, User } from '@/types';
import { booksApi } from '@/services/api';
import { toast } from 'sonner';

interface AuthorDashboardProps {
  user: User;
}

const publicationSteps = [
  { id: 1, name: 'Soumission du Brouillon', completed: true },
  { id: 2, name: 'Examen & Retour', completed: true },
  { id: 3, name: 'Validation', completed: false, current: true },
  { id: 4, name: 'Publication', completed: false },
];

export default function AuthorDashboard({ user }: AuthorDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'books' | 'upload' | 'analytics'>('overview');
  const [uploadStep, setUploadStep] = useState(1);
  const [authorBooks, setAuthorBooks] = useState<Book[]>([]);
  const [analyticsData, setAnalyticsData] = useState({
    totalViews: 0,
    totalDownloads: 0,
    totalReads: 0,
    monthlyGrowth: 0,
  });

  const loadAuthorData = async () => {
    try {
      const [myBooks, authorStats] = await Promise.all([booksApi.getMyBooks(), booksApi.getAuthorStats()]);

      setAuthorBooks(myBooks);
      setAnalyticsData({
        totalViews: Number(authorStats.total_views ?? authorStats.views ?? 0),
        totalDownloads: Number(authorStats.total_downloads ?? authorStats.downloads ?? 0),
        totalReads: Number(authorStats.total_reads ?? authorStats.reads ?? 0),
        monthlyGrowth: Number(authorStats.monthly_growth ?? authorStats.growth ?? 0),
      });
    } catch (error) {
      setAuthorBooks([]);
      setAnalyticsData({ totalViews: 0, totalDownloads: 0, totalReads: 0, monthlyGrowth: 0 });
    }
  };

  useEffect(() => {
    loadAuthorData();
  }, []);

  const handleQuickCreateBook = async () => {
    const title = window.prompt('Titre du livre');
    if (!title || !title.trim()) return;

    try {
      await booksApi.create({
        title: title.trim(),
        author_name: `${user.first_name} ${user.last_name}`,
        type: 'roman',
        language_id: 1,
        status: 'brouillon',
        is_free: true,
      } as Partial<Book>);
      toast.success('Livre cree en brouillon.');
      await loadAuthorData();
      setActiveTab('books');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Creation impossible.');
    }
  };

  const handleDeleteBook = async (bookId: number) => {
    if (!window.confirm('Supprimer ce livre ?')) return;
    try {
      await booksApi.delete(bookId);
      toast.success('Livre supprime.');
      await loadAuthorData();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Suppression impossible.');
    }
  };

  const handleSubmitBook = async (bookId: number) => {
    try {
      await booksApi.submitForReview(bookId);
      toast.success('Livre soumis pour validation.');
      await loadAuthorData();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Soumission impossible.');
    }
  };

  const handleWithdrawBook = async (bookId: number) => {
    try {
      await booksApi.withdraw(bookId);
      toast.success('Livre retire du processus de validation.');
      await loadAuthorData();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Retrait impossible.');
    }
  };

  const handleShowBookStats = async (bookId: number) => {
    try {
      const [bookDetail, stats] = await Promise.all([booksApi.getOwn(bookId), booksApi.getBookStats(bookId)]);
      toast.success(`Stats ${bookDetail.title}: ${JSON.stringify(stats)}`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Stats indisponibles.');
    }
  };

  const handleUpdateBookTitle = async (book: Book) => {
    const nextTitle = window.prompt('Nouveau titre', book.title);
    if (!nextTitle || !nextTitle.trim()) return;

    try {
      await booksApi.update(book.id, { title: nextTitle.trim() });
      toast.success('Livre mis a jour.');
      await loadAuthorData();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Mise a jour impossible.');
    }
  };

  const monthlyStats = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }).map((_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
      const monthBooks = authorBooks.filter((book) => {
        const createdAt = new Date(book.created_at);
        return createdAt.getFullYear() === date.getFullYear() && createdAt.getMonth() === date.getMonth();
      });

      return {
        month: date.toLocaleDateString('fr-FR', { month: 'short' }),
        views: monthBooks.reduce((sum, book) => sum + book.read_count, 0),
        downloads: monthBooks.reduce((sum, book) => sum + book.download_count, 0),
      };
    });
  }, [authorBooks]);

  const maxViews = Math.max(...monthlyStats.map((item) => item.views), 1);
  const maxDownloads = Math.max(...monthlyStats.map((item) => item.downloads), 1);

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Vues Totales', value: analyticsData.totalViews.toLocaleString(), icon: Eye, color: 'bg-blue-100 text-blue-600' },
          { label: 'Telechargements', value: analyticsData.totalDownloads.toLocaleString(), icon: Download, color: 'bg-green-100 text-green-600' },
          { label: 'Lectures', value: analyticsData.totalReads.toLocaleString(), icon: BookOpen, color: 'bg-purple-100 text-purple-600' },
          { label: 'Croissance', value: `+${analyticsData.monthlyGrowth}%`, icon: TrendingUp, color: 'bg-gold/20 text-amber-700' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 border border-gray-light"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-2xl font-bold text-gray-dark">{stat.value}</p>
            <p className="text-sm text-gray-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Published Works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white rounded-xl border border-gray-light p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif text-xl font-bold text-gray-dark">Oeuvres Publiees</h3>
          <Button variant="outline" size="sm" className="border-forest text-forest">
            Voir Tout
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {authorBooks.slice(0, 4).map((book) => (
            <div key={book.id} className="group">
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-3">
                <img
                  src={book.cover_image}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-forest text-white text-xs">{book.download_count}</Badge>
                </div>
              </div>
              <h4 className="font-medium text-gray-dark text-sm line-clamp-1">{book.title}</h4>
              <p className="text-xs text-gray-medium">{book.read_count} lectures</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Publication Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white rounded-xl border border-gray-light p-6"
      >
        <h3 className="font-serif text-xl font-bold text-gray-dark mb-6">Statut des Publications</h3>
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-light" />
          <div className="space-y-6">
            {publicationSteps.map((step) => (
              <div key={step.id} className="relative flex items-start gap-4">
                <div
                  className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${
                    step.completed
                      ? 'bg-forest text-white'
                      : step.current
                        ? 'bg-gold text-gray-dark'
                        : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {step.completed ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : step.current ? (
                    <Clock className="w-6 h-6" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                <div className="flex-1 pt-2">
                  <p className={`${step.completed || step.current ? 'text-gray-dark' : 'text-gray-400'} font-medium`}>
                    {step.name}
                  </p>
                  {step.current && (
                    <p className="text-sm text-gray-medium mt-1">En attente de validation par notre equipe editoriale</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderUploadForm = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl border border-gray-light p-6 lg:p-8"
    >
      <h3 className="font-serif text-2xl font-bold text-gray-dark mb-6">Publier un Nouveau Livre</h3>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {['Informations', 'Contenu', 'Validation'].map((step, index) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                uploadStep > index + 1
                  ? 'bg-forest text-white'
                  : uploadStep === index + 1
                    ? 'bg-gold text-gray-dark'
                    : 'bg-gray-100 text-gray-400'
              }`}
            >
              {uploadStep > index + 1 ? <CheckCircle className="w-5 h-5" /> : index + 1}
            </div>
            <span className={`ml-2 text-sm hidden sm:block ${uploadStep >= index + 1 ? 'text-gray-dark' : 'text-gray-400'}`}>
              {step}
            </span>
            {index < 2 && <ChevronRight className="w-5 h-5 text-gray-light mx-4" />}
          </div>
        ))}
      </div>

      {uploadStep === 1 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-dark mb-2">Titre du Livre</label>
              <Input placeholder="Entrez le titre" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-dark mb-2">Genre</label>
              <select className="w-full px-4 py-2 border border-gray-light rounded-lg focus:outline-none focus:border-forest">
                <option>Selectionnez un genre</option>
                <option>Roman Africain</option>
                <option>Poesie</option>
                <option>Nouvelle</option>
                <option>Jeunesse</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-dark mb-2">Description</label>
            <textarea
              rows={4}
              placeholder="Decrivez votre livre..."
              className="w-full px-4 py-2 border border-gray-light rounded-lg focus:outline-none focus:border-forest resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-dark mb-2">Couverture</label>
            <div className="border-2 border-dashed border-gray-light rounded-lg p-8 text-center hover:border-forest transition-colors cursor-pointer">
              <Image className="w-10 h-10 text-gray-medium mx-auto mb-3" />
              <p className="text-sm text-gray-medium">Glissez votre image ici ou cliquez pour selectionner</p>
              <p className="text-xs text-gray-medium mt-1">JPG, PNG (max 5MB)</p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button className="bg-forest hover:bg-forest-dark text-white" onClick={() => setUploadStep(2)}>
              Continuer
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {uploadStep === 2 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-dark mb-2">Fichier du Livre (PDF)</label>
            <div className="border-2 border-dashed border-gray-light rounded-lg p-8 text-center hover:border-forest transition-colors cursor-pointer">
              <FileText className="w-10 h-10 text-gray-medium mx-auto mb-3" />
              <p className="text-sm text-gray-medium">Glissez votre fichier PDF ici</p>
              <p className="text-xs text-gray-medium mt-1">PDF (max 50MB)</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-dark mb-2">Fichier EPUB (optionnel)</label>
            <div className="border-2 border-dashed border-gray-light rounded-lg p-8 text-center hover:border-forest transition-colors cursor-pointer">
              <BookOpen className="w-10 h-10 text-gray-medium mx-auto mb-3" />
              <p className="text-sm text-gray-medium">Glissez votre fichier EPUB ici</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-dark mb-2">ISBN (si disponible)</label>
            <Input placeholder="978-2-123456-78-9" />
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setUploadStep(1)}>
              Retour
            </Button>
            <Button className="bg-forest hover:bg-forest-dark text-white" onClick={() => setUploadStep(3)}>
              Continuer
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {uploadStep === 3 && (
        <div className="space-y-6">
          <div className="bg-cream rounded-xl p-6">
            <h4 className="font-medium text-gray-dark mb-4">Recapitulatif</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-medium">Titre:</span>
                <span className="text-gray-dark font-medium">Mon Nouveau Livre</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-medium">Genre:</span>
                <span className="text-gray-dark font-medium">Roman Africain</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-medium">Fichier:</span>
                <span className="text-gray-dark font-medium">mon_livre.pdf (12.5 MB)</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <input type="checkbox" id="terms" className="mt-1" />
            <label htmlFor="terms" className="text-sm text-gray-medium">
              Je confirme que cette oeuvre est originale et que je detiens les droits de publication. J'accepte les
              conditions d'utilisation de la plateforme.
            </label>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setUploadStep(2)}>
              Retour
            </Button>
            <Button
              className="bg-gold hover:bg-gold-dark text-gray-dark font-semibold"
              onClick={() => {
                setUploadStep(1);
                setActiveTab('overview');
              }}
            >
              <Upload className="w-4 h-4 mr-2" />
              Soumettre pour Validation
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );

  const renderAnalytics = () => (
    <div className="space-y-8">
      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl border border-gray-light p-6"
      >
        <h3 className="font-serif text-xl font-bold text-gray-dark mb-6">Performance Mensuelle</h3>
        <div className="h-64 flex items-end justify-between gap-2">
          {monthlyStats.map((stat, index) => (
            <div key={stat.month} className="flex-1 flex flex-col items-center">
              <div className="w-full flex gap-1 justify-center" style={{ height: '200px' }}>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(stat.views / maxViews) * 100}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="w-4 bg-forest/30 rounded-t"
                />
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(stat.downloads / maxDownloads) * 100}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.05 }}
                  className="w-4 bg-forest rounded-t"
                />
              </div>
              <span className="text-xs text-gray-medium mt-2">{stat.month}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-forest/30 rounded" />
            <span className="text-sm text-gray-medium">Vues</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-forest rounded" />
            <span className="text-sm text-gray-medium">Telechargements</span>
          </div>
        </div>
      </motion.div>

      {/* Book Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-xl border border-gray-light p-6"
      >
        <h3 className="font-serif text-xl font-bold text-gray-dark mb-6">Performance par Livre</h3>
        <div className="space-y-4">
          {authorBooks.slice(0, 3).map((book) => (
            <div key={book.id} className="flex items-center gap-4">
              <img src={book.cover_image} alt={book.title} className="w-12 h-16 object-cover rounded" />
              <div className="flex-1">
                <h4 className="font-medium text-gray-dark">{book.title}</h4>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-medium">
                  <span>{book.read_count} lectures</span>
                  <span>{book.download_count} telechargements</span>
                </div>
                <Progress value={(book.read_count / Math.max(analyticsData.totalReads, 1)) * 100} className="h-2 mt-2" />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen app-shell bg-cream">
      {/* Header */}
      <div className="bg-white border-b border-gray-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 text-sm text-gray-medium mb-2">
              <Link to="/" className="hover:text-forest">
                Accueil
              </Link>
              <span>/</span>
              <span className="text-forest">Espace Auteur</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-3xl lg:text-4xl font-bold text-gray-dark">Espace Auteur</h1>
                <p className="text-gray-medium mt-1">Gerez vos publications et suivez vos performances</p>
              </div>
              <Button className="bg-gold hover:bg-gold-dark text-gray-dark" onClick={handleQuickCreateBook}>
                <Plus className="w-4 h-4 mr-2" />
                Nouveau Livre
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Author Profile */}
              <div className="bg-white rounded-xl border border-gray-light p-6 text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4 border-4 border-gold">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-forest text-white text-xl">
                    {user.first_name[0]}
                    {user.last_name[0]}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-serif text-xl font-bold text-gray-dark">
                  {user.first_name} {user.last_name}
                </h3>
                <p className="text-sm text-gray-medium mb-4">@{user.username}</p>
                <p className="text-sm text-gray-medium mb-4">{user.bio}</p>
                <div className="flex items-center justify-center gap-4 text-sm">
                  <div className="text-center">
                    <p className="font-bold text-forest">{authorBooks.length}</p>
                    <p className="text-gray-medium">Livres</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-forest">{analyticsData.totalReads}</p>
                    <p className="text-gray-medium">Lectures</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="bg-white rounded-xl border border-gray-light overflow-hidden">
                {[
                  { id: 'overview', label: "Vue d'Ensemble", icon: BarChart3 },
                  { id: 'books', label: 'Mes Livres', icon: BookOpen },
                  { id: 'upload', label: 'Publier', icon: Upload },
                  { id: 'analytics', label: 'Analytics', icon: TrendingUp },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as 'overview' | 'books' | 'upload' | 'analytics')}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      activeTab === item.id
                        ? 'bg-forest/10 text-forest border-l-4 border-forest'
                        : 'text-gray-dark hover:bg-gray-50 border-l-4 border-transparent'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'upload' && renderUploadForm()}
            {activeTab === 'analytics' && renderAnalytics()}
            {activeTab === 'books' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-2 sm:grid-cols-3 gap-4"
              >
                {authorBooks.map((book) => (
                  <div key={book.id} className="bg-white rounded-xl border border-gray-light overflow-hidden">
                    <img src={book.cover_image} alt={book.title} className="w-full aspect-[2/3] object-cover" />
                    <div className="p-4">
                      <h4 className="font-medium text-gray-dark line-clamp-1">{book.title}</h4>
                      <Badge
                        className={`mt-2 ${
                          book.status === 'publie'
                            ? 'bg-green-100 text-green-700'
                            : book.status === 'en_validation'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {book.status === 'publie' ? 'Publie' : book.status === 'en_validation' ? 'En Validation' : 'Brouillon'}
                      </Badge>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Button size="sm" variant="outline" onClick={() => handleShowBookStats(book.id)}>
                          Stats
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleUpdateBookTitle(book)}>
                          Modifier
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleSubmitBook(book.id)}>
                          Soumettre
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleWithdrawBook(book.id)}>
                          Retirer
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteBook(book.id)}>
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

