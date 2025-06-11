/* eslint-disable react-refresh/only-export-components */

import { useEffect } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material';
import type { Theme } from '@mui/material';
import { getThemeOptions } from './CandyTheme.ts';

type ThemeMode = 'light' | 'dark';

const ThemeModeContext = createContext<{
  mode: ThemeMode;
  toggleTheme: () => void;
}>({
  mode: 'dark',
  toggleTheme: () => {},
});

export const useThemeMode = () => useContext(ThemeModeContext);

export const CustomThemeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const storedMode = localStorage.getItem('themeMode');
    return storedMode === 'light' || storedMode === 'dark'
      ? storedMode
      : 'dark';
  });

  const toggleTheme = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const theme: Theme = useMemo(
    () => createTheme(getThemeOptions(mode)),
    [mode],
  );

  return (
    <ThemeModeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeModeContext.Provider>
  );
};
