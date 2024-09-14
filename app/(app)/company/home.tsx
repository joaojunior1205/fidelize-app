import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useAuth } from '../../AuthContext';
import { BarCodeScanner } from 'expo-barcode-scanner';
import FeatureCard from '../../components/FeatureCard';
import * as Crypto from 'expo-crypto';
import config from "../../../config";

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

  const handleBarCodeScanned = async ({ type, data }: BarCodeEvent) => {
    console.log('Iniciando o escaneamento do QR Code...'); // Log antes do escaneamento

    setScanned(true);
    setShowScanner(false);
    try {
      console.log('QR Code escaneado. Dados brutos:', data); // Log dos dados brutos escaneados

      const scannedData = JSON.parse(data);
      console.log('Dados do QR Code parseados:', scannedData); // Log dos dados parseados

      const { payload, signature } = scannedData;

      console.log('Payload:', payload); // Log do payload
      console.log('Assinatura:', signature); // Log da assinatura

      // Verificar a assinatura
      const payloadString = JSON.stringify(payload);
      const calculatedSignature = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        payloadString + config.jwtSecret
      );

      console.log('Assinatura calculada:', calculatedSignature); // Log da assinatura calculada

      if (calculatedSignature !== signature) {
        console.log('Assinatura inválida'); // Log se a assinatura for inválida
        throw new Error('Assinatura inválida');
      }

      console.log('Assinatura válida. Processando dados do cliente...'); // Log se a assinatura for válida

      if (scannerMode === 'visit') {
        console.log('Modo: Confirmação de visita');
        Alert.alert('Visita Confirmada', `Cliente: ${payload.client_name} (ID: ${payload.client_id})`);
      } else {
        console.log('Modo: Geração de cartão fidelidade');
        Alert.alert('Cartão Fidelidade Gerado', `Para o cliente: ${payload.client_name} (ID: ${payload.client_id})`);
      }
    } catch (error) {
      console.error('Erro ao processar QR Code:', error);
      Alert.alert('Erro', 'QR Code inválido ou assinatura incorreta');
    }

    console.log('Processamento do QR Code concluído.'); // Log após o processamento completo
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