import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  ArrowRight,
  User,
  Chrome,
  Facebook,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface RegisterPageProps {
  onRegister: (data: {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => Promise<boolean>;
}

export default function RegisterPage({ onRegister }: RegisterPageProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (step === 1) {
      if (!formData.first_name || !formData.last_name || !formData.username) {
        setError('Veuillez remplir tous les champs');
        return;
      }
      setStep(2);
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (!acceptTerms) {
      setError('Vous devez accepter les conditions d\'utilisation');
      return;
    }

    setIsLoading(true);
    const success = await onRegister(formData);
    if (!success) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    }
    setIsLoading(false);
  };

  const steps = [
    { number: 1, label: 'Profil' },
    { number: 2, label: 'Sécurité' },
  ];

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 bg-forest rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="font-serif text-2xl font-bold text-forest">BiblioCongo</span>
          </Link>
          <h2 className="mt-6 font-serif text-3xl font-bold text-gray-dark">
            Créer un Compte
          </h2>
          <p className="mt-2 text-gray-medium">
            Rejoignez la communauté de lecture congolaise
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {steps.map((s, index) => (
            <div key={s.number} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= s.number 
                  ? 'bg-forest text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {step > s.number ? <CheckCircle className="w-5 h-5" /> : s.number}
              </div>
              <span className={`ml-2 text-sm ${step >= s.number ? 'text-gray-dark' : 'text-gray-400'}`}>
                {s.label}
              </span>
              {index < steps.length - 1 && (
                <div className="w-8 h-0.5 bg-gray-200 mx-2" />
              )}
            </div>
          ))}
        </div>

        {/* Register Form */}
        <div className="bg-white rounded-2xl border border-gray-light p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-dark mb-2">
                      Prénom
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium" />
                      <Input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        placeholder="Jean"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-dark mb-2">
                      Nom
                    </label>
                    <Input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      placeholder="Kouassi"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-dark mb-2">
                    Nom d'utilisateur
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-medium">@</span>
                    <Input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="jeankouassi"
                      className="pl-8"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-dark mb-2">
                    Adresse Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium" />
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="votre@email.com"
                      className="pl-10"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-dark mb-2">
                    Mot de Passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-medium hover:text-gray-dark"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-medium">
                    Minimum 8 caractères, avec une majuscule et un chiffre
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-dark mb-2">
                    Confirmer le Mot de Passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      name="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  />
                  <label htmlFor="terms" className="text-sm text-gray-medium">
                    J'accepte les{' '}
                    <Link to="/terms" className="text-forest hover:underline">
                      conditions d'utilisation
                    </Link>{' '}
                    et la{' '}
                    <Link to="/privacy" className="text-forest hover:underline">
                      politique de confidentialité
                    </Link>
                  </label>
                </div>
              </>
            )}

            <div className="flex gap-4">
              {step === 2 && (
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep(1)}
                >
                  Retour
                </Button>
              )}
              <Button
                type="submit"
                className="flex-1 bg-forest hover:bg-forest-dark text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                ) : step === 1 ? (
                  <>
                    Continuer
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  <>
                    Créer mon Compte
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-light" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-medium">Ou s'inscrire avec</span>
            </div>
          </div>

          {/* Social Register */}
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="w-full">
              <Chrome className="w-5 h-5 mr-2" />
              Google
            </Button>
            <Button variant="outline" className="w-full">
              <Facebook className="w-5 h-5 mr-2" />
              Facebook
            </Button>
          </div>
        </div>

        {/* Login Link */}
        <p className="mt-6 text-center text-gray-medium">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-forest font-medium hover:underline">
            Se connecter
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
