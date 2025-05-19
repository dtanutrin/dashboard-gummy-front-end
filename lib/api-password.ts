
// Importações necessárias
import axios from "axios";
import apiClient from "./api"; // Importa o cliente API do arquivo principal

// Implementação da API para atualização de senha do usuário
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
