import { create } from "zustand";

interface User {
  username: string;
  role: string;
  branch: string;
  displayName: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  hydrate: () => void;
}

const SESSION_KEY = "sbl_session";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: (user, token) => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ user, token }));
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    sessionStorage.removeItem(SESSION_KEY);
    set({ user: null, token: null, isAuthenticated: false });
  },

  hydrate: () => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) {
        const { user, token } = JSON.parse(raw);
        if (user && token) {
          set({ user, token, isAuthenticated: true });
          return;
        }
      }
    } catch {
      sessionStorage.removeItem(SESSION_KEY);
    }
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
