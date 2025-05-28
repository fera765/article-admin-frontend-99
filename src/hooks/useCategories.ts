
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/utils/api';
import { Category } from '@/types';

interface UseCategoriesParams {
  search?: string;
}

export const useCategories = (params: UseCategoriesParams = {}) => {
  const { search } = params;
  
  return useQuery({
    queryKey: ['categories', search],
    queryFn: async (): Promise<{ categories: Category[]; total: number }> => {
      try {
        const response = await fetch(`${apiClient.baseURL}/categories`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        
        let categories: Category[] = await response.json();
        
        // Aplicar filtro de busca
        if (search) {
          categories = categories.filter(category =>
            category.name.toLowerCase().includes(search.toLowerCase()) ||
            category.description.toLowerCase().includes(search.toLowerCase())
          );
        }
        
        return {
          categories,
          total: categories.length
        };
      } catch (error) {
        console.error('Error fetching categories:', error);
        return { categories: [], total: 0 };
      }
    },
    refetchInterval: 5 * 60 * 1000,
  });
};

export const useCategory = (id: string) => {
  return useQuery({
    queryKey: ['category', id],
    queryFn: async (): Promise<Category | null> => {
      try {
        const response = await fetch(`${apiClient.baseURL}/categories/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch category');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error fetching category:', error);
        return null;
      }
    },
    enabled: !!id,
  });
};
