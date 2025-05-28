
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/utils/api';

interface AdminStats {
  totalArticles: number;
  totalUsers: number;
  totalCategories: number;
  newsletterStats: {
    total: number;
    active: number;
    inactive: number;
    unsubscribed: number;
  };
}

interface ViewStats {
  id: string;
  articleId: string;
  count: number;
  likes: number;
  bookmarks: number;
  comments: number;
  lastUpdated: string;
}

interface ArticleWithStats {
  id: string;
  title: string;
  author: string;
  category: string;
  views: number;
  likes: number;
  bookmarks: number;
  createdAt: string;
}

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async (): Promise<AdminStats> => {
      try {
        const [articlesResponse, categoriesResponse] = await Promise.all([
          apiClient.getArticles(1, 1000),
          apiClient.getActiveCategories()
        ]);

        // Tentar buscar estatísticas da newsletter
        let newsletterStats = {
          total: 0,
          active: 0,
          inactive: 0,
          unsubscribed: 0
        };

        try {
          const newsletterResponse = await fetch(`${apiClient.baseURL}/newsletter-subscriptions/stats`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          if (newsletterResponse.ok) {
            newsletterStats = await newsletterResponse.json();
          }
        } catch (error) {
          console.warn('Newsletter stats not available:', error);
        }

        return {
          totalArticles: Array.isArray(articlesResponse) ? articlesResponse.length : 0,
          totalUsers: 156, // Valor padrão até termos a API
          totalCategories: Array.isArray(categoriesResponse) ? categoriesResponse.length : 0,
          newsletterStats
        };
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        return {
          totalArticles: 0,
          totalUsers: 0,
          totalCategories: 0,
          newsletterStats: {
            total: 0,
            active: 0,
            inactive: 0,
            unsubscribed: 0
          }
        };
      }
    },
    refetchInterval: 5 * 60 * 1000, // 5 minutos
  });
};

export const useViewStats = () => {
  return useQuery({
    queryKey: ['view-stats'],
    queryFn: async (): Promise<ViewStats[]> => {
      try {
        const response = await fetch(`${apiClient.baseURL}/views`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch view stats');
        }
        
        const data = await response.json();
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error('Error fetching view stats:', error);
        return [];
      }
    },
    refetchInterval: 5 * 60 * 1000,
  });
};

export const useTopArticles = () => {
  const { data: viewStats, isLoading: viewStatsLoading } = useViewStats();
  
  return useQuery({
    queryKey: ['top-articles', viewStats],
    queryFn: async (): Promise<{
      mostViewed: ArticleWithStats[];
      mostLiked: ArticleWithStats[];
      mostBookmarked: ArticleWithStats[];
    }> => {
      try {
        if (!viewStats || viewStats.length === 0) {
          return { mostViewed: [], mostLiked: [], mostBookmarked: [] };
        }

        // Buscar dados dos artigos
        const articlesResponse = await apiClient.getArticles(1, 1000);
        const articles = Array.isArray(articlesResponse) ? articlesResponse : [];
        
        // Combinar dados de visualização com dados dos artigos
        const articlesWithStats: ArticleWithStats[] = articles.map(article => {
          const stats = viewStats.find(v => v.articleId === article.id);
          return {
            id: article.id,
            title: article.title,
            author: article.author || 'Autor Desconhecido',
            category: article.category || 'Sem Categoria',
            views: stats?.count || 0,
            likes: stats?.likes || 0,
            bookmarks: stats?.bookmarks || 0,
            createdAt: article.createdAt || new Date().toISOString(),
          };
        });

        return {
          mostViewed: articlesWithStats
            .sort((a, b) => b.views - a.views)
            .slice(0, 5),
          mostLiked: articlesWithStats
            .sort((a, b) => b.likes - a.likes)
            .slice(0, 5),
          mostBookmarked: articlesWithStats
            .sort((a, b) => b.bookmarks - a.bookmarks)
            .slice(0, 5),
        };
      } catch (error) {
        console.error('Error processing top articles:', error);
        return { mostViewed: [], mostLiked: [], mostBookmarked: [] };
      }
    },
    enabled: !!viewStats && !viewStatsLoading,
  });
};

export const useRefreshStats = () => {
  return async () => {
    try {
      const response = await fetch(`${apiClient.baseURL}/views/refresh`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to refresh stats');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error refreshing stats:', error);
      throw error;
    }
  };
};
