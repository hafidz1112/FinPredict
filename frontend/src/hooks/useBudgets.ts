import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

export const useBudgets = () => {
  const queryClient = useQueryClient();

  const useBudgetsQuery = (month_year?: string) => useQuery({
    queryKey: ['budgets', month_year],
    queryFn: async () => {
      const { data } = await api.get('/budgets', { params: { month_year } });
      return data.data;
    },
  });

  const useBudgetStatusQuery = (month_year?: string) => useQuery({
    queryKey: ['budgetsStatus', month_year],
    queryFn: async () => {
      const { data } = await api.get('/budgets/status', { params: { month_year } });
      return data.data;
    },
  });

  const useUpsertBudgetMutation = () => useMutation({
    mutationFn: async (budgetData: { category_id: number; monthly_limit: number; month_year: string }) => {
      const { data } = await api.post('/budgets', budgetData);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['budgetsStatus'] });
      queryClient.invalidateQueries({ queryKey: ['warningStatus'] });
    },
  });

  return {
    useBudgetsQuery,
    useBudgetStatusQuery,
    useUpsertBudgetMutation,
  };
};
