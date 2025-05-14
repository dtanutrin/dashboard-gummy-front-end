"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import * as api from "../../lib/api"; 
import type { UserData as User } from "../../lib/api"; // Importar UserData e renomear para User

// Tipos melhorados
type UserRole = "Admin" | "User" | "Editor" | string; // Pode ser estendido conforme necessário

// O tipo User agora é importado de lib/api.ts
// type User = {
//   id: number; 
//   email: string;
//   role: UserRole;
//   name?: string;
//   permissions?: string[];
//   // Adicione outros campos conforme retornado pelo backend
// };

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
      setUser(null); 
      return;
    }

    try {
      setLoading(true); 
      const userData = await api.fetchCurrentUserData(); 
      setUser(userData);
    } catch (error) {
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
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "authToken" && e.newValue === null) {
        setUser(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [loadUserFromToken]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { user: userData } = await api.login(email, password);
      
      if (!userData) {
        throw new Error("Dados do usuário não retornados no login");
      }
      
      setUser(userData);
      router.push("/dashboard");
    } catch (error) {
      setUser(null); 
      let errorMessage = "Falha no login. Por favor, tente novamente.";
      if (typeof error === "object" && error !== null && "message" in error && typeof error.message === "string") {
        errorMessage = error.message;
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
      console.error("Erro no logout:", error); 
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user && !!localStorage.getItem("authToken"),
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
    throw new Error("useAuth deve ser utilizado dentro de um AuthProvider");
  }
  return context;
};

export const useUser = () => {
  const { user, loading } = useAuth();
  return { user, loading };
};

export const useHasAccess = (requiredPermission: string | string[]) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return false; 
  if (!isAuthenticated || !user) return false; 

  if (user.role === "Admin") return true; 

  const permissionsToCheck = Array.isArray(requiredPermission) 
    ? requiredPermission 
    : [requiredPermission];

  // if (!user.permissions) return false; // Comentado pois UserData de lib/api não tem permissions

  // return permissionsToCheck.some(permission => 
  //   user.permissions?.includes(permission)
  // );
  return false; // Simplificado, já que não temos 'permissions' no tipo User atual
};

export const ProtectedRoute = ({
  children,
  requiredRole,
  redirectTo = "/auth/login",
}: {
  children: React.ReactNode;
  requiredRole?: UserRole;
  redirectTo?: string;
}) => {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) { 
      if (!isAuthenticated) {
        router.push(redirectTo);
      } else if (user && requiredRole && user.role !== requiredRole) {
        router.push("/unauthorized"); 
      }
    }
  }, [loading, isAuthenticated, user, router, requiredRole, redirectTo]);

  if (loading || !isAuthenticated) {
    return <div>Loading authentication...</div>; 
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <div>Checking permissions...</div>; 
  }

  return <>{children}</>;
};

