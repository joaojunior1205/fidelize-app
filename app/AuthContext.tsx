import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import config from '../config';

type UserType = 'user' | 'client';

type UserInfo = {
  id: string;
  name: string;
  type: UserType;
};

type AuthContextType = {
  isAuthenticated: boolean;
  userInfo: UserInfo | null;
  login: (email: string, password: string, type: UserType, rememberEmail: boolean) => Promise<void>;
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

  const login = async (email: string, password: string, type: UserType, rememberEmail: boolean) => {
    try {
      const endpoint = type === 'user' ? '/auth/login-user' : '/auth/login-client';
      const url = `${config.apiUrl}${endpoint}`;
      console.log('Attempting to fetch from:', url);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`Login failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API Response:', JSON.stringify(data, null, 2));

      if (!data.success || !data.data || !data.data.token) {
        throw new Error('Token not found in API response');
      }

      const tokenString = typeof data.data.token === 'string' ? data.data.token : JSON.stringify(data.data.token);
      console.log('Token to be stored:', tokenString);

      await SecureStore.setItemAsync('userToken', tokenString);
      
      const newUserInfo: UserInfo = {
        id: type === 'client' ? data.data.client.id : data.data.id,
        name: type === 'client' ? data.data.client.name : data.data.name,
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
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
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