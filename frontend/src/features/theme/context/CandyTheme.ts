import type { ThemeOptions } from "@mui/material/styles";
import { blue, pink } from "@mui/material/colors";
import "@mui/x-date-pickers/themeAugmentation";

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
          minHeight: "100vh",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: mode === "light" ? "#e0e0e0" : "#424242",
          color: mode === "light" ? "#000" : "#fff",
          fontWeight: 700,
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
          "&.Mui-checked": {
            color: "#FB4376",
          },
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
          fontWeight: "medium",
          "&.Mui-focused": {
            color: "#FB4376",
          },
        },
      },
    },

    // *** Qui aggiungiamo Tabs e Tab ***
    MuiTabs: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${mode === "light" ? "#e0e0e0" : "#424242"}`,
        },
        indicator: {
          backgroundColor: "#FB4376",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          color: mode === "light" ? "#000" : "#fff",
          "&.Mui-selected": {
            color: "#FB4376",
            fontWeight: 700,
          },
          "&:hover": {
            color: "#FF6699",
            opacity: 1,
          },
        },
      },
    },
    MuiPickersDay: {
      styleOverrides: {
        root: {
          color: mode === "light" ? "#000" : "#fff",
          "&.Mui-selected": {
            backgroundColor: "#FB4376!important",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#FF6699",
            },
          },
          "&:hover": {
            backgroundColor: "rgba(251, 67, 118, 0.2)",
          },
          "&.Mui-disabled": {
            color: "#ccc",
          },
        },
        today: {
          border: "1px solid #FB4376",
        },
      },
    },
    // MuiCalendarPicker: {
    //   styleOverrides: {
    //     root: {
    //       backgroundColor: mode === 'light' ? '#fff' : '#303030',
    //     },
    //   },
    // },

    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          backgroundColor: mode === "light" ? "#fff" : "#2c2c2c",
        },
      },
    },
  },
});
