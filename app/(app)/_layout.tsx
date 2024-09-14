import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { useAuth } from '../AuthContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function AppLayout() {
  const { userInfo } = useAuth();

  if (!userInfo) {
    return null; // or redirect to login
  }

  return (
    <SafeAreaProvider>
      <Drawer>
        {userInfo.type === 'client' ? (
          <Drawer.Screen name="client" options={{ headerShown: false }} />
        ) : (
          <Drawer.Screen name="company" options={{ headerShown: false }} />
        )}
      </Drawer>
    </SafeAreaProvider>
  );
}