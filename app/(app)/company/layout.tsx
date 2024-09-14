import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function LayoutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Layout da Empresa</Text>
      {/* Adicione aqui o conteúdo da tela de layout */}
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
    marginBottom: 20,
  },
});