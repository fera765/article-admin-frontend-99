
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/utils/api';
import { NewsletterSubscription } from '@/types';

interface UseNewsletterParams {
  search?: string;
}

export const useNewsletterSubscriptions = (params: UseNewsletterParams = {}) => {
  const { search } = params;
  
  return useQuery({
    queryKey: ['newsletter-subscriptions', search],
    queryFn: async (): Promise<{ subscriptions: NewsletterSubscription[]; total: number }> => {
      try {
        const response = await fetch(`${apiClient.baseURL}/newsletter-subscriptions`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch newsletter subscriptions');
        }
        
        let subscriptions: NewsletterSubscription[] = await response.json();
        
        // Aplicar filtro de busca
        if (search) {
          subscriptions = subscriptions.filter(subscription =>
            subscription.name.toLowerCase().includes(search.toLowerCase()) ||
            subscription.email.toLowerCase().includes(search.toLowerCase())
          );
        }
        
        return {
          subscriptions,
          total: subscriptions.length
        };
      } catch (error) {
        console.error('Error fetching newsletter subscriptions:', error);
        return { subscriptions: [], total: 0 };
      }
    },
    refetchInterval: 5 * 60 * 1000,
  });
};

export const useNewsletterSubscription = (id: string) => {
  return useQuery({
    queryKey: ['newsletter-subscription', id],
    queryFn: async (): Promise<NewsletterSubscription | null> => {
      try {
        const response = await fetch(`${apiClient.baseURL}/newsletter-subscriptions/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch newsletter subscription');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error fetching newsletter subscription:', error);
        return null;
      }
    },
    enabled: !!id,
  });
};
