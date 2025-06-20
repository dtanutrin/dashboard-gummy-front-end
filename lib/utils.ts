import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const decodeUrlParam = (param: string): string => {
  try {
    return decodeURIComponent(param.replace(/\+/g, ' '));
  } catch (e) {
    console.error("Error decoding URL parameter:", e);
    return param; // Return original param if decoding fails
  }
};

// Helper function to get icon filename based on area name
export const getIconFilename = (areaName: string): string => {
  const normalizedName = areaName.toLowerCase()
                                .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
                                .replace(/\s+/g, ' ') // Keep spaces for matching keywords
                                .replace(/[^a-z0-9\s]/g, ''); // Remove special chars except space

  // Map keywords to icon files - Adjust keywords as needed
  if (normalizedName.includes('b2b')) return 'b2b-icone.png';
  if (normalizedName.includes('compras')) return 'compras-icone.png';
  if (normalizedName.includes('cs') || normalizedName.includes('monitoramento')) return 'cs-icone.png';
  if (normalizedName.includes('influenciador') || normalizedName.includes('influencer')) return 'influenciador-icone.png';
  if (normalizedName.includes('logistica')) return 'logistica-icone.png';
  if (normalizedName.includes('operacoes') || normalizedName.includes('controle')) return 'operacoes-icone.png';
  // Match 'performance e vendas' or just 'performance'
  if (normalizedName.includes('performance')) return 'performance-icone.png'; 
  if (normalizedName.includes('retencao')) return 'retencao-icone.png';
  if (normalizedName.includes('financeiro')) return 'financeiro-icone.png';
  if (normalizedName.includes('jurídico')) return 'jurídico-icone.png';
  // Add specific checks for 'Comercial - Individual' and 'Comercial Interno' if needed
  // Example: if (normalizedName === 'comercial individual') return 'some-icon.png';

  return 'generico-icone.png'; // Fallback to generic icon
};

