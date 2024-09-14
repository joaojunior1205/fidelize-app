import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../AuthContext';
import { BarCodeScanner } from 'expo-barcode-scanner';

type BarCodeEvent = {
  type: string;
  data: string;
};

type ClientData = {
  id: string;
  name: string;
};

export default function CompanyHomeScreen() {
  const { userInfo } = useAuth();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }: BarCodeEvent) => {
    setScanned(true);
    try {
      const scannedData: ClientData = JSON.parse(data);
      console.log('Cliente escaneado:', scannedData);
      alert(`Cliente escaneado: ${scannedData.name} (ID: ${scannedData.id})`);
    } catch (error) {
      console.error('Erro ao processar QR Code:', error);
      alert('QR Code inválido');
    }
  };

  if (hasPermission === null) {
    return <Text>Solicitando permissão de câmera</Text>;
  }
  if (hasPermission === false) {
    return <Text>Sem acesso à câmera</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo, {userInfo?.name}</Text>
      <View style={styles.scannerContainer}>
        {hasPermission && (
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
        )}
      </View>
      {scanned && <Button title={'Escanear novamente'} onPress={() => setScanned(false)} />}
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
  scannerContainer: {
    width: 300,
    height: 300,
    overflow: 'hidden',
    marginVertical: 20,
  },
});