import { useContext } from "react";
import { ThemeContext } from "./ThemeContext.js";

export function useThemeContext() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeContext must be used inside ThemeProvider");
  return ctx;
}
