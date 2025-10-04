import { useCallback, useEffect, useMemo, useState } from "react";
import { ThemeContext } from "./ThemeContext.js";

const THEME_STORAGE_KEY = "bfree-theme";
const THEMES = ["dawn", "dusk"];

function resolveInitialTheme() {
  if (typeof window === "undefined") return "dawn";

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored && THEMES.includes(stored)) return stored;

  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
  return prefersDark ? "dusk" : "dawn";
}

function applyDocumentTheme(theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  THEMES.forEach((name) => root.classList.remove(`theme-${name}`));
  root.classList.add(`theme-${theme}`);
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const initial = resolveInitialTheme();
    applyDocumentTheme(initial);
    return initial;
  });

  useEffect(() => {
    applyDocumentTheme(theme);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      console.warn("Could not persist theme", error);
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dusk" ? "dawn" : "dusk"));
  }, []);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
    }),
    [theme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
