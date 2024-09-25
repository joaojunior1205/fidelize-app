import React, {useState, useEffect} from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    Text,
    Switch,
    ActivityIndicator,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Platform
} from 'react-native';
import {router, useLocalSearchParams} from 'expo-router';
import {useAuth} from './AuthContext';
import {Ionicons} from '@expo/vector-icons';
import UserApi from "@/api/auth/user-api";

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberEmail, setRememberEmail] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const {login, rememberedEmail} = useAuth();

    useEffect(() => {
        loadRememberedEmail();
    }, [rememberedEmail]);

    const loadRememberedEmail = async () => {
        const remembered = await rememberedEmail();

        if (remembered) {
            setEmail(remembered);
            setRememberEmail(true);
        }
    };

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            const userApi = new UserApi();

            const auth = await userApi.doLogin(email, password);

            if (auth?.data?.tokens) {
                await login(auth, rememberEmail, email);

                router.replace('/(app)/home');
            }
        } catch (error) {
            console.error('Login failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const goBack = () => {
        router.back();
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <TouchableOpacity style={styles.backButton} onPress={goBack}>
                    <Ionicons name="arrow-back" size={24} color="#007AFF"/>
                </TouchableOpacity>

                <Text style={styles.title}>Fidelize</Text>

                <View style={styles.inputContainer}>
                    <Ionicons name="mail-outline" size={24} color="#007AFF" style={styles.inputIcon}/>
                    <TextInput
                        style={styles.input}
                        placeholder="E-mail"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={24} color="#007AFF" style={styles.inputIcon}/>
                    <TextInput
                        style={styles.input}
                        placeholder="Senha"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                        <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={24} color="#007AFF"/>
                    </TouchableOpacity>
                </View>

                <View style={styles.rememberContainer}>
                    <Switch
                        value={rememberEmail}
                        onValueChange={setRememberEmail}
                        trackColor={{false: "#767577", true: "#007AFF"}}
                        thumbColor={rememberEmail ? "#f4f3f4" : "#f4f3f4"}
                    />
                    <Text style={styles.rememberText}>Lembrar e-mail</Text>
                </View>

                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={handleLogin}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#ffffff"/>
                    ) : (
                        <View style={styles.loginButtonContent}>
                            <Text style={styles.loginButtonText}>Entrar</Text>
                            <Ionicons name="arrow-forward-outline" size={24} color="#ffffff"/>
                        </View>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
        marginTop: Platform.OS === 'android' ? 40 : 0,

    },
    content: {
        padding: 24,
    },
    backButton: {
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
        marginBottom: 32,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 16,
        paddingHorizontal: 16,
        height: 50,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
    },
    eyeIcon: {
        padding: 8,
    },
    rememberContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    rememberText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#666',
    },
    loginButton: {
        backgroundColor: '#007AFF',
        borderRadius: 12,
        height: 50,
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    loginButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});