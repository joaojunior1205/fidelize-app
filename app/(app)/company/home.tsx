import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useAuth } from '../../AuthContext';
import { BarCodeScanner } from 'expo-barcode-scanner';
import FeatureCard from '../../components/FeatureCard';

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
  const [showScanner, setShowScanner] = useState(false);
  const [scannerMode, setScannerMode] = useState<'visit' | 'loyalty'>('visit');

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }: BarCodeEvent) => {
    setScanned(true);
    setShowScanner(false);
    try {
      const scannedData: ClientData = JSON.parse(data);
      console.log('Cliente escaneado:', scannedData);
      if (scannerMode === 'visit') {
        Alert.alert('Visita Confirmada', `Cliente: ${scannedData.name} (ID: ${scannedData.id})`);
      } else {
        Alert.alert('Cartão Fidelidade Gerado', `Para o cliente: ${scannedData.name} (ID: ${scannedData.id})`);
      }
    } catch (error) {
      console.error('Erro ao processar QR Code:', error);
      Alert.alert('Erro', 'QR Code inválido');
    }
  };

  const openScanner = (mode: 'visit' | 'loyalty') => {
    setScannerMode(mode);
    setShowScanner(true);
    setScanned(false);
  };

  if (hasPermission === null) {
    return <Text>Solicitando permissão de câmera</Text>;
  }
  if (hasPermission === false) {
    return <Text>Sem acesso à câmera</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.cardContainer}>
        <FeatureCard
          icon="checkmark-circle-outline"
          title="Confirmar Visita"
          onPress={() => openScanner('visit')}
        />
        <FeatureCard
          icon="card-outline"
          title="Gerar Cartão Fidelidade"
          onPress={() => openScanner('loyalty')}
        />
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={showScanner}
        onRequestClose={() => setShowScanner(false)}
      >
        <View style={styles.modalContainer}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.overlay}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setShowScanner(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
    marginBottom: 50,
  },
  cancelButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});