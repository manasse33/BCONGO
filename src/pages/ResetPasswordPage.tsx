import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authApi } from '@/services/api';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState(searchParams.get('token') ?? '');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!token) {
      toast.error('Token de reinitialisation manquant.');
      return;
    }

    if (password !== passwordConfirmation) {
      toast.error('Les mots de passe ne correspondent pas.');
      return;
    }

    setIsLoading(true);
    try {
      await authApi.resetPassword(token, password, passwordConfirmation);
      toast.success('Mot de passe reinitialise avec succes.');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Reinitialisation impossible.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-gray-light rounded-2xl p-8">
        <h1 className="font-serif text-2xl font-bold text-gray-dark mb-2">Reinitialiser le mot de passe</h1>
        <p className="text-sm text-gray-medium mb-6">Entrez votre nouveau mot de passe.</p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-dark mb-2">Token</label>
            <Input value={token} onChange={(e) => setToken(e.target.value)} placeholder="Token recu par email" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-dark mb-2">Nouveau mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-medium" />
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9"
                placeholder="********"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-dark mb-2">Confirmation</label>
            <Input
              type="password"
              required
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="********"
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full bg-forest hover:bg-forest-dark text-white">
            {isLoading ? 'Validation...' : 'Valider'}
            {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </form>

        <div className="mt-6 text-sm text-gray-medium">
          <Link to="/login" className="text-forest hover:underline">
            Retour a la connexion
          </Link>
        </div>
      </div>
    </div>
  );
}
