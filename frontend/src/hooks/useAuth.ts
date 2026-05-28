import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);

  const getMe = async () => {
    const { data } = await api.get('/auth/me');
    return data.data;
  };

  const updateProfile = async (profileData: { full_name?: string; avatar_url?: string }) => {
    const { data } = await api.put('/auth/profile', profileData);
    return data.data;
  };

  const useMeQuery = () => useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    retry: false,
  });

  const useUpdateProfileMutation = () => useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['me'], updatedUser);
      // Also update the store if needed, though usually relying on React Query is better
      const token = useAuthStore.getState().token;
      if (token) setAuth(updatedUser, token);
    },
  });

  return { useMeQuery, useUpdateProfileMutation };
};
