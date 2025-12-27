'use client';

import { useEffect, ReactNode } from 'react';
import { api } from '@/lib/api/client';
import { useAuth } from '@/lib/store/auth.store';

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const { setAuth } = useAuth();

    useEffect(() => {
        const initAuth = async () => {
            try {
                const response = await api.get('/users/me');

                setAuth(response.data);
            } catch (error) {
                setAuth(null);
            }
        };

        initAuth();
    }, [setAuth]);

    return <>{children}</>;
}