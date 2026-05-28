import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  full_name: string | null;
  avatar_url?: string | null;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('isLoggedIn', 'true'); // Backward compatibility
        set({ user, token });
      },
      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isLoggedIn'); // Backward compatibility
        set({ user: null, token: null });
        window.location.href = '/login';
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
