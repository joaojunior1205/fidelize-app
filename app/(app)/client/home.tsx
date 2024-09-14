import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useAuth } from '../../AuthContext';
import QRCode from 'react-native-qrcode-svg';
import { useNavigation, useRoute } from '@react-navigation/native';

type LoyaltyCard = {
  id: string;
  name: string;
  goal: number;
  company_name: string;
  company_logo: string;
  _count: {
    checks: number;
  };
};

export default function ClientHomeScreen() {
  const { userInfo } = useAuth();
  const [showQRCode, setShowQRCode] = useState(false);
  const [loyaltyCards, setLoyaltyCards] = useState<LoyaltyCard[]>([]);
  const navigation = useNavigation();
  const route = useRoute();

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
      const response = await fetch(`http://192.168.1.77:9001/api/card/cards?client_id=${userInfo?.id}`);
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

  const toggleQRCode = () => {
    setShowQRCode(prev => !prev);
  };

  const renderLoyaltyCard = (card: LoyaltyCard) => (
    <View key={card.id} style={styles.loyaltyCard}>
      <Image source={{ uri: card.company_logo }} style={styles.companyLogo} />
      <View style={styles.cardInfo}>
        <Text style={styles.companyName}>{card.company_name}</Text>
        <Text style={styles.cardName}>{card.name}</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(card._count.checks / card.goal) * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>{`${card._count.checks}/${card.goal}`}</Text>
      </View>
    </View>
  );

  const qrData = JSON.stringify({
    id: userInfo?.id,
    name: userInfo?.name
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loyaltyCards.map(renderLoyaltyCard)}
      </ScrollView>
      
      <Modal
        animationType="fade"
        transparent={true}
        visible={showQRCode}
        onRequestClose={toggleQRCode}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <QRCode
              value={qrData}
              size={200}
            />
            <Text style={styles.instruction}>Mostre este QR Code para a empresa</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={toggleQRCode}
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
    flexDirection: 'row',
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
  companyLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  cardInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardName: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
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