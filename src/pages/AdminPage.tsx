import { useEffect, useState } from 'react';
import { Shield, Users, BookOpen, Flag, Settings, Activity, Trophy } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { User } from '@/types';
import { adminApi, challengesApi } from '@/services/api';

interface AdminPageProps {
  user: User;
}

export default function AdminPage({ user }: AdminPageProps) {
  const [loading, setLoading] = useState(false);
  const [overview, setOverview] = useState<Record<string, any>>({});
  const [usersCount, setUsersCount] = useState(0);
  const [booksCount, setBooksCount] = useState(0);
  const [pendingBooksCount, setPendingBooksCount] = useState(0);
  const [reportsCount, setReportsCount] = useState(0);
  const [contestsCount, setContestsCount] = useState(0);
  const [activityLogsCount, setActivityLogsCount] = useState(0);
  const [searchLogsCount, setSearchLogsCount] = useState(0);
  const [readingsStatsKeys, setReadingsStatsKeys] = useState(0);
  const [usersStatsKeys, setUsersStatsKeys] = useState(0);
  const [booksStatsKeys, setBooksStatsKeys] = useState(0);
  const [platformSettings, setPlatformSettings] = useState<Record<string, any>>({});

  const [bookId, setBookId] = useState('');
  const [adminBookTitle, setAdminBookTitle] = useState('');
  const [userId, setUserId] = useState('');
  const [newRole, setNewRole] = useState('Lecteur');
  const [userCity, setUserCity] = useState('');
  const [contestId, setContestId] = useState('');
  const [contestTitle, setContestTitle] = useState('');
  const [reportId, setReportId] = useState('');
  const [submissionId, setSubmissionId] = useState('');
  const [submissionReviewStatus, setSubmissionReviewStatus] = useState('accepte');
  const [challengeId, setChallengeId] = useState('');
  const [challengeTitle, setChallengeTitle] = useState('');
  const [genreName, setGenreName] = useState('');
  const [genreId, setGenreId] = useState('');
  const [publisherName, setPublisherName] = useState('');
  const [publisherId, setPublisherId] = useState('');

  useEffect(() => {
    const loadAdminData = async () => {
      setLoading(true);
      try {
        const [stats, users, allBooks, pendingBooks, reports, contests, settings, activityLogs, searchLogs, readingsStats, usersStats, booksStats] = await Promise.all([
          adminApi.stats.getOverview(),
          adminApi.users.getAll(),
          adminApi.books.getAll(),
          adminApi.books.getPending(),
          adminApi.reports.getAll(),
          adminApi.contests.getAll(),
          adminApi.settings.get(),
          adminApi.stats.getActivityLogs(),
          adminApi.stats.getSearchLogs(),
          adminApi.stats.getReadings(),
          adminApi.stats.getUsers(),
          adminApi.stats.getBooks(),
        ]);
        setOverview(stats ?? {});
        setUsersCount(users.length);
        setBooksCount(allBooks.length);
        setPendingBooksCount(pendingBooks.length);
        setReportsCount(reports.length);
        setContestsCount(contests.length);
        setPlatformSettings(settings ?? {});
        setActivityLogsCount(activityLogs.length);
        setSearchLogsCount(searchLogs.length);
        setReadingsStatsKeys(Object.keys(readingsStats ?? {}).length);
        setUsersStatsKeys(Object.keys(usersStats ?? {}).length);
        setBooksStatsKeys(Object.keys(booksStats ?? {}).length);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Impossible de charger l'espace admin.");
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, []);

  const runAdminAction = async (action: () => Promise<void>, successMessage: string) => {
    setLoading(true);
    try {
      await action();
      toast.success(successMessage);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Action admin impossible.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen app-shell bg-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-dark">Administration</h1>
          <p className="text-gray-medium mt-2">
            Connecte toutes les routes `admin/*` pour {user.first_name} {user.last_name}.
          </p>
        </div>

        <section className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { icon: Shield, label: 'Overview', value: Object.keys(overview).length },
            { icon: Users, label: 'Users', value: usersCount },
            { icon: BookOpen, label: 'Books', value: booksCount },
            { icon: BookOpen, label: 'Books pending', value: pendingBooksCount },
            { icon: Flag, label: 'Reports', value: reportsCount },
            { icon: Trophy, label: 'Contests', value: contestsCount },
            { icon: Activity, label: 'Activity logs', value: activityLogsCount },
            { icon: Activity, label: 'Search logs', value: searchLogsCount },
            { icon: Activity, label: 'Readings stats', value: readingsStatsKeys },
            { icon: Activity, label: 'Users stats', value: usersStatsKeys },
            { icon: Activity, label: 'Books stats', value: booksStatsKeys },
          ].map((item) => (
            <div key={item.label} className="bg-white border border-gray-light rounded-xl p-4">
              <item.icon className="w-5 h-5 text-forest mb-2" />
              <p className="text-2xl font-bold text-gray-dark">{item.value}</p>
              <p className="text-sm text-gray-medium">{item.label}</p>
            </div>
          ))}
        </section>

        <section className="bg-white border border-gray-light rounded-2xl p-6 space-y-3">
          <h2 className="font-semibold text-gray-dark">Revision Soumission Concours</h2>
          <Input value={submissionId} onChange={(e) => setSubmissionId(e.target.value)} placeholder="Submission ID" />
          <Input value={submissionReviewStatus} onChange={(e) => setSubmissionReviewStatus(e.target.value)} placeholder="Statut (accepte/rejete)" />
          <Button
            disabled={loading || !submissionId}
            onClick={() =>
              runAdminAction(
                () => adminApi.contests.reviewSubmission(Number(submissionId), { status: submissionReviewStatus }),
                'Soumission revue.'
              )
            }
          >
            Valider review
          </Button>
        </section>

        <section className="bg-white border border-gray-light rounded-2xl p-6 space-y-3">
          <h2 className="font-semibold text-gray-dark">Moderation Livres</h2>
          <Input value={bookId} onChange={(e) => setBookId(e.target.value)} placeholder="Book ID" />
          <Input value={adminBookTitle} onChange={(e) => setAdminBookTitle(e.target.value)} placeholder="Titre livre (create/update)" />
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              disabled={loading || !adminBookTitle}
              onClick={() =>
                runAdminAction(
                  () =>
                    adminApi.books.create({
                      title: adminBookTitle,
                      author_name: 'Admin',
                      type: 'roman',
                      language_id: 1,
                      status: 'brouillon',
                      is_free: true,
                    } as any).then(() => undefined),
                  'Livre cree via admin.'
                )
              }
            >
              Creer
            </Button>
            <Button
              variant="outline"
              disabled={loading || !bookId || !adminBookTitle}
              onClick={() =>
                runAdminAction(
                  () => adminApi.books.update(Number(bookId), { title: adminBookTitle }).then(() => undefined),
                  'Livre mis a jour.'
                )
              }
            >
              Mettre a jour
            </Button>
            <Button
              disabled={loading || !bookId}
              onClick={() => runAdminAction(() => adminApi.books.approve(Number(bookId)), 'Livre approuve.')}
            >
              Approuver
            </Button>
            <Button
              variant="outline"
              disabled={loading || !bookId}
              onClick={() => runAdminAction(() => adminApi.books.reject(Number(bookId)), 'Livre rejete.')}
            >
              Rejeter
            </Button>
            <Button
              variant="outline"
              disabled={loading || !bookId}
              onClick={() => runAdminAction(() => adminApi.books.feature(Number(bookId)), 'Livre mis en avant.')}
            >
              Mettre en avant
            </Button>
            <Button
              variant="destructive"
              disabled={loading || !bookId}
              onClick={() => runAdminAction(() => adminApi.books.delete(Number(bookId)), 'Livre supprime.')}
            >
              Supprimer
            </Button>
          </div>
        </section>

        <section className="bg-white border border-gray-light rounded-2xl p-6 space-y-3">
          <h2 className="font-semibold text-gray-dark">Moderation Utilisateurs</h2>
          <Input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="User ID" />
          <Input value={newRole} onChange={(e) => setNewRole(e.target.value)} placeholder="Role (Lecteur/Auteur/Editeur/Administrateur/Super Admin)" />
          <Input value={userCity} onChange={(e) => setUserCity(e.target.value)} placeholder="Ville utilisateur (update)" />
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              disabled={loading || !userId}
              onClick={() =>
                runAdminAction(
                  () =>
                    adminApi.users.getById(Number(userId)).then((u) => {
                      setUserCity(u.city ?? '');
                      toast.success(`Utilisateur charge: @${u.username}`);
                    }),
                  'Detail utilisateur charge.'
                )
              }
            >
              Charger detail
            </Button>
            <Button
              variant="outline"
              disabled={loading || !userId}
              onClick={() =>
                runAdminAction(
                  () => adminApi.users.update(Number(userId), { city: userCity }).then(() => undefined),
                  'Profil utilisateur mis a jour.'
                )
              }
            >
              Mettre a jour
            </Button>
            <Button
              disabled={loading || !userId}
              onClick={() => runAdminAction(() => adminApi.users.ban(Number(userId)), 'Utilisateur banni.')}
            >
              Bannir
            </Button>
            <Button
              variant="outline"
              disabled={loading || !userId}
              onClick={() => runAdminAction(() => adminApi.users.unban(Number(userId)), 'Utilisateur debanni.')}
            >
              Debannir
            </Button>
            <Button
              variant="outline"
              disabled={loading || !userId}
              onClick={() => runAdminAction(() => adminApi.users.changeRole(Number(userId), newRole), 'Role utilisateur mis a jour.')}
            >
              Changer role
            </Button>
            <Button
              variant="destructive"
              disabled={loading || !userId}
              onClick={() => runAdminAction(() => adminApi.users.delete(Number(userId)), 'Utilisateur supprime.')}
            >
              Supprimer
            </Button>
          </div>
        </section>

        <section className="bg-white border border-gray-light rounded-2xl p-6 space-y-3">
          <h2 className="font-semibold text-gray-dark">Concours Admin</h2>
          <Input value={contestId} onChange={(e) => setContestId(e.target.value)} placeholder="Contest ID" />
          <Input value={contestTitle} onChange={(e) => setContestTitle(e.target.value)} placeholder="Titre concours (create/update)" />
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              disabled={loading || !contestTitle}
              onClick={() =>
                runAdminAction(
                  () =>
                    adminApi.contests.create({
                      title: contestTitle,
                      slug: contestTitle.toLowerCase().replace(/\s+/g, '-'),
                      contest_type: 'ecriture',
                      submission_start: new Date().toISOString(),
                      submission_end: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
                      status: 'brouillon',
                      participants_count: 0,
                    } as any).then(() => undefined),
                  'Concours cree.'
                )
              }
            >
              Creer
            </Button>
            <Button
              variant="outline"
              disabled={loading || !contestId || !contestTitle}
              onClick={() =>
                runAdminAction(
                  () => adminApi.contests.update(Number(contestId), { title: contestTitle }).then(() => undefined),
                  'Concours mis a jour.'
                )
              }
            >
              Mettre a jour
            </Button>
            <Button
              variant="destructive"
              disabled={loading || !contestId}
              onClick={() => runAdminAction(() => adminApi.contests.delete(Number(contestId)), 'Concours supprime.')}
            >
              Supprimer
            </Button>
            <Button
              disabled={loading || !contestId}
              onClick={() => runAdminAction(() => adminApi.contests.open(Number(contestId)), 'Concours ouvert.')}
            >
              Ouvrir
            </Button>
            <Button
              variant="outline"
              disabled={loading || !contestId}
              onClick={() => runAdminAction(() => adminApi.contests.close(Number(contestId)), 'Concours ferme.')}
            >
              Fermer
            </Button>
            <Button
              variant="outline"
              disabled={loading || !contestId}
              onClick={() => runAdminAction(() => adminApi.contests.announceResults(Number(contestId)), 'Resultats annonces.')}
            >
              Annoncer resultats
            </Button>
            <Button
              variant="outline"
              disabled={loading || !contestId}
              onClick={() =>
                runAdminAction(
                  () =>
                    adminApi.contests
                      .getSubmissions(Number(contestId))
                      .then((submissions) => {
                        toast.success(`Soumissions recuperees: ${submissions.length}`);
                      }),
                  'Sous-route submissions appellee.'
                )
              }
            >
              Lister soumissions
            </Button>
          </div>
        </section>

        <section className="bg-white border border-gray-light rounded-2xl p-6 space-y-3">
          <h2 className="font-semibold text-gray-dark">Signalements</h2>
          <Input value={reportId} onChange={(e) => setReportId(e.target.value)} placeholder="Report ID" />
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={loading || !reportId}
              onClick={() =>
                runAdminAction(
                  () =>
                    adminApi.reports
                      .getById(Number(reportId))
                      .then((report) => {
                        toast.success(`Report detail charge: ${String(report?.id ?? reportId)}`);
                      }),
                  'Detail report charge.'
                )
              }
            >
              Charger detail
            </Button>
            <Button
              disabled={loading || !reportId}
              onClick={() => runAdminAction(() => adminApi.reports.handle(Number(reportId), { status: 'handled' }), 'Signalement traite.')}
            >
              Traiter
            </Button>
            <Button
              variant="outline"
              disabled={loading || !reportId}
              onClick={() => runAdminAction(() => adminApi.reports.reject(Number(reportId), { status: 'rejected' }), 'Signalement rejete.')}
            >
              Rejeter
            </Button>
          </div>
        </section>

        <section className="bg-white border border-gray-light rounded-2xl p-6 space-y-3">
          <h2 className="font-semibold text-gray-dark">Defis Plateforme</h2>
          <Input value={challengeTitle} onChange={(e) => setChallengeTitle(e.target.value)} placeholder="Titre du defi" />
          <Input value={challengeId} onChange={(e) => setChallengeId(e.target.value)} placeholder="Challenge ID (pour update/delete)" />
          <div className="flex flex-wrap gap-2">
            <Button
              disabled={loading || !challengeTitle}
              onClick={() =>
                runAdminAction(
                  () =>
                    challengesApi.create({
                      title: challengeTitle,
                      challenge_type: 'livres_par_periode',
                      target_value: 1,
                      starts_at: new Date().toISOString(),
                      ends_at: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
                      is_public: true,
                    }).then(() => undefined),
                  'Defi cree.'
                )
              }
            >
              Creer
            </Button>
            <Button
              variant="outline"
              disabled={loading || !challengeId || !challengeTitle}
              onClick={() =>
                runAdminAction(
                  () => challengesApi.update(Number(challengeId), { title: challengeTitle }).then(() => undefined),
                  'Defi mis a jour.'
                )
              }
            >
              Mettre a jour
            </Button>
            <Button
              variant="destructive"
              disabled={loading || !challengeId}
              onClick={() => runAdminAction(() => challengesApi.delete(Number(challengeId)), 'Defi supprime.')}
            >
              Supprimer
            </Button>
          </div>
        </section>

        <section className="bg-white border border-gray-light rounded-2xl p-6 space-y-3">
          <h2 className="font-semibold text-gray-dark">Genres / Editeurs</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Input value={genreName} onChange={(e) => setGenreName(e.target.value)} placeholder="Nom genre" />
              <Input value={genreId} onChange={(e) => setGenreId(e.target.value)} placeholder="Genre ID" />
              <div className="flex gap-2">
                <Button
                  disabled={loading || !genreName}
                  onClick={() =>
                    runAdminAction(
                      () =>
                        adminApi.genres.create({
                          name: genreName,
                          slug: genreName.toLowerCase().replace(/\s+/g, '-'),
                          sort_order: 0,
                        }).then(() => undefined),
                      'Genre cree.'
                    )
                  }
                >
                  Creer genre
                </Button>
                <Button
                  variant="outline"
                  disabled={loading || !genreId || !genreName}
                  onClick={() =>
                    runAdminAction(
                      () => adminApi.genres.update(Number(genreId), { name: genreName }).then(() => undefined),
                      'Genre mis a jour.'
                    )
                  }
                >
                  MAJ genre
                </Button>
                <Button
                  variant="destructive"
                  disabled={loading || !genreId}
                  onClick={() => runAdminAction(() => adminApi.genres.delete(Number(genreId)), 'Genre supprime.')}
                >
                  Supprimer genre
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Input value={publisherName} onChange={(e) => setPublisherName(e.target.value)} placeholder="Nom editeur" />
              <Input value={publisherId} onChange={(e) => setPublisherId(e.target.value)} placeholder="Publisher ID" />
              <div className="flex gap-2">
                <Button
                  disabled={loading || !publisherName}
                  onClick={() =>
                    runAdminAction(
                      () =>
                        adminApi.publishers.create({
                          name: publisherName,
                          slug: publisherName.toLowerCase().replace(/\s+/g, '-'),
                        }).then(() => undefined),
                      'Editeur cree.'
                    )
                  }
                >
                  Creer editeur
                </Button>
                <Button
                  variant="outline"
                  disabled={loading || !publisherId || !publisherName}
                  onClick={() =>
                    runAdminAction(
                      () => adminApi.publishers.update(Number(publisherId), { name: publisherName }).then(() => undefined),
                      'Editeur mis a jour.'
                    )
                  }
                >
                  MAJ editeur
                </Button>
                <Button
                  variant="destructive"
                  disabled={loading || !publisherId}
                  onClick={() => runAdminAction(() => adminApi.publishers.delete(Number(publisherId)), 'Editeur supprime.')}
                >
                  Supprimer editeur
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white border border-gray-light rounded-2xl p-6 space-y-3">
          <h2 className="font-semibold text-gray-dark flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Parametres plateforme
          </h2>
          <textarea
            rows={8}
            value={JSON.stringify(platformSettings, null, 2)}
            onChange={(e) => {
              try {
                setPlatformSettings(JSON.parse(e.target.value));
              } catch {
                // Keep last valid JSON
              }
            }}
            className="w-full border border-gray-light rounded-lg p-3 font-mono text-sm"
          />
          <Button
            disabled={loading}
            onClick={() => runAdminAction(() => adminApi.settings.update(platformSettings).then(() => undefined), 'Parametres plateforme mis a jour.')}
            className="bg-forest hover:bg-forest-dark text-white"
          >
            Enregistrer
          </Button>
        </section>
      </div>
    </div>
  );
}

