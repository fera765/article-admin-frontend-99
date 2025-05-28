
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/config/axios';
import { Category } from '@/types';
import { toast } from '@/hooks/use-toast';

interface UseCategoriesParams {
  search?: string;
}

export const useCategories = (params: UseCategoriesParams = {}) => {
  const { search } = params;
  
  return useQuery({
    queryKey: ['categories', search],
    queryFn: async (): Promise<{ categories: Category[]; total: number }> => {
      try {
        const response = await api.get('/categories');
        let categories: Category[] = response.data;
        
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
        const response = await api.get(`/categories/${id}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching category:', error);
        return null;
      }
    },
    enabled: !!id,
  });
};

// Hook para criar categoria
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (categoryData: { name: string; description: string; active: boolean }) => {
      const response = await api.post('/categories', categoryData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: '✅ Categoria cadastrada com sucesso!',
        description: 'A nova categoria foi adicionada.',
      });
    },
    onError: (error: any) => {
      console.error('Error creating category:', error);
      toast({
        title: '❌ Erro ao cadastrar categoria',
        description: 'Preencha todos os campos obrigatórios!',
        variant: 'destructive',
      });
    },
  });
};

// Hook para atualizar categoria
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, categoryData }: { id: string; categoryData: { name: string; description: string; active: boolean } }) => {
      const response = await api.put(`/categories/${id}`, categoryData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: '✅ Categoria atualizada com sucesso!',
        description: 'As alterações foram salvas.',
      });
    },
    onError: (error: any) => {
      console.error('Error updating category:', error);
      toast({
        title: '❌ Erro ao atualizar categoria',
        description: 'Preencha todos os campos obrigatórios!',
        variant: 'destructive',
      });
    },
  });
};

// Hook para deletar categoria
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: '🗑️ Categoria excluída com sucesso!',
        description: 'A categoria foi removida permanentemente.',
      });
    },
    onError: (error: any) => {
      console.error('Error deleting category:', error);
      toast({
        title: '❌ Erro ao excluir categoria',
        description: 'Tente novamente.',
        variant: 'destructive',
      });
    },
  });
};
