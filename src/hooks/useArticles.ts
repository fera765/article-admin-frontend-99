
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/utils/api';
import { Article } from '@/types';

interface UseArticlesParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  author?: string;
}

export const useArticles = (params: UseArticlesParams = {}) => {
  const { page = 1, limit = 20, search, category, author } = params;
  
  return useQuery({
    queryKey: ['articles', page, limit, search, category, author],
    queryFn: async (): Promise<{ articles: Article[]; total: number }> => {
      try {
        const response = await apiClient.getArticles(page, limit);
        let articles = Array.isArray(response) ? response : [];
        
        // Aplicar filtros no frontend (já que a API não suporta filtros nativos)
        if (search) {
          articles = articles.filter(article =>
            article.title.toLowerCase().includes(search.toLowerCase()) ||
            article.summary.toLowerCase().includes(search.toLowerCase())
          );
        }
        
        if (category && category !== 'all') {
          articles = articles.filter(article => article.category === category);
        }
        
        if (author && author !== 'all') {
          articles = articles.filter(article => article.author === author);
        }
        
        return {
          articles,
          total: articles.length
        };
      } catch (error) {
        console.error('Error fetching articles:', error);
        return { articles: [], total: 0 };
      }
    },
    refetchInterval: 5 * 60 * 1000, // 5 minutos
  });
};

export const useArticle = (id: string) => {
  return useQuery({
    queryKey: ['article', id],
    queryFn: async (): Promise<Article | null> => {
      try {
        const response = await fetch(`${apiClient.baseURL}/articles/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch article');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error fetching article:', error);
        return null;
      }
    },
    enabled: !!id,
  });
};
