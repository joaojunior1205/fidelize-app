import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, Alert, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import config from '../config';

export default function RegisterClientScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const validateName = (value: string) => {
    if (value.trim().length < 3) {
      setErrors(prev => ({ ...prev, name: 'Nome deve ter pelo menos 3 caracteres' }));
    } else {
      setErrors(prev => ({ ...prev, name: '' }));
    }
  };

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setErrors(prev => ({ ...prev, email: 'E-mail inválido' }));
    } else {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  const validatePassword = (value: string) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{6,})/;
    if (!passwordRegex.test(value)) {
      setErrors(prev => ({ ...prev, password: 'A senha deve ter no mínimo 6 caracteres, uma letra maiúscula e um caractere especial' }));
    } else {
      setErrors(prev => ({ ...prev, password: '' }));
    }
  };

  const validateConfirmPassword = (value: string) => {
    if (value !== password) {
      setErrors(prev => ({ ...prev, confirmPassword: 'As senhas não coincidem' }));
    } else {
      setErrors(prev => ({ ...prev, confirmPassword: '' }));
    }
  };

  const handleRegister = async () => {
    if (Object.values(errors).some(error => error !== '')) {
      Alert.alert('Erro', 'Por favor, corrija os erros antes de prosseguir.');
      return;
    }

    const formData = {
      name,
      email,
      password,
    };

    console.log('Dados do formulário:', JSON.stringify(formData, null, 2));

    setIsLoading(true);
    try {
      const response = await fetch(`${config.apiUrl}/auth/register-client`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Sucesso', 'Cliente cadastrado com sucesso!', [
          { text: 'OK', onPress: () => router.replace('/login?type=client') }
        ]);
      } else {
        Alert.alert('Erro', data.message || 'Ocorreu um erro ao cadastrar o cliente.');
      }
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao cadastrar o cliente. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderErrorMessage = (message: string) => (
    message ? (
      <View style={styles.errorContainer}>
        <Ionicons name="information-circle-outline" size={16} color="red" />
        <Text style={styles.errorText}>{message}</Text>
      </View>
    ) : null
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>

        <Text style={styles.title}>Fidelize</Text>
        <Text style={styles.subtitle}>Cadastro de Cliente</Text>
        
        <View style={[styles.inputContainer, errors.name ? styles.inputError : null]}>
          <Ionicons name="person-outline" size={24} color="#007AFF" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Nome"
            value={name}
            onChangeText={(value) => {
              setName(value);
              validateName(value);
            }}
          />
        </View>
        {renderErrorMessage(errors.name)}

        <View style={[styles.inputContainer, errors.email ? styles.inputError : null]}>
          <Ionicons name="mail-outline" size={24} color="#007AFF" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              validateEmail(value);
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        {renderErrorMessage(errors.email)}

        <View style={[styles.inputContainer, errors.password ? styles.inputError : null]}>
          <Ionicons name="lock-closed-outline" size={24} color="#007AFF" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            value={password}
            onChangeText={(value) => {
              setPassword(value);
              validatePassword(value);
            }}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
        {renderErrorMessage(errors.password)}

        <View style={[styles.inputContainer, errors.confirmPassword ? styles.inputError : null]}>
          <Ionicons name="lock-closed-outline" size={24} color="#007AFF" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Confirmar Senha"
            value={confirmPassword}
            onChangeText={(value) => {
              setConfirmPassword(value);
              validateConfirmPassword(value);
            }}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
            <Ionicons name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
        {renderErrorMessage(errors.confirmPassword)}

        <TouchableOpacity 
          style={styles.registerButton} 
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <View style={styles.registerButtonContent}>
              <Text style={styles.registerButtonText}>Cadastrar</Text>
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
  },
  backButton: {
    marginBottom: 20,
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
  registerButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  registerButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  errorText: {
    color: 'red',
    marginLeft: 4,
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
});