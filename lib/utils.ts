import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Decodes URL parameters that may contain special characters
 * @param param The URL parameter to decode
 * @returns The decoded parameter
 */
export function decodeUrlParam(param: string): string {
  try {
    return decodeURIComponent(param)
  } catch (error) {
    console.error("Error decoding URL parameter:", error)
    return param
  }
}

// Cores da marca Gummy
export const gummyColors = {
  primary: "#e91e63", // Rosa principal
  primaryDark: "#c2185b",
  primaryLight: "#f48fb1",
  secondary: "#ff4081", // Rosa secundário
  accent: "#ff80ab",
  background: "#fce4ec",
  backgroundDark: "#121212",
  text: "#212121",
  textLight: "#f5f5f5",
}
