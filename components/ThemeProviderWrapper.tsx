"use client";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { createContext, useMemo, useState, useContext, ReactNode } from "react";

const ColorModeContext = createContext({ toggleColorMode: () => {} });

export function useColorMode() {
  return useContext(ColorModeContext);
}

export default function ThemeProviderWrapper({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<"light" | "dark">("light");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prev) => (prev === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "dark"
            ? {
                background: { 
                  default: "#2e2e2e", 
                  paper: "#3a3a3a",   
                },
                text: { 
                  primary: "#ffffff", 
                  secondary: "#cccccc",
                },
              }
            : {
                background: { default: "#f5f5f5", paper: "#ffffff" },
                text: { primary: "#000000", secondary: "#555555" },
              }),
        },
        typography: {
          fontFamily: "Inter, sans-serif",
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
