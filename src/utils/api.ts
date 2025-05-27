
const API_BASE_URL = 'http://localhost:3001/api';

class ApiClient {
  private getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || `HTTP error! status: ${response.status}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request<{ token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(name: string, email: string, password: string) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  async registerEditor(name: string, email: string, password: string, role: string = 'editor') {
    return this.request('/auth/register/editor', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    });
  }

  async getCurrentUser() {
    return this.request<{ message: string; user: { id: string; email: string; role: string } }>('/private/me');
  }

  // Articles
  async getArticles(page: number = 1, limit: number = 10) {
    return this.request<any[]>(`/articles?page=${page}&limit=${limit}`);
  }

  async getArticle(id: string) {
    return this.request<any>(`/articles/${id}`);
  }

  async createArticle(data: any) {
    return this.request('/articles', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateArticle(id: string, data: any) {
    return this.request(`/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteArticle(id: string) {
    return this.request(`/articles/${id}`, {
      method: 'DELETE',
    });
  }

  // Categories
  async getCategories() {
    return this.request<any[]>('/categories');
  }

  async getActiveCategories() {
    return this.request<any[]>('/categories/active');
  }

  async createCategory(data: any) {
    return this.request('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCategory(id: string, data: any) {
    return this.request(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCategory(id: string) {
    return this.request(`/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // Comments
  async getArticleComments(articleId: string) {
    return this.request<any[]>(`/comments/article/${articleId}`);
  }

  async createComment(data: any) {
    return this.request('/comments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteComment(id: string) {
    return this.request(`/comments/${id}`, {
      method: 'DELETE',
    });
  }

  async likeComment(id: string) {
    return this.request(`/comments/${id}/like`, {
      method: 'POST',
    });
  }

  async unlikeComment(id: string) {
    return this.request(`/comments/${id}/unlike`, {
      method: 'POST',
    });
  }

  // Article Likes
  async likeArticle(articleId: string) {
    return this.request(`/likes/article/${articleId}/like`, {
      method: 'POST',
    });
  }

  async unlikeArticle(articleId: string) {
    return this.request(`/likes/article/${articleId}/unlike`, {
      method: 'DELETE',
    });
  }

  async checkArticleLike(articleId: string) {
    return this.request<{ liked: boolean }>(`/likes/article/${articleId}/check`);
  }

  async getArticleLikesCount(articleId: string) {
    return this.request<{ count: number }>(`/likes/article/${articleId}/count`);
  }

  // Bookmarks
  async bookmarkArticle(articleId: string) {
    return this.request(`/bookmarks/article/${articleId}/bookmark`, {
      method: 'POST',
    });
  }

  async unbookmarkArticle(articleId: string) {
    return this.request(`/bookmarks/article/${articleId}/unbookmark`, {
      method: 'DELETE',
    });
  }

  async checkArticleBookmark(articleId: string) {
    return this.request<{ bookmarked: boolean }>(`/bookmarks/article/${articleId}/check`);
  }

  // Views
  async incrementArticleView(articleId: string) {
    return this.request(`/views/article/${articleId}/increment`, {
      method: 'POST',
    });
  }

  async getArticleStats(articleId: string) {
    return this.request<any>(`/views/article/${articleId}`);
  }

  // Newsletter
  async subscribeNewsletter(email: string, name: string) {
    return this.request('/newsletter-subscriptions/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email, name }),
    });
  }

  async getNewsletterSubscriptions() {
    return this.request<any[]>('/newsletter-subscriptions');
  }

  async getNewsletterStats() {
    return this.request<any>('/newsletter-subscriptions/stats');
  }

  async updateSubscription(id: string, data: any) {
    return this.request(`/newsletter-subscriptions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteSubscription(id: string) {
    return this.request(`/newsletter-subscriptions/${id}`, {
      method: 'DELETE',
    });
  }

  // Settings
  async getSettings() {
    return this.request<any>('/settings');
  }

  async updateSettings(data: any) {
    return this.request('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Page Contents
  async getPageContents() {
    return this.request<any[]>('/page-contents');
  }

  async getPageBySlug(slug: string) {
    return this.request<any>(`/page-contents/slug/${slug}`);
  }

  async createPage(data: any) {
    return this.request('/page-contents', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePage(id: string, data: any) {
    return this.request(`/page-contents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePage(id: string) {
    return this.request(`/page-contents/${id}`, {
      method: 'DELETE',
    });
  }

  // Upload
  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return response.json();
  }
}

export const apiClient = new ApiClient();
