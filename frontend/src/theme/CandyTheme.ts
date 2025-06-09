import type { ThemeOptions } from "@mui/material/styles";
import { blue, pink } from "@mui/material/colors";

export const getThemeOptions = (mode: "light" | "dark"): ThemeOptions => ({
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
          background: "linear-gradient(45deg, #FB4376 30%, #FFB6C1 90%)",
          border: 0,
          borderRadius: 20,
          boxShadow: "0 4px 10px rgba(251, 67, 118, 0.4)",
          color: "white",
          height: 48,
          padding: "0 30px",
          textTransform: "none",
          transition: "0.3s ease",
          "&:hover": {
            background: "linear-gradient(45deg, #FF6699 30%, #FFD1DC 90%)",
            boxShadow: "0 6px 14px rgba(251, 67, 118, 0.5)",
          },
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          backgroundColor: "#FB4376",
          color: "white",
          boxShadow: "0 4px 10px rgba(251, 67, 118, 0.3)",
          padding: "0 24px",
          minHeight: "64px",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          color: "#fff",
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          transition: "0.3s ease",
          "& .MuiOutlinedInput-input": {
            color: mode === "light" ? "#000" : "#fff",
            "&::placeholder": {
              color: "#FFC1D3",
              opacity: 1,
            },
          },
          "&.Mui-focused .MuiOutlinedInput-input::placeholder": {
            color: "#FFA0BA",
            opacity: 1,
          },
          "&:hover": {
            backgroundColor: "rgba(251, 67, 118, 0.1)",
          },
          "&.Mui-focused": {
            backgroundColor: "rgba(251, 67, 118, 0.15)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#FB4376",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#FB4376",
          },
          "& .MuiOutlinedInput-input:-webkit-autofill": {
            WebkitBoxShadow: "0 0 0 100px rgba(251, 67, 118, 0.15) inset",
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
          color: mode === "light" ? "#FF69B4" : "#FFD1DC",
          fontWeight: "bold",
          "&.Mui-focused": {
            color: "#FB4376",
          },
        },
      },
    },
  },
});
