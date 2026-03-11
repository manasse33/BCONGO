import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authApi } from '@/services/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      await authApi.forgotPassword(email);
      setIsSent(true);
      toast.success('Lien de reinitialisation envoye.');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Impossible d envoyer le lien.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-gray-light rounded-2xl p-8">
        <h1 className="font-serif text-2xl font-bold text-gray-dark mb-2">Mot de passe oublie</h1>
        <p className="text-sm text-gray-medium mb-6">
          Entrez votre email pour recevoir un lien de reinitialisation.
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-dark mb-2">Adresse email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-medium" />
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
                placeholder="votre@email.com"
              />
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full bg-forest hover:bg-forest-dark text-white">
            {isLoading ? 'Envoi...' : 'Envoyer le lien'}
            {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </form>

        {isSent && (
          <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
            Verifiez votre boite mail puis ouvrez le lien recu.
          </p>
        )}

        <div className="mt-6 text-sm text-gray-medium">
          <Link to="/login" className="text-forest hover:underline">
            Retour a la connexion
          </Link>
        </div>
      </div>
    </div>
  );
}
