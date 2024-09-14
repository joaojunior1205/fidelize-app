import React, {useState, useEffect} from 'react';
import {View, StyleSheet, ScrollView, Text, TouchableOpacity, Modal, ActivityIndicator, Dimensions} from 'react-native';
import {useAuth} from '../../AuthContext';
import config from "../../../config";
import QRCode from 'react-native-qrcode-svg';
import * as Crypto from 'expo-crypto';
import {Ionicons} from '@expo/vector-icons';

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

const MODAL_SIZE = 300; // Tamanho fixo para todos os modais

const QR_CODE_SIZE = Math.min(Dimensions.get('window').width * 0.8, 300);

const VERTICAL_SPACING = 20; // Definindo um espaçamento vertical padrão

export default function ClientHomeScreen() {
    const {userInfo} = useAuth();
    const [loyaltyCards, setLoyaltyCards] = useState<LoyaltyCard[]>([]);
    const [selectedCard, setSelectedCard] = useState<LoyaltyCard | null>(null);
    const [showQRCode, setShowQRCode] = useState(false);
    const [qrCodeData, setQRCodeData] = useState<string | null>(null);
    const [showAddCardQRCode, setShowAddCardQRCode] = useState(false);
    const [addCardQRCodeData, setAddCardQRCodeData] = useState<string | null>(null);

    useEffect(() => {
        fetchLoyaltyCards();
    }, []);

    useEffect(() => {
        if (selectedCard) {
            generateQRCodeData(selectedCard);
        }
    }, [selectedCard]);

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

    const generateQRCodeData = async (card: LoyaltyCard) => {
        const payload = {
            client_id: userInfo?.id,
            client_name: userInfo?.name,
            card_id: card.id,
            company_id: card.company_id,
            timestamp: new Date().getTime()
        };

        const payloadString = JSON.stringify(payload);
        const signature = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            payloadString + config.jwtSecret
        );

        const data = JSON.stringify({
            payload: payload,
            signature: signature
        });

        setQRCodeData(data);
    };

    const generateAddCardQRCodeData = async () => {
        const payload = {
            client_id: userInfo?.id,
            client_name: userInfo?.name,
            type: 'add_card_request',
            timestamp: new Date().getTime()
        };

        const payloadString = JSON.stringify(payload);
        const signature = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            payloadString + config.jwtSecret
        );

        const data = JSON.stringify({
            payload: payload,
            signature: signature
        });

        setAddCardQRCodeData(data);
    };

    const openAddCardQRCode = () => {
        setShowAddCardQRCode(true);
        generateAddCardQRCodeData();
    };

    const closeAddCardModal = () => {
        setShowAddCardQRCode(false);
        setAddCardQRCodeData(null);
        fetchLoyaltyCards(); // Atualiza a listagem de cartões ao fechar o modal de adicionar cartão
    };

    const renderLoyaltyCard = (card: LoyaltyCard) => (
        <TouchableOpacity
            key={card.id}
            style={styles.loyaltyCard}
            onPress={() => {
                setSelectedCard(card);
                setShowQRCode(true);
                setQRCodeData(null); // Reset QR code data
            }}
        >
            <Text style={styles.companyName}>{card.company.name}</Text>
            <View style={styles.cardInfo}>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, {width: `${(card._count.checks / card.goal) * 100}%`}]}/>
                </View>
                <Text style={styles.progressText}>{`${card._count.checks}/${card.goal}`}</Text>
            </View>
        </TouchableOpacity>
    );

    const closeModal = () => {
        setShowQRCode(false);
        setSelectedCard(null);
        setQRCodeData(null);
        fetchLoyaltyCards(); // Atualiza a listagem de cartões ao fechar o modal
    };

    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <TouchableOpacity style={styles.addCardButton} onPress={openAddCardQRCode}>
                    <Ionicons name="add-circle-outline" size={24} color="#007AFF"/>
                    <Text style={styles.addCardButtonText}>Adicionar cartão de visita</Text>
                </TouchableOpacity>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {loyaltyCards.map(renderLoyaltyCard)}
                </ScrollView>
            </View>

            {/* Modal para QR Code de cartões existentes */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={showQRCode}
                onRequestClose={closeModal}
            >
                <TouchableOpacity
                    style={styles.modalContainer}
                    activeOpacity={1}
                    onPress={closeModal}
                >
                    <View style={styles.modalContent}>
                        <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
                            {qrCodeData ? (
                                <QRCode
                                    value={qrCodeData}
                                    size={QR_CODE_SIZE}
                                />
                            ) : (
                                <ActivityIndicator size="large" color="#007AFF"/>
                            )}
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Novo Modal para QR Code de adicionar cartão */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={showAddCardQRCode}
                onRequestClose={closeAddCardModal}
            >
                <TouchableOpacity
                    style={styles.modalContainer}
                    activeOpacity={1}
                    onPress={closeAddCardModal}
                >
                    <View style={styles.modalContent}>
                        <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
                            {addCardQRCodeData ? (
                                <QRCode
                                    value={addCardQRCodeData}
                                    size={QR_CODE_SIZE}
                                />
                            ) : (
                                <ActivityIndicator size="large" color="#007AFF"/>
                            )}
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 16, // Padding horizontal consistente
        paddingTop: VERTICAL_SPACING, // Usando o espaçamento vertical padrão
    },
    scrollContent: {
        paddingTop: VERTICAL_SPACING, // Usando o espaçamento vertical padrão
    },
    loyaltyCard: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 16,
        marginBottom: VERTICAL_SPACING, // Usando o espaçamento vertical padrão
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
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
        justifyContent: 'center',
        maxWidth: '90%',
        maxHeight: '90%',
    },
    loadingContainer: {
        width: MODAL_SIZE,
        height: MODAL_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#007AFF',
        borderRadius: 5,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
    },
    addCardButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 10,
        marginBottom: VERTICAL_SPACING, // Usando o espaçamento vertical padrão
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    addCardButtonText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#007AFF',
    },
});