import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../../AuthContext';
import QRCode from 'react-native-qrcode-svg';
import { useNavigation, useRoute } from '@react-navigation/native';
import config from "../../../config";
import * as Crypto from 'expo-crypto';

type LoyaltyCard = {
  id: string;
  goal: number;
  client_id: number;
  company_id: number;
  company: {
    id: number;
    name: string;
    cnpj: string;
    active: boolean;
    created_at: string;
    updated_at: string;
  };
  checks: any[];
  _count: {
    checks: number;
  };
};

export default function ClientHomeScreen() {
  const { userInfo } = useAuth();
  const [showQRCode, setShowQRCode] = useState(false);
  const [loyaltyCards, setLoyaltyCards] = useState<LoyaltyCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<LoyaltyCard | null>(null);
  const navigation = useNavigation();
  const route = useRoute();
  const [qrData, setQrData] = useState('');

  useEffect(() => {
    fetchLoyaltyCards();
  }, []);

  useEffect(() => {
    if (route.params?.showQRCode) {
      setShowQRCode(true);
      navigation.setParams({ showQRCode: undefined });
    }
  }, [route.params?.showQRCode]);

  const fetchLoyaltyCards = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/card/cards?client_id=${userInfo?.id}`);
      const data = await response.json();
      if (data.success) {
        setLoyaltyCards(data.data);
      } else {
        console.error('Failed to fetch loyalty cards:', data.message);
      }
    } catch (error) {
      console.error('Error fetching loyalty cards:', error);
    }
  };

  const toggleQRCode = (card: LoyaltyCard | null = null) => {
    if (card) {
      setSelectedCard(card);
      setShowQRCode(true);
    } else {
      setSelectedCard(null);
      setShowQRCode(false);
    }
  };

  const renderLoyaltyCard = (card: LoyaltyCard) => (
    <TouchableOpacity key={card.id} style={styles.loyaltyCard} onPress={() => toggleQRCode(card)}>
      <Text style={styles.companyName}>{card.company.name}</Text>
      <View style={styles.cardInfo}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(card._count.checks / card.goal) * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>{`${card._count.checks}/${card.goal}`}</Text>
      </View>
    </TouchableOpacity>
  );

  const generateToken = async () => {
    if (!selectedCard) return '';

    const payload = {
      client_id: userInfo?.id,
      client_name: userInfo?.name,
      card_id: selectedCard.id,
      company_id: selectedCard.company_id,
      timestamp: new Date().getTime()
    };

    const payloadString = JSON.stringify(payload);
    const signature = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      payloadString + config.jwtSecret
    );

    const token = JSON.stringify({
      payload: payload,
      signature: signature
    });

    console.log('QR Code gerado com o seguinte conteúdo:', token);

    return token;
  };

  useEffect(() => {
    if (showQRCode && selectedCard) {
      generateToken().then(token => setQrData(token));
    }
  }, [showQRCode, selectedCard]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loyaltyCards.map(renderLoyaltyCard)}
      </ScrollView>
      
      <Modal
        animationType="fade"
        transparent={true}
        visible={showQRCode}
        onRequestClose={() => toggleQRCode()}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {qrData ? (
              <QRCode
                value={qrData}
                size={200}
              />
            ) : (
              <Text>Gerando QR Code...</Text>
            )}
            <Text style={styles.instruction}>Mostre este QR Code para a empresa</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => toggleQRCode()}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
  },
  loyaltyCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardInfo: {
    flex: 1,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#555',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  instruction: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});