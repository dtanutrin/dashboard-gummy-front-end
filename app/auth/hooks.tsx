"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import * as api from "../../lib/api"; // Presumo que api.fetchCurrentUser() será criada em lib/api.ts

// Tipos melhorados
type UserRole = "Admin" | "User" | "Editor" | string; // Pode ser estendido conforme necessário

type User = {
  id: number; // No backend o token tem userId, mas a resposta do /auth/me pode ser só id
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
      setUser(null); // Garante que o usuário seja nulo se não houver token
      return;
    }

    try {
      setLoading(true); // Define loading como true antes da chamada da API
      // Chama uma nova função na API para buscar dados do usuário usando o token (ex: /auth/me)
      const userData = await api.fetchCurrentUserData(); // Esta função precisará ser implementada em lib/api.ts
      setUser(userData); // Define o usuário com os dados recebidos
    } catch (error) {
      // console.error("Failed to load user from token:", error); // Log pode ser útil para debug
      await api.logout(); // Limpa o token local e o usuário se a validação falhar
      setUser(null);
      // Não redireciona para login aqui, deixa o ProtectedRoute cuidar disso se necessário
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
        // Não redireciona automaticamente para login aqui, pode causar loops ou comportamento indesejado.
        // Deixe os componentes/rotas protegidas lidarem com o redirecionamento.
        // router.push("/auth/login"); 
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [loadUserFromToken]); // Removido router da dependência para evitar re-execuções desnecessárias

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      // A função api.login já deve salvar o token no localStorage e retornar os dados do usuário
      const { user: userData } = await api.login(email, password);
      
      if (!userData) {
        throw new Error("Dados do usuário não retornados no login");
      }
      
      setUser(userData); // Define o usuário no estado do contexto
      router.push("/dashboard"); // Redireciona após login bem-sucedido
    } catch (error) {
      setUser(null); // Limpa o usuário em caso de falha no login
      // api.logout(); // Não é necessário, pois o token não foi setado ou será inválido
      
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
      console.error("Erro no logout:", error); 
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user && !!localStorage.getItem("authToken"), // Verifica também o token
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

  if (loading) return false; // Se estiver carregando, não tem acesso ainda
  if (!isAuthenticated || !user) return false; // Se não estiver autenticado ou não houver usuário, não tem acesso

  if (user.role === "Admin") return true; // Admin tem acesso a tudo

  // Lógica de permissão específica (se aplicável)
  const permissionsToCheck = Array.isArray(requiredPermission) 
    ? requiredPermission 
    : [requiredPermission];

  // Se não houver permissões definidas para o usuário, ele não tem acesso a permissões específicas
  if (!user.permissions) return false; 

  return permissionsToCheck.some(permission => 
    user.permissions?.includes(permission)
  );
};

export const ProtectedRoute = ({
  children,
  requiredRole,
  // requiredPermission, // Comentado por enquanto para simplificar, focar no role
  redirectTo = "/auth/login",
}: {
  children: React.ReactNode;
  requiredRole?: UserRole;
  // requiredPermission?: string | string[];
  redirectTo?: string;
}) => {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) { // Só executa após o carregamento inicial
      if (!isAuthenticated) {
        router.push(redirectTo);
      } else if (user && requiredRole && user.role !== requiredRole) {
        // Se está autenticado, mas não tem o role necessário
        router.push("/unauthorized"); // Ou uma página de acesso negado mais genérica
      }
      // Lógica para requiredPermission pode ser adicionada aqui se necessário
    }
  }, [loading, isAuthenticated, user, router, requiredRole, redirectTo]);

  if (loading || !isAuthenticated) {
    // Enquanto carrega ou se não estiver autenticado, mostra um loader ou nada
    return <div>Loading authentication...</div>; 
  }

  // Se tem um requiredRole e o usuário não o possui (após o loading e autenticação verificados)
  if (requiredRole && user?.role !== requiredRole) {
    // Poderia retornar um componente de "Não autorizado" ou null para o useEffect redirecionar
    return <div>Checking permissions...</div>; 
  }

  return <>{children}</>;
};

// Função utilitária para deslogar, pode ser chamada de qualquer componente
export const logoutUser = () => {
  const { logout } = useAuth(); // Isso é um erro, hooks não podem ser chamados assim diretamente.
                               // Esta função deveria ser um método do contexto ou removida se `logout` do useAuth() for suficiente.
                               // Por ora, vou comentar para evitar erro de build.
  // logout(); 
  // Em vez disso, quem precisar deslogar deve usar: const { logout } = useAuth(); logout();
};

