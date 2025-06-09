/* eslint-disable react-refresh/only-export-components */

import { useEffect } from "react";
import { createContext, useContext, useMemo, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material";
import type { Theme } from "@mui/material";
import { blue, pink } from "@mui/material/colors";

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
          primary: blue,
          secondary: pink,
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
                backgroundPosition: "bottom",
                minHeight: "100vh",
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                backgroundColor: "#FB4376",
              },
            },
          },
          MuiToolbar: {
            styleOverrides: {
              root: {
                backgroundColor: "#FB4376",
              },
            },
          },
          MuiIconButton: {
            styleOverrides: {
              root: {
                color: "#FB4376",
              },
            },
          },

          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                borderRadius: "8px",
                color: "#fff",
                "& .MuiOutlinedInput-input": {
                  color: mode === "light" ? "#000" : "#fff",
                  "&::placeholder": {
                    color: "#aaa",
                    opacity: 1,
                  },
                },
                "&.Mui-focused .MuiOutlinedInput-input::placeholder": {
                  color: "#aaa",
                  opacity: 1,
                },
                "&:hover": {
                  backgroundColor: "rgba(251, 67, 118, 0.15)",
                },
                "&.Mui-focused": {
                  backgroundColor: "rgba(251, 67, 118, 0.2)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#FB4376",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#FB4376",
                },
                "& .MuiOutlinedInput-input:-webkit-autofill": {
                  WebkitBoxShadow: "0 0 0 100px rgba(251, 67, 118, 0.2) inset",
                  WebkitTextFillColor: mode === "light" ? "#000" : "#fff",
                  caretColor: mode === "light" ? "#000" : "#fff",
                  borderRadius: "inherit",
                  transition: "background-color 5000s ease-in-out 0s",
                },
              },
            },
          },
          MuiInputLabel: {
            styleOverrides: {
              root: {
                color: mode === "light" ? "#000" : "#fff",
                "&.Mui-focused": {
                  color: "#FB4376",
                },
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
