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
              ? "url(/background-light-4.svg)"
              : "url(/background-dark-4.svg)",
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
          borderRadius: 20,
          textTransform: "none",
          transition: "0.3s ease",
        },
        contained: {
          background: "linear-gradient(45deg, #FB4376 30%, #FFB6C1 90%)",
          color: "white",
          boxShadow: "0 4px 10px rgba(251, 67, 118, 0.4)",
          "&:hover": {
            background: "linear-gradient(45deg, #FF6699 30%, #FFD1DC 90%)",
            boxShadow: "0 6px 14px rgba(251, 67, 118, 0.5)",
          },
        },
        outlined: {
          color: "#FB4376",
          border: "2px solid #FB4376",
          backgroundColor: "transparent",
          "&:hover": {
            backgroundColor: "rgba(251, 67, 118, 0.1)",
            borderColor: "#FB4376",
          },
        },
        text: {
          color: "#FB4376",
          "&:hover": {
            backgroundColor: "rgba(251, 67, 118, 0.08)",
          },
        },
      },
    },
   MuiCheckbox: {
  styleOverrides: {
    root: {
      color: "#FB4376",
      '&.Mui-checked': {
        color: "#FB4376",
      },
    },
  },
},


    // MuiToolbar: {
    //   styleOverrides: {
    //     root: {
    //       backgroundColor: "#FB4376",
    //       color: "white",
    //       boxShadow: "0 4px 10px rgba(251, 67, 118, 0.3)",
    //       padding: "0 24px",
    //       minHeight: "64px",
    //     },
    //   },
    // },
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
