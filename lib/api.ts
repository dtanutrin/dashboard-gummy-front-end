import axios from "axios";

// Tipos para a API
type UserData = {
  id: number;      // ou userId, dependendo do que /auth/me retorna
  email: string;
  role: string;
  name?: string;
  // Outros campos que /auth/me possa retornar
};

type LoginResponse = {
  token: string;
  user: UserData;
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
        localStorage.removeItem("user"); // Limpa também o usuário
        // window.location.href = "/auth/login"; // Comentado para evitar redirecionamento abrupto, deixar o AuthProvider/ProtectedRoute lidar
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
      // Armazena o objeto user retornado pelo login, que já deve ter id, email, role
      localStorage.setItem("user", JSON.stringify(response.data.user)); 
    }
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || "Erro ao tentar fazer login";
      // console.error("Erro na API de login:", errorMessage);
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
 * Busca os dados do usuário autenticado usando o token.
 * @returns Promise com os dados do usuário.
 */
export const fetchCurrentUserData = async (): Promise<UserData> => {
  try {
    // A rota /auth/me deve retornar os dados do usuário (id, email, role)
    const response = await apiClient.get<UserData>("/auth/me");
    if (typeof window !== "undefined" && response.data) {
      // Atualiza o usuário no localStorage com os dados frescos do backend
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    // console.error("Erro ao buscar dados do usuário atual:", error);
    // Se falhar (ex: token inválido), o interceptor de resposta já deve ter limpado o token.
    // Relança o erro para que o AuthProvider possa tratar (ex: deslogar o usuário).
    throw error; 
  }
};


/**
 * Obtém o usuário atual do localStorage (usado para inicialização síncrona se necessário)
 */
export const getCurrentUserFromStorage = (): UserData | null => {
  if (typeof window === "undefined") return null;
  
  const userString = localStorage.getItem("user");
  try {
    return userString ? JSON.parse(userString) as UserData : null;
  } catch (e) {
    // console.error("Erro ao parsear usuário do localStorage:", e);
    return null;
  }
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
    // console.error("Erro ao buscar dashboards:", error);
    throw error;
  }
};

/**
 * Atualiza dados do usuário no servidor (exemplo, endpoint /users/me não foi confirmado)
 */
export const updateUserProfile = async (userData: Partial<UserData>) => {
  try {
    // Ajuste o endpoint conforme necessário, ex: /users/profile ou /users/:id
    const response = await apiClient.patch<UserData>("/users/me", userData); 
    
    if (typeof window !== "undefined" && response.data) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    
    return response.data;
  } catch (error) {
    // console.error("Erro ao atualizar perfil:", error);
    throw error;
  }
};

/**
 * Verifica se o token é válido (usando a rota /auth/validate)
 */
export const validateToken = async (): Promise<boolean> => {
  try {
    await apiClient.get("/auth/validate"); // A rota /auth/validate retorna { message: 'Token is valid.', user: req.user }
    return true;
  } catch (error) {
    return false;
  }
};

// CRUD de Usuários (Admin)

export type UserCreatePayload = {
  email: string;
  password?: string; // Senha pode ser opcional na criação se gerada ou enviada de outra forma
  role: string; // 'Admin' ou 'User'
  areas?: number[];
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


export default apiClient;

