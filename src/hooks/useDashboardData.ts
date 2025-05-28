
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/utils/api';

// Mock data para demonstração
const mockStats = {
  totalArticles: 45,
  totalUsers: 120,
  totalCategories: 8,
  newsletterStats: {
    total: 350,
    active: 310,
    recent: 25
  }
};

const mockTopArticles = {
  mostViewed: [
    {
      id: '1',
      title: 'Como criar uma API REST com Node.js',
      views: 1250,
      likes: 89,
      bookmarks: 45
    },
    {
      id: '2', 
      title: 'Introdução ao React Hooks',
      views: 980,
      likes: 72,
      bookmarks: 38
    },
    {
      id: '3',
      title: 'Guia completo de TypeScript',
      views: 850,
      likes: 65,
      bookmarks: 42
    }
  ],
  mostLiked: [
    {
      id: '1',
      title: 'Como criar uma API REST com Node.js',
      views: 1250,
      likes: 89,
      bookmarks: 45
    },
    {
      id: '4',
      title: 'Deploy com Docker',
      views: 650,
      likes: 78,
      bookmarks: 25
    },
    {
      id: '2',
      title: 'Introdução ao React Hooks', 
      views: 980,
      likes: 72,
      bookmarks: 38
    }
  ],
  mostBookmarked: [
    {
      id: '1',
      title: 'Como criar uma API REST com Node.js',
      views: 1250,
      likes: 89,
      bookmarks: 45
    },
    {
      id: '3',
      title: 'Guia completo de TypeScript',
      views: 850,
      likes: 65,
      bookmarks: 42
    },
    {
      id: '2',
      title: 'Introdução ao React Hooks',
      views: 980,
      likes: 72,
      bookmarks: 38
    }
  ]
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      try {
        // Tentar buscar dados reais da API
        const response = await apiClient.get('/admin/stats');
        return response.data || mockStats;
      } catch (error) {
        console.log('Usando dados mock para estatísticas:', error);
        return mockStats;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useViewStats = () => {
  return useQuery({
    queryKey: ['view-stats'],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/admin/view-stats');
        return response.data || [];
      } catch (error) {
        console.log('Usando dados mock para visualizações:', error);
        return [
          { date: '2024-01-01', views: 120 },
          { date: '2024-01-02', views: 150 },
          { date: '2024-01-03', views: 180 }
        ];
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useTopArticles = () => {
  return useQuery({
    queryKey: ['top-articles'],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/admin/top-articles');
        return response.data || mockTopArticles;
      } catch (error) {
        console.log('Usando dados mock para top articles:', error);
        return mockTopArticles;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useRefreshStats = () => {
  return async () => {
    try {
      await apiClient.post('/admin/refresh-stats');
      console.log('Estatísticas atualizadas com sucesso');
    } catch (error) {
      console.log('Erro ao atualizar estatísticas:', error);
    }
  };
};
