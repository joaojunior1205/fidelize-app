import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    ScrollView,
    Alert,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions
} from 'react-native';
import {useAuth} from '../../AuthContext';
import {BarCodeScanner} from 'expo-barcode-scanner';
import FeatureCard from '../../components/FeatureCard';
import * as Crypto from 'expo-crypto';
import config from "../../../config";

type BarCodeEvent = {
    type: string;
    data: string;
};

const SCANNER_SIZE = Math.min(Dimensions.get('window').width * 0.9, 350);

export default function CompanyHomeScreen() {
    const {userInfo} = useAuth();
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    const [scannerMode, setScannerMode] = useState<'visit' | 'loyalty'>('visit');
    const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'processing' | 'error'>('idle');

    useEffect(() => {
        (async () => {
            const {status} = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = async ({type, data}: BarCodeEvent) => {
        setScanStatus('scanning');
        console.log('QR Code escaneado... processando...');

        setScanned(true);
        setScanStatus('processing');

        try {
            console.log('QR Code escaneado. Dados brutos:', data);

            const scannedData = JSON.parse(data);
            console.log('Dados do QR Code parseados:', scannedData);

            const {payload, signature} = scannedData;

            console.log('Payload:', payload);
            console.log('Assinatura:', signature);

            const payloadString = JSON.stringify(payload);

            const calculatedSignature = await Crypto.digestStringAsync(
                Crypto.CryptoDigestAlgorithm.SHA256,
                payloadString + config.jwtSecret
            );


            if (calculatedSignature !== signature) {
                throw new Error('Assinatura inválida');
            }

            console.log('Assinatura válida. Processando dados do cliente...');

            if (scannerMode === 'visit' && !payload.type) {
                console.log('Modo: Confirmação de visita');
                Alert.alert('Visita autenticada com sucesso!', `Cliente: ${payload.client_name} (ID: ${payload.client_id})`, [{text: 'OK'}], {cancelable: true});
            } else if (scannerMode === 'loyalty' && payload.type === 'add_card_request') {
                console.log('Modo: Geração de novo cartão fidelidade');
                Alert.alert('Novo cartão Autnticado com sucesso!', `Cliente: ${payload.client_name} (ID: ${payload.client_id})`, [{text: 'OK'}], {cancelable: true});
            } else {
                setTimeout(() => closeModal(), 500);
                throw new Error('QR Code não compatível com a operação selecionada');
            }

            setTimeout(() => closeModal(), 500);
        } catch (error) {
            console.error('Erro ao processar QR Code:', error);
            setScanStatus('error');
            Alert.alert('Erro', 'QR Code inválido ou não compatível com a operação selecionada', [
                {
                    text: 'OK', onPress: () => {
                        setTimeout(() => {
                            closeModal();
                        }, 2000); // Fecha o modal após 2 segundos
                    }
                }
            ]);
        }

        console.log('Processamento do QR Code concluído.');
        setScanStatus('idle');
    };

    const openScanner = (mode: 'visit' | 'loyalty') => {
        setScannerMode(mode);
        setShowScanner(true);
        setScanned(false);
        setScanStatus('idle');
    };

    const closeModal = () => {
        setShowScanner(false);
        setScanStatus('idle');
        setScanned(false);
    };

    const renderScannerContent = () => {
        switch (scanStatus) {
            case 'scanning':
            case 'processing':
                return (
                    <View style={styles.scanningOverlay}>
                        <ActivityIndicator size="large" color="#fff"/>
                        <Text style={styles.scanningText}>
                            {scanStatus === 'scanning' ? 'Escaneando QR Code...' : 'Processando...'}
                        </Text>
                    </View>
                );
            case 'error':
                return (
                    <View style={styles.scanningOverlay}>
                        <Text style={styles.errorText}>QR Code inválido ou não compatível</Text>
                    </View>
                );
            default:
                return null;
        }
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
                    title="Autenticar visita"
                    onPress={() => openScanner('visit')}
                />
                <FeatureCard
                    icon="card-outline"
                    title="Autenticar cartão fidelidade"
                    onPress={() => openScanner('loyalty')}
                />
            </View>
            <Modal
                animationType="fade"
                transparent={true}
                visible={showScanner}
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={[styles.scannerContainer, {width: SCANNER_SIZE, height: SCANNER_SIZE}]}>
                            {showScanner && (
                                <BarCodeScanner
                                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                                    style={StyleSheet.absoluteFillObject}
                                />
                            )}
                            {renderScannerContent()}
                        </View>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={closeModal}
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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        alignItems: 'center',
    },
    scannerContainer: {
        overflow: 'hidden',
    },
    cancelButton: {
        marginTop: 20,
        backgroundColor: 'white',
        padding: 15,
        alignItems: 'center',
        width: '50%', // Alterado para 50%
        alignSelf: 'center', // Centraliza o botão
    },
    cancelButtonText: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
    },
    scanningOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanningText: {
        color: '#fff',
        fontSize: 18,
        marginTop: 20,
    },
    errorText: {
        color: '#ff0000',
        fontSize: 18,
        textAlign: 'center',
        padding: 20,
    },
});