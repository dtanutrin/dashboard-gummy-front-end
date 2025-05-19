import axios from "axios";

// Importação da função de atualização de senha
import { updateUserPassword } from "./api-password";

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
      if (typeof window !== "undefined") {
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
    if (typeof window !== "undefined" && response.data.token) {
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
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  }
};

export const fetchCurrentUserData = async (): Promise<UserData> => {
  try {
    const response = await apiClient.get<UserData>("/auth/me");
    if (typeof window !== "undefined" && response.data) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    throw error; 
  }
};

export const getCurrentUserFromStorage = (): UserData | null => {
  if (typeof window === "undefined") return null;
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

export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  try {
    await apiClient.post("/auth/reset-password", { token, newPassword });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || "Erro ao redefinir senha";
      throw new Error(errorMessage);
    }
    throw new Error("Erro desconhecido ao redefinir senha");
  }
};

// Exportando a função de atualização de senha
export { updateUserPassword } from './api-password';
export * from './api-password';
export default apiClient;

