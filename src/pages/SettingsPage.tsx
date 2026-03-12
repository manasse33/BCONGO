import { useEffect, useState } from 'react';
import { User, Bell, Shield, Lock, Trash2, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { User as UserType } from '@/types';
import { authApi, recommendationsApi, settingsApi, userApi } from '@/services/api';

interface SettingsPageProps {
  user: UserType;
  onLogout: () => Promise<void> | void;
}

export default function SettingsPage({ user, onLogout }: SettingsPageProps) {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [discoverCount, setDiscoverCount] = useState(0);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    password: '',
    password_confirmation: '',
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await settingsApi.get();
        setSettings(data ?? {});
      } catch {
        setSettings({});
      }
    };

    loadSettings();
  }, []);

  const saveNotifications = async () => {
    setLoading(true);
    try {
      await settingsApi.updateNotifications({
        email_notifications: Boolean(settings.email_notifications),
        push_notifications: Boolean(settings.push_notifications),
      });
      toast.success('Notifications mises a jour.');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Echec de mise a jour.');
    } finally {
      setLoading(false);
    }
  };

  const saveReadingPreferences = async () => {
    setLoading(true);
    try {
      await settingsApi.updateReadingPreferences({
        preferred_genres: settings.preferred_genres ?? [],
        daily_goal: Number(settings.daily_goal ?? 0),
      });
      toast.success('Preferences de lecture mises a jour.');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Echec de mise a jour.');
    } finally {
      setLoading(false);
    }
  };

  const savePrivacy = async () => {
    setLoading(true);
    try {
      await settingsApi.updatePrivacy({
        profile_public: Boolean(settings.profile_public),
        show_reading_history: Boolean(settings.show_reading_history),
      });
      toast.success('Confidentialite mise a jour.');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Echec de mise a jour.');
    } finally {
      setLoading(false);
    }
  };

  const saveRecommendationPreferences = async () => {
    setLoading(true);
    try {
      await recommendationsApi.updatePreferences({
        romans: 5,
        scolaires: 3,
        bd: 2,
      });
      const discover = await recommendationsApi.getDiscover();
      setDiscoverCount(discover.length);
      toast.success('Preferences de recommandations mises a jour.');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Mise a jour recommandations impossible.');
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    if (passwordForm.password !== passwordForm.password_confirmation) {
      toast.error('La confirmation du mot de passe est invalide.');
      return;
    }

    setLoading(true);
    try {
      await authApi.changePassword(
        passwordForm.current,
        passwordForm.password,
        passwordForm.password_confirmation
      );
      setPasswordForm({ current: '', password: '', password_confirmation: '' });
      toast.success('Mot de passe modifie.');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Impossible de changer le mot de passe.');
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    setLoading(true);
    try {
      await authApi.resendVerificationEmail();
      toast.success('Email de verification renvoye.');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Renvoi impossible.');
    } finally {
      setLoading(false);
    }
  };

  const deleteAvatar = async () => {
    setLoading(true);
    try {
      await userApi.deleteAvatar();
      toast.success('Avatar supprime.');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Suppression impossible.');
    } finally {
      setLoading(false);
    }
  };

  const updateAvatar = async () => {
    if (!avatarFile) {
      toast.error('Selectionnez un fichier avatar.');
      return;
    }
    setLoading(true);
    try {
      await userApi.updateAvatar(avatarFile);
      toast.success('Avatar mis a jour.');
      setAvatarFile(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Mise a jour avatar impossible.');
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    const confirmed = window.confirm('Confirmer la suppression definitive de votre compte ?');
    if (!confirmed) return;

    setLoading(true);
    try {
      await settingsApi.deleteAccount();
      await onLogout();
      toast.success('Compte supprime.');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Suppression du compte impossible.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen app-shell bg-cream">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-dark">Parametres du compte</h1>
          <p className="text-gray-medium mt-2">Configuration liee aux routes `settings/*` et `auth/*`.</p>
        </div>

        <section className="bg-white rounded-2xl border border-gray-light p-6 space-y-4">
          <h2 className="font-semibold text-gray-dark flex items-center gap-2">
            <User className="w-4 h-4" /> Profil
          </h2>
          <p className="text-sm text-gray-medium">
            Utilisateur: {user.first_name} {user.last_name} (@{user.username})
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)} className="max-w-xs" />
            <Button variant="outline" onClick={updateAvatar} disabled={loading || !avatarFile}>
              Mettre a jour avatar
            </Button>
            <Button variant="outline" onClick={deleteAvatar} disabled={loading}>
              Supprimer l'avatar
            </Button>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-light p-6 space-y-4">
          <h2 className="font-semibold text-gray-dark flex items-center gap-2">
            <Bell className="w-4 h-4" /> Notifications
          </h2>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={Boolean(settings.email_notifications)}
              onChange={(e) => setSettings((prev) => ({ ...prev, email_notifications: e.target.checked }))}
            />
            <span className="text-sm">Email notifications</span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={Boolean(settings.push_notifications)}
              onChange={(e) => setSettings((prev) => ({ ...prev, push_notifications: e.target.checked }))}
            />
            <span className="text-sm">Push notifications</span>
          </div>
          <Button onClick={saveNotifications} disabled={loading} className="bg-forest hover:bg-forest-dark text-white">
            Enregistrer
          </Button>
        </section>

        <section className="bg-white rounded-2xl border border-gray-light p-6 space-y-4">
          <h2 className="font-semibold text-gray-dark flex items-center gap-2">
            <Shield className="w-4 h-4" /> Lecture et confidentialite
          </h2>
          <div>
            <label className="block text-sm text-gray-medium mb-1">Objectif quotidien</label>
            <Input
              type="number"
              value={String(settings.daily_goal ?? 0)}
              onChange={(e) => setSettings((prev) => ({ ...prev, daily_goal: Number(e.target.value) }))}
            />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={Boolean(settings.profile_public)}
              onChange={(e) => setSettings((prev) => ({ ...prev, profile_public: e.target.checked }))}
            />
            <span className="text-sm">Profil public</span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={Boolean(settings.show_reading_history)}
              onChange={(e) => setSettings((prev) => ({ ...prev, show_reading_history: e.target.checked }))}
            />
            <span className="text-sm">Afficher l'historique de lecture</span>
          </div>
          <div className="flex gap-2">
            <Button onClick={saveReadingPreferences} disabled={loading} variant="outline">
              Sauver lecture
            </Button>
            <Button onClick={savePrivacy} disabled={loading} className="bg-forest hover:bg-forest-dark text-white">
              Sauver confidentialite
            </Button>
            <Button onClick={saveRecommendationPreferences} disabled={loading} variant="outline">
              Recommandations ({discoverCount})
            </Button>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-light p-6 space-y-4">
          <h2 className="font-semibold text-gray-dark flex items-center gap-2">
            <Lock className="w-4 h-4" /> Securite
          </h2>
          <form className="space-y-3" onSubmit={changePassword}>
            <Input
              type="password"
              placeholder="Mot de passe actuel"
              value={passwordForm.current}
              onChange={(e) => setPasswordForm((prev) => ({ ...prev, current: e.target.value }))}
              required
            />
            <Input
              type="password"
              placeholder="Nouveau mot de passe"
              value={passwordForm.password}
              onChange={(e) => setPasswordForm((prev) => ({ ...prev, password: e.target.value }))}
              required
            />
            <Input
              type="password"
              placeholder="Confirmation du mot de passe"
              value={passwordForm.password_confirmation}
              onChange={(e) => setPasswordForm((prev) => ({ ...prev, password_confirmation: e.target.value }))}
              required
            />
            <Button type="submit" disabled={loading} className="bg-forest hover:bg-forest-dark text-white">
              Modifier le mot de passe
            </Button>
          </form>
          <Button onClick={resendVerification} disabled={loading} variant="outline">
            <Mail className="w-4 h-4 mr-2" />
            Renvoyer verification email
          </Button>
        </section>

        <section className="bg-white rounded-2xl border border-red-200 p-6 space-y-4">
          <h2 className="font-semibold text-red-700 flex items-center gap-2">
            <Trash2 className="w-4 h-4" /> Zone dangereuse
          </h2>
          <Button onClick={deleteAccount} disabled={loading} variant="destructive">
            Supprimer mon compte
          </Button>
        </section>
      </div>
    </div>
  );
}

