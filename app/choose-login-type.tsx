import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function ChooseLoginType() {
  const handleChooseType = (type: 'user' | 'client') => {
    router.push({
      pathname: '/login',
      params: { type }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escolha o tipo de login</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleChooseType('user')}
      >
        <Text style={styles.buttonText}>Logar como Empresa</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleChooseType('client')}
      >
        <Text style={styles.buttonText}>Logar como Cliente</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});