// User Types
export interface Role {
  id: number;
  name: string;
  label: string;
  description?: string;
}

export interface User {
  id: number;
  uuid: string;
  role_id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  email_verified_at?: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  date_of_birth?: string;
  gender?: 'M' | 'F' | 'autre';
  city?: string;
  school_level?: string;
  reading_score: number;
  is_active: boolean;
  is_banned: boolean;
  created_at: string;
  updated_at: string;
}

// Book Types
export type BookType = 'livre' | 'roman' | 'bd' | 'jeunesse' | 'scolaire' | 'universitaire' | 'audio' | 'poeme' | 'nouvelle' | 'document_historique';
export type BookStatus = 'brouillon' | 'en_validation' | 'publie' | 'rejete' | 'archive';

export interface Genre {
  id: number;
  parent_id?: number;
  slug: string;
  name: string;
  description?: string;
  cover_image?: string;
  sort_order: number;
}

export interface Language {
  id: number;
  code: string;
  label: string;
}

export interface Publisher {
  id: number;
  name: string;
  slug: string;
  country?: string;
  website?: string;
  description?: string;
  logo?: string;
}

export interface Book {
  id: number;
  uuid: string;
  author_user_id?: number;
  publisher_id?: number;
  language_id: number;
  title: string;
  slug: string;
  subtitle?: string;
  author_name: string;
  description?: string;
  cover_image?: string;
  isbn?: string;
  publication_year?: number;
  pages_count?: number;
  type: BookType;
  status: BookStatus;
  is_free: boolean;
  price?: number;
  file_pdf?: string;
  file_epub?: string;
  file_audio?: string;
  file_size_kb?: number;
  duration_seconds?: number;
  download_count: number;
  read_count: number;
  avg_rating: number;
  ratings_count: number;
  is_featured: boolean;
  published_at?: string;
  created_at: string;
  genres?: Genre[];
  tags?: string[];
}

// Reading Types
export type ReadingStatus = 'en_cours' | 'termine' | 'abandonne' | 'a_lire';

export interface UserReading {
  id: number;
  user_id: number;
  book_id: number;
  status: ReadingStatus;
  current_page: number;
  current_position?: string;
  progress_percent: number;
  total_seconds_read: number;
  started_at?: string;
  finished_at?: string;
  book?: Book;
}

export interface Bookmark {
  id: number;
  user_id: number;
  book_id: number;
  page?: number;
  position?: string;
  note?: string;
  color: string;
  created_at: string;
}

export interface Annotation {
  id: number;
  user_id: number;
  book_id: number;
  selected_text: string;
  note?: string;
  page?: number;
  cfi_range?: string;
  color: string;
  created_at: string;
}

export interface Review {
  id: number;
  user_id: number;
  book_id: number;
  rating_id?: number;
  content: string;
  is_approved: boolean;
  likes_count: number;
  created_at: string;
  user?: User;
}

export interface Rating {
  id: number;
  user_id: number;
  book_id: number;
  score: number;
  created_at: string;
}

// Social Types
export interface Follow {
  follower_id: number;
  followed_id: number;
  created_at: string;
}

export interface ReadingClub {
  id: number;
  creator_id: number;
  name: string;
  slug: string;
  description?: string;
  cover_image?: string;
  is_private: boolean;
  members_count: number;
  created_at: string;
  creator?: User;
}

export interface ClubMember {
  club_id: number;
  user_id: number;
  role: 'membre' | 'moderateur' | 'admin';
  joined_at: string;
  user?: User;
}

export interface ClubDiscussion {
  id: number;
  club_id: number;
  user_id: number;
  book_id?: number;
  title: string;
  content: string;
  replies_count: number;
  created_at: string;
  user?: User;
}

// Challenge Types
export type ChallengeType = 'livres_par_periode' | 'genre_specifique' | 'auteur_congolais' | 'pages' | 'temps';

export interface ReadingChallenge {
  id: number;
  creator_id?: number;
  title: string;
  description?: string;
  challenge_type: ChallengeType;
  target_value: number;
  period_days?: number;
  starts_at: string;
  ends_at: string;
  is_public: boolean;
  participants_count: number;
  created_at: string;
}

export interface UserChallengeParticipation {
  id: number;
  user_id: number;
  challenge_id: number;
  current_value: number;
  is_completed: boolean;
  completed_at?: string;
  joined_at: string;
  challenge?: ReadingChallenge;
}

// Contest Types
export type ContestType = 'ecriture' | 'poesie' | 'nouvelle' | 'bd';
export type ContestStatus = 'brouillon' | 'ouvert' | 'vote' | 'termine' | 'annule';

export interface Contest {
  id: number;
  organizer_id?: number;
  title: string;
  slug: string;
  description?: string;
  contest_type: ContestType;
  rules?: string;
  prizes_description?: string;
  cover_image?: string;
  max_participants?: number;
  max_words?: number;
  submission_start: string;
  submission_end: string;
  voting_end?: string;
  results_date?: string;
  status: ContestStatus;
  participants_count: number;
  created_at: string;
}

export interface ContestSubmission {
  id: number;
  contest_id: number;
  user_id: number;
  book_id?: number;
  title: string;
  content?: string;
  file_path?: string;
  status: 'soumis' | 'en_examen' | 'accepte' | 'rejete';
  votes_count: number;
  rank?: number;
  submitted_at: string;
  user?: User;
}

// Badge Types
export interface Badge {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  condition_type: string;
  condition_value: number;
  points: number;
}

export interface UserBadge {
  user_id: number;
  badge_id: number;
  earned_at: string;
  badge?: Badge;
}

// School Types
export interface SchoolLevel {
  id: number;
  name: string;
  type: 'primaire' | 'secondaire' | 'superieur';
  sort_order: number;
}

export interface Subject {
  id: number;
  name: string;
  icon?: string;
}

// Notification Types
export interface Notification {
  id: string;
  notifiable_type: string;
  notifiable_id: number;
  type: string;
  data: Record<string, any>;
  read_at?: string;
  created_at: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterData {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
  date_of_birth?: string;
  city?: string;
}

// Audio Player Types
export interface AudioTrack {
  id: number;
  book_id: number;
  title: string;
  duration: number;
  file_url: string;
  chapter_number?: number;
}

// Search Types
export interface SearchFilters {
  genre?: string;
  author?: string;
  language?: string;
  format?: 'pdf' | 'epub' | 'audio';
  type?: BookType;
  is_free?: boolean;
  min_rating?: number;
  year?: number;
}
