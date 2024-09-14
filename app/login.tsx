import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert, Switch, ActivityIndicator, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from './AuthContext';
import { Ionicons } from '@expo/vector-icons';

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
      await login(email, password, type as 'user' | 'client', rememberEmail);
      if (type === 'client') {
        router.replace('/(app)/client');
      } else {
        router.replace('/(app)/company');
      }
    } catch (error) {
      console.error('Login failed:', error);
      Alert.alert('Erro de Login', `Falha ao fazer login: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login {type === 'user' ? 'Empresa' : 'Cliente'}</Text>
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
          <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="gray" />
        </TouchableOpacity>
      </View>
      <View style={styles.rememberContainer}>
        <Switch
          value={rememberEmail}
          onValueChange={setRememberEmail}
        />
        <Text>Lembrar e-mail</Text>
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <Button title="Entrar" onPress={handleLogin} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  eyeIcon: {
    padding: 10,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
});