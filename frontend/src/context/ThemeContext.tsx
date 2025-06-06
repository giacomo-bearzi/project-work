// src/context/ThemeContext.tsx
import { useEffect } from "react";
import { createContext, useContext, useMemo, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material";
import type { Theme } from "@mui/material";

type ThemeMode = "light" | "dark";

const ThemeModeContext = createContext<{
  mode: ThemeMode;
  toggleTheme: () => void;
}>({
  mode: "dark",
  toggleTheme: () => {},
});

export const useThemeMode = () => useContext(ThemeModeContext);

export const CustomThemeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const storedMode = localStorage.getItem("themeMode");
    return storedMode === "light" || storedMode === "dark"
      ? storedMode
      : "dark";
  });

  const toggleTheme = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    localStorage.setItem("themeMode", mode);
  }, [mode]);



const theme: Theme = useMemo(
  () =>
    createTheme({
      palette: {
        mode,
      },
      typography: {
        fontFamily: "Montserrat, Arial, Helvetica, sans-serif",
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              backgroundImage:
                mode === "light"
                  ? "url(/background-light.svg)"
                  : "url(/background-dark.svg)",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundAttachment: "fixed",
              backgroundPosition: "center",
              minHeight: "100vh",
            },
          },
        },
      },
    }),
  [mode]
);


  return (
    <ThemeModeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeModeContext.Provider>
  );
};
