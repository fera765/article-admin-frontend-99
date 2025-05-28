import api from '@/config/axios';
import { API_CONFIG } from '@/config/api';

class ApiClient {
  public baseURL: string;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  async login(email: string, password: string) {
    const response = await api.post(API_CONFIG.ENDPOINTS.LOGIN, { email, password });
    return response.data;
  }

  async register(name: string, email: string, password: string) {
    const response = await api.post(API_CONFIG.ENDPOINTS.REGISTER, { name, email, password });
    return response.data;
  }

  async getCurrentUser() {
    const response = await api.get(API_CONFIG.ENDPOINTS.CURRENT_USER);
    return response.data;
  }

  async getArticles(page: number = 1, limit: number = 20) {
    const response = await api.get(`${API_CONFIG.ENDPOINTS.ARTICLES}?page=${page}&limit=${limit}`);
    return response.data;
  }

  async getActiveCategories() {
    const response = await api.get(API_CONFIG.ENDPOINTS.CATEGORIES);
    return response.data;
  }

  async subscribeNewsletter(email: string, name: string) {
    const response = await api.post(API_CONFIG.ENDPOINTS.NEWSLETTER, { email, name });
    return response.data;
  }

  // Métodos para o dashboard admin usando Axios
  async verifyAdmin() {
    const response = await api.get('/private/me');
    return response.data;
  }

  async getViewStats() {
    const response = await api.get('/views');
    return response.data;
  }

  async getNewsletterStats() {
    const response = await api.get('/newsletter-subscriptions/stats');
    return response.data;
  }

  async refreshStats() {
    const response = await api.post('/views/refresh');
    return response.data;
  }

  // Métodos específicos para categorias
  async getCategories() {
    const response = await api.get('/categories');
    return response.data;
  }

  async createCategory(categoryData: { name: string; description: string; active: boolean }) {
    const response = await api.post('/categories', categoryData);
    return response.data;
  }

  async updateCategory(id: string, categoryData: { name: string; description: string; active: boolean }) {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  }

  async deleteCategory(id: string) {
    await api.delete(`/categories/${id}`);
  }

  // Métodos específicos para artigos
  async createArticle(articleData: any) {
    const response = await api.post('/articles', articleData);
    return response.data;
  }

  async updateArticle(id: string, articleData: any) {
    const response = await api.put(`/articles/${id}`, articleData);
    return response.data;
  }

  async deleteArticle(id: string) {
    await api.delete(`/articles/${id}`);
  }

  async getArticleById(id: string) {
    const response = await api.get(`/articles/${id}`);
    return response.data;
  }
}

export const apiClient = new ApiClient();
