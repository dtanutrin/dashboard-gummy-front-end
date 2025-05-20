// Caminho: dashboard-gummy-front-end/lib/api.ts
import axios from "axios";

// Função auxiliar para verificar se estamos no navegador
const isBrowser = () => typeof window !== 'undefined';

// Função para obter o token JWT do localStorage
export const getToken = (): string | null => {
  if (isBrowser()) {
    return localStorage.getItem("authToken");
  }
  return null;
};

// Tipos para a API
export type UserData = {
  id: number;
  email: string;
  role: string;
  name?: string;
  areas?: Area[]; // Adicionado para carregar áreas do usuário
};

export type LoginResponse = {
  token: string;
  user: UserData;
};

export interface Area {
  id: number;
  name: string;
  // Frontend pode adicionar color/icon aqui se necessário para exibição
  color?: string; 
  icon?: string;
  dashboards?: Dashboard[]; // Para carregar dashboards dentro de uma área
}

export interface Dashboard {
  id: number;
  name: string;
  url: string;
  areaId: number;
  information?: string; 
}

// Interface para dados de perfil do usuário
export interface ProfileData {
  name: string;
  currentPassword?: string;
  newPassword?: string;
}

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
    if (isBrowser()) {
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
      if (isBrowser()) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
      }
    }
    return Promise.reject(error);
  }
);

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>("/auth/login", { email, password });
    if (isBrowser() && response.data.token) {
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user)); 
    }
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || "Erro ao tentar fazer login";
      throw new Error(errorMessage);
    }
    throw new Error("Erro desconhecido ao fazer login");
  }
};

export const logout = (): void => {
  if (isBrowser()) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  }
};

export const fetchCurrentUserData = async (): Promise<UserData> => {
  try {
    const response = await apiClient.get<UserData>("/auth/me");
    if (isBrowser() && response.data) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    throw error; 
  }
};

export const getCurrentUserFromStorage = (): UserData | null => {
  if (!isBrowser()) return null;
  const userString = localStorage.getItem("user");
  try {
    return userString ? JSON.parse(userString) as UserData : null;
  } catch (e) {
    return null;
  }
};

// CRUD de Dashboards (Admin)
export const getAllDashboards = async (): Promise<Dashboard[]> => {
  const response = await apiClient.get<Dashboard[]>("/dashboards");
  return response.data;
};

export const getDashboardById = async (id: number): Promise<Dashboard> => {
  const response = await apiClient.get<Dashboard>(`/dashboards/${id}`);
  return response.data;
};

export const createDashboard = async (dashboardData: Omit<Dashboard, "id">): Promise<Dashboard> => {
  const response = await apiClient.post<Dashboard>("/dashboards", dashboardData);
  return response.data;
};

export const updateDashboard = async (id: number, dashboardData: Partial<Omit<Dashboard, "id">>): Promise<Dashboard> => {
  const response = await apiClient.put<Dashboard>(`/dashboards/${id}`, dashboardData);
  return response.data;
};

export const deleteDashboard = async (id: number): Promise<void> => {
  await apiClient.delete(`/dashboards/${id}`);
};

// CRUD de Áreas (Admin)
export type AreaCreatePayload = {
  name: string;
};
export type AreaUpdatePayload = Partial<AreaCreatePayload>;

export const getAllAreas = async (): Promise<Area[]> => {
  const response = await apiClient.get<Area[]>("/areas");
  return response.data;
};

export const getAreaById = async (id: number): Promise<Area> => {
  const response = await apiClient.get<Area>(`/areas/${id}`);
  return response.data;
};

export const createArea = async (areaData: AreaCreatePayload): Promise<Area> => {
  const response = await apiClient.post<Area>("/areas", areaData);
  return response.data;
};

export const updateArea = async (id: number, areaData: AreaUpdatePayload): Promise<Area> => {
  const response = await apiClient.put<Area>(`/areas/${id}`, areaData);
  return response.data;
};

export const deleteArea = async (id: number): Promise<void> => {
  await apiClient.delete(`/areas/${id}`);
};

// CRUD de Usuários (Admin)
export type UserCreatePayload = {
  email: string;
  password?: string; 
  role: string; 
  name?: string; // Adicionado para permitir atualização do nome
  areaIds?: number[]; // Alterado para areaIds para corresponder ao backend
};

export type UserUpdatePayload = Partial<UserCreatePayload>;

export const getAllUsers = async (): Promise<UserData[]> => {
  const response = await apiClient.get<UserData[]>("/users");
  return response.data;
};

export const getUserById = async (id: number): Promise<UserData> => {
  const response = await apiClient.get<UserData>(`/users/${id}`);
  return response.data;
};

export const createUser = async (userData: UserCreatePayload): Promise<UserData> => {
  const response = await apiClient.post<UserData>("/users", userData);
  return response.data;
};

export const updateUser = async (id: number, userData: UserUpdatePayload): Promise<UserData> => {
  const response = await apiClient.put<UserData>(`/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await apiClient.delete(`/users/${id}`);
};

export const validateToken = async (): Promise<boolean> => {
  try {
    await apiClient.get("/auth/validate");
    return true;
  } catch (error) {
    return false;
  }
};

// Função para atualizar o perfil do usuário (versão com tipagem TypeScript)
export const updateUserProfile = async (userData: ProfileData): Promise<any> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('Usuário não autenticado');
    }
    
    const response = await fetch(`${API_URL}/api/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao atualizar perfil');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    throw error;
  }
};

// Função para atualização de senha do usuário
export const updateUserPassword = async (userId: number, passwordData: { currentPassword: string; newPassword: string }): Promise<void> => {
  try {
    await apiClient.put(`/users/${userId}/password`, passwordData);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || "Erro ao atualizar senha";
      throw new Error(errorMessage);
    }
    throw new Error("Erro desconhecido ao atualizar senha");
  }
};

// Funções para recuperação de senha
export const requestPasswordReset = async (email: string): Promise<void> => {
  try {
    await apiClient.post("/auth/forgot-password", { email });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || "Erro ao solicitar redefinição de senha";
      throw new Error(errorMessage);
    }
    throw new Error("Erro desconhecido ao solicitar redefinição de senha");
  }
};

// Função para redefinir a senha (versão com tipagem TypeScript)
export const resetPassword = async (token: string, newPassword: string): Promise<any> => {
  try {
    const response = await apiClient.post("/auth/reset-password", { token, newPassword });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || "Erro ao redefinir senha";
      throw new Error(errorMessage);
    }
    throw new Error("Erro desconhecido ao redefinir senha");
  }
};

// Alias para compatibilidade com código existente
export const forgotPassword = requestPasswordReset;

export default apiClient;
