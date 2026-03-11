import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

// Layout
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Pages
import HomePage from '@/pages/HomePage';
import LibraryPage from '@/pages/LibraryPage';
import SchoolLibraryPage from '@/pages/SchoolLibraryPage';
import AudiobooksPage from '@/pages/AudiobooksPage';
import SocialPage from '@/pages/SocialPage';
import ContestsPage from '@/pages/ContestsPage';
import AuthorDashboard from '@/pages/AuthorDashboard';
import BookReader from '@/pages/BookReader';
import SearchPage from '@/pages/SearchPage';
import ProfilePage from '@/pages/ProfilePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import VerifyEmailPage from '@/pages/VerifyEmailPage';
import SettingsPage from '@/pages/SettingsPage';
import AdminPage from '@/pages/AdminPage';
import PublicUserPage from '@/pages/PublicUserPage';

// Types
import type { User } from '@/types';
import { authApi } from '@/services/api';
import { canAccessAdminSpace, canAccessAuthorSpace } from '@/lib/rbac';

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token and validate session
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const userData = await authApi.me();
          setUser(userData);
        } catch (error) {
          try {
            await authApi.refresh();
            const userData = await authApi.me();
            setUser(userData);
          } catch (refreshError) {
            localStorage.removeItem('auth_token');
            setUser(null);
          }
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = async (credentials: { email: string; password: string; remember?: boolean }) => {
    try {
      const { user: userData, token } = await authApi.login(credentials);
      localStorage.setItem('auth_token', token);
      try {
        const profile = await authApi.me();
        setUser(profile);
      } catch (error) {
        setUser(userData);
      }
      toast.success('Connexion réussie !');
      return true;
    } catch (error) {
      toast.error('Échec de la connexion. Vérifiez vos identifiants.');
      return false;
    }
  };

  const handleRegister = async (data: {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => {
    try {
      const { user: userData, token } = await authApi.register(data);
      localStorage.setItem('auth_token', token);
      try {
        const profile = await authApi.me();
        setUser(profile);
      } catch (error) {
        setUser(userData);
      }
      toast.success('Inscription réussie ! Bienvenue sur BiblioCongo.');
      return true;
    } catch (error) {
      toast.error('Échec de l\'inscription. Veuillez réessayer.');
      return false;
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      setUser(null);
      toast.success('Déconnexion réussie.');
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook', accessToken: string) => {
    try {
      const { user: userData, token } = await authApi.socialLogin(provider, accessToken);
      localStorage.setItem('auth_token', token);
      try {
        const profile = await authApi.me();
        setUser(profile);
      } catch (error) {
        setUser(userData);
      }
      toast.success(`Connexion ${provider} reussie.`);
      return true;
    } catch (error) {
      toast.error(`Echec de connexion ${provider}.`);
      return false;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest" />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-cream flex flex-col">
        <Header user={user} onLogout={handleLogout} />
        
        <main className="flex-1 pt-18 lg:pt-20">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage user={user} />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/school" element={<SchoolLibraryPage />} />
            <Route path="/audiobooks" element={<AudiobooksPage />} />
            <Route path="/social" element={<SocialPage user={user} />} />
            <Route path="/contests" element={<ContestsPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/book/:slug" element={<BookReader user={user} />} />
            
            {/* Auth Routes */}
            <Route 
              path="/login" 
              element={
                user ? 
                  <Navigate to="/" replace /> : 
                  <LoginPage onLogin={handleLogin} onSocialLogin={handleSocialLogin} />
              } 
            />
            <Route 
              path="/register" 
              element={
                user ? 
                  <Navigate to="/" replace /> : 
                  <RegisterPage onRegister={handleRegister} onSocialLogin={handleSocialLogin} />
              } 
            />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            
            {/* Protected Routes */}
            <Route 
              path="/profile" 
              element={
                user ? 
                  <ProfilePage user={user} /> : 
                  <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/author/dashboard" 
              element={
                user && canAccessAuthorSpace(user) ? 
                  <AuthorDashboard user={user} /> : 
                  <Navigate to="/" replace />
              } 
            />
            <Route
              path="/settings"
              element={
                user ?
                  <SettingsPage user={user} onLogout={handleLogout} /> :
                  <Navigate to="/login" replace />
              }
            />
            <Route
              path="/verify-email/:id/:hash"
              element={
                user ?
                  <VerifyEmailPage /> :
                  <Navigate to="/login" replace />
              }
            />
            <Route
              path="/admin"
              element={
                user && canAccessAdminSpace(user) ?
                  <AdminPage user={user} /> :
                  <Navigate to="/" replace />
              }
            />
            <Route
              path="/author/:username"
              element={
                user ?
                  <PublicUserPage currentUser={user} /> :
                  <Navigate to="/login" replace />
              }
            />
            
            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
        <Toaster position="top-right" richColors />
      </div>
    </Router>
  );
}

export default App;


