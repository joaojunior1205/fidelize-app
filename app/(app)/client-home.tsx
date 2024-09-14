import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../AuthContext';
import QRCode from 'react-native-qrcode-svg';

export default function ClientHomeScreen() {
  const { userInfo } = useAuth();
  const [showQRCode, setShowQRCode] = useState(false);

  const handleGenerateQRCode = () => {
    setShowQRCode(true);
  };

  const qrData = JSON.stringify({
    id: userInfo?.id,
    name: userInfo?.name
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo, {userInfo?.name}</Text>
      {showQRCode ? (
        <View style={styles.qrContainer}>
          <QRCode
            value={qrData}
            size={200}
          />
          <Text style={styles.instruction}>Mostre este QR Code para a empresa</Text>
        </View>
      ) : (
        <Button title="Gerar QR Code" onPress={handleGenerateQRCode} />
      )}
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
  qrContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  instruction: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
});