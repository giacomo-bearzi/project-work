/* eslint-disable react-refresh/only-export-components */

import { jwtDecode } from 'jwt-decode';
import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ApiGetUser } from '../../users/types/usersTypes.ts';

interface AuthContextType {
  user: ApiGetUser | null;
  token: string | null;
  loading: boolean;
  sessionExpired: boolean;
  login: (userData: ApiGetUser, authToken: string) => void;
  logout: (expired?: boolean) => void;
}

interface DecodedToken {
  exp: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<ApiGetUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [sessionExpired, setSessionExpired] = useState<boolean>(false);
  const navigate = useNavigate();

  const logout = useCallback(
    (expired = false) => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setToken(null);
      if (expired) setSessionExpired(true);
      else setSessionExpired(false);
      navigate('/login');
    },
    [navigate]
  );

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const decoded: DecodedToken = jwtDecode(storedToken);

        const isExpired = decoded.exp * 1000 < Date.now();

        if (isExpired) {
          console.warn('Token scaduto');
          logout(true);
        } else {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);

          const timeUntilExpiration = decoded.exp * 1000 - Date.now();
          setTimeout(() => {
            console.log('Token scaduto, logout automatico');
            logout(true);
          }, timeUntilExpiration);
        }
      } catch (error) {
        console.error('Errore nella decodifica del token:', error);
        logout();
      }
    }

    setLoading(false);
  }, [logout]);

  const login = (userData: ApiGetUser, authToken: string) => {
    localStorage.setItem('token', authToken);

    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setToken(authToken);
    setSessionExpired(false);
    try {
      const decoded: DecodedToken = jwtDecode(authToken);
      const timeUntilExpiration = decoded.exp * 1000 - Date.now();
      setTimeout(() => {
        console.log('Token scaduto, logout automatico');
        logout(true);
      }, timeUntilExpiration);
    } catch (error) {
      console.error('Errore nella decodifica del token al login:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, sessionExpired, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve essere utilizzato all'interno di un AuthProvider");
  }
  return context;
};
