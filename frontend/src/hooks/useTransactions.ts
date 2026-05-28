import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

export const useTransactions = () => {
  const queryClient = useQueryClient();

  const useTransactionsQuery = (filters?: { category_id?: string; type?: string; from?: string; to?: string }) => useQuery({
    queryKey: ['transactions', filters],
    queryFn: async () => {
      const { data } = await api.get('/transactions', { params: filters });
      return data.data;
    },
  });

  const useTransactionSummaryQuery = (month?: number, year?: number) => useQuery({
    queryKey: ['transactionSummary', month, year],
    queryFn: async () => {
      const { data } = await api.get('/transactions/summary', { params: { month, year } });
      return data.data;
    },
  });

  const useCreateTransactionMutation = () => useMutation({
    mutationFn: async (newTx: any) => {
      const { data } = await api.post('/transactions', newTx);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactionSummary'] });
      queryClient.invalidateQueries({ queryKey: ['budgetsStatus'] });
      queryClient.invalidateQueries({ queryKey: ['warningStatus'] });
    },
  });

  const useDeleteTransactionMutation = () => useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/transactions/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactionSummary'] });
      queryClient.invalidateQueries({ queryKey: ['budgetsStatus'] });
      queryClient.invalidateQueries({ queryKey: ['warningStatus'] });
    },
  });

  const useImportCsvMutation = () => useMutation({
    mutationFn: async (csvData: string) => {
      const { data } = await api.post('/transactions/import', { csvData });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactionSummary'] });
      queryClient.invalidateQueries({ queryKey: ['budgetsStatus'] });
      queryClient.invalidateQueries({ queryKey: ['warningStatus'] });
    },
  });

  return {
    useTransactionsQuery,
    useTransactionSummaryQuery,
    useCreateTransactionMutation,
    useDeleteTransactionMutation,
    useImportCsvMutation,
  };
};
