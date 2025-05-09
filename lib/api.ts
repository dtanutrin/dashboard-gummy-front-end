import axios from "axios";

// Tipos para a API
type LoginResponse = {
  token: string;
  user: {
    id: number;
    email: string;
    role: string;
    name?: string;
  };
};

type Dashboard = {
  id: number;
  name: string;
  // Adicione outros campos conforme retornado pelo backend
};

// Configuração base
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://dashboard-gummy-back-end.onrender.com/api";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar token JWT
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratamento global de erros
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Tratamento especial para erros de autenticação
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Função para login
 * @param email - Email do usuário
 * @param password - Senha do usuário
 * @returns Promise com dados do usuário e token
 */
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>("/auth/login", { email, password });
    
    if (typeof window !== "undefined" && response.data.token) {
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || "Erro ao tentar fazer login";
      console.error("Erro na API de login:", errorMessage);
      throw new Error(errorMessage);
    }
    throw new Error("Erro desconhecido ao fazer login");
  }
};

/**
 * Função para logout
 */
export const logout = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  }
};

/**
 * Obtém o usuário atual do localStorage
 */
export const getCurrentUser = (): LoginResponse['user'] | null => {
  if (typeof window === "undefined") return null;
  
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

/**
 * Busca dashboards
 * @returns Promise com lista de dashboards
 */
export const fetchDashboards = async (): Promise<Dashboard[]> => {
  try {
    const response = await apiClient.get<Dashboard[]>("/dashboards");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar dashboards:", error);
    throw error;
  }
};

/**
 * Atualiza dados do usuário no servidor
 */
export const updateUserProfile = async (userData: Partial<LoginResponse['user']>) => {
  try {
    const response = await apiClient.patch<LoginResponse['user']>("/users/me", userData);
    
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    throw error;
  }
};

/**
 * Verifica se o token é válido
 */
export const validateToken = async (): Promise<boolean> => {
  try {
    await apiClient.get("/auth/validate");
    return true;
  } catch (error) {
    return false;
  }
};

export default apiClient;