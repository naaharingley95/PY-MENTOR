import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // Give Render's free tier enough time to wake up from cold start (~50s)
  timeout: 60000,
});

// Interceptor to inject JWT token into requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor — only auto-logout on a real 401 from the server.
// Network errors / timeouts (no error.response) are NOT treated as auth failures.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isRealUnauthorized =
      error.response && error.response.status === 401;

    if (isRealUnauthorized) {
      // Auto-logout if unauthorized (expired / invalid token)
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Dispatch custom event to let contexts know user has been logged out
      window.dispatchEvent(new Event('auth-expired'));
    }
    return Promise.reject(error);
  }
);

export default api;
