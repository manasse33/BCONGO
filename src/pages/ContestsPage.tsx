import { useEffect, useRef, useState } from 'react';
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
  Star,
  Medal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import type { Contest, ContestSubmission, User } from '@/types';
import { contestsApi, leaderboardApi } from '@/services/api';
import { toast } from 'sonner';

// Contest Card Component
const ContestCard = ({
  contest,
  index,
  isSubmitting,
  onParticipate,
}: {
  contest: Contest;
  index: number;
  isSubmitting: boolean;
  onParticipate: (contest: Contest) => void;
}) => {
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
          disabled={contest.status !== 'ouvert' || isSubmitting}
          onClick={() => onParticipate(contest)}
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
  const [contests, setContests] = useState<Contest[]>([]);
  const [winners, setWinners] = useState<User[]>([]);
  const [selectedContestSlug, setSelectedContestSlug] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [submissionTitle, setSubmissionTitle] = useState('');
  const [submissionContent, setSubmissionContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submissionFormRef = useRef<HTMLElement | null>(null);
  const [mySubmissions, setMySubmissions] = useState<ContestSubmission[]>([]);
  const [voteSubmissionId, setVoteSubmissionId] = useState('');
  const [selectedContestSubmissions, setSelectedContestSubmissions] = useState<ContestSubmission[]>([]);

  useEffect(() => {
    const loadContestData = async () => {
      const hasToken = Boolean(localStorage.getItem('auth_token'));
      try {
        const [contestData, authorLeaderboard, mySubmissionData] = await Promise.all([
          contestsApi.getAll(),
          leaderboardApi.getAuthors(),
          hasToken ? contestsApi.getMySubmissions() : Promise.resolve([]),
        ]);

        const authorUsers = authorLeaderboard
          .map((entry: any) => entry?.user)
          .filter((author: User | undefined): author is User => Boolean(author))
          .slice(0, 4);

        setContests(contestData);
        setWinners(authorUsers);
        setMySubmissions(mySubmissionData);
        const firstOpenContest = contestData.find((contest) => contest.status === 'ouvert');
        if (firstOpenContest) {
          setSelectedContestSlug(firstOpenContest.slug);
        }
      } catch (error) {
        setContests([]);
        setWinners([]);
        setSelectedContestSlug('');
        setMySubmissions([]);
      }
    };

    loadContestData();
  }, []);

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

  const handleParticipate = (contest: Contest) => {
    const hasToken = Boolean(localStorage.getItem('auth_token'));
    if (!hasToken) {
      toast.error('Connectez-vous pour participer a un concours.');
      return;
    }

    if (contest.status !== 'ouvert') {
      toast.error('Ce concours n accepte plus de soumissions.');
      return;
    }

    contestsApi
      .getBySlug(contest.slug)
      .then((detail) => {
        setSelectedContestSlug(detail.slug);
        toast.success(`Concours selectionne: ${detail.title}`);
        contestsApi.getSubmissions(detail.slug).then(setSelectedContestSubmissions).catch(() => setSelectedContestSubmissions([]));
        submissionFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      })
      .catch(() => {
        setSelectedContestSlug(contest.slug);
        toast.success(`Concours selectionne: ${contest.title}`);
        contestsApi.getSubmissions(contest.slug).then(setSelectedContestSubmissions).catch(() => setSelectedContestSubmissions([]));
        submissionFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
  };

  const handleSubmission = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const hasToken = Boolean(localStorage.getItem('auth_token'));
    if (!hasToken) {
      toast.error('Connectez-vous pour soumettre votre oeuvre.');
      return;
    }

    if (!selectedContestSlug) {
      toast.error('Selectionnez un concours ouvert.');
      return;
    }

    if (!submissionTitle.trim()) {
      toast.error('Le titre de la soumission est obligatoire.');
      return;
    }

    setIsSubmitting(true);

    try {
      await contestsApi.submit(selectedContestSlug, {
        title: submissionTitle.trim(),
        content: submissionContent.trim() || undefined,
      });
      toast.success('Soumission envoyee avec succes.');
      try {
        const refreshed = await contestsApi.getMySubmissions();
        setMySubmissions(refreshed);
      } catch (error) {
        // Keep UI state without blocking success toast.
      }
      setSubmissionTitle('');
      setSubmissionContent('');
      setAuthorName('');
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Impossible de soumettre votre oeuvre pour le moment.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const refreshMySubmissions = async () => {
    try {
      const submissions = await contestsApi.getMySubmissions();
      setMySubmissions(submissions);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Impossible de charger vos soumissions.');
    }
  };

  const handleUpdateMySubmission = async (submission: ContestSubmission) => {
    const newTitle = window.prompt('Nouveau titre', submission.title);
    if (!newTitle || !newTitle.trim()) return;

    try {
      const detail = await contestsApi.getMySubmissionById(submission.id);
      await contestsApi.updateMySubmission(submission.id, {
        title: newTitle.trim(),
        content: detail.content,
      });
      toast.success('Soumission mise a jour.');
      await refreshMySubmissions();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Mise a jour impossible.');
    }
  };

  const handleDeleteMySubmission = async (submissionId: number) => {
    if (!window.confirm('Supprimer cette soumission ?')) return;
    try {
      await contestsApi.deleteMySubmission(submissionId);
      setMySubmissions((prev) => prev.filter((submission) => submission.id !== submissionId));
      toast.success('Soumission supprimee.');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Suppression impossible.');
    }
  };

  const handleVote = async () => {
    const id = Number(voteSubmissionId);
    if (!Number.isFinite(id) || id <= 0) {
      toast.error('ID de soumission invalide.');
      return;
    }

    try {
      await contestsApi.vote(id);
      setVoteSubmissionId('');
      toast.success('Vote enregistre.');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Vote impossible.');
    }
  };

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
              <ContestCard
                key={contest.id}
                contest={contest}
                index={index}
                isSubmitting={isSubmitting}
                onParticipate={handleParticipate}
              />
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
            {winners.map((author, index) => (
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

        {/* My Submissions */}
        <section className="mb-16 bg-white border border-gray-light rounded-2xl p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="font-serif text-2xl font-bold text-gray-dark">Mes Soumissions</h2>
            <Button variant="outline" onClick={refreshMySubmissions}>
              Rafraichir
            </Button>
          </div>

          {mySubmissions.length === 0 ? (
            <p className="text-gray-medium">Aucune soumission disponible.</p>
          ) : (
            <div className="space-y-3">
              {mySubmissions.map((submission) => (
                <div key={submission.id} className="border border-gray-light rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="font-medium text-gray-dark">{submission.title}</p>
                    <p className="text-sm text-gray-medium">
                      Statut: {submission.status} | Votes: {submission.votes_count}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleUpdateMySubmission(submission)}>
                      Modifier
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteMySubmission(submission.id)}>
                      Supprimer
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-light">
            <label className="block text-sm font-medium text-gray-dark mb-2">Voter pour une soumission (ID)</label>
            <div className="flex gap-2">
              <Input
                value={voteSubmissionId}
                onChange={(e) => setVoteSubmissionId(e.target.value)}
                placeholder="Submission ID"
              />
              <Button onClick={handleVote} className="bg-forest hover:bg-forest-dark text-white">
                Voter
              </Button>
            </div>
            {selectedContestSubmissions.length > 0 && (
              <div className="mt-4 space-y-2">
                {selectedContestSubmissions.slice(0, 5).map((submission) => (
                  <div key={submission.id} className="flex items-center justify-between text-sm border border-gray-light rounded-lg px-3 py-2">
                    <span className="text-gray-dark">{submission.title}</span>
                    <Button size="sm" variant="outline" onClick={() => setVoteSubmissionId(String(submission.id))}>
                      Utiliser ID {submission.id}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Submission Form */}
        <motion.section
          ref={submissionFormRef}
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
              <form className="space-y-4" onSubmit={handleSubmission}>
                <div>
                  <label className="block text-sm font-medium text-gray-dark mb-1">
                    Nom de l'Auteur
                  </label>
                  <Input
                    placeholder="Votre nom complet"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-dark mb-1">
                    Titre de l'Œuvre
                  </label>
                  <Input
                    placeholder="Titre de votre soumission"
                    value={submissionTitle}
                    onChange={(e) => setSubmissionTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-dark mb-1">
                    Concours ouvert
                  </label>
                  <select
                    className="w-full px-4 py-2 bg-white border border-gray-light rounded-lg focus:outline-none focus:border-forest"
                    value={selectedContestSlug}
                    onChange={(e) => setSelectedContestSlug(e.target.value)}
                  >
                    <option value="">Selectionnez un concours</option>
                    {contests
                      .filter((contest) => contest.status === 'ouvert')
                      .map((contest) => (
                        <option key={contest.id} value={contest.slug}>
                          {contest.title}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-dark mb-1">
                    Texte de soumission
                  </label>
                  <textarea
                    rows={6}
                    value={submissionContent}
                    onChange={(e) => setSubmissionContent(e.target.value)}
                    placeholder="Collez ici votre texte ou resume de l'oeuvre"
                    className="w-full px-4 py-3 bg-white border border-gray-light rounded-lg focus:outline-none focus:border-forest resize-none"
                  />
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full bg-forest hover:bg-forest-dark text-white">
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
