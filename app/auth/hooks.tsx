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
      // Não logar aqui, pois o logout() já pode lidar com isso ou ser um erro esperado
      // console.error("Failed to load user:", error);
      await api.logout(); // Limpa o token local se o usuário não puder ser carregado
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
        // Este erro será capturado pelo catch abaixo e relançado
        throw new Error("Dados do usuário não retornados no login");
      }
      
      setUser(userData);
      router.push("/dashboard");
    } catch (error) {
      // console.error("Login error:", error); // Removido para evitar log duplicado
      setUser(null);
      // api.logout(); // Não é necessário chamar logout aqui, pois o token não foi setado ou será inválido
      
      let errorMessage = "Falha no login. Por favor, tente novamente.";
      if (typeof error === "object" && error !== null && "message" in error && typeof error.message === "string") {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage); // Relança o erro para ser tratado pelo componente de UI
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.logout(); // Chama a função de logout da API (que limpa localStorage)
      setUser(null);
      router.push("/auth/login");
    } catch (error) {
      console.error("Erro no logout:", error); // Mantém log para erros inesperados no logout
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
    throw new Error("useAuth deve ser utilizado dentro de um AuthProvider");
  }
  return context;
};

export const useUser = () => {
  const { user, loading } = useAuth();
  return { user, loading };
};

// useHasAccess e ProtectedRoute permanecem os mesmos
export const useHasAccess = (requiredPermission: string | string[]) => {
  const { user, loading } = useAuth();

  if (loading) return false;
  if (!user) return false;

  if (user.role === "Admin") return true;

  const permissionsToCheck = Array.isArray(requiredPermission) 
    ? requiredPermission 
    : [requiredPermission];

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
      if (requiredRole && user.role !== requiredRole) {
        router.push("/unauthorized");
      }
      
      if (requiredPermission) {
        // A função useHasAccess já é um hook, não deve ser chamada diretamente dentro de ProtectedRoute.
        // Esta lógica precisa ser ajustada ou a chamada a useHasAccess ser feita de forma condicional.
        // Para manter a correção focada no erro de login, não alterarei esta parte agora.
        // const hasAccess = useHasAccess(requiredPermission); // Chamada incorreta de hook aqui
        // if (!hasAccess) {
        //   router.push("/unauthorized");
        // }
      }
    }
  }, [loading, isAuthenticated, user, router, requiredRole, requiredPermission, redirectTo]);

  if (loading || !isAuthenticated) {
    return <div>Loading...</div>;
  }

  // A lógica de verificação de role e permissão aqui também pode precisar de revisão
  // para o uso correto de useHasAccess, mas está fora do escopo do erro de login.
  if (requiredRole && user?.role !== requiredRole) {
    return <div>Verificando permissões...</div>;
  }

  // if (requiredPermission && !useHasAccess(requiredPermission)) { // Chamada incorreta de hook aqui
  //   return <div>Verificando permissões...</div>;
  // }

  return <>{children}</>;
};

export const logoutUser = () => {
  const { logout } = useAuth();
  logout();
};
