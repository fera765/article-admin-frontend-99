
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/utils/api';

interface DashboardStats {
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
}

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      const [articles, categories, newsletterStats] = await Promise.all([
        apiClient.getArticles(1, 1000),
        apiClient.getActiveCategories(),
        fetch(`${apiClient.baseURL}/api/newsletter-subscriptions/stats`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }).then(res => res.json()),
      ]);

      return {
        totalArticles: articles.length,
        totalUsers: 0, // Será implementado quando tivermos a rota
        totalCategories: categories.length,
        newsletterStats: newsletterStats,
      };
    },
    refetchInterval: 5 * 60 * 1000, // Auto refresh a cada 5 minutos
  });
};

export const useViewStats = () => {
  return useQuery({
    queryKey: ['view-stats'],
    queryFn: async (): Promise<ViewStats[]> => {
      const response = await fetch(`${apiClient.baseURL}/api/views`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.json();
    },
    refetchInterval: 5 * 60 * 1000,
  });
};

export const useTopArticles = () => {
  const { data: viewStats } = useViewStats();
  
  return useQuery({
    queryKey: ['top-articles', viewStats],
    queryFn: async (): Promise<{
      mostViewed: ArticleWithStats[];
      mostLiked: ArticleWithStats[];
      mostBookmarked: ArticleWithStats[];
    }> => {
      if (!viewStats) return { mostViewed: [], mostLiked: [], mostBookmarked: [] };

      // Buscar dados dos artigos
      const articles = await apiClient.getArticles(1, 1000);
      
      // Combinar dados de visualização com dados dos artigos
      const articlesWithStats: ArticleWithStats[] = articles.map(article => {
        const stats = viewStats.find(v => v.articleId === article.id);
        return {
          id: article.id,
          title: article.title,
          author: article.author,
          category: article.category,
          views: stats?.count || 0,
          likes: stats?.likes || 0,
          bookmarks: stats?.bookmarks || 0,
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
    },
    enabled: !!viewStats,
  });
};
