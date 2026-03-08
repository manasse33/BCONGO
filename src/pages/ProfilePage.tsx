// useState imported but not directly used - kept for potential future use
// import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Heart, 
  Clock, 
  Award,
  Settings,
  Edit3,
  MapPin,
  Calendar,
  Mail,
  TrendingUp,
  Star,
  Target,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { books, challenges } from '@/data/mockData';
import type { User } from '@/types';

interface ProfilePageProps {
  user: User;
}

// Mock reading history
const readingHistory = [
  { book: books[0], progress: 100, finishedAt: '2024-03-10' },
  { book: books[1], progress: 65, lastRead: '2024-03-12' },
  { book: books[2], progress: 30, lastRead: '2024-03-11' },
];

// Mock badges
const userBadges = [
  { name: 'Premier Livre', icon: BookOpen, date: '2024-01-15', color: 'bg-green-100 text-green-600' },
  { name: 'Lecteur Assidu', icon: Star, date: '2024-02-20', color: 'bg-gold/20 text-amber-700' },
  { name: 'Explorateur', icon: Target, date: '2024-03-05', color: 'bg-blue-100 text-blue-600' },
];

export default function ProfilePage({ user }: ProfilePageProps) {
  const stats = {
    booksRead: 24,
    pagesRead: 12500,
    readingTime: 156, // hours
    streak: 7,
  };

  return (
    <div className="min-h-screen bg-cream">
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
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-forest text-white text-2xl">
                  {user.first_name[0]}{user.last_name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-2">
                  <h1 className="font-serif text-3xl font-bold text-gray-dark">
                    {user.first_name} {user.last_name}
                  </h1>
                  <Badge className="w-fit bg-forest/10 text-forest">
                    <Award className="w-3 h-3 mr-1" />
                    Lecteur Confirmé
                  </Badge>
                </div>
                <p className="text-gray-medium mb-3">@{user.username}</p>
                <p className="text-gray-dark max-w-xl">{user.bio}</p>
                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-medium">
                  {user.city && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {user.city}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Inscrit depuis {new Date(user.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="border-forest text-forest">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Modifier
                </Button>
                <Button variant="outline" size="icon">
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
            { label: 'Série', value: `${stats.streak} jours`, icon: Award, color: 'bg-gold/20 text-amber-700' },
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
            <TabsTrigger value="library">Ma Bibliothèque</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="challenges">Défis</TabsTrigger>
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
                <h3 className="font-serif text-xl font-bold text-gray-dark">
                  Lecture en Cours
                </h3>
                <Button variant="outline" size="sm" className="border-forest text-forest">
                  Voir Tout
                </Button>
              </div>
              <div className="space-y-4">
                {readingHistory.filter(r => r.progress < 100).map((item) => (
                  <div key={item.book.id} className="flex items-center gap-4">
                    <img
                      src={item.book.cover_image}
                      alt={item.book.title}
                      className="w-16 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-dark">{item.book.title}</h4>
                      <p className="text-sm text-gray-medium">{item.book.author_name}</p>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-medium">Progression</span>
                          <span className="font-medium text-forest">{item.progress}%</span>
                        </div>
                        <Progress value={item.progress} className="h-2" />
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
                <h3 className="font-serif text-xl font-bold text-gray-dark">
                  Derniers Badges
                </h3>
                <Button variant="outline" size="sm" className="border-forest text-forest">
                  Voir Tout
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {userBadges.map((badge) => (
                  <div key={badge.name} className="text-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 ${badge.color}`}>
                      <badge.icon className="w-8 h-8" />
                    </div>
                    <p className="font-medium text-gray-dark text-sm">{badge.name}</p>
                    <p className="text-xs text-gray-medium">{new Date(badge.date).toLocaleDateString('fr-FR')}</p>
                  </div>
                ))}
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
                  Livres Lus ({readingHistory.filter(r => r.progress === 100).length})
                </Button>
                <Button variant="outline">
                  <Heart className="w-4 h-4 mr-2" />
                  Favoris (12)
                </Button>
                <Button variant="outline">
                  <Clock className="w-4 h-4 mr-2" />
                  À Lire (8)
                </Button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {readingHistory.map((item) => (
                  <div key={item.book.id} className="group">
                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
                      <img
                        src={item.book.cover_image}
                        alt={item.book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      {item.progress === 100 && (
                        <div className="absolute inset-0 bg-forest/80 flex items-center justify-center">
                          <Check className="w-12 h-12 text-white" />
                        </div>
                      )}
                    </div>
                    <h4 className="font-medium text-gray-dark line-clamp-1">{item.book.title}</h4>
                    <p className="text-sm text-gray-medium">{item.book.author_name}</p>
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
                {userBadges.map((badge) => (
                  <div key={badge.name} className="text-center">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3 ${badge.color}`}>
                      <badge.icon className="w-10 h-10" />
                    </div>
                    <p className="font-medium text-gray-dark">{badge.name}</p>
                    <p className="text-sm text-gray-medium">Obtenu le {new Date(badge.date).toLocaleDateString('fr-FR')}</p>
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
              {challenges.map((challenge) => (
                <div key={challenge.id} className="bg-white rounded-xl border border-gray-light p-6">
                  <h4 className="font-serif font-semibold text-gray-dark mb-2">{challenge.title}</h4>
                  <p className="text-sm text-gray-medium mb-4">{challenge.description}</p>
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-medium">Progression</span>
                      <span className="font-medium text-forest">35%</span>
                    </div>
                    <Progress value={35} className="h-2" />
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
