import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Platform } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ChooseLoginType() {
  const handleAction = (action: 'login' | 'register', type: 'user' | 'client') => {
    if (action === 'login') {
      router.push({
        pathname: '/login',
        params: { type }
      });
    } else if (type === 'user') {
      router.push('/register-company');
    } else {
      router.push('/register-client');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Fidelize</Text>
        <Text style={styles.subtitle}>Escolha uma opção</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Empresa</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleAction('login', 'user')}
          >
            <Ionicons name="business-outline" size={24} color="#007AFF" style={styles.icon} />
            <View style={styles.buttonTextContainer}>
              <Text style={styles.buttonText}>Entrar como Empresa</Text>
              <Text style={styles.buttonSubtext}>Gerencie seus clientes e promoções</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={24} color="#007AFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => handleAction('register', 'user')}
          >
            <Ionicons name="add-circle-outline" size={24} color="#007AFF" style={styles.icon} />
            <View style={styles.buttonTextContainer}>
              <Text style={styles.buttonText}>Cadastrar Empresa</Text>
              <Text style={styles.buttonSubtext}>Crie uma nova conta para sua empresa</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cliente</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleAction('login', 'client')}
          >
            <Ionicons name="person-outline" size={24} color="#007AFF" style={styles.icon} />
            <View style={styles.buttonTextContainer}>
              <Text style={styles.buttonText}>Entrar como Cliente</Text>
              <Text style={styles.buttonSubtext}>Acesse seus cartões de fidelidade</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={24} color="#007AFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => handleAction('register', 'client')}
          >
            <Ionicons name="person-add-outline" size={24} color="#007AFF" style={styles.icon} />
            <View style={styles.buttonTextContainer}>
              <Text style={styles.buttonText}>Cadastrar Cliente</Text>
              <Text style={styles.buttonSubtext}>Crie uma nova conta de cliente</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    marginTop: Platform.OS === 'android' ? 40 : 0,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    marginRight: 16,
  },
  buttonTextContainer: {
    flex: 1,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  buttonSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});