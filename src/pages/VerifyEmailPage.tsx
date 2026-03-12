import { useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Mail, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { authApi } from '@/services/api';

export default function VerifyEmailPage() {
  const { id, hash } = useParams<{ id: string; hash: string }>();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const queryParams = useMemo(() => {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }, [searchParams]);

  const handleVerify = async () => {
    if (!id || !hash) {
      toast.error('Lien de verification invalide.');
      return;
    }

    setIsLoading(true);
    try {
      await authApi.verifyEmail(id, hash, queryParams);
      setIsVerified(true);
      toast.success('Email verifie avec succes.');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Verification impossible.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    try {
      await authApi.resendVerificationEmail();
      toast.success('Email de verification renvoye.');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Renvoi impossible.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen app-shell bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-gray-light rounded-2xl p-8">
        <h1 className="font-serif text-2xl font-bold text-gray-dark mb-2">Verification Email</h1>
        <p className="text-sm text-gray-medium mb-6">
          Utilisez le lien recu ou lancez la verification manuellement.
        </p>

        {isVerified ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5" />
            Email verifie.
          </div>
        ) : null}

        <div className="space-y-3">
          <Button onClick={handleVerify} disabled={isLoading} className="w-full bg-forest hover:bg-forest-dark text-white">
            <Mail className="w-4 h-4 mr-2" />
            Verifier mon email
          </Button>
          <Button onClick={handleResend} disabled={isLoading} variant="outline" className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Renvoyer l'email
          </Button>
        </div>

        <div className="mt-6 text-sm text-gray-medium">
          <Link to="/profile" className="text-forest hover:underline">
            Retour au profil
          </Link>
        </div>
      </div>
    </div>
  );
}

