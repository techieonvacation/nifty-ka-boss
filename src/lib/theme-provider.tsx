// "use client";

// import React, { createContext, useContext, useEffect, useState } from "react";

// type Theme = "light" | "dark";

// interface ThemeContextType {
//   theme: Theme;
//   setTheme: (theme: Theme) => void;
//   toggleTheme: () => void;
// }

// const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// interface ThemeProviderProps {
//   children: React.ReactNode;
//   defaultTheme?: Theme;
//   storageKey?: string;
// }

// export function ThemeProvider({
//   children,
//   defaultTheme = "light",
//   storageKey = "theme",
// }: ThemeProviderProps) {
//   const [theme, setTheme] = useState<Theme>(defaultTheme);
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);

//     // Get theme from localStorage on client-side
//     const savedTheme = localStorage.getItem(storageKey) as Theme;
//     if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
//       setTheme(savedTheme);
//     }
//   }, [storageKey]);

//   useEffect(() => {
//     if (!mounted) return;

//     // Apply theme to document
//     const root = document.documentElement;
//     root.classList.remove("light", "dark");
//     root.classList.add(theme);

//     // Save to localStorage
//     localStorage.setItem(storageKey, theme);
//   }, [theme, mounted, storageKey]);

//   const toggleTheme = () => {
//     setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
//   };

//   // Always provide the context, but show loading state for theme-dependent content
//   return (
//     <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// }

// export function useTheme() {
//   const context = useContext(ThemeContext);
//   if (context === undefined) {
//     throw new Error("useTheme must be used within a ThemeProvider");
//   }
//   return context;
// }
