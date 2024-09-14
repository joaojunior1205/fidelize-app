import React from 'react';
import { Drawer } from 'expo-router/drawer';
import Header from '../../components/Header';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../AuthContext';
import { Alert, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { router } from 'expo-router';

function CustomDrawerContent(props) {
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Sair",
      "Tem certeza que deseja sair?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        { 
          text: "Sim", 
          onPress: async () => {
            await logout();
            router.replace('/choose-login-type');
          }
        }
      ]
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Ionicons name="log-out" size={24} color="#333" />
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function CompanyLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        header: ({ route }) => (
          <Header title={route.name === 'home' ? 'Fidelize' : route.name} />
        ),
        drawerActiveTintColor: '#007AFF',
        drawerInactiveTintColor: '#333',
      }}
    >
      <Drawer.Screen 
        name="home" 
        options={{ 
          drawerLabel: 'Fidelize',
          title: 'Fidelize',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }} 
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
});