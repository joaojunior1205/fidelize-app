import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

type UserType = 'user' | 'client';

type UserInfo = {
  id: string;
  name: string;
  type: UserType;
};

type AuthContextType = {
  isAuthenticated: boolean;
  userInfo: UserInfo | null;
  login: (auth: object, type: UserType, rememberEmail: boolean, email: string) => Promise<void>;
  logout: () => Promise<void>;
  rememberedEmail: (type: UserType) => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = await SecureStore.getItemAsync('userToken');
    const storedUserInfo = await SecureStore.getItemAsync('userInfo');

    if (token && storedUserInfo) {
      setIsAuthenticated(true);
      setUserInfo(JSON.parse(storedUserInfo));
    }
  };

  const rememberedEmail = async (type: UserType) => {
    return await SecureStore.getItemAsync(`rememberedEmail_${type}`);
  };

  const login = async (auth, type: UserType, rememberEmail: boolean, email) => {
    try {
      await SecureStore.setItemAsync('userToken', auth.data.tokens.refreshToken);
      await SecureStore.setItemAsync('accessToken', auth.data.tokens.accessToken);

      const newUserInfo: UserInfo = {
        ...auth.data.user,
        type: type,
      };

      await SecureStore.setItemAsync('userInfo', JSON.stringify(newUserInfo));
      
      if (rememberEmail) {
        await SecureStore.setItemAsync(`rememberedEmail_${type}`, email);
      } else {
        await SecureStore.deleteItemAsync(`rememberedEmail_${type}`);
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
    <AuthContext.Provider value={{ isAuthenticated, userInfo, login, logout, rememberedEmail }}>
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