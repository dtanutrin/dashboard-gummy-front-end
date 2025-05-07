"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import * as api from "../../lib/api";

// Tipos melhorados
type UserRole = "Admin" | "User" | "Editor" | string; // Pode ser estendido conforme necessário

type User = {
  id: number;
  email: string;
  role: UserRole;
  name?: string;
  permissions?: string[];
  // Adicione outros campos conforme retornado pelo backend
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadUserFromToken = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // Implementação real buscando dados do usuário do backend
      const userData = await api.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error("Failed to load user:", error);
      await api.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    await loadUserFromToken();
  }, [loadUserFromToken]);

  useEffect(() => {
    loadUserFromToken();
    
    // Adiciona listener para eventos de logout em outras abas
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "authToken" && e.newValue === null) {
        setUser(null);
        router.push("/auth/login");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [loadUserFromToken, router]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { user: userData } = await api.login(email, password);
      
      if (!userData) {
        throw new Error("No user data returned from login");
      }
      
      setUser(userData);
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setUser(null);
      await api.logout();
      
      // Transforma erros de API em mensagens amigáveis
      let errorMessage = "Login failed. Please try again.";
      if (typeof error === "object" && error !== null && "message" in error) {
        errorMessage = error.message as string;
      }
      
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
      setUser(null);
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const useUser = () => {
  const { user, loading } = useAuth();
  return { user, loading };
};

export const useHasAccess = (requiredPermission: string | string[]) => {
  const { user, loading } = useAuth();

  if (loading) return false;
  if (!user) return false;

  // Admin tem acesso total
  if (user.role === "Admin") return true;

  // Verifica se requiredPermission é array ou string
  const permissionsToCheck = Array.isArray(requiredPermission) 
    ? requiredPermission 
    : [requiredPermission];

  // Verifica se o usuário tem pelo menos uma das permissões requeridas
  return permissionsToCheck.some(permission => 
    user.permissions?.includes(permission)
  );
};

export const ProtectedRoute = ({
  children,
  requiredRole,
  requiredPermission,
  redirectTo = "/auth/login",
}: {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requiredPermission?: string | string[];
  redirectTo?: string;
}) => {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(redirectTo);
    }

    if (!loading && isAuthenticated && user) {
      // Verifica role
      if (requiredRole && user.role !== requiredRole) {
        router.push("/unauthorized");
      }
      
      // Verifica permissões
      if (requiredPermission) {
        const hasAccess = useHasAccess(requiredPermission);
        if (!hasAccess) {
          router.push("/unauthorized");
        }
      }
    }
  }, [loading, isAuthenticated, user, router, requiredRole, requiredPermission, redirectTo]);

  if (loading || !isAuthenticated) {
    return <div>Loading...</div>;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <div>Checking permissions...</div>;
  }

  if (requiredPermission && !useHasAccess(requiredPermission)) {
    return <div>Checking permissions...</div>;
  }

  return <>{children}</>;
};

export const logoutUser = () => {
  const { logout } = useAuth();
  logout();
};