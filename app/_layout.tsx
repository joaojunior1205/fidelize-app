import { Stack } from 'expo-router';
import { AuthProvider } from './AuthContext';
import { StatusBar } from 'expo-status-bar';

export default function Layout() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen 
          name="choose-login-type" 
          options={{ 
            headerShown: false,
            statusBarStyle: 'dark',
          }} 
        />
        <Stack.Screen 
          name="login" 
          options={{ 
            headerShown: false,
            statusBarStyle: 'dark',
          }} 
        />
        <Stack.Screen 
          name="register-company" 
          options={{ 
            headerShown: false,
            statusBarStyle: 'dark',
          }} 
        />
        <Stack.Screen 
          name="register-client" 
          options={{ 
            headerShown: false,
            statusBarStyle: 'dark',
          }} 
        />
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}