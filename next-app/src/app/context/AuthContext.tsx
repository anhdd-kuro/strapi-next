"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { StrapiUser } from "../../types/strapi";
import { 
  getCurrentUser, 
  login as authLogin,
  logout as authLogout,
  isAuthenticated as checkAuth
} from "../../utils/auth";

type AuthContextType = {
  user: StrapiUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<StrapiUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check if user is authenticated on initial load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (checkAuth()) {
          const userData = await getCurrentUser();
          setUser(userData);
        }
      } catch (err) {
        console.error("Authentication initialization error:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login handler
  const login = async (identifier: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { user } = await authLogin(identifier, password);
      setUser(user);
      router.push("/"); // Redirect to home after login
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = () => {
    authLogout();
    setUser(null);
    router.push("/login");
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
