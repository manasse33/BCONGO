import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  ChevronRight
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

// User Profile Card
const UserProfileCard = ({ user, index }: { user: User; index: number }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="flex items-center gap-4 bg-white rounded-xl p-4 border border-gray-light hover:border-gold hover:shadow-light transition-all"
  >
    <Avatar className="w-14 h-14 border-2 border-gold">
      <AvatarImage src={user.avatar} alt={user.first_name} />
      <AvatarFallback className="bg-forest text-white">
        {user.first_name[0]}{user.last_name[0]}
      </AvatarFallback>
    </Avatar>
    <div className="flex-1 min-w-0">
      <h4 className="font-medium text-gray-dark">{user.first_name} {user.last_name}</h4>
      <p className="text-sm text-gray-medium line-clamp-1">{user.bio}</p>
      <div className="flex items-center gap-3 mt-1 text-xs text-gray-medium">
        <span className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          {Math.floor(Math.random() * 500 + 100)} followers
        </span>
      </div>
    </div>
    <Button size="sm" className="bg-forest hover:bg-forest-dark text-white">
      Suivre
    </Button>
  </motion.div>
);

// Challenge Card
const ChallengeCard = ({ challenge, index }: { challenge: ReadingChallenge; index: number }) => {
  const progress = Math.floor(Math.random() * 60 + 20);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-xl border border-gray-light overflow-hidden hover:shadow-medium transition-all"
    >
      <div className="h-32 bg-gradient-to-br from-forest to-forest-dark relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <Trophy className="w-16 h-16 text-white/30" />
        </div>
        <div className="absolute bottom-4 left-4">
          <Badge className="bg-gold text-gray-dark">
            <Target className="w-3 h-3 mr-1" />
            {challenge.challenge_type === 'livres_par_periode' ? 'Lecture' : 'Découverte'}
          </Badge>
        </div>
      </div>
      <div className="p-4">
        <h4 className="font-serif font-semibold text-gray-dark mb-1">{challenge.title}</h4>
        <p className="text-sm text-gray-medium mb-3">
          Objectif: {challenge.target_value} {challenge.challenge_type === 'livres_par_periode' ? 'livres' : 'auteurs'}
        </p>
        <div className="mb-3">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-medium">Progression</span>
            <span className="font-medium text-forest">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-medium">
            {challenge.participants_count} participants
          </span>
          <Button size="sm" variant="outline" className="border-forest text-forest hover:bg-forest hover:text-white">
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
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="flex gap-4 bg-white rounded-xl p-4 border border-gray-light hover:border-gold hover:shadow-light transition-all"
  >
    <img
      src={club.cover_image}
      alt={club.name}
      className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
    />
    <div className="flex-1 min-w-0">
      <h4 className="font-medium text-gray-dark">{club.name}</h4>
      <p className="text-sm text-gray-medium line-clamp-2 mb-2">{club.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-medium">
          <Users className="w-3 h-3 inline mr-1" />
          {club.members_count} membres
        </span>
        <Button size="sm" className="bg-forest hover:bg-forest-dark text-white">
          Rejoindre
        </Button>
      </div>
    </div>
  </motion.div>
);

// Community Feed Item
const FeedItem = ({ index }: { index: number }) => {
  const activities = [
    { user: authors[0], action: 'a terminé', book: books[0], time: '2h' },
    { user: authors[1], action: 'a aimé', book: books[1], time: '4h' },
    { user: authors[2], action: 'a commenté', book: books[2], time: '6h' },
  ];
  const activity = activities[index % activities.length];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="flex gap-4 bg-white rounded-xl p-4 border border-gray-light"
    >
      <Avatar className="w-10 h-10">
        <AvatarImage src={activity.user.avatar} />
        <AvatarFallback className="bg-forest text-white text-sm">
          {activity.user.first_name[0]}{activity.user.last_name[0]}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="text-sm">
          <span className="font-medium text-gray-dark">{activity.user.first_name} {activity.user.last_name}</span>
          {' '}{activity.action}{' '}
          <span className="font-medium text-forest">{activity.book.title}</span>
        </p>
        <p className="text-xs text-gray-medium mt-1">{activity.time}</p>
        <div className="flex items-center gap-4 mt-3">
          <button className="flex items-center gap-1 text-sm text-gray-medium hover:text-forest transition-colors">
            <Heart className="w-4 h-4" />
            J'aime
          </button>
          <button className="flex items-center gap-1 text-sm text-gray-medium hover:text-forest transition-colors">
            <MessageSquare className="w-4 h-4" />
            Commenter
          </button>
          <button className="flex items-center gap-1 text-sm text-gray-medium hover:text-forest transition-colors">
            <Share2 className="w-4 h-4" />
            Partager
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Achievement Badge
const AchievementBadge = ({ icon: Icon, name, description, unlocked }: { icon: any; name: string; description: string; unlocked: boolean }) => (
  <div className={`flex flex-col items-center p-4 rounded-xl transition-all ${unlocked ? 'bg-gold/10' : 'bg-gray-100'}`}>
    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${unlocked ? 'bg-gold' : 'bg-gray-300'}`}>
      <Icon className={`w-6 h-6 ${unlocked ? 'text-gray-dark' : 'text-gray-500'}`} />
    </div>
    <p className={`text-sm font-medium text-center ${unlocked ? 'text-gray-dark' : 'text-gray-400'}`}>{name}</p>
    <p className="text-xs text-gray-medium text-center">{description}</p>
  </div>
);

export default function SocialPage({ user }: SocialPageProps) {
  const [activeTab, setActiveTab] = useState<'feed' | 'challenges' | 'clubs'>('feed');

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
              <span className="text-forest">Communauté</span>
            </div>
            <div className="flex items-center justify-between">
              <h1 className="font-serif text-3xl lg:text-4xl font-bold text-gray-dark">
                Réseau de Lecture
              </h1>
              <Button className="bg-gold hover:bg-gold-dark text-gray-dark">
                <Plus className="w-4 h-4 mr-2" />
                Créer un Club
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'feed', label: 'Fil d\'Actualité', icon: MessageSquare },
            { id: 'challenges', label: 'Défis', icon: Trophy },
            { id: 'clubs', label: 'Clubs', icon: Users },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-forest text-white'
                  : 'bg-white text-gray-dark border border-gray-light hover:border-forest'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'feed' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {/* Create Post */}
                <div className="bg-white rounded-xl p-4 border border-gray-light">
                  <div className="flex gap-4">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="bg-forest text-white">
                        {user?.first_name?.[0]}{user?.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Partagez votre lecture..."
                        className="w-full px-4 py-2 bg-cream rounded-lg border border-gray-light focus:outline-none focus:border-forest"
                      />
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-cream rounded-lg transition-colors">
                            <BookOpen className="w-5 h-5 text-gray-medium" />
                          </button>
                          <button className="p-2 hover:bg-cream rounded-lg transition-colors">
                            <Heart className="w-5 h-5 text-gray-medium" />
                          </button>
                        </div>
                        <Button size="sm" className="bg-forest hover:bg-forest-dark text-white">
                          Publier
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Feed Items */}
                {[0, 1, 2].map((index) => (
                  <FeedItem key={index} index={index} />
                ))}
              </motion.div>
            )}

            {activeTab === 'challenges' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {challenges.map((challenge, index) => (
                  <ChallengeCard key={challenge.id} challenge={challenge} index={index} />
                ))}
              </motion.div>
            )}

            {activeTab === 'clubs' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {readingClubs.map((club, index) => (
                  <BookClubCard key={club.id} club={club} index={index} />
                ))}
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Stats */}
            {user && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-xl p-6 border border-gray-light"
              >
                <h3 className="font-serif text-xl font-bold text-gray-dark mb-4">
                  Vos Statistiques
                </h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-forest">24</p>
                    <p className="text-xs text-gray-medium">Livres lus</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-forest">156</p>
                    <p className="text-xs text-gray-medium">Pages/jour</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-forest">45h</p>
                    <p className="text-xs text-gray-medium">Temps total</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-xl p-6 border border-gray-light"
            >
              <h3 className="font-serif text-xl font-bold text-gray-dark mb-4">
                Réalisations
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <AchievementBadge 
                  icon={Star} 
                  name="Premier Livre" 
                  description="1 livre lu"
                  unlocked={true}
                />
                <AchievementBadge 
                  icon={Clock} 
                  name="Lecteur Assidu" 
                  description="10 livres"
                  unlocked={true}
                />
                <AchievementBadge 
                  icon={Award} 
                  name="Explorateur" 
                  description="5 genres"
                  unlocked={false}
                />
              </div>
            </motion.div>

            {/* Suggested Users */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-xl p-6 border border-gray-light"
            >
              <h3 className="font-serif text-xl font-bold text-gray-dark mb-4">
                Suggestions
              </h3>
              <div className="space-y-3">
                {authors.slice(0, 3).map((author, index) => (
                  <UserProfileCard key={author.id} user={author} index={index} />
                ))}
              </div>
            </motion.div>

            {/* Top Readers Leaderboard */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white rounded-xl p-6 border border-gray-light"
            >
              <h3 className="font-serif text-xl font-bold text-gray-dark mb-4">
                Classement des Lecteurs
              </h3>
              <div className="space-y-3">
                {leaderboardData.readers.slice(0, 5).map((entry, index) => (
                  <div
                    key={entry.user.id}
                    className="flex items-center gap-3"
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-gold text-gray-dark' :
                      index === 1 ? 'bg-gray-300 text-gray-dark' :
                      index === 2 ? 'bg-orange-300 text-gray-dark' :
                      'bg-gray-100 text-gray-medium'
                    }`}>
                      {entry.rank}
                    </span>
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={entry.user.avatar} />
                      <AvatarFallback className="bg-forest text-white text-xs">
                        {entry.user.first_name[0]}{entry.user.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-dark truncate">
                        {entry.user.first_name} {entry.user.last_name}
                      </p>
                    </div>
                    <span className="text-sm text-gray-medium">{entry.books_read}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 border-forest text-forest hover:bg-forest hover:text-white">
                Voir le Classement Complet
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
