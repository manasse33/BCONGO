import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import type { 
  ApiResponse, 
  PaginatedResponse, 
  Book, 
  User, 
  LoginCredentials, 
  RegisterData,
  Genre,
  ReadingChallenge,
  Contest,
  ReadingClub,
  Review,
  Bookmark,
  Annotation,
  UserReading,
  SearchFilters,
  ContestSubmission,
  Notification,
  Badge,
  Rating
} from '@/types';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Helper function to handle responses
const handleResponse = <T>(response: AxiosResponse<ApiResponse<T>>): T => {
  return response.data.data;
};

// Auth API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
    const response = await apiClient.post<ApiResponse<{ user: User; token: string }>>('/auth/login', credentials);
    const data = handleResponse(response);
    localStorage.setItem('auth_token', data.token);
    return data;
  },

  register: async (data: RegisterData): Promise<{ user: User; token: string }> => {
    const response = await apiClient.post<ApiResponse<{ user: User; token: string }>>('/auth/register', data);
    const result = handleResponse(response);
    localStorage.setItem('auth_token', result.token);
    return result;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('auth_token');
  },

  me: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    return handleResponse(response);
  },

  refresh: async (): Promise<{ token: string }> => {
    const response = await apiClient.post<ApiResponse<{ token: string }>>('/auth/refresh');
    const data = handleResponse(response);
    localStorage.setItem('auth_token', data.token);
    return data;
  },

  forgotPassword: async (email: string): Promise<void> => {
    await apiClient.post('/auth/password/forgot', { email });
  },

  resetPassword: async (token: string, password: string, passwordConfirmation: string): Promise<void> => {
    await apiClient.post('/auth/password/reset', { 
      token, 
      password, 
      password_confirmation: passwordConfirmation 
    });
  },

  socialLogin: async (provider: 'google' | 'facebook', token: string): Promise<{ user: User; token: string }> => {
    const response = await apiClient.post<ApiResponse<{ user: User; token: string }>>(`/auth/social/${provider}`, { token });
    const data = handleResponse(response);
    localStorage.setItem('auth_token', data.token);
    return data;
  },
};

// Books API
export const booksApi = {
  getAll: async (params?: { page?: number; per_page?: number; genre?: string; type?: string }): Promise<PaginatedResponse<Book>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Book>>>('/books', { params });
    return handleResponse(response);
  },

  getFeatured: async (): Promise<Book[]> => {
    const response = await apiClient.get<ApiResponse<Book[]>>('/books/featured');
    return handleResponse(response);
  },

  getTrending: async (): Promise<Book[]> => {
    const response = await apiClient.get<ApiResponse<Book[]>>('/books/trending');
    return handleResponse(response);
  },

  getNewArrivals: async (): Promise<Book[]> => {
    const response = await apiClient.get<ApiResponse<Book[]>>('/books/new-arrivals');
    return handleResponse(response);
  },

  getFree: async (): Promise<Book[]> => {
    const response = await apiClient.get<ApiResponse<Book[]>>('/books/free');
    return handleResponse(response);
  },

  getAudio: async (): Promise<Book[]> => {
    const response = await apiClient.get<ApiResponse<Book[]>>('/books/audio');
    return handleResponse(response);
  },

  getSchool: async (): Promise<Book[]> => {
    const response = await apiClient.get<ApiResponse<Book[]>>('/books/school');
    return handleResponse(response);
  },

  getBySlug: async (slug: string): Promise<Book> => {
    const response = await apiClient.get<ApiResponse<Book>>(`/books/${slug}`);
    return handleResponse(response);
  },

  getSimilar: async (slug: string): Promise<Book[]> => {
    const response = await apiClient.get<ApiResponse<Book[]>>(`/books/${slug}/similar`);
    return handleResponse(response);
  },

  getReviews: async (slug: string): Promise<Review[]> => {
    const response = await apiClient.get<ApiResponse<Review[]>>(`/books/${slug}/reviews`);
    return handleResponse(response);
  },

  // Author only
  create: async (bookData: Partial<Book>): Promise<Book> => {
    const response = await apiClient.post<ApiResponse<Book>>('/author/books', bookData);
    return handleResponse(response);
  },

  update: async (id: number, bookData: Partial<Book>): Promise<Book> => {
    const response = await apiClient.put<ApiResponse<Book>>(`/author/books/${id}`, bookData);
    return handleResponse(response);
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/author/books/${id}`);
  },

  getMyBooks: async (): Promise<Book[]> => {
    const response = await apiClient.get<ApiResponse<Book[]>>('/author/books');
    return handleResponse(response);
  },

  submitForReview: async (id: number): Promise<void> => {
    await apiClient.post(`/author/books/${id}/submit`);
  },

  getAuthorStats: async (): Promise<Record<string, number>> => {
    const response = await apiClient.get<ApiResponse<Record<string, number>>>('/author/stats');
    return handleResponse(response);
  },
};

// Genres API
export const genresApi = {
  getAll: async (): Promise<Genre[]> => {
    const response = await apiClient.get<ApiResponse<Genre[]>>('/genres');
    return handleResponse(response);
  },

  getBySlug: async (slug: string): Promise<{ genre: Genre; books: Book[] }> => {
    const response = await apiClient.get<ApiResponse<{ genre: Genre; books: Book[] }>>(`/genres/${slug}`);
    return handleResponse(response);
  },
};

// Search API
export const searchApi = {
  search: async (query: string, filters?: SearchFilters): Promise<Book[]> => {
    const response = await apiClient.get<ApiResponse<Book[]>>('/search', {
      params: { q: query, ...filters },
    });
    return handleResponse(response);
  },

  getSuggestions: async (query: string): Promise<string[]> => {
    const response = await apiClient.get<ApiResponse<string[]>>('/search/suggestions', {
      params: { q: query },
    });
    return handleResponse(response);
  },
};

// User API
export const userApi = {
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>('/profile');
    return handleResponse(response);
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await apiClient.put<ApiResponse<User>>('/profile', data);
    return handleResponse(response);
  },

  updateAvatar: async (file: File): Promise<{ avatar: string }> => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await apiClient.post<ApiResponse<{ avatar: string }>>('/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return handleResponse(response);
  },

  getStats: async (): Promise<Record<string, number>> => {
    const response = await apiClient.get<ApiResponse<Record<string, number>>>('/profile/stats');
    return handleResponse(response);
  },

  getBadges: async (): Promise<Badge[]> => {
    const response = await apiClient.get<ApiResponse<Badge[]>>('/profile/badges');
    return handleResponse(response);
  },

  getReadingHistory: async (): Promise<UserReading[]> => {
    const response = await apiClient.get<ApiResponse<UserReading[]>>('/profile/reading-history');
    return handleResponse(response);
  },

  getPublicProfile: async (username: string): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>(`/users/${username}`);
    return handleResponse(response);
  },

  getUserBooks: async (username: string): Promise<Book[]> => {
    const response = await apiClient.get<ApiResponse<Book[]>>(`/users/${username}/books`);
    return handleResponse(response);
  },
};

// Reading API
export const readingApi = {
  getMyReadings: async (): Promise<UserReading[]> => {
    const response = await apiClient.get<ApiResponse<UserReading[]>>('/readings');
    return handleResponse(response);
  },

  startReading: async (bookId: number): Promise<UserReading> => {
    const response = await apiClient.post<ApiResponse<UserReading>>(`/readings/${bookId}/start`);
    return handleResponse(response);
  },

  updateProgress: async (bookId: number, progress: { current_page: number; progress_percent: number }): Promise<UserReading> => {
    const response = await apiClient.put<ApiResponse<UserReading>>(`/readings/${bookId}/progress`, progress);
    return handleResponse(response);
  },

  finishReading: async (bookId: number): Promise<UserReading> => {
    const response = await apiClient.post<ApiResponse<UserReading>>(`/readings/${bookId}/finish`);
    return handleResponse(response);
  },

  abandonReading: async (bookId: number): Promise<UserReading> => {
    const response = await apiClient.post<ApiResponse<UserReading>>(`/readings/${bookId}/abandon`);
    return handleResponse(response);
  },
};

// Bookmarks API
export const bookmarksApi = {
  getAll: async (bookId: number): Promise<Bookmark[]> => {
    const response = await apiClient.get<ApiResponse<Bookmark[]>>(`/books/${bookId}/bookmarks`);
    return handleResponse(response);
  },

  create: async (bookId: number, data: Partial<Bookmark>): Promise<Bookmark> => {
    const response = await apiClient.post<ApiResponse<Bookmark>>(`/books/${bookId}/bookmarks`, data);
    return handleResponse(response);
  },

  update: async (bookId: number, id: number, data: Partial<Bookmark>): Promise<Bookmark> => {
    const response = await apiClient.put<ApiResponse<Bookmark>>(`/books/${bookId}/bookmarks/${id}`, data);
    return handleResponse(response);
  },

  delete: async (bookId: number, id: number): Promise<void> => {
    await apiClient.delete(`/books/${bookId}/bookmarks/${id}`);
  },
};

// Annotations API
export const annotationsApi = {
  getAll: async (bookId: number): Promise<Annotation[]> => {
    const response = await apiClient.get<ApiResponse<Annotation[]>>(`/books/${bookId}/annotations`);
    return handleResponse(response);
  },

  create: async (bookId: number, data: Partial<Annotation>): Promise<Annotation> => {
    const response = await apiClient.post<ApiResponse<Annotation>>(`/books/${bookId}/annotations`, data);
    return handleResponse(response);
  },

  update: async (bookId: number, id: number, data: Partial<Annotation>): Promise<Annotation> => {
    const response = await apiClient.put<ApiResponse<Annotation>>(`/books/${bookId}/annotations/${id}`, data);
    return handleResponse(response);
  },

  delete: async (bookId: number, id: number): Promise<void> => {
    await apiClient.delete(`/books/${bookId}/annotations/${id}`);
  },
};

// Library API
export const libraryApi = {
  getAll: async (): Promise<Book[]> => {
    const response = await apiClient.get<ApiResponse<Book[]>>('/library');
    return handleResponse(response);
  },

  getToRead: async (): Promise<Book[]> => {
    const response = await apiClient.get<ApiResponse<Book[]>>('/library/to-read');
    return handleResponse(response);
  },

  getReading: async (): Promise<Book[]> => {
    const response = await apiClient.get<ApiResponse<Book[]>>('/library/reading');
    return handleResponse(response);
  },

  getCompleted: async (): Promise<Book[]> => {
    const response = await apiClient.get<ApiResponse<Book[]>>('/library/completed');
    return handleResponse(response);
  },

  getFavorites: async (): Promise<Book[]> => {
    const response = await apiClient.get<ApiResponse<Book[]>>('/library/favorites');
    return handleResponse(response);
  },

  toggleFavorite: async (bookId: number): Promise<{ is_favorite: boolean }> => {
    const response = await apiClient.post<ApiResponse<{ is_favorite: boolean }>>(`/library/favorites/${bookId}`);
    return handleResponse(response);
  },
};

// Reviews API
export const reviewsApi = {
  getMyReviews: async (): Promise<Review[]> => {
    const response = await apiClient.get<ApiResponse<Review[]>>('/reviews/my');
    return handleResponse(response);
  },

  create: async (bookId: number, content: string): Promise<Review> => {
    const response = await apiClient.post<ApiResponse<Review>>(`/reviews/books/${bookId}`, { content });
    return handleResponse(response);
  },

  update: async (id: number, content: string): Promise<Review> => {
    const response = await apiClient.put<ApiResponse<Review>>(`/reviews/${id}`, { content });
    return handleResponse(response);
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/reviews/${id}`);
  },

  like: async (id: number): Promise<void> => {
    await apiClient.post(`/reviews/${id}/like`);
  },
};

// Ratings API
export const ratingsApi = {
  rate: async (bookId: number, score: number): Promise<Rating> => {
    const response = await apiClient.post<ApiResponse<Rating>>(`/books/${bookId}/rate`, { score });
    return handleResponse(response);
  },

  delete: async (bookId: number): Promise<void> => {
    await apiClient.delete(`/books/${bookId}/rate`);
  },
};

// Social API
export const socialApi = {
  follow: async (userId: number): Promise<void> => {
    await apiClient.post(`/social/follow/${userId}`);
  },

  unfollow: async (userId: number): Promise<void> => {
    await apiClient.delete(`/social/follow/${userId}`);
  },

  getFollowers: async (): Promise<User[]> => {
    const response = await apiClient.get<ApiResponse<User[]>>('/social/followers');
    return handleResponse(response);
  },

  getFollowing: async (): Promise<User[]> => {
    const response = await apiClient.get<ApiResponse<User[]>>('/social/following');
    return handleResponse(response);
  },

  getFeed: async (): Promise<any[]> => {
    const response = await apiClient.get<ApiResponse<any[]>>('/social/feed');
    return handleResponse(response);
  },
};

// Clubs API
export const clubsApi = {
  getAll: async (): Promise<ReadingClub[]> => {
    const response = await apiClient.get<ApiResponse<ReadingClub[]>>('/clubs');
    return handleResponse(response);
  },

  getBySlug: async (slug: string): Promise<ReadingClub> => {
    const response = await apiClient.get<ApiResponse<ReadingClub>>(`/clubs/${slug}`);
    return handleResponse(response);
  },

  create: async (data: Partial<ReadingClub>): Promise<ReadingClub> => {
    const response = await apiClient.post<ApiResponse<ReadingClub>>('/clubs', data);
    return handleResponse(response);
  },

  update: async (id: number, data: Partial<ReadingClub>): Promise<ReadingClub> => {
    const response = await apiClient.put<ApiResponse<ReadingClub>>(`/clubs/${id}`, data);
    return handleResponse(response);
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/clubs/${id}`);
  },

  join: async (id: number): Promise<void> => {
    await apiClient.post(`/clubs/${id}/join`);
  },

  leave: async (id: number): Promise<void> => {
    await apiClient.delete(`/clubs/${id}/leave`);
  },

  getMembers: async (id: number): Promise<any[]> => {
    const response = await apiClient.get<ApiResponse<any[]>>(`/clubs/${id}/members`);
    return handleResponse(response);
  },

  addBook: async (id: number, bookId: number): Promise<void> => {
    await apiClient.post(`/clubs/${id}/books`, { book_id: bookId });
  },

  removeBook: async (id: number, bookId: number): Promise<void> => {
    await apiClient.delete(`/clubs/${id}/books/${bookId}`);
  },
};

// Challenges API
export const challengesApi = {
  getAll: async (): Promise<ReadingChallenge[]> => {
    const response = await apiClient.get<ApiResponse<ReadingChallenge[]>>('/challenges');
    return handleResponse(response);
  },

  getActive: async (): Promise<ReadingChallenge[]> => {
    const response = await apiClient.get<ApiResponse<ReadingChallenge[]>>('/challenges/active');
    return handleResponse(response);
  },

  getMyChallenges: async (): Promise<ReadingChallenge[]> => {
    const response = await apiClient.get<ApiResponse<ReadingChallenge[]>>('/challenges/my');
    return handleResponse(response);
  },

  getById: async (id: number): Promise<ReadingChallenge> => {
    const response = await apiClient.get<ApiResponse<ReadingChallenge>>(`/challenges/${id}`);
    return handleResponse(response);
  },

  join: async (id: number): Promise<void> => {
    await apiClient.post(`/challenges/${id}/join`);
  },

  leave: async (id: number): Promise<void> => {
    await apiClient.delete(`/challenges/${id}/leave`);
  },

  getLeaderboard: async (id: number): Promise<any[]> => {
    const response = await apiClient.get<ApiResponse<any[]>>(`/challenges/${id}/leaderboard`);
    return handleResponse(response);
  },
};

// Contests API
export const contestsApi = {
  getAll: async (): Promise<Contest[]> => {
    const response = await apiClient.get<ApiResponse<Contest[]>>('/contests');
    return handleResponse(response);
  },

  getBySlug: async (slug: string): Promise<Contest> => {
    const response = await apiClient.get<ApiResponse<Contest>>(`/contests/${slug}`);
    return handleResponse(response);
  },

  getSubmissions: async (slug: string): Promise<ContestSubmission[]> => {
    const response = await apiClient.get<ApiResponse<ContestSubmission[]>>(`/contests/${slug}/submissions`);
    return handleResponse(response);
  },

  submit: async (slug: string, data: Partial<ContestSubmission>): Promise<ContestSubmission> => {
    const response = await apiClient.post<ApiResponse<ContestSubmission>>(`/contests/${slug}/submit`, data);
    return handleResponse(response);
  },

  getMySubmissions: async (): Promise<ContestSubmission[]> => {
    const response = await apiClient.get<ApiResponse<ContestSubmission[]>>('/contests/my');
    return handleResponse(response);
  },

  vote: async (submissionId: number): Promise<void> => {
    await apiClient.post(`/contests/submissions/${submissionId}/vote`);
  },
};

// Leaderboard API
export const leaderboardApi = {
  getReaders: async (): Promise<any[]> => {
    const response = await apiClient.get<ApiResponse<any[]>>('/leaderboard/readers');
    return handleResponse(response);
  },

  getAuthors: async (): Promise<any[]> => {
    const response = await apiClient.get<ApiResponse<any[]>>('/leaderboard/authors');
    return handleResponse(response);
  },

  getBooks: async (): Promise<any[]> => {
    const response = await apiClient.get<ApiResponse<any[]>>('/leaderboard/books');
    return handleResponse(response);
  },
};

// Notifications API
export const notificationsApi = {
  getAll: async (): Promise<Notification[]> => {
    const response = await apiClient.get<ApiResponse<Notification[]>>('/notifications');
    return handleResponse(response);
  },

  getUnreadCount: async (): Promise<{ count: number }> => {
    const response = await apiClient.get<ApiResponse<{ count: number }>>('/notifications/unread-count');
    return handleResponse(response);
  },

  markAsRead: async (id: string): Promise<void> => {
    await apiClient.put(`/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await apiClient.put('/notifications/read-all');
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/notifications/${id}`);
  },
};

// Badges API
export const badgesApi = {
  getAll: async (): Promise<Badge[]> => {
    const response = await apiClient.get<ApiResponse<Badge[]>>('/badges');
    return handleResponse(response);
  },
};

// Recommendations API
export const recommendationsApi = {
  getAll: async (): Promise<Book[]> => {
    const response = await apiClient.get<ApiResponse<Book[]>>('/recommendations');
    return handleResponse(response);
  },

  getDiscover: async (): Promise<Book[]> => {
    const response = await apiClient.get<ApiResponse<Book[]>>('/recommendations/discover');
    return handleResponse(response);
  },

  updatePreferences: async (preferences: Record<string, number>): Promise<void> => {
    await apiClient.post('/recommendations/preferences', preferences);
  },
};

// Downloads API
export const downloadsApi = {
  download: async (slug: string, format: 'pdf' | 'epub' | 'audio'): Promise<{ download_url: string }> => {
    const response = await apiClient.post<ApiResponse<{ download_url: string }>>(`/books/${slug}/download`, { format });
    return handleResponse(response);
  },

  getMyDownloads: async (): Promise<Book[]> => {
    const response = await apiClient.get<ApiResponse<Book[]>>('/downloads/my');
    return handleResponse(response);
  },
};

// Reports API
export const reportsApi = {
  create: async (data: { reportable_type: string; reportable_id: number; reason: string; description?: string }): Promise<void> => {
    await apiClient.post('/reports', data);
  },
};

export default apiClient;
