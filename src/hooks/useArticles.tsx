
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/utils/api';
import { Article } from '@/types';
import { useToast } from '@/hooks/use-toast';

export interface CreateArticleData {
  title: string;
  content: string;
  summary: string;
  category: string;
  author: string;
  status: 'published' | 'draft';
  publishDate: string;
  imageUrl: string;
  tags: string[];
  isDetach: boolean;
}

export const useArticles = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: articles = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['articles'],
    queryFn: () => apiClient.getArticles(),
  });

  const createArticleMutation = useMutation({
    mutationFn: async (articleData: CreateArticleData) => {
      console.log('Sending article data:', articleData);
      
      const response = await fetch('http://localhost:3000/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articleData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('API Error:', errorData);
        throw new Error(`Failed to create article: ${response.status}`);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      toast({
        title: "Sucesso!",
        description: "Artigo criado com sucesso.",
      });
    },
    onError: (error: Error) => {
      console.error('Create article error:', error);
      toast({
        title: "Erro",
        description: `Erro ao criar artigo: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const updateArticleMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateArticleData> }) => {
      const response = await fetch(`http://localhost:3000/api/articles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update article');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      toast({
        title: "Sucesso!",
        description: "Artigo atualizado com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: `Erro ao atualizar artigo: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  return {
    articles,
    isLoading,
    error,
    createArticle: createArticleMutation.mutate,
    updateArticle: updateArticleMutation.mutate,
    isCreating: createArticleMutation.isPending,
    isUpdating: updateArticleMutation.isPending,
  };
};
