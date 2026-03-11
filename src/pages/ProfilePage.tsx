import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Heart,
  Clock,
  BookMarked,
  Award,
  Settings,
  Edit3,
  Upload,
  Shield,
  UserPlus,
  MapPin,
  Calendar,
  Mail,
  TrendingUp,
  Star,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import type { Badge as UserBadge, Book, Notification, ReadingChallenge, User, UserReading } from '@/types';
import { challengesApi, downloadsApi, libraryApi, notificationsApi, reviewsApi, streaksApi, userApi } from '@/services/api';
import { canAccessAdminSpace, canAccessAuthorSpace } from '@/lib/rbac';

interface ProfilePageProps {
  user: User;
}

export default function ProfilePage({ user }: ProfilePageProps) {
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState<User>(user);
  const [stats, setStats] = useState({
    booksRead: 0,
    pagesRead: 0,
    readingTime: 0,
    streak: 0,
  });
  const [readingHistory, setReadingHistory] = useState<UserReading[]>([]);
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [myChallenges, setMyChallenges] = useState<ReadingChallenge[]>([]);
  const [favoriteBooks, setFavoriteBooks] = useState<Book[]>([]);
  const [downloadedBooks, setDownloadedBooks] = useState<Book[]>([]);
  const [myReviewsCount, setMyReviewsCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState('');
  const [editValues, setEditValues] = useState({
    first_name: user.first_name ?? '',
    last_name: user.last_name ?? '',
    bio: user.bio ?? '',
    city: user.city ?? '',
  });
  const [isAuthorRequestOpen, setIsAuthorRequestOpen] = useState(false);
  const [authorRequestError, setAuthorRequestError] = useState('');
  const [authorRequestPending, setAuthorRequestPending] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('author_request_pending') === 'true';
  });
  const [authorRequest, setAuthorRequest] = useState({
    pen_name: '',
    portfolio: '',
    motivation: '',
  });

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const [currentProfile, statsData, badgeData, readingData, challengeData, favorites, downloaded, myReviews, notificationData, unreadData, streakData] = await Promise.all([
          userApi.getProfile(),
          userApi.getStats(),
          userApi.getBadges(),
          userApi.getReadingHistory(),
          challengesApi.getMyChallenges(),
          libraryApi.getFavorites(),
          downloadsApi.getMyDownloads(),
          reviewsApi.getMyReviews(),
          notificationsApi.getAll(),
          notificationsApi.getUnreadCount(),
          streaksApi.getMyStreak(),
        ]);

        setProfileUser(currentProfile);
        setStats({
          booksRead: Number(statsData.books_read ?? statsData.completed_books ?? 0),
          pagesRead: Number(statsData.pages_read ?? 0),
          readingTime: Number(
            statsData.reading_hours ??
              (statsData.total_seconds_read ? Math.round(Number(statsData.total_seconds_read) / 3600) : 0)
          ),
          streak: Number(streakData.current_streak ?? statsData.reading_streak ?? statsData.streak_days ?? 0),
        });
        setBadges(badgeData);
        setReadingHistory(readingData);
        setMyChallenges(challengeData);
        setFavoriteBooks(favorites);
        setDownloadedBooks(downloaded);
        setMyReviewsCount(myReviews.length);
        setNotifications(notificationData);
        setUnreadCount(Number(unreadData.count ?? 0));
      } catch (error) {
        setProfileUser(user);
        setStats({ booksRead: 0, pagesRead: 0, readingTime: 0, streak: 0 });
        setBadges([]);
        setReadingHistory([]);
        setMyChallenges([]);
        setFavoriteBooks([]);
        setDownloadedBooks([]);
        setMyReviewsCount(0);
        setNotifications([]);
        setUnreadCount(0);
      }
    };

    loadProfileData();
  }, [user]);

  const handleEditProfile = () => {
    setEditValues({
      first_name: profileUser.first_name ?? '',
      last_name: profileUser.last_name ?? '',
      bio: profileUser.bio ?? '',
      city: profileUser.city ?? '',
    });
    setEditError('');
    setIsEditOpen(true);
  };

  const handleSaveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = {
      first_name: editValues.first_name.trim(),
      last_name: editValues.last_name.trim(),
      bio: editValues.bio.trim(),
      city: editValues.city.trim(),
    };

    if (!payload.first_name || !payload.last_name) {
      setEditError('Merci de renseigner le prenom et le nom.');
      return;
    }

    setIsSaving(true);
    setEditError('');
    try {
      const updated = await userApi.updateProfile(payload);
      setProfileUser(updated);
      setIsEditOpen(false);
      toast.success('Profil mis a jour.');
    } catch (error) {
      setEditError('Mise a jour impossible. Reessayez.');
      toast.error('Mise a jour impossible.');
    } finally {
      setIsSaving(false);
    }
  };

  const currentlyReading = readingHistory.filter((item) => item.status === 'en_cours');
  const completedReadings = readingHistory.filter((item) => item.status === 'termine');

  const handleMarkNotificationRead = async (id: string) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, read_at: item.read_at ?? new Date().toISOString() } : item)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      // Keep UI state if API fails.
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications((prev) => prev.map((item) => ({ ...item, read_at: item.read_at ?? new Date().toISOString() })));
      setUnreadCount(0);
    } catch (error) {
      // Keep UI state if API fails.
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      await notificationsApi.delete(id);
      setNotifications((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      // Keep UI state if API fails.
    }
  };

  const canAuthor = canAccessAuthorSpace(profileUser);
  const canAdmin = canAccessAdminSpace(profileUser);

  const handleSubmitAuthorRequest = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = {
      pen_name: authorRequest.pen_name.trim(),
      portfolio: authorRequest.portfolio.trim(),
      motivation: authorRequest.motivation.trim(),
    };

    if (!payload.motivation) {
      setAuthorRequestError('Merci de decrire votre projet.');
      return;
    }

    localStorage.setItem('author_request_pending', 'true');
    setAuthorRequestPending(true);
    setAuthorRequestError('');
    setIsAuthorRequestOpen(false);
    toast.success('Demande envoyee. Notre equipe vous recontactera.');
  };

  return (
    <div className="min-h-screen bg-cream">
      <Dialog
        open={isEditOpen}
        onOpenChange={(open) => {
          setIsEditOpen(open);
          if (!open) {
            setEditError('');
          }
        }}
      >
        <DialogContent className="bg-white border border-gray-light">
          <DialogHeader>
            <DialogTitle>Modifier le profil</DialogTitle>
            <DialogDescription>Mettre a jour votre identite, bio et ville.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="profile-first-name">Prenom</Label>
                <Input
                  id="profile-first-name"
                  value={editValues.first_name}
                  onChange={(event) => setEditValues((prev) => ({ ...prev, first_name: event.target.value }))}
                  placeholder="Votre prenom"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-last-name">Nom</Label>
                <Input
                  id="profile-last-name"
                  value={editValues.last_name}
                  onChange={(event) => setEditValues((prev) => ({ ...prev, last_name: event.target.value }))}
                  placeholder="Votre nom"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-bio">Bio</Label>
              <Textarea
                id="profile-bio"
                rows={4}
                value={editValues.bio}
                onChange={(event) => setEditValues((prev) => ({ ...prev, bio: event.target.value }))}
                placeholder="Quelques mots sur vous"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-city">Ville</Label>
              <Input
                id="profile-city"
                value={editValues.city}
                onChange={(event) => setEditValues((prev) => ({ ...prev, city: event.target.value }))}
                placeholder="Votre ville"
              />
            </div>
            {editError && <p className="text-sm text-red-600">{editError}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} disabled={isSaving}>
                Annuler
              </Button>
              <Button type="submit" className="bg-forest hover:bg-forest-dark text-white" disabled={isSaving}>
                {isSaving ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isAuthorRequestOpen}
        onOpenChange={(open) => {
          setIsAuthorRequestOpen(open);
          if (!open) {
            setAuthorRequestError('');
          }
        }}
      >
        <DialogContent className="bg-white border border-gray-light">
          <DialogHeader>
            <DialogTitle>Demander le statut auteur</DialogTitle>
            <DialogDescription>Expliquez votre projet pour publier sur la plateforme.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitAuthorRequest} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="author-pen-name">Nom de plume (optionnel)</Label>
              <Input
                id="author-pen-name"
                value={authorRequest.pen_name}
                onChange={(event) => setAuthorRequest((prev) => ({ ...prev, pen_name: event.target.value }))}
                placeholder="Nom affiche sur vos livres"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author-portfolio">Lien portfolio (optionnel)</Label>
              <Input
                id="author-portfolio"
                value={authorRequest.portfolio}
                onChange={(event) => setAuthorRequest((prev) => ({ ...prev, portfolio: event.target.value }))}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author-motivation">Presentation du projet</Label>
              <Textarea
                id="author-motivation"
                rows={4}
                value={authorRequest.motivation}
                onChange={(event) => setAuthorRequest((prev) => ({ ...prev, motivation: event.target.value }))}
                placeholder="Decrivez vos ouvrages, votre style, vos objectifs..."
                required
              />
            </div>
            {authorRequestError && <p className="text-sm text-red-600">{authorRequestError}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAuthorRequestOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" className="bg-gold hover:bg-gold-dark text-gray-dark font-semibold">
                Envoyer la demande
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Profile Header */}
      <div className="bg-white border-b border-gray-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              <Avatar className="w-24 h-24 border-4 border-gold">
                <AvatarImage src={profileUser.avatar} />
                <AvatarFallback className="bg-forest text-white text-2xl">
                  {profileUser.first_name[0]}
                  {profileUser.last_name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-2">
                  <h1 className="font-serif text-3xl font-bold text-gray-dark">
                    {profileUser.first_name} {profileUser.last_name}
                  </h1>
                  <Badge className="w-fit bg-forest/10 text-forest">
                    <Award className="w-3 h-3 mr-1" />
                    Lecteur confirme
                  </Badge>
                </div>
                <p className="text-gray-medium mb-3">@{profileUser.username}</p>
                <p className="text-gray-dark max-w-xl">{profileUser.bio}</p>
                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-medium">
                  {profileUser.city && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {profileUser.city}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Inscrit depuis{' '}
                    {new Date(profileUser.created_at).toLocaleDateString('fr-FR', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {profileUser.email || 'Non renseigne'}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {canAuthor && (
                  <Button className="bg-gold hover:bg-gold-dark text-gray-dark" onClick={() => navigate('/author/dashboard')}>
                    <Upload className="w-4 h-4 mr-2" />
                    Publier un livre
                  </Button>
                )}
                {!canAuthor && (
                  <Button
                    variant="outline"
                    className="border-gold text-gold"
                    onClick={() => {
                      setAuthorRequestError('');
                      setIsAuthorRequestOpen(true);
                    }}
                    disabled={authorRequestPending}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    {authorRequestPending ? 'Demande envoyee' : 'Devenir auteur'}
                  </Button>
                )}
                {canAdmin && (
                  <Button variant="outline" className="border-red-500 text-red-600" onClick={() => navigate('/admin')}>
                    <Shield className="w-4 h-4 mr-2" />
                    Administration
                  </Button>
                )}
                <Button variant="outline" className="border-forest text-forest" onClick={handleEditProfile}>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Modifier
                </Button>
                <Button variant="outline" size="icon" onClick={() => navigate('/settings')}>
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: 'Livres Lus', value: stats.booksRead, icon: BookOpen, color: 'bg-blue-100 text-blue-600' },
            { label: 'Pages Lues', value: stats.pagesRead.toLocaleString(), icon: TrendingUp, color: 'bg-green-100 text-green-600' },
            { label: 'Temps de Lecture', value: `${stats.readingTime}h`, icon: Clock, color: 'bg-purple-100 text-purple-600' },
            { label: 'Serie', value: `${stats.streak} jours`, icon: Award, color: 'bg-gold/20 text-amber-700' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-4 border border-gray-light">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-gray-dark">{stat.value}</p>
              <p className="text-sm text-gray-medium">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white border border-gray-light p-1">
            <TabsTrigger value="overview">Vue d'Ensemble</TabsTrigger>
            <TabsTrigger value="library">Ma Bibliotheque</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="challenges">Defis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Reading Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl border border-gray-light p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-xl font-bold text-gray-dark">Lecture en Cours</h3>
                <Button variant="outline" size="sm" className="border-forest text-forest">
                  Voir Tout
                </Button>
              </div>
              <div className="space-y-4">
                {currentlyReading.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <img
                      src={item.book?.cover_image}
                      alt={item.book?.title}
                      className="w-16 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-dark">{item.book?.title}</h4>
                      <p className="text-sm text-gray-medium">{item.book?.author_name}</p>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-medium">Progression</span>
                          <span className="font-medium text-forest">{Math.round(item.progress_percent)}%</span>
                        </div>
                        <Progress value={item.progress_percent} className="h-2" />
                      </div>
                    </div>
                    <Button size="sm" className="bg-forest hover:bg-forest-dark text-white">
                      Reprendre
                    </Button>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-xl border border-gray-light p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-xl font-bold text-gray-dark">Derniers Badges</h3>
                <Button variant="outline" size="sm" className="border-forest text-forest">
                  Voir Tout
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {badges.slice(0, 3).map((badge) => (
                  <div key={badge.id} className="text-center">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 bg-gold/20 text-amber-700">
                      <Star className="w-8 h-8" />
                    </div>
                    <p className="font-medium text-gray-dark text-sm">{badge.name}</p>
                    <p className="text-xs text-gray-medium">{badge.description || 'Badge debloque'}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Notifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl border border-gray-light p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-xl font-bold text-gray-dark">Notifications ({unreadCount} non lues)</h3>
                <Button variant="outline" size="sm" onClick={handleMarkAllNotificationsRead}>
                  Tout lire
                </Button>
              </div>
              <div className="space-y-3">
                {notifications.slice(0, 5).map((notification) => (
                  <div key={notification.id} className="border border-gray-light rounded-lg p-3">
                    <p className="text-sm text-gray-dark">{notification.type}</p>
                    <p className="text-xs text-gray-medium">
                      {notification.created_at ? new Date(notification.created_at).toLocaleString('fr-FR') : 'Recent'}
                    </p>
                    <div className="flex gap-2 mt-2">
                      {!notification.read_at && (
                        <Button size="sm" variant="outline" onClick={() => handleMarkNotificationRead(notification.id)}>
                          Marquer lu
                        </Button>
                      )}
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteNotification(notification.id)}>
                        Supprimer
                      </Button>
                    </div>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <p className="text-sm text-gray-medium">Aucune notification.</p>
                )}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="library">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl border border-gray-light p-6"
            >
              <div className="flex items-center gap-4 mb-6">
                <Button variant="outline" className="border-forest text-forest">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Livres Lus ({completedReadings.length})
                </Button>
                <Button variant="outline">
                  <Heart className="w-4 h-4 mr-2" />
                  Favoris ({favoriteBooks.length})
                </Button>
                <Button variant="outline">
                  <Clock className="w-4 h-4 mr-2" />
                  A Lire ({readingHistory.filter((r) => r.status === 'a_lire').length})
                </Button>
                <Button variant="outline">
                  <BookMarked className="w-4 h-4 mr-2" />
                  Telecharges ({downloadedBooks.length})
                </Button>
                <Button variant="outline">
                  <Star className="w-4 h-4 mr-2" />
                  Mes avis ({myReviewsCount})
                </Button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[...completedReadings.map((r) => r.book).filter(Boolean), ...favoriteBooks, ...downloadedBooks]
                  .slice(0, 8)
                  .map((book) => (
                    <div key={book!.id} className="group">
                      <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
                        <img
                          src={book!.cover_image}
                          alt={book!.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-forest/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Check className="w-12 h-12 text-white" />
                        </div>
                      </div>
                      <h4 className="font-medium text-gray-dark line-clamp-1">{book!.title}</h4>
                      <p className="text-sm text-gray-medium">{book!.author_name}</p>
                    </div>
                  ))}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="badges">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl border border-gray-light p-6"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
                {badges.map((badge) => (
                  <div key={badge.id} className="text-center">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3 bg-gold/20 text-amber-700">
                      <Star className="w-10 h-10" />
                    </div>
                    <p className="font-medium text-gray-dark">{badge.name}</p>
                    <p className="text-sm text-gray-medium">{badge.description || 'Badge obtenu'}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="challenges">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {myChallenges.map((challenge) => (
                <div key={challenge.id} className="bg-white rounded-xl border border-gray-light p-6">
                  <h4 className="font-serif font-semibold text-gray-dark mb-2">{challenge.title}</h4>
                  <p className="text-sm text-gray-medium mb-4">{challenge.description}</p>
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-medium">Objectif</span>
                      <span className="font-medium text-forest">{challenge.target_value}</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                  <Button size="sm" className="w-full bg-forest hover:bg-forest-dark text-white">
                    Continuer
                  </Button>
                </div>
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
