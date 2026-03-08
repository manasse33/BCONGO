import { useState } from 'react';
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
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { authors, challenges, readingClubs, leaderboardData, books } from '@/data/mockData';
import type { User, ReadingChallenge, ReadingClub } from '@/types';

interface SocialPageProps {
  user: User | null;
}

// User Profile Card - Modernized
const UserProfileCard = ({ user, index }: { user: User; index: number }) => (
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
          {user.first_name[0]}{user.last_name[0]}
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
        {Math.floor(Math.random() * 500 + 100)} abonnés
      </div>
    </div>
    <Button size="sm" variant="outline" className="rounded-full border-gray-200 text-gray-700 hover:bg-forest hover:text-white hover:border-forest transition-all">
      Suivre
    </Button>
  </motion.div>
);

// Challenge Card - Premium Design
const ChallengeCard = ({ challenge, index }: { challenge: ReadingChallenge; index: number }) => {
  const progress = Math.floor(Math.random() * 60 + 20);
  
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
            {challenge.challenge_type === 'livres_par_periode' ? 'Lecture' : 'Découverte'}
          </Badge>
        </div>
      </div>
      <div className="p-6">
        <h4 className="font-serif text-xl font-bold text-gray-900 mb-1 group-hover:text-forest transition-colors">
          {challenge.title}
        </h4>
        <p className="text-sm text-gray-500 mb-5 font-medium">
          Objectif : <span className="text-gray-900">{challenge.target_value} {challenge.challenge_type === 'livres_par_periode' ? 'livres' : 'auteurs'}</span>
        </p>
        
        <div className="mb-6 bg-gray-50 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium text-gray-500">Votre progression</span>
            <span className="font-bold text-forest">{progress}%</span>
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
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" />
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
              +{challenge.participants_count}
            </div>
          </div>
          <Button size="sm" className="rounded-xl bg-gray-900 hover:bg-forest text-white transition-colors px-6">
            Rejoindre
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

// Book Club Card
const BookClubCard = ({ club, index }: { club: ReadingClub; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: index * 0.1 }}
    className="group flex flex-col sm:flex-row gap-5 bg-white rounded-3xl p-5 border border-gray-100 hover:shadow-xl hover:shadow-gold/5 transition-all duration-300"
  >
    <div className="relative w-full sm:w-28 h-40 sm:h-28 rounded-2xl overflow-hidden flex-shrink-0">
      <img
        src={club.cover_image}
        alt={club.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
    </div>
    <div className="flex-1 min-w-0 flex flex-col justify-center">
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-forest transition-colors">{club.name}</h4>
        <Badge variant="outline" className="border-gold text-gold bg-gold/5 whitespace-nowrap hidden sm:flex">Club Actif</Badge>
      </div>
      <p className="text-sm text-gray-500 line-clamp-2 mt-2 mb-4 leading-relaxed">{club.description}</p>
      
      <div className="flex flex-wrap items-center justify-between gap-4 mt-auto">
        <span className="flex items-center gap-1.5 text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
          <Users className="w-4 h-4 text-forest" />
          {club.members_count} membres
        </span>
        <Button size="sm" className="rounded-xl bg-forest hover:bg-forest-dark text-white px-6 w-full sm:w-auto">
          Rejoindre le club
        </Button>
      </div>
    </div>
  </motion.div>
);

// Community Feed Item - Modern Social Media Style
const FeedItem = ({ index }: { index: number }) => {
  const activities = [
    { user: authors[0], action: 'a terminé de lire', book: books[0], time: 'Il y a 2h', likes: 24, comments: 5 },
    { user: authors[1], action: 'a adoré', book: books[1], time: 'Il y a 4h', likes: 112, comments: 18 },
    { user: authors[2], action: 'a commenté', book: books[2], time: 'Il y a 6h', likes: 8, comments: 2 },
  ];
  const activity = activities[index % activities.length];
  
  return (
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
              {activity.user.first_name[0]}{activity.user.last_name[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm text-gray-600">
              <span className="font-bold text-gray-900 hover:underline cursor-pointer">
                {activity.user.first_name} {activity.user.last_name}
              </span>
              {' '}{activity.action}
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
};

// Achievement Badge - Glossy Design
const AchievementBadge = ({ icon: Icon, name, description, unlocked }: { icon: any; name: string; description: string; unlocked: boolean }) => (
  <div className={`relative flex flex-col items-center p-5 rounded-2xl border transition-all duration-300 ${unlocked ? 'bg-gradient-to-b from-white to-gold/5 border-gold/20 shadow-lg shadow-gold/5 hover:-translate-y-1' : 'bg-gray-50 border-gray-100 opacity-60 grayscale hover:grayscale-0'}`}>
    <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 shadow-inner ${unlocked ? 'bg-gradient-to-br from-gold-light to-gold' : 'bg-gray-200'}`}>
      <Icon className={`w-7 h-7 ${unlocked ? 'text-white drop-shadow-md' : 'text-gray-400'}`} />
    </div>
    <p className={`text-sm font-bold text-center leading-tight mb-1 ${unlocked ? 'text-gray-900' : 'text-gray-400'}`}>{name}</p>
    <p className="text-xs font-medium text-gray-500 text-center">{description}</p>
    {unlocked && (
      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
    )}
  </div>
);

export default function SocialPage({ user }: SocialPageProps) {
  const [activeTab, setActiveTab] = useState<'feed' | 'challenges' | 'clubs'>('feed');

  return (
    <div className="min-h-screen bg-gray-50/50 selection:bg-forest selection:text-white pb-20">
      
      {/* Header Premium */}
      <div className="relative bg-white border-b border-gray-200 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-forest/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/3" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-gold/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/4" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-4">
              <Link to="/" className="hover:text-forest transition-colors">Accueil</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-forest">Communauté</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <h1 className="font-serif text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
                  Réseau de Lecture
                </h1>
                <p className="text-gray-500 mt-2 text-lg">Partagez vos lectures, rejoignez des clubs et relevez des défis.</p>
              </div>
              <Button className="bg-gray-900 hover:bg-forest text-white rounded-xl px-6 py-6 text-md shadow-xl shadow-gray-900/10 transition-all hover:scale-105">
                <Plus className="w-5 h-5 mr-2" />
                Créer un Club
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Tabs Modernes (Segmented Control style iOS) */}
        <div className="flex items-center mb-10 overflow-x-auto pb-2 scrollbar-hide">
          <div className="inline-flex bg-white p-1.5 rounded-full border border-gray-200 shadow-sm min-w-max">
            {[
              { id: 'feed', label: 'Fil d\'Actualité', icon: MessageSquare },
              { id: 'challenges', label: 'Défis & Objectifs', icon: Trophy },
              { id: 'clubs', label: 'Clubs de Lecture', icon: Users },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`relative flex items-center gap-2 px-6 sm:px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div layoutId="activeSocialTab" className="absolute inset-0 bg-forest rounded-full" />
                )}
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
                          {user?.first_name?.[0] || 'U'}{user?.last_name?.[0] || 'S'}
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
                          <Button className="rounded-xl bg-forest hover:bg-forest-dark text-white px-8 shadow-md shadow-forest/20">
                            Publier
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Feed Items */}
                  <div className="space-y-6">
                    {[0, 1, 2].map((index) => (
                      <FeedItem key={index} index={index} />
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
                    <ChallengeCard key={challenge.id} challenge={challenge} index={index} />
                  ))}
                </motion.div>
              )}

              {activeTab === 'clubs' && (
                <motion.div
                  key="clubs"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 gap-6"
                >
                  {readingClubs.map((club, index) => (
                    <BookClubCard key={club.id} club={club} index={index} />
                  ))}
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
                <h3 className="font-serif text-2xl font-bold text-gray-900 mb-6 relative z-10">
                  Votre Parcours
                </h3>
                <div className="grid grid-cols-2 gap-4 relative z-10">
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <BookOpen className="w-6 h-6 text-forest mb-2" />
                    <p className="text-3xl font-extrabold text-gray-900">24</p>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-1">Livres lus</p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <Clock className="w-6 h-6 text-gold mb-2" />
                    <p className="text-3xl font-extrabold text-gray-900">45<span className="text-xl">h</span></p>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-1">De lecture</p>
                  </div>
                  <div className="col-span-2 bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-extrabold text-gray-900">156</p>
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
                <h3 className="font-serif text-2xl font-bold text-gray-900">Trophées</h3>
                <span className="text-sm font-bold text-forest bg-forest/10 px-3 py-1 rounded-full">2/3</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <AchievementBadge icon={Star} name="1er Livre" description="Débutant" unlocked={true} />
                <AchievementBadge icon={Clock} name="Assidu" description="10 livres" unlocked={true} />
                <AchievementBadge icon={Award} name="Expert" description="50 livres" unlocked={false} />
              </div>
            </motion.div>

            {/* Top Readers Leaderboard - Premium Style */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm"
            >
              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-6">
                Top Lecteurs
              </h3>
              <div className="space-y-4">
                {leaderboardData.readers.slice(0, 5).map((entry, index) => {
                  // Determine rank styling
                  let rankStyle = "bg-gray-100 text-gray-500 font-bold";
                  if (index === 0) rankStyle = "bg-gradient-to-br from-yellow-300 to-yellow-500 text-white shadow-md shadow-yellow-500/30";
                  if (index === 1) rankStyle = "bg-gradient-to-br from-gray-300 to-gray-400 text-white shadow-md shadow-gray-400/30";
                  if (index === 2) rankStyle = "bg-gradient-to-br from-orange-300 to-orange-500 text-white shadow-md shadow-orange-500/30";

                  return (
                    <div key={entry.user.id} className="flex items-center gap-4 group p-2 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${rankStyle}`}>
                        {entry.rank}
                      </div>
                      <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
                        <AvatarImage src={entry.user.avatar} className="object-cover" />
                        <AvatarFallback className="bg-forest text-white text-xs">
                          {entry.user.first_name[0]}{entry.user.last_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate group-hover:text-forest transition-colors">
                          {entry.user.first_name} {entry.user.last_name}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <BookOpen className="w-3 h-3" /> {entry.books_read} livres
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
              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-6">
                Suggestions
              </h3>
              <div className="space-y-4">
                {authors.slice(0, 3).map((author, index) => (
                  <UserProfileCard key={author.id} user={author} index={index} />
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}