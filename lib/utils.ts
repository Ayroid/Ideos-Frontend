import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const saveToLocalStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data))
}

export const loadFromLocalStorage = (key: string) => {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : []
}