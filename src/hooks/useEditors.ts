
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/utils/api';

interface Editor {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'editor';
  status: 'active';
  createdAt: string;
  updatedAt: string;
}

export const useEditors = () => {
  return useQuery({
    queryKey: ['editors'],
    queryFn: async (): Promise<Editor[]> => {
      try {
        const response = await apiClient.get('/auth/editors');
        return Array.isArray(response) ? response : [];
      } catch (error) {
        console.error('Error fetching editors:', error);
        return [];
      }
    },
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  });
};
