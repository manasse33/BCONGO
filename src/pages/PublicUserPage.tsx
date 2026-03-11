import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BookOpen, UserPlus, UserMinus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Book, User } from '@/types';
import { socialApi, userApi } from '@/services/api';

interface PublicUserPageProps {
  currentUser: User;
}

export default function PublicUserPage({ currentUser }: PublicUserPageProps) {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<User | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!username) return;
      setIsLoading(true);
      try {
        const [userData, userBooks, following] = await Promise.all([
          userApi.getPublicProfile(username),
          userApi.getUserBooks(username),
          socialApi.getFollowing(),
        ]);
        setProfile(userData);
        setBooks(userBooks);
        setIsFollowing(following.some((followed) => followed.id === userData.id));
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Profil utilisateur indisponible.');
        setProfile(null);
        setBooks([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [username]);

  const toggleFollow = async () => {
    if (!profile || profile.id === currentUser.id) return;
    try {
      if (isFollowing) {
        await socialApi.unfollow(profile.id);
        setIsFollowing(false);
        toast.success('Utilisateur retire de vos abonnements.');
      } else {
        await socialApi.follow(profile.id);
        setIsFollowing(true);
        toast.success('Utilisateur suivi.');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Action impossible.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-medium">Profil introuvable.</p>
          <Link to="/social" className="text-forest hover:underline text-sm">
            Retour a la communaute
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <section className="bg-white border border-gray-light rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={profile.avatar} />
              <AvatarFallback className="bg-forest text-white text-xl">
                {profile.first_name[0]}
                {profile.last_name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="font-serif text-2xl font-bold text-gray-dark">
                {profile.first_name} {profile.last_name}
              </h1>
              <p className="text-sm text-gray-medium">@{profile.username}</p>
              <p className="text-sm text-gray-medium mt-1">{profile.bio ?? 'Aucune bio.'}</p>
            </div>
            {profile.id !== currentUser.id && (
              <Button onClick={toggleFollow} className="bg-forest hover:bg-forest-dark text-white">
                {isFollowing ? (
                  <>
                    <UserMinus className="w-4 h-4 mr-2" />
                    Ne plus suivre
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Suivre
                  </>
                )}
              </Button>
            )}
          </div>
        </section>

        <section className="bg-white border border-gray-light rounded-2xl p-6">
          <h2 className="font-serif text-xl font-bold text-gray-dark mb-4">Livres publies</h2>
          {books.length === 0 ? (
            <p className="text-gray-medium">Aucun livre disponible.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {books.map((book) => (
                <Link key={book.id} to={`/book/${book.slug}`} className="group">
                  <div className="aspect-[2/3] rounded-lg overflow-hidden mb-2">
                    <img src={book.cover_image} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <p className="font-medium text-sm text-gray-dark line-clamp-1">{book.title}</p>
                  <p className="text-xs text-gray-medium flex items-center gap-1">
                    <BookOpen className="w-3 h-3" /> {book.read_count} lectures
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
