import { getCookie } from "cookies-next";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://dashboard-gummy-back-end.onrender.com/api";

// Solução definitiva para os headers
type CustomHeaders = Record<string, string> & {
  "Content-Type": string;
  Authorization?: string;
};

async function request(endpoint: string, options: RequestInit = {}) {
  const token = getCookie("token");
  
  // Criação dos headers com tipo seguro
  const headers: CustomHeaders = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Configuração final com headers tipados corretamente
  const config: RequestInit = {
    ...options,
    headers: headers as HeadersInit, // Cast seguro para o tipo esperado pelo RequestInit
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || `Error: ${response.status}`);
    }
    return response.status === 204 ? null : response.json();
  } catch (error) {
    console.error("Request failed:", error);
    throw error;
  }
}

// Implementação prática (sem interfaces complexas)
export const getUsers = () => request("/users");
export const getUserById = (id: string) => request(`/users/${id}`);
export const createUser = (data: unknown) => 
  request("/users", { method: "POST", body: JSON.stringify(data) });
export const updateUser = (id: string, data: unknown) => 
  request(`/users/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteUser = (id: string) => 
  request(`/users/${id}`, { method: "DELETE" });

export const getDashboards = () => request("/dashboards");
export const getDashboardById = (id: string) => request(`/dashboards/${id}`);
export const createDashboard = (data: unknown) => 
  request("/dashboards", { method: "POST", body: JSON.stringify(data) });
export const updateDashboard = (id: string, data: unknown) => 
  request(`/dashboards/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteDashboard = (id: string) => 
  request(`/dashboards/${id}`, { method: "DELETE" });