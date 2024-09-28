import React, {useEffect} from "react";
import {View, Text} from "react-native";
import {Redirect} from 'expo-router';
import {useAuth} from './AuthContext';

export default function Index() {
    const {isAuthenticated, checkAuthStatus} = useAuth();

    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        checkAuthStatus()
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <View><Text>Carregando...</Text></View>
    } else if (isAuthenticated) {
        return <Redirect href={'/(app)/home'}/>;
    } else {
        return <Redirect href="/choose-login-type"/>;
    }
}
