import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2,
  Headphones,
  Clock,
  Download,
  Heart,
  Share2,
  Mic,
  Music,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { books } from '@/data/mockData';

// Format seconds to MM:SS
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Mock audio book data
const audiobooks = books.filter(book => book.type === 'audio');

const podcastCategories = [
  { icon: Mic, name: 'Philosophie Simple', episodes: 24 },
  { icon: Music, name: 'Science Expliquée', episodes: 18 },
  { icon: BookOpen, name: 'Histoire Dévoilée', episodes: 32 },
  { icon: Headphones, name: 'Contes Africains', episodes: 45 },
];

const continueListening = [
  { title: 'Chapitre 3: La Ruse d\'Anansi', book: 'La Légende d\'Anansi', progress: 65, duration: 1080 },
  { title: 'Épisode 2: Les Mystères du Cosmos', book: 'Science Expliquée', progress: 30, duration: 2400 },
  { title: 'Chapitre 1: Introduction', book: 'Histoire du Congo', progress: 90, duration: 720 },
];

const playlists = [
  { name: 'Mythes d\'Afrique', count: 12, image: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=200&h=200&fit=crop' },
  { name: 'Poésie Parlée', count: 8, image: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=200&h=200&fit=crop' },
  { name: 'Histoire et Culture', count: 15, image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=200&h=200&fit=crop' },
];

export default function AudiobooksPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(4520); // Mock duration in seconds
  const [volume, setVolume] = useState(80);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentTrack, setCurrentTrack] = useState(audiobooks[0] || null);
  const [activeTab, setActiveTab] = useState<'audiobooks' | 'podcasts'>('audiobooks');
  
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Simulate progress when playing
  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    }
    
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isPlaying, duration]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    setCurrentTime(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  const progressPercent = (currentTime / duration) * 100;

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-white border-b border-gray-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 text-sm text-gray-medium mb-2">
              <Link to="/" className="hover:text-forest">Accueil</Link>
              <span>/</span>
              <span className="text-forest">Livres Audio & Podcasts</span>
            </div>
            <h1 className="font-serif text-3xl lg:text-4xl font-bold text-gray-dark">
              Livres Audio & Podcasts
            </h1>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab('audiobooks')}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              activeTab === 'audiobooks'
                ? 'bg-forest text-white'
                : 'bg-white text-gray-dark border border-gray-light hover:border-forest'
            }`}
          >
            Livres Audio
          </button>
          <button
            onClick={() => setActiveTab('podcasts')}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              activeTab === 'podcasts'
                ? 'bg-forest text-white'
                : 'bg-white text-gray-dark border border-gray-light hover:border-forest'
            }`}
          >
            Podcasts
          </button>
        </div>

        {activeTab === 'audiobooks' ? (
          <>
            {/* Featured Audio Book Player */}
            {currentTrack && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-12"
              >
                <div className="bg-gradient-to-br from-forest to-forest-dark rounded-3xl p-6 lg:p-10 text-white">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Book Cover */}
                    <div className="lg:col-span-1">
                      <div className="relative aspect-square rounded-2xl overflow-hidden shadow-elevated">
                        <img
                          src={currentTrack.cover_image}
                          alt={currentTrack.title}
                          className="w-full h-full object-cover"
                        />
                        <button 
                          onClick={handlePlayPause}
                          className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
                        >
                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                            {isPlaying ? (
                              <Pause className="w-8 h-8 text-forest" />
                            ) : (
                              <Play className="w-8 h-8 text-forest ml-1" />
                            )}
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Player Controls */}
                    <div className="lg:col-span-2 flex flex-col justify-center">
                      <Badge className="w-fit bg-gold text-gray-dark mb-4">
                        <Headphones className="w-3 h-3 mr-1" />
                        Livre Audio
                      </Badge>
                      
                      <h2 className="font-serif text-3xl lg:text-4xl font-bold mb-2">
                        {currentTrack.title}
                      </h2>
                      <p className="text-white/80 text-lg mb-6">
                        Narrateur: Didi Dankwa
                      </p>

                      {/* Progress Bar */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between text-sm text-white/70 mb-2">
                          <span>{formatTime(currentTime)}</span>
                          <span>{formatTime(duration)}</span>
                        </div>
                        <div className="relative h-2 bg-white/20 rounded-full overflow-hidden">
                          <div 
                            className="absolute left-0 top-0 h-full bg-gold rounded-full transition-all"
                            style={{ width: `${progressPercent}%` }}
                          />
                          <Slider
                            value={[currentTime]}
                            max={duration}
                            step={1}
                            onValueChange={handleSeek}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                        </div>
                        {/* Audio Waveform Visualization */}
                        <div className="flex items-center justify-center gap-1 mt-4 h-12">
                          {Array.from({ length: 40 }).map((_, i) => (
                            <motion.div
                              key={i}
                              className="w-1 bg-gold rounded-full"
                              animate={{
                                height: isPlaying 
                                  ? [20, Math.random() * 40 + 10, 20]
                                  : 10
                              }}
                              transition={{
                                duration: 0.5,
                                repeat: isPlaying ? Infinity : 0,
                                delay: i * 0.02
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center justify-center gap-6">
                        <button className="text-white/70 hover:text-white transition-colors">
                          <SkipBack className="w-6 h-6" />
                        </button>
                        <button 
                          onClick={handlePlayPause}
                          className="w-14 h-14 bg-gold rounded-full flex items-center justify-center hover:bg-gold-light transition-colors"
                        >
                          {isPlaying ? (
                            <Pause className="w-7 h-7 text-gray-dark" />
                          ) : (
                            <Play className="w-7 h-7 text-gray-dark ml-1" />
                          )}
                        </button>
                        <button className="text-white/70 hover:text-white transition-colors">
                          <SkipForward className="w-6 h-6" />
                        </button>
                      </div>

                      {/* Secondary Controls */}
                      <div className="flex items-center justify-between mt-6">
                        <div className="flex items-center gap-4">
                          <Volume2 className="w-5 h-5 text-white/70" />
                          <Slider
                            value={[volume]}
                            max={100}
                            step={1}
                            onValueChange={handleVolumeChange}
                            className="w-24"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <Heart className="w-5 h-5" />
                          </button>
                          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <Share2 className="w-5 h-5" />
                          </button>
                          <div className="flex items-center gap-1 ml-2">
                            {[0.5, 1, 1.5, 2].map((rate) => (
                              <button
                                key={rate}
                                onClick={() => setPlaybackRate(rate)}
                                className={`px-2 py-1 rounded text-sm ${
                                  playbackRate === rate
                                    ? 'bg-gold text-gray-dark'
                                    : 'text-white/70 hover:text-white'
                                }`}
                              >
                                {rate}x
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chapters */}
                  <div className="mt-8 pt-8 border-t border-white/20">
                    <h3 className="font-semibold mb-4">Chapitres</h3>
                    <div className="space-y-2">
                      {['Chapitre 1: Introduction', 'Chapitre 2: La Toile d\'Araignée', 'Chapitre 3: La Ruse d\'Anansi', 'Chapitre 4: Le Défi du Roi'].map((chapter, i) => (
                        <button
                          key={chapter}
                          className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                            i === 2 ? 'bg-white/10' : 'hover:bg-white/5'
                          }`}
                        >
                          <span className={i === 2 ? 'text-gold' : ''}>{chapter}</span>
                          {i === 2 && <span className="text-gold text-sm">En cours</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.section>
            )}

            {/* Continue Listening */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-10"
            >
              <h3 className="font-serif text-2xl font-bold text-gray-dark mb-6">
                Continuer l'Écoute
              </h3>
              <div className="space-y-4">
                {continueListening.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-center gap-4 bg-white rounded-xl p-4 border border-gray-light hover:border-gold transition-colors"
                  >
                    <div className="w-16 h-16 bg-forest/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Headphones className="w-8 h-8 text-forest" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-dark">{item.title}</p>
                      <p className="text-sm text-gray-medium">{item.book}</p>
                      <div className="mt-2">
                        <div className="h-1.5 bg-gray-light rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-forest rounded-full"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-medium">{formatTime(item.duration - (item.duration * item.progress / 100))} restant</p>
                      <Button size="sm" variant="ghost" className="text-forest">
                        <Play className="w-4 h-4 mr-1" />
                        Reprendre
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Playlists */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-10"
            >
              <h3 className="font-serif text-2xl font-bold text-gray-dark mb-6">
                Vos Playlists
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {playlists.map((playlist) => (
                  <div
                    key={playlist.name}
                    className="bg-white rounded-xl border border-gray-light overflow-hidden hover:border-gold hover:shadow-light transition-all cursor-pointer"
                  >
                    <img
                      src={playlist.image}
                      alt={playlist.name}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-4">
                      <h4 className="font-medium text-gray-dark">{playlist.name}</h4>
                      <p className="text-sm text-gray-medium">{playlist.count} titres</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* More Audiobooks */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className="font-serif text-2xl font-bold text-gray-dark mb-6">
                Plus de Livres Audio
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {audiobooks.map((book) => (
                  <div
                    key={book.id}
                    className="bg-white rounded-xl border border-gray-light overflow-hidden hover:shadow-light transition-all cursor-pointer"
                    onClick={() => setCurrentTrack(book)}
                  >
                    <div className="relative">
                      <img
                        src={book.cover_image}
                        alt={book.title}
                        className="w-full aspect-square object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                          <Play className="w-6 h-6 text-forest ml-1" />
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium text-gray-dark line-clamp-1">{book.title}</h4>
                      <p className="text-sm text-gray-medium">{book.author_name}</p>
                      <div className="flex items-center gap-1 mt-2 text-sm text-gray-medium">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(book.duration_seconds || 0)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          </>
        ) : (
          /* Podcasts Tab */
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
              {podcastCategories.map((category) => (
                <div
                  key={category.name}
                  className="bg-white rounded-xl border border-gray-light p-6 hover:border-gold hover:shadow-light transition-all cursor-pointer text-center"
                >
                  <div className="w-16 h-16 bg-forest/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <category.icon className="w-8 h-8 text-forest" />
                  </div>
                  <h4 className="font-medium text-gray-dark">{category.name}</h4>
                  <p className="text-sm text-gray-medium">{category.episodes} épisodes</p>
                </div>
              ))}
            </div>

            <h3 className="font-serif text-2xl font-bold text-gray-dark mb-6">
              Épisodes Populaires
            </h3>
            <div className="space-y-4">
              {[
                { title: 'L\'origine de l\'univers', podcast: 'Science Expliquée', duration: 1800 },
                { title: 'Socrate et la philosophie', podcast: 'Philosophie Simple', duration: 2400 },
                { title: 'Les royaumes africains', podcast: 'Histoire Dévoilée', duration: 2100 },
                { title: 'Le lion et la hyène', podcast: 'Contes Africains', duration: 900 },
              ].map((episode) => (
                <div
                  key={episode.title}
                  className="flex items-center gap-4 bg-white rounded-xl p-4 border border-gray-light hover:border-gold transition-colors"
                >
                  <div className="w-12 h-12 bg-forest/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Play className="w-6 h-6 text-forest" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-dark">{episode.title}</h4>
                    <p className="text-sm text-gray-medium">{episode.podcast}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-medium">{formatTime(episode.duration)}</span>
                    <Button size="sm" variant="ghost">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
