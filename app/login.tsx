import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, Alert, Switch, ActivityIndicator, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from './AuthContext';
import { Ionicons } from '@expo/vector-icons';
import config from '../config';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberEmail, setRememberEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, rememberedEmail } = useAuth();
  const { type } = useLocalSearchParams<{ type: string }>();

  useEffect(() => {
    const loadRememberedEmail = async () => {
      const remembered = await rememberedEmail(type as 'user' | 'client');
      if (remembered) {
        setEmail(remembered);
        setRememberEmail(true);
      }
    };
    loadRememberedEmail();
  }, [type, rememberedEmail]);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const endpoint = type === 'user' ? '/auth/login-user' : '/auth/login-client';
      const response = await fetch(`${config.apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name: type === 'user' ? 'Nome da Empresa' : undefined, // Adicione o nome apenas para login de usuário (empresa)
        }),
      });

      if (!response.ok) {
        throw new Error('Falha na autenticação');
      }

      const data = await response.json();

      if (data.success && data.data && data.data.token) {
        await login(email, password, type as 'user' | 'client', rememberEmail);
        if (type === 'client') {
          router.replace('/(app)/client');
        } else {
          router.replace('/(app)/company');
        }
      } else {
        throw new Error('Token não encontrado na resposta');
      }
    } catch (error) {
      console.error('Login failed:', error);
      Alert.alert('Erro de Login', `Falha ao fazer login: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Fidelize</Text>
        <Text style={styles.subtitle}>Entrar como {type === 'user' ? 'Empresa' : 'Cliente'}</Text>
        
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={24} color="#007AFF" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={24} color="#007AFF" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.rememberContainer}>
          <Switch
            value={rememberEmail}
            onValueChange={setRememberEmail}
            trackColor={{ false: "#767577", true: "#007AFF" }}
            thumbColor={rememberEmail ? "#f4f3f4" : "#f4f3f4"}
          />
          <Text style={styles.rememberText}>Lembrar e-mail</Text>
        </View>

        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <View style={styles.loginButtonContent}>
              <Text style={styles.loginButtonText}>Entrar</Text>
              <Ionicons name="arrow-forward-outline" size={24} color="#ffffff" />
            </View>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  content: {
    padding: 24,
    justifyContent: 'center',
    minHeight: '100%',
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 8,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  rememberText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  loginButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  loginButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});