
import { API_CONFIG } from '@/config/api';

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  async login(email: string, password: string) {
    return this.request(API_CONFIG.ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(name: string, email: string, password: string) {
    return this.request(API_CONFIG.ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  async getCurrentUser() {
    return this.request(API_CONFIG.ENDPOINTS.CURRENT_USER);
  }

  async getArticles(page: number = 1, limit: number = 20) {
    return this.request(`${API_CONFIG.ENDPOINTS.ARTICLES}?page=${page}&limit=${limit}`);
  }

  async getActiveCategories() {
    return this.request(API_CONFIG.ENDPOINTS.CATEGORIES);
  }
}

export const apiClient = new ApiClient();
