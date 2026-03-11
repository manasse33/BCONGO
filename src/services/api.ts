import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import type { 
  ApiResponse, 
  PaginatedResponse, 
  Book, 
  User, 
  LoginCredentials, 
  RegisterData,
  Genre,
  Publisher,
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
    const authHeader =
      error.config?.headers?.Authorization ??
      error.config?.headers?.authorization;
    const hasAuthContext = Boolean(authHeader || localStorage.getItem('auth_token'));

    if (error.response?.status === 401 && hasAuthContext) {
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

const handleAuthPayload = <T>(response: AxiosResponse<any>): T => {
  const payload = response.data;
  if (payload && typeof payload === 'object' && 'data' in payload && payload.data !== undefined) {
    return payload.data as T;
  }
  return payload as T;
};

const handleFlexiblePayload = <T>(response: AxiosResponse<any>): T => {
  const payload = response.data;
  if (payload && typeof payload === 'object' && 'data' in payload && payload.data !== undefined) {
    return payload.data as T;
  }
  return payload as T;
};

// Auth API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
    const response = await apiClient.post('/auth/login', credentials);
    const payload = handleAuthPayload<any>(response);
    const user = payload?.user ?? payload?.data?.user;
    const token = payload?.token ?? payload?.data?.token;

    if (!user || !token) {
      throw new Error('Invalid login response format');
    }

    localStorage.setItem('auth_token', token);
    return { user, token };
  },

  register: async (data: RegisterData): Promise<{ user: User; token: string }> => {
    const response = await apiClient.post('/auth/register', data);
    const payload = handleAuthPayload<any>(response);
    const user = payload?.user ?? payload?.data?.user;
    const token = payload?.token ?? payload?.data?.token;

    if (!user || !token) {
      throw new Error('Invalid register response format');
    }

    localStorage.setItem('auth_token', token);
    return { user, token };
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('auth_token');
  },

  me: async (): Promise<User> => {
    const response = await apiClient.get('/auth/me');
    const payload = handleAuthPayload<any>(response);
    return (payload?.user ?? payload) as User;
  },

  refresh: async (): Promise<{ token: string }> => {
    const response = await apiClient.post('/auth/refresh');
    const payload = handleAuthPayload<any>(response);
    const token = payload?.token ?? payload?.data?.token;

    if (!token) {
      throw new Error('Invalid refresh response format');
    }

    localStorage.setItem('auth_token', token);
    return { token };
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

  changePassword: async (currentPassword: string, password: string, passwordConfirmation: string): Promise<void> => {
    await apiClient.post('/auth/password/change', {
      current_password: currentPassword,
      password,
      password_confirmation: passwordConfirmation,
    });
  },

  verifyEmail: async (id: string | number, hash: string, queryParams?: Record<string, string>): Promise<void> => {
    await apiClient.post(`/auth/email/verify/${id}/${hash}`, null, {
      params: queryParams,
    });
  },

  resendVerificationEmail: async (): Promise<void> => {
    await apiClient.post('/auth/email/resend');
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

  withdraw: async (id: number): Promise<void> => {
    await apiClient.post(`/author/books/${id}/withdraw`);
  },

  getOwn: async (id: number): Promise<Book> => {
    const response = await apiClient.get<ApiResponse<Book>>(`/author/books/${id}`);
    return handleResponse(response);
  },

  getAuthorStats: async (): Promise<Record<string, number>> => {
    const response = await apiClient.get<ApiResponse<Record<string, number>>>('/author/stats');
    return handleResponse(response);
  },

  getBookStats: async (id: number): Promise<Record<string, number>> => {
    const response = await apiClient.get<ApiResponse<Record<string, number>>>(`/author/books/${id}/stats`);
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

// Publishers API
export const publishersApi = {
  getAll: async (): Promise<Publisher[]> => {
    const response = await apiClient.get<ApiResponse<Publisher[]>>('/publishers');
    return handleResponse(response);
  },

  getBySlug: async (slug: string): Promise<Publisher> => {
    const response = await apiClient.get<ApiResponse<Publisher>>(`/publishers/${slug}`);
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

  deleteAvatar: async (): Promise<void> => {
    await apiClient.delete('/profile/avatar');
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

  updateMemberRole: async (id: number, userId: number, role: string): Promise<void> => {
    await apiClient.put(`/clubs/${id}/members/${userId}/role`, { role });
  },

  removeMember: async (id: number, userId: number): Promise<void> => {
    await apiClient.delete(`/clubs/${id}/members/${userId}`);
  },

  addBook: async (id: number, bookId: number): Promise<void> => {
    await apiClient.post(`/clubs/${id}/books`, { book_id: bookId });
  },

  removeBook: async (id: number, bookId: number): Promise<void> => {
    await apiClient.delete(`/clubs/${id}/books/${bookId}`);
  },
};

// Club Discussions API
export const discussionsApi = {
  getAll: async (clubId: number): Promise<any[]> => {
    const response = await apiClient.get<ApiResponse<any[]>>(`/clubs/${clubId}/discussions`);
    return handleResponse(response);
  },

  create: async (clubId: number, data: { title: string; content: string; book_id?: number }): Promise<any> => {
    const response = await apiClient.post<ApiResponse<any>>(`/clubs/${clubId}/discussions`, data);
    return handleResponse(response);
  },

  getById: async (clubId: number, discussionId: number): Promise<any> => {
    const response = await apiClient.get<ApiResponse<any>>(`/clubs/${clubId}/discussions/${discussionId}`);
    return handleResponse(response);
  },

  update: async (clubId: number, discussionId: number, data: { title?: string; content?: string }): Promise<any> => {
    const response = await apiClient.put<ApiResponse<any>>(`/clubs/${clubId}/discussions/${discussionId}`, data);
    return handleResponse(response);
  },

  delete: async (clubId: number, discussionId: number): Promise<void> => {
    await apiClient.delete(`/clubs/${clubId}/discussions/${discussionId}`);
  },

  createReply: async (clubId: number, discussionId: number, data: { content: string }): Promise<any> => {
    const response = await apiClient.post<ApiResponse<any>>(`/clubs/${clubId}/discussions/${discussionId}/replies`, data);
    return handleResponse(response);
  },

  updateReply: async (clubId: number, discussionId: number, replyId: number, data: { content: string }): Promise<any> => {
    const response = await apiClient.put<ApiResponse<any>>(`/clubs/${clubId}/discussions/${discussionId}/replies/${replyId}`, data);
    return handleResponse(response);
  },

  deleteReply: async (clubId: number, discussionId: number, replyId: number): Promise<void> => {
    await apiClient.delete(`/clubs/${clubId}/discussions/${discussionId}/replies/${replyId}`);
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

  create: async (data: Partial<ReadingChallenge>): Promise<ReadingChallenge> => {
    const response = await apiClient.post<ApiResponse<ReadingChallenge>>('/admin/challenges', data);
    return handleResponse(response);
  },

  update: async (id: number, data: Partial<ReadingChallenge>): Promise<ReadingChallenge> => {
    const response = await apiClient.put<ApiResponse<ReadingChallenge>>(`/admin/challenges/${id}`, data);
    return handleResponse(response);
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/admin/challenges/${id}`);
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

  getMySubmissionById: async (id: number): Promise<ContestSubmission> => {
    const response = await apiClient.get<ApiResponse<ContestSubmission>>(`/contests/my/${id}`);
    return handleResponse(response);
  },

  updateMySubmission: async (id: number, data: Partial<ContestSubmission>): Promise<ContestSubmission> => {
    const response = await apiClient.put<ApiResponse<ContestSubmission>>(`/contests/my/${id}`, data);
    return handleResponse(response);
  },

  deleteMySubmission: async (id: number): Promise<void> => {
    await apiClient.delete(`/contests/my/${id}`);
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

// Account Settings API
export const settingsApi = {
  get: async (): Promise<Record<string, any>> => {
    const response = await apiClient.get('/settings');
    return handleFlexiblePayload<Record<string, any>>(response);
  },

  updateNotifications: async (data: Record<string, any>): Promise<Record<string, any>> => {
    const response = await apiClient.put('/settings/notifications', data);
    return handleFlexiblePayload<Record<string, any>>(response);
  },

  updateReadingPreferences: async (data: Record<string, any>): Promise<Record<string, any>> => {
    const response = await apiClient.put('/settings/reading-preferences', data);
    return handleFlexiblePayload<Record<string, any>>(response);
  },

  updatePrivacy: async (data: Record<string, any>): Promise<Record<string, any>> => {
    const response = await apiClient.put('/settings/privacy', data);
    return handleFlexiblePayload<Record<string, any>>(response);
  },

  deleteAccount: async (): Promise<void> => {
    await apiClient.delete('/settings/account');
  },
};

// Streaks API
export const streaksApi = {
  getMyStreak: async (): Promise<Record<string, any>> => {
    const response = await apiClient.get('/streaks');
    return handleFlexiblePayload<Record<string, any>>(response);
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

// Admin API
export const adminApi = {
  stats: {
    getOverview: async (): Promise<Record<string, any>> => {
      const response = await apiClient.get('/admin/stats/overview');
      return handleFlexiblePayload<Record<string, any>>(response);
    },
    getReadings: async (): Promise<Record<string, any>> => {
      const response = await apiClient.get('/admin/stats/readings');
      return handleFlexiblePayload<Record<string, any>>(response);
    },
    getUsers: async (): Promise<Record<string, any>> => {
      const response = await apiClient.get('/admin/stats/users');
      return handleFlexiblePayload<Record<string, any>>(response);
    },
    getBooks: async (): Promise<Record<string, any>> => {
      const response = await apiClient.get('/admin/stats/books');
      return handleFlexiblePayload<Record<string, any>>(response);
    },
    getActivityLogs: async (): Promise<any[]> => {
      const response = await apiClient.get('/admin/activity-logs');
      return handleFlexiblePayload<any[]>(response);
    },
    getSearchLogs: async (): Promise<any[]> => {
      const response = await apiClient.get('/admin/search-logs');
      return handleFlexiblePayload<any[]>(response);
    },
  },

  books: {
    getAll: async (): Promise<Book[]> => {
      const response = await apiClient.get('/admin/books');
      return handleFlexiblePayload<Book[]>(response);
    },
    getPending: async (): Promise<Book[]> => {
      const response = await apiClient.get('/admin/books/pending');
      return handleFlexiblePayload<Book[]>(response);
    },
    create: async (data: Partial<Book>): Promise<Book> => {
      const response = await apiClient.post('/admin/books', data);
      return handleFlexiblePayload<Book>(response);
    },
    update: async (id: number, data: Partial<Book>): Promise<Book> => {
      const response = await apiClient.put(`/admin/books/${id}`, data);
      return handleFlexiblePayload<Book>(response);
    },
    delete: async (id: number): Promise<void> => {
      await apiClient.delete(`/admin/books/${id}`);
    },
    approve: async (id: number): Promise<void> => {
      await apiClient.post(`/admin/books/${id}/approve`);
    },
    reject: async (id: number): Promise<void> => {
      await apiClient.post(`/admin/books/${id}/reject`);
    },
    feature: async (id: number): Promise<void> => {
      await apiClient.post(`/admin/books/${id}/feature`);
    },
  },

  users: {
    getAll: async (): Promise<User[]> => {
      const response = await apiClient.get('/admin/users');
      return handleFlexiblePayload<User[]>(response);
    },
    getById: async (id: number): Promise<User> => {
      const response = await apiClient.get(`/admin/users/${id}`);
      return handleFlexiblePayload<User>(response);
    },
    update: async (id: number, data: Partial<User>): Promise<User> => {
      const response = await apiClient.put(`/admin/users/${id}`, data);
      return handleFlexiblePayload<User>(response);
    },
    changeRole: async (id: number, role: string): Promise<void> => {
      await apiClient.put(`/admin/users/${id}/role`, { role });
    },
    ban: async (id: number): Promise<void> => {
      await apiClient.post(`/admin/users/${id}/ban`);
    },
    unban: async (id: number): Promise<void> => {
      await apiClient.post(`/admin/users/${id}/unban`);
    },
    delete: async (id: number): Promise<void> => {
      await apiClient.delete(`/admin/users/${id}`);
    },
  },

  contests: {
    getAll: async (): Promise<Contest[]> => {
      const response = await apiClient.get('/admin/contests');
      return handleFlexiblePayload<Contest[]>(response);
    },
    create: async (data: Partial<Contest>): Promise<Contest> => {
      const response = await apiClient.post('/admin/contests', data);
      return handleFlexiblePayload<Contest>(response);
    },
    update: async (id: number, data: Partial<Contest>): Promise<Contest> => {
      const response = await apiClient.put(`/admin/contests/${id}`, data);
      return handleFlexiblePayload<Contest>(response);
    },
    delete: async (id: number): Promise<void> => {
      await apiClient.delete(`/admin/contests/${id}`);
    },
    open: async (id: number): Promise<void> => {
      await apiClient.post(`/admin/contests/${id}/open`);
    },
    close: async (id: number): Promise<void> => {
      await apiClient.post(`/admin/contests/${id}/close`);
    },
    announceResults: async (id: number): Promise<void> => {
      await apiClient.post(`/admin/contests/${id}/announce-results`);
    },
    getSubmissions: async (id: number): Promise<ContestSubmission[]> => {
      const response = await apiClient.get(`/admin/contests/${id}/submissions`);
      return handleFlexiblePayload<ContestSubmission[]>(response);
    },
    reviewSubmission: async (submissionId: number, data: Record<string, any>): Promise<void> => {
      await apiClient.put(`/admin/contests/submissions/${submissionId}/review`, data);
    },
  },

  reports: {
    getAll: async (): Promise<any[]> => {
      const response = await apiClient.get('/admin/reports');
      return handleFlexiblePayload<any[]>(response);
    },
    getById: async (id: number): Promise<any> => {
      const response = await apiClient.get(`/admin/reports/${id}`);
      return handleFlexiblePayload<any>(response);
    },
    handle: async (id: number, data: Record<string, any>): Promise<void> => {
      await apiClient.put(`/admin/reports/${id}/handle`, data);
    },
    reject: async (id: number, data?: Record<string, any>): Promise<void> => {
      await apiClient.put(`/admin/reports/${id}/reject`, data ?? {});
    },
  },

  genres: {
    create: async (data: Partial<Genre>): Promise<Genre> => {
      const response = await apiClient.post('/admin/genres', data);
      return handleFlexiblePayload<Genre>(response);
    },
    update: async (id: number, data: Partial<Genre>): Promise<Genre> => {
      const response = await apiClient.put(`/admin/genres/${id}`, data);
      return handleFlexiblePayload<Genre>(response);
    },
    delete: async (id: number): Promise<void> => {
      await apiClient.delete(`/admin/genres/${id}`);
    },
  },

  publishers: {
    create: async (data: Partial<Publisher>): Promise<Publisher> => {
      const response = await apiClient.post('/admin/publishers', data);
      return handleFlexiblePayload<Publisher>(response);
    },
    update: async (id: number, data: Partial<Publisher>): Promise<Publisher> => {
      const response = await apiClient.put(`/admin/publishers/${id}`, data);
      return handleFlexiblePayload<Publisher>(response);
    },
    delete: async (id: number): Promise<void> => {
      await apiClient.delete(`/admin/publishers/${id}`);
    },
  },

  settings: {
    get: async (): Promise<Record<string, any>> => {
      const response = await apiClient.get('/admin/settings');
      return handleFlexiblePayload<Record<string, any>>(response);
    },
    update: async (data: Record<string, any>): Promise<Record<string, any>> => {
      const response = await apiClient.put('/admin/settings', data);
      return handleFlexiblePayload<Record<string, any>>(response);
    },
  },
};

export default apiClient;
