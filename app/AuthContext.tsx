import React, {createContext, useState, useContext, useEffect} from 'react';
import * as SecureStore from 'expo-secure-store';

type UserType = 'user' | 'client';

type UserInfo = {
  id: string;
  name: string;
  type: UserType;
};

type AuthContextType = {
    isAuthenticated: boolean;
    userInfo: object | null;
    login: (auth: authType, rememberEmail: boolean, email: string) => Promise<void>;
    logout: () => Promise<void>;
    rememberedEmail: () => Promise<string | null>;
    checkAuthStatus: () => Promise<void>;
};

type authType = { data: { tokens: { refreshToken: string, accessToken: string }, user: object } };

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userInfo, setUserInfo] = useState<object | null>(null);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        const token = await SecureStore.getItemAsync('userToken');

        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    };

    const rememberedEmail = async () => {
        return await SecureStore.getItemAsync(`rememberedEmail`);
    };

    const login = async (auth: authType, rememberEmail: boolean, email: string) => {
        try {
            await SecureStore.setItemAsync('userToken', auth.data.tokens.accessToken);
            await SecureStore.setItemAsync('tokenToRefresh', auth.data.tokens.refreshToken);

            const newUserInfo: object = {...auth.data.user};

            await SecureStore.setItemAsync('userInfo', JSON.stringify(newUserInfo));

            if (rememberEmail) {
                await SecureStore.setItemAsync(`rememberedEmail`, email);
            } else {
                await SecureStore.deleteItemAsync(`rememberedEmail`);
            }

            setIsAuthenticated(true);
            setUserInfo(newUserInfo);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = async () => {
        await SecureStore.deleteItemAsync('userToken');
        await SecureStore.deleteItemAsync('userInfo');
        setIsAuthenticated(false);
        setUserInfo(null);
    };

    return (
        <AuthContext.Provider value={{isAuthenticated, userInfo, login, logout, rememberedEmail, checkAuthStatus}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};