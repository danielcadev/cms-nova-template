// lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function createUrl(base: string, params: Record<string, string>) {
  const url = new URL(base, 'http://localhost') // Base doesn't matter for path only
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })
  return url.pathname + url.search
}

export function decodeUrlParam(param: string) {
  return decodeURIComponent(param).replace(/-/g, ' ')
}

export function compareUrlParams(a: string, b: string) {
  return a.toLowerCase().trim() === b.toLowerCase().trim()
}

export function normalizeZoneName(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
}
