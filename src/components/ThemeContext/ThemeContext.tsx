"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type TTheme = "light" | "dark";

export interface IThemeContext {
  theme: TTheme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<IThemeContext | undefined>(undefined);

function readStoredTheme(): TTheme | null {
  if (typeof window === "undefined") {
    return null;
  }
  const stored = localStorage.getItem("theme") as TTheme | null;
  return stored === "light" || stored === "dark" ? stored : null;
}

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  // Always start with "light" so server and client initial HTML match
  // during hydration. Stored preferences are applied in the effect below.
  const [theme, setTheme] = useState<TTheme>("light");

  useEffect(() => {
    // Run only after hydration to avoid server/client mismatch.
    const stored = readStoredTheme();
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored ?? (prefersDark ? "dark" : "light");

    // Intentional: reading persisted theme after hydration is the standard
    // Next.js pattern to avoid hydration mismatches while respecting user prefs.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(initial);

    // Update DOM immediately with the resolved theme (not `theme`, which is
    // still the stale initial value inside this closure).
    document.documentElement.setAttribute("data-theme", initial);
    localStorage.setItem("theme", initial);
  }, []);

  // Keep data-theme and localStorage in sync whenever theme changes thereafter.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Follow OS color scheme when user hasn't picked a manual theme.
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (!localStorage.getItem("theme")) {
        setTheme(media.matches ? "dark" : "light");
      }
    };
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): IThemeContext {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
