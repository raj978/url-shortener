import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatLog(val: string) {
  const separator = "=".repeat(20);
  const padding = " ".repeat(10);
  return separator + padding + val + padding + separator;
}
