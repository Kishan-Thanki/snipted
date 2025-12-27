import { create } from 'zustand';

interface User {
    id: number;
    email: string;
    username: string;
    reputation_stars: number;
    is_active: boolean;
    created_at: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setAuth: (user: User | null) => void;
    logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true, 

    setAuth: (user) =>
        set({
            user,
            isAuthenticated: !!user,
            isLoading: false
        }),

    logout: () =>
        set({
            user: null,
            isAuthenticated: false,
            isLoading: false
        }),
}));