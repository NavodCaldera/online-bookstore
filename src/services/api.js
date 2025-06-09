import { API_BASE_URL, API_ENDPOINTS } from '../constants';
import { api, buildUrl } from '../utils';

// Books API
export const booksAPI = {
  // Get all books with filtering
  getBooks: async (params = {}) => {
    const url = buildUrl(`${API_BASE_URL}${API_ENDPOINTS.BOOKS}`, params);
    return await api.get(url);
  },

  // Get featured books
  getFeaturedBooks: async () => {
    return await api.get(`${API_BASE_URL}${API_ENDPOINTS.FEATURED_BOOKS}`);
  },

  // Get book by ID
  getBookById: async (id) => {
    return await api.get(`${API_BASE_URL}${API_ENDPOINTS.BOOKS}/${id}`);
  },

  // Create new book
  createBook: async (bookData) => {
    return await api.post(`${API_BASE_URL}${API_ENDPOINTS.BOOKS}`, bookData);
  },

  // Update book
  updateBook: async (id, bookData) => {
    return await api.put(`${API_BASE_URL}${API_ENDPOINTS.BOOKS}/${id}`, bookData);
  },

  // Delete book
  deleteBook: async (id) => {
    return await api.delete(`${API_BASE_URL}${API_ENDPOINTS.BOOKS}/${id}`);
  }
};

// Categories API
export const categoriesAPI = {
  // Get all categories
  getCategories: async () => {
    return await api.get(`${API_BASE_URL}${API_ENDPOINTS.CATEGORIES}`);
  },

  // Get category by ID
  getCategoryById: async (id) => {
    return await api.get(`${API_BASE_URL}${API_ENDPOINTS.CATEGORIES}/${id}`);
  }
};

// Users API
export const usersAPI = {
  // Register new user
  register: async (userData) => {
    return await api.post(`${API_BASE_URL}${API_ENDPOINTS.USERS}/register`, userData);
  },

  // Login user
  login: async (credentials) => {
    return await api.post(`${API_BASE_URL}${API_ENDPOINTS.USERS}/login`, credentials);
  },

  // Get user profile
  getProfile: async () => {
    return await api.get(`${API_BASE_URL}${API_ENDPOINTS.USERS}/profile`);
  },

  // Update user profile
  updateProfile: async (userData) => {
    return await api.put(`${API_BASE_URL}${API_ENDPOINTS.USERS}/profile`, userData);
  }
};

// Cart API
export const cartAPI = {
  // Get cart items
  getCartItems: async () => {
    return await api.get(`${API_BASE_URL}${API_ENDPOINTS.CART}`);
  },

  // Add item to cart
  addToCart: async (bookId, quantity = 1) => {
    return await api.post(`${API_BASE_URL}${API_ENDPOINTS.CART}`, { bookId, quantity });
  },

  // Update cart item
  updateCartItem: async (itemId, quantity) => {
    return await api.put(`${API_BASE_URL}${API_ENDPOINTS.CART}/${itemId}`, { quantity });
  },

  // Remove item from cart
  removeFromCart: async (itemId) => {
    return await api.delete(`${API_BASE_URL}${API_ENDPOINTS.CART}/${itemId}`);
  }
};

// Newsletter API
export const newsletterAPI = {
  // Subscribe to newsletter
  subscribe: async (email) => {
    return await api.post(`${API_BASE_URL}${API_ENDPOINTS.NEWSLETTER}/subscribe`, { email });
  },

  // Unsubscribe from newsletter
  unsubscribe: async (email) => {
    return await api.post(`${API_BASE_URL}${API_ENDPOINTS.NEWSLETTER}/unsubscribe`, { email });
  }
};

// Health API
export const healthAPI = {
  // Check API health
  checkHealth: async () => {
    return await api.get(`${API_BASE_URL}${API_ENDPOINTS.HEALTH}`);
  }
};

// Export all APIs
export default {
  books: booksAPI,
  categories: categoriesAPI,
  users: usersAPI,
  cart: cartAPI,
  newsletter: newsletterAPI,
  health: healthAPI
};
