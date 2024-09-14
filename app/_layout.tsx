import { Stack } from 'expo-router';
import { AuthProvider } from './AuthContext';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function Layout() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <View style={{ flex: 1, backgroundColor: '#F8F8F8' }}>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#F8F8F8',
            },
            headerTintColor: '#333',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            contentStyle: {
              backgroundColor: '#F8F8F8',
            },
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen 
            name="choose-login-type" 
            options={{ 
              headerShown: false,
            }} 
          />
          <Stack.Screen 
            name="login" 
            options={{ 
              headerShown: false,
            }} 
          />
          <Stack.Screen 
            name="register-company" 
            options={{ 
              headerShown: false,
            }} 
          />
          <Stack.Screen 
            name="register-client" 
            options={{ 
              headerShown: false,
            }} 
          />
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
        </Stack>
      </View>
    </AuthProvider>
  );
}