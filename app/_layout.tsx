import {Stack} from 'expo-router';
import {AuthProvider} from './AuthContext';
import {Platform, View} from 'react-native';
import React from "react";
import {StatusBar} from "expo-status-bar";

export default function Layout() {
    return (
        <AuthProvider>
            <View style={{flex: 1, backgroundColor: '#F8F8F8'}}>
                <Stack screenOptions={{statusBarStyle: Platform.OS === "android" ? "dark" : undefined}}>
                    <Stack.Screen name="index" options={{headerShown: false}}/>
                    <Stack.Screen name="choose-login-type" options={{headerShown: false,}}/>
                    <Stack.Screen name="login" options={{headerShown: false,}}/>
                    <Stack.Screen name="register" options={{headerShown: false,}}/>
                    <Stack.Screen name="(app)" options={{headerShown: false}}/>
                </Stack>
            </View>
        </AuthProvider>
    );
}