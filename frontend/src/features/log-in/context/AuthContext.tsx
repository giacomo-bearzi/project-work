import { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
    _id: string;
    username: string;
    role: string;
    fullName: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean; 
    sessionExpired: boolean;
    login: (userData: User, authToken: string) => void;
    logout: (expired?: boolean) => void;
}

interface DecodedToken {
    exp: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [sessionExpired, setSessionExpired] = useState<boolean>(false);
    const navigate = useNavigate();

    const logout = (expired = false) => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setToken(null);
        if (expired) setSessionExpired(true);
        else setSessionExpired(false);
        navigate('/login');
    };

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
    }, []);

    const login = (userData: User, authToken: string) => {
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
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};