import React, { createContext, useContext, useState } from "react";
import { ThemeConfig } from "antd";
import { lightTheme, darkTheme } from "../theme/antdTheme";

type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
  currentTheme: ThemeConfig;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const value: ThemeContextType = {
    isDark,
    toggleTheme,
    currentTheme: isDark ? darkTheme : lightTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme debe usarse dentro de un ThemeProvider");
  return context;
};
