"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/api";

// 1. Define the shape of our Auth State
interface AuthContextType {
    user: any;
    setUser: React.Dispatch<React.SetStateAction<any>>;
    loading: boolean;
    checkUser: () => Promise<void>;
}

// 2. Create the context with a default value that matches the interface
const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => { },
    loading: true,
    checkUser: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const checkUser = async () => {
        try {
            const res = await api.get("/auth/me");
            setUser(res.data);
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading, checkUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
