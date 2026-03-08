import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Calendar, 
  Users, 
  ArrowRight,
  Search,
  Award,
  Clock,
  ChevronRight,
  Upload,
  Star,
  Medal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { contests, authors } from '@/data/mockData';
import type { Contest } from '@/types';

// Contest Card Component
const ContestCard = ({ contest, index }: { contest: Contest; index: number }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ouvert': return 'bg-green-100 text-green-700';
      case 'vote': return 'bg-blue-100 text-blue-700';
      case 'termine': return 'bg-gray-100 text-gray-700';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ouvert': return 'Ouvert';
      case 'vote': return 'En Vote';
      case 'termine': return 'Terminé';
      default: return 'Brouillon';
    }
  };

  const colors = [
    'from-pink-400 to-rose-500',
    'from-orange-400 to-amber-500',
    'from-blue-400 to-indigo-500',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-2xl border border-gray-light overflow-hidden hover:shadow-medium transition-all"
    >
      <div className={`h-40 bg-gradient-to-br ${colors[index % colors.length]} relative p-6`}>
        <div className="absolute top-4 right-4">
          <Badge className={getStatusColor(contest.status)}>
            {getStatusLabel(contest.status)}
          </Badge>
        </div>
        <div className="absolute bottom-4 left-6 right-6">
          <h3 className="font-serif text-2xl font-bold text-white mb-1">
            {contest.title}
          </h3>
          <p className="text-white/80 text-sm">
            {contest.contest_type === 'poesie' ? 'Concours de Poésie' :
             contest.contest_type === 'nouvelle' ? 'Concours de Nouvelles' :
             contest.contest_type === 'bd' ? 'Concours de BD' : 'Concours d\'Écriture'}
          </p>
        </div>
        <Trophy className="absolute top-1/2 right-6 -translate-y-1/2 w-24 h-24 text-white/20" />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-medium">
            <Calendar className="w-4 h-4" />
            <span>Fin: {new Date(contest.submission_end).toLocaleDateString('fr-FR')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-medium">
            <Users className="w-4 h-4" />
            <span>{contest.participants_count} participants</span>
          </div>
        </div>
        
        <p className="text-gray-medium text-sm mb-4 line-clamp-2">
          {contest.description}
        </p>

        <div className="bg-cream rounded-lg p-4 mb-4">
          <p className="text-sm font-medium text-gray-dark mb-1">Prix:</p>
          <p className="text-sm text-gray-medium">{contest.prizes_description}</p>
        </div>

        <Button 
          className="w-full bg-forest hover:bg-forest-dark text-white"
          disabled={contest.status !== 'ouvert'}
        >
          {contest.status === 'ouvert' ? (
            <>
              Participer Maintenant
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          ) : contest.status === 'vote' ? (
            'Vote en Cours'
          ) : (
            'Concours Terminé'
          )}
        </Button>
      </div>
    </motion.div>
  );
};

// Winner Card Component
const WinnerCard = ({ author, category, year, index }: { author: any; category: string; year: string; index: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="bg-white rounded-xl border border-gray-light overflow-hidden hover:shadow-light transition-all"
  >
    <div className="relative">
      <img
        src={author.avatar}
        alt={`${author.first_name} ${author.last_name}`}
        className="w-full aspect-[4/3] object-cover"
      />
      <div className="absolute top-3 left-3">
        <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center">
          <Medal className="w-5 h-5 text-gray-dark" />
        </div>
      </div>
    </div>
    <div className="p-4">
      <Badge className="mb-2 bg-forest/10 text-forest">
        {category}
      </Badge>
      <h4 className="font-serif font-semibold text-gray-dark">
        {author.first_name} {author.last_name}
      </h4>
      <p className="text-sm text-gray-medium mb-2">{author.bio?.slice(0, 60)}...</p>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-medium">{year}</span>
        <Button size="sm" variant="ghost" className="text-forest">
          Voir le Profil
        </Button>
      </div>
    </div>
  </motion.div>
);

export default function ContestsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = [
    { id: 'poesie', label: 'Poésie', icon: Star },
    { id: 'nouvelle', label: 'Nouvelles', icon: Award },
    { id: 'bd', label: 'BD', icon: Trophy },
    { id: 'ecriture', label: 'Écriture', icon: Medal },
  ];

  const filteredContests = contests.filter(contest => {
    const matchesSearch = contest.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory ? contest.contest_type === activeCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-forest to-forest-dark py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-serif text-4xl lg:text-6xl font-bold text-white mb-6">
              Écrivez Votre Histoire,<br />
              <span className="text-gold">Gagnez en Visibilité !</span>
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
              Participez à nos concours littéraires et faites reconnaître votre talent. 
              Des prix exceptionnels et une visibilité nationale vous attendent.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium" />
                <input
                  type="text"
                  placeholder="Rechercher un concours..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white rounded-full text-gray-dark focus:outline-none focus:ring-4 focus:ring-gold/30"
                />
              </div>
              <Button className="bg-gold hover:bg-gold-dark text-gray-dark font-semibold px-8">
                Explorer les Concours
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-6 py-3 rounded-full font-medium transition-colors ${
                activeCategory === null
                  ? 'bg-forest text-white'
                  : 'bg-white text-gray-dark border border-gray-light hover:border-forest'
              }`}
            >
              Tous les Concours
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-forest text-white'
                    : 'bg-white text-gray-dark border border-gray-light hover:border-forest'
                }`}
              >
                <cat.icon className="w-4 h-4" />
                {cat.label}
              </button>
            ))}
          </div>
        </motion.section>

        {/* Active Contests */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-3xl font-bold text-gray-dark">
              Concours en Cours
            </h2>
            <Link to="#" className="text-forest hover:underline flex items-center gap-1">
              Voir Tous
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContests.map((contest, index) => (
              <ContestCard key={contest.id} contest={contest} index={index} />
            ))}
          </div>

          {filteredContests.length === 0 && (
            <div className="text-center py-16">
              <Trophy className="w-16 h-16 text-gray-light mx-auto mb-4" />
              <h3 className="font-serif text-xl font-semibold text-gray-dark mb-2">
                Aucun concours trouvé
              </h3>
              <p className="text-gray-medium">
                Essayez de modifier vos critères de recherche
              </p>
            </div>
          )}
        </section>

        {/* Past Winners */}
        <section className="mb-16">
          <h2 className="font-serif text-3xl font-bold text-gray-dark mb-2">
            Inspirations Littéraires
          </h2>
          <p className="text-gray-medium mb-8">
            Découvrez les gagnants des éditions précédentes
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {authors.slice(0, 4).map((author, index) => (
              <WinnerCard
                key={author.id}
                author={author}
                category={['Poésie', 'Nouvelle', 'BD', 'Roman'][index]}
                year="2024"
                index={index}
              />
            ))}
          </div>
        </section>

        {/* Submission Form */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-2xl border border-gray-light p-8 lg:p-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="font-serif text-3xl font-bold text-gray-dark mb-4">
                Soumettre Votre Œuvre
              </h2>
              <p className="text-gray-medium mb-6">
                Vous avez une histoire à raconter ? Une poésie à partager ? 
                Soumettez votre œuvre à l'un de nos concours et faites briller votre talent.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-forest/10 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-forest" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-dark">Dates Limites</p>
                    <p className="text-sm text-gray-medium">Respectez les dates de soumission</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-forest/10 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-forest" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-dark">Œuvre Originale</p>
                    <p className="text-sm text-gray-medium">Votre soumission doit être inédite</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-forest/10 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-forest" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-dark">Jury Professionnel</p>
                    <p className="text-sm text-gray-medium">Évaluation par des experts du domaine</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-cream rounded-xl p-6">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-dark mb-1">
                    Nom de l'Auteur
                  </label>
                  <Input placeholder="Votre nom complet" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-dark mb-1">
                    Titre de l'Œuvre
                  </label>
                  <Input placeholder="Titre de votre soumission" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-dark mb-1">
                    Catégorie
                  </label>
                  <select className="w-full px-4 py-2 bg-white border border-gray-light rounded-lg focus:outline-none focus:border-forest">
                    <option>Sélectionnez une catégorie</option>
                    <option>Poésie</option>
                    <option>Nouvelle</option>
                    <option>Bande Dessinée</option>
                    <option>Roman</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-dark mb-1">
                    Fichier
                  </label>
                  <div className="border-2 border-dashed border-gray-light rounded-lg p-6 text-center hover:border-forest transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-medium mx-auto mb-2" />
                    <p className="text-sm text-gray-medium">
                      Glissez votre fichier ici ou cliquez pour sélectionner
                    </p>
                    <p className="text-xs text-gray-medium mt-1">
                      PDF, DOCX (max 10MB)
                    </p>
                  </div>
                </div>
                <Button className="w-full bg-forest hover:bg-forest-dark text-white">
                  Soumettre mon Œuvre
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
