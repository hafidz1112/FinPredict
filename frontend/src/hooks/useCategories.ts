import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

export const useCategories = () => {
  const useCategoriesQuery = () => useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get('/categories');
      return data.data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  return { useCategoriesQuery };
};
