"use client"

import React, {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react"

type Theme = "light" | "dark"
interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)
let fallbackTheme: Theme | undefined

function getTheme(): Theme {
  try {
    const stored = localStorage.getItem("theme")
    if (stored === "light" || stored === "dark") return stored
  } catch {
    /* Theme toggling still works if storage is unavailable. */
  }
  return (
    fallbackTheme ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light")
  )
}
function subscribeTheme(onChange: () => void) {
  const preference = window.matchMedia("(prefers-color-scheme: dark)")
  window.addEventListener("storage", onChange)
  window.addEventListener("castle-theme-change", onChange)
  preference.addEventListener("change", onChange)
  return () => {
    window.removeEventListener("storage", onChange)
    window.removeEventListener("castle-theme-change", onChange)
    preference.removeEventListener("change", onChange)
  }
}
function getServerTheme(): Theme {
  return "light"
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribeTheme, getTheme, getServerTheme)
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    document.documentElement.style.colorScheme = theme
  }, [theme])
  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light"
    fallbackTheme = next
    try {
      localStorage.setItem("theme", next)
    } catch {
      /* Use in-memory fallback. */
    }
    window.dispatchEvent(new Event("castle-theme-change"))
  }
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)
  if (!context) throw new Error("useTheme must be used within ThemeProvider")
  return context
}
