import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Trophy,
  BookOpen,
  MessageSquare,
  Heart,
  Share2,
  Plus,
  Clock,
  Target,
  Award,
  Star,
  ChevronRight,
  Image as ImageIcon,
  MoreHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Badge as UserBadge, Book, ReadingChallenge, ReadingClub, User } from '@/types';
import { booksApi, challengesApi, clubsApi, discussionsApi, leaderboardApi, socialApi, userApi } from '@/services/api';
import { toast } from 'sonner';

interface SocialPageProps {
  user: User | null;
}

interface FeedActivity {
  id: string | number;
  user: User;
  book: Book;
  action: string;
  time: string;
  likes: number;
  comments: number;
}

const formatFeedTime = (timestamp?: string) => {
  if (!timestamp) {
    return 'Recent';
  }

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return 'Recent';
  }

  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
  });
};

// User Profile Card - Modernized
const UserProfileCard = ({
  user,
  index,
  isFollowing,
  isLoading,
  onToggleFollow,
  isCurrentUser,
}: {
  user: User;
  index: number;
  isFollowing: boolean;
  isLoading: boolean;
  onToggleFollow: (user: User) => void;
  isCurrentUser: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4, delay: index * 0.1 }}
    className="group flex items-center gap-4 bg-white rounded-2xl p-4 border border-gray-100 hover:border-gold/50 hover:shadow-xl hover:shadow-gold/5 transition-all duration-300"
  >
    <div className="relative">
      <div className="absolute inset-0 bg-gold rounded-full blur opacity-0 group-hover:opacity-40 transition-opacity" />
      <Avatar className="w-14 h-14 border-2 border-white shadow-sm relative z-10">
        <AvatarImage src={user.avatar} alt={user.first_name} className="object-cover" />
        <AvatarFallback className="bg-forest text-white font-bold">
          {user.first_name[0]}
          {user.last_name[0]}
        </AvatarFallback>
      </Avatar>
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="font-bold text-gray-900 group-hover:text-forest transition-colors truncate">
        {user.first_name} {user.last_name}
      </h4>
      <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{user.bio}</p>
      <div className="flex items-center gap-2 mt-2 text-xs font-medium text-gray-400">
        <Users className="w-3.5 h-3.5 text-forest" />
        Lecteur actif
      </div>
    </div>
    <Button
      size="sm"
      variant="outline"
      disabled={isLoading || isCurrentUser}
      onClick={() => onToggleFollow(user)}
      className="rounded-full border-gray-200 text-gray-700 hover:bg-forest hover:text-white hover:border-forest transition-all"
    >
      {isCurrentUser ? 'Vous' : isFollowing ? 'Suivi' : 'Suivre'}
    </Button>
  </motion.div>
);

// Challenge Card - Premium Design
const ChallengeCard = ({
  challenge,
  index,
  isJoined,
  isLoading,
  onToggleJoin,
  onShowLeaderboard,
  isLeaderboardLoading,
}: {
  challenge: ReadingChallenge;
  index: number;
  isJoined: boolean;
  isLoading: boolean;
  onToggleJoin: (challenge: ReadingChallenge) => void;
  onShowLeaderboard: (challenge: ReadingChallenge) => void;
  isLeaderboardLoading: boolean;
}) => {
  const progress = Math.min(100, Math.round((challenge.participants_count / Math.max(challenge.target_value, 1)) * 10));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-forest/10 hover:-translate-y-1 transition-all duration-300"
    >
      <div className="h-36 bg-gradient-to-br from-gray-900 via-forest to-forest-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-700">
          <Trophy className="w-20 h-20 text-white/10" />
        </div>
        <div className="absolute top-4 right-4">
          <Badge className="bg-white/20 backdrop-blur-md text-white border-none shadow-sm">
            <Target className="w-3.5 h-3.5 mr-1.5" />
            {challenge.challenge_type === 'livres_par_periode' ? 'Lecture' : 'Decouverte'}
          </Badge>
        </div>
      </div>
      <div className="p-6">
        <h4 className="font-serif text-xl font-bold text-gray-900 mb-1 group-hover:text-forest transition-colors">{challenge.title}</h4>
        <p className="text-sm text-gray-500 mb-5 font-medium">
          Objectif : <span className="text-gray-900">{challenge.target_value}</span>
        </p>

        <div className="mb-6 bg-gray-50 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium text-gray-500">Participants</span>
            <span className="font-bold text-forest">{challenge.participants_count}</span>
          </div>
          <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-forest to-green-400 rounded-full relative"
            >
              <div className="absolute inset-0 bg-white/20 w-full animate-pulse" />
            </motion.div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-gray-500">Jusqu'au {new Date(challenge.ends_at).toLocaleDateString('fr-FR')}</span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={isLeaderboardLoading}
              onClick={() => onShowLeaderboard(challenge)}
              className="rounded-xl px-4"
            >
              Classement
            </Button>
            <Button
              size="sm"
              disabled={isLoading}
              onClick={() => onToggleJoin(challenge)}
              className="rounded-xl bg-gray-900 hover:bg-forest text-white transition-colors px-6"
            >
              {isJoined ? 'Quitter' : 'Rejoindre'}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Book Club Card
const BookClubCard = ({
  club,
  index,
  isJoined,
  isLoading,
  onToggleJoin,
  onOpenDiscussions,
  isDiscussionLoading,
}: {
  club: ReadingClub;
  index: number;
  isJoined: boolean;
  isLoading: boolean;
  onToggleJoin: (club: ReadingClub) => void;
  onOpenDiscussions: (club: ReadingClub) => void;
  isDiscussionLoading: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: index * 0.1 }}
    className="group flex flex-col sm:flex-row gap-5 bg-white rounded-3xl p-5 border border-gray-100 hover:shadow-xl hover:shadow-gold/5 transition-all duration-300"
  >
    <div className="relative w-full sm:w-28 h-40 sm:h-28 rounded-2xl overflow-hidden flex-shrink-0">
      <img src={club.cover_image} alt={club.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
    </div>
    <div className="flex-1 min-w-0 flex flex-col justify-center">
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-forest transition-colors">{club.name}</h4>
        <Badge variant="outline" className="border-gold text-gold bg-gold/5 whitespace-nowrap hidden sm:flex">
          Club Actif
        </Badge>
      </div>
      <p className="text-sm text-gray-500 line-clamp-2 mt-2 mb-4 leading-relaxed">{club.description}</p>

      <div className="flex flex-wrap items-center justify-between gap-2 mt-auto">
        <span className="flex items-center gap-1.5 text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
          <Users className="w-4 h-4 text-forest" />
          {club.members_count} membres
        </span>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            size="sm"
            variant="outline"
            disabled={isDiscussionLoading}
            onClick={() => onOpenDiscussions(club)}
            className="rounded-xl px-4 flex-1 sm:flex-none"
          >
            Discussions
          </Button>
          <Button
            size="sm"
            disabled={isLoading}
            onClick={() => onToggleJoin(club)}
            className="rounded-xl bg-forest hover:bg-forest-dark text-white px-6 flex-1 sm:flex-none"
          >
            {isJoined ? 'Quitter le club' : 'Rejoindre le club'}
          </Button>
        </div>
      </div>
    </div>
  </motion.div>
);

// Community Feed Item - Modern Social Media Style
const FeedItem = ({ activity, index }: { activity: FeedActivity; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: index * 0.1 }}
    className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-3">
        <Avatar className="w-12 h-12 border border-gray-100 shadow-sm">
          <AvatarImage src={activity.user.avatar} className="object-cover" />
          <AvatarFallback className="bg-forest text-white font-bold">
            {activity.user.first_name[0]}
            {activity.user.last_name[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm text-gray-600">
            <span className="font-bold text-gray-900 hover:underline cursor-pointer">
              {activity.user.first_name} {activity.user.last_name}
            </span>{' '}
            {activity.action}
          </p>
          <p className="text-xs font-medium text-gray-400 mt-0.5 flex items-center gap-1">
            <Clock className="w-3 h-3" /> {activity.time}
          </p>
        </div>
      </div>
      <button className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-50 transition-colors">
        <MoreHorizontal className="w-5 h-5" />
      </button>
    </div>

    {/* Book Reference Card */}
    <div className="ml-0 sm:ml-15 mt-2 bg-gray-50 rounded-2xl p-4 flex gap-4 hover:bg-gray-100 transition-colors cursor-pointer border border-gray-100">
      <img src={activity.book.cover_image} alt={activity.book.title} className="w-16 h-24 object-cover rounded-lg shadow-sm" />
      <div className="flex flex-col justify-center">
        <h5 className="font-bold text-gray-900 line-clamp-1">{activity.book.title}</h5>
        <p className="text-sm text-gray-500 mb-2">{activity.book.author_name}</p>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-gold fill-gold" />
          <span className="text-xs font-bold text-gray-700">{activity.book.avg_rating}</span>
        </div>
      </div>
    </div>

    <div className="flex items-center gap-6 mt-5 ml-0 sm:ml-15 pt-4 border-t border-gray-50">
      <button className="group flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-pink-600 transition-colors">
        <div className="p-2 rounded-full group-hover:bg-pink-50 transition-colors">
          <Heart className="w-5 h-5 group-hover:fill-pink-200" />
        </div>
        {activity.likes}
      </button>
      <button className="group flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-forest transition-colors">
        <div className="p-2 rounded-full group-hover:bg-forest/10 transition-colors">
          <MessageSquare className="w-5 h-5" />
        </div>
        {activity.comments}
      </button>
      <button className="group flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors ml-auto">
        <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
          <Share2 className="w-5 h-5" />
        </div>
      </button>
    </div>
  </motion.div>
);

// Achievement Badge - Glossy Design
const AchievementBadge = ({ icon: Icon, name, description, unlocked }: { icon: any; name: string; description: string; unlocked: boolean }) => (
  <div
    className={`relative flex flex-col items-center p-5 rounded-2xl border transition-all duration-300 ${
      unlocked
        ? 'bg-gradient-to-b from-white to-gold/5 border-gold/20 shadow-lg shadow-gold/5 hover:-translate-y-1'
        : 'bg-gray-50 border-gray-100 opacity-60 grayscale hover:grayscale-0'
    }`}
  >
    <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 shadow-inner ${unlocked ? 'bg-gradient-to-br from-gold-light to-gold' : 'bg-gray-200'}`}>
      <Icon className={`w-7 h-7 ${unlocked ? 'text-white drop-shadow-md' : 'text-gray-400'}`} />
    </div>
    <p className={`text-sm font-bold text-center leading-tight mb-1 ${unlocked ? 'text-gray-900' : 'text-gray-400'}`}>{name}</p>
    <p className="text-xs font-medium text-gray-500 text-center">{description}</p>
    {unlocked && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />}
  </div>
);

export default function SocialPage({ user }: SocialPageProps) {
  const [activeTab, setActiveTab] = useState<'feed' | 'challenges' | 'clubs'>('feed');
  const [feedItems, setFeedItems] = useState<FeedActivity[]>([]);
  const [challenges, setChallenges] = useState<ReadingChallenge[]>([]);
  const [readingClubs, setReadingClubs] = useState<ReadingClub[]>([]);
  const [leaderboardReaders, setLeaderboardReaders] = useState<any[]>([]);
  const [authors, setAuthors] = useState<User[]>([]);
  const [userStats, setUserStats] = useState({
    booksRead: 0,
    readingHours: 0,
    pagesPerDay: 0,
  });
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [followedAuthorIds, setFollowedAuthorIds] = useState<Set<number>>(new Set());
  const [joinedChallengeIds, setJoinedChallengeIds] = useState<Set<number>>(new Set());
  const [joinedClubIds, setJoinedClubIds] = useState<Set<number>>(new Set());
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [selectedClubForDiscussions, setSelectedClubForDiscussions] = useState<ReadingClub | null>(null);
  const [clubDiscussions, setClubDiscussions] = useState<any[]>([]);
  const [clubMembers, setClubMembers] = useState<any[]>([]);
  const [selectedChallengeDetail, setSelectedChallengeDetail] = useState<ReadingChallenge | null>(null);
  const [challengeLeaderboard, setChallengeLeaderboard] = useState<any[]>([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  useEffect(() => {
    const loadSocialData = async () => {
      const hasToken = Boolean(localStorage.getItem('auth_token'));

      try {
        const [readerData, authorData, trendingBooks] = await Promise.all([
          leaderboardApi.getReaders(),
          leaderboardApi.getAuthors(),
          booksApi.getTrending(),
        ]);

        const [feedData, challengeData, clubData, followingData, followersData] = hasToken
          ? await Promise.all([socialApi.getFeed(), challengesApi.getAll(), clubsApi.getAll(), socialApi.getFollowing(), socialApi.getFollowers()])
          : [[], [], [], [], []];

        const mappedAuthors = authorData
          .map((entry: any) => entry?.user)
          .filter((author: User | undefined): author is User => Boolean(author));

        const mappedFeed = (feedData || [])
          .map((item: any, index: number) => ({
            id: item?.id ?? `${item?.user?.id ?? 'user'}-${item?.book?.id ?? index}`,
            user: item?.user,
            book: item?.book,
            action: item?.action ?? 'a partage une lecture',
            time: formatFeedTime(item?.created_at),
            likes: Number(item?.likes_count ?? item?.likes ?? 0),
            comments: Number(item?.comments_count ?? item?.comments ?? 0),
          }))
          .filter((item: any): item is FeedActivity => Boolean(item.user && item.book));

        const fallbackFeed = mappedAuthors.slice(0, 3).map((author, index) => ({
          id: `fallback-${author.id}-${index}`,
          user: author,
          book: trendingBooks[index % Math.max(trendingBooks.length, 1)],
          action: 'a recommande',
          time: 'Recent',
          likes: 0,
          comments: 0,
        })).filter((item) => Boolean(item.book));

        setFeedItems(mappedFeed.length > 0 ? mappedFeed : fallbackFeed);
        setChallenges(challengeData);
        setReadingClubs(clubData);
        setLeaderboardReaders(readerData);
        setAuthors(mappedAuthors);
        setFollowedAuthorIds(new Set((followingData || []).map((followedUser) => followedUser.id)));
        setFollowingCount((followingData || []).length);
        setFollowersCount((followersData || []).length);
        setJoinedChallengeIds(
          new Set(
            (challengeData || [])
              .filter((challenge: any) => Boolean(challenge?.is_joined || challenge?.joined || challenge?.user_participation))
              .map((challenge) => challenge.id)
          )
        );
        setJoinedClubIds(
          new Set(
            (clubData || [])
              .filter((club: any) => Boolean(club?.is_member || club?.is_joined || club?.joined))
              .map((club) => club.id)
          )
        );
      } catch (error) {
        setFeedItems([]);
        setChallenges([]);
        setReadingClubs([]);
        setLeaderboardReaders([]);
        setAuthors([]);
        setFollowedAuthorIds(new Set());
        setJoinedChallengeIds(new Set());
        setJoinedClubIds(new Set());
        setFollowersCount(0);
        setFollowingCount(0);
      }
    };

    loadSocialData();
  }, []);

  useEffect(() => {
    const loadUserStats = async () => {
      if (!user) {
        setUserStats({ booksRead: 0, readingHours: 0, pagesPerDay: 0 });
        setUserBadges([]);
        return;
      }

      try {
        const [stats, badges] = await Promise.all([userApi.getStats(), userApi.getBadges()]);
        setUserStats({
          booksRead: Number(stats.books_read ?? stats.completed_books ?? 0),
          readingHours: Number(
            stats.reading_hours ??
              (stats.total_seconds_read ? Math.round(Number(stats.total_seconds_read) / 3600) : 0)
          ),
          pagesPerDay: Number(stats.pages_per_day ?? 0),
        });
        setUserBadges(badges);
      } catch (error) {
        setUserStats({ booksRead: 0, readingHours: 0, pagesPerDay: 0 });
        setUserBadges([]);
      }
    };

    loadUserStats();
  }, [user]);

  const requireAuth = () => {
    if (!user) {
      toast.error('Connectez-vous pour utiliser cette fonctionnalite.');
      return false;
    }
    return true;
  };

  const handleToggleFollow = async (author: User) => {
    if (!requireAuth()) return;
    if (author.id === user?.id) return;

    const actionKey = `follow-${author.id}`;
    if (pendingAction === actionKey) return;

    const isFollowing = followedAuthorIds.has(author.id);
    setPendingAction(actionKey);

    try {
      if (isFollowing) {
        await socialApi.unfollow(author.id);
        setFollowedAuthorIds((prev) => {
          const next = new Set(prev);
          next.delete(author.id);
          return next;
        });
        toast.success('Utilisateur retire de vos abonnements.');
      } else {
        await socialApi.follow(author.id);
        setFollowedAuthorIds((prev) => new Set(prev).add(author.id));
        toast.success('Utilisateur suivi avec succes.');
      }
    } catch (error) {
      toast.error('Action impossible pour le moment.');
    } finally {
      setPendingAction(null);
    }
  };

  const handleToggleChallenge = async (challenge: ReadingChallenge) => {
    if (!requireAuth()) return;

    const actionKey = `challenge-${challenge.id}`;
    if (pendingAction === actionKey) return;

    const isJoined = joinedChallengeIds.has(challenge.id);
    setPendingAction(actionKey);

    try {
      if (isJoined) {
        await challengesApi.leave(challenge.id);
        setJoinedChallengeIds((prev) => {
          const next = new Set(prev);
          next.delete(challenge.id);
          return next;
        });
        setChallenges((prev) =>
          prev.map((item) =>
            item.id === challenge.id
              ? { ...item, participants_count: Math.max(0, item.participants_count - 1) }
              : item
          )
        );
        toast.success('Vous avez quitte le defi.');
      } else {
        await challengesApi.join(challenge.id);
        setJoinedChallengeIds((prev) => new Set(prev).add(challenge.id));
        setChallenges((prev) =>
          prev.map((item) =>
            item.id === challenge.id
              ? { ...item, participants_count: item.participants_count + 1 }
              : item
          )
        );
        toast.success('Defi rejoint avec succes.');
      }
    } catch (error) {
      toast.error('Impossible de mettre a jour ce defi.');
    } finally {
      setPendingAction(null);
    }
  };

  const handleShowChallengeLeaderboard = async (challenge: ReadingChallenge) => {
    if (!requireAuth()) return;
    const actionKey = `challenge-board-${challenge.id}`;
    if (pendingAction === actionKey) return;
    setPendingAction(actionKey);
    try {
      const [detail, leaderboard] = await Promise.all([
        challengesApi.getById(challenge.id),
        challengesApi.getLeaderboard(challenge.id),
      ]);
      setSelectedChallengeDetail(detail);
      setChallengeLeaderboard(leaderboard);
      toast.success('Details du defi charges.');
    } catch (error) {
      toast.error('Impossible de charger le classement du defi.');
      setSelectedChallengeDetail(challenge);
      setChallengeLeaderboard([]);
    } finally {
      setPendingAction(null);
    }
  };

  const handleToggleClub = async (club: ReadingClub) => {
    if (!requireAuth()) return;

    const actionKey = `club-${club.id}`;
    if (pendingAction === actionKey) return;

    const isJoined = joinedClubIds.has(club.id);
    setPendingAction(actionKey);

    try {
      if (isJoined) {
        await clubsApi.leave(club.id);
        setJoinedClubIds((prev) => {
          const next = new Set(prev);
          next.delete(club.id);
          return next;
        });
        setReadingClubs((prev) =>
          prev.map((item) =>
            item.id === club.id
              ? { ...item, members_count: Math.max(0, item.members_count - 1) }
              : item
          )
        );
        toast.success('Vous avez quitte ce club.');
      } else {
        await clubsApi.join(club.id);
        setJoinedClubIds((prev) => new Set(prev).add(club.id));
        setReadingClubs((prev) =>
          prev.map((item) =>
            item.id === club.id
              ? { ...item, members_count: item.members_count + 1 }
              : item
          )
        );
        toast.success('Vous avez rejoint ce club.');
      }
    } catch (error) {
      toast.error('Impossible de mettre a jour ce club.');
    } finally {
      setPendingAction(null);
    }
  };

  const handleCreateClub = async () => {
    if (!requireAuth()) return;

    const name = window.prompt('Nom du club:');
    if (!name || !name.trim()) return;

    const description = window.prompt('Description du club (optionnel):') || '';
    const actionKey = 'create-club';
    if (pendingAction === actionKey) return;

    setPendingAction(actionKey);
    try {
      const createdClub = await clubsApi.create({
        name: name.trim(),
        description: description.trim() || undefined,
        is_private: false,
      });
      setReadingClubs((prev) => [createdClub, ...prev]);
      setJoinedClubIds((prev) => new Set(prev).add(createdClub.id));
      setActiveTab('clubs');
      toast.success('Club cree avec succes.');
    } catch (error) {
      toast.error('Impossible de creer le club.');
    } finally {
      setPendingAction(null);
    }
  };

  const handleRefreshClubDetail = async () => {
    if (!selectedClubForDiscussions || !requireAuth()) return;
    const actionKey = `club-detail-${selectedClubForDiscussions.id}`;
    if (pendingAction === actionKey) return;
    setPendingAction(actionKey);
    try {
      const detail = await clubsApi.getBySlug(selectedClubForDiscussions.slug);
      setSelectedClubForDiscussions(detail);
      toast.success('Details du club charges.');
    } catch (error) {
      toast.error('Chargement detail club impossible.');
    } finally {
      setPendingAction(null);
    }
  };

  const handleUpdateSelectedClub = async () => {
    if (!selectedClubForDiscussions || !requireAuth()) return;
    const name = window.prompt('Nouveau nom du club', selectedClubForDiscussions.name);
    if (!name || !name.trim()) return;

    const actionKey = `club-update-${selectedClubForDiscussions.id}`;
    if (pendingAction === actionKey) return;
    setPendingAction(actionKey);
    try {
      const updated = await clubsApi.update(selectedClubForDiscussions.id, { name: name.trim() });
      setSelectedClubForDiscussions(updated);
      setReadingClubs((prev) => prev.map((club) => (club.id === updated.id ? updated : club)));
      toast.success('Club mis a jour.');
    } catch (error) {
      toast.error('Mise a jour club impossible.');
    } finally {
      setPendingAction(null);
    }
  };

  const handleDeleteSelectedClub = async () => {
    if (!selectedClubForDiscussions || !requireAuth()) return;
    if (!window.confirm('Supprimer ce club ?')) return;

    const actionKey = `club-delete-${selectedClubForDiscussions.id}`;
    if (pendingAction === actionKey) return;
    setPendingAction(actionKey);
    try {
      await clubsApi.delete(selectedClubForDiscussions.id);
      setReadingClubs((prev) => prev.filter((club) => club.id !== selectedClubForDiscussions.id));
      setClubDiscussions([]);
      setClubMembers([]);
      setSelectedClubForDiscussions(null);
      toast.success('Club supprime.');
    } catch (error) {
      toast.error('Suppression club impossible.');
    } finally {
      setPendingAction(null);
    }
  };

  const handleOpenDiscussions = async (club: ReadingClub) => {
    if (!requireAuth()) return;

    const actionKey = `discussions-${club.id}`;
    if (pendingAction === actionKey) return;
    setPendingAction(actionKey);

    try {
      const discussions = await discussionsApi.getAll(club.id);
      setSelectedClubForDiscussions(club);
      setClubDiscussions(discussions);
    } catch (error) {
      toast.error('Impossible de charger les discussions du club.');
      setSelectedClubForDiscussions(club);
      setClubDiscussions([]);
    } finally {
      setPendingAction(null);
    }
  };

  const handleCreateDiscussion = async () => {
    if (!selectedClubForDiscussions || !requireAuth()) return;
    const title = window.prompt('Titre de la discussion');
    if (!title || !title.trim()) return;
    const content = window.prompt('Contenu') || '';
    if (!content.trim()) return;

    const actionKey = `create-discussion-${selectedClubForDiscussions.id}`;
    if (pendingAction === actionKey) return;
    setPendingAction(actionKey);

    try {
      const created = await discussionsApi.create(selectedClubForDiscussions.id, {
        title: title.trim(),
        content: content.trim(),
      });
      setClubDiscussions((prev) => [created, ...prev]);
      toast.success('Discussion creee.');
    } catch (error) {
      toast.error('Creation de discussion impossible.');
    } finally {
      setPendingAction(null);
    }
  };

  const handleReplyDiscussion = async (discussionId: number) => {
    if (!selectedClubForDiscussions || !requireAuth()) return;
    const content = window.prompt('Votre reponse');
    if (!content || !content.trim()) return;

    const actionKey = `reply-discussion-${discussionId}`;
    if (pendingAction === actionKey) return;
    setPendingAction(actionKey);
    try {
      await discussionsApi.createReply(selectedClubForDiscussions.id, discussionId, { content: content.trim() });
      toast.success('Reponse publiee.');
      await handleOpenDiscussions(selectedClubForDiscussions);
    } catch (error) {
      toast.error('Impossible de publier la reponse.');
    } finally {
      setPendingAction(null);
    }
  };

  const handleDeleteDiscussion = async (discussionId: number) => {
    if (!selectedClubForDiscussions || !requireAuth()) return;
    if (!window.confirm('Supprimer cette discussion ?')) return;

    const actionKey = `delete-discussion-${discussionId}`;
    if (pendingAction === actionKey) return;
    setPendingAction(actionKey);
    try {
      await discussionsApi.delete(selectedClubForDiscussions.id, discussionId);
      setClubDiscussions((prev) => prev.filter((item) => item.id !== discussionId));
      toast.success('Discussion supprimee.');
    } catch (error) {
      toast.error('Suppression impossible.');
    } finally {
      setPendingAction(null);
    }
  };

  const handleShowDiscussionDetail = async (discussionId: number) => {
    if (!selectedClubForDiscussions || !requireAuth()) return;
    const actionKey = `discussion-detail-${discussionId}`;
    if (pendingAction === actionKey) return;
    setPendingAction(actionKey);
    try {
      const detail = await discussionsApi.getById(selectedClubForDiscussions.id, discussionId);
      toast.success(`Discussion: ${detail?.title ?? discussionId}`);
    } catch (error) {
      toast.error('Detail discussion indisponible.');
    } finally {
      setPendingAction(null);
    }
  };

  const handleUpdateDiscussion = async (discussionId: number) => {
    if (!selectedClubForDiscussions || !requireAuth()) return;
    const content = window.prompt('Nouveau contenu');
    if (!content || !content.trim()) return;

    const actionKey = `discussion-update-${discussionId}`;
    if (pendingAction === actionKey) return;
    setPendingAction(actionKey);
    try {
      await discussionsApi.update(selectedClubForDiscussions.id, discussionId, { content: content.trim() });
      toast.success('Discussion mise a jour.');
      await handleOpenDiscussions(selectedClubForDiscussions);
    } catch (error) {
      toast.error('Mise a jour discussion impossible.');
    } finally {
      setPendingAction(null);
    }
  };

  const handleUpdateReply = async (discussionId: number) => {
    if (!selectedClubForDiscussions || !requireAuth()) return;
    const replyId = Number(window.prompt('ID de la reponse'));
    const content = window.prompt('Nouveau contenu de reponse');
    if (!Number.isFinite(replyId) || !content || !content.trim()) return;

    const actionKey = `reply-update-${discussionId}-${replyId}`;
    if (pendingAction === actionKey) return;
    setPendingAction(actionKey);
    try {
      await discussionsApi.updateReply(selectedClubForDiscussions.id, discussionId, replyId, { content: content.trim() });
      toast.success('Reponse mise a jour.');
    } catch (error) {
      toast.error('Mise a jour reponse impossible.');
    } finally {
      setPendingAction(null);
    }
  };

  const handleDeleteReply = async (discussionId: number) => {
    if (!selectedClubForDiscussions || !requireAuth()) return;
    const replyId = Number(window.prompt('ID de la reponse a supprimer'));
    if (!Number.isFinite(replyId)) return;

    const actionKey = `reply-delete-${discussionId}-${replyId}`;
    if (pendingAction === actionKey) return;
    setPendingAction(actionKey);
    try {
      await discussionsApi.deleteReply(selectedClubForDiscussions.id, discussionId, replyId);
      toast.success('Reponse supprimee.');
    } catch (error) {
      toast.error('Suppression reponse impossible.');
    } finally {
      setPendingAction(null);
    }
  };

  const handleLoadClubMembers = async () => {
    if (!selectedClubForDiscussions || !requireAuth()) return;
    const actionKey = `members-${selectedClubForDiscussions.id}`;
    if (pendingAction === actionKey) return;
    setPendingAction(actionKey);
    try {
      const members = await clubsApi.getMembers(selectedClubForDiscussions.id);
      setClubMembers(members);
    } catch (error) {
      toast.error('Impossible de charger les membres du club.');
      setClubMembers([]);
    } finally {
      setPendingAction(null);
    }
  };

  const handleUpdateClubMemberRole = async () => {
    if (!selectedClubForDiscussions || !requireAuth()) return;
    const userId = Number(window.prompt('ID membre'));
    const role = window.prompt('Role (membre/moderateur/admin)');
    if (!Number.isFinite(userId) || !role) return;

    const actionKey = `member-role-${selectedClubForDiscussions.id}-${userId}`;
    if (pendingAction === actionKey) return;
    setPendingAction(actionKey);
    try {
      await clubsApi.updateMemberRole(selectedClubForDiscussions.id, userId, role);
      toast.success('Role membre mis a jour.');
      await handleLoadClubMembers();
    } catch (error) {
      toast.error('Mise a jour du role impossible.');
    } finally {
      setPendingAction(null);
    }
  };

  const handleRemoveClubMember = async () => {
    if (!selectedClubForDiscussions || !requireAuth()) return;
    const userId = Number(window.prompt('ID membre a retirer'));
    if (!Number.isFinite(userId)) return;

    const actionKey = `member-remove-${selectedClubForDiscussions.id}-${userId}`;
    if (pendingAction === actionKey) return;
    setPendingAction(actionKey);
    try {
      await clubsApi.removeMember(selectedClubForDiscussions.id, userId);
      toast.success('Membre retire du club.');
      await handleLoadClubMembers();
    } catch (error) {
      toast.error('Suppression membre impossible.');
    } finally {
      setPendingAction(null);
    }
  };

  const handleAddClubBook = async () => {
    if (!selectedClubForDiscussions || !requireAuth()) return;
    const bookId = Number(window.prompt('ID du livre a ajouter'));
    if (!Number.isFinite(bookId)) return;

    const actionKey = `club-add-book-${selectedClubForDiscussions.id}-${bookId}`;
    if (pendingAction === actionKey) return;
    setPendingAction(actionKey);
    try {
      await clubsApi.addBook(selectedClubForDiscussions.id, bookId);
      toast.success('Livre ajoute au club.');
    } catch (error) {
      toast.error("Ajout du livre au club impossible.");
    } finally {
      setPendingAction(null);
    }
  };

  const handleRemoveClubBook = async () => {
    if (!selectedClubForDiscussions || !requireAuth()) return;
    const bookId = Number(window.prompt('ID du livre a retirer'));
    if (!Number.isFinite(bookId)) return;

    const actionKey = `club-remove-book-${selectedClubForDiscussions.id}-${bookId}`;
    if (pendingAction === actionKey) return;
    setPendingAction(actionKey);
    try {
      await clubsApi.removeBook(selectedClubForDiscussions.id, bookId);
      toast.success('Livre retire du club.');
    } catch (error) {
      toast.error('Retrait du livre impossible.');
    } finally {
      setPendingAction(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 selection:bg-forest selection:text-white pb-20">
      {/* Header Premium */}
      <div className="relative bg-white border-b border-gray-200 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-forest/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/3" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-gold/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/4" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-4">
              <Link to="/" className="hover:text-forest transition-colors">
                Accueil
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-forest">Communaute</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <h1 className="font-serif text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">Reseau de Lecture</h1>
                <p className="text-gray-500 mt-2 text-lg">Partagez vos lectures, rejoignez des clubs et relevez des defis.</p>
              </div>
              <Button
                onClick={handleCreateClub}
                disabled={pendingAction === 'create-club'}
                className="bg-gray-900 hover:bg-forest text-white rounded-xl px-6 py-6 text-md shadow-xl shadow-gray-900/10 transition-all hover:scale-105"
              >
                <Plus className="w-5 h-5 mr-2" />
                Creer un Club
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Tabs */}
        <div className="flex items-center mb-10 overflow-x-auto pb-2 scrollbar-hide">
          <div className="inline-flex bg-white p-1.5 rounded-full border border-gray-200 shadow-sm min-w-max">
            {[
              { id: 'feed', label: "Fil d'Actualite", icon: MessageSquare },
              { id: 'challenges', label: 'Defis & Objectifs', icon: Trophy },
              { id: 'clubs', label: 'Clubs de Lecture', icon: Users },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'feed' | 'challenges' | 'clubs')}
                className={`relative flex items-center gap-2 px-6 sm:px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                  activeTab === tab.id ? 'text-white shadow-md' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {activeTab === tab.id && <motion.div layoutId="activeSocialTab" className="absolute inset-0 bg-forest rounded-full" />}
                <span className="relative z-10 flex items-center gap-2">
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {activeTab === 'feed' && (
                <motion.div
                  key="feed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Create Post Box */}
                  <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-sm">
                    <div className="flex gap-4">
                      <Avatar className="w-12 h-12 shadow-sm">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="bg-forest text-white font-bold">
                          {user?.first_name?.[0] || 'U'}
                          {user?.last_name?.[0] || 'S'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <textarea
                          placeholder="Partagez votre lecture du moment..."
                          className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-forest/20 text-gray-700 resize-none min-h-[100px] transition-all"
                        />
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-1">
                            <button className="p-2.5 text-gray-400 hover:text-forest hover:bg-forest/10 rounded-full transition-colors tooltip-trigger">
                              <BookOpen className="w-5 h-5" />
                            </button>
                            <button className="p-2.5 text-gray-400 hover:text-forest hover:bg-forest/10 rounded-full transition-colors">
                              <ImageIcon className="w-5 h-5" />
                            </button>
                          </div>
                          <Button className="rounded-xl bg-forest hover:bg-forest-dark text-white px-8 shadow-md shadow-forest/20">Publier</Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Feed Items */}
                  <div className="space-y-6">
                    {feedItems.map((activity, index) => (
                      <FeedItem key={activity.id} activity={activity} index={index} />
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'challenges' && (
                <motion.div
                  key="challenges"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                >
	                  {challenges.map((challenge, index) => (
	                    <ChallengeCard
                      key={challenge.id}
                      challenge={challenge}
                      index={index}
                      isJoined={joinedChallengeIds.has(challenge.id)}
                      isLoading={pendingAction === `challenge-${challenge.id}`}
                      onToggleJoin={handleToggleChallenge}
                      onShowLeaderboard={handleShowChallengeLeaderboard}
	                      isLeaderboardLoading={pendingAction === `challenge-board-${challenge.id}`}
	                    />
	                  ))}
                    {selectedChallengeDetail && (
                      <div className="sm:col-span-2 bg-white border border-gray-100 rounded-3xl p-6">
                        <h4 className="font-serif text-xl font-bold text-gray-900 mb-2">
                          Classement - {selectedChallengeDetail.title}
                        </h4>
                        {challengeLeaderboard.length === 0 ? (
                          <p className="text-sm text-gray-500">Aucune donnee de classement.</p>
                        ) : (
                          <div className="space-y-2">
                            {challengeLeaderboard.slice(0, 10).map((entry: any, index: number) => (
                              <div key={entry?.user?.id ?? index} className="flex items-center justify-between border border-gray-100 rounded-lg p-3">
                                <span className="text-sm font-medium text-gray-700">
                                  {entry?.user?.username ?? `Participant ${index + 1}`}
                                </span>
                                <span className="text-sm font-bold text-forest">
                                  {entry?.score ?? entry?.value ?? 0}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
	                </motion.div>
	              )}

              {activeTab === 'clubs' && (
                <motion.div
                  key="clubs"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 gap-6">
                    {readingClubs.map((club, index) => (
                      <BookClubCard
                        key={club.id}
                        club={club}
                        index={index}
                        isJoined={joinedClubIds.has(club.id)}
                        isLoading={pendingAction === `club-${club.id}`}
                        onToggleJoin={handleToggleClub}
                        onOpenDiscussions={handleOpenDiscussions}
                        isDiscussionLoading={pendingAction === `discussions-${club.id}`}
                      />
                    ))}
                  </div>

                  {selectedClubForDiscussions && (
                    <div className="bg-white border border-gray-100 rounded-3xl p-6 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <h4 className="font-serif text-xl font-bold text-gray-900">
                          Discussions - {selectedClubForDiscussions.name}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenDiscussions(selectedClubForDiscussions)}
                            disabled={pendingAction === `discussions-${selectedClubForDiscussions.id}`}
                          >
                            Rafraichir
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleRefreshClubDetail}
                            disabled={pendingAction === `club-detail-${selectedClubForDiscussions.id}`}
                          >
                            Detail club
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleUpdateSelectedClub}>
                            MAJ club
                          </Button>
                          <Button size="sm" variant="destructive" onClick={handleDeleteSelectedClub}>
                            Supprimer club
                          </Button>
                          <Button
                            size="sm"
                            className="bg-forest hover:bg-forest-dark text-white"
                            onClick={handleCreateDiscussion}
                            disabled={pendingAction === `create-discussion-${selectedClubForDiscussions.id}`}
                          >
                            Nouvelle discussion
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleLoadClubMembers}
                            disabled={pendingAction === `members-${selectedClubForDiscussions.id}`}
                          >
                            Membres
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleUpdateClubMemberRole}>
                            Role membre
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleRemoveClubMember}>
                            Retirer membre
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleAddClubBook}>
                            Ajouter livre
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleRemoveClubBook}>
                            Retirer livre
                          </Button>
                        </div>
                      </div>

                      {clubMembers.length > 0 && (
                        <div className="bg-gray-50 rounded-xl p-3">
                          <p className="text-xs font-medium text-gray-500 mb-2">Membres ({clubMembers.length})</p>
                          <div className="flex flex-wrap gap-2">
                            {clubMembers.slice(0, 8).map((member: any, idx: number) => (
                              <span key={member?.id ?? idx} className="text-xs bg-white border border-gray-200 rounded-full px-2 py-1">
                                {(member?.user?.username ?? member?.username ?? `user-${idx}`)} {member?.role ? `(${member.role})` : ''}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {clubDiscussions.length === 0 ? (
                        <p className="text-sm text-gray-500">Aucune discussion pour le moment.</p>
                      ) : (
                        <div className="space-y-3">
                          {clubDiscussions.map((discussion) => (
                            <div key={discussion.id} className="border border-gray-100 rounded-xl p-4">
                              <p className="font-medium text-gray-900">{discussion.title}</p>
                              <p className="text-sm text-gray-600 mt-1">{discussion.content}</p>
                              <div className="flex gap-2 mt-3">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleShowDiscussionDetail(Number(discussion.id))}
                                  disabled={pendingAction === `discussion-detail-${discussion.id}`}
                                >
                                  Detail
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUpdateDiscussion(Number(discussion.id))}
                                  disabled={pendingAction === `discussion-update-${discussion.id}`}
                                >
                                  Modifier
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleReplyDiscussion(Number(discussion.id))}
                                  disabled={pendingAction === `reply-discussion-${discussion.id}`}
                                >
                                  Repondre
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUpdateReply(Number(discussion.id))}
                                  disabled={pendingAction?.startsWith(`reply-update-${discussion.id}-`)}
                                >
                                  MAJ reponse
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDeleteReply(Number(discussion.id))}
                                  disabled={pendingAction?.startsWith(`reply-delete-${discussion.id}-`)}
                                >
                                  Suppr reponse
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeleteDiscussion(Number(discussion.id))}
                                  disabled={pendingAction === `delete-discussion-${discussion.id}`}
                                >
                                  Supprimer
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            {/* User Stats Card */}
            {user && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-forest/5 rounded-full blur-2xl group-hover:bg-forest/10 transition-colors" />
                <h3 className="font-serif text-2xl font-bold text-gray-900 mb-6 relative z-10">Votre Parcours</h3>
                <div className="grid grid-cols-2 gap-4 relative z-10">
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <BookOpen className="w-6 h-6 text-forest mb-2" />
                    <p className="text-3xl font-extrabold text-gray-900">{userStats.booksRead}</p>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-1">Livres lus</p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <Clock className="w-6 h-6 text-gold mb-2" />
                    <p className="text-3xl font-extrabold text-gray-900">
                      {userStats.readingHours}
                      <span className="text-xl">h</span>
                    </p>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-1">De lecture</p>
                  </div>
                  <div className="col-span-2 bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-extrabold text-gray-900">{userStats.pagesPerDay}</p>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Pages / jour</p>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center">
                      <Target className="w-6 h-6 text-blue-500" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-2xl font-bold text-gray-900">Trophees</h3>
                <span className="text-sm font-bold text-forest bg-forest/10 px-3 py-1 rounded-full">
                  {userBadges.length}/3
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Star, name: userBadges[0]?.name ?? 'Badge 1', description: userBadges[0]?.description ?? 'A venir', unlocked: Boolean(userBadges[0]) },
                  { icon: Clock, name: userBadges[1]?.name ?? 'Badge 2', description: userBadges[1]?.description ?? 'A venir', unlocked: Boolean(userBadges[1]) },
                  { icon: Award, name: userBadges[2]?.name ?? 'Badge 3', description: userBadges[2]?.description ?? 'A venir', unlocked: Boolean(userBadges[2]) },
                ].map((badge) => (
                  <AchievementBadge
                    key={badge.name}
                    icon={badge.icon}
                    name={badge.name}
                    description={badge.description}
                    unlocked={badge.unlocked}
                  />
                ))}
              </div>
            </motion.div>

            {/* Top Readers Leaderboard */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm"
            >
              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-6">Top Lecteurs</h3>
              <div className="space-y-4">
                {leaderboardReaders.slice(0, 5).map((entry, index) => {
                  let rankStyle = 'bg-gray-100 text-gray-500 font-bold';
                  if (index === 0) rankStyle = 'bg-gradient-to-br from-yellow-300 to-yellow-500 text-white shadow-md shadow-yellow-500/30';
                  if (index === 1) rankStyle = 'bg-gradient-to-br from-gray-300 to-gray-400 text-white shadow-md shadow-gray-400/30';
                  if (index === 2) rankStyle = 'bg-gradient-to-br from-orange-300 to-orange-500 text-white shadow-md shadow-orange-500/30';

                  const leaderboardUser: User | undefined = entry?.user;
                  if (!leaderboardUser) {
                    return null;
                  }

                  return (
                    <div key={leaderboardUser.id} className="flex items-center gap-4 group p-2 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${rankStyle}`}>{entry.rank ?? index + 1}</div>
                      <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
                        <AvatarImage src={leaderboardUser.avatar} className="object-cover" />
                        <AvatarFallback className="bg-forest text-white text-xs">
                          {leaderboardUser.first_name[0]}
                          {leaderboardUser.last_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate group-hover:text-forest transition-colors">
                          {leaderboardUser.first_name} {leaderboardUser.last_name}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <BookOpen className="w-3 h-3" /> {entry.books_read ?? 0} livres
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Button variant="outline" className="w-full mt-6 rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all">
                Voir le classement complet
              </Button>
            </motion.div>

            {/* Suggested Users */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm"
            >
              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-6">Suggestions</h3>
              <p className="text-xs text-gray-500 mb-4">
                Abonnes: {followingCount} | Followers: {followersCount}
              </p>
              <div className="space-y-4">
                {authors.slice(0, 3).map((author, index) => (
                  <UserProfileCard
                    key={author.id}
                    user={author}
                    index={index}
                    isFollowing={followedAuthorIds.has(author.id)}
                    isLoading={pendingAction === `follow-${author.id}`}
                    onToggleFollow={handleToggleFollow}
                    isCurrentUser={author.id === user?.id}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
