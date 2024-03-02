import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  // we are on client-side
  if (typeof window !== 'undefined') return path;
  // we are on the server
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}${path}`;
  // we are on local
  return `http://localhost:${process.env.PORT ?? 3000}${path}`;
}
