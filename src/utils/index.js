import { CURRENCY, VALIDATION_RULES, STORAGE_KEYS } from '../constants';

// Format currency
export const formatCurrency = (amount) => {
  if (typeof amount !== 'number') {
    amount = parseFloat(amount) || 0;
  }
  return `${CURRENCY.SYMBOL} ${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

// Format date
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Validate email
export const validateEmail = (email) => {
  return VALIDATION_RULES.EMAIL.test(email);
};

// Validate phone
export const validatePhone = (phone) => {
  return VALIDATION_RULES.PHONE.test(phone);
};

// Validate password
export const validatePassword = (password) => {
  return password && password.length >= VALIDATION_RULES.PASSWORD_MIN_LENGTH;
};

// Validate name
export const validateName = (name) => {
  return name && 
         name.length >= VALIDATION_RULES.NAME_MIN_LENGTH && 
         name.length <= VALIDATION_RULES.NAME_MAX_LENGTH;
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Capitalize first letter
export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Generate random ID
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Local Storage helpers
export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      return false;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  },
  
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
};

// API helpers
export const api = {
  get: async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API GET error:', error);
      throw error;
    }
  },
  
  post: async (url, data) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API POST error:', error);
      throw error;
    }
  },
  
  put: async (url, data) => {
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API PUT error:', error);
      throw error;
    }
  },
  
  delete: async (url) => {
    try {
      const response = await fetch(url, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API DELETE error:', error);
      throw error;
    }
  }
};

// URL helpers
export const buildUrl = (baseUrl, params = {}) => {
  const url = new URL(baseUrl);
  Object.keys(params).forEach(key => {
    if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
      url.searchParams.append(key, params[key]);
    }
  });
  return url.toString();
};

// Array helpers
export const chunk = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

// Object helpers
export const isEmpty = (obj) => {
  return obj === null || obj === undefined || 
         (typeof obj === 'object' && Object.keys(obj).length === 0) ||
         (typeof obj === 'string' && obj.trim().length === 0);
};

// Error handling
export const handleError = (error, defaultMessage = 'An error occurred') => {
  console.error('Error:', error);
  
  if (error.message) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return defaultMessage;
};

// Book helpers
export const getBookConditionColor = (condition) => {
  switch (condition?.toLowerCase()) {
    case 'new':
      return '#10b981'; // green
    case 'used':
      return '#f59e0b'; // yellow
    case 'fair':
      return '#f97316'; // orange
    case 'poor':
      return '#ef4444'; // red
    default:
      return '#6b7280'; // gray
  }
};

export const getBookConditionIcon = (condition) => {
  switch (condition?.toLowerCase()) {
    case 'new':
      return 'fas fa-star';
    case 'used':
      return 'fas fa-star-half-alt';
    case 'fair':
      return 'fas fa-exclamation-triangle';
    case 'poor':
      return 'fas fa-times-circle';
    default:
      return 'fas fa-question-circle';
  }
};

// Rating helpers
export const renderStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  
  for (let i = 0; i < fullStars; i++) {
    stars.push('fas fa-star');
  }
  
  if (hasHalfStar) {
    stars.push('fas fa-star-half-alt');
  }
  
  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars.push('far fa-star');
  }
  
  return stars;
};
