// src/lib/theme.ts
export type Theme = 'light' | 'dark' | 'blue' | 'green' | 'purple' | 'orange' | 'beige'

export const themes: { id: Theme; name: string; colors: { primary: string; secondary: string } }[] =
  [
    { id: 'light', name: 'Minimal Light', colors: { primary: '#ffffff', secondary: '#f6f6f6' } },
    { id: 'dark', name: 'Ink Dark', colors: { primary: '#0b0f14', secondary: '#11161f' } },
    { id: 'blue', name: 'Slate', colors: { primary: '#0f141a', secondary: '#121922' } },
    { id: 'green', name: 'Sage', colors: { primary: '#11161c', secondary: '#151b22' } },
    { id: 'purple', name: 'Iris', colors: { primary: '#0e1220', secondary: '#141a2a' } },
    { id: 'orange', name: 'Amber', colors: { primary: '#161310', secondary: '#1c1814' } },
    { id: 'beige', name: 'Parchment', colors: { primary: '#f5f1e7', secondary: '#e7dece' } },
  ]

export function isDarkThemeId(t: string): boolean {
  return ['dark', 'blue', 'green', 'purple', 'orange'].includes(t)
}

export function normalizeTheme(input: string): Theme {
  const match = themes.find((t) => t.id === (input as Theme))?.id
  return (match ?? 'light') as Theme
}
